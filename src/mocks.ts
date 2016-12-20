import { ManifestEntity } from "./models/manifest-entity";
import { OrderTransaction } from "./models/order-transaction";
import { Registrant } from "./models/registrant";
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

// Platform
export class MockPlatform {
  ready(): Promise<any> {
    return Promise.resolve();
  }
  registerBackButtonAction() {}
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
  dismiss(data?: any): Promise<any> {
    return Promise.resolve(data);
  }
  _setHeader() {}
  _setNavbar() {}
  _setIONContent() {}
  _setIONContentRef() {}
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
}
