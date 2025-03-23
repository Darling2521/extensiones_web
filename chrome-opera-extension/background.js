const API_URL = 'http://localhost:5000/tabs'; // Cambia esto a la URL de tu API

// Función para obtener todas las pestañas
function getAllTabs() {
  chrome.tabs.query({}, function(tabs) {
    const tabData = tabs.map(tab => ({
	  tabId: tab.id,
      url: tab.url,
      title: tab.title,
      favicon: tab.favIconUrl,
      browser: 'chrome', // o 'opera', dependiendo de dónde se instale
      timestamp: new Date().toISOString()
    }));
    
    // Enviar los datos a tu servidor
    sendToServer(tabData);
  });
}

// Función para enviar datos al servidor
function sendToServer(data) {
  fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(data => console.log('Éxito:', data))
  .catch(error => console.error('Error:', error));
}

// Monitorear cambios en las pestañas
chrome.tabs.onCreated.addListener(function(tab) {
  getAllTabs();
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
	  sendToServer([{
      url: tab.url,
      title: tab.title,
      favicon: tab.favIconUrl,
      browser: 'chrome', // O el navegador correspondiente
      timestamp: new Date().toISOString()
    }]);
  }
});

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
  getAllTabs();
});

// Capturar pestañas al iniciar
getAllTabs();