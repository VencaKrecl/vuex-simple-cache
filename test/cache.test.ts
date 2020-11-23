import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import VuexSimpleCache from '../src';

Vue.use(Vuex);
const TEST_ACTION = 'TEST_ACTION';
const TEST_MUTATION = 'TEST_MUTATION';
const TEST_ACTION_CACHE = 'TEST_CACHE';
const TEST_MUTATION_CACHE = 'TEST_CACHE';

describe('test vuex simple cache', () => {
  it('cacheAction', async () => {
    const cache = new VuexSimpleCache();
    const state = {
      string: 'test',
      stringEmpty: '',
      number: 5,
      numberEmpty: 0,
      array: [1],
      arrayEmpty: [],
      object: { 1: 1 },
      objectEmpty: {},
    };

    let res = cache.cacheAction('string', () => {
      expect(true).toBe(false);
    })({ state });
    expect(res).toStrictEqual('test');

    res = cache.cacheAction('stringEmpty', ({ state }) => {
      expect(state.stringEmpty).toBe('');

      return 'test';
    })({ state });
    expect(res).toStrictEqual('test');

    res = cache.cacheAction('number', () => {
      expect(true).toBe(false);
    })({ state });
    expect(res).toStrictEqual(5);

    res = cache.cacheAction('numberEmpty', () => {
      expect(state.numberEmpty).toBe(0);

      return 5;
    })({ state });
    expect(res).toStrictEqual(5);

    res = cache.cacheAction('array', () => {
      expect(true).toBe(false);
    })({ state });
    expect(res).toStrictEqual([1]);

    res = cache.cacheAction('arrayEmpty', () => {
      expect(state.arrayEmpty).toStrictEqual([]);

      return [1];
    })({ state });
    expect(res).toStrictEqual([1]);

    res = cache.cacheAction('object', () => {
      expect(true).toBe(false);
    })({ state });
    expect(res).toStrictEqual({ 1: 1 });

    res = cache.cacheAction('objectEmpty', () => {
      expect(state.objectEmpty).toStrictEqual({});

      return { 1: 1 };
    })({ state });
    expect(res).toStrictEqual({ 1: 1 });
  });

  it('vuex', async () => {
    const cache = new VuexSimpleCache();
    const store = new Store({});

    store.registerModule('test', {
      state: {
        items: [{ name: 'test' }],
        itemsCache: [{ name: 'test' }],
      },
      actions: {
        [TEST_ACTION]: ({ commit }) => {
          // call API
          const data = [{ name: 'default' }];

          commit(TEST_MUTATION, data);

          return data;
        },
        [TEST_ACTION_CACHE]: cache.cacheAction('itemsCache', ({ commit }) => {
          // call API
          const data = [{ name: 'cache' }];

          commit(TEST_MUTATION_CACHE, data);

          return data;
        }),
      },
      mutations: {
        [TEST_MUTATION]: (state, payload) => {
          state.items = payload;
        },
        [TEST_MUTATION_CACHE]: (state, payload) => {
          state.itemsCache = payload;
        },
      },
    });

    let data = await store.dispatch(TEST_ACTION);
    expect(data).toStrictEqual([{ name: 'default' }]);
    data = await store.dispatch(TEST_ACTION_CACHE);
    expect(data).toStrictEqual([{ name: 'test' }]);

    // Assert state
    expect(store.state).toStrictEqual({
      test: {
        items: [{ name: 'default' }],
        itemsCache: [{ name: 'test' }],
      },
    });
  });

  it('expiration', async () => {
    const cache = new VuexSimpleCache();
    const store = new Store({});

    store.registerModule('test', {
      state: {
        items: [{ name: 'cache' }],
      },
      actions: {
        [TEST_ACTION_CACHE]: cache.cacheAction(
          'items',
          () => {
            // call API
            return [{ name: 'test' }];
          },
          2
        ),
      },
    });

    let data = await store.dispatch(TEST_ACTION_CACHE);
    expect(data).toStrictEqual([{ name: 'cache' }]);
    // wait for expiration
    await new Promise(r => setTimeout(r, 2 * 1000));
    data = await store.dispatch(TEST_ACTION_CACHE);
    expect(data).toStrictEqual([{ name: 'test' }]);
  });
});
