import React from 'react';

const VideoPlayer = ({ youtubeUrl, title = 'Video Player' }) => {
  const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;

    let videoId;

    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    } else if (url.includes('youtube.com/watch')) {
      videoId = new URL(url).searchParams.get('v');
    } else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('youtube.com/embed/')[1];
    } else {
      videoId = url;
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const embedUrl = getYoutubeEmbedUrl(youtubeUrl);

  if (!embedUrl) {
    return (
      <div className="w-full bg-brand-surface border border-white/[0.08] rounded-xl flex items-center justify-center aspect-video">
        <div className="text-center">
          <p className="text-white mb-2">Invalid video URL</p>
          <p className="text-text-muted text-sm">Please check the video URL and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl overflow-hidden border border-white/[0.08]">
      <iframe
        width="100%"
        height="600"
        src={embedUrl}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="aspect-video"
      ></iframe>
    </div>
  );
};

export default VideoPlayer;
