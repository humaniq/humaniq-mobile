import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from "axios"

import { addSentryBreadcrumb } from "app/logs/sentry"
import { Service } from "app/services/Service"

import { isErrorResponse, MoverAPIErrorResponse, MoverAPIResponse, MoverAPISuccessfulResponse } from "./types"
import { MoverAPIError } from "./MoverAPIError"
import { MoverError } from "../../MoverError"

export abstract class MoverAPIService extends Service {
  protected formatError(error: unknown): never {
    if (error instanceof MoverAPIError) {
      addSentryBreadcrumb({
        type: 'error',
        message: 'API responded with an error',
        category: this.sentryCategoryPrefix,
        data: {
          error: error.message,
          shortError: error.shortMessage,
          payload: error.payload
        }
      });

      throw error;
    }

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<MoverAPIErrorResponse<unknown>>;
      addSentryBreadcrumb(this.formatAxiosErrorSentryBreadcrumb(axiosError));

      if (axiosError.response !== undefined) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (axiosError.response.data === undefined) {
          addSentryBreadcrumb({
            type: 'error',
            message: 'API responded with an error',
            category: this.sentryCategoryPrefix,
            data: {
              error: 'no data available',
              axiosError
            }
          });

          throw new MoverAPIError('Request failed', 'no data').wrap(axiosError); // no data available
        }

        addSentryBreadcrumb({
          type: 'error',
          message: 'API responded with an error',
          category: this.sentryCategoryPrefix,
          data: {
            error: axiosError.response.data.error,
            shortError: axiosError.response.data.errorCode,
            axiosError
          }
        });

        throw new MoverAPIError(
          axiosError.response.data.error,
          axiosError.response.data.errorCode,
          axiosError.response.data.payload as Record<string, unknown>
        );
      } else if (axiosError.request !== undefined) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest
        addSentryBreadcrumb({
          type: 'error',
          message: 'API responded with an error',
          category: this.sentryCategoryPrefix,
          data: {
            error: 'no response received',
            axiosError
          }
        });

        throw new MoverError('the request is failed, no response').wrap(error);
      }
    }

    addSentryBreadcrumb({
      type: 'error',
      message: 'API responded with an error',
      category: this.sentryCategoryPrefix,
      data: {
        error: 'the request is failed during setup',
        originalError: error
      }
    });

    if (error instanceof Error) {
      // An error is JS-initiated error, just pass it through
      throw new MoverError('The request is failed').wrap(error);
    }

    throw new MoverError(`The request is failed during setup / result handling`, { data: error });
  }

  protected applyAxiosInterceptors(instance: AxiosInstance): AxiosInstance {
    instance.interceptors.request.use((config: AxiosRequestConfig) => {
      // enforce JSON payload format
      const newConfig = config;
      newConfig.headers = { ...config.headers, Accept: 'application/json' };

      // treat HTTP 200 as only valid answer
      newConfig.validateStatus = (status: number) => status === 200;
      return newConfig;
    });

    instance.interceptors.response.use(
      <
        T extends Record<string, unknown> | undefined,
        E extends Record<string, unknown> | undefined
      >(
        response: AxiosResponse<MoverAPIResponse<T, E>>
      ):
        | AxiosResponse<MoverAPISuccessfulResponse<T>>
        | Promise<AxiosResponse<MoverAPISuccessfulResponse<T>>> => {
        // if response.data.status === 'error' then API returned malformed
        // response and/or the response should be treated as an error
        if (isErrorResponse(response.data)) {
          addSentryBreadcrumb({
            type: 'error',
            message: 'API responded with code 200 but data.status is "error"',
            category: this.sentryCategoryPrefix,
            data: {
              status: response.status,
              data: response.data
            }
          });

          const errorPayload =
            typeof response.data.payload === 'object' && !Array.isArray(response.data.payload)
              ? response.data.payload
              : { responsePayload: response.data.payload };

          const error = new MoverAPIError(
            response.data.error,
            response.data.errorCode,
            errorPayload
          );
          this.formatError(error);
        }

        // otherwise, don't process the response
        // anyway, we have to cast response (originally MoverAPIResponse<T, E>) to
        // the MoverAPISuccessfulResponse<T> given that response.data.status is not of
        // error type
        return response as AxiosResponse<MoverAPISuccessfulResponse<T>>;
      },
      this.formatError.bind(this)
    );

    return instance;
  }

  protected getAuthHeaders(address: string, confirmationSignature: string): AxiosRequestHeaders {
    // @ts-ignore
    return {
      'X-Api-Addr': address,
      'X-Api-Sig': confirmationSignature
    };
  }

  protected formatAxiosErrorSentryBreadcrumb(axiosError: AxiosError<unknown>) {
    const requestUri = axios.getUri(axiosError.config);
    const { code } = axiosError;

    return {
      message: 'A request to the API is failed',
      category: this.sentryCategoryPrefix,
      data: {
        requestUri,
        code,
        axiosError
      }
    };
  }
}
