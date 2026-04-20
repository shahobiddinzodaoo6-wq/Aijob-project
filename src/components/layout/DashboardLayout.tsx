"use client";
import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="flex">
        <div className="hidden lg:block sticky top-14 h-[calc(100vh-56px)] overflow-hidden">
          <Sidebar />
        </div>
        <main className="flex-1 p-6 min-w-0 overflow-x-hidden">
          <div className="max-w-5xl mx-auto anim-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
