require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "secret_demo";



const { exec } = require('child_process');

async function sendCarCommand(type, direction, speed) {
  // Construye el comando EXACTAMENTE como lo harías en la terminal
  const command = `ssh root@192.168.7.5 "/usr/local/bin/car_control ${type} ${direction} ${speed}"`;
  
  console.log("🟡 Ejecutando comando SSH del sistema:", command);

  return new Promise((resolve, reject) => {
    // Ejecuta el comando en el shell de tu PC
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error al ejecutar el comando: ${error.message}`);
        // Muestra la salida de error del servidor SSH si existe
        console.error("STDERR (Servidor):", stderr.trim());
        return reject(error);
      }
      
      console.log("🟢 Comando enviado correctamente.");
      console.log("STDOUT (Servidor):", stdout.trim());
      
      // La ejecución fue exitosa
      resolve(stdout.trim());
    });
  });
}



//const { execFile } = require("child_process"); // 👈 



// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Server working with SQLite 🚀");
});

// Signup
app.post("/api/signup", async (req, res) => {
  try {
    const { email, firstname, lastname, password, birthday } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });

    db.get("SELECT * FROM users WHERE email = ?", [email], async (err, row) => {
      if (err) return res.status(500).json({ error: "Error DB" });
      if (row)
        return res.status(400).json({ error: "Email is already used." });

      const hashed = await bcrypt.hash(password, 10);
      db.run(
        "INSERT INTO users (email, firstname, lastname, password, birthday) VALUES (?, ?, ?, ?, ?)",
        [email, firstname, lastname, hashed, birthday],
        function (err) {
          if (err)
            return res.status(500).json({ error: "Error saving user" });
          res
            .status(201)
            .json({
              message: "User created succesfully",
              userId: this.lastID,
            });
        }
      );
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Error" });
  }
});

// Login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password are needed" });

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err) return res.status(500).json({ error: "Error DB" });
    if (!user) return res.status(400).json({ error: "Invalid Credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: "Invalid Credentials" });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({
      message: "Auth Succeded",
      token,
      user: {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        birthday: user.birthday,
      },
    });
  });
});

app.get("/api/users", (req, res) => {
  db.all(
    "SELECT id, email, firstname, lastname, birthday FROM users",
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: "Error DB" });
      res.json(rows);
    }
  );
});

app.listen(PORT, () =>
  console.log(`Server running in http://localhost:${PORT}`)
);

const NodeWebcam = require("node-webcam");

// webcam config
const webcamOpts = {
  width: 640,
  height: 480,
  delay: 0,
  quality: 100,
  output: "jpeg",
  device: false,
  callbackReturn: "buffer",
  verbose: false,
};
const Webcam = NodeWebcam.create(webcamOpts);

// Endpoint for simulated video streaming
app.get("/video_feed", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "multipart/x-mixed-replace; boundary=frame",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const sendFrame = () => {
    NodeWebcam.capture("frame", webcamOpts, (err, buffer) => {
      if (err) return console.error(err);

      res.write(`--frame\r\n`);
      res.write("Content-Type: image/jpeg\r\n\r\n");
      res.write(buffer);
      res.write("\r\n");

      setImmediate(sendFrame); 
    });
  };

  sendFrame();
});

// Car full status on memory
let carState = {
  moving: false,
  direction: null,
  speed: 0,
  lights: {
    front: false,
    rear: false,
    left: false,
    right: false
  },
  manualLights: false
};

// Move the car
app.post("/car/move", (req, res) => {
  const { type, direction, speed } = req.body;

  carState.moving = true;
  carState.direction = direction;
  carState.speed = speed;
  carState.manualLights = false
  
  switch (direction) {
    case "front": 
      carState.lights.front = true;
      carState.lights.rear = false; 
      carState.lights.left = false; 
      carState.lights.right = false;  
      break;
    case "rear":
      carState.lights.front = false;
      carState.lights.rear = true; 
      carState.lights.left = false; 
      carState.lights.right = false;  
      break;
    case "left": 
      carState.lights.left = true;
      carState.lights.rear = false; 
      carState.lights.front = false; 
      carState.lights.right = false;  
      break;
    case "right": 
      carState.lights.right = true;
      carState.lights.rear = false; 
      carState.lights.front = false; 
      carState.lights.left = false;  
      break;
    default: carState.lights.front = false; // stop
  } 
  

  // 👇 
  //execFile("./test_action", [type, direction, speed], (error, stdout, stderr) => {
  //  if (error) {
  //    console.error("Error executing C program:", error);
  //  }
  //  if (stderr) {
  //    console.error("stderr:", stderr);
  //  }
  //  if (stdout) {
  //    console.log("C program output:", stdout);
  //  }
  //});

  sendCarCommand(type,direction,speed)
  res.json({ status: "ok", carState });
});

// Stop the car
app.post("/car/stop", (req, res) => {
  const { type, direction, speed } = req.body;

  carState.moving = false;
  carState.direction = null;
  carState.speed = 0;

  
  carState.lights.front = false;
  carState.lights.rear = false;
  carState.lights.left = false;
  carState.lights.right = false;

  // 👇 
  //execFile("./test_action", [type, direction, speed], (error, stdout, stderr) => {
  //  if (error) {
  //    console.error("Error executing C program:", error);
  //  }
  //  if (stderr) {
  //    console.error("stderr:", stderr);
  //  }
  //  if (stdout) {
  //    console.log("C program output:", stdout);
  //  }
  //});
  sendCarCommand(type,direction,speed)
  res.json({ status: "ok", carState });
});


// Turn on/off lights
app.post("/car/lights", (req, res) => {
  const { type, direction, speed } = req.body;
  carState.moving = false;
  carState.direction = null;
  carState.speed = 0;
  
  switch (direction) {
    case "front": 
      carState.lights.front = true;
      carState.lights.rear = false; 
      carState.lights.left = false; 
      carState.lights.right = false;  
      break;
    case "rear":
      carState.lights.front = false;
      carState.lights.rear = true; 
      carState.lights.left = false; 
      carState.lights.right = false;  
      break;
    case "left": 
      carState.lights.left = true;
      carState.lights.rear = false; 
      carState.lights.front = false; 
      carState.lights.right = false;  
      break;
    case "right": 
      carState.lights.right = true;
      carState.lights.rear = false; 
      carState.lights.front = false; 
      carState.lights.left = false;  
      break;
    default: carState.lights.front = false; // stop
  }
  carState.manualLights = true
  carState.direction = null 
  

  
  // 👇 
  //execFile("./test_action", [type, direction, speed], (error, stdout, stderr) => {
  //  if (error) {
  //    console.error("Error executing C program:", error);
  //  }
  //  if (stderr) {
  //    console.error("stderr:", stderr);
  //  }
   // if (stdout) {
  //    console.log("C program output:", stdout);
  //  }
  //});

  sendCarCommand(type,direction,speed)
  res.json({ status: "ok", carState });
});


// Get car status
app.get("/car/status", (req, res) => {
  res.json(carState);
});