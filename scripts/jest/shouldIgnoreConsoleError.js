'use strict';

module.exports = function shouldIgnoreConsoleError(
  format,
  args,
  {TODO_ignoreHydrationErrors} = {TODO_ignoreHydrationErrors: false}
) {
  if (__DEV__) {
    if (typeof format === 'string') {
      if (
        args[0] != null &&
        ((typeof args[0] === 'object' &&
          typeof args[0].message === 'string' &&
          typeof args[0].stack === 'string') ||
          (typeof args[0] === 'string' &&
            args[0].indexOf('An error occurred in ') === 0))
      ) {
        // This looks like an error with addendum from ReactFiberErrorLogger.
        // They are noisy too so we'll try to ignore them.
        return true;
      }
      if (
        format.indexOf('ReactDOM.render was removed in React 19') !== -1 ||
        format.indexOf('ReactDOM.hydrate was removed in React 19') !== -1 ||
        format.indexOf(
          'ReactDOM.render has not been supported since React 18'
        ) !== -1 ||
        format.indexOf(
          'ReactDOM.hydrate has not been supported since React 18'
        ) !== -1
      ) {
        // We haven't finished migrating our tests to use createRoot.
        return true;
      }
      if (
        TODO_ignoreHydrationErrors &&
        format.indexOf(
          'An error occurred during hydration. The server HTML was replaced with client content'
        ) !== -1
      ) {
        // This also gets logged by onRecoverableError, so we can ignore it.
        return true;
      }
    }
  } else {
    if (
      format != null &&
      typeof format.message === 'string' &&
      typeof format.stack === 'string' &&
      args.length === 0
    ) {
      // In production, ReactFiberErrorLogger logs error objects directly.
      // They are noisy too so we'll try to ignore them.
      return true;
    }
  }
  // Looks legit
  return false;
};
