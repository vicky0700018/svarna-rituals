import { Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { CartDrawer } from "@/components/site/CartDrawer";
import { FloatingContact } from "@/components/site/FloatingContact";

export const Route = createFileRoute("/_site")({
  component: SiteLayout,
});

function SiteLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <Navbar />
      <main key={pathname} className="flex-1 animate-page-in">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <FloatingContact />
    </div>
  );
}
