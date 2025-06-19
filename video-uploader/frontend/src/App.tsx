import { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import LogoutButton from "./LogoutButton";
import axios from "axios";

interface GoogleUser {
  name?: string;
  email?: string;
  picture?: string;
  [key: string]: any;
}

const App = () => {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [videoURL, setVideoURL] = useState("");
  const [uploadedVideos, setUploadedVideos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleLoginSuccess = (credentialResponse: any) => {
    const { credential } = credentialResponse;
    if (credential) {
      const decoded: any = jwtDecode(credential);
      console.log("User Info:", decoded);
      setUser(decoded);
      localStorage.setItem("googleUser", JSON.stringify(decoded));
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("googleUser");
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("googleUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleUpload = async () => {
    if (!videoURL) return alert("Please enter a video URL.");
    try {
      setUploading(true);
      const response = await axios.post("http://localhost:5000/upload", {
        videoURL,
      });
      const { videoLink } = response.data;
      setUploadedVideos((prev) => [videoLink, ...prev]);
      setVideoURL("");
      alert("✅ Video uploaded successfully!\nYouTube Link: " + videoLink);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>YouTube Video Uploader</h1>
      {!user ? (
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={() => console.log("Login Failed")}
        />
      ) : (
        <>
          <p>
            Welcome, <strong style={{ color: "orange" }}>{user.name}</strong>
          </p>
          <LogoutButton onLogout={handleLogout} />

          <div style={{ marginTop: "20px" }}>
            <input
              type="text"
              placeholder="Enter MP4 video URL"
              value={videoURL}
              onChange={(e) => setVideoURL(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
              }}
            />
            <button
              onClick={handleUpload}
              disabled={uploading}
              style={{
                padding: "10px 20px",
                backgroundColor: "#4285F4",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>

          <div style={{ marginTop: "20px" }}>
            <h3>Uploaded Videos</h3>
            <ul>
              {uploadedVideos.map((link, index) => (
                <li key={index}>
                  <a href={link} target="_blank" rel="noopener noreferrer">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
