import axios from "axios";

export async function getAltfinsAnalyticsData(
  symbol: string,
  timeInterval: string,
  analyticsType: string,
  from: string,
  to: string,
  page: number = 0,
  size: number = 7,
) {
  const { data } = await axios.post(
    `https://altfins.com/api/v2/public/analytics/search-requests?page=${page}&size=${size}`,
    {
      symbol: symbol,
      timeInterval: timeInterval,
      analyticsType: analyticsType,
      from: from,
      to: to,
    },
    {
      headers: {
        "X-API-KEY": process.env.ALTFINS_API_KEY,
      },
    },
  );

  return data;
}
