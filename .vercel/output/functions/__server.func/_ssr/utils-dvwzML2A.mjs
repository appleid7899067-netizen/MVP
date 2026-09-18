import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-dvwzML2A.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function uid() {
	return crypto.randomUUID();
}
function formatBytes(n) {
	if (n < 1024) return `${n} B`;
	if (n < 1048576) return `${(n / 1024).toFixed(1)} KB`;
	return `${(n / 1048576).toFixed(1)} MB`;
}
function formatClock(iso) {
	return new Date(iso).toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit"
	});
}
function formatStamp(iso) {
	const d = new Date(iso);
	const pad = (x) => String(x).padStart(2, "0");
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}
function relativeDay(iso) {
	const d = new Date(iso);
	const now = /* @__PURE__ */ new Date();
	const start = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
	const diff = (start(now) - start(d)) / 864e5;
	if (diff === 0) return "Today";
	if (diff === 1) return "Yesterday";
	if (diff < 7) return "This week";
	return "Earlier";
}
function byteLen(s) {
	return new TextEncoder().encode(s).length;
}
function sleep(ms) {
	return new Promise((r) => setTimeout(r, ms));
}
//#endregion
export { formatStamp as a, uid as c, formatClock as i, cn as n, relativeDay as o, formatBytes as r, sleep as s, byteLen as t };
