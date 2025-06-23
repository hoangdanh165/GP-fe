export const fetchUserStats = async (axios) => {
  const res = await axios.get("api/v1/users/stats/customers-last-30-days");
  return res.data;
};

export const fetchAppointmentStats = async (axios) => {
  const res = await axios.get(
    "api/v1/appointments/stats/appointments-last-30-days"
  );
  return res.data;
};

export const fetchFeedbackStats = async (axios) => {
  const res = await axios.get("api/v1/feedbacks/stats/average-rating-all-time");
  return res.data;
  // return {
  //   title: "Garage's Ratings",
  //   value: "4.5",
  //   total: 200,
  // };
};

export const fetchRevenueStats = async (axios, from, to) => {
  const params = {};
  if (from) params.from = from;
  if (to) params.to = to;

  const res = await axios.get("api/v1/payments/stats/revenue", { params });
  return res.data;
};

export const fetchAppointmentByStatusStats = async (axios, from, to) => {
  const params = {};
  if (from) params.from = from;
  if (to) params.to = to;

  const res = await axios.get("api/v1/appointments/stats/count-by-status", { params });
  return res.data;
};

export const fetchPopularTimeSlotsStats = async (axiosInstance) => {
  const res = await axiosInstance.get(
    "api/v1/appointments/stats/popular-time-slots"
  );
  return res.data;
};

export const fetchPopularCarBrandsStats = async (axiosInstance) => {
  const res = await axiosInstance.get(
    "api/v1/appointments/stats/popular-car-brands"
  );
  return res.data;
};

export const fetchCategoryCount = async (axios) => {
  const res = await axios.get(
    "/api/v1/services/stats/category-usage-last-30-days"
  );
  return res.data;
};
