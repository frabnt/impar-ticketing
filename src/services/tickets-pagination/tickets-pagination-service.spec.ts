import { TicketsPaginationService } from "./tickets-pagination-service";
import { TestBed } from "@angular/core/testing";
import { VfsApiService } from "../vfs-api/vfs-api-service";
import { MockVfsApiService } from "../vfs-api/mock-vfs-api-service";
import { DBMappingService } from "../db-mapping/db-mapping-service";
import { MockDBMappingService } from "../db-mapping/mock-db-mapping-service";
import { SpinnerService } from "../utils/spinner-service";
import { MockSpinnerService } from "../utils/mock-spinner-service";
import { Tickets } from "../../models/tickets";
import { MOCK_TICKETS } from "../vfs-api/mock-data";
import { Deserialize } from "cerialize";
/**
 * Created by francesco on 19/01/2017.
 */

describe('Services: Tickets-pagination-service', () => {
  let ticketsPagService: TicketsPaginationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TicketsPaginationService,
        { provide: VfsApiService, useClass: MockVfsApiService },
        { provide: DBMappingService, useClass: MockDBMappingService },
        { provide: SpinnerService, useClass: MockSpinnerService },
      ]
    });

    ticketsPagService = TestBed.get(TicketsPaginationService);
  });

  describe('should get all tickets', () => {
    let tickets;

    beforeEach(() => {
      tickets = Deserialize(MOCK_TICKETS, Tickets);

      spyOn(MockVfsApiService.prototype, 'getTickets').and.callThrough();
      spyOn(MockSpinnerService.prototype, 'setContent').and.callThrough();
      spyOn(MockDBMappingService.prototype, 'mapTicketsData').and.callThrough();
      spyOn(ticketsPagService, 'manageTicketsPagination').and.callThrough();
    });

    beforeEach(done => {
      ticketsPagService.getAllTickets()
        .then(() => done());
    });

    it('should get first tickets page', () => {
      expect(MockVfsApiService.prototype.getTickets).toHaveBeenCalledWith(1);
    });

    it('should set spinner content', () => {
      expect(MockSpinnerService.prototype.setContent).toHaveBeenCalledWith('Retrieving and deserializing tickets (Page 1)');
      expect(MockSpinnerService.prototype.setContent).toHaveBeenCalledWith('Mapping tickets (Page 1)');
    });

    it('should delegate first tickets page mapping to db-mapping service', () => {
      expect(MockDBMappingService.prototype.mapTicketsData).toHaveBeenCalledWith(tickets);
    });

    describe('should manage tickets pagination', () => {
      it('should retrieve remaining tickets pages', () => {
        expect(MockVfsApiService.prototype.getTickets).toHaveBeenCalledTimes(4);

        expect(MockVfsApiService.prototype.getTickets).toHaveBeenCalledWith(2);
        expect(MockVfsApiService.prototype.getTickets).toHaveBeenCalledWith(3);
        expect(MockVfsApiService.prototype.getTickets).toHaveBeenCalledWith(4);
      });

      it('should map remaining tickets pages', () => {
        expect(MockDBMappingService.prototype.mapTicketsData).toHaveBeenCalledTimes(4);
      });

      it('should update spinner content retrieving each page', () => {
        expect(MockSpinnerService.prototype.setContent).toHaveBeenCalledTimes(8);

        expect(MockSpinnerService.prototype.setContent).toHaveBeenCalledWith('Retrieving and deserializing tickets (Page 2)');
        expect(MockSpinnerService.prototype.setContent).toHaveBeenCalledWith('Mapping tickets (Page 2)');

        expect(MockSpinnerService.prototype.setContent).toHaveBeenCalledWith('Retrieving and deserializing tickets (Page 3)');
        expect(MockSpinnerService.prototype.setContent).toHaveBeenCalledWith('Mapping tickets (Page 3)');

        expect(MockSpinnerService.prototype.setContent).toHaveBeenCalledWith('Retrieving and deserializing tickets (Page 4)');
        expect(MockSpinnerService.prototype.setContent).toHaveBeenCalledWith('Mapping tickets (Page 4)');
      });
    });

  });

});
