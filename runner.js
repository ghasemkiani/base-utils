//	@ghasemkiani/base-utils/runner

const {cutil} = require("@ghasemkiani/base/cutil");

const IDLE = new String("idle");
const STARTED = new String("started");
const PAUSED = new String("paused");
const STOPPED = new String("stopped");

const irunner = {
	_state: IDLE,
	get state() {
		return cutil.asString(this._state);
	},
	set state(state) {
		if (this._state !== state) {
			let event = {
				defaultPrevented: false,
				target: this,
				oldState: cutil.asString(this._state),
				state: cutil.asString(state),
				preventDefault() {
					this.defaultPrevented = true;
				},
			};
			this.emit("state-change", event);
			if (!event.defaultPrevented) {
				this._state = state;
			}
		}
	},
	async toRun() {},
	async toStart() {
		if (this._state === IDLE) {
			this.state = STARTED;
			await this.toDoStart();
		}
		return this;
	},
	async toDoStart() {
		await this.toRun();
	},
	run() {},
	start() {
		if (this._state === IDLE) {
			this.state = STARTED;
			this.doStart();
		}
		return this;
	},
	doStart() {
		this.run();
	},
	pause() {
		if (this._state === STARTED) {
			this.state = PAUSED;
		}
		return this;
	},
	resume() {
		if (this._state === PAUSED) {
			this.state = STARTED;
		}
		return this;
	},
	togglePause() {
		if (this._state === STARTED) {
			this.state = PAUSED;
		} else if (this._state === PAUSED) {
			this.state = STARTED;
		}
		return this;
	},
	stop() {
		this.state = STOPPED;
		return this;
	},
	reset() {
		if (!this.isRunning()) {
			this.state = IDLE;
		}
		return this;
	},
	isIdle() {
		return this._state === IDLE;
	},
	isStarted() {
		return this._state === STARTED;
	},
	isPaused() {
		return this._state === PAUSED;
	},
	isStopped() {
		return this._state === STOPPED;
	},
	isRunning() {
		return this.isStarted() || this.isPaused();
	},
	checkRunning() {
		if (!this.isRunning()) {
			throw new Error("Interrupted");
		}
		return !this.isPaused();
	},
};

module.exports = {irunner};
