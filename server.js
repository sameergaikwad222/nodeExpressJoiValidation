require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const memberRoutes = require("./routes/members");
const mongoose = require("mongoose");
app.use(express.json());
app.use("/api/v1/members", memberRoutes);

try {
  mongoose.connect(
    process.env.DBURL,
    {
      useNewUrlParser: true,
    },
    (err) => {
      if (err) console.error(err);
      else console.log("Connected to database");
    }
  );

  app.listen(PORT, (req, res) => {
    console.log(`Application Server started on port ${PORT}`);
  });

  app.get("/", (req, res) => {
    res.send("<h1>SamNet Application Welcomes You</h1>");
  });
} catch (error) {
  console.log(
    `Could not connected to database or Start Server with error ${error}`
  );
}
