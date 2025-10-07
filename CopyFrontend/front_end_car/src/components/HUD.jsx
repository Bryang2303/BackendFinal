import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CarF from "../public2/CarFront.jpg";
import CarL from "../public2/CarLeft.jpg";
import CarR from "../public2/CarRight.jpg";
import CarB from "../public2/CarBack.jpg";
import Car from "../public2/Car.jpg";
import Mini from "../public2/Minicar.png";
import { MainContext } from "../contexts/MainContext";
function HUD() {
  const { currentUser } = useContext(MainContext);
  const navigate = useNavigate();
  
  const [CarImg, setCarImg] = useState(Car);
  const [direction, setDirection] = useState(null);
  const [moving, setMoving] = useState(false);
  const [lights, setLights] = useState("Off");
  const [speed, setSpeed] = useState(50);

  const API_URL = "http://192.168.7.9:5000"; // 

  const moveCar = (direction, speed) => {
    fetch(`${API_URL}/car/move`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "type":"move", direction, speed })
    })
      .then(res => res.json())
      .then(data => console.log("Move response:", data))
      .catch(err => console.error("Error:", err));
  };


  const stopCar = (direction, speed) => {
    fetch(`${API_URL}/car/stop`, { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "type":"move", direction, speed }) })
      .then(res => res.json())
      .then(data => console.log("Stop response:", data))
      .catch(err => console.error("Error:", err));
  };


  const setLight = (direction, speed) => {
    fetch(`${API_URL}/car/lights`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "type":"light", direction, speed })  // "front", "rear", "left", "right", "off"
    })
      .then(res => res.json())
      .then(data => console.log("Lights response:", data))
      .catch(err => console.error("Error:", err));
  };
  ///////////////////////////////////////////////////////////////////////////////////////////

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login"); 
  };

  useEffect(() => {
    if (direction === "up") {
      setLights("Front lights <ON>");
    } else if (direction === "down") {
      setLights("Rear lights <ON>");
    } else if (direction === "left") {
      setLights("Left turn signal <ON>");
    } else if (direction === "right") {
      setLights("Right turn signal <ON>");
    } else {
      setLights("All lights <OFF>");
    }
  }, [direction]);

  // Dictionary with the directions and it's own animation
  const animations = {
    up: { y: [0, -105] },
    down: { y: [0, 105] },
    left: { x: [0, -105] },
    right: { x: [0, 105] },
    stop: { x: [0, 0] },
  };

  return (
    <div className="bg-gradient-to-b from-blue-900 via-purple-900 to-pink-900 grid grid-cols-2 ">
      <div className="bg-transparent h-screen ">
        <div className="grid grid-cols-2">
        <h3 className=" text-xl font-mono text-white text-left pl-2 ">
          {currentUser} {currentUser==="Bryan Gomez" ? "⭐":""}
        </h3>
        <button
          onClick={handleLogout}
          className="border-2 bg-transparent h-7 mt-0.5 -ml-62 font-mono text-white rounded-md cursor-pointer hover:bg-pink-950/40 w-25 mx-auto"
        >
          Log Out
        </button>
        </div>
        <h3 className=" text-3xl font-mono text-white text-center h-12 my-5">
          Movement Control
        </h3>
        {/* Up Arrow */}
        <motion.img
          className="w-45  mx-auto cursor-pointer"
          src="https://www.iconarchive.com/download/i111171/custom-icon-design/flat-cute-arrows/Button-Arrow-Up.512.png"
          alt="Up"
          onClick={() => {
            setDirection("up");
            setCarImg(CarF);
            setMoving(true);
            moveCar("front", speed);
          }}
          animate={direction === "up" ? { scale: [1, 1.2, 1] } : { scale: 1 }}
          transition={{ duration: 0.3 }}
        />

        <div className="grid grid-cols-3 ">
          {/* Left Arrow */}
          <motion.img
            className="w-45 ml-38.5 cursor-pointer"
            src="https://icons.iconarchive.com/icons/custom-icon-design/flat-cute-arrows/512/Button-Arrow-Left-icon.png"
            alt="Left"
            onClick={() => {
              setDirection("left");
              setCarImg(CarL);
              setMoving(true);
              moveCar("left", speed);
            }}
            animate={
              direction === "left" ? { scale: [1, 1.2, 1] } : { scale: 1 }
            }
            transition={{ duration: 0.3 }}
          />

          {/* Stop  */}
          <motion.img
            className="w-32  mx-auto my-auto cursor-pointer"
            src="https://th.bing.com/th/id/R.5ad5b9f6d20eb2b3a15efc5f671192a6?rik=sRi1sS8bovTOQg&riu=http%3a%2f%2fassets.stickpng.com%2fthumbs%2f5895d2f1cba9841eabab607a.png&ehk=uktvbRwXQBBtOvq%2fUy%2feA%2bRHWQi0R7QSccAPVW9FP54%3d&risl=&pid=ImgRaw&r=0"
            alt="Stop"
            onClick={() => {
              setDirection("stop");
              setCarImg(Car);
              setMoving(false);
              stopCar("up", speed);
            }}
            animate={
              direction === "stop" ? { scale: [1, 1.2, 1] } : { scale: 1 }
            }
            transition={{ duration: 0.3 }}
          />

          {/* Right Arrow */}
          <motion.img
            className="w-45  -mx-12.5 cursor-pointer"
            src="https://icons.iconarchive.com/icons/custom-icon-design/flat-cute-arrows/512/Button-Arrow-Right-icon.png"
            alt="Right"
            onClick={() => {
              setDirection("right");
              setCarImg(CarR);
              setMoving(true);
              moveCar("right", speed);
            }}
            animate={
              direction === "right" ? { scale: [1, 1.2, 1] } : { scale: 1 }
            }
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Down Arrow */}
        <motion.img
          className="w-45  mx-auto cursor-pointer"
          src="https://www.iconarchive.com/download/i111162/custom-icon-design/flat-cute-arrows/Button-Arrow-Down.512.png"
          alt="Down"
          onClick={() => {
            setDirection("down");
            setCarImg(CarB);
            setMoving(true);
            moveCar("rear", speed);
          }}
          animate={direction === "down" ? { scale: [1, 1.2, 1] } : { scale: 1 }}
          transition={{ duration: 0.3 }}
        />

        <div className="grid grid-cols-2">
          <h3 className=" text-3xl ml-19 font-mono text-white text-center my-8 pr-5">
            Speed: {speed}%
          </h3>
          <input
            className="w-90 -ml-20 rounded-lg cursor-pointer accent-white"
            type="range"
            min="0"
            max="100"
            step="10"
            value={speed}
            onChange={(e) => setSpeed(e.target.value)}
          />
        </div>
      </div>

      <div className="">
        <div className=" grid grid-cols-3 mt-5">
          <div className=" grid grid-rows-5 w-50  ">
            <h3 className="text-center font-mono text-2xl pt-2 text-white my-auto ">
              Ligths Switches
            </h3>
            <button
              className="border-2 mt-2 bg-transparent h-11 font-mono text-white rounded-md cursor-pointer hover:bg-pink-950/40 w-45 mx-auto"
              onClick={() => {setCarImg(CarF)
                setLight("front", speed);}
              }
            >
              Head Lights
            </button>
            <button
              className="border-2 mt-2 bg-transparent h-11 font-mono text-white rounded-md cursor-pointer hover:bg-pink-950/40 w-45 mx-auto"
              onClick={() => {setCarImg(CarL)
                setLight("left", speed)}
              }
            >
              Left Turn Signal
            </button>
            <button
              className="border-2 mt-2 bg-transparent h-11 font-mono text-white rounded-md cursor-pointer hover:bg-pink-950/40 w-45 mx-auto"
              onClick={() => {setCarImg(CarR)
                setLight("right", speed)}
              }
            >
              Right Turn Signal
            </button>
            <button
              className="border-2 mt-2 bg-transparent h-11 font-mono text-white rounded-md cursor-pointer hover:bg-pink-950/40 w-45 mx-auto"
              onClick={() => {setCarImg(CarB)
                setLight("rear", speed)}
              }
            >
              Rear Lights
            </button>
          </div>

          <img
            className="border-3 -ml-17 w-70 h-60 my-auto mt-9 rounded-md border-white"
            src={CarImg}
          />
          <div className="relative">
            <img
              className="border-white border-2 rounded-md -ml-16 p-1 h-69"
              src="https://img.freepik.com/premium-photo/green-binary-code_633872-6558.jpg"
            />
            <motion.img
              className="absolute top-27 left-3 w-35"
              src={Mini}
              key={direction}
              animate={direction ? animations[direction] : {}}
              transition={{
                duration: Math.max(0.1, 5 - speed / 20),
                ease: "linear",
                repeat: Infinity,
                repeatType: "loop",
              }}
              onAnimationComplete={() => setDirection(direction)}
            />
          </div>
        </div>
        <div className=" h-7/12 grid grid-cols-2">
          <div className=" w-3/5 grid grid-rows-7 h-113">
            <h2 className="text-white font-mono text-center text-2xl pt-4  h-17">
              Car Status
            </h2>
            <h2 className="font-mono text-white pl-4 text-xl h-1/2 bg-transparent border-white border-2 rounded-tl rounded-tr">
              Movement:
            </h2>
            <h2 className="font-mono text-lg bg-white -mt-9 p-1  h-20">
              {moving
                ? `>>Moving with direction: <${direction}> at speed: <${speed}%>.`
                : ">>Not moving."}{" "}
            </h2>
            <h2 className="font-mono text-white border-white border-2 pl-4 text-xl h-1/2  bg-transparent -mt-6">
              Video:
            </h2>
            <h2 className="font-mono text-lg bg-white p-1 -mt-15 h-20">
              {">>"}Car Status
            </h2>
            <h2 className="border-white border-2 font-mono text-white pl-4 text-xl h-1/2  bg-transparent -mt-12">
              Lights:
            </h2>
            <h2 className="font-mono text-lg bg-white p-1 -mt-21 h-20 rounded-bl rounded-br">
              {">>"}
              {lights}.
            </h2>
          </div>
          <div>
            <h2 className="bg-transparent text-white font-mono text-2xl -ml-2 pt-4 pb-1 w-fit">
              Video Streaming
            </h2>
            <img
              alt="vid"
              src="http://172.18.181.240:8081"
              className="bg-white -ml-28 my-auto w-109 h-96 border-3 rounded-2xl border-white"
            />
          </div>

          {/* <img http://${API_URL}:8081/ src="http://localhost:5000/video_feed" alt="Video en tiempo real" /> */}
        </div>
      </div>
    </div>
  );
}

export default HUD;
