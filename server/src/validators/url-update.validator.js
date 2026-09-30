import { z } from "zod";

const updateUrlSchema = z
  .object({
    originalUrl: z
      .string()
      .trim()
      .url("Please provide a valid URL")
      .optional(), // this should be optional , we shpuldn;t force the user to send the orogonal url again.

    expiresAt: z
      .coerce
      .date()
      .refine((date) => date > new Date(), {
        message: "Expiration date must be in the future",
      })
      .optional(),
  })
  .refine(
    (data) =>
      data.originalUrl !== undefined ||
      data.expiresAt !== undefined,
    {
      message: "At least one field must be provided",
    },
  );

export { updateUrlSchema };