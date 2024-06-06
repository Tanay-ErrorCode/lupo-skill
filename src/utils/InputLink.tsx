import React, { useState, ChangeEvent } from "react";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "./type"; // Import the Link type

import {
  Instagram,
  Twitter,
  Youtube,
  Twitch,
  Discord,
  Reddit,
  Github,
  Medium,
  Facebook,
  Linkedin,
  Pinterest,
  Tiktok,
  Amazon,
  StackOverflow,
  Apple,
  Google,
  Spotify,
  Microsoft,
  Wordpress,
  Whatsapp,
  Telegram,
  Link as LinkIcon,
  PlusCircle,
  PlusLg,
  Trash,
} from "react-bootstrap-icons";

interface InputLinkProps {
  links: Link[];
  setLinks: React.Dispatch<React.SetStateAction<Link[]>>;
}

const classifyLink = (
  link: string
): { name: string; icon: React.ElementType } => {
  if (link.includes("instagram.com")) {
    return { name: "Instagram", icon: Instagram };
  } else if (link.includes("twitter.com")) {
    return { name: "Twitter", icon: Twitter };
  } else if (link.includes("youtube.com")) {
    return { name: "YouTube", icon: Youtube };
  } else if (link.includes("twitch.tv")) {
    return { name: "Twitch", icon: Twitch };
  } else if (link.includes("discord.com") || link.includes("discord.gg")) {
    return { name: "Discord", icon: Discord };
  } else if (link.includes("reddit.com")) {
    return { name: "Reddit", icon: Reddit };
  } else if (link.includes("github.com")) {
    return { name: "GitHub", icon: Github };
  } else if (link.includes("medium.com")) {
    return { name: "Medium", icon: Medium };
  } else if (link.includes("facebook.com")) {
    return { name: "Facebook", icon: Facebook };
  } else if (link.includes("linkedin.com")) {
    return { name: "LinkedIn", icon: Linkedin };
  } else if (link.includes("pinterest.com")) {
    return { name: "Pinterest", icon: Pinterest };
  } else if (link.includes("tiktok.com")) {
    return { name: "TikTok", icon: Tiktok };
  } else if (link.includes("amazon.com")) {
    return { name: "Amazon", icon: Amazon };
  } else if (link.includes("stackoverflow.com")) {
    return { name: "Stack Overflow", icon: StackOverflow };
  } else if (link.includes("apple.com")) {
    return { name: "Apple", icon: Apple };
  } else if (link.includes("play.google.com")) {
    return { name: "Google Play", icon: Google };
  } else if (link.includes("spotify.com")) {
    return { name: "Spotify", icon: Spotify };
  } else if (link.includes("microsoft.com")) {
    return { name: "Microsoft", icon: Microsoft };
  } else if (link.includes("wordpress.com")) {
    return { name: "WordPress", icon: Wordpress };
  } else if (link.includes("whatsapp.com")) {
    return { name: "WhatsApp", icon: Whatsapp };
  } else if (link.includes("telegram.org")) {
    return { name: "Telegram", icon: Telegram };
  } else {
    return { name: "Unknown", icon: LinkIcon };
  }
};

const InputLink: React.FC<InputLinkProps> = ({ links, setLinks }) => {
  const [count, setCount] = useState(1);
  const [newLink, setNewLink] = useState<string>("");
  const [currentClassification, setCurrentClassification] = useState<{
    name: string;
    icon: React.ElementType;
  }>({ name: "Unknown", icon: LinkIcon });

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const link = event.target.value;
    setNewLink(link);
    setCurrentClassification(classifyLink(link));
  };

  const addNewLink = () => {
    if (!newLink) {
      toast.error("URL cannot be empty");
      return;
    }

    const classification = classifyLink(newLink);
    setLinks([
      ...links,
      { url: newLink, name: classification.name, icon: classification.icon },
    ]);
    setNewLink("");
    setCurrentClassification({ name: "Unknown", icon: LinkIcon });
    setCount((prev) => prev + 1);
  };

  const removeLink = (index: number) => {
    const updatedLinks = [...links];
    updatedLinks.splice(index, 1);
    setLinks(updatedLinks);
    setCount((prev) => prev - 1);
  };

  return (
    <Form.Group controlId="socialLinks">
      <Form.Label>Social Media Links</Form.Label>
      {links.map((inputField, index) => (
        <div key={index} className="d-flex align-items-center mb-2 gap-2">
          <div className="inputsocial">
            <Form.Control
              type="text"
              className="link-input"
              placeholder="Paste your link here"
              value={inputField.url}
              readOnly
            />
            <span className="classification ml-2 socialicon">
              <inputField.icon className="icon" />
            </span>
          </div>
          <Button
            variant="danger"
            onClick={() => removeLink(index)}
            className="ml-2 addsociallink"
          >
            <Trash />
          </Button>
        </div>
      ))}
      <div className="d-flex mt-2 align-items-center gap-2">
        {count <= 3 && (
          <div className="inputsocial">
            <Form.Control
              type="text"
              placeholder="Enter URL"
              value={newLink}
              onChange={handleInputChange}
            />
            <span className="classification ml-2 socialicon">
              <currentClassification.icon className="icon" />
            </span>
          </div>
        )}
        {count <= 3 && (
          <Button onClick={addNewLink} className="ml-2 addsociallink">
            <PlusLg />
          </Button>
        )}
      </div>
    </Form.Group>
  );
};

export default InputLink;
