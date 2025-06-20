export const fetchUserStats = async (axios) => {
  const res = await axios.get("api/v1/users/stats/customers-last-30-days");
  return res.data;
};

export const fetchConversions = async (axios) => {
  const res = await axios.get(
    "api/v1/appointments/stats/appointments-last-30-days"
  );
  return res.data;
};

export const fetchEventCounts = async (axios) => {
  return {
    title: "Event count",
    value: "200k",
    interval: "Last 30 days",
    trend: "neutral",
    data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 800)),
  };
};

export const fetchCategoryCount = async (axios) => {
  const res = await axios.get(
    "/api/v1/services/stats/category-usage-last-30-days"
  );
  return res.data;
};
