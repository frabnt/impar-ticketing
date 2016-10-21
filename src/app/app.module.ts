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
import { ScanResultPage } from "../pages/scan-result-tabs/scan-result-tabs";
import { SearchInfoComponent } from "../pages/search-info/search-info";
import { TimeScanResultPage } from "../pages/time-scan-result/time-scan-result";
import { TicketScanResultPage } from "../pages/ticket-scan-result/ticket-scan-result";
import { ManifestScanResultPage } from "../pages/manifest-scan-result/manifest-scan-result";
import { PopoverMenu } from "../pages/popover-menu/popover-menu";
import { PopoverComponent } from "../pages/popover-component/popover-component";
import {RegistrantScanResultPage} from "../pages/registrant-scan-result/registrant-scan-result";

@NgModule({
  declarations: [
    MyApp,
    ReportPage,
    HomeTabs,
    LoginPage,
    ModifyAccessCodePage,
    ScanPage,
    ScanResultPage,
    TimeScanResultPage,
    TicketScanResultPage,
    ManifestScanResultPage,
    RegistrantScanResultPage,
    LogoComponent,
    LogoutComponent,
    SearchInfoComponent,
    PopoverComponent,
    PopoverMenu
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
    TimeScanResultPage,
    TicketScanResultPage,
    ManifestScanResultPage,
    RegistrantScanResultPage,
    LogoutComponent,
    PopoverMenu
  ],
  providers: []
})
export class AppModule {}
