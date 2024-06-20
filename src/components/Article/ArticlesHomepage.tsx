import React from "react";
import { Link } from "react-router-dom";
import "./ArticlesHomepage.css"; // Make sure to style the components

interface Article {
  id: string;
  title: string;
  authorName: string;
  authorProfileImage: string;
  publicationDate: Date;
  description: string;
  readTime: string;
  clapCount: number;
  commentCount: number;
  timeAgo: string;
}

const dummyArticles: Article[] = [
  {
    id: "1",
    title: "Navigating the World of AI: A Beginner’s Guide to Development",
    authorName: "Myself",
    authorProfileImage: "https://via.placeholder.com/50", // Placeholder image
    publicationDate: new Date(),
    description:
      "Introduction Artificial Intelligence (AI) is revolutionizing the way we interact with technology. From virtual assistants to predictive...",
    readTime: "2 min read",
    clapCount: 10,
    commentCount: 5,
    timeAgo: "18 hours ago",
  },
  {
    id: "2",
    title: "Game Development 101: Crafting Your First Game",
    authorName: "Myself",
    authorProfileImage: "https://via.placeholder.com/50",
    publicationDate: new Date(),
    description:
      "Learn the basics of game development and start creating your own games. This guide will walk you through the essential steps...",
    readTime: "3 min read",
    clapCount: 20,
    commentCount: 15,
    timeAgo: "20 hours ago",
  },
];

const ArticlesHomepage: React.FC = () => {
  return (
    <div className="ariclehomepage-div">
      <div className="Articlehead">
        <h1>Articles</h1>
        <Link to="/article/write" className="create-article-button">
          Create Article
        </Link>
      </div>
      <div className="articles-container">
        {dummyArticles.map((article) => (
          <div key={article.id} className="article-card">
            <div className="author-section">
              <img
                src={article.authorProfileImage}
                alt={article.authorName}
                className="author-image"
              />
              <div>
                <p className="article-author">by {article.authorName}</p>
                {/* <p className="article-date">{article.publicationDate.toDateString()}</p> */}
              </div>
            </div>
            <div className="article-details">
              <h2 className="article-title">
                <Link to={`/article/${article.id}`}>{article.title}</Link>
              </h2>
              <p className="article-description">{article.description}</p>
              <div className="meta-info">
                <p className="time-ago">{article.timeAgo}</p>
                <p className="read-time">{article.readTime}</p>
              </div>
              <div className="icon-section">
                <div className="comment-icon">
                  <i className="bi bi-chat"></i>
                  <span className="comment-count">{article.commentCount}</span>
                </div>
                <div className="clap-icon">
                  <img src="/clap.svg" alt="Clap icon" />
                  <span className="clap-count">{article.clapCount}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticlesHomepage;
