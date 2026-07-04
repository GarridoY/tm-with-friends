import { z } from "zod";

export const OAuthResponseSchema = z.looseObject({
    token_type: z.string(),
    expires_in: z.number(),
    access_token: z.string(),
});

export const NadeoServiceResponseSchema = z.looseObject({
    accessToken: z.string(),
    refreshToken: z.string(),
});

export type OAuthResponse = z.infer<typeof OAuthResponseSchema>;
export type NadeoServiceResponse = z.infer<typeof NadeoServiceResponseSchema>;
