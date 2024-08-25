import express from "express";
import qr from "qr-image";
import { Readable } from "stream";
import path from "path";
import { fileURLToPath } from "url";

// ES6 modüllerinde __dirname kullanımı
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public"))); // Statik dosyaların yolu
app.set("views", path.join(__dirname, "../views")); // View dosyalarının yolu
app.set("view engine", "html");

// Serve the form
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "index.html"));
});

app.post("/generate", (req, res) => {
  const { url } = req.body;
  try {
    const qr_png = qr.image(url, { type: "png" });

    // QR kodunu bellek içi bir buffer'a yazın
    const buffer = [];
    qr_png.on("data", (chunk) => buffer.push(chunk));
    qr_png.on("end", () => {
      const qrImageBuffer = Buffer.concat(buffer);
      res.set("Content-Type", "image/png");
      res.set("Content-Disposition", 'attachment; filename="qrcode.png"');
      res.send(qrImageBuffer);
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).send("An internal error occurred");
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
