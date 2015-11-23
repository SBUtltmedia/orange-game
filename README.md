orange-game
=====================

Written in [React](http://facebook.github.io/react/)

### Development usage

```
npm install
npm start
```

Use `gulp tests` to run the tests, and `gulp watch` to repeatedly run the tests.

### Production build

```
webpack -p --config webpack.prod.config.js
```

Then copy the files `index.html`, `main.css`, `favicon.ico`
and the `static` directory to the production server.
