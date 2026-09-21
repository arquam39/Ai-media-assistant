import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function AppLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="h-screen overflow-hidden bg-blue-50/50 text-slate-900 dark:bg-[#09090b] dark:text-white">
            <div className="flex h-full">

                {/* Sidebar */}
                <Sidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />

                {/* Main area */}
                <div className="flex min-w-0 flex-1 flex-col bg-[#e5e5e5bd] dark:bg-[#09090b]">

                    {/* Navbar */}
                    <Navbar
                        onMenuClick={() => setSidebarOpen(true)}
                    />

                    {/* Scrollable content */}
                    <main className="custom-scrollbar min-h-0 flex-1 overflow-y-auto">
                        <div className="mx-auto w-full max-w-[1600px] p-6 lg:p-8">
                            <Outlet />
                        </div>
                    </main>

                </div>
            </div>
        </div>
    );
}

export default AppLayout;