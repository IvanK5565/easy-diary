import { useActions } from "@/client/hooks";
import { IClass, IUser } from "@/client/store/types";
import ClassDiary from "@/components/ClassDiary";
import ClassList from "@/components/ClassList";
import ClassScheduleViewer from "@/components/ClassScheduleViewer";
import Layout from "@/components/Layout";
import StudentList from "@/components/StudentsList";
import container from "@/server/di/container";
import { useEffect, useState } from "react";

export default function Home() {
  const [cls, setClass] = useState<IClass>();
  const [student, setStudent] = useState<IUser>();

  const { fetchHomeworksByClass } = useActions("HomeworkEntity");
  const { fetchMarksByClass } = useActions("MarkEntity");

  useEffect(() => {
    if (cls) fetchHomeworksByClass({ classId: cls?.id, weekDay: Date.now() });
  }, [cls]);

  useEffect(() => {
    if (cls && student)
      fetchMarksByClass({
        classId: cls?.id,
        studentId: student.id,
        weekDay: Date.now(),
      });
  }, [cls, student]);

  return (
    <Layout>
      <main className="bg-background flex-1">
        <div className="flex flex-col lg:flex-row gap-4 p-4">
          <ClassList onSelectClass={(cls) => setClass(cls)} activeClass={cls} />
          <StudentList
            cls={cls}
            onSelectStudent={(std) => setStudent(std)}
            activeUser={student}
          />
        </div>
        <ClassScheduleViewer cls={cls} week={Date.now()} className="p-4" />
        {student && (
          <ClassDiary week={Date.now()} className="p-4" classId={cls?.id} />
        )}
      </main>
    </Layout>
  );
}

export const getServerSideProps = container.resolve("getServerSideProps")([
  "ClassesController",
]);
