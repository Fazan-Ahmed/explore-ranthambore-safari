/* ================= SITE_CONFIG =================
   CONTACT DETAILS: edit numbers/links HERE (also update the plain HTML links, which work without JavaScript).
   7665151817 is a phone number only — it is NOT WhatsApp. */
const SITE_CONFIG = {
  brandName: "Explore Ranthambore Safari",
  domain: "https://exploreranthamboresafari.in/",
  primaryPhone: "8619152322",
  secondaryPhone: "7665151817",
  whatsappUrl: "https://wa.me/message/SUCM2DBCG7WPD1"
};
/* EMAILJS: create a free EmailJS account, then replace the three values below.
   Set the receiving email inside the EmailJS template (not here). Never put private keys here — only the PUBLIC key.
   Template variables used: name, mobile, date, guests, type, shift. */
const EMAILJS = { serviceId: "service_j7eskfh", templateId: "template_w6ebk2b", publicKey: "z3fhOAPPiiDGlRKJD" };
/* HOTEL LAUNCH CONTROL
   Change to "LIVE" only after verified hotel information is added.
   While using placeholder/sample hotel content, do not use the hotel pages as Google Ads landing pages. */
const HOTEL_MODE = "PLACEHOLDER";
/* HOTEL DATA: HOTEL PLACEHOLDER — replace each entry only after verified hotel information is available. */
const HOTELS = [
  {id:"sample-3star",name:"Partner Hotel – 3 Star (Placeholder)",stars:"3-Star Hotels",location:"Ranthambore / Sawai Madhopur (to be updated)",facilities:"To be updated after verification",short:"Sample Hotel Listing – Replace With Verified Hotel",overview:"Overview will be added after verified hotel information is available.",rooms:"Room information to be updated.",nearby:"Nearby information to be updated."},
  {id:"sample-4star",name:"Partner Hotel – 4 Star (Placeholder)",stars:"4-Star Hotels",location:"Ranthambore / Sawai Madhopur (to be updated)",facilities:"To be updated after verification",short:"Sample Hotel Listing – Replace With Verified Hotel",overview:"Overview will be added after verified hotel information is available.",rooms:"Room information to be updated.",nearby:"Nearby information to be updated."},
  {id:"sample-5star",name:"Partner Hotel – 5 Star (Placeholder)",stars:"5-Star Hotels",location:"Ranthambore / Sawai Madhopur (to be updated)",facilities:"To be updated after verification",short:"Sample Hotel Listing – Replace With Verified Hotel",overview:"Overview will be added after verified hotel information is available.",rooms:"Room information to be updated.",nearby:"Nearby information to be updated."}
];
const $ = (s, r=document) => r.querySelector(s), $$ = (s, r=document) => [...r.querySelectorAll(s)];
const esc = t => String(t).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const waLink = text => SITE_CONFIG.whatsappUrl + (text ? "?text=" + encodeURIComponent(text) : "");

// Apply config to links
$$("[data-tel=primary]").forEach(a => a.href = "tel:" + SITE_CONFIG.primaryPhone);
$$("[data-tel=secondary]").forEach(a => a.href = "tel:" + SITE_CONFIG.secondaryPhone);
$$("[data-wa]").forEach(a => a.href = SITE_CONFIG.whatsappUrl);
const y = $("#year"); if (y) y.textContent = new Date().getFullYear();

// Mobile menu
const burger = $(".burger"), nav = $("#nav");
burger.addEventListener("click", () => { const o = nav.classList.toggle("open"); burger.setAttribute("aria-expanded", o); burger.setAttribute("aria-label", o ? "Close menu" : "Open menu"); });
$$("#nav a").forEach(a => a.addEventListener("click", () => { nav.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }));

// Back to top
const topBtn = $("#top");
addEventListener("scroll", () => { topBtn.hidden = scrollY < 500; }, {passive:true});
topBtn.addEventListener("click", () => scrollTo({top:0}));

// FAQ: keep one open at a time
$$(".faq details").forEach(d => d.addEventListener("toggle", () => { if (d.open) $$(".faq details").forEach(o => { if (o !== d) o.open = false; }); }));

// Booking form
const form = $("#enq");
if (form) {
  const dt = $("#date"), today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  dt.min = today.toISOString().slice(0,10);
  const status = $("#status");
  const val = () => {
    const v = Object.fromEntries(["name","mobile","date","guests","type","shift"].map(k => [k, form.elements[k].value.trim()]));
    const e = {};
    if (!/^[A-Za-z][A-Za-z .'-]{1,59}$/.test(v.name)) e.name = "Enter your full name (letters only).";
    if (!/^[6-9]\d{9}$/.test(v.mobile.replace(/[\s-]/g,""))) e.mobile = "Enter a valid 10-digit mobile number.";
    if (!v.date || v.date < dt.min) e.date = "Choose today or a future date.";
    if (!(+v.guests >= 1 && +v.guests <= 20)) e.guests = "Enter 1 to 20 guests.";
    if (!v.type) e.type = "Select a safari type.";
    if (!v.shift) e.shift = "Select a shift.";
    $$(".err").forEach(s => s.textContent = e[s.dataset.for] || "");
    return Object.keys(e).length ? null : v;
  };
  const msg = v => `Hello, I want to enquire about a Ranthambore safari.\n\nName: ${v.name}\nSafari Date: ${v.date}\nGuests: ${v.guests}\nSafari Type: ${v.type}\nPreferred Shift: ${v.shift}\n\nWebsite: ${SITE_CONFIG.brandName}`;
  $("#wa-send").addEventListener("click", () => { const v = val(); if (v) open(waLink(msg(v)), "_blank", "noopener"); });
  form.addEventListener("submit", async ev => {
    ev.preventDefault(); const v = val(); if (!v) { status.className = "bad"; status.textContent = "Please fix the highlighted fields."; return; }
    const ready = ![EMAILJS.serviceId, EMAILJS.templateId, EMAILJS.publicKey].some(x => x.startsWith("EMAILJS_"));
    if (!ready) { status.className = "bad"; status.textContent = "Online enquiry is not available right now. Please use the WhatsApp button or call us."; return; }
    status.className = ""; status.textContent = "Sending…";
    try {
      const r = await fetch("https://api.emailjs.com/api/v1.0/email/send", {method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({service_id:EMAILJS.serviceId, template_id:EMAILJS.templateId, user_id:EMAILJS.publicKey, template_params:v})});
      if (!r.ok) throw 0;
      status.className = "ok"; status.textContent = "Enquiry sent. We will contact you. This is not a booking confirmation."; form.reset();
    } catch { status.className = "bad"; status.textContent = "Could not send. Please use WhatsApp or call us."; }
  });
}

// Hotels list + details
const hl = $("#hotels"), hd = $("#hd");
if (hl) {
  $("#hmode").textContent = HOTEL_MODE === "PLACEHOLDER" ? "These are sample/placeholder listings. No hotel partnerships, prices or availability are shown or implied." : "";
  hl.innerHTML = ["3-Star Hotels","4-Star Hotels","5-Star Hotels"].map(c => `<h2>${c}</h2>` + HOTELS.filter(h => h.stars === c).map(h => `<!-- HOTEL PLACEHOLDER: replace this card only after verified hotel information is available. -->
<article class="card hcard"><div class="ph" role="img" aria-label="Image placeholder for ${esc(h.name)}"></div><div><h3>${esc(h.name)}</h3><p class="muted">${esc(h.stars)} · ${esc(h.location)}</p><p>${esc(h.short)}</p><p><strong>Facilities:</strong> ${esc(h.facilities)}</p><div class="cta"><a class="btn btn-a" href="/hotel-details.html?id=${encodeURIComponent(h.id)}">More Information</a><a class="btn btn-l dk" target="_blank" rel="noopener" href="${waLink("Hello, I want to enquire about: " + h.name)}">Enquire on WhatsApp</a></div></div></article>`).join("")).join("");
}
if (hd) {
  const h = HOTELS.find(x => x.id === new URLSearchParams(location.search).get("id"));
  hd.insertAdjacentHTML("beforeend", !h ? "<h1>Hotel not found</h1><p>Please choose a hotel from the catalogue.</p>" :
    `<h1>${esc(h.name)}</h1>${HOTEL_MODE==="PLACEHOLDER"?'<p class="warn">Sample listing — details will be updated after verified hotel information is available.</p>':""}<p class="muted">${esc(h.stars)} · ${esc(h.location)}</p><h2>Overview</h2><p>${esc(h.overview)}</p><h2>Facilities</h2><p>${esc(h.facilities)}</p><h2>Room information</h2><p>${esc(h.rooms)}</p><h2>Nearby information</h2><p>${esc(h.nearby)}</p><a class="btn btn-a" target="_blank" rel="noopener" href="${waLink("Hello, I want to enquire about: " + h.name)}">Enquire on WhatsApp</a>`);
}