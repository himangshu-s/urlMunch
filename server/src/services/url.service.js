import Url from "../models/url.model.js";
import generateShortCode from "../utils/generateShortCode.js";
import reservedAliases from "../utils/reservedAliases.js";
import ApiError from "../utils/ApiError.js";
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