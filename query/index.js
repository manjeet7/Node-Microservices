const express = require("express");
const { randomBytes } = require("crypto");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvents = (type, data) => {
  if (type === "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }
  if (type === "CommentCreated") {
    const { id, content, PostId, status } = data;
    const post = posts[PostId];
    post.comments.push({ id, content, status });
  }
  if (type === "CommentUpdated") {
    const { id, content, PostId, status } = data;
    const post = posts[PostId];
    const comments = post.comments.find((cid) => {
      return cid.id === id;
    });

    comments.status = status;
    comments.content = content;
  }
};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;
  handleEvents(type, data);
  console.log(posts);
  res.send({ status: "ok" });
});

app.listen(4003, async () => {
  console.log("port is running at 4003");
  const res = await axios.get("http//:localhost:4005/events");
  for (let event of res.data) {
    console.log("processing event ", event.data);
    handleEvents(event.type, event.data);
  }
});
