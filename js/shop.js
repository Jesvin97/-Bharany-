// Catalogue, cart and cart drawer, shared by every page. Load after motion.js.
// ---- EDIT HERE: shop settings ----
const SHOP={
  whatsapp:'919846020348',   // orders are sent here
  upi:'',                    // your UPI ID (e.g. bharany@okaxis). Empty = no "Pay now by UPI" button
  payee:'Bharany',
  cod:false,                 // offer cash on delivery
  // Google Apps Script web-app URL that alerts you on WhatsApp in the background (see tools/order-alert.gs). Empty = off
  orderHook:'',              // also serves the site settings from the Google Sheet (see SETTINGS below)
  // your own phone video of the cooking, e.g. 'img/cooking.mp4' (10-20s, muted, portrait or square). Empty = line drawing
  cookingVideo:'',
  currency:'₹',
  // delivery per order, by PIN code: Kerala PINs start 67, 68 or 69
  delivery:{kerala:80,india:120,freeFrom:1500}   // freeFrom: subtotal (₹) from which delivery is free
};
// ---- EDIT HERE: products ----
// kg: price for 1 kg in rupees (from Bharany's price list). 500g is exactly half and 250g exactly a quarter (nearest rupee);
// give a product its own sizes:[[label,price],...] to override. kg:null = price confirmed on WhatsApp.
// img/y: photo and its vertical crop (hides the Instagram UI baked into the screenshots). No img = drawn label jar.
// ing lists the headline ingredients; the label carries the full list.
const CATALOG=[
 {id:'prawns',name:"Prawns Pickle (Chemmeen)",cat:"Non-veg",kg:1500,img:6,y:24,heat:3,desc:"The jar from our film. Plump prawns roasted with garlic and curry leaf in a punchy chilli masala.",ing:["Prawns","Chilli","Garlic","Curry leaf","Vinegar"],pair:"Ghee rice, porotta, rice"},
 {id:'fish',name:"Fish Pickle",cat:"Non-veg",kg:1200,img:4,y:36,heat:3,desc:"Firm fish, fried crisp and folded into a deep red Kerala masala. A coastal classic.",ing:["Fish","Chilli","Garlic","Ginger","Vinegar"],pair:"Kanji, rice and curd, dosa"},
 {id:'beef',name:"Beef Pickle",cat:"Non-veg",kg:1200,img:11,y:47,heat:3,desc:"Slow-cooked beef in black pepper and roasted spice. Rich, dark and very Kerala.",ing:["Beef","Black pepper","Chilli","Garlic","Vinegar"],pair:"Porotta, appam, rice"},
 {id:'chicken',name:"Chicken Pickle",cat:"Non-veg",kg:850,img:2,y:0,heat:3,desc:"Tender pieces of chicken fried, then slow-cooked in a fiery roasted-chilli masala.",ing:["Chicken","Chilli","Garlic","Ginger","Vinegar"],pair:"Hot rice, porotta, appam"},
 {id:'kozhuva',name:"Kozhuva Pickle (Anchovy)",cat:"Non-veg",kg:800,heat:3,desc:"Tiny crisp-fried anchovies in a sharp chilli and garlic masala. A Kerala coast favourite.",ing:["Anchovy","Chilli","Garlic","Ginger","Vinegar"],pair:"Kanji, hot rice"},
 {id:'kakka',name:"Kakka Erachi Pickle (Clam)",cat:"Non-veg",kg:800,heat:3,desc:"Clam meat roasted in coconut-oil masala with curry leaf, the way backwater kitchens make it.",ing:["Clam meat","Chilli","Garlic","Curry leaf","Vinegar"],pair:"Rice, kappa, porotta"},
 {id:'chemmeen-podi',name:"Unakka Chemmeen Podi",cat:"Non-veg",kg:1000,heat:2,desc:"Dried prawns roasted and pounded with coconut, chilli and shallots into a dry chammanthi powder.",ing:["Dried prawns","Coconut","Chilli","Shallots","Curry leaf"],pair:"Hot rice with ghee, kanji, dosa"},
 {id:'garlic',name:"Garlic Pickle",cat:"Veg",kg:600,img:5,y:44,heat:2,desc:"Whole garlic cloves softened in tangy, spiced oil until mellow and sweet.",ing:["Garlic","Chilli","Fenugreek","Mustard","Vinegar"],pair:"Rice, dal, chapati"},
 {id:'dates-lemon',name:"Lemon & Dates Pickle",cat:"Veg",kg:400,img:1,y:39,heat:1,desc:"Sweet Kerala dates and tangy lemon in a gently spiced masala. The one people who say they don't like pickle end up finishing.",ing:["Dates","Lemon","Chilli","Ginger","Mustard"],pair:"Curd rice, chapati, biryani"},
 {id:'dates',name:"Dates Pickle",cat:"Veg",kg:400,img:8,y:39,heat:1,desc:"Pure dates pickle: sweet, sticky and lightly spiced.",ing:["Dates","Chilli","Ginger","Mustard"],pair:"Curd rice, sandwiches, cheese"},
 {id:'adamanga',name:"Adamanga Pickle",cat:"Veg",kg:400,heat:2,desc:"Sun-dried, salted mango pieces in a deep red masala. Chewy, tangy and long-keeping.",ing:["Dried mango","Chilli","Mustard","Fenugreek","Salt"],pair:"Curd rice, kanji"},
 {id:'mango-red',name:"Mango Pickle (Red)",cat:"Veg",kg:250,heat:2,desc:"Raw mango pieces in classic red chilli masala, the everyday Kerala achar.",ing:["Raw mango","Chilli","Mustard","Fenugreek","Asafoetida"],pair:"Curd rice, sadya, dosa"},
 {id:'mango-white',name:"Mango Pickle (White)",cat:"Veg",kg:250,heat:1,desc:"Tender raw mango in a mild, light-coloured pickle without the red chilli masala: tangy and fresh.",ing:["Raw mango","Green chilli","Mustard","Salt"],pair:"Kanji, curd rice"},
 {id:'lemon',name:"Lemon Pickle",cat:"Veg",kg:250,heat:2,desc:"Soft lemon pieces in spicy, tangy masala that gets better with every week in the jar.",ing:["Lemon","Chilli","Mustard","Fenugreek","Asafoetida"],pair:"Biryani, curd rice, fried fish"},
 {id:'dates-lemon-classic',name:"Dates & Lemon (Classic)",cat:"Veg",kg:400,img:12,y:24,heat:1,desc:"Our original dates-and-lemon recipe, a little tangier than the new jar.",ing:["Dates","Lemon","Chilli","Mustard"],pair:"Curd rice, biryani"},
 {id:'mango-carrot',name:"Mango & Carrot Pickle",cat:"Veg",kg:null,img:7,y:52,heat:2,desc:"Raw mango and crunchy carrot in a bright, tangy chilli masala.",ing:["Raw mango","Carrot","Chilli","Mustard","Fenugreek"],pair:"Curd rice, dosa"},
 {id:'pineapple',name:"Pineapple Pickle",cat:"Veg",kg:null,img:10,y:52,heat:1,desc:"Sweet-sour pineapple chunks with a slow chilli finish.",ing:["Pineapple","Chilli","Ginger","Mustard"],pair:"Biryani, fried rice, grills"},
 {id:'chutney',name:"Vepilla Chammanthi",cat:"Pantry",kg:900,img:9,y:34,heat:1,desc:"Dry coconut chutney powder roasted with curry leaves. Sprinkle, mix with oil, done.",ing:["Coconut","Curry leaf","Chilli","Urad dal"],pair:"Idli, dosa, hot rice with ghee"},
 {id:'coconut',name:"Desiccated Kerala Coconut",cat:"Pantry",kg:null,img:3,y:47,heat:0,desc:"Finely grated, dried Kerala coconut with no added sugar. Ready for baking, chutneys and curries.",ing:["Coconut"],pair:"Baking, chutney, curries",sizes:[["200g",null]]}
];
// ---- EDIT HERE: starter boxes (adds several jars in one tap). items: [product id, size] ----
const BOXES=[
 {id:'first-month',name:'The first-month box',line:'All veg and easy to keep on a shelf. For the week the homesickness hits.',items:[['mango-red','250g'],['dates-lemon','250g'],['chutney','250g']]},
 {id:'sunday',name:'The Sunday lunch box',line:'Prawns, fish and mango. Plain rice does the rest.',items:[['prawns','250g'],['fish','250g'],['mango-red','250g']]},
 {id:'feast',season:[['11-15','01-10','Christmas'],['03-01','04-30','Easter']],name:'The Christmas & Easter feast box',line:'Beef, prawns and clam for the appam-and-stew table, the way Kerala Christian homes lay it out.',items:[['beef','500g'],['prawns','250g'],['kakka','250g']]},
 {id:'sadya',season:[['08-01','09-30','Onam'],['04-01','04-20','Vishu']],name:'The Onam & Vishu sadya box',line:'Mango, lemon and lemon-dates: the pickles every sadya leaf needs.',items:[['mango-red','250g'],['lemon','250g'],['dates-lemon','250g']]},
 {id:'abroad',name:'The overseas parcel box',line:'All veg, 500g jars, packed leak-proof so family can courier it to you abroad.',abroad:true,items:[['mango-red','500g'],['garlic','500g'],['dates-lemon','500g']]},
 {id:'maggi',name:'The late-night rescue box',line:'For instant noodles, plain dosa and 11pm rice. One spoon fixes it.',items:[['chemmeen-podi','250g'],['garlic','250g'],['lemon','250g']]}
];
const part=(kg,f)=>kg==null?null:Math.round(kg*f);
// one plain brand-coloured jar with the product name, for items without a photo yet (same for every item, so no rainbow)
const jarArt=p=>{const w=p.name.replace(/\s*\(.*\)/,'').toUpperCase().split(' '), l1=w.slice(0,Math.ceil(w.length/2)).join(' '), l2=w.slice(Math.ceil(w.length/2)).join(' ');
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400"><rect width="300" height="400" fill="#1a120d"/>
  <path d="M95 80h110l-4 26h-102z" fill="#c8a46a"/><path d="M88 74q62-26 124 0l-6 14q-56-18-112 0z" fill="#a8844e"/>
  <rect x="80" y="104" width="140" height="230" rx="22" fill="#5a3a22"/>
  <rect x="92" y="170" width="116" height="104" rx="6" fill="#f3e6c8"/><text x="150" y="196" text-anchor="middle" font-family="Antonio,Impact,sans-serif" font-weight="700" font-size="15" fill="#5a2a12">BHARANY</text>
  <text x="150" y="226" text-anchor="middle" font-family="Antonio,Impact,sans-serif" font-weight="700" font-size="${l1.length>11?12:l1.length>9?14:20}" fill="#1a120d">${l1}</text>
  <text x="150" y="252" text-anchor="middle" font-family="Antonio,Impact,sans-serif" font-weight="700" font-size="${l2.length>11?12:l2.length>9?14:20}" fill="#1a120d">${l2}</text></svg>`;
  return 'data:image/svg+xml,'+encodeURIComponent(svg);};
CATALOG.forEach(p=>{
  p.sizes=p.sizes||[["250g",part(p.kg,.25)],["500g",part(p.kg,.5)],["1kg",p.kg]];
  p.src=p.img?`img/${p.img}.webp`:jarArt(p); p.y=p.y??50;
});
// a jar with no price on any weight stays off the shop until it has one
for(let i=CATALOG.length-1;i>=0;i--) if(CATALOG[i].sizes.every(s=>s[1]==null)) CATALOG.splice(i,1);

const Cart=(()=>{
  const KEY='bh-cart'; let items=[];
  try{items=JSON.parse(localStorage.getItem(KEY))||[]}catch(e){}
  // the stored cart is user-editable: keep only known products, real sizes and sane quantities
  const MAXQ=20;
  items=(Array.isArray(items)?items:[]).filter(i=>{const p=CATALOG.find(p=>p.id===i?.id); return p&&p.sizes.some(s=>s[0]===i.size)&&Number.isInteger(i.qty)&&i.qty>0;})
    .map(i=>({id:i.id,size:i.size,qty:Math.min(i.qty,MAXQ)}));
  const subs=new Set(), save=()=>{try{localStorage.setItem(KEY,JSON.stringify(items))}catch(e){} subs.forEach(f=>f(items));};
  const find=(id,size)=>items.find(i=>i.id===id&&i.size===size);
  return {
    get items(){return items},
    product:id=>CATALOG.find(p=>p.id===id),
    price(i){const p=this.product(i.id), s=p.sizes.find(s=>s[0]===i.size); return s?s[1]:null},
    add(id,size,qty=1){const f=find(id,size); f?f.qty=Math.min(f.qty+qty,MAXQ):items.push({id,size,qty}); save();},
    set(id,size,qty){const f=find(id,size); if(!f)return; f.qty=Math.min(qty,MAXQ); if(qty<1)items=items.filter(i=>i!==f); save();},
    clear(){items=[]; save();},
    // switch a line to another size, merging into an existing line of that size
    resize(id,from,to){const f=find(id,from), p=this.product(id); if(!f||from===to||!p.sizes.some(s=>s[0]===to))return;
      const g=find(id,to); if(g){g.qty=Math.min(g.qty+f.qty,MAXQ); items=items.filter(i=>i!==f);} else f.size=to; save();},
    // 'id:size:qty,...' for reorder links; add() ignores anything not in the catalogue
    code(list=items){return list.map(i=>`${i.id}:${i.size}:${i.qty}`).join(',')},
    addCode(c){let n=0; String(c).split(',').slice(0,30).forEach(x=>{const [id,size,q]=x.split(':'), p=this.product(id), qty=parseInt(q,10);
      if(p&&p.sizes.some(s=>s[0]===size)&&qty>0){find(id,size)?this.set(id,size,Math.min(find(id,size).qty+qty,MAXQ)):(items.push({id,size,qty:Math.min(qty,MAXQ)}),save()); n++;}}); return n;},
    saveLast(){try{localStorage.setItem('bh-last',this.code())}catch(e){}},
    last(){try{return localStorage.getItem('bh-last')||''}catch(e){return ''}},
    count(){return items.reduce((a,i)=>a+i.qty,0)},
    // total is null when any item has no price yet
    total(){let t=0; for(const i of items){const p=this.price(i); if(p==null)return null; t+=p*i.qty;} return t},
    on(f){subs.add(f); f(items);}
  };
})();
// delivery charge for a 6-digit PIN code, or null until a valid PIN is entered
const deliveryFor=(pin,sub)=>!/^[1-9]\d{5}$/.test(pin||'')?null:sub!=null&&sub>=SHOP.delivery.freeFrom?0:/^6[789]/.test(pin)?SHOP.delivery.kerala:SHOP.delivery.india;
const money=v=>v==null?'-':SHOP.currency+v.toLocaleString('en-IN');

// ---- cart drawer (injected on every page) ----
document.body.insertAdjacentHTML('beforeend',`
<div class="drawer" id="drawer" role="dialog" aria-modal="true" aria-label="Your cart" hidden>
  <div class="drawer-bg" data-close></div>
  <aside class="drawer-panel">
    <header><h3>Your cart</h3><button class="btn" data-close>Close</button></header>
    <div class="drawer-items" id="drawer-items"></div>
    <footer>
      <div class="sum"><span>Subtotal</span><b id="drawer-total"></b></div>
      <p class="note" id="drawer-note"></p>
      <a class="btn fill block" href="checkout.html" id="drawer-go">Checkout</a>
      <button class="btn block" data-close>Keep shopping</button>
    </footer>
  </aside>
</div>
<div class="toast" id="toast" role="status" aria-live="polite"></div>`);
const drawer=document.getElementById('drawer'), dItems=document.getElementById('drawer-items');
function lineHTML(i){
  const p=Cart.product(i.id), pr=Cart.price(i);
  return `<div class="line"><img src="${p.src}" alt="" style="object-position:50% ${p.y}%">
    <div><b>${p.name}</b><small>${p.sizes.length>1?`<select class="resize" data-id="${i.id}" data-size="${i.size}" aria-label="Size">${p.sizes.map(([s])=>`<option${s===i.size?' selected':''}>${s}</option>`).join('')}</select>`:i.size} · ${pr==null?'price on confirmation':money(pr)}</small>
    <div class="qty" data-id="${i.id}" data-size="${i.size}"><button type="button" aria-label="Fewer" data-d="-1">−</button><span>${i.qty}</span><button type="button" aria-label="More" data-d="1">+</button></div></div>
    <b>${pr==null?'':money(pr*i.qty)}</b></div>`;
}
Cart.on(items=>{
  document.querySelectorAll('[data-cart-count]').forEach(e=>{e.textContent=Cart.count(); e.hidden=!Cart.count();});
  const last=Cart.last(), lastN=last?last.split(',').reduce((a,x)=>a+(parseInt(x.split(':')[2],10)||0),0):0;
  dItems.innerHTML=items.length?items.map(lineHTML).join(''):'<p class="empty">Your cart is empty. Time for a jar or two.'+(lastN?`<br><br><button class="btn fill" data-reorder>Reorder your last order (${lastN} jar${lastN>1?'s':''})</button>`:'')+'</p>';
  const t=Cart.total();
  document.getElementById('drawer-total').textContent=items.length?(t==null?'Confirmed on WhatsApp':money(t)):money(0);
  const sub=Cart.total(), gap=sub==null?null:SHOP.delivery.freeFrom-sub;
  document.getElementById('drawer-note').textContent=!items.length?'':gap!=null&&gap<=0?'You get free delivery.':
    (gap!=null?`Add ${money(gap)} more for free delivery. `:'')+`Delivery: ${money(SHOP.delivery.kerala)} in Kerala, ${money(SHOP.delivery.india)} rest of India, free from ${money(SHOP.delivery.freeFrom)}.`;
  document.getElementById('drawer-go').hidden=!items.length;
});
document.addEventListener('click',e=>{
  const q=e.target.closest('.qty button');
  if(q){const w=q.parentElement, cur=Cart.items.find(i=>i.id===w.dataset.id&&i.size===w.dataset.size); if(cur)Cart.set(cur.id,cur.size,cur.qty+ +q.dataset.d); return;}
  if(e.target.closest('[data-open-cart]')){e.preventDefault(); openCart();}
  else if(e.target.closest('#drawer [data-close]')) closeCart();
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!drawer.hidden)closeCart()});
document.addEventListener('change',e=>{const r=e.target.closest('select.resize'); if(r) Cart.resize(r.dataset.id,r.dataset.size,r.value);});
document.addEventListener('click',e=>{if(e.target.closest('[data-reorder]')){Cart.addCode(Cart.last()); toast('Your last order is back in the cart');}});
// reorder links (?reorder=id:size:qty,...) fill the cart and open it
{const m=location.search.match(/[?&]reorder=([^&]+)/); if(m){const n=Cart.addCode(decodeURIComponent(m[1]));
  history.replaceState(null,'',location.pathname+location.hash); if(n) addEventListener('load',()=>setTimeout(openCart,600));}}
function openCart(){
  const G=SITE.gsap; drawer.hidden=false; SITE.lenis&&SITE.lenis.stop(); document.documentElement.style.overflow='hidden';
  if(G&&!SITE.reduced){G.fromTo('.drawer-panel',{xPercent:100},{xPercent:0,duration:.5,ease:'power3.out'}); G.fromTo('.drawer-bg',{opacity:0},{opacity:1,duration:.3});}
  drawer.querySelector('[data-close].btn').focus();
}
function closeCart(){
  const G=SITE.gsap, done=()=>{drawer.hidden=true; SITE.lenis&&SITE.lenis.start(); document.documentElement.style.overflow='';};
  if(G&&!SITE.reduced){G.to('.drawer-bg',{opacity:0,duration:.25}); G.to('.drawer-panel',{xPercent:100,duration:.35,ease:'power2.in',onComplete:done});} else done();
}
let toastT; function toast(msg){const t=document.getElementById('toast'); t.textContent=msg; t.classList.add('on'); clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove('on'),2200);}
function addToCart(id,size,btn,qty=1){
  Cart.add(id,size,qty); toast(`${qty>1?qty+' × ':''}${Cart.product(id).name} (${size}) added`);
  const G=SITE.gsap; if(G&&!SITE.reduced) G.fromTo('[data-cart-count]',{scale:1.8},{scale:1,duration:.5,ease:'back.out(3)'});
}
function addBox(id){
  const b=BOXES.find(x=>x.id===id); b.items.forEach(([pid,size])=>Cart.add(pid,size)); if(b.abroad) try{localStorage.setItem('bh-abroad','1')}catch(e){} toast(`${b.name} added (${b.items.length} jars)`);
  const G=SITE.gsap; if(G&&!SITE.reduced) G.fromTo('[data-cart-count]',{scale:1.8},{scale:1,duration:.5,ease:'back.out(3)'});
}
// ---- EDIT HERE: real customer reviews only, shared with the customer's permission ----
// {name:'Anu', place:'Bengaluru', text:'Tastes exactly like home', img:'img/reviews/anu.jpg'}  (img: a WhatsApp/Instagram screenshot or photo,
//  video: 'img/reviews/anu.mp4' for a short clip; both optional)
// The reviews section stays hidden until at least one is added.
const REVIEWS=[];
// a box is in season when today falls inside one of its [from, to, label] month-day windows (windows may wrap past New Year)
function season(b){const d=new Date(), md=String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  return (b.season||[]).find(([f,t])=>f<=t?md>=f&&md<=t:md>=f||md<=t)?.[2]||'';}
// ---- EDIT HERE: cravings for the "Shop by craving" tabs. ids from CATALOG ----
const CRAVINGS=[
 {id:'spicy',name:'Spicy',test:p=>p.heat>=3},
 {id:'sweet',name:'Sweet and sour',ids:['dates-lemon','dates','dates-lemon-classic','pineapple','mango-carrot']},
 {id:'rice',name:'For hot rice',ids:['prawns','fish','chemmeen-podi','kozhuva','kakka','mango-red','lemon','garlic','chutney','beef']},
 {id:'abroad',name:'Safe to send abroad',test:p=>p.cat!=='Non-veg'}
];
CRAVINGS.forEach(c=>c.items=CATALOG.filter(p=>c.test?c.test(p):c.ids.includes(p.id)));

// ---- SETTINGS: what's switched on right now ----
// These defaults apply until the Google Sheet is connected (tools/order-alert.gs, "Settings" tab). Once SHOP.orderHook is set,
// the sheet wins, so the sale, best sellers and banner can be changed from a phone without touching code.
const SETTINGS_DEFAULT={
  sale:{on:false,title:'',ends:'',link:'#products'},   // ends: '2026-11-30T23:59' (India time)
  bestsellers:[],                                      // product ids you know sell best, e.g. ['prawns','fish']
  banner:{mode:'auto',title:'',text:'',image:'',link:'',box:''} // mode: auto (festival boxes in season) | on | off
};
// a Google Drive share link becomes a direct picture link; anything else must be a picture in this site's img/ folder
const posterSrc=u=>{u=String(u||'').trim(); const m=u.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)([\w-]{20,})/);
  if(m) return 'https://lh3.googleusercontent.com/d/'+m[1]; if(/^https:\/\/lh3\.googleusercontent\.com\/[\w\/=-]+$/.test(u)) return u;
  return /^img\/[\w\/.-]+\.(jpe?g|png|webp|gif)$/i.test(u)?u:'';};
function loadSettings(){
  const done=s=>({...SETTINGS_DEFAULT,...s,sale:{...SETTINGS_DEFAULT.sale,...(s&&s.sale)},banner:{...SETTINGS_DEFAULT.banner,...(s&&s.banner)},
    bestsellers:((s&&s.bestsellers)||SETTINGS_DEFAULT.bestsellers).filter(id=>CATALOG.some(p=>p.id===id))});
  if(!SHOP.orderHook) return Promise.resolve(done({}));
  try{const c=JSON.parse(sessionStorage.getItem('bh-settings')||'null'); if(c&&Date.now()-c.t<5*60e3) return Promise.resolve(done(c.s));}catch(e){}
  const ctl=new AbortController(); setTimeout(()=>ctl.abort(),3000);
  return fetch(SHOP.orderHook+'?settings=1',{signal:ctl.signal}).then(r=>r.json()).then(s=>{try{sessionStorage.setItem('bh-settings',JSON.stringify({t:Date.now(),s}))}catch(e){} return done(s);})
    .catch(()=>done({}));
}
const esc=v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

Cart.on(()=>document.querySelectorAll('[data-cart-count]').forEach(e=>{e.textContent=Cart.count(); e.hidden=!Cart.count();}));

// ---- sale bar with countdown (every page), only while a sale is switched on and not yet over ----
function saleBar(st){
  const s=st.sale, end=Date.parse(s.ends&&!/[zZ]|[+-]\d\d:?\d\d$/.test(s.ends)?s.ends+'+05:30':s.ends);
  if(!s.on||!s.title||!(end>Date.now())) return;
  const home=/(^|\/)(index\.html)?$/.test(location.pathname)?'':'index.html';
  document.body.insertAdjacentHTML('afterbegin',`<div class="salebar" role="region" aria-label="Offer"><b>${esc(s.title)}</b>
    <span class="cd" aria-live="off"><span>Ends in</span> <span data-cd></span></span><a class="btn fill" href="${home}${/^#[\w-]+$/.test(s.link)?esc(s.link):'#products'}">Shop now</a></div>`);
  document.body.classList.add('has-sale');
  const el=document.querySelector('[data-cd]'), pad=n=>String(n).padStart(2,'0');
  const tick=()=>{const ms=end-Date.now(); if(ms<=0){document.querySelector('.salebar').remove(); document.body.classList.remove('has-sale'); return;}
    const d=Math.floor(ms/864e5),h=Math.floor(ms/36e5)%24,m=Math.floor(ms/6e4)%60,x=Math.floor(ms/1e3)%60;
    el.textContent=(d?d+'d ':'')+pad(h)+'h '+pad(m)+'m '+pad(x)+'s'; setTimeout(tick,1000);};
  tick();
}
const settingsReady=loadSettings(); settingsReady.then(saleBar);
window.Shop={settingsReady,posterSrc,esc,CRAVINGS,deliveryFor,SHOP,CATALOG,BOXES,REVIEWS,season,lineHTML,addBox,Cart,money,openCart,closeCart,addToCart,toast};
