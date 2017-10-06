# JS State Handler

> A simple state handler with rendering functionality

### [Demo](https://bdbch.github.io/js-state-handler/)

# Installation

JS State Handler can be installed via NPM.

```
npm install js-state-handler --save
```

You can also install JS State Handler manually. [Learn more here](https://github.com/bdbch/js-state-handler/wiki/Installation).

# Usage

Creating a basic state is simple. Just import the script in your html or import it into your module and you're ready to go.

```js
var TodoState = new StateHandler({
  items: [],
  isOffline: false
})

var renderItems = function () {
  // handle todo item rendering
}

TodoState.addToRenderer({
  keys: ['items'],
  method: renderItems
})
TodoState.render()

// Now change the state
TodoState.set({
  items: TodoState.data.items.push('Do something')
})
```

For more informations, [check the documentation](https://github.com/bdbch/js-state-handler/wiki/creating-a-simple-state).

## Maintainers

* [bdbch](https://github.com/bdbch)

## Why?

I used a state-like approach in a project which is based on PHP and CustomElements. Instead of changing styles directly I liked a more readable approach to change states.

Since I used it in multiple components, I had to copy it over and over to the point I got annoyed and decided to extract it to it's own package.
