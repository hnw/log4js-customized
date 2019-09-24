import test from 'ava';
import Log4js from '../log4js-customized';

test('error()', t => {
  Log4js.setDefaults({}).getLogger().error('bar')
  t.pass();
});

test('warn()', t => {
  Log4js.setDefaults({}).getLogger().warn('foo')
  t.pass();
});

test('info()', t => {
  Log4js.setDefaults({}).getLogger().info('baz')
  t.pass();
});
