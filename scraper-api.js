import express from "express";
import fetch from "node-fetch";
import cheerio from "cheerio";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8080;
app.use(cors());

app.get("/api/poultry-prices", async (req, res) => {
  try {
    const response = await fetch("https://elmorshdledwagn.com/prices/4");
    const html = await response.text();
    const $ = cheerio.load(html);
    const data = [];

    $("table tbody tr").each((_, row) => {
      const tds = $(row).find("td");
      data.push({
        company: $(tds[0]).text().trim(),
        white: $(tds[1]).text().trim(),
        red: $(tds[2]).text().trim(),
        change: $(tds[3]).text().trim(),
      });
    });

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "فشل في جلب البيانات." });
  }
});

app.listen(PORT, () => console.log(`✅ API شغال على http://localhost:${PORT}`));
