import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Avatar,
  CardHeader,
  CardActions,
} from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { Spinner } from "react-bootstrap";
import moment from "moment";
import DOMPurify from "dompurify";
import { marked } from "marked";
import ClapIcon from "./clap.svg";
import ClapIconFilled from "./fillclap.svg";
import "./ArticlesHomepage.css";
import { database } from "../../firebaseConf";
import { ref, get, set, update } from "firebase/database";
import { toast, Zoom } from "react-toastify";

interface Article {
  id: string;
  title: string;
  author: string;
  pic: string;
  createdAt: number;
  content: string;
  readtime: string;
  likes: number;
  comments: number;
  createdBy: string;
}

const ArticlesHomepage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [likedArticles, setLikedArticles] = useState<string[]>([]);

  useEffect(() => {
    if (localStorage.getItem("userUid") == null) {
      window.location.href = "/";
    }
    const fetchArticles = async () => {
      const articlesRef = ref(database, "articles");
      const userUid = localStorage.getItem("userUid");

      if (!userUid) {
        console.error("User is not logged in.");
        return;
      }

      try {
        const snapshot = await get(articlesRef);
        if (snapshot.exists()) {
          const articlesData = snapshot.val();
          const articlesList = Object.keys(articlesData).map((key) => {
            const article = articlesData[key];
            return {
              ...article,
              id: key,
              createdAt: article.createdAt,
            };
          });
          setArticles(articlesList);

          const likedArticlesRef = ref(
            database,
            `users/${userUid}/likedArticles`
          );
          const likedArticlesSnapshot = await get(likedArticlesRef);
          if (likedArticlesSnapshot.exists()) {
            const likedArticlesString = likedArticlesSnapshot.val();
            setLikedArticles(likedArticlesString.split(","));
          }
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
        toast.error("Failed to fetch articles", { transition: Zoom });
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const stripMarkdown = (content: string) => {
    const cleanHtml = DOMPurify.sanitize(marked(content) as string);
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = cleanHtml;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  return (
    <div className="articlehomepage-div">
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center spinner-container">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          <div className="Articlehead">
            <Typography
              variant="h4"
              component="h1"
              fontWeight={600}
              gutterBottom
            >
              Articles
            </Typography>
            <Link to="/article/write" className="create-article-button">
              Create Article
            </Link>
          </div>
          <div className="articles-container">
            {articles.length === 0 ? (
              <Typography
                variant="h4"
                component="div"
                className="no-articles-message"
                style={{ textAlign: "center", marginTop: "20px" }}
              >
                No Articles For Now
              </Typography>
            ) : (
              articles.map((article) => (
                <Link
                  key={article.id}
                  to={`/article/${article.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Card className="article-card">
                    <CardHeader
                      avatar={
                        <Link to={`/profile/${article.createdBy}`}>
                          <Avatar alt={article.author} src={article.pic} />
                        </Link>
                      }
                      title={
                        <Link
                          className="article_link"
                          to={`/profile/${article.createdBy}`}
                        >
                          By {article.author}
                        </Link>
                      }
                      subheader={moment(article.createdAt).fromNow()}
                    />
                    <CardContent className="article-details">
                      <Typography
                        variant="h5"
                        component="div"
                        className="article-title"
                      >
                        {article.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        className="article-description"
                      >
                        {stripMarkdown(article.content)}
                      </Typography>
                      <div className="meta-info">
                        <Typography variant="body2" className="read-time">
                          {article.readtime} read
                        </Typography>
                      </div>
                    </CardContent>
                    <CardActions>
                      <Typography className="comment-icon">
                        <ChatBubbleOutlineIcon style={{ color: "#d1d1d1" }} />
                        <span className="comment-count">
                          {article.comments}
                        </span>
                      </Typography>
                      <Typography
                        className="clap-icon"
                        style={{ userSelect: "none" }}
                      >
                        <img
                          src={
                            likedArticles.includes(article.id)
                              ? ClapIconFilled
                              : ClapIcon
                          }
                          alt="Clap icon"
                          style={{ width: "1.3rem", userSelect: "none" }}
                        />
                        <span className="clap-count">{article.likes}</span>
                      </Typography>
                    </CardActions>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ArticlesHomepage;
