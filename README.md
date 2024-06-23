# Generador de Spreadsheets de Sprites

Este proyecto es un generador de spreadsheets a partir de imágenes de sprites. A continuación se detallan los pasos para configurar y ejecutar el proyecto.

## Configuración del Proyecto

### 1. Crear las Carpetas Necesarias

1. **Carpeta `sprites`**: Aquí se almacenarán las carpetas de los sprites. Dentro de `sprites`, cada sprite debe tener su propia carpeta. Cada carpeta de sprite debe contener las imágenes en formato PNG y SVG. Por ejemplo:

    ```
    sprites/
    ├── DefineSprite_203_left_walk/
    │   ├── 1.png
    │   ├── 1.svg
    │   ├── 2.png
    │   ├── 2.svg
    │   ├── 3.png
    │   ├── 3.svg
    │   └── 4.png
    ```

2. **Carpeta `output`**: Aquí se almacenarán los spreadsheets generados. La estructura de salida se verá similar a esto:

    ```
    output/
    ├── DefineSprite_203_left_walk/
    │   └── DefineSprite_203_left_walk.png
    ```

### 2. Instalar Dependencias

Asegúrate de tener Node.js y npm instalados. Luego, instala las dependencias necesarias ejecutando el siguiente comando en el directorio raíz del proyecto:

```sh
npm install
