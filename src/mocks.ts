import { ManifestEntity } from "./models/manifest-entity";
import { OrderTransaction } from "./models/order-transaction";
import { Registrant } from "./models/registrant";
import { EventListenerOptions } from "ionic-angular/platform/platform";
import { EventEmitter, ElementRef } from "@angular/core";
import { NavOptions, Content, Header, Navbar } from "ionic-angular";
/**
 * Created by francesco on 13/12/2016.
 */


// IONIC MOCKs:

// Config
export class MockConfig {
  get(): any {
    return '';
  }

  getBoolean(): boolean {
    return true;
  }

  getNumber(): number {
    return 1;
  }
}

declare var document: any;

// Platform
export class MockPlatform {
  ready(): Promise<string> {
    return Promise.resolve('READY');
  }

  public registerBackButtonAction(fn: Function, priority?: number): Function {
    return (() => true);
  }

  public hasFocus(ele: HTMLElement): boolean {
    return true;
  }

  public doc(): HTMLDocument {
    return document;
  }

  public registerListener(ele: any, eventName: string, callback: any,
                          opts: EventListenerOptions, unregisterListenersCollection?: Function[]): Function {
    return ((ev?: UIEvent) => {});
  }

  public win(): Window {
    return window;
  }

  public raf(callback: any): number {
    return 1;
  }
}

// Storage
export class MockStorage {
  static TEST_KEYS: string[] = ['apiToken', 'eventID', 'accessCodes'];

  get(key: string): Promise<any> {
    let res: any;

    switch (key) {
      case MockStorage.TEST_KEYS[0]:
        res = 'api-token';
        break;
      case MockStorage.TEST_KEYS[1]:
        res = 'event-id';
        break;
      case MockStorage.TEST_KEYS[2]:
        res = ['code-1', 'code-2'];
        break;
      default:
        res = ' should not be here';
    }
    return Promise.resolve(res);
  }

  set(key: string, value: any): Promise<any> {
    return Promise.resolve({key, value});
  }

  remove(key: string): Promise<any> {
    return Promise.resolve({key});
  }
}

// NavParams
export class MockNavParams {
  static PARAMS = [
    'manifest', 'ticket',
    'registrant', 'searchSuccessful',
    'dbString', 'codeList'];

  get(param: string): any {
    let res: any;

    switch(param) {
      case MockNavParams.PARAMS[0]:
        res = new ManifestEntity();
        res.activated = '2017-01-01 15:25:36';
        res.credentialTypeId = 'cred-type-id';
        res.deactivated = '2017-01-01 23:25:36';
        res.deactivationReason = 'deactivation reason';
        res.isDeleted = 0;
        res.manifestId = 'manifest-id';
        res.modified = null;
        res.scanCode = 'scan-code';
        res.scanStatus = 'scan-status';
        res.validationType = 'DIRECTIONAL';
        break;
      case MockNavParams.PARAMS[1]:
        res = new OrderTransaction();
        res.activated = '2017-01-01 14:25:36';
        res.barcodeId= '%STGRP5GKZS';
        res.credentialTypeId = 'cred-type-id';
        res.deactivated = '2017-03-01 15:34:57';
        res.deactivationReason = 'deactivation-reason';
        res.deleted = null;
        res.identifier = 'identifier';
        res.lastScanMode = null;
        res.manifestId = 'manifest-id';
        res.modified = null;
        res.oneDay = null;
        res.orderId = 'order-id';
        res.registrantId = 'registrant-1';
        res.scanStatus = 0;
        res.tokensGranted = -1;
        res.tokensUsed = 0;
        res.transactionId = 'transaction-1';
        res.transactionType = 'TICKET';
        res.voided = '2017-02-26 13:25:36';
        break;
      case MockNavParams.PARAMS[2]:
        res = new Registrant();
        res.nameFirst = 'Michele';
        res.nameLast = 'Bartoli';
        res.registrantId = 'registrant-1';
        break;
      case MockNavParams.PARAMS[3]:
        res = true;
        break;
      case MockNavParams.PARAMS[4]:
        res = 'searched-string';
        break;
      case MockNavParams.PARAMS[5]:
        res = ['code-1', 'code-2'];
        break;
      default:
        res = 'should not be here';
    }

    return res;
  }
}

// ViewController
export class MockViewController {
  readReady: EventEmitter<any> = new EventEmitter<any>();
  writeReady: EventEmitter<any> = new EventEmitter<any>();

  dismiss(data?: any, role?: any, navOptions?: NavOptions): Promise<any> {
    return Promise.resolve(data);
  }
  _setIONContent(content: Content): void {}
  _setIONContentRef(elementRef: ElementRef): void {}
  _setHeader(directive: Header): void {}
  _setNavbar(directive: Navbar): void {}
}

// AlertController
export class MockAlertController {
  create(options: any): any {
    return new MockLoading();
  }
}

// LoadingController
export class MockLoadingController {
  create(options = {}): any {
    return new MockLoading();
  }
}

// Loading
export class MockLoading {
  present(): Promise<any> {
    return Promise.resolve();
  }

  setContent(content: string) {
    return content;
  }

  dismiss(): Promise<any> {
    return Promise.resolve();
  }
}

// NavController
export class MockNavController {
  setRoot(options: {}): Promise<any> {
    return Promise.resolve();
  }

  pop(opts?: any, done?: Function): Promise<any> {
    return Promise.resolve();
  }

  push(page: any, params?: any, opts?: any, done?: Function): Promise<any> {
    return Promise.resolve();
  }
}

// PopoverController
export class MockPopoverController {
  create(component: any, data?: {}, opts?: any): MockPopover {
    return new MockPopover();
  }
}

// Popover
export class MockPopover {
  present(navOptions?: any): Promise<any> {
    return Promise.resolve();
  }
}

// ModalController
export class MockModalController {
  create(component: any, data?: any, opts?: any): MockModal {
    return new MockModal();
  }
}

// Modal
export class MockModal {
  present(): Promise<any> {
    return Promise.resolve();
  }

  onDidDismiss(callback: Function) {
    //do-nothing
  }
}
