import { Badge } from "./badge";
import { Label } from "./label";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export default function BadgeWithPopover({ data, placeholder }: { data: string | string[], placeholder?: string | React.ReactElement }) {
  if (!data || data.length === 0) {
    return placeholder || null;
  }
  if (!Array.isArray(data) || data.length < 2) {
    return (
      <Badge>
        <Label>{data}</Label>
      </Badge>
    );
  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Badge>
          <Label>{data[0]}</Label>
        </Badge>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-1">
        {data.map((d, i) => (
          <Badge key={`Badge:${i}`}>
            <Label>{d}</Label>
          </Badge>
        ))}
      </PopoverContent>
    </Popover>
  );
}