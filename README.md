# djs-breakpoints

JavaScript library to manage responsive breakpoints events.

This object manages create responsive breakpoints events based on window resizing events.

It accepts a list of breakpoints to be detected and triggers callbacks when a breakpoint is passed through (regarding the direction).
 
## Installation

```
bower install djs-breakpoints
```

## Dependencies

This package requires [jQuery](http://jquery.com/), [djs-ui-tools](https://github.com/EdouardDem/djs-ui-tools) and [djs-resize](https://github.com/EdouardDem/djs-resize)

If you install it with Bower, the dependencies will be included.

## Usage

In these examples, we assume we deal with 4 breakpoints. If you need to, you can deal with more or less breakpoints.

### Basic usage

First of all, the object needs to be initialized.
It must be initialized after `djs.resize`.

```javascript
// Init the resize (always first)
djs.resize.init();

// Init the breakpoints
djs.breakpoints.init({
    xs: 0,
    sm: 600,
    md: 980,
    lg: 1240
});

// Add a callback (when changing from small to medium)
djs.breakpoints.add('md', 'up', function () {
    // Code ...
});
```

If you want to destroy this object, call `destroy`.

```javascript
djs.breakpoints.destroy();
```

### Add and remove callbacks

When a callback is added to a breakpoint, you can remove it. In that case, every callback attached to this point and this sens will be removed.

```javascript
// Add a callback
djs.breakpoints.add('lg', 'up', function () {
    // Code ...
});
// Add another callback
djs.breakpoints.add('lg', 'up', function () {
    // Code ...
});

// Remove both callbacks
djs.breakpoints.remove('lg', 'up');
```

If you want to remove specific callbacks, you may add a namespace when you add it and remove it.

```javascript
// Add a callback
djs.breakpoints.add('lg', 'up', function () {
    // Code ...
}, 'ns-1');
// Add another callback
djs.breakpoints.add('lg', 'up', function () {
    // Code ...
}, 'ns-2');

// Remove the first callback
djs.breakpoints.remove('lg', 'up', 'ns-1');
```

### Aliases

In order to write less code, you can use the aliases `up` and `down`:

- `djs.breakpoints.up('lg', callback)` is equivalent to `djs.breakpoints.add('lg', 'up', callback)`
- `djs.breakpoints.down('lg', callback)` is equivalent to `djs.breakpoints.add('lg', 'down', callback)`

### Testing the state

If you want to know the actual point, use `current`:

```javascript
console.log( djs.breakpoints.current() );
```

To check the actual state against a min or max value, do this:

```javascript
if (djs.breakpoints.max('sm')) {
    // If actual point is 'xs' or 'sm'
}

if (djs.breakpoints.min('md')) {
    // If actual point is 'md' or 'lg'
}
```

If you want to test actual state over one or many breakpoints, use `is`:

```javascript
if (djs.breakpoints.is('xs, lg')) {
    // If actual point is 'xs' or 'lg'
}
```

If you want to get the list of breakpoints form or to another breakpoint, use `from` and `to`:

```javascript
djs.breakpoints.from('md'); // Returns "md, lg"
djs.breakpoints.to('md'); // Returns "xs, sm, md"
```

### Example

This is an example of a full usage.

```javascript
// Init the resize (always first)
djs.resize.init();

// Init the breakpoints
djs.breakpoints.init({
    xs: 0,
    sm: 600,
    md: 980,
    lg: 1240
});

// Add callbacks arround a point
djs.breakpoints
    .up('md', function () {
        // Code ...
    })
    .down('md', function () {
        // Code ...
    });
    
// On init call some functions
if (djs.breakpoints.min('md')) {
    // Code if "md" or more
} else {
    // Code if "xs" or "sm"
}
```

