/**
 * Hasar & Boya Haritası — React Native WebView HTML
 * Araç parçalarına tıklanarak durum atanır (Orjinal/Boyalı/Değişen/Lokal)
 * Kaydet → window.ReactNativeWebView.postMessage(JSON)
 */

export const HASAR_HARITASI_HTML = `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
<title>Hasar & Boya Haritası</title>
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:        #F4F5F8;
  --surface:   #FFFFFF;
  --border:    rgba(0,0,0,0.07);
  --text:      #0D0D0D;
  --text2:     #6B7280;
  --text3:     #9CA3AF;
  --radius:    16px;
  --c-org:     #E2E4E8;
  --c-org-s:   #C8CACF;
  --c-paint:   #60A5FA;
  --c-paint-s: #1D6FD4;
  --c-replace: #FBBF24;
  --c-replace-s:#D97706;
  --c-local:   #34D399;
  --c-local-s: #059669;
}

body {
  background: var(--bg);
  font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif;
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 12px 8px 80px;
}

.card {
  width: 100%;
  max-width: 420px;
  background: var(--surface);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.08);
}

/* HEADER */
.header {
  padding: 14px 16px 12px;
  border-bottom: 1px solid var(--border);
  display: flex; justify-content: space-between; align-items: flex-start;
}
.h-title {
  font-size: 17px; font-weight: 800;
  letter-spacing: 0.02em; color: var(--text); line-height: 1;
}
.h-sub { font-size: 11px; color: var(--text3); margin-top: 3px; }
.h-reset {
  display: flex; align-items: center; gap: 4px;
  padding: 6px 10px;
  background: var(--bg); border-radius: 8px;
  border: 1px solid var(--border); cursor: pointer;
  font-size: 10px; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--text2);
}

/* DURUM SEÇİCİ */
.state-bar {
  padding: 10px 14px;
  background: var(--bg);
  display: flex; gap: 5px; align-items: center;
  border-bottom: 1px solid var(--border);
}
.state-lbl {
  font-size: 8px; font-weight: 700;
  letter-spacing: 0.4em; text-transform: uppercase;
  color: var(--text3); flex-shrink: 0; margin-right: 2px;
}
.s-btn {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 5px;
  padding: 8px 4px; border-radius: 9px;
  border: 2px solid transparent;
  background: var(--surface); cursor: pointer;
  user-select: none; -webkit-tap-highlight-color: transparent;
}
.s-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
.s-name {
  font-size: 10px; font-weight: 700;
  letter-spacing: 0.05em; text-transform: uppercase; line-height: 1;
}
.s-org  .s-dot { background: var(--c-org); border: 1.5px solid var(--c-org-s); }
.s-org  .s-name { color: var(--text2); }
.s-org.on { border-color: var(--c-org-s); background: rgba(200,202,207,0.15); }
.s-paint .s-dot { background: var(--c-paint); box-shadow: 0 0 5px rgba(96,165,250,0.5); }
.s-paint .s-name { color: #1D6FD4; }
.s-paint.on { border-color: var(--c-paint); background: rgba(96,165,250,0.08); }
.s-replace .s-dot { background: var(--c-replace); box-shadow: 0 0 5px rgba(251,191,36,0.5); }
.s-replace .s-name { color: #B45309; }
.s-replace.on { border-color: var(--c-replace); background: rgba(251,191,36,0.08); }
.s-local .s-dot { background: var(--c-local); box-shadow: 0 0 5px rgba(52,211,153,0.5); }
.s-local .s-name { color: #047857; }
.s-local.on { border-color: var(--c-local); background: rgba(52,211,153,0.08); }

/* SVG ALANI */
.car-area {
  padding: 12px 20px 10px;
  background: #F8F9FB;
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  border-bottom: 1px solid var(--border);
}
.view-label { align-self: stretch; display: flex; align-items: center; gap: 8px; }
.vl-txt {
  font-size: 7.5px; font-weight: 700;
  letter-spacing: 0.4em; text-transform: uppercase; color: var(--text3);
}
.vl-line { flex: 1; height: 1px; background: var(--border); }
.car-svg { width: 180px; height: 306px; filter: drop-shadow(0 4px 14px rgba(0,0,0,0.1)); }
.cp { cursor: pointer; transition: filter .12s, opacity .12s; }
.cp:hover { filter: brightness(0.88); }
.cp:active { opacity: 0.75; }
.st-org     { fill: var(--c-org);     stroke: var(--c-org-s);     stroke-width: 1.2; }
.st-paint   { fill: var(--c-paint);   stroke: var(--c-paint-s);   stroke-width: 1.5; }
.st-replace { fill: var(--c-replace); stroke: var(--c-replace-s); stroke-width: 1.5; }
.st-local   { fill: var(--c-local);   stroke: var(--c-local-s);   stroke-width: 1.5; }
.pt {
  font-family: -apple-system, Arial, sans-serif;
  font-size: 6px; font-weight: 700;
  letter-spacing: 0.05em; text-transform: uppercase;
  text-anchor: middle; dominant-baseline: middle;
  pointer-events: none; user-select: none;
}
.pt-org     { fill: rgba(0,0,0,0.38); }
.pt-paint   { fill: #1D4ED8; }
.pt-replace { fill: #92400E; }
.pt-local   { fill: #065F46; }

/* SAYAÇLAR */
.counts {
  display: flex; gap: 5px;
  padding: 8px 14px; border-bottom: 1px solid var(--border);
}
.count-item {
  flex: 1; display: flex; flex-direction: column; align-items: center;
  padding: 7px 3px; border-radius: 9px;
  border: 1.5px solid var(--border); background: var(--bg);
}
.count-item.has { border-color: transparent; }
.ci-dot { width: 8px; height: 8px; border-radius: 50%; margin-bottom: 3px; }
.ci-num { font-size: 20px; font-weight: 900; line-height: 1; color: var(--text); }
.ci-lbl { font-size: 7px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--text3); margin-top: 2px; text-align: center; }

/* AÇIKLAMA */
.desc-box {
  padding: 10px 14px; border-bottom: 1px solid var(--border);
  display: flex; align-items: flex-start; gap: 9px; min-height: 52px;
}
.db-icon { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0; }
.db-title { font-size: 13px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text); line-height: 1; margin-bottom: 3px; }
.db-text { font-size: 10px; line-height: 1.45; color: var(--text2); }

/* ÖZET */
.summary { padding: 8px 14px 2px; border-bottom: 1px solid var(--border); }
.sum-title { font-size: 8px; font-weight: 700; letter-spacing: 0.4em; text-transform: uppercase; color: var(--text3); margin-bottom: 6px; }
.sum-list { display: flex; flex-direction: column; gap: 4px; margin-bottom: 8px; }
.sum-item { display: flex; align-items: center; gap: 7px; padding: 5px 9px; border-radius: 7px; border: 1px solid var(--border); background: var(--bg); }
.sum-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.sum-state { font-size: 10px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; flex-shrink: 0; width: 58px; }
.sum-parts { font-size: 10px; color: var(--text2); flex: 1; line-height: 1.3; }
.sum-empty { font-size: 10px; color: var(--text3); font-style: italic; padding: 6px 9px; }

/* FOOTER */
.footer { padding: 12px 14px 16px; display: flex; gap: 7px; }
.f-btn {
  flex: 1; padding: 13px;
  border-radius: 11px; text-align: center;
  font-size: 13px; font-weight: 800;
  letter-spacing: 0.08em; text-transform: uppercase;
  cursor: pointer; border: none; user-select: none;
  -webkit-tap-highlight-color: transparent;
}
.f-sec { background: var(--bg); border: 1.5px solid var(--border); color: var(--text2); }
.f-pri { flex: 2; background: #0D0D0D; color: #fff; box-shadow: 0 4px 14px rgba(0,0,0,0.22); }
</style>
</head>
<body>
<div class="card">

  <div class="header">
    <div>
      <div class="h-title">Hasar &amp; Boya Haritası</div>
      <div class="h-sub">Parçaya dokun · Durumu işaretle</div>
    </div>
    <div class="h-reset" onclick="resetAll()">↺ Sıfırla</div>
  </div>

  <div class="state-bar">
    <div class="state-lbl">Fırça</div>
    <div class="s-btn s-org on" id="btn-org" onclick="pick('org')">
      <div class="s-dot"></div><div class="s-name">Orjinal</div>
    </div>
    <div class="s-btn s-paint" id="btn-paint" onclick="pick('paint')">
      <div class="s-dot"></div><div class="s-name">Boyalı</div>
    </div>
    <div class="s-btn s-replace" id="btn-replace" onclick="pick('replace')">
      <div class="s-dot"></div><div class="s-name">Değişen</div>
    </div>
    <div class="s-btn s-local" id="btn-local" onclick="pick('local')">
      <div class="s-dot"></div><div class="s-name">Lokal</div>
    </div>
  </div>

  <div class="car-area">
    <div class="view-label">
      <div class="vl-txt">Üstten Görünüm</div>
      <div class="vl-line"></div>
    </div>

    <svg class="car-svg" viewBox="0 0 240 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gl" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stop-color="rgba(185,220,250,0.55)"/>
          <stop offset="100%" stop-color="rgba(145,190,230,0.30)"/>
        </linearGradient>
        <radialGradient id="wg" cx="38%" cy="32%" r="65%">
          <stop offset="0%"   stop-color="#D0D0D0"/>
          <stop offset="100%" stop-color="#989898"/>
        </radialGradient>
        <radialGradient id="wj" cx="38%" cy="32%" r="65%">
          <stop offset="0%"   stop-color="#ECECEC"/>
          <stop offset="100%" stop-color="#C8C8C8"/>
        </radialGradient>
      </defs>

      <ellipse cx="120" cy="200" rx="95" ry="185" fill="rgba(0,0,0,0.05)"/>

      <!-- ÖN TAMPON -->
      <g class="cp" onclick="tap('front-bumper')">
        <path id="s-front-bumper"
          d="M68 12 C68 8 72 6 80 5 L160 5 C168 5 172 8 172 12
             L174 30 C174 33 171 35 168 35 L72 35 C69 35 66 33 66 30 Z"
          class="st-org"/>
        <text id="t-front-bumper" x="120" y="23" class="pt pt-org">ÖN TAMPON</text>
      </g>

      <!-- KAPUT -->
      <g class="cp" onclick="tap('hood')">
        <path id="s-hood"
          d="M72 35 L168 35 L170 82 C170 85 167 87 164 87 L76 87 C73 87 70 85 70 82 Z"
          class="st-org"/>
        <text id="t-hood" x="120" y="62" class="pt pt-org">KAPUT</text>
      </g>

      <!-- SOL ÖN ÇAMURLUK -->
      <g class="cp" onclick="tap('fl-fender')">
        <path id="s-fl-fender"
          d="M38 52 C30 56 22 68 18 82 C14 96 14 112 16 122
             C18 130 22 135 28 137 L70 135 L70 52 Z"
          class="st-org"/>
        <text id="t-fl-fender" x="44" y="95" class="pt pt-org" transform="rotate(-90 44 95)">SOL Ö.ÇMR</text>
      </g>

      <!-- SAĞ ÖN ÇAMURLUK -->
      <g class="cp" onclick="tap('fr-fender')">
        <path id="s-fr-fender"
          d="M202 52 C210 56 218 68 222 82 C226 96 226 112 224 122
             C222 130 218 135 212 137 L170 135 L170 52 Z"
          class="st-org"/>
        <text id="t-fr-fender" x="196" y="95" class="pt pt-org" transform="rotate(90 196 95)">SAĞ Ö.ÇMR</text>
      </g>

      <!-- SOL ÖN KAPI -->
      <g class="cp" onclick="tap('fl-door')">
        <path id="s-fl-door"
          d="M16 138 L70 135 L70 198 L16 198
             C14 198 13 197 13 195 L13 141 C13 139 14 138 16 138 Z"
          class="st-org"/>
        <text id="t-fl-door" x="41" y="167" class="pt pt-org" transform="rotate(-90 41 167)">SOL Ö.KAPI</text>
      </g>

      <!-- SAĞ ÖN KAPI -->
      <g class="cp" onclick="tap('fr-door')">
        <path id="s-fr-door"
          d="M224 138 L170 135 L170 198 L224 198
             C226 198 227 197 227 195 L227 141 C227 139 226 138 224 138 Z"
          class="st-org"/>
        <text id="t-fr-door" x="199" y="167" class="pt pt-org" transform="rotate(90 199 167)">SAĞ Ö.KAPI</text>
      </g>

      <!-- TAVAN -->
      <g class="cp" onclick="tap('roof')">
        <path id="s-roof" d="M70 87 L170 87 L170 295 L70 295 Z" class="st-org"/>
        <text id="t-roof" x="120" y="195" class="pt pt-org">TAVAN</text>
      </g>

      <!-- SOL ARKA KAPI -->
      <g class="cp" onclick="tap('rl-door')">
        <path id="s-rl-door"
          d="M16 200 L70 200 L70 268 L16 268
             C14 268 13 267 13 265 L13 203 C13 201 14 200 16 200 Z"
          class="st-org"/>
        <text id="t-rl-door" x="41" y="234" class="pt pt-org" transform="rotate(-90 41 234)">SOL A.KAPI</text>
      </g>

      <!-- SAĞ ARKA KAPI -->
      <g class="cp" onclick="tap('rr-door')">
        <path id="s-rr-door"
          d="M224 200 L170 200 L170 268 L224 268
             C226 268 227 267 227 265 L227 203 C227 201 226 200 224 200 Z"
          class="st-org"/>
        <text id="t-rr-door" x="199" y="234" class="pt pt-org" transform="rotate(90 199 234)">SAĞ A.KAPI</text>
      </g>

      <!-- SOL ARKA ÇAMURLUK -->
      <g class="cp" onclick="tap('rl-fender')">
        <path id="s-rl-fender"
          d="M16 270 L70 270 L70 330 L28 333
             C22 332 17 328 15 322 C12 312 12 295 14 283 Z"
          class="st-org"/>
        <text id="t-rl-fender" x="42" y="302" class="pt pt-org" transform="rotate(-90 42 302)">SOL A.ÇMR</text>
      </g>

      <!-- SAĞ ARKA ÇAMURLUK -->
      <g class="cp" onclick="tap('rr-fender')">
        <path id="s-rr-fender"
          d="M224 270 L170 270 L170 330 L212 333
             C218 332 223 328 225 322 C228 312 228 295 226 283 Z"
          class="st-org"/>
        <text id="t-rr-fender" x="198" y="302" class="pt pt-org" transform="rotate(90 198 302)">SAĞ A.ÇMR</text>
      </g>

      <!-- BAGAJ -->
      <g class="cp" onclick="tap('trunk')">
        <path id="s-trunk"
          d="M70 295 L170 295 L168 338 C166 342 162 344 158 344
             L82 344 C78 344 74 342 72 338 Z"
          class="st-org"/>
        <text id="t-trunk" x="120" y="317" class="pt pt-org">BAGAJ</text>
      </g>

      <!-- ARKA TAMPON -->
      <g class="cp" onclick="tap('rear-bumper')">
        <path id="s-rear-bumper"
          d="M72 344 L168 344 C171 344 173 346 173 349
             L171 366 C171 370 167 372 162 372
             L78 372 C73 372 69 370 69 366 L67 349 C67 346 69 344 72 344 Z"
          class="st-org"/>
        <text id="t-rear-bumper" x="120" y="356" class="pt pt-org">ARKA TAMPON</text>
      </g>

      <!-- Tekerlekler (statik) -->
      <g><circle cx="16" cy="100" r="17" fill="#888" stroke="#666" stroke-width="1.2"/>
         <circle cx="16" cy="100" r="13" fill="url(#wg)" stroke="#999" stroke-width="1"/>
         <circle cx="16" cy="100" r="8"  fill="url(#wj)" stroke="#B0B0B0" stroke-width="0.8"/>
         <line x1="16" y1="93" x2="16" y2="107" stroke="rgba(0,0,0,0.2)" stroke-width="1.2"/>
         <line x1="9"  y1="96" x2="23" y2="104" stroke="rgba(0,0,0,0.2)" stroke-width="1.2"/>
         <line x1="9"  y1="104" x2="23" y2="96" stroke="rgba(0,0,0,0.2)" stroke-width="1.2"/>
         <circle cx="16" cy="100" r="3" fill="#A8A8A8"/></g>
      <g><circle cx="224" cy="100" r="17" fill="#888" stroke="#666" stroke-width="1.2"/>
         <circle cx="224" cy="100" r="13" fill="url(#wg)" stroke="#999" stroke-width="1"/>
         <circle cx="224" cy="100" r="8"  fill="url(#wj)" stroke="#B0B0B0" stroke-width="0.8"/>
         <line x1="224" y1="93" x2="224" y2="107" stroke="rgba(0,0,0,0.2)" stroke-width="1.2"/>
         <line x1="217" y1="96" x2="231" y2="104" stroke="rgba(0,0,0,0.2)" stroke-width="1.2"/>
         <line x1="217" y1="104" x2="231" y2="96" stroke="rgba(0,0,0,0.2)" stroke-width="1.2"/>
         <circle cx="224" cy="100" r="3" fill="#A8A8A8"/></g>
      <g><circle cx="16" cy="305" r="17" fill="#888" stroke="#666" stroke-width="1.2"/>
         <circle cx="16" cy="305" r="13" fill="url(#wg)" stroke="#999" stroke-width="1"/>
         <circle cx="16" cy="305" r="8"  fill="url(#wj)" stroke="#B0B0B0" stroke-width="0.8"/>
         <line x1="16" y1="298" x2="16" y2="312" stroke="rgba(0,0,0,0.2)" stroke-width="1.2"/>
         <line x1="9"  y1="301" x2="23" y2="309" stroke="rgba(0,0,0,0.2)" stroke-width="1.2"/>
         <line x1="9"  y1="309" x2="23" y2="301" stroke="rgba(0,0,0,0.2)" stroke-width="1.2"/>
         <circle cx="16" cy="305" r="3" fill="#A8A8A8"/></g>
      <g><circle cx="224" cy="305" r="17" fill="#888" stroke="#666" stroke-width="1.2"/>
         <circle cx="224" cy="305" r="13" fill="url(#wg)" stroke="#999" stroke-width="1"/>
         <circle cx="224" cy="305" r="8"  fill="url(#wj)" stroke="#B0B0B0" stroke-width="0.8"/>
         <line x1="224" y1="298" x2="224" y2="312" stroke="rgba(0,0,0,0.2)" stroke-width="1.2"/>
         <line x1="217" y1="301" x2="231" y2="309" stroke="rgba(0,0,0,0.2)" stroke-width="1.2"/>
         <line x1="217" y1="309" x2="231" y2="301" stroke="rgba(0,0,0,0.2)" stroke-width="1.2"/>
         <circle cx="224" cy="305" r="3" fill="#A8A8A8"/></g>

      <!-- Camlar -->
      <path d="M88 40 L152 40 L153 82 L87 82 Z" fill="url(#gl)" stroke="rgba(100,160,210,0.2)" stroke-width="0.8" pointer-events="none" opacity="0.7"/>
      <path d="M86 297 L154 297 L152 340 L88 340 Z" fill="url(#gl)" stroke="rgba(100,160,210,0.18)" stroke-width="0.8" pointer-events="none" opacity="0.6"/>

      <!-- Aynalar -->
      <path d="M13 136 C8 136 4 133 4 129 C4 125 7 123 11 123 L18 124 L18 136 Z" fill="#D0D0D0" stroke="#B8B8B8" stroke-width="0.8"/>
      <path d="M227 136 C232 136 236 133 236 129 C236 125 233 123 229 123 L222 124 L222 136 Z" fill="#D0D0D0" stroke="#B8B8B8" stroke-width="0.8"/>

      <!-- Farlar -->
      <path d="M70 6 C68 6 67 8 67 10 L67 28 L78 28 L78 6 Z" fill="rgba(255,255,200,0.6)" stroke="rgba(200,180,0,0.3)" stroke-width="0.8"/>
      <path d="M170 6 C172 6 173 8 173 10 L173 28 L162 28 L162 6 Z" fill="rgba(255,255,200,0.6)" stroke="rgba(200,180,0,0.3)" stroke-width="0.8"/>
      <path d="M70 344 L72 372 L80 372 L80 344 Z" fill="rgba(220,50,50,0.5)" stroke="rgba(180,0,0,0.3)" stroke-width="0.8"/>
      <path d="M170 344 L168 372 L160 372 L160 344 Z" fill="rgba(220,50,50,0.5)" stroke="rgba(180,0,0,0.3)" stroke-width="0.8"/>

      <!-- Kapı çizgileri -->
      <line x1="13" y1="200" x2="70" y2="200" stroke="rgba(0,0,0,0.12)" stroke-width="1"/>
      <line x1="170" y1="200" x2="227" y2="200" stroke="rgba(0,0,0,0.12)" stroke-width="1"/>
      <line x1="70" y1="87" x2="70" y2="295" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>
      <line x1="170" y1="87" x2="170" y2="295" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>
    </svg>
  </div>

  <!-- SAYAÇLAR -->
  <div class="counts">
    <div class="count-item" id="ci-org">
      <div class="ci-dot" style="background:var(--c-org);border:1.5px solid var(--c-org-s)"></div>
      <div class="ci-num" id="cn-org">13</div>
      <div class="ci-lbl">Orjinal</div>
    </div>
    <div class="count-item" id="ci-paint">
      <div class="ci-dot" style="background:var(--c-paint)"></div>
      <div class="ci-num" id="cn-paint" style="color:var(--c-paint-s)">0</div>
      <div class="ci-lbl">Boyalı</div>
    </div>
    <div class="count-item" id="ci-replace">
      <div class="ci-dot" style="background:var(--c-replace)"></div>
      <div class="ci-num" id="cn-replace" style="color:var(--c-replace-s)">0</div>
      <div class="ci-lbl">Değişen</div>
    </div>
    <div class="count-item" id="ci-local">
      <div class="ci-dot" style="background:var(--c-local)"></div>
      <div class="ci-num" id="cn-local" style="color:var(--c-local-s)">0</div>
      <div class="ci-lbl">Lokal</div>
    </div>
  </div>

  <!-- AÇIKLAMA -->
  <div class="desc-box" id="descBox">
    <div class="db-icon" id="descIcon" style="background:#F4F5F8">⚪</div>
    <div class="db-content">
      <div class="db-title" id="descTitle">Orjinal</div>
      <div class="db-text" id="descText">Tüm parçalar orijinaldir.</div>
    </div>
  </div>

  <!-- ÖZET -->
  <div class="summary">
    <div class="sum-title">Durum Özeti</div>
    <div class="sum-list" id="sumList">
      <div class="sum-empty" id="sumEmpty">Henüz parça işaretlenmedi.</div>
    </div>
  </div>

  <!-- FOOTER -->
  <div class="footer">
    <button class="f-btn f-sec" onclick="resetAll()">↺ Temizle</button>
    <button class="f-btn f-pri" onclick="save()">Kaydet ↑</button>
  </div>

</div>

<script>
const PARTS = [
  { id: 'front-bumper', name: 'Ön Tampon' },
  { id: 'hood',         name: 'Kaput' },
  { id: 'fl-fender',   name: 'Sol Ön Çamurluk' },
  { id: 'fr-fender',   name: 'Sağ Ön Çamurluk' },
  { id: 'fl-door',     name: 'Sol Ön Kapı' },
  { id: 'fr-door',     name: 'Sağ Ön Kapı' },
  { id: 'roof',        name: 'Tavan' },
  { id: 'rl-door',     name: 'Sol Arka Kapı' },
  { id: 'rr-door',     name: 'Sağ Arka Kapı' },
  { id: 'rl-fender',   name: 'Sol Arka Çamurluk' },
  { id: 'rr-fender',   name: 'Sağ Arka Çamurluk' },
  { id: 'trunk',       name: 'Bagaj Kapağı' },
  { id: 'rear-bumper', name: 'Arka Tampon' },
];

const STATE_CFG = {
  org:     { icon: '⚪', bg: '#F4F5F8', title: 'Orjinal',  color: 'rgba(0,0,0,0.45)', text: 'Tüm parçalar orijinaldir.' },
  paint:   { icon: '🔵', bg: '#EFF6FF', title: 'Boyalı',   color: '#1D4ED8',           text: 'Bu parça orijinal olup boyalanmıştır.' },
  replace: { icon: '🟡', bg: '#FFFBEB', title: 'Değişen',  color: '#B45309',           text: 'Bu parça yeni parça ile değiştirilmiştir.' },
  local:   { icon: '🟢', bg: '#ECFDF5', title: 'Lokal',    color: '#047857',           text: 'Lokal boya yapılmıştır.' },
};

const FILL_CLASS = { org:'st-org', paint:'st-paint', replace:'st-replace', local:'st-local' };
const TEXT_CLASS = { org:'pt-org', paint:'pt-paint', replace:'pt-replace', local:'pt-local' };

let brush = 'org';
let state = {};
PARTS.forEach(p => state[p.id] = 'org');

function pick(s) {
  brush = s;
  document.querySelectorAll('.s-btn').forEach(b => b.classList.remove('on'));
  document.getElementById('btn-' + s).classList.add('on');
  updateDesc();
}

function tap(id) {
  state[id] = brush;
  applyPartStyle(id);
  updateCounts();
  updateSummary();
  const el = document.getElementById('s-' + id);
  if (el) { el.style.filter='brightness(0.7)'; setTimeout(()=>el.style.filter='',120); }
}

function applyPartStyle(id) {
  const shape = document.getElementById('s-' + id);
  const txt   = document.getElementById('t-' + id);
  if (shape) shape.className.baseVal = FILL_CLASS[state[id]];
  if (txt)   txt.className.baseVal   = 'pt ' + TEXT_CLASS[state[id]];
}

function updateCounts() {
  const cnt = { org:0, paint:0, replace:0, local:0 };
  Object.values(state).forEach(v => cnt[v]++);
  ['org','paint','replace','local'].forEach(s => {
    document.getElementById('cn-' + s).textContent = cnt[s];
    const ci = document.getElementById('ci-' + s);
    ci.classList.toggle('has', cnt[s] > 0 && s !== 'org');
    if (s !== 'org') {
      ci.style.background  = cnt[s] > 0 ? (s==='paint'?'rgba(96,165,250,0.08)':s==='replace'?'rgba(251,191,36,0.08)':'rgba(52,211,153,0.08)') : '';
      ci.style.borderColor = cnt[s] > 0 ? (s==='paint'?'var(--c-paint)':s==='replace'?'var(--c-replace)':'var(--c-local)') : '';
    }
  });
}

function updateDesc() {
  const cfg = STATE_CFG[brush];
  const box = document.getElementById('descBox');
  box.style.background = cfg.bg;
  document.getElementById('descIcon').textContent  = cfg.icon;
  document.getElementById('descIcon').style.background = cfg.bg;
  document.getElementById('descTitle').textContent = cfg.title;
  document.getElementById('descTitle').style.color = cfg.color;
  document.getElementById('descText').textContent  = cfg.text;
}

function updateSummary() {
  const groups = { paint:[], replace:[], local:[] };
  PARTS.forEach(p => { if (state[p.id] !== 'org') groups[state[p.id]].push(p.name); });
  const list  = document.getElementById('sumList');
  const empty = document.getElementById('sumEmpty');
  const hasAny = groups.paint.length + groups.replace.length + groups.local.length > 0;
  if (empty) empty.style.display = hasAny ? 'none' : 'block';
  ['paint','replace','local'].forEach(s => {
    let row = document.getElementById('sum-row-' + s);
    if (groups[s].length === 0) { if (row) row.remove(); return; }
    const cfg = STATE_CFG[s];
    if (!row) {
      row = document.createElement('div');
      row.className = 'sum-item'; row.id = 'sum-row-' + s;
      list.appendChild(row);
    }
    row.innerHTML = '<div class="sum-dot" style="background:var(--c-' + s + ')"></div>'
      + '<div class="sum-state" style="color:' + cfg.color + '">' + cfg.title + '</div>'
      + '<div class="sum-parts">' + groups[s].join(', ') + '</div>';
  });
}

function resetAll() {
  PARTS.forEach(p => { state[p.id]='org'; applyPartStyle(p.id); });
  updateCounts(); updateSummary();
}

function save() {
  const result = {};
  PARTS.forEach(p => {
    if (state[p.id] !== 'org') result[p.id] = { name: p.name, status: state[p.id] };
  });
  const json = JSON.stringify(result);
  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(json);
  } else {
    console.log('Ekspertiz data:', json);
  }
}

function loadInitialState(data) {
  PARTS.forEach(p => { state[p.id]='org'; applyPartStyle(p.id); });
  if (!data) return;
  Object.keys(data).forEach(id => {
    if (state.hasOwnProperty(id) && data[id].status) {
      state[id] = data[id].status;
      applyPartStyle(id);
    }
  });
  updateCounts(); updateSummary(); updateDesc();
}

updateDesc();
</script>
</body>
</html>`;
