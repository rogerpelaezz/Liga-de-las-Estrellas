/*
  I LIGA DE LAS ESTRELLAS | Datos oficiales
  ---------------------------------------------------------------
  Todos los marcadores están sin disputar (null), y las plantillas
  pendientes hasta que la organización las confirme.

  Al cerrar un partido, rellena golesLocal y golesVisitante.
  Para calcular premios individuales, rellena además:
    - participantes: IDs de los futbolistas que jugaron
    - porteros.local y porteros.visitante: ID de los porteros
    - eventos: goles, asistencias y tarjetas

  Eventos:
    { tipo: 'gol', jugador: 'id', asistente: 'id' }  // sin asistente: null
    { tipo: 'amarilla', jugador: 'id' }
    { tipo: 'roja', jugador: 'id' } // SOLO roja directa
    { tipo: 'autogol', jugador: 'id' } // no cuenta para Pichichi
  Doble amarilla: registra dos eventos 'amarilla'; no añadas 'roja'.
  ---------------------------------------------------------------
*/
window.LIGA_DATA = {
  nombre: 'I Liga de las Estrellas',
  temporada: '2026/27',
  reglas: {
    minimoPartidosZamora: 3,
    puntosAmarilla: 1,
    puntosRojaDirecta: 3
  },
  equipos: [
    { id: 'bayern', nombre: 'Bayern de los Caídos', corto: 'Bayern', sigla: 'BYN', color: '#d34c48' },
    { id: 'crystal', nombre: 'Crystal & Cubata', corto: 'Crystal', sigla: 'CRC', color: '#6b88b7' },
    { id: 'aston', nombre: 'Aston Birra', corto: 'Aston Birra', sigla: 'AST', color: '#52ad84' },
    { id: 'cultural', nombre: 'Cultural y Alcohólica Leonesa', corto: 'Cultural', sigla: 'CUL', color: '#343d49' }
  ],
  // Por completar: { id:'b1', nombre:'...', equipo:'bayern', posicion:'POR', dorsal:1, foto:null }
  jugadores: [],
  partidos: [
    { id:'L1A', fase:'liga', jornada:1, fecha:'2026-11-23', hora:'20:00', local:'bayern', visitante:'crystal' },
    { id:'L1B', fase:'liga', jornada:1, fecha:'2026-11-23', hora:'21:00', local:'aston', visitante:'cultural' },
    { id:'L2A', fase:'liga', jornada:2, fecha:'2026-11-30', hora:'20:00', local:'cultural', visitante:'bayern' },
    { id:'L2B', fase:'liga', jornada:2, fecha:'2026-11-30', hora:'21:00', local:'crystal', visitante:'aston' },
    { id:'L3A', fase:'liga', jornada:3, fecha:'2026-12-14', hora:'20:00', local:'bayern', visitante:'aston' },
    { id:'L3B', fase:'liga', jornada:3, fecha:'2026-12-14', hora:'21:00', local:'cultural', visitante:'crystal' },
    // Segunda vuelta: orden provisional, fechas todavía por asignar.
    { id:'L4A', fase:'liga', jornada:4, fecha:null, hora:null, local:'crystal', visitante:'bayern' },
    { id:'L4B', fase:'liga', jornada:4, fecha:null, hora:null, local:'cultural', visitante:'aston' },
    { id:'L5A', fase:'liga', jornada:5, fecha:null, hora:null, local:'bayern', visitante:'cultural' },
    { id:'L5B', fase:'liga', jornada:5, fecha:null, hora:null, local:'aston', visitante:'crystal' },
    { id:'L6A', fase:'liga', jornada:6, fecha:null, hora:null, local:'aston', visitante:'bayern' },
    { id:'L6B', fase:'liga', jornada:6, fecha:null, hora:null, local:'crystal', visitante:'cultural' },
    // El cuadro se completará automáticamente al cerrar las 12 actas de liga.
    { id:'P-SF1', fase:'playoff', jornada:7, fecha:null, hora:null, local:null, visitante:null },
    { id:'P-SF2', fase:'playoff', jornada:7, fecha:null, hora:null, local:null, visitante:null },
    { id:'P-BR', fase:'playoff', jornada:8, fecha:null, hora:null, local:null, visitante:null },
    { id:'P-FI', fase:'playoff', jornada:8, fecha:null, hora:null, local:null, visitante:null }
  ].map(p => ({ ...p, golesLocal:null, golesVisitante:null, ganadorDesempate:null, participantes:[], porteros:{local:null,visitante:null}, eventos:[] }))
};
