import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Avatar,
  CardHeader,
  CardActionArea,
  CardActions,
} from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ClapIcon from "./clap.svg";
import "./ArticlesHomepage.css";
import { red } from "@mui/material/colors";
import { CardTitle } from "react-bootstrap";

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
        <Typography variant="h4" component="h1" fontWeight={600} gutterBottom>
          Articles
        </Typography>
        <Link to="/article/write" className="create-article-button">
          Create Article
        </Link>
      </div>
      <div className="articles-container">
        {dummyArticles.map((article) => (
          <Card key={article.id} className="article-card">
            <CardHeader
              avatar={
                <Avatar
                  alt={article.authorName}
                  src={article.authorProfileImage}
                />
              }
              title={article.authorName}
              subheader={article.timeAgo}
            />

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
                <Typography variant="body2" className="read-time">
                  {article.readTime}
                </Typography>
              </div>
            </CardContent>

            <CardActions>
              <IconButton size="small" className="comment-icon">
                <ChatBubbleOutlineIcon />
                <span className="comment-count">{article.commentCount}</span>
              </IconButton>
              <IconButton size="small" className="clap-icon">
                <img
                  src={ClapIcon}
                  alt="Clap icon"
                  style={{ width: "1.3rem" }}
                />
                <span className="clap-count">{article.clapCount}</span>
              </IconButton>
            </CardActions>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ArticlesHomepage;
