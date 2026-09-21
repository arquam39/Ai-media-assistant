import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkAuth } from "./store/slices/authSlice";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyOtp from "./pages/auth/VerifyOtp";
import ResetPassword from "./pages/auth/ResetPassword";

import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/routes/ProtectedRoute";

import Dashboard from "./pages/app/Dashboard";
import MediaLibrary from "./pages/app/MediaLibrary";
import Favorites from "./pages/app/Favorites";
import MediaDetails from "./pages/app/MediaDetails";
import Settings from "./pages/app/Settings";
import Profile from "./pages/app/Profile";
import Trash from "./pages/app/Trash";
import Chat from "./components/chats/Chat";

import VerifyEmail from "./pages/auth/VerifyEmail";
import SubmitApplication from "./pages/public/SubmitApplication";
import Applications from "./pages/leasing/Applications";
import ApplicationDetails from "./pages/leasing/ApplicationDetails";
import Company from "./pages/leasing/Company";


function App() {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch]);
    return (
        <BrowserRouter>

            <Routes>


                {/* Public */}
                <Route
                    path="/apply"
                    element={
                        <SubmitApplication />
                    }
                />

                {/* =========================
                    Public Auth Routes
                ========================= */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/verify-email"
                    element={<VerifyEmail />}
                />

                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />

                <Route
                    path="/verify-otp"
                    element={<VerifyOtp />}
                />

                <Route
                    path="/reset-password"
                    element={<ResetPassword />}
                />


                {/* =========================
                    Protected Application Routes
                ========================= */}

                <Route element={<ProtectedRoute />}>

                    <Route element={<AppLayout />}>

                        <Route
                            path="/dashboard"
                            element={<Dashboard />}
                        />

                        <Route
                            path="/applications"
                            element={
                                <Applications />
                            }
                        />

                        <Route
                            path="/applications/:id"
                            element={
                                <ApplicationDetails />
                            }
                        />

                        <Route
                            path="/company"
                            element={
                                <Company />
                            }
                        />

                        <Route
                            path="/media"
                            element={<MediaLibrary />}
                        />

                        <Route
                            path="/media/:id"
                            element={<MediaDetails />}
                        />

                        <Route
                            path="/chat"
                            element={<Chat />}
                        />

                        <Route
                            path="/favorites"
                            element={<Favorites />}
                        />

                        <Route
                            path="/trash"
                            element={<Trash />}
                        />

                        <Route
                            path="/profile"
                            element={<Profile />}
                        />

                        <Route
                            path="/settings"
                            element={<Settings />}
                        />

                    </Route>

                </Route>


                {/* =========================
                    Fallback
                ========================= */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;