import { ActionContext } from 'vuex'

export const cacheAction = <S extends Record<string, any>, R>(key: string, action: (context: ActionContext<S, R>) => any): any => {
  return (context: ActionContext<S, R>) => {
    if (!(key in context.state)) {
      throw new Error(`Key "${key}" in state doesn't exist.`)
    }

    if (Array.isArray(context.state[key])) {
      if (context.state[key].length) {
        return context.state[key]
      }

      return action(context)
    }

    if (context.state[key] instanceof Object) {
      if (Object.keys(context.state[key]).length) {
        return context.state[key]
      }

      return action(context)
    }

    if (context.state[key]) {
      return context.state[key]
    }

    return action(context)
  }
}