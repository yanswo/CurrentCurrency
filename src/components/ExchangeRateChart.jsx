import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

function ExchangeRateChart({ baseCurrency, currencyOptions }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/739e3d405a53f20ec926c15a/latest/${baseCurrency}`
      );
      const data = await response.json();

      const filteredLabels = currencyOptions;
      const filteredRates = filteredLabels.map(
        (currency) => data.conversion_rates[currency]
      );

      setChartData({
        labels: filteredLabels,
        datasets: [
          {
            label: `Taxas de câmbio para ${baseCurrency}`,
            data: filteredRates,
            borderColor: "rgba(75,192,192,1)",
            backgroundColor: "rgba(75,192,192,0.2)",
            pointBackgroundColor: "rgba(75,192,192,1)",
            pointRadius: 4,
            fill: true,
          },
        ],
      });
    };

    fetchData();
  }, [baseCurrency, currencyOptions]);

  if (!chartData) {
    return <p>Carregando gráfico...</p>;
  }

  return (
    <div>
      <h2>Gráfico de Taxas de Câmbio:</h2>
      <Line data={chartData} />
    </div>
  );
}

export default ExchangeRateChart;
