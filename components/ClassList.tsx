import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Edit, Plus, Users } from "lucide-react";
import { useTranslation } from "next-i18next";
import { IClass } from "../client/store/types";
import { useEntitySelector } from "@/client/hooks/useEntitySelector";
import { useAcl } from "@/client/hooks";
import { useEffect } from "react";
import { AclResourses } from "@/constants";
import { GRANT } from "@/acl/types";
import CustomLinkButton from "./CustomLinkButton";
import ClassFormModal from "./ClassFormModal";

type Props = {
  onSelectClass?: (cls: IClass) => void;
  activeClass?: IClass;
};

function ClassList({ onSelectClass, activeClass }: Props) {
  const { t } = useTranslation("common");
  const classes = Object.values(useEntitySelector("classes"));

  const { allow, identity } = useAcl();
  const currentClass = classes.find((cls) =>
    cls.studentsInClass?.find((id) => id === identity?.id),
  );
  const canSelectClass = allow(GRANT.READ, AclResourses.CAN_SELECT_CLASS);
  const canAddClass = allow(GRANT.WRITE, AclResourses.CAN_ADD_CLASS);
  const canEditClass = allow(GRANT.WRITE, AclResourses.CAN_EDIT_CLASS);

  useEffect(() => {
    if (!canSelectClass && currentClass && onSelectClass) {
      onSelectClass(currentClass);
    }
  }, []);

  return (
    <Card className="rounded-2xl shadow-md p-4 flex-1">
      <CardHeader>
        <h2 className="text-xl font-semibold flex items-center gap-2 -mb-4">
          <Users size={20} /> {t("ClassList")}
        </h2>
      </CardHeader>
      <CardContent className="flex flex-col justify-between h-full">
        <div className="max-h-96 overflow-y-auto pr-2">
          <ul className="space-y-2">
            {classes.map((cls) => (
              <li key={cls.id} className="flex gap-2 items-center">
                <Button
                  variant={activeClass?.id === cls.id ? "default" : "outline"}
                  className="flex-1 justify-between"
                  onClick={() => canSelectClass && onSelectClass?.(cls)}
                >
                  {cls.title}
                  <ChevronRight size={16} />
                </Button>
                <CustomLinkButton
                  className="size-8"
                  disabled={!canEditClass}
                  href={`/class/${cls.id}/edit`}
                >
                  <Edit />
                </CustomLinkButton>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <ClassFormModal>
            <Button className="mt-2" disabled={!canAddClass}>
              <Plus />
            </Button>
          </ClassFormModal>
          {/* <CustomLinkButton
            className="mt-2"
            disabled={!canAddClass}
            href="/addClass"
          >
            <Plus />
          </CustomLinkButton> */}
        </div>
      </CardContent>
    </Card>
  );
}

export default ClassList;
