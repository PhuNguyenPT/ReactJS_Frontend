import FifthForm from "./FifthForm";
import usePageTitle from "../../../hooks/usePageTitle";
import { useTranslation } from "react-i18next";

export default function FifthFormPage() {
  usePageTitle("Unizy | Fifth Form");
  const { t } = useTranslation();

  return (
    <>
      <div className="background" />
      <div className="form-container">
        <div className="form-content ">
          <h1 className="form-title">5 → {t("fifthForm.title")}</h1>
          <FifthForm />
        </div>
      </div>
    </>
  );
}
