const express = require("express");
const { randomBytes } = require("crypto");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;
  if (type === "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }
  if (type === "CommentCreated") {
    const { id, content, PostId, status } = data;
    const post = posts[PostId];
    post.comments.push({ id, content, status });
  }
  console.log(posts);
  res.send({ status: "ok" });
});

app.listen(4003, () => {
  console.log("port is running at 4003");
});
