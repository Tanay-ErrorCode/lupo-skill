import React, { useState, useEffect, FormEvent, forwardRef } from "react";
import { Box, TextField, Button, Typography, Avatar } from "@mui/material";
import { getDatabase, ref, set } from "firebase/database";
import moment from "moment";
import { Link } from "react-router-dom";

const modalStyle = {
  borderTop: "1px solid rgba(0, 0, 0, 0.189)",
  marginTop: "2rem",
  paddingTop: "2rem",
};

interface User {
  name: string;
  pic: string;
  uid: string;
}

interface CommentData {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  authoruid: string;
}

interface DiscussionModalProps {
  blogId: string;
  comments: CommentData[];
}

const DiscussionModal = forwardRef<HTMLDivElement, DiscussionModalProps>(
  ({ blogId, comments }, refer) => {
    const [newComment, setNewComment] = useState("");

    // Retrieve user information from localStorage
    const user: User = {
      name: localStorage.getItem("username") || "Guest User",
      pic: localStorage.getItem("userPic") || "https://via.placeholder.com/150",
      uid: localStorage.getItem("userUid") || "",
    };

    function generateUUID() {
      var d = new Date().getTime();
      var d2 =
        (typeof performance !== "undefined" &&
          performance.now &&
          performance.now() * 1000) ||
        0;
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = Math.random() * 16;
          if (d > 0) {
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
          } else {
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
          }
          return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
        }
      );
    }

    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();

      if (newComment.trim() && user) {
        const db = getDatabase();
        const newCommentId = generateUUID();
        const newCommentData: CommentData = {
          id: newCommentId,
          author: user.name,
          avatar: user.pic,
          authoruid: user.uid,
          content: newComment,
          timestamp: new Date().toISOString(),
        };

        const commentRef = ref(
          db,
          `articles/${blogId}/comments/${newCommentId}`
        );
        await set(commentRef, newCommentData);

        setNewComment("");
      }
    };

    return (
      <div>
        <Box sx={modalStyle} ref={refer}>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h6">
              Discussions ({comments.length} Threads)
            </Typography>
          </Box>
          <Box mt={2}>
            <Box display="flex" alignItems="center">
              <Avatar src={user.pic} alt={user.name} />
              <Typography ml={2} variant="subtitle1">
                {user.name}
              </Typography>
            </Box>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Write Your Comments Here"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              multiline
              rows={4}
              margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
          <Box mt={4}>
            {comments.map((comment) => (
              <Comment key={comment.id} data={comment} />
            ))}
          </Box>
        </Box>
      </div>
    );
  }
);

interface CommentProps {
  data: CommentData;
}

const Comment: React.FC<CommentProps> = ({ data }) => {
  return (
    <Box mt={2} borderBottom="1px solid #ddd" pb={2}>
      <Box display="flex" alignItems="center" className="header_comment">
        <Link to={`/profile/${data.authoruid}`}>
          <Avatar src={data.avatar} alt={data.author} />
        </Link>
        <Box ml={2}>
          <Link className="article_link" to={`/profile/${data.authoruid}`}>
            <Typography variant="subtitle2">{data.author}</Typography>
          </Link>
          <Typography variant="caption" color="textSecondary">
            {moment(data.timestamp).fromNow()}
          </Typography>
        </Box>
      </Box>
      <Typography className="comment_text" mt={1} ml={7}>
        {data.content}
      </Typography>
    </Box>
  );
};

export default DiscussionModal;
