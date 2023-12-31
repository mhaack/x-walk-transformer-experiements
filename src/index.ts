import setupCtx from './context';
import handleRequest from './handler';
import { isErrorWithResponse, errorResponse, noCacheResponseInit, ErrorWithResponse } from './util';

import type { Context, Environment } from './types';

const handler: ExportedHandler = {
	async fetch(request: Request, env: Partial<Environment>) {
		let resp: Response | undefined;
		let ctx: Context;

		try {
			ctx = setupCtx(request, env);
			resp = await handleRequest(request, ctx);
		} catch (e) {
			const err = e as Error | ErrorWithResponse;
			if (isErrorWithResponse(err)) {
				resp = err.response;
			} else {
				console.error('[index] fatal error: ', e);
				resp = errorResponse(500, err.message, 'internal error');
			}
		}

		if (resp) {
			resp = new Response(resp.body, resp);
		} else {
			resp = new Response(null, noCacheResponseInit(404));
		}
		return resp;
	},
};

export default handler;