import { useState } from "react";
import { apiPost } from "@/lib/apiMethods";
import { sanitizeObject, isValidDate } from "@/lib/sanitizer";
import { AlertCircle, CheckCircle, Loader } from "lucide-react";

interface NewTaskModalProps {
    onClose: () => void;
    onSuccess?: (task: unknown) => void;
}

export default function NewTaskModal({ onClose, onSuccess }: NewTaskModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("");
    const [assignedTo, setAssignedTo] = useState("");
    const [sprint, setSprint] = useState("Backlog");
    const [state, setState] = useState("to-do");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [loading, setLoading] = useState(false);
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

        const newTask = {
            title: sanitizedData.title,
            description: sanitizedData.description,
            priority: sanitizedData.priority || "Medium",
            assignedTo: assignedTo || "unassigned",
            sprint,
            state: sanitizedData.state || "to-do",
            startDate: startDate || null,
            endDate: endDate || null,
        };

        const response = await apiPost<unknown>("/tasks", newTask);

        if (response.success) {
            setSuccess(true);
            setTimeout(() => {
                setTitle("");
                setDescription("");
                setPriority("");
                setAssignedTo("");
                setSprint("Backlog");
                setState("to-do");
                setStartDate("");
                setEndDate("");
                onSuccess?.(response.data);
                onClose();
                window.location.reload();
            }, 1000);
        } else {
            setError(response.error || "Failed to create task");
            setLoading(false);
        }
    };

    return (
        <main className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] animate-in fade-in zoom-in duration-200">
                <h2 className="text-xl font-bold text-[#2E8BFF] mb-6">New Task</h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700 text-sm">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center gap-2 text-green-700 text-sm">
                        <CheckCircle size={16} />
                        Task created successfully!
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
                            disabled={loading}
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
                                disabled={loading}
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
                                disabled={loading}
                                className="cursor-pointer p-2 w-full rounded-md border border-gray-300 shadow-sm focus:border-[#2E8BFF] focus:ring-[#2E8BFF] focus:outline-none sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                                <option value="">Unassigned</option>
                                <option value="Juan Ramos">Juan Ramos</option>
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
                                disabled={loading}
                                className="cursor-pointer p-2 w-full rounded-md border border-gray-300 shadow-sm focus:border-[#2E8BFF] focus:ring-[#2E8BFF] focus:outline-none sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                                <option value="Backlog">Backlog</option>
                                <option value="Sprint 1">Sprint 1</option>
                                <option value="Sprint 2">Sprint 2</option>
                            </select>
                        </div>
                        <div className="w-full flex flex-col gap-1">
                            <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                            <select
                                id="state"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                disabled={loading}
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
                            disabled={loading}
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
                                disabled={loading}
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
                                disabled={loading}
                                className="p-2 w-full rounded-md border border-gray-300 shadow-sm focus:border-[#2E8BFF] focus:ring-[#2E8BFF] focus:outline-none sm:text-sm cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-[#2E8BFF] rounded-md hover:bg-[#2E8BFF]/80 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader size={16} className="animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Task"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
