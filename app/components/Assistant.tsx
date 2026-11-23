// Taupe Assistant drawer. Scripted answers from app/lib/assistant.ts, using
// the student's plan. Opened from "Ask Taupe", "Need help?" or a task guide
// (a "taupe-context" event whose detail may carry a taskId).

import { useEffect, useRef, useState } from "react";
import {
  NOT_AI,
  contextLabel,
  followUps,
  opening,
  reply,
  suggestions,
  type AssistantContext,
  type Quick,
} from "../lib/assistant.ts";

type Message = { from: "student" | "taupe"; text: string };

export function Assistant({
  situation,
  plan,
  done,
}: Omit<AssistantContext, "taskId">) {
  const [open, setOpen] = useState(false),
    [taskId, setTaskId] = useState<string | null>(null),
    [messages, setMessages] = useState<Message[]>([]),
    [extra, setExtra] = useState<Quick[]>([]),
    [text, setText] = useState("");
  const body = useRef<HTMLDivElement>(null);
  const ctx: AssistantContext = { situation, plan, done, taskId };

  const start = (id: string | null) => {
    setTaskId(id);
    setMessages([]);
    setExtra([]);
    setOpen(true);
  };

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ taskId?: string } | undefined>).detail;
      setTaskId(detail?.taskId ?? null);
      setMessages([]);
      setExtra([]);
      setOpen(true);
    };
    window.addEventListener("taupe-context", handler);
    return () => window.removeEventListener("taupe-context", handler);
  }, []);

  useEffect(() => {
    body.current?.scrollTo(0, body.current.scrollHeight);
  }, [messages]);

  const ask = (q: Quick) => {
    setMessages((m) => [
      ...m,
      { from: "student", text: q.label },
      { from: "taupe", text: reply(ctx, { quick: q.id }) },
    ]);
    setExtra(followUps(q.id));
  };
  const send = () => {
    const t = text.trim();
    if (!t) return;
    setMessages((m) => [
      ...m,
      { from: "student", text: t },
      { from: "taupe", text: reply(ctx, { text: t }) },
    ]);
    setExtra([]);
    setText("");
  };
  const quick = extra.length ? extra : suggestions(ctx);

  return (
    <>
      <button className="ask-taupe" onClick={() => start(null)}>
        ✦ <span>Ask Taupe</span>
      </button>
      {open && (
        <section
          className="taupe-drawer"
          role="dialog"
          aria-label="Taupe Assistant"
        >
          <header>
            <div>
              <b>Taupe Assistant</b>
              <small>{contextLabel(ctx)}</small>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close">
              ×
            </button>
          </header>
          <p className="not-ai">{NOT_AI}</p>
          <div className="taupe-body" ref={body}>
            <p>{opening(ctx)}</p>
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.from === "student" ? "student-msg" : "taupe-msg"}
              >
                {m.text}
              </div>
            ))}
            <div className="taupe-quick">
              {quick.map((q) => (
                <button key={q.id} onClick={() => ask(q)}>
                  {q.label}
                </button>
              ))}
              {extra.length > 0 && (
                <button onClick={() => setExtra([])}>Other questions</button>
              )}
            </div>
          </div>
          <footer>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Type a question or a French term…"
              aria-label="Ask Taupe"
            />
            <button onClick={send} aria-label="Send">
              ↑
            </button>
          </footer>
          <small>
            TaupeFR explains the process. Official requirements and decisions
            stay with the relevant organisation.
          </small>
        </section>
      )}
    </>
  );
}
