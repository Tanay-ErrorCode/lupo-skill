import React, { useEffect, useRef, useState } from "react";
import {
  Container,
  Typography,
  Avatar,
  Box,
  Paper,
  IconButton,
  CircularProgress,
  CardActions,
  Modal,
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ref, get, update, set, onValue, off } from "firebase/database";
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
import IosShareIcon from "@mui/icons-material/IosShare";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EmailIcon from "@mui/icons-material/Email";
import XIcon from "@mui/icons-material/X";
import theme from "../../theme";
import EditIcon from "@mui/icons-material/Edit";
import DiscussionModal from "./DiscussionModal";

interface Article {
  id: string;
  title: string;
  author: string;
  pic: string;
  createdAt: number;
  content: string;
  readtime: string;
  likes: number;
  createdBy: string;
  comments: Array<any>;
}

const ArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [likedArticles, setLikedArticles] = useState<string[]>([]);
  const [isLiking, setIsLiking] = useState<boolean>(false);
  const [showDiscussion, setShowDiscussion] = useState(false);
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const userUid = localStorage.getItem("userUid");
  const navigate = useNavigate();
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

        // Set up a listener for comments count
        const commentsRef = ref(database, `articles/${id}/comments`);
        onValue(commentsRef, (snapshot) => {
          const comments = snapshot.val() || [];
          const commentsArray = Object.values(comments);
          setArticle((prevArticle) =>
            prevArticle
              ? {
                  ...prevArticle,
                  comments: commentsArray,
                }
              : null
          );
        });
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();

    // Clean up the listener when the component unmounts
    return () => {
      const commentsRef = ref(database, `articles/${id}/comments`);
      off(commentsRef);
    };
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

  const handleShareClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleCommentIconClick = () => {
    if (discussionModalRef.current) {
      const offset = 60; // Adjust this value as needed
      const elementPosition =
        discussionModalRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        toast.success("Copied!!");
      })
      .catch((err) => {
        toast.error("Failed to copy!");
        console.error("Could not copy text: ", err);
      });
  };
  const stripMarkdown = (content: string) => {
    const cleanHtml = DOMPurify.sanitize(marked(content) as string);
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = cleanHtml;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const shareUrl = encodeURIComponent(window.location.href);
  const discussionModalRef = useRef<HTMLDivElement>(null);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    textAlign: "center",
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
  const commentsCount = article.comments
    ? Object.keys(article.comments).length
    : 0;
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
            <div>
              <IconButton
                size="small"
                className="comment-icon"
                onClick={handleCommentIconClick}
              >
                <ChatBubbleOutlineIcon style={{ color: "#d1d1d1" }} />
                <span className="comment-count">{commentsCount}</span>
              </IconButton>
              <IconButton
                size="small"
                className="clap-icon"
                onClick={handleLike}
                disabled={isLiking}
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
            </div>
            <div>
              <IconButton size="small" onClick={handleShareClick}>
                <IosShareIcon style={{ color: "#d1d1d1" }} />
              </IconButton>
              {userUid === article.createdBy && (
                <IconButton
                  style={{ color: "#d1d1d1" }}
                  size="small"
                  className="edit-icon"
                  onClick={() =>
                    navigate(`/edit-article/${id}`, {
                      state: { title: article.title, content: article.content },
                    })
                  }
                >
                  <EditIcon />
                </IconButton>
              )}
            </div>
          </CardActions>
          <Box
            className="article-content"
            dangerouslySetInnerHTML={createMarkup(article.content)}
          />
          <DiscussionModal ref={discussionModalRef} blogId={id || ""} />
        </Paper>
      </Container>
      <Modal open={showModal} onClose={handleCloseModal} className="shadow">
        <Box sx={style}>
          <Box display="flex" alignItems="center" mt={1} mb={3}>
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
          <div className="modal-event-detail">
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              className="articlepage-title"
              sx={{
                fontSize: { xs: "1rem", md: "1.5rem" }, // Adjust font sizes as needed
                textAlign: "left",
              }}
            >
              {article.title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              className="article-description"
              sx={{
                textAlign: "left",
              }}
            >
              {stripMarkdown(article.content)}
            </Typography>
          </div>
          <div className="share-button-icons">
            <IconButton
              style={{ backgroundColor: "#000", color: "#fff" }}
              href={`https://twitter.com/intent/tweet?url=${shareUrl}`}
            >
              <XIcon />
            </IconButton>
            <IconButton
              style={{ backgroundColor: "#25D366", color: "#fff" }}
              href={`https://api.whatsapp.com/send?text=${shareUrl}`}
            >
              <WhatsAppIcon />
            </IconButton>
            <IconButton
              style={{ backgroundColor: "#0077B5", color: "#fff" }}
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}`}
            >
              <LinkedInIcon />
            </IconButton>
            <IconButton
              style={{ backgroundColor: "#EA4335", color: "#fff" }}
              href={`mailto:?subject=${encodeURIComponent(
                "Check out this Article"
              )}&body=${shareUrl}`}
            >
              <EmailIcon />
            </IconButton>
            <IconButton
              style={{
                backgroundColor: "transparent",
                color: "#000",
                border: "1px solid #1c1c1c66",
              }}
              onClick={handleCopyToClipboard}
            >
              <ContentCopyIcon />
            </IconButton>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default ArticlePage;
