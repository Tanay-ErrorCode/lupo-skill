// TestimonialCard.tsx
import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { useMediaQuery, useTheme } from "@mui/material";

// Define the props interface
interface TestimonialCardProps {
  image: string;
  name: string;
  text: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  image,
  name,
  text,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Card
      className="testimonial-card"
      sx={{
        padding: "6px",
        border: "2.5px solid #9ABAC2",
        display: "flex",
        flexDirection: "column",
        borderRadius: "15px",
        margin: isSmallScreen ? "0 auto" : "initial",
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
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
