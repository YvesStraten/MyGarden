import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import { QueryClient, QueryClientProvider } from "react-query";

const queryclient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
		<QueryClientProvider client={queryclient}>
    <App />
		</QueryClientProvider>
  </React.StrictMode>,
);
