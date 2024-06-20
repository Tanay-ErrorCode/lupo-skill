import React, { useState, FormEvent } from "react";
import ReactMarkdown from "react-markdown";
import "./ArticleWritingPage.css"; // Ensure the CSS is correctly applied

const ArticleWritingPage: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Article submitted:", { title, content });
    // Add your form submission logic here
  };

  return (
    <div className="article-write">
      <form onSubmit={handleSubmit} className="article-form">
        <div className="title-container">
          <i className="bi bi-plus-circle"></i>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="article-input title-input"
          />
        </div>
        <textarea
          placeholder="Tell your story..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="article-textarea"
        ></textarea>
      </form>
      <div className="markdown-preview">
        <h1>Preview:</h1>
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default ArticleWritingPage;
