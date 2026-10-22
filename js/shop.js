// Catalogue, cart and cart drawer, shared by every page. Load after motion.js.
// ---- EDIT HERE: shop settings ----
const SHOP={
  whatsapp:'919846020348',   // orders are sent here
  upi:'',                    // your UPI ID (e.g. bharany@okaxis). Empty = no "Pay now by UPI" button
  payee:'Bharany',
  cod:false,                 // offer cash on delivery
  // Google Apps Script web-app URL that alerts you on WhatsApp in the background (see tools/order-alert.gs). Empty = off
  orderHook:'',
  currency:'₹'
};
// ---- EDIT HERE: products ----
// kg: price for 1 kg in rupees (from Bharany's price list). 250g and 500g are worked out pro-rata, rounded up to ₹5;
// give a product its own sizes:[[label,price],...] to override. kg:null = price confirmed on WhatsApp.
// img/y: photo and its vertical crop (hides the Instagram UI baked into the screenshots). No img = drawn label jar.
// ing lists the headline ingredients; the label carries the full list.
const CATALOG=[
 {id:'prawns',name:"Prawns Pickle (Chemmeen)",cat:"Non-veg",kg:1500,img:6,y:24,heat:3,desc:"The jar from our film. Plump prawns roasted with garlic and curry leaf in a punchy chilli masala.",ing:["Prawns","Chilli","Garlic","Curry leaf","Vinegar"],pair:"Ghee rice, porotta, rice"},
 {id:'fish',name:"Fish Pickle",cat:"Non-veg",kg:1200,img:4,y:36,heat:3,desc:"Firm fish, fried crisp and folded into a deep red Kerala masala. A coastal classic.",ing:["Fish","Chilli","Garlic","Ginger","Vinegar"],pair:"Kanji, rice and curd, dosa"},
 {id:'beef',name:"Beef Pickle",cat:"Non-veg",kg:1200,img:11,y:47,heat:3,desc:"Slow-cooked beef in black pepper and roasted spice. Rich, dark and very Kerala.",ing:["Beef","Black pepper","Chilli","Garlic","Vinegar"],pair:"Porotta, appam, rice"},
 {id:'chicken',name:"Chicken Pickle",cat:"Non-veg",kg:850,img:2,y:0,heat:3,desc:"Tender pieces of chicken fried, then slow-cooked in a fiery roasted-chilli masala.",ing:["Chicken","Chilli","Garlic","Ginger","Vinegar"],pair:"Hot rice, porotta, appam"},
 {id:'kozhuva',name:"Kozhuva Pickle (Anchovy)",cat:"Non-veg",kg:800,color:'#c0301c',heat:3,desc:"Tiny crisp-fried anchovies in a sharp chilli and garlic masala. A Kerala coast favourite.",ing:["Anchovy","Chilli","Garlic","Ginger","Vinegar"],pair:"Kanji, hot rice"},
 {id:'kakka',name:"Kakka Erachi Pickle (Clam)",cat:"Non-veg",kg:800,color:'#8a4b2a',heat:3,desc:"Clam meat roasted in coconut-oil masala with curry leaf, the way backwater kitchens make it.",ing:["Clam meat","Chilli","Garlic","Curry leaf","Vinegar"],pair:"Rice, kappa, porotta"},
 {id:'chemmeen-podi',name:"Unakka Chemmeen Podi",cat:"Non-veg",kg:1000,color:'#e8561e',heat:2,desc:"Dried prawns roasted and pounded with coconut, chilli and shallots into a dry chammanthi powder.",ing:["Dried prawns","Coconut","Chilli","Shallots","Curry leaf"],pair:"Hot rice with ghee, kanji, dosa"},
 {id:'garlic',name:"Garlic Pickle",cat:"Veg",kg:600,img:5,y:44,heat:2,desc:"Whole garlic cloves softened in tangy, spiced oil until mellow and sweet.",ing:["Garlic","Chilli","Fenugreek","Mustard","Vinegar"],pair:"Rice, dal, chapati"},
 {id:'dates-lemon',name:"Lemon & Dates Pickle",cat:"Veg",kg:400,img:1,y:39,heat:1,desc:"Sweet Kerala dates and tangy lemon in a gently spiced masala. The one people who say they don't like pickle end up finishing.",ing:["Dates","Lemon","Chilli","Ginger","Mustard"],pair:"Curd rice, chapati, biryani"},
 {id:'dates',name:"Dates Pickle",cat:"Veg",kg:400,img:8,y:39,heat:1,desc:"Pure dates pickle: sweet, sticky and lightly spiced.",ing:["Dates","Chilli","Ginger","Mustard"],pair:"Curd rice, sandwiches, cheese"},
 {id:'adamanga',name:"Adamanga Pickle",cat:"Veg",kg:400,color:'#b8860b',heat:2,desc:"Sun-dried, salted mango pieces in a deep red masala. Chewy, tangy and long-keeping.",ing:["Dried mango","Chilli","Mustard","Fenugreek","Salt"],pair:"Curd rice, kanji"},
 {id:'mango-red',name:"Mango Pickle (Red)",cat:"Veg",kg:250,color:'#d9441c',heat:2,desc:"Raw mango pieces in classic red chilli masala, the everyday Kerala achar.",ing:["Raw mango","Chilli","Mustard","Fenugreek","Asafoetida"],pair:"Curd rice, sadya, dosa"},
 {id:'mango-white',name:"Mango Pickle (White)",cat:"Veg",kg:250,color:'#c9b458',heat:1,desc:"Tender raw mango in a mild, light-coloured pickle without the red chilli masala: tangy and fresh.",ing:["Raw mango","Green chilli","Mustard","Salt"],pair:"Kanji, curd rice"},
 {id:'lemon',name:"Lemon Pickle",cat:"Veg",kg:250,color:'#e0b01c',heat:2,desc:"Soft lemon pieces in spicy, tangy masala that gets better with every week in the jar.",ing:["Lemon","Chilli","Mustard","Fenugreek","Asafoetida"],pair:"Biryani, curd rice, fried fish"},
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
 {id:'abroad',name:'The overseas parcel box',line:'All veg, 500g jars, packed leak-proof so family can courier it to you abroad.',abroad:true,items:[['mango-red','500g'],['garlic','500g'],['dates-lemon','500g']]},
 {id:'maggi',name:'The late-night rescue box',line:'For instant noodles, plain dosa and 11pm rice. One spoon fixes it.',items:[['chemmeen-podi','250g'],['garlic','250g'],['lemon','250g']]}
];
const part=(kg,f)=>kg==null?null:Math.ceil(kg*f/5)*5;
// a simple drawn jar with the product name, for items without a photo yet
const jarArt=p=>{const w=p.name.replace(/\s*\(.*\)/,'').toUpperCase().split(' '), l1=w.slice(0,Math.ceil(w.length/2)).join(' '), l2=w.slice(Math.ceil(w.length/2)).join(' ');
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400"><rect width="300" height="400" fill="#1a120d"/><circle cx="150" cy="210" r="140" fill="${p.color}" opacity=".18"/>
  <path d="M95 80h110l-4 26h-102z" fill="#c8a46a"/><path d="M88 74q62-26 124 0l-6 14q-56-18-112 0z" fill="#a8844e"/>
  <rect x="80" y="104" width="140" height="230" rx="22" fill="${p.color}"/><rect x="80" y="104" width="140" height="230" rx="22" fill="url(#g)"/>
  <rect x="92" y="170" width="116" height="104" rx="6" fill="#f3e6c8"/><text x="150" y="196" text-anchor="middle" font-family="Antonio,Impact,sans-serif" font-weight="700" font-size="15" fill="#5a2a12">BHARANY</text>
  <text x="150" y="226" text-anchor="middle" font-family="Antonio,Impact,sans-serif" font-weight="700" font-size="${l1.length>9?15:20}" fill="#1a120d">${l1}</text>
  <text x="150" y="252" text-anchor="middle" font-family="Antonio,Impact,sans-serif" font-weight="700" font-size="${l2.length>9?15:20}" fill="#1a120d">${l2}</text>
  <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".25"/><stop offset=".3" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></linearGradient></defs></svg>`;
  return 'data:image/svg+xml,'+encodeURIComponent(svg);};
CATALOG.forEach(p=>{
  p.sizes=p.sizes||[["250g",part(p.kg,.25)],["500g",part(p.kg,.5)],["1kg",p.kg]];
  p.src=p.img?`img/${p.img}.jpg`:jarArt(p); p.y=p.y??50;
});

const Cart=(()=>{
  const KEY='bh-cart'; let items=[];
  try{items=JSON.parse(localStorage.getItem(KEY))||[]}catch(e){}
  items=items.filter(i=>CATALOG.some(p=>p.id===i.id));
  const subs=new Set(), save=()=>{try{localStorage.setItem(KEY,JSON.stringify(items))}catch(e){} subs.forEach(f=>f(items));};
  const find=(id,size)=>items.find(i=>i.id===id&&i.size===size);
  return {
    get items(){return items},
    product:id=>CATALOG.find(p=>p.id===id),
    price(i){const p=this.product(i.id), s=p.sizes.find(s=>s[0]===i.size); return s?s[1]:null},
    add(id,size,qty=1){const f=find(id,size); f?f.qty+=qty:items.push({id,size,qty}); save();},
    set(id,size,qty){const f=find(id,size); if(!f)return; f.qty=qty; if(qty<1)items=items.filter(i=>i!==f); save();},
    clear(){items=[]; save();},
    count(){return items.reduce((a,i)=>a+i.qty,0)},
    // total is null when any item has no price yet
    total(){let t=0; for(const i of items){const p=this.price(i); if(p==null)return null; t+=p*i.qty;} return t},
    on(f){subs.add(f); f(items);}
  };
})();
const money=v=>v==null?'—':SHOP.currency+v.toLocaleString('en-IN');

// ---- cart drawer (injected on every page) ----
document.body.insertAdjacentHTML('beforeend',`
<div class="drawer" id="drawer" role="dialog" aria-modal="true" aria-label="Your cart" hidden>
  <div class="drawer-bg" data-close></div>
  <aside class="drawer-panel">
    <header><h3>Your cart</h3><button class="btn" data-close aria-label="Close cart">✕</button></header>
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
    <div><b>${p.name}</b><small>${i.size} · ${pr==null?'price on confirmation':money(pr)}</small>
    <div class="qty" data-id="${i.id}" data-size="${i.size}"><button aria-label="Fewer" data-d="-1">−</button><span>${i.qty}</span><button aria-label="More" data-d="1">+</button></div></div>
    <b>${pr==null?'':money(pr*i.qty)}</b></div>`;
}
Cart.on(items=>{
  document.querySelectorAll('[data-cart-count]').forEach(e=>{e.textContent=Cart.count(); e.hidden=!Cart.count();});
  dItems.innerHTML=items.length?items.map(lineHTML).join(''):'<p class="empty">Your cart is empty. Time for a jar or two.</p>';
  const t=Cart.total();
  document.getElementById('drawer-total').textContent=items.length?(t==null?'Confirmed on WhatsApp':money(t)):money(0);
  document.getElementById('drawer-note').textContent=items.length?'Delivery charge is confirmed with your order.':'';
  document.getElementById('drawer-go').hidden=!items.length;
});
document.addEventListener('click',e=>{
  const q=e.target.closest('.qty button');
  if(q){const w=q.parentElement, cur=Cart.items.find(i=>i.id===w.dataset.id&&i.size===w.dataset.size); if(cur)Cart.set(cur.id,cur.size,cur.qty+ +q.dataset.d); return;}
  if(e.target.closest('[data-open-cart]')){e.preventDefault(); openCart();}
  else if(e.target.closest('#drawer [data-close]')) closeCart();
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!drawer.hidden)closeCart()});
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
function addToCart(id,size,btn){
  Cart.add(id,size); toast(`${Cart.product(id).name} (${size}) added`);
  const G=SITE.gsap; if(G&&!SITE.reduced) G.fromTo('[data-cart-count]',{scale:1.8},{scale:1,duration:.5,ease:'back.out(3)'});
}
function addBox(id){
  const b=BOXES.find(x=>x.id===id); b.items.forEach(([pid,size])=>Cart.add(pid,size)); if(b.abroad) try{localStorage.setItem('bh-abroad','1')}catch(e){} toast(`${b.name} added (${b.items.length} jars)`);
  const G=SITE.gsap; if(G&&!SITE.reduced) G.fromTo('[data-cart-count]',{scale:1.8},{scale:1,duration:.5,ease:'back.out(3)'});
}
window.Shop={SHOP,CATALOG,BOXES,addBox,Cart,money,openCart,closeCart,addToCart,toast};
