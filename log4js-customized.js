'use strict'
const log4js = require('log4js');
const myLog4js = Object.assign({}, log4js);

// private variables
let defaults = {};
let enabled = false;

myLog4js.setDefaults = function(options) {
  /* some custom behavior */
  let appenders = {
    stdout: { type: 'console', layout: { type: 'messagePassThrough' } },
    stderr: { type: 'stderr', layout: { type: 'messagePassThrough' } },
    console_info: { type: 'logLevelFilter', appender: 'stdout', level: 'trace', maxLevel: 'info' },
    console_error: { type: 'logLevelFilter', appender: 'stderr', level: 'warn' },
  };
  let default_appenders = ['console_info', 'console_error'];
  let default_log_level = 'warn';

  if (options['log']) {
    appenders['file'] = {
      type: 'dateFile',
      filename: options['log'],
      layout: { type: 'pattern', pattern: '[%d] [%p] %m' }
    };
    default_appenders = ['file'];
  }
  if (options['verbose'] >= 2) { // -vv以上でdebug出力
    default_log_level = 'debug';
  } else if (options['verbose'] >= 1) { // -vならinfoまで
    default_log_level = 'info';
  } else if (options['quiet']) { // --quietならwarnを出さない
    default_log_level = 'error';
  }
  defaults = {
    appenders: appenders,
    categories: {
      default: {
        appenders: default_appenders,
        level: default_log_level
      }
    }
  };
  return myLog4js;
}

// replace log4js.configure()
const origConfigure = myLog4js.configure;
const configure = function(...args) {
  enabled = true;
  return origConfigure.apply(myLog4js, args);
}
myLog4js.configure = configure;

// replace log4js.shutdown()
const origShutdown = myLog4js.shutdown;
myLog4js.shutdown = function(...args) {
  enabled = false;
  return origShutdown.apply(myLog4js, args);
}

// replace log4js.getLogger()
const origGetLogger = myLog4js.getLogger;
myLog4js.getLogger = function(...args) {
  if (!enabled && !process.env.LOG4JS_CONFIG && defaults['appenders']) {
    configure(defaults);
  }
  return origGetLogger.apply(myLog4js, args);
}

module.exports = myLog4js;
