import { useState } from 'react'

import './App.css'
import "./index.css";
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import VerifyAccount from "./AuthModule/Components/VerifyAccount/VerifyAccount";
import AuthLayout from './SharedModule/Components/AuthLayout/AuthLayout'
import NotFound from "./SharedModule/Components/NotFound/NotFound";
import Login from "./AuthModule/Components/Login/Login";
import Register from "./AuthModule/Components/Register/Register";
import ChangePassword from "./AuthModule/Components/ChangePassword/ChangePassword";
import ForgetPassword from "./AuthModule/Components/ForgetPassword/ForgetPassword";
import ResetPassword from "./AuthModule/Components/ResetPassword/ResetPassword";
import Blogs from "./DashboardModule/Components/Blogs/Blogs";
import Locator from "./DashboardModule/Components/Services/Services";
import Home from "./DashboardModule/Components/Home/Home";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import MasterLayout from "./SharedModule/Components/MasterLayout/MasterLayout";
import Services from './DashboardModule/Components/Services/Services';
import Details from './DashboardModule/Components/Details/Details';
import "leaflet/dist/leaflet.css";
import Search from './DashboardModule/Components/Search/Search';
import AiChat from './AI_AssistantModule/Components/AiChat/AiChat';


function App() {

 const routes = createBrowserRouter([
   {
     path: "",
     element: <AuthLayout />,
     errorElement: <NotFound />,
     children: [
       { index: true, element: <Login /> },
       { path: "login", element: <Login /> },
       { path: "register", element: <Register /> },
       { path: "verify-account", element: <VerifyAccount /> },
       { path: "changepass", element: <ChangePassword /> },
       { path: "forgetpass", element: <ForgetPassword /> },
       { path: "resetpass", element: <ResetPassword /> },
     ],
   },
   {
     path: "dashboard",
     element: <MasterLayout />,
     errorElement: <NotFound />,
     children: [
       { index: true, element: <Home /> },
       { path: "home", element: <Home /> },
       { path: "services", element: <Services /> },
       { path: "blogs", element: <Blogs /> },
       { path: "details/:id", element: <Details /> },
       { path: "search", element: <Search /> },
       { path: "ai-chat", element: <AiChat /> },
     ],
   },
 ]);

  return (
    <>
 
      <RouterProvider router={routes}></RouterProvider>
      <BrowserRouter basename="/MediConnect"></BrowserRouter>
    </>
  );
}

export default App
