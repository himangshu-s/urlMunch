import {
  getCache,
  setCache,
} from "../services/cache.service.js";
import { getUrlByShortCode } from "../services/url.service.js";
import { recordClickEvent } from "../services/analytics.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

const redirectToOriginalUrl = asyncHandler(async (req, res) => {
  const { shortCode } = req.params;

  const cacheKey = `url:${shortCode}`;

  let originalUrl = await getCache(cacheKey);

  // Cache hit
  if (originalUrl) {
    await recordClickEvent(shortCode);

    return res.redirect(originalUrl);
  }

  // Cache miss
  const url = await getUrlByShortCode(shortCode);

  if (!url) {
    throw new ApiError(404, "Short URL not found");
  }

  if (url.expiresAt && url.expiresAt <= new Date()) {
    throw new ApiError(410, "Short URL has expired");
  }

  originalUrl = url.originalUrl;

  await setCache(
    cacheKey,
    originalUrl,
    3600,
  );

  await recordClickEvent(shortCode);

  return res.redirect(originalUrl);
});

export { redirectToOriginalUrl };