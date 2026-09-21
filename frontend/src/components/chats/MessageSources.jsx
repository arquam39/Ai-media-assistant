import {
    FileText,
    Image
} from "lucide-react";

import {
    useNavigate
} from "react-router-dom";


function MessageSources({
    sources = []
}) {

    const navigate = useNavigate();

    if (!sources.length) {
        return null;
    }


    return (
        <div className="mt-3">

            <p className="mb-2 text-xs font-medium text-gray-500">
                Sources
            </p>


            <div className="flex flex-wrap gap-3">

                {sources.map((source, index) => {

                    const isImage =
                        source.mimeType?.startsWith(
                            "image/"
                        );


                    const Icon =
                        isImage
                            ? Image
                            : FileText;


                    return (

                        <div
                            key={
                                source.mediaId ||
                                index
                            }
                        >

                            {isImage ? (

                                // =========================
                                // Image Source
                                // =========================

                                <div
                                    className="
                                        w-64
                                        cursor-pointer
                                        overflow-hidden
                                        rounded-lg
                                        border
                                        border-gray-300
                                        bg-gray-100
                                        shadow-sm
                                        transition
                                        hover:border-gray-400
                                    "
                                    onClick={() =>
                                        navigate(
                                            `/media/${source.mediaId}`
                                        )
                                    }
                                >

                                    <img
                                        src={source.url}
                                        alt={
                                            source.fileName
                                        }
                                        className="
                                            h-48
                                            w-full
                                            object-cover
                                        "
                                    />


                                    <div className="flex items-center gap-2 px-3 py-2">

                                        <Image
                                            size={16}
                                            className="
                                                shrink-0
                                                text-gray-600
                                            "
                                        />

                                        <span className="
                                            truncate
                                            text-sm
                                            text-gray-900
                                        ">
                                            {source.fileName}
                                        </span>

                                    </div>

                                </div>

                            ) : (

                                // =========================
                                // PDF / Other Source
                                // =========================

                                <div
                                    className="
                                        inline-flex
                                        cursor-pointer
                                        items-center
                                        gap-2
                                        rounded-lg
                                        border
                                        border-gray-300
                                        bg-gray-100
                                        px-3
                                        py-2
                                        text-sm
                                        text-gray-900
                                        shadow-sm
                                        transition
                                        hover:border-gray-400
                                        hover:bg-gray-200
                                    "
                                    onClick={() =>
                                        navigate(
                                            `/media/${source.mediaId}`
                                        )
                                    }
                                >

                                    <Icon
                                        size={16}
                                        className="
                                            shrink-0
                                            text-gray-600
                                        "
                                    />

                                    <span className="
                                        max-w-55
                                        truncate
                                        text-gray-900
                                    ">
                                        {source.fileName}
                                    </span>

                                </div>

                            )}

                        </div>

                    );

                })}

            </div>

        </div>
    );
}


export default MessageSources;