
const ApiKey = 'a7a6acf4bb38c97fe6bfa1a3c782bd77';
const box = document.getElementById('resultado');

function obtenerClima() {
  const pais = document.getElementById('pais').value.trim();
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${pais}&appid=${ApiKey}&units=metric&lang=es`)
    .then(r => r.json())
    .then(d => pintar(d))    
    .catch(err => console.error('Error al obtener el clima:', err));
}

function pintar(d) {
  box.style.display = 'block';

  // Se comprueba el estado del clima 

  const estado = d.weather[0].main;
  let imagen = '';

  //Se elige la imagen según el estado

  if (estado === 'Clouds'){
    imagen= 'Images/nubes.png';
  }else if(estado === 'Clear'){
    imagen= 'Images/sol.png';
  }else if(estado === 'Rain'){
    imagen='Images/lluvia.png';
  }else if(estado === 'Drizzle'){
    imagen= 'Images/llovizna.png';
  }
  
  
  // Se muestra los datos y las imagenes
  box.innerHTML = `
    <h3>Clima en ${d.name}</h3>
    <p>☁️ Estado: ${d.weather[0].description}</p>
    <p>🌡️ Temperatura: ${Math.round(d.main.temp)}ºC</p>
    <p>🍃 Viento: ${d.wind.speed} m/s</p>
    <p>🤦‍♀️ Presión: ${d.main.pressure} hPa</p>
    <img src="${imagen}" alt="${estado}" style="max-width: 150px; display:block; margin 20px auto;">
  `;
}



