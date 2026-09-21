import {
    FileText,
    ExternalLink
} from "lucide-react";


function ApplicationDocuments({
    documents = []
}) {

    return (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#0c0c0f]">

            <div className="mb-5">

                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Documents
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Documents submitted by the applicant.
                </p>

            </div>


            {documents.length === 0 ? (

                <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center dark:border-white/10">

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        No documents found.
                    </p>

                </div>

            ) : (

                <div className="space-y-3">

                    {documents.map(
                        (document) => {

                            const file =
                                document.mediaId;

                            return (

                                <div
                                    key={
                                        file?._id ||
                                        document.documentType
                                    }
                                    className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-4 dark:border-white/10"
                                >

                                    <div className="flex min-w-0 items-center gap-3">

                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">

                                            <FileText
                                                size={20}
                                            />

                                        </div>


                                        <div className="min-w-0">

                                            <p className="truncate text-sm font-medium text-slate-900 dark:text-white">

                                                {
                                                    file?.originalName ||
                                                    document.documentType
                                                }

                                            </p>


                                            <p className="mt-1 text-xs capitalize text-slate-500 dark:text-slate-400">

                                                {
                                                    document.documentType.replace(
                                                        "_",
                                                        " "
                                                    )
                                                }

                                            </p>

                                        </div>

                                    </div>


                                    {file?.url && (

                                        <a
                                            href={
                                                file.url
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:text-blue-600 dark:border-white/10 dark:text-slate-300 dark:hover:border-blue-500/30 dark:hover:text-blue-400"
                                        >

                                            <ExternalLink
                                                size={15}
                                            />

                                            <span className="hidden sm:inline">
                                                View
                                            </span>

                                        </a>

                                    )}

                                </div>

                            );
                        }
                    )}

                </div>

            )}

        </section>
    );
}

export default ApplicationDocuments;