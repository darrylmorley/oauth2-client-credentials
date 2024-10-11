interface OAuthClientConfig {
  clientId: string;
  clientSecret: string;
  tokenUrl: string;
}

interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export class OAuthClient {
  private clientId: string;
  private clientSecret: string;
  private tokenUrl: string;
  private accessToken: string | null = null;
  private tokenExpiry: number | null = null;

  constructor(config: OAuthClientConfig) {
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.tokenUrl = config.tokenUrl;
  }

  // Method to request a new token
  private async requestNewToken(): Promise<TokenResponse> {
    const response = await fetch(this.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get token: ${response.statusText}`);
    }

    const data: TokenResponse = await response.json();
    return data;
  }

  // Method to get the current access token
  public async getAccessToken(): Promise<string> {
    // Check if the token exists and is not expired
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    // Request a new token if no token exists or it's expired
    const tokenResponse = await this.requestNewToken();
    this.accessToken = tokenResponse.access_token;
    this.tokenExpiry = Date.now() + tokenResponse.expires_in * 1000;

    return this.accessToken;
  }
}
