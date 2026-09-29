import { z } from "zod";
const createUrlSchema= z.object({
    originalUrl:z
    .string({
        error:"Original URL is required",
    })
    .trim()
    .url("please provide a valid URL"),
     expiresAt: z.coerce
  .date()
  .refine((date) => date > new Date(), { // "The date provided by the user must be later than the current time."
    message: "Expiration date must be in the future",
  }) // checks whether the date is in future or not , otherwise it will accpet past dates too.
  .optional(), // the client sends the data in strin gs , so the date will be in string too, but the mongoodb field is javascript date.so
     // z.coerce.date() tells Zod: "Take the incoming value and try to convert it into a JavaScript Date."  and And .optional() means the field doesn't have to be present.

     customAlias: z
    .string()
    .trim()
    .min(3, "Custom alias must be at least 3 characters")
    .max(20, "Custom alias cannot exceed 20 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Custom alias contains invalid characters")
    .optional(),
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