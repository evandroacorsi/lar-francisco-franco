import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.webp";

const menuItems = [
  { label: "Início", path: "/" },
  { label: "Sobre Nós", path: "/sobre" },
  { label: "Transparência", path: "/transparencia" },
  { label: "Notícias", path: "/noticias" },
  { label: "Contato", path: "/contato" },
];

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path || (path !== "/" && location.pathname.startsWith(`${path}/`));

  return (
    <header className="fixed top-0 w-full bg-background/95 backdrop-blur-sm shadow-soft z-50">
      <div className="container-custom px-4 md:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 transition-smooth hover:opacity-80">
            <img src={logo} alt="Logo Lar Francisco Franco" className="w-16 h-16 object-contain" />
            <div className="md:block">
              <h1 className="text-primary font-bold text-lg leading-tight mb-1">Lar Francisco Franco</h1>
              <p className="text-xs text-muted-foreground">"Casa das Meninas"</p>
            </div>
          </Link>

          {/* Desktop Menu COM HOVER + ATIVO */}
          <nav className="hidden lg:flex items-center gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "relative text-sm font-medium transition-colors hover:text-primary",
                  "after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300",
                  "hover:after:scale-x-100 hover:after:origin-bottom-left",
                  isActive(item.path)
                    ? "text-primary after:scale-x-100"
                    : "text-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:block">
            <Button variant="cta" size="lg" asChild>
              <Link to="/como-ajudar">
                Quero Ajudar <Heart size={18} className="fill-primary" />
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-primary"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300 ease-in-out",
            isMenuOpen ? "max-h-96 mt-4" : "max-h-0"
          )}
        >
          <nav className="flex flex-col gap-3 py-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "text-sm font-medium py-2 border-b transition-smooth",
                  isActive(item.path)
                    ? "text-primary border-primary"
                    : "text-foreground hover:text-primary border-border"
                )}
              >
                {item.label}
              </Link>
            ))}
            <Button variant="cta" size="lg" className="mt-2" asChild>
              <Link to="/como-ajudar">Quero Ajudar  <Heart size={18} className="fill-primary" /></Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};
