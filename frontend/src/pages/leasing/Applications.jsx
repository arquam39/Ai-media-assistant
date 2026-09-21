import {
    Search,
    Eye,
    Trash2,
    X,
    Loader2,
    AlertTriangle
} from "lucide-react";

import {
    useNavigate
} from "react-router-dom";

import {
    useDispatch,
    useSelector
} from "react-redux";

import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    fetchApplications,
    removeApplication
} from "../../store/slices/applicationSlice";

import ApplicationCard from "../../components/applications/ApplicationCard";
import ApplicationStatus from "../../components/applications/ApplicationStatus";
import ApplicationFilters from "../../components/applications/ApplicationFilters";

function Applications() {

    const navigate =
        useNavigate();

    const dispatch =
        useDispatch();


    // =========================
    // Local State
    // =========================

    const [search, setSearch] =
        useState("");

    const [status, setStatus] =
        useState("ALL");

    const [
        applicationToDelete,
        setApplicationToDelete
    ] = useState(null);


    // =========================
    // Redux State
    // =========================

    const {
        applications,
        loading,
        error,
        deleteLoading,
        deleteError
    } = useSelector(
        (state) =>
            state.applications
    );


    // =========================
    // Fetch Applications
    // =========================

    useEffect(() => {

        dispatch(
            fetchApplications()
        );

    }, [dispatch]);


    // =========================
    // Filter Applications
    // =========================

    const filteredApplications =
        useMemo(() => {

            return applications.filter(
                (application) => {

                    const applicant =
                        application.applicant ||
                        {};

                    const searchValue =
                        search
                            .toLowerCase()
                            .trim();


                    const matchesSearch =
                        !searchValue ||
                        applicant.name
                            ?.toLowerCase()
                            .includes(
                                searchValue
                            ) ||
                        applicant.email
                            ?.toLowerCase()
                            .includes(
                                searchValue
                            );


                    const matchesStatus =
                        status === "ALL" ||
                        application.status ===
                        status;


                    return (
                        matchesSearch &&
                        matchesStatus
                    );
                }
            );

        }, [
            applications,
            search,
            status
        ]);


    // =========================
    // Open Delete Modal
    // =========================

    const handleDeleteClick = (
        application
    ) => {

        setApplicationToDelete(
            application
        );
    };


    // =========================
    // Close Delete Modal
    // =========================

    const closeDeleteModal = () => {

        if (deleteLoading) {
            return;
        }

        setApplicationToDelete(
            null
        );
    };


    // =========================
    // Delete Application
    // =========================

    const handleDelete = async () => {

        if (!applicationToDelete) {
            return;
        }


        try {

            await dispatch(
                removeApplication(
                    applicationToDelete._id
                )
            ).unwrap();


            setApplicationToDelete(
                null
            );

        } catch (error) {

            console.error(
                "Delete application failed:",
                error
            );
        }
    };


    return (
        <div className="space-y-6">

            {/* =========================
                Page Header
            ========================= */}

            <div>

                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Applications
                </h1>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Review and manage leasing applications.
                </p>

            </div>


            {/* =========================
                Search & Filters
            ========================= */}

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#0c0c0f]">

                <div className="mb-4 flex items-center gap-3 rounded-lg border border-slate-200 px-3 dark:border-white/10">

                    <Search
                        size={18}
                        className="text-slate-400 cursor-pointer"
                    />

                    <input
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                        placeholder="Search applicants..."
                        className="w-full bg-transparent  py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                    />

                </div>


                <ApplicationFilters
                    value={status}
                    onChange={setStatus}
                />

            </div>


            {/* =========================
                Loading
            ========================= */}

            {loading && (
                <div className="rounded-xl border border-slate-200 bg-white p-10 text-center dark:border-white/10 dark:bg-[#0c0c0f]">

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Loading applications...
                    </p>

                </div>
            )}


            {/* =========================
                Fetch Error
            ========================= */}

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                    {error}
                </div>
            )}


            {/* =========================
                Delete Error
            ========================= */}

            {deleteError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-500/20 dark:bg-red-500/10">

                    <p className="text-sm font-medium text-red-700 dark:text-red-400">
                        Failed to delete application
                    </p>

                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {deleteError}
                    </p>

                </div>
            )}


            {/* =========================
                Desktop
            ========================= */}

            <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block dark:border-white/10 dark:bg-[#0c0c0f]">

                <table className="w-full">

                    <thead>

                        <tr className="border-b border-slate-200 text-left dark:border-white/10">

                            <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                Applicant
                            </th>

                            <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                Status
                            </th>

                            <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                AI Score
                            </th>

                            <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                Recommendation
                            </th>

                            <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                Submitted
                            </th>

                            <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                Actions
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {filteredApplications.map(
                            (application) => {

                                const applicant =
                                    application.applicant ||
                                    {};

                                const ai =
                                    application.aiAnalysis ||
                                    {};


                                return (
                                    <tr
                                        key={
                                            application._id
                                        }
                                        className="border-b border-slate-100 last:border-0 dark:border-white/5"
                                    >

                                        {/* Applicant */}

                                        <td className="px-5 py-4">

                                            <div>

                                                <p className="font-medium text-slate-900 dark:text-white">
                                                    {
                                                        applicant.name
                                                    }
                                                </p>

                                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                                    {
                                                        applicant.email
                                                    }
                                                </p>

                                            </div>

                                        </td>


                                        {/* Status */}

                                        <td className="px-5 py-4">

                                            <ApplicationStatus
                                                status={
                                                    application.status
                                                }
                                            />

                                        </td>


                                        {/* AI Score */}

                                        <td className="px-5 py-4 text-sm font-medium text-slate-900 dark:text-white">

                                            {ai.score ??
                                                "—"}

                                        </td>


                                        {/* Recommendation */}

                                        <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">

                                            {ai.recommendation
                                                ?.replace(
                                                    "_",
                                                    " "
                                                ) ||
                                                "—"}

                                        </td>


                                        {/* Submitted */}

                                        <td className="px-5 py-4 text-sm text-slate-500 dark:text-slate-400">

                                            {application.createdAt
                                                ? new Date(
                                                    application.createdAt
                                                ).toLocaleDateString()
                                                : "—"}

                                        </td>


                                        {/* Actions */}

                                        <td className="px-5 py-4">

                                            <div className="flex items-center justify-end gap-1">

                                                {/* View */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/applications/${application._id}`
                                                        )
                                                    }
                                                    title="View application"
                                                    className="rounded-lg p-2 cursor-pointer text-slate-500 transition hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-white/5 dark:hover:text-blue-400"
                                                >

                                                    <Eye
                                                        size={18}
                                                    />

                                                </button>


                                                {/* Delete */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDeleteClick(
                                                            application
                                                        )
                                                    }
                                                    disabled={
                                                        deleteLoading
                                                    }
                                                    title="Delete application"
                                                    className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-red-500/10 dark:hover:text-red-400 cursor-pointer"
                                                >

                                                    <Trash2
                                                        size={18}
                                                    />

                                                </button>

                                            </div>

                                        </td>

                                    </tr>
                                );
                            }
                        )}

                    </tbody>

                </table>


                {filteredApplications.length ===
                    0 && (

                        <div className="px-5 py-12 text-center">

                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                No applications found.
                            </p>

                        </div>

                    )}

            </div>


            {/* =========================
                Mobile
            ========================= */}

            <div className="grid gap-4 md:hidden">

                {filteredApplications.map(
                    (application) => (

                        <ApplicationCard
                            key={
                                application._id
                            }
                            application={
                                application
                            }
                            onClick={() =>
                                navigate(
                                    `/applications/${application._id}`
                                )
                            }
                        />

                    )
                )}


                {filteredApplications.length ===
                    0 && (

                        <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center dark:border-white/10">

                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                No applications found.
                            </p>

                        </div>

                    )}

            </div>


            {/* =========================
                Delete Confirmation Modal
            ========================= */}

            {applicationToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">

                    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-[#0c0c0f]">

                        {/* Header */}

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


                            <button
                                type="button"
                                onClick={
                                    closeDeleteModal
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


                        {/* Content */}

                        <div className="mt-5">

                            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">

                                Are you sure you want to permanently delete the application for{" "}

                                <span className="font-semibold text-slate-900 dark:text-white">

                                    {
                                        applicationToDelete
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


                        {/* Actions */}

                        <div className="mt-6 flex justify-end gap-3">

                            <button
                                type="button"
                                onClick={
                                    closeDeleteModal
                                }
                                disabled={
                                    deleteLoading
                                }
                                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                            >
                                Cancel
                            </button>


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

export default Applications;