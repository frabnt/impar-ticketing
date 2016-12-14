/**
 * Created by francesco on 13/12/2016.
 */

// IONIC MOCKs:

export class ConfigMock {

  public get(): any {
    return '';
  }

  public getBoolean(): boolean {
    return true;
  }

  public getNumber(): number {
    return 1;
  }
}

export class FormMock {
  public register(): any {
    return true;
  }
}

export class NavMock {

  public pop(): any {
    return new Promise(function(resolve: Function): void {
      resolve();
    });
  }

  public push(): any {
    return new Promise(function(resolve: Function): void {
      resolve();
    });
  }

  public getActive(): any {
    return {
      'instance': {
        'model': 'something',
      },
    };
  }

  public setRoot(): any {
    return true;
  }
}

export class PlatformMock {
  public ready(): any {
    return new Promise((resolve: Function) => {
      resolve();
    });
  }
}

export class MenuMock {
  public close(): any {
    return new Promise((resolve: Function) => {
      resolve();
    });
  }
}

export class StorageMock {
  public static TEST_KEYS: string[] = ['key0', 'key1', 'key2'];

  public get(key: string): Promise<any> {
    let res: string;

    for(let index in StorageMock.TEST_KEYS) {
      if(key === StorageMock.TEST_KEYS[index])
        res = 'val' + index;
    }
    return Promise.resolve(res);
  }

  public set(key: string, value: any): Promise<any> {
    return Promise.resolve({key, value});
  }

  public remove(key: string) {
    return Promise.resolve({key});
  }
}
