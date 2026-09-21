import {
    User,
    Mail,
    Phone,
    MapPin
} from "lucide-react";

function InfoItem({
    icon: Icon,
    label,
    value
}) {
    return (
        <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                <Icon size={14} />
                {label}
            </div>

            <p className="break-words text-sm font-medium text-slate-900 dark:text-white">
                {value || "Not provided"}
            </p>
        </div>
    );
}

function ApplicantInfo({
    applicant
}) {
    return (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#0c0c0f]">
            <div className="mb-5">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Applicant Information
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Contact details provided with the application.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <InfoItem
                    icon={User}
                    label="Full Name"
                    value={applicant?.name}
                />

                <InfoItem
                    icon={Mail}
                    label="Email"
                    value={applicant?.email}
                />

                <InfoItem
                    icon={Phone}
                    label="Phone"
                    value={applicant?.phone}
                />

                <InfoItem
                    icon={MapPin}
                    label="Address"
                    value={applicant?.address}
                />
            </div>
        </section>
    );
}

export default ApplicantInfo;