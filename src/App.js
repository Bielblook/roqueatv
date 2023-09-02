import React, { useState, useEffect } from "react";

function EnderecoComponent() {
  const [endereco, setEndereco] = useState(null);
  const [cnpj, setCnpj] = useState("");
  const [cnpjData, setCnpjData] = useState(null);
  const [ano, setAno] = useState("");
  const [feriados, setFeriados] = useState([]);

  useEffect(() => {
    // Chamada à API ViaCEP para obter o endereço
    fetch("https://viacep.com.br/ws/50740050/json/")
      .then((response) => response.json())
      .then((data) => {
        setEndereco(`Rua ${data.logradouro} - ${data.localidade}, ${data.uf}`);
      })
      .catch((error) => {
        console.error("Erro ao buscar endereço:", error);
        setEndereco("Erro ao carregar o endereço.");
      });

    // Verificar se o campo do CNPJ não está vazio antes de fazer a chamada à API
    if (cnpj.trim() !== "") {
      fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`)
        .then((response) => response.json())
        .then((data) => {
          setCnpjData(data);
        })
        .catch((error) => {
          console.error("Erro ao buscar dados do CNPJ:", error);
          setCnpjData("Erro ao carregar o CNPJ.");
        });
    }

    // Verificar se o campo do ano não está vazio antes de fazer a chamada à API de feriados
    if (ano.trim() !== "") {
      fetch(`https://brasilapi.com.br/api/feriados/v1/${ano}`)
        .then((response) => response.json())
        .then((data) => {
          setFeriados(data);
        })
        .catch((error) => {
          console.error("Erro ao buscar feriados:", error);
          setFeriados([]);
        });
    }
  }, [cnpj, ano]);

  const handleCnpjInputChange = (event) => {
    setCnpj(event.target.value);
  };

  const handleAnoInputChange = (event) => {
    setAno(event.target.value);
  };

  return (
    <div>
      <h2>Endereço:</h2>
      {endereco ? endereco : "Carregando endereço..."}

      <h2>Informações do CNPJ:</h2>
      <input
        type="text"
        value={cnpj}
        onChange={handleCnpjInputChange}
        placeholder="Insira o CNPJ"
      />
      {cnpjData ? (
        <div>
          <p>Razão Social: {cnpjData.razao_social}</p>
          <p>Nome Fantasia: {cnpjData.nome_fantasia}</p>
          <p>Atividade Principal: {cnpjData.atividade_principal[0].text}</p>
        </div>
      ) : (
        "Carregando CNPJ..."
      )}

      <h2>Feriados:</h2>
      <input
        type="text"
        value={ano}
        onChange={handleAnoInputChange}
        placeholder="Insira o ano"
      />
      {feriados.length > 0 ? (
        <ul>
          {feriados.map((feriado, index) => (
            <li key={index}>
              {feriado.title} - {feriado.date}
            </li>
          ))}
        </ul>
      ) : (
        "Carregando feriados..."
      )}
    </div>
  );
}

export default EnderecoComponent;
