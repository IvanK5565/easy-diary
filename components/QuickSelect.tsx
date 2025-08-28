import { useCallback, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import { Minus } from "lucide-react";

export default function QuickSelect({
  value = null,
  values = [],
  onSelect,
}: {
  value: string | null;
  values: string[];
  onSelect?: (val?: string) => void;
}) {
  const [selected, setSelected] = useState<string>();
  const onSelectCallback = useCallback(
    (val: string) => {
      const newVal = val === 'Nothing' ? undefined : val;
      setSelected(newVal);
      onSelect?.(newVal);
    },
    [onSelect],
  );
  return (
    <Select onValueChange={onSelectCallback}>
      <SelectTrigger>{value || selected || "Select the value"}</SelectTrigger>
      <SelectContent>
        <SelectItem value={"Nothing"}><Minus /></SelectItem>
        {values.map((val) => (
          <SelectItem key={val} value={val}>
            {val}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
