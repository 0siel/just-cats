import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CatImage.css";

const CatImage = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const fetchRandomCatImage = async () => {
    setLoading(true);
    setCopied(false);
    try {
      const response = await axios.get(
        "https://api.thecatapi.com/v1/images/search"
      );
      const newImageUrl = response.data[0].url;
      setImageUrl(newImageUrl);
      window.history.pushState(
        null,
        "",
        `?catImage=${encodeURIComponent(newImageUrl)}`
      );
    } catch (error) {
      console.error("Error fetching cat image:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const shareUrl = `${window.location.origin}${
      window.location.pathname
    }?catImage=${encodeURIComponent(imageUrl)}`;
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
      })
      .catch((error) => console.error("Error copying to clipboard:", error));
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const catImageFromUrl = urlParams.get("catImage");
    if (catImageFromUrl) {
      setImageUrl(catImageFromUrl);
      setLoading(false);
    } else {
      fetchRandomCatImage();
    }
  }, []);

  return (
    <div className="cat-image-container">
      {loading ? <p>Loading...</p> : <img src={imageUrl} alt="Random Cat" />}
      <button onClick={fetchRandomCatImage}>Get Another Cat Image</button>
      <button onClick={copyToClipboard}>
        {copied ? "Copied!" : "Copy Link to Clipboard"}
      </button>
    </div>
  );
};

export default CatImage;
