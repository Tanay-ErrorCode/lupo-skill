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
import ClapIconFilled from "./fillclap.svg"; // Add a filled clap icon for liked state
import "./ArticlesHomepage.css";
import { database } from "../../firebaseConf"; // Adjust the import path according to your project structure
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
  const [isLiking, setIsLiking] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (localStorage.getItem("userUid") == null) {
      window.location.href = "#/";
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

          // Fetch liked articles
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

  const handleLike = async (articleId: string) => {
    if (isLiking[articleId]) return; // Prevent multiple clicks

    const userUid = localStorage.getItem("userUid");
    if (!userUid) {
      console.error("User is not logged in.");
      return;
    }

    setIsLiking((prev) => ({ ...prev, [articleId]: true }));

    try {
      const articleRef = ref(database, `articles/${articleId}`);
      const articleSnapshot = await get(articleRef);

      if (articleSnapshot.exists()) {
        const articleData = articleSnapshot.val();
        let newLikesCount = articleData.likes || 0;

        let updatedLikedArticles = [...likedArticles];
        if (likedArticles.includes(articleId)) {
          // If already liked, unlike it
          newLikesCount = Math.max(newLikesCount - 1, 0);
          updatedLikedArticles = updatedLikedArticles.filter(
            (id) => id !== articleId
          );
        } else {
          // If not liked, like it
          newLikesCount += 1;
          updatedLikedArticles.push(articleId);
        }

        // Update likes count in the article
        await update(articleRef, { likes: newLikesCount });

        // Update the list of liked articles for the user as a comma-separated string
        const likedArticlesRef = ref(
          database,
          `users/${userUid}/likedArticles`
        );
        await set(likedArticlesRef, updatedLikedArticles.join(","));

        // Update local state
        setArticles((prevArticles) =>
          prevArticles.map((article) =>
            article.id === articleId
              ? { ...article, likes: newLikesCount }
              : article
          )
        );
        setLikedArticles(updatedLikedArticles);
      }
    } catch (error) {
      console.error("Error updating likes:", error);
      toast.error("Failed to update likes", { transition: Zoom });
    } finally {
      setIsLiking((prev) => ({ ...prev, [articleId]: false }));
    }
  };

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
                <Card key={article.id} className="article-card">
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
                      <Link to={`/article/${article.id}`}>{article.title}</Link>
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
                    <IconButton size="small" className="comment-icon">
                      <ChatBubbleOutlineIcon style={{ color: "#d1d1d1" }} />
                      <span className="comment-count">{article.comments}</span>
                    </IconButton>
                    <IconButton
                      size="small"
                      className="clap-icon"
                      onClick={() => handleLike(article.id)}
                      disabled={isLiking[article.id]}
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
                    </IconButton>
                  </CardActions>
                </Card>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ArticlesHomepage;
