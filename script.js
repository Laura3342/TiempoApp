
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
    <div class="flex flex-col items-center bg-black/20 rounded-2xl p-6 shadow-xl mb-6">
      <img src="https://openweathermap.org/img/wn/${imagen}@2x.png" alt="${estado}">
      <p class= "text-5xl font-bold">${temp}ºC</p>
      <h2 class="text-2xl font-bold mb-2 text-white"> ${d.name}</h3>
      
      <div class="flex justify-between w-full mt-4 px-4">
        <div class="flex flex-col items-center">
          <p class="text-2xl font-bold">💧${humedad}%</p>
          <span class="text-sm text-gray-200">Humedad</span>
        </div>
        <div class="flex flex-col items-center">
          <p class="text-2xl font-bold">🍃${viento} km/h</p>
          <span class="text-sm text-gray-200">Viento</span>
        </div>
      </div>
    </div> 
    <h3 class="flex justify-center font-bold text-xl mb-7">Pronóstico próximos 4 días:</h3>
    <div id="pronostico" class="flex gap-4 overflow-x-auto pb-2 justify-center"></div>
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
    card.className = `
    flex-shrink-0
    bg-black/20
    rounded-2xl p-4 shadow-lg text-center w-40
      
    `;


    card.classList.add('diaCard');
    card.innerHTML = `
      <p class="font-semibold text-gray-800 mb-1 text-white">${diaSemana}</p>
      <img src="https://openweathermap.org/img/wn/${icono}@2x.png" alt="${estado}">
      <p class ="temp">${temp} °C</p>
      <p class ="estado">${estado}</p>
    
    `;
    contenedor.appendChild(card);
  });

}



