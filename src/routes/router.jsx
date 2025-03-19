import { lazy, Suspense } from "react";
import { Outlet, createBrowserRouter, Navigate } from "react-router-dom";
import { rootPaths } from "./paths";
import paths from "./paths";

const App = lazy(() => import("../App"));

// Layouts
const AdminLayout = lazy(() => import("../layouts/AdminLayout"));

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
import Chat from "../pages/chat/Chat";

//Sale pages


// Other components
import PrivateRoute from "../components/utils/PrivateRoute";
import HomeRedirect from "../components/utils/HomeRedirect";
import IsLoggedIn from "../components/utils/IsSignedIn";
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

    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>

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
        element: (
          <PersistSignin>
            {createMainLayoutAdminRoutes()}
          </PersistSignin>
        ),
        children: [

          {
            path: paths.dashboard,
            element: (
              // <PrivateRoute allowedRoles={['admin']}>
                <Dashboard />
              // </PrivateRoute>      
            ),

          },
          {
            path: paths.chat,
            element: (
              // <PrivateRoute allowedRoles={['admin']}>
                <Chat />
              // </PrivateRoute>      
            ),

          },
          
          
          
          
          
    
        ]
      },
      {
        paths: rootPaths.customerRoot,
        element: <PersistSignin>{createMainLayoutCustomerRoutes()}</PersistSignin>,
        children:[
          // {
          //   path: paths.profile,
          //   element: (
          //     <PrivateRoute allowedRoles={["coach"]}>
          //     <UserProfile />
          //   </PrivateRoute>
          //   )
          // },
      
      ]
      },
      {
        path: rootPaths.saleRoot,
        element: <PersistSignin>{createMainLayoutSaleRoutes()}</PersistSignin>,
        children: [
          // {
          //   path: paths.profile,
          //   element: (
          //     <PrivateRoute allowedRoles={["coach"]}>
          //     <UserProfile />
          //   </PrivateRoute>
          //   )
          // },
          
          
        ],
      },
      
      {
        path: rootPaths.authRoot,
        element: createAuthLayoutRoutes(),
        children: [
          {
            path: paths.sign_in,
            element: (
              // <IsLoggedIn>
                <SignIn />
              // </IsLoggedIn>
            )
          },
          {
            path: paths.sign_up,
            element: (
              // <IsLoggedIn>
                <SignUp />
              // </IsLoggedIn>
            )
          },
          // {
          //   path: paths.forgot_password,
          //   element: (
          //     <IsLoggedIn>
          //       <ForgotPassword />
          //     </IsLoggedIn>
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
