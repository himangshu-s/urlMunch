import { createShortUrl, getUserUrls, getUserUrlById,updateUserUrl } from "../services/url.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const createUrl= asyncHandler(async(req,res)=>{
    const {originalUrl, expiresAt, customAlias} = req.body;
    const url= await createShortUrl(originalUrl, expiresAt, customAlias, req.user.userId,);

    return res
    .status(201)
    .json(new ApiResponse(201, url, "URl shortened successfully"));
});

const getMyUrls = asyncHandler(async (req, res) => {
  const urls = await getUserUrls(req.user.userId);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        urls,
        "URLs fetched successfully",
      ),
    );
});

// this is for this= GET    /api/urls/:id 
const getMyUrlById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const url = await getUserUrlById(
    id,
    req.user.userId,
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        url,
        "URL fetched successfully",
      ),
    );
});


const updateUrl = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const url = await updateUserUrl(
    id,
    req.user.userId,
    req.body,
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        url,
        "URL updated successfully",
      ),
    );
});


const deleteUrl = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await deleteUserUrl(
    id,
    req.user.userId,
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "URL deleted successfully",
      ),
    );
});

export {createUrl, getMyUrls, getMyUrlById,updateUrl,deleteUrl};