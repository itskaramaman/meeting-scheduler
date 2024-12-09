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
      </div>
      <main>{children}</main>
    </>
  );
};

export default AppLayout;
