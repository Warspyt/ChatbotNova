import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// ===============================
// 📌 CONFIGURACIÓN
// ===============================
const VERIFY_TOKEN = "nova_preicfes_token";

// ===============================
// 🧠 MENÚ DEL BOT
// ===============================
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

  info: {
    text: `📘 *Información general del curso*

👉 Programa de preparación para las Pruebas Saber 11°, desarrollado por *Nova Transmedia*.

📚 Áreas:
- Lectura crítica
- Matemáticas
- Sociales
- Ciencias naturales
- Inglés

📆 Duración:
🟢 Inicio: 9 de marzo de 2026
🔴 Fin: 24 de julio de 2026

Incluye simulacros, clases en vivo, grabaciones y acompañamiento.

1️⃣ Brochure (PDF)
2️⃣ Volver al menú
3️⃣ Ir al sitio web`,
    next: {
      "1": "link_brochure",
      "2": "start",
      "3": "sitio_web",
    },
  },

  link_brochure: {
    text: `📎 Brochure del curso:
👉 https://drive.google.com/file/d/1_hIO2nFde4rQx0TU3Z2OqaTMbyf71wim/view?usp=drive_link

1️⃣ Volver al menú`,
    next: { "1": "start" },
  },

  horarios: {
    text: `🕐 *Horarios y modalidad*

💻 Modalidad 100% virtual

📅 Horarios:
- Lunes a viernes: 4-6 pm / 6-8 pm
- Sábados: 9-11 am / 11 am-1 pm

1️⃣ Volver al menú`,
    next: { "1": "start" },
  },

  costo: {
    text: `💲 *Costo del curso*

💰 $238.000 (pago único)

1️⃣ Enlace de pago
2️⃣ Volver al menú
3️⃣ Sitio web`,
    next: {
      "1": "link_pago",
      "2": "start",
      "3": "sitio_web",
    },
  },

  link_pago: {
    text: `🔗 Paga aquí:
👉 https://preicfes.novatransmedia.com/inscripcion

1️⃣ Volver al menú`,
    next: { "1": "start" },
  },

  inscripciones: {
    text: `📝 *Inscripciones*

Requisitos:
- Datos personales
- Correo
- Comprobante de pago

1️⃣ Formulario
2️⃣ Volver al menú
3️⃣ Sitio web`,
    next: {
      "1": "link_inscripcion",
      "2": "start",
      "3": "sitio_web",
    },
  },

  link_inscripcion: {
    text: `🔗 Formulario:
👉 https://preicfes.novatransmedia.com/inscripcion

1️⃣ Volver al menú`,
    next: { "1": "start" },
  },

  plataforma: {
    text: `🌐 *Plataforma*

Usamos Moodle con acceso 24/7 a clases y material.

1️⃣ Volver al menú`,
    next: { "1": "start" },
  },

  simulacros: {
    text: `📝 *Simulacros*

4 simulacros completos tipo ICFES.

1️⃣ Volver al menú`,
    next: { "1": "start" },
  },

  asesor: {
    text: `👩‍💼 *Asesor humano*

Un asesor te escribirá pronto.

📧 info@novatransmedia.com

1️⃣ Volver al menú`,
    next: { "1": "start" },
  },

  sitio_web: {
    text: `🌐 Sitio oficial:
👉 https://preicfes.novatransmedia.com

1️⃣ Volver al menú`,
    next: { "1": "start" },
  },
};

// ===============================
// 🔁 ESTADO DE USUARIOS
// ===============================
const userState = {};

// ===============================
// 🤖 LÓGICA DEL BOT
// ===============================
function getResponse(user, message) {
  const text = message.trim();
  const state = userState[user] || "start";
  const node = menu[state];

  const next = node.next?.[text];

  if (next && menu[next]) {
    userState[user] = next;
    return menu[next].text;
  }

  userState[user] = "start";
  return menu.start.text;
}

// ===============================
// ✅ VERIFICACIÓN WEBHOOK (GET)
// ===============================
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// ===============================
// 📩 RECEPCIÓN MENSAJES (POST)
// ===============================
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const msg = entry?.changes?.[0]?.value?.messages?.[0];

    if (!msg?.text?.body) return res.sendStatus(200);

    const from = msg.from;
    const text = msg.text.body;
    const reply = getResponse(from, text);

    await fetch(
      `https://graph.facebook.com/v17.0/${process.env.PHONE_NUMBER_ID}/messages`,
      {
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
      }
    );

    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Error:", error);
    res.sendStatus(500);
  }
});

// ===============================
// 🚀 INICIO SERVIDOR
// ===============================
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("🤖 Chatbot Nova Transmedia activo");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🤖 Bot PreICFES activo en puerto ${PORT}`);
});

