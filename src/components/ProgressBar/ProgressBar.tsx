import { useEffect, useState } from "react";
import "./ProgressBar.css";

const ProgressBar = () => {
  const [progressWidth, setProgressWidth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      const scrollY = window.scrollY;

      const scrollPercentage = Math.floor(
        (scrollY / (docHeight - windowHeight)) * 100
      );
      setProgressWidth(scrollPercentage);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [progressWidth]);

  return (
    <div className="progress-container">
      <div className={`progress-fill`} style={{ width: `${progressWidth}%` }}>
        
      </div>
    </div>
  );
};

export default ProgressBar;
