import { Outlet } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import MobileNav from "@/components/MobileNav";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
