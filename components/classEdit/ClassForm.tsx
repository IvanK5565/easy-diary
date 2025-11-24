import { useActions } from "@/client/hooks";
import { IClass } from "@/client/store/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ClassStatus } from "@/constants";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";

export default function ClassForm({
  initialValues: init,
}: {
  initialValues?: Partial<IClass>;
}) {
  const { saveClass } = useActions("ClassEntity");
  return (
    <Formik<Omit<IClass, "id">>
      initialValues={{
        status: init?.status || ClassStatus.DRAFT,
        title: init?.title || "",
        year: init?.year || 2025,
      }}
      onSubmit={(values) => {
        saveClass(init?.id ? { ...values, id: init.id } : values);
      }}
      validationSchema={Yup.object().shape({
        title: Yup.string().required(),
      })}
    >
      <Form className="flex flex-col gap-1 p-4 h-full justify-between">
        <div className="flex flex-col gap-1">
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
        </div>
        <Button type="submit">Submit</Button>
      </Form>
    </Formik>
  );
}
