import { lazy, Suspense } from "react";
import { Outlet, createBrowserRouter, Navigate } from "react-router-dom";
import { rootPaths } from "./paths";
import paths from "./paths";

const App = lazy(() => import("../App"));

// Layouts
const AdminLayout = lazy(() => import("../layouts/AdminLayout"));
const CustomerLayout = lazy(() => import("../layouts/CustomerLayout"));

// Auth pages
const SignIn = lazy(() => import("../pages/auth/sign-in/SignIn"));
const SignUp = lazy(() => import("../pages/auth/sign-up/SignUp"));
// const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));

// Error pages
const NotFound = lazy(() => import("../pages/error/NotFound"));
const Unauthorized = lazy(() => import("../pages/error/Unauthorized"));
const Banned = lazy(() => import("../pages/error/Banned"));
const Forbidden = lazy(() => import("../pages/error/Forbidden"));

// Admin pages
const Dashboard = lazy(() => import("../pages/admin/dashboard/Dashboard"));
const AccountsManagement = lazy(() =>
  import("../pages/admin/accounts-management/AccountsManagement")
);
const AppointmentsManagement = lazy(() =>
  import("../pages/admin/appointments-management/AppointmentsManagement")
);

// Customer pages
const ProfileManagement = lazy(() =>
  import("../pages/customer/profile-management/ProfileManagement")
);
const AppointmentsHistory = lazy(() =>
  import("../pages/customer/appoinment-history/AppointmentsHistory")
);
const Index = lazy(() =>
  import("../pages/customer/book-your-appointment/Index")
);

// Sale pages

// General pages
const Chat = lazy(() => import("../pages/chat/Chat"));
const PaymentResult = lazy(() => import("../pages/payment/PaymentResult"));

// Other components
import PrivateRoute from "../components/utils/PrivateRoute";
import HomeRedirect from "../components/utils/HomeRedirect";
import IsSignedIn from "../components/utils/IsSignedIn";
import PageLoader from "../components/loading/PageLoader";
import Splash from "../components/loading/Splash";
const PersistSignin = lazy(() => import("../components/utils/PersistSignin"));

const createMainLayoutAdminRoutes = () => (
  <AdminLayout>
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  </AdminLayout>
);

const createMainLayoutCustomerRoutes = () => (
  <CustomerLayout>
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  </CustomerLayout>
);

const createMainLayoutSaleRoutes = () => (
  <Suspense fallback={<PageLoader />}>
    <Outlet />
  </Suspense>
);

const createAuthLayoutRoutes = () => (
  <Suspense fallback={<PageLoader />}>
    <Outlet />
  </Suspense>
);
const routes = [
  {
    path: "/",
    element: (
      <Suspense fallback={<Splash />}>
        <App />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <PersistSignin>
            <HomeRedirect />
          </PersistSignin>
        ),
      },
      {
        path: rootPaths.adminRoot,
        element: <PersistSignin>{createMainLayoutAdminRoutes()}</PersistSignin>,
        children: [
          {
            path: paths.dashboard,
            element: (
              <PrivateRoute allowedRoles={["admin"]}>
                <Dashboard />
              </PrivateRoute>
            ),
          },
          {
            path: paths.admin_chat,
            element: (
              <PrivateRoute allowedRoles={["admin"]}>
                <Chat />
              </PrivateRoute>
            ),
          },
          {
            path: paths.accounts_management,
            element: (
              <PrivateRoute allowedRoles={["admin"]}>
                <AccountsManagement />
              </PrivateRoute>
            ),
          },
          {
            path: paths.appointments_management,
            element: (
              <PrivateRoute allowedRoles={["admin"]}>
                <AppointmentsManagement />
              </PrivateRoute>
            ),
          },
        ],
      },
      {
        paths: rootPaths.customerRoot,
        element: (
          <PersistSignin>{createMainLayoutCustomerRoutes()}</PersistSignin>
        ),
        children: [
          {
            path: paths.customer_chat,
            element: (
              <PrivateRoute allowedRoles={["customer"]}>
                <Chat />
              </PrivateRoute>
            ),
          },
          {
            path: paths.customer_profile,
            element: (
              <PrivateRoute allowedRoles={["customer"]}>
                <ProfileManagement />
              </PrivateRoute>
            ),
          },
          {
            path: paths.appointments_history,
            element: (
              <PrivateRoute allowedRoles={["customer"]}>
                <AppointmentsHistory />
              </PrivateRoute>
            ),
          },
          {
            path: paths.book_your_appointment,
            element: (
              <PrivateRoute allowedRoles={["customer"]}>
                <Index />
              </PrivateRoute>
            ),
          },
        ],
      },
      {
        path: rootPaths.saleRoot,
        element: <PersistSignin>{createMainLayoutSaleRoutes()}</PersistSignin>,
        children: [
          // {
          //   path: paths.profile,
          //   element: (
          //     <PrivateRoute allowedRoles={["sale"]}>
          //     <UserProfile />
          //   </PrivateRoute>
          //   )
          // },
        ],
      },
      {
        path: rootPaths.paymentRoot,
        element: createAuthLayoutRoutes(),
        children: [
          {
            path: paths.payment_result,
            element: <PaymentResult />,
          },
        ],
      },

      {
        path: rootPaths.authRoot,
        element: createAuthLayoutRoutes(),
        children: [
          {
            path: paths.sign_in,
            element: (
              <IsSignedIn>
                <SignIn />
              </IsSignedIn>
            ),
          },
          {
            path: paths.sign_up,
            element: (
              <IsSignedIn>
                <SignUp />
              </IsSignedIn>
            ),
          },
          // {
          //   path: paths.forgot_password,
          //   element: (
          //     <IsSignedIn>
          //       <ForgotPassword />
          //     </IsSignedIn>
          //   )
          // },
        ],
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },

  {
    path: paths.unauthorized,
    element: <Unauthorized />,
  },
  {
    path: paths.forbidden,
    element: <Forbidden />,
  },
  {
    path: paths.banned,
    element: <Banned />,
  },
];

const options = {
  basename: "",
};

const router = createBrowserRouter(routes, options);

export default router;
