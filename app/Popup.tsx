"use client";

import React, { useEffect } from "react";
import "./Popup.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faCross, faX } from "@fortawesome/free-solid-svg-icons";

interface PopupProps {
  message: string;
  type?: "success" | "error";
  duration?: number; // milliseconds
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ message, type = "success", duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`popup ${type}`}>
      <p>{message}</p>
        <FontAwesomeIcon onClick={onClose} icon={faClose} className="text-gray-600 close" />
    </div>
  );
};

export default Popup;
