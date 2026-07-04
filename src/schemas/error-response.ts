import { z } from "zod";

export const ErrorResponseSchema = z.looseObject({
    code: z.string(),
    correlation_id: z.string(),
    message: z.string(),
    info: z.array(z.string()),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
