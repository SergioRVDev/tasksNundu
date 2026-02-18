import { useState } from "react";


export default function NewTaskModal({ onClose }: { onClose: () => void }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("");
    const [developer, setDeveloper] = useState("");
    const [sprint, setSprint] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newTask = {
            title,
            description,
            priority,
            developer,
            sprint: "Sprint 1", // Default for now or add input
            state: "to-do",
            startDate: startDate || "-",
            endDate: endDate || "-",
        };

        try {
            const res = await fetch("http://localhost:3001/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newTask),
            });
            if (res.ok) {
                onClose();
                window.location.reload(); // Simple reload to refresh data
            }
        } catch (error) {
            console.error("Error creating task:", error);
        }
    };

    return (
        <main className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] animate-in fade-in zoom-in duration-200">
                <h2 className="text-xl font-bold text-[#2E8BFF] mb-6">New Task</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-gray-700">
                    <div className="mb-4 flex flex-col gap-1">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                        <input 
                            type="text" 
                            id="title" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="p-2 w-full rounded-md border border-gray-300 shadow-sm focus:border-[#2E8BFF] focus:ring-[#2E8BFF] focus:outline-none sm:text-sm" 
                        />
                    </div>
                    <div className="mb-4 flex gap-4 w-full">
                        <div className="w-full flex flex-col gap-1">
                            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
                            <select 
                                id="priority" 
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="cursor-pointer p-2 w-full rounded-md border border-gray-300 shadow-sm focus:border-[#2E8BFF] focus:ring-[#2E8BFF] focus:outline-none sm:text-sm"
                            >
                                <option value="">Select Priority</option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                        <div className="w-full flex flex-col gap-1">
                            <label htmlFor="developer" className="block text-sm font-medium text-gray-700">Developer</label>
                            <select 
                                id="developer" 
                                value={developer}
                                onChange={(e) => setDeveloper(e.target.value)}
                                className="cursor-pointer p-2 w-full rounded-md border border-gray-300 shadow-sm focus:border-[#2E8BFF] focus:ring-[#2E8BFF] focus:outline-none sm:text-sm"
                            >
                                <option value="unassigned">Unassigned</option>
                                <option value="Juan Ramos">Juan Ramos</option>
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
                            className="p-2 w-full rounded-md border border-gray-300 shadow-sm focus:border-[#2E8BFF] focus:ring-[#2E8BFF] focus:outline-none sm:text-sm"
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
                                className="p-2 w-full rounded-md border border-gray-300 shadow-sm focus:border-[#2E8BFF] focus:ring-[#2E8BFF] focus:outline-none sm:text-sm cursor-pointer" 
                            />
                        </div>
                        <div className="w-full flex flex-col gap-1">
                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
                            <input 
                                type="date" 
                                id="endDate" 
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="p-2 w-full rounded-md border border-gray-300 shadow-sm focus:border-[#2E8BFF] focus:ring-[#2E8BFF] focus:outline-none sm:text-sm cursor-pointer" 
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className=" px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-[#2E8BFF] rounded-md hover:bg-[#2E8BFF]/80 cursor-pointer">Create Task</button>
                    </div>
                </form>
            </div>
        </main>
    );
}