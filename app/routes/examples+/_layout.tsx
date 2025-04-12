import { Outlet, Link, useLocation } from "react-router";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { examples } from "../index";

export default function ExamplesLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen h-screen">
      {/* Sidebar */}
      <div className="w-64 border-r p-6">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2 mb-8 text-sm font-medium"
          asChild
        >
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <div className="space-y-2">
          {examples.map((example) => (
            <Button
              key={example.path}
              variant={
                location.pathname === example.path ? "secondary" : "ghost"
              }
              size="sm"
              className="w-full justify-between group"
              asChild
            >
              <Link to={example.path}>
                <span className="truncate">{example.title}</span>
                <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </Button>
          ))}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 h-full">
        <Outlet />
      </div>
    </div>
  );
}
