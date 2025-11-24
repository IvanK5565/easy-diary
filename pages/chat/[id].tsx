import { useActions } from "@/client/hooks";
import { useEntitySelector } from "@/client/hooks/useEntitySelector";
import { AppState } from "@/client/store/ReduxStore";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const { getChat, send } = useActions("MessageEntity");
  const { push } = useRouter();
  const { t } = useTranslation("common");

  const auth = useSelector((state: AppState) => state.auth);
  const { query } = useRouter();
  const receiverId = useMemo(
    () => (typeof query.id === "string" && parseInt(query.id, 10)) || undefined,
    [query.id],
  );
  const contact = useSelector((state: AppState) =>
    receiverId ? state.entities.users[receiverId] : undefined,
  );

  useEffect(() => {
    if (auth?.identity.id && receiverId) {
      const userB = receiverId;
      if (!isNaN(userB)) {
        getChat({ userA: auth?.identity.id, userB });
      }
    }
  }, [auth?.identity.id, receiverId]);

  const messages = Object.values(useEntitySelector("messages")).filter(
    (mess) =>
      (mess.receiverId === receiverId && mess.senderId === auth?.identity.id) ||
      (mess.receiverId === auth?.identity.id && mess.senderId === receiverId),
  );

  const addMessage = () => {
    if (input && receiverId && auth?.identity.id) {
      send({
        receiverId: receiverId,
        senderId: auth.identity.id,
        body: input,
      });
      setInput("");
    }
  };

  if (!auth) {
    push("/");
    return null;
  }

  return (
    <Layout breadcrumb={["Chat"]}>
      <div className="flex-1 p-5 lg:p-20 flex overflow-hidden">
        <div className="w-full xl:h-[700px] flex flex-col p-2 rounded-2xl border border-border bg-accent overflow-hidden">
          <div className="w-full pb-2 flex justify-center items-center text-center">
            {contact?.firstname} {contact?.lastname} {contact?.email}
          </div>
          <div className="flex-1 flex flex-col-reverse bg-background rounded-2xl overflow-auto">
            <CustomScrollArea dependencies={[messages]}>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn("w-full flex", {
                    "text-right flex-row-reverse":
                      msg.senderId === auth.identity.id,
                  })}
                >
                  <div
                    className={cn(
                      "bg-muted text-foreground px-4 py-2 rounded-md shadow w-7/8",
                      { "text-right": msg.senderId === auth.identity.id },
                    )}
                  >
                    {msg.body}
                  </div>
                </div>
              ))}
            </CustomScrollArea>
          </div>
          <div className="w-full p-2 space-x-2 flex justify-center items-center text-center">
            <Input
              value={input}
              onChange={({ target: { value } }) => setInput(value)}
              onKeyDown={function (event) {
                if (event.key === "Enter") {
                  addMessage();
                }
              }}
            />
            <Button onClick={addMessage}>{t("Send")}</Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

interface CustomScrollAreaProps {
  children: React.ReactNode;
  autoScroll?: boolean;
  dependencies?: unknown[]; // що тригерить скролл (напр. повідомлення)
}

export function CustomScrollArea({
  children,
  autoScroll = true,
  dependencies = [],
}: CustomScrollAreaProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Прокрутити донизу
  const scrollToBottom = () => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  };

  // Прокрутити на старті
  useEffect(() => {
    if (autoScroll) scrollToBottom();
  }, []);

  // Прокрутити при зміні залежностей (напр. нові повідомлення)
  useEffect(() => {
    if (autoScroll) scrollToBottom();
  }, [...dependencies]);

  return (
    <div className="h-full w-full overflow-hidden rounded-md border">
      <div
        ref={scrollRef}
        className="h-full w-full overflow-y-scroll px-4 py-2 space-y-4 scroll-smooth"
      >
        {children}
      </div>
    </div>
  );
}
