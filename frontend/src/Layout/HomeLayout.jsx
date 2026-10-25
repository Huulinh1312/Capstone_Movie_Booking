import React from "react";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";

const HomeLayout = () => {
  return (
    <div className="min-h-screen bg-[#08090f]">
      <Header />

      <main className="pt-[86px]">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default HomeLayout;
