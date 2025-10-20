import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronRight, Edit, PlusCircle, Users } from "lucide-react";
import { useTranslation } from "next-i18next";
import { IClass } from "../client/store/types";
import { useEntitySelector } from "@/client/hooks/useEntitySelector";
import Link from "next/link";

type Props = {
  onSelectClass?: (cls: IClass) => void;
  activeClass?: IClass;
};

function ClassList({ onSelectClass, activeClass }: Props) {
  const { t } = useTranslation("common");
  const classes = Object.values(useEntitySelector("classes"));

  return (
    <Card className="rounded-2xl shadow-md p-4 flex-1">
      <CardHeader>
        <h2 className="text-xl font-semibold flex items-center gap-2 -mb-4">
          <Users size={20} /> {t("ClassList")}
        </h2>
      </CardHeader>
      <CardContent className="flex flex-col justify-between h-full">
        <div className="max-h-96 overflow-y-auto pr-2">
          <ul className="space-y-2">
            {classes.map((cls) => (
              <li key={cls.id} className="flex gap-2 items-center">
                <Button
                  variant={activeClass?.id === cls.id ? "default" : "outline"}
                  className="flex-1 justify-between"
                  onClick={() => onSelectClass?.(cls)}
                >
                  {cls.title}
                  <ChevronRight size={16} />
                </Button>
                <Button className="size-8" asChild>
                  <Link href={`/class/${cls.id}/edit`}>
                    <Edit />
                  </Link>
                </Button>
                <Button className="size-8" asChild>
                  <Link href={`/class/${cls.id}/schedule`}>
                    <Calendar />
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <Button asChild className="mt-2">
            <Link href={`/addClass`}>
              <PlusCircle />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default ClassList;
