import { Plus } from "lucide-react";
import { useState } from "react";
import NewTaskModal from "./NewTaskModal";

export default function FiltersSection({ view, setView }: { view: string, setView: (view: string) => void }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <>
        <section className="flex items-center justify-between bg-white shadow-sm p-3 px-8 rounded-lg">
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-md">
                <button onClick={() => setView("table")} className={`flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer transition-all text-sm font-medium ${view === "table" ? "bg-white text-[#2E8BFF] shadow-sm" : "text-gray-600 hover:text-gray-900 bg-transparent"}`} >Tabla </button>
                <button onClick={() => setView("kanban")} className={`flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer transition-all text-sm font-medium ${view === "kanban" ? "bg-white text-[#2E8BFF] shadow-sm" : "text-gray-600 hover:text-gray-900 bg-transparent"}`} >Kanban </button>
            </div>
            <div>
                <button onClick={() => setIsModalOpen(true)} className="bg-[#2E8BFF] flex items-center gap-2 cursor-pointer hover:bg-[#2E8BFF]/80 transition-colors text-white px-4 py-2 rounded-lg"><Plus /> Add Task </button>
            </div>
        </section>
        {isModalOpen && <NewTaskModal onClose={() => setIsModalOpen(false)} /> }
        </>
    );
}