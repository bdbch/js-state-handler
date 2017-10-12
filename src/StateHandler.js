const DOMPurify = require('dompurify')

class StateHandler {
  constructor (initialState = false, initialFn = false) {
    this.data = Object.assign({}, this.sanitize(initialState))
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

    Object.assign(this.data, this.sanitize(newState))
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

  /**
   * Takes an object
   * @param  {Object} dirty Object that contanis malicious code
   * @return {Object}       Cleaned up object
   */
  sanitize (dirty) {
    var clean = Object.assign({}, dirty)

    for (let key in clean) {
      /** Checks for the 'sanitize' key on the "second level of the object": */
      if (clean[key]['sanitize']) {
        /** I noticed the set() value takes an Array, so I made a seperate if blok for that to iterate through the Array */
        if (clean[key]['value'] instanceof Array) {
          clean[key]['value'].forEach((element, index, array) => {
            array[index] = DOMPurify.sanitize((element))
          })
        /** This is in the case of an object */
        } else {
          clean[key]['value'] = DOMPurify.sanitize(clean[key]['value'])
        }
      }
    }

    return clean
  }
}

module.exports = StateHandler
