

const mongoose = require('mongoose');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = 5005;

app.use(express.static('public'))
app.listen(port, () =>{
  console.log("Servidor ejecutandose en " + port)
})





mongoose.connect('mongodb://localhost/autoirrigationFelo', { useNewUrlParser: true, useUnifiedTopology: true });

// Definir un modelo de datos para los sensores
const Sensor = mongoose.model('Sensor', {
  name: String,
  type: String,
  unit: String,
  active: Boolean,
  registers: [{
    date: String,
    register: String
  }]
});

const Irrigation= mongoose.model('Irrigation', {
  name: String,
  registers: [{
    date: String,
    liters: Number
  }]
});

//app.use(bodyParser.json());


app.post('/sensor', async (req, res) => {
  let name = String(req.query.name);
  let type = req.query.type
  let unit = req.query.unit
  let active = req.query.active
  let date = new Date()
  let register = req.query.register; 
  try {
    let sensor = await Sensor.findOne({ name });
    if (!sensor) {
      sensor = new Sensor({
        name,
        type,
        unit,
        active,
        registers: [{ date, register }]
      });
    } else {
      sensor.type = type;
      sensor.unit = unit;
      sensor.active = active;
      sensor.registers.push({ date, register });
    }
    await sensor.save();
    res.json(sensor);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
});

app.post('/irrigation', async (req, res) => {
  let name = String(req.query.name);
  let date = new Date()
  let liters = req.query.liters; 
  console.log(liters)
  try {
    let sensor = await Irrigation.findOne({ name });
    if (!sensor) {
      sensor = new Irrigation({
        name,
        registers: [{ date, liters }]
      });
    } else {
      sensor.registers.push({ date, liters });
    }
    await sensor.save();
    res.json(sensor);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
});

// Endpoint para obtener todos los sensores
app.get('/sensors', async (req, res) => {
  try {
    const sensors = await Sensor.find();
    res.json(sensors);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
});

// Endpoint para obtener todos los sensores
app.get('/irrigation', async (req, res) => {
  try {
    const irrigations = await Irrigation.find();
    res.json(irrigations);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
});

