import { LayoutDashboard, LogOut } from "lucide-react";

export default function Header() {
    return (
        <header className="bg-white shadow-sm p-3 px-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <LayoutDashboard color="#a7ceffff" size={32} />
                    <h1 className="text-2xl font-bold text-[#2E8BFF]">Nundu Task</h1>
                </div>
                <div className="flex items-center gap-2">
                    <div className="text-right text-gray-600">
                        <p className="font-bold">User</p>
                        <p className="text-sm">user@nundutask.com</p>
                    </div>
                    <div className="bg-[#BFDCFF] rounded-full p-2 px-4">
                        <p className="text-xl font-bold text-[#2E8BFF]">U</p>
                    </div>
                    <LogOut className="text-gray-600 cursor-pointer" />
                </div>
            </div>
        </header>
    );
}