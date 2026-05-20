import Sidebar from "@/components/Sidebar";
import PageTransition from "@/components/PageTransition";
import Topbar from "@/components/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      {/* Animated gradient background */}
      <div className="app-bg" />
      {/* Blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="relative z-10 flex min-h-screen">
        <Sidebar />
        <main className="flex-1 ml-64 min-h-screen">
          <div className="p-8 max-w-7xl mx-auto">
            <Topbar />
            <PageTransition>{children}</PageTransition>
          </div>
        </main>
      </div>
    </div>
  );
}
