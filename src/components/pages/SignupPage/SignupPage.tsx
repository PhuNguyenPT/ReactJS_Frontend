import SignupForm from "./SignupForm";
import usePageTitle from "../../../hooks/pageTilte/usePageTitle";
import { useTranslation } from "react-i18next";

export default function Signup() {
  usePageTitle("Unizy | Sign Up");
  const { t } = useTranslation();

  return (
    <>
      <div className="background" />
      <div className="signup-container">
        <div className="signup-card">
          <h1 className="title">{t("signupForm.title")}</h1>
          <p className="subtitle">{t("signupForm.subTitle")}</p>
          <SignupForm />
        </div>
      </div>
    </>
  );
}
