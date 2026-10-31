/* Click a screenshot to see it full size; chevrons, arrow keys or swipe for the others.
   Same viewer as the app pages on johnbuckman.github.io. Works on any <img data-full>. */
(function(){
  var imgs=[].slice.call(document.querySelectorAll("img[data-full]"));
  if(!imgs.length) return;
  var seen={}, list=[];
  imgs.forEach(function(im){ var f=im.getAttribute("data-full"); if(!seen[f]){ seen[f]=list.length; list.push(im); } });
  var lb=document.createElement("div"); lb.className="lb"; lb.setAttribute("role","dialog"); lb.setAttribute("aria-modal","true");
  lb.innerHTML='<button class="close" aria-label="Close">✕</button><button class="prev" aria-label="Previous screenshot">‹</button><img alt=""><div class="cap"></div><button class="next" aria-label="Next screenshot">›</button>';
  document.body.appendChild(lb);
  var big=lb.querySelector("img"), cap=lb.querySelector(".cap"), i=0, last=null, x0=null;
  if(list.length<2){ lb.querySelector(".prev").style.display="none"; lb.querySelector(".next").style.display="none"; }
  function show(n){
    i=(n+list.length)%list.length;
    var im=list[i]; big.removeAttribute("style"); big.src=im.getAttribute("data-full"); big.alt=im.alt;
    cap.textContent=im.alt;
    if(list.length>1){ var s=document.createElement("span"); s.textContent=(i+1)+" / "+list.length; cap.appendChild(s); }
  }
  // full-size images are 2x: show them at their real on-screen size, smaller if the window is
  big.onload=function(){ big.style.width=Math.round(big.naturalWidth/2)+"px"; };
  function open(n){ last=document.activeElement; show(n); lb.classList.add("on"); document.body.style.overflow="hidden"; lb.querySelector(".close").focus(); }
  function close(){ lb.classList.remove("on"); document.body.style.overflow=""; if(last) last.focus(); }
  imgs.forEach(function(im){
    im.style.cursor="zoom-in"; im.tabIndex=0;
    var go=function(){ open(seen[im.getAttribute("data-full")]); };
    im.addEventListener("click",go);
    im.addEventListener("keydown",function(e){ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); go(); } });
  });
  lb.querySelector(".prev").onclick=function(){ show(i-1); };
  lb.querySelector(".next").onclick=function(){ show(i+1); };
  lb.querySelector(".close").onclick=close;
  lb.addEventListener("click",function(e){ if(e.target===lb) close(); });
  document.addEventListener("keydown",function(e){
    if(!lb.classList.contains("on")) return;
    if(e.key==="Escape") close(); else if(e.key==="ArrowLeft") show(i-1); else if(e.key==="ArrowRight") show(i+1);
  });
  lb.addEventListener("touchstart",function(e){ x0=e.touches[0].clientX; },{passive:true});
  lb.addEventListener("touchend",function(e){ if(x0===null) return; var d=e.changedTouches[0].clientX-x0; x0=null;
    if(Math.abs(d)>50) show(d<0?i+1:i-1); });
})();
