// src/utils/InputLink.tsx
import React, { useState, ChangeEvent } from "react";
import { Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "./type"; // Import the Link type

import {
  faInstagram,
  faTwitter,
  faYoutube,
  faTwitch,
  faDiscord,
  faReddit,
  faGithub,
  faMedium,
  faFacebook,
  faLinkedin,
  faPinterest,
  faTiktok,
  faAmazon,
  faEbay,
  faStackOverflow,
  faApple,
  faGooglePlay,
  faSpotify,
  faMicrosoft,
  faWordpress,
  faWhatsapp,
  faTelegram,
} from "@fortawesome/free-brands-svg-icons";

import {
  faLink,
  faPlusCircle,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

interface InputLinkProps {
  links: Link[];
  setLinks: React.Dispatch<React.SetStateAction<Link[]>>;
}

const classifyLink = (link: string): { name: string; icon: any } => {
  if (link.includes("instagram.com")) {
    return { name: "Instagram", icon: faInstagram };
  } else if (link.includes("twitter.com")) {
    return { name: "Twitter", icon: faTwitter };
  } else if (link.includes("youtube.com")) {
    return { name: "YouTube", icon: faYoutube };
  } else if (link.includes("twitch.tv")) {
    return { name: "Twitch", icon: faTwitch };
  } else if (link.includes("discord.com") || link.includes("discord.gg")) {
    return { name: "Discord", icon: faDiscord };
  } else if (link.includes("reddit.com")) {
    return { name: "Reddit", icon: faReddit };
  } else if (link.includes("github.com")) {
    return { name: "GitHub", icon: faGithub };
  } else if (link.includes("medium.com")) {
    return { name: "Medium", icon: faMedium };
  } else if (link.includes("facebook.com")) {
    return { name: "Facebook", icon: faFacebook };
  } else if (link.includes("linkedin.com")) {
    return { name: "LinkedIn", icon: faLinkedin };
  } else if (link.includes("pinterest.com")) {
    return { name: "Pinterest", icon: faPinterest };
  } else if (link.includes("tiktok.com")) {
    return { name: "TikTok", icon: faTiktok };
  } else if (link.includes("amazon.com")) {
    return { name: "Amazon", icon: faAmazon };
  } else if (link.includes("ebay.com")) {
    return { name: "eBay", icon: faEbay };
  } else if (link.includes("stackoverflow.com")) {
    return { name: "Stack Overflow", icon: faStackOverflow };
  } else if (link.includes("apple.com")) {
    return { name: "Apple", icon: faApple };
  } else if (link.includes("play.google.com")) {
    return { name: "Google Play", icon: faGooglePlay };
  } else if (link.includes("itunes.apple.com")) {
    return { name: "Apple App Store", icon: faApple };
  } else if (link.includes("spotify.com")) {
    return { name: "Spotify", icon: faSpotify };
  } else if (link.includes("microsoft.com")) {
    return { name: "Microsoft", icon: faMicrosoft };
  } else if (link.includes("wordpress.com")) {
    return { name: "WordPress", icon: faWordpress };
  } else if (link.includes("whatsapp.com")) {
    return { name: "WhatsApp", icon: faWhatsapp };
  } else if (link.includes("telegram.org")) {
    return { name: "Telegram", icon: faTelegram };
  } else {
    return { name: "Unknown", icon: faLink };
  }
};

const InputLink: React.FC<InputLinkProps> = ({ links, setLinks }) => {
  const [count, setcount] = useState(1);
  const [newLink, setNewLink] = useState<string>("");
  const [currentClassification, setCurrentClassification] = useState<{
    name: string;
    icon: any;
  }>({ name: "Unknown", icon: faLink });

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
    setCurrentClassification({ name: "Unknown", icon: faLink });
    setcount((prev) => prev + 1);
  };

  const removeLink = (index: number) => {
    const updatedLinks = [...links];
    updatedLinks.splice(index, 1);
    setLinks(updatedLinks);
    setcount((prev) => prev - 1);
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
              <FontAwesomeIcon icon={inputField.icon} />
            </span>
          </div>
          <Button
            variant="danger"
            onClick={() => removeLink(index)}
            className="ml-2 addsociallink"
          >
            <FontAwesomeIcon icon={faTrash} />
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
              <FontAwesomeIcon icon={currentClassification.icon} />
            </span>
          </div>
        )}
        {count <= 3 && (
          <Button onClick={addNewLink} className="ml-2 addsociallink">
            <FontAwesomeIcon icon={faPlusCircle} />
          </Button>
        )}
      </div>
    </Form.Group>
  );
};

export default InputLink;
