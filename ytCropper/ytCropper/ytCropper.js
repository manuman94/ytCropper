/*
	Plugin: YTCROPPER 
	Author: José Manuel Blasco Galdón
	Version: 1.0
	e-mail: sora_jose94@hotmail.com
	
	Description: 
	Librería de métodos que ayudan al programador a implementar 
	de forma sencilla un módulo que corta vídeos de youtube. Se
	trata de una previsualización del vídeo con su segmento para
	el corte y métodos que devuelven el valor de las manecillas 
	(valores inicial y final del intervalo).
	
	Licensed under the MIT and GPL licenses:
	http://www.opensource.org/licenses/mit-license.php
	http://www.gnu.org/licenses/gpl.html
	
	
*/


function ytCropper(idcont, userOptions, playerOptions)
{
	// Preparamos los div que contendrán el reproductor, la barra de reproducción y el slider
	$(idcont).append('<div id="ytcropper-player"></div><div id="ytcropper-playedHolder"><div id="ytcropper-playedPercentage"></div></div><div id="ytcropper-slider-range"></div>');
	
	var crop = $(this);
	var currentTime = 0; // El vídeo comenzará por el segundo 0
	var videoID = userOptions.idvid; // ID del vídeo
	var secondHandleInit; // Valor final del intervalo al comenzar la aplicación, manecilla derecha
	var player, firstValue, finalValue; // player -> referencia al reproductor de YT, firstValue & finalValue -> Valores inicial y final del intervalo
	
	if(userOptions.maxRange > userOptions.minRange && userOptions.minRange > 1)
		var maxRange = userOptions.maxRange, minRange = userOptions.minRange;
	else
	{
		console.log("The specified range is not valid. Configuring settings by default -> Max: None, Min: 1");
		var maxRange = 0, minRange = 1;
	}
	
	// Cargamos la IFrame API de Youtube
	var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	/* /////////////// */ 
	
	// Cuando la API esté lista
      window.onYouTubeIframeAPIReady = function()
	  {
		// Cargamos el reproductor con referencia en player
          player = new YT.Player('ytcropper-player', {
          width: userOptions.playerWidth,
          height: userOptions.playerHeight,
          videoId: videoID,
		  playerVars: playerOptions,
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
			'onError': onPlayerError
          }
        });
	  }
							 
	  // Cuando el vídeo esté preparado
      function onPlayerReady(event) {
		  
	 	this.duration = player.getDuration();   // devuelve la duración del vídeo
		
		// El tiempo para parar incialmente es la duración del vídeo
		timeToStop = this.duration;
		
		
		// Para establecer el valor final del intervalo al comienzo, verificamos si la duración del vídeo es mayor del límite
		if(timeToStop > maxRange)
		{
			secondHandleInit = maxRange; // Si lo es pondremos el final
			timeToStop = maxRange;
		}
		else
		{
			secondHandleInit = timeToStop; // Si no, la posición final será la misma duración del vídeo
		}
		
        event.target.playVideo(); // Reproducimos el vídeo
		
		// FUNCIÓN QUE CREA UNA VARIABLE QUE SE ACTUALIZA CADA 100MS CON EL TIEMPO TRANSCURRIDO
		var updateTime = function() {
			var oldTime = currentTime; // Se guarda el valor anterior del tiempo para compararlo
			
			if(player && player.getCurrentTime) { // Si existe reproductor y tiene una duración
			  currentTime = player.getCurrentTime(); // guardamos el tiempo en currentTime
			}
			if(currentTime !== oldTime) { // Si son diferentes -si está en reproducción- 
			  onProgress(currentTime);     // se llama a onProgress con el tiempo de reproducción actual
			}
	  	}
	  	var timeupdater = setInterval(updateTime, 100); // Cada 100ms se llama a updateTime
		
		
		// FUNCIÓN LLAMADA CADA VEZ QUE EL TIEMPO AVANZA
		var onProgress = function(currentTime) {
		  crop.trigger("onProgress", currentTime);		
		  if(currentTime >= timeToStop) {							  // Si se llega al final de la reproducción (límite derecho)
			  player.seekTo($("#ytcropper-slider-range").slider("values", 0)); // poner la reproducción al principio y 
			  player.stopVideo();                                	 // parar la reproducción
		  }
		  
		  // Calculamos el porcentaje reproducido para actualizar la barra de reproducción
		  $("#ytcropper-playedPercentage").css("width", (currentTime * 100) / this.duration + "%");
		  
		}

		
		// CONFIGURACIÓN DEL SLIDER
		$("#ytcropper-slider-range").slider({
			range: true,  // Es un slider de intervalo
			min: 0, // El mínimo del intervalo es 0
			max: this.duration, // El máximo del intervalo es la duración del vídeo
			values: [0, secondHandleInit], // Valores iniciales de las manecillas, 0 y el cálculo anterior
			slide: function(event, ui) {
				
				if ( ui.value == ui.values[0]) { // Si se mueve la manecilla izquierda
				
					return setValue(ui.value, 0);
				}
				
				if ( ui.value == ui.values[1]) { // Si se mueve la manecilla derecha
				
					return setValue(ui.value, 1);
				}
			}
		});
			
      }	
			// Funciones que configuran las variables firstValue y FinalValue con formato MM:SS (para mostrar)
			var configureInitialValue = function(m,s)
			{
				firstValue = mostrarConDosDigitos(m) + ":" + mostrarConDosDigitos(s);
			}
		
			var configureFinalValue = function(m,s)
			{
				finalValue = mostrarConDosDigitos(m) + ":" + mostrarConDosDigitos(s);
			}
			
			// Función que pone el valor de la manecilla "handle" || handle = 0 -> primera manecilla; handle = 1 -> segunda manecilla
			var setValue = function(value, handle)
			{
				if(handle == 0) // si es primera manecilla
				{
					diferencia = $("#ytcropper-slider-range").slider("values", 1) - value; // Calculamos la diferencia entre cada handle
					
					if(diferencia <= minRange) // Si es menor de cinco segundos 
						return false;   // que no se mueva más
					else
					{
						player.seekTo(value, true); // Si muevo la barra inicial, el vídeo va al punto
						
						crop.trigger("onFirstHandleChange",value);
						
						if(maxRange != 0)// Si está deshabilitado el límite máximo
						if(diferencia >= maxRange) // Si el recorte es de más de un minuto, deslizar el otro slider
						{
							$("#ytcropper-slider-range").slider("values", 1, $("#ytcropper-slider-range").slider("values", 1) - (diferencia - 59)); // Calcular la cantidad adecuada
							crop.trigger("onSecondHandleChange", $("#ytcropper-slider-range").slider("values", 1));
							
							timeToStop = $("#ytcropper-slider-range").slider("values", 1); // Ponemos el final del intervalo donde la manecilla derecha
						}
						return true;
					}
					
				}
				else if (handle == 1) // si es segunda manecilla
				{
					diferencia = value - $("#ytcropper-slider-range").slider("values", 0); // Se calcula la diferencia entre manecillas
					
					if(diferencia < minRange) // Si es menor de cinco segundos 
						return false;  // que no se mueva más
					else
					{
						timeToStop = value; // Ponemos el final del intervalo donde la manecilla derecha
						
						crop.trigger("onSecondHandleChange",value);
						
						if(maxRange != 0) // Si está deshabilitado el límite máximo
						if(diferencia > maxRange) // Si el recorte es de más de un minuto, deslizar el otro slider
						{
							crop.trigger("onFirstHandleChange", $("#ytcropper-slider-range").slider("values", 0));
							$("#ytcropper-slider-range").slider("values", 0, $("#ytcropper-slider-range").slider("values", 0) + (diferencia - 59));
							
							player.seekTo($("#ytcropper-slider-range").slider("values", 0), true); // Y ponemos el play en el valor de la manecilla izquierda
						}
						return true;
					}
				}
			}
			
			
			function onPlayerStateChange(event)
			{
				var playerState = event.data;
				
				if(playerState == YT.PlayerState.PLAYING)
				{
					crop.trigger("onVideoPlay", currentTime);
				}
				else if(YT.PlayerState.PAUSED)
				{
					crop.trigger("onVideoPause", currentTime);
				}
				else if(playerState == YT.PlayerState.ENDED)
				{
					crop.trigger("onVideoStop", currentTime);
				}
			}
			
			function onPlayerError(event)
			{
				alert("Ha habido un error con el reproductor. Código de error: "+event.data);
			}
			
			
			// MÉTODOS PÚBLICOS DE LA CLASE
			
			/*
				ytCropper::getVideoId()
				Devuelve el ID del vídeo asignado al cropper
			*/	
			
			this.getVideoId = function()
			{
				return videoID;
			}
			
			/*
				ytCropper::getInitialValue()
				Devuelve el valor de la primera manecilla en segundos (valor inicial del intervalo)
			*/			
			this.getInitialValue = function()
			{
				return $("#ytcropper-slider-range").slider("values", 0);
			}
			
			/*
				ytCropper::getFinalValue()
				Devuelve el valor de la segunda manecilla en segundos (valor final del intervalo)
			*/			
			this.getFinalValue = function()
			{
				return $("#ytcropper-slider-range").slider("values", 1);
			}
			
			/*
				ytCropper::getCurrentTime()
				Devuelve el tiempo de reproducción actual en segundos
			*/			
			this.getCurrentTime = function()
			{
				return currentTime;
			}
			
			/*
				ytCropper::getEmbedLink()
				Devuelve un link embed de youtube configurado para reproducir el intervalo especificado en el cropper
			*/			
			this.getEmbedLink = function()
			{
				return "http://www.youtube.com/embed/"+this.getVideoId()+"?start="+this.getInitialValue()+"&end="+this.getFinalValue();
			}
			
			/*
				ytCropper::setInitialValue(value)
				Función que cambia el valor inicial del intervalo
				
				- Parámetros:
				value -> Valor en segundos
			*/			
			this.setInitialValue = function(value)
			{
				if(setValue(value,0))
					$("#ytcropper-slider-range").slider("values", 0,value);
				else
					console.log("Value outside of range - Valor fuera del rango");
			}
			
			/*
				ytCropper::setFinalValue(value)
				Función que cambia el valor final del intervalo
				
				- Parámetros:
				value -> Valor en segundos
			*/			
			this.setFinalValue = function(value)
			{
				if(setValue(value,1))
					$("#ytcropper-slider-range").slider("values", 1,value);
				else
					console.log("Value outside of range - Valor fuera del rango");
			}
			
			
			return this;
			
}

/* EXTRA FUNCTIONS */

/*
Función que obliga a los dígitos tener al menos dos cifras (para mostrarlos en formato MM:SS), 'n' es el número a mostrar
*/
function showWithTwoDigits(n){
	return n > 9 ? "" + n: "0" + n;
}

/*
Funcion que convierte segundos en minutos y segundos.
*/
function toDefaultTime(seconds)
{
	var m = Math.floor(seconds / 60);
	var secd0 = seconds % 60;
	var s = Math.ceil(secd0);
	return {minutes: m, seconds: s};
}








