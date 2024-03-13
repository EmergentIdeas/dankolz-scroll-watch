# Scroll Watch

Watches elements and calls some code when they come into view

## Instal

```bash
npm i @dankolz/scroll-watch
```

## Usage

```js
const ScrollWatch = require('@dankolz/scroll-watch')
let sw = new ScrollWatch('.project-box', {
	visibleBy: 300
})
sw.start()
```

By default, the handler code will add the class `visible` to the element.