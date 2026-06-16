import React, { useState } from "react";
import {
  Home,
  Map,
  CheckSquare,
  Bell,
  User,
  ChevronRight,
  CheckCircle2,
  // Menu,
} from "lucide-react";

// import { useGlobalStore } from "../store/global";

const roadmapSteps = [
  {
    id: 1,
    title: "Onboarding",
    progress: "100%",
    status: "Completed",
  },
  {
    id: 2,
    title: "Skill Building",
    progress: "75%",
    status: "In Progress",
  },
  {
    id: 3,
    title: "Project Work",
    progress: "25%",
    status: "In Progress",
  },
  {
    id: 4,
    title: "Portfolio",
    progress: "0%",
    status: "Upcoming",
  },
];

const successStories = [1, 2, 3];

const Mobile: React.FC = () => {
  const [activeNav, setActiveNav] = useState("Home");

  // const { user } = useGlobalStore();

  const navigationItems = [
    {
      icon: Home,
      label: "Home",
    },
    {
      icon: Map,
      label: "Roadmap",
    },
    {
      icon: CheckSquare,
      label: "Tasks",
    },
    {
      icon: Bell,
      label: "Updates",
    },
    {
      icon: User,
      label: "Profile",
    },
  ];

  return (
    <div className="md:hidden bg-[#F5F5F5] min-h-screen text-black">
      {/* Header */}
      <header className="top-0 z-50 sticky bg-[#F5F5F5]/95 backdrop-blur border-gray-200 border-b">
        <div className="flex justify-between items-center px-5 py-4">
          {/* Logo */}
          <div className="flex justify-center items-center bg-white border-2 border-gray-400 rounded-full w-12 h-12 font-bold text-sm">
            LOGO
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="space-y-8 px-5 py-6 pb-32">
        {/* Hero Section */}
        <section className="bg-white p-5 border border-gray-200 rounded-3xl">
          <div className="space-y-5">
            <div className="bg-gray-200 rounded-xl w-24 h-8" />

            <div>
              <h1 className="font-bold text-3xl leading-tight">
                Build Your Future
                <br />
                with Global Experience
              </h1>

              <p className="mt-4 text-gray-500 text-sm leading-relaxed">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </p>
            </div>

            {/* Hero Image Placeholder */}
            <div className="bg-gray-200 rounded-3xl h-56" />

            {/* CTA Buttons */}
            <div className="flex gap-3">
              <button className="flex-1 bg-black py-4 rounded-2xl font-medium text-white text-sm">
                Primary CTA
              </button>

              <button className="flex-1 bg-white py-4 border border-gray-300 rounded-2xl font-medium text-sm">
                Secondary CTA
              </button>
            </div>

            {/* Stats */}
            <div className="gap-4 grid grid-cols-2">
              <div className="bg-gray-100 p-4 rounded-2xl">
                <h3 className="font-bold text-3xl">+100</h3>

                <div className="bg-gray-300 mt-3 rounded-full w-16 h-2" />
              </div>

              <div className="bg-gray-100 p-4 rounded-2xl">
                <h3 className="font-bold text-3xl">+20</h3>

                <div className="bg-gray-300 mt-3 rounded-full w-16 h-2" />
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="gap-4 grid grid-cols-1">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="bg-white p-4 border border-gray-200 rounded-3xl"
            >
              <div className="bg-gray-200 mb-4 rounded-2xl h-36" />

              <h3 className="mb-2 font-bold text-xl">Lorem Ipsum Feature</h3>

              <p className="mb-4 text-gray-500 text-sm leading-relaxed">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </p>

              <button className="bg-gray-200 px-5 py-3 rounded-xl font-medium text-sm">
                Learn More
              </button>
            </div>
          ))}
        </section>

        {/* How It Works */}
        <section>
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-bold text-3xl">How it works</h2>

            <button className="flex items-center gap-1 text-sm">
              View all
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Swipeable Cards */}
          <div className="flex gap-4 pb-2 overflow-x-auto snap-mandatory snap-x">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white p-5 border border-gray-200 rounded-3xl min-w-65 snap-start shrink-0"
              >
                <div className="flex justify-center items-center bg-gray-200 mb-5 rounded-2xl w-12 h-12 font-bold">
                  0{item}
                </div>

                <div className="bg-gray-200 mb-5 rounded-2xl h-32" />

                <h3 className="mb-3 font-bold text-xl">Step {item}</h3>

                <p className="text-gray-500 text-sm leading-relaxed">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Roadmap */}
        <section>
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-bold text-3xl">Your Roadmap</h2>

            <button className="flex items-center gap-1 text-sm">
              View all
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="flex gap-4 pb-2 overflow-x-auto snap-mandatory snap-x">
            {roadmapSteps.map((step) => (
              <div
                key={step.id}
                className="bg-white p-5 border border-gray-200 rounded-3xl min-w-55 snap-start shrink-0"
              >
                <div className="flex justify-center items-center bg-gray-200 mb-5 rounded-xl w-10 h-10 font-bold">
                  {step.id}
                </div>

                {/* Fake Progress Circle */}
                <div className="flex justify-center items-center mx-auto mb-5 border-4 border-gray-400 rounded-full w-24 h-24">
                  <span className="font-bold">{step.progress}</span>
                </div>

                <h3 className="mb-3 font-bold text-lg text-center">
                  {step.title}
                </h3>

                <div className="space-y-2 mb-5">
                  <div className="bg-gray-200 rounded-full h-2" />
                  <div className="bg-gray-200 rounded-full w-5/6 h-2" />
                  <div className="bg-gray-200 rounded-full w-4/6 h-2" />
                </div>

                <div className="flex justify-center items-center gap-2 bg-gray-100 py-3 rounded-xl text-sm">
                  <CheckCircle2 size={16} />
                  {step.status}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Current Tasks */}
        <section>
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-bold text-3xl">Current Tasks</h2>

            <button className="flex items-center gap-1 text-sm">
              View all
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="space-y-4">
            {[
              "Complete your profile",
              "Take skill assessment",
              "Watch orientation video",
              "Join community group",
            ].map((task, index) => (
              <div
                key={index}
                className="bg-white p-4 border border-gray-200 rounded-2xl"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="border-2 border-gray-400 rounded-full w-6 h-6" />

                    <span className="font-medium">{task}</span>
                  </div>

                  <ChevronRight size={18} />
                </div>

                <div className="bg-gray-200 mt-4 rounded-full h-2 overflow-hidden">
                  <div className="bg-gray-500 rounded-full w-1/2 h-full" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Success Stories */}
        <section>
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-bold text-3xl">Success Stories</h2>

            <button className="flex items-center gap-1 text-sm">
              View all
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="flex gap-4 pb-2 overflow-x-auto snap-mandatory snap-x">
            {successStories.map((item) => (
              <div
                key={item}
                className="bg-white p-4 border border-gray-200 rounded-3xl min-w-65 snap-start shrink-0"
              >
                <div className="bg-gray-200 mb-4 rounded-2xl h-40" />

                <div className="space-y-2">
                  <div className="bg-gray-300 rounded w-full h-4" />
                  <div className="bg-gray-300 rounded w-5/6 h-4" />
                  <div className="bg-gray-300 rounded w-4/6 h-4" />
                </div>

                <p className="mt-5 text-gray-500 text-sm">- Intern Name</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-0 left-0 z-50 fixed bg-white border-gray-200 border-t w-full">
        <div className="flex justify-around items-center px-2 py-3">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                onClick={() => setActiveNav(item.label)}
                className={`
                  flex
                  flex-col
                  items-center
                  justify-center
                  gap-1
                  py-2
                  px-4
                  rounded-2xl
                  transition-all
                  min-w-17.5
                  ${
                    activeNav === item.label
                      ? "bg-black text-white"
                      : "text-gray-500"
                  }
                `}
              >
                <Icon size={20} />

                <span className="font-medium text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Mobile;
