# Mia Test · V02.2

**Versión de prueba de Mia, hecha como Entrega Final VibeCoding.**

👉 **Abrir la app:** https://rarubilar.github.io/Mia---Test/
(mejor en computador, con sonido; no hay que instalar nada)

🎬 **Video (3:43, Mia explica la app en español):** [`video/mia-test.mp4`](video/mia-test.mp4) · guion: [`video/guion.md`](video/guion.md)

---

## Qué es Mia

Mia es parte de **Hebe Memory Space**: una herramienta para acompañarte en tu día a día, con un espacio cómodo, seguro e intuitivo donde seguir hábitos y guardar las actividades y los recuerdos que tú elijas. Su promesa:
**el mejor día es el que Mia registra con precisión mientras la app casi no se abre.**

Mia escucha, recuerda el diario y responde con su propia voz. Todo vive en el computador del usuario:
diario cifrado, la IA funcionando de forma local y nada en la nube. Sin rachas, sin puntajes, sin
medallas, sin elogios y sin marcas rojas.

Esta página es una **versión de prueba** de la interfaz: se puede recorrer completa, pero **los datos
son ejemplos** y **no corre ninguna IA**. Las respuestas de Mia están escritas de antemano. La app está
en inglés; esta guía, en español.

## Cómo recorrerla

1. Toca la pantalla (**touch to begin**): suena la apertura y aparece el inicio. La música se pausa con las barritas de abajo a la derecha.
2. **El botón (i)**, arriba a la izquierda, está en cada espacio y en cada ventana. Explica qué hace ese
   lugar, qué probar y cómo está hoy en la app real.
3. **Centro de control** (abajo a la derecha): son los controles del prototipo. Al pasar el cursor por
   cada botón se explica qué hace: la hora del día, el ánimo, la apertura (*Intro*), las buenas noches
   (*Goodnight*), los sonidos de la naturaleza, los íconos, los mensajes, etc.
4. **Hablar con Mia:** la pequeña luz en medio de las olas. *Talk* reproduce una conversación de ejemplo.
   *Write* muestra **preguntas de ejemplo**: en esta prueba Mia solo responde esas.

## Los 5 espacios

| Espacio | Qué hace | Hoy (V03, app real de Windows) | Hacia dónde va |
|---|---|---|---|
| **Calendar** | El diario, un cuadrado por día. Cada día suena como una melodía, una nota por hábito. | Funciona con años del diario real importado. | Un resumen de cada día con las palabras de Mia (deploy 2). |
| **Record** | La galaxia: cada hábito es un planeta; se arrastra al vacío y Mia escribe la línea del día. También *Plan for the day* y *Modes* (estudio y meditación). | Se registra hablando o escribiendo a Mia. | La galaxia es el nuevo diseño (V04). |
| **Habits** | Una tarjeta por hábito y su página: el mes, qué tan cerca está de volverse automático y lo que dice la ciencia. | Las páginas se arman desde el diario. | Lo que se guarda en las conversaciones hace crecer cada tarjeta. |
| **Seasons** | La vida vista desde lejos: capítulos como una corriente de luz. | Temporadas de ejemplo. | Mia las propone desde el diario; el usuario decide. |
| **Experiments** | Pequeños cambios probados por unas semanas, y qué pasó. | Diseño. | Empezar un experimento solo con decírselo a Mia. |

También: **Settings** (el engranaje), **About you** (todo lo que Mia sabe del usuario, editable),
la **tarjeta de la mañana** (el punto ámbar) y la **conversación de la noche**, que termina con el plan
de mañana y la animación de buenas noches.

## Dónde está el proyecto hoy

- **V03, app de Windows (privada):** Tauri 2 + Rust, diario en SQLite cifrado con SQLCipher y llave
  protegida por Windows Hello. La IA es Qwen3 8B en Ollama, en el mismo computador. La voz es Kokoro
  (voz N1) y la escucha, Whisper. 27 de 31 funciones aprobadas; las 4 restantes esperan una prueba
  manual.
- **V03.1, "versión manual":** la que se usa hoy (se completa a mano, sin vigilar el PC); 17 de 21
  funciones aprobadas.
- **Esta interfaz (V02.x → V04):** el laboratorio de diseño donde se prueba el próximo aspecto de Mia.
- **Deploy 2:** app de teléfono, sincronización, reloj (ritmo cardíaco en vivo), resúmenes de cada día
  y una pantalla para momentos difíciles.

## Cómo se hizo

Con *vibe coding*: diseño conversado con Claude, construido en archivos pequeños de HTML, CSS y
JavaScript (sin frameworks), y probado con Playwright. Cada versión se probó de día y de noche.

```
index.html      la app lista para abrir (todo en un archivo)
fonts/          las fuentes (SIL Open Font License): Instrument Serif, DM Mono, Exo 2
src/            el código fuente: index.src.html + css/ + js/, unidos por build.py
video/          el video y su guion
```

Para reconstruir: `cd src && python3 build.py` → `src/dist/index.html` (copia `fonts/` junto a él).

## Privacidad

Los datos de esta prueba son **de ejemplo**. El diario real, los datos personales y el código de la app
de Windows están en un repositorio privado y no se publican.

---

*Mia Test · V02.2 · Entrega Final VibeCoding · Raúl, octubre 2026.*
