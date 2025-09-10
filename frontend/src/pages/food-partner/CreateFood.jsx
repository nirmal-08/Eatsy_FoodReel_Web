import React, { useState, useRef } from 'react';
import './createFood.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const CreateFood = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const videoInputRef = useRef(null);
  const navigate = useNavigate();

  const handleVideoChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      setErrors(prev => ({ ...prev, video: 'Please choose a valid video file.' }));
      return;
    }
    setErrors(prev => ({ ...prev, video: undefined }));
    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoPreview(url);
  };

  const validate = () => {
    const next = {};
    if (!videoFile) next.video = 'Video is required';
    if (!name.trim()) next.name = 'Name is required';
    if (!description.trim()) next.description = 'Description is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    // For now just log; integration can be added later.
    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('name', name.trim());
    formData.append('description', description.trim());

    const response = await axios.post('https://eatsy-foodreel-web.onrender.com/api/food',formData, {
      withCredentials: true,
    })
    // console.log('Submitted successfully', response.data);
    navigate('/')
  };

  return (
    <section className="create-food-page" aria-labelledby="createFoodHeading">
      <div className="cf-shell">
        <h1 id="createFoodHeading" className="cf-title">Create Food</h1>
        <form className="cf-form" onSubmit={handleSubmit} noValidate>
          <div className="field video-field">
            <label className="field-label">Food Reel Video <span className="req" aria-hidden="true">*</span></label>
            <div className="video-drop" onClick={() => videoInputRef.current?.click()} role="button" tabIndex={0} onKeyDown={(e)=>{ if(e.key==='Enter'||e.key===' ') { e.preventDefault(); videoInputRef.current?.click(); } }} aria-label="Select food video">
              {videoPreview ? (
                <div className="video-preview-wrapper">
                  <video className="video-preview" src={videoPreview} muted loop playsInline />
                  <button type="button" className="swap-btn" onClick={(e)=>{ e.stopPropagation(); videoInputRef.current?.click(); }}>Change</button>
                </div>
              ) : (
                <div className="placeholder">
                  <div className="icon" aria-hidden="true">🎬</div>
                  <p className="ph-title">Upload vertical video</p>
                  <p className="ph-hint">.mp4 / .webm up to 30s</p>
                  <span className="ph-cta">Choose file</span>
                </div>
              )}
              <input
                ref={videoInputRef}
                type="file"
                accept="video/mp4,video/webm,video/*"
                className="visually-hidden"
                onChange={handleVideoChange}
              />
            </div>
            {errors.video && <p className="err-msg">{errors.video}</p>}
          </div>
          <div className="field">
            <label htmlFor="foodName" className="field-label">Name <span className="req" aria-hidden="true">*</span></label>
            <input
              id="foodName"
              type="text"
              className="text-input"
              placeholder="Ex: Spicy Paneer Wrap"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              maxLength={80}
            />
            {errors.name && <p className="err-msg">{errors.name}</p>}
          </div>
            <div className="field">
              <label htmlFor="foodDesc" className="field-label">Description <span className="req" aria-hidden="true">*</span></label>
              <textarea
                id="foodDesc"
                className="text-area"
                rows={4}
                placeholder="Short tasty description, ingredients, special notes..."
                value={description}
                onChange={(e)=>setDescription(e.target.value)}
                maxLength={500}
              />
              <div className="char-row">
                <span className="char-count">{description.length} / 500</span>
              </div>
              {errors.description && <p className="err-msg">{errors.description}</p>}
            </div>
          <div className="actions-row">
            <button type="submit" className="primary-btn">Publish</button>
            <button type="button" className="ghost-btn" onClick={()=>{ setVideoFile(null); setVideoPreview(null); setName(''); setDescription(''); setErrors({}); }}>Reset</button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CreateFood;
