import { z } from "zod";
const createUrlSchema= z.object({
    originalUrl:z
    .string({
        error:"Original URL is required",
    })
    .trim()
    .url("please provide a valid URL"),
})

export {createUrlSchema};
/* Zod is a JavaScript/TypeScript schema validation library.

Its job is basically:

"Here is what I expect the incoming data to look like. Check whether the data actually follows those rules."




z.object()
z.object({
   ...
})

means:

"I expect the request body to be an object."

So we're expecting:

{
  "originalUrl": "..."
}
originalUrl
originalUrl: ...

means:

"This object must have a property called originalUrl."

z.string()
z.string()

means:

"originalUrl must be a string."

This passes:

{
  "originalUrl": "https://youtube.com"
}

But this doesn't:

{
  "originalUrl": 12345
}
.trim()
.trim()

removes whitespace around the value.

For example:

"   https://youtube.com   "

becomes:

"https://youtube.com"
.url()

This is the important part:

.url("Please provide a valid URL")

Zod checks whether the string follows a valid URL format.

So:

https://youtube.com

passes.

While something like:

hello

fails.



*/