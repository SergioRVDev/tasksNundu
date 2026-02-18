"use client";
import FiltersSection from "./FiltersSection";

export default function KanbanSection() {

    const TASK_STATES = [
        {
            id: 1,
            name: "To Do",
            color: "bg-gray-100",
        },
        {
            id: 2,
            name: "In Progress",
            color: "bg-gray-100",
        },
        {
            id: 3,
            name: "To Validate",
            color: "bg-gray-100",
        },
        {
            id: 4,
            name: "Done",
            color: "bg-gray-100",
        },
    ];
    return (
        <main className="h-full w-full flex flex-col gap-8">
            <section className="grid grid-cols-4 gap-3 items-center justify-between bg-white shadow-sm p-3 rounded-lg h-full">
                {TASK_STATES.map((state) => (
                    <div key={state.id} className="w-full h-full bg-[#FAFAFA] rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-base font-bold text-gray-600 w-full text-left">{state.name}</h1>
                            <span className="text-sm font-bold text-gray-600 w-full text-right">0</span>
                        </div>
                        <div className="flex flex-col gap-2 mt-4">
                            <div className="bg-white rounded-lg p-4 flex flex-col gap-2 shadow-sm">
                                <div className="flex items-center justify-left gap-2">
                                    <p className="bg-[#DBEAFF] w-fit text-sm text-[#2E8BFF] px-2 py-1 rounded-md">Sprint 1</p>
                                    <p className="bg-[#FFD1DC] w-fit text-sm text-[#FF0000] px-2 py-1 rounded-md">High</p>
                                </div>
                                <h2 className="text-base font-bold text-gray-600">Create Login-Auth with Google</h2>
                                <div className="flex flex-col gap-2 bg-[#FAFAFA] p-2 rounded-md">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-600">Developer:</p>
                                        <p className="text-sm text-gray-600">Juan Ramos</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-600">Priority:</p>
                                        <p className="text-sm text-gray-600">High</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-600">Start Date:</p>
                                        <p className="text-sm text-gray-600">2022-01-01</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-600">End Date:</p>
                                        <p className="text-sm text-gray-600">2022-01-01</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </section>
        </main>
    );
}