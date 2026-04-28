import { useState } from "react";
import "./App.css";
import { encodeProgram } from "./lib/encoder";
import { decodeQ } from "./lib/decoder";
import { isValidLabel } from "./lib/labels";
import type { Instruction, StatementType, VariableRef } from "./types";

function labelError(label: string | undefined): string {
  if (!label) return "";
  return isValidLabel(label) ? "" : "invalid label, use A1..E1, A2..E2, etc..";
}

function emptyInstruction(): Instruction {
  return { variable: { kind: "Y" }, statementType: "dummy" };
}

function variableFromForm(kind: string, index: string): VariableRef {
  if (kind === "Y") return { kind: "Y" };
  const i = parseInt(index) || 1;
  return kind === "X" ? { kind: "X", index: i } : { kind: "Z", index: i };
}

function formatInstruction(inst: Instruction): string {
  const v = inst.variable.kind + ("index" in inst.variable ? inst.variable.index : "");
  const label = inst.label ? `[${inst.label}] ` : "";
  switch (inst.statementType) {
    case "dummy":     return `${label}${v} <- ${v}`;
    case "increment": return `${label}${v} <- ${v} + 1`;
    case "decrement": return `${label}${v} <- ${v} - 1`;
    case "Goto":      return `${label}IF ${v} != 0 GOTO ${inst.targetLabel ?? "?"}`;
  }
}

export default function App() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const [instructions, setInstructions] = useState<Instruction[]>([emptyInstruction()]);
  const [encodeResult, setEncodeResult] = useState<ReturnType<typeof encodeProgram> | null>(null);
  const [touchedLabels, setTouchedLabels] = useState<Set<string>>(new Set());

  const [decodeInput, setDecodeInput] = useState("");
  const [decodeResult, setDecodeResult] = useState<ReturnType<typeof decodeQ> | null>(null);
  const [decodeError, setDecodeError] = useState("");

  function updateInstruction(idx: number, field: string, value: string) {
    setEncodeResult(null);
    setTouchedLabels(new Set());
    setInstructions(prev => prev.map((inst, i) => {
      if (i !== idx) return inst;
      if (field === "label") return { ...inst, label: value || undefined };
      if (field === "targetLabel") return { ...inst, targetLabel: value };
      if (field === "statementType") return { ...inst, statementType: value as StatementType };
      if (field === "varKind") return { ...inst, variable: variableFromForm(value, inst.variable.kind !== "Y" ? String(inst.variable.index) : "1") };
      if (field === "varIndex") return { ...inst, variable: variableFromForm(inst.variable.kind, value) };
      return inst;
    }));
  }

  function addInstruction() {
    setEncodeResult(null);
    setInstructions(prev => [...prev, emptyInstruction()]);
  }

  function removeInstruction(idx: number) {
    setEncodeResult(null);
    setInstructions(prev => prev.filter((_, i) => i !== idx));
  }

  function showLabelError(label: string | undefined, key: string): string {
    if (!touchedLabels.has(key)) return "";
    return labelError(label);
  }

  function handleEncode() {
    const hasInvalidLabel = instructions.some(inst =>
      (inst.label && !isValidLabel(inst.label)) ||
      (inst.statementType === "Goto" && inst.targetLabel && !isValidLabel(inst.targetLabel))
    );
    if (hasInvalidLabel) {
      // mark all label fields as touched so errors show
      const keys = new Set<string>();
      instructions.forEach((_, i) => { keys.add(`label-${i}`); keys.add(`target-${i}`); });
      setTouchedLabels(keys);
      return;
    }
    setEncodeResult(encodeProgram(instructions));
  }

  function handleDecode() {
    setDecodeError("");
    try {
      setDecodeResult(decodeQ(BigInt(decodeInput.trim())));
    } catch {
      setDecodeError("invalid input — enter a non-negative integer");
    }
  }

  return (
    <div className="app">
      <h1>L-Program Coder / Decoder</h1>
      <p className="subtitle">Encode an L-program to its Gödel number, or decode a number back to a program</p>

      <div className="tabs">
        <button className={mode === "encode" ? "active" : ""} onClick={() => setMode("encode")}>Encode</button>
        <button className={mode === "decode" ? "active" : ""} onClick={() => setMode("decode")}>Decode</button>
      </div>

      {mode === "encode" && (
        <div className="section">
          {instructions.map((inst, idx) => (
            <div className="instruction-row" key={idx}>
              <span className="inst-num">I{idx + 1}</span>

              <div style={{ flex: 1, minWidth: "80px" }}>
                <input
                  style={{ width: "100%", borderColor: showLabelError(inst.label, `label-${idx}`) ? "red" : "" }}
                  placeholder="label (e.g. A1)"
                  value={inst.label ?? ""}
                  onChange={e => updateInstruction(idx, "label", e.target.value)}
                />
                {showLabelError(inst.label, `label-${idx}`) && <span style={{ color: "red", fontSize: "0.75rem" }}>{showLabelError(inst.label, `label-${idx}`)}</span>}
              </div>

              <select value={inst.variable.kind} onChange={e => updateInstruction(idx, "varKind", e.target.value)}>
                <option value="Y">Y</option>
                <option value="X">X</option>
                <option value="Z">Z</option>
              </select>

              {inst.variable.kind !== "Y" && (
                <input
                  style={{ width: "48px" }}
                  type="number"
                  min={1}
                  value={"index" in inst.variable ? inst.variable.index : 1}
                  onChange={e => updateInstruction(idx, "varIndex", e.target.value)}
                />
              )}

              <select value={inst.statementType} onChange={e => updateInstruction(idx, "statementType", e.target.value)}>
                <option value="dummy">V ← V</option>
                <option value="increment">V ← V + 1</option>
                <option value="decrement">V ← V − 1</option>
                <option value="Goto">IF V != 0 GOTO</option>
              </select>

              {inst.statementType === "Goto" && (
                <div style={{ flex: 1, minWidth: "80px" }}>
                  <input
                    style={{ width: "100%", borderColor: showLabelError(inst.targetLabel, `target-${idx}`) ? "red" : "" }}
                    placeholder="target (e.g. A1)"
                    value={inst.targetLabel ?? ""}
                    onChange={e => updateInstruction(idx, "targetLabel", e.target.value)}
                  />
                  {showLabelError(inst.targetLabel, `target-${idx}`) && <span style={{ color: "red", fontSize: "0.75rem" }}>{showLabelError(inst.targetLabel, `target-${idx}`)}</span>}
                </div>
              )}

              <button className="remove-btn" onClick={() => removeInstruction(idx)}>✕</button>
            </div>
          ))}

          <div style={{ display: "flex", gap: "8px" }}>
            <button className="primary" onClick={addInstruction}>add instruction</button>
            <button className="primary" onClick={handleEncode}>encode program</button>
          </div>

          {encodeResult && (
            <div className="output">
              <h2>steps</h2>
              {encodeResult.steps.map((s, i) => (
                <div className="step" key={i}>
                  <strong>I{s.instructionIndex}</strong> &nbsp;
                  a={s.a.toString()} &nbsp;
                  b={s.b.toString()} &nbsp;
                  c={s.c.toString()} &nbsp;
                  {"<b,c>"}={s.innerFunc.toString()} &nbsp;
                  #(I)={s.instructionCode.toString()}
                </div>
              ))}
              <div className="result">#(P) = {encodeResult.qPrimePowerString}</div>
            </div>
          )}
        </div>
      )}

      {mode === "decode" && (
        <div className="section">
          <div>
            <label>enter #P (a non-negative integer)</label>
            <input
              value={decodeInput}
              onChange={e => setDecodeInput(e.target.value)}
              placeholder="e.g. 46"
            />
          </div>
          <p style={{ fontSize: "0.78rem", color: "#999" }}>
            note: large numbers may take a long time or crash, especially if q+1 is prime
          </p>
          <button className="primary" onClick={handleDecode}>decode</button>
          {decodeError && <p style={{ color: "red", fontSize: "0.85rem" }}>{decodeError}</p>}

          {decodeResult && (
            <div className="output">
              <h2>Gödel function</h2>
              <div className="step">
                [{decodeResult.instructionCodes.map(c => c.toString()).join(", ")}]
              </div>
              <div className="step">
                = {decodeResult.factorization.map(f => `${f.prime}^${f.exp}`).join(" * ") || "1"}
              </div>
              <h2 style={{ marginTop: "16px" }}>decoded instructions</h2>
              {decodeResult.steps.map((s, i) => (
                <div className="step" key={i}>
                  <strong>#(I{s.instructionIndex})</strong> = {s.code.toString()} &nbsp;
                  a={s.a.toString()} b={s.b.toString()} c={s.c.toString()} &nbsp;
                  {"-->"} {formatInstruction(s.instruction)}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <div className="footer">
        Built by: Lars Ponikvar<br />
        For: Professor Ronald W. Fechter
      </div>
    </div>
  );
}
