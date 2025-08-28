import { useActions } from "@/client/hooks";
import { IUser } from "@/client/store/types";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { UserRole } from "@/constants";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";

export default function AddUserPage() {
  const { saveUser } = useActions("UserEntity");
  return (
    <Layout>
      <div className="flex justify-center">
        <Card>
          <CardHeader>
            <CardTitle>New User</CardTitle>
          </CardHeader>
          <CardContent>
            <Formik<Omit<IUser, "id">>
              initialValues={{
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                role: UserRole.Student,
              }}
              onSubmit={(values) => {
                saveUser(values);
              }}
              validationSchema={Yup.object().shape({
                firstName: Yup.string().required(),
                lastName: Yup.string().required(),
                email: Yup.string().email().required(),
                password: Yup.string().min(4).max(20).required(),
                role: Yup.string().oneOf(["student", "teacher"]),
              })}
            >
              <Form className="flex flex-col gap-2">
                <Label htmlFor="firstName">
                  <Field
                    required
                    name="firstName"
                    type="text"
                    placeholder="John"
                  />
                  First Name
                </Label>
                <Label htmlFor="lastName">
                  <Field
                    required
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                  />
                  Last Name
                </Label>
                <Label htmlFor="email">
                  <Field
                    required
                    name="email"
                    type="email"
                    placeholder="example@mail.com"
                  />
                  Email
                </Label>
                <Label htmlFor="password">
                  <Field
                    required
                    name="password"
                    type="password"
                    placeholder="********"
                  />
                  Password
                </Label>
                <Label htmlFor="role">Role:</Label>
                <Field required as="select" name="role">
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
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
