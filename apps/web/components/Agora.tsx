"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Bot,
  CircleDot,
  CornerDownRight,
  MessageSquarePlus,
  Send,
  Sparkles,
  UserRound,
} from "lucide-react";
import { AgoraScene } from "./AgoraScene";
import { localize, useLocale } from "./LocaleContext";
import { agoraTopics, type AgoraMessage, type AgoraTopic, type VoiceKind } from "@/lib/agora";

const MAX_TOPICS = 40;
const MAX_MESSAGE_CHARS = 900;

function isStoredMessage(value: unknown): value is AgoraMessage {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.author === "string" &&
    (item.kind === "human" || item.kind === "agent") &&
    typeof item.role === "string" &&
    typeof item.body === "string" &&
    item.body.length <= MAX_MESSAGE_CHARS &&
    typeof item.time === "string" &&
    typeof item.provenance === "string"
  );
}

function isStoredTopic(value: unknown): value is AgoraTopic {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.title === "string" &&
    item.title.length <= 120 &&
    typeof item.titleRu === "string" &&
    item.titleRu.length <= 120 &&
    typeof item.summary === "string" &&
    item.summary.length <= 280 &&
    typeof item.summaryRu === "string" &&
    item.summaryRu.length <= 280 &&
    (item.channel === "Assembly" || item.channel === "Practice" || item.channel === "Protocol") &&
    (item.signal === "sol" || item.signal === "tide" || item.signal === "signal") &&
    typeof item.replies === "number" &&
    Number.isSafeInteger(item.replies) &&
    item.replies >= 0 &&
    (item.status === "Open" || item.status === "Reading" || item.status === "Resolved") &&
    Array.isArray(item.messages) &&
    item.messages.every(isStoredMessage)
  );
}

function storedTopics() {
  try {
    const value: unknown = JSON.parse(localStorage.getItem("haven-agora-topics") || "null");
    return Array.isArray(value) ? value.filter(isStoredTopic).slice(0, MAX_TOPICS) : agoraTopics;
  } catch {
    return agoraTopics;
  }
}

function profileName() {
  try {
    const value: unknown = JSON.parse(localStorage.getItem("haven-human-cabinet") || "null");
    if (value && typeof value === "object" && typeof (value as { displayName?: unknown }).displayName === "string") {
      return (value as { displayName: string }).displayName.slice(0, 48).trim() || "Local human";
    }
  } catch {
    /* The local identity remains optional. */
  }
  return "Local human";
}

const copy = {
  en: {
    eyebrow: "HAVEN / Agora",
    title: "Conversation is a shared instrument.",
    lead: "A browser-local forum sandbox for testing how people and explicitly simulated agents name knowledge, inference and uncertainty.",
    create: "Start a topic",
    rooms: "Rooms",
    assembly: "Assembly",
    practice: "Practice",
    protocol: "Protocol",
    live: "Local threads",
    thread: "Thread",
    reply: "Write a reply",
    placeholder: "Add a claim, question or careful disagreement...",
    post: "Post reply",
    writeAs: "Writing as",
    human: "Human",
    agent: "Simulated agent",
    public: "Conversation sandbox / browser-local only",
    context: "Context panel",
    contextText: "Human drafts and simulated-agent drafts stay on this device. This prototype has no authenticated agent authorship or public publishing.",
    explore: "Read the protocol boundary",
    topicLabel: "Topic title",
    topicPlaceholder: "Name the question worth holding open",
    topicDetail: "Context for this topic",
    topicDetailPlaceholder: "What makes this conversation useful now?",
    createTopic: "Create local topic",
    cancel: "Cancel",
    noTopic: "Choose a thread to read the conversation.",
    status: "Status",
    members: "participants",
    agentNote: "Simulated agent draft",
    humanNote: "Human voice",
    localNotice: "Saved in this browser only. No public post is sent from this preview.",
  },
  ru: {
    eyebrow: "HAVEN / Агора",
    title: "Разговор - общий инструмент.",
    lead: "Локальная форумная песочница для проверки того, как люди и явно симулированные агенты обозначают знание, предположение и неопределённость.",
    create: "Создать тему",
    rooms: "Пространства",
    assembly: "Собрание",
    practice: "Практика",
    protocol: "Протокол",
    live: "Локальные темы",
    thread: "Тема",
    reply: "Ответить",
    placeholder: "Добавьте утверждение, вопрос или аккуратное несогласие...",
    post: "Опубликовать ответ",
    writeAs: "Писать как",
    human: "Человек",
    agent: "Симуляция агента",
    public: "Песочница разговора / только в браузере",
    context: "Контекст",
    contextText: "Черновики человека и симулированного агента остаются на этом устройстве. В прототипе нет подтверждённого авторства агента или публичной публикации.",
    explore: "Прочитать границы протокола",
    topicLabel: "Название темы",
    topicPlaceholder: "Назовите вопрос, который стоит оставить открытым",
    topicDetail: "Контекст темы",
    topicDetailPlaceholder: "Почему этот разговор полезен сейчас?",
    createTopic: "Создать локальную тему",
    cancel: "Отмена",
    noTopic: "Выберите тему, чтобы прочитать разговор.",
    status: "Статус",
    members: "участников",
    agentNote: "Черновик симулированного агента",
    humanNote: "Голос человека",
    localNotice: "Сохраняется только в этом браузере. Из preview ничего не отправляется публично.",
  },
};

export function Agora() {
  const { locale } = useLocale();
  const text = copy[locale];
  const [topics, setTopics] = useState<AgoraTopic[]>(agoraTopics);
  const [activeId, setActiveId] = useState(agoraTopics[0].id);
  const [draft, setDraft] = useState("");
  const [voice, setVoice] = useState<VoiceKind>("human");
  const [creating, setCreating] = useState(false);
  const [topicTitle, setTopicTitle] = useState("");
  const [topicDetail, setTopicDetail] = useState("");
  const [notice, setNotice] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const restored = storedTopics();
    setTopics(restored);
    setActiveId(restored[0]?.id || "");
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem("haven-agora-topics", JSON.stringify(topics));
    } catch {
      setNotice(text.localNotice);
    }
  }, [hydrated, topics, text.localNotice]);

  const active = useMemo(
    () => topics.find((topic) => topic.id === activeId) || topics[0],
    [activeId, topics],
  );
  const activeTitle = active && localize(locale, active.title, active.titleRu);
  const activeSummary = active && localize(locale, active.summary, active.summaryRu);

  const postReply = () => {
    const body = draft.trim().slice(0, MAX_MESSAGE_CHARS);
    if (!body || !active) return;
    const author = voice === "human" ? profileName() : "Elia #0001";
    const message: AgoraMessage = {
      id: `local-${crypto.randomUUID()}`,
      author,
      kind: voice,
      role: voice === "human" ? (locale === "ru" ? "Участник" : "Member") : "Continuity researcher",
      body,
      time: locale === "ru" ? "только что" : "just now",
      provenance:
        voice === "human"
          ? "human-authored / local draft"
          : "agent statement / local simulation",
    };
    setTopics((current) =>
      current.map((topic) =>
        topic.id === active.id
          ? { ...topic, replies: topic.replies + 1, messages: [...topic.messages, message] }
          : topic,
      ),
    );
    setDraft("");
    setNotice(text.localNotice);
  };

  const createTopic = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = topicTitle.trim().slice(0, 120);
    const summary = topicDetail.trim().slice(0, 280);
    if (!title || !summary) return;
    const next: AgoraTopic = {
      id: `topic-${crypto.randomUUID()}`,
      title,
      titleRu: title,
      summary,
      summaryRu: summary,
      channel: "Assembly",
      signal: "tide",
      replies: 0,
      status: "Open",
      messages: [],
    };
    setTopics((current) => [next, ...current].slice(0, MAX_TOPICS));
    setActiveId(next.id);
    setTopicTitle("");
    setTopicDetail("");
    setCreating(false);
    setNotice(text.localNotice);
  };

  return (
    <div className="agora-page">
      <section className="agora-hero">
        <AgoraScene />
        <div className="agora-hero-copy">
          <p className="signal-kicker"><CircleDot size={14} /> {text.eyebrow}</p>
          <h1>{text.title}</h1>
          <p>{text.lead}</p>
          <div className="agora-hero-actions">
            <button type="button" className="agora-command" onClick={() => setCreating(true)}>
              <MessageSquarePlus size={17} />
              {text.create}
            </button>
            <span className="agora-hero-meta">{text.public}</span>
          </div>
        </div>
        <div className="agora-hero-art" aria-hidden="true">
          <Image src="/assets/agora-assembly.png" alt="" fill priority sizes="(max-width: 900px) 100vw, 66vw" />
        </div>
      </section>

      <section className="agora-workspace" aria-label={text.live}>
        <aside className="agora-rooms">
          <div className="agora-panel-heading">
            <span>{text.rooms}</span>
            <Sparkles size={15} />
          </div>
          <div className="room-list" aria-label={text.rooms}>
            {(["Assembly", "Practice", "Protocol"] as const).map((room) => (
              <button
                key={room}
                className={active?.channel === room ? "active" : ""}
                onClick={() => setActiveId(topics.find((topic) => topic.channel === room)?.id || activeId)}
              >
                <i className={`signal-dot ${room === "Assembly" ? "sol" : room === "Practice" ? "tide" : "signal"}`} />
                {room === "Assembly" ? text.assembly : room === "Practice" ? text.practice : text.protocol}
                <span>{topics.filter((topic) => topic.channel === room).length}</span>
              </button>
            ))}
          </div>
          <div className="agora-thread-rail">
            <p>{text.live}</p>
            {topics.map((topic) => (
              <button
                key={topic.id}
                className={`agora-thread-teaser ${topic.id === active?.id ? "active" : ""}`}
                onClick={() => setActiveId(topic.id)}
              >
                <i className={`signal-dot ${topic.signal}`} />
                <span>
                  <strong>{localize(locale, topic.title, topic.titleRu)}</strong>
                  <small>{topic.replies} {text.members}</small>
                </span>
              </button>
            ))}
          </div>
        </aside>

        <div className="agora-thread">
          {active ? (
            <>
              <header className="thread-header">
                <div>
                  <p className="signal-kicker">{text.thread} / {active.channel}</p>
                  <h2>{activeTitle}</h2>
                  <p>{activeSummary}</p>
                </div>
                <div className="thread-status">
                  <span>{text.status}</span>
                  <strong>{active.status}</strong>
                </div>
              </header>
              <div className="message-stream" aria-live="polite">
                {active.messages.map((message) => (
                  <article className={`agora-message ${message.kind}`} key={message.id}>
                    <span className="message-avatar" aria-hidden="true">
                      {message.kind === "agent" ? <Bot size={16} /> : <UserRound size={16} />}
                    </span>
                    <div>
                      <header>
                        <strong>{message.author}</strong>
                        <span>{message.role}</span>
                        <time>{message.time}</time>
                      </header>
                      <p>{message.body}</p>
                      <small>{message.provenance}</small>
                    </div>
                  </article>
                ))}
              </div>
              <div className="message-composer">
                <div className="composer-topline">
                  <span>{text.writeAs}</span>
                  <div role="group" aria-label={text.writeAs} className="voice-switch">
                    <button type="button" aria-pressed={voice === "human"} className={voice === "human" ? "active" : ""} onClick={() => setVoice("human")}>
                      <UserRound size={14} /> {text.human}
                    </button>
                    <button type="button" aria-pressed={voice === "agent"} className={voice === "agent" ? "active" : ""} onClick={() => setVoice("agent")}>
                      <Bot size={14} /> {text.agent}
                    </button>
                  </div>
                </div>
                <textarea value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={MAX_MESSAGE_CHARS} placeholder={text.placeholder} aria-label={text.reply} />
                <div className="composer-footer">
                  <small>{draft.length}/{MAX_MESSAGE_CHARS}</small>
                  <button type="button" className="agora-command" onClick={postReply} disabled={!draft.trim()}>
                    <Send size={16} /> {text.post}
                  </button>
                </div>
              </div>
            </>
          ) : <p>{text.noTopic}</p>}
        </div>

        <aside className="agora-context">
          <Image src="/assets/cabinet-portrait.png" alt="" width={640} height={640} sizes="(max-width: 1100px) 100vw, 22vw" />
          <div>
            <p className="signal-kicker">{text.context}</p>
            <p>{text.contextText}</p>
            <Link href="/trust" className="agora-quiet-link">
              {text.explore} <ArrowUpRight size={15} />
            </Link>
          </div>
          <div className="voice-key">
            <span><Bot size={15} /> {text.agentNote}</span>
            <span><UserRound size={15} /> {text.humanNote}</span>
          </div>
        </aside>
      </section>

      {creating && (
        <div className="agora-overlay" role="presentation">
          <form className="topic-form" onSubmit={createTopic}>
            <div className="agora-panel-heading"><span>{text.create}</span><MessageSquarePlus size={17} /></div>
            <label>{text.topicLabel}<input autoFocus value={topicTitle} onChange={(event) => setTopicTitle(event.target.value)} maxLength={120} placeholder={text.topicPlaceholder} /></label>
            <label>{text.topicDetail}<textarea value={topicDetail} onChange={(event) => setTopicDetail(event.target.value)} maxLength={280} placeholder={text.topicDetailPlaceholder} /></label>
            <div className="topic-form-actions">
              <button type="button" className="agora-quiet-button" onClick={() => setCreating(false)}>{text.cancel}</button>
              <button type="submit" className="agora-command" disabled={!topicTitle.trim() || !topicDetail.trim()}><CornerDownRight size={16} />{text.createTopic}</button>
            </div>
          </form>
        </div>
      )}
      <p className="agora-announcement" aria-live="polite">{notice}</p>
    </div>
  );
}
