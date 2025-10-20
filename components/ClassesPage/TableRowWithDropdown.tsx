import { useEntitySelector } from "@/client/hooks/useEntitySelector";
import { TableRow, TableCell } from "../ui/table";

export default function TableRowWithDropdown({ userId }: { userId: number }) {
  const users = useEntitySelector("users");
  const user = users[userId];
  return (
    <TableRow>
      <TableCell>{user.firstname}</TableCell>
      <TableCell>Paid</TableCell>
      <TableCell>Credit Card</TableCell>
      <TableCell className="text-right">$250.00</TableCell>
    </TableRow>
  );
}
