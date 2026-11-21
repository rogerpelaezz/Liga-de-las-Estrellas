/* I Liga de las Estrellas | Selector de jugador y ficha personal */
'use strict';
(()=>{
  const C=window.LIGA_CORE;
  if(!C||!window.LIGA_DATA)return;
  const data=C.enrich(window.LIGA_DATA),$=id=>document.getElementById(id);
  const esc=C.esc,complete=C.score,byId=id=>data.jugadores.find(p=>p.id===id);
  const storageKey='liga-estrellas-mi-jugador-v1';
  const params=new URLSearchParams(location.search);
  const demo=params.get('demo')==='1' && !data.jugadores.length;
  let selected=null;
  function normalize(txt){return String(txt||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();}
  const initials=name=>String(name||'?').trim().split(/\s+/).slice(0,2).map(x=>x[0]||'').join('').toUpperCase();
  const photoUrl=src=>typeof src==='string'&&(/^data:image\/(?:webp|jpeg|png);base64,[a-z0-9+/=]+$/i.test(src)||/^assets\/jugadores\/[a-z0-9_.-]+\.(?:webp|png|jpe?g)$/i.test(src))?src:null;
  const team=id=>C.team(data,id)||{nombre:'Equipo por determinar',corto:'Equipo',color:'#607187',id:'unknown'};
  const badge=t=>`<span class="player-team-badge" style="--club:${esc(t.color)}"><img src="assets/${['bayern','crystal','aston','cultural'].includes(t.id)?t.id:'aston'}-escudo.png" alt="" loading="lazy"><span>${esc(t.corto)}</span></span>`;
  const portrait=(p,kind='tile')=>{
    const url=photoUrl(p.foto);
    return `<span class="player-portrait ${kind}">${url?`<img src="${esc(url)}" alt="Fotografía de ${esc(p.nombre)}" loading="lazy">`:`<span aria-hidden="true">${esc(initials(p.nombre))}</span>`}</span>`;
  };
  if(demo){
    const id='jugador-demostracion';
    data.jugadores.push({id,nombre:'Jugador de ejemplo',equipo:'aston',dorsal:7,posicion:'DEL',foto:null,capitan:false});
    const one=data.partidos.find(m=>m.id==='L1B'),two=data.partidos.find(m=>m.id==='L2B');
    Object.assign(one,{golesLocal:3,golesVisitante:1,participantes:[id],eventos:[{tipo:'gol',jugador:id,asistente:null},{tipo:'gol',jugador:id,asistente:null},{tipo:'amarilla',jugador:id}]});
    Object.assign(two,{golesLocal:1,golesVisitante:2,participantes:[id],eventos:[{tipo:'gol',jugador:id,asistente:null},{tipo:'amarilla',jugador:id}]});
  }
  function stats(p){
    const games=data.partidos.filter(m=>complete(m)&&(m.participantes||[]).includes(p.id));
    const result={pj:games.length,goles:0,asistencias:0,amarillas:0,rojas:0,portero:0,encajados:0};
    games.forEach(m=>{
      (m.eventos||[]).forEach(ev=>{
        if(ev.tipo==='gol'&&ev.jugador===p.id)result.goles++;
        if(ev.tipo==='gol'&&ev.asistente===p.id)result.asistencias++;
        if(ev.tipo==='amarilla'&&ev.jugador===p.id)result.amarillas++;
        if(ev.tipo==='roja'&&ev.jugador===p.id)result.rojas++;
      });
      if(m.porteros?.local===p.id){result.portero++;result.encajados+=m.golesVisitante;}
      else if(m.porteros?.visitante===p.id){result.portero++;result.encajados+=m.golesLocal;}
    });
    return result;
  }
  function matchRow(m,playerTeam){
    const ownHome=m.local===playerTeam,opponent=team(ownHome?m.visitante:m.local);
    const rivalLogo=['bayern','crystal','aston','cultural'].includes(opponent.id)?`<img src="assets/${opponent.id}-escudo.png" alt="" loading="lazy">`:'';
    const date=m.fecha?C.formatDate(m.fecha):'Fecha por confirmar';
    const time=m.hora||'Hora pendiente';
    let result='POR JUGAR';let label='Pendiente';
    if(complete(m)){
      const own=ownHome?m.golesLocal:m.golesVisitante,other=ownHome?m.golesVisitante:m.golesLocal;
      result=`${own} - ${other}`;label=own>other?'VICTORIA':own<other?'DERROTA':'EMPATE';
    }
    return `<div class="player-fixture"><span class="rival-crest">${rivalLogo||'✦'}</span><div class="player-fixture-info"><strong>${esc(opponent.corto)}</strong><small>${esc(date)} · ${esc(time)}</small><span class="match-subtag">${m.fase==='liga'?'JORNADA '+m.jornada:C.playoffNames[m.id]||'PLAYOFF'} · ${ownHome?'LOCAL':'VISITANTE'}</span></div><div class="player-fixture-end"><b>${result}</b><small>${label}</small></div></div>`;
  }
  function personalMatches(p){
    const games=data.partidos.filter(m=>m.local===p.equipo||m.visitante===p.equipo);
    return {next:games.filter(m=>!complete(m)).slice(0,4),last:games.filter(complete).reverse().slice(0,3)};
  }
  function renderProfile(p){
    const t=team(p.equipo),s=stats(p),matches=personalMatches(p);
    document.title=`${p.nombre} | I Liga de las Estrellas`;
    const role=({POR:'PORTERO',DEF:'DEFENSA',MED:'CENTROCAMPISTA',DEL:'DELANTERO'})[p.posicion]||'JUGADOR';
    $('player-profile').innerHTML=`${demo?'<div class="demo-disclaimer">VISTA DE DEMOSTRACIÓN · Datos y futbolista ficticios. No se han modificado los resultados oficiales.</div>':''}
      <div class="profile-action-row"><button class="change-player" id="change-player" type="button">← Cambiar de jugador</button><span class="saved-private">Tu selección se guarda solo en este navegador</span></div>
      <section class="profile-feature" style="--player-team:${esc(t.color)}">
        <div class="profile-feature-photo">${portrait(p,'large')}<span class="photo-footnote">${photoUrl(p.foto)?'FOTO DE PERFIL':'FOTO PENDIENTE'}</span></div>
        <div class="profile-feature-info"><span class="profile-overline">FICHA DEL FUTBOLISTA · 2026/27</span><div>${badge(t)}</div><h2>${esc(p.nombre)}</h2><div class="profile-details"><span>${role}</span>${p.dorsal!=null?`<span>DORSAL ${esc(p.dorsal)}</span>`:''}${p.capitan?'<span>CAPITÁN ★</span>':''}</div><p>Estos son tus números en los partidos oficiales de la I Liga de las Estrellas.</p></div>
        <span class="feature-decoration" aria-hidden="true">✦</span>
      </section>
      <div class="profile-stat-grid">
        <div class="p-stat"><span>PARTIDOS JUGADOS</span><strong>${s.pj}</strong><small>Actas oficiales</small></div>
        <div class="p-stat"><span>GOLES</span><strong>${s.goles}</strong><small>Goles anotados</small></div>
        <div class="p-stat"><span>ASISTENCIAS</span><strong>${s.asistencias}</strong><small>Pases de gol</small></div>
        <div class="p-stat"><span>TARJETAS</span><strong>${s.amarillas+s.rojas}</strong><small><i class="card-dot yellow"></i>${s.amarillas} amarillas <i class="card-dot red"></i>${s.rojas} rojas</small></div>
      </div>
      <div class="profile-lower-grid">
        <section class="panel profile-matches"><div class="profile-section-heading"><span class="section-index">PRÓXIMOS RETOS</span><h3>TUS PRÓXIMOS <em>PARTIDOS.</em></h3></div>
          ${matches.next.length?matches.next.map(m=>matchRow(m,p.equipo)).join(''):'<p class="picker-empty">No tienes partidos pendientes con rival confirmado. Consulta el cuadro de playoffs cuando termine la liga.</p>'}
          <a href="calendario.html" class="profile-text-link">Ver calendario completo ↗</a></section>
        <section class="panel profile-matches"><div class="profile-section-heading"><span class="section-index">ASÍ TE HA IDO</span><h3>TUS ÚLTIMOS <em>RESULTADOS.</em></h3></div>
          ${matches.last.length?matches.last.map(m=>matchRow(m,p.equipo)).join(''):'<p class="picker-empty">Todavía no hay partidos oficiales disputados por tu equipo.</p>'}
          <a href="href="estadisticas.html" target="_blank" rel="noopener"" class="profile-text-link">Ver los premios individuales ↗</a></section>
      </div>
      <div class="profile-footer-notice">Los partidos jugados se calculan a partir de los jugadores registrados en cada acta. Los goles, asistencias y tarjetas solo aparecen cuando los administradores los introducen. Elegir un nombre no verifica la identidad del visitante.</div>`;
    $('player-picker').hidden=true;
    $('player-profile').hidden=false;
    $('change-player').addEventListener('click',()=>showPicker(true));
  }
  function renderTiles(){
    const q=normalize($('find-player').value);const pool=data.jugadores.slice().sort((a,b)=>a.nombre.localeCompare(b.nombre,'es'));
    const found=pool.filter(p=>normalize(p.nombre+' '+team(p.equipo).nombre).includes(q));
    $('picker-count').textContent=`${found.length} de ${pool.length} jugadores`;
    $('clear-search').hidden=!$('find-player').value;
    if(!pool.length){
      $('player-results').innerHTML='<div class="picker-empty"><strong>Aún no hay jugadores inscritos.</strong><p>Los administradores podrán añadir las plantillas y las fotografías desde la sección de gestión.</p><a class="demo-preview-link" href="quien-soy.html?demo=1">Ver ejemplo ficticio de una ficha ↗</a></div>';
      return;
    }
    if(!found.length){$('player-results').innerHTML='<div class="picker-empty"><strong>No hemos encontrado ese nombre.</strong><p>Prueba solo con tu nombre o tus apellidos.</p></div>';return;}
    $('player-results').innerHTML=found.map(p=>`<button type="button" class="player-tile" data-choose="${esc(p.id)}" style="--player-color:${esc(team(p.equipo).color)}">${portrait(p)}<span class="player-tile-info"><strong>${esc(p.nombre)}</strong><small>${esc(team(p.equipo).corto)}${p.dorsal!=null?' · Nº '+esc(p.dorsal):''}</small></span><span class="choose-arrow" aria-hidden="true">↗</span></button>`).join('');
    document.querySelectorAll('[data-choose]').forEach(b=>b.addEventListener('click',()=>choose(b.dataset.choose)));
  }
  function choose(id){
    const p=byId(id);if(!p)return;
    selected=id;
    if(!demo){try{localStorage.setItem(storageKey,id)}catch(_){}}
    // Preserve a direct URL that can also be shared, without relying on cookies.
    const next=new URL(location.href);next.searchParams.set('jugador',id);next.searchParams.delete('demo');
    if(demo)next.searchParams.set('demo','1');
    try{history.replaceState(null,'',next.pathname+next.search+next.hash)}catch(_){}
    renderProfile(p);
    window.scrollTo({top:0,behavior:'instant'});
  }
  function showPicker(clear=false){
    if(clear){selected=null;try{localStorage.removeItem(storageKey)}catch(_){}
      const next=new URL(location.href);next.searchParams.delete('jugador');try{history.replaceState(null,'',next.pathname+next.search+next.hash)}catch(_){}
    }
    document.title='¿Quién soy? | I Liga de las Estrellas';
    $('player-profile').hidden=true;$('player-picker').hidden=false;renderTiles();
    if(clear)$('find-player').focus();
  }
  $('find-player').addEventListener('input',renderTiles);
  $('clear-search').addEventListener('click',()=>{$('find-player').value='';renderTiles();$('find-player').focus()});
  let saved=null;try{saved=localStorage.getItem(storageKey)}catch(_){}
  const chosen=params.get('jugador')||(!demo&&saved);
  if(chosen&&byId(chosen))choose(chosen);else showPicker();
})();
