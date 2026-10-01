import Url from "../models/url.model.js";
import ClickEvent from "../models/clickEvent.model.js";
import ApiError from "../utils/ApiError.js";

const getUrlAnalytics = async (req, res, next) => {
  try {
    const { id } = req.params;

    // First verify that this URL belongs to the logged-in user.
    const url = await Url.findOne({
      _id: id,
      user: req.user.userId,
    });

    if (!url) {
      throw new ApiError(404, "URL not found");
    }

    // Analytics are stored using the shortCode.
    const clicks = await ClickEvent.find({
      shortCode: url.shortCode,
    }).sort({ timestamp: -1 });

    return res.status(200).json({
      success: true,
      data: {
        url: {
          _id: url._id,
          originalUrl: url.originalUrl,
          shortCode: url.shortCode,
          createdAt: url.createdAt,
          expiresAt: url.expiresAt,
        },
        totalClicks: clicks.length,
        clicks,
      },
    });
  } catch (error) {
    next(error);
  }
};

export { getUrlAnalytics };