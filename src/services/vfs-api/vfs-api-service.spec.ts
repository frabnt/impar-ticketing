import {
  TestBed,
  getTestBed,
  async
} from '@angular/core/testing';
import {
  Headers, BaseRequestOptions,
  Response, HttpModule, Http, XHRBackend, RequestMethod
} from '@angular/http';
import { ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { VfsApiService } from "./vfs-api-service";
import { StorageMock } from "../../mocks";
import { Storage } from "@ionic/storage";
import { MOCK_MANIFEST } from '../../mocks';
import { MOCK_TICKETS } from '../../mocks';
import { Manifest } from "../../models/manifest";
import { Tickets } from "../../models/tickets";
import { DecoratorSerDesService } from "../ser-des/decorator-ser-des-service";
/**
 * Created by francesco on 29/11/2016.
 */

describe('Services: Vfs-api-service', () => {

  let mockBackend: MockBackend;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        VfsApiService,
        DecoratorSerDesService,
        { provide: Storage, useClass: StorageMock },
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
    mockBackend = getTestBed().get(MockBackend);
  }));

  it('should store credentials', async(() => {
    getTestBed().get(VfsApiService)
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
        });
  }));

  it('should do login and return stored key-value pairs', done => {
    let vfsApiService: VfsApiService;

    mockBackend.connections.subscribe(
      (connection: MockConnection) => {
        expect(connection.request.method).toBe(RequestMethod.Post);
        expect(connection.request.url).toEqual(
          'https://vfs.staging.vendini.com/api/v1/auth/registration'
        );

        connection.mockRespond(new Response(
          new ResponseOptions({
              headers: new Headers({
                'X-VENDINI-API-TOKEN': 'my-token',
                'X-VENDINI-EVENT-ID': 'my-event-id'
              })
            }
          )));
      });

    vfsApiService = getTestBed().get(VfsApiService);
    expect(vfsApiService).toBeDefined();

    vfsApiService.doLogin('testAC')
      .then(results => {
        expect( results[0].value ).toEqual('my-token');
        expect( results[0].key ).toEqual('apiToken');
        expect( results[1].value ).toEqual('my-event-id');
        expect( results[1].key ).toEqual('eventID');
        done();
      });
  });

  it('should do logout and return removed keys', done => {
    mockBackend.connections.subscribe(
      (connection: MockConnection) => {
        expect(connection.request.method).toBe(RequestMethod.Delete);
        expect(connection.request.url).toEqual(
          'https://vfs.staging.vendini.com/api/v1/auth/registration'
        );

        connection.mockRespond(new Response(
          new ResponseOptions({ })
        ));
      });

    getTestBed().get(VfsApiService).doLogout()
      .then(results => {
        expect(results[0]).toEqual({
          key: 'apiToken'
        });
        expect(results[1]).toEqual({
          key: 'eventID'
        });
        done();
      });
  });

  it('should retrieve manifest and return deserialized object', async(() => {
    mockBackend.connections.subscribe(
      (connection: MockConnection) => {
        expect(connection.request.method).toBe(RequestMethod.Get);
        expect(connection.request.url).toEqual(
          'https://vfs.staging.vendini.com/api/v1/scanning/sync'
        );

        connection.mockRespond(new Response(
          new ResponseOptions({
              body: MOCK_MANIFEST
            }
          )));
      });

    getTestBed().get(VfsApiService).getManifest()
      .then(result => {
        expect(result).not.toBeNull();
        expect(result instanceof Manifest).toBeTruthy();
        expect(result).toEqual(
          getTestBed().get(DecoratorSerDesService).deserialize(MOCK_MANIFEST, Manifest)
        );
      });
  }));

  it('should retrieve tickets and return deserialized object', async(() => {
    mockBackend.connections.subscribe(
      (connection: MockConnection) => {
        expect(connection.request.method).toBe(RequestMethod.Get);
        expect(connection.request.url).toEqual(
          'https://vfs.staging.vendini.com/api/v1/scanning/tickets?items=20000&page=1'
        );

        connection.mockRespond(new Response(
          new ResponseOptions({
              body: MOCK_TICKETS
            }
          )));
      });

    getTestBed().get(VfsApiService).getTickets(1)
      .then(result => {
        expect(result).not.toBeNull();
        expect(result instanceof Tickets).toBeTruthy();
        expect(result).toEqual(
          getTestBed().get(DecoratorSerDesService).deserialize(MOCK_TICKETS, Tickets)
        );
      });
  }));

  it('should retrieve paginated tickets and return deserialized object', async(() => {
    let page = 1;

    mockBackend.connections.subscribe(
      (connection: MockConnection) => {
        expect(connection.request.method).toBe(RequestMethod.Get);
        expect(connection.request.url).toEqual(
          `https://vfs.staging.vendini.com/api/v1/scanning/tickets?items=20000&page=${page}`
        );
        page++;

        connection.mockRespond(new Response(
          new ResponseOptions({
              body: MOCK_TICKETS
            }
          )));
      });

    getTestBed().get(VfsApiService).getAllTickets()
      .then(result => {
        expect(result).not.toBeNull();
        expect(result instanceof Tickets).toBeTruthy();

        expect(result.orders.length).toEqual(4);
        expect(result.ordersTransactions.length).toEqual(4);
      });
  }));

});
