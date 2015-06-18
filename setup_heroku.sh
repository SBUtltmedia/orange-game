#!/bin/sh
APP="orange-game"

heroku config:set BUILDPACK_URL=https://github.com/krry/heroku-buildpack-nodejs-gulp-bower.git --app $APP;
heroku config:set NPM_CONFIG_PRODUCTION=false --app $APP;
heroku config:set NODE_ENV=production --app $APP;
