import LogoCloud from '../handler/logo-cloud';
import Remover from '../handler/remover';
import RemoveInner from '../handler/removeInner';
import type { Route } from '../types';

const Content: Route = async (req, ctx) => {
	const { log, env } = ctx;
	log.debug('[AEM Content] handle GET: ', ctx.url.pathname);

	const upstream = `${env.CONTENT_UPSTREAM}${ctx.url.pathname}${ctx.url.search}`;
	log.debug('[AEM Content] upstream: ', upstream);

	const resp = await fetch(upstream);

	return new HTMLRewriter()
		.on('head', new RemoveInner(ctx))
		.on('script', new Remover(ctx))
		.on('header', new RemoveInner(ctx))
    .on('logo-cloud', new LogoCloud(ctx))
    .on('.footer.experiencefragment', new RemoveInner(ctx))
    .on('.cloudservice.testandtarget', new Remover(ctx))
		.transform(resp);
};

export default Content;
