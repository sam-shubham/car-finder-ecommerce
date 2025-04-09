"use client";

import Link from "next/link";
import { Heart, Moon, Sun, Monitor, Github } from "lucide-react";
import { useTheme } from "@/context/theme-context";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Get wishlist count from local storage
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setWishlistCount(wishlist.length);

    // Listen for storage events to update wishlist count
    const handleStorageChange = () => {
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setWishlistCount(wishlist.length);
    };

    window.addEventListener("storage", handleStorageChange);
    // Custom event for when wishlist is updated within the same tab
    window.addEventListener("wishlistUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("wishlistUpdated", handleStorageChange);
    };
  }, []);

  return (
    <header className="border-b border-border sticky top-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
            <span className="text-sm">CF</span>
          </div>
          <span>Car Finder</span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="icon-button"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Moon className="h-5 w-5" />
              ) : theme === "light" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Monitor className="h-5 w-5" />
              )}
            </button>

            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-card border border-border overflow-hidden"
                >
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setTheme("light");
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-secondary transition-colors"
                    >
                      <Sun className="h-4 w-4 mr-2" />
                      Light
                    </button>
                    <button
                      onClick={() => {
                        setTheme("dark");
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-secondary transition-colors"
                    >
                      <Moon className="h-4 w-4 mr-2" />
                      Dark
                    </button>
                    <button
                      onClick={() => {
                        setTheme("system");
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-secondary transition-colors"
                    >
                      <Monitor className="h-4 w-4 mr-2" />
                      System
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/wishlist"
            className="flex items-center gap-1 relative group"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative"
            >
              <Heart className="h-5 w-5 group-hover:text-red-500 transition-colors" />
              {wishlistCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center"
                >
                  {wishlistCount}
                </motion.span>
              )}
            </motion.div>
            <span className="ml-1">Wishlist</span>
          </Link>
          <Link
            href={"https://github.com/sam-shubham/car-finder-ecommerce"}
            target="_blank"
          >
            <button className="flex items-center rounded-md w-full border border-[#fff2]  aspect-square px-2 text-sm hover:bg-secondary transition-colors">
              <Github className="h-4 w-4" />
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
