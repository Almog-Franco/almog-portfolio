import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { startAnalytics } from './app/analytics';
import { appConfig } from './app/app.config';

bootstrapApplication(App, appConfig)
  .then(() => startAnalytics())
  .catch((err) => console.error(err));
