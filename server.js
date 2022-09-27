const express = require("express");
const app = express();
const PORT = process.env.PORT || 5001
app.use(express.json());
// update data in postgresql

app.use("/aircaft", require("./routes/aircaft"));

// function of software server

app.use("/real-time", require("./routes/realtime"));

app.use("/team-management", require("./routes/teamManagement"));

// route flight statistics
app.use("/flightstatistics", require("./routes/flightStatistics"));
app.get("/", async (req, res)=>{
  res.setHeader("Content-Type", "text/html");
  res.status(200);
  res.send("<h1> Hello Word </h1>");
});
app.listen(PORT, () => {
  console.log(`Server is starting on port ${PORT}`);
});