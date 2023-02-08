import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpConfig } from './poap-http-config';
import {
  ExternalAuthToken,
  ExternalPOAPListClaimCode,
  ExternalPoapEvent,
  ExternalPOAPClaimCode,
} from './types';

@Injectable()
export class PoapService {
  httpConfig: HttpConfig;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.httpConfig = {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.configService.get<string>('POAP_API_KEY'),
      },
      baseURL: this.configService.get<string>('POAP_API_URL'),
    };
  }

  async healthCheck() {
    const { data } = await firstValueFrom(
      this.httpService.get('/health-check', this.httpConfig).pipe(
        catchError((error) => {
          console.error(error);
          throw 'An error happened!';
        }),
      ),
    );
    return data.status === 'healthy';
  }

  async claimQrCode(
    qrHash: string,
    address: string,
    secret: string,
    authToken: string,
  ) {
    const { data } = await firstValueFrom(
      this.httpService
        .post<ExternalPOAPClaimCode>(
          `/actions/claim-qr`,
          {
            qr_hash: qrHash,
            address,
            secret,
            sendEmail: true,
          },
          {
            ...this.httpConfig,
            headers: {
              ...this.httpConfig.headers,
              Authorization: `Bearer ${authToken}`,
            },
          },
        )
        .pipe(
          catchError((error) => {
            console.error(error);
            throw 'An error happened!';
          }),
        ),
    );
    return data;
  }

  async getClaimQrCode(qrHash: string, authToken: string) {
    const { data } = await firstValueFrom(
      this.httpService
        .get<ExternalPOAPClaimCode>(`/actions/claim-qr`, {
          ...this.httpConfig,
          headers: {
            ...this.httpConfig.headers,
            Authorization: `Bearer ${authToken}`,
          },
          params: {
            qr_hash: qrHash,
          },
        })
        .pipe(
          catchError((error) => {
            console.error(error);
            throw 'An error happened!';
          }),
        ),
    );
    return data;
  }

  async getQrCodesByEventId(
    poapEventId: number,
    authToken: string,
    secretCode: string,
  ) {
    const { data } = await firstValueFrom(
      this.httpService
        .post<ExternalPOAPListClaimCode[]>(
          `/event/${poapEventId}/qr-codes`,
          {
            secret_code: secretCode,
          },
          {
            ...this.httpConfig,
            headers: {
              ...this.httpConfig.headers,
              Authorization: `Bearer ${authToken}`,
            },
          },
        )
        .pipe(
          catchError((error) => {
            console.error(error);
            throw 'An error happened!';
          }),
        ),
    );
    return data;
  }

  async getEventById(poapEventId: number) {
    const { data } = await firstValueFrom(
      this.httpService
        .get<ExternalPoapEvent>(`/events/id/${poapEventId}`, this.httpConfig)
        .pipe(
          catchError((error) => {
            console.error(error);
            throw 'An error happened!';
          }),
        ),
    );
    return data;
  }

  async events() {
    const { data } = await firstValueFrom(
      this.httpService
        .get<ExternalPoapEvent[]>('/paginated-events', this.httpConfig)
        .pipe(
          catchError((error) => {
            console.error(error);
            throw 'An error happened!';
          }),
        ),
    );

    return data;
  }

  async generateAuthToken(): Promise<string> {
    const { data } = await firstValueFrom(
      this.httpService
        .post<ExternalAuthToken>(
          '',
          {
            audience: this.configService.get<string>('POAP_API_AUDIENCE'),
            client_id: this.configService.get<string>('POAP_API_CLIENT_ID'),
            client_secret: this.configService.get<string>('POAP_API_SECRET'),
            grant_type: 'client_credentials',
          },
          {
            ...this.httpConfig,
            baseURL: this.configService.get<string>('POAP_AUTH_URL'),
          },
        )
        .pipe(
          catchError((error) => {
            console.error(error);
            throw 'An error happened!';
          }),
        ),
    );

    return data.access_token;
  }
}
