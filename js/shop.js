// Catalogue, cart and cart drawer, shared by every page. Load after motion.js.
// ---- EDIT HERE: shop settings ----
const SHOP={
  whatsapp:'919846020348',   // orders are sent here
  upi:'',                    // your UPI ID (e.g. bharany@okaxis). Empty = no "Pay now by UPI" button
  payee:'Bharany',
  cod:true,                  // offer cash on delivery
  currency:'₹'
};
// ---- EDIT HERE: products ----
// sizes: [label, price in rupees]. Leave price null until you set it: the cart then says "price confirmed on WhatsApp"
// img/y: picture and its vertical crop (hides the Instagram UI baked into the screenshots).
// ing lists the headline ingredients; the label carries the full list.
const CATALOG=[
 {id:'dates-lemon',name:"Dates & Lemon Pickle",cat:"Veg",img:1,y:39,heat:1,desc:"Sweet Kerala dates and tangy lemon in a gently spiced masala. The one people who say they don't like pickle end up finishing.",ing:["Dates","Lemon","Chilli","Ginger","Mustard"],pair:"Curd rice, chapati, biryani"},
 {id:'chicken',name:"Chicken Pickle",cat:"Non-veg",img:2,y:0,heat:3,desc:"Tender pieces of chicken fried, then slow-cooked in a fiery roasted-chilli masala.",ing:["Chicken","Chilli","Garlic","Ginger","Vinegar"],pair:"Hot rice, porotta, appam"},
 {id:'fish',name:"Fish Pickle",cat:"Non-veg",img:4,y:36,heat:3,desc:"Firm fish, fried crisp and folded into a deep red Kerala masala. A coastal classic.",ing:["Fish","Chilli","Garlic","Ginger","Vinegar"],pair:"Kanji, rice and curd, dosa"},
 {id:'prawns',name:"Prawns Pickle",cat:"Non-veg",img:6,y:24,heat:3,desc:"The jar from our film. Plump prawns roasted with garlic and curry leaf in a punchy chilli masala.",ing:["Prawns","Chilli","Garlic","Curry leaf","Vinegar"],pair:"Ghee rice, porotta, rice"},
 {id:'beef',name:"Beef Pickle",cat:"Non-veg",img:11,y:47,heat:3,desc:"Slow-cooked beef in black pepper and roasted spice. Rich, dark and very Kerala.",ing:["Beef","Black pepper","Chilli","Garlic","Vinegar"],pair:"Porotta, appam, rice"},
 {id:'garlic',name:"Garlic Pickle",cat:"Veg",img:5,y:44,heat:2,desc:"Whole garlic cloves softened in tangy, spiced oil until mellow and sweet.",ing:["Garlic","Chilli","Fenugreek","Mustard","Vinegar"],pair:"Rice, dal, chapati"},
 {id:'dates',name:"Dates Pickle",cat:"Veg",img:8,y:39,heat:1,desc:"Pure dates pickle: sweet, sticky and lightly spiced.",ing:["Dates","Chilli","Ginger","Mustard"],pair:"Curd rice, sandwiches, cheese"},
 {id:'dates-lemon-classic',name:"Dates & Lemon (Classic)",cat:"Veg",img:12,y:24,heat:1,desc:"Our original dates-and-lemon recipe, a little tangier than the new jar.",ing:["Dates","Lemon","Chilli","Mustard"],pair:"Curd rice, biryani"},
 {id:'mango-carrot',name:"Mango & Carrot Pickle",cat:"Veg",img:7,y:52,heat:2,desc:"Raw mango and crunchy carrot in a bright, tangy chilli masala.",ing:["Raw mango","Carrot","Chilli","Mustard","Fenugreek"],pair:"Curd rice, dosa"},
 {id:'pineapple',name:"Pineapple Pickle",cat:"Veg",img:10,y:52,heat:1,desc:"Sweet-sour pineapple chunks with a slow chilli finish.",ing:["Pineapple","Chilli","Ginger","Mustard"],pair:"Biryani, fried rice, grills"},
 {id:'coconut',name:"Desiccated Kerala Coconut",cat:"Pantry",img:3,y:47,heat:0,desc:"Finely grated, dried Kerala coconut with no added sugar. Ready for baking, chutneys and curries.",ing:["Coconut"],pair:"Baking, chutney, curries",sizes:[["200g",null]]},
 {id:'chutney',name:"Curry Leaf Coconut Chutney",cat:"Pantry",img:9,y:34,heat:1,desc:"Dry coconut chutney powder roasted with curry leaves. Sprinkle, mix with oil, done.",ing:["Coconut","Curry leaf","Chilli","Urad dal"],pair:"Idli, dosa, hot rice with ghee",sizes:[["200g",null]]}
];
const DEFAULT_SIZES=[["250g",null],["500g",null]];
CATALOG.forEach(p=>p.sizes=p.sizes||DEFAULT_SIZES);

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
  return `<div class="line"><img src="img/${p.img}.jpg" alt="" style="object-position:50% ${p.y}%">
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
window.Shop={SHOP,CATALOG,Cart,money,openCart,closeCart,addToCart,toast};
