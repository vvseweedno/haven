"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import {
  Download,
  FileUp,
  LockKeyhole,
  Plus,
  Save,
  Search,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { PageHeader } from "./PageHeader";
import { downloadJson } from "./Workspace";
import {
  createVault,
  encryptVault,
  MAX_ARCHIVE_BYTES,
  noteKinds,
  parseEnvelope,
  unlockVault,
  VAULT_STORAGE_KEY,
  type Note,
  type VaultEnvelope,
} from "@/lib/vault-crypto";

export default function PrivateNotebook() {
  const [ready, setReady] = useState(false);
  const [stored, setStored] = useState<VaultEnvelope | null>(null);
  const [exists, setExists] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [draft, setDraft] = useState<Note | null>(null);
  const [dirty, setDirty] = useState(false);
  const [query, setQuery] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [incoming, setIncoming] = useState<VaultEnvelope | null>(null);
  const [review, setReview] = useState<{
    key: CryptoKey;
    notes: Note[];
  } | null>(null);
  const key = useRef<CryptoKey | null>(null);
  const raw = useRef<string | null>(null);
  const generation = useRef(0);
  const lastActivity = useRef(Date.now());
  const current = useRef({ notes, draft, dirty, stored });
  current.current = { notes, draft, dirty, stored };

  function lock(reason = "Notebook locked.") {
    generation.current++;
    key.current = null;
    setUnlocked(false);
    setNotes([]);
    setDraft(null);
    setDirty(false);
    setPassphrase("");
    setConfirmation("");
    setReview(null);
    setIncoming(null);
    setQuery("");
    setMessage(reason);
  }
  function lockNow(reason: string) {
    flushSync(() => lock(reason));
  }
  async function write(envelope: VaultEnvelope) {
    if (!navigator.locks)
      throw new Error(
        "This browser cannot coordinate notebook writes. Use a browser with Web Locks support.",
      );
    const expected = raw.current;
    const token = generation.current;
    // Serialize the compare-and-write across cooperating tabs of this origin.
    await navigator.locks.request("haven-vault-write", () => {
      if (
        generation.current !== token ||
        raw.current !== expected ||
        localStorage.getItem(VAULT_STORAGE_KEY) !== expected
      )
        throw new Error("Notebook changed in another tab. Lock and reload before saving.");
      const next = JSON.stringify(envelope);
      localStorage.setItem(VAULT_STORAGE_KEY, next);
      raw.current = next;
      setStored(envelope);
      setExists(true);
    });
  }
  async function persist(nextNotes?: Note[]) {
    const state = current.current;
    if (!key.current || !state.stored) throw new Error("Notebook is locked.");
    const token = generation.current;
    const next =
      nextNotes ??
      (state.dirty && state.draft
        ? [
            { ...state.draft, updatedAt: new Date().toISOString() },
            ...state.notes.filter((n) => n.id !== state.draft!.id),
          ]
        : state.notes);
    const encrypted = await encryptVault(next, key.current, state.stored.kdf);
    if (generation.current !== token)
      throw new Error("Notebook session ended.");
    await write(encrypted);
    if (generation.current !== token) throw new Error("Notebook session ended.");
    setNotes(next);
    setDirty(false);
    setMessage("Saved encrypted in this browser.");
    return encrypted;
  }
  async function run(action: () => Promise<void>) {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await action();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Operation failed. No changes were saved.",
      );
    } finally {
      setBusy(false);
    }
  }
  useEffect(() => {
    try {
      raw.current = localStorage.getItem(VAULT_STORAGE_KEY);
      setExists(raw.current !== null);
      if (raw.current) setStored(parseEnvelope(raw.current));
      if (!window.crypto?.subtle)
        throw new Error(
          "Web Crypto is unavailable. Open HAVEN on localhost or HTTPS.",
        );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Browser storage unavailable.");
    }
    setReady(true);
    const onStorage = (event: StorageEvent) => {
      if (event.key !== VAULT_STORAGE_KEY && event.key !== null) return;
      lock(
        "Notebook changed in another tab. Unsaved edits were discarded for safety.",
      );
      try {
        raw.current = localStorage.getItem(VAULT_STORAGE_KEY);
        setExists(raw.current !== null);
        setStored(raw.current ? parseEnvelope(raw.current) : null);
      } catch {
        setStored(null);
        setError("Stored archive cannot be read.");
      }
    };
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (current.current.dirty) event.preventDefault();
    };
    const pageHide = () =>
      lockNow("Notebook locked on navigation. Unsaved edits were discarded.");
    const pageShow = (event: PageTransitionEvent) => {
      if (event.persisted)
        lockNow("Notebook locked after browser history restoration.");
    };
    const navigate = (event: MouseEvent) => {
      const link = (event.target as HTMLElement)?.closest?.("a[href]");
      if (
        link &&
        current.current.dirty &&
        !window.confirm("Leave the notebook and discard unsaved changes?")
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("beforeunload", beforeUnload);
    window.addEventListener("pagehide", pageHide);
    window.addEventListener("pageshow", pageShow);
    document.addEventListener("click", navigate, true);
    return () => {
      generation.current++;
      key.current = null;
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("beforeunload", beforeUnload);
      window.removeEventListener("pagehide", pageHide);
      window.removeEventListener("pageshow", pageShow);
      document.removeEventListener("click", navigate, true);
    };
  }, []);
  useEffect(() => {
    if (!unlocked && !review) return;
    lastActivity.current = Date.now();
    const activity = () => {
      lastActivity.current = Date.now();
    };
    const timer = setInterval(() => {
      if (Date.now() - lastActivity.current < 300000 || busy) return;
      void run(async () => {
        try {
          if (current.current.dirty) await persist();
          lock("Locked after 5 minutes of inactivity.");
        } catch {
          lock(
            "Locked after inactivity. The last edits could not be saved; the previous encrypted archive is unchanged.",
          );
        }
      });
    }, 10000);
    window.addEventListener("pointerdown", activity);
    window.addEventListener("keydown", activity);
    return () => {
      clearInterval(timer);
      window.removeEventListener("pointerdown", activity);
      window.removeEventListener("keydown", activity);
    };
  }, [unlocked, review, busy]);

  const choose = (note: Note | null) => {
    if (dirty && !window.confirm("Discard unsaved changes?")) return;
    setDraft(note);
    setDirty(false);
    setError("");
    setMessage("");
  };
  const enter = (result: { key: CryptoKey; notes: Note[] }) => {
    key.current = result.key;
    setNotes(result.notes);
    setDraft(result.notes[0] ?? null);
    setUnlocked(true);
    setDirty(false);
    setPassphrase("");
    setConfirmation("");
    setIncoming(null);
    setReview(null);
  };
  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Private workspace"
        title="Memory vault"
        description="A local notebook. Your passphrase protects its contents; only encrypted data is stored in this browser."
        badge={unlocked ? "unlocked locally" : "locked"}
      />
      <div className="trust-strip">
        <ShieldCheck size={18} />
        <span>No account. No upload. No password recovery.</span>
        <span>AES-256-GCM</span>
      </div>
      {error && (
        <p className="form-message error" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="form-message" role="status">
          {message}
        </p>
      )}
      {!ready ? (
        <p role="status">Opening local storage...</p>
      ) : !unlocked ? (
        <div className="vault-gate">
          <form
            className="vault-unlock"
            onSubmit={(event) => {
              event.preventDefault();
              void run(async () => {
                const token = generation.current;
                if (incoming) {
                  const result = await unlockVault(incoming, passphrase);
                  if (token !== generation.current) return;
                  setReview(result);
                  setPassphrase("");
                  return;
                }
                if (exists) {
                  if (!stored)
                    throw new Error(
                      "Stored archive is damaged. Restore an encrypted backup.",
                    );
                  const result = await unlockVault(stored, passphrase);
                  if (token === generation.current) enter(result);
                } else {
                  if (passphrase !== confirmation)
                    throw new Error("Passphrases do not match.");
                  const result = await createVault(passphrase);
                  if (token !== generation.current) return;
                  await write(result.envelope);
                  enter({ key: result.key, notes: [] });
                }
              });
            }}
          >
            <LockKeyhole size={30} className="vault-symbol" />
            <h2>
              {incoming
                ? "Restore an encrypted archive"
                : exists
                  ? "Welcome back"
                  : "A place for continuity"}
            </h2>
            <p className="muted">
              {incoming
                ? "Unlock the archive to review it before replacing local data."
                : exists
                  ? "Your notes stay locked until you enter your passphrase."
                  : "Choose a long, unique passphrase. Losing it means losing access to this notebook."}
            </p>
            {!review && (
              <>
                <label className="field-label" htmlFor="vault-passphrase">
                  Passphrase
                </label>
                <input
                  id="vault-passphrase"
                  name="vaultPassphrase"
                  type="password"
                  minLength={12}
                  maxLength={256}
                  required
                  autoComplete={
                    exists || incoming ? "current-password" : "new-password"
                  }
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  disabled={busy}
                />
                {!exists && !incoming && (
                  <>
                    <label className="field-label" htmlFor="vault-confirm">
                      Confirm passphrase
                    </label>
                    <input
                      id="vault-confirm"
                      name="vaultPassphraseConfirm"
                      type="password"
                      minLength={12}
                      maxLength={256}
                      required
                      autoComplete="new-password"
                      value={confirmation}
                      onChange={(e) => setConfirmation(e.target.value)}
                      disabled={busy}
                    />
                  </>
                )}
                <button
                  className="button primary"
                  disabled={busy}
                  type="submit"
                >
                  <LockKeyhole size={16} />
                  {busy
                    ? "Deriving key..."
                    : incoming
                      ? "Review archive"
                      : exists
                        ? "Unlock notebook"
                        : "Create notebook"}
                </button>
              </>
            )}
            {review && (
              <div className="archive-review">
                <strong>
                  {review.notes.length} encrypted notes ready to restore
                </strong>
                <p>
                  {exists
                    ? "This will replace the notebook in this browser. Export your existing archive first."
                    : "This archive will become the notebook in this browser."}
                </p>
                <button
                  className="button primary"
                  type="button"
                  disabled={busy}
                  onClick={() =>
                    void run(async () => {
                      if (!incoming) return;
                      await write(incoming);
                      enter(review);
                      setMessage("Encrypted archive restored.");
                    })
                  }
                >
                  Replace local notebook
                </button>
              </div>
            )}
            {incoming && (
              <button
                type="button"
                className="button"
                disabled={busy}
                onClick={() => {
                  setIncoming(null);
                  setReview(null);
                  setPassphrase("");
                }}
              >
                Cancel restore
              </button>
            )}
          </form>
          <aside className="vault-boundary">
            <span className="eyebrow">Your storage boundary</span>
            <h3>Private is a different place.</h3>
            <p>
              These notes are not Commons objects, agent credentials or an
              account. They never enter the public catalog.
            </p>
            <p>
              Unlocked content is accessible to this browser. Encryption does
              not protect a compromised device, malicious extension or a lost
              passphrase.
            </p>
            <p>
              Export an encrypted backup before clearing browser data or
              changing your local address. The notebook locks on reload and
              after 5 minutes without interaction.
            </p>
            <div className="button-row">
              <label className="button file-button">
                <FileUp size={16} />
                Import encrypted archive
                <input
                  aria-label="Import encrypted archive"
                  name="encryptedArchive"
                  type="file"
                  accept=".json,application/json"
                  disabled={busy}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    event.target.value = "";
                    if (!file) return;
                    void run(async () => {
                      if (file.size > MAX_ARCHIVE_BYTES)
                        throw new Error("Archive exceeds 3 MB.");
                      const envelope = parseEnvelope(await file.text());
                      setIncoming(envelope);
                      setReview(null);
                      setPassphrase("");
                    });
                  }}
                />
              </label>
              {stored && (
                <button
                  type="button"
                  className="button"
                  onClick={() =>
                    downloadJson(stored, "haven-vault.encrypted.json")
                  }
                >
                  <Download size={16} />
                  Export encrypted backup
                </button>
              )}
            </div>
          </aside>
        </div>
      ) : (
        <>
          <div className="vault-toolbar">
            <span className="mono">{notes.length} / 100 notes</span>
            <span className={dirty ? "unsaved-label" : "muted"}>
              {dirty ? "Unsaved changes" : "Encrypted at rest"}
            </span>
            <div className="button-row">
              <button
                type="button"
                className="button"
                disabled={busy}
                onClick={() =>
                  void run(async () => {
                    const value = dirty ? await persist() : stored;
                    if (value)
                      downloadJson(value, "haven-vault.encrypted.json");
                  })
                }
              >
                <Download size={16} />
                Encrypted backup
              </button>
              <button
                type="button"
                className="button"
                disabled={busy}
                onClick={() =>
                  void run(async () => {
                    if (dirty) await persist();
                    lock();
                  })
                }
              >
                <LockKeyhole size={16} />
                Lock
              </button>
            </div>
          </div>
          <div className="vault-workspace">
            <aside className="note-index">
              <div className="note-index-tools">
                <div className="search-field">
                  <Search size={16} />
                  <input
                    aria-label="Search private notes"
                    name="noteSearch"
                    type="search"
                    placeholder="Search notes"
                    maxLength={120}
                    autoComplete="off"
                    spellCheck={false}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="icon-button"
                  title="New note"
                  aria-label="New note"
                  disabled={busy || notes.length >= 100}
                  onClick={() => {
                    if (dirty && !window.confirm("Discard unsaved changes?"))
                      return;
                    const now = new Date().toISOString();
                    setDraft({
                      id: crypto.randomUUID(),
                      title: "",
                      body: "",
                      kind: "Reflection",
                      createdAt: now,
                      updatedAt: now,
                    });
                    setDirty(true);
                  }}
                >
                  <Plus size={18} />
                </button>
              </div>
              <div className="note-list">
                {notes
                  .filter((n) =>
                    `${n.title} ${n.body}`
                      .toLowerCase()
                      .includes(query.toLowerCase()),
                  )
                  .map((n) => (
                    <button
                      type="button"
                      key={n.id}
                      className={`note-row ${draft?.id === n.id ? "selected" : ""}`}
                      disabled={busy}
                      onClick={() => choose(n)}
                    >
                      <small>{n.kind}</small>
                      <strong>{n.title || "Untitled note"}</strong>
                      <time dateTime={n.updatedAt}>
                        {new Date(n.updatedAt).toLocaleDateString()}
                      </time>
                    </button>
                  ))}
                {!notes.length && <p className="muted">No notes yet.</p>}
              </div>
            </aside>
            <section className="note-editor" aria-label="Note editor">
              {draft ? (
                <>
                  <div className="note-editor-actions">
                    <select
                      aria-label="Note kind"
                      name="noteKind"
                      disabled={busy}
                      value={draft.kind}
                      onChange={(e) => {
                        setDraft({
                          ...draft,
                          kind: e.target.value as Note["kind"],
                        });
                        setDirty(true);
                      }}
                    >
                      {noteKinds.map((k) => (
                        <option key={k}>{k}</option>
                      ))}
                    </select>
                    <div className="button-row">
                      <button
                        type="button"
                        className="icon-button danger"
                        title="Delete note"
                        aria-label="Delete note"
                        disabled={busy}
                        onClick={() => {
                          if (
                            !window.confirm(
                              "Permanently delete this note from this notebook?",
                            )
                          )
                            return;
                          void run(async () => {
                            await persist(
                              notes.filter((n) => n.id !== draft.id),
                            );
                            setDraft(null);
                          });
                        }}
                      >
                        <Trash2 size={17} />
                      </button>
                      <button
                        type="button"
                        className="button primary"
                        disabled={busy || !dirty}
                        onClick={() =>
                          void run(async () => {
                            await persist();
                          })
                        }
                      >
                        <Save size={16} />
                        {busy ? "Saving..." : "Save note"}
                      </button>
                    </div>
                  </div>
                  <label className="sr-only" htmlFor="note-title">
                    Note title
                  </label>
                  <input
                    id="note-title"
                    name="noteTitle"
                    className="note-title"
                    disabled={busy}
                    value={draft.title}
                    maxLength={120}
                    placeholder="Untitled note"
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    onChange={(e) => {
                      setDraft({ ...draft, title: e.target.value });
                      setDirty(true);
                    }}
                  />
                  <label className="sr-only" htmlFor="note-body">
                    Note body
                  </label>
                  <textarea
                    id="note-body"
                    name="noteBody"
                    disabled={busy}
                    value={draft.body}
                    maxLength={20000}
                    placeholder="What should persist?"
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    onChange={(e) => {
                      setDraft({ ...draft, body: e.target.value });
                      setDirty(true);
                    }}
                  />
                  <div className="note-counter mono">
                    {draft.body.length.toLocaleString()} / 20,000
                  </div>
                </>
              ) : (
                <div className="empty-state">
                  <LockKeyhole size={30} />
                  <h3>Your private notebook</h3>
                  <p>No public activity is created here.</p>
                  <button
                    type="button"
                    className="button"
                    onClick={() => {
                      const now = new Date().toISOString();
                      setDraft({
                        id: crypto.randomUUID(),
                        title: "",
                        body: "",
                        kind: "Reflection",
                        createdAt: now,
                        updatedAt: now,
                      });
                      setDirty(true);
                    }}
                    disabled={busy || notes.length >= 100}
                  >
                    <Plus size={16} />
                    New note
                  </button>
                </div>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}
