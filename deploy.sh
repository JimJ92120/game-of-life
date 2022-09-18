#!/usr/bin/env bash

set -e

npm run build

cd dist

git init .
git checkout -b deploy

git add .
git commit -m 'deploy'
git push -f git@github.com:JimJ92120/game-of-life.git deploy

cd -