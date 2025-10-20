import { useActions } from "@/client/hooks";
import { IClass } from "@/client/store/types";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ClassStatus } from "@/constants";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";

export default function AddUserPage() {
  const { saveClass } = useActions("ClassEntity");
  return (
    <Layout>
      <div className="flex justify-center">
        <Card>
          <CardHeader>
            <CardTitle>New Class</CardTitle>
          </CardHeader>
          <CardContent>
            <Formik<Omit<IClass, "id">>
              initialValues={{
                title: "",
                year: 2025,
                status: ClassStatus.DRAFT,
              }}
              onSubmit={(values) => {
                saveClass(values);
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
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
