function CompanyDetails({
    form,
    onChange,
    onSubmit,
    loading = false
}) {
    const fields = [
        {
            name: "name",
            label: "Company Name",
            placeholder: "Leasing Company"
        },
        {
            name: "email",
            label: "Email",
            placeholder: "contact@example.com"
        },
        {
            name: "phone",
            label: "Phone",
            placeholder: "+92 300 0000000"
        },
        {
            name: "address",
            label: "Address",
            placeholder: "Company address"
        },
        {
            name: "website",
            label: "Website",
            placeholder: "https://example.com"
        }
    ];

    return (
        <form
            onSubmit={onSubmit}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#0c0c0f]"
        >
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Company Details
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Manage the leasing company's public information.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {fields.map((field) => (
                    <div
                        key={field.name}
                    >
                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                            {field.label}
                        </label>

                        <input
                            name={
                                field.name
                            }
                            value={
                                form[
                                    field.name
                                ] || ""
                            }
                            onChange={
                                onChange
                            }
                            placeholder={
                                field.placeholder
                            }
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 dark:border-white/10 dark:bg-[#09090b] dark:text-white"
                        />
                    </div>
                ))}
            </div>

            <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    About
                </label>

                <textarea
                    name="about"
                    value={
                        form.about || ""
                    }
                    onChange={onChange}
                    rows={5}
                    placeholder="Tell applicants about the company..."
                    className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 dark:border-white/10 dark:bg-[#09090b] dark:text-white"
                />
            </div>

            <div className="mt-6 flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading
                        ? "Saving..."
                        : "Save Changes"}
                </button>
            </div>
        </form>
    );
}

export default CompanyDetails;