/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUser } from "@/client/store/types";
import Layout from "@/components/Layout";
import container from "@/server/di/container";
import { Field, Form, Formik } from "formik";

import { UserRole } from "@/constants";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import * as Yup from "yup";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCallback } from "react";
import { toast } from "react-toastify";
import { useEntitySelector } from "@/client/hooks/useEntitySelector";

export default function AdminPage() {
  const users = Object.values(useEntitySelector('users') ?? {});
  const handleAnswer = useCallback(async (res: Promise<any>) => {
    try {
      const data = await res.then((r) => (r.json ? r.json() : r));
      console.log('type: ', typeof data?.success);
      if (Boolean(data?.success)) {
        toast.success('Success');
        toast.info(`res: ${JSON.stringify(data.data)}`);
      } else toast.warn(data?.message ?? JSON.stringify(data, null, 2));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : JSON.stringify(e, null, 2));
    }
  }, []);
  return (
    <Layout>
      <div className="rounded-2xl border p-4 bg-accent">
        <div>
          Users
          <Formik<Omit<IUser, "id">>
            initialValues={{
              email: "teacher@email.com",
              firstname: "ivan",
              lastname: "",
              password: "teacher",
              role: UserRole.Teacher,
            }}
            onSubmit={(values) => {
              handleAnswer(
                fetch("/api/register", {
                  body: JSON.stringify(values),
                  method: "POST",
                }),
              );
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
              <Label htmlFor="role">Role</Label>
              <Field
                className="p-2 rounded-2xl border border-border"
                id="role"
                name="role"
              />
              <Button type="submit">Submit</Button>
            </Form>
          </Formik>
          <ScrollArea className="h-100 p-4 rounded-2xl border bg-background">
            <pre>{JSON.stringify(users, null, 2)}</pre>
          </ScrollArea>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps = container.resolve('getServerSideProps')(["ClassesController","UsersController"]);
