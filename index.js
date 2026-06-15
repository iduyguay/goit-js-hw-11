import{S as f,i as a}from"./assets/vendor-5ObWk2rO.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))i(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const n of r.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&i(n)}).observe(document,{childList:!0,subtree:!0});function o(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?r.credentials="include":e.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(e){if(e.ep)return;e.ep=!0;const r=o(e);fetch(e.href,r)}})();const m="4823621-792051e21e56534e6ae2e472f",h="https://pixabay.com/api/",d=document.querySelector("#search-form"),c=document.querySelector(".gallery"),l=document.querySelector(".loader-container");let p=new f(".gallery a",{captionsData:"alt",captionDelay:250});d.addEventListener("submit",g);function g(s){s.preventDefault();const t=s.currentTarget,o=t.elements.searchQuery.value.trim();if(o===""){a.warning({message:"Please enter a search keyword!",position:"topRight"});return}c.innerHTML="",b();const i=new URLSearchParams({key:m,q:o,image_type:"photo",orientation:"horizontal",safesearch:"true"});fetch(`${h}?${i}`).then(e=>{if(!e.ok)throw new Error(e.status);return e.json()}).then(e=>{if(e.hits.length===0){a.error({message:"Sorry, there are no images matching your search query. Please try again!",position:"topRight"});return}const r=y(e.hits);c.innerHTML=r,p.refresh()}).catch(e=>{console.error(e),a.error({message:"Something went wrong. Please try again later.",position:"topRight"})}).finally(()=>{L(),t.reset()})}function y(s){return s.map(({webformatURL:t,largeImageURL:o,tags:i,likes:e,views:r,comments:n,downloads:u})=>`
    <li class="gallery-item">
      <a class="gallery-link" href="${o}">
        <img class="gallery-image" src="${t}" alt="${i}" />
      </a>
      <div class="info-box">
        <p class="info-item"><b>Likes</b><br>${e}</p>
        <p class="info-item"><b>Views</b><br>${r}</p>
        <p class="info-item"><b>Comments</b><br>${n}</p>
        <p class="info-item"><b>Downloads</b><br>${u}</p>
      </div>
    </li>
  `).join("")}function b(){l.classList.remove("is-hidden")}function L(){l.classList.add("is-hidden")}
//# sourceMappingURL=index.js.map
