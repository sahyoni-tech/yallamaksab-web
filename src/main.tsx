import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./brand.css";
import { Landing } from "./pages/Landing";

// /admin is code-split: its subtree pulls in @supabase/supabase-js, which must
// not ship on the public landing. The dynamic import keeps supabase in a
// separate chunk loaded only when an admin visits /admin.
const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  {
    path: "/admin",
    lazy: async () => {
      const { Admin } = await import("./pages/Admin");
      return { Component: Admin };
    },
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
