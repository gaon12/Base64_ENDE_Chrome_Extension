chrome.runtime.onMessage.addListener((message) => {
    if (message.text) {
      document.getElementById('result').textContent = message.text;
    }
  });
  