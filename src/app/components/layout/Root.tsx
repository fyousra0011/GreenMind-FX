import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { useApp, tc } from "../../context/AppContext";

export function Root() {
  const { theme } = useApp();
  const isDark = theme === "dark";
  const colors = tc(isDark);

  return (
    <div
      className="flex h-screen w-screen overflow-hidden"
      style={{ background: colors.bg }}
    >
      {/* Background effects */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: isDark
            ? "radial-gradient(ellipse at 20% 50%, rgba(0,255,136,0.03) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(16,185,129,0.04) 0%, transparent 50%)"
            : "radial-gradient(ellipse at 20% 50%, rgba(0,200,100,0.04) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(16,185,129,0.05) 0%, transparent 50%)",
        }}
      />

      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main
          className="flex-1 overflow-y-auto"
          style={{
            background: "transparent",
            scrollbarWidth: "thin",
            scrollbarColor: `${colors.scrollbar} transparent`,
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
