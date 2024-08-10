# Aplicación de Reconocimiento de Imágenes

Esta aplicación demuestra el uso de un modelo de aprendizaje profundo (MobileNetV3) para el reconocimiento de imágenes. Utiliza un backend en Flask y un frontend en React.

## Características

- Carga de imágenes desde el frontend
- Procesamiento de imágenes utilizando MobileNetV3
- Visualización de las predicciones top-3 para la imagen cargada

## Requisitos

- Python 3.8+
- Node.js 14+
- npm 6+

## Configuración

### Backend

1. Crea un entorno virtual:
   ```
   python -m venv venv
   source venv/bin/activate  # En Windows: venv\Scripts\activate
   ```

2. Instala las dependencias:
   ```
   pip install flask flask-cors tensorflow pillow numpy
   ```

3. Ejecuta el servidor Flask:
   ```
   python app.py
   ```

### Frontend

1. Navega al directorio del frontend:
   ```
   cd frontend
   ```

2. Instala las dependencias:
   ```
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```
   npm run dev
   ```

## Uso

1. Abre tu navegador y ve a `http://localhost:5173`
2. Selecciona una imagen para cargar
3. Haz clic en "Analizar Imagen"
4. Observa las predicciones generadas por el modelo

## Notas

- Este proyecto es una demostración y no está optimizado para producción.
- Asegúrate de manejar adecuadamente la seguridad y la escalabilidad en un entorno de producción.

## Licencia

Este proyecto está bajo la Licencia MIT.

## Autor

Este proyecto fue desarrollado por Cristian Aracena.