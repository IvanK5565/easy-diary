import { useActions } from "@/client/hooks";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useTranslation } from "next-i18next";
import { ComponentProps } from "react";
import * as Yup from "yup";

function FullFormField({
  name,
  label,
  placeholder,
  type = "text",
  required,
}: Pick<ComponentProps<"input">, "required" | "placeholder" | "type"> & {
  label?: string;
  name: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={name}>{label}</Label>
      <Field
        name={name}
        type={type}
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        )}
        placeholder={placeholder}
        required={required}
      />
      <ErrorMessage name={name} className="text-red" />
    </div>
  );
}

export default function AddSubject() {
  const { t } = useTranslation("common");
  const { saveSubject } = useActions("SubjectEntity");
  return (
    <Layout>
      <div className="p-4">
        <Formik
          initialValues={{
            title: "",
            describe: "",
            group: "",
          }}
          onSubmit={(values) => {
            saveSubject(values);
          }}
          validationSchema={Yup.object().shape({
            title: Yup.string().required(),
            describe: Yup.string(),
            group: Yup.string(),
          })}
        >
          <Form className="flex flex-col gap-4">
            <FullFormField name="title" label={t("Title")} required />
            <FullFormField name="describe" label={t("Describe")} />
            <FullFormField name="group" label={t("Group")} />
            <Button type="submit">{t("Submit")}</Button>
          </Form>
        </Formik>
      </div>
    </Layout>
  );
}
