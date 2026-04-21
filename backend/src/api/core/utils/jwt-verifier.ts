import { createRemoteJWKSet, jwtVerify } from "jose";

export class JwtVerifier {
  private jwksUri: string;
  private issuer: string;
  private clientId: string;
  private jwks: ReturnType<typeof createRemoteJWKSet>;

  constructor() {
    // 環境変数から設定を取得
    const region = process.env.AWS_REGION || "ap-northeast-1";
    const userPoolId = process.env.COGNITO_USER_POOL_ID;
    const clientId = process.env.COGNITO_CLIENT_ID;

    if (!userPoolId) {
      throw new Error("COGNITO_USER_POOL_ID environment variable is not set");
    }

    if (!clientId) {
      throw new Error("COGNITO_CLIENT_ID environment variable is not set");
    }

    this.issuer = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`;
    this.jwksUri = `${this.issuer}/.well-known/jwks.json`;
    this.clientId = clientId;
    this.jwks = createRemoteJWKSet(new URL(this.jwksUri));
  }

  async verify(token: string): Promise<any> {
    try {
      const { payload } = await jwtVerify(token, this.jwks, {
        issuer: this.issuer,
        audience: this.clientId,
      });

      return payload;
    } catch (error) {
      throw new Error(
        `Token verification failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}
