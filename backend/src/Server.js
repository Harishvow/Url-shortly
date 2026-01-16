import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import ConnectDb from "./Config/dbconfig.js";
import router from "./routes/urlRouter.js";
import URL from "./model/urlbackend.js";

dotenv.config();

console.log("Server file loaded");
console.log("BASE_URL:", process.env.BASE_URL);

await ConnectDb();

const app = express();
const port = process.env.PORT || 5054;

app.use(cors());
app.use(express.json());



app.get("/", (req, res) => {
  res.send("URL Shortener Backend is running ");
});


app.get("/:shortId", async (req, res) => {
  try {
    const shortId = req.params.shortId;

    console.log("Redirect request for:", shortId);

    const entry = await URL.findOneAndUpdate(
      { shortId },
      { $push: { visitHistory: { timestamp: Date.now() } } },
      { new: true }
    );

    if (!entry) {
      return res.status(404).send("Short URL not found");
    }

    // 🔑 FORCE redirect (important)
    return res.redirect(301, entry.redirectURL);
  } catch (error) {
    console.error("Redirect error:", error);
    return res.status(500).send("Redirect failed");
  }
});


app.use("/api/url", router);
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
