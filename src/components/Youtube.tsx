'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Video {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      high: {
        url: string;
      };
    };
  };
}

const YouTube = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchYoutubeSettingsAndVideos = async () => {
      // 1. Fetch settings from Supabase
      const { data: settings, error: settingsError } = await supabase
        .from('contacts')
        .select('youtube_api_key, youtube_channel_id')
        .eq('id', 1)
        .single();

      if (settingsError || !settings) {
        console.error('Error fetching YouTube settings:', settingsError);
        setError('Could not load YouTube configuration. Please check admin settings.');
        setLoading(false);
        return;
      }

      const { youtube_api_key: apiKey, youtube_channel_id: channelId } = settings;

      if (!apiKey || !channelId) {
        setError('YouTube API Key or Channel ID is not set in the admin panel.');
        setLoading(false);
        return;
      }

      // 2. Fetch videos from YouTube API
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=2`
        );
        
        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.error?.message || 'Failed to fetch videos from YouTube.';
            throw new Error(errorMessage);
        }
        
        const data = await response.json();
        if (data.items) {
          setVideos(data.items);
        } else {
            setError("No videos found for this channel.")
        }

      } catch (e: any) {
        console.error('Error fetching YouTube videos:', e);
        setError(e.message || 'An unexpected error occurred while fetching videos.');
      } finally {
        setLoading(false);
      }
    };

    fetchYoutubeSettingsAndVideos();
  }, []);

  return (
    <section id="youtube" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Our Projects on YouTube</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our properties and projects in detail through our YouTube channel.
          </p>
        </div>

        {loading && <div className="text-center">Loading videos...</div>}
        {error && <div className="text-center text-red-500 bg-red-100 p-4 rounded-md">{error}</div>}
        
        {!loading && !error && (
            videos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {videos.map((video) => (
                    <div key={video.id.videoId} className="aspect-w-16 aspect-h-9">
                    <iframe
                        className="w-full h-full rounded-lg shadow-lg"
                        src={`https://www.youtube.com/embed/${video.id.videoId}`}
                        title={video.snippet.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                    </div>
                ))}
                </div>
            ) : (
                <div className="text-center text-muted-foreground">No recent videos to display.</div>
            )
        )}
      </div>
    </section>
  );
};

export default YouTube;