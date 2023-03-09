export type ExternalPoapEvent = {
  id: number;
  name: string;
  description: string;
  fancy_id: string;
  image_url: string;
  expiry_date: string;
};

export type ExternalAuthToken = {
  access_token: string;
};

export type ExternalPoapListClaimCode = {
  qr_hash: string;
  claimed: boolean;
};

export type HealthCheck = {
  status: 'healthy' | 'unhealthy';
};

export type ExternalPoapClaimCode = {
  qr_hash: string;
  claimed: boolean;
  signer: string;
  is_active: boolean;
  tx_status: string;
  secret: string;
  result?: {
    token_id?: number;
  };
};
