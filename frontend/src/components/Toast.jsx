import React, { useEffect, useState } from 'react';
import './Toast.css';

const Toast = ({ message, type = 'info', onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300); // Wait for fade-out animation
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`toast-container ${visible ? 'show' : 'hide'}`}>
      <div className={`toast toast-${type}`}>
        <span>{message}</span>
        <button className="toast-close" onClick={() => { setVisible(false); setTimeout(onClose, 300); }}>×</button>
      </div>
    </div>
  );
};

export default Toast;
