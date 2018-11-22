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

        const scrollTarget = document.querySelector('.scrollTarget');
        const disableBodyScrollButton = document.querySelector('.disableBodyScroll');
        const enableBodyScrollButton = document.querySelector('.enableBodyScroll');
        const disableBodyScrollButtonNoTargetElement = document.querySelector('.disableBodyScrollNoTargetElement');
        const enableBodyScrollButtonNoTargetElement = document.querySelector('.enableBodyScrollNoTargetElement');
        const statusElement = document.querySelector('.bodyScrollLockStatus');
        const targetStatusElement = document.querySelector('.targetElementLockStatus');

        function clearActiveButton() {
          const enabledButton = document.querySelector('.active');
          if (enabledButton) {
            enabledButton.classList.remove('active');
          }
        }

        disableBodyScrollButton.onclick = function(e) {
          console.info('disableBodyScrollButton');
          clearActiveButton();
          e.target.classList.add('active');
          bodyScrollLock.disableBodyScroll(scrollTarget);

          statusElement.innerHTML = ' &mdash; Scroll Locked';
          statusElement.style.color = 'red';

          targetStatusElement.innerHTML = ' &mdash; Scroll Enabled';
          targetStatusElement.style.color = 'green';
        };

        enableBodyScrollButton.onclick = function(e) {
          console.info('enableBodyScrollButton');
          clearActiveButton();
          e.target.classList.add('active');
          bodyScrollLock.enableBodyScroll(scrollTarget);

          statusElement.innerHTML = ' &mdash; Scroll Unlocked';
          statusElement.style.color = '';

          targetStatusElement.innerHTML = '';
          targetStatusElement.style.color = '';
        };

        disableBodyScrollButtonNoTargetElement.onclick = function(e) {
          console.info('disableBodyScrollButtonNoTargetElement');
          clearActiveButton();
          e.target.classList.add('active');
          bodyScrollLock.disableBodyScroll();

          statusElement.innerHTML = ' &mdash; Scroll Locked';
          statusElement.style.color = 'red';

          targetStatusElement.innerHTML = '';
          targetStatusElement.style.color = '';
        };

        enableBodyScrollButtonNoTargetElement.onclick = function(e) {
          console.info('enableBodyScrollButtonNoTargetElement');
          clearActiveButton();
          e.target.classList.add('active');
          bodyScrollLock.enableBodyScroll();

          statusElement.innerHTML = ' &mdash; Scroll Unlocked';
          statusElement.style.color = '';

          targetStatusElement.innerHTML = '';
          targetStatusElement.style.color = '';
        };
      },
      { '../../lib/bodyScrollLock.js': 2 },
    ],
    2: [
      function(require, module, exports) {
        (function(global, factory) {
          if (typeof define === 'function' && define.amd) {
            define(['exports'], factory);
          } else if (typeof exports !== 'undefined') {
            factory(exports);
          } else {
            var mod = {
              exports: {},
            };
            factory(mod.exports);
            global.bodyScrollLock = mod.exports;
          }
        })(this, function(exports) {
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

          // Older browsers don't support event options, feature detect it.

          // Adopted and modified solution from Bohdan Didukh (2017)
          // https://stackoverflow.com/questions/41594997/ios-10-safari-prevent-scrolling-behind-a-fixed-overlay-and-maintain-scroll-posi

          var hasPassiveEvents = false;
          if (typeof window !== 'undefined') {
            var passiveTestOptions = {
              get passive() {
                hasPassiveEvents = true;
                return undefined;
              },
            };
            window.addEventListener('testPassive', null, passiveTestOptions);
            window.removeEventListener('testPassive', null, passiveTestOptions);
          }

          var isIosDevice =
            typeof window !== 'undefined' &&
            window.navigator &&
            window.navigator.platform &&
            /iP(ad|hone|od)/.test(window.navigator.platform);

          var locks = [];
          var documentListenerAdded = false;
          var initialClientY = -1;
          var previousBodyOverflowSetting = void 0;
          var previousBodyPaddingRight = void 0;

          // returns true if `el` should be allowed to receive touchmove events
          var allowTouchMove = function allowTouchMove(el) {
            return locks.some(function(lock) {
              if (lock.options.allowTouchMove && lock.options.allowTouchMove(el)) {
                return true;
              }

              return false;
            });
          };

          var preventDefault = function preventDefault(rawEvent) {
            var e = rawEvent || window.event;

            // For the case whereby consumers adds a touchmove event listener to document.
            // Recall that we do document.addEventListener('touchmove', preventDefault, { passive: false })
            // in disableBodyScroll - so if we provide this opportunity to allowTouchMove, then
            // the touchmove event on document will break.
            if (allowTouchMove(e.target)) {
              return true;
            }

            // Do not prevent if the event has more than one touch (usually meaning this is a multi touch gesture like pinch to zoom)
            if (e.touches.length > 1) return true;

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

            if (allowTouchMove(event.target)) {
              return false;
            }

            if (targetElement && targetElement.scrollTop === 0 && clientY > 0) {
              // element is at the top of its scroll
              return preventDefault(event);
            }

            if (isTargetElementTotallyScrolled(targetElement) && clientY < 0) {
              // element is at the top of its scroll
              return preventDefault(event);
            }

            event.stopPropagation();
            return true;
          };

          var disableBodyScroll = (exports.disableBodyScroll = function disableBodyScroll(targetElement, options) {
            if (isIosDevice) {
              if (
                targetElement &&
                !locks.some(function(lock) {
                  return lock.targetElement === targetElement;
                })
              ) {
                var lock = {
                  targetElement: targetElement,
                  options: options || {},
                };

                locks = [].concat(_toConsumableArray(locks), [lock]);

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
              if (!documentListenerAdded) {
                document.addEventListener(
                  'touchmove',
                  preventDefault,
                  hasPassiveEvents ? { passive: false } : undefined
                );
                documentListenerAdded = true;
              }
            } else {
              setOverflowHidden(options);
              var _lock = {
                targetElement: targetElement,
                options: options || {},
              };

              locks = [].concat(_toConsumableArray(locks), [_lock]);
            }
          });

          var clearAllBodyScrollLocks = (exports.clearAllBodyScrollLocks = function clearAllBodyScrollLocks() {
            if (isIosDevice) {
              // Clear all locks ontouchstart/ontouchmove handlers, and the references
              locks.forEach(function(lock) {
                lock.targetElement.ontouchstart = null;
                lock.targetElement.ontouchmove = null;
              });

              if (documentListenerAdded) {
                document.removeEventListener(
                  'touchmove',
                  preventDefault,
                  hasPassiveEvents ? { passive: false } : undefined
                );
                documentListenerAdded = false;
              }

              locks = [];

              // Reset initial clientY
              initialClientY = -1;
            } else {
              restoreOverflowSetting();
              locks = [];
            }
          });

          var enableBodyScroll = (exports.enableBodyScroll = function enableBodyScroll(targetElement) {
            if (isIosDevice) {
              if (targetElement) {
                targetElement.ontouchstart = null;
                targetElement.ontouchmove = null;

                locks = locks.filter(function(lock) {
                  return lock.targetElement !== targetElement;
                });
              }

              if (documentListenerAdded && locks.length === 0) {
                document.removeEventListener(
                  'touchmove',
                  preventDefault,
                  hasPassiveEvents ? { passive: false } : undefined
                );

                documentListenerAdded = false;
              }
            } else if (!targetElement || (locks.length === 1 && locks[0].targetElement === targetElement)) {
              restoreOverflowSetting();

              locks = [];
            } else {
              locks = locks.filter(function(lock) {
                return lock.targetElement !== targetElement;
              });
            }
          });
        });
      },
      {},
    ],
  },
  {},
  [1]
);
