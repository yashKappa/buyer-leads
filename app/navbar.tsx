"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { supabase } from "@/lib/validators/supabaseClient";
import "./navbar.css";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeUrl, setActiveUrl] = useState("/");
  const [user, setUser] = useState<{ name: string; userId: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setActiveUrl(pathname);
  }, [pathname]);

  useEffect(() => {
    const cookie = Cookies.get("user");
    if (!cookie) {
      setUser(null);
      setLoading(false);
      return;
    }

    const [name, userId] = cookie.split(" ");
    if (!name || !userId) {
      setUser(null);
      setLoading(false);
      return;
    }

    const checkUser = async () => {
      const { data } = await supabase
        .from("buyers")
        .select("*")
        .eq("name", name)
        .eq("ownerid", userId)
        .single();

      if (data) {
        setUser({ name, userId });
      } else {
        setUser(null);
        Cookies.remove("user");
      }
      setLoading(false);
    };

    checkUser();
  }, []);

  const handleNavClick = (url: string) => {
    router.push(url);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    Cookies.remove("user");
    setUser(null);
    router.push("/buyers/new/login");
  };

  const isActive = (url: string) => activeUrl === url;

  return (
    <div className="container">
      <nav className="navbar">
        <h2 className="logo">
          <div>
            <Image
              src="/images/logos.png"
              alt="customer Image"
              width={50}
              height={35}
              className="image"
            />
          </div>Buyer Leads</h2>

        <button
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`nav-links ${menuOpen ? "active" : ""}`}>
          <button
            className={`nav-button ${isActive("/home") ? "active" : ""}`}
            onClick={() => handleNavClick("/home")}
          >
            Home
          </button>
          <button
            className={`nav-button ${isActive("/buyers") ? "active" : ""}`}
            onClick={() => handleNavClick("/buyers")}
          >
            Buyers
          </button>
          <button
            className={`nav-button ${isActive("/buyers/new") ? "active" : ""}`}
            onClick={() => handleNavClick("/buyers/new")}
          >
            Add Buyer
          </button>

          {!loading && (
            <>
              {user ? (
                <button className="nav-button log" onClick={handleLogout}>
                  Logout
                </button>
              ) : (
                <button
                  className="nav-button out"
                  onClick={() => handleNavClick("/buyers/new/login")}
                >
                  Login
                </button>
              )}
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
