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
  private manifestBaseURL: string = 'https://vfs.staging.vendini.com/api/v1/scanning/sync';
  private ticketsBaseUrl: string = `https://vfs.staging.vendini.com/api/v1/scanning/tickets?`;
  private apiToken: string;
  private eventID: string;

  /**
   * @constructor
   * @param http
   */
  constructor(public http: Http) { }

  /**
   * Set API token and event ID returned by the server after a successful authentication.
   * These credentials are sent in all subsequent http requests from client to server
   * @param {string} apiToken - authentication token
   * @param {string} eventID - ID of the event
   */
  setCredentials(apiToken: string, eventID: string): void {
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
   * Generate http headers used to retrieve manifest
   * @returns {Headers}
   */
  private generateManifestHeaders() {
    let headers = new Headers;
    headers.append('Content-Type',
      'application/json');
    headers.append('X-VENDINI-DEVICE-ID',
      '22229C46-8813-4494-B654-BCCA4C366CB1');
    headers.append('X-VENDINI-API-TOKEN', this.apiToken);
    headers.append('X-VENDINI-EVENT-ID', this.eventID);

    return headers;
  }

  /**
   * Generate http headers used to retrieve tickets
   * @returns {Headers}
   */
  private generateTicketsHeaders(): Headers {
    let headers = new Headers;
    headers.append('Content-Type',
      'application/json');
    headers.append('X-VENDINI-DEVICE-ID',
      '22229C46-8813-4494-B654-BCCA4C366CB1');
    headers.append('X-VENDINI-API-TOKEN', this.apiToken);
    headers.append('X-VENDINI-EVENT-ID', this.eventID);

    return headers;
  }

  /**
   * Perform login http (POST) request
   * @param {string} accessCode - the access code of the event
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

  /**
   * Perform an http (GET) request to retrieve manifest data
   * @returns {Promise<Response>}
   */
  getManifest(): Promise<any> {
    let headers = this.generateManifestHeaders();

    return this.http.get(
      this.manifestBaseURL,
      {
        headers: headers
      }
    ).toPromise();
  }

  /**
   * Perform an http (GET) request to retrieve tickets data
   * @param {number} page - page to retrieve
   * @param {number} items - number of page items to retrieve
   * @returns {Promise<Response>}
   */
  getTickets(page: number, items?: number): Promise<any> {
    let url: string = this.ticketsBaseUrl;
    if(items) {
      // url updated if items parameter is provided
      url += `items=${items}&`;
    }
    url += `page=${page}`;

    return this.http.get(url, {
      headers: this.generateTicketsHeaders()
    }).toPromise();
  }

}
