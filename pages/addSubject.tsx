import Layout from "@/components/Layout";
import { Field, Form, Formik } from "formik";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import * as Yup from "yup";
import { ISubject } from "@/client/store/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useActions } from "@/client/hooks";
import { useTranslation } from "next-i18next";

export default function AddSubject() {
  const { saveSubject } = useActions("SubjectEntity");
  const { t } = useTranslation("common");
  return (
    <Layout>
      <div className="flex flex-1 justify-center items-center">
        <Card>
          <CardHeader>{t("addSubject")}</CardHeader>
          <CardContent>
            <Formik<Omit<ISubject, "id"> & Partial<Pick<ISubject, "id">>>
              initialValues={{
                title: "math",
                description: "",
                group: "",
              }}
              onSubmit={(values) => {
                saveSubject(values);
              }}
              validationSchema={Yup.object().shape({
                title: Yup.string().required(),
                description: Yup.string(),
                group: Yup.string(),
              })}
            >
              <Form className="flex flex-col gap-1 p-4 rounded-2xl border bg-background">
                <Label htmlFor="title">{t("Title")}</Label>
                <Field
                  className="p-2 rounded-2xl border border-border"
                  id="title"
                  name="title"
                />
                <Label htmlFor="description">{t("Description")}</Label>
                <Field
                  className="p-2 rounded-2xl border border-border"
                  id="description"
                  name="description"
                />
                <Label htmlFor="group">{t("Group")}</Label>
                <Field
                  className="p-2 rounded-2xl border border-border"
                  id="group"
                  name="group"
                />
                <Button type="submit">{t("Submit")}</Button>
              </Form>
            </Formik>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
