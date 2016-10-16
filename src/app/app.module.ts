import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { ReportPage } from '../pages/report/report';
import { TabsPage } from '../pages/tabs/tabs';
import {LoginPage} from "../pages/login/login";
import {ModifyAccessCodePage} from "../pages/modify-access-code/modify-access-code";
import {LogoComponent} from "../pages/logo-component/logo-component";

@NgModule({
  declarations: [
    MyApp,
    ReportPage,
    TabsPage,
    LoginPage,
    ModifyAccessCodePage,
    LogoComponent
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
    ModifyAccessCodePage
  ],
  providers: []
})
export class AppModule {}
