import { useState } from "react";
import { apiPost } from "@/lib/apiMethods";
import { sanitizeObject } from "@/lib/sanitizer";
import { AlertCircle, CheckCircle, Loader } from "lucide-react";

interface NewDeveloperModalProps {
    onClose: () => void;
    onSuccess?: (developer: unknown) => void;
}

export default function NewDeveloperModal({ onClose, onSuccess }: NewDeveloperModalProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
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
                email,
                role,
            },
            {
                name: { type: 'string', maxLength: 100 },
                email: { type: 'email' },
                role: { type: 'string', maxLength: 100 },
            }
        );

        if (!validationResult.success) {
            setError(Object.values(validationResult.errors || {}).join(', '));
            setLoading(false);
            return;
        }

        const sanitizedData = validationResult.data!;

        const newDeveloper = {
            name: sanitizedData.name,
            email: sanitizedData.email,
            role: sanitizedData.role || "Developer",
        };

        const response = await apiPost<unknown>("/developers", newDeveloper);

        if (response.success) {
            setSuccess(true);
            setTimeout(() => {
                setName("");
                setEmail("");
                setRole("");
                onSuccess?.(response.data);
                onClose();
                window.location.reload();
            }, 1000);
        } else {
            setError(response.error || "Failed to create developer");
            setLoading(false);
        }
    };

    return (
        <main className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] animate-in fade-in zoom-in duration-200">
                <h2 className="text-xl font-bold text-[#2E8BFF] mb-6">New Developer</h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700 text-sm">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center gap-2 text-green-700 text-sm">
                        <CheckCircle size={16} />
                        Developer created successfully!
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-gray-700">
                    <div className="mb-4 flex flex-col gap-1">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={loading}
                            className="p-2 w-full rounded-md border border-gray-300 shadow-sm focus:border-[#2E8BFF] focus:ring-[#2E8BFF] focus:outline-none sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                    </div>

                    <div className="mb-4 flex flex-col gap-1">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                            className="p-2 w-full rounded-md border border-gray-300 shadow-sm focus:border-[#2E8BFF] focus:ring-[#2E8BFF] focus:outline-none sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                    </div>

                    <div className="mb-4 flex flex-col gap-1">
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                        <input
                            type="text"
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            placeholder="e.g., Frontend Developer, Backend Developer"
                            disabled={loading}
                            className="p-2 w-full rounded-md border border-gray-300 shadow-sm focus:border-[#2E8BFF] focus:ring-[#2E8BFF] focus:outline-none sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
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
                                "Create Developer"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
