'use strict'
const myLog4js = require('log4js');

// private variables
let defaults = {};
let enabled = false;

// add new method setDefaults()
function setDefaults(options) {
  /* some custom behavior */
  let appenders = {
    console: { type: 'console', layout: { type: 'messagePassThrough' } }
  };
  let default_appenders = ['console'];
  let default_log_level = 'warn';

  if (options['log']) {
    appenders['file'] = { type: 'dateFile', filename: options['log'], layout: { type: 'pattern', pattern: '[%d] [%p] %m' } };
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
    categories: { default: {appenders: default_appenders, level: default_log_level} }
  };
  return myLog4js;
}
myLog4js.setDefaults = setDefaults

// replace log4js.configure()
const origConfigure = myLog4js.configure;
function configure(configurationFileOrObject) {
  enabled = true;
  return origConfigure.apply(myLog4js, [configurationFileOrObject]);
}
myLog4js.configure = configure;

// replace log4js.shutdown()
const origShutdown = myLog4js.shutdown;
function shutdown(cb) {
  enabled = false;
  return origShutdown.apply(myLog4js, [cb]);
}
myLog4js.shutdown = shutdown;

// replace log4js.getLogger()
const origGetLogger = myLog4js.getLogger;
function getLogger(category) {
  if (!enabled && !process.env.LOG4JS_CONFIG && defaults['appenders']) {
    configure(defaults);
  }
  return origGetLogger.apply(myLog4js, [category]);
}
myLog4js.getLogger = getLogger;

module.exports = myLog4js;
