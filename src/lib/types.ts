export interface Client {
  id: string;
  client_company_name: string;
  country_code: string;
  created_at: string;
  pin: number;
}

export interface PrefundingRequest {
  id: string;
  client_id: string;
  wallet_address: string;
  amount: number;
  status: string;
  processed_at: string;
}

export interface PrefundingV2Request {
  id: string;
  client_id: string;
  wallet_address: string;
  amount: number;
  status: string;
  processed_at: string;
}

export interface FundingFormData {
  amount: number;
}