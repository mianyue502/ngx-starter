import { ErrorHandler, Injectable, NgModule } from '@angular/core';
import { BrowserModule, Title }               from '@angular/platform-browser';
import { BrowserAnimationsModule }            from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule }       from '@angular/common/http';
import { FlexLayoutModule }                   from '@angular/flex-layout';
import * as Raven                             from 'raven-js';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader }              from '@ngx-translate/http-loader';
import { ServiceWorkerModule }              from '@angular/service-worker';
import { environment }                      from '@mob/env';

import { AppRoutingModule } from '@mob/app/app-routing.module';
import { AppStoreModule }   from '@mob/app/app-store.module';
import { CoreModule }       from '@mob/app/core/core.module';

import { AppComponent } from './app.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

Raven.config('https://dsn@sentry.io', {
  environment: environment.name,
}).install();

@Injectable()
export class RavenErrorHandler extends ErrorHandler {
  handleError(err: any): void {
    Raven.captureException(err.originalError || err);
    if (!environment.production) {
      super.handleError(err);
    }
  }
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports     : [
    BrowserModule.withServerTransition({ appId: 'ks-mobile' }),
    BrowserAnimationsModule,
    FlexLayoutModule,
    HttpClientModule,

    CoreModule,
    AppStoreModule,
    AppRoutingModule,

    TranslateModule.forRoot({ loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] } }),
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
  ],
  providers   : [
    Title,
    {
      provide : ErrorHandler,
      useClass: environment.sentry ? RavenErrorHandler : ErrorHandler,
    },
  ],
  bootstrap   : [AppComponent],
})
export class AppModule {
}
