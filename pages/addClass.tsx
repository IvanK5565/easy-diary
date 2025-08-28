import { useActions } from "@/client/hooks";
import { IClass } from "@/client/store/types";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
              }}
              onSubmit={(values) => {
                saveClass(values);
              }}
              validationSchema={Yup.object().shape({
                title: Yup.string().required(),
              })}
            >
              <Form className="flex flex-col gap-2">
                <Label htmlFor="title">
                  <Field
                    required
                    name="title"
                    type="text"
                    placeholder="1-A"
                  />
                  Title
                </Label>
                <Button type="submit">Submit</Button>
              </Form>
            </Formik>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
