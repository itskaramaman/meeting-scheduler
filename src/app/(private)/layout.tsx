"use client";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Clock, BarChart, Users, Calendar } from "lucide-react";
import { BarLoader } from "react-spinners";
import Link from "next/link";

const navItems = [
  { href: "/dashboard", lable: "Dashboard", icon: BarChart },
  { href: "/events", lable: "Events", icon: Calendar },
  { href: "/meetings", lable: "Meetings", icon: Users },
  { href: "/availability", lable: "Availability", icon: Clock },
];

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded } = useUser();
  const pathname = usePathname();

  return (
    <>
      {!isLoaded && <BarLoader width={"100%"} color="#36d7b7" />}
      <div className="flex flex-col h-screen bg-blue-50 md:flex-row">
        <aside className="hidden md:block w-64 bg-white">
          <nav className="mt-8">
            <ul>
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center p-4 text-gray-700 hover:bg-gray-100 ${
                      pathname === item.href ? "bg-blue-100" : ""
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-2" />
                    {item.lable}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <header className="flex justify-center mb-4">
            <h2 className="text-5xl md:text-6xl pt-2 md:pt-0 text-center md:text-left bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              {navItems.find((item) => item.href === pathname)?.lable ||
                "Dashboard"}
            </h2>
          </header>
          {children}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-md">
            <ul className="flex justify-between items-center">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex flex-col items-center py-2 px-4 ${
                      pathname === item.href ? "text-blue-600" : "text-gray-600"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.lable}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </main>
      </div>
    </>
  );
};

export default AppLayout;
