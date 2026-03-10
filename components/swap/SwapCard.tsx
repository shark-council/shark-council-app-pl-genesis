"use client";

import { TokenSelector } from "@/components/swap/TokenSelector";
import { CONTRACTS, DEFAULT_FEE, TOKENS, type Token } from "@/lib/tokens";
import { ArrowDownUp, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { formatUnits, parseUnits } from "viem";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

// ── Minimal ABIs ────────────────────────────────────────────────────────────

const QUOTER_V2_ABI = [
  {
    name: "quoteExactInputSingle",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "params",
        type: "tuple",
        components: [
          { name: "tokenIn", type: "address" },
          { name: "tokenOut", type: "address" },
          { name: "amountIn", type: "uint256" },
          { name: "fee", type: "uint24" },
          { name: "sqrtPriceLimitX96", type: "uint160" },
        ],
      },
    ],
    outputs: [
      { name: "amountOut", type: "uint256" },
      { name: "sqrtPriceX96After", type: "uint160" },
      { name: "initializedTicksCrossed", type: "uint32" },
      { name: "gasEstimate", type: "uint256" },
    ],
  },
] as const;

const SWAP_ROUTER_ABI = [
  {
    name: "exactInputSingle",
    type: "function",
    stateMutability: "payable",
    inputs: [
      {
        name: "params",
        type: "tuple",
        components: [
          { name: "tokenIn", type: "address" },
          { name: "tokenOut", type: "address" },
          { name: "fee", type: "uint24" },
          { name: "recipient", type: "address" },
          { name: "amountIn", type: "uint256" },
          { name: "amountOutMinimum", type: "uint256" },
          { name: "sqrtPriceLimitX96", type: "uint160" },
        ],
      },
    ],
    outputs: [{ name: "amountOut", type: "uint256" }],
  },
] as const;

const ERC20_ABI = [
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

// ── Slippage ─────────────────────────────────────────────────────────────────

const SLIPPAGE_BPS = 50n; // 0.5 %

function applySlippage(amount: bigint): bigint {
  return (amount * (10000n - SLIPPAGE_BPS)) / 10000n;
}

// ── Component ────────────────────────────────────────────────────────────────

export function SwapCard() {
  const { address, isConnected } = useAccount();

  const [tokenIn, setTokenIn] = useState<Token>(TOKENS[0]);
  const [tokenOut, setTokenOut] = useState<Token>(TOKENS[2]);
  const [amountIn, setAmountIn] = useState("");
  const [step, setStep] = useState<"idle" | "approving" | "swapping">("idle");

  // ── Parse raw input ───────────────────────────────────────────────────────

  const parsedAmountIn = (() => {
    try {
      const v = parseUnits(amountIn || "0", tokenIn.decimals);
      return v > 0n ? v : undefined;
    } catch {
      return undefined;
    }
  })();

  // ── Quote ─────────────────────────────────────────────────────────────────

  const {
    data: quoteData,
    isPending: isQuotePending,
    isError: isQuoteError,
  } = useReadContract({
    address: CONTRACTS.quoterV2,
    abi: QUOTER_V2_ABI,
    functionName: "quoteExactInputSingle",
    args: parsedAmountIn
      ? [
          {
            tokenIn: tokenIn.address as `0x${string}`,
            tokenOut: tokenOut.address as `0x${string}`,
            amountIn: parsedAmountIn,
            fee: DEFAULT_FEE,
            sqrtPriceLimitX96: 0n,
          },
        ]
      : undefined,
    query: { enabled: !!parsedAmountIn },
  });

  const quotedAmountOut = quoteData?.[0];

  const formattedQuote =
    quotedAmountOut !== undefined
      ? formatUnits(quotedAmountOut, tokenOut.decimals)
      : "";

  // ── Allowance ─────────────────────────────────────────────────────────────

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: tokenIn.address as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: address ? [address, CONTRACTS.swapRouter02] : undefined,
    query: { enabled: !!address },
  });

  const needsApproval =
    parsedAmountIn !== undefined &&
    allowance !== undefined &&
    allowance < parsedAmountIn;

  // ── Write hooks ───────────────────────────────────────────────────────────

  const {
    writeContract,
    data: writeTxHash,
    isPending: isWritePending,
    reset: resetWrite,
  } = useWriteContract();

  const { isLoading: isTxPending, isSuccess: isTxSuccess } =
    useWaitForTransactionReceipt({ hash: writeTxHash });

  // After tx confirms, advance the step
  useEffect(() => {
    if (!isTxSuccess) return;
    if (step === "approving") {
      refetchAllowance();
      setStep("idle");
      resetWrite();
    } else if (step === "swapping") {
      setAmountIn("");
      setStep("idle");
      resetWrite();
    }
  }, [isTxSuccess, step, refetchAllowance, resetWrite]);

  // ── Actions ───────────────────────────────────────────────────────────────

  function handleApprove() {
    if (!parsedAmountIn) return;
    setStep("approving");
    writeContract({
      address: tokenIn.address as `0x${string}`,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [CONTRACTS.swapRouter02, parsedAmountIn],
    });
  }

  function handleSwap() {
    if (!parsedAmountIn || !quotedAmountOut || !address) return;
    setStep("swapping");
    writeContract({
      address: CONTRACTS.swapRouter02,
      abi: SWAP_ROUTER_ABI,
      functionName: "exactInputSingle",
      args: [
        {
          tokenIn: tokenIn.address as `0x${string}`,
          tokenOut: tokenOut.address as `0x${string}`,
          fee: DEFAULT_FEE,
          recipient: address,
          amountIn: parsedAmountIn,
          amountOutMinimum: applySlippage(quotedAmountOut),
          sqrtPriceLimitX96: 0n,
        },
      ],
    });
  }

  function flipTokens() {
    setTokenIn(tokenOut);
    setTokenOut(tokenIn);
    setAmountIn("");
  }

  // ── Derived UI state ──────────────────────────────────────────────────────

  const isBusy = isWritePending || isTxPending;

  const ctaLabel = (() => {
    if (!isConnected) return "Connect wallet";
    if (isBusy && step === "approving") return "Approving…";
    if (isBusy && step === "swapping") return "Swapping…";
    if (!parsedAmountIn) return "Enter amount";
    if (isQuotePending) return "Fetching quote…";
    if (isQuoteError) return "No route found";
    if (needsApproval) return `Approve ${tokenIn.symbol}`;
    return "Swap";
  })();

  const ctaDisabled =
    !isConnected || !parsedAmountIn || isQuotePending || isQuoteError || isBusy;

  function handleCta() {
    if (needsApproval) handleApprove();
    else handleSwap();
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl">
      <h2 className="mb-6 text-base font-semibold text-zinc-300">Swap</h2>

      {/* From */}
      <div className="rounded-xl bg-zinc-800 p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs text-zinc-400">From</span>
          <TokenSelector
            selected={tokenIn}
            onChange={(t) => {
              setTokenIn(t);
              setAmountIn("");
            }}
            exclude={tokenOut}
          />
        </div>
        <input
          type="number"
          min="0"
          placeholder="0.0"
          value={amountIn}
          onChange={(e) => setAmountIn(e.target.value)}
          className="w-full bg-transparent text-2xl font-semibold text-white outline-none placeholder:text-zinc-600"
        />
      </div>

      {/* Flip */}
      <div className="flex justify-center py-2">
        <button
          type="button"
          onClick={flipTokens}
          className="rounded-full bg-zinc-800 p-2 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors"
          aria-label="Flip tokens"
        >
          <ArrowDownUp className="h-4 w-4" />
        </button>
      </div>

      {/* To */}
      <div className="rounded-xl bg-zinc-800 p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs text-zinc-400">To (estimated)</span>
          <TokenSelector
            selected={tokenOut}
            onChange={setTokenOut}
            exclude={tokenIn}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-semibold text-white">
            {isQuotePending && parsedAmountIn ? (
              <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
            ) : (
              formattedQuote || <span className="text-zinc-600">0.0</span>
            )}
          </span>
        </div>
      </div>

      {/* Details */}
      {quotedAmountOut !== undefined && parsedAmountIn && !isQuoteError && (
        <div className="mt-3 rounded-lg bg-zinc-800/50 px-4 py-3 text-xs text-zinc-400 space-y-1">
          <div className="flex justify-between">
            <span>Fee tier</span>
            <span className="text-zinc-300">
              {(DEFAULT_FEE / 10000).toFixed(2)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span>Slippage tolerance</span>
            <span className="text-zinc-300">0.50%</span>
          </div>
          <div className="flex justify-between">
            <span>Min received</span>
            <span className="text-zinc-300">
              {formatUnits(applySlippage(quotedAmountOut), tokenOut.decimals)}{" "}
              {tokenOut.symbol}
            </span>
          </div>
        </div>
      )}

      {/* CTA */}
      <button
        type="button"
        onClick={handleCta}
        disabled={ctaDisabled}
        className="mt-4 w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isBusy && <Loader2 className="h-4 w-4 animate-spin" />}
        {ctaLabel}
      </button>
    </div>
  );
}
