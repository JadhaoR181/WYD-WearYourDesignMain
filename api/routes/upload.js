const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json({ limit: "10mb" })); // to parse large images

// Endpoint to save the final preview image
app.post("/api/save-preview", (req, res) => {
    const { imageUrl } = req.body;

    if (!imageUrl) {
        return res.status(400).json({ success: false, message: "No image provided" });
    }

    // Convert base64 string to binary image buffer
    const base64Data = imageUrl.replace(/^data:image\/png;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, "base64");

    // Define file path
    const uploadPath = path.join(__dirname, "public", "uploads", `${Date.now()}.png`);

    // Save the image to the server
    fs.writeFile(uploadPath, imageBuffer, (err) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Failed to save image" });
        }
        res.json({ success: true, message: "Image saved successfully", filePath: uploadPath });
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
