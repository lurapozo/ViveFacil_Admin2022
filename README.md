# ViveFacilAdmin2022

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.0.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Deploy (a `ViveFacilBack/static/`)

Este panel se sirve como archivos estáticos planos de Django, en
`/static/` (`baseHref` en `angular.json` y `redirect(to="/static/index.html")`
en `api/views.py`). No hay pipeline automático: se buildea acá y se copia a
mano al backend.

```bash
ng build --configuration production
cp -r dist/* ../ViveFacilBack/static/
```

`outputHashing` está en `"none"` a propósito — los nombres de archivo
(`main.js`, `styles.css`, etc.) quedan fijos entre builds, así el `cp`
sobreescribe el build anterior en vez de ir acumulando versiones viejas con
hash distinto. Si algún día se cambia a `"all"` para cache-busting, hay que
borrar `static/*` (menos `admin/` y `css/`, que son del backend) antes de
copiar, o los archivos viejos se quedan huérfanos.

Después, desde `ViveFacilBack`:

```bash
git add static/
git commit -m "..."
git push
```

y en el servidor, `git pull` + reload de la web app en PythonAnywhere.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
