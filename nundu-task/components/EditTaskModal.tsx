import { useState, useEffect } from "react";
import { apiPut, apiDelete } from "@/lib/apiMethods";
import { sanitizeObject, isValidDate } from "@/lib/sanitizer";
import { AlertCircle, CheckCircle, Loader, Trash2 } from "lucide-react";

interface Developer {
    id: string;
    name: string;
    email: string;
    role?: string;
}

interface Sprint {
    id: string;
    name: string;
    status?: string;
}

interface Task {
    id: string;
    title: string;
    description?: string;
    priority?: string;
    assignedTo?: string;
    sprint: string;
    state: string;
    startDate?: string;
    endDate?: string;
}

interface EditTaskModalProps {
    task: Task;
    onClose: () => void;
    onSuccess?: (task: unknown) => void;
    developers: Developer[];
    sprints: Sprint[];
}

export default function EditTaskModal({ task, onClose, onSuccess, developers, sprints }: EditTaskModalProps) {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description || "");
    const [priority, setPriority] = useState(task.priority || "");
    const [assignedTo, setAssignedTo] = useState(task.assignedTo || "");
    const [sprint, setSprint] = useState(task.sprint || "Backlog");
    const [state, setState] = useState(task.state || "to-do");
    const [startDate, setStartDate] = useState(task.startDate || "");
    const [endDate, setEndDate] = useState(task.endDate || "");
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        // Validar y sanitizar entrada
        const validationResult = sanitizeObject(
            {
                title,
                description,
                priority,
                state,
            },
            {
                title: { type: 'string', maxLength: 200 },
                description: { type: 'string', maxLength: 1000 },
                priority: { type: 'string', maxLength: 20 },
                state: { type: 'string', maxLength: 20 },
            }
        );

        if (!validationResult.success) {
            setError(Object.values(validationResult.errors || {}).join(', '));
            setLoading(false);
            return;
        }

        // Validar fechas
        if (startDate && !isValidDate(startDate)) {
            setError("Start date is invalid");
            setLoading(false);
            return;
        }

        if (endDate && !isValidDate(endDate)) {
            setError("End date is invalid");
            setLoading(false);
            return;
        }

        const sanitizedData = validationResult.data!;

        const updatedTask = {
            title: sanitizedData.title,
            description: sanitizedData.description,
            priority: sanitizedData.priority || "Medium",
            assignedTo: assignedTo || "unassigned",
            sprint: sprint || "Backlog",
            state: sanitizedData.state || "to-do",
            startDate: startDate || null,
            endDate: endDate || null,
        };

        const response = await apiPut<unknown>(`/tasks/${task.id}`, updatedTask);

        if (response.success) {
            setSuccess(true);
            setTimeout(() => {
                onSuccess?.(response.data);
                onClose();
                window.location.reload();
            }, 1000);
        } else {
            setError(response.error || "Failed to update task");
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("¿Estás seguro de que deseas eliminar esta tarea?")) return;

        setDeleting(true);
        const response = await apiDelete(`/tasks/${task.id}`);

        if (response.success) {
            setSuccess(true);
            setTimeout(() => {
                onClose();
                window.location.reload();
            }, 1000);
        } else {
            setError(response.error || "Failed to delete task");
            setDeleting(false);
        }
    };

    return (
        <main className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-[#2E8BFF]">Edit Task</h2>
                    <button
                        onClick={handleDelete}
                        disabled={loading || deleting}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete task"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700 text-sm">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center gap-2 text-green-700 text-sm">
                        <CheckCircle size={16} />
                        Task updated successfully!
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-gray-700">
                    <div className="mb-4 flex flex-col gap-1">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            disabled={loading || deleting}
                            className="p-2 w-full rounded-md border border-gray-300 shadow-sm focus:border-[#2E8BFF] focus:ring-[#2E8BFF] focus:outline-none sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                    </div>

                    <div className="mb-4 flex gap-4 w-full">
                        <div className="w-full flex flex-col gap-1">
                            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
                            <select
                                id="priority"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                disabled={loading || deleting}
                                className="cursor-pointer p-2 w-full rounded-md border border-gray-300 shadow-sm focus:border-[#2E8BFF] focus:ring-[#2E8BFF] focus:outline-none sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                                <option value="">Select Priority</option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                        <div className="w-full flex flex-col gap-1">
                            <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700">Assigned To</label>
                            <select
                                id="assignedTo"
                                value={assignedTo}
                                onChange={(e) => setAssignedTo(e.target.value)}
                                disabled={loading || deleting}
                                className="cursor-pointer p-2 w-full rounded-md border border-gray-300 shadow-sm focus:border-[#2E8BFF] focus:ring-[#2E8BFF] focus:outline-none sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                                <option value="">Unassigned</option>
                                {developers.map((dev) => (
                                    <option key={dev.id} value={dev.id}>
                                        {dev.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mb-4 flex gap-4 w-full">
                        <div className="w-full flex flex-col gap-1">
                            <label htmlFor="sprint" className="block text-sm font-medium text-gray-700">Sprint</label>
                            <select
                                id="sprint"
                                value={sprint}
                                onChange={(e) => setSprint(e.target.value)}
                                disabled={loading || deleting}
                                className="cursor-pointer p-2 w-full rounded-md border border-gray-300 shadow-sm focus:border-[#2E8BFF] focus:ring-[#2E8BFF] focus:outline-none sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                                <option value="Backlog">Backlog</option>
                                {sprints.map((s) => (
                                    <option key={s.id} value={s.name}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full flex flex-col gap-1">
                            <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                            <select
                                id="state"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                disabled={loading || deleting}
                                className="cursor-pointer p-2 w-full rounded-md border border-gray-300 shadow-sm focus:border-[#2E8BFF] focus:ring-[#2E8BFF] focus:outline-none sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                                <option value="to-do">To Do</option>
                                <option value="in-progress">In Progress</option>
                                <option value="to-validate">To Validate</option>
                                <option value="done">Done</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-4 flex flex-col gap-1">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            id="description"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={loading || deleting}
                            className="p-2 w-full rounded-md border border-gray-300 shadow-sm focus:border-[#2E8BFF] focus:ring-[#2E8BFF] focus:outline-none sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                        ></textarea>
                    </div>

                    <div className="mb-4 flex gap-4 w-full">
                        <div className="w-full flex flex-col gap-1">
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                            <input
                                type="date"
                                id="startDate"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                disabled={loading || deleting}
                                className="p-2 w-full rounded-md border border-gray-300 shadow-sm focus:border-[#2E8BFF] focus:ring-[#2E8BFF] focus:outline-none sm:text-sm cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                        </div>
                        <div className="w-full flex flex-col gap-1">
                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
                            <input
                                type="date"
                                id="endDate"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                disabled={loading || deleting}
                                className="p-2 w-full rounded-md border border-gray-300 shadow-sm focus:border-[#2E8BFF] focus:ring-[#2E8BFF] focus:outline-none sm:text-sm cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading || deleting}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || deleting}
                            className="px-4 py-2 text-sm font-medium text-white bg-[#2E8BFF] rounded-md hover:bg-[#2E8BFF]/80 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader size={16} className="animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                "Update Task"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
