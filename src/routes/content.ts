// import LogoCloud from '../handler/logo-cloud';
// import Remover from '../handler/remover';
// import RemoveInner from '../handler/removeInner';
import type { Route } from '../types';
import { decodeHtmlEntity } from '../util/encoding';

import * as cheerio from 'cheerio';

const Content: Route = async (req, ctx) => {
	const { log, env } = ctx;
	log.debug('[AEM Content] handle GET: ', ctx.url.pathname);

	const upstream = `${env.CONTENT_UPSTREAM}${ctx.url.pathname}${ctx.url.search}`;
	log.debug('[AEM Content] upstream: ', upstream);

	// const resp = await fetch(upstream);

	const respHtml = await (await fetch(upstream)).text();
	const $ = cheerio.load(respHtml);

	$('head').empty();
	$('header').empty();
	$('script').remove();
	$('.footer.experiencefragment').empty();
	$('.cloudservice.testandtarget').remove();

	const logoElem = $('logo-cloud');
	const {bgcolor, imagebgcolor, logos: logoData} = logoElem.attr();
	const logoJson = JSON.parse(decodeHtmlEntity(logoData));
	const logoSection = logoJson.map((logo) => {
		return `<li><a href="${logo.imageLink}"><img src="${logo.image}" alt="${logo.imageAlt}"/></a></li>`
	}).join(' ');

    logoElem.replaceWith($(`<ul>${logoSection}</ul>`))

	return new Response($.html(), {status: 200, headers: {
		'Content-type': 'text/html'
	}})

	// return new HTMLRewriter()
	// 	.on('head', new RemoveInner(ctx))
	// 	.on('script', new Remover(ctx))
	// 	.on('header', new RemoveInner(ctx))
    // .on('logo-cloud', new LogoCloud(ctx))
    // .on('.footer.experiencefragment', new RemoveInner(ctx))
    // .on('.cloudservice.testandtarget', new Remover(ctx))
	// 	.transform(resp);
};

export default Content;
