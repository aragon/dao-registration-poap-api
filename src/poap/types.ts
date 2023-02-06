export type ExternalPoapEventResponse = {
  id: number;
  name: string;
  description: string;
  fancy_id: string;
  image_url: string;
};

export type ExternalAuthTokenResponse = {
  access_token: string;
};

export type ExternalPOAPClaimCodesResponse = {
  qr_hash: string;
  claimed: boolean;
};
