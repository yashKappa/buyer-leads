"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/validators/supabaseClient";
import Cookies from "js-cookie";
import "./buyerData.css";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserData from "./UserData";
import { faNoteSticky } from "@fortawesome/free-solid-svg-icons";

interface BuyerData {
  id: number;
  owner_id: number;
  owner_external_id: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  property_type: string;
  bhk: string | null;
  purpose: string;
  timeline: string;
  budget_min: number;
  budget_max: number;
  source: string;
  tags: string[];
  notes: string;
  created_at: string;
}

export default function AllBuyersPage() {
  const [buyers, setBuyers] = useState<BuyerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "user">("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        const userCookie = Cookies.get("user");
        if (!userCookie) {
          setError("User not logged in.");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("buyers_data")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          setError(error.message);
        } else {
          setBuyers(data || []);
        }
      } catch{
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchBuyers();
  }, []);

  const filteredBuyers = buyers.filter((b) =>
    `${b.full_name} ${b.city} ${b.property_type} ${b.purpose}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="buyer-data">
      <div className="all-buyers-page">
        <div className="tab-buttons">
          <button
            onClick={() => setActiveTab("all")}
            className={activeTab === "all" ? "active" : ""}
          >
            All Buyers
          </button>
          <button
            onClick={() => setActiveTab("user")}
            className={activeTab === "user" ? "active" : ""}
          >
            View/Edit
          </button>
        </div>

        {activeTab === "all" && (
          <>
            <h1>
              <FontAwesomeIcon icon={faNoteSticky} className="text-gray-600" />{" "}
              All Buyer Leads
            </h1>

           <div className="search">
             <input
              type="text"
              placeholder="Search by name, city, property type, or purpose..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
           </div>

            {loading ? (
              <p>Loading buyers...</p>
            ) : error ? (
              <p className="no-data">
                 <Image
                  src="/images/login.png"
                  alt="customer Image"
                  width={200}
                  height={200}
                  className="image"
                />
                {error}</p>
            ) : filteredBuyers.length === 0 ? (
              <p className="no-data">
                <Image
                  src="/images/customer.png"
                  alt="customer Image"
                  width={100}
                  height={80}
                  className="image"
                />
                No buyer leads found.
              </p>
            ) : (
              <table className="buyers-table">
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Property Type</th>
                    <th>BHK</th>
                    <th>City</th>
                    <th>Budget</th>
                    <th>Purpose</th>
                    <th>Timeline</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBuyers.map((b) => (
                    <tr key={b.id}>
                      <td>{b.full_name}</td>
                      <td>{b.property_type}</td>
                      <td>{b.bhk}</td>
                      <td>{b.city}</td>
                      <td>
                        ₹{b.budget_min} – ₹{b.budget_max}
                      </td>
                      <td>{b.purpose}</td>
                      <td>{b.timeline}</td>
                      <td>{new Date(b.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

        {activeTab === "user" && <UserData />}
      </div>
    </div>
  );
}
