(function(){
  const repeat=(n,fn)=>Array.from({length:n},(_,i)=>fn(i)).join('');
  const wrap=(kind,inner)=>`<div class="domain-visual domain-visual--${kind}" aria-hidden="true">${inner}</div>`;

  function automation(){
    const sourceIcons=repeat(7,i=>`<g class="auto-source auto-source-${i}" transform="translate(${18+(i%2)*74} ${22+i*40})"><rect width="54" height="28" rx="8"/><circle cx="14" cy="14" r="4"/><path d="M24 10h20M24 16h15"/></g>`);
    const stages=[['INGEST','Capture'],['ORCHESTRATE','Rules'],['EXECUTE','Actions'],['VALIDATE','Control']].map((s,i)=>`<g class="auto-stage auto-stage-${i}" transform="translate(${205+i*118} 110)"><rect width="98" height="108" rx="16"/><circle cx="49" cy="32" r="15"/><path d="M40 32h18M49 23v18"/><text x="49" y="67">${s[0]}</text><text class="sub" x="49" y="84">${s[1]}</text></g>`).join('');
    return wrap('automation',`<svg viewBox="0 0 780 360" role="presentation">
      <defs><linearGradient id="ag" x1="0" x2="1"><stop stop-color="#f2a23b"/><stop offset="1" stop-color="#48d7cf"/></linearGradient><filter id="aglow"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      <g class="auto-sources">${sourceIcons}</g>
      ${repeat(8,i=>`<path class="auto-wire auto-wire-${i}" d="M${72+(i%2)*74} ${36+i*35} C160 ${36+i*35},145 ${130+i*4},205 ${148+i*3}"/>`)}
      <rect class="auto-pipe" x="185" y="88" width="500" height="154" rx="28"/>
      ${stages}
      <g class="auto-core" transform="translate(715 165)"><circle r="54"/><circle r="35"/><path d="M-14 0h28M0-14v28M-10-10l20 20M10-10l-20 20"/></g>
      ${repeat(6,i=>`<path class="auto-output auto-output-${i}" d="M685 ${128+i*15} C725 ${128+i*15},735 ${68+i*42},772 ${68+i*42}"/>`)}
      <text class="visual-label" x="22" y="18">DISCONNECTED TOOLS</text><text class="visual-label alt" x="335" y="74">STRUCTURED AUTOMATION PIPELINE</text><text class="visual-label" x="655" y="18">AI-ASSISTED OPERATIONS</text>
    </svg>`);
  }

  function strategy(){
    const inputs=['Market needs','Customer signals','Constraints','Operational gaps','Risk','Opportunity'];
    const outputs=['Aligned priorities','Informed decisions','Measurable impact','Sustainable outcomes'];
    return wrap('strategy',`<svg viewBox="0 0 780 360" role="presentation">
      <defs><radialGradient id="sg"><stop stop-color="#e9d58f" stop-opacity=".6"/><stop offset="1" stop-color="#b9aa58" stop-opacity="0"/></radialGradient><filter id="sglow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      ${inputs.map((x,i)=>`<g class="strategy-input" style="--i:${i}" transform="translate(12 ${35+i*48})"><rect width="126" height="34" rx="9"/><circle cx="17" cy="17" r="4"/><text x="31" y="21">${x}</text><path d="M126 17 C210 17,210 ${92+i*16},315 ${126+i*2}"/></g>`).join('')}
      <g class="decision-map" transform="translate(410 180)"><circle class="map-halo" r="130"/><circle class="map-ring r1" r="100"/><circle class="map-ring r2" r="72"/><circle class="map-ring r3" r="42"/>${repeat(24,i=>`<circle class="map-node" style="--i:${i}" cx="${Math.cos(i*.79)*((i%3)*23+55)}" cy="${Math.sin(i*.79)*((i%3)*23+55)}" r="3"/>`)}<text x="0" y="-4">DECISION</text><text x="0" y="14">MAP</text></g>
      ${outputs.map((x,i)=>`<g class="strategy-output" style="--i:${i}" transform="translate(570 ${62+i*70})"><path d="M-55 17 C-20 17,-28 17,0 17"/><circle cx="18" cy="17" r="15"/><text x="45" y="12">${x}</text><path class="arrow" d="M45 25h115m-12-7 12 7-12 7"/></g>`).join('')}
      <text class="visual-label" x="12" y="18">SCATTERED INPUTS</text><text class="visual-label alt" x="346" y="18">ANALYSE · PRIORITISE · DECIDE</text><text class="visual-label" x="610" y="18">STRATEGIC OUTCOMES</text>
    </svg>`);
  }

  function analytics(){
    return wrap('analytics',`<svg viewBox="0 0 780 360" role="presentation">
      <defs><linearGradient id="ang" x1="0" x2="1"><stop stop-color="#3f8cff"/><stop offset="1" stop-color="#53d9ff"/></linearGradient><filter id="anGlow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      <g class="raw-cloud">${repeat(85,i=>`<rect style="--i:${i}" x="${45+(i*37)%220}" y="${42+(i*53)%230}" width="${2+(i%4)}" height="${2+(i%3)}" rx="1"/>`)}</g>
      ${repeat(9,i=>`<path class="analytic-stream" style="--i:${i}" d="M210 ${55+i*26} C330 ${45+i*22},325 ${60+i*20},445 ${70+i*21}"/>`)}
      <g class="dashboard" transform="translate(450 52)"><rect width="300" height="250" rx="18"/><g class="kpis">${repeat(4,i=>`<g transform="translate(${16+i*68} 16)"><rect width="58" height="54" rx="8"/><text x="9" y="17">KPI 0${i+1}</text><path d="M8 40 l10 -9 8 5 10 -17 12 8"/></g>`)}</g><g class="line-chart" transform="translate(18 92)"><rect width="166" height="135" rx="10"/><path d="M12 105 C35 92,45 98,62 70 S95 77,111 43 S138 54,154 17"/><path class="fill" d="M12 105 C35 92,45 98,62 70 S95 77,111 43 S138 54,154 17 L154 122H12Z"/></g><g class="donut" transform="translate(235 160)"><circle r="45"/><circle class="cut" r="30"/><path d="M0-45 A45 45 0 0 1 39 22"/></g><g class="bars" transform="translate(205 88)">${repeat(6,i=>`<rect x="${i*13}" y="${82-(i*9)%62}" width="8" height="${18+(i*9)%62}" rx="3"/>`)}</g></g>
      <text class="visual-label" x="45" y="25">RAW DATA</text><text class="visual-label alt" x="305" y="25">STRUCTURE & ANALYSE</text><text class="visual-label" x="565" y="25">INSIGHTS & ACTION</text>
    </svg>`);
  }

  function science(){
    const mesh=repeat(17,r=>{const pts=repeat(29,c=>{const x=270+c*13;const z=(c-14)/5;const y=220-r*6-70*Math.exp(-Math.pow(z+1.2,2))*Math.sin(r/7)-95*Math.exp(-Math.pow(z-1.5,2))*(.35+.65*Math.sin(r/5));return `${x.toFixed(1)},${y.toFixed(1)}`}).trim().replace(/ /g,' ');return `<polyline class="science-mesh" style="--i:${r}" points="${pts}"/>`});
    return wrap('science',`<svg viewBox="0 0 780 360" role="presentation">
      <defs><linearGradient id="dsg" x1="0" x2="1"><stop stop-color="#8754ff"/><stop offset="1" stop-color="#38cfff"/></linearGradient><filter id="dsGlow"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      <g class="science-cloud">${repeat(100,i=>`<circle style="--i:${i}" cx="${35+(i*43)%255}" cy="${55+(i*71)%210}" r="${1+(i%3)}"/>`)}</g>
      <g class="science-surface">${mesh}</g>
      <path class="science-arrow" d="M235 182 C315 140,500 150,650 177"/>
      <g class="science-target" transform="translate(690 177)"><circle r="55"/><circle r="38"/><circle r="20"/><path d="M-10 0l7 8 16-19"/></g>
      <text class="visual-label" x="50" y="30">RAW DATA</text><text class="visual-label alt" x="370" y="30">STATISTICAL MODELLING</text><text class="visual-label" x="640" y="30">DECISION INSIGHT</text>
    </svg>`);
  }

  function risk(){
    const curves=repeat(13,i=>{const pts=repeat(34,j=>{const x=110+j*14;const z=(j-16)/5.5;const y=237-i*4-105*Math.exp(-Math.pow(z-(i-6)/13,2))*(.45+i/22);return `${x.toFixed(1)},${y.toFixed(1)}`}).trim();return `<polyline class="risk-curve" style="--i:${i}" points="${pts}"/>`});
    return wrap('risk',`<svg viewBox="0 0 780 360" role="presentation">
      <defs><linearGradient id="rg" x1="0" x2="1"><stop stop-color="#c23b55"/><stop offset="1" stop-color="#e6a14b"/></linearGradient><radialGradient id="rhalo"><stop stop-color="#e6a14b" stop-opacity=".7"/><stop offset="1" stop-color="#c23b55" stop-opacity="0"/></radialGradient></defs>
      <g class="risk-surface">${curves}</g>
      <path class="risk-central" d="M110 238 C245 232,260 116,405 158 S560 205,650 178"/>
      ${repeat(8,i=>`<path class="risk-scenario" style="--i:${i}" d="M100 ${255-i*7} C230 ${245-i*8},300 ${112+i*4},440 ${165-i*2} S570 ${220-i*4},650 ${178}"/>`)}
      <g class="risk-target" transform="translate(690 178)">${repeat(4,i=>`<circle r="${18+i*15}"/>`)}<circle class="dot" r="5"/></g>
      <g class="risk-equation" transform="translate(460 292)"><text>Expected value</text><text class="formula">Σ probability × impact</text></g>
      <text class="visual-label" x="110" y="30">UNCERTAINTY SCENARIOS</text><text class="visual-label alt" x="370" y="30">RISK SURFACE</text><text class="visual-label" x="645" y="30">DECISION TARGET</text>
    </svg>`);
  }

  function growth(){
    return wrap('growth',`<svg viewBox="0 0 780 360" role="presentation">
      <defs><linearGradient id="gg" x1="0" x2="1"><stop stop-color="#e63d7c"/><stop offset="1" stop-color="#ff7a5d"/></linearGradient><filter id="gGlow"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      <g class="growth-cloud">${repeat(90,i=>`<circle style="--i:${i}" cx="${25+(i*41)%220}" cy="${55+(i*61)%230}" r="${1+(i%3)}"/>`)}</g>
      <path class="funnel-top" d="M210 75 C360 80,320 120,468 145 C540 158,555 170,590 177"/>
      <path class="funnel-bottom" d="M210 285 C360 280,320 240,468 215 C540 202,555 190,590 183"/>
      ${repeat(6,i=>`<path class="funnel-flow" style="--i:${i}" d="M200 ${80+i*38} C330 ${80+i*32},390 ${145+i*12},590 ${178+i%2*4}"/>`)}
      <g class="segment-card" transform="translate(310 113)"><rect width="145" height="134" rx="16"/><text x="18" y="24">AUDIENCE SEGMENTS</text>${['High intent','New visitors','Returning','Loyal'].map((x,i)=>`<circle cx="23" cy="${48+i*22}" r="5"/><text x="38" y="${52+i*22}">${x}</text><path d="M102 ${48+i*22}h25"/>`).join('')}</g>
      <g class="growth-core" transform="translate(625 180)"><circle r="48"/><text x="0" y="-3">GROWTH</text><text class="big" x="0" y="18">↗</text></g>
      <path class="growth-line" d="M660 258 l22-17 19 8 20-40 17 12 25-65"/>
      <text class="visual-label" x="45" y="30">ACQUIRE</text><text class="visual-label alt" x="340" y="30">ENGAGE · CONVERT</text><text class="visual-label" x="655" y="30">LEARN & GROW</text>
    </svg>`);
  }

  function operations(){
    const nodes=['Scope','Plan','Align','Execute','Report'];
    return wrap('operations',`<svg viewBox="0 0 780 360" role="presentation">
      <defs><linearGradient id="og" x1="0" x2="1"><stop stop-color="#4d8fe8"/><stop offset="1" stop-color="#f0b33f"/></linearGradient><filter id="oGlow"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      <g class="scattered">${repeat(17,i=>`<g style="--i:${i}" transform="translate(${35+(i*71)%235} ${55+(i*43)%225})"><circle r="8"/><path d="M-3 0h6M0-3v6"/></g>`)}</g>
      ${repeat(7,i=>`<path class="dependency" style="--i:${i}" d="M${80+(i*28)%180} ${75+(i*39)%190} C300 ${80+i*20},300 ${150+i*5},360 ${180}"/>`)}
      <path class="ops-line" d="M260 180 C350 180,390 180,700 180"/>
      ${nodes.map((x,i)=>`<g class="ops-node" style="--i:${i}" transform="translate(${340+i*78} 180)"><circle r="16"/><circle class="pulse" r="27"/><text x="0" y="46">${x}</text></g>`).join('')}
      <g class="ops-target" transform="translate(728 180)"><circle r="38"/><circle r="23"/><path d="M-9 0l7 8 17-20"/></g>
      <text class="visual-label" x="38" y="30">SCATTERED WORK</text><text class="visual-label alt" x="350" y="30">ALIGNED & COORDINATED</text><text class="visual-label" x="650" y="30">DELIVERED & VISIBLE</text>
    </svg>`);
  }

  window.NA_VISUALS={automation,strategy,analytics,science,risk,growth,operations};
})();
