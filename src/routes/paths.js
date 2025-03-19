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
  dashboard: `${rootPaths.adminRoot}/dashboard`,
  chat: `${rootPaths.adminRoot}/chat`,
  // Customer paths


  // Sale paths
  

  // Error paths
  404: `${rootPaths.errorRoot}/404`,
  unauthorized: `/unauthorized`,
  forbidden: `/forbidden`,
  banned: `/banned`,
  not_for_customer: `/not-for-customer`,
};
