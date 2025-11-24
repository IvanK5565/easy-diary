import { PropsWithChildren } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Field, Form, Formik } from "formik";
import { IClass } from "@/client/store/types";
import { ClassStatus } from "@/constants";
import { useActions } from "@/client/hooks";
import * as Yup from "yup";
import { Label } from "./ui/label";

type NewClassModalProps = {
  cls?: IClass;
};

export default function ClassFormModal({
  cls,
  children,
}: PropsWithChildren<NewClassModalProps>) {
  const initialValues = {
    title: "",
    year: 2025,
    status: ClassStatus.DRAFT,
  } satisfies Omit<IClass, "id">;
  const { saveUser } = useActions("UserEntity");

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-card">
        <DialogHeader>
          <DialogTitle>New Class</DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={cls || initialValues}
          onSubmit={(values) => {
            saveUser(values);
          }}
          validationSchema={Yup.object().shape({
            title: Yup.string().required(),
          })}
        >
          <Form className="flex flex-col gap-1 p-4 rounded-2xl border bg-background">
            <Label htmlFor="title">Title</Label>
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
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </Form>
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
