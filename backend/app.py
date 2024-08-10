# Importaciones necesarias
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image, UnidentifiedImageError
import numpy as np
import tensorflow as tf

# Inicializar la aplicación Flask
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})  # Habilitar CORS para permitir solicitudes desde el frontend

# Cargar el modelo MobileNetV3
model = tf.keras.applications.MobileNetV3Large(weights='imagenet')

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file:
        try:
            image = Image.open(file.stream).convert('RGB')
            image = image.resize((224, 224))  # MobileNetV3 espera imágenes de 224x224
            image_array = tf.keras.preprocessing.image.img_to_array(image)
            image_array = tf.keras.applications.mobilenet_v3.preprocess_input(image_array)
            image_array = np.expand_dims(image_array, axis=0)
            
            predictions = model.predict(image_array)
            decoded_predictions = tf.keras.applications.mobilenet_v3.decode_predictions(predictions, top=5)[0]
            
            results = [
                {'class': str(class_name), 'probability': float(score)}
                for _, class_name, score in decoded_predictions
            ]
            
            return jsonify({'predictions': results})
        except UnidentifiedImageError:
            return jsonify({'error': 'Unidentified image format'}), 400
        except Exception as e:
            return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)