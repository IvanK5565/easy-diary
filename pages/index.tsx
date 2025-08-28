import { useActions } from "@/client/hooks";
import { IClass, IUser } from "@/client/store/types";
import ClassDiary from "@/components/ClassDiary";
import ClassList from "@/components/ClassList";
import ClassScheduleViewer from "@/components/ClassScheduleViewer";
import Layout from "@/components/Layout";
import StudentList from "@/components/StudentsList";
import { Button } from "@/components/ui/button";
import container from "@/server/di/container";
import Link from "next/link";
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
      <div className="bg-background">
        <main className="">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <ClassList
              onSelectClass={(cls) => setClass(cls)}
              activeClass={cls}
            />
            <StudentList
              cls={cls}
              onSelectStudent={(std) => setStudent(std)}
              activeUser={student}
            />
            <div className="flex gap-2">
              <Button>
                <Link href="/addClass">new</Link>
              </Button>
              <Button disabled={!cls}>edit</Button>
              {cls?.id ? (
                <Button asChild>
                  <Link href={`/class/${cls.id}/schedule`}>view calendar</Link>
                </Button>
              ) : (
                <Button disabled>view calendar</Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button>
                <Link href="/addUser">new</Link>
              </Button>
              <Button disabled={!cls}>edit</Button>
              {student?.id ? (
                <Button asChild>
                  <Link href={`/diary/${student.id}`}>view diary</Link>
                </Button>
              ) : (
                <Button disabled>view diary</Button>
              )}
            </div>
          </div>
          <ClassScheduleViewer cls={cls} week={Date.now()} className="p-4" />
          <ClassDiary week={Date.now()} className="p-4" classId={cls?.id} />
        </main>
      </div>
    </Layout>
  );
}

export const getServerSideProps = container.resolve("getServerSideProps")([
  "ClassesController",
]);
