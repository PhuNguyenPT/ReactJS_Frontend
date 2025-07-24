import usePageTitle from "../../../hooks/usePageTitle";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  usePageTitle("UniGuide | Login");

  return (
    <>
      <div className="background" />
      <div className="signup-container">
        <div className="signup-card">
          <h1 className="title">Welcome to UniGuide</h1>
          <p className="subtitle">Login to your account</p>
          <LoginForm />
        </div>
      </div>
    </>
  );
}
