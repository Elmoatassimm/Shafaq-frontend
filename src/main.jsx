import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import {AuthProvider} from "./contexts/authContext";
import Routes from "./routes/routes";
import { TasksProvider } from "./contexts/tasksContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider >
      <TasksProvider>
      <App />
      </TasksProvider>
    </AuthProvider>
    </React.StrictMode>
 
);
