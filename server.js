require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Roll = require('./models/Roll');

const app = express();

// Config
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB conectado'))
  .catch(err => console.error(err));

// Rotas
app.get('/', async (req, res) => {
  const rolls = await Roll.find().sort({ createdAt: -1 }).limit(20);
  res.render('index', { rolls });
});
app.get('/nome', (req, res) => {
  res.render('nome')
});

app.post('/registrar-jogada', async (req, res) => {
  const { nome, valor } = req.body;

  if (!nome || !valor) return res.status(400).send("Dados incompletos.");

  // Hora atual em Brasília (HH:mm)
  const horaBrasilia = new Date().toLocaleTimeString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  await Roll.create({ 
    player: nome,
    value: valor,
    horario: horaBrasilia // novo campo
  });

  res.status(201).send('Jogada registrada com sucesso.');
});


app.get('/resultados', async (req, res) => {
  const rolls = await Roll.find().sort({ createdAt: -1 });
  res.json(rolls);
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
