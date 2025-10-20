/* eslint-disable @typescript-eslint/no-explicit-any */
import Layout from "@/components/Layout";
import container from "@/server/di/container";
import { Field, Form, Formik } from "formik";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import * as Yup from "yup";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ISubject } from "@/client/store/types";
import { useCallback } from "react";
import { toast } from "react-toastify";
import { useEntitySelector } from "@/client/hooks/useEntitySelector";

export default function AdminPage() {
  const subjects = Object.values(useEntitySelector("subjects") ?? {});
  const handleAnswer = useCallback(async (res: Promise<any>) => {
    try {
      const data = await res.then((r) => (r.json ? r.json() : r));
      console.log("type: ", typeof data?.success);
      if (data?.success) {
        toast.success("Success");
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
          Classes
          <Formik<Omit<ISubject, "id">>
            initialValues={{
              title: "math",
              description: "",
              group: "",
            }}
            onSubmit={(values) => {
              handleAnswer(
                fetch("/api/subjects", {
                  body: JSON.stringify(values),
                  method: "POST",
                }),
              );
            }}
            validationSchema={Yup.object().shape({
              title: Yup.string().required(),
              description: Yup.string(),
              group: Yup.string(),
            })}
          >
            <Form className="flex flex-col gap-1 p-4 rounded-2xl border bg-background">
              <Label htmlFor="title">Title</Label>
              <Field
                className="p-2 rounded-2xl border border-border"
                id="title"
                name="title"
              />
              <Label htmlFor="description">Description</Label>
              <Field
                className="p-2 rounded-2xl border border-border"
                id="description"
                name="description"
              />
              <Label htmlFor="group">Group</Label>
              <Field
                className="p-2 rounded-2xl border border-border"
                id="group"
                name="group"
              />
              <Button type="submit">Submit</Button>
            </Form>
          </Formik>
          <ScrollArea className="p-4 h-100 rounded-2xl border bg-background">
            <pre>{JSON.stringify(subjects, null, 2)}</pre>
          </ScrollArea>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps = container.resolve("getServerSideProps")([
  "SubjectsController",
]);
