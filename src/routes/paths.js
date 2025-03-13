export const rootPaths = {
  defaultRoot: "",
  authRoot: "/auth",
  errorRoot: "/error",
  adminRoot: "/admin",
  saleRoot: "/sale",
  customerRoot: "/customer",
};

export default {
  // Auth paths
  sign_in: `${rootPaths.authRoot}/sign-in`,
  sign_up: `${rootPaths.authRoot}/sign-up`,
  forgot_password: `${rootPaths.authRoot}/forgot-password`,

  // Admin paths


  // Customer paths


  // Sale paths
  sale_home:`${rootPaths.saleRoot}/`,
  sale_contracts:`${rootPaths.saleRoot}/contracts`,
  service_response_for_sale: `${rootPaths.saleRoot}/service-responses`,
  statistics_for_sale: `${rootPaths.saleRoot}/statistics`,

  // Error paths
  404: `${rootPaths.errorRoot}/404`,
  unauthorized: `/unauthorized`,
  forbidden: `/forbidden`,
  banned: `/banned`,
  not_for_customer: `/not-for-customer`,
};
