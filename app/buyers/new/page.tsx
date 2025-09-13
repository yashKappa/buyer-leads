"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBuyer } from "@/lib/validators/buyer";
import { z } from "zod";
import { useState } from "react";
import { redirect } from "next/navigation";
import "./NewBuyerPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullhorn, faBullseye, faCalendar, faCartPlus, faCity, faClock, faEnvelope, faHome, faIndianRupeeSign, faPhone, faPlaceOfWorship, faRupee, faTag, faTimeline, faTimes, faUser } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../navbar"


type BuyerFormData = z.infer<typeof createBuyer>;

export default function NewBuyerPage() {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BuyerFormData>({
    resolver: zodResolver(createBuyer),
    defaultValues: { status: "New" },
  });

  const propertyType = watch("propertyType");

  const onSubmit = async (data: BuyerFormData) => {
    setLoading(true);
    setServerError(null);
    try {
      const res = await fetch("/api/buyers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        setServerError(JSON.stringify(err.error));
      } else {
        alert("Buyer created successfully!");
      }
    } catch (e) {
      setServerError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
        <>
    <Navbar />
<div className="buyer-form-container">
  <h1 className="form-title"><FontAwesomeIcon icon={faCartPlus} className="text-gray-600" />Create Buyer Lead</h1>

  <form onSubmit={handleSubmit(onSubmit)} className="buyer-form">
    {/* Two-input rows as before */}
    <div className="form-row">
      <div className="form-group">
        <label>  <FontAwesomeIcon icon={faUser} className="text-gray-600" />Full Name</label>
        <input {...register("fullName")} />
        {errors.fullName && <p className="error">{errors.fullName.message}</p>}
      </div>
      <div className="form-group">
        <label><FontAwesomeIcon icon={faEnvelope} className="text-gray-600" />Email</label>
        <input type="email" {...register("email")} />
        {errors.email && <p className="error">{errors.email.message}</p>}
      </div>
    </div>

    {/* Phone & City */}
    <div className="form-row">
      <div className="form-group">
        <label><FontAwesomeIcon icon={faPhone} className="text-gray-600" /> Phone</label>
        <input {...register("phone")} />
        {errors.phone && <p className="error">{errors.phone.message}</p>}
      </div>
      <div className="form-group">
        <label><FontAwesomeIcon icon={faCity} className="text-gray-600" /> City</label>
        <select {...register("city")}>
          <option value="">Select</option>
          <option value="Chandigarh">Chandigarh</option>
          <option value="Mohali">Mohali</option>
          <option value="Zirakpur">Zirakpur</option>
          <option value="Panchkula">Panchkula</option>
          <option value="Other">Other</option>
        </select>
        {errors.city && <p className="error">{errors.city.message}</p>}
      </div>
    </div>

    {/* Property Type & BHK */}
    <div className="form-row">
      <div className="form-group">
        <label><FontAwesomeIcon icon={faHome} className="text-gray-600" /> Property Type</label>
        <select {...register("propertyType")}>
          <option value="">Select</option>
          <option value="Apartment">Apartment</option>
          <option value="Villa">Villa</option>
          <option value="Plot">Plot</option>
          <option value="Office">Office</option>
          <option value="Retail">Retail</option>
        </select>
        {errors.propertyType && <p className="error">{errors.propertyType.message}</p>}
      </div>

      {(propertyType === "Apartment" || propertyType === "Villa") && (
        <div className="form-group">
          <label><FontAwesomeIcon icon={faHome} className="text-gray-600" />BHK</label>
          <select {...register("bhk")}>
            <option value="">Select</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="Studio">Studio</option>
          </select>
          {errors.bhk && <p className="error">{errors.bhk.message}</p>}
        </div>
      )}
    </div>

    {/* Purpose & Timeline */}
    <div className="form-row">
      <div className="form-group">
        <label><FontAwesomeIcon icon={faBullseye} className="text-gray-600" />Purpose</label>
        <select {...register("purpose")}>
          <option value="">Select</option>
          <option value="Buy">Buy</option>
          <option value="Rent">Rent</option>
        </select>
        {errors.purpose && <p className="error">{errors.purpose.message}</p>}
      </div>
      <div className="form-group">
        <label><FontAwesomeIcon icon={faCalendar} className="text-gray-600" />Timeline</label>
        <select {...register("timeline")}>
          <option value="">Select</option>
          <option value="0-3m">0–3 months</option>
          <option value="3-6m">3–6 months</option>
          <option value=">6m">More than 6 months</option>
          <option value="Exploring">Exploring</option>
        </select>
        {errors.timeline && <p className="error">{errors.timeline.message}</p>}
      </div>
    </div>

    {/* Budget Min & Max */}
    <div className="form-row">
      <div className="form-group">
        <label><FontAwesomeIcon icon={faIndianRupeeSign} className="text-gray-600" />Budget Min (INR)</label>
        <input type="number" {...register("budgetMin", { valueAsNumber: true })} />
        {errors.budgetMin && <p className="error">{errors.budgetMin.message}</p>}
      </div>
      <div className="form-group">
        <label><FontAwesomeIcon icon={faIndianRupeeSign} className="text-gray-600" />Budget Max (INR)</label>
        <input type="number" {...register("budgetMax", { valueAsNumber: true })} />
        {errors.budgetMax && <p className="error">{errors.budgetMax.message}</p>}
      </div>
    </div>

    {/* Source & Tags */}
    <div className="form-row">
      <div className="form-group">
        <label><FontAwesomeIcon icon={faBullhorn} className="text-gray-600" />Source</label>
        <select {...register("source")}>
          <option value="">Select</option>
          <option value="Website">Website</option>
          <option value="Referral">Referral</option>
          <option value="Walk-in">Walk-in</option>
          <option value="Call">Call</option>
          <option value="Other">Other</option>
        </select>
        {errors.source && <p className="error">{errors.source.message}</p>}
      </div>
      <div className="form-group">
        <label><FontAwesomeIcon icon={faTag} className="text-gray-600" />Tags (comma separated)</label>
        <input
          {...register("tags", {
            setValueAs: (v) => (v ? v.split(",").map((t) => t.trim()) : []),
          })}
        />
      </div>
    </div>

    {/* Notes */}
    <div className="form-group">
      <label>Notes</label>
      <textarea {...register("notes")} rows={4}></textarea>
      {errors.notes && <p className="error">{errors.notes.message}</p>}
    </div>

    {serverError && <p className="server-error">{serverError}</p>}

    <button type="submit" disabled={loading} className="submit-btn">
      {loading ? "Saving..." : "Create Buyer"}
    </button>
  </form>
</div>
</>
  );
}
