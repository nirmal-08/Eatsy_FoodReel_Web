import React, { useEffect, useRef, useState } from 'react';
import './reels.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Heart, Bookmark, MessageCircle, Volume2, VolumeX } from 'lucide-react';

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
        <span
          style={{ color: '#3897f0', cursor: 'pointer', fontWeight: 500 }}
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? ' Show less' : '... more'}
        </span>
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
    <span className="count">{count ?? 0}</span>
  </button>
);

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
        items.forEach((it) => {
          lc[it._id] = it.likeCount || it.likes || 0;
          cc[it._id] = it.commentCount || 0;
        });

        setLikeCounts(lc);
        setCommentCounts(cc);

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

  const toggleSave = (id) => {
    setUserSaved((prev) => ({ ...prev, [id]: !prev[id] }));
    // TODO: backend API call for save
  };

  // States
  if (loading) {
    return <div className="reels-feed loading">⏳ Loading videos...</div>;
  }
  if (error) {
    return <div className="reels-feed error">⚠️ {error}</div>;
  }
  if (!reels.length) {
    return <div className="reels-feed empty">📭 No videos available.</div>;
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

        return (
          <div
            className={`reel ${activeId === id ? 'active' : ''}`}
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

            {/* Right action bar */}
            <div className="reel-actions" aria-label="Reel actions">
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

            {/* Overlay with description + CTA */}
            <div className="reel-overlay">
              <div className="overlay-inner">
                <ExpandableDescription text={item.description} maxLines={2} />
                <button
                  className="visit-btn"
                  onClick={() => handleVisit(item)}
                >
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
