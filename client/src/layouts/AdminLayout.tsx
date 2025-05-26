import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Outlet } from "react-router"

export default function AdminLayout() {
  return (
    <SidebarProvider>
      <main className="min-h-screen p-6">
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  )
}
