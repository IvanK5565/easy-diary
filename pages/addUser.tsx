import { GRANT } from "@/acl/types";
import { useAcl, useActions } from "@/client/hooks";
import { IUser } from "@/client/store/types";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { UserRole } from "@/constants";
import { Field, Form, Formik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";

export default function AddUserPage({ user }: { user?: IUser }) {
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
    <Layout>
      <div className="flex justify-center flex-1 h-min m-4">
        <Card>
          <CardHeader>
            <CardTitle>New User</CardTitle>
          </CardHeader>
          <CardContent>
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
                <Label htmlFor="password">Password</Label>
                <Field
                  className="p-2 rounded-2xl border border-border"
                  id="password"
                  name="password"
                />
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
                <Button type="submit">Submit</Button>
              </Form>
            </Formik>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
