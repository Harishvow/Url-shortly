import {nanoid } from "nanoid";  
import URL from "../model/urlbackend.js";

async function GenerateShortUrl(req, res) {
  const body = req.body;
  if (!body.url) return res.status(400).json({ error: "URL is required" });
  const shortID = nanoid(8);
  await URL.create({
    shortId: shortID,
    redirectURL: req.body.url,
    visitHistory: [],
  });
  const Shorturl= `${process.env.BASE_URL}/${shortID}`;
  return res.json({ Shorturl });
}

export default GenerateShortUrl;
