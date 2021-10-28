type Object = {
  [key: string]: any
}

const database = (persistence: Object = {}) => ({
  set: (key: string, item: Object): Promise<void> => new Promise(resolve => {
    persistence[key] = {
      ...item
    }
    resolve();
  }),
  get: (key: string): Object => new Promise(resolve => resolve(persistence[key]))
})

export default database;