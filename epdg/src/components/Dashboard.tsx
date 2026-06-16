import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./index";
import logo from "../assets/epd_logo.png";

const Dashboard: React.FC = () => {
  return (
    <div className="flex bg-[#0D0118] h-screen overflow-hidden">
      <Navbar />
      <main className="flex-1 h-full flex flex-col overflow-hidden">
        <div className="shrink-0 flex items-center gap-3 px-4 lg:px-6 py-3 bg-[#0D0118]/80 shadow-sm shadow-white backdrop-blur-md border-b border-[#4B1E91]/60">
          <img src={logo} alt="Emerson Professional" className="w-auto h-28 object-contain" />
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;