import SecondForm from "./SecondForm";
import usePageTitle from "../../../hooks/usePageTitle";
import { useTranslation } from "react-i18next";

export default function SecondFormPage() {
  usePageTitle("Unizy | Second Form");
  const { t } = useTranslation();

  return (
    <>
      <div className="background" />
      <div className="form-container">
        <div className="form-2-content ">
          <h1 className="form-title">2 → {t("secondForm.title")}</h1>
          <p className="form-subtitle">{t("secondForm.subTitle")}</p>
          <SecondForm />
        </div>
      </div>
    </>
  );
}
