import { ApiRequestBody } from "@/types/api/request";

export function isBodyInit(body: ApiRequestBody): body is BodyInit {
  return (
    body === null ||
    typeof body === "string" ||
    body instanceof Blob ||
    body instanceof FormData ||
    body instanceof URLSearchParams ||
    body instanceof ArrayBuffer ||
    ArrayBuffer.isView(body)
  );
}

export function normalizeEndpoint(endpoint: string): string {
  return endpoint.replace(/^\/+/, "")
}