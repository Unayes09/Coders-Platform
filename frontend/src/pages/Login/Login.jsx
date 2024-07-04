import VentaGlobe from "../../components/VentaGlobe/VentaGlobe";

const Login = () => {
  return (
    <div className="">
      <div className="relative">
        <div className="z-10">
          <VentaGlobe />
        </div>
        <div
          className="p-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center rounded-2xl overflow-hidden shadow-lg text-white bg-[#0000003b] bg-opacity-80 backdrop-filter backdrop-blur-lg"
          style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)" }}
        >
          <div className="login-form">
            <h2>Login</h2>
            <form>
              <div>
                <label htmlFor="username">Username</label>
                <input type="text" id="username" name="username" />
              </div>
              <div>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" />
              </div>
              <button type="submit">Login</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
