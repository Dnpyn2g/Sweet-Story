(function() {
    function signalGooglefcPresent() {
      if (!window.frames['googlefcPresent']) {
        if (document.body) {
          const iframe = document.createElement('iframe');
          iframe.style.cssText = 'width: 0; height: 0; border: none; z-index: -1000; left: -1000px; top: -1000px; display: none;';
          iframe.name = 'googlefcPresent';
          document.body.appendChild(iframe);
        } else {
          setTimeout(signalGooglefcPresent, 0);
        }
      }
    }
    signalGooglefcPresent();
  })();
  