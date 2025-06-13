const express = require("express");
const cors = require("cors");
const { db } = require("./db/db");
const { readdirSync } = require("fs");
const multer = require("multer");
const path = require("path");
const router = require("./routes/transactions");
const app = express();
const userRouter = require("./routes/userRoute");

require("dotenv").config();

const PORT = process.env.PORT;

//middlewares
app.use(express.json());
app.use(cors());

app.use("/api/user", userRouter);
// image storage engine
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

// creating upload endpoint for images
app.use("/images", express.static("upload/images"));

app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:5000/images/${req.file.filename}`,
  });
});

//routes
readdirSync("./routes").map((route) =>
  app.use("/api/v1", require("./routes/" + route))
);

const server = () => {
  db();
  app.listen(PORT, () => {
    console.log("listening to port:", PORT);
  });
};

server();
