import React, { useState } from "react";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import theme from "../../theme";
import "./Button.css";

interface CustomButtonProps {
  text: string;
  borderColor?: string;
  backgroundColor?: string;
  textColor?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  hoverColor?: string;
  colorChange?: boolean;
  borderStyleChange?: boolean;
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
  borderStyleChange,
}) => {
  const colorList = ["#FFC0D9", theme.colors.secondaryLight];
  const [currentBackgroundColorIndex, setCurrentBackgroundColorIndex] =
    useState(0);
  const [isNewBorderStyleActive, setNewBorderStyleActive] = useState(false);

  const handleMouseEnter = () => {
    if (colorChange && colorList && colorList.length > 0) {
      setCurrentBackgroundColorIndex(
        (prevIndex) => (prevIndex + 1) % colorList.length
      );
    }
    if (borderStyleChange) {
      setNewBorderStyleActive(!isNewBorderStyleActive);
    }
  };

  const handleMouseLeave = () => {
    if (colorChange && colorList && colorList.length > 0) {
      setCurrentBackgroundColorIndex(0);
    }
    if (borderStyleChange) {
      setNewBorderStyleActive(!isNewBorderStyleActive);
    }
  };

  const currentBackgroundColor = colorChange
    ? colorList[currentBackgroundColorIndex]
    : backgroundColor;

  return (
    <div
      className={
        isNewBorderStyleActive ? "multi-color-border" : "static-border"
      }
    >
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
        className="custom-button"
      >
        {text}
      </Button>
    </div>
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
  borderStyleChange: PropTypes.bool,
};

export default CustomButton;
