import { useState, useEffect } from "react";
import CurrencySelector from "./components/CurrencySelector";
import ExchangeRateChart from "./components/ExchangeRateChart";

function App() {
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [amount, setAmount] = useState(1);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [isConverted, setIsConverted] = useState(false);
  const [loading, setLoading] = useState(false);

  const currencyOptions = ["USD", "EUR", "BRL", "JPY", "GBP"];

  useEffect(() => {
    const storedHistory = localStorage.getItem("conversionHistory");
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("conversionHistory", JSON.stringify(history));
  }, [history]);

  const getExchangeRate = async (fromCurrency, toCurrency) => {
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/739e3d405a53f20ec926c15a/latest/${fromCurrency}`
    );
    const data = await response.json();
    return data.conversion_rates[toCurrency];
  };

  const addToHistory = (fromCurrency, toCurrency, amount, result) => {
    const date = new Date().toLocaleString();
    setHistory((prevHistory) => [
      ...prevHistory,
      { fromCurrency, toCurrency, amount, result, date, id: Date.now() },
    ]);
  };

  const handleConvert = async () => {
    if (amount <= 0) {
      alert("Por favor, insira um valor maior que zero.");
      return;
    }

    setLoading(true);
    try {
      const rate = await getExchangeRate(fromCurrency, toCurrency);
      if (rate) {
        const conversionResult = amount * rate;
        setResult(conversionResult);
        addToHistory(fromCurrency, toCurrency, amount, conversionResult);
        setIsConverted(true);
      }
    } catch (error) {
      console.error("Erro na conversão", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={"App"}>
      <h1>Conversor de Moedas</h1>

      <CurrencySelector
        label="De:"
        value={fromCurrency}
        onChange={(e) => setFromCurrency(e.target.value)}
        options={currencyOptions}
      />

      <CurrencySelector
        label="Para:"
        value={toCurrency}
        onChange={(e) => setToCurrency(e.target.value)}
        options={currencyOptions}
      />

      <div>
        <label>Valor:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <button onClick={handleConvert} disabled={loading}>
        {loading ? "Carregando..." : "Converter"}
      </button>

      <div>
        {isConverted && result !== null && (
          <h2>
            {amount} {fromCurrency} = {result.toFixed(2)} {toCurrency}
          </h2>
        )}
      </div>

      <div>
        <h2>Histórico de Conversões:</h2>
        {history.length > 0 ? (
          <ul>
            {history.map((item) => (
              <li key={item.id}>
                {item.amount} {item.fromCurrency} = {item.result.toFixed(2)}{" "}
                {item.toCurrency} em {item.date}
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhuma conversão realizada ainda.</p>
        )}
      </div>

      <div>
       
        <ExchangeRateChart
          baseCurrency={fromCurrency}
          currencyOptions={currencyOptions}
        />
      </div>
    </div>
  );
}

export default App;
