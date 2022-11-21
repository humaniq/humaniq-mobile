export type MoverAPISuccessfulResponse<P> = {
  status: 'ok';
  payload: P;
};

export type MoverAPIErrorResponse<P = void> = {
  status: 'error';
  errorCode: string;
  error: string;
  payload: P;
};

export type MoverAPIResponse<T, E = void> =
  | MoverAPISuccessfulResponse<T>
  | MoverAPIErrorResponse<E>;

export const isErrorResponse = <P, E>(
  response: MoverAPIResponse<P, E>
): response is MoverAPIErrorResponse<E> => {
  return response.status === 'error';
};
