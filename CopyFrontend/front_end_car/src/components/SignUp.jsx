import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";

function SignUp() {
  const navigate = useNavigate();
  //const { setUsername, users, addUser} = useContext(UserContext);
 
  const [confPassword, setConfPassword] = useState("");
  const [userData, setUserData] = useState({
    email: "",
    firstname: "",
    lastname: "",
    password: "",
    birthday: "",
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate passwords
    if (userData.password !== confPassword) {
      alert("Las contraseñas no coinciden");
      return; 
    }

    try {
    const res = await fetch("http://localhost:5000/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await res.json();

    if (!res.ok) {
      // If the server response is an error
      alert(data.error);
      return;
    }

    console.log("Datos listos:", data);
    // data.userId has the new user's data
    alert("Usuario creado correctamente con ID: " + data.userId);
    
    
    navigate("/login");

  } catch (err) {
    console.error("Error creando usuario:", err);
    alert("Hubo un error creando el usuario");
  }

  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleConfirmPassword = (e) => {
    setConfPassword(e.target.value);
  };

  return (
    <div className="bg-gradient-to-b from-blue-900 via-purple-900 to-pink-900 grid items-center w-screen h-screen ">
    <form className=" font-mono text-center" onSubmit={handleSubmit}>
      <h1 className="text-white bg-transparent text-3xl mb-2">Making your account...</h1>
      <h4 className="text-white bg-transparent text-2xl">Email</h4>
      <input className="bg-white rounded-md text-2xl p-1 mb-2 w-75" type="email" name="email" required onChange={handleChange} />

      <h4 className="text-white text-2xl bg-transparent">First Name</h4>
      <input className="bg-white rounded-md text-2xl p-1 mb-2 w-75"
        type="text"
        name="firstname"
        minLength={3}
        maxLength={15}
        required
        onChange={handleChange}
      />

      <h4 className="text-white text-2xl bg-transparent">Last Name</h4>
      <input className="bg-white rounded-md text-2xl p-1 mb-2 w-75"
        type="text"
        name="lastname"
        minLength={3}
        maxLength={15}
        required
        onChange={handleChange}
      />

      <h4 className="text-white text-2xl bg-transparent">Password</h4>
      <input className="bg-white rounded-md text-2xl p-1 mb-2 w-75"
        type="password"
        name="password"
        required
        minLength={8}
        pattern="^(?=.*[A-Z])(?=.*[0-9]).*$"
        title="Debe tener al menos una mayúscula y un número"
        onChange={handleChange}
      />

      <h4 className="text-white text-2xl bg-transparent">Confirm Password</h4>
      <input className="bg-white rounded-md text-2xl p-1 mb-2 w-75"
        type="password"
        name="confirmPassword"
        required
        onChange={handleConfirmPassword}
      />

      <h4 className="text-white text-2xl bg-transparent">Birthday</h4>
      <input className="bg-white rounded-md text-2xl p-1 mb-5 w-45" type="date" name="birthday" required onChange={handleChange} />

      <br />
      <button className="text-white bg-transparent border-2 text-2xl rounded-md p-2 w-55 hover:bg-blue-950/40 " /* disabled={userData.password !== userData.confirmPassword} */>
        Create Account
      </button>
    </form>
    </div>
  );
}

export default SignUp;
