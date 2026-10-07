var $ = function (s) { return document.querySelector(s); };
var $$ = function (s) { return document.querySelectorAll(s); };
var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

$('#year').textContent = new Date().getFullYear();

// Toast kecil untuk notifikasi
function toast(msg) {
  var t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toast.id); toast.id = setTimeout(function () { t.classList.remove('show'); }, 2000);
}

// Teks mengetik bergantian
var words = ['Mahasiswa', 'Coding enthusiast', 'Gamer', 'Pembelajar seumur hidup'];
var wi = 0, ci = 0, del = false, typed = $('#typed');
function type() {
  var w = words[wi];
  typed.textContent = w.slice(0, ci);
  if (!del && ci === w.length) { del = true; return setTimeout(type, 1400); }
  if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; }
  ci += del ? -1 : 1;
  setTimeout(type, del ? 40 : 85);
}
if (reduce) typed.textContent = words.join(' · '); else type();

// Progress bar, tombol ke atas, menu aktif
var links = $$('nav a'), secs = ['tentang', 'proyek', 'keahlian', 'kontak'];
window.addEventListener('scroll', function () {
  var h = document.documentElement;
  $('#progress').style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
  $('#toTop').classList.toggle('show', h.scrollTop > 500);
  var cur = '';
  secs.forEach(function (id) { if ($('#' + id).getBoundingClientRect().top < innerHeight * 0.4) cur = id; });
  links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + cur); });
}, { passive: true });
$('#toTop').addEventListener('click', function () { scrollTo({ top: 0 }); });

// Muncul saat di-scroll
var io = new IntersectionObserver(function (es) {
  es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
$$('.reveal').forEach(function (el) { io.observe(el); });

// Cahaya mengikuti kursor + foto miring 3D (hanya perangkat dengan mouse)
if (window.matchMedia('(hover: hover)').matches && !reduce) {
  var glow = $('#glow');
  window.addEventListener('mousemove', function (e) {
    glow.style.opacity = 1; glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px';
  });
  var wrap = $('#photoWrap'), photo = wrap.firstElementChild;
  wrap.addEventListener('mousemove', function (e) {
    var r = wrap.getBoundingClientRect();
    var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    photo.style.transform = 'rotateY(' + (x * 14) + 'deg) rotateX(' + (-y * 14) + 'deg)';
  });
  wrap.addEventListener('mouseleave', function () { photo.style.transform = ''; });
}

// Menu HP
var burger = $('#burger'), menu = $('#menu');
burger.addEventListener('click', function () {
  var open = menu.classList.toggle('open'); burger.setAttribute('aria-expanded', open);
});
links.forEach(function (a) { a.addEventListener('click', function () { menu.classList.remove('open'); burger.setAttribute('aria-expanded', false); }); });

// Filter proyek
$$('.chip').forEach(function (c) {
  c.addEventListener('click', function () {
    $$('.chip').forEach(function (x) { x.classList.remove('active'); });
    c.classList.add('active');
    var f = c.dataset.filter;
    $$('.projects li').forEach(function (li) { li.classList.toggle('hide', f !== 'all' && li.dataset.cat !== f); });
  });
});

// Salin email
$('#copyMail').addEventListener('click', function () {
  var mail = 'bagasstiawan0220@gmail.com';
  if (navigator.clipboard) navigator.clipboard.writeText(mail).then(function () { toast('Email disalin'); }, function () { toast(mail); });
  else toast(mail);
});
