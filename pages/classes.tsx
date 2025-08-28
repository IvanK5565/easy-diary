import { AppState } from "@/client/store/ReduxStore";
import { Entities } from "@/client/store/types";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { useSelector } from "react-redux";

export default function ClassesPage() {
  const classes = useSelector(
    (state: AppState) => state.entities.classes as Entities["classes"],
  );
  return (
    <Layout>
      <div className="p-4 flex flex-col gap-1 w-full">
        <Card className="bg-background w-min">
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Year</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(classes).map(([id, cls]) => (
                  <TableRow key={`${id}`}>
                    <TableCell>{cls.title}</TableCell>
                    <TableCell>{cls.status}</TableCell>
                    <TableCell>{cls.year}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild>
                        <Link href={`class/${id}/schedule`}>Schedule</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
