import React, { useEffect, useRef, useState } from 'react';
import './reels.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Heart, Bookmark, MessageCircle, Volume2, VolumeX, MapPin, ChevronDown, ChevronUp } from 'lucide-react';

// ==========================
// Expandable description
// ==========================
const ExpandableDescription = ({ text, maxLines = 2 }) => {
  const [expanded, setExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const descRef = useRef(null);

  useEffect(() => {
    if (descRef.current) {
      setShowToggle(descRef.current.scrollHeight > descRef.current.clientHeight);
    }
  }, [text]);

  return (
    <div style={{ position: 'relative' }}>
      <div
        ref={descRef}
        className="reel-desc-text"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: expanded ? 'unset' : maxLines,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: expanded ? 'normal' : 'pre-line',
          cursor: 'default',
        }}
      >
        {text}
      </div>
      {showToggle && (
        <button
          className="expand-toggle-btn"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded((prev) => !prev);
          }}
          aria-label={expanded ? 'Show less' : 'Show more'}
        >
          {expanded ? 'Show less' : '... more'}
        </button>
      )}
    </div>
  );
};

// ==========================
// Reusable action button
// ==========================
const ActionButton = ({ icon: Icon, count, active, onClick, label, activeColor }) => (
  <button
    className={`action-btn ${active ? 'active' : ''}`}
    onClick={onClick}
    aria-pressed={active}
    aria-label={label}
  >
    <Icon
      className="icon"
      strokeWidth={2}
      color={active ? activeColor : 'white'}
      fill={active ? activeColor : 'none'}
    />
    <span className="count">{count > 0 ? formatCount(count) : count}</span>
  </button>
);

// Format large numbers (e.g., 1.2K, 5.6M)
const formatCount = (count) => {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M';
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K';
  }
  return count;
};

// ==========================
// Main ReelsFeed
// ==========================
const ReelsFeed = () => {
  const containerRef = useRef(null);
  const videoRefs = useRef({});
  const navigate = useNavigate();

  const [reels, setReels] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [likeCounts, setLikeCounts] = useState({});
  const [userLiked, setUserLiked] = useState({});
  const [userSaved, setUserSaved] = useState({});
  const [commentCounts, setCommentCounts] = useState({});
  const [isScrolling, setIsScrolling] = useState(false);

  // Fetch food reels
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await axios.get('https://eatsy-foodreel-web.onrender.com/api/food', {
          withCredentials: true,
        });
        const items = res.data?.foodItems || [];
        if (!isMounted) return;

        setReels(items);

        const lc = {};
        const cc = {};
        const ul = {};
        const us = {};
        
        items.forEach((it) => {
          lc[it._id] = it.likeCount || it.likes || 0;
          cc[it._id] = it.commentCount || 0;
          ul[it._id] = it.userLiked || false;
          us[it._id] = it.userSaved || false;
        });

        setLikeCounts(lc);
        setCommentCounts(cc);
        setUserLiked(ul);
        setUserSaved(us);

        if (items.length > 0) setActiveId(items[0]._id);
      } catch (e) {
        if (!isMounted) return;
        setError(e?.response?.data?.message || e.message || 'Failed to load videos');
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // Observe reel visibility
  useEffect(() => {
    if (!reels.length) return;
    const options = { threshold: 0.6 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('data-reel-id');
          setActiveId(id);
        }
      });
    }, options);

    const nodes = containerRef.current?.querySelectorAll('.reel');
    nodes?.forEach((n) => observer.observe(n));
    return () => {
      nodes?.forEach((n) => observer.unobserve(n));
      observer.disconnect();
    };
  }, [reels]);

  // Sync play/pause + mute
  useEffect(() => {
    Object.entries(videoRefs.current).forEach(([id, vid]) => {
      if (!vid) return;
      vid.muted = isMuted;
      if (id === activeId) {
        if (vid.paused) {
          vid.play().catch(() => {});
        }
      } else {
        if (!vid.paused) vid.pause();
        vid.currentTime = 0;
      }
    });
  }, [activeId, isMuted]);

  // Handle scroll events to detect scrolling state
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scrollTimeout;
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => setIsScrolling(false), 300);
    };

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  // Handlers
  const handleVisit = (item) => {
    const partnerId =
      typeof item.foodPartner === 'string'
        ? item.foodPartner
        : item.foodPartner?._id ||
          item.foodPartner?.id ||
          item.partnerId ||
          item.ownerId;

    if (partnerId) {
      navigate(`/food-partner/${partnerId}`);
    } else {
      console.warn('No partner id found on item', item);
    }
  };

  const toggleMute = () => setIsMuted((m) => !m);

  const toggleLike = async (id) => {
    try {
      const res = await axios.post(
        'https://eatsy-foodreel-web.onrender.com/api/food/like',
        { foodId: id },
        { withCredentials: true }
      );
      const { like, likeCount } = res.data;
      setUserLiked((prev) => ({ ...prev, [id]: like }));
      setLikeCounts((prev) => ({ ...prev, [id]: likeCount }));
    } catch (e) {
      console.error('Failed to like:', e);
    }
  };

  const toggleSave = async (id) => {
    try {
      const res = await axios.post(
        'https://eatsy-foodreel-web.onrender.com/api/food/save',
        { foodId: id },
        { withCredentials: true }
      );
      const { saved } = res.data;
      setUserSaved((prev) => ({ ...prev, [id]: saved }));
    } catch (e) {
      console.error('Failed to save:', e);
    }
  };

  // States
  if (loading) {
    return (
      <div className="reels-feed loading">
        <div className="loading-spinner"></div>
        <p>Loading delicious food videos...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="reels-feed error">
        <p>⚠️ {error}</p>
        <button onClick={() => window.location.reload()} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }
  if (!reels.length) {
    return (
      <div className="reels-feed empty">
        <p>📭 No videos available.</p>
        <p>Check back later for new food content!</p>
      </div>
    );
  }

  // UI
  return (
    <div className="reels-feed" ref={containerRef}>
      {/* Global mute/unmute */}
      <button
        className="mute-btn"
        onClick={toggleMute}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
      </button>

      {reels.map((item) => {
        const id = item._id;
        const liked = !!userLiked[id];
        const saved = !!userSaved[id];
        const isActive = activeId === id;

        return (
          <div
            className={`reel ${isActive ? 'active' : ''}`}
            key={id}
            data-reel-id={id}
          >
            <video
              ref={(el) => (videoRefs.current[id] = el)}
              src={item.video}
              className="reel-video"
              playsInline
              loop
              preload="metadata"
              muted={isMuted}
            />

            {/* Right action bar - only show when not scrolling */}
            <div className={`reel-actions ${isScrolling ? 'scrolling' : ''}`} aria-label="Reel actions">
              <ActionButton
                icon={Heart}
                count={likeCounts[id]}
                active={liked}
                onClick={() => toggleLike(id)}
                label={liked ? 'Unlike' : 'Like'}
                activeColor="#e63946"
              />
              <ActionButton
                icon={Bookmark}
                count={saved ? 1 : 0}
                active={saved}
                onClick={() => toggleSave(id)}
                label={saved ? 'Unsave' : 'Save'}
                activeColor="#ffb703"
              />
              <ActionButton
                icon={MessageCircle}
                count={commentCounts[id]}
                active={false}
                onClick={() => console.log('Open comments', id)}
                label="Comments"
                activeColor="#3897f0"
              />
            </div>

            {/* Location indicator at top */}
            {item.location && (
              <div className="location-indicator">
                <MapPin size={14} />
                <span>{item.location}</span>
              </div>
            )}

            {/* Overlay with description + CTA */}
            <div className="reel-overlay">
              <div className="overlay-inner">
                {/* Profile info if available */}
                {item.foodPartner && (
                  <div className="profile-info">
                    <div className="profile-avatar">
                      {item.foodPartner.name ? item.foodPartner.name.charAt(0).toUpperCase() : 'F'}
                    </div>
                    <div className="profile-details">
                      <div className="profile-name">
                        {typeof item.foodPartner === 'string' ? 'Food Partner' : item.foodPartner.name}
                      </div>
                      {item.foodPartner.rating && (
                        <div className="profile-rating">
                          ⭐ {item.foodPartner.rating}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="description-container">
                  <ExpandableDescription text={item.description} maxLines={2} />
                </div>
                
                {/* Prominent Visit Store button */}
                <button
                  className="visit-btn prominent"
                  onClick={() => handleVisit(item)}
                >
                  <MapPin size={16} />
                  Visit Store
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReelsFeed;