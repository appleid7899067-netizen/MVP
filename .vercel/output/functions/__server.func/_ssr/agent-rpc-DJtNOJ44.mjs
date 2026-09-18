import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/agent-rpc-DJtNOJ44.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var runAgent = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("bf3fe5199edff6931d1bab9bc6e8d95b30174e6ba73866b9cdd8fe8c756e6906"));
//#endregion
export { runAgent as t };
