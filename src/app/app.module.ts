import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { ReportPage } from '../pages/report/report';
import { TabsPage } from '../pages/tabs/tabs';
import {LoginPage} from "../pages/login/login";
import {ModifyAccessCodePage} from "../pages/modify-access-code/modify-access-code";
import {LogoComponent} from "../pages/logo-component/logo-component";
import {ScanPage} from "../pages/scan/scan";
import {LogoutComponent} from "../pages/logout-component/logout-component";

@NgModule({
  declarations: [
    MyApp,
    ReportPage,
    TabsPage,
    LoginPage,
    ModifyAccessCodePage,
    ScanPage,
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
    TabsPage,
    LoginPage,
    ScanPage,
    ModifyAccessCodePage,
    LogoutComponent
  ],
  providers: []
})
export class AppModule {}
