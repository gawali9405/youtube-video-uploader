import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { google } from "googleapis";

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// __dirname workaround for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  process.env.YOUTUBE_REDIRECT_URI
);

// ✅ Paste valid access token (temporary use only — valid for ~1 hour)
oauth2Client.setCredentials({
  refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
});

// YouTube API setup
const youtube = google.youtube({
  version: "v3",
  auth: oauth2Client,
});

// Upload video endpoint
app.post("/upload", async (req, res) => {
  const { videoURL } = req.body;
  const tempPath = path.join(__dirname, "temp_video.mp4");

  try {
    console.log("Downloading from:", videoURL);
    const writer = fs.createWriteStream(tempPath);
    const response = await axios.get(videoURL, {
      responseType: "stream",
    });

    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    console.log("Uploading to YouTube...");
    const uploadResponse = await youtube.videos.insert({
      part: ["snippet", "status"],
      requestBody: {
        snippet: {
          title: "Uploaded via URL",
          description:
            "This video was uploaded from a public URL by React app.",
        },
        status: {
          privacyStatus: "unlisted",
        },
      },
      media: {
        body: fs.createReadStream(tempPath),
      },
    });

    const videoId = uploadResponse.data.id;
    const videoLink = `https://www.youtube.com/watch?v=${videoId}`;
    console.log("✅ Upload Success:", videoLink);

    res.json({ videoLink });

    fs.unlink(tempPath, () => {});
  } catch (err) {
    console.error("❌ Upload error:", err.message);
    res.status(500).json({ error: "Upload failed", message: err.message });
  }
});

// Start server
app.listen(5000, () => {
  console.log("✅ Backend running at http://localhost:5000");
});
