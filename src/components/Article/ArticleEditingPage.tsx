// ArticleEditingPage.tsx

import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Paper,
} from "@mui/material";
import { ref, update, get } from "firebase/database";
import { database } from "../../firebaseConf";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import "./ArticleWritingPage.css";
import { Card } from "react-bootstrap";
import styled from "@emotion/styled";
import { toast } from "react-toastify";

interface ArticleEditingPageProps {
  title: string;
  content: string;
}

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

const ArticleEditingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  // Extract title and content from location state
  const { title, content } = location.state as ArticleEditingPageProps;

  const [updatedTitle, setUpdatedTitle] = useState(title);
  const [updatedContent, setUpdatedContent] = useState(content);
  const [loading, setLoading] = useState(false);

  const handleUpdateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const articleRef = ref(database, `articles/${id}`);
      const articleSnapshot = await get(articleRef);

      if (articleSnapshot.exists()) {
        const articleData = articleSnapshot.val();
        await update(articleRef, {
          ...articleData, // Preserve other existing data
          title: updatedTitle,
          content: updatedContent,
        });
        toast.success("Article Updated Successfully!");
        navigate(`/article/${id}`);
      } else {
        toast.error("Article not found for update");
      }
    } catch (error) {
      console.error("Error updating article:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="article-write shadow">
      <Card.Title className="article-write-title">
        <Typography variant="h4" component="h1" fontWeight={600} gutterBottom>
          Edit Article
        </Typography>
      </Card.Title>

      <form onSubmit={handleUpdateArticle} className="article-form">
        <BoldTextField
          label="Title"
          value={updatedTitle}
          onChange={(e) => setUpdatedTitle(e.target.value)}
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
          value={updatedContent}
          onChange={(e) => setUpdatedContent(e.target.value)}
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
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Submit"}
        </Button>
      </form>
    </Card>
  );
};

export default ArticleEditingPage;
