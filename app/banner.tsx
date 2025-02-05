import { CornerUpRight } from "lucide-react";
import Link from "next/link";

export default function Banner({
    title = "Register now",
    sub_title = "Get 10% discount",
    redirect_url = "/",
    show = true,
}: {
    title?: string;
    sub_title?: string;
    redirect_url?: string;
    show: boolean;
}) {

    if(!show) {
        return null;
    }

    return (
        <div className="absolute bottom-0 z-20 left-0 w-full p-4 flex justify-center items-center">
            <div className="right-0 grow max-w-xs bg-white p-4 shadow-lg flex justify-between rounded-xl items-center">
                <div className="flex flex-col items-center gap-0">
                    <span className="text-lg font-bold">{title}</span>
                    <span className="text-gray-500 text-sm">{sub_title}</span>
                </div>
                <Link href={redirect_url}>
                    <button className="bg-[#CCFF00] p-2 rounded-full">
                        <CornerUpRight className="h-5 w-5" />
                    </button>
                </Link>
            </div>
        </div>
    )
}