# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

---------------------

La aplicación está hecha en React sobre Vite y utiliza Yarn (en lugar de NPM) como package manager.
Utiliza las librerias "react-router-dom", "axios" y la librería de "p5" para el juego.
Para levantar la aplicación, hay que tener node.js e instalar yarn con "npm i yarn"
Se clona la aplicación, se selecciona el directorio de la aplicación y se pone "yarn install", una vez que termina se puede levantar el front-end haciendo "yarn run dev" o "npm run dev".
El repositorio contiene los dos archivos php en backend-piwsd, para utilizarlos se puede cambiar a una ruta absoluta hardcodeada en las requests de login o register, o bien levantarlo en xampp y debería conectarse, ya que el front-end utiliza rutas relativas.
La ruta es "tu-ip-o-localhost/dist", cambiala a gusto.
