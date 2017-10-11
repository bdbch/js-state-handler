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
})
