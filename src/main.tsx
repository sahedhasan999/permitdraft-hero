
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ContentProvider } from "@/contexts/ContentContext";
import { PortfolioProvider } from "@/contexts/PortfolioContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <ContentProvider>
        <PortfolioProvider>
          <App />
        </PortfolioProvider>
      </ContentProvider>
    </AuthProvider>
  </StrictMode>,
);
