import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function useNavigationPrompt(
  message = "Changes you made may not be saved.",
  when = true
) {
  const navigate = useNavigate();
  const [isBlocking, setIsBlocking] = useState(when);

  useEffect(() => {
    const handleBeforeUnload = (e: any) => {
      const articleDraft = localStorage.getItem("articleDraft");
      if (!isBlocking || articleDraft !== "true") return;
      e.preventDefault();
      e.returnValue = message;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isBlocking, message]);

  const handleNavigation = (path: string) => {
    if (isBlocking && !window.confirm(message)) {
      console.log("checking1", window.location.href);
      console.log("Navigation cancelled");
      return false; // Navigation is blocked
    } else {
      console.log("Navigation confirmed");
      localStorage.removeItem("articleDraft");
      navigate(path);
      return true; // Navigation is allowed
    }
  };

  return { handleNavigation, setIsBlocking };
}

export default useNavigationPrompt;
