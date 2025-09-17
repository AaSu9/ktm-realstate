-- Add YouTube and TikTok URL fields to properties table
ALTER TABLE public.properties 
ADD COLUMN youtube_url TEXT,
ADD COLUMN tiktok_url TEXT;