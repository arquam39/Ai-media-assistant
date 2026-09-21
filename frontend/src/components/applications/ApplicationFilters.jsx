const filters = [
    {
        value: "ALL",
        label: "All"
    },
    {
        value: "PROCESSING",
        label: "Processing"
    },
    {
        value: "PENDING_DOCUMENTS",
        label: "Pending Documents"
    },
    {
        value: "PENDING_REVIEW",
        label: "Pending Review"
    },
    {
        value: "APPROVED",
        label: "Approved"
    },
    {
        value: "REJECTED",
        label: "Rejected"
    }
];

function ApplicationFilters({
    value,
    onChange
}) {
    return (
        <div className="flex gap-2 overflow-x-auto pb-1">
            {filters.map((filter) => {
                const active =
                    value === filter.value;

                return (
                    <button
                        key={filter.value}
                        type="button"
                        onClick={() =>
                            onChange(filter.value)
                        }
                        className={`whitespace-nowrap rounded-lg border px-3 py-2 text-sm font-medium transition cursor-pointer ${
                            active
                                ? "border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-400"
                                : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 dark:border-white/10 dark:bg-[#0c0c0f] dark:text-slate-400 dark:hover:border-blue-500/30"
                        }`}
                    >
                        {filter.label}
                    </button>
                );
            })}
        </div>
    );
}

export default ApplicationFilters;