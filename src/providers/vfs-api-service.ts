import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

/*
  Generated class for the VfsApiService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class VfsApiService {
  private authBaseUrl: string = 'https://vfs.staging.vendini.com/api/v1/auth/registration';
  private apiToken: string;
  private eventID: string;

  /**
   * @constructor
   * @param http
   */
  constructor(public http: Http) { }

  /**
   * Set api credentials used for authentication (login and logout)
   * @param apiToken
   * @param eventID
   */
  setCredentials(apiToken, eventID): void {
    this.apiToken = apiToken;
    this.eventID = eventID;
  }

  /**
   * Generate headers used to perform login http request
   * @returns {Headers}
   */
  private generateLoginHeaders(): Headers {
    let headers = new Headers;
    headers.append('Content-Type',
      'application/x-www-form-urlencoded; charset=UTF-8');
    headers.append('Accept',
      'application/json');
    headers.append('Accept-Language', 'en-US, en-us;q=0.8');
    headers.append('Vendini-App-Info',
      'com.vendini.EntryScan//150606//iPhone Simulator//iPhone OS 8.3');
    headers.append('X-VENDINI-API-PROFILE-KEY',
      '[Vendini secret API key - UUID]');
    headers.append('X-VENDINI-DEVICE-ID',
      '22229C46-8813-4494-B654-BCCA4C366CB1');

    return headers;
  }

  /**
   * Generate headers used to perform logout http request
   * @returns {Headers}
   */
  private generateLogoutHeaders(): Headers {
    let headers = new Headers;
    headers.append('Content-Type',
      'application/x-www-form-urlencoded; charset=UTF-8');
    headers.append('Vendini-App-Info',
      'com.vendini.EntryScan//150606//iPhone Simulator//iPhone OS 8.3');
    headers.append('X-VENDINI-DEVICE-ID',
      '22229C46-8813-4494-B654-BCCA4C366CB1');
    headers.append('X-VENDINI-EVENT-ID', this.eventID);
    headers.append('X-VENDINI-API-TOKEN', this.apiToken);

    return headers;
  }

  /**
   * Perform login http (POST) request
   * @param accessCode
   * @returns {Promise<Response>}
   */
  doLogin(accessCode: string): Promise<any> {
    // Here is generated the request body. The access code
    // is used for user authentication and it's associated
    // with a specific event (e.i., festival)
    let body = {
      access_code: accessCode
    };
    let headers = this.generateLoginHeaders();

    return this.http.post(
      this.authBaseUrl,
      JSON.stringify(body),
      {
        headers: headers
      }
    ).toPromise();
  }

  /**
   * Perform logout http (DELETE) request
   * @returns {Promise<Response>}
   */
  doLogout(): Promise<any> {
    let headers = this.generateLogoutHeaders();

    return this.http.delete(
      this.authBaseUrl,
      {
        headers: headers
      }
    ).toPromise();
  }

}
