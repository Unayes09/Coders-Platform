import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { NextUIProvider } from "@nextui-org/react";
import { RouterProvider } from "react-router-dom";
import router from "./routes/router.jsx";
import { UserProvider } from "./providers/UserProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <main className="dark text-foreground bg-background">
      <UserProvider>
        <RouterProvider router={router}>
          <NextUIProvider></NextUIProvider>
        </RouterProvider>
      </UserProvider>
    </main>
  </React.StrictMode>
);
