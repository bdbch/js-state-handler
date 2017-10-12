/* eslint-env jest */

const StateHandler = require('./StateHandler')

describe('StateHandler', () => {
  test('instantiates', () => {
    const state = new StateHandler()

    expect(state).toBeDefined()
    expect(state).toBeInstanceOf(StateHandler)
  })

  test('accepts initial state', () => {
    const initialState = {items: ['Foo', 'Bar', 'Baz']}
    const state = new StateHandler(initialState)

    expect(state.data).toEqual(initialState)
    expect(state.initialState).toEqual(initialState)
  })

  test('adds an initial function', () => {
    const state = new StateHandler({}, () => {})

    expect(state.functions).toHaveLength(1)
  })

  test('accepts an array of render functions', () => {
    const mockFns = [
      {
        keys: '*',
        method: () => {}
      },
      {
        keys: ['items'],
        method: () => {}
      }
    ]

    const state = new StateHandler({ items: [] }, mockFns)

    expect(state.functions).toHaveLength(2)
  })

  test('adds functions with `addToRenderer`', () => {
    const state = new StateHandler()

    state.addToRenderer([{
      keys: '*',
      method: () => {}
    }])

    expect(state.functions).toHaveLength(1)
  })

  test('renders functions on `render`', () => {
    const state = new StateHandler()

    const mockMethod = jest.fn()

    state.addToRenderer([{
      keys: '*',
      method: mockMethod
    }])

    state.render()

    expect(mockMethod).toHaveBeenCalled()
  })

  test('sets a new state with `set`', () => {
    const initState = { items: ['Foo', 'Bar'] }
    const addedState = { newItems: ['Baz'] }
    const state = new StateHandler(initState)

    state.set(addedState)

    expect(state.data).toEqual(Object.assign({}, initState, addedState))
  })

  /** Pass malicious object & return clean while instantiates */
  test('sanitizes while instantiates', () => {
    const state = new StateHandler({
      key: 'value',
      apple: 4,
      notMalicious: {
        value: 'Friendly',
        sanitize: true
      },
      onError: {
        value: '<img src=x onerror=alert(1)//>',
        sanitize: true
      },
      math: {
        value: '<math><mi//xlink:href="data:x,<script>alert(4)</script>">',
        sanitize: true
      }
    })

    expect(state).toBeDefined()
    expect(state).toBeInstanceOf(StateHandler)
    expect(state.data).toEqual(Object.assign({
      key: 'value',
      apple: 4,
      notMalicious: {
        value: 'Friendly',
        sanitize: true
      },
      onError: {
        value: '<img src="x">',
        sanitize: true
      },
      math: {
        value: '<math><mi></mi></math>',
        sanitize: true
      }
    }))
  })

  /** Pass object with malicious strings inside of array in the set() */
  test('sanitizes while setting new values', () => {
    const initState = { items: ['Foo', 'Bar'] }
    const addedState = {
      newItems: {
        value: [
          'Friendly',
          '<img src=x onerror=alert(1)//>',
          '<math><mi//xlink:href="data:x,<script>alert(4)</script>">'
        ],
        sanitize: true
      }
    }
    const cleanState = {
      newItems: {
        value: [
          'Friendly',
          '<img src="x">',
          '<math><mi></mi></math>'
        ],
        sanitize: true
      }
    }
    const state = new StateHandler(initState)

    state.set(addedState)
    expect(state.data).toEqual(Object.assign({}, initState, cleanState))
  })
})
