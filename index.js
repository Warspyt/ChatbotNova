import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());


const menu = {
  start: {
    text: `👋 Hola, soy tu asistente del *PreICFES Nova Transmedia* (spin-off de la Universidad Nacional de Colombia).
Estoy aquí para resolver tus dudas. ¿Qué te gustaría saber?

1️⃣ Información general del curso
2️⃣ Horarios y modalidad
3️⃣ Costo y formas de pago
4️⃣ Inscripciones y requisitos
5️⃣ Plataforma y clases
6️⃣ Simulacros
7️⃣ Hablar con un asesor`,
    next: {
      "1": "info",
      "2": "horarios",
      "3": "costo",
      "4": "inscripciones",
      "5": "plataforma",
      "6": "simulacros",
      "7": "asesor",
    },
  },

  // 1️⃣ Información general
  info: {
    text: `📘 *Información general del curso*

👉 Es un programa de preparación para las Pruebas Saber 11°, diseñado por *Nova Transmedia*, spin-off de la Universidad Nacional de Colombia.
Nuestro enfoque es integral: buscamos que te prepares académicamente y también que te sientas seguro y confiado para el examen.

📚 *Áreas incluidas:*
- Lectura crítica  
- Matemáticas (álgebra, geometría, estadística, cálculo)  
- Sociales y ciudadanas  
- Ciencias naturales (biología, física y química)  
- Inglés

📆 *Duración:*  
Inicio: 9 de marzo de 2026  
Finalización: 24 de julio de 2026 (20 semanas)

✅ Incluye:
- 4 simulacros completos tipo ICFES  
- Clases en vivo y grabaciones  
- Acompañamiento académico  
- Charlas vocacionales con expertos  

¿Quieres que te comparta el brochure con toda la información del curso?
1️⃣ Sí (📎 PDF)
2️⃣ No (volver al menú principal)
3️⃣ Ir al sitio web del curso`,
    next: {
      "1": "link_brochure",
      "2": "start",
      "3": "sitio_web",
    },
  },

  link_brochure: {
    text: `📎 Aquí tienes el brochure completo:
👉 https://tusitio.com/brochure.pdf

1️⃣ Volver al menú principal`,
    next: { "1": "start" },
  },

  // 2️⃣ Horarios y modalidad
  horarios: {
    text: `🕐 *Horarios y modalidad*

💻 Modalidad: *Totalmente virtual*, con clases en vivo y grabaciones disponibles 24/7.

📅 *Horarios:*
- Lunes a viernes: 4:00 pm a 6:00 pm o 6:00 pm a 8:00 pm  
- Sábados: 9:00 am a 11:00 am o 11:00 am a 1:00 pm  

🎥 Las clases quedan grabadas y disponibles en la plataforma.

1️⃣ Volver al menú principal`,
    next: { "1": "start" },
  },

  // 3️⃣ Costo y formas de pago
  costo: {
    text: `💲 *Costo y formas de pago*

Costo del curso: *$238.000 (pago único)*

💳 Formas de pago:
- Pago en línea (PSE, tarjeta crédito y débito)
- Pago en efectivo en convenios autorizados

¿Quieres que te envíe el enlace directo de pago?
1️⃣ Sí (🔗 Enlace PayU)
2️⃣ No (volver al menú principal)
3️⃣ Ir al sitio web del curso`,
    next: {
      "1": "link_pago",
      "2": "start",
      "3": "sitio_web",
    },
  },

  link_pago: {
    text: `🔗 Aquí tienes el enlace directo de pago:
👉 https://tusitio.com/pago

1️⃣ Volver al menú principal`,
    next: { "1": "start" },
  },

  // 4️⃣ Inscripciones y requisitos
  inscripciones: {
    text: `📝 *Inscripciones y requisitos*

¿Cómo me inscribo?  
👉 A través del formulario en la página oficial.

📌 *Requisitos:*  
- Nombre  
- Documento de identidad  
- Correo electrónico  
- Comprobante de pago

⏳ *Cierre de inscripciones:*  
No hay fecha límite estricta, pero recomendamos inscribirte pronto para aprovechar todas las clases en vivo.  
Si te unes después, podrás ponerte al día con las grabaciones.

¿Quieres que te envíe el enlace al formulario de inscripción?
1️⃣ Sí (🔗 Formulario)
2️⃣ No (volver al menú principal)
3️⃣ Ir al sitio web del curso`,
    next: {
      "1": "link_inscripcion",
      "2": "start",
      "3": "sitio_web",
    },
  },

  link_inscripcion: {
    text: `🔗 Aquí tienes el formulario de inscripción:
👉 https://tusitio.com/inscripcion

1️⃣ Volver al menú principal`,
    next: { "1": "start" },
  },

  // 5️⃣ Plataforma y clases
  plataforma: {
    text: `🌐 *Plataforma y clases*

Las clases se desarrollan en *Moodle*, una plataforma educativa accesible desde cualquier dispositivo con internet.

⚠️ Si tienes inconvenientes, puedes contactar al equipo de soporte por WhatsApp o correo electrónico.

📚 Material disponible:
- Clases en vivo  
- Grabaciones  
- Simulacros  
- Recursos complementarios  

1️⃣ Volver al menú principal`,
    next: { "1": "start" },
  },

  // 6️⃣ Simulacros
  simulacros: {
    text: `📝 *Simulacros*

✅ 4 simulacros completos durante el curso  
🎯 Con estructura, duración y nivel similares al ICFES real  
💻 Se realizan directamente en la plataforma

1️⃣ Volver al menú principal`,
    next: { "1": "start" },
  },

  // 7️⃣ Hablar con un asesor
  asesor: {
    text: `👩‍💼 *Hablar con un asesor*

Escribe *1* y un asesor te atenderá de manera personalizada lo más pronto posible.

📧 También puedes escribirnos a: info@novatransmedia.com  
🕐 Horario de atención: Lunes a viernes, 8:00 a.m. a 6:00 p.m.

1️⃣ Volver al menú principal`,
    next: { "1": "start" },
  },

  // Sitio web genérico
  sitio_web: {
    text: `🌐 Puedes visitar nuestro sitio web oficial:
👉 https://tusitio.com

1️⃣ Volver al menú principal`,
    next: { "1": "start" },
  },
};

// 🔁 Guarda el estado de cada usuario
const userState = {};

function getResponse(user, message) {
  const state = userState[user] || "start";
  const node = menu[state];
  const next = node.next?.[message];
  if (next && menu[next]) {
    userState[user] = next;
    return menu[next].text;
  } else {
    userState[user] = "start";
    return menu.start.text;
  }
}

// 📩 Webhook para recibir mensajes
app.post("/webhook", async (req, res) => {
  const entry = req.body.entry?.[0];
  const msg = entry?.changes?.[0]?.value?.messages?.[0];
  if (msg?.text?.body) {
    const from = msg.from;
    const text = msg.text.body.trim();
    const reply = getResponse(from, text);

    await fetch(`https://graph.facebook.com/v17.0/${process.env.PHONE_NUMBER_ID}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: from,
        text: { body: reply },
      }),
    });
  }
  res.sendStatus(200);
});

app.listen(3000, () => console.log("Bot PreICFES Nova Transmedia activo en puerto 3000"));
