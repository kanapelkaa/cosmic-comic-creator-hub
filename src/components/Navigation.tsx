
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="h-12 w-auto"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            <Button variant="ghost" asChild>
              <Link to="/about">About Me</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/portfolio">Portfolio</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/comics">Comics</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2">
            <Button variant="ghost" asChild className="w-full justify-start">
              <Link to="/about" onClick={() => setIsMenuOpen(false)}>About Me</Link>
            </Button>
            <Button variant="ghost" asChild className="w-full justify-start">
              <Link to="/portfolio" onClick={() => setIsMenuOpen(false)}>Portfolio</Link>
            </Button>
            <Button variant="ghost" asChild className="w-full justify-start">
              <Link to="/comics" onClick={() => setIsMenuOpen(false)}>Comics</Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
