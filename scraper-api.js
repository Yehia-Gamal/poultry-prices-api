import express from "express";
import cors from "cors";
import fetch from "node-fetch"; // لو بتستخدم Node < 18
import * as cheerio from "cheerio";

const app = express();
app.use(cors());

const PORT = process.env.PORT || 8080;

async function getPoultryPrices() {
  const res = await fetch("https://elmorshdledwagn.com/prices/4");
  const html = await res.text();
  const $ = cheerio.load(html);
  const rows = [];

  $("table tbody tr").each((_, tr) => {
    const tds = $(tr).find("td");
    if (tds.length >= 4) {
      rows.push({
        company: $(tds[0]).text().trim(),
        white: $(tds[1]).text().trim(),
        red: $(tds[2]).text().trim(),
        change: $(tds[3]).text().trim(),
      });
    }
  });

  return rows;
}

app.get("/api/poultry-prices", async (req, res) => {
  try {
    const data = await getPoultryPrices();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "فشل في جلب البيانات." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ API شغال على http://localhost:${PORT}`);
});
