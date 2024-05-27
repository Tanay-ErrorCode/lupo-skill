import * as React from 'react';
import { Container, Typography, Link, IconButton, Grid, Box } from '@mui/material';
import { LinkedIn, GitHub } from '@mui/icons-material';
import './Footer.css'; 

const LinkedInIcon: React.FC = () => (
  <IconButton
    component="a"
    href="https://www.linkedin.com/in/errorcode/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="LinkedIn"
  >
    <LinkedIn />
  </IconButton>
);

const GitHubIcon: React.FC = () => (
  <IconButton
    component="a"
    href="https://github.com/Tanay-ErrorCode/lupo-skill.git"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="GitHub"
  >
    <GitHub />
  </IconButton>
);

const Footer: React.FC = () => {
  return (
    <Box component="footer" className="footer">
      <Box className="strip" /> {/* Light blue strip */}
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom className="footer-text">
              About Us
            </Typography>
            <Typography variant="body1" className="footer-text">
              Lupo Skill is a platform where you can share your skills by hosting events and learn new ones by joining others. Enjoy real-time updates and a fully responsive design, all with an easy-to-use interface.
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom className="footer-text">
              Our Team
            </Typography>
            <Box className="footer-text">
              <LinkedInIcon />
                Tanay
            </Box>
            <Box className="footer-text">
              <LinkedInIcon />
                Neyati
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom className="footer-text">
              Contribute
            </Typography>
            <Box className="footer-text">
              <GitHubIcon />
                GitHub Repo
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
