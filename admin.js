'use strict';
(()=>{
  const C=window.LIGA_CORE;
  if(!C || !window.LIGA_DATA)return;
  let model=JSON.parse(JSON.stringify(window.LIGA_DATA));
  let changed=false;
  const $=id=>document.getElementById(id),esc=C.esc;
  const getData=()=>C.enrich(model);
  const teamName=(data,id)=>C.teamName(data,id,true);
  const raw=id=>model.partidos.find(m=>m.id===id);
  const catalog=()=>getData().partidos;
  const player=id=>model.jugadores.find(p=>p.id===id);
  function changedState(msg='Cambios pendientes de publicar'){
    changed=true;$('dirty-status').textContent=msg+' · Descarga data.js para publicarlos';$('dirty-status').style.color='#9e5d13';
  }
  function showToast(text){const el=$('toast');el.textContent=text;el.classList.add('visible');setTimeout(()=>el.classList.remove('visible'),3600);}
  function opt(id, label, selected){return `<option value="${esc(id)}"${String(id)===String(selected)?' selected':''}>${esc(label)}</option>`;}
  function playersOf(...ids){return model.jugadores.filter(j=>ids.includes(j.equipo));}
  function teamOptions(selected){return model.equipos.map(t=>opt(t.id,t.nombre,selected)).join('');}
  function playerOptions(players,selected,noneText='Sin asignar'){
    return opt('',noneText,selected)+players.map(p=>opt(p.id,p.nombre+(p.dorsal!=null?' · '+p.dorsal:''),selected)).join('');
  }
  function renderMatchSelect(keep){
    const options=catalog().map(m=>{
      const title=m.fase==='liga'?`J${m.jornada} · ${teamName(getData(),m.local)} vs ${teamName(getData(),m.visitante)}`:`${C.playoffNames[m.id]} · ${teamName(getData(),m.local)} vs ${teamName(getData(),m.visitante)}`;
      return opt(m.id,title,keep);
    }).join('');
    $('admin-match').innerHTML=options;
    if(keep&&catalog().some(m=>m.id===keep))$('admin-match').value=keep;
  }
  function playerChecks(players, current){
    return players.length?players.map(p=>`<label><input type="checkbox" name="participants" value="${esc(p.id)}" ${(current||[]).includes(p.id)?'checked':''}> ${esc(p.nombre)}</label>`).join(''):'<span class="empty-note">Aún no hay jugadores inscritos. Puedes guardar el marcador y completar el acta más adelante.</span>';
  }
  const eventTypes=[['gol','Gol'],['autogol','Gol en propia puerta'],['amarilla','Amarilla'],['roja','Roja directa']];
  function eventRow(ev,players){
    return `<div class="event-line" data-event><label class="form-field"><span>Evento</span><select name="event-type">${eventTypes.map(a=>opt(...a,ev?.tipo||'gol')).join('')}</select></label><label class="form-field"><span>Jugador</span><select name="event-player">${playerOptions(players,ev?.jugador,'Seleccionar jugador')}</select></label><label class="form-field"><span>Asistente (solo gol)</span><select name="event-assist">${playerOptions(players,ev?.asistente,'Sin asistencia')}</select></label><button class="danger-btn" type="button" data-remove-event>Eliminar</button></div>`;
  }
  function renderMatchForm(){
    const id=$('admin-match').value, enriched=getData(),m=enriched.partidos.find(p=>p.id===id);
    if(!m)return;
    const a=m.local,b=m.visitante,players=playersOf(a,b),stored=raw(id)||m;
    const oldScore=Number.isInteger(stored.golesLocal),canScore=Boolean(a&&b);
    $('admin-match-form').innerHTML=`<form id="match-edit-form">
      ${!canScore?'<p class="admin-warning">Todavía no se conocen los cruces. Puedes fijar fecha y hora, pero no introducir el marcador hasta que se resuelva la fase anterior.</p>':''}
      <div class="form-section"><h3>Marcador oficial</h3><div class="score-fields"><label class="form-field"><span>${esc(a?teamName(enriched,a):'Local por determinar')}</span><input name="goals-home" type="number" min="0" max="99" value="${oldScore?stored.golesLocal:''}" ${canScore?'':'disabled'} placeholder="–"></label><label class="form-field"><span>${esc(b?teamName(enriched,b):'Visitante por determinar')}</span><input name="goals-away" type="number" min="0" max="99" value="${oldScore?stored.golesVisitante:''}" ${canScore?'':'disabled'} placeholder="–"></label><label class="form-field"><span>Fecha</span><input name="match-date" type="date" value="${esc(stored.fecha||'')}"></label><label class="form-field"><span>Hora</span><input name="match-time" type="time" value="${esc(stored.hora||'')}"></label></div></div>
      <div class="form-section"><h3>Desempate (solo playoffs)</h3><label class="form-field"><span>Ganador tras el desempate si el resultado es igualado</span><select name="tiebreak" ${m.fase==='liga'?'disabled':''}>${opt('','Por determinar / no aplicable',stored.ganadorDesempate)}${a?opt(a,teamName(enriched,a),stored.ganadorDesempate):''}${b?opt(b,teamName(enriched,b),stored.ganadorDesempate):''}</select></label></div>
      <div class="form-section"><h3>Porteros</h3><div class="form-grid"><label class="form-field"><span>Portero de ${esc(teamName(enriched,a))}</span><select name="keeper-home">${playerOptions(playersOf(a),stored.porteros?.local,'Sin registrar')}</select></label><label class="form-field"><span>Portero de ${esc(teamName(enriched,b))}</span><select name="keeper-away">${playerOptions(playersOf(b),stored.porteros?.visitante,'Sin registrar')}</select></label></div><p class="small-note">Trofeo Zamora: esta versión presupone un único portero por equipo durante cada partido. No permite repartir goles entre sustitutos.</p></div>
      <div class="form-section"><h3>Futbolistas participantes</h3><div class="roster-selector">${playerChecks(players,stored.participantes)}</div></div>
      <div class="form-section"><h3>Eventos del acta</h3><div id="event-list">${(stored.eventos||[]).map(ev=>eventRow(ev,players)).join('')}</div><button type="button" class="minor-btn" id="add-event">+ Añadir gol, asistencia o tarjeta</button><p class="small-note">Cada gol con asistencia cuenta también para el asistente. Doble amarilla: registra dos amarillas, sin roja directa adicional.</p></div>
      <div class="admin-saving"><button class="gold-button" type="submit">Guardar esta acta en el editor</button><p class="small-note">Este botón solo actualiza la copia de trabajo del navegador. Para publicarla, ve a «Publicar cambios» y descarga data.js.</p></div></form>`;
    $('add-event').addEventListener('click',()=>{$('event-list').insertAdjacentHTML('beforeend',eventRow(null,players));});
    $('event-list').addEventListener('click',ev=>{const remove=ev.target.closest('[data-remove-event]');if(remove)remove.closest('[data-event]').remove();});
    $('match-edit-form').addEventListener('submit',submitMatch);
  }
  function submitMatch(event){
    event.preventDefault();
    const form=event.currentTarget, id=$('admin-match').value,m=raw(id),display=getData().partidos.find(p=>p.id===id);
    if(!m||!display)return;
    const input=name=>form.elements.namedItem(name);
    const gh=input('goals-home').value,ga=input('goals-away').value;
    if((gh==='')!==(ga==='')){showToast('Introduce los dos marcadores o deja ambos vacíos.');return;}
    if(gh!==''&&(!display.local||!display.visitante)){showToast('Los participantes del playoff aún no están determinados.');return;}
    const n=val=>val===''?null:Number(val);
    if(gh!==''&&(Number(gh)>99||Number(ga)>99||Number(gh)<0||Number(ga)<0)){showToast('Marcador fuera de rango.');return;}
    const tiebreak=input('tiebreak').disabled?null:input('tiebreak').value||null;
    if(tiebreak && (gh===''||Number(gh)!==Number(ga))){showToast('Selecciona ganador por desempate solo si hay empate en el marcador.');return;}
    const eventNodes=[...form.querySelectorAll('[data-event]')];
    const events=[];
    for(const node of eventNodes){
      const type=node.querySelector('[name=event-type]').value,pid=node.querySelector('[name=event-player]').value,aid=node.querySelector('[name=event-assist]').value;
      if(!pid){showToast('Hay un evento sin jugador seleccionado.');return;}
      const p=player(pid),a=player(aid);
      if(!p||![display.local,display.visitante].includes(p.equipo)){showToast('Evento con jugador ajeno al encuentro.');return;}
      if(type==='gol'&&aid&&(aid===pid||!a||a.equipo!==p.equipo)){showToast('La asistencia debe ser de otro jugador del mismo equipo.');return;}
      events.push(type==='gol'?{tipo:type,jugador:pid,asistente:aid||null}:{tipo:type,jugador:pid});
    }
    if(gh===''&&events.length){showToast('Antes de añadir eventos, registra el marcador.');return;}
    const goalEvents=events.filter(x=>['gol','autogol'].includes(x.tipo)).length;
    if(gh!==''&&goalEvents>Number(gh)+Number(ga)){showToast('Hay más goles registrados en eventos que goles en el marcador.');return;}
    m.fecha=input('match-date').value||null;m.hora=input('match-time').value||null;
    m.golesLocal=n(gh);m.golesVisitante=n(ga);m.ganadorDesempate=tiebreak;
    m.local=display.local||m.local;m.visitante=display.visitante||m.visitante;
    m.porteros={local:input('keeper-home').value||null,visitante:input('keeper-away').value||null};
    const checked=[...form.querySelectorAll('[name=participants]:checked')].map(x=>x.value);
    m.participantes=[...new Set([...checked,...events.map(x=>x.jugador),...events.map(x=>x.asistente).filter(Boolean),...Object.values(m.porteros).filter(Boolean)])];
    m.eventos=events;
    changedState();renderMatchSelect(id);renderMatchForm();
    const outstanding=gh!==''&&goalEvents!==Number(gh)+Number(ga);
    showToast(outstanding?'Acta guardada. Faltan goles individuales para completar premios.':'Acta guardada en el editor. Descarga el archivo para publicar.');
  }
  const initials=name=>String(name||'?').trim().split(/\s+/).slice(0,2).map(x=>x[0]||'').join('').toUpperCase();
  const safePhoto=src=>typeof src==='string'&&(/^data:image\/(?:webp|jpeg|png);base64,[a-z0-9+/=]+$/i.test(src)||/^assets\/jugadores\/[a-z0-9_.-]+\.(?:webp|png|jpe?g)$/i.test(src))?src:null;
  async function compactPhoto(file){
    if(!file||!['image/jpeg','image/png','image/webp','image/heic','image/heif'].includes(file.type))throw Error('Usa una imagen JPG, PNG, WebP o HEIC compatible.');
    if(file.size>12*1024*1024)throw Error('La imagen pesa más de 12 MB.');
    const url=URL.createObjectURL(file);
    const img=new Image();
    try{
      await new Promise((resolve,reject)=>{
        img.onload=resolve;img.onerror=()=>reject(Error('No se pudo leer la imagen. Si es HEIC, conviértela a JPG.'));img.src=url;
      });
      const sw=img.naturalWidth,sh=img.naturalHeight;
      if(!sw||!sh||sw*sh>80_000_000)throw Error('La resolución de la foto no es válida.');
      // Recorte 4:5 centrado. La imagen se reduce antes de incorporarla a data.js.
      const aspect=4/5,sourceAspect=sw/sh;
      const cw=sourceAspect>aspect?sh*aspect:sw,ch=sourceAspect>aspect?sh:sw/aspect;
      const sx=(sw-cw)/2,sy=Math.max(0,(sh-ch)*0.28);
      let targetWidth=400,quality=.77;
      for(let tries=0;tries<7;tries++){
        const canvas=document.createElement('canvas');canvas.width=targetWidth;canvas.height=Math.round(targetWidth/aspect);
        const ctx=canvas.getContext('2d');if(!ctx)throw Error('No se pudo procesar esta foto.');
        ctx.fillStyle='#edf0f5';ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.drawImage(img,sx,sy,cw,ch,0,0,canvas.width,canvas.height);
        let src=canvas.toDataURL('image/webp',quality);
        if(!src.startsWith('data:image/webp;'))src=canvas.toDataURL('image/jpeg',quality);
        if(src.length<170_000)return src;
        quality=Math.max(.5,quality-.09);targetWidth=Math.max(250,Math.round(targetWidth*.88));
      }
      throw Error('No se pudo reducir la fotografía lo suficiente.');
    } finally {URL.revokeObjectURL(url);}
  }
  function renderRoster(){
    $('player-team').innerHTML=teamOptions($('player-team').value);
    $('admin-player-list').innerHTML=model.equipos.map(t=>{
      const roster=model.jugadores.filter(j=>j.equipo===t.id);
      return `<div class="form-section"><h3>${esc(t.nombre)} <span class="muted">(${roster.length})</span></h3>${!roster.length?'<p class="empty-note">Sin inscripciones.</p>':roster.map(j=>{
        const src=safePhoto(j.foto);
        return `<div class="admin-player-row"><div class="admin-player-details"><span class="admin-avatar">${src?`<img alt="Foto de ${esc(j.nombre)}" src="${esc(src)}">`:esc(initials(j.nombre))}</span><span class="admin-player-name"><strong>${esc(j.nombre)}</strong><span class="muted"> · ${esc(j.posicion||'')} ${j.dorsal==null?'':'· Nº '+esc(j.dorsal)}</span></span></div><div class="admin-player-actions"><label class="form-check"><input type="checkbox" data-captain="${esc(j.id)}" ${j.capitan?'checked':''}> Capitán</label><button type="button" class="photo-button" data-upload-photo="${esc(j.id)}">${src?'Cambiar foto':'Añadir foto'}</button>${src?`<button type="button" class="photo-button" data-remove-photo="${esc(j.id)}">Quitar foto</button>`:''}<button class="danger-btn" data-delete-player="${esc(j.id)}" type="button">Eliminar</button></div></div>`;
      }).join('')}</div>`;
    }).join('');
    document.querySelectorAll('[data-upload-photo]').forEach(button=>button.addEventListener('click',()=>{
      const input=$('edit-player-photo');input.dataset.forPlayer=button.dataset.uploadPhoto;input.value='';input.click();
    }));
    document.querySelectorAll('[data-remove-photo]').forEach(button=>button.addEventListener('click',()=>{
      const p=player(button.dataset.removePhoto);if(!p)return;
      if(!confirm('¿Quitar la fotografía de este jugador?'))return;
      p.foto=null;changedState();renderRoster();showToast('Foto retirada. Falta publicar data.js.');
    }));
    document.querySelectorAll('[data-captain]').forEach(box=>box.addEventListener('change',()=>{
      const p=player(box.dataset.captain);if(!p)return;
      if(box.checked&&model.jugadores.filter(x=>x.equipo===p.equipo&&x.capitan).length>=2){box.checked=false;showToast('Cada equipo puede tener como máximo dos capitanes.');return;}
      p.capitan=box.checked;changedState();renderRoster();
    }));
    document.querySelectorAll('[data-delete-player]').forEach(button=>button.addEventListener('click',()=>{
      const id=button.dataset.deletePlayer;
      if(model.partidos.some(m=>(m.participantes||[]).includes(id)||(m.eventos||[]).some(x=>x.jugador===id||x.asistente===id)||Object.values(m.porteros||{}).includes(id))){showToast('No se puede borrar: el jugador aparece en actas.');return;}
      if(!confirm('¿Eliminar jugador?'))return;
      model.jugadores=model.jugadores.filter(x=>x.id!==id);changedState();renderRoster();
    }));
  }
  $('edit-player-photo').addEventListener('change',async ev=>{
    const p=player(ev.target.dataset.forPlayer),file=ev.target.files?.[0];
    if(!p||!file)return;
    try{p.foto=await compactPhoto(file);changedState();renderRoster();showToast('Foto actualizada. Descarga data.js para publicar.');}
    catch(err){showToast('Error con la foto: '+err.message);}
    finally{ev.target.value='';}
  });
  $('add-player-form').addEventListener('submit',async ev=>{
    ev.preventDefault();const button=ev.currentTarget.querySelector('[type=submit]');
    const name=$('player-name').value.trim(),t=$('player-team').value;
    if(!name||!model.equipos.some(x=>x.id===t))return;
    if($('player-captain').checked&&model.jugadores.filter(p=>p.equipo===t&&p.capitan).length>=2){showToast('Ya hay dos capitanes asignados a este equipo.');return;}
    if(model.jugadores.some(p=>p.equipo===t&&p.nombre.toLowerCase()===name.toLowerCase())){showToast('Ya existe un jugador con ese nombre en este equipo.');return;}
    button.disabled=true;button.textContent='Preparando jugador…';
    try{
      const file=$('player-photo').files?.[0];const photo=file?await compactPhoto(file):null;
      let id;do{id=`j-${t}-${Math.random().toString(36).slice(2,10)}`;}while(model.jugadores.some(j=>j.id===id));
      const rawNumber=$('player-number').value;
      model.jugadores.push({id,nombre:name,equipo:t,posicion:$('player-position').value,dorsal:rawNumber===''?null:Number(rawNumber),foto:photo,capitan:$('player-captain').checked});
      $('player-name').value='';$('player-number').value='';$('player-photo').value='';$('player-captain').checked=false;
      changedState();renderRoster();renderMatchSelect($('admin-match').value);renderMatchForm();showToast('Jugador y foto guardados en el editor. Falta publicar data.js.');
    }catch(err){showToast('No se pudo añadir: '+err.message);}
    finally{button.disabled=false;button.textContent='Añadir jugador';}
  });
  function renderTeams(){
    $('admin-team-list').innerHTML=model.equipos.map(t=>`<div class="admin-team-row" data-team-id="${esc(t.id)}"><label class="form-field"><span>Nombre completo</span><input name="team-name" value="${esc(t.nombre)}" maxlength="90"></label><label class="form-field"><span>Nombre corto</span><input name="team-short" value="${esc(t.corto)}" maxlength="30"></label><label class="form-field"><span>Sigla</span><input name="team-code" value="${esc(t.sigla)}" maxlength="4"></label><label class="form-field"><span>Color</span><input name="team-color" type="color" value="${esc(t.color)}"></label></div>`).join('')+'<div class="admin-buttons"><button type="button" class="gold-button" id="save-teams">Guardar equipos en el editor</button></div>';
    $('save-teams').addEventListener('click',()=>{
      for(const group of document.querySelectorAll('[data-team-id]')){
        const t=model.equipos.find(x=>x.id===group.dataset.teamId);if(!t)continue;
        const v=(s)=>group.querySelector(`[name=${s}]`).value.trim();
        if(!v('team-name')||!v('team-short')||!v('team-code')){showToast('Todos los nombres y siglas son obligatorios.');return;}
        t.nombre=v('team-name');t.corto=v('team-short');t.sigla=v('team-code').toUpperCase();t.color=v('team-color');
      }
      changedState();renderMatchSelect($('admin-match').value);renderMatchForm();renderRoster();showToast('Equipos actualizados en el editor.');
    });
  }
  document.querySelectorAll('[data-admin-tab]').forEach(b=>b.addEventListener('click',()=>{
    const name=b.dataset.adminTab;
    document.querySelectorAll('[data-admin-tab]').forEach(el=>el.classList.toggle('active',el===b));
    document.querySelectorAll('.admin-pane').forEach(el=>el.classList.toggle('hidden',el.id!==`admin-${name}`));
  }));
  $('admin-match').addEventListener('change',renderMatchForm);
  function download(filename,content,type){
    const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  $('download-data').addEventListener('click',()=>{
    const material=JSON.parse(JSON.stringify(model));
    delete material._table;delete material._seedErrors;
    const bad=material.partidos.filter(m=>m.fase==='playoff'&&C.score(m));
    const enrich=C.enrich(material);
    if(enrich._seedErrors.length){showToast('Hay resultados de playoffs asociados a cruces antiguos. Revísalos antes de publicar.');return;}
    download('data.js','/* Datos oficiales · I Liga de las Estrellas. Generados en la zona de gestión. */\nwindow.LIGA_DATA = '+JSON.stringify(material,null,2)+';\n','text/javascript;charset=utf-8');
    showToast('Archivo data.js descargado. Falta subirlo a GitHub para publicar.');
  });
  $('download-backup').addEventListener('click',()=>{download('liga-estrellas-copia-'+new Date().toISOString().slice(0,10)+'.json',JSON.stringify(model,null,2),'application/json;charset=utf-8');showToast('Copia de seguridad descargada.');});
  $('import-json').addEventListener('change',async ev=>{
    const file=ev.target.files[0];if(!file)return;
    try{
      if(file.size>25*1024*1024)throw Error('Archivo demasiado grande');
      const obj=JSON.parse(await file.text());
      if(!obj||!Array.isArray(obj.equipos)||!Array.isArray(obj.jugadores)||!Array.isArray(obj.partidos)||obj.equipos.length!==4||!obj.partidos.some(m=>m.id==='L1A')||!obj.partidos.some(m=>m.id==='P-FI'))throw Error('Formato de datos incompatible');
      if(!confirm('Esto sustituirá el trabajo que tengas en este navegador. ¿Continuar?'))return;
      model=obj;changedState();renderRoster();renderTeams();renderMatchSelect('L1A');renderMatchForm();showToast('Copia de datos importada.');
    }catch(err){showToast('No se pudo importar: '+err.message);}
    ev.target.value='';
  });
  window.addEventListener('beforeunload',ev=>{if(changed){ev.preventDefault();ev.returnValue='';}});
  renderRoster();renderTeams();renderMatchSelect('L1A');renderMatchForm();
})();
