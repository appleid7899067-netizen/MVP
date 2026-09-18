import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

function inline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) {
      nodes.push(
        <strong key={`${keyPrefix}-b${i++}`} className="font-medium text-fg">
          {tok.slice(2, -2)}
        </strong>,
      );
    } else if (tok.startsWith("`")) {
      nodes.push(
        <code
          key={`${keyPrefix}-c${i++}`}
          className="rounded-xs bg-elevated px-1 py-0.5 font-mono text-[0.85em] text-primary"
        >
          {tok.slice(1, -1)}
        </code>,
      );
    } else {
      nodes.push(
        <em key={`${keyPrefix}-i${i++}`} className="italic">
          {tok.slice(1, -1)}
        </em>,
      );
    }
    last = m.index + tok.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function isTableRow(line: string) {
  return line.trim().startsWith("|") && line.trim().endsWith("|");
}

function cells(line: string) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim());
}

export function Markdown({ source, className }: { source: string; className?: string }) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let k = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("```")) {
      const buf: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].startsWith("```")) {
        buf.push(lines[i]);
        i += 1;
      }
      i += 1;
      blocks.push(
        <pre
          key={`p${k++}`}
          className="my-3 overflow-x-auto rounded-md bg-bg p-3 font-mono text-xs leading-relaxed text-fg"
        >
          <code>{buf.join("\n")}</code>
        </pre>,
      );
      continue;
    }
    if (isTableRow(line)) {
      const rows: string[][] = [cells(line)];
      i += 1;
      if (i < lines.length && isTableRow(lines[i])) i += 1;
      while (i < lines.length && isTableRow(lines[i])) {
        rows.push(cells(lines[i]));
        i += 1;
      }
      const head = rows[0];
      const body = rows.slice(1);
      blocks.push(
        <div key={`t${k++}`} className="my-3 overflow-x-auto rounded-md shadow-[var(--shadow-border)]">
          <table className="w-full min-w-xl border-collapse text-left text-sm">
            <thead className="bg-elevated text-muted">
              <tr>
                {head.map((c, ci) => (
                  <th key={ci} className="px-3 py-2 font-medium">
                    {inline(c, `th${k}${ci}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((r, ri) => (
                <tr key={ri} className="border-t border-border">
                  {r.map((c, ci) => (
                    <td key={ci} className="px-3 py-2 align-top text-fg">
                      {inline(c, `td${k}${ri}${ci}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }
    if (line.trim() === "") {
      i += 1;
      continue;
    }
    if (/^[-*] /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*] /.test(lines[i])) {
        items.push(lines[i].replace(/^[-*] /, ""));
        i += 1;
      }
      blocks.push(
        <ul key={`u${k++}`} className="my-2 list-disc space-y-1 pl-5 text-sm text-fg">
          {items.map((it, ii) => (
            <li key={ii}>{inline(it, `li${k}${ii}`)}</li>
          ))}
        </ul>,
      );
      continue;
    }
    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ""));
        i += 1;
      }
      blocks.push(
        <ol key={`o${k++}`} className="my-2 list-decimal space-y-1 pl-5 text-sm text-fg">
          {items.map((it, ii) => (
            <li key={ii}>{inline(it, `ol${k}${ii}`)}</li>
          ))}
        </ol>,
      );
      continue;
    }
    const hm = /^(#{1,3})\s+(.*)$/.exec(line);
    if (hm) {
      const level = hm[1].length;
      const Tag = (level === 1 ? "h1" : level === 2 ? "h2" : "h3") as "h1" | "h2" | "h3";
      const cls =
        level === 1
          ? "mt-4 mb-2 text-lg font-medium tracking-tight"
          : level === 2
            ? "mt-4 mb-1.5 text-base font-medium"
            : "mt-3 mb-1 text-sm font-medium text-muted";
      blocks.push(
        <Tag key={`h${k++}`} className={cls}>
          {inline(hm[2], `h${k}`)}
        </Tag>,
      );
      i += 1;
      continue;
    }
    const para: string[] = [line];
    i += 1;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].startsWith("#") &&
      !lines[i].startsWith("```") &&
      !isTableRow(lines[i]) &&
      !/^[-*] /.test(lines[i])
    ) {
      para.push(lines[i]);
      i += 1;
    }
    blocks.push(
      <p key={`s${k++}`} className="my-2 text-sm leading-relaxed text-fg">
        {inline(para.join(" "), `p${k}`)}
      </p>,
    );
  }
  return <div className={cn("md min-w-0", className)}>{blocks}</div>;
}
