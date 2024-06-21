import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
} from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ClapIcon from "./clap.svg";
import "./ArticlesHomepage.css";

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
    authorProfileImage: "https://via.placeholder.com/50",
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
    <div className="articlehomepage-div">
      <div className="Articlehead">
        <h1>Articles</h1>
        <Link to="/article/write" className="create-article-button">
          Create Article
        </Link>
      </div>
      <div className="articles-container">
        {dummyArticles.map((article) => (
          <Card key={article.id} className="article-card">
            <div className="author-section">
              <CardMedia
                component="img"
                image={article.authorProfileImage}
                alt={article.authorName}
                className="author-image"
              />
              <div>
                <Typography variant="body2" className="article-author">
                  by {article.authorName}
                </Typography>
                {/* <Typography variant="body2" className="article-date">{article.publicationDate.toDateString()}</Typography> */}
              </div>
            </div>
            <CardContent className="article-details">
              <Typography
                variant="h5"
                component="div"
                className="article-title"
              >
                <Link to={`/article/${article.id}`}>{article.title}</Link>
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                className="article-description"
              >
                {article.description}
              </Typography>
              <div className="meta-info">
                <Typography variant="body2" className="time-ago">
                  {article.timeAgo}
                </Typography>
                <Typography variant="body2" className="read-time">
                  {article.readTime}
                </Typography>
              </div>
              <div className="icon-section">
                <IconButton size="small" className="comment-icon">
                  <i className="bi bi-chat"></i>
                  <span className="comment-count">{article.commentCount}</span>
                </IconButton>
                <IconButton size="small" className="clap-icon">
                  <img src={ClapIcon} alt="Clap icon" />
                  <span className="clap-count">{article.clapCount}</span>
                </IconButton>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ArticlesHomepage;
