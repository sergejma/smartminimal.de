/* Schlankes, einwilligungsbasiertes Consent-Banner für smartminimal.de.
   Google Analytics (G-6SM4T8E6T2) wird ausschließlich nach aktiver Zustimmung
   geladen — DSGVO/TDDDG-konform. Kein Framework, keine externen Abhängigkeiten. */
(function () {
  var GA_ID = "G-6SM4T8E6T2";
  var KEY = "sm-consent";

  function getChoice() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function setChoice(v) {
    try { localStorage.setItem(KEY, v); } catch (e) {}
  }

  function loadGA() {
    if (window.__smGaLoaded) return;
    window.__smGaLoaded = true;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag("js", new Date());
    gtag("config", GA_ID);
  }

  function injectStyles() {
    if (document.getElementById("sm-consent-style")) return;
    var css =
      ".sm-consent{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;" +
      "max-width:520px;margin:0 auto;background:#17170f;color:#ece8df;" +
      "border:1px solid rgba(236,232,223,0.14);border-radius:16px;" +
      "padding:18px 20px;box-shadow:0 30px 70px -30px rgba(0,0,0,0.6);" +
      "font-family:-apple-system,'SF Pro Text','Segoe UI',Roboto,Helvetica,Arial,sans-serif;" +
      "font-size:0.9rem;line-height:1.5;}" +
      ".sm-consent p{margin:0 0 14px;color:rgba(236,232,223,0.7);}" +
      ".sm-consent a{color:#ece8df;text-underline-offset:2px;}" +
      ".sm-consent .row{display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap;}" +
      ".sm-consent button{font:inherit;font-weight:500;cursor:pointer;border:none;" +
      "border-radius:999px;padding:0.6rem 1.4rem;transition:transform .15s ease,opacity .2s ease;}" +
      ".sm-consent button:hover{transform:translateY(-1px);}" +
      ".sm-consent .decline{background:none;color:rgba(236,232,223,0.6);}" +
      ".sm-consent .decline:hover{color:#ece8df;}" +
      ".sm-consent .accept{background:#ece8df;color:#141410;}";
    var st = document.createElement("style");
    st.id = "sm-consent-style";
    st.textContent = css;
    document.head.appendChild(st);
  }

  function removeBanner() {
    var b = document.getElementById("sm-consent");
    if (b) b.parentNode.removeChild(b);
  }

  function showBanner() {
    if (document.getElementById("sm-consent")) return;
    injectStyles();
    var box = document.createElement("div");
    box.className = "sm-consent";
    box.id = "sm-consent";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-label", "Cookie-Einwilligung");
    box.innerHTML =
      '<p>Diese Seite nutzt Google Analytics, um zu verstehen, wie sie genutzt wird – ' +
      'aber nur mit deiner Zustimmung. Mehr dazu in der ' +
      '<a href="/datenschutz.html">Datenschutzerklärung</a>.</p>' +
      '<div class="row">' +
      '<button type="button" class="decline">Ablehnen</button>' +
      '<button type="button" class="accept">Akzeptieren</button>' +
      "</div>";
    document.body.appendChild(box);
    box.querySelector(".accept").addEventListener("click", function () {
      setChoice("granted");
      loadGA();
      removeBanner();
    });
    box.querySelector(".decline").addEventListener("click", function () {
      setChoice("denied");
      removeBanner();
    });
  }

  function init() {
    var c = getChoice();
    if (c === "granted") {
      loadGA();
    } else if (c !== "denied") {
      showBanner();
    }
    // Erlaubt das erneute Öffnen über einen Link mit data-consent-open (Widerruf/Änderung)
    document.addEventListener("click", function (e) {
      var t = e.target.closest ? e.target.closest("[data-consent-open]") : null;
      if (t) { e.preventDefault(); showBanner(); }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
