const MOCK_TASKS = [
    {
        id: "task-1",
        title: "[SEC-01] Validador de Código (Sanitizer)",
        state: "to-do",
        priority: "Low",
        developer: "unassigned",
        sprint: "Sprint 4",
        startDate: "-",
        endDate: "-",
    },
    {
        id: "task-2",
        title: "[AUTH-01] Login Component Runtime",
        state: "to-do",
        priority: "Low",
        developer: "Juan Ramos",
        sprint: "Sprint 6",
        startDate: "-",
        endDate: "-",
    },
    {
        id: "task-3",
        title: "[UI-02] Componente Formulario Conectado",
        state: "to-do",
        priority: "Low",
        developer: "unassigned",
        sprint: "Sprint 6",
        startDate: "-",
        endDate: "-",
    },
];

export default function TableSection() {
    return (
        <section className="h-full flex flex-col bg-white shadow-sm p-3 rounded-lg overflow-hidden">
            <div className="overflow-auto w-full h-full bg-[#FAFAFA]"> 
                <table className="w-full text-left">
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
                        {MOCK_TASKS.map((task) => (
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
                                    <div className="flex items- gap-2">
                                        <button className="px-3 py-1.5 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-medium transition-colors cursor-pointer">
                                            Editar
                                        </button>
                                        <button className="px-3 py-1.5 rounded-md bg-red-500 hover:bg-red-600 text-white text-xs font-medium transition-colors cursor-pointer">
                                            Borrar
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