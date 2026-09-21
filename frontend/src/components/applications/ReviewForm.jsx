import { useState } from "react";

import {
    CheckCircle2,
    XCircle
} from "lucide-react";

import {
    reviewSchema
} from "../../schemas/applicationSchema";


function ReviewForm({
    onSubmit,
    loading = false,
    error = null
}) {

    // =========================
    // Form State
    // =========================

    const [decision, setDecision] =
        useState("");

    const [internalNote, setInternalNote] =
        useState("");

    const [applicantMessage, setApplicantMessage] =
        useState("");


    // =========================
    // Validation Errors
    // =========================

    const [errors, setErrors] =
        useState({});


    // =========================
    // Decision Change
    // =========================

    const handleDecisionChange = (
        value
    ) => {

        setDecision(value);

        setErrors(
            (previousErrors) => ({
                ...previousErrors,
                decision: undefined,
                applicantMessage:
                    value === "APPROVED"
                        ? undefined
                        : previousErrors.applicantMessage
            })
        );
    };


    // =========================
    // Internal Note Change
    // =========================

    const handleInternalNoteChange = (
        event
    ) => {

        setInternalNote(
            event.target.value
        );

        setErrors(
            (previousErrors) => ({
                ...previousErrors,
                internalNote:
                    undefined
            })
        );
    };


    // =========================
    // Applicant Message Change
    // =========================

    const handleApplicantMessageChange = (
        event
    ) => {

        setApplicantMessage(
            event.target.value
        );

        setErrors(
            (previousErrors) => ({
                ...previousErrors,
                applicantMessage:
                    undefined
            })
        );
    };


    // =========================
    // Submit
    // =========================

    const handleSubmit = (
        event
    ) => {

        event.preventDefault();


        const formData = {

            decision,

            internalNote,

            applicantMessage
        };


        // =========================
        // Validate
        // =========================

        const result =
            reviewSchema.safeParse(
                formData
            );


        if (!result.success) {

            const fieldErrors =
                result.error.flatten()
                    .fieldErrors;

            setErrors(
                fieldErrors
            );

            return;
        }


        // =========================
        // Clear Validation Errors
        // =========================

        setErrors({});


        // =========================
        // Submit Valid Data
        // =========================

        onSubmit(
            result.data
        );
    };


    return (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#0c0c0f]">

            <div className="mb-5">

                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Review Application
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Review the submitted documents and make a decision.
                </p>

            </div>


            {/* =========================
                Backend Review Error
            ========================= */}

            {error && (
                <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 dark:border-red-500/20 dark:bg-red-500/10">

                    <p className="text-sm font-medium text-red-700 dark:text-red-400">
                        Review failed
                    </p>

                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {error}
                    </p>

                </div>
            )}


            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >

                {/* =========================
                    Decision
                ========================= */}

                <div>

                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Decision
                    </label>


                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                        {/* Approve */}

                        <button
                            type="button"
                            onClick={() =>
                                handleDecisionChange(
                                    "APPROVED"
                                )
                            }
                            disabled={
                                loading
                            }
                            className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                decision ===
                                "APPROVED"
                                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                    : "border-slate-200 text-slate-600 hover:border-emerald-300 dark:border-white/10 dark:text-slate-400"
                            }`}
                        >

                            <CheckCircle2
                                size={18}
                            />

                            Approve

                        </button>


                        {/* Reject */}

                        <button
                            type="button"
                            onClick={() =>
                                handleDecisionChange(
                                    "REJECTED"
                                )
                            }
                            disabled={
                                loading
                            }
                            className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                decision ===
                                "REJECTED"
                                    ? "border-red-500 bg-red-500/10 text-red-600 dark:text-red-400"
                                    : "border-slate-200 text-slate-600 hover:border-red-300 dark:border-white/10 dark:text-slate-400"
                            }`}
                        >

                            <XCircle
                                size={18}
                            />

                            Reject

                        </button>

                    </div>


                    {/* Decision Error */}

                    {errors.decision?.[0] && (
                        <p className="mt-1.5 text-sm text-red-500">
                            {
                                errors
                                    .decision[0]
                            }
                        </p>
                    )}

                </div>


                {/* =========================
                    Internal Note
                ========================= */}

                <div>

                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Internal Note
                    </label>


                    <textarea
                        value={
                            internalNote
                        }
                        onChange={
                            handleInternalNoteChange
                        }
                        rows={4}
                        disabled={
                            loading
                        }
                        placeholder="Add notes for your leasing team..."
                        className={`w-full resize-none rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#09090b] dark:text-white ${
                            errors.internalNote
                                ? "border-red-400 dark:border-red-500"
                                : "border-slate-200 dark:border-white/10"
                        }`}
                    />


                    {errors.internalNote?.[0] ? (
                        <p className="mt-1.5 text-sm text-red-500">
                            {
                                errors
                                    .internalNote[0]
                            }
                        </p>
                    ) : (
                        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                            This note is for internal staff only.
                        </p>
                    )}

                </div>


                {/* =========================
                    Applicant Message
                ========================= */}

                <div>

                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Applicant Message
                    </label>


                    <textarea
                        value={
                            applicantMessage
                        }
                        onChange={
                            handleApplicantMessageChange
                        }
                        rows={4}
                        disabled={
                            loading
                        }
                        placeholder="Message that will be sent to the applicant..."
                        className={`w-full resize-none rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#09090b] dark:text-white ${
                            errors.applicantMessage
                                ? "border-red-400 dark:border-red-500"
                                : "border-slate-200 dark:border-white/10"
                        }`}
                    />


                    {errors.applicantMessage?.[0] ? (
                        <p className="mt-1.5 text-sm text-red-500">
                            {
                                errors
                                    .applicantMessage[0]
                            }
                        </p>
                    ) : (
                        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                            This message can be used by the HubSpot email workflow.
                        </p>
                    )}

                </div>


                {/* =========================
                    Submit
                ========================= */}

                <button
                    type="submit"
                    disabled={
                        loading
                    }
                    className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >

                    {loading
                        ? "Saving..."
                        : "Submit Review"}

                </button>

            </form>

        </section>
    );
}


export default ReviewForm;