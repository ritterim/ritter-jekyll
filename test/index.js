import test from 'ava';
import 'babel-core/register';

import ritterJekyll from '../src/lib/';

test('ritterJekyll', (t) => {
  t.is(ritterJekyll(), true);
});
