import { NgModule, InjectionToken, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocketClient } from './socket-client';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    SocketClient
  ],
  declarations: []
})
export class SocketClientModule {
  static forRoot(webSocketOptions: any): ModuleWithProviders {
    return {
      ngModule: SocketClientModule,
      providers: [
        {provide: OPTIONS, useValue: webSocketOptions},
        {
          provide: SocketClient,
          useClass: SocketClient,
          deps: [OPTIONS],
          multi: true
        }
      ]
    }
  }
}

export const OPTIONS = new InjectionToken<string>('OPTIONS');
