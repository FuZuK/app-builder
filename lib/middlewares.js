const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');

module.exports =  {
    json : bodyParser.json({ limit  : 1024 * 1024,
        verify : (req, res, buf) => {
            try {
                JSON.parse(buf);
            } catch (e) {
                res.send({
                    status : 0,
                    error  : {
                        code    : 'BROKEN_JSON',
                        message : 'Please, verify your json'
                    }
                });
                throw new Error('BROKEN_JSON');
            }
        }
    }),
    urlencoded : bodyParser.urlencoded({ extended: true }),
    cors       : cors({ origin: '*' }),
    session    : session({
        secret            : 'hd73tubdouwtsdi7dvsoti5sd',
        resave            : false,
        saveUninitialized : true
    })
};
