"use client";
import { useState } from "react";
import Link from "next/link";

export default function AppShell({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard", label: "Projects" },
    { href: "/dashboard", label: "Approvals" },
    { href: "/dashboard", label: "Queue" },
    { href: "/dashboard", label: "Memory" },
    { href: "/dashboard", label: "Audit" },
    { href: "/dashboard", label: "Settings" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Navigation Bar */}
      <nav style={{
        background: "#111827",
        color: "#ffffff",
        padding: "16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
      }}>
        <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "bold" }}>ArgOS</h1>
        
        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            color: "#ffffff",
            fontSize: "24px",
            cursor: "pointer",
            "@media (max-width: 768px)": {
              display: "block"
            }
          }}
          onMouseEnter={(e) => e.target.style.display = "block"}
        >
          ☰
        </button>

        {/* Desktop Navigation */}
        <div style={{
          display: "flex",
          gap: "24px",
          flexDirection: "row",
          alignItems: "center",
        }}>
          {navItems.slice(0, 4).map((item) => (
            <Link
              key={item.href + item.label}
              href={item.href}
              style={{
                color: "#ffffff",
                textDecoration: "none",
                fontSize: "14px",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => e.target.style.color = "#10b981"}
              onMouseLeave={(e) => e.target.style.color = "#ffffff"}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          background: "#1f2937",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}>
          {navItems.map((item) => (
            <Link
              key={item.href + item.label}
              href={item.href}
              style={{
                color: "#ffffff",
                textDecoration: "none",
                fontSize: "14px",
                padding: "12px",
                background: "#111827",
                borderRadius: "4px",
                transition: "background 0.2s",
              }}
              onClick={() => setMenuOpen(false)}
              onMouseEnter={(e) => e.target.style.background = "#059669"}
              onMouseLeave={(e) => e.target.style.background = "#111827"}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}

      {/* Main Content */}
      <main style={{ flex: 1 }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{
        background: "#111827",
        color: "#9ca3af",
        padding: "24px",
        textAlign: "center",
        fontSize: "12px",
        borderTop: "1px solid #374151"
      }}>
        <p>ArgOS Evolution v1 • Governed Personal OS Control Plane</p>
      </footer>
    </div>
  );
}
