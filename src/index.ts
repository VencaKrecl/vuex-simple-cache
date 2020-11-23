import { ActionContext } from 'vuex';

const expirations = new Map();

export const cacheAction = <S extends Record<string, any>, R>(
  key: string,
  action: (context: ActionContext<S, R>) => any,
  expiration: number = 0
): any => {
  return (context: ActionContext<S, R>) => {
    if (!(key in context.state)) {
      throw new Error(`Key "${key}" in state doesn't exist.`);
    }

    if (expiration > 0) {
      const timestampKey: string = `__timestamp_${key}`;

      if (expirations.has(timestampKey)) {
        if (Date.now() - expiration > expirations.get(timestampKey)) {
          expirations.delete(timestampKey);

          return action(context);
        }
      } else {
        expirations.set(timestampKey, Date.now());
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
