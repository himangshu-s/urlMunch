/* This middleware will:

1.Read the access token from the Authorization header.
2.Verify it.
3.Extract userId.
4.Put that user information on req.user.
5.Let the request continue. */


import ApiError from "../utils/ApiError.js";
import { verifyAccessToken } from "../utils/token.js";

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "Authentication required"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyAccessToken(token);

    req.user = decoded;

    next();
  } catch (error) {
    return next(new ApiError(401, "Invalid or expired access token"));
  }
};

export default authenticate;

/*. 1. Where does Authorization come from?

The client sends:

Authorization: Bearer eyJhbGciOi...

Express exposes headers through:

req.headers

so:

req.headers.authorization

gives us:

Bearer eyJhbGciOi...
2. Why Bearer?

This is the standard HTTP authentication scheme for bearer tokens.

Bearer <token>

means essentially:

Whoever possesses this token can present it as their authentication credential.

3. What does this do?
const token = authHeader.split(" ")[1];

Given:

Bearer abc123

split(" ") gives:

["Bearer", "abc123"]

and [1] gives:

abc123
4. What does verifyAccessToken() return?

Remember our token utility:

jwt.verify(token, secret)

If the token is valid, it returns the decoded payload.

Our token contains:

{
  userId: "..."
}

So:

const decoded = verifyAccessToken(token);

gives us something like:

{
  userId: "68abc123...",
  iat: ...,
  exp: ...
}

Then:

req.user = decoded;

attaches that information to the current request.

Now downstream code can do:

req.user.userId

to know which authenticated user made the request.



How does JavaScript/Express know that req is allowed to have a new property called user?

And the answer is actually pretty simple and important:

req is just a JavaScript object

Express creates the req object and passes it into your middleware:

const authenticate = (req, res, next) => {

At that point, req is an object with many properties that Express has already provided:

req.headers
req.body
req.params
req.query
...

But JavaScript objects are generally dynamic.

So you can do:

req.user = decoded;

even though Express didn't originally define a user property.

It's basically the same as:

const person = {
  name: "Himangshu"
};

person.age = 22;

You didn't declare age when creating the object, but JavaScript allows you to add it


*/