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
        return "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
      case "full":
        return "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
      case "closed":
        return "bg-gradient-to-r from-red-400 to-pink-500 text-white"
      default:
        return "bg-gradient-to-r from-slate-400 to-slate-500 text-white"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] bg-bottom" style={{backgroundSize: '40px 40px'}}></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-bold bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-xl mb-6">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            Competencias Oficiales
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">Torneos y Competencias</h2>
          <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Participa en nuestros torneos oficiales y demuestra tus habilidades contra los mejores jugadores
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="group inline-flex items-center justify-center whitespace-nowrap rounded-xl font-bold transition-all focus:outline-none bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 h-14 px-10 text-lg shadow-xl hover:shadow-2xl hover:scale-105 transform">
              <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              Registrarse Ahora
            </button>
            <button className="group inline-flex items-center justify-center whitespace-nowrap rounded-xl font-bold transition-all focus:outline-none bg-white border-2 border-slate-200 hover:border-purple-500 text-slate-900 hover:text-purple-600 h-14 px-10 text-lg shadow-lg hover:shadow-xl hover:scale-105 transform">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Ver Rankings
            </button>
          </div>
        </div>
      </section>

      {/* Upcoming Tournaments */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-slate-900 mb-4">Próximos Torneos</h3>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {upcomingTournaments.map((tournament) => (
              <div
                key={tournament.id}
                className="rounded-2xl border-2 border-slate-200 bg-white shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:-translate-y-1"
              >
                <div className="p-8">
                  <div className="flex flex-col md:flex-row items-start justify-between mb-4 gap-4">
                    <div className="flex-1">
                      <h4 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-purple-600 transition-colors">{tournament.name}</h4>
                      <div className="space-y-2">
                        <div className="flex items-center text-slate-600">
                          <svg className="w-5 h-5 mr-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="font-medium">{tournament.date} - {tournament.time}</span>
                        </div>
                        <div className="flex items-center text-slate-600">
                          <svg className="w-5 h-5 mr-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="font-medium">{tournament.location}</span>
                        </div>
                        <div className="flex items-center text-slate-600">
                          <svg className="w-5 h-5 mr-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          <span className="font-medium">{tournament.format}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-bold shadow-lg ${getStatusColor(tournament.status)}`}>
                      {getStatusText(tournament.status)}
                    </span>
                  </div>

                  <p className="text-slate-600 mb-6 leading-relaxed">{tournament.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                      <div className="text-sm text-slate-600 font-medium mb-1">Premio Total</div>
                      <div className="text-2xl font-bold text-green-600">{tournament.prizePool}</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                      <div className="text-sm text-slate-600 font-medium mb-1">Inscripción</div>
                      <div className="text-2xl font-bold text-blue-600">{tournament.entryFee}</div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-slate-600 font-medium mb-2">
                      <span>Jugadores Registrados</span>
                      <span className="font-bold">
                        {tournament.registeredPlayers}/{tournament.maxPlayers}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-indigo-500 h-3 rounded-full transition-all duration-300"
                        style={{
                          width: `${(tournament.registeredPlayers / tournament.maxPlayers) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <button
                    disabled={tournament.status !== "open"}
                    className={`w-full inline-flex items-center justify-center whitespace-nowrap rounded-xl text-base font-bold transition-all h-12 px-6 ${
                      tournament.status === "open"
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl hover:scale-105 transform"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
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
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-slate-900 mb-4">Información de Torneos</h3>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="text-2xl font-bold mb-4 text-slate-900">Reglas y Formatos</h4>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Todos nuestros torneos siguen las reglas oficiales. Consulta los formatos permitidos y restricciones.
              </p>
              <a href="#" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-bold group">
                Ver Reglas Completas
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h4 className="text-2xl font-bold mb-4 text-slate-900">Premios y Recompensas</h4>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Premios en efectivo, cartas exclusivas y puntos de ranking para los mejores jugadores.
              </p>
              <a href="#" className="inline-flex items-center text-green-600 hover:text-green-700 font-bold group">
                Ver Estructura de Premios
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8 border-2 border-purple-200 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="text-2xl font-bold mb-4 text-slate-900">Registro y Participación</h4>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Crea tu cuenta, registra tus decks y participa en torneos de tu nivel.
              </p>
              <a href="#" className="inline-flex items-center text-purple-600 hover:text-purple-700 font-bold group">
                Guía de Registro
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Past Tournaments */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-slate-900 mb-4">Torneos Pasados</h3>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto rounded-full"></div>
          </div>
          <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Torneo
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Ganador
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Formato
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Participantes
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Premio
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {pastTournaments.map((tournament) => (
                    <tr key={tournament.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-slate-900">{tournament.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-600">{tournament.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-3 shadow-lg">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          </div>
                          <div className="text-sm font-bold text-slate-900">{tournament.winner}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                          {tournament.format}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-600">{tournament.participants}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
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