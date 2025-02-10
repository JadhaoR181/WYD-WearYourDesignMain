const express = require("express");
const cors = require("cors"); // Import CORS
const multer = require("multer");
const path = require("path");

const app = express();
const port = 3005;

// Enable CORS for all requests
app.use(cors());

// Configure storage for uploaded files
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});
const upload = multer({ storage });

// Serve static files from the uploads directory
app.use("/uploads", express.static("uploads"));

// Handle file upload
app.post("/upload", upload.single("fileToUpload"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const imageUrl = `http://192.168.170.115:3000/uploads/${req.file.filename}`; // Ensure correct URL for frontend
    res.json({ imageUrl });
});

app.listen(port, () => {
    console.log(`Server running at http://192.168.170.115:${port}`);
});
