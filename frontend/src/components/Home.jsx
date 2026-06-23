import { useState } from "react";
import { FilmIcon, NumberedListIcon } from "@heroicons/react/24/solid";

import { PlayIcon, VideoCameraIcon } from "@heroicons/react/24/outline";

export default function Home() {
  return (
    <>
      <Form />
    </>
  );
}

function Form() {
  const [formData, setFormData] = useState({
    name: "",
    seasons: "",
    episodes: "",
    streaming: "",
  });

  const streamingOptions = [
    { name: "Netflix", icon: "N" },
    { name: "Prime Video", icon: "➔" },
    { name: "Disney+", icon: "ºoº" },
    { name: "HBO Max", icon: "📺" },
    { name: "Apple TV+", icon: "" },
    { name: "Globoplay", icon: "●" },
    { name: "Paramount+", icon: "☆" },
  ];

  const [customStreaming, setCustomStreaming] = useState("");

  const handleSelectStatic = (name) => {
    setCustomStreaming("");
    setFormData({ ...formData, streaming: name });
  };

  const handleCustomInputChange = (e) => {
    const value = e.target.value;
    setCustomStreaming(value);
    setFormData({ ...formData, streaming: value });
  };

  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/series", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringfy({
          name: formData.name,
          seasons: Number(formData.seasons),
          episodes: Number(formData.episodes),
          streaming: formData.streaming,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatusMessage("✅ Série adicionada com sucesso!");
        setFormData({ name: "", seasons: "", episodes: "", streaming: "" });
      } else {
        setStatusMessage(`❌ Erro: ${data.error || "Falha ao salvar"}`);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      setStatusMessage("❌ Não foi possível conectar ao servidor.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Cadastrar Nova Série
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input: Nome */}
          <div>
            <label className="flex gap-2 text-sm font-medium text-gray-700 mb-1">
              <FilmIcon className="w-5 h-5" />
              Nome da Série
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Breaking Bad"
            />
          </div>

          {/* Grid para Temporadas e Episódios */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex gap-2 text-sm font-medium text-gray-700 mb-1">
                <NumberedListIcon className="w-5 h-5" />
                Temporadas
              </label>
              <input
                type="number"
                name="seasons"
                value={formData.seasons}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="5"
              />
            </div>
            <div>
              <label className="flex gap-2 text-sm font-medium text-gray-700 mb-1">
                <PlayIcon className="w-5 h-5" />
                Episódios
              </label>
              <input
                type="number"
                name="episodes"
                value={formData.episodes}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="62"
              />
            </div>
          </div>

          {/* Input: Streaming */}
          <div>
            <label className="flex gap-2 text-sm font-medium text-gray-700 mb-1">
              <VideoCameraIcon className="w-5 h-5" />
              Streaming
            </label>
            {/* Container dos Botões (Flex Wrap) */}
            <div className="flex flex-wrap gap-2 mb-2">
              {streamingOptions.map((option) => {
                const isSelected =
                  formData.streaming === option.name && !customStreaming;

                return (
                  <button
                    key={option.name}
                    type="button"
                    onClick={() => handleSelectStatic(option.name)}
                    className={`flex items-center gap-2 px-3 py-1 text-sm rounded-md
                        border transition-all duration-150
                ${
                  isSelected
                    ? "bg-[#2c2c2c] border-[#ffffff]/30 text-white shadow-sm"
                    : "bg-[#202020] border-[#2a2a2a] text-[#ffffff]/70 hover:bg-[#252525] hover:border-[#353535]"
                }
              `}
                  >
                    {/* Indicador de Seleção (Bolinha cinza/branca) */}
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white" : "bg-gray-500"}`}
                    />

                    {/* Mini Ícone */}
                    <span className="text-xs opacity-80 font-mono">
                      {option.icon}
                    </span>

                    {/* Nome do Streaming */}
                    <span className="font-medium">{option.name}</span>
                  </button>
                );
              })}
            </div>
            {/* Subtexto descritivo */}
            <p className="text-xs text-[#ffffff]/40 mb-2 pl-1">
              Selecione um ou digite abaixo se não estiver na lista.
            </p>

            {/* Input Customizado "Outro streaming..." */}
            <input
              type="text"
              value={customStreaming}
              onChange={handleCustomInputChange}
              placeholder="Outro streaming..."
              className="w-full bg-[#202020] border border-[#2a2a2a] rounded-md px-3 py-1.5 text-sm text-white placeholder-[#ffffff]/30 focus:outline-none focus:border-[#454545] focus:ring-1 focus:ring-[#454545] transition"
            />
          </div>

          {/* Botão de Enviar */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 mt-2"
          >
            Adicionar Série
          </button>
        </form>

        {/* Mensagem de Feedback */}
        {statusMessage && (
          <p className="mt-4 text-center text-sm font-medium text-gray-700">
            {statusMessage}
          </p>
        )}
      </div>
    </div>
  );
}
