import express from "express";
import qr from "qr-image";
import fs from "fs";
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
  const qr_png = qr.image(url, { type: "png" });
  const qrPath = `qr-${Date.now()}.png`;

  const writeStream = fs.createWriteStream(qrPath);
  qr_png.pipe(writeStream);

  writeStream.on("finish", () => {
    res.download(qrPath, (err) => {
      if (err) throw err;
      fs.unlinkSync(qrPath); // Dosya indirildikten sonra silinir
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
