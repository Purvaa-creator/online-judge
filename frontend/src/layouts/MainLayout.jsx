import { Outlet } from "react-router-dom";

import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";

function MainLayout() {
  return (
    <div className="min-h-screen bg-ink text-paper">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;