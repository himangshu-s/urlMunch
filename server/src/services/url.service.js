import Url from "../models/url.model.js";
import generateShortCode from "../utils/generateShortCode.js";
// this is for when someone sends POST req
const createShortUrl = async (originalUrl) => {
  let shortCode;

  do {
    shortCode = generateShortCode();
  } while (await Url.exists({ shortCode }));  // this is do while loop

  const url = await Url.create({
    originalUrl,
    shortCode,
  });

  return url;
};
// this is for when someomne sends GEt req, like months after creating the url , i asked to get it , in that terms. 
const getUrlByShortCode = async (shortCode) => {
  const url = await Url.findOne({ shortCode });

  return url;
};

export { createShortUrl,getUrlByShortCode };

/* The controller will essentially say:

"I received the request. Give this URL to the URL service."

The service says:

"I'll handle generating the code, checking uniqueness, and creating the URL." */