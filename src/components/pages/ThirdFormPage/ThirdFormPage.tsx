import ThirdFormMain from "./ThirdFormMain";
import usePageTitle from "../../../hooks/usePageTitle";
import { useTranslation } from "react-i18next";
import ThirdFormOptional from "./ThirdFormOptional";

export default function ThirdFormPage() {
  usePageTitle("Unizy | Third Form");
  const { t } = useTranslation();

  return (
    <>
      <div className="background" />
      <div className="form-container">
        <div className="form-3-content">
          <h1 className="form-title">3 → {t("thirdForm.title")}</h1>
          <p className="form-subtitle">{t("thirdForm.subTitle")}</p>
          <ThirdFormMain />
          <ThirdFormOptional />
        </div>
      </div>
    </>
  );
}
