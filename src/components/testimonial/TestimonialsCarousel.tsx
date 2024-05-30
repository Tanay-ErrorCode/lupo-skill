// testimonialCarousel.tsx
import React from "react";
import Carousel from "react-bootstrap/Carousel";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import TestimonialCard from "./TestimonialCard";
import "./testimonial.css"; // Import custom CSS

interface Testimonial {
  name: string;
  text: string;
  image: string;
}

const testimonials: Testimonial[] = [
  // ... (testimonials data)
  {
    name: "Elena Rodriguez",
    text: "I can't express enough how much I appreciate this platform. The live events are incredibly engaging, and the articles provide valuable insights. I've learned so much, and it's all thanks to this website!",
    image: "https://randomuser.me/api/portraits/women/9.jpg",
  },
  {
    name: "Michael Chang",
    text: "As a busy professional, I struggle to find time for skill development. This website has been a lifesaver! The resources are concise yet comprehensive, and the live events fit perfectly into my schedule. Highly recommended for anyone looking to grow professionally.",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    name: "Sophia Patel",
    text: "I stumbled upon this website while searching for ways to enhance my creative skills. It's been a revelation! The variety of topics covered is impressive, and I've found the live events to be both informative and inspiring. Thank you for creating such a valuable resource!",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    name: "David Thompson",
    text: "I've been a part of many skill-sharing platforms, but none compare to this one. The community here is supportive, the content is top-notch, and the live events feel like attending a masterclass. Kudos to the team behind this fantastic initiative!",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    name: "Emma Johnson",
    text: "This website has reignited my passion for learning! The articles are well-written and insightful, and the live events provide a unique opportunity to interact with industry experts. I've already recommended it to all my friends!",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
  },
  {
    name: "Jonathan Lee",
    text: "I've always believed in the power of continuous learning, and this website has made it incredibly easy for me to pursue that belief. From workshops to webinars, there's something for everyone here. It's become my go-to platform for skill development!",
    image: "https://randomuser.me/api/portraits/men/10.jpg",
  },
  {
    name: "Maria Sanchez",
    text: "I'm amazed by the quality of content available on this platform. Whether you're a beginner or an expert, there's always something new to learn. The live events are particularly impressive, with knowledgeable speakers sharing valuable insights. I couldn't be happier with my experience!",
    image: "https://randomuser.me/api/portraits/women/7.jpg",
  },
  {
    name: "Chris Wilson",
    text: "I've been using this website for a few months now, and it's exceeded all my expectations. The resources are comprehensive, the articles are well-researched, and the live events are nothing short of brilliant. It's like having a personal mentor at your fingertips!",
    image: "https://randomuser.me/api/portraits/men/8.jpg",
  },
];

const groupTestimonials = (
  testimonials: Testimonial[],
  perGroup: number
): Testimonial[][] => {
  const grouped: Testimonial[][] = [];
  for (let i = 0; i < testimonials.length; i += perGroup) {
    grouped.push(testimonials.slice(i, i + perGroup));
  }
  return grouped;
};

const TestimonialsCarousel: React.FC = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(max-width:900px)");

  let itemsPerGroup = 4;
  if (isMobile) {
    itemsPerGroup = 1;
  } else if (isTablet) {
    itemsPerGroup = 2;
  }

  const groupedTestimonials: Testimonial[][] = groupTestimonials(
    testimonials,
    itemsPerGroup
  );

  return (
    <Carousel
      slide={true}
      interval={3000} // Adjust the interval as needed
      controls={true}
      indicators={true}
    >
      {groupedTestimonials.map((group, index) => (
        <Carousel.Item key={index}>
          <Grid container spacing={2} justifyContent="center" className="grid">
            {" "}
            {/* Adjusted spacing */}
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
