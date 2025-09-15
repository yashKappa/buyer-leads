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
import Cookies from "js-cookie";
import { supabase } from "@/lib/validators/supabaseClient";
import Popup from "../../Popup";


type BuyerFormData = z.infer<typeof createBuyer>;

export default function NewBuyerPage() {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [popupType, setPopupType] = useState<"success" | "error">("success");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<BuyerFormData>({
    defaultValues: { status: "New" },
  });

  const propertyType = watch("propertyType");

  const onSubmit = async (data: BuyerFormData) => {
    setLoading(true);
    setServerError(null);

    try {
      const userCookie = Cookies.get("user");
      if (!userCookie) {
        setServerError("User not logged in.");
        setPopupMessage("User not logged in.");
        setPopupType("error");
        setLoading(false);
        return;
      }

      const decoded = decodeURIComponent(userCookie);
      const parts = decoded.split(" ");
      const ownerExternalId = parts[1];
      if (!ownerExternalId) {
        setServerError("Invalid cookie format.");
        setPopupMessage("Invalid cookie format.");
        setPopupType("error");
        setLoading(false);
        return;
      }

      let { data: buyer, error: buyerError } = await supabase
        .from("buyers")
        .select("id, ownerid")
        .eq("ownerid", ownerExternalId)
        .single();

      if (buyerError && buyerError.code !== "PGRST116") {
        setServerError("Error checking buyer.");
        setPopupMessage("Error checking buyer.");
        setPopupType("error");
        setLoading(false);
        return;
      }

      if (!buyer) {
        const { data: newBuyer, error: insertError } = await supabase
          .from("buyers")
          .insert([{ ownerid: ownerExternalId }])
          .select("id, ownerid")
          .single();

        if (insertError) {
          setServerError("Could not create buyer.");
          setPopupMessage("Could not create buyer.");
          setPopupType("error");
          setLoading(false);
          return;
        }
        buyer = newBuyer;
      }

      const { error } = await supabase.from("buyers_data").insert([
        {
          owner_id: buyer.id,
          owner_external_id: ownerExternalId,
          full_name: data.fullName,
          email: data.email,
          phone: data.phone,
          city: data.city,
          property_type: data.propertyType,
          bhk: data.bhk,
          purpose: data.purpose,
          timeline: data.timeline,
          status: data.status,
          budget_min: data.budgetMin,
          budget_max: data.budgetMax,
          source: data.source,
          tags: data.tags,
          notes: data.notes,
          created_at: new Date().toISOString(),
        },
      ]);


      if (error) {
        setServerError(error.message);
        setPopupMessage(error.message);
        setPopupType("error");
      } else {
        setPopupMessage("✔ Buyer lead created successfully!");
        setPopupType("success");
        reset();

        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (e) {
      console.error(e);
      setServerError("Something went wrong.");
      setPopupMessage("Something went wrong.");
      setPopupType("error");
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
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
          <div className="form-row">
            <div className="form-group">
              <label><FontAwesomeIcon icon={faClock} className="text-gray-600" /> Status</label>
              <select {...register("status")}>
                <option value="New">New</option>
                <option value="Qualified">Qualified</option>
                <option value="Contacted">Contacted</option>
                <option value="Visited">Visited</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Converted">Converted</option>
                <option value="Dropped">Dropped</option>
              </select>
              {errors.status && <p className="error">{errors.status.message}</p>}
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
      {popupMessage && (
        <Popup
          message={popupMessage}
          type={popupType}
          onClose={() => setPopupMessage(null)}
        />
      )}
    </>
  );
}
