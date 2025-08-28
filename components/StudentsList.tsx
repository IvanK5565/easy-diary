import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "next-i18next";
import { IClass, IUser } from "../client/store/types";
import { useEntitySelector } from "@/client/hooks/useEntitySelector";
import { Button } from "./ui/button";
import { ChevronRight } from "lucide-react";

type Props = {
  cls?: IClass;
  onSelectStudent?: (student: IUser) => void;
  activeUser?: IUser;
};

function StudentList({ cls, onSelectStudent, activeUser }: Props) {
  const { t } = useTranslation("common");
  const users = Object.values(useEntitySelector("users"));
  const students: IUser[] = useMemo(() => {
    return users.filter((user) => cls?.studentsInClass?.includes(user.id));
  }, [cls]);

  return (
    <Card className="rounded-2xl shadow-md p-4">
      <CardContent>
        <h2 className="text-xl font-semibold mb-4">
          {cls ? `${t("students")} ${cls.title}` : t("Choose class")}
        </h2>
        {cls ? (
          <div className="max-h-96 overflow-y-auto pr-2">
            <ul className="space-y-2">
              {students.map((std) => (
                <li key={std.id}>
                  <Button
                    variant={activeUser?.id === std.id ? "default" : "outline"}
                    className="w-full justify-between"
                    onClick={() => onSelectStudent?.(std)}
                  >
                    {`${std.firstname} ${std.lastname}`}
                    <ChevronRight size={16} />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-muted-foreground">{t("No class.")}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default StudentList;
