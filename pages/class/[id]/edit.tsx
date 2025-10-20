import { useActions } from "@/client/hooks";
import { useEntitySelector } from "@/client/hooks/useEntitySelector";
import { AppState } from "@/client/store/ReduxStore";
import { IClass } from "@/client/store/types";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableCell, TableRow } from "@/components/ui/table";
import { ClassStatus, UserRole } from "@/constants";
import container from "@/server/di/container";
import { Field, Form, Formik } from "formik";
import { filter } from "lodash";
import { Minus, Plus } from "lucide-react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";

function ClassForm({
  initialValues: init,
}: {
  initialValues?: Partial<IClass>;
}) {
  const { saveClass } = useActions("ClassEntity");
  return (
    <Formik<Omit<IClass, "id">>
      initialValues={{
        status: init?.status || ClassStatus.DRAFT,
        title: init?.title || "",
        year: init?.year || 2025,
      }}
      onSubmit={(values) => {
        saveClass(init?.id ? { ...values, id: init.id } : values);
      }}
      validationSchema={Yup.object().shape({
        title: Yup.string().required(),
      })}
    >
      <Form className="flex flex-col gap-1 p-4">
        <Label htmlFor="title">Titlle</Label>
        <Field
          className="p-2 rounded-2xl border border-border"
          id="title"
          name="title"
        />
        <Label htmlFor="year">Year</Label>
        <Field
          className="p-2 rounded-2xl border border-border"
          id="year"
          name="year"
          type="number"
        />

        <Button type="submit">Submit</Button>
      </Form>
    </Formik>
  );
}

function AddStudentDialog({ cls }: { cls: IClass }) {
  const { addStudent } = useActions("ClassEntity");
  const students = filter(
    useEntitySelector("users"),
    (usr) =>
      usr.role === UserRole.Student && !cls.studentsInClass?.includes(usr.id),
  );
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Table>
          <ScrollArea className="flex flex-col h-full">
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Firstname</TableCell>
              <TableCell>Lastname</TableCell>
            </TableRow>
            {students.map((std) => (
              <TableRow key={`user-${std.id}`}>
                <TableCell>{std.id}</TableCell>
                <TableCell>{std.firstname}</TableCell>
                <TableCell>{std.lastname}</TableCell>
                <TableCell>
                  <Button
                    className="cursor-pointer"
                    onClick={() => {
                      toast("add");
                      addStudent({ class: cls, student: std });
                    }}
                  >
                    <Plus />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </ScrollArea>
        </Table>
        <DialogFooter>
          <DialogClose>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function ProfilePage() {
  const { query } = useRouter();
  const classId = query.id as string;
  const cls = useSelector(
    (state: AppState) => state.entities.classes[Number(classId)],
  );
  const { t } = useTranslation("common");
  const users = useEntitySelector("users");
  const studentsInClass = filter(
    users,
    (usr) => !!cls.studentsInClass?.includes(usr.id),
  );
  const { removeStudent } = useActions("ClassEntity");

  return (
    <Layout>
      <Card className="m-20">
        <CardHeader className="-mb-4">{t("Edit Class ")}</CardHeader>
        <CardContent className="flex flex-wrap justify-center border-t-1">
          <div className="flex">
            <ClassForm initialValues={cls} />
            <Table>
              <ScrollArea className="flex flex-col h-full">
                {studentsInClass.map((std) => (
                  <TableRow key={`user-${std.id}`}>
                    <TableCell>{std.firstname}</TableCell>
                    <TableCell>{std.lastname}</TableCell>
                    <TableCell>
                      <Button
                        className="cursor-pointer"
                        onClick={() =>
                          removeStudent({ class: cls, student: std })
                        }
                      >
                        <Minus />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <AddStudentDialog cls={cls} />
                </TableRow>
              </ScrollArea>
            </Table>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
}

export const getServerSideProps = container.resolve("getServerSideProps")([
  "ClassesController",
  "UsersController",
]);
