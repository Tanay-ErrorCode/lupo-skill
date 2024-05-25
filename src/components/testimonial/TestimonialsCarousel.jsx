import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Grid from '@mui/material/Grid';
import TestimonialCard from './TestimonialCard';
import sampleImage from '../../Assets/panther.jpg'; // Add a sample image to your assets folder

const testimonials = [
  {
    name: 'Pink Panther',
    text: "This website is a game-changer! I've always wanted to learn new skills but never knew where to start. With this platform, I can easily find live events tailored to my interests and connect with experts. Highly recommended!",
    image: sampleImage,
  },
  {
    name: 'Pink Panther',
    text: "This website is a game-changer! I've always wanted to learn new skills but never knew where to start. With this platform, I can easily find live events tailored to my interests and connect with experts. Highly recommended!",
    image: sampleImage,
  },
  {
    name: 'Pink Panther',
    text: "This website is a game-changer! I've always wanted to learn new skills but never knew where to start. With this platform, I can easily find live events tailored to my interests and connect with experts. Highly recommended!",
    image: sampleImage,
  },
  {
    name: 'Pink Panther',
    text: "This website is a game-changer! I've always wanted to learn new skills but never knew where to start. With this platform, I can easily find live events tailored to my interests and connect with experts. Highly recommended!",
    image: sampleImage,
  },
  {
    name: 'Pink Panther',
    text: "This website is a game-changer! I've always wanted to learn new skills but never knew where to start. With this platform, I can easily find live events tailored to my interests and connect with experts. Highly recommended!",
    image: sampleImage,
  },
  {
    name: 'Pink Panther',
    text: "This website is a game-changer! I've always wanted to learn new skills but never knew where to start. With this platform, I can easily find live events tailored to my interests and connect with experts. Highly recommended!",
    image: sampleImage,
  },
  {
    name: 'Pink Panther',
    text: "This website is a game-changer! I've always wanted to learn new skills but never knew where to start. With this platform, I can easily find live events tailored to my interests and connect with experts. Highly recommended!",
    image: sampleImage,
  },
  {
    name: 'Pink Panther',
    text: "This website is a game-changer! I've always wanted to learn new skills but never knew where to start. With this platform, I can easily find live events tailored to my interests and connect with experts. Highly recommended!",
    image: sampleImage,
  },
];

const groupTestimonials = (testimonials, perGroup) => {
  const grouped = [];
  for (let i = 0; i < testimonials.length; i += perGroup) {
    grouped.push(testimonials.slice(i, i + perGroup));
  }
  return grouped;
};

const TestimonialsCarousel = () => {
  const groupedTestimonials = groupTestimonials(testimonials, 4);

  return (
    <Carousel>
      {groupedTestimonials.map((group, index) => (
        <Carousel.Item key={index} >
          <Grid container spacing={4}  justifyContent="center">
            {group.map((testimonial, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <TestimonialCard {...testimonial} />
              </Grid>
            ))}
          </Grid>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default TestimonialsCarousel;