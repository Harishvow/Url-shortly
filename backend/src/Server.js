import express from "express";
import ConnectDb from "../Config/dbconfig.js";
import router from "../routes/urlRouter.js";
import URL from "./model/urlbackend.js";
import dotenv from "dotenv";
dotenv.config();
console.log(process.env.BASE_URL);


ConnectDb();

const app = express();
const port = process.env.PORT || 5053;

app.use(express.json());
app.use("/url", router);
app.use("/analytics/:shortId",router);
app.get("/:shortId",async (req, res) => {
  const shortId= req.params.shortId;
   const entry=await URL.findOneAndUpdate(
    {shortId},
    {$push:{
        visitHistory:{timestamp:Date.now()}
    }},


  )
  res.redirect(entry.redirectURL)

});



app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
