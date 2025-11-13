import { useRoutes, Navigate } from "react-router-dom";
import Login from "./auth/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";


export default function App() {
    const routes = useRoutes([
        { path: "/", element: <Login /> },
        { path: "/dashboard", element: <Dashboard /> },

        // redirect sample
        { path: "/home", element: <Navigate to="/" replace /> },

        // fallback route
        { path: "*", element: <NotFound /> },
    ]);

    return routes;
}
