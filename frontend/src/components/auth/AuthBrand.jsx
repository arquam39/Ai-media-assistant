import { Sparkles } from "lucide-react";

function AuthBrand() {
    return (
        <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                <Sparkles size={18} />
            </div>

            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                MediaAI
            </span>
        </div>
    );
}

export default AuthBrand;