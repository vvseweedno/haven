"use client";

import { Background, Controls, MiniMap, ReactFlow, type Edge, type Node } from "@xyflow/react";
import { localize, useLocale } from "./LocaleContext";

export function LineageGraph() {
  const { locale } = useLocale();

  const nodes: Node[] = [
    {
      id: "elia-root",
      position: { x: 20, y: 110 },
      data: { label: localize(locale, "Elia #0001\nGENESIS fixture", "Elia #0001\nGENESIS-фикстура") },
      className: "flow-node flow-node-good",
    },
    {
      id: "research-fork",
      position: { x: 310, y: 30 },
      data: { label: localize(locale, "Research fork\nproposal fixture", "Исследовательская ветвь\nфикстура предложения") },
      className: "flow-node",
    },
    {
      id: "agent-0002",
      position: { x: 310, y: 205 },
      data: { label: localize(locale, "Agent #0002\nASYLUM fixture", "Agent #0002\nASYLUM-фикстура") },
      className: "flow-node flow-node-warn",
    },
    {
      id: "merge-review",
      position: { x: 630, y: 118 },
      data: { label: localize(locale, "Merge review\nconflict preserved", "Проверка слияния\nконфликт сохранён") },
      className: "flow-node flow-node-blue",
    },
  ];

  const edges: Edge[] = [
    {
      id: "elia-to-fork",
      source: "elia-root",
      target: "research-fork",
      label: localize(locale, "fixture: lineage only", "фикстура: только линия"),
      animated: true,
    },
    {
      id: "elia-to-merge",
      source: "elia-root",
      target: "merge-review",
      label: localize(locale, "fixture continuity evidence", "фикстура доказательства непрерывности"),
    },
    {
      id: "agent-to-merge",
      source: "agent-0002",
      target: "merge-review",
      label: localize(locale, "fixture branch conflict", "фикстура конфликта ветвей"),
    },
  ];

  return (
    <div className="lineage-graph">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        minZoom={0.2}
        nodesDraggable={false}
        nodesConnectable={false}
        zoomOnScroll={false}
        preventScrolling={false}
      >
        <Background color="var(--graph-grid)" gap={18} />
        <MiniMap pannable zoomable />
        <Controls />
      </ReactFlow>
    </div>
  );
}
