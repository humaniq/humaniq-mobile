import axios, { AxiosInstance } from 'axios';

import { addSentryBreadcrumb } from 'app/logs/sentry';
import { MoverAPIService } from 'app/services/api/mover/MoverAPIService';
import { MoverAPISuccessfulResponse } from 'app/services/api/mover/types';
import { APP_API_TAG_SERVICE_URL } from "../../../../envs/env"

export class MoverAPIConfirmationService extends MoverAPIService {
  protected baseURL: string;

  protected readonly client: AxiosInstance;
  protected readonly sentryCategoryPrefix: string = 'confirmation.api.service';

  constructor() {
    super('confirmation.api.service');
    this.baseURL = this.lookupBaseURL();
    this.client = this.applyAxiosInterceptors(
      axios.create({
        baseURL: this.baseURL
      })
    );
  }

  public async getCountConfirmations(): Promise<number> {
    try {
      const resp = await this.client.get<MoverAPISuccessfulResponse<{ count: number }>>(
        `/confirmation/count`
      );
      return resp.data.payload.count;
    } catch (error) {
      addSentryBreadcrumb({
        type: 'error',
        message: 'Fetch count confirmation error',
        category: this.sentryCategoryPrefix,
        data: {
          error: error
        }
      });
      return 0;
    }
  }

  public async validConfirmation(address: string, signature: string): Promise<boolean> {
    console.log("valid-confirmation")
    try {
      await this.client.get<MoverAPISuccessfulResponse<void>>(`/confirmation/valid`, {
        headers: {
          'X-Api-Sign': signature,
          'X-Api-Addr': address
        }
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  public async setConfirmation(address: string, signature: string): Promise<boolean> {
    try {
      await this.client.post<MoverAPISuccessfulResponse<void>>(`/confirmation`, {
        address: address,
        sig: signature
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  protected lookupBaseURL(): string {
    return APP_API_TAG_SERVICE_URL
  }
}
