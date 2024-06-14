import React, { useState, ChangeEvent } from "react";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link as LinkType } from "./type"; // Import the Link type

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
  PlusLg,
  Trash,
} from "react-bootstrap-icons";

interface InputLinkProps {
  links: LinkType; // Change links prop to an object
  setLinks: React.Dispatch<React.SetStateAction<LinkType>>;
}

export const classifyLink = (
  link: string
): { name: string; icon: React.ElementType } => {
  if (link.includes("instagram.com"))
    return { name: "Instagram", icon: Instagram };
  if (link.includes("twitter.com")) return { name: "Twitter", icon: Twitter };
  if (link.includes("youtube.com")) return { name: "YouTube", icon: Youtube };
  if (link.includes("twitch.tv")) return { name: "Twitch", icon: Twitch };
  if (link.includes("discord.com") || link.includes("discord.gg"))
    return { name: "Discord", icon: Discord };
  if (link.includes("reddit.com")) return { name: "Reddit", icon: Reddit };
  if (link.includes("github.com")) return { name: "GitHub", icon: Github };
  if (link.includes("medium.com")) return { name: "Medium", icon: Medium };
  if (link.includes("facebook.com"))
    return { name: "Facebook", icon: Facebook };
  if (link.includes("linkedin.com"))
    return { name: "LinkedIn", icon: Linkedin };
  if (link.includes("pinterest.com"))
    return { name: "Pinterest", icon: Pinterest };
  if (link.includes("tiktok.com")) return { name: "TikTok", icon: Tiktok };
  if (link.includes("amazon.com")) return { name: "Amazon", icon: Amazon };
  if (link.includes("stackoverflow.com"))
    return { name: "Stack Overflow", icon: StackOverflow };
  if (link.includes("apple.com")) return { name: "Apple", icon: Apple };
  if (link.includes("play.google.com"))
    return { name: "Google Play", icon: Google };
  if (link.includes("spotify.com")) return { name: "Spotify", icon: Spotify };
  if (link.includes("microsoft.com"))
    return { name: "Microsoft", icon: Microsoft };
  if (link.includes("wordpress.com"))
    return { name: "WordPress", icon: Wordpress };
  if (link.includes("whatsapp.com"))
    return { name: "WhatsApp", icon: Whatsapp };
  if (link.includes("telegram.org"))
    return { name: "Telegram", icon: Telegram };
  return { name: "Unknown", icon: LinkIcon };
};

const InputLink: React.FC<InputLinkProps> = ({ links, setLinks }) => {
  const [newLink, setNewLink] = useState<string>("");
  const [linkClassification, setLinkClassification] = useState<{
    name: string;
    icon: React.ElementType;
  }>({ name: "Unknown", icon: LinkIcon });

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const link = event.target.value;
    setNewLink(link);
    setLinkClassification(classifyLink(link));
  };

  const addNewLink = () => {
    if (!newLink.trim()) {
      toast.error("URL cannot be empty");
      return;
    }

    if (Object.keys(links).length >= 3) {
      toast.error("You can only add up to 3 links");
      return;
    }

    const classification = classifyLink(newLink);

    if (links[classification.name]) {
      toast.error(`${classification.name} link already exists`);
      return;
    }

    setLinks({
      ...links,
      [classification.name]: newLink,
    });
    setNewLink("");
    setLinkClassification({ name: "Unknown", icon: LinkIcon });
  };

  const removeLink = (key: string) => {
    const updatedLinks = { ...links };
    delete updatedLinks[key];
    setLinks(updatedLinks);
  };

  return (
    <Form.Group controlId="socialLinks">
      <Form.Label>Social Media Links</Form.Label>
      {Object.entries(links).map(([key, url]) => (
        <div key={key} className="d-flex align-items-center mb-2 gap-2">
          <div className="inputsocial">
            <Form.Control
              type="text"
              className="link-input"
              placeholder="Paste your link here"
              value={url}
              readOnly
            />
            <span className="classification ml-2 socialicon">
              {React.createElement(classifyLink(url).icon, {
                className: "icon",
              })}
            </span>
          </div>
          <Button
            variant="danger"
            onClick={() => removeLink(key)}
            className="ml-2 addsociallink"
          >
            <Trash />
          </Button>
        </div>
      ))}
      {Object.keys(links).length < 3 && (
        <div className="d-flex mt-2 align-items-center gap-2">
          <div className="inputsocial">
            <Form.Control
              type="text"
              placeholder="Enter URL"
              value={newLink}
              onChange={handleInputChange}
            />
            <span className="classification ml-2 socialicon">
              {React.createElement(linkClassification.icon, {
                className: "icon",
              })}
            </span>
          </div>
          <Button onClick={addNewLink} className="ml-2 addsociallink">
            <PlusLg />
          </Button>
        </div>
      )}
    </Form.Group>
  );
};

export default InputLink;
