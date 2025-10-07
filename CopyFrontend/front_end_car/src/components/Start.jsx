import { useNavigate } from "react-router-dom";
function Start() {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-b from-blue-900 via-purple-900 to-pink-900 grid items-center w-screen h-screen text-3xl  font-mono text-center text-white py-60">
      <h3 className="-mt-8">Welcome to the Embedded Car Control System</h3>
      <h5 className="-mt-9">Do you already have an account?</h5>
      <button
        className="text-2xl rounded-md bg-transparent  border-2 hover:bg-pink-950/40 p-2 w-55 mx-auto cursor-pointer"
        onClick={() => {
          navigate("/login");
        }}
      >
        Log in
      </button>
      <button
        className="text-2xl rounded-md bg-transparent  border-2 hover:bg-blue-950/40 p-2 w-55 mx-auto cursor-pointer"
        onClick={() => {
          navigate("/signup");
        }}
      >
        Sign up
      </button>
    </div>
  );
}

export default Start;
