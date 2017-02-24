import { OpaqueToken } from "@angular/core";
/**
 * Created by francesco on 22/02/2017.
 */

export let APP_CONFIG = new OpaqueToken('app.config');

export interface AppConfig {
  apiBaseUrl: string;
  apiDeviceId: string;
}

export const IMPAR_CONFIG: AppConfig = {
  apiBaseUrl: 'https://vfs.staging.vendini.com/api/v1',
  apiDeviceId: '22229C46-8813-4494-B654-BCCA4C366CB1'
};
