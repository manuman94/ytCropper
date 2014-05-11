ytCropper
===========
<b>Autor: José Manuel Blasco Galdón</b>

Librería de métodos que ayudan al programador a implementar de forma sencilla un módulo que corta vídeos de YouTube. Se trata de una previsualización de vídeo con un segmento para el corte y métodos para la recolección de valores (manecillas, tiempo de reproducción).


Se puede ver una <b>demo</b> de su uso en: http://www.ytcropper.com/developers


For full english DOCs, read:
https://github.com/manuman94/ytCropper/wiki

<b>Requisitos</b>

Incluir las librerías JQuery y JQuery UI (js y css), además de la hoja de estilos css y la librería javascript ytCropper.

http://jquery.com/download/ <br/>
http://jqueryui.com/download/ <br/><br/>
      +
```html
<script src="ytCropper/ytCropper.js"></script>
<link rel="stylesheet" type="text/css" href="ytCropper/ytCropper.css" />
```

<b>API</b>

-	<b>Constructor de la clase: <br />
ytCropper(idcont,{ idvid , width, height, maxRange, minRange})</b> <br />
Método que crea el reproductor listo para cortar un segmento en un div. <br /> <br />
<i>idcont</i> -> id del div que contendrá el cortador. <br />
<i>idvid</i> -> id del vídeo alojado en YouTube. <br />
<i>width</i> -> Ancho del reproductor. <br />
<i>height</i> -> Alto del reproductor. <br />
<i>maxRange</i> -> Valor máximo de separación de manecillas <br />
<i>minRange</i> -> Valor mínimo de separación de manecillas <br /> <br />

-	<b>ytCropper::getVideoId() </b> <br />
Devuelve el ID del vídeo asignado al cropper

-	<b>ytCropper::getInitialValue() </b><br />
Devuelve el valor de la primera manecilla en segundos (valor inicial del intervalo).<br /><br />

-	<b>ytCropper::getFinalValue() </b><br />
Devuelve el valor de la segunda manecilla en segundos (valor final del intervalo).<br /><br />

-	<b>ytCropper::setInitialValue(value) </b><br />
Función que cambia el valor inicial del intervalo.<br />

<i>value</i> -> Valor en segundos<br /><br />

-	<b>ytCropper::setFinalValue(value) </b><br />
Función que cambia el valor final del intervalo.<br />

<i>value</i> -> Valor en segundos<br /><br />

-	<b>ytCropper::getCurrentTime() </b><br />
Devuelve el tiempo de reproducción actual en segundos. <br /><br />

-	<b>ytCropper::getDuration() </b><br />
Devuelve la duración del vídeo cargado en segundos.<br /><br />

-	<b>ytCropper::getEmbedLink() </b><br />
Devuelve un link embed de youtube configurado para reproducir el intervalo especificado en el cropper.<br /><br />

-	<b>Event onProgress(e, currentTime) </b><br />
Función que se dispara cada segundo mientras el vídeo está reproduciendo. <br /><br />

<i>e</i> -> Referencia al evento.<br />
<i>currentTime</i> -> El tiempo actual de reproducción <br /><br />

-	<b>Event onFirstHandleChange(e, handleValue) </b> <br />
Función que se dispara cuando la primera manecilla cambia su valor.<br />

<i>e</i> -> Referencia al evento. <br />
<i>handleValue</i> -> El valor de la manecilla en segundos<br /><br />

-	<b>Event onSecondHandleChange(e, handleValue) </b><br />
Función que se dispara cuando la segunda manecilla cambia su valor.<br />

<i>e</i> -> Referencia al evento.<br />
<i>handleValue</i> -> El valor de la manecilla en segundos<br /><br />

- <b>Event onVideoPlay(currentTime) </b><br />
Función que se dispara cuando el vídeo se comienza a reproducir o se reanuda.<br />

<i>currentTime</i> -> El tiempo actual de reproducción en segundos<br /><br />

-	<b>Event onVideoPause(currentTime) </b><br />
Función que se dispara cuando el vídeo se pausa.<br />

<i>currentTime</i> -> El tiempo actual de reproducción en segundos<br /><br />

<b>Funciones extra: </b><br />
-	<b>showWithTwoDigits(n)  </b><br />
Función que devuelve un string de dos dígitos para poder mostrar la fecha con formato MM:SS. Ejemplo -> n = 9 -> salida = “09”. <br /><br />

-	<b>toDefaultTime(seconds) </b><br />
Función que convierte segundos a minutos y segundos. Devuelve un JSON con los valores minutes y seconds. Ejemplo -> seconds = 130 -> Return = { minutes:2, seconds: 10}


Demo
====================================

En el repositorio hay una página de prueba donde se puede ver el uso de los métodos y de la gestión de los eventos. La versión online de la demo se puede encontrar aquí:<br/>

http://www.ytcropper.hol.es


<b> Nota: </b> Esta librería está en fase de pruebas. Si tienes cualquier problema o sugerencia puedes contactar a<br/>
José Manuel Blasco Galdón <br/>
sora_jose94@hotmail.com.
