import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SocialMediaPost {
  platform: 'facebook' | 'instagram' | 'twitter';
  message: string;
  imageUrl?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { platform, message, imageUrl }: SocialMediaPost = await req.json();

    console.log(`Posting to ${platform}:`, message);

    let result;

    switch (platform) {
      case 'facebook':
        result = await postToFacebook(message, imageUrl);
        break;
      case 'instagram':
        result = await postToInstagram(message, imageUrl);
        break;
      case 'twitter':
        result = await postToTwitter(message, imageUrl);
        break;
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in social-media-post function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

async function postToFacebook(message: string, imageUrl?: string) {
  const ACCESS_TOKEN = Deno.env.get("FACEBOOK_ACCESS_TOKEN");
  const PAGE_ID = Deno.env.get("FACEBOOK_PAGE_ID");

  if (!ACCESS_TOKEN || !PAGE_ID) {
    throw new Error("Facebook API credentials not configured");
  }

  const payload: any = {
    message: message,
    access_token: ACCESS_TOKEN,
  };

  if (imageUrl) {
    payload.link = imageUrl;
  }

  const response = await fetch(
    `https://graph.facebook.com/v17.0/${PAGE_ID}/feed`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  return await response.json();
}

async function postToInstagram(message: string, imageUrl?: string) {
  const ACCESS_TOKEN = Deno.env.get("INSTAGRAM_ACCESS_TOKEN");
  const ACCOUNT_ID = Deno.env.get("INSTAGRAM_ACCOUNT_ID");

  if (!ACCESS_TOKEN || !ACCOUNT_ID) {
    throw new Error("Instagram API credentials not configured");
  }

  // Instagram requires images for posts
  if (!imageUrl) {
    throw new Error("Instagram posts require an image URL");
  }

  // Create media container
  const containerResponse = await fetch(
    `https://graph.facebook.com/v17.0/${ACCOUNT_ID}/media`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_url: imageUrl,
        caption: message,
        access_token: ACCESS_TOKEN,
      }),
    }
  );

  const containerResult = await containerResponse.json();
  
  if (!containerResult.id) {
    throw new Error("Failed to create Instagram media container");
  }

  // Publish the media
  const publishResponse = await fetch(
    `https://graph.facebook.com/v17.0/${ACCOUNT_ID}/media_publish`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        creation_id: containerResult.id,
        access_token: ACCESS_TOKEN,
      }),
    }
  );

  return await publishResponse.json();
}

async function postToTwitter(message: string, imageUrl?: string) {
  // Twitter v2 API implementation would go here
  // Requires OAuth 1.0a authentication
  throw new Error("Twitter integration requires additional setup");
}

serve(handler);