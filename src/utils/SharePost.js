let blogPostLink;
if (typeof window !== 'undefined') {
    blogPostLink = window.location.href;
}

// Facebook Share Link

export const facebookShareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    blogPostLink,
)}`;

// Twitter Share Link
export const twitterShareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
    blogPostLink,
)}&text=Check out this awesome blog post!`;
export const linkedinshareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    blogPostLink,
)}`;