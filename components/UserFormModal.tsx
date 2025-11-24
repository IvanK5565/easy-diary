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
import { IUser } from "@/client/store/types";
import { UserRole } from "@/constants";
import { useAcl, useActions } from "@/client/hooks";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { Label } from "./ui/label";
import { GRANT } from "@/acl/types";

type NewUserModalProps = { user?: IUser };

export default function UserFormModal({
  user,
  children,
}: PropsWithChildren<NewUserModalProps>) {
  const initialValues = {
    email: "teacher@email.com",
    firstname: "ivan",
    lastname: "",
    password: "teacher",
    role: UserRole.Teacher,
  };
  const { saveUser } = useActions("UserEntity");
  const { allow } = useAcl();

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-card">
        <DialogHeader>
          <DialogTitle>User Form</DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={user || initialValues}
          onSubmit={(values) => {
            saveUser(values);
            toast(JSON.stringify(values), { autoClose: 10000 });
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string().required(),
            password: Yup.string().min(4).required(),
            role: Yup.string().required(),
          })}
        >
          <Form className="flex flex-col gap-1 p-4 rounded-2xl border bg-background">
            <Label htmlFor="firstname">FirstName</Label>
            <Field
              className="p-2 rounded-2xl border border-border"
              id="firstname"
              name="firstname"
            />
            <Label htmlFor="lastname">LastName</Label>
            <Field
              className="p-2 rounded-2xl border border-border"
              id="lastname"
              name="lastname"
            />
            <Label htmlFor="email">Email</Label>
            <Field
              className="p-2 rounded-2xl border border-border"
              id="email"
              name="email"
            />
            {!user && (
              <>
                <Label htmlFor="password">Password</Label>
                <Field
                  className="p-2 rounded-2xl border border-border"
                  id="password"
                  name="password"
                />
              </>
            )}
            <Label htmlFor="role">Role:</Label>
            <Field
              required
              as="select"
              name="role"
              className="bg-background rounded-2xl border border-border p-3"
            >
              <option
                className="bg-input rounded-2xl border border-border p-2"
                value="student"
              >
                Student
              </option>
              {allow(GRANT.EXECUTE, "addTeacher") && (
                <option value="teacher">Teacher</option>
              )}
            </Field>
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
