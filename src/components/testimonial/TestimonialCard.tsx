import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { useMediaQuery, useTheme } from "@mui/material";
import "./testimonial.css"; // Import custom CSS
import { keyframes } from "@emotion/react";

interface TestimonialCardProps {
  image: string;
  name: string;
  text: string;
}

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  image,
  name,
  text,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Card
      className="testimonial-card "
      sx={{
        padding: "6px",
        border: "2.5px solid #9ABAC2",
        display: "flex",
        flexDirection: "column",
        borderRadius: "15px",
        margin: isSmallScreen ? "0 auto" : "initial",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.3s ease",

        backgroundColor: "#fff",
        "&:hover": {
          transform: "scale(1.07)",
          border: "none",
          "&::before": {
            opacity: 1,
          },
          "&::after": {
            opacity: 1,
          },
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: "-2px",
          right: "-2px",
          bottom: "-2px",
          left: "-2px",
          backgroundImage:
            "linear-gradient(290.7deg,rgb(255, 242, 0), rgb(0, 172, 249) 100.2%)",
          borderImageSlice: 1,
          animation: `${rotate} 2s linear infinite`,
          zIndex: 1,
          opacity: 0,
          transition: "opacity 0.3s ease",
          inset: "-8rem -8rem",
        },
        "&::after": {
          content: '""',
          borderRadius: "15px",
          position: "absolute",
          inset: "4px",
          background: "#fff",
          zIndex: 1,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, zIndex: 2 }}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap="20px"
          >
            <Avatar
              alt={name}
              src={image}
              sx={{ width: 56, height: 56, border: "1.5px solid #AE8892" }}
            />
            <Typography variant="h5" fontSize={"1.1rem"} fontWeight="700">
              {name}
            </Typography>
          </Box>
          <Divider
            sx={{ width: "100%", borderTop: "2px solid #16aeff", my: 1 }}
          />
          <Typography
            variant="body2"
            color="text.secondary"
            style={{ textAlign: "center" }}
          >
            {text}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;
