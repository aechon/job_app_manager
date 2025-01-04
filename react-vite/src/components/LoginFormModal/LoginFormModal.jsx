import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
      window.location.reload(); // Refresh the page after successful login
    }
  };

  const handleDemoUser = () => {
    // Set demo user credentials
    setEmail("mytest@example.com");
    setPassword("new_password"); // Replace with actual demo user password
  };

  return (
    <>
      <h1 className="login-title">Log In</h1>
      {errors.server && <p className="error-message">{errors.server}</p>}
      <form className="login-form" onSubmit={handleSubmit}>
        <label className="login-label">
          Email
          <input
            className="login-input"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {errors.email && <p className="error-message">{errors.email}</p>}
        <label className="login-label">
          Password
          <input
            className="login-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p className="error-message">{errors.password}</p>}
        <div className="button-container">
          <button className="login-button" type="submit">Log In</button>
          <button className="login-button" type="button" onClick={handleDemoUser}>Demo User</button>
        </div>
      </form>
    </>
  );
}

export default LoginFormModal;