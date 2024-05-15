const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { reset, pingDB } = require('./functions');

const port = 8000;

app.use(cors());
app.use(express.json());
dotenv.config();

app.get('/', (req, res) => {
  res.send('Ok!');
});

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/users'));
app.use('/messages', require('./routes/messages'));
app.use('/tasks', require('./routes/tasks'));
app.use('/admin', require('./routes/admin'));

// Start server
const start = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://pfulara:4SMhtmR6nNw559Vt@cluster0.bwnyevy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
    );
    app.listen(port, () =>
      console.log(`Server started on port ${port}`)
    );

    setInterval(() => {
      const currentHr = new Date().getHours();
      const currentMin = new Date().getMinutes();
      // reset energy on new day
      if (currentHr === 1 && currentMin < 10) {
        console.log(new Date());
        reset();
      }

      // Ping database to keep it awake
      // pingDB();
    }, 1000 * 60 * 10);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
