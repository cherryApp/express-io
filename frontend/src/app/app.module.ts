import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { SockService } from './service/sockService';
// import { SocketClientModule } from './socket-client/socket-client.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
    // SocketClientModule.forRoot({ url: 'ws://localhost:3001'})
  ],
  providers: [SockService],
  bootstrap: [AppComponent]
})
export class AppModule { }
