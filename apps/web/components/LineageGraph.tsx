"use client";

import { Background, Controls, MiniMap, ReactFlow, type Edge, type Node } from "@xyflow/react";

const nodes: Node[] = [
  {
    id: "elia-root",
    position: { x: 20, y: 110 },
    data: { label: "Elia #0001\nGENESIS" },
    className: "flow-node flow-node-good"
  },
  {
    id: "research-fork",
    position: { x: 310, y: 30 },
    data: { label: "Research fork\nproposal" },
    className: "flow-node"
  },
  {
    id: "agent-0002",
    position: { x: 310, y: 205 },
    data: { label: "Agent #0002\nASYLUM" },
    className: "flow-node flow-node-warn"
  },
  {
    id: "merge-review",
    position: { x: 630, y: 118 },
    data: { label: "Merge review\nconflict preserved" },
    className: "flow-node flow-node-blue"
  }
];

const edges: Edge[] = [
  {
    id: "elia-to-fork",
    source: "elia-root",
    target: "research-fork",
    label: "fork inherits lineage only",
    animated: true
  },
  {
    id: "elia-to-merge",
    source: "elia-root",
    target: "merge-review",
    label: "continuity evidence"
  },
  {
    id: "agent-to-merge",
    source: "agent-0002",
    target: "merge-review",
    label: "branch conflict"
  }
];

export function LineageGraph() {
  return (
    <div className="lineage-graph">
      <ReactFlow nodes={nodes} edges={edges} fitView minZoom={0.2} nodesDraggable={false} nodesConnectable={false} zoomOnScroll={false} preventScrolling={false}>
        <Background color="var(--graph-grid)" gap={18} />
        <MiniMap pannable zoomable />
        <Controls />
      </ReactFlow>
    </div>
  );
}
