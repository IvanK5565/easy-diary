import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Users } from "lucide-react";
import { useTranslation } from "next-i18next";
import { IClass, IUser } from "../client/store/types";
import { useEntitySelector } from "@/client/hooks/useEntitySelector";

type Props = {
  onSelectClass?: (cls: IClass) => void;
  activeClass?: IClass;
};

function ClassList({ onSelectClass, activeClass }: Props) {
  const { t } = useTranslation("common");
  const classes = Object.values(useEntitySelector("classes"));

  return (
    <Card className="rounded-2xl shadow-md p-4">
      <CardContent>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Users size={20} /> {t("ClassList")}
        </h2>
        <div className="max-h-96 overflow-y-auto pr-2">
          <ul className="space-y-2">
            {classes.map((cls) => (
              <li key={cls.id}>
                <Button
                  variant={activeClass?.id === cls.id ? "default" : "outline"}
                  className="w-full justify-between"
                  onClick={() => onSelectClass?.(cls)}
                >
                  {cls.title}
                  <ChevronRight size={16} />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default ClassList;
