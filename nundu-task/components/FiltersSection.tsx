import { Plus, X } from "lucide-react";
import { useState, useEffect } from "react";
import { apiGet } from "@/lib/apiMethods";
import NewTaskModal from "./NewTaskModal";
import NewDeveloperModal from "./NewDeveloperModal";
import NewSprintModal from "./NewSprintModal";

interface Filters {
    state: string;
    sprint: string;
    priority: string;
    developer: string;
}

interface Developer {
    id: string;
    name: string;
}

interface Sprint {
    id: string;
    name: string;
}

export default function FiltersSection({
    view,
    setView,
    setFilters
}: {
    view: string,
    setView: (view: string) => void,
    setFilters: (filters: Filters) => void
}) {
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isDeveloperModalOpen, setIsDeveloperModalOpen] = useState(false);
    const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);

    const [developers, setDevelopers] = useState<Developer[]>([]);
    const [sprints, setSprints] = useState<Sprint[]>([]);

    const [stateFilter, setStateFilter] = useState("");
    const [sprintFilter, setSprintFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");
    const [developerFilter, setDeveloperFilter] = useState("");

    useEffect(() => {
        const fetchOptions = async () => {
            const devRes = await apiGet<Developer[]>("/developers");
            const sprintRes = await apiGet<Sprint[]>("/sprints");
            if (devRes.success && devRes.data) setDevelopers(devRes.data);
            if (sprintRes.success && sprintRes.data) setSprints(sprintRes.data);
        };
        fetchOptions();
    }, []);

    const updateFilters = (key: keyof Filters, value: string) => {
        const newFilters = {
            state: key === 'state' ? value : stateFilter,
            sprint: key === 'sprint' ? value : sprintFilter,
            priority: key === 'priority' ? value : priorityFilter,
            developer: key === 'developer' ? value : developerFilter,
        };

        switch (key) {
            case 'state': setStateFilter(value); break;
            case 'sprint': setSprintFilter(value); break;
            case 'priority': setPriorityFilter(value); break;
            case 'developer': setDeveloperFilter(value); break;
        }

        setFilters(newFilters);
    };

    const clearFilters = () => {
        setStateFilter("");
        setSprintFilter("");
        setPriorityFilter("");
        setDeveloperFilter("");
        setFilters({ state: "", sprint: "", priority: "", developer: "" });
    };

    return (
        <>
            <section className="flex items-center justify-between bg-white shadow-sm p-3 px-8 rounded-lg">
                <div className="flex items-center gap-4">

                    <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-md">
                        <button onClick={() => setView("table")} className={`flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer transition-all text-sm font-medium ${view === "table" ? "bg-white text-[#2E8BFF] shadow-sm" : "text-gray-600 hover:text-gray-900 bg-transparent"}`} >Tabla </button>
                        <button onClick={() => setView("kanban")} className={`flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer transition-all text-sm font-medium ${view === "kanban" ? "bg-white text-[#2E8BFF] shadow-sm" : "text-gray-600 hover:text-gray-900 bg-transparent"}`} >Kanban </button>
                    </div>

                    <div className="flex items-center gap-2 border-l border-gray-200 pl-4 ml-2">
                        <select
                            value={sprintFilter}
                            onChange={(e) => updateFilters('sprint', e.target.value)}
                            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-[#2E8BFF] focus:border-[#2E8BFF] block p-2 cursor-pointer"
                        >
                            <option value="">All Sprints</option>
                            {sprints.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                        </select>

                        <select
                            value={stateFilter}
                            onChange={(e) => updateFilters('state', e.target.value)}
                            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-[#2E8BFF] focus:border-[#2E8BFF] block p-2 cursor-pointer"
                        >
                            <option value="">All States</option>
                            <option value="to-do">To Do</option>
                            <option value="in-progress">In Progress</option>
                            <option value="to-validate">To Validate</option>
                            <option value="done">Done</option>
                        </select>

                        <select
                            value={priorityFilter}
                            onChange={(e) => updateFilters('priority', e.target.value)}
                            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-[#2E8BFF] focus:border-[#2E8BFF] block p-2 cursor-pointer"
                        >
                            <option value="">All Priorities</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>

                        <select
                            value={developerFilter}
                            onChange={(e) => updateFilters('developer', e.target.value)}
                            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-[#2E8BFF] focus:border-[#2E8BFF] block p-2 w-[150px] cursor-pointer"
                        >
                            <option value="">All Developers</option>
                            {developers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>

                        {(stateFilter || sprintFilter || priorityFilter || developerFilter) && (
                            <button
                                onClick={clearFilters}
                                className="text-gray-400 hover:text-red-500 transition-colors p-2"
                                title="Clear Filters"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>
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
            {isTaskModalOpen && <NewTaskModal onClose={() => setIsTaskModalOpen(false)} />}
            {isDeveloperModalOpen && <NewDeveloperModal onClose={() => setIsDeveloperModalOpen(false)} />}
            {isSprintModalOpen && <NewSprintModal onClose={() => setIsSprintModalOpen(false)} />}
        </>
    );
}
