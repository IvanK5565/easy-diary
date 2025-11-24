import { useSelector } from "react-redux";
import QuickSelect from "./QuickSelect";
import { ISubject } from "@/client/store/types";
import { EntitiesState } from "@/client/store/types";

interface ISelectSubjectProps {
  valueId?: number;
  OnSelect?: (sub?: ISubject) => void;
  disabled?: boolean;
}

export default function SubjectSelect({
  valueId,
  OnSelect,
  disabled,
}: ISelectSubjectProps) {
  const subjects = useSelector(
    (state: EntitiesState) => state.entities.subjects,
  );
  const values = Object.values(subjects).map((s) => s.title);
  let value;
  if (valueId) {
    value = subjects[valueId]?.title;
  }

  return (
    <QuickSelect
      disabled={disabled}
      values={values}
      value={value || null}
      onSelect={(title) => {
        const selected = Object.values(subjects).find((s) => s.title === title);
        OnSelect?.(selected);
      }}
    />
  );
}
