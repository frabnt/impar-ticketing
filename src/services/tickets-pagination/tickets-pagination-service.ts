import { Injectable } from "@angular/core";
import { Tickets } from "../../models/tickets";
import { VfsApiService } from "../vfs-api/vfs-api-service";
import { DBMappingService } from "../db-mapping/db-mapping-service";
import { SpinnerService } from "../utils/spinner-service";
/**
 * Created by francesco on 19/01/2017.
 */

@Injectable()
export class TicketsPaginationService {
  // Keep track of last page from pagination info
  private lastPage: number;

  constructor(private vfsApiService: VfsApiService,
              private spinnerService: SpinnerService,
              private mappingService: DBMappingService) { }

  /**
   * Retrieve all tickets pages
   * @returns {Promise<any>}
   */
  getAllTickets(): Promise<any> {
    this.spinnerService.setContent('Retrieving and deserializing tickets (Page 1)');

    // Get first tickets page
    return this.vfsApiService.getTickets(1)
      .then((firstTicketsPage: Tickets) => {
        // Set last page
        this.lastPage = firstTicketsPage.pagination.lastPage;
        this.spinnerService.setContent('Mapping tickets (Page 1)');

        // Map first tickets page
        return this.mappingService.mapTicketsData(firstTicketsPage);
      })
      .then(() => {
        // Manage pagination: retrieving and mapping remaining tickets pages
        return this.manageTicketsPagination();
      });
  }

  /**
   * Retrieve remaining tickets pages
   * @returns {Promise<any>}
   */
  private manageTicketsPagination(): Promise<any> {
    let currentPage = 1;

    return new Promise<any>((resolve: Function, reject: Function) => {
      let processNextPage = () => {
        // Check if last page has already been retrieved
        if(currentPage < this.lastPage) {
          // Update the next page to retrieve
          currentPage++;
          this.spinnerService.setContent(`Retrieving and deserializing tickets (Page ${currentPage})`);

          // Get and map the next page
          this.vfsApiService.getTickets(currentPage)
            .then((tickets: Tickets) => {
              // Update last page from pagination info of current page
              this.lastPage = tickets.pagination.lastPage;
              this.spinnerService.setContent(`Mapping tickets (Page ${currentPage})`);

              return this.mappingService.mapTicketsData(tickets);
            })
            .then(() => {
              processNextPage();
            })
            .catch(err => {
              reject(err);
            });
        } else {
          resolve();
        }
      };
      processNextPage();
    });

  }
}
