"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { supabase } from "@/lib/validators/supabaseClient";
import "./login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Link from "next/link";


export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", password: "" });
  const [errors, setErrors] = useState({ name: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;
    const newErrors = { name: "", password: "" };

    if (!formData.name) {
      newErrors.name = "Name is required";
      hasError = true;
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
      hasError = true;
    }
    setErrors(newErrors);
    if (hasError) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("buyers")
        .select("*")
        .eq("name", formData.name)
        .eq("password", formData.password)
        .single();

      if (error || !data) {
        alert("Invalid name or password");
      } else {
        Cookies.set("user", `${data.name} ${data.ownerid}`, { expires: 7 });
        router.push("/home");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <button className="back-btn" onClick={() => router.push("/")}>
        <FontAwesomeIcon icon={faArrowLeft} /> Back
      </button>

      <div className="login-image">
        <Image
          src="/images/house.png"
          alt="Login Image"
          width={400}
          height={300}
          className="rounded floating"
        />
        <p className="slogan">
          Find your dream home with ease! <br />
          Join our community today.
        </p>
        <p className="slogan">Create your account to start exploring buyer leads.</p>
      </div>

      <div className="login">
        <form onSubmit={handleSubmit} className="login-form">
          <div className="logo">
            <Image
              src="/images/logo.png"
              alt="Login Image"
              width={100}
              height={70}
              className="logo"
            />
          </div>
          <h2 className="login-title">Login</h2>

          <div className="form-group">
            <label>
              <FontAwesomeIcon icon={faUser} className="text-gray-600" /> Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label>
              <FontAwesomeIcon icon={faLock} className="text-gray-600" /> Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <button type="submit" disabled={loading} className="login-btn">
            {loading ? "Logging in..." : "Login"}
          </button>
          <p className="account">
            Don`t have an account? <Link href="/buyers/new/register">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
