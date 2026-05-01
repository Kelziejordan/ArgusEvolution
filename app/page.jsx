"use client";
import { useState } from "react";

export default function HomePage() {
  const[status, setStatus] = useState("System Ready");

  const runBootstrap = async () => {
    setStatus("Executing Bootstrap Protocol...");
    try {
      const res = await fetch("/api/argos/bootstrap", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}) 
      });
      const data = await res.json();
      setStatus(data.ok ? "Deployment Successful!" : "Failed: " + data.error);
      alert(JSON.stringify(data, null, 2));
    } catch (e) {
      setStatus("Execution Error.");
      alert(e.message);
    }
  };

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>ArgOS Evolution</h1>
      <p>Governed personal OS control plane.</p>
      
      <div style={{ display: "flex", gap: 12, marginTop: 24, flexDirection: "column" }}>
        <a href="/dashboard" style={{ padding: 16, background: "#e5e7eb", textAlign: "center", borderRadius: 8, textDecoration: "none", color: "#111827", fontWeight: "bold" }}>
          Open Dashboard
        </a>
        <button 
          onClick={runBootstrap} 
          style={{ padding: 16, background: "#059669", color: "#ffffff", borderRadius: 8, border: "none", fontWeight: "bold", fontSize: "16px" }}
        >
          Execute System Bootstrap
        </button>
      </div>
      
      <div style={{ marginTop: 24, padding: 12, background: "#1f2937", color: "#10b981", borderRadius: 8, fontFamily: "monospace", fontSize: "12px" }}>
        Status: {status}
      </div>
    </main>
  );
}
