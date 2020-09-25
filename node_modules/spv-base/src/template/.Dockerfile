# Validar configuración de .Dockerfile 
# con Devos/Ingeniería 
# & con el CoE de Arquitectura de Supervielle

FROM node:8.10.0-alpine
WORKDIR /usr/src/index

COPY package.json package-lock.json ./
RUN npm i

COPY . ./

ENV PORT 2002

EXPOSE 2002/tcp

CMD ["npm", "start"]
