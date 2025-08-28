/* eslint-disable @typescript-eslint/no-explicit-any */
import Layout from "@/components/Layout";
import container from "@/server/di/container";
import { Field, Form, Formik } from "formik";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import * as Yup from "yup";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IClass } from "@/client/store/types";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEntitySelector } from "@/client/hooks/useEntitySelector";

export default function AdminPage() {
  const [selectedStudent, selectStudent] = useState("");
  const [selectedClass, selectClass] = useState("");
  const classes = Object.values(useEntitySelector('classes') ?? {});
  const users = Object.values(useEntitySelector('users') ?? {});
  const handleAnswer = useCallback(async (res: Promise<any>) => {
    try {
      const data = await res.then((r) => (r.json ? r.json() : r));
      console.log("type: ", typeof data?.success);
      if (Boolean(data?.success)) {
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
          <Formik<Omit<IClass, "id">>
            initialValues={{
              title: "class",
              year: 2025,
            }}
            onSubmit={(values) => {
              handleAnswer(
                fetch("/api/classes", {
                  body: JSON.stringify(values),
                  method: "POST",
                }),
              );
            }}
            validationSchema={Yup.object().shape({
              title: Yup.string().required(),
              year: Yup.number().min(2000).max(2025).required(),
            })}
          >
            <Form className="flex flex-col gap-1 p-4 rounded-2xl border bg-background">
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
          <ScrollArea className="p-4 h-100 rounded-2xl border bg-background">
            <pre>{JSON.stringify(classes, null, 2)}</pre>
          </ScrollArea>
          StudentClasses
          <div className="flex gap-2">
            <Select
              name="studentClass-student"
              onValueChange={(id) => selectStudent(id)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a student" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Array.isArray(users) &&
                    users
                      .filter((u) => u.role === "student")
                      .map((u) => (
                        <SelectItem key={u.id} value={u.id.toString()}>
                          {u.firstname ?? u.id} {u.lastname ?? "unknown"}
                        </SelectItem>
                      ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select
              name="studentClass-class"
              onValueChange={(id) => selectClass(id)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Array.isArray(classes) &&
                    classes.map((c) => (
                      <SelectItem key={c.id} value={c.id.toString()}>
                        {c.title ?? c.id}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button
              onClick={() => {
                const cls = classes?.find(
                  (c: any) => c.id === selectedClass,
                );
                const std = users?.find(
                  (s: any) => s.id === selectedStudent,
                );
                if (cls && std) {
                  handleAnswer(
                    fetch("/api/classes/addStudent", {
                      method: "POST",
                      body: JSON.stringify({
                        student: std,
                        class: cls,
                      }),
                    }),
                  );
                }
              }}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps = container.resolve('getServerSideProps')(["ClassesController","UsersController"]);
