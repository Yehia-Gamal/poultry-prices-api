import express from "express";
import cors from "cors";
import * as cheerio from "cheerio";

const app = express();
const PORT = process.env.PORT || 8080;

// افتح لأي دومين عشان تتجنب CORS
app.use(cors({ origin: "*" }));

// مسار تأكيد التشغيل
app.get("/", (req, res) => {
  res.send("✅ API is live and ready!");
});

// دالة جلب البيانات من المرشد
async function getPoultryPrices() {
  const res = await fetch("https://elmorshdledwagn.com/prices/4");
  const html = await res.text();
  const $ = cheerio.load(html);
  const rows = [];

  $("table tbody tr").each((_, tr) => {
    const [c1, c2, c3, c4] = $(tr).find("td").toArray();
    if (c4) {
      rows.push({
        company: $(c1).text().trim(),
        white: $(c2).text().trim(),
        red: $(c3).text().trim(),
        change: $(c4).text().trim(),
      });
    }
  });

  return rows;
}

// المسار اللي يرجع JSON
app.get("/api/poultry-prices", async (req, res) => {
  try {
    const data = await getPoultryPrices();
    res.json(data);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: "فشل في جلب البيانات." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ API شغال على البورت ${PORT}`);
});
