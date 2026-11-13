# I Liga de las Estrellas · web oficial (2026/27)

Web estática, adaptable a móvil, preparada para GitHub Pages. No necesita instalar dependencias ni contratar servidor. La versión pública del torneo está en `https://rogerpelaezz.github.io/Liga-de-las-Estrellas/`. Este paquete es una actualización para su repositorio GitHub.

## Páginas incluidas

- `index.html`: portada, tabla en directo al registrarse resultados, próximos partidos, equipos y resumen de playoffs.
- `liga.html`: clasificación automática de la fase regular.
- `calendario.html`: seis jornadas, resultados, primera y segunda vuelta.
- `playoffs.html`: semifinales 1.º-4.º y 2.º-3.º, final y bronce. Cruces automáticos cuando termina la liga sin empates clasificatorios sin resolver.
- `equipos.html`: cuatro equipos, escudos **provisionales recortados de la fotografía facilitada por la organización**, plantillas y dos capitanes por equipo (pendientes).
- `estadisticas.html`: premios Zamora, Pichichi, asistencias y Jugador Sucio, rankings, datos reales o modo demostración con ejemplos ficticios.
- `quien-soy.html`: buscador de jugadores tipo NWC con foto, perfil personal, próximos partidos, partidos jugados, goles, asistencias y tarjetas. Guarda la selección solo en el dispositivo. Si la plantilla está vacía, permite abrir un ejemplo ficticio independiente de los datos reales.
- `reglamento.html`: formato aprobado y reglas de premios/desempates pendientes de aprobación.
- `admin.html`: formulario local para editar resultados, actas, horarios, plantillas, capitanes, equipos y fotografías de jugadores. Genera un `data.js` que se publica subiéndolo a GitHub.

`data.js` contiene **todos los datos oficiales**. Los programas `core.js`, `site.js`, `perfil.js`, `app.js` y `admin.js` calculan y muestran el contenido. Los estilos de la sección personal están en `perfil.css`. No cambies los IDs de equipos/partidos, pues vinculan las estadísticas.

## Publicación en GitHub Pages

El repositorio del torneo ya está creado: `https://github.com/rogerpelaezz/Liga-de-las-Estrellas`.

Para instalar esta nueva versión:

1. Descarga y descomprime el ZIP actualizado.
2. Entra en el repositorio del torneo y abre `Add file → Upload files`.
3. Arrastra **todos los archivos que hay dentro** de la carpeta descomprimida, incluida la carpeta `assets`, para actualizar los anteriores y añadir `quien-soy.html`, `perfil.js` y `perfil.css`. **No subas el ZIP** ni una carpeta exterior.
4. Comprueba que `index.html` sigue en la raíz y confirma con **Commit changes**.
5. En el navegador abre `https://rogerpelaezz.github.io/Liga-de-las-Estrellas/quien-soy.html`. Puede ser necesario recargar una vez tras el despliegue.
6. Para futuras actualizaciones semanales de datos basta con subir un `data.js` nuevo.

En `Settings → Pages` se puede verificar la rama `main` y la carpeta `/ (root)`.

**Nota:** si creas el repositorio como `USUARIO.github.io`, la dirección será `https://USUARIO.github.io/`.

## Dos personas editando la web

En el repositorio, el propietario entra en `Settings → Collaborators → Add people` e invita a **dos cuentas GitHub distintas**. Al aceptar, podrán modificar archivos y publicar cambios en el repositorio. En repositorios de cuenta personal son «collaborators» con escritura (no el rol de «administrador» de una organización). El propietario conserva la administración del repositorio. También es válido que haya exactamente dos personas editoras, el dueño y un único colaborador.

El público puede consultar `admin.html`, pero **NO puede publicar** sin permisos de escritura en GitHub. La página de gestión **NO tiene autenticación propia**: el control de quién modifica la web se realiza al hacer el commit en GitHub. No se solicita ni se guarda contraseña o token. Si se desea un panel cerrado con inicio de sesión, guardado directo y dos roles individuales, será necesario conectar posteriormente un backend/servicio de autenticación (por ejemplo Supabase) o un CMS con autenticación GitHub configurada.

### Protocolo recomendado cada jornada

1. El administrador abre la web pública y revisa que estén los últimos resultados. Es buena idea abrir `admin.html` de nuevo justo antes de editar, para partir del `data.js` publicado más reciente.
2. En **Resultados y actas**, selecciona partido e introduce los goles, horarios, porteros, participantes y eventos de gol/asistencia/tarjeta. Pulsa **Guardar esta acta en el editor**.
3. En **Publicar cambios**, descarga `data.js actualizado`.
4. En GitHub, `Add file → Upload files`: sustituir `data.js`, revisar qué archivos cambian y pulsar `Commit changes`. La web pública mostrará las nuevas cifras tras desplegarse.
5. Confirmar con el otro administrador que el cambio ya está publicado **antes de que esa persona edite una copia anterior**. Lo ideal es asignar un responsable de actualización por jornada, para evitar sobrescrituras.
6. Para seguridad, descarga también **copia JSON** antes de cambios importantes. Se puede reimportar en el editor.

**Límite:** el formulario prepara el archivo pero **no guarda en GitHub automáticamente**. El botón «Guardar esta acta» no publica ni persiste en servidor. Una recarga antes de descargar hará perder modificaciones que solo estén en memoria. No usar la web como única copia de seguridad.

## Añadir fotografías y crear perfiles personales

1. Abre `https://rogerpelaezz.github.io/Liga-de-las-Estrellas/admin.html`.
2. En **02 · Plantillas y capitanes**, escribe el nombre, selecciona equipo y posición y adjunta una **fotografía JPG, PNG o WebP (HEIC si el navegador lo admite)**. La web recorta al formato vertical 4:5 y comprime la imagen en el navegador (no la envía a ningún servidor externo).
3. Pulsa **Añadir jugador**. Si ya existía, puedes pulsar **Añadir foto / Cambiar foto** junto a su nombre. También puedes retirarla.
4. En **04 · Publicar cambios**, pulsa **Descargar data.js actualizado**.
5. Sube el nuevo `data.js` al repositorio mediante `Add file → Upload files` y confirma el commit. El perfil aparecerá en «¿Quién soy?» y en la lista de su equipo. Las fotos se guardan dentro de `data.js` como imágenes comprimidas, por lo que no tienes que subir archivos de imagen sueltos.
6. Cada jugador se busca por nombre (sin importar mayúsculas ni tildes) y elige su tarjeta. Esta selección se guarda en ese navegador. **No es un inicio de sesión ni una verificación de identidad.**

Los datos de partidos jugados proceden de `participantes` en las actas oficiales. Goles, asistencias y tarjetas se calculan desde sus eventos. Si solo se guarda un marcador sin rellenar el acta, **las estadísticas personales permanecerán incompletas**.

**Privacidad:** las fotos y nombres se publicarán en un repositorio y un sitio accesibles públicamente. Recaba el consentimiento de los jugadores antes de publicar sus imágenes, especialmente si hay menores. Evita fotos que muestren información personal innecesaria. El archivo `data.js` con fotografías puede crecer; se recomienda no almacenar imágenes sin comprimir.

## Datos iniciales

- Cuatro equipos reales: Bayern de los Caídos (rojo), Crystal & Cubata (blanco), Aston Birra (verde), Cultural y Alcohólica Leonesa (negro).
- Las seis citas de la primera vuelta: lunes 23 de noviembre, 30 de noviembre y 14 de diciembre de 2026, a las 20:00 y 21:00.
- La segunda vuelta tiene emparejamientos provisionalmente invertidos, pero fechas y horarios sin fijar.
- Las cuatro eliminatorias tienen participantes y fechas pendientes.
- No hay resultados, jugadores ni capitanes ficticios en el registro oficial.
- `estadisticas.html` conserva el botón demo que NO afecta a los datos reales.

## Criterios y limitaciones

- Liga: 3/1/0 puntos, orden provisional por puntos, diferencia y goles marcados. Si persiste empate, los cruces se dejan en espera hasta que la organización decida un criterio adicional.
- Un empate en semifinales o final necesita la indicación de **ganador tras desempate**. No hay regla automática de penaltis o prórroga hasta que se acuerde.
- Zamora: media goles encajados/partido como portero, mínimo 3 (provisional). **Se presupone un único portero durante todo el encuentro.** Si hay sustituciones, habrá que registrar los goles encajados por cada portero y minutos para decidir un criterio justo.
- Pichichi: goles de eventos `gol` (no incluye autogoles).
- Asistencias: asistente registrado en evento de gol.
- Jugador Sucio: amarilla +1, roja directa +3; doble amarilla: dos amarillas (+2), sin registrar otra roja directa.
- Si hay resultados sin eventos de gol, la tabla de goleadores puede estar incompleta. El editor avisa de esta situación.
- Los archivos de equipos tienen fotografías **de escudos recortados desde una foto de pantalla**; sustitúyelos por imágenes originales más nítidas cuando estén disponibles. Las fotografías de las plantillas aún no están incorporadas para no asociar nombres incorrectos.

## Prueba sin publicar

Abre `index.html` con un navegador, o ejecuta un servidor web local sencillo en el directorio y navega a `http://localhost:8000/`. La web puede funcionar como archivos locales (scripts clásicos, sin fetch), salvo posibles restricciones del navegador con descargas locales. Todos los datos oficiales se leen de `data.js`.
