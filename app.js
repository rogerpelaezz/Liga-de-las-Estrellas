'use strict';
(() => {
  const SOURCE = window.LIGA_DATA;
  if (!SOURCE) {
    document.body.insertAdjacentHTML('afterbegin','<p style="padding:20px;color:red">No se pudo cargar data.js.</p>');
    return;
  }
  const state = { phase: 'total', demo: false };
  const $ = selector => document.querySelector(selector);
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const safeColor = value => /^#[a-fA-F0-9]{6}$/.test(value || '') ? value : '#8c99aa';
  const hasScore = match => Number.isFinite(match.golesLocal) && Number.isFinite(match.golesVisitante) && match.golesLocal >= 0 && match.golesVisitante >= 0;
  const findTeam = (data, id) => data.equipos.find(team => team.id === id) || { corto:'Equipo', nombre:'Equipo desconocido', color:'#8c99aa' };
  const validPhase = (match) => state.phase === 'total' || match.fase === state.phase;
  const phaseTitle = () => ({total:'Todo el torneo',liga:'Liga regular',playoff:'Playoffs'}[state.phase]);

  const ICONS = {
    zamora: '<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="m16 3 11 4.5v8.2C27 23.4 22.1 27.7 16 30 9.9 27.7 5 23.4 5 15.7V7.5L16 3Z" stroke="currentColor" stroke-width="1.8"/><path d="m11.5 15.6 3.5 3.5 6.2-6.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    pichichi: '<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><circle cx="16" cy="16" r="12.5" stroke="currentColor" stroke-width="1.8"/><path d="m16 8 5.8 4.2-2.2 6.8h-7.2l-2.2-6.8L16 8Z" stroke="currentColor" stroke-width="1.5"/><path d="M16 3.5V8M28 13l-6.2-.8M22.8 26l-3.2-7M9.2 26l3.2-7M4 13l6.2-.8" stroke="currentColor" stroke-width="1.5"/></svg>',
    asistencias: '<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M4 23 13 14l6 6 9-11" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 9h8v8" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="7" cy="9" r="3" stroke="currentColor" stroke-width="1.6"/></svg>',
    sucio: '<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><rect x="5" y="5" width="12" height="20" rx="2" stroke="currentColor" stroke-width="1.8"/><rect x="15" y="8" width="12" height="20" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M15 9v13" stroke="currentColor" stroke-width="1.8"/></svg>'
  };

  const awards = [
    { key:'zamora', name:'ZAMORA', subtitle:'El muro que menos concede', color:'gold', rankTitle:'Zamora', rankDesc:'Menor media de goles encajados', column:'GC/PJ', footer:'Se exige un mínimo de partidos como portero.' },
    { key:'pichichi', name:'PICHICHI', subtitle:'El instinto delante de portería', color:'cyan', rankTitle:'Pichichi', rankDesc:'Máximos goleadores', column:'GOLES', footer:'Desempate: asistencias y menos partidos jugados.' }
  ];

  function demoData() {
    const data = JSON.parse(JSON.stringify(SOURCE));
    const players = [
      ['b-gk','Portero Bayern','bayern','POR'],['b-9','Delantero Bayern','bayern','DEL'],['b-10','Creador Bayern','bayern','MED'],
      ['c-gk','Portero Crystal','crystal','POR'],['c-9','Delantero Crystal','crystal','DEL'],['c-10','Creador Crystal','crystal','MED'],
      ['a-gk','Portero Aston','aston','POR'],['a-9','Delantero Aston','aston','DEL'],['a-10','Creador Aston','aston','MED'],
      ['l-gk','Portero Cultural','cultural','POR'],['l-9','Delantero Cultural','cultural','DEL'],['l-10','Creador Cultural','cultural','MED']
    ];
    data.jugadores = players.map(([id,nombre,equipo,posicion])=>({id,nombre,equipo,posicion}));
    const goal = (jugador,asistente=null)=>({tipo:'gol',jugador,asistente});
    const yellow = jugador => ({tipo:'amarilla',jugador});
    const red = jugador => ({tipo:'roja',jugador});
    const demoMatches = {
      L1A: [3,2,[goal('b-9','b-10'),goal('b-9','b-10'),goal('b-10','b-9'),goal('c-9','c-10'),goal('c-9','c-10'),yellow('b-10'),yellow('c-10')]],
      L1B: [1,1,[goal('a-9','a-10'),goal('l-9','l-10'),yellow('a-9')]],
      L2A: [0,1,[goal('b-9','b-10'),yellow('l-10'),yellow('b-9')]],
      L2B: [2,4,[goal('c-9','c-10'),goal('c-10','c-9'),goal('a-9','a-10'),goal('a-9','a-10'),goal('a-9','a-10'),goal('a-10','a-9'),red('a-10'),yellow('c-9')]],
      L3A: [2,0,[goal('b-9','b-10'),goal('b-10','b-9'),yellow('a-9'),yellow('a-9')]],
      L3B: [1,3,[goal('l-9','l-10'),goal('c-9','c-10'),goal('c-9','c-10'),goal('c-10','c-9'),red('l-10')]]
    };
    const playerIDs = Object.fromEntries(data.equipos.map(team=>[team.id, data.jugadores.filter(player=>player.equipo===team.id).map(player=>player.id)]));
    for (const match of data.partidos) {
      const sample = demoMatches[match.id];
      if (!sample) continue;
      match.golesLocal = sample[0];
      match.golesVisitante = sample[1];
      match.eventos = sample[2];
      match.participantes = [...playerIDs[match.local], ...playerIDs[match.visitante]];
      match.porteros = {local:playerIDs[match.local].find(id=>id.endsWith('gk')),visitante:playerIDs[match.visitante].find(id=>id.endsWith('gk'))};
    }
    return data;
  }
  const DEMO = demoData();
  const activeData = () => window.LIGA_CORE.enrich(state.demo ? DEMO : SOURCE);

  function calculate(data) {
    const selected = data.partidos.filter(validPhase);
    const completed = selected.filter(hasScore);
    const minimumGK = state.phase === 'playoff' ? 1 : (data.reglas.minimoPartidosZamora || 3);
    const players = new Map(data.jugadores.map(j => [j.id, { ...j, partidos:0,goles:0,asistencias:0,amarillas:0,rojas:0,puntos:0,partidosPortero:0,encajados:0,media:null }]));
    const goalsScored = completed.reduce((acc,m)=>acc + m.golesLocal + m.golesVisitante,0);
    const goalEvents = completed.reduce((acc,m)=>acc + (m.eventos||[]).filter(ev=>ev.tipo==='gol'||ev.tipo==='autogol').length,0);
    let missingEvents = Math.max(0, goalsScored-goalEvents);
    for (const match of completed) {
      const participants = new Set(match.participantes || []);
      const goalkeepers = match.porteros || {};
      for (const side of ['local','visitante']) {
        const keeper = players.get(goalkeepers[side]);
        if (keeper && keeper.equipo === match[side]) {
          participants.add(keeper.id);
          keeper.partidosPortero++;
          keeper.encajados += side === 'local' ? match.golesVisitante : match.golesLocal;
        }
      }
      for (const id of participants) {
        const player = players.get(id);
        if (player && (player.equipo===match.local || player.equipo===match.visitante)) player.partidos++;
      }
      for (const ev of (match.eventos||[])) {
        const player = players.get(ev.jugador);
        if (ev.tipo==='gol' && player) {
          player.goles++;
          const assistant = players.get(ev.asistente);
          if (assistant && assistant.id!==player.id && assistant.equipo===player.equipo) assistant.asistencias++;
        }
        if (ev.tipo==='amarilla' && player) player.amarillas++;
        if (ev.tipo==='roja' && player) player.rojas++;
      }
    }
    for (const player of players.values()) {
      player.puntos = player.amarillas*data.reglas.puntosAmarilla + player.rojas*data.reglas.puntosRojaDirecta;
      player.media = player.partidosPortero ? player.encajados/player.partidosPortero : null;
      player.elegibleZamora = player.partidosPortero >= minimumGK;
    }
    const pool = [...players.values()];
    const alphabetic = (a,b)=>a.nombre.localeCompare(b.nombre,'es');
    const rankings = {
      zamora: pool.filter(p=>p.partidosPortero>0).sort((a,b)=>Number(b.elegibleZamora)-Number(a.elegibleZamora) || a.media-b.media || b.partidosPortero-a.partidosPortero || a.encajados-b.encajados || alphabetic(a,b)),
      pichichi:pool.filter(p=>p.goles>0).sort((a,b)=>b.goles-a.goles || b.asistencias-a.asistencias || a.partidos-b.partidos || alphabetic(a,b)),
      asistencias:pool.filter(p=>p.asistencias>0).sort((a,b)=>b.asistencias-a.asistencias || b.goles-a.goles || a.partidos-b.partidos || alphabetic(a,b)),
      sucio:pool.filter(p=>p.puntos>0).sort((a,b)=>b.puntos-a.puntos || b.rojas-a.rojas || b.amarillas-a.amarillas || alphabetic(a,b))
    };
    const results = Object.fromEntries(Object.entries(rankings).map(([key,arr])=>[key,key==='zamora' ? arr.find(player=>player.elegibleZamora) || null : arr[0] || null]));
    return { selected, completed, rankings, results, missingEvents, minimumGK,
      goals:goalsScored,
      assists:pool.reduce((a,p)=>a+p.asistencias,0),
      yellows:pool.reduce((a,p)=>a+p.amarillas,0),
      reds:pool.reduce((a,p)=>a+p.rojas,0)
    };
  }

  function formatStat(key, player) {
    if (!player) return ['—','SIN DATOS'];
    if (key==='zamora') return [player.media.toFixed(2).replace('.',','),'GOLES ENCAJADOS / PARTIDO'];
    if (key==='pichichi') return [String(player.goles),player.goles===1?'GOL':'GOLES'];
    if (key==='asistencias') return [String(player.asistencias),player.asistencias===1?'ASISTENCIA':'ASISTENCIAS'];
    return [String(player.puntos),'PUNTOS DISCIPLINARIOS'];
  }

  function renderTeams(data){
    $('#teams-strip').innerHTML = data.equipos.map(t=>`<span class="team-item"><span class="team-dot" style="--team-color:${safeColor(t.color)}">${escapeHTML(t.sigla)}</span>${escapeHTML(t.corto)}</span>`).join('');
  }
  function renderSummary(data, stats){
    $('#stat-goals').textContent = stats.goals;
    $('#stat-assists').textContent = stats.assists;
    $('#stat-yellows').textContent = stats.yellows;
    const countTotal = state.phase==='total'?22:state.phase==='liga'?18:4;
    $('#stat-matches').innerHTML = `${stats.completed.length}<span class="count-total">/${countTotal}</span>`;
    const status=$('#data-status');
    status.textContent=state.demo?'EJEMPLO FICTICIO':'OFICIALES';
    status.classList.toggle('demo',state.demo);
  }
  function renderAwards(data, stats){
    $('#award-cards').innerHTML=awards.map((award,index)=>{
      if (award.key==='pichichi') {
        const podium=stats.rankings.pichichi.slice(0,3);
        const places=podium.length?podium.map((player,place)=>`<li><span class="podium-place">${place+1}.</span><span class="podium-player">${escapeHTML(player.nombre)}<small>${escapeHTML(findTeam(data,player.equipo).corto)}</small></span><strong>${player.goles} ${player.goles===1?'gol':'goles'}</strong></li>`).join(''):'<li class="podium-empty">Pendiente de resultados</li>';
        return `<article class="award-card ${award.color} pichichi-podium"><div class="award-top"><span class="award-number">PREMIO 0${index+1}</span><div class="award-symbol">${ICONS[award.key]}</div></div><h3 class="award-name">${award.name}</h3><p class="award-subtitle">${award.subtitle}</p><div class="award-divider"></div><div class="award-winner-overline">TOP 3 GOLEADORES</div><ol class="pichichi-podium-list">${places}</ol><div class="award-bottom"><strong>TEMPORADA 2026/27</strong><span class="mini-line"></span></div></article>`;
      }
      const winner=stats.results[award.key];
      const team=winner?findTeam(data,winner.equipo):null;
      const [value,label]=formatStat(award.key,winner);
      return `<article class="award-card ${award.color}"><div class="award-top"><span class="award-number">PREMIO 0${index+1}</span><div class="award-symbol">${ICONS[award.key]}</div></div><h3 class="award-name">${award.name}</h3><p class="award-subtitle">${award.subtitle}</p><div class="award-divider"></div><div class="award-winner-overline">${winner?'LÍDER ACTUAL':'SIN GANADOR ASIGNADO'}</div><div class="award-winner ${winner?'':'muted'}">${winner?escapeHTML(winner.nombre):'Pendiente de datos'}</div><div class="award-stat">${value}<span>${label}</span></div><div class="award-bottom"><strong>${team?escapeHTML(team.corto):'TEMPORADA 2026/27'}</strong><span class="mini-line"></span></div></article>`;
    }).join('') + '<article class="award-card golden-ball"><div class="award-top"><span class="award-number">PREMIO 03</span><div class="award-symbol" aria-hidden="true">★</div></div><h3 class="award-name">BALÓN DE ORO DEL TORNEO</h3><p class="award-subtitle">El futbolista más destacado del torneo.</p><div class="award-divider"></div><div class="award-winner-overline">PENDIENTE DE DESIGNACIÓN</div><div class="award-winner muted">Por decidir</div><div class="award-stat">★<span>RECONOCIMIENTO INDIVIDUAL</span></div><div class="award-bottom"><strong>TEMPORADA 2026/27</strong><span class="mini-line"></span></div></article>';
  }
  function renderRankings(data, stats) {
    $('#ranking-tables').innerHTML=awards.map(award=>{
      const rank=stats.rankings[award.key];
      const display=award.key==='zamora'?rank.slice(0,data.equipos.length):rank;
      let content;
      if (!rank.length){
        content=`<div class="empty-state"><div class="empty-icon">✳</div><strong>Aquí aún no hay nombres.</strong><p>${state.demo?'Cambia a otra fase para ver los partidos de ejemplo.':'Cuando se registren jugadores y actas, la clasificación aparecerá automáticamente.'}</p></div>`;
      } else {
        const rows=display.map((player,index)=>{
          const team=findTeam(data,player.equipo);
          const value=award.key==='zamora'?player.media.toFixed(2).replace('.',',') : award.key==='pichichi'?player.goles : award.key==='asistencias'?player.asistencias : player.puntos;
          const secondary=award.key==='zamora'&&!player.elegibleZamora?' · NO OPTA':award.key==='sucio'?` · ${player.amarillas}A / ${player.rojas}R`:'';
          const pj=award.key==='zamora'?player.partidosPortero:player.partidos;
          const pichichiColumns=award.key==='pichichi'?`<td>${(player.goles/player.partidos).toFixed(2).replace('.',',')}</td><td>${player.asistencias}</td>`:'';
          return `<tr><td><span class="ranking-position">${String(index+1).padStart(2,'0')}</span></td><td><span class="player-name">${escapeHTML(player.nombre)}</span><span class="player-team"><i class="player-team-bullet" style="--color:${safeColor(team.color)}"></i>${escapeHTML(team.corto)}${secondary}</span></td><td>${pj}</td>${award.key==='zamora'?`<td>${player.encajados}</td>`:''}<td>${value}</td>${pichichiColumns}</tr>`;
        }).join('');
        content=`<div class="ranking-scroll"><table class="ranking-table ${award.key==='zamora'?'zamora-table':award.key==='pichichi'?'pichichi-table':''}"><thead><tr><th>POS.</th><th>JUGADOR / EQUIPO</th><th>PJ</th>${award.key==='zamora'?'<th>GC</th>':''}<th>${award.column}</th>${award.key==='pichichi'?'<th>G/PJ</th><th>ASIST.</th>':''}</tr></thead><tbody>${rows}</tbody></table></div>`;
      }
      const extra=award.key==='zamora'?` Mínimo: ${stats.minimumGK} partido${stats.minimumGK===1?'':'s'}.`:'';
      return `<article class="ranking-card"><div class="ranking-head"><div><h3>${award.rankTitle}</h3><p>${award.rankDesc}</p></div><div class="ranking-icon" style="--accent:${award.color==='red'?'#dd797d':award.color==='cyan'?'#45a8bd':award.color==='purple'?'#8a7fd5':'#c09e5b'}">${ICONS[award.key]}</div></div>${content}<div class="ranking-footer">${award.footer}${extra}</div></article>`;
    }).join('');
  }
  function render(){
    const data=activeData();
    const stats=calculate(data);
    renderTeams(data);
    renderSummary(data,stats);
    renderAwards(data,stats);
    renderRankings(data,stats);
    document.title=`Estadísticas (${phaseTitle()}) | I Liga de las Estrellas`;
  }
  let toastTimeout;
  function showToast(message){
    const toast=$('#toast');
    toast.textContent=message;
    toast.classList.add('visible');
    clearTimeout(toastTimeout);
    toastTimeout=setTimeout(()=>toast.classList.remove('visible'),3600);
  }
  document.querySelectorAll('[data-phase]').forEach(btn=>btn.addEventListener('click',()=>{
    state.phase=btn.dataset.phase;
    document.querySelectorAll('[data-phase]').forEach(el=>{
      const active=el.dataset.phase===state.phase;
      el.classList.toggle('selected',active);
      el.setAttribute('aria-pressed',String(active));
    });
    render();
  }));
  $('#demo-toggle').addEventListener('click',()=>{
    state.demo=!state.demo;
    $('#demo-toggle').setAttribute('aria-pressed',String(state.demo));
    $('#demo-toggle').lastChild.textContent=state.demo?' Salir de demo':' Ver demo';
    render();
    showToast(state.demo?'Modo demostración. Los nombres y resultados son inventados y no se guardan.':'Vuelves a ver únicamente los datos oficiales.');
  });
  $('#export-csv').addEventListener('click',()=>{
    const data=activeData(),stats=calculate(data);
    const csvCell=value=>'"'+String(value??'').replace(/"/g,'""')+'"';
    const rows=[['premio','posicion','jugador','equipo','partidos','goles','asistencias','amarillas','rojas_directas','puntos_disciplinarios','partidos_portero','goles_encajados','media_goles_encajados','elegible_zamora']];
    for(const award of awards){
      stats.rankings[award.key].forEach((p,i)=>rows.push([award.rankTitle,i+1,p.nombre,findTeam(data,p.equipo).nombre,p.partidos,p.goles,p.asistencias,p.amarillas,p.rojas,p.puntos,p.partidosPortero,p.encajados,p.media===null?'':p.media.toFixed(3),p.elegibleZamora?'Sí':'No']));
    }
    const csv='\uFEFF'+rows.map(row=>row.map(csvCell).join(';')).join('\r\n');
    const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'});
    const url=URL.createObjectURL(blob);
    const link=document.createElement('a');
    link.href=url;
    link.download=`liga-estrellas-estadisticas-${state.phase}${state.demo?'-DEMO':''}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    if(rows.length===1) showToast('CSV descargado. Todavía no hay jugadores con estadísticas registradas.');
    else showToast(`CSV exportado para: ${phaseTitle().toLowerCase()}${state.demo?' (DEMO)':''}.`);
  });
  render();
})();
