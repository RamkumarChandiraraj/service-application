import { useEffect } from "react";

const FcmToast = ({ title, body, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fcm-toast">
      <strong>{title}</strong>
      <p>{body}</p>
      <button onClick={onClose}>×</button>
    </div>
  );
};

export default FcmToast;
