import { useState } from "react";
import { apiPost } from "@/lib/apiMethods";
import { sanitizeObject, isValidDate } from "@/lib/sanitizer";
import { AlertCircle, CheckCircle, Loader } from "lucide-react";

interface NewSprintModalProps {
    onClose: () => void;
    onSuccess?: (sprint: unknown) => void;
}

export default function NewSprintModal({ onClose, onSuccess }: NewSprintModalProps) {
    const [name, setName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [status, setStatus] = useState("planning");
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
                name,
                status,
            },
            {
                name: { type: 'string', maxLength: 100 },
                status: { type: 'string', maxLength: 50 },
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

        const newSprint = {
            name: sanitizedData.name,
            startDate: startDate || null,
            endDate: endDate || null,
            status: sanitizedData.status || "planning",
        };

        const response = await apiPost<unknown>("/sprints", newSprint);

        if (response.success) {
            setSuccess(true);
            setTimeout(() => {
                setName("");
                setStartDate("");
                setEndDate("");
                setStatus("planning");
                onSuccess?.(response.data);
                onClose();
                window.location.reload();
            }, 1000);
        } else {
            setError(response.error || "Failed to create sprint");
            setLoading(false);
        }
    };

    return (
        <main className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] animate-in fade-in zoom-in duration-200">
                <h2 className="text-xl font-bold text-[#2E8BFF] mb-6">New Sprint</h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700 text-sm">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center gap-2 text-green-700 text-sm">
                        <CheckCircle size={16} />
                        Sprint created successfully!
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-gray-700">
                    <div className="mb-4 flex flex-col gap-1">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Sprint Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Sprint 1, Sprint 2"
                            required
                            disabled={loading}
                            className="p-2 w-full rounded-md border border-gray-300 shadow-sm focus:border-[#2E8BFF] focus:ring-[#2E8BFF] focus:outline-none sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
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

                    <div className="mb-4 flex flex-col gap-1">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                        <select
                            id="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            disabled={loading}
                            className="cursor-pointer p-2 w-full rounded-md border border-gray-300 shadow-sm focus:border-[#2E8BFF] focus:ring-[#2E8BFF] focus:outline-none sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                            <option value="planning">Planning</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                        </select>
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
                                "Create Sprint"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
