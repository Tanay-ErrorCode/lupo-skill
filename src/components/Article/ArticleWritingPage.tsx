import React, { useState, FormEvent } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import "./ArticleWritingPage.css"; // Ensure the CSS is correctly applied

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

const ArticleWritingPage: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Article submitted:", { title, content });
    // Add your form submission logic here
  };

  return (
    <Container className="article-write">
      <form onSubmit={handleSubmit} className="article-form">
        <Typography variant="h4" component="h1" gutterBottom>
          Write a New Article
        </Typography>
        <BoldTextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          fullWidth
          margin="normal"
          className="article-input title-input"
          InputLabelProps={{ style: { fontWeight: "bold" } }} // Ensures the label is bold
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
          InputLabelProps={{ style: { fontWeight: "bold" } }} // Ensures the label is bold
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
    </Container>
  );
};

export default ArticleWritingPage;
