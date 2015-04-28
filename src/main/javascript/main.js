var vertx = require('vertx');
var container = require('vertx/container');
var console = require('vertx/console');

var tv4 = require('tv4-v1.1.9');

var config = container.config;
var eb = vertx.eventBus;

//console.log('config is ' + JSON.stringify(config));

var schemas = {};

// add pre-defined json schemas
if (config.hasOwnProperty('schemas')) {
    Object.keys(config.schemas).forEach(function (item) {
        var schema = config.schemas[item];
        
        if (schema.hasOwnProperty('key') && schema.hasOwnProperty('schema')) {
            schemas[schema.key] = schema.schema;
            console.log('addSchema ' + schema.key);
            tv4.addSchema("vertxjsonschema://" + schema.key, schema.schema);
        } else {
            throw "config ist wrong. schema should have a key and a schema."
        }
    });
}

var jsonSchemaValidator = function (message, replier) {
    //console.log('json-schema-validator ' + JSON.stringify(message, null, 2));

    function validate(msg) {
        console.log('validate');

        var reply = {"status": "ok"};

        if (!msg.hasOwnProperty('key')) {
            reply = {"status": "error", "error": "MISSING_SCHEMA_KEY"};
        } else if (!msg.hasOwnProperty('json')) {
            reply = {"status": "error", "error": "MISSING_JSON"};
        } else {
            if (!schemas.hasOwnProperty(msg.key)) {
                reply = {"status": "error", "error": "INVALID_SCHEMA_KEY"};
            } else {

                var json = msg.json;

                if (json === null) {
                    reply = {"status": "error", "error": "INVALID_JSON"};
                } else {
                    var validationResult = tv4.validateResult(json, schemas[msg.key]);

                    if (validationResult.missing.length > 0) {
                        reply = {"status": "error", "error": "VALIDATION_PROCESS_ERROR"}
                    } else if (!validationResult.valid) {
                        reply = {"status": "error", "error": "VALIDATION_ERROR", "report": validationResult.error};
                    }
                }
            }
        }

        //console.log('json-schema-validator-reply ' + JSON.stringify(reply, null, 2));

        replier(reply);
    }

    function schemaKeys() {
        var keys = Object.keys(schemas);

        console.log('schemaKeys ' + JSON.stringify(keys));

        replier({"status": "ok", "schemas": keys});
    }

    function addSchema(msg) {
        console.log('addSchema ' + msg.key);

        var reply = {"status": "ok"};

        if (!msg.hasOwnProperty('key')) {
            reply = {"status": "error", "error": "MISSING_SCHEMA_KEY"};
        } else if (!msg.hasOwnProperty('jsonSchema')) {
            reply = {"status": "error", "error": "MISSING_JSON"};
        } else {
            if (schemas.hasOwnProperty(msg.key)) {
                reply = {"status": "error", "error": "EXISTING_SCHEMA_KEY"};
            }

            var jsonSchema = msg.jsonSchema;

            if (jsonSchema === null) {
                reply = {"status": "error", "error": "INVALID_SCHEMA"};
            } else {
                schemas[msg.key] = msg.jsonSchema;
                tv4.addSchema("vertxjsonschema://" + msg.key, msg.jsonSchema);
            }
        }

        replier(reply);
    }

    switch (message.action) {
        case 'validate':
            validate(message);
            break;
        case 'getSchemaKeys':
            schemaKeys();
            break;
        case 'addSchema':
            addSchema(message);
            break;
        default:
            console.log('gehen sie zuhause!');
            break;
    }
}

eb.registerHandler('campudus.jsonvalidator', jsonSchemaValidator);