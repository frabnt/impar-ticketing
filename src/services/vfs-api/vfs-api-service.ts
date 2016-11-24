import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Tickets } from "../../models/tickets";
import { Manifest } from "../../models/manifest";
import { Deserialize } from "cerialize";
import { LocalStorageService } from "../local-storage/local-storage-service";
/*
  Generated class for the VfsApiService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

@Injectable()
export class VfsApiService {
  // API URLs and device-ID
  private static readonly API_BASE_URL = 'https://vfs.staging.vendini.com/api/v1';
  private static readonly AUTH_BASE_URL: string = `${VfsApiService.API_BASE_URL}/auth/registration`;
  private static readonly MANIFEST_BASE_URL: string = `${VfsApiService.API_BASE_URL}/scanning/sync`;
  private static TICKETS_BASE_URL: string = `${VfsApiService.API_BASE_URL}/scanning/tickets?`;
  private static readonly DEVICE_ID = '22229C46-8813-4494-B654-BCCA4C366CB1';

  // API credentials
  private apiToken: string;
  private eventID: string;

  /**
   * @constructor
   * @param http
   */
  constructor(private http: Http,
              private localStorageService: LocalStorageService) { }

  /**
   * Store API token and event ID returned by the server after a successful authentication.
   * These credentials are sent in all subsequent http requests from client to server
   * @param apiToken
   * @param eventID
   * @returns {Promise<Promise<string>[]>}
   */
  storeCredentials(apiToken: string, eventID: string): Promise<string[]> {
    this.apiToken = apiToken;
    this.eventID = eventID;

    return Promise.all([
      this.localStorageService.set('apiToken', apiToken),
      this.localStorageService.set('eventID', eventID)
    ]);
  }

  /**
   * Give back api token and event id
   * @returns {Promise<Promise<string>[]>|Promise<string[]>}
   */
  getCredentials(): Promise<string[]> {
    if(this.apiToken && this.eventID)
      return Promise.resolve([this.apiToken, this.eventID]);

    return Promise.all([
      this.localStorageService.get('apiToken'),
      this.localStorageService.get('eventID')
    ]);
  }

  /**
   * Delete api token and event id from the storage
   * @returns {Promise<Promise<void>[]>}
   */
  resetCredentials(): Promise<any> {
    this.apiToken = undefined;
    this.eventID = undefined;

    return Promise.all([
      this.localStorageService.remove('apiToken'),
      this.localStorageService.remove('eventID')
    ]);
  }

  /**
   * Generate headers to perform a http request
   * @param headers
   * @returns {RequestOptions}
   */
  private generateHeaders(headers): RequestOptions {
    return new RequestOptions(
      { headers: new Headers(headers) }
    );
  }

  /**
   * Perform login http (POST) request
   * @param {string} accessCode - the access code of the event
   * @returns {Promise<any>}
   */
  doLogin(accessCode: string): Promise<any> {
    return this.http.post(
      VfsApiService.AUTH_BASE_URL,
      { access_code: accessCode },
      this.generateHeaders(
        {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Accept': 'application/json',
          'Accept-Language': 'en-US, en-us;q=0.8',
          'Vendini-App-Info': 'com.vendini.EntryScan//150606//iPhone Simulator//iPhone OS 8.3',
          'X-VENDINI-DEVICE-ID': VfsApiService.DEVICE_ID
        }
      )
    )
      .toPromise()
      .then((res) => {
        // Store api token and event id in local storage
        return this.storeCredentials(
          res.headers.get("X-VENDINI-API-TOKEN"),
          res.headers.get("X-VENDINI-EVENT-ID")
        );
      }).catch(this.handleError);
  }

  /**
   * Perform logout http (DELETE) request
   * @returns {Promise<any>}
   */
  doLogout(): Promise<any> {
    return this.getCredentials()
      .then(results => {
        return this.http.delete(
          VfsApiService.AUTH_BASE_URL,
          this.generateHeaders(
            {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              'Vendini-App-Info': 'com.vendini.EntryScan//150606//iPhone Simulator//iPhone OS 8.3',
              'X-VENDINI-DEVICE-ID': VfsApiService.DEVICE_ID,
              'X-VENDINI-EVENT-ID': results[1],
              'X-VENDINI-API-TOKEN': results[0]
            }
          )
        ).toPromise()
      })
      .then(() => {
        return this.resetCredentials();
      }).catch(this.handleError);
  }

  /**
   * Perform an http (GET) request to retrieve manifest data
   * @returns {Promise<Manifest>}
   */
  getManifest(): Promise<Manifest> {
    return this.getCredentials()
      .then(results => {
        return this.http.get(
          VfsApiService.MANIFEST_BASE_URL,
          this.generateHeaders(
            {
              'Content-Type': 'application/json',
              'X-VENDINI-DEVICE-ID': VfsApiService.DEVICE_ID,
              'X-VENDINI-API-TOKEN': results[0],
              'X-VENDINI-EVENT-ID': results[1]
            }
          )
        )
          .map( res => Deserialize(res.json(), Manifest) )
          .toPromise();
      }).catch(this.handleError);
  }

  /**
   * Perform an http (GET) request to retrieve tickets data
   * @param {number} page - page to retrieve
   * @param {number} items - number of page items to retrieve
   * @returns {Promise<Tickets>}
   */
  getTickets(page: number, items: number = 20000): Promise<Tickets> {
    return this.getCredentials()
      .then(results => {
        return this.http.get(
          `${VfsApiService.TICKETS_BASE_URL}items=${items}&page=${page}`,
          this.generateHeaders(
            {
              'Content-Type': 'application/json',
              'X-VENDINI-DEVICE-ID': VfsApiService.DEVICE_ID,
              'X-VENDINI-API-TOKEN': results[0],
              'X-VENDINI-EVENT-ID': results[1]
            }
          )
        )
          .map( res => Deserialize(res.json(), Tickets) )
          .toPromise();
      }).catch(this.handleError);
  }

  /**
   * Because of tickets could be divided into multiple pages, perform
   * multiple http request to retrieve all paginated tickets
   * @param items - number of items in each page
   * @returns {Promise<Tickets>}
   */
  getAllTickets(items?: number): Promise<Tickets> {
    let firstPage = this.getTickets(1);

    return Promise.all<Tickets, Tickets[]>([
      firstPage,
      firstPage.then((res) => {
        return Promise.all(
          Array.from(
            Array(res.pagination.lastPage - 1),
            (x,i) => i+2
          ).map(page => {
            return this.getTickets(page, items);
          })
        );
      })
    ])
      .then(results => {
        results[0].pushTickets(results[1]);
        return results[0];
      });
  }

  /**
   * Arrange the error message to return
   * @param error
   * @returns {Promise<never>}
   */
  private handleError(error: any): Promise<string> {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';

    return Promise.reject(errMsg);
  }

}
