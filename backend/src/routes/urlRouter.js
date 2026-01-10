import express from "express";
import { GenerateShortUrl, findURL } from "../controllers/shortUrl.js";

const router = express.Router();

router.post("/", GenerateShortUrl);
router.get("/analytics/:shortId", findURL);
export default router;
