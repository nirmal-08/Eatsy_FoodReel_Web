import React, { useEffect, useRef, useState } from 'react';
import './reels.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Helper component for expandable description
const ExpandableDescription = ({ text, maxLines = 2 }) => {
    const [expanded, setExpanded] = useState(false);
    const [showToggle, setShowToggle] = useState(false);
    const descRef = useRef(null);

    useEffect(() => {
        if (descRef.current) {
            setShowToggle(descRef.current.scrollHeight > descRef.current.clientHeight);
        }
    }, [text]);

    async function likeVideo(item) {
        const response = await axios.post('https://eatsy-foodreel-web.onrender.com/api/food/like', {
            foodId: item._id
        }, { withCredentials: true });
        console.log('Liked video', response.data);

        if(response.data.like){
            setVideos(prevVideos => prevVideos.map(v => {
                if (v._id === item._id) {
                    return { ...v, likeCount: v.likeCount + 1 };
                }
                return v;
            }));
        }
    }

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

const ReelsFeed = () => {
    const containerRef = useRef(null);
    const videoRefs = useRef({}); // { [id]: HTMLVideoElement }
    const navigate = useNavigate();

    const [reels, setReels] = useState([]); // backend: response.data.foodItems
    const [activeId, setActiveId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMuted, setIsMuted] = useState(true);
    const [likeCounts, setLikeCounts] = useState({}); // {id: number}
    const [userLiked, setUserLiked] = useState({}); // {id: boolean}
    const [userSaved, setUserSaved] = useState({}); // {id: boolean}
    const [commentCounts, setCommentCounts] = useState({}); // placeholder counts

    // Fetch food items from backend once
    useEffect(() => {
        let isMounted = true;
        (async () => {
            try {
                setLoading(true);
                const res = await axios.get('https://eatsy-foodreel-web.onrender.com/api/food', {
                    withCredentials: true
                });
                const items = res.data?.foodItems || [];
                if (!isMounted) return;
                setReels(items);
                // Initialize counters gracefully
                const lc = {}; const uc = {}; const sc = {}; const cc = {};
                items.forEach(it => {
                    lc[it._id] = it.likeCount || it.likes || 0;
                    cc[it._id] = it.commentCount || 0;
                });
                setLikeCounts(lc); setUserLiked(uc); setUserSaved(sc); setCommentCounts(cc);
                if (items.length > 0) setActiveId(items[0]._id); // default to first
            } catch (e) {
                if (!isMounted) return;
                setError(e?.response?.data?.message || e.message || 'Failed to load videos');
            } finally {
                if (isMounted) setLoading(false);
            }
        })();
        return () => { isMounted = false; };
    }, []);

    // Observe which reel is centered / mostly visible
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

    // Play only active video, pause others & apply mute state
    useEffect(() => {
        Object.entries(videoRefs.current).forEach(([id, vid]) => {
            if (!vid) return;
            vid.muted = isMuted; // sync mute state
            if (id === activeId) {
                if (vid.paused) {
                    vid.play().catch(() => { }); // ignore autoplay restrictions errors
                }
            } else {
                if (!vid.paused) vid.pause();
                vid.currentTime = 0; // optional reset
            }
        });
    }, [activeId, isMuted]);

    const handleVisit = (item) => {
        // foodPartner might be either the id string or a populated object
        const partnerId = typeof item.foodPartner === 'string'
            ? item.foodPartner
            : item.foodPartner?._id || item.foodPartner?.id || item.partnerId || item.ownerId;

        if (partnerId) {
            navigate(`/food-partner/${partnerId}`);
        } else {
            console.warn('No partner id found on item', item);
        }
    };

    const toggleMute = () => setIsMuted(m => !m);

    const toggleLike = async (id) => {
        try {
            const res = await axios.post('https://eatsy-foodreel-web.onrender.com/api/food/like', {
                foodId: id
            }, { withCredentials: true });
            // API should return { like: true/false, likeCount: number }
            const { like, likeCount } = res.data;
            setUserLiked(prev => ({ ...prev, [id]: like }));
            setLikeCounts(prev => ({ ...prev, [id]: likeCount }));
        } catch (e) {
            // Optionally show error
            console.error('Failed to like:', e);
        }
    };

    const toggleSave = (id) => {
        setUserSaved(prev => ({ ...prev, [id]: !prev[id] }));
        // TODO: backend call for saving
    };

    if (loading) {
        return <div className="reels-feed loading">Loading videos...</div>;
    }
    if (error) {
        return <div className="reels-feed error">{error}</div>;
    }
    if (!reels.length) {
        return <div className="reels-feed empty">No videos available.</div>;
    }

    return (
        <div className="reels-feed" ref={containerRef}>
            <button className="mute-btn" onClick={toggleMute} aria-label={isMuted ? 'Unmute' : 'Mute'}>
                {isMuted ? '🔇' : '🔊'}
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
                        {/* Right side action bar */}
                        <div className="reel-actions" aria-label="Reel actions">
                            <button
                                className={`action-btn like ${liked ? 'active' : ''}`}
                                onClick={() => toggleLike(id)}
                                aria-pressed={liked}
                                aria-label={liked ? 'Unlike' : 'Like'}
                            >
                                <svg viewBox="0 0 24 24" className="icon">
                                    <path d="M12 21s-1-.55-1-1.1C8 17 4 14 4 9.9 4 7 6 5 8.5 5 10 5 11 6 12 7c1-1 2-2 3.5-2C18 5 20 7 20 9.9 20 14 16 17 13 19.9c0 .55-1 1.1-1 1.1Z" fill={liked ? '#e63946' : 'none'} stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
                                </svg>
                                <span className="count">{likeCounts[id] ?? 0}</span>
                            </button>
                            <button
                                className={`action-btn save ${saved ? 'active' : ''}`}
                                onClick={() => toggleSave(id)}
                                aria-pressed={saved}
                                aria-label={saved ? 'Unsave' : 'Save'}
                            >
                                <svg viewBox="0 0 24 24" className="icon">
                                    <path d="M6 3h12v18l-6-4-6 4V3Z" fill={saved ? '#8d3c3c' : 'none'} stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
                                </svg>
                                <span className="count">{saved ? 1 : 0}</span>
                            </button>
                            <button className="action-btn comment" aria-label="Comments">
                                <svg viewBox="0 0 24 24" className="icon">
                                    <path d="M4 4h16v11H7l-3 3V4Z" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
                                </svg>
                                <span className="count">{commentCounts[id] ?? 0}</span>
                            </button>
                        </div>
                        <div className="reel-overlay">
                            <div className="overlay-inner">{/* inner enables pointer events */}
                                                                <ExpandableDescription text={item.description} maxLines={2} />
                                <button className="visit-btn" onClick={() => handleVisit(item)}>
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
