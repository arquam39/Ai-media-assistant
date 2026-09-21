import {
    useState
} from "react";

import CompanyDetails from "../../components/company/CompanyDetails";

function Company() {
    const [form, setForm] =
        useState({
            name: "",
            email: "",
            phone: "",
            address: "",
            website: "",
            about: ""
        });

    const [loading, setLoading] =
        useState(false);

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
    };

    const handleSubmit = async (
        event
    ) => {
        event.preventDefault();

        setLoading(true);

        try {
            console.log(
                "Company details:",
                form
            );

            // API will be connected later.
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Company
                </h1>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Manage your leasing company information.
                </p>
            </div>

            <CompanyDetails
                form={form}
                onChange={
                    handleChange
                }
                onSubmit={
                    handleSubmit
                }
                loading={loading}
            />
        </div>
    );
}

export default Company;