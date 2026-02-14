# ---------------- EN DESARROLLO  -----------------------


Proceso para crea usuarios.






# ---------------- IDEAS -----------------------


No mostramos el tiempo que hizo. Tal vez necesitamos un campo con el tiempo resumido en un icono y si te posiciones sobre el icono, mostrar el detalle. 

Diary Types debe tener nombre en español e ingles e icono.

Incluir cuanta gente ha ido en el viaje: bebes (menos de 2), niños (hasta 16), adultos
Mostrar gráficos con los 3 tipos de personas con un máximo de 6. por ejemplo si han ido los padres con 3 niños mostrar 2 adultos y 3 niños.


## Componente para crear viajes a partir de fotos
- Al precargar fotos en formato iOS no se ven correctamente, solo en negro. Poner un aviso si las fotos están en este formato.
- Tras unos segundos subiendo las fotos, mientras se hace todo el trabajo de procesamiento, poner un elemento que muestre que se está cargando.


## Componente de edición de un viaje @trip-form-modal.ts


## Componente detalles de viaje (@trip-detail.ts)
  - Incluir un timeLog muy visual con las fechas de los viajes. Se podría mostrar los distintos años mostrando el número de viajes realizado cada año y si se pulsa en el año, se mostrarían el timelog del año, mostrando los viajes de cada mes. Que nos hace falta del back?
    
## Componente listado de viaje (@general.component.ts)
  - Mostrar las banderas de los paises visitados
  - Incluir un mapa con todos los paises visitados.
  Que nos hace falta del back?

## Settings 
  - Crear en settings una entrada para consultar ciudades y POI

## Diseño
- Rediseñar para modo oscuro de los navegadores
- Responsive para móvil

## Sistemas
  -	Estructurar bien el código
  - APP para Android
  - APP para iOS
  - Securizar


## Gestión de usuarios

**Diseño de la gestión de usuarios.**
Los usuarios deben poder elegir:
- email
- Idioma preferido
- Lugar de nacimiento/residencia (para detectar cuando es un viaje nacional / internacional). Aqui podemos entrar en matices.
- Poder cambiar la clave
- Posibilidad de meter sus credenciales con google maps, spotify, redes para publicar cosas...

Proceso de cambio de clave

Proceso de doble factor


## Mail

Crear cuentas de mail:
- Social para darnos de alta en redes
- Legal para los temas de privacidad


## Marketing

Crear cuentas en todas las redes sociales asociados a una cuenta de marketing.


## Footer

Poder incluir una zona de **Pricing** si tenemos opciones de pago.
Enlace con la **aplicación móvil**
Incluir zona de compañía: quienes somos, prensa, contacto

En la parte legal, hacer un documento de privacidad y cookies

Enlace con redes como YouTube, Twitter/X o Instagram. Enlazarlo con un mail de tripcoaster para marketing.


## Otras ideas
  - Asociar una canción al viaje.
  - Presupuesto del viaje
  

/api/sport-events - CRUD completo para pruebas deportivas (incluye /api/sport-events/trip/:tripId)

Añadir tiempo que ha hecho en cada entrada de diario. 

Añadir una entidad con los eventos deportivos: Prueba deportiva, deporte, dorsal, tiempo empleado en la prueba.






Al añadir o editar una foto, se debe poder marcar como la foto principal (isMain) del viaje.






