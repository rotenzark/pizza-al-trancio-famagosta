/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'pizza-al-trancio-famagosta',
    whatsapp: {
      number: '', // nessun telefono né WhatsApp sulla scheda Google: si viene di persona
      message: '',
      ids: [],
    },
    /* scheda Google (27/9/2026): lun, mar, gio, ven, sab 12–14 e 18–21:30; dom 18–21:30; mer chiuso */
    hours: {
      0: [['18:00', '21:30']],
      1: [['12:00', '14:00'], ['18:00', '21:30']],
      2: [['12:00', '14:00'], ['18:00', '21:30']],
      3: [],
      4: [['12:00', '14:00'], ['18:00', '21:30']],
      5: [['12:00', '14:00'], ['18:00', '21:30']],
      6: [['12:00', '14:00'], ['18:00', '21:30']],
    },
    hoursStatusId: 'orarioStato',
    hoursTableSelector: '[data-day]',
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1020,
    EN: {
      'm.salta': 'Skip to content',
      'm.top': 'Pizza al Trancio, back to the top',
      'm.sezioni': 'Sections',
      'm.lingua': 'Language',
      'm.menu': 'Open the menu',
      'm.ingrandisci': 'Enlarge the photo',
      'm.lightbox': 'Enlarged photo',
      'm.chiudi': 'Close',
      'v.forno': 'The oven', 'v.pizza': 'The pizza', 'v.lorenza': 'Lorenza', 'v.orari': 'Hours', 'v.dove': 'Where',
      'h.titolo': 'Please<br>take a<br>number',
      'h.grazie': 'Thank you',
      'h.alt': 'A whole round tray of thick pizza, cut into wedges, with golden, charred mozzarella, in its box',
      'h.cap': 'The whole tray, cut into slices.',
      'h.nota': 'Your number is 8.<br>Meanwhile, have a look around.',
      'h.sopra': 'Pizza by the slice · Viale Famagosta&nbsp;8',
      'h.lede': 'Thick, with plenty of mozzarella, baked in trays in the wood-fired oven: on Viale Famagosta for more than forty years. <strong>Takeaway only.</strong> No bookings: you come in, take a number and wait for your turn.',
      'h.orari': 'Opening hours',
      'h.strada': 'Directions',
      'h.voto': 'on Google · 565 reviews',
      'c1.turno': 'Now serving 1.',
      'c1.t': 'The wood-fired oven',
      'c1.p1': 'At the heart of the shop, there it is: a dome of white plaster, a mouth of dark tiles, the firewood stacked underneath. The round trays go in and out at lunch and dinner, and the pizza comes out thick, with a crisp base.',
      'c1.cartello': 'Their sign: «The pizzaiolo Diego. Number 1. Nobody beats him anymore»',
      'c1.fcart': 'The sign is theirs: it hangs on the wall, next to the oven. «Pizzaiolo Diego, number 1, nobody beats him anymore.»',
      'c1.alt': 'The wood-fired oven, lit: the mouth of brown tiles, the fire at the back, a tray inside, the peel resting on it and, underneath, in the white plaster arch, the stacked firewood',
      'c1.cap': 'The oven, lit, with the firewood underneath.',
      'c2.turno': 'Now serving 2.',
      'c2.t': 'The dough',
      'c2.p': 'Made every day, just enough for the day. When it runs out, it runs out: in the evening, better not to come too late.',
      'c3.turno': 'Now serving 3.',
      'c3.t': 'One pizza only',
      'c3.p1': 'There is no menu here: there is the margherita by the slice. Thick, with plenty of mozzarella and a crisp crust; some say the crust is the best part. On request, spicy salami or ham.',
      'c3.nota': 'Oregano? They ask at the till: say so straight away, before they close the box.',
      'c3.alt1': 'A thick wedge of margherita, with white and golden mozzarella and a dark, crisp crust, on a gold tray with a pizza cutter',
      'c3.cap1': 'A slice of margherita.',
      'c3.alt2': 'A thick slice with sliced spicy salami and oregano on the melted mozzarella, on a white plate',
      'c3.cap2': 'With spicy salami, on request.',
      'c4.turno': 'Now serving 4.',
      'c4.t': 'Good thing Lorenza’s here',
      'c4.p1': 'While you wait your turn you never get bored: Lorenza tells stories about the neighbourhood, cracks jokes, sometimes sings.',
      'c4.p2': 'On the walls, dozens of framed photos: not of celebrities, but of friends and longtime customers. The title is their own words: «Fortuna che c’è Lorenza» is written on the cart in front of the door.',
      'c4.alt1': 'A white cart with bicycle wheels: on the awning «Pizzeria da Lorenza», on the cloth «Fortuna che c’è lorenza» in red script, and a pot of flowers',
      'c4.cap1': 'The cart: «Pizzeria da Lorenza».',
      'c4.alt2': 'The shop from the entrance: the white plaster wall with the pizzaiolo Diego sign, the white dome of the oven with the fire lit, the terracotta floor, yellow curtains at the back',
      'c4.cap2': 'Inside: the oven and, on the wall, Diego’s sign.',
      'c5.turno': 'Now serving 5.',
      'c5.t': 'The regulars',
      'c5.p1': 'Some have been coming for thirty years, some grew up here. On the Google listing:',
      'c5.voto': 'out of 5 · 565 reviews',
      'c5.r1': '«I’m 25 and I’ve been eating this pizza practically since I was born, and it has always been exceptional. P.S. I think it’s the only pizza where the best part is the crust. Need I say more?»',
      'c5.r2': '«A historic, one-of-a-kind place run by Signora Lorenza.. they don’t make them like this anymore..!! Top pizza, and so is the owner’s entertainment, with jokes and songs she sings herself.. <span class="taglio">[…]</span>»',
      'c5.r3': '«Famous all over the area.. a really good pizza by the slice! There’s always a bit of a queue but the wait is worth it! And you’ll surely crack a smile or two meanwhile.. Remember to take a number (a pebble) as soon as you arrive! <span class="taglio">[…]</span>»',
      'c5.r4': '«This pizza-by-the-slice place is the hidden gem of the neighbourhood. <span class="taglio">[…]</span> The owners are old school, they’ve had this place for decades and still run it themselves. <span class="taglio">[…]</span> We fondly renamed it “crazy pizza”, and since we tried it we’ve decided it’s the best in the area.»',
      'c5.r5': '«Welcoming owners, pizza ready in no time. A whole tray <span class="taglio">[…]</span>, split among 6, and there was even some left over. They gave us everything we needed to eat it at the office (cutlery, plates and napkins). I’ll definitely be back»',
      'c5.nota': 'From the reviews on Google, as they were written (translated from Italian).',
      'c5.tutte': 'Read them all on Google →',
      'c6.turno': 'Now serving 6.',
      'c6.t': 'Takeaway only',
      'c6.p1': 'No seats here and no delivery: you take the pizza away. Home, the office, or outside on the avenue, still hot.',
      'c6.p2': 'And some swear it’s good the next day too.',
      'c6.alt': 'An open white box with a slice of margherita and oregano, resting on a stone ledge outdoors; on the side of the box «Buon appetito»',
      'c6.cap': 'The slice in its box, outdoors.',
      'c7.turno': 'Now serving 7.',
      'c7.t': 'Hours',
      'c7.cap': 'Opening hours',
      'g.lun': 'Monday', 'g.mar': 'Tuesday', 'g.mer': 'Wednesday', 'g.gio': 'Thursday', 'g.ven': 'Friday', 'g.sab': 'Saturday', 'g.dom': 'Sunday',
      'g.chiuso': 'closed',
      'g.sera': 'evening only, 18–21:30',
      'c7.p1': 'These are the hours on the Google listing. When they close for holidays, they put a sign on the door.',
      'c7.p2': 'No bookings: you come in person, take a number and wait.',
      'c8.turno': 'Now serving 8. It’s your turn.',
      'c8.t': 'How much?',
      'c8.q1': 'One slice: for one',
      'c8.q2': 'Half a tray',
      'c8.q3': 'The whole tray: for six',
      'c8.peso': 'Pizza is sold by weight.',
      'c8.cit': '«The owner is a plus, greeting everyone with a “quanta?”, how much?, which as marketing is a winner in itself!»',
      'c8.su': 'on Google (translated from Italian)',
      'c8.dove': 'Where',
      'c8.otto': 'Number 8, like your number. On the side road, in the Barona area.',
      'c8.k1': 'Metro',
      'c8.v1': 'M2 Famagosta, about 900 metres straight along the avenue',
      'c8.k2': 'How',
      'c8.v2': 'Takeaway only, no bookings',
      'c8.strada': 'Directions to Viale Famagosta&nbsp;8',
      'c8.alt': 'The yellow façade with the white sign «PIZZA al trancio» in brown letters above the glass door and the raised shutter; two flower pots on the step',
      'c8.cap': 'The sign, on Viale Famagosta.',
      'c8.mappa': 'Map: Pizza al Trancio, Viale Famagosta 8, Milan',
      'z.come': 'takeaway only',
      'z.cred': 'Demo website made by <a href="https://bespokestud.io" rel="noopener">Bespoke Studio</a> · texts from the Google listing, their signs and public reviews on Google (September 2026); photos from the Google listing.',
      'z.su': 'Back to the top ↑',
    },
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ══════════ PIZZA AL TRANCIO — «Si prega di ritirare il numero.» ══════════
     1. IL TURNO: la pagina è l'attesa. Ogni capitolo è il turno di qualcun altro (data-turno 1–7) e il bigliettino
        in tasca dice a chi tocca; all'8 tocca a voi (8 come il civico).
     2. la FIRMA — il sassolino («Ricordate di prendere il numero (un sassolino) appena arrivate!», su Google): in
        copertina, sul banco d'acciaio, l'8 salta via dal mucchio e va in tasca, in basso a sinistra; all'ultimo
        capitolo torna sul banco, nel posto che lo aspetta (#postoMio).
        Stato finale = l'HTML: l'8 posato sul banco del capitolo 8, il mucchio 9–14 in copertina, la tasca hidden.
        Senza JS, con reduced-motion o senza GSAP si vede quello, fermo. La classe firma-attesa (messa nell'head)
        nasconde l'8 del capitolo finché non torna: se questo codice non parte, l'head la toglie dopo 2,5 s. */
  var sassoMio = document.getElementById('sassoMio');
  var postoOtto = document.getElementById('postoOtto');
  var tasca = document.getElementById('tasca');
  var sassoTasca = document.getElementById('sassoTasca');
  var tascaMio = document.getElementById('tascaMio');
  var tascaTurno = document.getElementById('tascaTurno');
  var capOtto = document.getElementById('quanta');
  var FRASI = {
    it: { mio: 'il vostro numero', turno: function (n) { return (n === 1 || n === 8 || n === 11 ? 'tocca all\u2019' : 'tocca al ') + n; }, voi: 'tocca a voi!' },
    en: { mio: 'your number', turno: function (n) { return 'now serving ' + n; }, voi: 'it\u2019s your turn!' },
  };
  var turnoOra = 1;
  var faseSasso = 'banco'; // mucchio → volo → tasca → volo → banco
  var ottoInVista = false;
  var LATO = 84; // il sassolino che vola: largo come quelli del mucchio

  function frasi() { return FRASI[root.lang] || FRASI.it; }
  function scriviTasca() {
    if (!tascaMio || !tascaTurno) return;
    var F = frasi();
    tascaMio.textContent = F.mio;
    tascaTurno.textContent = turnoOra >= 8 ? F.voi : F.turno(turnoOra);
  }

  /* lo stato degli orari (aperto/chiuso) in tre punti della pagina, col pallino verde quando è aperto */
  function copiaStato() {
    var primo = document.getElementById(SITE.hoursStatusId);
    if (!primo) return;
    var aperto = hoursState().open;
    ['orarioStato', 'orarioStato2', 'orarioStato3'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el !== primo) el.textContent = primo.textContent;
      el.classList.toggle('is-aperto', aperto);
    });
  }
  copiaStato();
  setInterval(copiaStato, 60000);
  new MutationObserver(function () { copiaStato(); scriviTasca(); }).observe(root, { attributes: true, attributeFilter: ['lang'] });

  /* il centro di un elemento nella viewport (la rotazione non lo sposta) e la sua larghezza vera, senza rotazione */
  function centroDi(el) {
    var r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: el.offsetWidth };
  }
  /* un sassolino che vola: copia dell'8, fisso nella viewport, posizionato dal suo angolo in alto a sinistra */
  function sassoInVolo() {
    var v = sassoMio.cloneNode(true);
    v.removeAttribute('id');
    v.classList.remove('sasso--mio');
    v.classList.add('sasso--volo');
    v.style.setProperty('--s', LATO + 'px');
    document.body.appendChild(v);
    return v;
  }
  function mettiIn(v, c, scala, rot) {
    gsap.set(v, { x: c.x - LATO / 2, y: c.y - LATO * 0.4, scale: scala, rotation: rot });
  }
  /* volo da un punto a un bersaglio che può muoversi (si scorre durante il volo): il bersaglio si rilegge a ogni fotogramma */
  function vola(v, da, bersaglio, alza, durata, r0, fine) {
    var st = { p: 0 };
    var s0 = da.w / LATO;
    gsap.to(st, {
      p: 1, duration: durata, ease: 'power2.inOut',
      onUpdate: function () {
        var t = centroDi(bersaglio), p = st.p;
        var s1 = t.w / LATO;
        mettiIn(v, { x: da.x + (t.x - da.x) * p, y: da.y + (t.y - da.y) * p - Math.sin(p * Math.PI) * alza }, s0 + (s1 - s0) * p, r0 + (-8 - r0) * p - Math.sin(p * Math.PI) * 10);
      },
      onComplete: fine,
    });
  }

  /* 1 · dal mucchio alla tasca. L'8 sta in cima al mucchio da subito e lo segue se si scorre; salta via (salta) quando
     il mucchio si vede davvero o quando si passa a un capitolo */
  var volante = null, segui = null, saltato = false;
  function mettiSulMucchio() {
    faseSasso = 'mucchio';
    volante = sassoInVolo();
    segui = function () { var c = centroDi(postoOtto); c.w = LATO; mettiIn(volante, c, 1, -8); };
    segui();
    gsap.ticker.add(segui);
    tasca.hidden = false;
    gsap.set(sassoTasca, { opacity: 0 });
    gsap.set(tasca, { autoAlpha: 0, y: 12 });
    scriviTasca();
  }
  function salta(ritardo) {
    if (saltato || !volante) return;
    saltato = true;
    var v = volante;
    gsap.timeline({ delay: ritardo, onStart: function () { gsap.ticker.remove(segui); } })
      .to(v, { y: '-=34', rotation: -20, duration: 0.32, ease: 'power2.out' })
      .add(function () {
        faseSasso = 'volo';
        gsap.to(tasca, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' });
        var ora = { x: gsap.getProperty(v, 'x') + LATO / 2, y: gsap.getProperty(v, 'y') + LATO * 0.4, w: LATO };
        vola(v, ora, sassoTasca, 90, 0.85, -20, function () {
          v.remove();
          gsap.set(sassoTasca, { opacity: 1 });
          faseSasso = 'tasca';
          if (ottoInVista) tornaSulBanco();
        });
      });
  }

  /* 2 · dalla tasca al banco dell'8: il sassolino atterra dove l'HTML lo tiene fermo */
  function tornaSulBanco() {
    faseSasso = 'volo';
    var v = sassoInVolo();
    var da = centroDi(sassoTasca);
    mettiIn(v, da, da.w / LATO, -8);
    gsap.set(sassoTasca, { opacity: 0 });
    gsap.to(tasca, { autoAlpha: 0, y: 12, duration: 0.35, delay: 0.2, onComplete: function () { tasca.hidden = true; } });
    turnoOra = 8;
    vola(v, da, sassoMio, 110, 0.95, -8, function () {
      v.remove();
      root.classList.remove('firma-attesa');
      gsap.fromTo(sassoMio, { y: -7 }, { y: 0, duration: 0.4, ease: 'bounce.out', clearProps: 'transform' });
      faseSasso = 'banco';
    });
  }

  var avviaFirma = function () {};
  var puoAnimare = hasGsap && !reducedMotion && sassoMio && postoOtto && tasca && sassoTasca && capOtto;
  if (!puoAnimare) {
    root.classList.remove('firma-attesa');
  } else {
    window.__sassoPronto = true;
    if (capOtto.getBoundingClientRect().top < window.innerHeight * 0.9) {
      /* la pagina si apre già sull'8 (ancora #quanta o #dove, scroll ripristinato): il sassolino è già sul banco */
      root.classList.remove('firma-attesa');
      turnoOra = 8;
    } else {
      mettiSulMucchio();
      avviaFirma = function () { salta(0.25); };
      var mucchio = document.getElementById('mucchio');
      var ossMucchio = new IntersectionObserver(function (voci) {
        voci.forEach(function (v) { if (v.isIntersecting) { ossMucchio.disconnect(); salta(0.7); } });
      }, { threshold: 0.6, rootMargin: "0px 0px -12% 0px" }); // non quando affiora appena in fondo allo schermo (mobile: la tasca ci finirebbe sopra)
      if (mucchio) ossMucchio.observe(mucchio); else salta(0.7);
    }
    new IntersectionObserver(function (voci) {
      voci.forEach(function (v) {
        ottoInVista = v.isIntersecting;
        if (ottoInVista && faseSasso === 'tasca') tornaSulBanco();
      });
    }, { threshold: 0.6 }).observe(sassoMio);
  }

  /* il bigliettino: a chi tocca, secondo il capitolo a metà schermo */
  if ('IntersectionObserver' in window) {
    var ossTurno = new IntersectionObserver(function (voci) {
      voci.forEach(function (v) {
        if (!v.isIntersecting) return;
        var n = parseInt(v.target.getAttribute('data-turno'), 10) || 0;
        if (faseSasso === 'banco' && turnoOra >= 8) return; // il vostro turno è arrivato: resta
        if (n >= 1) avviaFirma(); // si è passati ai capitoli senza guardare il mucchio: l'8 va in tasca lo stesso
        turnoOra = Math.max(1, n);
        scriviTasca();
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('[data-turno]').forEach(function (c) { ossTurno.observe(c); });
  }
})();
