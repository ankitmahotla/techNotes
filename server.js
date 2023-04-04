require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3500;
const { logger } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConn");
const mongoose = require("mongoose");
const { logEvents } = require("./middleware/logger");

connectDB();

app.use(logger);

app.use(cors(corsOptions));

// Allows app to Recieve and parse JSON data (Built in middleware)
app.use(express.json());

app.use(cookieParser());

// Serves static files like images and css files (Built in middleware)
app.use("/", express.static(path.join(__dirname, "public")));

// Serves html pages using express.Router()
app.use("/", require("./routes/root"));

// Catch all route to display 404 Error Page when the user reaches a page that doesnt exists
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  // Used to start the server.
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
