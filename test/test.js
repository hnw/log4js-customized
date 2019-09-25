import test from 'ava';
import Log4js from '../log4js-customized';

test('Quiet mode', t => {
    const logger = Log4js.setDefaults({quiet:1}).getLogger();
    logger.error('[error] quiet');
    logger.warn('[warn] quiet');
    logger.info('[info] quiet');
    logger.debug('[debug] quiet');
    Log4js.shutdown(_=>_);
    t.pass();
});

test('Default mode', t => {
    const logger = Log4js.setDefaults().getLogger();
    logger.error('[error] default');
    logger.warn('[warn] default');
    logger.info('[info] default');
    logger.debug('[debug] default');
    Log4js.shutdown(_=>_);
    t.pass();
});

test('Verbose mode', t => {
    const logger = Log4js.setDefaults({verbose:1}).getLogger();
    logger.error('[error] verbose=1');
    logger.warn('[warn] verbose=1');
    logger.info('[info] verbose=1');
    logger.debug('[debug] verbose=1');
    Log4js.shutdown(_=>_);
    t.pass();
});

test('Very verbose mode', t => {
    const logger = Log4js.setDefaults({verbose:2}).getLogger();
    logger.error('[error] verbose=2');
    logger.warn('[warn] verbose=2');
    logger.info('[info] verbose=2');
    logger.debug('[debug] verbose=2');
    Log4js.shutdown(_=>_);
    t.pass();
});
