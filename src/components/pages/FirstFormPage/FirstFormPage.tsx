import FirstForm from "./FirstForm";
import usePageTitle from "../../../hooks/pageTilte/usePageTitle";
import { useTranslation } from "react-i18next";

export default function FirstFormPage() {
  usePageTitle("Unizy | First Form");
  const { t } = useTranslation();

  return (
    <>
      <div className="background" />
      <div className="form-container">
        <div className="form-content">
          <h1 className="form-title">1 → {t("firstForm.title")}</h1>
          <p className="form-subtitle">{t("firstForm.subTitle1")}</p>
          <FirstForm />
        </div>
      </div>
    </>
  );
}
