import * as React from "react";
import {
  Container,
  Typography,
  Link,
  IconButton,
  Grid,
  Box,
} from "@mui/material";
import { LinkedIn, GitHub } from "@mui/icons-material";
import YouTubeIcon from "@mui/icons-material/YouTube";
import "./Footer.css";

const LinkedInLink: React.FC<{ url: string; name: string }> = ({
  url,
  name,
}) => (
  <Link
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="footer-link"
  >
    <IconButton aria-label="LinkedIn" className="icon-button">
      <LinkedIn />
    </IconButton>
    {name}
  </Link>
);

const GitHubLink: React.FC<{ url: string; name: string }> = ({ url, name }) => (
  <Link
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="footer-link"
  >
    <IconButton aria-label="GitHub" className="icon-button">
      <GitHub />
    </IconButton>
    {name}
  </Link>
);

const YouTubeLink: React.FC<{ url: string; name: string }> = ({
  url,
  name,
}) => (
  <Link
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="footer-link"
  >
    <IconButton aria-label="YouTube" className="icon-button">
      <YouTubeIcon />
    </IconButton>
    {name}
  </Link>
);

const Footer: React.FC = () => {
  return (
    <Box component="footer" className="footer">
      <Box className="strip" />
      <Container maxWidth="lg">
        <Grid container spacing={24}>
          <Grid item xs={12} md={6}>
            <Typography
              variant="h6"
              gutterBottom
              className="footer-text"
              style={{ fontWeight: "bold" }}
            >
              About Us
            </Typography>
            <Typography variant="body1" className="footer-text">
              Lupo Skill is a platform where you can share your skills by
              hosting events and learn new ones by joining others. Enjoy
              real-time updates and a fully responsive design, all with an
              easy-to-use interface.
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography
              variant="h6"
              gutterBottom
              className="footer-text"
              style={{ fontWeight: "bold" }}
            >
              Our Team
            </Typography>
            <Box className="footer-text">
              <LinkedInLink
                url="https://www.linkedin.com/in/errorcode/"
                name="Tanay"
              />
            </Box>
            <Box className="footer-text">
              <LinkedInLink
                url="https://www.linkedin.com/in/neyati-iiit/"
                name="Neyati"
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography
              variant="h6"
              gutterBottom
              className="footer-text"
              style={{ fontWeight: "bold" }}
            >
              Contribute
            </Typography>
            <Box className="footer-text" style={{ marginBottom: "10px" }}>
              <GitHubLink
                url="https://github.com/Tanay-ErrorCode/lupo-skill.git"
                name="GitHub Repo"
              />
            </Box>
            <Typography
              variant="h6"
              gutterBottom
              className="footer-text"
              style={{ fontWeight: "bold" }}
            >
              Youtube
            </Typography>
            <Box className="footer-text">
              <YouTubeLink
                url="https://www.youtube.com/channel/UCN7Lo2yjOFomJLDpAxxcSMw"
                name="ErrorCode"
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
