#!/bin/sh
APP="orange-game"

heroku config:add BUILDPACK_URL=https://github.com/appstack/heroku-buildpack-nodejs-gulp.git --app $APP;
heroku config:set NODE_ENV=production --app $APP;
