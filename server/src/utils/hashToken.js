import crypto from "crypto";

const hashToken = (token) => {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
};

export default hashToken;
// this is to store hashed refreshToken instead of the dorect raw one. wwe be called in. the service file.