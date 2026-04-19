import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(), // captura erros globais do browser
    provideRouter(routes),                // regista as rotas da aplicação
    provideHttpClient()                   // permite usar HttpClient nos services
  ]
};