var express = require("express");
var cors = require("cors");
const fs = require("fs");
const multer = require("multer");
require("dotenv").config();

var app = express();

app.use(cors());
app.use("/public", express.static(process.cwd() + "/public"));


app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "./uploads";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage }); 

// Route to upload file and get metadata
app.post("/api/fileanalyse", upload.single("upfile"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const file = req.file;

  // Build metadata
  const metadata = {
    name: file.originalname,
    type: file.mimetype,
    size: file.size,
  };
  res.json(metadata);
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Your app is listening on port " + port);
});
