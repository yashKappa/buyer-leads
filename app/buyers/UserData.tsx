"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/validators/supabaseClient";
import Cookies from "js-cookie";
import "./buyerData.css";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Popup from "../Popup";
import Image from "next/image";


interface BuyerData {
    id: number;
    owner_id: number;
    owner_external_id: string;
    full_name: string;
    email: string;
    phone: string;
    city: "Chandigarh" | "Mohali" | "Zirakpur" | "Panchkula" | "Other";
    property_type: "Apartment" | "Villa" | "Plot" | "Office" | "Retail";
    bhk: number;
    purpose: string;
    timeline: "0-3m" | "3-6m" | ">6m" | "Exploring";
    budget_min: number;
    budget_max: number;
    status: "New" | "Qualified" | "Contacted" | "Visited" | "Negotiation" | "Converted" | "Dropped";
    source: string;
    tags: string[];
    notes: string;
    created_at: string;
}

export default function UserBuyersPage() {
    const [buyers, setBuyers] = useState<BuyerData[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Partial<BuyerData>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [popup, setPopup] = useState<{ message: string; type: "success" | "error" } | null>(null);

    useEffect(() => {
        const fetchBuyers = async () => {
            try {
                const userCookie = Cookies.get("user");
                if (!userCookie) {
                    setError("User not logged in.");
                    setLoading(false);
                    return;
                }

                const decoded = decodeURIComponent(userCookie);
                const parts = decoded.split(" ");
                const ownerExternalId = parts[1];

                if (!ownerExternalId) {
                    setError("Invalid cookie format.");
                    setLoading(false);
                    return;
                }

                const { data, error } = await supabase
                    .from("buyers_data")
                    .select("*")
                    .eq("owner_external_id", ownerExternalId)
                    .order("created_at", { ascending: false });

                if (error) {
                    setError(error.message);
                } else {
                    setBuyers(data || []);
                }
            } catch {
                setError("Something went wrong.");
            } finally {
                setLoading(false);
            }
        };

        fetchBuyers();
    }, []);

    const handleEdit = (buyer: BuyerData) => {
        setEditingId(buyer.id);
        setEditForm({ ...buyer });
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditForm({});
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleSave = async (id: number) => {
        const { error } = await supabase
            .from("buyers_data")
            .update(editForm)
            .eq("id", id);

        if (!error) {
            setBuyers((prev) =>
                prev.map((b) => (b.id === id ? { ...b, ...editForm } as BuyerData : b))
            );
            setEditingId(null);
            setEditForm({});
            setPopup({ message: " ✔ Data updated successfully", type: "success" });
        } else {
            setPopup({ message: "Error saving data: " + error.message, type: "error" });
        }
    };


    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this record?")) return;

        const { error } = await supabase
            .from("buyers_data")
            .delete()
            .eq("id", id);

        if (!error) {
            setBuyers((prev) => prev.filter((b) => b.id !== id));
            setPopup({ message: "Data deleted successfully ✔", type: "success" }); // ✔ Show popup
        } else {
            setPopup({ message: "Error deleting data: " + error.message, type: "error" }); // ✔ Error popup
        }
    };

    if (loading) return <p className="loading">Loading your data...</p>;
    if (error) return <p className="no-data">
                     <Image
                      src="/images/login.png"
                      alt="customer Image"
                      width={200}
                      height={200}
                      className="image"
                    />
                    {error}</p>;

    return (
        <div className="user-buyers-page">
            <h1 className="page-title"><FontAwesomeIcon icon={faUser} className="text-gray-600" /> Your Buyer Leads</h1>
            {popup && (
                <Popup
                    message={popup.message}
                    type={popup.type}
                    duration={3000}
                    onClose={() => setPopup(null)}
                />
            )}
            {buyers.length === 0 ? (
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
                <div className="buyers-list">
                    {buyers.map((b) => (
                        <div key={b.id} className="buyer-cards">
                            {editingId === b.id ? (
                                <div className="buyer-grid">
                                    <input
                                        type="text"
                                        name="full_name"
                                        value={editForm.full_name || ""}
                                        onChange={handleChange}
                                        placeholder="Full Name"
                                    />
                                    <input
                                        type="email"
                                        name="email"
                                        value={editForm.email || ""}
                                        onChange={handleChange}
                                        placeholder="Email"
                                    />
                                    <select
                                        name="property_type"
                                        value={editForm.property_type || ""}
                                        onChange={handleChange}
                                        className="select"
                                    >
                                        <option value="">Select Property Type</option>
                                        <option value="Apartment">Apartment</option>
                                        <option value="Villa">Villa</option>
                                        <option value="Plot">Plot</option>
                                        <option value="Office">Office</option>
                                        <option value="Retail">Retail</option>
                                    </select>

                                    <select
                                        name="bhk"
                                        value={editForm.bhk || ""}
                                        onChange={handleChange}
                                        className="select"
                                    >
                                        <option value="">Select BHK</option>
                                        <option value="1">1 BHK</option>
                                        <option value="2">2 BHK</option>
                                        <option value="3">3 BHK</option>
                                        <option value="4">4 BHK</option>
                                        <option value="5">5+ BHK</option>
                                    </select>

                                    <input
                                        type="text"
                                        name="phone"
                                        value={editForm.phone || ""}
                                        onChange={handleChange}
                                        placeholder="Phone"
                                    />

                                    <select
                                        name="city"
                                        value={editForm.city || ""}
                                        onChange={handleChange}
                                        className="select"
                                    >
                                        <option value="">Select City</option>
                                        <option value="Chandigarh">Chandigarh</option>
                                        <option value="Mohali">Mohali</option>
                                        <option value="Zirakpur">Zirakpur</option>
                                        <option value="Panchkula">Panchkula</option>
                                        <option value="Other">Other</option>
                                    </select>

                                    <div className="budget-edit">
                                        <input
                                            type="number"
                                            name="budget_min"
                                            value={editForm.budget_min || ""}
                                            onChange={handleChange}
                                            placeholder="Min Budget"
                                        />
                                        <span>–</span>
                                        <input
                                            type="number"
                                            name="budget_max"
                                            value={editForm.budget_max || ""}
                                            onChange={handleChange}
                                            placeholder="Max Budget"
                                        />
                                    </div>

                                    <input
                                        type="text"
                                        name="purpose"
                                        value={editForm.purpose || ""}
                                        onChange={handleChange}
                                        placeholder="Purpose"
                                    />

                                    <select
                                        name="timeline"
                                        value={editForm.timeline || ""}
                                        onChange={handleChange}
                                        className="select"
                                    >
                                        <option value="">Select Timeline</option>
                                        <option value="0-3m">0-3m</option>
                                        <option value="3-6m">3-6m</option>
                                        <option value=">6m">&gt;6m</option>
                                        <option value="Exploring">Exploring</option>
                                    </select>

                                    <select
                                        name="status"
                                        value={editForm.status || "New"}
                                        onChange={handleChange}
                                        className="status"
                                    >
                                        <option value="New">New</option>
                                        <option value="Qualified">Qualified</option>
                                        <option value="Contacted">Contacted</option>
                                        <option value="Visited">Visited</option>
                                        <option value="Negotiation">Negotiation</option>
                                        <option value="Converted">Converted</option>
                                        <option value="Dropped">Dropped</option>
                                    </select>
                                </div>
                            ) : (
                                <div className="buyer-grid">
                                    <p><strong>Full Name:</strong> {b.full_name}</p>
                                    <p><strong>Email:</strong> {b.email}</p>
                                    <p><strong>Property Type:</strong> {b.property_type}</p>
                                    <p><strong>BHK:</strong> {b.bhk === 5 ? "5+ BHK" : `${b.bhk} BHK`}</p>
                                    <p><strong>Phone:</strong> {b.phone}</p>
                                    <p><strong>City:</strong> {b.city}</p>
                                    <p><strong>Budget:</strong> ₹{b.budget_min} – ₹{b.budget_max}</p>
                                    <p><strong>Purpose:</strong> {b.purpose}</p>
                                    <p><strong>Timeline:</strong> {b.timeline}</p>
                                    <p><strong>Status:</strong> {b.status || "New"}</p>
                                </div>
                            )}

                            <div className="actions">
                                {editingId === b.id ? (
                                    <>
                                        <button onClick={() => handleSave(b.id)}>Save</button>
                                        <button onClick={handleCancel}>Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => handleEdit(b)}>Edit</button>
                                        <button onClick={() => handleDelete(b.id)}>Delete</button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
