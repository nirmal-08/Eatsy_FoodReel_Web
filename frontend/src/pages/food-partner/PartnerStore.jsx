import React,{useState,useEffect} from 'react';
import { useParams } from 'react-router-dom';
import '../../auth-shared.css'; // theme vars
import './partnerStore.css';
import axios from 'axios';



const PartnerStore = () => {
  const { partnerId } = useParams();
  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]); // raw food items from API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios.get(`http://localhost:8000/api/food-partner/${partnerId}` , {
        withCredentials: true
    })
    .then(response => {
        setProfile(response.data.foodPartner);
        setVideos(response.data.foodPartner.foodItems || []);
    })
    .catch(err => {    
        console.error("Failed to fetch partner profile", err);
        setProfile(null);
        setError('Failed to load partner');
    })
    .finally(() => setLoading(false));
  },[partnerId])

  // Derived counts (fallbacks while no backend fields exist)
  const partnerDerived = {
    posts: videos.length,
    totalMeals: videos.length, // adjust if you have a separate stat
    customersServed: profile?.customersServed || 0,
    displayName: profile?.name,
    website: profile?.website || 'example.com',
    bio: profile?.bio || 'Delicious meals available here.'
  }

  const numberFmt = (n) => n > 999 ? `${(n/1000).toFixed(n >= 10000 ? 0 : 1)}K` : n;

  // Filter only available videos: has a non-empty video url string
  const items = videos.filter(v => typeof v.video === 'string' && v.video.trim().length > 0);

  return (
    <div className="partner-store" aria-live="polite">
      <div className="profile-shell" role="region" aria-label={`Profile of ${partnerDerived.displayName || 'partner'}`}>
        <header className="profile-header">
          <div className="avatar-col">
            <div className="avatar" aria-label="Profile picture" />
            <div className="actions inline">
              <button className="act-btn primary" type="button">Follow</button>
              <button className="act-btn message" type="button">Message</button>
            </div>
          </div>
          <div className="header-main">
            <div className="row primary-row">
              <h1 className="username" title={profile?.name}>@{profile?.name || 'loading'}</h1>
            </div>
            <ul className="stats" aria-label="Profile statistics">
              <li><span className="value">{partnerDerived.posts}</span><span className="label">posts</span></li>
              <li><span className="value">{numberFmt(partnerDerived.totalMeals)}</span><span className="label">meals</span></li>
              <li><span className="value">{numberFmt(partnerDerived.customersServed)}</span><span className="label">customers</span></li>
            </ul>
            <div className="bio">
              <span className="display-name">{profile?.contactName || partnerDerived.displayName}</span>
              <p>{partnerDerived.bio}</p>
              <p className="address">📍 {profile?.address}</p>
              <a href={`https://${partnerDerived.website}`} className="site" target="_blank" rel="noreferrer">{partnerDerived.website}</a>
            </div>
          </div>
        </header>
        {loading && (
          <div className="empty-block" role="status"><p>Loading videos...</p></div>
        )}
        {error && !loading && (
          <div className="empty-block" role="alert"><p>{error}</p></div>
        )}
        {!loading && !error && items.length ? (
          <div className="media-grid" aria-label="media grid">
            {items.map(v => (
              <div key={v._id || v.id} className="media-item" tabIndex={0} aria-label={`media item ${v.name}`}>                
                <video 
                  src={v.video}
                  className="video-thumb"
                  preload="metadata"
                  muted
                  playsInline
                  onMouseOver={e => { e.currentTarget.play(); }}
                  onMouseOut={e => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                />
                <span className="overlay-label" title={v.name}>{v.name}</span>
              </div>
            ))}
          </div>
        ) : (
          !loading && !error && <div className="empty-block" role="status">
            <div className="icon" aria-hidden="true">🍽️</div>
            <h2>No media yet</h2>
            <p>When {partnerDerived.displayName || 'this partner'} adds content, you will see it here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnerStore;