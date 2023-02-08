export type ExternalPoapEvent = {
  id: number;
  name: string;
  description: string;
  fancy_id: string;
  image_url: string;
};

export type ExternalAuthToken = {
  access_token: string;
};

export type ExternalPOAPListClaimCode = {
  qr_hash: string;
  claimed: boolean;
};

export type HealthCheck = {
  status: 'healthy' | 'unhealthy';
};

export type ExternalPOAPClaimCode = {
  qr_hash: string;
  claimed: boolean;
  signer: string;
  is_active: boolean;
  tx_status: string;
  secret: string;
};
