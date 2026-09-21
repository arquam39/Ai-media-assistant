const statusStyles = {
    SUBMITTED: {
        label: "Submitted",
        className:
            "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300"
    },

    PROCESSING: {
        label: "Processing",
        className:
            "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
    },

    PENDING_DOCUMENTS: {
        label: "Pending Documents",
        className:
            "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
    },

    PENDING_REVIEW: {
        label: "Pending Review",
        className:
            "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400"
    },

    APPROVED: {
        label: "Approved",
        className:
            "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
    },

    REJECTED: {
        label: "Rejected",
        className:
            "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
    }
};

function ApplicationStatus({ status }) {
    const config =
        statusStyles[status] ||
        statusStyles.SUBMITTED;

    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}
        >
            {config.label}
        </span>
    );
}

export default ApplicationStatus;