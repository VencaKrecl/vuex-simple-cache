# vuex-simple-cache

[![NPM package version][npm]](https://www.npmjs.com/package/@vencakrecl/vuex-simple-cache)
[![License][license]](https://github.com/VencaKrecl/vuex-simple-cache/blob/master/LICENSE)
[![Last test status][ci]](https://github.com/VencaKrecl/vuex-simple-cache/actions?query=workflow%3ACI)

* simple cache for vuex action

### How to install
```bash
npm install vuex-simple-cache
# OR
yarn add vuex-simple-cache
```

### How to use
```js
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import VuexSimpleCache from 'vuex-simple-cache';

Vue.use(Vuex);

const store = new Store({});

// create for every module
const cache = new VuexSimpleCache()

store.registerModule('test', {
  state: {
    items: [{ name: 'cache' }],
  },
  actions: {
    testAction: cache.cacheAction('items', ({ commit }) => { // cache data for 30 seconds
      // call API
      const data = [{ name: 'cache' }];

      commit('testMutation', data);

      return data;
    }, 30),
  },
  mutation: {
    testMutation: (state, payload) => {
      state.items = payload
    } 
  }
})
```

### API - VuexSimpleCache.cacheAction
* key - name of key from vuex state
* action - standard vuex action
* expiration - time in seconds 

[npm]: https://img.shields.io/npm/v/@vencakrecl/vuex-simple-cache.svg?style=flat-square
[license]: https://img.shields.io/npm/l/@vencakrecl/vuex-simple-cache.svg?style=flat-square
[ci]: https://img.shields.io/github/workflow/status/VencaKrecl/vuex-simple-cache/CI