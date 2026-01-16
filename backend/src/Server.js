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


app.use("/api/url", router);
app.get("/", (req, res) => {
  res.send("URL Shortener Backend is running ");
});


app.get("/:shortId", async (req, res) => {
  const { shortId } = req.params;

  const entry = await URL.findOneAndUpdate(
    { shortId },
    { $push: { visitHistory: { timestamp: Date.now() } } },
    { new: true }
  );

  if (!entry) {
    return res.status(404).send("Short URL not found");
  }

  res.redirect(entry.redirectURL);
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
