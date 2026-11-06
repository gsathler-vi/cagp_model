var e={candangos:{bg:`#9E2424`,color:`#E8A317`,icon:`bi-bank`},monogram:{bg:`#0A0A0A`,color:`#E8A317`,text:`Iniciais`},fafich:{bg:`#005A9C`,color:`#E8A317`,icon:`bi-building`},republica:{bg:`#15803D`,color:`#FFFFFF`,icon:`bi-house-heart-fill`},formando:{bg:`#8B1E2D`,color:`#E8A317`,icon:`bi-mortarboard-fill`},pesquisador:{bg:`#0A0A0A`,color:`#FFFFFF`,icon:`bi-person-badge-fill`},estudante_f:{bg:`#2A6264`,color:`#FFFFFF`,icon:`bi-person-standing-dress`},estudante_m:{bg:`#5B2E85`,color:`#FFFFFF`,icon:`bi-person-fill`}};function t(t,n=`md`){if(!t)return`<span class="w-full h-full flex items-center justify-center text-gray-500 bg-[#F7F5F0]"><i class="bi bi-person-fill text-lg" aria-hidden="true"></i></span>`;if(t.photoDataUrl)return`<img src="${t.photoDataUrl}" alt="${t.name||`Estudante`}" class="w-full h-full object-cover rounded-[2px]" />`;let r=t.name?t.name.split(` `).filter(Boolean).slice(0,2).map(e=>e[0].toUpperCase()).join(``):`GP`,i=t.avatarPreset||`candangos`,a=e[i]||e.candangos,o=t.prideChoice&&t.prideChoice!==`none`?`<span class="cagp-pride-pin cagp-pride-swatch--${t.prideChoice}" aria-hidden="true"></span>`:``;return i===`monogram`?`
      <span class="w-full h-full flex items-center justify-center font-['Oswald'] font-bold text-xs uppercase" style="background-color: ${a.bg}; color: ${a.color};">
        ${r}
      </span>
      ${o}
    `:a.icon?`
      <span class="w-full h-full flex items-center justify-center text-sm" style="background-color: ${a.bg}; color: ${a.color};">
        <i class="bi ${a.icon}" aria-hidden="true"></i>
      </span>
      ${o}
    `:`
    <span class="w-full h-full flex items-center justify-center font-['Oswald'] font-bold text-xs" style="background-color: ${a.bg}; color: ${a.color};">
      ${r}
    </span>
    ${o}
  `}export{t};