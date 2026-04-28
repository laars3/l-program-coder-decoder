export type VariableRef =
  | { kind: "Y" }
  | { kind: "Z"; index: number }
  | { kind: "X"; index: number };

export type StatementType = "dummy" | "increment" | "decrement" | "Goto";

export type Instruction = {
  label?: string;
  variable: VariableRef;
  statementType: StatementType;
  targetLabel?: string;
};
