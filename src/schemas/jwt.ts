import { z } from "zod";

export const JWTSchema = z.looseObject({
    aud: z.string(),
    jti: z.string(),
    iat: z.number(),
    nbf: z.number().optional(),
    exp: z.number(),
    sub: z.string(),
    scopes: z.array(z.string()).optional(),
});

export type JWT = z.infer<typeof JWTSchema>;
