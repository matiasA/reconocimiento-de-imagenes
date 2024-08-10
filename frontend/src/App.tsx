import React, { useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Prediction {
  class: string;
  probability: number;
}

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [predictionHistory, setPredictionHistory] = useState<Array<{ image: string, predictions: Prediction[] }>>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:5000/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setPredictions(response.data.predictions);
      setPredictionHistory(prev => [...prev, { image: imagePreview!, predictions: response.data.predictions }]);
    } catch (error) {
      console.error('Error al analizar la imagen:', error);
      if (axios.isAxiosError(error)) {
        alert(`Error: ${error.response?.data?.error || 'Hubo un problema al procesar la imagen'}`);
      } else {
        alert('Hubo un error inesperado. Por favor, intenta de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = {
    labels: predictions.map(p => p.class),
    datasets: [
      {
        label: 'Probabilidad',
        data: predictions.map(p => p.probability * 100),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Probabilidades de predicción',
      },
    },
  };

  const ResultsSection = ({ predictions }: { predictions: Prediction[] }) => {
    return (
      <div className="mb-5">
        <h2 className="text-xl font-semibold mb-3">Resultados (MobileNetV3):</h2>
        <p className="text-sm text-gray-600 mb-2">
          Los siguientes porcentajes indican la confianza del modelo en cada predicción:
        </p>
        <ul>
          {predictions.map((prediction, index) => (
            <li key={index} className="mb-2">
              {prediction.class}: {(prediction.probability * 100).toFixed(2)}%
            </li>
          ))}
        </ul>
        <div className="mt-5">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h1 className="text-2xl font-semibold mb-5">Reconocimiento de Imágenes</h1>
          <form onSubmit={handleSubmit} className="mb-5">
            <input
              type="file"
              onChange={handleFileChange}
              className="mb-3 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            <button
              type="submit"
              disabled={!selectedFile || isLoading}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
            >
              {isLoading ? 'Analizando...' : 'Analizar Imagen'}
            </button>
          </form>
          
          {imagePreview && (
            <div className="mb-5">
              <h2 className="text-xl font-semibold mb-3">Imagen cargada:</h2>
              <img src={imagePreview} alt="Preview" className="max-w-full h-auto" />
            </div>
          )}
          
          {predictions.length > 0 && <ResultsSection predictions={predictions} />}
          
          {predictionHistory.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-3">Historial de predicciones:</h2>
              <div className="grid grid-cols-2 gap-4">
                {predictionHistory.map((item, index) => (
                  <div key={index} className="border p-2 rounded">
                    <img src={item.image} alt={`Prediction ${index + 1}`} className="w-full h-32 object-cover mb-2" />
                    <ul>
                      {item.predictions.map((pred, predIndex) => (
                        <li key={predIndex} className="text-sm">
                          {pred.class}: {(pred.probability * 100).toFixed(2)}%
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;