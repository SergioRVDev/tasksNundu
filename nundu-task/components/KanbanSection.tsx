import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function KanbanSection() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3001/tasks")
            .then((res) => res.json())
            .then((data) => setTasks(data))
            .catch((err) => console.error(err));
    }, []);

    const TASK_STATES = [
        { id: "to-do", name: "To Do", color: "bg-gray-100" },
        { id: "in-progress", name: "In Progress", color: "bg-gray-100" },
        { id: "to-validate", name: "To Validate", color: "bg-gray-100" },
        { id: "done", name: "Done", color: "bg-gray-100" },
    ];

    const onDragEnd = async (result: any) => {
        if (!result.destination) return;

        const { source, destination, draggableId } = result;

        if (source.droppableId === destination.droppableId) return;

        // Optimistic update
        const newTasks = tasks.map((t: any) => 
            t.id === draggableId ? { ...t, state: destination.droppableId } : t
        );
        setTasks(newTasks);

        try {
            await fetch(`http://localhost:3001/tasks/${draggableId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ state: destination.droppableId }),
            });
        } catch (error) {
            console.error("Error updating task state:", error);
            // Revert changes if API fails (optional, but good practice)
        }
    };

    return (
        <main className="h-full w-full flex flex-col gap-8">
            <DragDropContext onDragEnd={onDragEnd}>
                <section className="grid grid-cols-4 gap-3 items-start justify-between bg-white shadow-sm p-3 rounded-lg h-full overflow-hidden">
                    {TASK_STATES.map((state) => {
                        const columnTasks = tasks.filter((t: any) => t.state === state.id);
                        return (
                            <div key={state.id} className="w-full h-full bg-[#FAFAFA] rounded-lg p-4 flex flex-col gap-4 overflow-hidden">
                                <div className="flex items-center justify-between">
                                    <h1 className="text-base font-bold text-gray-600 w-full text-left">{state.name}</h1>
                                    <span className="text-sm font-bold text-gray-600 bg-gray-200 px-2 py-0.5 rounded-full">{columnTasks.length}</span>
                                </div>
                                <Droppable droppableId={state.id}>
                                    {(provided) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className="flex flex-col gap-3 overflow-y-auto max-h-full h-full pb-2"
                                        >
                                            {columnTasks.map((task: any, index: number) => (
                                                <Draggable key={task.id} draggableId={task.id} index={index}>
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className="bg-white rounded-lg p-4 flex flex-col gap-2 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                                                            style={{ ...provided.draggableProps.style }}
                                                        >
                                                            <div className="flex items-center justify-start gap-2">
                                                                <p className="bg-[#DBEAFF] w-fit text-xs font-medium text-[#2E8BFF] px-2 py-1 rounded-md">{task.sprint}</p>
                                                                <p className={`w-fit text-xs font-medium px-2 py-1 rounded-md ${task.priority === 'High' ? 'bg-[#FFD1DC] text-[#FF0000]' : 'bg-gray-100 text-gray-600'}`}>{task.priority}</p>
                                                            </div>
                                                            <h2 className="text-sm font-bold text-gray-700 line-clamp-2">{task.title}</h2>
                                                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                                                                <div className="flex flex-col">
                                                                    <span className="text-[10px] text-gray-400">Developer</span>
                                                                    <span className="text-xs font-medium text-gray-600">{task.developer}</span>
                                                                </div>
                                                                {task.endDate !== "-" && (
                                                                    <div className="flex flex-col items-end">
                                                                        <span className="text-[10px] text-gray-400">Due</span>
                                                                        <span className="text-xs font-medium text-gray-600">{task.endDate}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        );
                    })}
                </section>
            </DragDropContext>
        </main>
    );
}