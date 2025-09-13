import React from "react";
import Navbar from "../navbar"

interface Buyer {
  id: number;
  fullName: string;
  bhk: string;
  purpose: string;
  budgetMin: number;
  budgetMax: number;
  source: string;
  tags: string[];
}

const buyers: Buyer[] = [
  {
    id: 1,
    fullName: "John Doe",
    bhk: "2 BHK",
    purpose: "Investment",
    budgetMin: 2500000,
    budgetMax: 3500000,
    source: "Website",
    tags: ["priority", "hot-lead"],
  },
  {
    id: 2,
    fullName: "Jane Smith",
    bhk: "3 BHK",
    purpose: "Self Use",
    budgetMin: 4000000,
    budgetMax: 5000000,
    source: "Referral",
    tags: ["cold-lead"],
  },
];

export default function List() {
  return  (
    <>
    <Navbar />
    <div className="list-container">
      <h1>Buyer Leads</h1>
      <table className="buyer-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>BHK</th>
            <th>Purpose</th>
            <th>Budget Range (INR)</th>
            <th>Source</th>
            <th>Tags</th>
          </tr>
        </thead>
        <tbody>
          {buyers.map((buyer) => (
            <tr key={buyer.id}>
              <td>{buyer.id}</td>
              <td>{buyer.fullName}</td>
              <td>{buyer.bhk}</td>
              <td>{buyer.purpose}</td>
              <td>
                {buyer.budgetMin.toLocaleString()} -{" "}
                {buyer.budgetMax.toLocaleString()}
              </td>
              <td>{buyer.source}</td>
              <td>{buyer.tags.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
        </>
  );
}
