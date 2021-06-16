# forensic-storytelling

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Endpoint setup

Please see [here](https://developers.google.com/earth-engine/guides/service_account) for instructions on getting the correct credentials to use the Google Earth Engine API. The `private-key.json` file should then be stored in the same folder as server.js.

The server side files are built on top of 'Earth Engine Demo: Service-Side Authentication in Node.js' demo which can be found (along with further instructions on deploying) [here](https://github.com/google/earthengine-api/tree/master/demos/server-auth-nodejs). 