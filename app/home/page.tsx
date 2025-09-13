"use client";
import Navbar from "../navbar"; // Adjust the path if needed

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main style={{ padding: "20px" }}>
        <h1>Welcome to Buyer Leads</h1>
        <p>
          This is the home page. You can navigate to other sections like Buyers or Add Buyer using your app's navigation.
        </p>
      </main>
    </>
  );
}
