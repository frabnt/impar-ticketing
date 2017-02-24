import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { ReportPage } from '../pages/report/report';
import { HomeTabs } from '../pages/home-tabs/tabs';
import { LoginPage } from "../pages/login/login";
import { ModifyAccessCodePage } from "../pages/manage-access-codes/manage-access-codes";
import { LogoComponent } from "../pages/pages-components/logo-component/logo-component";
import { ScanPage } from "../pages/scan/scan";
import { LogoutComponent } from "../pages/pages-components/logout-component/logout-component";
import { ScanResultPage } from "../pages/scan-result-tabs/scan-result-tabs";
import { SearchInfoComponent } from "../pages/pages-components/search-info-component/search-info-component";
import { TimeScanResultPage } from "../pages/time-scan-result/time-scan-result";
import { TicketScanResultPage } from "../pages/ticket-scan-result/ticket-scan-result";
import { ManifestScanResultPage } from "../pages/manifest-scan-result/manifest-scan-result";
import { PopoverMenu } from "../pages/popover-menu/popover-menu";
import { PopoverComponent } from "../pages/pages-components/popover-component/popover-component";
import { RegistrantScanResultPage } from "../pages/registrant-scan-result/registrant-scan-result";
import { WelcomePage } from "../pages/welcome/welcome";
import { VfsApiService } from "../services/vfs-api/vfs-api-service";
import { SQLite } from "ionic-native";
import { DatabaseService } from "../services/database/database-service";
import { ToggleEllipsis } from "../directives/toggle-ellipsis";
import { SpinnerService } from "../services/utils/spinner-service";
import { ExecTimeService } from "../services/exec-time/exec-time-service";
import { WindowRefService } from "../services/window-ref/window-ref-service";
import { MyDatabaseFactory } from "../services/database/database-factory/my-database-factory";
import { Storage } from "@ionic/storage";
import { DBMappingService } from "../services/db-mapping/db-mapping-service";
import { DecoratorSerDesService } from "../services/ser-des/decorator-ser-des-service";
import { TicketsPaginationService } from "../services/tickets-pagination/tickets-pagination-service";
import { APP_CONFIG, IMPAR_CONFIG } from "./app.config";

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
    WelcomePage,
    LogoComponent,
    LogoutComponent,
    SearchInfoComponent,
    PopoverComponent,
    PopoverMenu,
    ToggleEllipsis
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
    WelcomePage,
    PopoverMenu
  ],
  providers: [
    VfsApiService,
    SQLite,
    DatabaseService,
    SpinnerService,
    ExecTimeService,
    WindowRefService,
    MyDatabaseFactory,
    Storage,
    DBMappingService,
    DecoratorSerDesService,
    TicketsPaginationService,
    // Tell Angular ErrorHandling class that it should
    // be using the IonicErrorHandler class for any errors
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    // app-config
    { provide: APP_CONFIG, useValue: IMPAR_CONFIG }
  ]
})
export class AppModule {}
