import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Avatar,
  Box,
  Paper,
  IconButton,
  CircularProgress,
  CardActions,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { ref, get, update, set } from "firebase/database";
import { database } from "../../firebaseConf";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ClapIcon from "./clap.svg";
import ClapIconFilled from "./fillclap.svg"; // Add the filled clap icon for liked state
import { marked } from "marked";
import DOMPurify from "dompurify";
import "./ArticlePage.css";
import moment from "moment";
import PageTitle from "../../utils/PageTitle";
import { toast, Zoom } from "react-toastify";
import Signup from "../Signup/Signup";

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

const ArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [likedArticles, setLikedArticles] = useState<string[]>([]);
  const [isLiking, setIsLiking] = useState<boolean>(false);

  const [show, setShow] = useState(false);
  const userUid = localStorage.getItem("userUid");
  useEffect(() => {
    const fetchArticle = async () => {
      const userUid = localStorage.getItem("userUid");

      try {
        const articleRef = ref(database, `articles/${id}`);
        const snapshot = await get(articleRef);
        if (snapshot.exists()) {
          setArticle(snapshot.val());
        } else {
          console.error("No article found");
        }
        if (userUid) {
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
        } else {
          setLikedArticles([]);
        }
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleLike = async () => {
    if (isLiking || !article) return; // Prevent multiple clicks and check if article is loaded

    const userUid = localStorage.getItem("userUid");
    if (!userUid) {
      console.error("User is not logged in.");
      setShow(true);
      return;
    }

    setIsLiking(true);

    try {
      const articleRef = ref(database, `articles/${id}`);
      const articleSnapshot = await get(articleRef);

      if (articleSnapshot.exists()) {
        const articleData = articleSnapshot.val();
        let newLikesCount = articleData.likes || 0;

        let updatedLikedArticles = [...likedArticles];
        if (likedArticles.includes(id!)) {
          // If already liked, unlike it
          newLikesCount = Math.max(newLikesCount - 1, 0);
          updatedLikedArticles = updatedLikedArticles.filter(
            (articleId) => articleId !== id
          );
        } else {
          // If not liked, like it
          newLikesCount += 1;
          updatedLikedArticles.push(id!);
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
        setArticle({ ...article, likes: newLikesCount });
        setLikedArticles(updatedLikedArticles);
      }
    } catch (error) {
      console.error("Error updating likes:", error);
      toast.error("Failed to update likes", { transition: Zoom });
    } finally {
      setIsLiking(false);
    }
  };

  const createMarkup = (content: string) => {
    const cleanHtml = DOMPurify.sanitize(marked(content) as string);
    return { __html: cleanHtml };
  };

  if (loading) {
    return (
      <Container maxWidth="md" className="article-container">
        <CircularProgress />
      </Container>
    );
  }

  if (!article) {
    return (
      <>
        <PageTitle title="Article | Lupo Skill" />
        <Container maxWidth="md" className="article-container">
          <Typography
            variant="h4"
            component="div"
            style={{ textAlign: "center", marginTop: "20px" }}
          >
            Article not found
          </Typography>
        </Container>
      </>
    );
  }

  return (
    <>
      <Signup isShow={show} returnShow={setShow} />
      <PageTitle
        title={`${article.title} | by ${article.author} | Lupo Skill`}
      />
      <Container maxWidth="md" className="article-container">
        <Paper elevation={3} className="article-paper">
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            className="articlepage-title"
            sx={{
              fontSize: { xs: "1.5rem", md: "3rem" }, // Adjust font sizes as needed
            }}
          >
            {article.title}
          </Typography>
          <Box display="flex" alignItems="center" mt={4} mb={2}>
            <Link to={`/profile/${article.createdBy}`}>
              <Avatar
                alt={article.author}
                src={article.pic}
                className="article-avatar"
              />
            </Link>
            <Box ml={2}>
              <Link
                to={`/profile/${article.createdBy}`}
                className="article_link"
              >
                <Typography variant="subtitle1" component="div">
                  {article.author}
                </Typography>
              </Link>
              <Typography
                variant="subtitle2"
                color="textSecondary"
                component="div"
              >
                {article.readtime} · {moment(article.createdAt).fromNow()}
              </Typography>
            </Box>
          </Box>
          <CardActions className="artcle-page-up">
            <IconButton size="small" className="comment-icon">
              <ChatBubbleOutlineIcon style={{ color: "#d1d1d1" }} />
              <span className="comment-count">{article.comments}</span>
            </IconButton>
            <IconButton
              size="small"
              className="clap-icon"
              onClick={handleLike}
              disabled={isLiking}
            >
              <img
                src={
                  likedArticles.includes(article.id) ? ClapIconFilled : ClapIcon
                }
                alt="Clap icon"
                style={{ width: "1.3rem", userSelect: "none" }}
              />
              <span className="clap-count">{article.likes}</span>
            </IconButton>
          </CardActions>
          <Box
            className="article-content"
            dangerouslySetInnerHTML={createMarkup(article.content)}
          />
        </Paper>
      </Container>
    </>
  );
};

export default ArticlePage;
