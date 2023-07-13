const express = require("express");
const { randomBytes } = require("crypto");
const bodyParser = require("body-parser");

const axios = require("axios");

const app = express();
app.use(bodyParser.json());

app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  if (type === "CommentCreated") {
    const status = data.content.includes("orange") ? "Rejected" : "Approved";
    await axios
      .post("http://localhost:4005/events", {
        type: "Moderated",
        data: {
          id: data.id,
          PostId: data.PostId,
          content: data.content,
          status,
        },
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
  res.send({ status: "Ok" });
});

app.listen(4004, () => {
  console.log("app is running at 4004");
});
