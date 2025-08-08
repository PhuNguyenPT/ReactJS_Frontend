import FirstForm from "./FirstForm";
import usePageTitle from "../../../hooks/usePageTitle";

export default function FirstFormPage() {
  usePageTitle("Unizy | First Form");

  return (
    <>
      <div className="background" />
      <div className="form-container">
        <div className="form-content">
          <h1 className="form-title">1 → Về vị trí của trường</h1>
          <p className="form-subtitle">Bạn mong muốn được học ở đâu?</p>
          <FirstForm />
        </div>
      </div>
    </>
  );
}
