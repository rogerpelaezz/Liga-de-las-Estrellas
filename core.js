'use strict';
(function(){
  const ids=['P-SF1','P-SF2','P-BR','P-FI'];
  const names={'P-SF1':'Semifinal 1','P-SF2':'Semifinal 2','P-BR':'Tercer puesto','P-FI':'Final'};
  const score=m=>Number.isInteger(m.golesLocal)&&Number.isInteger(m.golesVisitante)&&m.golesLocal>=0&&m.golesVisitante>=0;
  const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const makePlayoff=(id)=>({id,fase:'playoff',jornada:id.startsWith('P-SF')?10:11,fecha:null,hora:null,local:null,visitante:null,golesLocal:null,golesVisitante:null,ganadorDesempate:null,participantes:[],porteros:{local:null,visitante:null},eventos:[]});
  function standings(data){
    const rows=data.equipos.map(t=>({...t,pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,dg:0,pts:0,ultimos:[]}));
    const byId=Object.fromEntries(rows.map(r=>[r.id,r]));
    const matches=data.partidos.filter(m=>m.fase==='liga');
    matches.forEach(m=>{
      if(!score(m)||!byId[m.local]||!byId[m.visitante])return;
      const a=byId[m.local],b=byId[m.visitante];
      a.pj++;b.pj++;a.gf+=m.golesLocal;a.gc+=m.golesVisitante;b.gf+=m.golesVisitante;b.gc+=m.golesLocal;
      if(m.golesLocal>m.golesVisitante){a.pg++;b.pp++;a.pts+=3;a.ultimos.push('V');b.ultimos.push('D');}
      else if(m.golesLocal<m.golesVisitante){b.pg++;a.pp++;b.pts+=3;b.ultimos.push('V');a.ultimos.push('D');}
      else {a.pe++;b.pe++;a.pts++;b.pts++;a.ultimos.push('E');b.ultimos.push('E');}
    });
    rows.forEach(r=>r.dg=r.gf-r.gc);
    rows.sort((a,b)=>b.pts-a.pts||b.dg-a.dg||b.gf-a.gf||a.nombre.localeCompare(b.nombre,'es'));
    const played=matches.filter(score).length;
    const unresolved=played===matches.length&&rows.some((r,i)=>i>0&&r.pts===rows[i-1].pts&&r.dg===rows[i-1].dg&&r.gf===rows[i-1].gf);
    return {rows,played,total:matches.length,final:matches.length===18&&played===18&&!unresolved,unresolved};
  }
  function winner(m){
    if(!m||!m.local||!m.visitante||!score(m))return null;
    if(m.golesLocal>m.golesVisitante)return m.local;
    if(m.golesVisitante>m.golesLocal)return m.visitante;
    return [m.local,m.visitante].includes(m.ganadorDesempate)?m.ganadorDesempate:null;
  }
  function loser(m){const w=winner(m);return !w?null:(m.local===w?m.visitante:m.local);}
  function enrich(input){
    const data=typeof structuredClone === "function" ? structuredClone(input) : JSON.parse(JSON.stringify(input));
    const sorted=standings(data),league=data.partidos.filter(m=>m.fase==='liga');
    const byId=Object.fromEntries(data.partidos.filter(m=>m.fase==='playoff').map(m=>[m.id,m]));
    const po=ids.map(id=>({...makePlayoff(id),...(byId[id]||{})}));
    // Los emparejamientos de semifinales se guardan tras el sorteo, sin depender de la clasificación.
    const validTeams=new Set(data.equipos.map(t=>t.id));
    for(const p of po.slice(0,2)){
      if(!validTeams.has(p.local))p.local=null;
      if(!validTeams.has(p.visitante)||p.visitante===p.local)p.visitante=null;
    }
    const semisDecided=winner(po[0])&&winner(po[1]);
    po[2].local=semisDecided?loser(po[0]):null;
    po[2].visitante=semisDecided?loser(po[1]):null;
    po[3].local=semisDecided?winner(po[0]):null;
    po[3].visitante=semisDecided?winner(po[1]):null;
    const seedErrors=[];
    for(const p of po){
      const old=byId[p.id];
      if(old&&score(old) && (old.local!==p.local || old.visitante!==p.visitante)){
        seedErrors.push(`${names[p.id]}: un resultado guardado corresponde a otro cruce. Revisarlo.`);
        p.golesLocal=null;p.golesVisitante=null;p.ganadorDesempate=null;p.eventos=[];p.participantes=[];
      }
    }
    data.partidos=[...league,...po];data._table=sorted;data._seedErrors=seedErrors;
    return data;
  }
  const team=(data,id)=>data.equipos.find(t=>t.id===id)||null;
  const teamName=(data,id,short=true)=>team(data,id)?.[short?'corto':'nombre']||'Por determinar';
  const formatDate=(date)=>{
    if(!date)return 'Fecha por confirmar';
    const d=new Date(date+'T12:00:00');
    return Number.isNaN(d.getTime())?date:new Intl.DateTimeFormat('es-ES',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(d);
  };
  window.LIGA_CORE={esc,score,standings,winner,loser,enrich,team,teamName,formatDate,playoffNames:names};
})();
