import { nanoid } from "nanoid";
import URL from "../model/urlbackend.js";

export async function GenerateShortUrl(req, res) {
  let originalUrl = req.body.url;

  if (!originalUrl) {
    return res.status(400).json({ error: "URL is required" });
  }
  if (
    !originalUrl.startsWith("http://") &&
    !originalUrl.startsWith("https://")
  ) {
    originalUrl = "https://" + originalUrl;
  }

  const shortID = nanoid(8);

  await URL.create({
    shortId: shortID,
    redirectURL: originalUrl,
    visitHistory: [],
  });

  const Shorturl = `${process.env.BASE_URL}/${shortID}`;
  return res.json({ Shorturl });
}

export async function findURL(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });

  if (!result) {
    return res.status(404).json({ error: "Short URL not found" });
  }

  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}
