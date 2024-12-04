# create-fenextjs-app

Un CLI para crear rápidamente proyectos basados en Fenextjs con templates predefinidos.

## Instalación

Asegúrate de tener [Node.js](https://nodejs.org) instalado en tu sistema.

Instala el paquete globalmente:

```bash
npm install -g create-fenextjs-app
```

## Uso

Para inicializar un nuevo proyecto, simplemente ejecuta:

```bash
create-fenextjs-app init projectName
```

Reemplaza "projectName" con el nombre de tu proyecto.

## Ejemplo

```bash
create-fenextjs-app init mi-nuevo-proyecto
```
Esto hará lo siguiente:

- Clonará la plantilla base desde el repositorio oficial de Fenextjs.
- Eliminará el directorio .git del repositorio clonado.
- Inicializará un nuevo repositorio Git en el proyecto.

## Requisitos
- **Git**: Asegúrate de tener Git instalado y configurado en tu sistema.
- **Nodejs**: Requerido para ejecutar el CLI.

## Estructura del proyecto

Una vez creado el proyecto, tendrás una estructura similar a esta:

```
mi-nuevo-proyecto/
├── public/
├── src/
│   ├── components/
│   ├── pages/
├── └── styles/
├── .eslintrc.json
├── .gitignore
├── next.config.js
├── package.json
├── README.md
└── tsconfig.json
```

## Documentation

[https://fenextjs-doc.vercel.app/](https://fenextjs-doc.vercel.app/)

## Storybook

[https://fenextjs-component-storybook.vercel.app/](https://fenextjs-component-storybook.vercel.app/)