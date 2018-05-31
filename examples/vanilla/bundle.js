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
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true,
        });

        function _toConsumableArray(arr) {
          if (Array.isArray(arr)) {
            for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
              arr2[i] = arr[i];
            }
            return arr2;
          } else {
            return Array.from(arr);
          }
        }

        var isIosDevice =
          typeof window !== 'undefined' &&
          window.navigator &&
          window.navigator.platform &&
          /iPad|iPhone|iPod|(iPad Simulator)|(iPhone Simulator)|(iPod Simulator)/.test(window.navigator.platform);
        // Adopted and modified solution from Bohdan Didukh (2017)
        // https://stackoverflow.com/questions/41594997/ios-10-safari-prevent-scrolling-behind-a-fixed-overlay-and-maintain-scroll-posi

        var firstTargetElement = null;
        var allTargetElements = [];
        var initialClientY = -1;
        var previousBodyOverflowSetting = void 0;
        var previousBodyPaddingRight = void 0;

        var preventDefault = function preventDefault(rawEvent) {
          var e = rawEvent || window.event;
          if (e.preventDefault) e.preventDefault();

          return false;
        };

        var setOverflowHidden = function setOverflowHidden(options) {
          // Setting overflow on body/documentElement synchronously in Desktop Safari slows down
          // the responsiveness for some reason. Setting within a setTimeout fixes this.
          setTimeout(function() {
            // If previousBodyPaddingRight is already set, don't set it again.
            if (previousBodyPaddingRight === undefined) {
              var _reserveScrollBarGap = !!options && options.reserveScrollBarGap === true;
              var scrollBarGap = window.innerWidth - document.documentElement.clientWidth;

              if (_reserveScrollBarGap && scrollBarGap > 0) {
                previousBodyPaddingRight = document.body.style.paddingRight;
                document.body.style.paddingRight = scrollBarGap + 'px';
              }
            }

            // If previousBodyOverflowSetting is already set, don't set it again.
            if (previousBodyOverflowSetting === undefined) {
              previousBodyOverflowSetting = document.body.style.overflow;
              document.body.style.overflow = 'hidden';
            }
          });
        };

        var restoreOverflowSetting = function restoreOverflowSetting() {
          // Setting overflow on body/documentElement synchronously in Desktop Safari slows down
          // the responsiveness for some reason. Setting within a setTimeout fixes this.
          setTimeout(function() {
            if (previousBodyPaddingRight !== undefined) {
              document.body.style.paddingRight = previousBodyPaddingRight;

              // Restore previousBodyPaddingRight to undefined so setOverflowHidden knows it
              // can be set again.
              previousBodyPaddingRight = undefined;
            }

            if (previousBodyOverflowSetting !== undefined) {
              document.body.style.overflow = previousBodyOverflowSetting;

              // Restore previousBodyOverflowSetting to undefined
              // so setOverflowHidden knows it can be set again.
              previousBodyOverflowSetting = undefined;
            }
          });
        };

        // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#Problems_and_solutions
        var isTargetElementTotallyScrolled = function isTargetElementTotallyScrolled(targetElement) {
          return targetElement
            ? targetElement.scrollHeight - targetElement.scrollTop <= targetElement.clientHeight
            : false;
        };

        var handleScroll = function handleScroll(event, targetElement) {
          var clientY = event.targetTouches[0].clientY - initialClientY;

          if (targetElement && targetElement.scrollTop === 0 && clientY > 0) {
            // element is at the top of its scroll
            return preventDefault(event);
          }

          if (isTargetElementTotallyScrolled(targetElement) && clientY < 0) {
            // element is at the top of its scroll
            return preventDefault(event);
          }

          return true;
        };

        var disableBodyScroll = (exports.disableBodyScroll = function disableBodyScroll(targetElement, options) {
          if (isIosDevice) {
            // targetElement must be provided, and disableBodyScroll must not have been
            // called on this targetElement before.
            if (targetElement && !allTargetElements.includes(targetElement)) {
              allTargetElements = [].concat(_toConsumableArray(allTargetElements), [targetElement]);

              targetElement.ontouchstart = function(event) {
                if (event.targetTouches.length === 1) {
                  // detect single touch
                  initialClientY = event.targetTouches[0].clientY;
                }
              };
              targetElement.ontouchmove = function(event) {
                if (event.targetTouches.length === 1) {
                  // detect single touch
                  handleScroll(event, targetElement);
                }
              };
            }
          } else {
            setOverflowHidden(options);

            if (!firstTargetElement) firstTargetElement = targetElement;
          }
        });

        var clearAllBodyScrollLocks = (exports.clearAllBodyScrollLocks = function clearAllBodyScrollLocks() {
          if (isIosDevice) {
            // Clear all allTargetElements ontouchstart/ontouchmove handlers, and the references
            allTargetElements.forEach(function(targetElement) {
              targetElement.ontouchstart = null;
              targetElement.ontouchmove = null;
            });

            allTargetElements = [];

            // Reset initial clientY
            initialClientY = -1;
          } else {
            restoreOverflowSetting();

            firstTargetElement = null;
          }
        });

        var enableBodyScroll = (exports.enableBodyScroll = function enableBodyScroll(targetElement) {
          if (isIosDevice) {
            targetElement.ontouchstart = null;
            targetElement.ontouchmove = null;

            allTargetElements = allTargetElements.filter(function(element) {
              return element !== targetElement;
            });
          } else if (firstTargetElement === targetElement) {
            restoreOverflowSetting();

            firstTargetElement = null;
          }
        });
      },
      {},
    ],
  },
  {},
  [1]
);
