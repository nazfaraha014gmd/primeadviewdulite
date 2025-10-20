import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, Menu, X, LayoutDashboard, Sun, Moon } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeProvider';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { name: 'How it Works', to: '/#how-it-works' },
    { name: 'Packages', to: '/#packages' },
    { name: 'Testimonials', to: '/#testimonials' },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleNavClick = (to: string) => {
    setIsOpen(false);
    if (to.startsWith('/#')) {
      navigate('/');
      setTimeout(() => {
        const element = document.querySelector(to.substring(1));
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      navigate(to);
    }
  };

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-background/98 backdrop-blur-md shadow-sm border-b border-border/30' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 py-2">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="flex items-center justify-center h-10 w-10 bg-gradient-to-r from-primary to-accent rounded-md shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </div>
            <span className="text-xl font-bold">PrimeAdView</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.to}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.to);
                }}
                className="nav-link py-2 px-3 rounded-md hover:bg-primary/5 transition-all duration-300"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <>
                <Button 
                  as="a" 
                  to="/dashboard" 
                  variant="outline" 
                  className="px-5 py-2.5 border-primary/60 text-primary hover:bg-primary/10 font-medium rounded-lg shadow-sm"
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                <Button 
                  onClick={handleSignOut} 
                  variant="primary" 
                  className="px-6 py-2.5 font-medium rounded-lg shadow-md hover:shadow-lg"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  as="a" 
                  to="/login" 
                  variant="outline" 
                  className="px-5 py-2 border-primary/60 text-primary hover:bg-primary/5 font-medium"
                >
                  Sign In
                </Button>
                <Button 
                  as="a" 
                  to="/signup" 
                  variant="primary" 
                  className="px-5 py-2 font-medium"
                >
                  Sign Up
                </Button>
              </>
            )}
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="p-2 rounded-full bg-background/10 hover:bg-background/20 text-foreground/80 hover:text-foreground transition-colors ring-1 ring-border hover:ring-primary/30"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="mr-3 p-2 rounded-full bg-background/10 hover:bg-background/20 text-foreground/80 hover:text-foreground transition-colors ring-1 ring-border hover:ring-primary/30"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full bg-background/10 hover:bg-background/20 text-foreground/80 hover:text-foreground transition-colors ring-1 ring-border hover:ring-primary/30"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-b border-border shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.to}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.to);
                  }}
                  className="text-foreground/80 font-medium py-3 px-4 rounded-md hover:bg-primary/5 hover:text-primary transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="h-px w-full bg-border my-2"></div>
              {session ? (
                <>
                  <Button 
                    as="a" 
                    to="/dashboard" 
                    variant="outline" 
                    className="w-full mt-2 py-2.5 border-primary/60 text-primary hover:bg-primary/5 font-medium"
                  >
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                  <Button 
                    onClick={handleSignOut} 
                    variant="primary" 
                    className="w-full py-2.5 font-medium"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    as="a" 
                    to="/login" 
                    variant="outline" 
                    className="w-full mt-2 py-2.5 border-primary/60 text-primary hover:bg-primary/5 font-medium"
                  >
                    Sign In
                  </Button>
                  <Button 
                    as="a" 
                    to="/signup" 
                    variant="primary" 
                    className="w-full py-2.5 font-medium"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
