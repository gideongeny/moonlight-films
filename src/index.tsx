// Import polyfills first for older browser support
import "./utils/polyfills";

import "./index.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import "react-lazy-load-image-component/src/effects/blur.css";
import "react-lazy-load-image-component/src/effects/opacity.css";
import "react-circular-progressbar/dist/styles.css";
import "react-toastify/dist/ReactToastify.css";

import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store } from "./store/store";
import { Provider } from "react-redux";
import ErrorBoundary from "./components/Common/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Check if root element exists before rendering
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found. Make sure there's a <div id='root'></div> in your HTML.");
}

// Add error handler for unhandled errors
window.addEventListener("error", (event) => {
  console.error("Global error:", event.error);
  // Don't prevent default - let React handle it
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
  // Don't prevent default - let React handle it
});

try {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <ErrorBoundary
      fallback={
        <div style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0f172a",
          color: "#fff",
          padding: "20px",
          textAlign: "center"
        }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Something went wrong</h1>
          <p style={{ marginBottom: "1rem" }}>The application failed to load. Please refresh the page.</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "10px 20px",
              backgroundColor: "#ef4444",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "1rem"
            }}
          >
            Refresh Page
          </button>
        </div>
      }
    >
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <App />
          </Provider>
        </QueryClientProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
} catch (error) {
  console.error("Failed to render app:", error);
  // Fallback rendering if React fails
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #0f172a; color: #fff; padding: 20px; text-align: center;">
        <h1 style="font-size: 2rem; margin-bottom: 1rem;">Failed to Load</h1>
        <p style="margin-bottom: 1rem;">The application could not be initialized. Please refresh the page.</p>
        <button onclick="window.location.reload()" style="padding: 10px 20px; background-color: #ef4444; color: #fff; border: none; border-radius: 5px; cursor: pointer; font-size: 1rem;">
          Refresh Page
        </button>
      </div>
    `;
  }
}
