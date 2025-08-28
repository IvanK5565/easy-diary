import Layout from "@/components/Layout";
import { IClass } from "@/client/store/types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useEntitySelector } from "@/client/hooks/useEntitySelector";

export default function StudentsPage() {
  const { t } = useTranslation("common");
  const classes = Object.values(useEntitySelector('classes'));
  const users = Object.values(useEntitySelector('users'));
  const [selectedClass, selectClass] = useState<IClass | undefined>();

  const students = useMemo(() => {
    if (selectedClass)
      return users.filter((u) => selectedClass.studentsInClass?.includes(u.id));
    return undefined;
  }, [selectedClass, users]);

  return (
    <Layout>
      <div className="p-4 flex flex-col gap-1 w-full">
        {classes && classes.length > 0 && (
          <Select
            onValueChange={(value) =>
              value && selectClass(classes[parseInt(value)])
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("selectClassPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{t("selectClassLabel")}</SelectLabel>
                {classes.length > 0 &&
                  classes.map((cls) => (
                    <SelectItem key={"Class:" + cls.id} value={String(cls.id)}>
                      {cls.title}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
        {students && students.length > 0 && (
          <Table>
            <TableBody>
              {students.length > 0 &&
                students.map((usr) => (
                  <TableRow key={"Student:" + usr.id} className="flex justify-between">
                    <TableCell>{usr.firstname}</TableCell>
                    <TableCell className="flex gap-1">
                      <Button asChild><Link href={'/diary/'+usr.id}>{t("Diary")}</Link></Button>
                      <Button>{t("Message")}</Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}
      </div>
    </Layout>
  );
}
