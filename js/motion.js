// Shared motion layer: Lenis smooth scroll driving GSAP ScrollTrigger, plus the reveals every page uses.
// Pages load gsap, ScrollTrigger and lenis before this file; page scripts read window.SITE afterwards.
(()=>{
const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches, fine=matchMedia('(pointer:fine)').matches;
const SVG={
 leaf:'<svg viewBox="0 0 40 60"><path d="M20 2C38 20 38 45 20 58 2 45 2 20 20 2Z" fill="#5aa646"/><path d="M20 10V56" stroke="#2f6b26" stroke-width="2"/></svg>',
 garlic:'<svg viewBox="0 0 40 50"><path d="M20 2C24 12 36 20 34 36 32 48 8 48 6 36 4 20 16 12 20 2Z" fill="#f3e6c8"/></svg>',
 chilli:'<svg viewBox="0 0 40 60"><path d="M8 4C32 2 40 28 30 58 24 40 14 24 8 4Z" fill="#c0301c"/><path d="M8 4l-4-3" stroke="#5aa646" stroke-width="3"/></svg>',
 pepper:'<svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="9" fill="#1c1410" stroke="#3a2a20"/></svg>'
};
const G=window.gsap, ST=window.ScrollTrigger;
const SITE=window.SITE={reduced,fine,SVG,gsap:G,lenis:null};
if(G&&ST) G.registerPlugin(ST);

// Lenis owns the scroll; ScrollTrigger listens to it and GSAP's ticker drives its frames
if(!reduced&&window.Lenis&&G){
  const lenis=SITE.lenis=new Lenis({lerp:.09,wheelMultiplier:1});
  lenis.on('scroll',ST.update);
  G.ticker.add(t=>lenis.raf(t*1000)); G.ticker.lagSmoothing(0);
}
// in-page anchors glide through Lenis (offset clears the fixed nav)
document.addEventListener('click',e=>{
  const a=e.target.closest('a[href^="#"]'); if(!a||a.getAttribute('href').length<2)return;
  const t=document.querySelector(a.getAttribute('href')); if(!t)return;
  e.preventDefault();
  SITE.lenis?SITE.lenis.scrollTo(t,{offset:-70,duration:1.4}):t.scrollIntoView({behavior:reduced?'auto':'smooth'});
});

// floating ingredient graphics behind [data-wm] sections
document.querySelectorAll('[data-wm]').forEach((s,k)=>[["leaf",6,10],["chilli",78,50],["garlic",40,70]].forEach(([t,x,y])=>
  s.insertAdjacentHTML('afterbegin',SVG[t].replace('<svg','<svg aria-hidden="true" style="left:'+x+'%;top:'+y+'%"')) ));

// marquee: endless GSAP loop that speeds up and skews with scroll velocity
SITE.marquee=(track,html)=>{
  track.innerHTML=html+html+html+html;
  if(reduced||!G)return;
  const loop=G.to(track,{xPercent:-50,duration:28,ease:'none',repeat:-1});
  let dir=1, skew=0; const setSkew=G.quickSetter(track,'skewX','deg');
  ST.create({onUpdate:s=>{const v=s.getVelocity()/300; dir=s.direction;
    loop.timeScale(dir*(1+Math.min(4,Math.abs(v))*.5)); skew=G.utils.clamp(-8,8,-v); }});
  // ease back to cruising speed and zero skew once scrolling stops
  G.ticker.add(()=>{ loop.timeScale(loop.timeScale()*.95+dir*.05); skew*=.9; setSkew(skew); });
};

// split headings into words; each word rises out of its own clipped line
SITE.split=el=>{
  el.innerHTML=el.textContent.trim().split(/\s+/).map(w=>`<span class="w"><span>${w}</span></span>`).join(' ');
  return el.querySelectorAll('.w>span');
};

const nav=document.querySelector('nav'), bar=document.querySelector('.progress'), curtain=document.querySelector('.curtain');

if(reduced||!G){ document.querySelectorAll('[data-rv]').forEach(e=>e.style.opacity=1); }
else{
  document.querySelectorAll('[data-split]').forEach(el=>G.from(SITE.split(el),{yPercent:115,rotate:4,duration:1,ease:'power4.out',stagger:.06,
    scrollTrigger:{trigger:el,start:'top 88%'}}));
  G.set('[data-rv]',{opacity:0,y:50});
  ST.batch('[data-rv]',{start:'top 90%',onEnter:els=>G.to(els,{opacity:1,y:0,duration:.9,ease:'power3.out',stagger:.09,overwrite:true})});
  // parallax on anything tagged data-speed (fraction of scroll distance)
  document.querySelectorAll('[data-speed]').forEach(el=>G.to(el,{yPercent:-100*el.dataset.speed,ease:'none',
    scrollTrigger:{trigger:el.parentElement,start:'top bottom',end:'bottom top',scrub:true}}));
  document.querySelectorAll('.wm>svg').forEach((s,i)=>{
    G.to(s,{rotate:i%2?14:-12,y:16,duration:4+i,ease:'sine.inOut',yoyo:true,repeat:-1});
    G.to(s,{yPercent:-120*(i%3+1),ease:'none',scrollTrigger:{trigger:s.parentElement,start:'top bottom',end:'bottom top',scrub:true}});
  });
  if(bar) G.to(bar,{scaleX:1,ease:'none',scrollTrigger:{start:0,end:'max',scrub:.3}});
  if(nav) ST.create({start:0,end:'max',onUpdate:s=>{const y=s.scroll();
    nav.classList.toggle('solid',y>40); nav.classList.toggle('away',s.direction===1&&y>300); }});
  // magnetic primary buttons
  if(fine) document.querySelectorAll('.btn.fill').forEach(b=>{
    const qx=G.quickTo(b,'x',{duration:.4,ease:'power3'}), qy=G.quickTo(b,'y',{duration:.4,ease:'power3'});
    b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect(); qx((e.clientX-r.left-r.width/2)*.3); qy((e.clientY-r.top-r.height/2)*.4);});
    b.addEventListener('pointerleave',()=>{qx(0);qy(0)});
  });
  // FAQ: animate open/close height instead of the native snap
  document.querySelectorAll('.faq details').forEach(d=>{
    const s=d.querySelector('summary'), a=d.querySelector('.a');
    s.addEventListener('click',e=>{ e.preventDefault();
      if(d.open) G.to(a,{height:0,duration:.4,ease:'power2.inOut',onComplete:()=>{d.open=false;G.set(a,{clearProps:'height'})}});
      else{ d.open=true; G.from(a,{height:0,duration:.5,ease:'power2.out'}); G.from(a.children,{y:16,opacity:0,duration:.5,delay:.1}); }
    });
  });
  // page transitions: the mustard curtain wipes up when leaving, and away again on arrival
  if(curtain){
    let came=false; try{came=sessionStorage.getItem('bh-curtain')==='1'; sessionStorage.removeItem('bh-curtain');}catch(e){}
    if(came) G.fromTo(curtain,{scaleY:1,transformOrigin:'50% 0%'},{scaleY:0,duration:.8,ease:'power4.inOut',delay:.1});
    document.addEventListener('click',e=>{
      const a=e.target.closest('a[href$=".html"],a[href*=".html#"]'); if(!a||a.target||e.metaKey||e.ctrlKey||e.shiftKey)return;
      e.preventDefault(); try{sessionStorage.setItem('bh-curtain','1')}catch(_){}
      G.fromTo(curtain,{scaleY:0,transformOrigin:'50% 100%'},{scaleY:1,duration:.6,ease:'power4.inOut',onComplete:()=>location.href=a.href});
    });
    addEventListener('pageshow',e=>{if(e.persisted)G.set(curtain,{scaleY:0})}); // back-button from bfcache
  }
}
// phone menu: full-screen overlay that opens as a circle from the Menu button
const mb=document.querySelector('.menu-btn'), links=document.querySelector('.links');
if(mb&&links){
  const set=o=>{links.classList.toggle('open',o); nav.classList.toggle('menu-open',o); mb.setAttribute('aria-expanded',o); mb.textContent=o?'Close':'Menu';
    o?SITE.lenis&&SITE.lenis.stop():SITE.lenis&&SITE.lenis.start(); document.documentElement.style.overflow=o?'hidden':'';
    if(o&&G&&!reduced) G.fromTo(links.children,{y:40,opacity:0},{y:0,opacity:1,stagger:.06,duration:.6,delay:.15,ease:'power3.out'}); };
  mb.addEventListener('click',()=>set(!links.classList.contains('open')));
  links.addEventListener('click',e=>{if(e.target.closest('a'))set(false)});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&links.classList.contains('open'))set(false)});
}
// ingredient ribbon on any page that has one
const track=document.getElementById('track');
if(track){ // the hero ingredients: the things people actually buy, separated by a small jar mark
  const names=["Prawns","Fish","Chicken","Beef","Dates","Lemon","Mango","Garlic","Kozhuva","Chammanthi"];
  const jar='<svg viewBox="0 0 24 28" aria-hidden="true"><path d="M6 3h12v3H6z" fill="#c8a46a"/><rect x="4" y="6" width="16" height="20" rx="4" fill="#e8561e"/><rect x="7" y="12" width="10" height="7" rx="1" fill="#f3e6c8"/></svg>';
  SITE.marquee(track,names.map(n=>`<span>${n} ${jar}</span>`).join('')); }
document.querySelectorAll('[data-year]').forEach(e=>e.textContent=new Date().getFullYear());
})();
