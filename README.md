# simple-node-rate-limiter

Usage of a rate limiter backup with a redis cache

## Prerequisites
Assume that you have a docker image for redis

Commands to run after pulling the repository

`npm install`

`npm build`

`npm start` 



## redis docker image
`docker pull redis`

`docker run -d -p 6379:6379 --name local-redis  redis`


# Load testing
npm install -g artillery
