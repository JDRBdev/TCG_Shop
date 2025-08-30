interface PageProps {
  params: Promise<{ lang: string }>
}

export default async function TorneosPage({ params }: PageProps) {
  const upcomingTournaments = [
    {
      id: 1,
      name: "Campeonato Regional de Primavera",
      date: "2024-04-15",
      time: "10:00 AM",
      location: "Centro de Convenciones Madrid",
      format: "Construido Estándar",
      prizePool: "$5,000",
      maxPlayers: 128,
      registeredPlayers: 89,
      entryFee: "$25",
      status: "open",
      description:
        "Torneo regional con clasificación para el campeonato nacional. Formato suizo con top 8 eliminación directa.",
    },
    {
      id: 2,
      name: "Torneo Semanal Local",
      date: "2024-04-08",
      time: "6:00 PM",
      location: "Tienda TCG Store Barcelona",
      format: "Draft",
      prizePool: "$200",
      maxPlayers: 32,
      registeredPlayers: 24,
      entryFee: "$15",
      status: "open",
      description:
        "Torneo casual semanal perfecto para jugadores de todos los niveles. Ambiente relajado y premios garantizados.",
    },
    {
      id: 3,
      name: "Copa de Campeones",
      date: "2024-05-20",
      time: "9:00 AM",
      location: "Palacio de Deportes Valencia",
      format: "Construido Legacy",
      prizePool: "$10,000",
      maxPlayers: 256,
      registeredPlayers: 156,
      entryFee: "$50",
      status: "open",
      description:
        "El torneo más prestigioso del año. Solo para jugadores con ranking profesional o invitación especial.",
    },
    {
      id: 4,
      name: "Torneo Juvenil",
      date: "2024-04-22",
      time: "2:00 PM",
      location: "Centro Juvenil Sevilla",
      format: "Construido Estándar",
      prizePool: "$500",
      maxPlayers: 64,
      registeredPlayers: 32,
      entryFee: "$10",
      status: "open",
      description: "Torneo exclusivo para jugadores menores de 18 años. Ambiente educativo y divertido.",
    },
  ]

  const pastTournaments = [
    {
      id: 1,
      name: "Campeonato de Invierno 2024",
      date: "2024-02-18",
      winner: "Carlos Mendoza",
      format: "Construido Estándar",
      participants: 156,
      prizePool: "$8,000",
    },
    {
      id: 2,
      name: "Copa Primavera 2024",
      date: "2024-03-10",
      winner: "Ana García",
      format: "Draft",
      participants: 89,
      prizePool: "$3,000",
    },
    {
      id: 3,
      name: "Torneo Relámpago",
      date: "2024-03-25",
      winner: "Miguel Torres",
      format: "Construido Legacy",
      participants: 64,
      prizePool: "$1,500",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800 border-green-200"
      case "full":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "closed":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "open":
        return "Inscripciones Abiertas"
      case "full":
        return "Completo"
      case "closed":
        return "Cerrado"
      default:
        return "Desconocido"
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold bg-purple-100 text-purple-800 border-purple-200 mb-6">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
            Competencias Oficiales
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-6 text-balance">Torneos y Competencias</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto text-pretty">
            Participa en nuestros torneos oficiales y demuestra tus habilidades contra los mejores jugadores
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 bg-purple-600 text-white hover:bg-purple-700 h-11 px-8 text-lg">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
              Registrarse Ahora
            </button>
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-300 bg-white hover:bg-gray-50 text-gray-900 h-11 px-8 text-lg">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Ver Rankings
            </button>
          </div>
        </div>
      </section>

      {/* Upcoming Tournaments */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">Próximos Torneos</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {upcomingTournaments.map((tournament) => (
              <div
                key={tournament.id}
                className="rounded-lg border bg-white shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{tournament.name}</h4>
                      <div className="flex items-center text-gray-600 mb-1">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {tournament.date} - {tournament.time}
                      </div>
                      <div className="flex items-center text-gray-600 mb-1">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {tournament.location}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                        {tournament.format}
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${getStatusColor(tournament.status)}`}
                    >
                      {getStatusText(tournament.status)}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4 text-pretty">{tournament.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-500">Premio Total</div>
                      <div className="text-lg font-bold text-green-600">{tournament.prizePool}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-500">Inscripción</div>
                      <div className="text-lg font-bold text-blue-600">{tournament.entryFee}</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Jugadores Registrados</span>
                      <span>
                        {tournament.registeredPlayers}/{tournament.maxPlayers}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(tournament.registeredPlayers / tournament.maxPlayers) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <button
                    disabled={tournament.status !== "open"}
                    className={`w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 h-11 px-6 ${
                      tournament.status === "open"
                        ? "bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      />
                    </svg>
                    {tournament.status === "open" ? "Registrarse" : "Inscripciones Cerradas"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tournament Rules */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">Información de Torneos</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-3">Reglas y Formatos</h4>
              <p className="text-gray-600 mb-4">
                Todos nuestros torneos siguen las reglas oficiales. Consulta los formatos permitidos y restricciones.
              </p>
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                Ver Reglas Completas →
              </a>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-3">Premios y Recompensas</h4>
              <p className="text-gray-600 mb-4">
                Premios en efectivo, cartas exclusivas y puntos de ranking para los mejores jugadores.
              </p>
              <a href="#" className="text-green-600 hover:text-green-700 font-medium">
                Ver Estructura de Premios →
              </a>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-3">Registro y Participación</h4>
              <p className="text-gray-600 mb-4">
                Crea tu cuenta, registra tus decks y participa en torneos de tu nivel.
              </p>
              <a href="#" className="text-purple-600 hover:text-purple-700 font-medium">
                Guía de Registro →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Past Tournaments */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">Torneos Pasados</h3>
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Torneo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ganador
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Formato
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Participantes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Premio
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pastTournaments.map((tournament) => (
                    <tr key={tournament.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{tournament.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{tournament.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          </div>
                          <div className="text-sm font-medium text-gray-900">{tournament.winner}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 border-blue-200">
                          {tournament.format}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tournament.participants}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        {tournament.prizePool}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
