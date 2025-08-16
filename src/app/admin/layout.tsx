"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppAdminSidebar from "@/layout/AppAdminSidebar";
import AppHeader from "@/layout/AppHeader";
import Backdrop from "@/layout/Backdrop";
import React, { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

   useEffect(() => {
    document.title = "Admin Dashboard | LT Solutions";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Administration control panel');
    }
  }, []);

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  return (
    <div className="min-h-screen flex xl:flex-row flex-col">
      {/* Sidebar and Backdrop */}
      <AppAdminSidebar />
      <Backdrop />
      {/* Main Content Area */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header */}
        <AppHeader />
        {/* Page Content */}
        <div className="flex-grow p-4 mx-auto w-full max-w-screen-2xl md:p-6">{children}</div>
      {/* Footer */}
        <footer className="w-full flex flex-col md:flex-row items-center justify-between gap-2 px-4 py-3 bg-white dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700">
            <p className="text-center text-sm font-light text-gray-500 dark:text-gray-400">
              Developed and Designed By LT Solutions. For Contact ltsolutions.bet
            </p>
            <p className="text-center text-sm font-light text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} LT Solutions. All rights reserved.
            </p>
        </footer>
      </div>
    </div>
  );
}
