import {
    Navigate,
    Outlet,
    useLocation,
} from "react-router-dom";

import { useSelector } from "react-redux";


function ProtectedRoute() {

    const location = useLocation();

    const {
        isAuthenticated,
        checkingAuth,
    } = useSelector(
        (state) => state.auth
    );


    // =========================
    // Checking authentication
    // =========================

    if (checkingAuth) {
        return (
            <div
                className="
                    flex
                    min-h-screen
                    items-center
                    justify-center
                    bg-slate-50
                    dark:bg-[#0c0c0f]
                "
            >
                <div
                    className="
                        h-6
                        w-6
                        animate-spin
                        rounded-full
                        border-2
                        border-blue-200
                        border-t-blue-600
                    "
                />
            </div>
        );
    }


    // =========================
    // Not authenticated
    // =========================

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location,
                }}
            />
        );
    }


    // =========================
    // Authenticated
    // =========================

    return <Outlet />;
}

export default ProtectedRoute;