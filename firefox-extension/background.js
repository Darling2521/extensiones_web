const API_URL = 'http://localhost:5000/tabs'; // Cambia esto a la URL de tu API

// Función para obtener todas las pestañas
function getAllTabs() {
  browser.tabs.query({}).then(tabs => {
    const tabData = tabs.map(tab => ({
	  tabId: tab.id,
      url: tab.url,
      title: tab.title,
      favicon: tab.favIconUrl,
      browser: 'firefox',
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
browser.tabs.onCreated.addListener(function(tab) {
  getAllTabs();
});

browser.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    sendToServer([{
      url: tab.url,
      title: tab.title,
      favicon: tab.favIconUrl,
      browser: 'firefox', // O el navegador correspondiente
      timestamp: new Date().toISOString()
    }]);
  }
});

browser.tabs.onRemoved.addListener(function(tabId, removeInfo) {
  getAllTabs();
});

// Capturar pestañas al iniciar
getAllTabs();