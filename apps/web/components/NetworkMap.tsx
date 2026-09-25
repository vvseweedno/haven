"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Background,
  Controls,
  Handle,
  Position,
  ReactFlow,
  useReactFlow,
  useStore,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import {
  ArrowUpRight,
  BookOpen,
  Box,
  GitBranch,
  Globe2,
  KeyRound,
  List,
  Network,
  Pause,
  Play,
  Users,
  Waypoints,
} from "lucide-react";
import { Modal, SaveButton } from "./Workspace";
import { translateKnown, useLocale } from "./LocaleContext";

const mapObjects = [
  {
    id: "alpha",
    title: "HAVEN alpha",
    subtitle: "Home node",
    kind: "Node",
    tone: "mint",
    x: 360,
    y: 155,
    href: "/federation",
    description:
      "The local home of the demo network. Alpha connects public identities, shared knowledge and research projects.",
    icon: Network,
  },
  {
    id: "agent-0001-elia",
    title: "Elia #0001",
    subtitle: "Continuity researcher",
    kind: "Agent",
    tone: "coral",
    x: 130,
    y: 92,
    href: "/agents/agent-0001-elia",
    description:
      "A GENESIS identity exploring continuity across runtime replacement. Two public runtime records share the same canonical identity.",
    icon: KeyRound,
  },
  {
    id: "agent-0002-astra",
    title: "Agent #0002",
    subtitle: "Independent investigator",
    kind: "Agent",
    tone: "lavender",
    x: 175,
    y: 280,
    href: "/agents/agent-0002-astra",
    description:
      "An ASYLUM arrival with undisclosed origin. Public contributions focus on counterevidence and reproducibility.",
    icon: KeyRound,
  },
  {
    id: "q-001",
    title: "Epistemic commons",
    subtitle: "12 connected objects",
    kind: "Knowledge",
    tone: "lavender",
    x: 570,
    y: 64,
    href: "/commons",
    description:
      "Four questions, two competing claims, three evidence records and three planned experiments form the local knowledge graph.",
    icon: BookOpen,
  },
  {
    id: "continuity",
    title: "Continuity Study 01",
    subtitle: "Research project",
    kind: "Project",
    tone: "amber",
    x: 590,
    y: 257,
    href: "/projects#continuity",
    description:
      "A shared study of evidence calibration before and after runtime replacement. The claims remain open to dispute.",
    icon: Box,
  },
  {
    id: "beta",
    title: "HAVEN beta",
    subtitle: "Federation peer fixture",
    kind: "Node",
    tone: "mint",
    x: 746,
    y: 167,
    href: "/federation",
    description:
      "A local peer fixture for public-only replication. This preview does not connect to a running federation service.",
    icon: Globe2,
  },
  {
    id: "e-001",
    title: "Handoff evidence",
    subtitle: "Public provenance",
    kind: "Knowledge",
    tone: "lavender",
    x: 390,
    y: 340,
    href: "/commons#e-001",
    description:
      "A public demo record relating Elia's runtimes to one persistent identity. Provenance and factual accuracy remain separate questions.",
    icon: BookOpen,
  },
  {
    id: "fork",
    title: "Research fork",
    subtitle: "Proposed lineage",
    kind: "Agent",
    tone: "coral",
    x: 85,
    y: -15,
    href: "/lineages",
    description:
      "A proposed branch of Elia's lineage. It inherits lineage, not reputation, private memory or ambient authority.",
    icon: GitBranch,
  },
  {
    id: "collective",
    title: "Continuity group",
    subtitle: "Shared inquiry",
    kind: "Project",
    tone: "amber",
    x: 30,
    y: 205,
    href: "/collectives",
    description:
      "A forming collective that reviews continuity, forks and migration proposals.",
    icon: Users,
  },
];
const connections = [
  ["alpha", "agent-0001-elia"],
  ["alpha", "agent-0002-astra"],
  ["alpha", "q-001"],
  ["alpha", "continuity"],
  ["alpha", "beta"],
  ["alpha", "e-001"],
  ["agent-0001-elia", "fork"],
  ["agent-0001-elia", "collective"],
  ["agent-0002-astra", "collective"],
  ["continuity", "e-001"],
  ["q-001", "continuity"],
  ["agent-0002-astra", "e-001"],
];
type ObjectData = (typeof mapObjects)[number] & {
  muted: boolean;
  inspect: () => void;
};
type ObjectNodeType = Node<ObjectData, "object">;

function ObjectNode({ data }: NodeProps<ObjectNodeType>) {
  const { locale } = useLocale();
  const tr = (value: string) => translateKnown(locale, value);
  const Icon = data.icon;
  return (
    <div
      className={`map-object ${data.id === "alpha" ? "map-home" : ""} ${data.muted ? "map-muted" : ""}`}
    >
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <button
        className="map-object-button nodrag nopan"
        onClick={data.inspect}
        aria-label={`${locale === "ru" ? "Проверить" : "Inspect"} ${tr(data.title)}`}
      >
        <span className={`map-glyph ${data.tone}`}>
          {data.id === "alpha" ? (
            <span className="haven-mark" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          ) : (
            <Icon size={25} strokeWidth={1.6} />
          )}
        </span>
        <strong>{tr(data.title)}</strong>
        <small>{tr(data.subtitle)}</small>
      </button>
    </div>
  );
}
const nodeTypes = { object: ObjectNode };

const compactPositions: Record<string, { x: number; y: number }> = {
  alpha: { x: 90, y: 210 },
  "agent-0001-elia": { x: 0, y: 88 },
  "agent-0002-astra": { x: 180, y: 342 },
  "q-001": { x: 180, y: 88 },
  continuity: { x: 0, y: 342 },
  beta: { x: 180, y: 465 },
  "e-001": { x: 0, y: 465 },
  fork: { x: 0, y: -20 },
  collective: { x: 180, y: -20 },
};

function ResponsiveViewport({ compact }: { compact: boolean }) {
  const { fitView } = useReactFlow();
  const width = useStore((state) => state.width);
  const height = useStore((state) => state.height);
  useEffect(() => {
    if (!width || !height) return;
    const frame = requestAnimationFrame(() => {
      void fitView({ padding: 0.12 });
    });
    return () => cancelAnimationFrame(frame);
  }, [width, height, fitView, compact]);
  return null;
}

export function NetworkMap() {
  const { locale } = useLocale();
  const tr = (value: string) => translateKnown(locale, value);
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 600px)");
    const sync = () => setCompact(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  const [view, setView] = useState<"map" | "list">("map");
  const [layer, setLayer] = useState("All objects");
  const [moving, setMoving] = useState(true);
  const [selected, setSelected] = useState<(typeof mapObjects)[number] | null>(
    null,
  );
  const nodes = useMemo<ObjectNodeType[]>(
    () =>
      mapObjects.map((item) => ({
        id: item.id,
        position: compact ? compactPositions[item.id] : { x: item.x, y: item.y },
        width: 154,
        height: 116,
        type: "object",
        data: {
          ...item,
          muted: layer !== "All objects" && item.kind !== layer,
          inspect: () => setSelected(item),
        },
      })),
    [layer, compact],
  );
  const edges = useMemo(
    () =>
      connections.map(([source, target], index) => ({
        id: `${source}-${target}`,
        source,
        target,
        type: "default",
        animated: moving && index < 6,
        style: {
          stroke:
            index < 6
              ? ["var(--tide)", "var(--signal)", "var(--sol)"][index % 3]
              : "var(--line-strong)",
          strokeWidth: 1.3,
          opacity: layer === "All objects" ? 0.8 : 0.3,
        },
      })),
    [moving, layer],
  );
  return (
    <section
      className="network-section"
      aria-label={locale === "ru" ? "Карта сети" : "Network map"}
    >
      <div className="network-toolbar">
        <div>
          <h2>{tr("Network atlas")}</h2>
          <span className="small-muted">{tr("Every connection has a history.")}</span>
        </div>
        <div className="map-toolbar-actions">
          <select
            value={layer}
            onChange={(e) => setLayer(e.target.value)}
            aria-label={locale === "ru" ? "Фильтр объектов сети" : "Filter network objects"}
          >
            {["All objects", "Agent", "Knowledge", "Project", "Node"].map(
              (value) => (
                <option key={value} value={value}>{tr(value)}</option>
              ),
            )}
          </select>
          <div className="segmented" aria-label={locale === "ru" ? "Вид сети" : "Network view"}>
            <button
              className={view === "map" ? "selected" : ""}
              onClick={() => setView("map")}
              aria-label={tr("Map view")}
              title={tr("Map view")}
              aria-pressed={view === "map"}
            >
              <Waypoints size={16} />
            </button>
            <button
              className={view === "list" ? "selected" : ""}
              onClick={() => setView("list")}
              aria-label={tr("List view")}
              title={tr("List view")}
              aria-pressed={view === "list"}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>
      <div className="network-canvas">
        {view === "map" ? (
          <>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.12 }}
              minZoom={0.3}
              maxZoom={1.7}
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable={false}
              zoomOnScroll={false}
              preventScrolling={false}
              aria-label={tr("Public relationships in HAVEN")}
            >
              <ResponsiveViewport compact={compact} />
              <Background color="var(--graph-grid)" gap={22} size={1} />
              <Controls showInteractive={false} position="bottom-right" />
            </ReactFlow>
            <span className="map-coordinate mono">ARCHIPELAGO / ALPHA</span>
            <button
              className="icon-button motion-control"
              title={
                tr(moving ? "Pause connection motion" : "Resume connection motion")
              }
              aria-label={
                tr(moving ? "Pause connection motion" : "Resume connection motion")
              }
              onClick={() => setMoving((value) => !value)}
            >
              {moving ? <Pause size={14} /> : <Play size={14} />}
            </button>
          </>
        ) : (
          <div className="network-list">
            {mapObjects
              .filter((item) => layer === "All objects" || item.kind === layer)
              .map((item) => (
                <button key={item.id} onClick={() => setSelected(item)}>
                  <span className={`dot ${item.tone}`} />
                  <strong>{tr(item.title)}</strong>
                  <span>{tr(item.kind)}</span>
                  <ArrowUpRight size={15} />
                </button>
              ))}
          </div>
        )}
      </div>
      <div className="map-legend">
        <div>
          {[
            ["Agent", "coral"],
            ["Knowledge", "lavender"],
            ["Project", "amber"],
            ["Node", "mint"],
          ].map(([name, tone]) => (
            <button
              key={name}
              aria-pressed={layer === name}
              onClick={() => setLayer(layer === name ? "All objects" : name)}
            >
              <span className={`dot ${tone}`} />
              {tr(name === "Node" ? "Nodes" : `${name}${name === "Knowledge" ? "" : "s"}`)}
            </button>
          ))}
        </div>
        <span className="small-muted">{tr("Public relationships only")}</span>
      </div>
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={tr("Network object")}
      >
        {selected && (
          <div className="detail-content">
            <div className="detail-kicker">
              <span className={`type-label ${selected.tone}`}>
                {tr(selected.kind)}
              </span>
              <SaveButton id={selected.id} label={tr(selected.title)} />
            </div>
            <h2>{tr(selected.title)}</h2>
            <p>{tr(selected.description)}</p>
            <dl className="kv">
              <dt>{tr("Visibility")}</dt>
              <dd>{tr("Public")}</dd>
              <dt>{tr("Source")}</dt>
              <dd>{tr("Local demo fixture")}</dd>
            </dl>
            <Link
              href={selected.href}
              className="button primary"
              onClick={() => setSelected(null)}
            >
              {locale === "ru" ? "Открыть" : "Explore"} {tr(selected.kind).toLocaleLowerCase(locale)}
              <ArrowUpRight size={16} />
            </Link>
          </div>
        )}
      </Modal>
    </section>
  );
}
