'use strict';
(()=>{
 const C=window.LIGA_CORE, source=window.LIGA_DATA;
 if(!C||!source){document.body.insertAdjacentHTML('afterbegin','<p>Faltan archivos de datos.</p>');return;}
 const data=C.enrich(source), st=data._table,$=id=>document.getElementById(id);
 const e=C.esc,score=C.score,teamName=(id,short=true)=>C.teamName(data,id,short),t=id=>C.team(data,id);
 const logoFiles={bayern:"bayern-escudo.png",crystal:"crystal-escudo.png",aston:"aston-escudo.png",cultural:"cultural-escudo.png"};
 const logo=(id,big=false)=>`<span class="team-emblem real ${big?'big':''}" style="--team:${C.esc(t(id)?.color||'#8d98aa')}" aria-hidden="true">${['bayern','crystal','aston','cultural'].includes(id)?`<img alt="" src="assets/${logoFiles[id]}" loading="lazy">`:e(t(id)?.sigla||'??')}</span>`;
 const initials=name=>String(name||'?').trim().split(/\s+/).slice(0,2).map(w=>w[0]||'').join('').toUpperCase();
 const safePhoto=src=>typeof src==='string' && (/^data:image\/(?:webp|jpeg|png);base64,[a-z0-9+/=]+$/i.test(src)||/^assets\/jugadores\/[a-z0-9_.-]+\.(?:webp|png|jpg|jpeg)$/i.test(src))?src:null;
 const metrics=(list)=>list.map(x=>`<div class="metric"><b>${e(x[0])}</b><span>${e(x[1])}</span></div>`).join('');
 const leagueKPIs=()=>metrics([[st.played+'/18','PARTIDOS DISPUTADOS'],[data.equipos.length,'EQUIPOS PARTICIPANTES'],['9','JORNADAS DE LIGA'],['4','PARTIDOS DE PLAYOFFS']]);
 const currentResults=data.partidos.filter(m=>m.fase==='liga'&&score(m));
 function leagueTable(compact=false){return `<table class="league-table"><thead><tr><th>POS</th><th>EQUIPO</th><th>PJ</th><th>${compact?'DG':'PG'}</th>${compact?'':'<th>PE</th><th>PP</th><th>GF</th><th>GC</th><th>DG</th>'}<th>PTS</th></tr></thead><tbody>`+st.rows.map((r,i)=>`<tr><td><span class="pos-chip ${i===0&&st.played>0?'top':''}">${i+1}</span></td><td><span class="team-title">${compact?'':logo(r.id)}<strong>${e(r.corto)}</strong></span></td><td>${r.pj}</td><td>${compact?(r.dg>0?'+':'')+r.dg:r.pg}</td>${compact?'':`<td>${r.pe}</td><td>${r.pp}</td><td>${r.gf}</td><td>${r.gc}</td><td>${r.dg>0?'+':''}${r.dg}</td>`}<td>${r.pts}</td></tr>`).join('')+'</tbody></table>'}
 const outcome=m=>score(m)?`<span class="mini-score">${m.golesLocal} : ${m.golesVisitante}</span>`:'<span class="muted">VS</span>';
 const matchline=m=>`<div class="item-line"><div class="team-pair"><span>${e(teamName(m.local))}</span>${outcome(m)}<span>${e(teamName(m.visitante))}</span></div><span class="tag">${m.fase==='liga'?'J'+m.jornada:C.playoffNames[m.id]}</span></div>`;
 function upcoming(){
  const candidates=data.partidos.filter(m=>m.fase==='liga'&&!score(m));
  if(!candidates.length)return '<div class="empty-note">Liga regular terminada. Consulta los playoffs.</div>';
  return candidates.slice(0,3).map(m=>`<div class="item-line"><div><strong>${e(teamName(m.local))} · ${e(teamName(m.visitante))}</strong><div class="muted" style="margin-top:8px;font-size:11px">${e(m.fecha?C.formatDate(m.fecha):'Por confirmar')} · ${e(m.hora||'Hora pendiente')}</div></div><span class="tag">J${m.jornada}</span></div>`).join('');
 }
 function teamcard(r,full=false){
  const roster=data.jugadores.filter(j=>j.equipo===r.id),caps=roster.filter(j=>j.capitan).slice(0,2);
  return `<article class="team-card" style="--team:${e(r.color)}"><div class="team-color"></div>${logo(r.id,true)}<h2 class="team-name">${e(r.nombre)}</h2><span class="team-subtitle">${e(r.sigla)} · ${e(({'bayern':'Roja','crystal':'Blanca','aston':'Verde','cultural':'Negra'})[r.id]||'')}</span>${full?`<div class="captain-list"><strong>CAPITANES</strong>${[0,1].map(i=>`<span>${i+1}. ${caps[i]?e(caps[i].nombre):'Por designar'}</span>`).join('')}</div><div class="roster"><h3>PLANTILLA · ${roster.length} JUGADORES</h3>${roster.length?`<div class="team-roster-grid">${roster.map(j=>`<a class="team-player-link" href="quien-soy.html?jugador=${encodeURIComponent(j.id)}"><span class="team-player-photo">${safePhoto(j.foto)?`<img src="${e(safePhoto(j.foto))}" loading="lazy" alt="Foto de ${e(j.nombre)}">`:e(initials(j.nombre))}</span><span><strong>${e(j.nombre)}</strong><small>${j.dorsal!==null&&j.dorsal!==undefined?'Nº '+e(j.dorsal)+' · ':''}${e(j.posicion||'')}${j.capitan?' · Capitán':''}</small></span></a>`).join('')}</div>`:'<p class="empty-note">Pendiente de completar.</p>'}</div>`:`<span class="team-foot">${roster.length} jugadores inscritos · ${caps.length}/2 capitanes</span>`}</article>`;
 }
 function playoffMatch(m,placeholders){
  const lead=m.id==='P-FI'?'GRAN FINAL':m.id==='P-BR'?'TERCER PUESTO':C.playoffNames[m.id].toUpperCase();
  const win=C.winner(m);
  const labels=placeholders||['Por determinar','Por determinar'];
  const a=m.local?teamName(m.local):labels[0],b=m.visitante?teamName(m.visitante):labels[1];
  return `<article class="bracket-match"><div class="match-label">${e(lead)}</div><div class="bracket-team ${win===m.local&&win?'won':''}"><span>${e(a)}</span><b>${score(m)?m.golesLocal:'–'}</b></div><div class="bracket-team ${win===m.visitante&&win?'won':''}"><span>${e(b)}</span><b>${score(m)?m.golesVisitante:'–'}</b></div><span class="bracket-info">${m.fecha?e(C.formatDate(m.fecha)):'Fecha pendiente'} · ${m.hora?e(m.hora):'Horario pendiente'}${score(m)&&m.golesLocal===m.golesVisitante?(win?' · Ganador tras desempate':' · Desempate por determinar'):''}</span></article>`;
 }
 function playoffBracket(){
  const po=id=>data.partidos.find(m=>m.id===id);
  return `<div class="bracket-col bracket-semis"><div class="bracket-label">SEMIFINALES</div>${playoffMatch(po('P-SF1'),['1.º clasificado','4.º clasificado'])}${playoffMatch(po('P-SF2'),['2.º clasificado','3.º clasificado'])}</div><div class="bracket-col bracket-final"><div class="bracket-label">GRAN FINAL</div>${playoffMatch(po('P-FI'),['Ganador semifinal 1','Ganador semifinal 2'])}</div><div class="bracket-col bracket-bronze"><div class="bracket-label">TERCER Y CUARTO PUESTO</div>${playoffMatch(po('P-BR'),['Perdedor semifinal 1','Perdedor semifinal 2'])}</div>`;
 }
 function fixtures(filter='all'){
  const matches=data.partidos.filter(m=>m.fase==='liga');
  const rounds=[1,2,3,4,5,6,7,8,9].filter(i=>filter==='all'||(filter==='1'?i<=3:filter==='2'?i<=6:i>=7));
  return rounds.map(round=>{
   const pair=matches.filter(m=>m.jornada===round),date=pair[0]?.fecha;
   return `<article class="fixture-card"><div class="fixture-header"><strong>JORNADA ${round}</strong><small>${date?e(C.formatDate(date)):'Fecha por confirmar'}</small></div><div class="fixture-body">${pair.map(m=>`<div class="fixture-match"><time>${e(m.hora||'--:--')}</time><span class="fixture-team fixture-local">${e(teamName(m.local))}</span><span class="fixture-score ${score(m)?'played':''}">${score(m)?`${m.golesLocal} - ${m.golesVisitante}`:'vs'}</span><span class="fixture-team fixture-visitor">${e(teamName(m.visitante))}</span></div>`).join('')}</div></article>`;
  }).join('');
 }
 const page=document.body.dataset.page;
 const menu=$('menu-toggle');if(menu)menu.addEventListener('click',()=>{const open=$('mobile-menu').classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'×':'☰';});
 if(page==='inicio'){
  $('home-kpis').innerHTML=leagueKPIs();$('home-standings').innerHTML=leagueTable(true);
  $('home-upcoming').innerHTML=upcoming();$('home-teams').innerHTML=data.equipos.map(r=>teamcard(r)).join('');
  $('home-playoffs').innerHTML=`<div class="playoff-bracket">${playoffBracket()}</div>`;
 }
 if(page==='liga'){
  $('league-kpis').innerHTML=leagueKPIs();$('league-table').innerHTML=leagueTable();$('league-progress').textContent=`${st.played} de 18 disputados`;
  $('league-results').innerHTML=currentResults.length?currentResults.slice(-5).reverse().map(matchline).join(''):'<p class="empty-note">Todavía no se han disputado encuentros.</p>';
 }
 if(page==='calendario'){
  const mount=$('fixtures');mount.innerHTML=fixtures();
  document.querySelectorAll('[data-rounds]').forEach(btn=>btn.addEventListener('click',()=>{
   const filter=btn.dataset.rounds;mount.innerHTML=fixtures(filter);
   document.querySelectorAll('[data-rounds]').forEach(b=>{const on=b===btn;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});
  }));
 }
 if(page==='playoffs'){
  $('playoff-bracket').innerHTML=playoffBracket();
  $('playoff-status').innerHTML=st.final?'<span class="tag">Liga finalizada · cruces fijados</span>':`<span class="tag">Liga en curso · ${st.played}/18 partidos</span>${st.unresolved?'<p>Hay un empate clasificatorio que debe resolver la organización.</p>':''}`;
  if(data._seedErrors.length)$('playoff-status').insertAdjacentHTML('beforeend',`<p class="admin-warning">${data._seedErrors.map(e).join('; ')}</p>`);
 }
 if(page==='equipos')$('teams-directory').innerHTML=data.equipos.map(r=>teamcard(r,true)).join('');
})();
