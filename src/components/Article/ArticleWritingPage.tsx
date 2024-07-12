import React, { useState, FormEvent, useEffect } from "react";
import { TextField, Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import "./ArticleWritingPage.css";
import { Card } from "react-bootstrap";
import { database } from "../../firebaseConf"; // Adjust the import path according to your project structure
import { ref, get, child, set, update } from "firebase/database";
import { toast, Zoom } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

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
interface Article {
  title: string;
  content: string;
  author: string;
  pic: string;
  likes: number;
  comments: number;
  readtime: string;
  createdBy: string;
  createdAt: number;
  id: string;
}

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
  const { articleId } = useParams<{ articleId: string }>();
  useEffect(() => {
    if (localStorage.getItem("userUid") == null) {
      window.location.href = "#/";
    }

    // adding content and title only when route contains some article Id
    if (articleId) {
      const fetchArticle = async () => {
        try {
          const articleRef = ref(database, `articles/${articleId}`);
          const snapshot = await get(articleRef);
          if (snapshot.exists()) {
            const articleData = snapshot.val();
            setTitle(articleData.title);
            setContent(articleData.content);
          } else {
            console.error("Article not found");
          }
        } catch (error) {
          console.error("Error fetching article:", error);
        }
      };

      fetchArticle();
    }
  }, [articleId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newarticleId = generateUUID();
    const userUid = localStorage.getItem("userUid");

    if (userUid) {
      const articleRef = articleId
        ? ref(database, `articles/${articleId}`)
        : ref(database, `articles/${newarticleId}`);
      const userRef = ref(database, `users/${userUid}`);

      try {
        const userSnapshot = await get(userRef);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.val();
          const author = userData.name || "Anonymous";
          const pic = userData.pic || userData.profile || "";

          // Fetch existing article data if updating
          let existingArticleData: Partial<Article> = {};
          if (articleId) {
            const articleSnapshot = await get(articleRef);
            if (articleSnapshot.exists()) {
              existingArticleData = articleSnapshot.val();
            } else {
              console.error("Article not found");
              toast.error("Article not found", { transition: Zoom });
              return;
            }
          }

          const newArticle = {
            ...existingArticleData, // Merge existing data
            title,
            content,
            author: existingArticleData.author || author,
            pic: existingArticleData.pic || pic,
            createdBy: userUid,
            createdAt: existingArticleData.createdAt || Date.now(),
            id: articleId || newarticleId,
          };

          if (articleId) {
            await update(articleRef, newArticle);
            toast.success("Article updated successfully!", {
              transition: Zoom,
            });
            navigate("/article");
          } else {
            await set(articleRef, newArticle);
            const updatedCreatedArticles = userData.createdArticles
              ? `${userData.createdArticles},${newArticle.id}`
              : newArticle.id;

            await set(userRef, {
              ...userData,
              createdArticles: updatedCreatedArticles,
            });
            toast.success("Article created successfully!", {
              transition: Zoom,
            });
          }

          navigate("/article");
        }
      } catch (error) {
        console.error("Error creating/updating article:", error);
        toast.error("Failed to create/update article", { transition: Zoom });
      }
    } else {
      toast.error("Please login first", { transition: Zoom });
    }
  };

  return (
    <Card className="article-write shadow">
      <Card.Title className="article-write-title">
        <Typography variant="h4" component="h1" fontWeight={600} gutterBottom>
          {articleId ? "Edit Article" : "Write a New Article"}
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
          {articleId ? "Update" : "Submit"}
        </Button>
      </form>
    </Card>
  );
};

export default ArticleWritingPage;
