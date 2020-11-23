import { ActionContext } from 'vuex';

class VuexSimpleCache {
  private items: Map<string, number>;

  constructor() {
    this.items = new Map();
  }

  public cacheAction = <S extends Record<string, any>, R>(
    key: string,
    action: (context: ActionContext<S, R>) => any,
    expiration: number = 0
  ): any => {
    return (context: ActionContext<S, R>) => {
      if (!(key in context.state)) {
        throw new Error(`Key "${key}" in state doesn't exist.`);
      }

      if (expiration > 0) {
        if (this.items.has(key)) {
          if (Date.now() - expiration > (this.items.get(key) || 0)) {
            this.items.delete(key);

            return action(context);
          }
        } else {
          this.items.set(key, Date.now());
        }
      }

      if (Array.isArray(context.state[key])) {
        if (context.state[key].length) {
          return context.state[key];
        }

        return action(context);
      }

      if (context.state[key] instanceof Object) {
        if (Object.keys(context.state[key]).length) {
          return context.state[key];
        }

        return action(context);
      }

      if (context.state[key]) {
        return context.state[key];
      }

      return action(context);
    };
  };
}

export default VuexSimpleCache;
