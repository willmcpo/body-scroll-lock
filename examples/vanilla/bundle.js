(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == 'function' && require;
        if (!u && a) return a(o, !0);
        if (i) return i(o, !0);
        var f = new Error("Cannot find module '" + o + "'");
        throw ((f.code = 'MODULE_NOT_FOUND'), f);
      }
      var l = (n[o] = { exports: {} });
      t[o][0].call(
        l.exports,
        function(e) {
          var n = t[o][1][e];
          return s(n ? n : e);
        },
        l,
        l.exports,
        e,
        t,
        n,
        r
      );
    }
    return n[o].exports;
  }
  var i = typeof require == 'function' && require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
})(
  {
    1: [
      function(require, module, exports) {
        const bodyScrollLock = require('../../lib/bodyScrollLock.js');

        const disableBodyScrollButton = document.querySelector('.disableBodyScroll');
        const enableBodyScrollButton = document.querySelector('.enableBodyScroll');
        const statusElement = document.querySelector('.bodyScrollLockStatus');

        disableBodyScrollButton.onclick = function() {
          console.info('disableBodyScrollButton');
          bodyScrollLock.disableBodyScroll(document.querySelector('.scrollTarget'));

          statusElement.innerHTML = ' &mdash; Scroll Locked';
          statusElement.style.color = 'red';
        };

        enableBodyScrollButton.onclick = function() {
          console.info('enableBodyScrollButton');
          bodyScrollLock.enableBodyScroll(document.querySelector('.scrollTarget'));

          statusElement.innerHTML = ' &mdash; Scroll Unlocked';
          statusElement.style.color = '';
        };
      },
      { '../../lib/bodyScrollLock.js': 2 },
    ],
    2: [
      function(require, module, exports) {
        !(function(o, e) {
          if ('function' == typeof define && define.amd) define(['exports'], e);
          else if ('undefined' != typeof exports) e(exports);
          else {
            var t = {};
            e(t), (o.bodyScrollLock = t);
          }
        })(this, function(exports) {
          'use strict';
          Object.defineProperty(exports, '__esModule', { value: !0 });
          var n =
              'undefined' != typeof window &&
              window.navigator &&
              window.navigator.platform &&
              /iPad|iPhone|iPod|(iPad Simulator)|(iPhone Simulator)|(iPod Simulator)/.test(window.navigator.platform),
            i = null,
            l = [],
            d = !1,
            u = -1,
            c = void 0,
            a = void 0,
            s = function(o) {
              var e = o || window.event;
              return e.preventDefault && e.preventDefault(), !1;
            },
            o = function() {
              setTimeout(function() {
                void 0 !== a && ((document.body.style.paddingRight = a), (a = void 0)),
                  void 0 !== c && ((document.body.style.overflow = c), (c = void 0));
              });
            };
          (exports.disableBodyScroll = function(r, o) {
            var t;
            n
              ? r &&
                !l.includes(r) &&
                ((l = [].concat(
                  (function(o) {
                    if (Array.isArray(o)) {
                      for (var e = 0, t = Array(o.length); e < o.length; e++) t[e] = o[e];
                      return t;
                    }
                    return Array.from(o);
                  })(l),
                  [r]
                )),
                (r.ontouchstart = function(o) {
                  1 === o.targetTouches.length && (u = o.targetTouches[0].clientY);
                }),
                (r.ontouchmove = function(o) {
                  var e, t, n, i;
                  1 === o.targetTouches.length &&
                    ((t = r),
                    (i = (e = o).targetTouches[0].clientY - u),
                    t && 0 === t.scrollTop && 0 < i
                      ? s(e)
                      : (n = t) && n.scrollHeight - n.scrollTop <= n.clientHeight && i < 0
                        ? s(e)
                        : e.stopPropagation());
                }),
                d || (document.addEventListener('touchmove', s, { passive: !1 }), (d = !0)))
              : ((t = o),
                setTimeout(function() {
                  if (void 0 === a) {
                    var o = !!t && !0 === t.reserveScrollBarGap,
                      e = window.innerWidth - document.documentElement.clientWidth;
                    o &&
                      0 < e &&
                      ((a = document.body.style.paddingRight), (document.body.style.paddingRight = e + 'px'));
                  }
                  void 0 === c && ((c = document.body.style.overflow), (document.body.style.overflow = 'hidden'));
                }),
                i || (i = r));
          }),
            (exports.clearAllBodyScrollLocks = function() {
              n
                ? (l.forEach(function(o) {
                    (o.ontouchstart = null), (o.ontouchmove = null);
                  }),
                  d && (document.removeEventListener('touchmove', s, { passive: !1 }), (d = !1)),
                  (l = []),
                  (u = -1))
                : (o(), (i = null));
            }),
            (exports.enableBodyScroll = function(e) {
              n
                ? ((e.ontouchstart = null),
                  (e.ontouchmove = null),
                  (l = l.filter(function(o) {
                    return o !== e;
                  })),
                  d && 0 === l.length && (document.removeEventListener('touchmove', s, { passive: !1 }), (d = !1)))
                : i === e && (o(), (i = null));
            });
        });
      },
      {},
    ],
  },
  {},
  [1]
);
