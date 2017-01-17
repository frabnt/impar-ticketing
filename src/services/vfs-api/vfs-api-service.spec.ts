import { TestBed } from '@angular/core/testing';

import {
  Headers, BaseRequestOptions,
  Response, HttpModule, Http,
  XHRBackend, RequestMethod,
  ResponseOptionsArgs,
  ResponseOptions
} from '@angular/http';

import { MockBackend, MockConnection } from '@angular/http/testing';
import { VfsApiService } from "./vfs-api-service";
import { MockStorage } from "../../mocks";
import { Storage } from "@ionic/storage";
import { MOCK_MANIFEST } from './mock-data';
import { MOCK_TICKETS } from './mock-data';
import { Manifest } from "../../models/manifest";
import { Tickets } from "../../models/tickets";
import { DecoratorSerDesService } from "../ser-des/decorator-ser-des-service";
/**
 * Created by francesco on 29/11/2016.
 */

describe('Services: Vfs-api-service', () => {

  let mockBackend: MockBackend;
  let vfsApiService: VfsApiService;
  let reqUrl: string;
  let reqMethod: RequestMethod;

  function setErrorResponse(mockBackend: MockBackend, errMsg: string) {
    mockBackend.connections.subscribe(
      (connection: MockConnection) => {
        connection.mockError(new Error(errMsg));
      });
  }

  function setSuccessResponse(backend: MockBackend, respOptions: ResponseOptionsArgs = {}) {
    backend.connections.subscribe(
      (connection: MockConnection) => {
        reqUrl = connection.request.url;
        reqMethod = connection.request.method;

        connection.mockRespond(new Response(
          new ResponseOptions(
            respOptions
          )));
      });
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        VfsApiService,
        DecoratorSerDesService,
        { provide: Storage, useClass: MockStorage },
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          deps: [ MockBackend, BaseRequestOptions ],
          useFactory:
            (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
              return new Http(backend, defaultOptions);
            }
        }
      ],
      imports: [
        HttpModule
      ]
    });
    mockBackend = TestBed.get(MockBackend);
    vfsApiService = TestBed.get(VfsApiService);
  });

  it('should store credentials', done => {
    vfsApiService
      .storeCredentials('myApiToken', 'myEventID')
      .then(results => {
        expect(results[0]).toEqual({
          key: 'apiToken',
          value: 'myApiToken'
        });
        expect(results[1]).toEqual({
          key: 'eventID',
          value: 'myEventID'
        });

        done();
      });
  });

  describe('should return stored credentials', () => {
    beforeEach(() => {
      spyOn(MockStorage.prototype, 'get').and.callThrough();
    });

    it('should need to retrieve credentials from the storage', done => {
      vfsApiService.getCredentials()
        .then(results => {
          expect(MockStorage.prototype.get).toHaveBeenCalledTimes(2);
          expect(MockStorage.prototype.get).toHaveBeenCalledWith('apiToken');
          expect(MockStorage.prototype.get).toHaveBeenCalledWith('eventID');

          expect(results[0]).toBe('api-token');
          expect(results[1]).toBe('event-id');

          done();
        });
    });

    it('should not need to retrieve credentials from the storage', done => {
      vfsApiService.storeCredentials('api-tok', 'ev-id')
        .then(() => {
          return vfsApiService.getCredentials();
        })
        .then(results => {
          expect(MockStorage.prototype.get).not.toHaveBeenCalled();
          expect(results[0]).toBe('api-tok');
          expect(results[1]).toBe('ev-id');

          done();
        });
    });
  });

  it('should reset credentials', done => {
    spyOn(MockStorage.prototype, 'remove').and.callThrough();

    vfsApiService.resetCredentials()
      .then(results => {
        expect(MockStorage.prototype.remove).toHaveBeenCalledTimes(2);
        expect(MockStorage.prototype.remove).toHaveBeenCalledWith('apiToken');
        expect(MockStorage.prototype.remove).toHaveBeenCalledWith('eventID');

        expect(results[0]).toEqual({key: 'apiToken'});
        expect(results[1]).toEqual({key: 'eventID'});

        done();
      });
  });

  describe('should perform login', () => {
    it('should do login and return stored key-value pairs', done => {
      setSuccessResponse(
        mockBackend,
        {
          headers: new Headers({
            'X-VENDINI-API-TOKEN': 'my-token',
            'X-VENDINI-EVENT-ID': 'my-event-id'
          })
        }
      );

      expect(vfsApiService).toBeTruthy();

      vfsApiService.doLogin('testAC')
        .then(results => {
          expect(reqUrl).toBe('https://vfs.staging.vendini.com/api/v1/auth/registration');
          expect(reqMethod).toBe(RequestMethod.Post);

          expect( results[0].value ).toEqual('my-token');
          expect( results[0].key ).toEqual('apiToken');
          expect( results[1].value ).toEqual('my-event-id');
          expect( results[1].key ).toEqual('eventID');

          done();
        });
    });

    it('should return an error message if login fails', done => {
      setErrorResponse(mockBackend, 'error during login');

      vfsApiService.doLogin('testAC')
        .catch(err => {
          expect(err).toBe('error during login');
          done();
        });
    });
  });

  describe('should perform logout', () => {
    it('should do logout and return removed keys', done => {
      setSuccessResponse(mockBackend);

      vfsApiService.doLogout()
        .then(results => {
          expect(reqUrl).toBe('https://vfs.staging.vendini.com/api/v1/auth/registration');
          expect(reqMethod).toBe(RequestMethod.Delete);

          expect(results[0]).toEqual({
            key: 'apiToken'
          });
          expect(results[1]).toEqual({
            key: 'eventID'
          });

          done();
        });
    });

    it('should return an error message if logout fails', done => {
      setErrorResponse(mockBackend, 'error during logout');

      vfsApiService.doLogout()
        .catch(err => {
          expect(err).toBe('error during logout');
          done();
        });
    });
  });

  describe('should retrieve manifest', () => {
    it('should retrieve manifest and return deserialized object', done => {
      setSuccessResponse(
        mockBackend,
        { body: MOCK_MANIFEST }
      );

      vfsApiService.getManifest()
        .then(result => {
          expect(reqUrl).toBe('https://vfs.staging.vendini.com/api/v1/scanning/sync');
          expect(reqMethod).toBe(RequestMethod.Get);

          expect(result).toBeTruthy();
          expect(result instanceof Manifest).toBeTruthy();
          expect(result).toEqual(
            TestBed.get(DecoratorSerDesService).deserialize(MOCK_MANIFEST, Manifest)
          );

          done();
        });
    });

    it('should return an error message if the request for manifest fails', done => {
      setErrorResponse(mockBackend, 'error retrieving manifest');

      vfsApiService.getManifest()
        .then(() => {
          console.log("no error");
          done();
        })
        .catch(err => {
          expect(err).toBe('error retrieving manifest');
          done();
        });
    });
  });

  describe('should retrieve tickets', () => {
    it('should retrieve tickets and return deserialized object', done => {
      setSuccessResponse(
        mockBackend,
        { body: MOCK_TICKETS }
      );

      vfsApiService.getTickets(1)
        .then(result => {
          expect(reqUrl).toBe('https://vfs.staging.vendini.com/api/v1/scanning/tickets?items=25000&page=1');
          expect(reqMethod).toBe(RequestMethod.Get);

          expect(result).not.toBeNull();
          expect(result instanceof Tickets).toBeTruthy();
          expect(result).toEqual(
            TestBed.get(DecoratorSerDesService).deserialize(MOCK_TICKETS, Tickets)
          );

          done();
        });
    });

    it('should show an error message if the request for tickets fails', done => {
      setErrorResponse(mockBackend, 'error retrieving tickets');

      vfsApiService.getTickets(1)
        .catch(err => {
          expect(err).toBe('error retrieving tickets');
          done();
        });
    });
  });

  describe('should retrieve paginated tickets', () => {
    it('should retrieve paginated tickets and return deserialized object', done => {
      let page = 1;

      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          expect(connection.request.method).toBe(RequestMethod.Get);
          expect(connection.request.url).toEqual(
            `https://vfs.staging.vendini.com/api/v1/scanning/tickets?items=25000&page=${page}`
          );
          page++;

          connection.mockRespond(new Response(
            new ResponseOptions({
                body: MOCK_TICKETS
              }
            )));
        });

      vfsApiService.getAllTickets()
        .then(result => {
          expect(result).not.toBeNull();
          expect(result instanceof Tickets).toBeTruthy();

          expect(result.orders.length).toEqual(8);
          expect(result.ordersTransactions.length).toEqual(8);

          done();
        });
    });

    it('should show an error message if the request for paginated tickets fails', done => {
      setErrorResponse(mockBackend, 'error retrieving tickets');

      vfsApiService.getAllTickets()
        .catch(err => {
          expect(err).toBe('error retrieving tickets');
          done();
        });
    });
  });

});
