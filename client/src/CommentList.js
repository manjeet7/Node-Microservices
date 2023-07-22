import React, { useState, useEffect } from "react";

const CommentList = ({ comments }) => {
  const renderedComments = comments.map((comment) => {
    let content;
    if (comment.status === "Approved") {
      content = comment.content;
    }
    if (comment.status === "Pendings") {
      content = "This commend is pending for moderation";
    }
    if (comment.status === "Rejected") {
      content = "This comment is rejected";
    }

    return <li key={comment.id}>{content}</li>;
  });

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
