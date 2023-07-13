const express = require("express");
const { randomBytes } = require("crypto");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;
  const comments = commentByPostId[req.params.id] || [];
  comments.push({ id: commentId, content, status: "Pending" });

  commentByPostId[req.params.id] = comments;

  await axios.post("http://localhost:4005/events", {
    type: "CommentCreated",
    data: {
      id: commentId,
      content: content,
      PostId: req.params.id,
      status: "Pendings",
    },
  });

  res.status(201).send(comments);
});

app.post("/events", async (req, res) => {
  console.log(req.body.type, "recieved events in comments");

  const { type, data } = req.body;
  if (type === "Moderated") {
    const { id, content, status, PostId } = data;
    const comments = commentByPostId[PostId];
    const comment = comments.find((commentid) => {
      return (commentid.id = id);
    });
    comment.status = status;

    await axios.post("http://localhost:4005/events", {
      type: "CommentUpdated",
      data: {
        id: id,
        PostId: PostId,
        content: content,
        status: status,
      },
    });
  }

  res.send({ status: "ok" });
});

app.listen(4001, () => {
  console.log("app is running at 4001");
});
