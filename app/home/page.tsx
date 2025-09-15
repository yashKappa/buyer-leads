"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/validators/supabaseClient";
import "./HomePage.css";

interface BuyerData {
  id: number;
  full_name: string;
  property_type: string;
  city: string;
  budget_min: number;
  budget_max: number;
  status: string;
}

export default function HomePage() {
  const [recentBuyers, setRecentBuyers] = useState<BuyerData[]>([]);
  const [stats, setStats] = useState({ total: 0, converted: 0, pending: 0 });

  useEffect(() => {
    const fetchRecentBuyers = async () => {
      const { data } = await supabase
        .from("buyers_data")
        .select("id, full_name, property_type, city, budget_min, budget_max, status")
        .order("created_at", { ascending: false })
        .limit(3);

      setRecentBuyers(data || []);

      const { count: total } = await supabase.from("buyers_data").select("*", { count: "exact" });
      const { count: converted } = await supabase
        .from("buyers_data")
        .select("*", { count: "exact" })
        .eq("status", "Converted");
      const { count: pending } = await supabase
        .from("buyers_data")
        .select("*", { count: "exact" })
        .eq("status", "New");

      setStats({ total: total || 0, converted: converted || 0, pending: pending || 0 });
    };

    fetchRecentBuyers();
  }, []);

  return (
    <main className="home-container">
      <section className="hero">
        <h1>Welcome to <span className="highlight">Buyer Leads</span></h1>
        <p>Manage your buyers, track property preferences, and organize leads all in one place.</p>
        <div className="buttons">
          <Link href="/buyers/new"><button className="btn primary">Add Buyer ➕</button></Link>
          <Link href="/buyers"><button className="btn secondary">View Buyers 📋</button></Link>
        </div>
      </section>

      <section className="stats">
        <div className="stat-card">
          <h3>Total Buyers</h3>
          <p>{stats.total}</p>
        </div>
        <div className="stat-card">
          <h3>Converted Leads</h3>
          <p>{stats.converted}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Leads</h3>
          <p>{stats.pending}</p>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>📊 Organized Data</h3>
          <p>Store buyer details like property type, budget, timeline, and contact info securely.</p>
        </div>
        <div className="feature-card">
          <h3>🔍 Quick Search</h3>
          <p>Filter and search buyers easily to find the right leads when you need them.</p>
        </div>
        <div className="feature-card">
          <h3>📝 Notes & Tags</h3>
          <p>Add notes and tags to leads to keep track of important updates and follow-ups.</p>
        </div>
      </section>

      <section className="recent-buyers">
        <h2>🔥 Recent Buyers</h2>
        {recentBuyers.length === 0 ? <p>No recent buyers yet.</p> :
          <div className="buyers-grid">
            {recentBuyers.map((b) => (
              <div key={b.id} className="buyer-card">
                <p><strong>Name:</strong> {b.full_name}</p>
                <p><strong>Property:</strong> {b.property_type}</p>
                <p><strong>City:</strong> {b.city}</p>
                <p><strong>Budget:</strong> ₹{b.budget_min} – ₹{b.budget_max}</p>
                <p><strong>Status:</strong> {b.status}</p>
              </div>
            ))}
          </div>
        }
      </section>

      <section className="how-it-works">
        <h2>🚀 How It Works</h2>
        <div className="steps">
          <div className="step">
            <h3>1. Add Buyer</h3>
            <p>Input buyer details such as name, contact, property type, and budget.</p>
          </div>
          <div className="step">
            <h3>2. Track Leads</h3>
            <p>Organize and filter leads based on city, property type, or timeline.</p>
          </div>
          <div className="step">
            <h3>3. Update Status</h3>
            <p>Change buyer status from New → Converted and add notes for follow-ups.</p>
          </div>
        </div>
      </section>

      <section className="cta">
        <h2>Ready to Get Started?</h2>
        <p>Add your first buyer and start managing leads efficiently!</p>
        <Link href="/buyers/new">
          <button className="btn primary">Add Buyer Now ➕</button>
        </Link>
      </section>

      <footer className="footer">
        <p>&copy; 2025 Buyer Leads. All rights reserved.</p>
        <div className="footer-links">
          <Link href="/">Home</Link> |
          <Link href="/buyers">Buyers</Link> |
          <Link href="/buyers/new">Add Buyer</Link>
        </div>
      </footer>
    </main>
  );
}
