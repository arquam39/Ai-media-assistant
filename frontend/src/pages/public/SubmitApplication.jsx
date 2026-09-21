import {
    useState
} from "react";

import {
    CheckCircle2,
    Upload,
    Building2,
    AlertCircle,
    ArrowLeft,
    LogIn
} from "lucide-react";

import {
    useNavigate
} from "react-router-dom";

import {
    submitApplication
} from "../../services/applicationService";

import {
    applicationSchema
} from "../../schemas/applicationSchema";


function SubmitApplication() {

    const navigate =
        useNavigate();


    const [form, setForm] =
        useState({
            name: "",
            email: "",
            phone: "",
            address: ""
        });

    const [files, setFiles] =
        useState({
            cnic: null,
            salarySlip: null,
            bankStatement: null,
            employmentLetter: null
        });

    const [errors, setErrors] =
        useState({});

    const [loading, setLoading] =
        useState(false);

    const [submitted, setSubmitted] =
        useState(false);

    const [applicationId, setApplicationId] =
        useState("");

    const [submitError, setSubmitError] =
        useState("");


    // =========================
    // Handle Text Change
    // =========================

    const handleChange = (
        event
    ) => {

        const {
            name,
            value
        } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: undefined
        }));

        setSubmitError("");
    };


    // =========================
    // Handle File Change
    // =========================

    const handleFileChange = (
        event
    ) => {

        const {
            name,
            files: selectedFiles
        } = event.target;

        const file =
            selectedFiles?.[0] ||
            null;

        if (!file) {
            return;
        }

        const result =
            applicationSchema
                .shape[name]
                .safeParse(file);

        if (!result.success) {

            setErrors((previous) => ({
                ...previous,
                [name]:
                    result.error
                        .issues[0]
                        ?.message ||
                    "Invalid file"
            }));

            setFiles((previous) => ({
                ...previous,
                [name]: null
            }));

            event.target.value = "";

            return;
        }

        setFiles((previous) => ({
            ...previous,
            [name]: file
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: undefined
        }));

        setSubmitError("");
    };


    // =========================
    // Handle Submit
    // =========================

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();

        setSubmitError("");
        setErrors({});


        // =========================
        // Validate Form
        // =========================

        const validationResult =
            applicationSchema.safeParse({
                ...form,
                ...files
            });


        if (
            !validationResult.success
        ) {

            const validationErrors = {};

            validationResult
                .error
                .issues
                .forEach((issue) => {

                    const field =
                        issue.path[0];

                    if (
                        field &&
                        !validationErrors[field]
                    ) {
                        validationErrors[field] =
                            issue.message;
                    }
                });

            setErrors(
                validationErrors
            );

            return;
        }


        setLoading(true);


        try {

            const formData =
                new FormData();


            // =========================
            // Applicant Information
            // =========================

            formData.append(
                "name",
                form.name.trim()
            );

            formData.append(
                "email",
                form.email.trim()
            );

            formData.append(
                "phone",
                form.phone.trim()
            );

            formData.append(
                "address",
                form.address.trim()
            );


            // =========================
            // Documents
            // =========================

            Object.entries(files)
                .forEach(
                    ([key, file]) => {

                        formData.append(
                            key,
                            file
                        );
                    }
                );


            // =========================
            // API Request
            // =========================

            const response =
                await submitApplication(
                    formData
                );


            setApplicationId(
                response.application?._id ||
                response.application?.id ||
                ""
            );

            setSubmitted(true);

        } catch (error) {

            setSubmitError(
                error.message ||
                "Failed to submit application. Please try again."
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================
    // Document Fields
    // =========================

    const documentFields = [
        {
            name: "cnic",
            label: "CNIC"
        },
        {
            name: "salarySlip",
            label: "Salary Slip"
        },
        {
            name: "bankStatement",
            label: "Bank Statement"
        },
        {
            name: "employmentLetter",
            label: "Employment Letter"
        }
    ];


    // =========================
    // Success Screen
    // =========================

    if (submitted) {

        return (
            <div className="min-h-screen bg-[#e5e5e5bd] text-slate-900 dark:bg-[#09090b] dark:text-white">

                {/* ========================= */}
                {/* Navbar */}
                {/* ========================= */}

                <nav className="border-b border-slate-200 bg-white dark:border-white/10 dark:bg-[#0c0c0f]">

                    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">

                        {/* Brand */}

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/")
                            }
                            className="flex items-center gap-2.5"
                        >

                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">

                                <Building2
                                    size={19}
                                />

                            </div>

                            <span className="text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                                Leasing Portal
                            </span>

                        </button>


                        {/* Login */}

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/login")
                            }
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                        >

                            <LogIn
                                size={16}
                            />

                            Login

                        </button>

                    </div>

                </nav>


                {/* ========================= */}
                {/* Success Content */}
                {/* ========================= */}

                <div className="px-4 py-10 sm:py-16">

                    <div className="mx-auto flex max-w-xl items-center justify-center">

                        <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-[#0c0c0f]">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">

                                <CheckCircle2
                                    size={34}
                                />

                            </div>


                            <h1 className="mt-5 text-2xl font-bold">
                                Application Submitted
                            </h1>


                            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                Your leasing application has been submitted successfully. Our team will review your application and contact you if additional information is required.
                            </p>


                            <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">

                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Application ID
                                </p>


                                <p className="mt-1 break-all font-semibold text-slate-900 dark:text-white">
                                    {
                                        applicationId
                                    }
                                </p>

                            </div>


                            {/* Back Button */}

                            <button
                                type="button"
                                onClick={() =>
                                    setSubmitted(false)
                                }
                                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                            >

                                <ArrowLeft
                                    size={17}
                                />

                                Back to Application

                            </button>

                        </div>

                    </div>

                </div>

            </div>
        );
    }


    // =========================
    // Main Application
    // =========================

    return (

        <div className="min-h-screen bg-[#e5e5e5bd] text-slate-900 dark:bg-[#09090b] dark:text-white">


            {/* ========================= */}
            {/* Navbar */}
            {/* ========================= */}

            <nav className="border-b border-slate-200 bg-white dark:border-white/10 dark:bg-[#0c0c0f]">

                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">

                    {/* Brand */}

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/")
                        }
                        className="flex items-center gap-2.5"
                    >

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">

                            <Building2
                                size={19}
                            />

                        </div>

                        <span className="text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                            Leasing Portal
                        </span>

                    </button>


                    {/* Login */}

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/login")
                        }
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                    >

                        <LogIn
                            size={16}
                        />

                        Login

                    </button>

                </div>

            </nav>


            {/* ========================= */}
            {/* Page Content */}
            {/* ========================= */}

            <div className="px-4 py-8 sm:py-12">

                <div className="mx-auto max-w-3xl">


                    {/* ========================= */}
                    {/* Header */}
                    {/* ========================= */}

                    <div className="mb-8 text-center">

                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">

                            <Building2
                                size={24}
                            />

                        </div>


                        <h1 className="mt-4 text-2xl font-bold sm:text-3xl">
                            Leasing Application
                        </h1>


                        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                            Submit your application and required documents for review.
                        </p>

                    </div>


                    {/* ========================= */}
                    {/* Form */}
                    {/* ========================= */}

                    <form
                        onSubmit={
                            handleSubmit
                        }
                        noValidate
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8 dark:border-white/10 dark:bg-[#0c0c0f]"
                    >

                        {/* ========================= */}
                        {/* Applicant Information */}
                        {/* ========================= */}

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">


                            {/* Name */}

                            <div>

                                <label className="mb-2 block text-sm font-medium">
                                    Full Name
                                </label>


                                <input
                                    name="name"
                                    value={
                                        form.name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Your full name"
                                    className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none dark:bg-[#09090b] ${
                                        errors.name
                                            ? "border-red-400"
                                            : "border-slate-200 focus:border-blue-500 dark:border-white/10"
                                    }`}
                                />


                                {errors.name && (
                                    <p className="mt-1.5 text-xs text-red-500">
                                        {errors.name}
                                    </p>
                                )}

                            </div>


                            {/* Email */}

                            <div>

                                <label className="mb-2 block text-sm font-medium">
                                    Email
                                </label>


                                <input
                                    type="email"
                                    name="email"
                                    value={
                                        form.email
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="you@example.com"
                                    className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none dark:bg-[#09090b] ${
                                        errors.email
                                            ? "border-red-400"
                                            : "border-slate-200 focus:border-blue-500 dark:border-white/10"
                                    }`}
                                />


                                {errors.email && (
                                    <p className="mt-1.5 text-xs text-red-500">
                                        {errors.email}
                                    </p>
                                )}

                            </div>


                            {/* Phone */}

                            <div>

                                <label className="mb-2 block text-sm font-medium">
                                    Phone
                                </label>


                                <input
                                    name="phone"
                                    value={
                                        form.phone
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="+92 300 0000000"
                                    className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none dark:bg-[#09090b] ${
                                        errors.phone
                                            ? "border-red-400"
                                            : "border-slate-200 focus:border-blue-500 dark:border-white/10"
                                    }`}
                                />


                                {errors.phone && (
                                    <p className="mt-1.5 text-xs text-red-500">
                                        {errors.phone}
                                    </p>
                                )}

                            </div>


                            {/* Address */}

                            <div>

                                <label className="mb-2 block text-sm font-medium">
                                    Address
                                </label>


                                <input
                                    name="address"
                                    value={
                                        form.address
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Current address"
                                    className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none dark:bg-[#09090b] ${
                                        errors.address
                                            ? "border-red-400"
                                            : "border-slate-200 focus:border-blue-500 dark:border-white/10"
                                    }`}
                                />


                                {errors.address && (
                                    <p className="mt-1.5 text-xs text-red-500">
                                        {errors.address}
                                    </p>
                                )}

                            </div>

                        </div>


                        <div className="my-8 border-t border-slate-200 dark:border-white/10" />


                        {/* ========================= */}
                        {/* Documents Header */}
                        {/* ========================= */}

                        <div>

                            <h2 className="text-lg font-semibold">
                                Required Documents
                            </h2>


                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Upload JPG, PNG, WEBP or PDF files. Maximum 10MB per file.
                            </p>

                        </div>


                        {/* ========================= */}
                        {/* Documents */}
                        {/* ========================= */}

                        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">

                            {documentFields.map(
                                (document) => {

                                    const fileError =
                                        errors[
                                            document.name
                                        ];

                                    const selectedFile =
                                        files[
                                            document.name
                                        ];


                                    return (

                                        <label
                                            key={
                                                document.name
                                            }
                                            className={`cursor-pointer rounded-xl border border-dashed p-5 transition ${
                                                fileError
                                                    ? "border-red-400"
                                                    : "border-slate-300 hover:border-blue-400 dark:border-white/10 dark:hover:border-blue-500/50"
                                            }`}
                                        >

                                            <div className="flex items-center gap-3">

                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">

                                                    <Upload
                                                        size={18}
                                                    />

                                                </div>


                                                <div className="min-w-0">

                                                    <p className="text-sm font-medium">
                                                        {
                                                            document.label
                                                        }
                                                    </p>


                                                    <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                                                        {selectedFile?.name ||
                                                            "Choose a file"}
                                                    </p>

                                                </div>

                                            </div>


                                            <input
                                                type="file"
                                                name={
                                                    document.name
                                                }
                                                accept=".jpg,.jpeg,.png,.webp,.pdf"
                                                onChange={
                                                    handleFileChange
                                                }
                                                className="hidden"
                                            />


                                            {fileError && (

                                                <div className="mt-3 flex items-start gap-2 text-xs text-red-500">

                                                    <AlertCircle
                                                        size={14}
                                                        className="mt-0.5 shrink-0"
                                                    />

                                                    <span>
                                                        {
                                                            fileError
                                                        }
                                                    </span>

                                                </div>

                                            )}

                                        </label>
                                    );
                                }
                            )}

                        </div>


                        {/* ========================= */}
                        {/* Submit Error */}
                        {/* ========================= */}

                        {submitError && (

                            <div className="mt-5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">

                                <AlertCircle
                                    size={17}
                                    className="mt-0.5 shrink-0"
                                />

                                <span>
                                    {
                                        submitError
                                    }
                                </span>

                            </div>

                        )}


                        {/* ========================= */}
                        {/* Submit */}
                        {/* ========================= */}

                        <button
                            type="submit"
                            disabled={
                                loading
                            }
                            className="mt-8 w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >

                            {loading
                                ? "Submitting Application..."
                                : "Submit Application"}

                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default SubmitApplication;