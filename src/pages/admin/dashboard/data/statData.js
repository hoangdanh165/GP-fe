export const fetchUserStats = async (axios) => {
  const res = await axios.get("api/v1/users/stats/customers-last-30-days");
  return res.data;
};

export const fetchConversions = async (axios) => {
  // Fake data mẫu
  return {
    title: "Conversions",
    value: "325",
    interval: "Last 30 days",
    trend: "down",
    data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 1000)),
  };
};

export const fetchEventCounts = async () => {
  return {
    title: "Event count",
    value: "200k",
    interval: "Last 30 days",
    trend: "neutral",
    data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 800)),
  };
};
