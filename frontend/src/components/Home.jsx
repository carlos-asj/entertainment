import { useEffect, useState, forwardRef, useImperativeHandle, useRef } from "react";
import { NumberedListIcon } from "@heroicons/react/24/solid";

import { PlayIcon, VideoCameraIcon, PlusIcon, XMarkIcon, FilmIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/solid";

import { Link } from "react-router-dom"

export default function Home() {
  const dashRef = useRef(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [statusMessage, setStatusMessage] = useState("")

  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(""), 4000)
      return () => clearTimeout(timer)
    }
  }, [statusMessage])

  const [formData, setFormData] = useState({
    name: "",
    seasons: "",
    episodes: "",
    streaming: ""
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados enviados:", formData);
    setIsModalOpen(false)
  }

  return (
    <>
      <div>
        <header className="">
          <h1 className="text-center my-4 text-4xl font-bold">MOVIE SET</h1>
          <div className="flex justify-center items-center gap-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="p-2 rounded-full hover:cursor-pointer
              flex gap-1 items-center text-[#1A1917] border-2 font-bold text-sm
            ">
              <PlusIcon className="w-5 h-5"/>
              ADD SÉRIE
            </button>
            <Link to="/series">
              <button 
              className="py-2 px-3 rounded-full hover:cursor-pointer
                flex gap-1 items-center text-[#1A1917] border-2 font-bold text-sm"
              >
                SERIES LIST
              </button>
            </Link>
          </div>
        </header>
        <div>
          <Dash ref={dashRef} setNotification={setStatusMessage}/>
        </div>

        {statusMessage && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4
          animate-in fade-in slide-in-from-top-2 duration-200">
            <div 
              className={`flex items-center gap-3 p-3 rounded-lg border text-sm font-medium backdrop-blur-sm
                ${statusMessage.includes("✅") || statusMessage.includes("sucesso")
                  ? "bg-green-500/10 border-green-500/20 text-green-700"
                  : "bg-red-500/10 border-red-500/20 text-red-700"
                }`}
            >
              {statusMessage.includes("✅") || statusMessage.includes("sucesso") ? (
                <CheckCircleIcon className="w-5 h-5 shrink-0 text-green-600" />
              ) : (
                <ExclamationCircleIcon className="w-5 h-5 shrink-0 text-red-600" />
              )}

              <span className="flex-1">
                {statusMessage.replace("✅", "").replace("❌", "").trim()}
              </span>
              
              {/* Botão para fechar o aviso manualmente */}
              <button onClick={() => setStatusMessage("")} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {isModalOpen && (
          <Form onClose={() => setIsModalOpen(false)}
          setNotification={setStatusMessage}
          onSuccess={() => dashRef.current?.refresh()}
          />
        )}
      </div>
    </>
  );
}

export function Form({ onClose, setNotification, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    seasons: "",
    episodes: "",
    streaming: "",
  });

  const streamingOptions = [
    { name: "Netflix"},
    { name: "Prime Video"},
    { name: "Disney+"},
    { name: "HBO Max"},
    { name: "Apple TV+"},
    { name: "Globoplay"},
    { name: "Paramount+"},
  ];

  const [customStreaming, setCustomStreaming] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSelectStatic = (name) => {
    setCustomStreaming("");
    setFormData({ ...formData, streaming: name });
  };

  const handleCustomInputChange = (e) => {
    const value = e.target.value;
    setCustomStreaming(value);
    setFormData({ ...formData, streaming: value });
  };


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

        body: JSON.stringify({
          name: formData.name,
          seasons: Number(formData.seasons),
          episodes: Number(formData.episodes),
          streaming: formData.streaming,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setNotification("✅ Série adicionada com sucesso!");
        onSuccess();
        onClose();
      } else {
        setNotification(`❌ Erro: ${data.error || "Falha ao salvar"}`);
        onClose();
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      setNotification("❌ Não foi possível conectar ao servidor.");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="bg-white text-[#1A1917] p-8 rounded-xl shadow-2xl
      w-full max-w-md relative z-10
      animate-in fade-in zoom-in-95 duration-150"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-300
          transition cursor-pointer"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input: Nome */}
          <div>
            <label className="flex gap-2 text-sm font-medium text-[#1A1917] mb-1">
              <FilmIcon className="w-5 h-5" />
              Nome da Série
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A1917]"
              placeholder="Ex: Breaking Bad"
            />
          </div>

          {/* Grid para Temporadas e Episódios */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex gap-2 text-sm font-medium text-[#1A1917] mb-1">
                <NumberedListIcon className="w-5 h-5" />
                Temporadas
              </label>
              <input
                type="number"
                name="seasons"
                value={formData.seasons}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A1917]"
                placeholder="5"
              />
            </div>
            <div>
              <label className="flex gap-2 text-sm font-medium text-[#1A1917] mb-1">
                <PlayIcon className="w-5 h-5" />
                Episódios
              </label>
              <input
                type="number"
                name="episodes"
                value={formData.episodes}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A1917]"
                placeholder="62"
              />
            </div>
          </div>

          {/* Input: Streaming */}
          <div>
            <label className="flex gap-2 text-sm font-medium text-[#1A1917] mb-1">
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
                    className={`flex items-center gap-2 px-3 py-1 text-sm rounded-md cursor-pointer
                        border transition-all duration-150
                ${
                  isSelected
                    ? "bg-[#1A1917] border-[#1A1917] text-white"
                    : "bg-white border-[#1A1917] text-[#1A1917] hover:bg-[#1A1917] hover:border-[#1A1917] hover:text-white"
                }
              `}
                  >
                    {/* Indicador de Seleção (Bolinha cinza/branca) */}
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white" : "bg-[#1A1917]"}`}
                    />

                    {/* Nome do Streaming */}
                    <span className="font-medium">{option.name}</span>
                  </button>
                );
              })}
            </div>
            {/* Subtexto descritivo */}
            <p className="text-xs text-[#1A1917] mb-2 pl-1">
              Digite abaixo se não estiver na lista
            </p>

            {/* Input Customizado "Outro streaming..." */}
            <input
              type="text"
              value={customStreaming}
              onChange={handleCustomInputChange}
              placeholder="Outro streaming..."
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm text-[#1A1917] focus:outline-none focus:border-[#1A1917] focus:ring-1 focus:ring-[#1A1917] transition"
            />
          </div>

          {/* Botão de Enviar */}
          <button
            type="submit"
            className="w-full bg-[#1A1917] cursor-pointer text-white font-medium py-2 px-4 rounded-md transition duration-200 mt-2"
          >
            Adicionar Série
          </button>
        </form>
      </div>
    </div>
  );
}

const Dash = forwardRef(function Dash({ setNotification }, ref) {
  const [seriesList, setSeriesList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [selectedSerie, setSelectedSerie] = useState(null)

  const [isModalProgressOpen, setIsModalProgressOpen] = useState(false)

  const fetchDashData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("http://localhost:3000/progress/dashboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`)
      }

      const result = await response.json()

      setSeriesList(Array.isArray(result) ? result : result.series || [])
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error)
      setError(error.message || "Não foi possível carregar o dashboard")
    } finally {
      setLoading(false)
    }
  }

  useImperativeHandle(ref, () => ({
    refresh: fetchDashData
  }))

  useEffect(() => {
    fetchDashData()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-[#1A1917]">
        <p className="text-sm font-medium">Carregando painel...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-6 p-4 bg-red-50/50 border border-red-200 text-red-700 rounded-lg text-center">
        <p className="text-sm font-medium mb-3">❌ {error}</p>
        <button 
          onClick={fetchDashData}
          className="px-4 py-1.5 bg-red-600 text-white rounded-md text-xs font-semibold hover:bg-red-700 transition"
        >
          Tentar Novamente
        </button>
      </div>
    )
  }

  const safeDecode = (text) => {
  if (!text) return "";
  try {
    // Tenta decodificar o padrão antigo de latin1/utf8 corrompido
    return decodeURIComponent(escape(text));
  } catch (e) {
    // Se falhar (URI malformed), retorna o texto original sem quebrar a aplicação
    return text;
  }
};

  return (
    <div className="max-w-4xl mx-auto p-6 text-[#1A1917] mt-6">
      
      {/* SEÇÃO 1: CARDS DE CONTADORES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        
        {/* Contador baseado no .length do Array recebido */}
        <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
          <span className="text-xs font-semibold text-gray-400 block uppercase tracking-wider">
            EM ANDAMENTO
          </span>
          <span className="text-3xl font-bold mt-1 block">
            {seriesList.filter(s => s.status_atual === "Assistindo").length}
          </span>
        </div>

        <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
          <span className="text-xs font-semibold text-gray-400 block uppercase tracking-wider">
            NÃO ASSISTIDOS
          </span>
          <span className="text-3xl font-bold mt-1 block">
            {seriesList.filter(s => s.status_atual !== "Não Assistido").length}
          </span>
        </div>
      </div>

      {/* SEÇÃO 2: LISTAGEM DE SÉRIES (RENDERIZANDO O SEU JSON) */}
      <div className="border-t border-[#1A1917] pt-6">

        {seriesList.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">Nenhuma série encontrada.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {seriesList.map((serie) => (
              <button 
                key={serie.serie_id} 
                className={`p-5 border border-[#1A1917] shadow-sm
                hover:shadow-md transition flex flex-col justify-between cursor-pointer
                ${serie.status_atual === "Concluído"
                  ? "bg-[#F2FFF6]"
                  : "bg-white"
                }`}
                onClick={() => {setIsModalProgressOpen(true)
                  setSelectedSerie(serie)
                }}
              >
                <div>
                  {/* Cabeçalho do Card */}
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h4 className={`font-bold text-xl line-clamp-1  uppercase
                      ${serie.status_atual === "Não iniciado"
                        ? "text-gray-400"
                        : "text-[#1A1917]"
                      }
                    `}>
                      {safeDecode(serie.nome)}
                    </h4>
                    
                    {/* Badge de Status */}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full
                    border shrink-0
                      ${serie.status_atual === "Não iniciado"
                        ? "bg-gray-50 text-gray-500 border-gray-200" 
                        : serie.status_atual === "Concluído"
                          ? "bg-green-100 text-green-700 border-green-700"
                          : "bg-[#FFE57A] text-[#C89E43] border-[#C89E43]"
                      }`}
                    >
                      {serie.status_atual}
                    </span>
                  </div>

                  {/* Informações de Temporadas e Episódios */}
                  <div className="flex gap-4 text-xs text-gray-500 mt-3">
                    <span className="flex items-center gap-1">
                      <strong>{serie.total_temporadas}</strong> temporadas
                    </span>
                    <span className="flex items-center gap-1">
                      <strong>{serie.total_episodios}</strong> episódios
                    </span>
                  </div>
                </div>

                {/* Linha de progresso atual (se o usuário já iniciou) */}
                <div className="mt-4 pt-3 border-t border-gray-50 text-xs text-gray-400 flex justify-between items-center">
                  <span>Progresso:</span>
                  <span className="font-medium text-gray-600">
                    {serie.temporada_atual && serie.episodio_atual 
                      ? `T${serie.temporada_atual} : Ep ${serie.episodio_atual}`
                      : ""
                    }
                  </span>
                </div>

                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500
                      ${serie.status_atual === "Concluído" ? "bg-green-700" : "bg-yellow-400"}`}
                    style={{
                      width: serie.total_episodios
                        ? `${Math.min((serie.episodio_atual / serie.total_episodios) * 100, 100)}%`
                        : "0%"
                    }}
                  />
                </div>

              </button>
            ))}
          </div>
        )}
      </div>

      {isModalProgressOpen && (
        <ProgressForm onClose={() => setIsModalProgressOpen(false)}
        selectedSerie={selectedSerie}
        setNotification={setNotification}
        onSuccess={fetchDashData}
        />
      )}

    </div>
  )
})

function ProgressForm({ onClose, selectedSerie, setNotification, onSuccess }) {
  const [formData, setFormData] = useState({
    seasons: "",
    episodes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const seasons = Number(formData.seasons)
    const episodes = Number(formData.episodes)

    if (seasons > selectedSerie?.total_temporadas) {
      setNotification(`❌ A série possui apenas ${selectedSerie.total_temporadas} temporadas`)
      return
    }

    if (episodes > selectedSerie?.total_episodios) {
      setNotification(`❌ A série possui apenas ${selectedSerie.total_episodios} episódios`) 
      return
    }

    if (seasons < 0 || episodes < 0) {
      setNotification("❌ Os valores não podem ser negativos")
      return
    }

    try {
      const response = await fetch("http://localhost:3000/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          id_serie: selectedSerie?.serie_id,
          seasons_now: Number(formData.seasons),
          episodes_now: Number(formData.episodes),
          streaming: selectedSerie?.streaming_atual,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setNotification("✅ Série adicionada com sucesso!");
        onSuccess();
        onClose();
      } else {
        setNotification(`❌ Erro: ${data.error || "Falha ao salvar"}`);
        onClose();
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      setNotification("❌ Não foi possível conectar ao servidor.");
      onClose();
    }
  };

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="bg-white text-[#1A1917] p-8 rounded-xl shadow-2xl
      w-full max-w-md relative z-10
      animate-in fade-in zoom-in-95 duration-150"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-300
          transition cursor-pointer"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Grid para Temporadas e Episódios */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex gap-2 text-sm font-medium text-[#1A1917] mb-1">
                <NumberedListIcon className="w-5 h-5" />
                Temporadas
              </label>
              <input
                type="number"
                name="seasons"
                value={formData.seasons}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A1917]"
                placeholder={selectedSerie?.total_temporadas ?? "0"}
              />
            </div>
            <div>
              <label className="flex gap-2 text-sm font-medium text-[#1A1917] mb-1">
                <PlayIcon className="w-5 h-5" />
                Episódios
              </label>
              <input
                type="number"
                name="episodes"
                value={formData.episodes}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A1917]"
                placeholder={selectedSerie?.total_episodios ?? "0"}
              />
            </div>
          </div>

          {/* Botão de Enviar */}
          <button
            type="submit"
            className="w-full bg-[#1A1917] cursor-pointer text-white font-medium py-2 px-4 rounded-md transition duration-200 mt-2"
          >
            Salvar Progresso
          </button>
        </form>
      </div>
    </div>
    </>
  )
}