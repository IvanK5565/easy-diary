import { useActions } from "@/client/hooks";
import { useEntitySelector } from "@/client/hooks/useEntitySelector";
import { IClass } from "@/client/store/types";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import * as T from "@/components/ui/table";
import { filter } from "lodash";
import { Minus } from "lucide-react";
import AddStudentDialog from "./AddStudentDialog";
import { useTranslation } from "next-i18next";

export default function StudentsTable({ cls }: { cls: IClass }) {
  const users = useEntitySelector("users");
  const studentsInClass = filter(
    users,
    (usr) => !!cls.studentsInClass?.includes(usr.id),
  );
  const { removeStudent } = useActions("ClassEntity");
  const { t } = useTranslation("common");
  return (
    <T.Table>
      <ScrollArea className="flex flex-col h-full">
        <T.TableHeader>
          <T.TableRow>
            <T.TableHead>{t("student-id")}</T.TableHead>
            <T.TableHead>{t("student-firstname")}</T.TableHead>
            <T.TableHead>{t("student-lastname")}</T.TableHead>
          </T.TableRow>
        </T.TableHeader>
        {studentsInClass.map((std) => (
          <T.TableRow key={`user-${std.id}`}>
            <T.TableCell>{std.id}</T.TableCell>
            <T.TableCell>{std.firstname}</T.TableCell>
            <T.TableCell>{std.lastname}</T.TableCell>
            <T.TableCell className="text-right">
              <Button
                className="cursor-pointer"
                onClick={() => removeStudent({ class: cls, student: std })}
              >
                <Minus />
              </Button>
            </T.TableCell>
          </T.TableRow>
        ))}
        <T.TableRow>
          <T.TableCell className="p-2">
            <AddStudentDialog cls={cls} />
          </T.TableCell>
        </T.TableRow>
      </ScrollArea>
    </T.Table>
  );
}
