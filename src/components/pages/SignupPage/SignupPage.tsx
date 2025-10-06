import SignupForm from "./SignupForm";
import usePageTitle from "../../../hooks/pageTilte/usePageTitle";

export default function Signup() {
  usePageTitle("Unizy | Sign Up");

  return (
    <>
      <div className="background" />
      <div className="signup-container">
        <div className="signup-card">
          <h1 className="title">Get started with UniGuide</h1>
          <p className="subtitle">Create your account now</p>
          <SignupForm />
        </div>
      </div>
    </>
  );
}
