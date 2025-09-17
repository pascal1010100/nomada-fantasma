# Imágenes para las Rutas Mágicas

Para que las imágenes de las rutas se muestren correctamente, sigue estos pasos:

1. Coloca las imágenes en esta carpeta (`/public/images/rutas/`)
2. Asegúrate de que los nombres de archivo coincidan con los especificados en `mocks/routes.ts`

## Imágenes requeridas:

- atitlan.jpg
- amazonas.jpg
- grecia.jpg

## Especificaciones técnicas:

- Formato: JPG o WebP
- Tamaño recomendado: 800x600px (relación 4:3)
- Peso máximo: 300KB por imagen
- Nombres en minúsculas, sin espacios ni caracteres especiales

## Cómo agregar una nueva imagen:

1. Guarda la imagen en formato JPG o WebP
2. Redimensiona a 800x600px manteniendo la proporción
3. Optimiza la imagen para web (puedes usar herramientas como TinyPNG)
4. Sube el archivo a esta carpeta
5. Actualiza la referencia en `mocks/routes.ts` con la ruta correcta

## Ejemplo de estructura:

```
/public
  /images
    /rutas
      atitlan.jpg
      amazonas.jpg
      grecia.jpg
```
