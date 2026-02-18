import { useState } from "react";


export default function NewTaskModal({ onClose }: { onClose: () => void }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("");
    const [developer, setDeveloper] = useState("");
    const [sprint, setSprint] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    return (
        <main className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
                <h2 className="text-xl text-[#2E8BFF] mb-4">New Task</h2>
                <form className="flex flex-col gap-4 text-gray-700">
                    <div className="mb-4 flex flex-col gap-1">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                        <input type="text" id="title" className=" p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                    </div>
                    <div className="mb-4 flex gap-4 w-full">
                        <div className="w-full flex flex-col gap-1">
                            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
                            <select id="priority" className="cursor-pointer p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                        <div className="w-full flex flex-col gap-1">
                            <label htmlFor="developer" className="block text-sm font-medium text-gray-700">Developer</label>
                            <select id="developer" className="cursor-pointer p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                                <option value="unassigned">Unassigned</option>
                                <option value="juan">Juan Ramos</option>
                            </select>
                        </div>
                    </div>
                    <div className="mb-4 flex flex-col gap-1">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea id="description" rows={3} className=" p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
                    </div>

                    <div className="mb-4 flex gap-4 w-full">
                        <div className="w-full flex flex-col gap-1">
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                            <input type="date" id="startDate" className=" p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm cursor-pointer" />
                        </div>
                        <div className="w-full flex flex-col gap-1">
                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
                            <input type="date" id="endDate" className=" p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm cursor-pointer" />
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