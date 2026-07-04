import { JWTSchema } from "@/schemas/jwt";

export function getPayloadFromAccessToken(accessToken: string): string {
    return accessToken.split(".")[1];
}

export function decodeJWT(payload: string) {
    return JWTSchema.parse(JSON.parse(atob(payload)));
}