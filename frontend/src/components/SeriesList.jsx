import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronLeftIcon, EllipsisVerticalIcon, NumberedListIcon, VideoCameraIcon, XMarkIcon, PlusIcon } from "@heroicons/react/24/solid"
import { FilmIcon, PlayIcon, ExclamationCircleIcon, CheckCircleIcon } from "@heroicons/react/24/outline"
import { Form } from "./Home"

export default function SeriesList() {
    const [seriesList, setSeriesList] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [statusMessage, setStatusMessage] = useState("")

    const [selectedSerie, setSelectedSerie] = useState(null)

    const [openMenu, setMenuOpen] = useState(null)

    const navigate = useNavigate()

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/series/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            })

            if (response.ok) {
                setStatusMessage("✅ Série apagada com sucesso!")
                fetchSeriesData()
            } else {
                setStatusMessage("❌ Erro ao apagar a série")
            }
        } catch (error) {
            console.error("Erro ao apagar a série:", error)
        }
    }

    useEffect(() => {
        if (statusMessage) {
        const timer = setTimeout(() => setStatusMessage(""), 4000)
        return () => clearTimeout(timer)
        }
    }, [statusMessage])

    useEffect(() => {
        const handleClickOutside = () => setMenuOpen(null)
        document.addEventListener("click", handleClickOutside)
        return () => document.removeEventListener("click", handleClickOutside)
    }, [])

    const fetchSeriesData = async () => {
        try {
            setLoading(true)
            setError(null)

            const response = await fetch("http://localhost:3000/series", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (!response.ok) {
                throw new Error(`Erro na requiseção: ${response.status}`)
            }

            const result = await response.json()

            setSeriesList(Array.isArray(result) ? result : result.series || [])
        } catch (error) {
            console.error("Erro ao buscar dados das séries:", error)
            setError(error.message || "Não foi possível carregar a lista de séries")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSeriesData()
    }, [])

    const totalEps = seriesList.reduce((acc, serie) => acc + (serie.episodes || 0), 0)

    if (loading) {
        return (
            <div>
                <span>Carregando...</span>
            </div>
        )
    }

    if (error) {
        return(
            <div>
                <p>{error}</p>
                <button onClick={fetchSeriesData}>
                    Tentar Novamente
                </button>
            </div>
        )
    }

    return (
        <>
        <div>
            <div className="grid grid-cols-3">
                <button className="cursor-pointer w-10 h-10"
                onClick={() => navigate(-1)}
                    >
                    <ChevronLeftIcon className="w-10 h-10 mt-4 ml-4"/>
                </button>
                <h1 className="text-center my-4 text-4xl font-bold">
                    SERIES LIST
                </h1>
            </div>
            <div className="flex justify-center mb-4">
                <button onClick={() => setIsModalOpen(true)}
              className="p-2 rounded-full hover:cursor-pointer
              flex gap-1 items-center text-[#1A1917] border-2 font-bold text-sm
            ">
              <PlusIcon className="w-5 h-5"/>
              ADD SÉRIE
            </button>
            </div>
            <div className="max-w-4xl mx-auto p-6 text-[#1A1917] mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                        <div className="text-xs font-semibold text-gray-400 tracking-wider block text-[#877E78]">
                            TOTAL DE SÉRIES
                        </div>
                        <p className="text-3xl font-bold">
                            {seriesList.length}
                        </p>
                    </div>
                    <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                        <div className="text-xs font-semibold text-gray-400 tracking-wider block text-[#877E78]">
                            TOTAL DE EPISÓDIOS
                        </div>
                        <p className="text-3xl font-bold">
                            {totalEps}
                        </p>
                    </div>
                </div>

                <div className="flex justify-center border-t border-[#1A1917] pt-6">
                    <table className="text-left border-collapse bg-white m-4
                    ">
                        <thead className="">
                            <tr className="text-[#1A1917]">
                                <th className="pl-4 py-2">Nome</th>
                                <th className="pl-4 py-2">Streaming</th>
                                <th className="pl-4 py-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {seriesList.length === 0 ? (
                                <tr>
                                    <td>
                                        Nenhuma série encontrada.
                                    </td>
                                </tr>
                            ) : (
                                seriesList.map((serie) => (
                                    <tr className="rounded-xl"
                                    key={serie.id}>
                                        <td className="pl-4 py-4 pr-20"><div className="font-bold uppercase">{serie.name}</div>
                                            <div className="text-sm text-[#877E78]">
                                                <p>{serie.seasons} Temporadas</p>
                                                <p>{serie.episodes} Episódios</p>
                                            </div>
                                        </td>
                                        <td className="pl-4 py-4 text-center">{serie.streaming}</td>
                                        <td className="px-4 py-4">
                                            <div className="relative">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setMenuOpen(openMenu === serie.id ? null : serie.id)
                                                    }}
                                                className="cursor-pointer flex items-center">
                                                    <EllipsisVerticalIcon className="w-5 h-5"/>
                                                </button>

                                                {openMenu === serie.id && (
                                                    <div className="absolute right-0 mt-1 w-32 bg-white
                                                    border border-gray-100 rounded-lg shadow-lg z-10
                                                    ">
                                                        <button onClick={() => {
                                                            setSelectedSerie(serie)
                                                            setIsUpdateModalOpen(true)
                                                            setMenuOpen(null)
                                                        }}
                                                        className="w-full text-left px-4 py-2 text-sm
                                                        hover:bg-gray-50 rounded-t-lg
                                                        ">
                                                            Editar
                                                        </button>
                                                        <button onClick={() => {
                                                            handleDelete(serie.id)
                                                            setMenuOpen(null)
                                                        }}
                                                        className="w-full text-left px-4 py-2 text-sm
                                                        text-red-500 hover:bg-red-50 rounded-b-lg
                                                        ">
                                                            Apagar
                                                        </button>
                                                    </div>
                                                )}

                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
            {statusMessage && (
          <div className="max-w-md mx-auto mt-6 animate-in fade-in slide-in-from-top-2 duration-200">
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

        {isUpdateModalOpen && (
            <FormUpdate onClose={() => setIsUpdateModalOpen(false)}
            setNotification={setStatusMessage}
            selectedSerie={selectedSerie}
            onSuccess={fetchSeriesData}
            />
        )}

        {isModalOpen && (
          <Form onClose={() => setIsModalOpen(false)}
          setNotification={setStatusMessage}
          onSuccess={fetchSeriesData}
          />
        )}
        </div>
        </>
    )
}

function FormUpdate( { onClose, setNotification, selectedSerie, onSuccess }) {
    const [formData, setFormData] = useState({
        name: selectedSerie?.name || "",
        seasons: selectedSerie?.seasons || "",
        episodes: selectedSerie?.episodes || "",
        streaming: selectedSerie?.streaming || "",
    })

    const [statusMessage, setStatusMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:3000/series/${selectedSerie.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: formData.name,
                    seasons: Number(formData.seasons),
                    episodes: Number(formData.episodes),
                    streaming: formData.streaming,
                })
            })

            const data = await response.json();

            if (response.ok) {
                setNotification("✅ Série adicionada com sucesso!");
                onSuccess();
                onClose();
            } else {
                setNotification(`❌ Erro: ${data.error || "Falha ao salvar"}`);
                onClose();
      }
        } catch(error) {
            console.error('Erro no envio do formulário:', error)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />
                <div className="bg-white text-[#1A1917] w-full max-w-md p-8 rounded-xl shadow-2xl
                animate-in fade-in zoom-in-95 duration-150 z-10
                ">
                    <button className="absolute top-80 right-62 transition cursor-pointer text-gray-400 hover:text-gray-300"
                    onClick={onClose}>
                        <XMarkIcon className="w-5 h-5"/>
                    </button>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="mt-4">
                            <label className="flex gap-2 text-sm text-[#1A1917] mb-1">
                                <FilmIcon className="w-5 h-5"/>
                                Nome da Série
                            </label>
                            <input type="text" name="name" value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Ex: The Walking Dead"
                            className="border-1 border-gray-300 rounded-sm px-2 py-1
                            focus:outline-none focus:ring-2 focus:ring-gray-500"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="flex gap-2 text-sm text-[#1A1917] mb-1">
                                    <NumberedListIcon className="w-5 h-5"/>
                                    Temporadas
                                </label>
                                <input type="number" name="seasons" value={formData.seasons}
                                onChange={handleChange}
                                required
                                className="border-1 border-gray-300 rounded-sm px-2 py-1 w-full
                                focus:outline-none focus:ring-2 focus:ring-gray-500"
                                />
                            </div>
                            <div>
                                <label className="flex gap-2 text-sm text-[#1A1917] mb-1">
                                    <PlayIcon className="w-5 h-5"/>
                                    Episódios
                                </label>
                                <input type="number" name="episodes" value={formData.episodes}
                                onChange={handleChange}
                                required
                                className="border-1 border-gray-300 rounded-sm px-2 py-1 w-full
                                focus:outline-none focus:ring-2 focus:ring-gray-500"
                                />
                            </div>
                            
                        </div>
                        <div>
                            <label className="flex gap-2 text-sm text-[#1A1917] mb-1">
                                <VideoCameraIcon className="w-5 h-5"/>
                                Streaming
                            </label>
                            <input type="text" name="streaming" value={formData.streaming}
                            onChange={handleChange}
                            required
                            placeholder="Ex: Netflix"
                            className="border-1 border-gray-300 rounded-sm px-2 py-1 w-full
                            focus:outline-none focus:ring-2 focus:ring-gray-500"
                            />
                        </div>
                        <button className="w-full bg-white text-[#1A1917] font-medium border-2 border-[#1A1917]
                        py-2 px-4 rounded-xl cursor-pointer hover:text-white hover:bg-[#1A1917]
                        transitionm duration-200 mt-2"
                        type="submit">
                            Salvar
                        </button>
                    </form>
                </div>
        </div>
    )
}