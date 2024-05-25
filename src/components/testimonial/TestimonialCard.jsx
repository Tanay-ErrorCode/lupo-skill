import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import { useMediaQuery, useTheme } from '@mui/material';

const TestimonialCard = ({ image, name, text }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card sx={{
      maxWidth: isSmallScreen ? '100%' : 323,
      maxHeight: 'auto',
      padding: "6px",
      border: '2.5px solid #9ABAC2',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: "15px",
      margin: isSmallScreen ? '0 auto' : 'initial'
    }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="space-between" height="100%">
          <Box display="flex" alignItems="center"flexWrap="wrap" justifyContent="center" gap="20px">
            <Avatar alt={name} src={image} sx={{ width: 56, height: 56, border: "1.5px solid #AE8892" }} />
            <Typography variant="h5" fontSize={isSmallScreen ? "20px" : "24px"} fontWeight="700" whiteSpace="nowrap">
              {name}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" textAlign="center" mt={2}>
            {text}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;