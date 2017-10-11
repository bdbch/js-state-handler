class StateHandler {
  constructor (initialState = false, initialFn = false) {
    this.data = Object.assign({}, initialState)
    this.initialState = initialState
    this.functions = []

    if (initialFn) {
      this.addToRenderer(initialFn)
    }
  }

  set (newState) {
    const changedKeys = Object.keys(newState)
    const fnsToRun = this.functions
      .filter(
        fnObj =>
          fnObj.keys.filter(key => changedKeys.indexOf(key) > -1).length !== 0
      )
      .map(fnObj => fnObj.method)

    Object.assign(this.data, newState)
    this.render(fnsToRun)
  }

  reset () {
    Object.assign(this.data, this.initialState)
    this.render(this.functions)
  }

  render (fns = false) {
    const fnsToRun = fns || this.functions.map(fnObj => fnObj.method)
    for (const fn of fnsToRun) {
      fn()
    }
  }

  addToRenderer (fn = false) {
    if (!fn && typeof fn !== 'function' && typeof fn !== 'object') {
      console.error(
        'Please provide a function or an array of functions to add them to the renderer'
      )
      return false
    }

    if (typeof fn === 'object') {
      for (const renderFunction of fn) {
        if (typeof renderFunction.method !== 'function') {
          console.error('The provided data is not a function.')
          return false
        }

        if (renderFunction.keys === '*') {
          renderFunction.keys = Object.keys(this.data)
        }

        this.functions.push(renderFunction)
      }
    } else {
      if (fn.keys === '*') {
        fn.keys = Object.keys(this.data)
      }
      this.functions.push(fn)
    }
  }
  
  pushNewState (currentState, object) {
    currentState = [...currentState, object]
  }

}

module.exports = StateHandler
