import { useEffect, useState } from "react";
import { Edit, Trash } from "lucide-react";
import { apiGet, apiDelete } from "@/lib/apiMethods";

interface Developer {
    id: string;
    name: string;
    email: string;
    role?: string;
}

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

interface TableSectionProps {
    tasks: Task[];
    refreshTasks: () => Promise<void>;
}

export default function TableSection({ tasks, refreshTasks }: TableSectionProps) {
    const [developers, setDevelopers] = useState<Developer[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        fetchDevelopers();
    }, [tasks]);

    const fetchDevelopers = async () => {
        setLoading(true);
        const devsResponse = await apiGet<Developer[]>("/developers");

        if (devsResponse.success && devsResponse.data) {
            setDevelopers(devsResponse.data);
        }
        setLoading(false);
    };

    const getDeveloperName = (assignedTo: string | undefined): string => {
        if (!assignedTo || assignedTo === "unassigned") {
            return "Unassigned";
        }
        const dev = developers.find(d => d.id === assignedTo);
        return dev ? dev.name : assignedTo;
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this task?")) return;

        setDeleting(id);
        const response = await apiDelete(`/tasks/${id}`);

        if (response.success) {
            refreshTasks();
        } else {
            console.error("Error deleting task:", response.error);
            alert(`Error: ${response.error}`);
        }
        setDeleting(null);
    };

    if (loading) {
        return (
            <section className="h-full flex flex-col items-center justify-center bg-white shadow-sm p-3 px-8 rounded-lg">
                <p className="text-gray-500">Loading tasks...</p>
            </section>
        );
    }

    return (
        <section className="h-full flex flex-col bg-white shadow-sm p-3 px-8 rounded-lg overflow-hidden">
            <div className="overflow-auto w-full h-full bg-[#FAFAFA]">
                <table className="w-full text-left border-separate border-spacing-y-4">
                    <thead className="">
                        <tr className="text-gray-500 text-sm font-semibold ">
                            <th className="p-4">ID</th>
                            <th className="p-4">Title</th>
                            <th className="p-4">State</th>
                            <th className="p-4">Priority</th>
                            <th className="p-4">Developer</th>
                            <th className="p-4">Sprint</th>
                            <th className="p-4">Start Date</th>
                            <th className="p-4">End Date</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-gray-700">
                        {tasks.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="p-4 text-center text-gray-400">
                                    No tasks found
                                </td>
                            </tr>
                        ) : (
                            tasks.map((task) => (
                                <tr key={task.id} className="bg-white hover:bg-gray-50 transition-colors group">
                                    <td className="p-4 border-b border-gray-100 pl-2 align-middle text-gray-500 font-medium text-xs truncate max-w-[120px]">
                                        {task.id.substring(0, 8)}...
                                    </td>
                                    <td className="p-4 border-b border-gray-100 align-middle font-medium text-gray-800">
                                        {task.title}
                                    </td>
                                    <td className="p-4 border-b border-gray-100 align-middle">
                                        <span className="px-3 py-1 rounded-md bg-gray-100 text-gray-600 font-medium text-xs border border-gray-200 uppercase tracking-wide">
                                            {task.state}
                                        </span>
                                    </td>
                                    <td className="p-4 border-b border-gray-100 align-middle font-semibold text-green-600">
                                        {task.priority}
                                    </td>
                                    <td className="p-4 border-b border-gray-100 align-middle text-gray-500">
                                        {getDeveloperName(task.assignedTo)}
                                    </td>
                                    <td className="p-4 border-b border-gray-100 align-middle text-gray-600">
                                        {task.sprint}
                                    </td>
                                    <td className="p-4 border-b border-gray-100 align-middle text-gray-400">
                                        {task.startDate || "-"}
                                    </td>
                                    <td className="p-4 border-b border-gray-100 align-middle text-gray-400">
                                        {task.endDate || "-"}
                                    </td>
                                    <td className="p-4 border-b border-gray-100">
                                        <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(task.id)}
                                                disabled={deleting === task.id}
                                                className="p-2 rounded-md bg-red-100 hover:bg-red-200 text-red-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Trash size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
