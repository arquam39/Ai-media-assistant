import {
    ArrowLeft,
    Loader2,
    Trash2,
    X,
    AlertTriangle,
    RefreshCw
} from "lucide-react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    useEffect,
    useState
} from "react";

import {
    useDispatch,
    useSelector
} from "react-redux";

import {
    fetchApplicationById,
    submitApplicationReview,
    removeApplication,
    reopenApplicationThunk as reopenApplication
} from "../../store/slices/applicationSlice";

import ApplicantInfo from "../../components/applications/ApplicantInfo";
import ApplicationDocuments from "../../components/applications/ApplicationDocuments";
import AIAnalysis from "../../components/applications/AIAnalysis";
import ReviewForm from "../../components/applications/ReviewForm";
import ApplicationStatus from "../../components/applications/ApplicationStatus";


function ApplicationDetails() {

    const navigate =
        useNavigate();

    const { id } =
        useParams();

    const dispatch =
        useDispatch();


    // =========================
    // Local State
    // =========================

    const [
        showDeleteModal,
        setShowDeleteModal
    ] = useState(false);

    const [
        showReopenModal,
        setShowReopenModal
    ] = useState(false);

    const [
        reviewSuccess,
        setReviewSuccess
    ] = useState("");


    // =========================
    // Redux State
    // =========================

    const {
        currentApplication,
        currentLoading,
        currentError,

        reviewLoading,
        reviewError,

        reopenLoading,
        reopenError,

        deleteLoading,
        deleteError
    } = useSelector(
        (state) =>
            state.applications
    );


    // =========================
    // Fetch Application
    // =========================

    useEffect(() => {

        dispatch(
            fetchApplicationById(id)
        );

    }, [dispatch, id]);


    const application =
        currentApplication;

    const loading =
        currentLoading;


    // =========================
    // Reopen Permission
    // =========================

    const canReopen =
        application &&
        [
            "APPROVED",
            "REJECTED"
        ].includes(
            application.status
        );


    // =========================
    // Review Permission
    // =========================

    const canReview =
        application &&
        [
            "SUBMITTED",
            "PENDING_DOCUMENTS",
            "PENDING_REVIEW"
        ].includes(
            application.status
        );


    // =========================
    // Delete Application
    // =========================

    const handleDelete = async () => {

        try {

            await dispatch(
                removeApplication(id)
            ).unwrap();


            setShowDeleteModal(false);


            navigate(
                "/applications"
            );

        } catch (error) {

            console.error(
                "Delete failed:",
                error
            );
        }
    };


    // =========================
    // Review Application
    // =========================

    const handleReview = async (data) => {

        // Clear previous message
        setReviewSuccess("");

        try {

            await dispatch(
                submitApplicationReview({
                    applicationId: id,
                    reviewData: data
                })
            ).unwrap();


            // Fetch the complete updated application
            await dispatch(
                fetchApplicationById(id)
            ).unwrap();


            setReviewSuccess(
                `Application ${data.decision.toLowerCase()} successfully.`
            );

        } catch (error) {

            console.error(
                "Review failed:",
                error
            );
        }
    };

    // =========================
    // Reopen Application
    // =========================

    const handleReopen = async () => {

        try {

            await dispatch(
                reopenApplication(id)
            ).unwrap();


            // Fetch the complete updated application
            await dispatch(
                fetchApplicationById(id)
            ).unwrap();


            setShowReopenModal(false);


            setReviewSuccess(
                "Application reopened successfully. It is now pending review."
            );

        } catch (error) {

            console.error(
                "Reopen failed:",
                error
            );
        }
    };


    // =========================
    // Loading
    // =========================

    if (loading) {

        return (
            <div className="flex min-h-[400px] items-center justify-center">

                <Loader2
                    className="animate-spin text-blue-500"
                    size={28}
                />

            </div>
        );
    }


    // =========================
    // Load Error
    // =========================

    if (currentError) {

        return (
            <div className="space-y-6">

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/applications"
                        )
                    }
                    className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                >

                    <ArrowLeft
                        size={17}
                    />

                    Back to Applications

                </button>


                <div className="rounded-xl border border-red-200 bg-red-50 p-12 text-center dark:border-red-500/20 dark:bg-red-500/10">

                    <h2 className="font-semibold text-red-700 dark:text-red-400">
                        Failed to load application
                    </h2>

                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        {currentError}
                    </p>

                </div>

            </div>
        );
    }


    // =========================
    // Application Not Found
    // =========================

    if (!application) {

        return (
            <div className="space-y-6">

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/applications"
                        )
                    }
                    className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                >

                    <ArrowLeft
                        size={17}
                    />

                    Back to Applications

                </button>


                <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center dark:border-white/10">

                    <h2 className="font-semibold text-slate-900 dark:text-white">
                        Application not found
                    </h2>

                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Application ID: {id}
                    </p>

                </div>

            </div>
        );
    }


    // =========================
    // Main UI
    // =========================

    return (
        <div className="space-y-6">


            {/* =========================
                Header
            ========================= */}

            <div>

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/applications"
                        )
                    }
                    className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                >

                    <ArrowLeft
                        size={17}
                    />

                    Back to Applications

                </button>


                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">


                    {/* Applicant Name */}

                    <div>

                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">

                            {
                                application
                                    .applicant
                                    ?.name
                            }

                        </h1>


                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">

                            Application #

                            {
                                application._id
                            }

                        </p>

                    </div>


                    {/* Header Actions */}

                    <div className="flex items-center gap-3">


                        {/* Status */}

                        <ApplicationStatus
                            status={
                                application.status
                            }
                        />


                        {/* Reopen Button */}

                        {canReopen && (
                            <button
                                type="button"
                                onClick={() =>
                                    setShowReopenModal(
                                        true
                                    )
                                }
                                disabled={
                                    reopenLoading
                                }
                                className="inline-flex items-center gap-2 rounded-lg border border-blue-200 px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-blue-500/20 dark:text-blue-400 dark:hover:bg-blue-500/10"
                            >

                                <RefreshCw
                                    size={16}
                                />

                                Reopen

                            </button>
                        )}


                        {/* Delete Button */}

                        <button
                            type="button"
                            onClick={() =>
                                setShowDeleteModal(
                                    true
                                )
                            }
                            disabled={
                                deleteLoading
                            }
                            title="Delete application"
                            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-500/20 dark:text-red-400 dark:hover:bg-red-500/10 dark:hover:text-red-300"
                        >

                            {deleteLoading ? (

                                <Loader2
                                    size={17}
                                    className="animate-spin"
                                />

                            ) : (

                                <Trash2
                                    size={17}
                                />

                            )}

                        </button>

                    </div>

                </div>

            </div>


            {/* =========================
                Success Message
            ========================= */}

            {reviewSuccess && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-500/20 dark:bg-emerald-500/10">

                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                        Action completed successfully
                    </p>

                    <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-400">
                        {reviewSuccess}
                    </p>

                </div>
            )}


            {/* =========================
                Reopen Error
            ========================= */}

            {reopenError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 dark:border-red-500/20 dark:bg-red-500/10">

                    <p className="text-sm font-medium text-red-700 dark:text-red-400">
                        Failed to reopen application
                    </p>

                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {reopenError}
                    </p>

                </div>
            )}


            {/* =========================
                Delete Error
            ========================= */}

            {deleteError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 dark:border-red-500/20 dark:bg-red-500/10">

                    <p className="text-sm font-medium text-red-700 dark:text-red-400">
                        Failed to delete application
                    </p>

                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {deleteError}
                    </p>

                </div>
            )}


            {/* =========================
                Applicant
            ========================= */}

            <ApplicantInfo
                applicant={
                    application.applicant
                }
            />


            {/* =========================
                Documents
            ========================= */}

            <ApplicationDocuments
                documents={
                    application.documents
                }
            />


            {/* =========================
                AI Analysis
            ========================= */}

            <AIAnalysis
                analysis={
                    application.aiAnalysis
                }
            />


            {/* =========================
                Review
            ========================= */}

            {canReview && (
                <div className="space-y-4">

                    <ReviewForm
                        onSubmit={
                            handleReview
                        }
                        loading={
                            reviewLoading
                        }
                        error={
                            reviewError
                        }
                    />

                </div>
            )}


            {/* =========================
                Reopen Confirmation Modal
            ========================= */}

            {showReopenModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">

                    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-[#0c0c0f]">


                        {/* Modal Header */}

                        <div className="flex items-start justify-between gap-4">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">

                                    <RefreshCw
                                        size={20}
                                    />

                                </div>


                                <div>

                                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                        Reopen Application
                                    </h2>

                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        Confirm this action
                                    </p>

                                </div>

                            </div>


                            {/* Close */}

                            <button
                                type="button"
                                onClick={() =>
                                    setShowReopenModal(
                                        false
                                    )
                                }
                                disabled={
                                    reopenLoading
                                }
                                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-white/5 dark:hover:text-white"
                            >

                                <X
                                    size={18}
                                />

                            </button>

                        </div>


                        {/* Modal Content */}

                        <div className="mt-5">

                            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">

                                This application is already{" "}

                                <span className="font-semibold text-slate-900 dark:text-white">

                                    {
                                        application.status
                                            .toLowerCase()
                                            .replace(
                                                "_",
                                                " "
                                            )
                                    }

                                </span>.

                                {" "}Reopening it will move the application back to{" "}

                                <span className="font-semibold text-slate-900 dark:text-white">
                                    Pending Review
                                </span>.

                            </p>


                            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">

                                The application will become available for a new review decision. Do you want to continue?

                            </p>

                        </div>


                        {/* Modal Actions */}

                        <div className="mt-6 flex justify-end gap-3">

                            {/* Cancel */}

                            <button
                                type="button"
                                onClick={() =>
                                    setShowReopenModal(
                                        false
                                    )
                                }
                                disabled={
                                    reopenLoading
                                }
                                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                            >
                                Cancel
                            </button>


                            {/* Confirm Reopen */}

                            <button
                                type="button"
                                onClick={
                                    handleReopen
                                }
                                disabled={
                                    reopenLoading
                                }
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >

                                {reopenLoading ? (

                                    <>

                                        <Loader2
                                            size={16}
                                            className="animate-spin"
                                        />

                                        Reopening...

                                    </>

                                ) : (

                                    <>

                                        <RefreshCw
                                            size={16}
                                        />

                                        Reopen Application

                                    </>

                                )}

                            </button>

                        </div>

                    </div>

                </div>
            )}


            {/* =========================
                Delete Confirmation Modal
            ========================= */}

            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">

                    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-[#0c0c0f]">


                        {/* Modal Header */}

                        <div className="flex items-start justify-between gap-4">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400">

                                    <AlertTriangle
                                        size={20}
                                    />

                                </div>


                                <div>

                                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                        Delete Application
                                    </h2>

                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        This action cannot be undone.
                                    </p>

                                </div>

                            </div>


                            {/* Close */}

                            <button
                                type="button"
                                onClick={() =>
                                    setShowDeleteModal(
                                        false
                                    )
                                }
                                disabled={
                                    deleteLoading
                                }
                                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-white/5 dark:hover:text-white"
                            >

                                <X
                                    size={18}
                                />

                            </button>

                        </div>


                        {/* Modal Content */}

                        <div className="mt-5">

                            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">

                                Are you sure you want to permanently delete the application for{" "}

                                <span className="font-semibold text-slate-900 dark:text-white">

                                    {
                                        application
                                            .applicant
                                            ?.name
                                    }

                                </span>
                                ?

                            </p>


                            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">

                                This will delete the application, submitted documents, Cloudinary files, and its HubSpot deal.

                            </p>

                        </div>


                        {/* Modal Actions */}

                        <div className="mt-6 flex justify-end gap-3">

                            {/* Cancel */}

                            <button
                                type="button"
                                onClick={() =>
                                    setShowDeleteModal(
                                        false
                                    )
                                }
                                disabled={
                                    deleteLoading
                                }
                                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                            >
                                Cancel
                            </button>


                            {/* Delete */}

                            <button
                                type="button"
                                onClick={
                                    handleDelete
                                }
                                disabled={
                                    deleteLoading
                                }
                                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >

                                {deleteLoading ? (

                                    <>

                                        <Loader2
                                            size={16}
                                            className="animate-spin"
                                        />

                                        Deleting...

                                    </>

                                ) : (

                                    <>

                                        <Trash2
                                            size={16}
                                        />

                                        Delete Application

                                    </>

                                )}

                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}


export default ApplicationDetails;
