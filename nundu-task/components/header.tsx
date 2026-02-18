import { LayoutDashboard } from "lucide-react";

export default function Header() {
    return (
        <header className="bg-white shadow-sm p-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <LayoutDashboard />
                    <h1 className="text-2xl font-bold text-blue-500">Nundu Task</h1>
                </div>
                <div className="flex items-center">
                    <div>
                        <p>U</p>
                    </div>
                </div>
            </div>
        </header>
    );
}