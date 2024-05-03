import React from 'react';
import logo from './logo.svg';
import './App.css';
import {AuthProvider} from "./contexts/AuthContext";
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import PrivateRoute from "./PrivateRoute.";
import Dashboard from "./pages/Dashboard";
import SignInPage from "./pages/SignInPage";

function App() {

  const router = createBrowserRouter([
    {
      path:"/",
      // @ts-ignore
      element:<PrivateRoute><Dashboard/></PrivateRoute>
    },
    {
      path:"/login",
      element:<SignInPage></SignInPage>
    }
  ])

  return (
          <AuthProvider>
            <RouterProvider router={router}></RouterProvider>
          </AuthProvider>
  );
}

export default App;
