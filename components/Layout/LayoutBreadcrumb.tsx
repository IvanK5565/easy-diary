import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "../ui/breadcrumb";
import Link from "next/link";

export default function LayoutBreadcrumb({ items = [] }: { items?: string[] }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {items.map((item, idx) => {
          return (
            <>
              <BreadcrumbSeparator key={`breadcrumb${idx}`} />
              <BreadcrumbItem>
                <BreadcrumbPage>{item}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
