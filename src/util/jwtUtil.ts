interface JWT {
	aud: string,
	jti: string,
	iat: number,
	nbf: number,
	exp: number,
	sub: string,
	scopes: string[]
}

export function getPayloadFromAccessToken(accessToken: string): string {
    return accessToken.split(".")[1];
}

export function decodeJWT(payload: string): JWT {
    return JSON.parse(atob(payload));
}