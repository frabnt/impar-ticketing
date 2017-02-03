/**
 * Created by francesco on 15/12/2016.
 */

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';

// polyfill for pipe not working in non-chrome browsers
import 'intl';
import 'intl/locale-data/jsonp/en';

platformBrowserDynamic().bootstrapModule(AppModule);
