import {
    CalendarDays,
    Mail,
    Phone,
    ChevronRight
} from "lucide-react";

import ApplicationStatus from "./ApplicationStatus";

function ApplicationCard({
    application,
    onClick
}) {
    const applicant =
        application.applicant || {};

    const ai =
        application.aiAnalysis || {};

    return (
        <button
            type="button"
            onClick={onClick}
            className="w-full rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md dark:border-white/10 dark:bg-[#0c0c0f] dark:hover:border-blue-500/40"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <h3 className="truncate font-semibold text-slate-900 dark:text-white">
                        {applicant.name}
                    </h3>

                    <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
                        {applicant.email}
                    </p>
                </div>

                <ApplicationStatus
                    status={application.status}
                />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                    <Mail size={15} />
                    <span className="truncate">
                        {applicant.email}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <Phone size={15} />
                    <span>
                        {applicant.phone || "—"}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <CalendarDays size={15} />
                    <span>
                        {application.createdAt
                            ? new Date(
                                application.createdAt
                            ).toLocaleDateString()
                            : "—"}
                    </span>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3 dark:border-white/10">
                <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                        AI Score
                    </span>

                    <p className="font-semibold text-slate-900 dark:text-white">
                        {ai.score ?? "—"}
                    </p>
                </div>

                <ChevronRight
                    size={18}
                    className="text-slate-400"
                />
            </div>
        </button>
    );
}

export default ApplicationCard;