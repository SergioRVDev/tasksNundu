import { useEffect, useState } from "react";
import { Edit, Trash } from "lucide-react";

export default function TableSection() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3001/tasks")
            .then((res) => res.json())
            .then((data) => setTasks(data))
            .catch((err) => console.error("Error fetching tasks:", err));
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this task?")) return;
        
        try {
            await fetch(`http://localhost:3001/tasks/${id}`, { method: "DELETE" });
            setTasks(tasks.filter((task: any) => task.id !== id));
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

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
                        {tasks.map((task: any) => (
                            <tr key={task.id} className="bg-white hover:bg-gray-50 transition-colors group">
                                <td className="p-4 border-b border-gray-100 pl-2 align-middle text-gray-500 font-medium">{task.id}</td>
                                <td className="p-4 border-b border-gray-100 align-middle font-medium text-gray-800">{task.title}</td>
                                <td className="p-4 border-b border-gray-100 align-middle">
                                    <span className="px-3 py-1 rounded-md bg-gray-100 text-gray-600 font-medium text-xs border border-gray-200 uppercase tracking-wide">
                                        {task.state}
                                    </span>
                                </td>
                                <td className="p-4 border-b border-gray-100 align-middle font-semibold text-green-600">{task.priority}</td>
                                <td className="p-4 border-b border-gray-100 align-middle text-gray-500">{task.developer}</td>
                                <td className="p-4 border-b border-gray-100 align-middle text-gray-600">{task.sprint}</td>
                                <td className="p-4 border-b border-gray-100 align-middle text-gray-400">{task.startDate}</td>
                                <td className="p-4 border-b border-gray-100 align-middle text-gray-400">{task.endDate}</td>
                                <td className="p-4 border-b border-gray-100">
                                    <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors cursor-pointer">
                                            <Edit size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(task.id)} className="p-2 rounded-md bg-red-100 hover:bg-red-200 text-red-600 transition-colors cursor-pointer">
                                            <Trash size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}