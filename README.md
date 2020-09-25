# Supervielle CLI Tool

Este es el cliente de línea de comandos para la Organización de TI de Banco Supervielle. 

## Quickstart

Descarga y ejecuta el instalador correspondiente a tu plataforma desde la sección de [Descargas](#descargas).

Una vez instalado tendrás acceso a los comandos básicos:

1. CREATE : Crea un proyecto nuevo. Recibe como parámetro el nombre del proyecto.

```
spv create <NAME>

spv create hello-world-microservice
```

2. ADD : Agrega funcionalidad estándar a mi proyecto. 

```
spv add [OPTIONS]

spv add accesspoint --name hello --verbs GET --route hello

```

3. ADD+ : Agrega módulos REST definidos en un contrato que respete el estándar de Swagger
```
spv add+ accesspoints [OPTIONS]

spv add+ accesspoints --swaggerJson /PATH/TO/VALID/JSON/SWAGGER/DEFINITION
```


## Descargas
Podés descargar la última versión del instalador acá:

| **macOS** | **Linux 64 bit** | **Windows 64 bit** |
|-----------|------------------|--------------------|
| [download]() | [download]() | [download]() |


## Extendiendo el CLI-tool mediante plugins

Dale un ojo al [repositorio de plugins]() paa revisar extensiones que mejoren las capacidades de este cliente de CLI.



## Release notes

Referite [here]() para ver las últimas notas de releases.


# Issues, defectos y solicitudes de nueva funcionalidad

Por cualquier problema, defecto o solicitudes de nuevas funcionalidades por favor [abrir un ticket]() al equipo de mantenimiento y desarrollo.
