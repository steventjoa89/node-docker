4:18:13

docker run -v %cd%\:/app:ro -v /app/node_modules -p 3000:4000 -d --env-file ./.env --name node-app node-app-image

docker build -t node-app-image .

docker rm node-app -fv

docker-compose up -d
docker-compose up -d --build

ONLY START SPECIFIC SERVICE:
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --no-deps node-app

DEVELOPMENT MODE:
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build => to rebuild
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build -V => to rebuild and replace the volume (including node modules)

PROD MODE:
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build --no-deps node-app => rebuild only node-app
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build --no-deps --force-recreate node-app => rebuild only node-app and forcing rebuild even with no changes


SCALE-UP:
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --scale node-app=2

docker-compose down
docker-compose down -v   # remove all volumes


docker exec -it node-docker_mongo_1 mongosh -u "root" -p "admin"

docker inspect <container-name>
docker logs <container-name>

docker network inspect node-docker_default


PUSH TO DOCKER-HUB:
- LOGIN DOCKER CLI:
docker login

- RENAME IMAGE SO IT CAN BE PUSHED
docker image tag node-docker_node-app steventjoa/node-app

- push to docker hub
docker push steventjoa/node-app

BUILDING IMAGE FOR PROD (TO PUSH INTO HUB):
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build node-app => only build node-app service

PUSH BUILD PROD IMAGE INTO DOCKER HUB:
docker-compose -f docker-compose.yml -f docker-compose.prod.yml push
docker-compose -f docker-compose.yml -f docker-compose.prod.yml push node-app => only push node-app service

PULL IMAGE FROM HUB:
docker-compose -f docker-compose.yml -f docker-compose.prod.yml pull



To set an images to prod mode: => also can be used with <app-name-boleh-ada-boleh-engga>
1. build the image => docker-compose -f docker-compose.yml -f docker-compose.prod.yml build <app-name-boleh-ada-boleh-engga>
2. push to docker hub => docker-compose -f docker-compose.yml -f docker-compose.prod.yml push <app-name-boleh-ada-boleh-engga>
3. pull image from hub from server => docker-compose -f docker-compose.yml -f docker-compose.prod.yml pull <app-name-boleh-ada-boleh-engga>
4. make it run => docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d <app-name-boleh-ada-boleh-engga>


==> WATCHTOWER (AUTOMATE DEPLOY BY PULLING PERIODEICALLY)
docker run -d --name watchtower -e WATCHTOWER_TRACE=true -e WATCHTOWER_DEBUG=true -e WATCHTOWER_POLL_INTERVAL=50 -v /var/run/docker.sock:/var/run/docker.sock containrrr/watchtower node-docker_node-app_1