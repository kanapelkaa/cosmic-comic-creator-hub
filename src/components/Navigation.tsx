
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "./ThemeToggle";
import AuthModal from "./AuthModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'register' }>({
    isOpen: false,
    mode: 'login'
  });
  const { user, logout, isAuthenticated } = useAuth();

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthModal({ isOpen: true, mode });
  };

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false, mode: 'login' });
  };

  return (
    <>
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
                <Link to="/about">Обо мне</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/portfolio">Портфолио</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/comics">Комиксы</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/camp">Лагерь</Link>
              </Button>
            </div>

            {/* Auth Section & Theme Toggle */}
            <div className="hidden md:flex items-center space-x-2">
              <ThemeToggle />
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {user?.username}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/profile">Мой профиль</Link>
                    </DropdownMenuItem>
                    {user?.role === 'admin' && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin">Админ панель</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={logout} className="text-red-600">
                      <LogOut className="h-4 w-4 mr-2" />
                      Выйти
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="outline" size="sm" onClick={() => openAuthModal('login')}>
                    Войти
                  </Button>
                  <Button size="sm" onClick={() => openAuthModal('register')}>
                    Регистрация
                  </Button>
                </>
              )}
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
                <Link to="/about" onClick={() => setIsMenuOpen(false)}>Обо мне</Link>
              </Button>
              <Button variant="ghost" asChild className="w-full justify-start">
                <Link to="/portfolio" onClick={() => setIsMenuOpen(false)}>Портфолио</Link>
              </Button>
              <Button variant="ghost" asChild className="w-full justify-start">
                <Link to="/comics" onClick={() => setIsMenuOpen(false)}>Комиксы</Link>
              </Button>
              <Button variant="ghost" asChild className="w-full justify-start">
                <Link to="/camp" onClick={() => setIsMenuOpen(false)}>Лагерь</Link>
              </Button>
              
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-muted-foreground">Тема:</span>
                <ThemeToggle />
              </div>
              
              {isAuthenticated ? (
                <>
                  <Button variant="ghost" asChild className="w-full justify-start">
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)}>Мой профиль</Link>
                  </Button>
                  {user?.role === 'admin' && (
                    <Button variant="ghost" asChild className="w-full justify-start">
                      <Link to="/admin" onClick={() => setIsMenuOpen(false)}>Админ панель</Link>
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    onClick={() => { logout(); setIsMenuOpen(false); }}
                    className="w-full justify-start text-red-600"
                  >
                    Выйти
                  </Button>
                </>
              ) : (
                <div className="flex space-x-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => { openAuthModal('login'); setIsMenuOpen(false); }}
                  >
                    Войти
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => { openAuthModal('register'); setIsMenuOpen(false); }}
                  >
                    Регистрация
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      <AuthModal
        isOpen={authModal.isOpen}
        onClose={closeAuthModal}
        mode={authModal.mode}
        onModeChange={(mode) => setAuthModal({ isOpen: true, mode })}
      />
    </>
  );
};

export default Navigation;
