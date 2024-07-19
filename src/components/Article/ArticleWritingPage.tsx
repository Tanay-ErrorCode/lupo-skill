import React, { useState, FormEvent, useEffect } from "react";
import { TextField, Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import "./ArticleWritingPage.css";
import { Card } from "react-bootstrap";
import { database } from "../../firebaseConf"; // Adjust the import path according to your project structure
import { ref, get, set } from "firebase/database";
import { toast, Zoom } from "react-toastify";
import { useNavigate } from "react-router-dom";

const BoldTextField = styled(TextField)({
  "& .MuiInputBase-input": {
    fontWeight: "bold",
  },
  "& .MuiInputLabel-root": {
    fontWeight: "bold",
  },
  "& .MuiInputBase-input::placeholder": {
    fontWeight: "bold",
  },
});

function generateUUID() {
  var d = new Date().getTime();
  var d2 =
    (typeof performance !== "undefined" &&
      performance.now &&
      performance.now() * 1000) ||
    0;
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.random() * 16;
    if (d > 0) {
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

const ArticleWritingPage: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("userUid") == null) {
      window.location.href = "#/";
    }
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const userUid = localStorage.getItem("userUid");
    if (userUid) {
      const articleId = generateUUID();

      const articleRef = ref(database, `articles/${articleId}`);
      const userRef = ref(database, `users/${userUid}`);

      try {
        // Fetch user details
        const userSnapshot = await get(userRef);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.val();
          const author = userData.name || "Anonymous";
          const pic = userData.pic || userData.profile || "";

          const newArticle = {
            id: articleId,
            title,
            content,
            author,
            pic,
            likes: 0,
            comments: 0,
            readtime: "2 min",
            createdBy: userUid,
            createdAt: Date.now(),
          };

          // Store article in the database
          await set(articleRef, newArticle);

          // Update user's createdArticles field
          const updatedCreatedArticles = userData.createdArticles
            ? `${userData.createdArticles},${articleId}`
            : articleId;

          await set(userRef, {
            ...userData,
            createdArticles: updatedCreatedArticles,
          });

          toast.success("Article created successfully!", { transition: Zoom });
          navigate("/article");
        }
      } catch (error) {
        console.error("Error creating article:", error);
        toast.error("Failed to create article", { transition: Zoom });
      }
    } else {
      toast.error("Please login first", { transition: Zoom });
    }
  };

  useEffect(() => {
    if (title || content) {
      localStorage.setItem("articleDraft", "true");
    } else {
      localStorage.removeItem("articleDraft");
    }
  }, [title, content]);

  return (
    <Card className="article-write shadow">
      <Card.Title className="article-write-title">
        <Typography variant="h4" component="h1" fontWeight={600} gutterBottom>
          Write a New Article
        </Typography>
      </Card.Title>

      <form onSubmit={handleSubmit} className="article-form">
        <BoldTextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          fullWidth
          margin="normal"
          className="article-input title-input"
          InputLabelProps={{ style: { fontWeight: "bold" } }}
          InputProps={{
            style: { fontWeight: "bold" },
            placeholder: "Title",
          }}
        />
        <TextField
          label="Tell your story..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          fullWidth
          multiline
          rows={10}
          margin="normal"
          className="article-textarea"
          InputLabelProps={{ style: { fontWeight: "bold" } }}
          InputProps={{
            placeholder: "Tell your story...",
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="mt-4 submit-button"
        >
          Submit
        </Button>
      </form>
    </Card>
  );
};

export default ArticleWritingPage;
