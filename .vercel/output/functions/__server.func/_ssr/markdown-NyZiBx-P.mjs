import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as cn } from "./utils-dvwzML2A.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/markdown-NyZiBx-P.js
var import_jsx_runtime = require_jsx_runtime();
function inline(text, keyPrefix) {
	const nodes = [];
	const re = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
	let last = 0;
	let m;
	let i = 0;
	while (m = re.exec(text)) {
		if (m.index > last) nodes.push(text.slice(last, m.index));
		const tok = m[0];
		if (tok.startsWith("**")) nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
			className: "font-medium text-fg",
			children: tok.slice(2, -2)
		}, `${keyPrefix}-b${i++}`));
		else if (tok.startsWith("`")) nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
			className: "rounded-xs bg-elevated px-1 py-0.5 font-mono text-[0.85em] text-primary",
			children: tok.slice(1, -1)
		}, `${keyPrefix}-c${i++}`));
		else nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
			className: "italic",
			children: tok.slice(1, -1)
		}, `${keyPrefix}-i${i++}`));
		last = m.index + tok.length;
	}
	if (last < text.length) nodes.push(text.slice(last));
	return nodes;
}
function isTableRow(line) {
	return line.trim().startsWith("|") && line.trim().endsWith("|");
}
function cells(line) {
	return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
}
function Markdown({ source, className }) {
	const lines = source.replace(/\r\n/g, "\n").split("\n");
	const blocks = [];
	let i = 0;
	let k = 0;
	while (i < lines.length) {
		const line = lines[i];
		if (line.startsWith("```")) {
			const buf = [];
			i += 1;
			while (i < lines.length && !lines[i].startsWith("```")) {
				buf.push(lines[i]);
				i += 1;
			}
			i += 1;
			blocks.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "my-3 overflow-x-auto rounded-md bg-bg p-3 font-mono text-xs leading-relaxed text-fg",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: buf.join("\n") })
			}, `p${k++}`));
			continue;
		}
		if (isTableRow(line)) {
			const rows = [cells(line)];
			i += 1;
			if (i < lines.length && isTableRow(lines[i])) i += 1;
			while (i < lines.length && isTableRow(lines[i])) {
				rows.push(cells(lines[i]));
				i += 1;
			}
			const head = rows[0];
			const body = rows.slice(1);
			blocks.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "my-3 overflow-x-auto rounded-md shadow-[var(--shadow-border)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-xl border-collapse text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-elevated text-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: head.map((c, ci) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 font-medium",
							children: inline(c, `th${k}${ci}`)
						}, ci)) })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: body.map((r, ri) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
						className: "border-t border-border",
						children: r.map((c, ci) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 align-top text-fg",
							children: inline(c, `td${k}${ri}${ci}`)
						}, ci))
					}, ri)) })]
				})
			}, `t${k++}`));
			continue;
		}
		if (line.trim() === "") {
			i += 1;
			continue;
		}
		if (/^[-*] /.test(line)) {
			const items = [];
			while (i < lines.length && /^[-*] /.test(lines[i])) {
				items.push(lines[i].replace(/^[-*] /, ""));
				i += 1;
			}
			blocks.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "my-2 list-disc space-y-1 pl-5 text-sm text-fg",
				children: items.map((it, ii) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: inline(it, `li${k}${ii}`) }, ii))
			}, `u${k++}`));
			continue;
		}
		if (/^\d+\. /.test(line)) {
			const items = [];
			while (i < lines.length && /^\d+\. /.test(lines[i])) {
				items.push(lines[i].replace(/^\d+\. /, ""));
				i += 1;
			}
			blocks.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "my-2 list-decimal space-y-1 pl-5 text-sm text-fg",
				children: items.map((it, ii) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: inline(it, `ol${k}${ii}`) }, ii))
			}, `o${k++}`));
			continue;
		}
		const hm = /^(#{1,3})\s+(.*)$/.exec(line);
		if (hm) {
			const level = hm[1].length;
			const Tag = level === 1 ? "h1" : level === 2 ? "h2" : "h3";
			const cls = level === 1 ? "mt-4 mb-2 text-lg font-medium tracking-tight" : level === 2 ? "mt-4 mb-1.5 text-base font-medium" : "mt-3 mb-1 text-sm font-medium text-muted";
			blocks.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				className: cls,
				children: inline(hm[2], `h${k}`)
			}, `h${k++}`));
			i += 1;
			continue;
		}
		const para = [line];
		i += 1;
		while (i < lines.length && lines[i].trim() && !lines[i].startsWith("#") && !lines[i].startsWith("```") && !isTableRow(lines[i]) && !/^[-*] /.test(lines[i])) {
			para.push(lines[i]);
			i += 1;
		}
		blocks.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "my-2 text-sm leading-relaxed text-fg",
			children: inline(para.join(" "), `p${k}`)
		}, `s${k++}`));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("md min-w-0", className),
		children: blocks
	});
}
//#endregion
export { Markdown as t };
