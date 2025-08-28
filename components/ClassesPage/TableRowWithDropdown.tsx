import { TableRow, TableCell } from "../ui/table";
import { usersTest } from "@/client/testData";

export default function TableRowWithDropdown({ userId }: { userId: number }) {
  const users = usersTest;
  const user = users[userId];
  return (
    <TableRow>
      <TableCell>{user.firstName}</TableCell>
      <TableCell>Paid</TableCell>
      <TableCell>Credit Card</TableCell>
      <TableCell className="text-right">$250.00</TableCell>
    </TableRow>
  );
}
