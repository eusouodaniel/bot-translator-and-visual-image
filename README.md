
# bot-translator-and-visual-image

# How to run

## With docker

- docker image build -t bot:1.0 .
- docker container run -p 3333:3333 --detach --name bot bot:1.0
- Configure the archive .env
- To access the container: docker exec -it <container_name> sh
- The container name is something like: bot

## Without docker

- yarn || npm i
- yarn dev || npm start
