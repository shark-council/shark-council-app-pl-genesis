import { BaseMessage } from "langchain";

type AgentResponse = {
  messages: BaseMessage[];
} & Record<string, unknown>;

function parseJsonString(value: string): unknown {
  const trimmedValue = value.trim();

  if (
    trimmedValue.length === 0 ||
    (!trimmedValue.startsWith("{") && !trimmedValue.startsWith("["))
  ) {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function serializeUnknown(value: unknown): unknown {
  if (typeof value === "string") {
    return parseJsonString(value);
  }

  if (Array.isArray(value)) {
    return value.map(serializeUnknown);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key,
        serializeUnknown(nestedValue),
      ]),
    );
  }

  return value;
}

function serializeRecord(
  value: Record<string, unknown>,
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(value).map(([key, nestedValue]) => [
      key,
      serializeUnknown(nestedValue),
    ]),
  );
}

function serializeMessage(message: BaseMessage): Record<string, unknown> {
  const serializedMessage: Record<string, unknown> = {
    type: message.getType(),
    id: message.id,
    content: serializeUnknown(message.content),
    additional_kwargs: serializeUnknown(message.additional_kwargs),
    response_metadata: serializeUnknown(message.response_metadata),
  };

  if (message.name) {
    serializedMessage.name = message.name;
  }

  const extendedMessage = message as BaseMessage & Record<string, unknown>;

  for (const key of [
    "tool_calls",
    "invalid_tool_calls",
    "usage_metadata",
    "tool_call_id",
    "status",
  ]) {
    if (extendedMessage[key] !== undefined) {
      serializedMessage[key] = serializeUnknown(extendedMessage[key]);
    }
  }

  return serializedMessage;
}

export function serializeAgentResponse(response: AgentResponse): string {
  const { messages, ...rest } = response;

  return JSON.stringify(
    {
      ...serializeRecord(rest),
      messages: messages.map(serializeMessage),
    },
    null,
    2,
  );
}
