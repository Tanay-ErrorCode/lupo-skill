import * as React from "react";
import {
  Container,
  Typography,
  Link,
  IconButton,
  Grid,
  Box,
} from "@mui/material";
import { LinkedIn, GitHub, YouTube } from "@mui/icons-material";
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
    <IconButton
      aria-label="LinkedIn"
      className="icon-button"
      style={{ color: "#0A66C2", transform: "scale(1.5)" }}
    >
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
    <IconButton
      aria-label="GitHub"
      className="icon-button"
      style={{ color: "#181717", transform: "scale(1.5)" }}
    >
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
    <IconButton
      aria-label="YouTube"
      className="icon-button"
      style={{ color: "#FF0000", transform: "scale(1.5)" }}
    >
      <YouTube />
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
            <Box className="footer-text">
              <YouTubeLink
                url="https://www.youtube.com/@CodingKaku"
                name="ErrorCode"
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
            <Box className="footer-text">
              <GitHubLink
                url="https://github.com/Tanay-ErrorCode/lupo-skill.git"
                name="GitHub Repo"
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
