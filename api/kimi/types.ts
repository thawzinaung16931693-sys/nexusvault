export interface KimiUser {
  union_id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface KimiTokenResponse {
  access_token: string;
  expires_in: number;
}
