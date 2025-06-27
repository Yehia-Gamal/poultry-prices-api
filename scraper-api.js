import express from "express";
import fetch from "node-fetch";
import cheerio from "cheerio";
import cors from "cors";

const app = express();
app.use(cors());
const PORT = process.env.PORT || 8080;

// ✅ المسار الرئيسي لو حد فتح اللينك مباشرة
app.get("/", (req, res) => {
  res.send("✅ API is live and ready!");
});

// 🐔 هنا بقى المسار اللي بيجيب الأسعار
app.get("/api/poultry-prices", async (req, res) => {
  try {
    const response = await fetch("https://elmorshdledwagn.com/prices/4");
    const html = await response.text();
    const $ = cheerio.load(html);
    const prices = [];

    $("table tbody tr").each((_, tr) => {
      const tds = $(tr).find("td");
      if (tds.length >= 4) {
        prices.push({
          company: $(tds[0]).text().trim(),
          white: $(tds[1]).text().trim(),
          red: $(tds[2]).text().trim(),
          change: $(tds[3]).text().trim(),
        });
      }
    });

    res.json(prices);
  } catch (err) {
    res.status(500).json({ error: "فشل في جلب البيانات" });
  }
});

app.listen(PORT, () => console.log(`✅ API شغال على البورت ${PORT}`));
