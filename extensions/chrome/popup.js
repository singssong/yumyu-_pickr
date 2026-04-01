var btn = document.getElementById('toggle-btn');
var dot = document.getElementById('dot');
var statusText = document.getElementById('status-text');

// Check if VSCode Extension server is running
fetch('http://localhost:37799/ping', { mode: 'cors' })
  .then(function (r) {
    if (r.ok) {
      dot.classList.add('online');
      statusText.textContent = 'VSCode Extension connected';
    }
  })
  .catch(function () {
    dot.classList.remove('online');
    statusText.textContent = 'VSCode Extension not detected';
  });

btn.addEventListener('click', function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (!tabs[0]) return;
    chrome.tabs.sendMessage(tabs[0].id, { type: 'TOGGLE_PICKER' });
    window.close();
  });
});
