# events_hash

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Environment Variables

To set the delay time between requests to the events server, in milliseconds
```
DELAY=#####
```

> Example:  
  DELAY=10000 # Setting a 10-second delay between requests

On `Heroku`
```
heroku config:set DELAY=#### --app <app name>
```

