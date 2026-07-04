import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    CLIENT_ID: z.string().min(1, "CLIENT_ID is required"),
    CLIENT_SECRET: z.string().min(1, "CLIENT_SECRET is required"),
    ENCODED_CREDENTIALS: z.string().min(1, "ENCODED_CREDENTIALS is required"),
  },
  runtimeEnv: {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    ENCODED_CREDENTIALS: process.env.ENCODED_CREDENTIALS,
  },
});
