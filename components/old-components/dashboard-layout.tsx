"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  ChevronDown,
  Clock,
  Home,
  Map,
  Menu,
  Settings,
  TrafficCone,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <nav className="grid gap-2 text-lg font-medium">
              <Link
                href="#"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <TrafficCone className="h-6 w-6" />
                <span className="font-bold">Traffic Monitor</span>
              </Link>
              <Link
                href="#"
                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-primary hover:underline"
              >
                <Home className="h-5 w-5" />
                Dashboard
              </Link>
              <Link
                href="#"
                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:underline"
              >
                <Map className="h-5 w-5" />
                Map View
              </Link>
              <Link
                href="#"
                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:underline"
              >
                <AlertTriangle className="h-5 w-5" />
                Incidents
              </Link>
              <Link
                href="#"
                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:underline"
              >
                <BarChart3 className="h-5 w-5" />
                Analytics
              </Link>
              <Link
                href="#"
                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:underline"
              >
                <Settings className="h-5 w-5" />
                Settings
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <Link
          href="#"
          className="flex items-center gap-2 text-lg font-semibold"
        >
          <TrafficCone className="h-6 w-6" />
          <span className="font-bold">Traffic Monitor</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <Button variant="outline" size="sm" className="hidden md:flex">
            <Clock className="mr-2 h-4 w-4" />
            <span className="hidden lg:inline">Last updated:</span>
            <span className="ml-1" id="last-updated">
              Just now
            </span>
          </Button>
        </div>
      </header>
      <div className="grid flex-1 md:grid-cols-[220px_1fr]">
        <aside
          className={cn(
            "hidden border-r bg-muted/40 md:block",
            collapsed && "md:w-[80px]"
          )}
        >
          <div className="flex h-full flex-col gap-2">
            <div className="flex h-[60px] items-center border-b px-6">
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto h-8 w-8"
                onClick={() => setCollapsed(!collapsed)}
              >
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    collapsed ? "rotate-[-90deg]" : ""
                  )}
                />
                <span className="sr-only text-black">Toggle Sidebar</span>
              </Button>
            </div>
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid items-start px-4 text-sm font-medium">
                <Link
                  href="/"
                  className="flex items-center gap-3 rounded-lg bg-accent px-3 py-2 text-accent-foreground transition-all hover:text-accent-foreground"
                >
                  <Home className="h-4 w-4" />
                  <span className={cn(collapsed && "hidden")}>Dashboard</span>
                </Link>
                <Link
                  href="/historical"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-accent-foreground"
                >
                  <Map className="h-4 w-4" />
                  <span className={cn(collapsed && "hidden")}>Historical</span>
                </Link>
                <Link
                  href="/risk"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-accent-foreground"
                >
                  <AlertTriangle className="h-4 w-4" />
                  <span className={cn(collapsed && "hidden")}>
                    Risk Analysis
                  </span>
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-accent-foreground"
                >
                  <Activity className="h-4 w-4" />
                  <span className={cn(collapsed && "hidden")}>Live Data</span>
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-accent-foreground"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span className={cn(collapsed && "hidden")}>Analytics</span>
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-accent-foreground"
                >
                  <Users className="h-4 w-4" />
                  <span className={cn(collapsed && "hidden")}>Pedestrians</span>
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-accent-foreground"
                >
                  <Settings className="h-4 w-4" />
                  <span className={cn(collapsed && "hidden")}>Settings</span>
                </Link>
              </nav>
            </div>
          </div>
        </aside>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
