
const ApiKey = 'a7a6acf4bb38c97fe6bfa1a3c782bd77';
const box = document.getElementById('resultado');

async function obtenerClima() {
  const ciudad = document.getElementById('ciudad').value.trim();
  if(!ciudad){
    alert("Introduce una ciudad");
    return;
  }

  try{
    const resActual = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&cnt=3&appid=${ApiKey}&units=metric&lang=es`);
    const dataActual = await resActual.json();

    const resFutura = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${ciudad}&appid=${ApiKey}&units=metric&lang=es`);
    const dataFutura = await resFutura.json();

    pintarClimaActual(dataActual);
    pintarClimaFuturo(dataFutura);
    
  }catch(err){
    console.error("Problema al obtener el clima: ", err);
    box.innerHTML = "<p>Error al cargar los datos.</p>"

  }
}



function pintarClimaActual(d) {
  box.style.display = 'block';

  const estado = d.weather[0].description;
  const imagen= d.weather[0].icon;
  const temp = Math.round(d.main.temp);
  const humedad = d.main.humidity;
  const viento = (d.wind.speed* 3.6).toFixed(1);;


  // Se muestra los datos y las imagenes
  box.innerHTML = `
    <div class="climaActual">
      <h2>Clima en ${d.name}</h3>
      <img src="https://openweathermap.org/img/wn/${imagen}@2x.png" alt="${estado}">
      <p>☁️ Estado: ${estado}</p>
      <p>🌡️ Temperatura: ${temp}ºC</p>
      <p>💧 Humedad: ${humedad}%</p>
      <p>🍃 Velocidad del viento: ${viento} km/h</p>
    </div> 
    <h3>Pronóstico próximos 4 días:</h3>
    <div id="pronostico" class="pronosticoContainer"></div>
  `;
}

function pintarClimaFuturo(data){
  const contenedor = document.getElementById('pronostico');
  contenedor.innerHTML= "";

  "Se filtran los pronósticos de cada día a una misma hora  (12:00 am)" 

  const dias = {};
  const resFiltrado = [];

  for(const item of data.list){
    const fecha = new Date(item.dt_txt);
    const diaSemana = fecha.toLocaleDateString("es-ES", {weekday: "long"});
    const hora = fecha.getHours();

    if (hora === 12 && !dias[diaSemana]){
      dias[diaSemana] = true;
      resFiltrado.push(item);

    }
  }

  // Se seleccionan solo los siguientes 4 días

  resFiltrado.slice(1,5).forEach(item => {
    const fecha = new Date(item.dt_txt);
    const diaSemana = fecha.toLocaleDateString("es-ES", { weekday: "long" });
    const temp = Math.round(item.main.temp);
    const icono = item.weather[0].icon;
    const estado = item.weather[0].description;

    const card = document.createElement('div');
    card.classList.add('diaCard');
    card.innerHTML = `
      <p class= "dia">${diaSemana}</p>
      <img src="https://openweathermap.org/img/wn/${icono}@2x.png" alt="${estado}">
      <p class ="temp">${temp} °C</p>
      <p class ="estado">${estado}</p>
    
    `;
    contenedor.appendChild(card);
  });

}



