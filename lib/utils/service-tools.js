const nunjucks = require('../nunjucks');

module.exports = function (
    {
        defaultParamsBuilder = () => ({}),
        defaultContextBuilder = req => cloneDeep(req.session && req.session.context ? req.session.context : {})
    } = {}
) {
    async function runService(actionClass, { context = {}, params = {} }) {
        try {
            return await new actionClass({
                context
            }).run(params);
        } catch (error) {
            throw error;
        }
    }

    function makeServiceRunner({
        action  : actionClass,
        params  : paramsBuilder = defaultParamsBuilder,
        context : contexBuilder = defaultContextBuilder,
        options : {}
    }) {
        return async function serviceRunner(req, res) {
            return renderPromise({
                res,
                req,
                options,
                promise : runService(actionClass, {
                    params  : await paramsBuilder(req, res),
                    context : await contexBuilder(req, res)
                }),
            });
        };
    }

    async function renderPromise(params) {
        const { req, res, promise, options = {} } = params;
        const result = await promise;
        const renderer = options.template ? renderAsHTML : renderAsJson;

        return renderer.call(null, res, res, result, options);
    }

    async function renderAsJson(req, res, result) {
        try {
            result.status = 1;

            res.send(result);
        } catch (error) {
            res.send({
                status : 0,
                error  : {
                    message : 'Please, contact your system administrator!'
                }
            });
        }
    }

    async function renderAsHTML(req, res, result, { template : templateFile }) {
        try {
            const html = nunjucks.render(templateFile, {
                ...result,
                errors   : req.session.errors || [],
                messages : req.session.messages || []
            });

            delete req.session.errors;
            delete req.session.messages;

            res.send(html);
        } catch (e) {
            console.log(e);
            res.send('<h1>Error!</h1>');
        }
    }

    return {
        makeServiceRunner,
        runService,
        renderPromise,
        renderAsJson,
        renderAsHTML
    };
}

function cloneDeep(data) {
    return JSON.parse(JSON.stringify(data));
}
