"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Film, Home, LogOut, User, Heart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { fetchUserProfile } from "@/lib/feauters/user/userSlice";

function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fetch user from redux state
  const { user, token } = useSelector((state: RootState) => state.user);
  console.log("User:", user);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    // Fetch user profile if not loaded but token exists
    if (!user && token) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, user, token]);

  const handleSignOut = () => {
    localStorage.removeItem("access_token");
    router.replace("/signin");
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navigationItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/favourites", label: "Favorites", icon: Heart },
  ];

  const isActiveRoute = (href: string) => pathname === href;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between border-b border-white/10 bg-slate-950/80 px-4 py-4 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:px-6">
      {/* Logo Section */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 via-orange-500 to-amber-400 shadow-lg shadow-red-500/30">
          <Film className="w-6 h-6 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-semibold tracking-tight text-white">
            MovieRec
          </span>
          <span className="-mt-1 hidden text-xs text-white/50 sm:block">
            Your Mood. Your Movie.
          </span>
        </div>
      </div>

      {/* Desktop Navigation Links */}
      <div className="hidden items-center gap-2 md:flex">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                isActiveRoute(item.href)
                  ? "bg-white/10 text-white shadow-inner"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </a>
          );
        })}
      </div>

      {/* Desktop User Info & Logout */}
      <div className="hidden items-center gap-4 md:flex">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-white/20 to-white/10">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="max-w-[160px] truncate text-sm font-medium text-white/80">
            {user?.name ?? user?.email ?? "User"}
          </span>
        </div>
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 text-red-300 transition-colors duration-200 hover:bg-red-500/20 hover:text-red-200"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden lg:block">Sign Out</span>
        </Button>
      </div>

      {/* Mobile Menu Button */}
      <div className="flex items-center gap-2 md:hidden">
        {/* Mobile User Avatar */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
          <User className="w-4 h-4 text-white" />
        </div>

        {/* Hamburger Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-white/70 hover:bg-white/10 hover:text-white"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-80 max-w-[85vw] transform border-l border-white/10 bg-slate-950 shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 via-orange-500 to-amber-400 shadow-lg shadow-red-500/30">
              <Film className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold tracking-tight text-white">
                MovieRec
              </span>
              <span className="-mt-1 text-xs text-white/50">
                Your Mood. Your Movie.
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={closeMobileMenu}
            className="p-2 text-white/60 hover:bg-white/10 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Mobile Menu Content */}
        <div className="flex flex-col">
          {/* User Info Section */}
          <div className="border-b border-white/10 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">
                  Welcome back!
                </span>
                <span className="max-w-[200px] truncate text-xs text-white/50">
                  {user?.name ?? user?.email ?? "User"}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                className="flex-1 border-t border-white/10 py-6"
                key={item.href} // <-- add key here
              >
                <div className="space-y-2 px-6">
                  <a
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                      isActiveRoute(item.href)
                        ? "bg-white/10 text-white"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </a>
                </div>
              </div>
            );
          })}

          {/* Sign Out Button */}
          <div className="border-t border-white/10 p-6">
            <button
              onClick={() => {
                handleSignOut();
                closeMobileMenu();
              }}
              className="flex w-full items-center gap-3 rounded-2xl border border-red-500/20 px-4 py-3 text-left font-medium text-red-300 transition-colors duration-200 hover:bg-red-500/10 hover:text-red-200"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function NavbarWrapper() {
  const pathname = usePathname();

  if (pathname === "/signin" || pathname === "/signup") return null;

  return <Navbar />;
}
