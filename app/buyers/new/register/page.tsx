"use client";

import { useState } from "react";
import { supabase } from "@/lib/validators/supabaseClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faEye,
  faEyeSlash,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import "./login.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; 
import UserLoginPage from "../login/page";
import Link from "next/link";


export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = { name: "", password: "", confirmPassword: "" };
    let hasError = false;

    if (!formData.name) {
      newErrors.name = "Name is required";
      hasError = true;
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
      hasError = true;
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
      hasError = true;
    }
    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match";
      hasError = true;
    }

    setErrors(newErrors);

    if (!hasError) {
      const newUserId = crypto.randomUUID(); // generate UUID

      // Insert into Supabase
      const { data, error } = await supabase
        .from("buyers")
        .insert([
          {
            name: formData.name,
            password: formData.password, 
            timeline: "Exploring",
            ownerid: newUserId,
            updatedat: new Date().toISOString(),
          },
        ])
        .select();

      if (error) {
        console.error(error);
        alert("Error registering: " + error.message);
      } else {
        console.log("Inserted:", data);

Cookies.set("user", `${formData.name} ${newUserId}`, { expires: 7 });


        router.push("/"); 
      }
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
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="logo">
            <Image
              src="/images/logo.png"
              alt="Login Image"
              width={100}
              height={70}
              className="logo"
            />
          </div>
          <h2 className="login-title">Register</h2>

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

          <div className="form-group password-group">
            <label>
              <FontAwesomeIcon icon={faLock} className="text-gray-600" /> Password
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <div className="form-group password-group">
            <label>
              <FontAwesomeIcon icon={faLock} className="text-gray-600" /> Confirm Password
            </label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="error">{errors.confirmPassword}</p>
            )}
          </div>

          <button type="submit" className="login-btn">
            Register
          </button>
<p className="account">Already have an account? <Link href="/buyers/new/login">Login</Link></p>

        </form>
      </div>
    </div>
  );
}
