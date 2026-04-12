import { ApiRequestConfig, ApiRequestError, ApiRequestInitConfig, MessagesType } from "@/types/api/request";
import { PathType } from "@/types/common";
import { failureResult, Result, successResult } from "@/types/common/result";
import { isBodyInit, normalizeEndpoint } from "@/utils/request";
import { revalidatePath, revalidateTag } from "next/cache";

const BASE_URL = 'http://localhost:3001'

export async function apiRequest<T>(path: PathType, messages: MessagesType, revalidate?: string, options: ApiRequestConfig = {}, tag?: string): Promise<Result<T, ApiRequestError>> {
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
    const response = await fetch(url, config)

    if (!response.ok) {
      const errorMessage = messages?.failure || `Request failed with status ${response.status}`
      return failureResult({
        message: errorMessage,
        status: response.status,
        info: await response.text()
      }, errorMessage, response.status)
    }

    if (revalidate) revalidatePath(revalidate)
    if (tag) revalidateTag(tag, 'default')

    const data: T = await response.json()
    return successResult(data, messages?.success ?? '', response.status)

  } catch (error) {
    const errorMessage = messages?.failure ?? ''
    return failureResult({
      message: errorMessage,
      status: 500,
      info: { cause: error }
    }, errorMessage, 500)
  }
}