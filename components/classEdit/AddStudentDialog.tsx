import { useActions } from "@/client/hooks";
import { useEntitySelector } from "@/client/hooks/useEntitySelector";
import { IClass } from "@/client/store/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableCell, TableRow } from "@/components/ui/table";
import { UserRole } from "@/constants";
import { filter } from "lodash";
import { Plus } from "lucide-react";

export default function AddStudentDialog({
  cls,
  className,
}: {
  cls: IClass;
  className?: string;
}) {
  const { addStudent } = useActions("ClassEntity");
  const students = filter(
    useEntitySelector("users"),
    (usr) =>
      usr.role === UserRole.Student && !cls.studentsInClass?.includes(usr.id),
  );
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={className}>
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Table>
          <ScrollArea className="flex flex-col h-full">
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Firstname</TableCell>
              <TableCell>Lastname</TableCell>
            </TableRow>
            {students.map((std) => (
              <TableRow key={`user-${std.id}`}>
                <TableCell>{std.id}</TableCell>
                <TableCell>{std.firstname}</TableCell>
                <TableCell>{std.lastname}</TableCell>
                <TableCell>
                  <Button
                    className="cursor-pointer"
                    onClick={() => {
                      // toast("add");
                      addStudent({ class: cls, student: std });
                    }}
                  >
                    <Plus />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </ScrollArea>
        </Table>
        <DialogFooter>
          <DialogClose>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
