import { ApiRequestConfig, ApiRequestError, MessagesType } from "@/types/api/request"
import { Result } from "@/types/common/result"
import { apiRequest } from "./request"
import { IdType, PathType } from "@/types/common"

export class FactoryRequest<T, TCreate = Partial<T>, TUpdate = Partial<T>> {
  #path: PathType


  constructor(path: PathType = {}) {
    this.#path = path
  }


  create = (data: TCreate, messages: MessagesType, revalidate: string, options: ApiRequestConfig = {}, tag?: string): Promise<Result<T, ApiRequestError>> => {
    return apiRequest<T>(this.#path, messages, revalidate, { method: "POST", body: data, ...options }, tag)
  }

  get = (id?: IdType, messages?: MessagesType, options: ApiRequestConfig = {}, tag?: string): Promise<Result<T, ApiRequestError>> => {
    return apiRequest<T>({ ...this.#path, endpoint: `${this.#path.endpoint}/${id ?? ''}` }, messages ?? {}, '', options, tag)
  }

  getAll = (messages: MessagesType, options: ApiRequestConfig = {}, tag?: string): Promise<Result<T[], ApiRequestError>> => {
    return apiRequest<T[]>(this.#path, messages, '', options, tag)
  }

  update = (data: TUpdate, revalidate: string, id?: IdType, messages?: MessagesType, options: ApiRequestConfig = {}, tag?: string): Promise<Result<T, ApiRequestError>> => {
    return apiRequest<T>({ ...this.#path, endpoint: `${this.#path.endpoint}/${id ?? ''}` }, messages ?? {}, revalidate, { method: 'PUT', body: data, ...options }, tag)
  }

  updateProp = (data: TUpdate, revalidate: string, id?: IdType, messages?: MessagesType, options: ApiRequestConfig = {}, tag?: string): Promise<Result<T, ApiRequestError>> => {
    return apiRequest<T>({ ...this.#path, endpoint: `${this.#path.endpoint}/${id ?? ''}` }, messages ?? {}, revalidate, { method: 'PATCH', body: data, ...options }, tag)
  }

  delete = (revalidate: string, id?: IdType, messages?: MessagesType, options: ApiRequestConfig = {}, tag?: string): Promise<Result<T, ApiRequestError>> => {
    return apiRequest<T>({ ...this.#path, endpoint: `${this.#path.endpoint}/${id ?? ''}` }, messages ?? {}, revalidate, { method: 'DELETE', ...options }, tag)
  }
}

// this function is used to create a new service for a given path object, {url?: string, endpoint?: string}
export function createService<T>(path: PathType) {
  return new FactoryRequest<T>(path)
}