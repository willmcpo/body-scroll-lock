# body-scroll-lock

## Why body-scroll-lock ?
Enables body scroll locking (for iOS Mobile and Tablet, Android, desktop Safari/Chrome/Firefox) without breaking scrolling of a target element (eg. modal/lightbox/flyouts/nav-menus).

*Features:*

- disables body scroll WITHOUT disabling scroll of a target element
- works on iOS mobile/tablet
- works on Android
- works on Safari desktop
- works on Chrome/Firefox 
- works with vanilla JS and frameworks such as React
- supports nested target elements (eg. a modal that appears on top of a flyout)
- `-webkit-overflow-scrolling: touch` still works

*Aren't the alternative approaches sufficient?*

- the approach `document.body.ontouchmove = (e) => { e.preventDefault; return false; };` locks the
body scroll, but ALSO locks the scroll of a target element (eg. modal).
- the approach `overflow: hidden` on the body or html elements doesn't work for all browsers

## Install

    $ yarn add body-scroll-lock
    or
    $ npm install body-scroll-lock



## Usage examples
##### Vanilla JS
    
    // 1. Import the functions
    const bodyScrollLock = require('body-scroll-lock');
    const disableBodyScroll = bodyScrollLock.disableBodyScroll;
    const enableBodyScroll = bodyScrollLock.enableBodyScroll;
      
    // 2. Get a target element (such as a modal/lightbox/flyout/nav). 
    const targetElement = document.querySelector("#someElementId");
      
      
    // 3. ...in some event handler after showing the target element...disable body scroll
    disableBodyScroll(targetElement);
     
     
    // 4. ...in some event handler after hiding the target element...
    enableBodyScroll(targetElement);
    
  
  
##### React/ES6

    // 1. Import the functions
    import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
      
    class SomeComponent extends React.Component {
      targetElement = null;
      
      componentDidMount() {
        // 2. Get a target element 
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

## Demo
http://wp-os.s3-website-ap-southeast-2.amazonaws.com/body-scroll-lock-demo/index.html

## Functions

| Function | Argument | Return | Description |   
| :--- | :--- | :---: | :--- |
| `disableBodyScroll` | `targetElement: HTMLElement` | `void` | Disables body scroll while enabling scroll on target element |
| `enableBodyScroll` | `targetElement: HTMLElement` | `void` | Enables body scroll and removing listeners on target element |
| `clearAllBodyScrollLocks` | `null` | `void` | Clears all scroll locks |
    
    
## Reference
https://stackoverflow.com/questions/41594997/ios-10-safari-prevent-scrolling-behind-a-fixed-overlay-and-maintain-scroll-posi
