"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React, { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

   useEffect(() => {
    document.title = "Affiliate Dashboard | LT Solutions";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Affiliate control panel');
    }
  }, []);

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  return (
    <div className="min-h-screen flex xl:flex-row flex-col">
      {/* Sidebar and Backdrop */}
      <AppSidebar />
      <Backdrop />

      {/* Main Content Area */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header */}
        <AppHeader />

        {/* Page Content */}
        <main className="flex-grow p-4 mx-auto w-full max-w-screen-2xl md:p-6">
          {children}
        </main>

        {/* Sticky Footer */}
        <footer className="w-full flex flex-col md:flex-row items-center justify-between gap-2 px-4 py-3 bg-white dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700">
          <p className="text-center text-sm font-light text-gray-500 dark:text-gray-400">
            Developed and Designed By Toz Gaming.
          </p>
          <p className="text-center text-sm font-light text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Toz Gaming. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
