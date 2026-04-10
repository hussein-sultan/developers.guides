import { ApiRequestConfig, ApiRequestError, ApiRequestInitConfig, MessagesType } from "@/types/api/request";
import { PathType } from "@/types/common";
import { failureResult, Result, successResult } from "@/types/common/result";
import { isBodyInit, normalizeEndpoint } from "@/utils/request";

const BASE_URL = 'http://localhost:3001'

export async function apiRequest<T>(path: PathType, messages: MessagesType, options: ApiRequestConfig = {}): Promise<Result<T, ApiRequestError>> {
  const { method = 'GET', body, headers, next, ...customConfig } = options
  const normalizedEndpoint = normalizeEndpoint(path?.endpoint ?? '')

  const config: ApiRequestInitConfig = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(headers as Record<string, string>)
    },
    next,
    ...customConfig
  }

  if (body !== undefined) {
    config.body = isBodyInit(body) ? body : JSON.stringify(body)
  }
  try {

    const url = path.url ? path.url : new URL(normalizedEndpoint, `${BASE_URL}/`).toString()
    console.log(url)
    const response = await fetch(url, config)

    if (!response.ok) {
      if (messages.failure) {
        // Optionally, you could trigger a toast or notification here using the failure message
      }
      return failureResult({
        message: `Request failed with status ${response.status}`,
        status: response.status,
        info: await response.text()
      }, response.status)
    }

    if (messages.success) {
      // Optionally, you could trigger a toast or notification here using the success message
    }
    const data: T = await response.json()
    return successResult(data, response.status)

  } catch (error) {

    const message = error instanceof Error ? error.message : "Unknown fetch error"
    if (messages.failure) {
      // Optionally, you could trigger a toast or notification here using the failure message
    }

    return failureResult({
      message,
      status: 500,
      info: { cause: error }
    }, 500)
  }
}