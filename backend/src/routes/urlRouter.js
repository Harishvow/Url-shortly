import express from "express";
import GenerateShortUrl from "../controllers/shortUrl.js";

const router = express.Router();

router.post("/", GenerateShortUrl);
export default router;
