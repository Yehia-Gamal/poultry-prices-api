import express from "express";
import fetch from "node-fetch";
import cheerio from "cheerio";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(
  cors({
    origin: "*",
    methods: ["GET"],
  })
);

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

app.get("/", (_, res) => res.send("✅ API is live and ready!"));

app.listen(PORT, () => console.log(`✅ API شغال على البورت ${PORT}`));
