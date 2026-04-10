export type NextCacheOptions = {
  tags?: string[];
  revalidate?: number | false;
};


export interface ApiRequestInitConfig extends RequestInit {
  next?: NextCacheOptions;
};

export type ApiRequestBody = unknown;
export interface ApiRequestConfig extends Omit<RequestInit, "body"> {
  body?: ApiRequestBody;
  next?: NextCacheOptions;
}

export interface ApiRequestError {
  message: string;
  status: number;
  info?: unknown;
}

export type MessagesType = {
  success?: string;
  failure?: string;
}