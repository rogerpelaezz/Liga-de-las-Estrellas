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
  jugadores: [
    { id:'bayern-1', nombre:"Miguel Ángel Rojas", equipo:'bayern', posicion:'JUG', dorsal:null, foto:null, capitan:true },
    { id:'bayern-2', nombre:"Santiago Zaballos", equipo:'bayern', posicion:'JUG', dorsal:null, foto:null, capitan:true },
    { id:'bayern-3', nombre:"Portero desconocido", equipo:'bayern', posicion:'POR', dorsal:null, foto:null },
    { id:'bayern-4', nombre:"Fernando Moraga", equipo:'bayern', posicion:'JUG', dorsal:null, foto:null },
    { id:'bayern-5', nombre:"Fernando Paulino", equipo:'bayern', posicion:'JUG', dorsal:null, foto:null },
    { id:'bayern-6', nombre:"José María Arizón", equipo:'bayern', posicion:'JUG', dorsal:null, foto:null },
    { id:'bayern-7', nombre:"Joaquín Navarro", equipo:'bayern', posicion:'JUG', dorsal:null, foto:null },
    { id:'bayern-8', nombre:"Pedro Galera", equipo:'bayern', posicion:'JUG', dorsal:null, foto:null },
    { id:'bayern-9', nombre:"Alfonso Esteban", equipo:'bayern', posicion:'JUG', dorsal:null, foto:null },
    { id:'bayern-10', nombre:"Marcos Fernández", equipo:'bayern', posicion:'JUG', dorsal:null, foto:null },
    { id:'bayern-11', nombre:"Francisco Carrizosa", equipo:'bayern', posicion:'JUG', dorsal:null, foto:null },
    { id:'bayern-12', nombre:"Juan José Naranjo", equipo:'bayern', posicion:'JUG', dorsal:null, foto:null },
    { id:'bayern-13', nombre:"Pablo Romero", equipo:'bayern', posicion:'JUG', dorsal:null, foto:null },
    { id:'bayern-14', nombre:"Waldo Marín", equipo:'bayern', posicion:'JUG', dorsal:null, foto:null },
    { id:'crystal-1', nombre:"José Antonio Serna", equipo:'crystal', posicion:'JUG', dorsal:null, foto:null, capitan:true },
    { id:'crystal-2', nombre:"Diego del Campo", equipo:'crystal', posicion:'JUG', dorsal:null, foto:null, capitan:true },
    { id:'crystal-3', nombre:"Francisco Vargas", equipo:'crystal', posicion:'POR', dorsal:null, foto:null },
    { id:'crystal-4', nombre:"Daniel Moreno “Danilo”", equipo:'crystal', posicion:'JUG', dorsal:null, foto:null },
    { id:'crystal-5', nombre:"Francisco Madrid", equipo:'crystal', posicion:'JUG', dorsal:null, foto:null },
    { id:'crystal-6', nombre:"Carlos Basilio", equipo:'crystal', posicion:'JUG', dorsal:null, foto:null },
    { id:'crystal-7', nombre:"Hugo De Haro", equipo:'crystal', posicion:'JUG', dorsal:null, foto:null },
    { id:'crystal-8', nombre:"Antonio Jiménez", equipo:'crystal', posicion:'JUG', dorsal:null, foto:null },
    { id:'crystal-9', nombre:"Pablo Olid", equipo:'crystal', posicion:'JUG', dorsal:null, foto:null },
    { id:'crystal-10', nombre:"Javier Peláez", equipo:'crystal', posicion:'JUG', dorsal:null, foto:null },
    { id:'crystal-11', nombre:"Luis Napolitano", equipo:'crystal', posicion:'JUG', dorsal:null, foto:null },
    { id:'crystal-12', nombre:"Juan Tormo “Guler”", equipo:'crystal', posicion:'JUG', dorsal:null, foto:null },
    { id:'crystal-13', nombre:"José Orihuela", equipo:'crystal', posicion:'JUG', dorsal:null, foto:null },
    { id:'crystal-14', nombre:"Diego Almena", equipo:'crystal', posicion:'JUG', dorsal:null, foto:null },
    { id:'aston-1', nombre:"Raúl Arribas", equipo:'aston', posicion:'JUG', dorsal:null, foto:null, capitan:true },
    { id:'aston-2', nombre:"Antonio Pulido “De Jong”", equipo:'aston', posicion:'JUG', dorsal:null, foto:null, capitan:true },
    { id:'aston-3', nombre:"Portero desconocido", equipo:'aston', posicion:'POR', dorsal:null, foto:null },
    { id:'aston-4', nombre:"Antonio Beldad", equipo:'aston', posicion:'JUG', dorsal:null, foto:null },
    { id:'aston-5', nombre:"Abdel Nourdin", equipo:'aston', posicion:'JUG', dorsal:null, foto:null },
    { id:'aston-6', nombre:"Ilias Choukri", equipo:'aston', posicion:'JUG', dorsal:null, foto:null },
    { id:'aston-7', nombre:"Ricardo Vitores", equipo:'aston', posicion:'JUG', dorsal:null, foto:null },
    { id:'aston-8', nombre:"Sergio Ceca", equipo:'aston', posicion:'JUG', dorsal:null, foto:null },
    { id:'aston-9', nombre:"Jaime Romero", equipo:'aston', posicion:'JUG', dorsal:null, foto:null },
    { id:'aston-10', nombre:"Alfonso Sánchez", equipo:'aston', posicion:'JUG', dorsal:null, foto:null },
    { id:'aston-11', nombre:"Jorge Moreno", equipo:'aston', posicion:'JUG', dorsal:null, foto:null },
    { id:'aston-12', nombre:"Nabil Essalama", equipo:'aston', posicion:'JUG', dorsal:null, foto:null },
    { id:'aston-13', nombre:"Antonio Valero", equipo:'aston', posicion:'JUG', dorsal:null, foto:null },
    { id:'cultural-1', nombre:"Javier Briñas", equipo:'cultural', posicion:'JUG', dorsal:null, foto:null, capitan:true },
    { id:'cultural-2', nombre:"Javier De la Fuente", equipo:'cultural', posicion:'JUG', dorsal:null, foto:null, capitan:true },
    { id:'cultural-3', nombre:"Alberto Laguna", equipo:'cultural', posicion:'POR', dorsal:null, foto:null },
    { id:'cultural-4', nombre:"Ferrán Ferragut", equipo:'cultural', posicion:'JUG', dorsal:null, foto:null },
    { id:'cultural-5', nombre:"Danielle Gerardino", equipo:'cultural', posicion:'JUG', dorsal:null, foto:null },
    { id:'cultural-6', nombre:"Sebastián Arpi", equipo:'cultural', posicion:'JUG', dorsal:null, foto:null },
    { id:'cultural-7', nombre:"Adrián Carrillo", equipo:'cultural', posicion:'JUG', dorsal:null, foto:null },
    { id:'cultural-8', nombre:"Javier Martín “Ponchi”", equipo:'cultural', posicion:'JUG', dorsal:null, foto:null },
    { id:'cultural-9', nombre:"Marcos De Haro", equipo:'cultural', posicion:'JUG', dorsal:null, foto:null },
    { id:'cultural-10', nombre:"Ricardo García de León", equipo:'cultural', posicion:'JUG', dorsal:null, foto:null },
    { id:'cultural-11', nombre:"Rafael Sánchez", equipo:'cultural', posicion:'JUG', dorsal:null, foto:null },
    { id:'cultural-12', nombre:"Miguel Pozas “Miky”", equipo:'cultural', posicion:'JUG', dorsal:null, foto:null },
    { id:'cultural-13', nombre:"Andrés Gómez “Andy”", equipo:'cultural', posicion:'JUG', dorsal:null, foto:null }
  ],
  partidos: [
    { id:'L1A', fase:'liga', jornada:1, fecha:'2026-11-23', hora:'20:00', local:'bayern', visitante:'crystal' },
    { id:'L1B', fase:'liga', jornada:1, fecha:'2026-11-23', hora:'21:00', local:'aston', visitante:'cultural' },
    { id:'L2A', fase:'liga', jornada:2, fecha:'2026-11-30', hora:'20:00', local:'cultural', visitante:'bayern' },
    { id:'L2B', fase:'liga', jornada:2, fecha:'2026-11-30', hora:'21:00', local:'crystal', visitante:'aston' },
    { id:'L3A', fase:'liga', jornada:3, fecha:'2026-12-14', hora:'20:00', local:'bayern', visitante:'aston' },
    { id:'L3B', fase:'liga', jornada:3, fecha:'2026-12-14', hora:'21:00', local:'cultural', visitante:'crystal' },
    // Segunda vuelta: fechas todavía por asignar.
    { id:'L4A', fase:'liga', jornada:4, fecha:null, hora:'20:00', local:'crystal', visitante:'cultural' },
    { id:'L4B', fase:'liga', jornada:4, fecha:null, hora:'21:00', local:'aston', visitante:'bayern' },
    { id:'L5A', fase:'liga', jornada:5, fecha:null, hora:'21:00', local:'bayern', visitante:'cultural' },
    { id:'L5B', fase:'liga', jornada:5, fecha:null, hora:'20:00', local:'aston', visitante:'crystal' },
    { id:'L6A', fase:'liga', jornada:6, fecha:null, hora:'20:00', local:'cultural', visitante:'aston' },
    { id:'L6B', fase:'liga', jornada:6, fecha:null, hora:'21:00', local:'crystal', visitante:'bayern' },
    // El cuadro se completará automáticamente al cerrar las 12 actas de liga.
    { id:'P-SF1', fase:'playoff', jornada:7, fecha:null, hora:'20:00', local:null, visitante:null },
    { id:'P-SF2', fase:'playoff', jornada:7, fecha:null, hora:'21:00', local:null, visitante:null },
    { id:'P-BR', fase:'playoff', jornada:8, fecha:null, hora:'20:00', local:null, visitante:null },
    { id:'P-FI', fase:'playoff', jornada:8, fecha:null, hora:'21:00', local:null, visitante:null }
  ].map(p => ({ ...p, golesLocal:null, golesVisitante:null, ganadorDesempate:null, participantes:[], porteros:{local:null,visitante:null}, eventos:[] }))
};
