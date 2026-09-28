# Our initial URL document

For the MVP, let's start with:

URL
│
├── originalUrl
├── shortCode
├── clicks
├── expiresAt
├── createdAt
└── updatedAt

We'll eventually add a user reference when we implement authentication.

I'm intentionally not adding authentication yet because we haven't built the user system. We don't want to make the URL model depend on something that doesn't exist yet.