import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

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
    }
  ) {
    let httpParams: HttpParams | undefined;

    if (options?.params) {
      httpParams = new HttpParams({ fromObject: options.params });
    }

    return this.http.get<T>(`${this.API_URL}/${endpoint}`, {
      params: httpParams,
      headers: options?.headers,
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
    }
  ) {
    return this.http.post<T>(
      `${this.API_URL}/${endpoint}`,
      body,
      {
        headers: options?.headers,
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
    }
  ) {
    return this.http.put<T>(
      `${this.API_URL}/${endpoint}`,
      body,
      {
        headers: options?.headers,
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
        headers: options?.headers,
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
    }
  ) {
    return this.http.delete<T>(
      `${this.API_URL}/${endpoint}`,
      {
        headers: options?.headers,
      }
    );
  }
}