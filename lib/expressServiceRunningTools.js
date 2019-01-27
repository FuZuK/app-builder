const nunjucks = require('./nunjucks');
const fs = require('fs');
const path = require('path');

module.exports = function (
    /* istanbul ignore next */
    {
        defaultParamsBuilder = () => ({}),
        defaultContextBuilder = req => cloneDeep(req.session && req.session.context ? req.session.context : {})
    } = {}
) {    /* istanbul ignore next */
    async function runService(actionClass, { context = {}, params = {} }) {
        try {
            return await new actionClass({
                context
            }).run(params);
        } catch (error) {
            throw error;
        }
    }

    function makeServiceRunner(
        actionClass, /* istanbul ignore next */
        paramsBuilder = defaultParamsBuilder,
        contexBuilder = defaultContextBuilder,
        templateFile = null
    ) {
        return async function serviceRunner(req, res) {
            const resultPromise = runService(actionClass, {
                params  : paramsBuilder(req, res),
                context : await contexBuilder(req, res)
            });

            if (templateFile) {
                return renderPromiseAsHTML(res, req, resultPromise, templateFile);
            } else {
                return renderPromiseAsJson(req, res, resultPromise);
            }

        };
    }

    async function renderPromiseAsJson(req, res, promise) {
        try {
            const result = await promise;
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

    async function renderPromiseAsHTML(req, res, promise, templateFile) {
        try {
            const result = await promise;
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
        renderPromiseAsJson,
        renderPromiseAsHTML
    };
}

function cloneDeep(data) {
    return JSON.parse(JSON.stringify(data));
}
