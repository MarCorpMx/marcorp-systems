import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

type LoaderType = 'global' | 'none';

@Injectable({
  providedIn: 'root',
})

export class Api {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) { }


  // ========================
  // GET
  // ========================
  get<T>(
    endpoint: string,
    options?: {
      params?: Record<string, any>;
      headers?: HttpHeaders;
      loader?: LoaderType; // tenia global antes
    }
  ) {
    let httpParams: HttpParams | undefined;

    if (options?.params) {
      httpParams = new HttpParams({ fromObject: options.params });
    }

    return this.http.get<T>(`${this.API_URL}/${endpoint}`, {
      params: httpParams,
      headers: this.buildHeaders(options),
    });
  }

  // ========================
  // POST
  // ========================
  post<T>(
    endpoint: string,
    body: any,
    options?: {
      headers?: HttpHeaders;
      loader?: LoaderType;
    }
  ) {
    return this.http.post<T>(
      `${this.API_URL}/${endpoint}`,
      body,
      {
        headers: this.buildHeaders(options),
      }
    );
  }

  // ========================
  // PUT
  // ========================
  put<T>(
    endpoint: string,
    body: any,
    options?: {
      headers?: HttpHeaders;
      loader?: LoaderType;
    }
  ) {
    return this.http.put<T>(
      `${this.API_URL}/${endpoint}`,
      body,
      {
        headers: this.buildHeaders(options),
      }
    );
  }

  // ========================
  // PATCH
  // ========================
  patch<T>(
    endpoint: string,
    body: any,
    options?: {
      params?: Record<string, any>;
      headers?: HttpHeaders;
      loader?: LoaderType;
    }
  ) {
    let httpParams: HttpParams | undefined;

    if (options?.params) {
      httpParams = new HttpParams({ fromObject: options.params });
    }

    return this.http.patch<T>(
      `${this.API_URL}/${endpoint}`,
      body,
      {
        params: httpParams,
        headers: this.buildHeaders(options),
      }
    );
  }

  // ========================
  // DELETE
  // ========================
  delete<T>(
    endpoint: string,
    options?: {
      headers?: HttpHeaders;
      loader?: LoaderType;
    }
  ) {
    return this.http.delete<T>(
      `${this.API_URL}/${endpoint}`,
      {
        headers: this.buildHeaders(options),
      }
    );
  }


  private buildHeaders(options?: {
    headers?: HttpHeaders;
    loader?: LoaderType;
  }) {
    let headers = options?.headers ?? new HttpHeaders();

    if (options?.loader === 'global') {
      headers = headers.set('x-loader', 'global');
    }

    return headers;
  }
}