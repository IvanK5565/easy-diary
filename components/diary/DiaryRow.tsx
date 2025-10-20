import { useActions } from "@/client/hooks";
import { useEntitySelector } from "@/client/hooks/useEntitySelector";
import { IMark, ISchedule, IUser } from "@/client/store/types";
import { useTranslation } from "next-i18next";
import { Badge } from "../ui/badge";
import { TableCell, TableRow } from "../ui/table";
import BadgeWithPopover from "../ui/BadgeWithPopover";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { SquarePlus } from "lucide-react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { MarkType } from "@/constants";
import * as Yup from "yup";
import { Button } from "../ui/button";

export default function DiaryRow({
  sch,
  number,
  student,
}: {
  sch: ISchedule | undefined;
  student: IUser;
  number: number;
}) {
  const subjects = Object.values(useEntitySelector("subjects") ?? {});
  const marks = Object.values(useEntitySelector("marks") ?? {});
  const homeworks = Object.values(useEntitySelector("homeworks") ?? {});
  const { t } = useTranslation("common");
  const { saveMark } = useActions("MarkEntity");

  const RenderMark = ({ mark }: { mark: IMark }) => {
    const label = t(mark.type);

    return (
      <Badge variant="secondary" className="text-xs mr-1">
        {label}: {mark.value}
      </Badge>
    );
  };

  const subject = sch
    ? (subjects.find((s) => s.id === sch.subjectId)?.title ?? "not-found")
    : "-";
  const homework = sch ? homeworks.filter((h) => h.scheduleId === sch.id) : [];
  const mark = marks.find((m) => m.scheduleId === sch?.id);
  return (
    <TableRow>
      <TableCell className="w-1/8">{number + 1}</TableCell>
      <TableCell className="w-1/4">{subject}</TableCell>
      <TableCell>
        <BadgeWithPopover data={homework.map((h) => h.title)} placeholder="-" />
      </TableCell>
      <TableCell className="w-1/8">
        {mark && <RenderMark mark={mark} />}
        <Dialog>
          <DialogTrigger asChild>
            <button
              disabled={!sch}
              className="hover:bg-input rounded-sm -m-2 p-2"
            >
              <SquarePlus className={!sch ? `text-accent` : undefined} />
            </button>
          </DialogTrigger>
          <DialogContent>
            <Formik<Pick<IMark, "type" | "value">>
              initialValues={{
                type: MarkType.IN_CLASS,
                value: 0,
              }}
              onSubmit={(values) => {
                if (sch) {
                  saveMark({
                    type: values.type,
                    value: Number(values.value),
                    scheduleId: sch.id,
                    studentId: student.id,
                  });
                }
              }}
              validationSchema={Yup.object().shape({
                type: Yup.string()
                  .oneOf(Object.values(MarkType))
                  .required("Required"),
                value: Yup.number().max(100).min(0).required("Required"),
              })}
            >
              <Form className="flex flex-col gap-2 p-4">
                <Field name="value" />
                <ErrorMessage name="value" />

                <Field as="select" name="type">
                  <option value={MarkType.IN_CLASS} defaultChecked>
                    In class work
                  </option>
                  <option value={MarkType.HW}>Homework</option>
                  <option value={MarkType.TEST}>Test</option>
                </Field>
                <ErrorMessage name="value" />

                <Button type="submit">Save</Button>
              </Form>
            </Formik>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
}
