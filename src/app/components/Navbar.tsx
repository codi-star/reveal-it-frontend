import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { ScanBarcode, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userRole = localStorage.getItem("userRole");
  const isAdmin = userRole === "admin";

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link to="/home" className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-xl">
                <ScanBarcode className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl">Reveal-It</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/home"
                className={
                  isActive("/home")
                    ? "text-indigo-600"
                    : "text-gray-600 hover:text-indigo-600"
                }
              >
                Home
              </Link>

              <Link
                to="/about"
                className={
                  isActive("/about")
                    ? "text-indigo-600"
                    : "text-gray-600 hover:text-indigo-600"
                }
              >
                About
              </Link>

              <Link
                to="/contact"
                className={
                  isActive("/contact")
                    ? "text-indigo-600"
                    : "text-gray-600 hover:text-indigo-600"
                }
              >
                Contact
              </Link>

              {!isAdmin && (
                <Link
                  to="/history"
                  className={
                    isActive("/history")
                      ? "text-indigo-600"
                      : "text-gray-600 hover:text-indigo-600"
                  }
                >
                  History
                </Link>
              )}

              {isAdmin && (
                <Link
                  to="/feedback"
                  className={
                    isActive("/feedback")
                      ? "text-indigo-600"
                      : "text-gray-600 hover:text-indigo-600"
                  }
                >
                  Feedback
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <>
                <span className="text-sm text-gray-600 hidden sm:inline">
                  {user.email}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="hidden md:flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>

                <button
                  className="md:hidden p-2"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {mobileMenuOpen && user && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              <Link to="/home" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>

              <Link to="/about" onClick={() => setMobileMenuOpen(false)}>
                About
              </Link>

              <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </Link>

              {!isAdmin && (
                <Link to="/history" onClick={() => setMobileMenuOpen(false)}>
                  History
                </Link>
              )}

              {isAdmin && (
                <Link to="/feedback" onClick={() => setMobileMenuOpen(false)}>
                  Feedback
                </Link>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
