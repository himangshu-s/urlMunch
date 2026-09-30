import Url from "../models/url.model.js";
import generateShortCode from "../utils/generateShortCode.js";
import reservedAliases from "../utils/reservedAliases.js";
import ApiError from "../utils/ApiError.js";
import {getCache,setCache,} from "./cache.service.js";
import { deleteCache } from "./cache.service.js";
// this is for when someone sends POST req
const createShortUrl = async (originalUrl, expiresAt=null,customAlias= null,userId) => {
    if (customAlias && reservedAliases.has(customAlias.toLowerCase())) {
  throw new ApiError(400, "This custom alias is reserved");
}
  let shortCode;
  if(customAlias){
    shortCode= customAlias;
  } else{

  do {
    shortCode = generateShortCode();
  } while (await Url.exists({ shortCode }));  // this is do while loop
  }
  const url = await Url.create({
    originalUrl,
    shortCode,
    expiresAt,
    user:userId,
  });


  return url;
};
// this is for when someomne sends GET req, like months after creating the url , i asked to get it , in that terms. 
const getUrlByShortCode = async (shortCode) => {
  const url = await Url.findOne({ shortCode });

  return url;
};


// gvies all urls of that logged in user
const getUserUrls = async (userId) => {
  const urls = await Url.find({ user: userId })
    .sort({ createdAt: -1 });

  return urls;
};

// gives that particular url to the logged in user
const getUserUrlById = async (urlId, userId) => {
  const url = await Url.findOne({
    _id: urlId,
    user: userId,
  });

  if (!url) {
    throw new ApiError(404, "URL not found");
  }

  return url;
};


const updateUserUrl = async (urlId, userId, updates) => {
  const url = await Url.findOneAndUpdate(
    {
      _id: urlId,
      user: userId,
    },
     {
      $set: updates,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!url) {
    throw new ApiError(404, "URL not found");
  }

  await deleteCache(`url:${url.shortCode}`);

  return url;
};


const deleteUserUrl = async (urlId, userId) => {
  const url = await Url.findOneAndDelete({
    _id: urlId,
    user: userId,
  });

  if (!url) {
    throw new ApiError(404, "URL not found");
  }
    await deleteCache(`url:${url.shortCode}`);

  return url;
};

export { createShortUrl,getUrlByShortCode, getUserUrls, getUserUrlById,updateUserUrl,deleteUserUrl, };

/* The controller will essentially say:

"I received the request. Give this URL to the URL service."

The service says:

"I'll handle generating the code, checking uniqueness, and creating the URL." */