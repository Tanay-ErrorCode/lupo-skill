import React, { useState } from "react";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import theme from "../../theme";

interface CustomButtonProps {
  text: string;
  borderColor?: string;
  backgroundColor?: string;
  textColor?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  hoverColor?: string;
  colorChange?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  borderColor,
  backgroundColor,
  textColor,
  icon,
  onClick,
  hoverColor,
  colorChange,
}) => {
  const colorList = ["#FFC0D9", theme.colors.secondaryLight];
  const [currentBackgroundColorIndex, setCurrentBackgroundColorIndex] =
    useState(0);

  const handleMouseEnter = () => {
    if (colorChange && colorList && colorList.length > 0) {
      setCurrentBackgroundColorIndex(
        (prevIndex) => (prevIndex + 1) % colorList.length
      );
    }
  };

  const handleMouseLeave = () => {
    if (colorChange && colorList && colorList.length > 0) {
      setCurrentBackgroundColorIndex(0);
    }
  };

  const currentBackgroundColor = colorChange
    ? colorList[currentBackgroundColorIndex]
    : backgroundColor;

  return (
    <Button
      variant="contained"
      style={{
        textTransform: "none",
        fontSize: "1rem",
        border: "2px solid",
        fontWeight: "bold",
        width: "fit-content",
        borderRadius: "16px",
        borderColor: borderColor || "black",
        backgroundColor: currentBackgroundColor,
        padding: "8px 24px",
        color: textColor || "black",
        transition: "background-color 0.3s", // Add transition for smooth color change
      }}
      startIcon={icon}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {text}
    </Button>
  );
};

CustomButton.propTypes = {
  text: PropTypes.string.isRequired,
  borderColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  textColor: PropTypes.string,
  icon: PropTypes.node,
  onClick: PropTypes.func,
  hoverColor: PropTypes.string, // Add prop type for hoverColor
  colorChange: PropTypes.bool,
};

export default CustomButton;
