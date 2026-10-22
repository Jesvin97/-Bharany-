/**
 * Bharany order alerts: Google Apps Script web app.
 * Every checkout on the website POSTs here. This script
 *   1. adds the order as a row in the Google Sheet it lives in (your order book), and
 *   2. sends the order to your WhatsApp through CallMeBot (free).
 * The CallMeBot key stays here on Google's side, never on the public website.
 *
 * SETUP (about 10 minutes, once)
 *  1. CallMeBot key: save +34 644 66 32 62 in your phone's contacts, send it the WhatsApp message
 *       I allow callmebot to send me messages
 *     and it replies with your API key. (Steps: https://www.callmebot.com/blog/free-api-whatsapp-messages/)
 *  2. Create a new Google Sheet named "Bharany orders". Extensions → Apps Script.
 *     Delete what's there, paste this whole file, and Save.
 *  3. Project Settings (gear) → Script properties → add:
 *       PHONE   919846020348        (the WhatsApp number that gets alerts, with 91, no +)
 *       APIKEY  <the key CallMeBot sent you>
 *  4. Deploy → New deployment → type "Web app". Execute as: Me. Who has access: Anyone. Deploy, allow access.
 *  5. Copy the Web app URL (ends in /exec) into js/shop.js → orderHook:'…' and publish the site.
 *  6. Test: run testAlert() from the editor; you should get a WhatsApp message and a row in the sheet.
 *  7. Site settings: run setupSettings() once. It adds a "Settings" tab. Change the Value column any time from the
 *     Google Sheets app on your phone; the website picks it up within about 5 minutes. No redeploy needed.
 */

// ---- site settings: the website reads these with ?settings=1 ----
function doGet(e) {
  if (!e || !e.parameter || !e.parameter.settings) return reply('ok');
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Settings');
  var v = {};
  if (sh) sh.getDataRange().getValues().slice(1).forEach(function (r) { if (r[0]) v[String(r[0]).trim()] = r[1]; });
  var on = function (x) { return x === true || /^(yes|true|on|1)$/i.test(String(x).trim()); };
  var str = function (x) { return String(x == null ? '' : x).trim().slice(0, 300); };
  var when = function (x) { return x instanceof Date ? Utilities.formatDate(x, 'Asia/Kolkata', "yyyy-MM-dd'T'HH:mm") : str(x); };
  var out = {
    sale: { on: on(v.sale_on), title: str(v.sale_title), ends: when(v.sale_ends), link: str(v.sale_link) || '#products' },
    bestsellers: str(v.bestsellers).split(',').map(function (x) { return x.trim(); }).filter(String),
    banner: { mode: (/^(auto|on|off)$/i.test(str(v.banner)) ? str(v.banner).toLowerCase() : 'auto'), title: str(v.banner_title),
              text: str(v.banner_text), image: str(v.banner_image), link: str(v.banner_link), box: str(v.banner_box) }
  };
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}

// run once from the editor: creates the Settings tab with every option explained
function setupSettings() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName('Settings') || ss.insertSheet('Settings');
  sh.clear();
  sh.getRange(1, 1, 1, 3).setValues([['Key', 'Value', 'What it does']]).setFontWeight('bold');
  sh.getRange(2, 1, 11, 3).setValues([
    ['sale_on', 'no', 'yes = show the sale bar with a countdown at the top of every page. Only for a real offer.'],
    ['sale_title', 'Onam offer: free delivery on every order', 'The words in the sale bar. Keep it short.'],
    ['sale_ends', '', 'When the offer ends, India time, e.g. 2026-11-30 23:59. The bar disappears by itself after this.'],
    ['sale_link', '#products', 'Where "Shop now" goes: #products, #missing-home or #cravings'],
    ['bestsellers', '', 'Your real best sellers, comma separated: prawns, fish, beef, chicken, kozhuva, kakka, chemmeen-podi, garlic, dates-lemon, dates, adamanga, mango-red, mango-white, lemon, dates-lemon-classic, mango-carrot, pineapple, chutney, coconut'],
    ['banner', 'auto', 'auto = festival box banner in its season (Onam, Vishu, Christmas, Easter) or your poster; on = always; off = never'],
    ['banner_title', '', 'Optional headline for the banner, e.g. Christmas is here'],
    ['banner_text', '', 'Optional one line under it'],
    ['banner_image', '', 'Your poster: upload to Google Drive, Share > Anyone with the link, paste the link here. Wide pictures work best (about 1600 x 700).'],
    ['banner_link', '#missing-home', 'Where the poster goes when tapped: #products, #missing-home or #cravings'],
    ['banner_box', '', 'Optional: which box the banner offers: sadya, feast, first-month, sunday, abroad, maggi']
  ]);
  sh.setColumnWidth(1, 140); sh.setColumnWidth(2, 320); sh.setColumnWidth(3, 620);
  sh.getRange('C:C').setWrap(true);
}

function doPost(e) {
  try {
    var o = JSON.parse(e.postData.contents);
    // basic guards: the URL is public, so ignore junk and cap how fast alerts can arrive
    if (!/^BH-\d{6}-[A-Z0-9]{4}$/.test(o.oid || '') || !o.msg || o.msg.length > 3000) return reply('ignored');
    var cache = CacheService.getScriptCache(), n = Number(cache.get('n') || 0);
    if (n >= 30) return reply('busy');               // at most 30 orders per 10 minutes
    cache.put('n', String(n + 1), 600);
    if (cache.get(o.oid)) return reply('duplicate');  // same order sent twice
    cache.put(o.oid, '1', 21600);

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) sheet.appendRow(['Time', 'Order', 'Name', 'Phone', 'Email', 'Address', 'Items', 'Subtotal', 'Payment', 'Status']);
    // text starting with = + - @ would run as a spreadsheet formula: force every customer value to plain text
    var t = function (v) { v = String(v == null ? '' : v).slice(0, 400); return /^[=+\-@\t\r]/.test(v) ? "'" + v : v; };
    var items = (o.lines || []).slice(0, 30).map(function (l) { return l.name + ' (' + l.size + ') x' + l.qty; }).join('\n');
    sheet.appendRow([new Date(), t(o.oid), t(o.name), "'" + String(o.phone).slice(0, 20), t(o.email), t(o.address), t(items), typeof o.total === 'number' ? o.total : '', t(o.pay), 'New']);

    // CallMeBot is a third party: send the order, not the customer's address (that stays in your Sheet)
    var alert = '*New order ' + o.oid + '*\n' + items + '\nSubtotal: ' + (typeof o.total === 'number' ? '₹' + o.total : 'to confirm') +
      '\nFrom: ' + String(o.name).slice(0, 80) + (o.abroad ? '\nPACK FOR OVERSEAS PARCEL' : '') +
      '\nFull details are in your Bharany orders sheet.\nReply: https://wa.me/' + String(o.phone).replace(/\D/g, '').replace(/^(?!91)(\d{10})$/, '91$1');
    sendWhatsApp(alert);
    return reply('ok');
  } catch (err) {
    return reply('error');
  }
}

function sendWhatsApp(text) {
  var p = PropertiesService.getScriptProperties();
  var url = 'https://api.callmebot.com/whatsapp.php?phone=' + p.getProperty('PHONE') +
            '&apikey=' + p.getProperty('APIKEY') + '&text=' + encodeURIComponent(text);
  UrlFetchApp.fetch(url, { muteHttpExceptions: true });
}

function reply(s) { return ContentService.createTextOutput(s); }

function testAlert() { sendWhatsApp('Bharany test: order alerts are working ✅'); }
