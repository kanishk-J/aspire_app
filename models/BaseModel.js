const _ = require('lodash');
const util = require('../services/util');
const db = require('../services/database');

class BaseModel {
    spec;
    table;

    async insert(builder, trx = null) {
        this.#serialize(builder);
        this.#validateAllAttrs(builder);
        const query = db(this.table).insert(builder);
        if (trx) {
            query.transacting(trx);
        }
        const [id] = await query;
        return id;
    }

    async insertMany(builders, trx = null) {
        for (const builder of builders) {
            this.#serialize(builder);
            this.#validateAllAttrs(builder);
        }
        const query = db(this.table).insert(builders);
        if(trx) {
            query.transacting(trx);
        }
        const result = await query;
        return result;
    }

    async update(builder, trx = null) {
        if (!builder.id) {
            throw Error('Id is required for this operation');
        }
        this.#serialize(builder);
        this.#validateAttrs(builder);
        const query = db(this.table).update(builder).where('id', builder.id);
        if (trx) {
            query.transacting(trx);
        }
        await query;
    }

    async get(identifier, trx = null) {
        const query = db(this.table)
            .where(identifier);
        if (trx) query.transacting(trx);
        const result = await query;
        if (!result.length) throw Error("Resource not found");
        return result;
    }

    async getOne(identifier, trx = null) {
        const query = db(this.table)
            .where(identifier)
            .first();
        if (trx) query.transacting(trx);
        const result = await query;
        if (!result) throw Error("Resource not found");
        return result;
    }

    #serialize(builder) {
        return _.omitBy(builder, _.isUndefined);
    }

    #validateAllAttrs(attrs) {
        if (!this.spec) { return attrs; };
        for (const key in this.spec) {
            this.#validateAttr(attrs, key);
        }
    }

    #validateAttrs(attrs) {
        if (!this.spec) { return attrs; }
        for (const key in attrs) {
            this.#validateAttr(attrs, key);
        }
    }

#validateAttr(attrs, key) {
        if (this.spec[key].required && _.isNil(attrs[key])) {
            throw Error(`${key} is required in ${this.constructor.name}`);
        }
        if (!_.isNil(attrs[key]) && !util.isValidType(attrs[key], this.spec[key].type)) {
            throw Error(`${attrs[key]} is invalid data type '${typeof attrs[key]}' for '${key}' in ${this.constructor.name}`);
        }
    }
}

module.exports = BaseModel;
