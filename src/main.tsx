
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { FirebaseProvider } from "@/contexts/FirebaseContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ContentProvider } from "@/contexts/ContentContext";
import { PortfolioProvider } from "@/contexts/PortfolioContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FirebaseProvider>
      <AuthProvider>
        <ContentProvider>
          <PortfolioProvider>
            <App />
          </PortfolioProvider>
        </ContentProvider>
      </AuthProvider>
    </FirebaseProvider>
  </StrictMode>,
);
