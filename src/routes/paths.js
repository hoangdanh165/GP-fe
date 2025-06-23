export const rootPaths = {
  defaultRoot: "",
  authRoot: "/auth",
  errorRoot: "/error",
  adminRoot: "/admin",
  saleRoot: "/sale",
  paymentRoot: "/payment",
  customerRoot: "/customer",
  homeRoot: "/home",
};

export default {
  // Auth paths
  sign_in: `${rootPaths.authRoot}/sign-in`,
  sign_up: `${rootPaths.authRoot}/sign-up`,
  forgot_password: `${rootPaths.authRoot}/forgot-password`,

  // Admin paths
  admin_chat: `${rootPaths.adminRoot}/chat`,
  accounts_management: `${rootPaths.adminRoot}/manage/accounts`,
  services_management: `${rootPaths.adminRoot}/manage/services`,
  appointments_management: `${rootPaths.adminRoot}/manage/appointments`,
  feedbacks: `${rootPaths.adminRoot}/service/feedbacks`,
  invoice_management_admin: `${rootPaths.adminRoot}/invoices-management`,
  admin_profile: `${rootPaths.adminRoot}/profile`,
  dashboard: `${rootPaths.adminRoot}/dashboard`,
  dashboard_show_more: `${rootPaths.adminRoot}/dashboard/other-charts`,

  // Customer paths
  customer_chat: `${rootPaths.customerRoot}/chat`,
  customer_profile: `${rootPaths.customerRoot}/profile`,
  appointments_history: `${rootPaths.customerRoot}/appointments-history`,
  book_your_appointment: `${rootPaths.customerRoot}/book-your-appointment`,

  faq: `${rootPaths.customerRoot}/faq`,
  // Sale paths
  invoice_management_sale: `${rootPaths.saleRoot}/invoice-management`,
  appointments_management_sale: `${rootPaths.saleRoot}/manage/appointments`,
  feedbacks_sale: `${rootPaths.saleRoot}/service/feedbacks`,
  sale_chat: `${rootPaths.saleRoot}/chat`,
  sale_profile: `${rootPaths.saleRoot}/profile`,

  // Payment paths
  payment_result: `${rootPaths.paymentRoot}/result`,

  // Home paths
  landing_page: `${rootPaths.homeRoot}/landing-page`,

  // Error paths
  404: `${rootPaths.errorRoot}/404`,
  unauthorized: `/unauthorized`,
  forbidden: `/forbidden`,
  banned: `/banned`,
  not_for_customer: `/not-for-customer`,
};
