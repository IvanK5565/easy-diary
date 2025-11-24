import { PropsWithChildren } from "react";
import { Button } from "@/components/ui/button";
import DaysPicker from "@/components/WeeksPicker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslation } from "next-i18next";

type SelectWeeksDialogProps = PropsWithChildren<{
  days?: Date[];
  onSelect?: (weeks: Date[]) => void;
  asChild?: boolean;
}>;

export function SelectWeeksDialog({
  days = [],
  onSelect,
}: SelectWeeksDialogProps) {
  const { t } = useTranslation("common");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Select Week</Button>
      </DialogTrigger>
      <DialogContent className="w-min">
        <DialogHeader>{t("Select weeks by clicking days")}</DialogHeader>
        <DaysPicker
          select="multiple"
          className="h-full"
          selectedDays={days}
          onChange={onSelect}
          mode="week"
        />
      </DialogContent>
    </Dialog>
  );
}
