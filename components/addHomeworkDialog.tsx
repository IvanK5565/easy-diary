import { IHomework, ISchedule } from "@/client/store/types";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { useActions } from "@/client/hooks";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useSelector } from "react-redux";
import { AppState } from "@/client/store/ReduxStore";
import * as Yup from "yup";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

export default function AddHomeworkDialog({
  sch,
  children,
}: PropsWithChildren<{ sch: ISchedule }>) {
  const { saveHomework } = useActions("HomeworkEntity");
  const auth = useSelector((state: AppState) => state.auth?.identity);
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        {auth && (
          <Formik<Omit<IHomework, "id">>
            initialValues={{
              scheduleId: sch.id,
              teacherId: auth.id,
              title: "",
              describe: "",
            }}
            onSubmit={(homework) => {
              saveHomework(homework);
            }}
            validationSchema={Yup.object().shape({
              title: Yup.string().required("Required!"),
              describe: Yup.string().required("Required!"),
            })}
          >
            <Form className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="title">Title</Label>
                <Field
                  name="title"
                  className={cn(
                    "placeholder:text-muted-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                  )}
                />
                <ErrorMessage name="title" className="text-red-700" />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="describe">Describe</Label>
                <Field
                  name="describe"
                  className={cn(
                    "placeholder:text-muted-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                  )}
                />
                <ErrorMessage name="describe" className="text-red-700" />
              </div>

              <Button type="submit">Submit</Button>
            </Form>
          </Formik>
        )}
      </DialogContent>
    </Dialog>
  );
}
