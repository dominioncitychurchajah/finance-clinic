/* ==========================================================================
   FINANCE CLINIC — APPLICATION JAVASCRIPT
   Shared Utilities, Interactive Components & Page Handlers
   ========================================================================== */

(function () {
  'use strict';

  // --- 1. STICKY NAVIGATION ---
  var nav = document.getElementById('nav');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('stuck', window.scrollY > 10);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // --- 2. INTERSECTION OBSERVER SCROLL REVEALS ---
  var reveals = document.querySelectorAll('.rv');
  if (reveals.length > 0) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) {
              e.target.classList.add('on');
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
      );
      reveals.forEach(function (el, i) {
        el.style.transitionDelay = (Math.min(i % 4, 3) * 65) + 'ms';
        io.observe(el);
      });
    } else {
      reveals.forEach(function (el) {
        el.classList.add('on');
      });
    }
  }

  // --- 3. SYMPTOM CHECK CALCULATOR (INDEX PAGE) ---
  var symptomsContainer = document.getElementById('symptoms');
  var result = document.getElementById('result');
  var count = document.getElementById('count');
  var verdict = document.getElementById('verdict');
  var advice = document.getElementById('advice');
  var cta = document.getElementById('resultCta');

  if (symptomsContainer && result && count && verdict && advice && cta) {
    var boxes = Array.prototype.slice.call(symptomsContainer.querySelectorAll('input[type="checkbox"]'));
    var states = [
      {
        min: 0,
        t: 'Tick what applies above.',
        d: 'Most people carry four or five of these and assume it is normal. It is common. That is a different thing.'
      },
      {
        min: 1,
        t: 'One or two symptoms. Worth a look.',
        d: 'Small things left alone become the reason a good salary disappears. Stage 1 handles these in the first month.'
      },
      {
        min: 3,
        t: 'You are not broke. You are undiagnosed.',
        d: 'Three or more symptoms is not a character problem. It is a system problem, and systems can be rebuilt. This is exactly what the first ninety days are for.'
      },
      {
        min: 6,
        t: 'This is treatable, and it is urgent.',
        d: 'Six or more means money is costing you sleep, and probably peace at home. Come to the first class. Bring the real numbers. Nobody will be surprised by them.'
      }
    ];

    var updateSymptoms = function () {
      var n = boxes.filter(function (b) { return b.checked; }).length;
      var s = states[0];
      for (var i = 0; i < states.length; i++) {
        if (n >= states[i].min) s = states[i];
      }
      count.textContent = n + (n === 1 ? ' symptom selected' : ' symptoms selected');
      verdict.textContent = s.t;
      advice.textContent = s.d;
      result.setAttribute('data-state', n === 0 ? 'idle' : 'active');
      cta.hidden = (n === 0);
    };

    boxes.forEach(function (b) {
      b.addEventListener('change', updateSymptoms);
    });
    updateSymptoms();
  }

  // --- 4. COHORT COUNTDOWN TIMER (CURRICULUM PAGE) ---
  var cdD = document.getElementById('cdD');
  var cdH = document.getElementById('cdH');
  var cdM = document.getElementById('cdM');
  var cdS = document.getElementById('cdS');

  if (cdD && cdH && cdM && cdS) {
    var targetDate = '2026-09-05T16:00:00+01:00';
    var start = new Date(targetDate).getTime();

    var pad = function (n) {
      return n < 10 ? '0' + n : '' + n;
    };

    var tick = function () {
      var left = start - Date.now();
      if (left <= 0) {
        cdD.textContent = cdH.textContent = cdM.textContent = cdS.textContent = '00';
        return;
      }
      var s1 = Math.floor(left / 1000);
      cdD.textContent = pad(Math.floor(s1 / 86400));
      cdH.textContent = pad(Math.floor(s1 % 86400 / 3600));
      cdM.textContent = pad(Math.floor(s1 % 3600 / 60));
      cdS.textContent = pad(s1 % 60);
    };

    tick();
    setInterval(tick, 1000);
  }

})();
