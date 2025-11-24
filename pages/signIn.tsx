import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function SignInPage() {
  const initialValues = {
    email: "",
    password: "",
  };
  const { status } = useSession();
  const { push } = useRouter();
  if (status === "authenticated") {
    push("/");
  }
  return (
    <Layout>
      <div className="flex justify-center flex-1 items-start m-2">
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <Formik<{
              email: string;
              password: string;
            }>
              initialValues={initialValues}
              onSubmit={(values) => {
                signIn("credentials", { ...values });
              }}
              validationSchema={Yup.object().shape({
                email: Yup.string().required(),
                password: Yup.string().min(4).required(),
              })}
            >
              <Form className="flex flex-col gap-1 p-4 rounded-2xl border bg-background">
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
                <Button type="submit">Submit</Button>
              </Form>
            </Formik>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
