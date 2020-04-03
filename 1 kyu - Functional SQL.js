class Query {
    constructor() {
        this.call = {};
        this.data = [];
        this.args = [];
    }

    select(opt) {
        if (this.call.SELECT) throw new Error('Duplicate SELECT')
        this.selectOpt = opt;
        this.call.SELECT = true;
        return this;
    }

    from(data, mult) {
        if (this.call.FROM) throw new Error('Duplicate FROM')

        this.data = data;

        if (mult) {
            let temp = [];
            for (let i = 0; i < data.length; i += 1) {
                const el = data[i];
                for (let j = 0; j < mult.length; j += 1) {
                    const el2 = mult[j];
                    temp.push([el, el2]);
                }
            }
            this.data = temp;
        }
        this.call.FROM = true;

        return this;
    }

    where(...props) {
        if (!this.whereProps) {
            this.whereProps = props;
        } else if (!this.orWhereProps) {
            this.orWhereProps = props;
        } else {
            this.orWhereProps = this.orWhereProps.concat(props);
        }
        return this;
    }

    groupBy(...props) {
        if (this.call.GROUPBY) throw new Error('Duplicate GROUPBY')
        this.groupByProps = props;
        this.call.GROUPBY = true;
        return this;
    }

    orderBy(prop) {
        if (this.call.ORDERBY) throw new Error('Duplicate ORDERBY')
        this.orderByProps = prop;
        this.call.ORDERBY = true;
        return this;
    }

    having(prop) {
        this.args.push(prop);
        return this;
    }

    execute() {
        let resultData = this.data.slice();

        if (this.whereProps && this.whereProps.length) {
            resultData = resultData.filter(e => this.whereProps.some(prop => prop(e)));
        }
        if (this.orWhereProps && this.orWhereProps.length) {
            resultData = resultData.filter(e => this.orWhereProps.every(prop => prop(e)));
        }
        if (this.groupByProps && this.groupByProps.length) {
            resultData = groupBy(resultData, this.groupByProps.slice());
        }
        if (this.args && this.args.length) {
            resultData = resultData.filter(e => this.args.every(arg => arg(e)));
        }
        if (typeof this.selectOpt === 'function') {
            resultData = resultData.map(this.selectOpt);
        }
        if (typeof this.orderByProps === 'function') {
            resultData = resultData.sort(this.orderByProps);
        }

        return resultData;
    }
}

function groupBy(data, groupByProps) {

    if (!groupByProps.length) return data

    const prop = groupByProps.shift();
    const types = {};

    const group = data.reduce((acc, el) => {
        const key = prop(el);
        acc[key] = acc[key] || [];
        acc[key].push(el);
        types[key] = typeof key;
        return acc;
    }, {});

    return Object.entries(group).map(([key, value]) => {
        if (types[key] === 'number') key = Number(key)
        return [key, groupBy(value, groupByProps.slice())];
    });
}

const query = () => new Query();