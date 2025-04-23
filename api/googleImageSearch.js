import { authenticateUser, asyncHandler, sendError } from './_apiUtils.js';
import Sentry from './_sentry.js';

export default asyncHandler(async (req, res) => {
  try {
    // Authenticate the user
    await authenticateUser(req);
    
    if (req.method !== 'POST') {
      return sendError(res, 405, 'Method not allowed');
    }
    
    const { query } = req.body;
    
    if (!query) {
      return sendError(res, 400, 'Search query is required');
    }
    
    // API key and search engine ID are required for Google Custom Search API
    const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
    const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
    
    if (!apiKey || !searchEngineId) {
      return sendError(res, 500, 'Search API configuration is missing');
    }
    
    // Build the URL for Google Custom Search JSON API
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}&searchType=image`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Google Search API error:', errorData);
      return sendError(res, response.status, 'Failed to search for images');
    }
    
    const data = await response.json();
    
    // Extract and send back just the image URLs and thumbnails
    const images = data.items?.map(item => ({
      url: item.link,
      thumbnail: item.image.thumbnailLink,
      title: item.title
    })) || [];
    
    return res.status(200).json({ images });
  } catch (error) {
    console.error('Error in Google Image Search API:', error);
    Sentry.captureException(error);
    return sendError(res, 500, 'Failed to search for images');
  }
});