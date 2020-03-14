//	@ghasemkiani/base-utils/pubsub

const {cutil} = require("@ghasemkiani/commonbase/cutil");

const pubsub = {
	_lsnrs: null,
	get lsnrs() {
		if(!this._lsnrs) {
			this._lsnrs = {};
		}
		return this._lsnrs;
	},
	set lsnrs(lsnrs) {
		this._lsnrs = lsnrs;
	},

	sub(type, listener, first) {
		type = cutil.asString(type);
		if(!this.lsnrs[type]) {
			this.lsnrs[type] = [];
		}
		if(this.lsnrs[type].indexOf(listener) < 0) {
			this.lsnrs[type][first ? "unshift" : "push"](listener);
		}
		return this;
	},
	unsub(type, listener) {
		type = cutil.asString(type);
		if(this.lsnrs[type]) {
			var index = this.lsnrs[type].indexOf(listener);
			if(index >= 0) {
				this.lsnrs[type].splice(index, 1);
			}
		}
		return this;
	},
	unsubType(type) {
		type = cutil.asString(type);
		if(this.lsnrs[type]) {
			this.lsnrs[type].length = 0;
		}
		return this;
	},
	unsubAll() {
		for(let type of Object.keys(this.lsnrs)) {
			this.unsubType(type);
		};
		return this;
	},
	pub(type, ...rest) {
		type = cutil.asString(type);
		if(this.lsnrs[type]) {
			for(let listener of this.lsnrs[type]) {
				listener.call(this, ...rest);
			};
		}
		var methodName = cutil.toCamelCase("on-" + cutil.asString(type).replace(/\./g, "-"));
		if(methodName in this && typeof this[methodName] === "function") {
			this[methodName].call(this, ...rest);
		}
		return this;
	},
};

module.exports = {pubsub};
