import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./brand.css";
import { Landing } from "./pages/Landing";
import { Admin } from "./pages/Admin";

const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/admin", element: <Admin /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
