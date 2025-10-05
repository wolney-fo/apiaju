import { Github } from "lucide-react";
import { Button } from "./ui/button";

export function Header() {
  return (
    <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-foreground">ApiAju</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button asChild variant="ghost" size="sm">
              <a
                href="https://github.com/wolney-fo/apiaju"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </a>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
