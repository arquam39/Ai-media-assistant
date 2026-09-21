import {
    Brain,
    AlertTriangle,
    FileWarning,
    ShieldAlert
} from "lucide-react";

const recommendationStyles = {
    LIKELY_APPROVE:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",

    REVIEW:
        "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",

    LIKELY_REJECT:
        "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
};

function AnalysisList({
    title,
    icon: Icon,
    items = [],
    emptyMessage
}) {
    return (
        <div>
            <div className="mb-3 flex items-center gap-2">
                <Icon
                    size={16}
                    className="text-slate-500 dark:text-slate-400"
                />

                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {title}
                </h3>
            </div>

            {items.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    {emptyMessage}
                </p>
            ) : (
                <ul className="space-y-2">
                    {items.map(
                        (item, index) => (
                            <li
                                key={index}
                                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300"
                            >
                                {item}
                            </li>
                        )
                    )}
                </ul>
            )}
        </div>
    );
}

function AIAnalysis({
    analysis
}) {
    const ai = analysis || {};

    const recommendation =
        ai.recommendation || "REVIEW";

    return (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#0c0c0f]">
            <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <Brain
                            size={20}
                            className="text-blue-600 dark:text-blue-400"
                        />

                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                            AI Analysis
                        </h2>
                    </div>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Automated analysis of the submitted documents.
                    </p>
                </div>

                <span
                    className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                        recommendationStyles[
                            recommendation
                        ] ||
                        recommendationStyles.REVIEW
                    }`}
                >
                    {recommendation.replace(
                        "_",
                        " "
                    )}
                </span>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-slate-200 p-4 dark:border-white/10">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        AI Score
                    </p>

                    <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                        {ai.score ?? "—"}
                    </p>
                </div>

                <div className="rounded-lg border border-slate-200 p-4 dark:border-white/10">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Recommendation
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                        {recommendation.replace(
                            "_",
                            " "
                        )}
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                <AnalysisList
                    title="Missing Information"
                    icon={AlertTriangle}
                    items={
                        ai.missingFields
                    }
                    emptyMessage="No missing information detected."
                />

                <AnalysisList
                    title="Document Issues"
                    icon={FileWarning}
                    items={
                        ai.documentIssues
                    }
                    emptyMessage="No document issues detected."
                />

                <AnalysisList
                    title="Risk Flags"
                    icon={ShieldAlert}
                    items={
                        ai.riskFlags
                    }
                    emptyMessage="No risk flags detected."
                />

                <div>
                    <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
                        Summary
                    </h3>

                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300">
                        {ai.summary ||
                            "No AI summary available."}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AIAnalysis;