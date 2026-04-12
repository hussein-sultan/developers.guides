export type SuccessResult<T> = {
  message: string,
  success: true;
  statusCode: number;
  data: T;
};

export type FailureResult<E> = {
  message: string,
  success: false;
  statusCode: number;
  error: E;
};

export type Result<T, E> = SuccessResult<T> | FailureResult<E>;

// Keep Result types and helpers in types/common/result.ts because they are shared, domain-agnostic primitives.
export function successResult<T>(data: T, message: string, statusCode: number): SuccessResult<T> {
  return { success: true, message, statusCode, data };
}

export function failureResult<E>(error: E, message: string, statusCode: number): FailureResult<E> {
  return { success: false, message, statusCode, error };
}

