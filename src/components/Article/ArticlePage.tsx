import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Avatar,
  Box,
  Paper,
  CircularProgress,
  CardActions,
  IconButton,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { ref, get } from "firebase/database";
import { database } from "../../firebaseConf";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ClapIcon from "./clap.svg";
import { marked } from "marked";
import DOMPurify from "dompurify";
import "./ArticlePage.css";
import moment from "moment";
import PageTitle from "../../utils/PageTitle";

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

  useEffect(() => {
    const fetchArticle = async () => {
      if (localStorage.getItem("userUid") == null) {
        window.location.href = "/";
      }
      try {
        const articleRef = ref(database, `articles/${id}`);
        const snapshot = await get(articleRef);
        if (snapshot.exists()) {
          setArticle(snapshot.val());
        } else {
          console.error("No article found");
        }
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const createMarkup = (content: string) => {
    const cleanHtml = DOMPurify.sanitize(marked(content) as string);
    return { __html: cleanHtml };
  };

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
                {" "}
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
            <IconButton size="small" className="clap-icon">
              <img
                src={ClapIcon}
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
