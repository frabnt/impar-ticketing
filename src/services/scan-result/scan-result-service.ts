import { Injectable } from '@angular/core';
import { OrderTransaction } from "../../models/order-transaction";
import { ManifestEntity } from "../../models/manifest-entity";
import { Registrant } from "../../models/registrant";
/*
  Generated class for the ScanResultService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

@Injectable()
export class ScanResultService {
  private orderTransaction: OrderTransaction;
  private manifest: ManifestEntity;
  private registrant: Registrant;
  private searchSuccessful: boolean = false;

  /**
   * @constructor
   */
  constructor() { }

  /**
   * Set order transaction property
   * @param orderTransaction
   */
  setOrderTransaction(orderTransaction: OrderTransaction) {
    this.orderTransaction = orderTransaction;
  }

  /**
   * Give back order transaction property
   * @returns {OrderTransaction}
   */
  getOrderTransaction(): OrderTransaction {
    return this.orderTransaction;
  }

  /**
   * Set manifest property
   * @param manifest
   */
  setManifest(manifest: ManifestEntity) {
    this.manifest = manifest;
  }

  /**
   * Give back manifest property
   * @returns {ManifestEntity}
   */
  getManifest(): ManifestEntity {
    return this.manifest;
  }

  /**
   * Set registrant property
   * @param registrant
   */
  setRegistrant(registrant: Registrant) {
    this.registrant = registrant;
  }

  /**
   * Give back registrant property
   * @returns {Registrant}
   */
  getRegistrant(): Registrant {
    return this.registrant;
  }

  /**
   * Reset all properties
   */
  resetAll() {
    this.orderTransaction = undefined;
    this.manifest = undefined;
    this.registrant = undefined;
    this.searchSuccessful = false;
  }

  /**
   * Give back search result (successful or not)
   * @returns {boolean}
   */
  isSearchSuccessful(): boolean {
    return this.searchSuccessful;
  }

  /**
   * Set search result (successful or not)
   */
  setSearchSuccessful() {
    this.searchSuccessful = true;
  }
}
