import React, { useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useTranslation } from "next-i18next";
import { IClass, IUser } from "../client/store/types";
import { useEntitySelector } from "@/client/hooks/useEntitySelector";
import { Button } from "./ui/button";
import {
  Calendar,
  ChevronRight,
  Edit,
  MessageSquare,
  UserPlus,
} from "lucide-react";
import Link from "next/link";

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
    <Card className="rounded-2xl shadow-md p-4 flex-1">
      <CardHeader>
        <h2 className="text-xl font-semibold -mb-4">
          {cls ? `${t("students")} ${cls.title}` : t("Choose class first")}
        </h2>
      </CardHeader>
      <CardContent className="flex flex-col justify-between h-full">
        {cls ? (
          <div className="max-h-96 overflow-y-auto pr-2">
            <ul className="space-y-2">
              {students.map((std) => (
                <li key={std.id} className="flex gap-2 items-center">
                  <Button
                    variant={activeUser?.id === std.id ? "default" : "outline"}
                    className="flex-1 justify-between"
                    onClick={() => onSelectStudent?.(std)}
                  >
                    {`${std.firstname} ${std.lastname}`}
                    <ChevronRight size={16} />
                  </Button>
                  <Button className="size-8" asChild>
                    <Link href={`/chat/${std.id}`}>
                      <Edit />
                    </Link>
                  </Button>
                  <Button className="size-8" asChild>
                    <Link href={`/diary/${std.id}`}>
                      <Calendar />
                    </Link>
                  </Button>
                  <Button className="size-8" asChild>
                    <Link href={`/chat/${std.id}`}>
                      <MessageSquare />
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-muted-foreground">{t("No class.")}</p>
        )}
        <div>
          <Button asChild className="mt-2">
            <Link href={`/addUser`}>
              <UserPlus />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default StudentList;
