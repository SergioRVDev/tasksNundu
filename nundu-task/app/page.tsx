"use client";
import KanbanSection from "@/components/KanbanSection";
import TableSection from "@/components/TableSection";
import { useState, useEffect } from "react";
import FiltersSection from "@/components/FiltersSection";
import { apiGet } from "@/lib/apiMethods";

interface Task {
    id: string;
    title: string;
    state: string;
    priority: string;
    developer?: string;
    assignedTo?: string;
    sprint: string;
    startDate?: string;
    endDate?: string;
    description?: string;
}

interface Filters {
    state: string;
    sprint: string;
    priority: string;
    developer: string;
}

export default function Home() {
    const [view, setView] = useState("kanban");
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filters, setFilters] = useState<Filters>({
        state: "",
        sprint: "",
        priority: "",
        developer: "",
    });

    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

    useEffect(() => {
        const fetchTasks = async () => {
            const response = await apiGet<Task[]>("/tasks");
            if (response.success && response.data) {
                setTasks(response.data);
            }
        };
        fetchTasks();
    }, []);

    useEffect(() => {
        let result = tasks;

        if (filters.state) {
            result = result.filter(t => t.state === filters.state);
        }
        if (filters.sprint) {
            result = result.filter(t => t.sprint === filters.sprint);
        }
        if (filters.priority) {
            result = result.filter(t => t.priority === filters.priority);
        }
        if (filters.developer) {
            result = result.filter(t => t.assignedTo === filters.developer);
        }

        setFilteredTasks(result);
    }, [tasks, filters]);

    const refreshTasks = async () => {
         const response = await apiGet<Task[]>("/tasks");
            if (response.success && response.data) {
                setTasks(response.data);
            }
    };

    return (
        <main className="h-full w-full p-8 gap-6 flex flex-col bg-[#FAFAFA]">
            <FiltersSection setView={setView} view={view} setFilters={setFilters} />
            {view === "kanban" ? (
                <KanbanSection tasks={filteredTasks} refreshTasks={refreshTasks} />
            ) : (
                <TableSection tasks={filteredTasks} refreshTasks={refreshTasks} />
            )}
        </main>
    );
}
