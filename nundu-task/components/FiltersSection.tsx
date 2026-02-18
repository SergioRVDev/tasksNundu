import { Plus } from "lucide-react";
import { useState } from "react";
import NewTaskModal from "./NewTaskModal";
import NewDeveloperModal from "./NewDeveloperModal";
import NewSprintModal from "./NewSprintModal";

export default function FiltersSection({ view, setView }: { view: string, setView: (view: string) => void }) {
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isDeveloperModalOpen, setIsDeveloperModalOpen] = useState(false);
    const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);

    return (
        <>
        <section className="flex items-center justify-between bg-white shadow-sm p-3 px-8 rounded-lg">
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-md">
                <button onClick={() => setView("table")} className={`flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer transition-all text-sm font-medium ${view === "table" ? "bg-white text-[#2E8BFF] shadow-sm" : "text-gray-600 hover:text-gray-900 bg-transparent"}`} >Tabla </button>
                <button onClick={() => setView("kanban")} className={`flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer transition-all text-sm font-medium ${view === "kanban" ? "bg-white text-[#2E8BFF] shadow-sm" : "text-gray-600 hover:text-gray-900 bg-transparent"}`} >Kanban </button>
            </div>
            <div className="flex gap-3">
                <button
                    onClick={() => setIsDeveloperModalOpen(true)}
                    className="bg-green-500 flex items-center gap-2 cursor-pointer hover:bg-green-600 transition-colors text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                    <Plus size={18} /> Developer
                </button>
                <button
                    onClick={() => setIsSprintModalOpen(true)}
                    className="bg-purple-500 flex items-center gap-2 cursor-pointer hover:bg-purple-600 transition-colors text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                    <Plus size={18} /> Sprint
                </button>
                <button
                    onClick={() => setIsTaskModalOpen(true)}
                    className="bg-[#2E8BFF] flex items-center gap-2 cursor-pointer hover:bg-[#2E8BFF]/80 transition-colors text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                    <Plus size={18} /> Task
                </button>
            </div>
        </section>
        {isTaskModalOpen && <NewTaskModal onClose={() => setIsTaskModalOpen(false)} /> }
        {isDeveloperModalOpen && <NewDeveloperModal onClose={() => setIsDeveloperModalOpen(false)} /> }
        {isSprintModalOpen && <NewSprintModal onClose={() => setIsSprintModalOpen(false)} /> }
        </>
    );
}
