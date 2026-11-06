function e(){let e=document.getElementById(`cagp-bottom-nav`),t=document.getElementById(`cagp-bottom-nav-container`);if(!e||!t)return;let n=e.getAttribute(`data-catalog`),r=e.getAttribute(`data-defaults`);if(!n||!r)return;let i=[],a=[];try{i=JSON.parse(n),a=JSON.parse(r)}catch{return}let o=new Map(i.map(e=>[e.id,e]));function s(){try{let e=localStorage.getItem(`cagp_discente_shortcuts_v1`);if(e){let t=JSON.parse(e);if(Array.isArray(t)&&t.length>=1)return t}}catch{}return a}function c(){if(!t)return;let e=(document.documentElement.dataset.baseUrl||`/`).replace(/\/$/,``),n=window.location.pathname;e&&n.startsWith(e)&&(n=n.slice(e.length)||`/`),t.querySelectorAll(`.cagp-nav-item[data-match]`).forEach(e=>{let t=e.getAttribute(`data-match`);if(t)try{let r=JSON.parse(t).some(e=>new RegExp(e).test(n)||e===`^/$`&&(n===``||n===`/`||n===`/index.html`));e.classList.toggle(`is-active`,r),r?e.setAttribute(`aria-current`,`page`):e.removeAttribute(`aria-current`)}catch{}})}function l(){if(!t)return;let e=s(),n=(document.documentElement.dataset.baseUrl||`/`).replace(/\/$/,``),r=window.location.pathname;n&&r.startsWith(n)&&(r=r.slice(n.length)||`/`);let a=e.map(e=>{let t=o.get(e)||i[0],n=!!(t.isAction&&t.actionEvent),a=t.match||[],s=a.some(e=>new RegExp(e).test(r)||e===`^/$`&&(r===``||r===`/index.html`));return`
            <a
              href="${t.href}"
              data-shortcut-id="${t.id}"
              data-match='${JSON.stringify(a)}'
              ${n?`data-action="${t.actionEvent}"`:``}
              class="cagp-nav-item relative flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-1 py-0.5 rounded-xl transition-all duration-200 no-underline cursor-pointer ${s?`is-active text-[#8B1E2D]`:`text-gray-600 hover:text-[#8B1E2D]`}"
              ${s?`aria-current="page"`:``}
              aria-label="${t.fullLabel}"
              title="${t.fullLabel}"
            >
              <div class="cagp-nav-icon-circle w-7 h-7 min-w-[28px] min-h-[28px] rounded-full flex items-center justify-center transition-all duration-200 relative text-gray-700">
                <i class="bi ${t.icon} text-base transition-transform duration-200" aria-hidden="true"></i>
                <span class="cagp-nav-active-dot absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-[#8B1E2D] ring-2 ring-white opacity-0 transition-opacity duration-200" aria-hidden="true"></span>
              </div>
              <span class="text-[11px] font-['Oswald'] uppercase font-bold tracking-tight leading-none mt-1 text-center">
                ${t.label}
              </span>
            </a>
          `}).join(``);t.innerHTML=a+`<div class="h-5 w-[1.5px] bg-[#DFDBD2] mx-0.5" aria-hidden="true"></div>
        <button
          type="button"
          id="cagp-bottom-nav-customize-btn"
          class="cagp-nav-item flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-1 py-0.5 rounded-xl text-gray-500 hover:text-[#8B1E2D] hover:bg-[#F7F5F0] transition-colors cursor-pointer border-none bg-transparent"
          title="Personalizar atalhos da barra"
          aria-label="Personalizar atalhos da barra inferior"
        >
          <div class="w-7 h-7 min-w-[28px] min-h-[28px] rounded-full flex items-center justify-center">
            <i class="bi bi-sliders2 text-base" aria-hidden="true"></i>
          </div>
          <span class="text-[11px] font-['Oswald'] uppercase font-bold tracking-tight leading-none mt-1 text-center">
            Ajustes
          </span>
        </button>
      `,u()}function u(){t&&(t.querySelector(`#cagp-bottom-nav-customize-btn`)?.addEventListener(`click`,()=>{window.dispatchEvent(new CustomEvent(`cagp:open-shortcuts`))}),t.querySelectorAll(`[data-action]`).forEach(e=>{e.addEventListener(`click`,t=>{t.preventDefault();let n=e.getAttribute(`data-action`);n===`cagp:toggle-drawer`?window.__cagp_toggle_drawer?window.__cagp_toggle_drawer():window.dispatchEvent(new CustomEvent(`cagp:toggle-drawer`)):n&&window.dispatchEvent(new CustomEvent(n))})}))}let d=Array.from(t.querySelectorAll(`.cagp-nav-item[data-shortcut-id]`)).map(e=>e.getAttribute(`data-shortcut-id`)),f=s();d.length===f.length&&d.every((e,t)=>e===f[t])&&d.length>0?(c(),u()):l()}e(),document.addEventListener(`astro:page-load`,e),window.addEventListener(`cagp:vault-updated`,t=>{let n=t;n.detail&&n.detail.key!==`cagp_discente_shortcuts_v1`||e()});