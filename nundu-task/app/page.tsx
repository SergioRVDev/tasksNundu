"use client";
import KanbanSection from "@/components/KanbanSection";
import TableSection from "@/components/TableSection";
import { useState } from "react";
import FiltersSection from "@/components/FiltersSection";

export default function Home() {
  const [view, setView] = useState("kanban");
  return (
    <main className="h-full w-full p-8 gap-6 flex flex-col bg-[#FAFAFA]">
      <FiltersSection setView={setView} view={view} />
      {view === "kanban" ? <KanbanSection /> : <TableSection />}
    </main>
  );
}
