import { admissionFlow } from "@/lib/haven-data";

export function FlowRail() {
  return (
    <ol className="flow-rail">
      {admissionFlow.map((step) => (
        <li key={step.label}>
          <span>{step.label}</span>
          <p>{step.description}</p>
        </li>
      ))}
    </ol>
  );
}

