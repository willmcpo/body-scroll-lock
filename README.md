<p align="left"> <img width="675" src="https://raw.githubusercontent.com/willmcpo/body-scroll-lock/master/images/logo.png" alt="Body scroll lock...just works with everything ;-)" /> </p>

## Why BSL?
Enables body scroll locking (for iOS Mobile and Tablet, Android, desktop Safari/Chrome/Firefox) without breaking scrolling of a target element (eg. modal/lightbox/flyouts/nav-menus).

*Features:*

- disables body scroll WITHOUT disabling scroll of a target element
- works on iOS mobile/tablet (!!)
- works on Android
- works on Safari desktop
- works on Chrome/Firefox 
- works with vanilla JS and frameworks such as React / Angular
- supports nested target elements (eg. a modal that appears on top of a flyout)
- can reserve scrollbar width
- `-webkit-overflow-scrolling: touch` still works

*Aren't the alternative approaches sufficient?*

- the approach `document.body.ontouchmove = (e) => { e.preventDefault; return false; };` locks the
body scroll, but ALSO locks the scroll of a target element (eg. modal).
- the approach `overflow: hidden` on the body or html elements doesn't work for all browsers
- the `position: fixed` approach causes the body scroll to reset
- some approaches break inertia/momentum/rubber-band scrolling on iOS

## Install

    $ yarn add body-scroll-lock
    
    or
    
    $ npm install body-scroll-lock
    
    
    
You can now also load via a `<script src='lib/bodyScrollLock.js />` tag (refer to the lib folder).


## Usage examples
##### Vanilla JS
```javascript
// 1. Import the functions
const bodyScrollLock = require('body-scroll-lock');
const disableBodyScroll = bodyScrollLock.disableBodyScroll;
const enableBodyScroll = bodyScrollLock.enableBodyScroll;
  
// 2. Get a target element that you want to persist scrolling for (such as a modal/lightbox/flyout/nav). 
const targetElement = document.querySelector("#someElementId");
  
  
// 3. ...in some event handler after showing the target element...disable body scroll
disableBodyScroll(targetElement);
 
 
// 4. ...in some event handler after hiding the target element...
enableBodyScroll(targetElement);
```
  
  
##### React/ES6
```javascript
// 1. Import the functions
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
  
class SomeComponent extends React.Component {
  targetElement = null;
  
  componentDidMount() {
    // 2. Get a target element that you want to persist scrolling for (such as a modal/lightbox/flyout/nav). 
    this.targetElement = document.querySelector('#targetElementId');
  }
  
  showTargetElement = () => {
    // ... some logic to show target element
    
    // 3. Disable body scroll
    disableBodyScroll(this.targetElement);
  };
  
  hideTargetElement = () => {
    // ... some logic to hide target element
    
    // 4. Re-enable body scroll
    enableBodyScroll(this.targetElement);
  }
  
  componentWillUnmount() {
    // 5. Useful if we have called disableBodyScroll for multiple target elements,
    // and we just want a kill-switch to undo all that.
    // OR useful for if the `hideTargetElement()` function got circumvented eg. visitor 
    // clicks a link which takes him/her to a different page within the app.
    clearAllBodyScrollLocks();
  }

  render() {   
    return (
      <div>
        some JSX to go here
      </div> 
    );
  }
}
```

## Demo
Check out the demo, powered by Now, @ https://bodyscrolllock.now.sh

## Caveat
~~On iOS mobile (as is visible in the above demo), if you scroll the body directly even when the scrolling is 
locked (on iOS), the body scrolls - this is not what this package solves. It solves the typical case where a modal 
overlays the screen, and scrolling within the modal never causes the body to scroll too (when the top or bottom 
within the modal has been reached).~~

Since the latest update (thanks @Neddz), this caveat is no longer valid. iOS mobile behaviour should be the same as 
other devices (eg. Android Chrome). 

## Functions

| Function | Arguments | Return | Description |
| :--- | :--- | :---: | :--- |
| `disableBodyScroll` | `targetElement: HTMLElement` | `void` | Disables body scroll while enabling scroll on target element |
| `enableBodyScroll` | `targetElement: HTMLElement`<br/>`options: BodyScrollOptions` | `void` | Enables body scroll and removing listeners on target element |
| `clearAllBodyScrollLocks` | `null` | `void` | Clears all scroll locks |

## Options
### reserveScrollBarGap
**optional, default:** false

If the overflow property of the body is set to hidden, the body widens by the width of the scrollbar. This produces an
unpleasant flickering effect, especially on websites with centered content. If the `reserveScrollBarGap` option is set,
this gap is filled by a `padding-right` on the body element. If `disableBodyScroll` is called for the last target element,
or `clearAllBodyScrollLocks` is called, the `padding-right` is automatically reset to the previous value.
``` js
import { enableBodyScroll } from 'body-scroll-lock';
import type { BodyScrollOptions } from 'body-scroll-lock';

const options: BodyScrollOptions = {
    reserveScrollBarGap: true
}

enableBodyScroll(targetElement, options);
```
## References
https://medium.com/jsdownunder/locking-body-scroll-for-all-devices-22def9615177
https://stackoverflow.com/questions/41594997/ios-10-safari-prevent-scrolling-behind-a-fixed-overlay-and-maintain-scroll-posi
