import React, { useState } from 'react';
import './ShareModal.css';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareLink: string;
  title?: string;
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  shareLink,
  title = 'Share Link',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShareToEmail = () => {
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(`Check this out: ${shareLink}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleShareToTwitter = () => {
    const tweetText = encodeURIComponent(`Check this out: ${shareLink}`);
    window.open(
      `https://twitter.com/intent/tweet?text=${tweetText}`,
      '_blank',
      'width=550,height=420'
    );
  };

  const handleShareToFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`,
      '_blank',
      'width=550,height=420'
    );
  };

  const handleShareToLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareLink)}`,
      '_blank',
      'width=550,height=420'
    );
  };

  if (!isOpen) return null;

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="share-modal-header">
          <h2>{title}</h2>
          <button
            className="share-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="share-modal-body">
          <div className="share-link-container">
            <input
              type="text"
              className="share-link-input"
              value={shareLink}
              readOnly
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <button
              className="share-link-copy-btn"
              onClick={handleCopyLink}
              title="Copy to clipboard"
            >
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>

          <div className="share-options">
            <p className="share-options-label">Share via:</p>
            <div className="share-buttons">
              <button
                className="share-btn share-btn-email"
                onClick={handleShareToEmail}
                title="Share via Email"
                aria-label="Share via Email"
              >
                <span className="share-icon">📧</span>
                <span className="share-label">Email</span>
              </button>
              <button
                className="share-btn share-btn-twitter"
                onClick={handleShareToTwitter}
                title="Share on Twitter"
                aria-label="Share on Twitter"
              >
                <span className="share-icon">𝕏</span>
                <span className="share-label">Twitter</span>
              </button>
              <button
                className="share-btn share-btn-facebook"
                onClick={handleShareToFacebook}
                title="Share on Facebook"
                aria-label="Share on Facebook"
              >
                <span className="share-icon">f</span>
                <span className="share-label">Facebook</span>
              </button>
              <button
                className="share-btn share-btn-linkedin"
                onClick={handleShareToLinkedIn}
                title="Share on LinkedIn"
                aria-label="Share on LinkedIn"
              >
                <span className="share-icon">in</span>
                <span className="share-label">LinkedIn</span>
              </button>
            </div>
          </div>
        </div>

        <div className="share-modal-footer">
          <button className="share-modal-btn-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
