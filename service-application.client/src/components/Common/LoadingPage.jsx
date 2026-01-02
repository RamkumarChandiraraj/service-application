import React from "react";
import loadingGif from "../../assets/images/loading.gif";

const LoadingPage = () => {
  return (
    <div className="loading-overlay">
      <div className="loading-box">
        <img src={loadingGif} alt="Loading..." className="loading-gif" />
        <p className="loading-text">Please wait, loading...</p>
      </div>
    </div>
  );
};

export default LoadingPage;
