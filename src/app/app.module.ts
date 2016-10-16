import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { ReportPage } from '../pages/report/report';
import { HomeTabs } from '../pages/home-tabs/tabs';
import { LoginPage } from "../pages/login/login";
import { ModifyAccessCodePage } from "../pages/modify-access-code/modify-access-code";
import { LogoComponent } from "../pages/logo-component/logo-component";
import { ScanPage } from "../pages/scan/scan";
import { LogoutComponent } from "../pages/logout-component/logout-component";
import {ScanResultPage} from "../pages/scan-result-tabs/scan-result-tabs";

@NgModule({
  declarations: [
    MyApp,
    ReportPage,
    HomeTabs,
    LoginPage,
    ModifyAccessCodePage,
    ScanPage,
    ScanResultPage,
    LogoComponent,
    LogoutComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ReportPage,
    HomeTabs,
    LoginPage,
    ScanPage,
    ScanResultPage,
    ModifyAccessCodePage,
    LogoutComponent
  ],
  providers: []
})
export class AppModule {}
