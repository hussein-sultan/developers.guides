export type SuccessResult<T> = {
  success: true;
  statusCode: number;
  data: T;
};

export type FailureResult<E> = {
  success: false;
  statusCode: number;
  error: E;
};

export type Result<T, E> = SuccessResult<T> | FailureResult<E>;

// Keep Result types and helpers in types/common/result.ts because they are shared, domain-agnostic primitives.
export function successResult<T>(data: T, statusCode: number): SuccessResult<T> {
  return { success: true, statusCode, data };
}

export function failureResult<E>(error: E, statusCode: number): FailureResult<E> {
  return { success: false, statusCode, error };
}

