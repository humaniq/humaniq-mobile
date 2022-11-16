import { isConsoleEnabled } from '../references/settings/globals';

let addSentryBreadcrumbFunc = console.log;
if (isConsoleEnabled()) {
  addSentryBreadcrumbFunc = (breadcrumb) => {
    switch (breadcrumb.type) {
      case 'error':
        console.error(breadcrumb.message, breadcrumb);
        break;
      case 'info':
        console.info(breadcrumb.message, breadcrumb);
        break;
      case 'warning':
        console.warn(breadcrumb.message, breadcrumb);
        break;
      case 'debug':
        console.debug(breadcrumb.message, breadcrumb);
        break;
      default:
    }

    console.log(breadcrumb);
  };
}

let captureSentryExceptionFunc = console.error;
if (isConsoleEnabled()) {
  captureSentryExceptionFunc = (exception, captureContext) => {
    console.error(exception, { captureContext });
    return console.error(exception, captureContext);
  };
}

export const addSentryBreadcrumb = addSentryBreadcrumbFunc;
export const captureSentryException = captureSentryExceptionFunc;
