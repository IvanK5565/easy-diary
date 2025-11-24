import { AclRole } from "@/acl/types";
import { useActions } from "@/client/hooks";
import { useEntitySelector } from "@/client/hooks/useEntitySelector";
import { AppState } from "@/client/store/ReduxStore";
import { IUser } from "@/client/store/types";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserRole } from "@/constants";
import { cn } from "@/lib/utils";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";

function ContactsList({ onSelect }: { onSelect: (id: IUser) => void }) {
  const auth = useSelector((state: AppState) => state.auth);
  if (!auth) {
    return null;
  }
  const [isOpen, setOpenIs] = useState<boolean>();
  const cls = useSelector((state: AppState) =>
    Object.values(state.entities.classes).find((c) =>
      c.studentsInClass?.includes(auth.identity.id),
    ),
  );
  const contacts = Object.values(useEntitySelector("users")).filter(
    (s) =>
      cls?.studentsInClass?.includes(s.id) ||
      s.role === UserRole.Teacher ||
      auth.identity.role === AclRole.TEACHER,
  );
  return (
    <div className="flex gap-2 flex-col p-4 xl:w-1/5">
      <Button className="xl:hidden" onClick={() => setOpenIs(!isOpen)}>
        Select
      </Button>
      <div
        className={cn("flex flex-col gap-2 p-2", {
          "hidden xl:flex": !isOpen,
          flex: isOpen,
        })}
      >
        {contacts.map((c) => (
          <Button key={c.id} onClick={() => onSelect(c)} variant="outline">
            {c.firstname} {c.lastname}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [contact, setContact] = useState<IUser>();
  const [input, setInput] = useState("");
  const { getChat, send } = useActions("MessageEntity");
  const { push } = useRouter();

  const auth = useSelector((state: AppState) => state.auth);

  const receiverId = useMemo(() => contact?.id || undefined, [contact?.id]);

  useEffect(() => {
    if (auth?.identity.id && receiverId) {
      const userB = receiverId;
      if (!isNaN(userB)) {
        getChat({ userA: auth.identity.id, userB });
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
      <div className="flex flex-1 flex-col xl:flex-row-reverse">
        <ContactsList onSelect={(id) => setContact(id)} />
        <div className="flex-1 p-5 lg:p-15 flexoverflow-hidden">
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
              <Button onClick={addMessage}>Send</Button>
            </div>
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
