import { ApiRequestConfig, ApiRequestError, MessagesType } from "@/types/api/request"
import { Result } from "@/types/common/result"
import { apiRequest } from "./request"
import { IdType, PathType } from "@/types/common"

export class FactoryRequest<T, TCreate = Partial<T>, TUpdate = Partial<T>> {
  #path: PathType


  constructor(path: PathType = {}) {
    this.#path = path
  }


  create = (data: TCreate, messages: MessagesType, options: ApiRequestConfig = {}): Promise<Result<T, ApiRequestError>> => {
    return apiRequest<T>(this.#path, messages, { method: "POST", body: data, ...options })
  }

  get = (id?: IdType, messages?: MessagesType, options: ApiRequestConfig = {}): Promise<Result<T, ApiRequestError>> => {
    return apiRequest<T>({ ...this.#path, endpoint: `${this.#path.endpoint}/${id ?? ''}` }, messages ?? {}, options)
  }

  getAll = (messages: MessagesType, options: ApiRequestConfig = {}): Promise<Result<T[], ApiRequestError>> => {
    return apiRequest<T[]>(this.#path, messages, options)
  }

  update = (data: TUpdate, id?: IdType, messages?: MessagesType, options: ApiRequestConfig = {}): Promise<Result<T, ApiRequestError>> => {
    return apiRequest<T>({ ...this.#path, endpoint: `${this.#path.endpoint}/${id ?? ''}` }, messages ?? {}, { method: 'PUT', body: data, ...options })
  }

  updateProp = (data: TUpdate, id?: IdType, messages?: MessagesType, options: ApiRequestConfig = {}): Promise<Result<T, ApiRequestError>> => {
    return apiRequest<T>({ ...this.#path, endpoint: `${this.#path.endpoint}/${id ?? ''}` }, messages ?? {}, { method: 'PATCH', body: data, ...options })
  }

  delete = (id?: IdType, messages?: MessagesType, options: ApiRequestConfig = {}): Promise<Result<T, ApiRequestError>> => {
    return apiRequest<T>({ ...this.#path, endpoint: `${this.#path.endpoint}/${id ?? ''}` }, messages ?? {}, { method: 'DELETE', ...options })
  }
}

// this function is used to create a new service for a given path object, {url?: string, endpoint?: string}
export function createService<T>(path: PathType) {
  return new FactoryRequest<T>(path)
}