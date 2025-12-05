var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented, "notImplemented");
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass, "notImplementedClass");

// node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
var nodeTiming = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry = class {
  static {
    __name(this, "PerformanceEntry");
  }
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
var PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
  static {
    __name(this, "PerformanceMark");
  }
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
var PerformanceMeasure = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceMeasure");
  }
  entryType = "measure";
};
var PerformanceResourceTiming = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceResourceTiming");
  }
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
var PerformanceObserverEntryList = class {
  static {
    __name(this, "PerformanceObserverEntryList");
  }
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
var Performance = class {
  static {
    __name(this, "Performance");
  }
  __unenv__ = true;
  timeOrigin = _timeOrigin;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw createNotImplementedError("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin) {
      return _performanceNow();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw createNotImplementedError("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
var PerformanceObserver = class {
  static {
    __name(this, "PerformanceObserver");
  }
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw createNotImplementedError("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw createNotImplementedError("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
var performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();

// node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
globalThis.performance = performance;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;

// node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";

// node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default = Object.assign(() => {
}, { __unenv__: true });

// node_modules/unenv/dist/runtime/node/console.mjs
var _console = globalThis.console;
var _ignoreErrors = true;
var _stderr = new Writable();
var _stdout = new Writable();
var log = _console?.log ?? noop_default;
var info = _console?.info ?? log;
var trace = _console?.trace ?? info;
var debug = _console?.debug ?? log;
var table = _console?.table ?? log;
var error = _console?.error ?? log;
var warn = _console?.warn ?? error;
var createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
var clear = _console?.clear ?? noop_default;
var count = _console?.count ?? noop_default;
var countReset = _console?.countReset ?? noop_default;
var dir = _console?.dir ?? noop_default;
var dirxml = _console?.dirxml ?? noop_default;
var group = _console?.group ?? noop_default;
var groupEnd = _console?.groupEnd ?? noop_default;
var groupCollapsed = _console?.groupCollapsed ?? noop_default;
var profile = _console?.profile ?? noop_default;
var profileEnd = _console?.profileEnd ?? noop_default;
var time = _console?.time ?? noop_default;
var timeEnd = _console?.timeEnd ?? noop_default;
var timeLog = _console?.timeLog ?? noop_default;
var timeStamp = _console?.timeStamp ?? noop_default;
var Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
var _times = /* @__PURE__ */ new Map();
var _stdoutErrorHandler = noop_default;
var _stderrErrorHandler = noop_default;

// node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole = globalThis["console"];
var {
  assert,
  clear: clear2,
  // @ts-expect-error undocumented public API
  context,
  count: count2,
  countReset: countReset2,
  // @ts-expect-error undocumented public API
  createTask: createTask2,
  debug: debug2,
  dir: dir2,
  dirxml: dirxml2,
  error: error2,
  group: group2,
  groupCollapsed: groupCollapsed2,
  groupEnd: groupEnd2,
  info: info2,
  log: log2,
  profile: profile2,
  profileEnd: profileEnd2,
  table: table2,
  time: time2,
  timeEnd: timeEnd2,
  timeLog: timeLog2,
  timeStamp: timeStamp2,
  trace: trace2,
  warn: warn2
} = workerdConsole;
Object.assign(workerdConsole, {
  Console,
  _ignoreErrors,
  _stderr,
  _stderrErrorHandler,
  _stdout,
  _stdoutErrorHandler,
  _times
});
var console_default = workerdConsole;

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
globalThis.console = console_default;

// node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
  const now = Date.now();
  const seconds = Math.trunc(now / 1e3);
  const nanos = now % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
  return BigInt(Date.now() * 1e6);
}, "bigint") });

// node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";

// node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream = class {
  static {
    __name(this, "ReadStream");
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
};

// node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream = class {
  static {
    __name(this, "WriteStream");
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  clearLine(dir3, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env2) {
    return 1;
  }
  hasColors(count3, env2) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
};

// node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION = "22.14.0";

// node_modules/unenv/dist/runtime/node/internal/process/process.mjs
var Process = class _Process extends EventEmitter {
  static {
    __name(this, "Process");
  }
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  // --- event emitter ---
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  // --- stdio (lazy initializers) ---
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream(2);
  }
  // --- cwd ---
  #cwd = "/";
  chdir(cwd2) {
    this.#cwd = cwd2;
  }
  cwd() {
    return this.#cwd;
  }
  // --- dummy props and getters ---
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return `v${NODE_VERSION}`;
  }
  get versions() {
    return { node: NODE_VERSION };
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  // --- noop methods ---
  ref() {
  }
  unref() {
  }
  // --- unimplemented methods ---
  umask() {
    throw createNotImplementedError("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw createNotImplementedError("process.getActiveResourcesInfo");
  }
  exit() {
    throw createNotImplementedError("process.exit");
  }
  reallyExit() {
    throw createNotImplementedError("process.reallyExit");
  }
  kill() {
    throw createNotImplementedError("process.kill");
  }
  abort() {
    throw createNotImplementedError("process.abort");
  }
  dlopen() {
    throw createNotImplementedError("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw createNotImplementedError("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw createNotImplementedError("process.loadEnvFile");
  }
  disconnect() {
    throw createNotImplementedError("process.disconnect");
  }
  cpuUsage() {
    throw createNotImplementedError("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw createNotImplementedError("process.initgroups");
  }
  openStdin() {
    throw createNotImplementedError("process.openStdin");
  }
  assert() {
    throw createNotImplementedError("process.assert");
  }
  binding() {
    throw createNotImplementedError("process.binding");
  }
  // --- attached interfaces ---
  permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
  // --- undefined props ---
  mainModule = void 0;
  domain = void 0;
  // optional
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  // internals
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};

// node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess = globalThis["process"];
var getBuiltinModule = globalProcess.getBuiltinModule;
var workerdProcess = getBuiltinModule("node:process");
var isWorkerdProcessV2 = globalThis.Cloudflare.compatibilityFlags.enable_nodejs_process_v2;
var unenvProcess = new Process({
  env: globalProcess.env,
  // `hrtime` is only available from workerd process v2
  hrtime: isWorkerdProcessV2 ? workerdProcess.hrtime : hrtime,
  // `nextTick` is available from workerd process v1
  nextTick: workerdProcess.nextTick
});
var { exit, features, platform } = workerdProcess;
var {
  // Always implemented by workerd
  env,
  // Only implemented in workerd v2
  hrtime: hrtime3,
  // Always implemented by workerd
  nextTick
} = unenvProcess;
var {
  _channel,
  _disconnect,
  _events,
  _eventsCount,
  _handleQueue,
  _maxListeners,
  _pendingMessage,
  _send,
  assert: assert2,
  disconnect,
  mainModule
} = unenvProcess;
var {
  // @ts-expect-error `_debugEnd` is missing typings
  _debugEnd,
  // @ts-expect-error `_debugProcess` is missing typings
  _debugProcess,
  // @ts-expect-error `_exiting` is missing typings
  _exiting,
  // @ts-expect-error `_fatalException` is missing typings
  _fatalException,
  // @ts-expect-error `_getActiveHandles` is missing typings
  _getActiveHandles,
  // @ts-expect-error `_getActiveRequests` is missing typings
  _getActiveRequests,
  // @ts-expect-error `_kill` is missing typings
  _kill,
  // @ts-expect-error `_linkedBinding` is missing typings
  _linkedBinding,
  // @ts-expect-error `_preload_modules` is missing typings
  _preload_modules,
  // @ts-expect-error `_rawDebug` is missing typings
  _rawDebug,
  // @ts-expect-error `_startProfilerIdleNotifier` is missing typings
  _startProfilerIdleNotifier,
  // @ts-expect-error `_stopProfilerIdleNotifier` is missing typings
  _stopProfilerIdleNotifier,
  // @ts-expect-error `_tickCallback` is missing typings
  _tickCallback,
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  arch,
  argv,
  argv0,
  availableMemory,
  // @ts-expect-error `binding` is missing typings
  binding,
  channel,
  chdir,
  config,
  connected,
  constrainedMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  // @ts-expect-error `domain` is missing typings
  domain,
  emit,
  emitWarning,
  eventNames,
  execArgv,
  execPath,
  exitCode,
  finalization,
  getActiveResourcesInfo,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getMaxListeners,
  getuid,
  hasUncaughtExceptionCaptureCallback,
  // @ts-expect-error `initgroups` is missing typings
  initgroups,
  kill,
  listenerCount,
  listeners,
  loadEnvFile,
  memoryUsage,
  // @ts-expect-error `moduleLoadList` is missing typings
  moduleLoadList,
  off,
  on,
  once,
  // @ts-expect-error `openStdin` is missing typings
  openStdin,
  permission,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  // @ts-expect-error `reallyExit` is missing typings
  reallyExit,
  ref,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  send,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setMaxListeners,
  setSourceMapsEnabled,
  setuid,
  setUncaughtExceptionCaptureCallback,
  sourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  throwDeprecation,
  title,
  traceDeprecation,
  umask,
  unref,
  uptime,
  version,
  versions
} = isWorkerdProcessV2 ? workerdProcess : unenvProcess;
var _process = {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exit,
  finalization,
  features,
  getBuiltinModule,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  nextTick,
  on,
  off,
  once,
  pid,
  platform,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  // @ts-expect-error old API
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
};
var process_default = _process;

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
globalThis.process = process_default;

// worker.js
var worker_default = {
  async fetch(request, env2, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    try {
      if (path.startsWith("/api/")) {
        return await handleAPI(path, request, env2, corsHeaders);
      }
      if (path.startsWith("/_next/") || path.startsWith("/static/") || path.endsWith(".js") || path.endsWith(".css") || path.endsWith(".json") || path.endsWith(".woff2")) {
        if (env2.ASSETS) {
          const assetResponse = await env2.ASSETS.fetch(request);
          if (assetResponse && assetResponse.status !== 404) {
            return assetResponse;
          }
        }
      }
      if (env2.ASSETS) {
        const assetResponse = await env2.ASSETS.fetch(request);
        if (assetResponse && assetResponse.status !== 404) {
          return assetResponse;
        }
      }
      const htmlPaths = {
        "/": "/index.html",
        "/login": "/login.html",
        "/user/dashboard": "/user/dashboard.html",
        "/user/barang": "/user/barang.html",
        "/user/profile": "/user/profile.html",
        "/user/tempahan": "/user/tempahan.html",
        "/user/sejarah": "/user/sejarah.html",
        "/admin/dashboard": "/admin/dashboard.html",
        "/admin/barang": "/admin/barang.html",
        "/admin/pengguna": "/admin/pengguna.html",
        "/admin/laporan": "/admin/laporan.html",
        "/admin/profile": "/admin/profile.html",
        "/staff-ict/dashboard": "/staff-ict/dashboard.html",
        "/staff-ict/barang": "/staff-ict/barang.html",
        "/staff-ict/kelulusan": "/staff-ict/kelulusan.html"
      };
      const htmlPath = htmlPaths[path];
      if (htmlPath && env2.ASSETS) {
        const htmlUrl = new URL(htmlPath, request.url);
        const htmlResponse2 = await env2.ASSETS.fetch(new Request(htmlUrl, request));
        if (htmlResponse2 && htmlResponse2.status !== 404) {
          return htmlResponse2;
        }
      }
      return await handlePage(path, corsHeaders);
    } catch (error3) {
      return jsonResponse({
        success: false,
        error: "Internal server error",
        message: error3.message
      }, 500, corsHeaders);
    }
  }
};
async function handleAPI(path, request, env2, corsHeaders) {
  const db = env2.DB;
  if (path === "/api/auth/login" && request.method === "POST") {
    const { email, password } = await request.json();
    if (!email || !password) {
      return jsonResponse({
        success: false,
        error: "Email dan password diperlukan"
      }, 400, corsHeaders);
    }
    const result = await db.prepare(
      "SELECT * FROM users WHERE email = ? AND password_hash = ?"
    ).bind(email, password).first();
    if (!result) {
      return jsonResponse({
        success: false,
        error: "Email atau password salah"
      }, 401, corsHeaders);
    }
    await db.prepare(
      "UPDATE users SET last_login = datetime('now') WHERE id = ?"
    ).bind(result.id).run();
    const { password_hash, ...user } = result;
    return jsonResponse({
      success: true,
      user,
      redirectTo: getRedirectPath(user.peranan),
      usingRealDatabase: true,
      message: "Login berjaya (D1 Database)"
    }, 200, corsHeaders);
  }
  if (path === "/api/user/dashboard" && request.method === "GET") {
    const userId = "user_003";
    const stats = await db.prepare(`
      SELECT 
        (SELECT COUNT(*) FROM tempahan WHERE userId = ?) as totalTempahan,
        (SELECT COUNT(*) FROM tempahan WHERE userId = ? AND status = 'Aktif') as tempahanAktif,
        (SELECT COUNT(*) FROM barang WHERE status = 'Tersedia') as barangTersedia
    `).bind(userId, userId).first();
    return jsonResponse({ success: true, data: stats }, 200, corsHeaders);
  }
  if (path === "/api/admin/dashboard" && request.method === "GET") {
    const stats = await db.prepare(`
      SELECT 
        (SELECT COUNT(*) FROM users) as totalUsers,
        (SELECT COUNT(*) FROM barang) as totalBarang,
        (SELECT COUNT(*) FROM tempahan WHERE status = 'Diluluskan') as tempahanAktif,
        (SELECT COUNT(*) FROM tempahan WHERE status = 'Pending') as tempahanPending,
        (SELECT SUM(kuantitiTersedia) FROM barang) as totalKuantiti
    `).first();
    return jsonResponse({ success: true, data: stats }, 200, corsHeaders);
  }
  if (path === "/api/staff-ict/dashboard" && request.method === "GET") {
    const stats = await db.prepare(`
      SELECT 
        (SELECT COUNT(*) FROM tempahan WHERE status = 'Pending') as perluKelulusan,
        (SELECT COUNT(*) FROM tempahan WHERE status = 'Diluluskan') as diluluskan,
        (SELECT COUNT(*) FROM tempahan WHERE status = 'Ditolak') as ditolak,
        (SELECT COUNT(*) FROM barang) as totalBarang
    `).first();
    return jsonResponse({ success: true, data: stats }, 200, corsHeaders);
  }
  if (path === "/api/user/barang" && request.method === "GET") {
    const barang = await db.prepare(
      'SELECT * FROM barang WHERE status = "Tersedia" ORDER BY createdAt DESC'
    ).all();
    return jsonResponse({
      success: true,
      barang: barang.results
    }, 200, corsHeaders);
  }
  if (path === "/api/admin/barang") {
    if (request.method === "GET") {
      const barang = await db.prepare(
        "SELECT * FROM barang ORDER BY createdAt DESC"
      ).all();
      return jsonResponse({
        success: true,
        barang: barang.results
      }, 200, corsHeaders);
    }
    if (request.method === "POST") {
      const body = await request.json();
      const id = "brg_" + Date.now();
      await db.prepare(`
        INSERT INTO barang (id, namaBarang, kategori, kodBarang, kuantitiTersedia, 
          kuantitiTotal, lokasi, status, hargaPerolehan, tarikhPerolehan, catatan, createdBy)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        id,
        body.namaBarang,
        body.kategori,
        body.kodBarang,
        body.kuantitiTersedia || body.kuantitiTotal,
        body.kuantitiTotal,
        body.lokasi,
        "Tersedia",
        body.hargaPerolehan || 0,
        body.tarikhPerolehan || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        body.catatan || "",
        body.createdBy || "user_001"
      ).run();
      return jsonResponse({
        success: true,
        message: "Barang berjaya ditambah",
        data: { id }
      }, 200, corsHeaders);
    }
    if (request.method === "PUT") {
      try {
        const body = await request.json();
        console.log("PUT body received:", JSON.stringify(body));
        if (body.namaBarang) {
          await db.prepare(`
            UPDATE barang SET 
              namaBarang = ?, 
              kategori = ?, 
              kodBarang = ?, 
              kuantitiTotal = ?,
              kuantitiTersedia = ?,
              status = ?,
              lokasi = ?,
              catatan = ?,
              updatedAt = datetime("now")
            WHERE id = ?
          `).bind(
            body.namaBarang,
            body.kategori,
            body.kodBarang,
            body.kuantitiTotal || 1,
            body.kuantitiTersedia !== void 0 ? body.kuantitiTersedia : 1,
            body.status || "Tersedia",
            body.lokasi,
            body.deskripsi || body.nota || "",
            body.id
          ).run();
        } else if (body.status && !body.namaBarang) {
          await db.prepare(
            'UPDATE barang SET status = ?, updatedAt = datetime("now") WHERE id = ?'
          ).bind(body.status, body.id).run();
        } else if (body.kuantitiTersedia !== void 0 && !body.namaBarang) {
          await db.prepare(
            'UPDATE barang SET kuantitiTersedia = ?, updatedAt = datetime("now") WHERE id = ?'
          ).bind(body.kuantitiTersedia, body.id).run();
        }
        return jsonResponse({
          success: true,
          message: "Barang berjaya dikemaskini"
        }, 200, corsHeaders);
      } catch (error3) {
        console.error("PUT error:", error3);
        return jsonResponse({
          success: false,
          error: error3.message || "Gagal kemaskini barang"
        }, 500, corsHeaders);
      }
    }
    if (request.method === "DELETE") {
      const body = await request.json();
      if (body.ids && Array.isArray(body.ids)) {
        const placeholders = body.ids.map(() => "?").join(",");
        await db.prepare(
          `DELETE FROM barang WHERE id IN (${placeholders})`
        ).bind(...body.ids).run();
        return jsonResponse({
          success: true,
          message: `${body.ids.length} barang berjaya dipadam`
        }, 200, corsHeaders);
      }
      if (body.id) {
        await db.prepare(
          "DELETE FROM barang WHERE id = ?"
        ).bind(body.id).run();
        return jsonResponse({
          success: true,
          message: "Barang berjaya dipadam"
        }, 200, corsHeaders);
      }
      return jsonResponse({
        success: false,
        error: "ID atau IDs diperlukan"
      }, 400, corsHeaders);
    }
  }
  if (path === "/api/admin/pengguna") {
    if (request.method === "GET") {
      const users = await db.prepare(
        "SELECT id, email, nama, peranan, fakulti, no_telefon, no_matrik, no_staf, status, created_at FROM users ORDER BY created_at DESC"
      ).all();
      return jsonResponse({
        success: true,
        data: users.results
      }, 200, corsHeaders);
    }
    if (request.method === "POST") {
      const body = await request.json();
      const id = "user_" + Date.now();
      await db.prepare(`
        INSERT INTO users (id, email, nama, peranan, fakulti, no_telefon, no_matrik, no_staf, password_hash, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        id,
        body.email,
        body.nama,
        body.role,
        body.fakulti,
        body.no_telefon || "",
        body.noMatrik || null,
        body.noStaf || null,
        "password123",
        // Default password
        "aktif"
      ).run();
      return jsonResponse({
        success: true,
        message: "Pengguna berjaya ditambah",
        data: { id }
      }, 200, corsHeaders);
    }
    if (request.method === "PUT") {
      const body = await request.json();
      if (body.action === "reset-password") {
        await db.prepare(
          'UPDATE users SET password_hash = ?, updated_at = datetime("now") WHERE id = ?'
        ).bind("password123", body.id).run();
        return jsonResponse({
          success: true,
          message: "Password berjaya direset kepada password123"
        }, 200, corsHeaders);
      }
      if (body.status) {
        await db.prepare(
          'UPDATE users SET status = ?, updated_at = datetime("now") WHERE id = ?'
        ).bind(body.status, body.id).run();
      }
      return jsonResponse({
        success: true,
        message: "Pengguna berjaya dikemaskini"
      }, 200, corsHeaders);
    }
    if (request.method === "DELETE") {
      const body = await request.json();
      if (Array.isArray(body.ids)) {
        for (const id of body.ids) {
          await db.prepare("DELETE FROM users WHERE id = ?").bind(id).run();
        }
        return jsonResponse({
          success: true,
          message: `${body.ids.length} pengguna berjaya dipadam`
        }, 200, corsHeaders);
      } else {
        await db.prepare("DELETE FROM users WHERE id = ?").bind(body.id).run();
        return jsonResponse({
          success: true,
          message: "Pengguna berjaya dipadam"
        }, 200, corsHeaders);
      }
    }
  }
  if (path === "/api/user/tempahan") {
    if (request.method === "GET") {
      const userId = "user_003";
      const tempahan = await db.prepare(`
        SELECT t.*, b.namaBarang, b.kategori, b.kodBarang
        FROM tempahan t
        JOIN barang b ON t.barangId = b.id
        WHERE t.userId = ?
        ORDER BY t.createdAt DESC
      `).bind(userId).all();
      return jsonResponse({
        success: true,
        data: tempahan.results
      }, 200, corsHeaders);
    }
    if (request.method === "POST") {
      try {
        const body = await request.json();
        const id = "tmp_" + Date.now();
        const userId = body.userId || "user_003";
        console.log("Creating tempahan:", { id, userId, barangId: body.barangId, kuantiti: body.kuantiti });
        await db.prepare(`
          INSERT INTO tempahan (id, userId, barangId, kuantiti, tarikhMula, tarikhTamat, tujuan, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          id,
          userId,
          body.barangId,
          body.kuantiti || 1,
          body.tarikhMula,
          body.tarikhTamat,
          body.tujuan || "",
          "Pending"
        ).run();
        return jsonResponse({
          success: true,
          message: "Tempahan berjaya dihantar",
          data: { id }
        }, 200, corsHeaders);
      } catch (error3) {
        console.error("POST tempahan error:", error3);
        return jsonResponse({
          success: false,
          error: error3.message || "Gagal membuat tempahan"
        }, 500, corsHeaders);
      }
    }
    if (request.method === "DELETE") {
      const body = await request.json();
      await db.prepare(
        'UPDATE tempahan SET status = ?, updatedAt = datetime("now") WHERE id = ?'
      ).bind("Dibatalkan", body.id).run();
      return jsonResponse({
        success: true,
        message: "Tempahan berjaya dibatalkan"
      }, 200, corsHeaders);
    }
  }
  if (path === "/api/staff-ict/kelulusan") {
    if (request.method === "GET") {
      const tempahan = await db.prepare(`
        SELECT t.*, b.namaBarang, b.kategori, b.lokasi, 
               u.nama as namaPemohon, u.email as emailPemohon, u.fakulti
        FROM tempahan t
        JOIN barang b ON t.barangId = b.id
        JOIN users u ON t.userId = u.id
        ORDER BY t.createdAt DESC
      `).all();
      return jsonResponse({
        success: true,
        data: tempahan.results
      }, 200, corsHeaders);
    }
    if (request.method === "PUT") {
      const body = await request.json();
      const staffId = "user_002";
      await db.prepare(`
        UPDATE tempahan SET 
          status = ?, 
          catatanKelulusan = ?,
          diluluskanOleh = ?,
          tarikhKelulusan = datetime("now"),
          updatedAt = datetime("now")
        WHERE id = ?
      `).bind(
        body.status,
        body.catatan || "",
        staffId,
        body.id
      ).run();
      if (body.status === "Diluluskan") {
        const tempahan = await db.prepare(
          "SELECT barangId, kuantiti FROM tempahan WHERE id = ?"
        ).bind(body.id).first();
        await db.prepare(
          "UPDATE barang SET kuantitiTersedia = kuantitiTersedia - ? WHERE id = ?"
        ).bind(tempahan.kuantiti, tempahan.barangId).run();
      }
      return jsonResponse({
        success: true,
        message: body.status === "Diluluskan" ? "Tempahan diluluskan" : "Tempahan ditolak"
      }, 200, corsHeaders);
    }
  }
  if (path === "/api/staff-ict/laporan/keseluruhan" && request.method === "GET") {
    const stats = await db.prepare(`
      SELECT 
        (SELECT COUNT(*) FROM tempahan) as totalTempahan,
        (SELECT COUNT(*) FROM tempahan WHERE status = 'Diluluskan') as tempahanLulus,
        (SELECT COUNT(*) FROM tempahan WHERE status = 'Pending') as tempahanPending,
        (SELECT COUNT(*) FROM tempahan WHERE status = 'Ditolak') as tempahanTolak,
        (SELECT COUNT(*) FROM barang) as totalBarang,
        (SELECT COUNT(*) FROM barang WHERE status = 'Tersedia') as barangTersedia,
        (SELECT COUNT(*) FROM users WHERE peranan = 'pelajar') as totalPelajar,
        (SELECT COUNT(*) FROM users WHERE peranan = 'pengajar') as totalPengajar
    `).first();
    return jsonResponse({ success: true, data: stats }, 200, corsHeaders);
  }
  if (path === "/api/staff-ict/laporan/barang" && request.method === "GET") {
    const barang = await db.prepare(`
      SELECT b.*, 
        (SELECT COUNT(*) FROM tempahan WHERE barangId = b.id AND status = 'Diluluskan') as jumlahDipinjam
      FROM barang b
      ORDER BY jumlahDipinjam DESC
    `).all();
    return jsonResponse({ success: true, data: barang.results }, 200, corsHeaders);
  }
  if (path === "/api/staff-ict/laporan/tempahan" && request.method === "GET") {
    const tempahan = await db.prepare(`
      SELECT t.*, b.namaBarang, u.nama as namaPemohon, u.fakulti
      FROM tempahan t
      JOIN barang b ON t.barangId = b.id
      JOIN users u ON t.userId = u.id
      ORDER BY t.createdAt DESC
      LIMIT 100
    `).all();
    return jsonResponse({ success: true, data: tempahan.results }, 200, corsHeaders);
  }
  if (path === "/api/user/profile" && request.method === "GET") {
    const urlParams = new URL(request.url);
    const userId = urlParams.searchParams.get("userId") || "user_003";
    const user = await db.prepare(
      "SELECT id, email, nama, peranan, fakulti, no_telefon, no_matrik, no_staf, status FROM users WHERE id = ?"
    ).bind(userId).first();
    if (!user) {
      return jsonResponse({ success: false, error: "User not found" }, 404, corsHeaders);
    }
    return jsonResponse({ success: true, data: user }, 200, corsHeaders);
  }
  if (path === "/api/staff-ict/profile" && request.method === "GET") {
    const urlParams = new URL(request.url);
    const userId = urlParams.searchParams.get("userId") || "user_002";
    const user = await db.prepare(
      "SELECT id, email, nama, peranan, fakulti, no_telefon, no_matrik, no_staf, status FROM users WHERE id = ?"
    ).bind(userId).first();
    if (!user) {
      return jsonResponse({ success: false, error: "User not found" }, 404, corsHeaders);
    }
    return jsonResponse({ success: true, data: user }, 200, corsHeaders);
  }
  if (path === "/api/admin/profile" && request.method === "GET") {
    const urlParams = new URL(request.url);
    const userId = urlParams.searchParams.get("userId") || "user_001";
    const user = await db.prepare(
      "SELECT id, email, nama, peranan, fakulti, no_telefon, no_matrik, no_staf, status FROM users WHERE id = ?"
    ).bind(userId).first();
    if (!user) {
      return jsonResponse({ success: false, error: "User not found" }, 404, corsHeaders);
    }
    return jsonResponse({ success: true, data: user }, 200, corsHeaders);
  }
  if (path === "/api/auth/logout" && request.method === "POST") {
    return jsonResponse({
      success: true,
      message: "Logout berjaya"
    }, 200, corsHeaders);
  }
  return jsonResponse({
    success: false,
    error: "API endpoint not found"
  }, 404, corsHeaders);
}
__name(handleAPI, "handleAPI");
async function handlePage(path, corsHeaders) {
  if (path === "/" || path === "") {
    return htmlResponse(getHomeHTML(), corsHeaders);
  }
  if (path === "/login") {
    return htmlResponse(getLoginHTML(), corsHeaders);
  }
  if (path === "/user/dashboard") {
    return htmlResponse(getUserDashboardHTML(), corsHeaders);
  }
  if (path === "/admin/dashboard") {
    return htmlResponse(getAdminDashboardHTML(), corsHeaders);
  }
  if (path === "/admin/barang") {
    return htmlResponse(getAdminBarangHTML(), corsHeaders);
  }
  if (path === "/admin/pengguna") {
    return htmlResponse(getAdminPenggunaHTML(), corsHeaders);
  }
  if (path === "/admin/laporan") {
    return htmlResponse(getAdminLaporanHTML(), corsHeaders);
  }
  if (path === "/admin/profile") {
    return htmlResponse(getAdminProfileHTML(), corsHeaders);
  }
  if (path === "/admin/tetapan/sistem") {
    return htmlResponse(getAdminTetapanSistemHTML(), corsHeaders);
  }
  if (path === "/admin/tetapan/keselamatan") {
    return htmlResponse(getAdminTetapanKeselamatanHTML(), corsHeaders);
  }
  if (path === "/admin/tetapan/log-aktiviti") {
    return htmlResponse(getAdminTetapanLogAktivitiHTML(), corsHeaders);
  }
  if (path === "/admin/tetapan/backup-pulih") {
    return htmlResponse(getAdminTetapanBackupPulihHTML(), corsHeaders);
  }
  if (path === "/user/barang") {
    return htmlResponse(getUserBarangHTML(), corsHeaders);
  }
  if (path === "/user/profile") {
    return htmlResponse(getUserProfileHTML(), corsHeaders);
  }
  if (path === "/user/sejarah") {
    return htmlResponse(getUserSejarahHTML(), corsHeaders);
  }
  if (path === "/user/tempahan") {
    return htmlResponse(getUserTempahanHTML(), corsHeaders);
  }
  if (path === "/staff-ict/dashboard") {
    return htmlResponse(getStaffDashboardHTML(), corsHeaders);
  }
  if (path === "/staff-ict/barang") {
    return htmlResponse(getStaffBarangHTML(), corsHeaders);
  }
  if (path === "/staff-ict/kelulusan") {
    return htmlResponse(getStaffKelulusanHTML(), corsHeaders);
  }
  if (path === "/staff-ict/profile") {
    return htmlResponse(getStaffProfileHTML(), corsHeaders);
  }
  if (path === "/staff-ict/laporan/keseluruhan") {
    return htmlResponse(getStaffLaporanKeseluruhanHTML(), corsHeaders);
  }
  if (path === "/staff-ict/laporan/barang") {
    return htmlResponse(getStaffLaporanBarangHTML(), corsHeaders);
  }
  if (path === "/staff-ict/laporan/tempahan") {
    return htmlResponse(getStaffLaporanTempahanHTML(), corsHeaders);
  }
  return htmlResponse("<h1>404 - Page Not Found</h1>", corsHeaders, 404);
}
__name(handlePage, "handlePage");
function getFaviconHTML() {
  return `<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%232563eb'/><text x='16' y='22' text-anchor='middle' font-family='Arial' font-size='14' font-weight='700' fill='white'>iB</text></svg>">`;
}
__name(getFaviconHTML, "getFaviconHTML");
function getAdminBottomNavHTML(activePage = "") {
  return `
    <!-- Bottom Navigation -->
    <div class="fixed bottom-4 left-4 right-4 bg-white rounded-xl shadow-lg p-3 border border-gray-200">
      <!-- Mobile & Desktop: Always show text -->
      <div class="grid grid-cols-3 md:grid-cols-6 gap-1 md:gap-2">
        <button onclick="window.location.href='/admin/dashboard'" class="text-center py-1 md:py-2 px-1 ${activePage === "dashboard" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"} rounded-lg text-xs font-medium transition-colors">
          \u{1F3E0}<br><span class="text-xs">Dashboard</span>
        </button>
        <button onclick="window.location.href='/admin/pengguna'" class="text-center py-1 md:py-2 px-1 ${activePage === "pengguna" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"} rounded-lg text-xs font-medium transition-colors">
          \u{1F465}<br><span class="text-xs">Pengguna</span>
        </button>
        <button onclick="window.location.href='/admin/barang'" class="text-center py-1 md:py-2 px-1 ${activePage === "barang" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"} rounded-lg text-xs font-medium transition-colors">
          \u{1F4E6}<br><span class="text-xs">Barang</span>
        </button>
        <button onclick="window.location.href='/admin/laporan'" class="text-center py-1 md:py-2 px-1 ${activePage === "laporan" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"} rounded-lg text-xs font-medium transition-colors">
          \u{1F4CA}<br><span class="text-xs">Laporan</span>
        </button>
        <button onclick="window.location.href='/admin/tetapan/sistem'" class="text-center py-1 md:py-2 px-1 ${activePage === "tetapan" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"} rounded-lg text-xs font-medium transition-colors">
          \u2699\uFE0F<br><span class="text-xs">Tetapan</span>
        </button>
        <button onclick="window.location.href='/admin/profile'" class="text-center py-1 md:py-2 px-1 ${activePage === "profile" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"} rounded-lg text-xs font-medium transition-colors">
          \u{1F464}<br><span class="text-xs">Profil</span>
        </button>
      </div>
    </div>
  `;
}
__name(getAdminBottomNavHTML, "getAdminBottomNavHTML");
function getUserBottomNavHTML(activePage = "") {
  return `
    <!-- Bottom Navigation -->
    <div class="fixed bottom-4 left-4 right-4 bg-white rounded-xl shadow-lg p-3 border border-gray-200">
      <div class="flex justify-between items-center">
        <button onclick="window.location.href='/user/dashboard'" class="flex-1 text-center py-2 px-1 ${activePage === "dashboard" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"} rounded-lg text-xs font-medium mx-1 transition-colors">
          \u{1F3E0}<br><span class="text-xs">Dashboard</span>
        </button>
        <button onclick="window.location.href='/user/barang'" class="flex-1 text-center py-2 px-1 ${activePage === "barang" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"} rounded-lg text-xs font-medium mx-1 transition-colors">
          \u{1F4E6}<br><span class="text-xs">Barang</span>
        </button>
        <button onclick="window.location.href='/user/tempahan'" class="flex-1 text-center py-2 px-1 ${activePage === "tempahan" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"} rounded-lg text-xs font-medium mx-1 transition-colors">
          \u{1F4DD}<br><span class="text-xs">Tempahan</span>
        </button>
        <button onclick="window.location.href='/user/sejarah'" class="flex-1 text-center py-2 px-1 ${activePage === "sejarah" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"} rounded-lg text-xs font-medium mx-1 transition-colors">
          \u{1F4CA}<br><span class="text-xs">Sejarah</span>
        </button>
        <button onclick="window.location.href='/user/profile'" class="flex-1 text-center py-2 px-1 ${activePage === "profile" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"} rounded-lg text-xs font-medium mx-1 transition-colors">
          \u{1F464}<br><span class="text-xs">Profil</span>
        </button>
      </div>
    </div>
  `;
}
__name(getUserBottomNavHTML, "getUserBottomNavHTML");
function getStaffBottomNavHTML(activePage = "") {
  return `
    <!-- Bottom Navigation -->
    <div class="fixed bottom-4 left-4 right-4 bg-white rounded-xl shadow-lg p-3 border border-gray-200">
      <div class="grid grid-cols-3 md:grid-cols-5 gap-1 md:gap-2">
        <button onclick="window.location.href='/staff-ict/dashboard'" class="text-center py-1 md:py-2 px-1 ${activePage === "dashboard" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"} rounded-lg text-xs font-medium transition-colors">
          \u{1F3E0}<br><span class="text-xs">Dashboard</span>
        </button>
        <button onclick="window.location.href='/staff-ict/barang'" class="text-center py-1 md:py-2 px-1 ${activePage === "barang" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"} rounded-lg text-xs font-medium transition-colors">
          \u{1F4E6}<br><span class="text-xs">Barang</span>
        </button>
        <button onclick="window.location.href='/staff-ict/kelulusan'" class="text-center py-1 md:py-2 px-1 ${activePage === "kelulusan" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"} rounded-lg text-xs font-medium transition-colors">
          \u2705<br><span class="text-xs">Kelulusan</span>
        </button>
        <button onclick="window.location.href='/staff-ict/laporan/keseluruhan'" class="text-center py-1 md:py-2 px-1 ${activePage === "laporan" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"} rounded-lg text-xs font-medium transition-colors">
          \u{1F4CA}<br><span class="text-xs">Laporan</span>
        </button>
        <button onclick="window.location.href='/staff-ict/profile'" class="text-center py-1 md:py-2 px-1 ${activePage === "profile" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"} rounded-lg text-xs font-medium transition-colors">
          \u{1F464}<br><span class="text-xs">Profil</span>
        </button>
      </div>
    </div>
  `;
}
__name(getStaffBottomNavHTML, "getStaffBottomNavHTML");
function getHomeHTML() {
  return `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sistem i-Borrow - ILKKM Johor Bahru</title>
  ${getFaviconHTML()}
  <script src="https://cdn.tailwindcss.com"><\/script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    body { font-family: 'Inter', sans-serif; }
  </style>
</head>
<body class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
  <div class="max-w-sm w-full text-center space-y-6">
    <!-- Logo & Brand -->
    <div class="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
      <span class="text-xl font-bold text-white">iB</span>
    </div>
    
    <div>
      <h1 class="text-2xl font-bold text-gray-900 mb-2">
        Sistem Peminjaman Barang ICT
      </h1>
      <p class="text-gray-600 text-sm">
        Institut Kementerian Kesihatan Malaysia Johor Bahru
      </p>
    </div>

    <!-- Login Button -->
    <a
      href="/login"
      class="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
    >
      Log Masuk
    </a>

    <!-- Quick Info -->
    <div class="text-xs text-gray-500 space-y-1">
      <p>Gunakan: admin/admin, staff/staff, user/user</p>
    </div>

    <!-- COPYRIGHT -->
    <div class="pt-4 border-t border-gray-200">
      <p class="text-xs text-gray-400">
        &copy; 2025 <a href="https://asyraaf.pages.dev/" target="_blank" rel="noopener noreferrer" class="hover:text-blue-600 transition-colors">Asyraaf Samson</a>. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>`;
}
__name(getHomeHTML, "getHomeHTML");
function getLoginHTML() {
  return `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login - Sistem i-Borrow</title>
  ${getFaviconHTML()}
  <script src="https://cdn.tailwindcss.com"><\/script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    body { font-family: 'Inter', sans-serif; }
  </style>
</head>
<body class="min-h-screen bg-gray-50">
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
      
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span class="text-xl font-bold text-white">iB</span>
        </div>
        <h1 class="text-2xl font-bold text-gray-900">Sistem i-Borrow</h1>
        <p class="text-gray-600 mt-2">ILKKM Johor Bahru</p>
      </div>

      <!-- Error Message -->
      <div id="errorMessage" class="hidden mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl"></div>

      <!-- Success Message -->
      <div id="successMessage" class="hidden mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-xl"></div>

      <!-- Login Form -->
      <form id="loginForm" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Masukkan email"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Masukkan password"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            required
          />
        </div>

        <button
          type="submit"
          id="loginBtn"
          class="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Log Masuk
        </button>
      </form>

      <!-- Quick Test Buttons -->
    </div>
  </div>

  <script>
    // Login form handler
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const loginBtn = document.getElementById('loginBtn');
      const errorMsg = document.getElementById('errorMessage');
      const successMsg = document.getElementById('successMessage');
      
      // Hide messages
      errorMsg.classList.add('hidden');
      successMsg.classList.add('hidden');
      
      // Disable button
      loginBtn.disabled = true;
      loginBtn.textContent = 'Logging in...';
      
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        console.log('Login response:', data);
        
        if (data.success) {
          // Show success
          successMsg.textContent = data.message + ' - Redirecting...';
          successMsg.classList.remove('hidden');
          
          // Store user data
          localStorage.setItem('user', JSON.stringify(data.user));
          
          // Redirect
          setTimeout(() => {
            window.location.href = data.redirectTo;
          }, 1000);
        } else {
          // Show error
          errorMsg.textContent = data.error || 'Login failed';
          errorMsg.classList.remove('hidden');
          loginBtn.disabled = false;
          loginBtn.textContent = 'Log Masuk';
        }
      } catch (error) {
        console.error('Login error:', error);
        errorMsg.textContent = 'Network error. Please try again.';
        errorMsg.classList.remove('hidden');
        loginBtn.disabled = false;
        loginBtn.textContent = 'Log Masuk';
      }
    });
  <\/script>
</body>
</html>`;
}
__name(getLoginHTML, "getLoginHTML");
function getUserDashboardHTML() {
  return `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard - User</title>
  ${getFaviconHTML()}
  <script src="https://cdn.tailwindcss.com"><\/script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    body { font-family: 'Inter', sans-serif; }
  </style>
</head>
<body class="min-h-screen bg-gray-50 p-3 pb-20">
  <div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <div class="text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
            <span class="text-xs font-medium">\u{1F3E0} DASHBOARD</span>
          </div>
        </div>
        <button 
          onclick="handleLogout()"
          class="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors"
        >
          Log Keluar
        </button>
      </div>
      
      <div class="text-center">
        <h1 class="text-xl font-bold text-gray-900">\u{1F44B} Dashboard Pengguna</h1>
        <p class="text-gray-600 text-sm mt-1">Pinjam barang ICT ILKKM dengan mudah</p>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 gap-3 mb-4">
      <div class="bg-white rounded-xl shadow-sm p-3 text-center">
        <div class="text-lg font-bold text-blue-600" id="totalTempahan">-</div>
        <div class="text-xs text-gray-600">Tempahan Aktif</div>
        <div class="text-xs text-blue-600 mt-1">Menunggu kelulusan</div>
      </div>
      
      <div class="bg-white rounded-xl shadow-sm p-3 text-center">
        <div class="text-lg font-bold text-green-600">23</div>
        <div class="text-xs text-gray-600">Sejarah</div>
        <div class="text-xs text-green-600 mt-1">Pinjaman lepas</div>
      </div>
      
      <div class="bg-white rounded-xl shadow-sm p-3 text-center">
        <div class="text-lg font-bold text-purple-600" id="barangTersedia">-</div>
        <div class="text-xs text-gray-600">Barang Tersedia</div>
        <div class="text-xs text-purple-600 mt-1">Boleh dipinjam</div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-3 text-center">
        <div class="text-lg font-bold text-orange-600">5</div>
        <div class="text-xs text-gray-600">Disetujui</div>
        <div class="text-xs text-orange-600 mt-1">Bulan ini</div>
      </div>
    </div>

    <!-- Senarai Barang -->
    <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-semibold text-gray-900 text-sm">\u{1F4E6} Barang Tersedia</h2>
        <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full" id="barangCount">
          Loading...
        </span>
      </div>
      
      <div id="barangList" class="space-y-3">
        <p class="text-center text-gray-500 text-sm">Loading barang...</p>
      </div>
    </div>

    <!-- Info Section -->
    <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
      <div class="flex items-start gap-3">
        <div class="bg-blue-100 p-2 rounded-lg">
          <span class="text-blue-600 text-sm">\u{1F4A1}</span>
        </div>
        <div>
          <h4 class="font-semibold text-blue-800 text-sm mb-2">Cara Meminjam Barang</h4>
          <ul class="text-blue-700 text-xs space-y-1">
            <li>\u2022 Klik "Pinjam Sekarang" pada barang yang ingin dipinjam</li>
            <li>\u2022 Tempahan akan menunggu kelulusan Staff ICT</li>
            <li>\u2022 Anda akan dimaklumkan melalui emel apabila diluluskan</li>
            <li>\u2022 Ambil barang di Kaunter ICT dalam tempoh 24 jam</li>
            <li>\u2022 Pastikan maklumat peribadi anda lengkap dalam profil</li>
          </ul>
        </div>
      </div>
    </div>

    ${getUserBottomNavHTML("dashboard")}
  </div>
  
  <script>
    function handleLogout() {
      if (confirm('Adakah anda pasti ingin log keluar?')) {
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    // Load stats
    fetch('/api/user/dashboard')
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          document.getElementById('totalTempahan').textContent = data.data.totalTempahan || 0;
          document.getElementById('barangTersedia').textContent = data.data.barangTersedia || 0;
        }
      });

    // Load barang list
    fetch('/api/user/barang')
      .then(r => r.json())
      .then(data => {
        const container = document.getElementById('barangList');
        const countEl = document.getElementById('barangCount');
        
        if (data.success && data.barang && data.barang.length > 0) {
          countEl.textContent = data.barang.length + ' barang';
          container.innerHTML = data.barang.slice(0, 6).map(barang => \`
            <div class="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
              <div class="flex flex-col gap-3">
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                      <span class="text-lg">\u{1F4E6}</span>
                      <h3 class="font-semibold text-gray-900 text-sm">\${barang.namaBarang}</h3>
                    </div>
                    <p class="text-gray-600 text-xs mb-2">\${barang.catatan || 'Barang ICT'}</p>
                    <div class="flex items-center gap-2 flex-wrap">
                      <span class="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        \${barang.kategori}
                      </span>
                      <span class="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                        \${barang.status}
                      </span>
                      <span class="text-gray-500 text-xs">\u{1F4CD} \${barang.lokasi || 'Kaunter ICT'}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onclick="handlePinjam('\${barang.namaBarang}')"
                  class="w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-blue-500 text-white hover:bg-blue-600"
                >
                  \u{1F4CC} Pinjam Sekarang
                </button>
              </div>
            </div>
          \`).join('');
        } else {
          countEl.textContent = '0 barang';
          container.innerHTML = '<p class="text-center text-gray-500 text-sm">Tiada barang tersedia</p>';
        }
      });

    async function handlePinjam(nama) {
      // Find barang by name
      const response = await fetch('/api/user/barang');
      const data = await response.json();
      const barang = data.barang.find(b => b.namaBarang === nama);
      
      if (!barang) {
        alert('Barang tidak dijumpai');
        return;
      }

      // Get user from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.id) {
        alert('Sila login semula');
        window.location.href = '/login';
        return;
      }

      // Create tempahan
      try {
        const tempahanResponse = await fetch('/api/user/tempahan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            barangId: barang.id,
            kuantiti: 1,
            tarikhMula: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            tarikhTamat: new Date(Date.now() + 7*86400000).toISOString().split('T')[0],
            tujuan: 'Tempahan dari dashboard'
          })
        });

        if (!tempahanResponse.ok) {
          const error = await tempahanResponse.json();
          throw new Error(error.error || 'Gagal membuat tempahan');
        }

        alert('\u2705 BERJAYA MEMINJAM!\\n\\n\u{1F4E6} ' + nama + '\\n\\nStatus: MENUNGGU KELULUSAN STAFF ICT');
        location.reload();
      } catch (error) {
        console.error('Error creating tempahan:', error);
        alert('\u274C Error: ' + error.message);
      }
    }
  <\/script>
</body>
</html>`;
}
__name(getUserDashboardHTML, "getUserDashboardHTML");
function getAdminDashboardHTML() {
  return `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard - Admin</title>
  ${getFaviconHTML()}
  <script src="https://cdn.tailwindcss.com"><\/script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    body { font-family: 'Inter', sans-serif; }
  </style>
</head>
<body class="min-h-screen bg-gray-50 p-3 pb-24">
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <div class="text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
            <span class="text-xs font-medium">\u{1F3E0} DASHBOARD</span>
          </div>
        </div>
        <button 
          onclick="handleLogout()"
          class="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors"
        >
          Log Keluar
        </button>
      </div>
      
      <div class="text-center">
        <h1 class="text-xl font-bold text-gray-900">\u{1F468}\u200D\u{1F4BC} Dashboard Admin</h1>
        <p class="text-gray-600 text-sm mt-1">Urus sistem i-Borrow ILKKM</p>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 gap-3 mb-4">
      <div class="bg-white rounded-xl shadow-sm p-3 text-center">
        <div class="text-lg font-bold text-blue-600" id="totalUsers">-</div>
        <div class="text-xs text-gray-600">Total Pengguna</div>
        <div class="text-xs text-blue-600 mt-1" id="activeUsers">- Aktif</div>
      </div>
      
      <div class="bg-white rounded-xl shadow-sm p-3 text-center">
        <div class="text-lg font-bold text-green-600" id="totalBarang">-</div>
        <div class="text-xs text-gray-600">Total Barang</div>
        <div class="text-xs text-green-600 mt-1" id="availableBarang">- Tersedia</div>
      </div>
      
      <div class="bg-white rounded-xl shadow-sm p-3 text-center">
        <div class="text-lg font-bold text-purple-600" id="tempahanAktif">-</div>
        <div class="text-xs text-gray-600">Tempahan Aktif</div>
        <div class="text-xs text-purple-600 mt-1">8 Pending</div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-3 text-center">
        <div class="text-lg font-bold text-red-600">0</div>
        <div class="text-xs text-gray-600">Barang Rosak</div>
        <div class="text-xs text-red-600 mt-1">Perlu Baiki</div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
      <h2 class="font-semibold text-gray-900 text-sm mb-3">\u26A1 Akses Pantas</h2>
      <div class="grid grid-cols-2 gap-2">
        <button 
          onclick="window.location.href='/admin/pengguna'"
          class="bg-blue-50 text-blue-700 py-3 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors border border-blue-200"
        >
          \u{1F465} Urus Pengguna
        </button>
        <button 
          onclick="window.location.href='/admin/barang'"
          class="bg-green-50 text-green-700 py-3 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors border border-green-200"
        >
          \u{1F4E6} Urus Barang
        </button>
        <button 
          onclick="window.location.href='/admin/laporan'"
          class="bg-purple-50 text-purple-700 py-3 rounded-lg text-xs font-medium hover:bg-purple-100 transition-colors border border-purple-200"
        >
          \u{1F4CA} Lihat Laporan
        </button>
        <button 
          onclick="window.location.href='/admin/tetapan/sistem'"
          class="bg-orange-50 text-orange-700 py-3 rounded-lg text-xs font-medium hover:bg-orange-100 transition-colors border border-orange-200"
        >
          \u2699\uFE0F Tetapan
        </button>
      </div>
    </div>

    <!-- Database Status -->
    <div class="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
      <div class="flex items-center gap-3">
        <div class="bg-green-100 p-2 rounded-lg">
          <span class="text-green-600 text-sm">\u2705</span>
        </div>
        <div>
          <h4 class="font-semibold text-green-800 text-sm">Cloudflare D1 Database</h4>
          <p class="text-green-700 text-xs mt-1">Connected and operational</p>
        </div>
      </div>
    </div>

    <!-- Info Section -->
    <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
      <div class="flex items-start gap-3">
        <div class="bg-blue-100 p-2 rounded-lg">
          <span class="text-blue-600 text-sm">\u{1F4A1}</span>
        </div>
        <div>
          <h4 class="font-semibold text-blue-800 text-sm mb-2">Fungsi Dashboard Admin</h4>
          <ul class="text-blue-700 text-xs space-y-1">
            <li>\u2022 <strong>Urus Pengguna</strong> - Aktifkan/nyahaktifkan akaun pengguna</li>
            <li>\u2022 <strong>Urus Barang</strong> - Tambah dan kemaskini status inventori</li>
            <li>\u2022 <strong>Pantau Tempahan</strong> - Lihat semua aktiviti pinjaman</li>
            <li>\u2022 <strong>Laporan</strong> - Analisis penggunaan sistem</li>
            <li>\u2022 <strong>Tetapan</strong> - Konfigurasi sistem dan keselamatan</li>
          </ul>
        </div>
      </div>
    </div>

    ${getAdminBottomNavHTML("dashboard")}
  </div>
  
  <script>
    function handleLogout() {
      if (confirm('Adakah anda pasti ingin log keluar?')) {
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    // Load stats from API
    fetch('/api/admin/dashboard')
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          document.getElementById('totalUsers').textContent = data.data.total_users || 0;
          document.getElementById('totalBarang').textContent = data.data.total_barang || 0;
          document.getElementById('tempahanAktif').textContent = data.data.tempahan_aktif || 0;
          
          // Calculate active users (assuming all are active for now)
          document.getElementById('activeUsers').textContent = data.data.total_users + ' Aktif';
          document.getElementById('availableBarang').textContent = data.data.total_barang + ' Tersedia';
        }
      })
      .catch(err => {
        console.error('Failed to load dashboard stats:', err);
      });
  <\/script>
</body>
</html>`;
}
__name(getAdminDashboardHTML, "getAdminDashboardHTML");
function getUserBarangHTML() {
  return `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Barang - User</title>
  ${getFaviconHTML()}
  <script src="https://cdn.tailwindcss.com"><\/script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    body { font-family: 'Inter', sans-serif; }
  </style>
</head>
<body class="min-h-screen bg-gray-50 p-3 pb-20">
  <div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <button 
            onclick="window.location.href='/user/dashboard'"
            class="bg-gray-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-gray-600 transition-colors"
          >
            \u2190 Dashboard
          </button>
          <div class="text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
            <span class="text-xs font-medium">\u{1F4E6} BARANG</span>
          </div>
        </div>
        <button 
          onclick="handleLogout()"
          class="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors"
        >
          Log Keluar
        </button>
      </div>
      <div class="text-center">
        <h1 class="text-xl font-bold text-gray-900">\u{1F4E6} Senarai Barang ICT</h1>
        <p class="text-gray-600 text-sm mt-1">Lihat dan buat tempahan barang</p>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 gap-3 mb-4">
      <div class="bg-white rounded-xl shadow-sm p-3 text-center">
        <div class="text-lg font-bold text-blue-600">8</div>
        <div class="text-xs text-gray-600">Total Barang</div>
        <div class="text-xs text-blue-600 mt-1">Dalam inventori</div>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-3 text-center">
        <div class="text-lg font-bold text-green-600">7</div>
        <div class="text-xs text-gray-600">Tersedia</div>
        <div class="text-xs text-green-600 mt-1">Boleh dipinjam</div>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-3 text-center">
        <div class="text-lg font-bold text-yellow-600" id="tempahanCount">0</div>
        <div class="text-xs text-gray-600">Menunggu</div>
        <div class="text-xs text-yellow-600 mt-1">Kelulusan anda</div>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-3 text-center">
        <div class="text-lg font-bold text-purple-600">0</div>
        <div class="text-xs text-gray-600">Diluluskan</div>
        <div class="text-xs text-purple-600 mt-1">Tempahan anda</div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Carian Barang</label>
          <input
            type="text"
            id="carianInput"
            placeholder="Cari nama barang..."
            onkeyup="filterBarang()"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Filter Kategori</label>
          <select id="kategoriFilter" onchange="filterBarang()" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm">
            <option value="semua">Semua Kategori</option>
            <option value="elektronik">Elektronik</option>
            <option value="fotografi">Fotografi</option>
            <option value="alat-tulis">Alat Tulis</option>
            <option value="buku">Buku</option>
            <option value="audio">Audio</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Senarai Barang -->
    <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-semibold text-gray-900 text-sm">\u{1F4E6} Senarai Barang ICT</h2>
        <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full" id="barangCount">8 barang</span>
      </div>
      <div id="barangList" class="space-y-3">
        <!-- Barang akan diload oleh JavaScript -->
      </div>
    </div>

    <!-- Info Section -->
    <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
      <div class="flex items-start gap-3">
        <div class="bg-blue-100 p-2 rounded-lg">
          <span class="text-blue-600 text-sm">\u{1F4A1}</span>
        </div>
        <div>
          <h4 class="font-semibold text-blue-800 text-sm mb-2">Proses Tempahan</h4>
          <ul class="text-blue-700 text-xs space-y-1">
            <li>\u2022 <strong>Klik "Buat Tempahan"</strong> - Barang akan ditempah</li>
            <li>\u2022 <strong>Menunggu Kelulusan</strong> - Staff ICT akan semak</li>
            <li>\u2022 <strong>Notifikasi Email</strong> - Anda akan dapat email bila status berubah</li>
            <li>\u2022 <strong>Ambil Barang</strong> - Di Kaunter ICT setelah diluluskan</li>
          </ul>
        </div>
      </div>
    </div>

    ${getUserBottomNavHTML("barang")}
  </div>

  <script>
    let senaraiBarang = [];
    let tempahanSaya = [];

    // Load barang from D1 database
    async function loadBarang() {
      try {
        // Load barang
        const response = await fetch('/api/user/barang');
        if (!response.ok) throw new Error('Failed to load barang');
        const data = await response.json();
        senaraiBarang = data.barang || [];
        
        // Load user's tempahan
        const tempahanResponse = await fetch('/api/user/tempahan');
        if (tempahanResponse.ok) {
          const tempahanData = await tempahanResponse.json();
          const myTempahan = tempahanData.data || [];
          tempahanSaya = myTempahan.map(t => t.barangId);
          document.getElementById('tempahanCount').textContent = myTempahan.filter(t => t.status === 'Pending' || t.status === 'Diluluskan').length;
        }
        
        // Update stats
        const tersedia = senaraiBarang.filter(b => b.status.toLowerCase() === 'tersedia').length;
        document.querySelector('.grid .bg-white:first-child .text-blue-600').textContent = senaraiBarang.length;
        document.querySelector('.grid .bg-white:nth-child(2) .text-green-600').textContent = tersedia;
        
        renderBarang(senaraiBarang);
      } catch (error) {
        console.error('Error loading barang:', error);
        document.getElementById('barangList').innerHTML = '<div class="text-center py-8"><div class="text-4xl mb-2">\u274C</div><p class="text-red-500 text-sm">Error memuat barang. Sila refresh.</p></div>';
      }
    }

    function handleLogout() {
      if (confirm('Adakah anda pasti ingin log keluar?')) {
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    function getKategoriColor(kategori) {
      const colors = {
        'elektronik': 'bg-blue-100 text-blue-800',
        'fotografi': 'bg-purple-100 text-purple-800',
        'alat-tulis': 'bg-orange-100 text-orange-800',
        'buku': 'bg-green-100 text-green-800',
        'audio': 'bg-pink-100 text-pink-800'
      };
      return colors[kategori] || 'bg-gray-100 text-gray-800';
    }

    function getStatusColor(status) {
      return status === 'tersedia' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    }

    function getGambar(kategori) {
      const gambar = {
        'elektronik': '\u{1F4BB}',
        'fotografi': '\u{1F4F7}',
        'alat-tulis': '\u{1F9EE}',
        'buku': '\u{1F4DA}',
        'audio': '\u{1F3A4}'
      };
      return gambar[kategori] || '\u{1F4E6}';
    }

    async function handlePinjam(barang) {
      if (tempahanSaya.includes(barang.id)) {
        alert('Anda sudah meminjam ' + barang.namaBarang);
        return;
      }

      // Get user from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.id) {
        alert('Sila login semula');
        window.location.href = '/login';
        return;
      }

      // Create tempahan
      try {
        const response = await fetch('/api/user/tempahan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            barangId: barang.id,
            kuantiti: 1,
            tarikhMula: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            tarikhTamat: new Date(Date.now() + 7*86400000).toISOString().split('T')[0],
            tujuan: 'Tempahan dari halaman barang'
          })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to create tempahan');
        }

        tempahanSaya.push(barang.id);
        document.getElementById('tempahanCount').textContent = tempahanSaya.length;
        alert('\u2705 BERJAYA MEMINJAM!\\n\\n\u{1F4E6} ' + barang.namaBarang + '\\n\\nStatus: MENUNGGU KELULUSAN STAFF ICT');
        renderBarang(senaraiBarang);
      } catch (error) {
        console.error('Error creating tempahan:', error);
        alert('\u274C Error: ' + error.message);
      }
    }

    function filterBarang() {
      const carian = document.getElementById('carianInput').value.toLowerCase();
      const kategori = document.getElementById('kategoriFilter').value;
      
      const filtered = senaraiBarang.filter(b => {
        const matchCarian = b.nama.toLowerCase().includes(carian) || b.deskripsi.toLowerCase().includes(carian);
        const matchKategori = kategori === 'semua' || b.kategori === kategori;
        return matchCarian && matchKategori;
      });
      
      renderBarang(filtered);
      document.getElementById('barangCount').textContent = filtered.length + ' barang';
    }

    function renderBarang(barangList) {
      const container = document.getElementById('barangList');
      if (barangList.length === 0) {
        container.innerHTML = '<div class="text-center py-8"><div class="text-4xl mb-2">\u{1F4E6}</div><p class="text-gray-500 text-sm">Tiada barang ditemui</p></div>';
        return;
      }

      container.innerHTML = barangList.map(barang => {
        const sudahDipinjam = tempahanSaya.includes(barang.id);
        const bolehPinjam = barang.status.toLowerCase() === 'tersedia' && !sudahDipinjam && barang.kuantitiTersedia > 0;
        const gambar = getGambar(barang.kategori);
        
        return \`
          <div class="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
            <div class="flex flex-col gap-3">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="text-lg">\${gambar}</span>
                    <h3 class="font-semibold text-gray-900 text-sm">\${barang.namaBarang}</h3>
                  </div>
                  <p class="text-gray-600 text-xs mb-2">\${barang.catatan || 'Barang ICT ILKKM'}</p>
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="text-gray-500 text-xs">\u{1F4CD} \${barang.lokasi}</span>
                    <span class="text-gray-500 text-xs">\u{1F4CA} Tersedia: \${barang.kuantitiTersedia}</span>
                    <span class="\${getKategoriColor(barang.kategori)} text-xs px-2 py-1 rounded">
                      \${barang.kategori.charAt(0).toUpperCase() + barang.kategori.slice(1)}
                    </span>
                    <span class="\${getStatusColor(barang.status)} text-xs px-2 py-1 rounded">
                      \${barang.status.charAt(0).toUpperCase() + barang.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onclick='handlePinjam(\${JSON.stringify(barang).replace(/'/g, "&apos;")})'
                \${!bolehPinjam ? 'disabled' : ''}
                class="w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors \${
                  bolehPinjam 
                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                    : sudahDipinjam 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-red-300 text-red-500 cursor-not-allowed'
                }"
              >
                \${bolehPinjam ? '\u{1F4CB} Buat Tempahan' : sudahDipinjam ? '\u2705 Ditempah' : '\u274C Tidak Tersedia'}
              </button>
            </div>
          </div>
        \`;
      }).join('');
    }

    // Load barang on page load
    loadBarang();
  <\/script>
</body>
</html>`;
}
__name(getUserBarangHTML, "getUserBarangHTML");
function getUserProfileHTML() {
  return `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Profil - User</title>
  ${getFaviconHTML()}
  <script src="https://cdn.tailwindcss.com"><\/script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    body { font-family: 'Inter', sans-serif; }
  </style>
</head>
<body class="min-h-screen bg-gray-50 p-3 pb-20">
  <div class="max-w-4xl mx-auto">
    <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <button 
            onclick="window.location.href='/user/dashboard'"
            class="bg-gray-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-gray-600 transition-colors"
          >
            \u2190 Dashboard
          </button>
          <div class="text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
            <span class="text-xs font-medium">\u{1F464} PROFIL</span>
          </div>
        </div>
        <button 
          onclick="handleLogout()"
          class="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors"
        >
          Log Keluar
        </button>
      </div>
      <div class="text-center">
        <h1 class="text-xl font-bold text-gray-900">\u{1F464} Maklumat Peribadi</h1>
        <p class="text-gray-600 text-sm mt-1">Kemaskini maklumat profil anda</p>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <div class="bg-blue-100 p-3 rounded-full">
            <span class="text-blue-600 text-lg">\u{1F464}</span>
          </div>
          <div>
            <h2 class="font-semibold text-gray-900 text-sm" id="userName">Loading...</h2>
            <p class="text-gray-600 text-xs" id="userInfo">-</p>
          </div>
        </div>
        <button 
          onclick="alert('Edit profile feature coming soon!')"
          class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
        >
          \u270F\uFE0F Edit Profil
        </button>
      </div>

      <div class="space-y-4" id="profileData">
        <div class="text-center py-8">
          <div class="animate-pulse">Loading profile...</div>
        </div>
      </div>
    </div>

    <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
      <div class="flex items-start gap-3">
        <div class="bg-blue-100 p-2 rounded-lg">
          <span class="text-blue-600 text-sm">\u{1F4A1}</span>
        </div>
        <div>
          <h4 class="font-semibold text-blue-800 text-sm mb-2">Maklumat Profil</h4>
          <ul class="text-blue-700 text-xs space-y-1">
            <li>\u2022 Maklumat profil digunakan untuk proses pinjaman barang</li>
            <li>\u2022 Pastikan maklumat anda sentiasa dikemaskini</li>
          </ul>
        </div>
      </div>
    </div>

    ${getUserBottomNavHTML("profile")}
  </div>
  <script>
    // Fetch user profile from D1
    async function loadProfile() {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = user.id || 'user_003';
        const response = await fetch('/api/user/profile?userId=' + userId);
        const result = await response.json();
        
        if (result.success) {
          const user = result.data;
          document.getElementById('userName').textContent = user.nama;
          document.getElementById('userInfo').textContent = user.peranan.toUpperCase();
          
          const profileHTML = \`
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Nama Penuh</label>
              <div class="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-900">\${user.nama}</div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              \${user.no_matrik ? \`
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">No. Matrik</label>
                <div class="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-900">\${user.no_matrik}</div>
              </div>
              \` : ''}
              \${user.no_staf ? \`
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">No. Staf</label>
                <div class="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-900">\${user.no_staf}</div>
              </div>
              \` : ''}
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Email</label>
                <div class="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-900">\${user.email}</div>
              </div>
            </div>
            \${user.fakulti ? \`
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Fakulti</label>
              <div class="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-900">\${user.fakulti}</div>
            </div>
            \` : ''}
            \${user.no_telefon ? \`
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">No. Telefon</label>
              <div class="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-900">\${user.no_telefon}</div>
            </div>
            \` : ''}
          \`;
          
          document.getElementById('profileData').innerHTML = profileHTML;
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        document.getElementById('profileData').innerHTML = '<div class="text-center py-8 text-red-600">Gagal memuatkan profil</div>';
      }
    }
    
    // Load profile on page load
    loadProfile();
    
    function handleLogout() {
      if (confirm('Adakah anda pasti ingin log keluar?')) {
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
  <\/script>
</body>
</html>`;
}
__name(getUserProfileHTML, "getUserProfileHTML");
function getUserSejarahHTML() {
  return `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sejarah - User</title>
  ${getFaviconHTML()}
  <script src="https://cdn.tailwindcss.com"><\/script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    body { font-family: 'Inter', sans-serif; }
  </style>
</head>
<body class="min-h-screen bg-gray-50 p-3 pb-20">
  <div class="max-w-6xl mx-auto">
    <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <button 
            onclick="window.location.href='/user/dashboard'"
            class="bg-gray-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-gray-600 transition-colors"
          >
            \u2190 Dashboard
          </button>
          <div class="text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
            <span class="text-xs font-medium">\u{1F4CA} SEJARAH</span>
          </div>
        </div>
        <button 
          onclick="handleLogout()"
          class="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors"
        >
          Log Keluar
        </button>
      </div>
      <div class="text-center">
        <h1 class="text-xl font-bold text-gray-900">\u{1F4CA} Sejarah Tempahan</h1>
        <p class="text-gray-600 text-sm mt-1">Lihat semua tempahan dan status terkini</p>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3 mb-4">
      <div class="bg-white rounded-xl shadow-sm p-3 text-center">
        <div class="text-lg font-bold text-blue-600">6</div>
        <div class="text-xs text-gray-600">Total</div>
        <div class="text-xs text-blue-600 mt-1">Semua tempahan</div>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-3 text-center">
        <div class="text-lg font-bold text-yellow-600">1</div>
        <div class="text-xs text-gray-600">Menunggu</div>
        <div class="text-xs text-yellow-600 mt-1">Sedang diproses</div>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-3 text-center">
        <div class="text-lg font-bold text-green-600">2</div>
        <div class="text-xs text-gray-600">Diluluskan</div>
        <div class="text-xs text-green-600 mt-1">Boleh diambil</div>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-3 text-center">
        <div class="text-lg font-bold text-red-600">1</div>
        <div class="text-xs text-gray-600">Ditolak</div>
        <div class="text-xs text-red-600 mt-1">Tidak diluluskan</div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
      <h2 class="font-semibold text-gray-900 text-sm mb-4">\u{1F4CB} Senarai Tempahan</h2>
      <div class="space-y-3">
        <div class="border border-yellow-200 bg-yellow-50 rounded-lg p-3">
          <div class="flex justify-between items-start mb-2">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-lg">\u{1F4BB}</span>
                <h3 class="font-semibold text-gray-900 text-sm">Laptop Dell XPS 13</h3>
              </div>
              <p class="text-gray-600 text-xs">\u{1F4CD} Makmal Komputer 1</p>
            </div>
            <span class="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded border border-yellow-200 font-medium">
              \u23F3 Menunggu
            </span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div class="bg-white rounded p-2">
              <span class="text-gray-500">Pinjam:</span>
              <p class="text-gray-900 mt-1">16 Jan 2024</p>
            </div>
            <div class="bg-white rounded p-2">
              <span class="text-gray-500">Pulang:</span>
              <p class="text-gray-900 mt-1">23 Jan 2024</p>
            </div>
          </div>
        </div>

        <div class="border border-green-200 bg-green-50 rounded-lg p-3">
          <div class="flex justify-between items-start mb-2">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-lg">\u{1F4F7}</span>
                <h3 class="font-semibold text-gray-900 text-sm">Kamera Canon EOS R6</h3>
              </div>
              <p class="text-gray-600 text-xs">\u{1F4CD} Unit Media</p>
            </div>
            <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded border border-green-200 font-medium">
              \u2705 Diluluskan
            </span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div class="bg-white rounded p-2">
              <span class="text-gray-500">Pinjam:</span>
              <p class="text-gray-900 mt-1">11 Jan 2024</p>
            </div>
            <div class="bg-white rounded p-2">
              <span class="text-gray-500">Pulang:</span>
              <p class="text-gray-900 mt-1">18 Jan 2024</p>
            </div>
          </div>
          <div class="p-2 bg-green-100 border border-green-200 rounded-lg mt-2">
            <p class="text-green-700 text-xs">
              \u2705 <strong>Diluluskan oleh:</strong> Ahmad (Staff ICT)
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
      <div class="flex items-start gap-3">
        <div class="bg-blue-100 p-2 rounded-lg">
          <span class="text-blue-600 text-sm">\u{1F4A1}</span>
        </div>
        <div>
          <h4 class="font-semibold text-blue-800 text-sm mb-2">Maklumat Status</h4>
          <ul class="text-blue-700 text-xs space-y-1">
            <li>\u2022 <strong>Menunggu</strong> - Staff ICT sedang proses permohonan</li>
            <li>\u2022 <strong>Diluluskan</strong> - Tempahan diluluskan, boleh ambil barang</li>
            <li>\u2022 <strong>Ditolak</strong> - Tempahan tidak diluluskan</li>
          </ul>
        </div>
      </div>
    </div>

    ${getUserBottomNavHTML("sejarah")}
  </div>
  <script>
    function handleLogout() {
      if (confirm('Adakah anda pasti ingin log keluar?')) {
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
  <\/script>
</body>
</html>`;
}
__name(getUserSejarahHTML, "getUserSejarahHTML");
function getUserTempahanHTML() {
  return `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tempahan - User</title>
  ${getFaviconHTML()}
  <script src="https://cdn.tailwindcss.com"><\/script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    body { font-family: 'Inter', sans-serif; }
  </style>
</head>
<body class="min-h-screen bg-gray-50 p-4">
  <div class="max-w-6xl mx-auto">
    <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div class="text-center sm:text-left">
          <h1 class="text-xl sm:text-2xl font-bold text-gray-900">\u{1F4CB} Buat Tempahan Baru</h1>
          <p class="text-gray-600 text-sm">Pinjam barang ICT ILKKM</p>
        </div>
        <button 
          onclick="window.location.href='/user/dashboard'"
          class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm"
        >
          \u2190 Kembali
        </button>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm p-4 mb-6">
      <h2 class="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Maklumat Tempahan</h2>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Pilih Barang *</label>
          <select id="barangSelect" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm">
            <option value="">-- Sila pilih barang --</option>
            <option value="1">\u{1F4BB} Laptop Dell XPS 13 - Makmal Komputer 1</option>
            <option value="2">\u{1F4FD}\uFE0F Projector Epson EB-X41 - Bilik Media</option>
            <option value="3">\u{1F4F7} Kamera Canon EOS R6 - Unit Media</option>
          </select>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tarikh Pinjam *</label>
            <input type="date" id="tarikhPinjam" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tarikh Pulang *</label>
            <input type="date" id="tarikhPulang" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm">
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nota Tambahan</label>
          <textarea id="nota" rows="4" placeholder="Contoh: Untuk kelas multimedia..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"></textarea>
        </div>

        <button 
          onclick="handleHantarTempahan()"
          class="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
        >
          \u{1F4CB} Hantar Tempahan untuk Kelulusan
        </button>
      </div>
    </div>

    <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-20">
      <h3 class="font-semibold text-yellow-800 text-sm mb-3">\u{1F4A1} Makluman Penting</h3>
      <ul class="text-yellow-700 text-xs space-y-2">
        <li>\u2022 <strong>Tempoh maksimum:</strong> 7 hari</li>
        <li>\u2022 <strong>Kelulusan:</strong> Diperlukan dari Staff ICT</li>
        <li>\u2022 <strong>Waktu ambil:</strong> 8:30 PG - 5:30 PTG</li>
      </ul>
    </div>

    ${getUserBottomNavHTML("tempahan")}
  </div>

  <script>
    function handleHantarTempahan() {
      const barang = document.getElementById('barangSelect').value;
      const tarikhPinjam = document.getElementById('tarikhPinjam').value;
      const tarikhPulang = document.getElementById('tarikhPulang').value;
      
      if (!barang || !tarikhPinjam || !tarikhPulang) {
        alert('Sila lengkapkan semua maklumat bertanda (*)!');
        return;
      }
      
      alert('\u2705 TEMPAHAN BERJAYA DIBUAT!\\n\\nStatus: MENUNGGU KELULUSAN STAFF ICT\\n\\nStaff ICT akan semak tempahan anda dalam 24 jam.');
      window.location.href = '/user/sejarah';
    }
  <\/script>
</body>
</html>`;
}
__name(getUserTempahanHTML, "getUserTempahanHTML");
function getStaffDashboardHTML() {
  return `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Staff ICT Dashboard - iBorrow</title>
  ${getFaviconHTML()}
  <script src="https://cdn.tailwindcss.com"><\/script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    body { font-family: 'Inter', sans-serif; }
  </style>
</head>
<body class="bg-gray-50">
  <div class="min-h-screen p-3 pb-24">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <div class="text-blue-600 bg-blue-100 px-2 py-1 rounded-full flex items-center gap-1">
              <span class="text-sm">\u{1F3E0}</span>
              <span class="text-xs font-medium">STAFF ICT</span>
            </div>
          </div>
          <button onclick="handleLogKeluar()" class="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors">
            Log Keluar
          </button>
        </div>
        
        <div class="text-center">
          <h1 class="text-xl font-bold text-gray-900">Dashboard Staff ICT</h1>
          <p class="text-gray-600 text-sm mt-1">Urus tempahan dan barang ICT ILKKM</p>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div class="bg-white rounded-xl shadow-sm p-3 text-center">
          <div class="text-lg font-bold text-blue-600" id="tempahanBaru">3</div>
          <div class="text-xs text-gray-600">Tempahan Baru</div>
          <div class="text-xs text-yellow-600 mt-1">Perlu kelulusan</div>
        </div>
        
        <div class="bg-white rounded-xl shadow-sm p-3 text-center">
          <div class="text-lg font-bold text-green-600" id="pinjamanAktif">1</div>
          <div class="text-xs text-gray-600">Pinjaman Aktif</div>
          <div class="text-xs text-blue-600 mt-1">Sedang dipinjam</div>
        </div>
        
        <div class="bg-white rounded-xl shadow-sm p-3 text-center">
          <div class="text-lg font-bold text-purple-600" id="totalBarang">5</div>
          <div class="text-xs text-gray-600">Total Barang</div>
          <div class="text-xs text-green-600 mt-1"><span id="barangTersedia">3</span> Tersedia</div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-3 text-center">
          <div class="text-lg font-bold text-red-600" id="barangRosak">1</div>
          <div class="text-xs text-gray-600">Barang Rosak</div>
          <div class="text-xs text-red-600 mt-1">Perbaikan diperlukan</div>
        </div>
      </div>

      <!-- Tempahan Perlu Kelulusan -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <div class="flex items-center justify-between mb-3">
          <h2 class="font-semibold text-gray-900 text-sm">\u{1F4CB} Tempahan Perlu Kelulusan</h2>
          <div class="flex items-center gap-2">
            <span class="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full" id="countMenunggu">3 menunggu</span>
            <button onclick="window.location.href='/staff-ict/kelulusan'" class="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition-colors">
              Lihat Semua
            </button>
          </div>
        </div>
        
        <div id="tempahanList" class="space-y-2"></div>
      </div>

      <!-- Urus Status Barang -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-20">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <h2 class="font-semibold text-gray-900 text-sm">\u{1F4E6} Urus Status Barang</h2>
            <button onclick="window.location.href='/staff-ict/barang'" class="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 transition-colors">
              Urus Barang
            </button>
          </div>
          <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full" id="countBarang">5 barang</span>
        </div>
        
        <div id="barangList" class="space-y-2"></div>
      </div>

      ${getStaffBottomNavHTML("dashboard")}
    </div>
  </div>

  <script>
    let tempahan = [];
    let senaraiBarang = [];

    // Load real data from D1
    async function loadDashboardData() {
      try {
        // Load tempahan pending
        const tempahanRes = await fetch('/api/staff-ict/kelulusan');
        const tempahanData = await tempahanRes.json();
        tempahan = tempahanData.data || [];
        console.log('Loaded tempahan:', tempahan.length, tempahan);

        // Load barang
        const barangRes = await fetch('/api/admin/barang');
        const barangData = await barangRes.json();
        senaraiBarang = barangData.barang || [];
        console.log('Loaded barang:', senaraiBarang.length);

        // Update stats
        document.getElementById('perluKelulusan').textContent = tempahan.length;
        document.getElementById('totalBarang').textContent = senaraiBarang.length;
        
        renderTempahan();
        renderBarang();
      } catch (error) {
        console.error('Error loading dashboard:', error);
      }
    }

    function handleLogKeluar() {
      if (confirm('Adakah anda pasti ingin log keluar?')) {
        window.location.href = '/login';
      }
    }

    function getStatusColor(status) {
      const colors = {
        tersedia: 'bg-green-100 text-green-800',
        dipinjam: 'bg-blue-100 text-blue-800',
        rosak: 'bg-red-100 text-red-800',
        menunggu: 'bg-yellow-100 text-yellow-800'
      };
      return colors[status] || 'bg-gray-100 text-gray-800';
    }

    function getStatusText(status) {
      const texts = {
        tersedia: 'Tersedia',
        dipinjam: 'Dipinjam',
        rosak: 'Rosak',
        menunggu: 'Menunggu'
      };
      return texts[status] || status;
    }

    function handleKelulusan(id, status) {
      const item = tempahan.find(t => t.id === id);
      if (!item) return;
      
      if (confirm(\`Adakah anda pasti ingin \${status === 'lulus' ? 'meluluskan' : 'menolak'} tempahan ini?\`)) {
        alert(\`Tempahan \${status === 'lulus' ? 'diluluskan' : 'ditolak'}!\`);
        window.location.reload();
      }
    }

    function handleUpdateStatusBarang(id, statusBaru) {
      if (confirm('Adakah anda pasti ingin mengemas kini status barang ini?')) {
        alert('Status barang berjaya dikemaskini!');
        window.location.reload();
      }
    }

    // Render tempahan list
    function renderTempahan() {
      const container = document.getElementById('tempahanList');
      const tempahanMenunggu = tempahan.filter(t => t.status === 'Pending');
      
      if (tempahanMenunggu.length === 0) {
        container.innerHTML = \`
          <div class="text-center py-4">
            <p class="text-gray-500 text-sm">Tiada tempahan menunggu kelulusan</p>
            <button onclick="window.location.href='/staff-ict/kelulusan'" class="text-blue-500 text-xs hover:text-blue-600 mt-2">
              Pergi ke halaman kelulusan \u2192
            </button>
          </div>
        \`;
        return;
      }

      container.innerHTML = tempahanMenunggu.map(item => \`
        <div class="border border-gray-200 rounded-lg p-2">
          <div class="flex flex-col gap-2">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-medium text-gray-900 text-sm">\${item.namaPemohon}</h3>
                <p class="text-gray-600 text-xs">\${item.namaBarang}</p>
                <p class="text-gray-500 text-xs">Tarikh: \${new Date(item.createdAt).toLocaleDateString('ms-MY')}</p>
              </div>
              <span class="\${getStatusColor(item.status.toLowerCase())} text-xs px-2 py-1 rounded">
                \${getStatusText(item.status.toLowerCase())}
              </span>
            </div>
            
            <div class="flex gap-2">
              <button onclick="handleKelulusan('\${item.id}', 'lulus')" class="flex-1 bg-green-500 text-white py-1 rounded text-xs hover:bg-green-600 transition-colors">
                \u2705 Lulus
              </button>
              <button onclick="handleKelulusan('\${item.id}', 'tolak')" class="flex-1 bg-red-500 text-white py-1 rounded text-xs hover:bg-red-600 transition-colors">
                \u274C Tolak
              </button>
            </div>
          </div>
        </div>
      \`).join('');
    }

    // Render barang list
    function renderBarang() {
      const container = document.getElementById('barangList');
      if (!senaraiBarang || senaraiBarang.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-xs text-center py-2">Tiada barang</p>';
        return;
      }
      
      container.innerHTML = senaraiBarang.slice(0, 3).map(barang => \`
        <div class="border border-gray-200 rounded-lg p-2">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <h3 class="font-medium text-gray-900 text-sm">\${barang.namaBarang}</h3>
              <div class="flex items-center gap-1 mt-1">
                <span class="bg-gray-100 text-gray-700 text-xs px-1 py-0.5 rounded">
                  \${barang.kategori}
                </span>
                <span class="\${getStatusColor(barang.status.toLowerCase())} text-xs px-1 py-0.5 rounded">
                  \${getStatusText(barang.status.toLowerCase())}
                </span>
              </div>
            </div>
            
            <select onchange="handleUpdateStatusBarang('\${barang.id}', this.value)" class="border border-gray-300 rounded-lg px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500">
              <option value="Tersedia" \${barang.status === 'Tersedia' ? 'selected' : ''}>Tersedia</option>
              <option value="Dipinjam" \${barang.status === 'Dipinjam' ? 'selected' : ''}>Dipinjam</option>
              <option value="Rosak" \${barang.status === 'Rosak' ? 'selected' : ''}>Rosak</option>
            </select>
          </div>
        </div>
      \`).join('');
      
      container.innerHTML += \`
        <button onclick="window.location.href='/staff-ict/barang'" class="w-full bg-green-50 text-green-700 py-2 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors">
          Lihat Semua Barang \u2192
        </button>
      \`;
    }

    // Initialize
    loadDashboardData();
  <\/script>
</body>
</html>`;
}
__name(getStaffDashboardHTML, "getStaffDashboardHTML");
function getStaffBarangHTML() {
  return `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Urus Barang - Staff ICT - iBorrow</title>
  ${getFaviconHTML()}
  <script src="https://cdn.tailwindcss.com"><\/script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    body { font-family: 'Inter', sans-serif; }
  </style>
</head>
<body class="bg-gray-50">
  <div class="min-h-screen p-3 pb-24">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <button onclick="window.location.href='/staff-ict/dashboard'" class="bg-gray-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-gray-600 transition-colors flex items-center gap-1">
              \u2190 Dashboard
            </button>
            <div class="text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
              <span class="text-xs font-medium">\u{1F4E6} BARANG</span>
            </div>
          </div>
          <button onclick="handleLogKeluar()" class="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors">
            Log Keluar
          </button>
        </div>
        
        <div class="text-center">
          <h1 class="text-xl font-bold text-gray-900">\u{1F4E6} Urus Barang ICT</h1>
          <p class="text-gray-600 text-sm mt-1">Manage inventori barang ICT ILKKM</p>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div class="bg-white rounded-xl shadow-sm p-3 text-center">
          <div class="text-lg font-bold text-blue-600" id="statTotal">8</div>
          <div class="text-xs text-gray-600">Total Barang</div>
        </div>
        
        <div class="bg-white rounded-xl shadow-sm p-3 text-center">
          <div class="text-lg font-bold text-green-600" id="statTersedia">6</div>
          <div class="text-xs text-gray-600">Tersedia</div>
          <div class="text-xs text-green-600 mt-1">Boleh dipinjam</div>
        </div>
        
        <div class="bg-white rounded-xl shadow-sm p-3 text-center">
          <div class="text-lg font-bold text-orange-600" id="statDipinjam">1</div>
          <div class="text-xs text-gray-600">Dipinjam</div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-3 text-center">
          <div class="text-lg font-bold text-red-600" id="statRosak">1</div>
          <div class="text-xs text-gray-600">Rosak</div>
          <div class="text-xs text-red-600 mt-1">Perbaikan</div>
        </div>
      </div>

      <!-- Bulk Actions (hidden initially) -->
      <div id="bulkActions" class="hidden bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 class="font-semibold text-yellow-800 text-sm">
              \u{1F4CB} <span id="selectedCount">0</span> barang dipilih
            </h3>
            <p class="text-yellow-700 text-xs mt-1">Pilih tindakan yang ingin dilakukan</p>
          </div>
          <div class="flex gap-2">
            <button onclick="handleBulkDelete()" class="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors text-xs">
              \u{1F5D1}\uFE0F Padam Dipilih
            </button>
            <button onclick="clearSelection()" class="bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors text-xs">
              \u2717 Batal Pilih
            </button>
          </div>
        </div>
      </div>

      <!-- Filters & Search -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Carian Barang</label>
            <input type="text" id="searchInput" placeholder="Cari nama, kod atau deskripsi..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" oninput="filterBarang()">
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Kategori</label>
            <select id="filterKategori" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" onchange="filterBarang()">
              <option value="semua">Semua Kategori</option>
              <option value="elektronik">Elektronik</option>
              <option value="fotografi">Fotografi</option>
              <option value="alat-tulis">Alat Tulis</option>
              <option value="audio">Audio</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Status</label>
            <select id="filterStatus" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" onchange="filterBarang()">
              <option value="semua">Semua Status</option>
              <option value="tersedia">Tersedia</option>
              <option value="dipinjam">Dipinjam</option>
              <option value="rosak">Rosak</option>
              <option value="servis">Servis</option>
            </select>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
          <div class="flex-1">
            <label class="block text-xs font-medium text-gray-700 mb-1">Tambah Barang</label>
            <button onclick="openModalTambah()" class="w-full bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm">
              + Tambah Barang
            </button>
          </div>
          
          <div class="flex-1">
            <label class="block text-xs font-medium text-gray-700 mb-1">Hasil Carian</label>
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center w-full">
              <p class="text-blue-800 font-semibold text-sm">
                <span id="countDitemui">8</span> barang
              </p>
              <p class="text-blue-600 text-xs">ditemui</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Senarai Barang -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-semibold text-gray-900 text-sm">Senarai Barang ICT</h2>
          <div class="flex items-center gap-3">
            <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full" id="countBarang">8 barang</span>
            <div class="flex items-center gap-2">
              <input type="checkbox" id="selectAll" onchange="toggleSelectAll()" class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500">
              <span class="text-xs text-gray-600">Pilih Semua</span>
            </div>
          </div>
        </div>
        
        <div id="barangList" class="space-y-3"></div>
      </div>

      ${getStaffBottomNavHTML("barang")}
    </div>
  </div>

  <!-- Modal Tambah Barang -->
  <div id="modalTambah" class="hidden fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-xl shadow-xl p-4 w-full max-w-sm mx-4 border border-gray-200">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-base font-semibold text-gray-900">Tambah Barang Baru</h3>
        <button onclick="closeModalTambah()" class="text-gray-400 hover:text-gray-600 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <div class="space-y-3">
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Nama Barang *</label>
          <input type="text" id="tambahNama" placeholder="Laptop Dell XPS 13" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm">
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Kod Barang *</label>
          <input type="text" id="tambahKod" placeholder="ICT-LAP-001" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm">
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Kategori</label>
            <select id="tambahKategori" class="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm">
              <option value="elektronik">Elektronik</option>
              <option value="fotografi">Fotografi</option>
              <option value="alat-tulis">Alat Tulis</option>
              <option value="audio">Audio</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Status</label>
            <select id="tambahStatus" class="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm">
              <option value="Tersedia">Tersedia</option>
              <option value="Rosak">Rosak</option>
              <option value="Diselenggara">Diselenggara</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Kuantiti Total *</label>
            <input type="number" id="tambahKuantitiTotal" value="1" min="1" class="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm">
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Kuantiti Tersedia *</label>
            <input type="number" id="tambahKuantitiTersedia" value="1" min="0" class="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm">
          </div>
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Lokasi *</label>
          <input type="text" id="tambahLokasi" placeholder="Makmal Komputer 1" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm">
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Deskripsi</label>
          <textarea id="tambahDeskripsi" rows="2" placeholder="Deskripsi barang..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"></textarea>
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Nota (Optional)</label>
          <textarea id="tambahNota" rows="2" placeholder="Nota tambahan..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"></textarea>
        </div>
      </div>

      <div class="flex gap-2 mt-4">
        <button onclick="closeModalTambah()" class="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors text-xs font-medium">
          Batal
        </button>
        <button onclick="handleTambahBarang()" class="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors text-xs font-medium">
          Tambah Barang
        </button>
      </div>
    </div>
  </div>

  <!-- Modal Edit Barang -->
  <div id="modalEdit" class="hidden fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-xl shadow-xl p-4 w-full max-w-sm mx-4 border border-gray-200">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-base font-semibold text-gray-900">Edit Barang</h3>
        <button onclick="closeModalEdit()" class="text-gray-400 hover:text-gray-600 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <div class="space-y-3">
        <input type="hidden" id="editId">
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Nama Barang *</label>
          <input type="text" id="editNama" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm">
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Kod Barang *</label>
          <input type="text" id="editKod" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm">
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Kategori</label>
            <select id="editKategori" class="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm">
              <option value="elektronik">Elektronik</option>
              <option value="fotografi">Fotografi</option>
              <option value="alat-tulis">Alat Tulis</option>
              <option value="audio">Audio</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Status</label>
            <select id="editStatus" class="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm">
              <option value="Tersedia">Tersedia</option>
              <option value="Dipinjam">Dipinjam</option>
              <option value="Rosak">Rosak</option>
              <option value="Diselenggara">Diselenggara</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Kuantiti Total *</label>
            <input type="number" id="editKuantitiTotal" min="1" class="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm">
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Kuantiti Tersedia *</label>
            <input type="number" id="editKuantitiTersedia" min="0" class="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm">
          </div>
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Lokasi *</label>
          <input type="text" id="editLokasi" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm">
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Deskripsi</label>
          <textarea id="editDeskripsi" rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"></textarea>
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Nota (Optional)</label>
          <textarea id="editNota" rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"></textarea>
        </div>
      </div>

      <div class="flex gap-2 mt-4">
        <button onclick="closeModalEdit()" class="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors text-xs font-medium">
          Batal
        </button>
        <button onclick="handleUpdateBarang()" class="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors text-xs font-medium">
          Kemaskini
        </button>
      </div>
    </div>
  </div>

  <script>
    let senaraiBarang = [];
    let selectedBarang = [];

    // Load barang from D1 database
    async function loadBarang() {
      try {
        const response = await fetch('/api/admin/barang');
        if (!response.ok) throw new Error('Failed to load barang');
        const data = await response.json();
        senaraiBarang = data.barang || [];
        
        updateStats();
        filterBarang();
      } catch (error) {
        console.error('Error loading barang:', error);
        document.getElementById('barangList').innerHTML = '<div class="text-center py-8"><div class="text-4xl mb-2">\u274C</div><p class="text-red-500 text-sm">Error memuat barang. Sila refresh.</p></div>';
      }
    }

    function handleLogKeluar() {
      if (confirm('Adakah anda pasti ingin log keluar?')) {
        window.location.href = '/login';
      }
    }

    function getGambar(kategori) {
      const icons = {
        elektronik: '\u{1F4BB}',
        fotografi: '\u{1F4F7}',
        'alat-tulis': '\u270F\uFE0F',
        buku: '\u{1F4DA}',
        audio: '\u{1F3A4}'
      };
      return icons[kategori] || '\u{1F4E6}';
    }

    function getKategoriColor(kategori) {
      const colors = {
        elektronik: 'bg-blue-100 text-blue-800',
        fotografi: 'bg-purple-100 text-purple-800',
        'alat-tulis': 'bg-orange-100 text-orange-800',
        audio: 'bg-pink-100 text-pink-800'
      };
      return colors[kategori] || 'bg-gray-100 text-gray-800';
    }

    function getKategoriText(kategori) {
      const texts = {
        elektronik: 'Elektronik',
        fotografi: 'Fotografi',
        'alat-tulis': 'Alat Tulis',
        audio: 'Audio'
      };
      return texts[kategori] || kategori;
    }

    function getStatusColor(status) {
      const s = status.toLowerCase();
      const colors = {
        tersedia: 'bg-green-100 text-green-800',
        dipinjam: 'bg-blue-100 text-blue-800',
        rosak: 'bg-red-100 text-red-800',
        servis: 'bg-yellow-100 text-yellow-800',
        diselenggara: 'bg-yellow-100 text-yellow-800'
      };
      return colors[s] || 'bg-gray-100 text-gray-800';
    }

    function getStatusText(status) {
      return status;
    }

    function updateStats() {
      const stats = {
        total: senaraiBarang.length,
        tersedia: senaraiBarang.filter(b => b.status.toLowerCase() === 'tersedia').length,
        dipinjam: senaraiBarang.filter(b => b.status.toLowerCase() === 'dipinjam').length,
        rosak: senaraiBarang.filter(b => b.status.toLowerCase() === 'rosak').length
      };
      
      document.getElementById('statTotal').textContent = stats.total;
      document.getElementById('statTersedia').textContent = stats.tersedia;
      document.getElementById('statDipinjam').textContent = stats.dipinjam;
      document.getElementById('statRosak').textContent = stats.rosak;
    }

    function filterBarang() {
      const search = document.getElementById('searchInput').value.toLowerCase();
      const kategori = document.getElementById('filterKategori').value;
      const status = document.getElementById('filterStatus').value;

      const filtered = senaraiBarang.filter(barang => {
        const matchSearch = barang.namaBarang.toLowerCase().includes(search) || 
                           barang.kodBarang.toLowerCase().includes(search) ||
                           (barang.catatan || '').toLowerCase().includes(search);
        const matchKategori = kategori === 'semua' || barang.kategori === kategori;
        const matchStatus = status === 'semua' || barang.status === status;
        return matchSearch && matchKategori && matchStatus;
      });

      renderBarang(filtered);
      document.getElementById('countDitemui').textContent = filtered.length;
      document.getElementById('countBarang').textContent = filtered.length + ' barang';
    }

    function renderBarang(barangList = senaraiBarang) {
      const container = document.getElementById('barangList');
      
      if (barangList.length === 0) {
        container.innerHTML = \`
          <div class="text-center py-8">
            <div class="text-4xl mb-2">\u{1F4E6}</div>
            <p class="text-gray-500 text-sm">Tiada barang ditemui</p>
            <p class="text-gray-400 text-xs mt-1">Cuba ubah carian atau filter</p>
          </div>
        \`;
        return;
      }

      container.innerHTML = barangList.map(barang => {
        const gambar = getGambar(barang.kategori);
        return \`
        <div class="\${selectedBarang.includes(barang.id) ? 'ring-2 ring-blue-500' : ''} border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
          <div class="flex flex-col gap-3">
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-3">
                <input type="checkbox" \${selectedBarang.includes(barang.id) ? 'checked' : ''} onchange="toggleSelect('\${barang.id}')" class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-1">
                <div class="text-3xl">\${gambar}</div>
                <div>
                  <h3 class="font-semibold text-gray-900 text-sm">\${barang.namaBarang}</h3>
                  <p class="text-gray-600 text-xs">\${barang.catatan || 'Barang ICT'}</p>
                </div>
              </div>
              <span class="\${getStatusColor(barang.status)} text-xs px-2 py-1 rounded font-medium">
                \${getStatusText(barang.status)}
              </span>
            </div>

            <div class="grid grid-cols-2 gap-2 text-xs">
              <div class="bg-gray-50 rounded p-2">
                <span class="text-gray-500">Kod Barang:</span>
                <p class="font-mono text-gray-700 mt-1">\${barang.kodBarang}</p>
              </div>
              <div class="bg-gray-50 rounded p-2">
                <span class="text-gray-500">Lokasi:</span>
                <p class="text-gray-700 mt-1">\u{1F4CD} \${barang.lokasi}</p>
              </div>
              <div class="bg-gray-50 rounded p-2">
                <span class="text-gray-500">Tersedia:</span>
                <p class="text-gray-700 mt-1">\u{1F4CA} \${barang.kuantitiTersedia}</p>
              </div>
              <div class="bg-gray-50 rounded p-2">
                <span class="text-gray-500">Kategori:</span>
                <p class="text-gray-700 mt-1">
                  <span class="\${getKategoriColor(barang.kategori)} text-xs px-1 py-0.5 rounded">
                    \${getKategoriText(barang.kategori)}
                  </span>
                </p>
              </div>
            </div>

            \${barang.nota ? \`
              <div class="bg-yellow-50 border border-yellow-200 rounded p-2">
                <p class="text-yellow-700 text-xs">\u{1F4DD} \${barang.nota}</p>
              </div>
            \` : ''}

            <div class="flex flex-col gap-2 pt-2 border-t border-gray-100">
              <div class="flex-1">
                <label class="block text-xs font-medium text-gray-700 mb-1">Update Status</label>
                <select onchange="handleUpdateStatus('\${barang.id}', this.value)" class="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500">
                  <option value="Tersedia" \${barang.status === 'Tersedia' ? 'selected' : ''}>Tersedia</option>
                  <option value="Dipinjam" \${barang.status === 'Dipinjam' ? 'selected' : ''}>Dipinjam</option>
                  <option value="Rosak" \${barang.status === 'Rosak' ? 'selected' : ''}>Rosak</option>
                  <option value="Diselenggara" \${barang.status === 'Diselenggara' ? 'selected' : ''}>Diselenggara</option>
                </select>
              </div>
              
              <div class="flex gap-2">
                <button onclick="openModalEdit('\${barang.id}')" class="flex-1 bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition-colors">
                  Edit
                </button>
                <button onclick="handleHapusBarang('\${barang.id}', '\${barang.namaBarang.replace(/'/g, "&apos;")}')" class="flex-1 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors">
                  Padam
                </button>
              </div>
            </div>
          </div>
        </div>
      \`;}).join('');
    }

    function toggleSelect(id) {
      if (selectedBarang.includes(id)) {
        selectedBarang = selectedBarang.filter(itemId => itemId !== id);
      } else {
        selectedBarang.push(id);
      }
      updateBulkActions();
      renderBarang();
    }

    function toggleSelectAll() {
      const selectAll = document.getElementById('selectAll').checked;
      if (selectAll) {
        selectedBarang = senaraiBarang.map(b => b.id);
      } else {
        selectedBarang = [];
      }
      updateBulkActions();
      renderBarang();
    }

    function updateBulkActions() {
      const bulkActions = document.getElementById('bulkActions');
      if (selectedBarang.length > 0) {
        bulkActions.classList.remove('hidden');
        document.getElementById('selectedCount').textContent = selectedBarang.length;
      } else {
        bulkActions.classList.add('hidden');
      }
    }

    function clearSelection() {
      selectedBarang = [];
      document.getElementById('selectAll').checked = false;
      updateBulkActions();
      renderBarang();
    }

    async function handleBulkDelete() {
      if (selectedBarang.length === 0) {
        alert('Sila pilih sekurang-kurangnya satu barang untuk dipadam!');
        return;
      }

      if (!confirm(\`Adakah anda pasti ingin padam \${selectedBarang.length} barang?\`)) return;

      try {
        const response = await fetch('/api/admin/barang', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: selectedBarang })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to delete barang');
        }

        alert(\`\u2705 \${selectedBarang.length} barang berjaya dipadam!\`);
        clearSelection();
        await loadBarang();
      } catch (error) {
        console.error('Error bulk deleting barang:', error);
        alert('\u274C Error: ' + error.message);
      }
    }

    async function handleUpdateStatus(id, statusBaru) {
      const barang = senaraiBarang.find(b => b.id === id);
      if (!barang) return;

      try {
        const response = await fetch('/api/admin/barang', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: id,
            namaBarang: barang.namaBarang,
            kodBarang: barang.kodBarang,
            kategori: barang.kategori,
            status: statusBaru,
            lokasi: barang.lokasi,
            catatan: barang.catatan,
            nota: barang.nota
          })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to update status');
        }

        await loadBarang();
      } catch (error) {
        console.error('Error updating status:', error);
        alert('\u274C Error: ' + error.message);
      }
    }

    async function handleHapusBarang(id, nama) {
      if (!confirm(\`Adakah anda pasti ingin hapus barang "\${nama}"?\`)) return;

      try {
        const response = await fetch('/api/admin/barang', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: id })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to delete barang');
        }

        alert('\u2705 Barang berjaya dipadam!');
        selectedBarang = selectedBarang.filter(itemId => itemId !== id);
        updateBulkActions();
        await loadBarang();
      } catch (error) {
        console.error('Error deleting barang:', error);
        alert('\u274C Error: ' + error.message);
      }
    }

    function openModalTambah() {
      document.getElementById('modalTambah').classList.remove('hidden');
    }

    function closeModalTambah() {
      document.getElementById('modalTambah').classList.add('hidden');
      // Reset form
      document.getElementById('tambahNama').value = '';
      document.getElementById('tambahKod').value = '';
      document.getElementById('tambahKategori').value = 'elektronik';
      document.getElementById('tambahStatus').value = 'tersedia';
      document.getElementById('tambahKuantitiTotal').value = '1';
      document.getElementById('tambahKuantitiTersedia').value = '1';
      document.getElementById('tambahLokasi').value = '';
      document.getElementById('tambahDeskripsi').value = '';
      document.getElementById('tambahNota').value = '';
    }

    async function handleTambahBarang() {
      const nama = document.getElementById('tambahNama').value.trim();
      const kodBarang = document.getElementById('tambahKod').value.trim();
      const kategori = document.getElementById('tambahKategori').value;
      const status = document.getElementById('tambahStatus').value;
      const kuantitiTotal = parseInt(document.getElementById('tambahKuantitiTotal').value) || 1;
      const kuantitiTersedia = parseInt(document.getElementById('tambahKuantitiTersedia').value) || 1;
      const lokasi = document.getElementById('tambahLokasi').value.trim();
      const deskripsi = document.getElementById('tambahDeskripsi').value.trim();
      const nota = document.getElementById('tambahNota').value.trim();

      if (!nama || !kodBarang || !lokasi) {
        alert('Sila isi semua maklumat bertanda (*)!');
        return;
      }

      try {
        const response = await fetch('/api/admin/barang', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            namaBarang: nama,
            kodBarang: kodBarang,
            kategori: kategori,
            kuantitiTotal: kuantitiTotal,
            kuantitiTersedia: kuantitiTersedia,
            status: status,
            lokasi: lokasi,
            catatan: deskripsi || nota || ''
          })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to add barang');
        }

        alert('\u2705 Barang baru berjaya ditambah!');
        closeModalTambah();
        await loadBarang();
      } catch (error) {
        console.error('Error adding barang:', error);
        alert('\u274C Error: ' + error.message);
      }
    }

    function openModalEdit(id) {
      const barang = senaraiBarang.find(b => b.id === id);
      if (!barang) return;

      document.getElementById('editId').value = barang.id;
      document.getElementById('editNama').value = barang.namaBarang;
      document.getElementById('editKod').value = barang.kodBarang;
      document.getElementById('editKategori').value = barang.kategori;
      document.getElementById('editStatus').value = barang.status;
      document.getElementById('editKuantitiTotal').value = barang.kuantitiTotal || 1;
      document.getElementById('editKuantitiTersedia').value = barang.kuantitiTersedia || 1;
      document.getElementById('editLokasi').value = barang.lokasi;
      document.getElementById('editDeskripsi').value = barang.catatan || '';
      document.getElementById('editNota').value = '';
      
      document.getElementById('modalEdit').classList.remove('hidden');
    }

    function closeModalEdit() {
      document.getElementById('modalEdit').classList.add('hidden');
    }

    async function handleUpdateBarang() {
      const id = document.getElementById('editId').value; // Keep as string
      const nama = document.getElementById('editNama').value.trim();
      const kodBarang = document.getElementById('editKod').value.trim();
      const kategori = document.getElementById('editKategori').value;
      const status = document.getElementById('editStatus').value;
      const kuantitiTotal = parseInt(document.getElementById('editKuantitiTotal').value) || 1;
      const kuantitiTersedia = parseInt(document.getElementById('editKuantitiTersedia').value) || 1;
      const lokasi = document.getElementById('editLokasi').value.trim();
      const deskripsi = document.getElementById('editDeskripsi').value.trim();
      const nota = document.getElementById('editNota').value.trim();

      if (!nama || !kodBarang || !lokasi) {
        alert('Sila isi semua maklumat bertanda (*)!');
        return;
      }

      try {
        const payload = {
          id: id,
          namaBarang: nama,
          kodBarang: kodBarang,
          kategori: kategori,
          kuantitiTotal: kuantitiTotal,
          kuantitiTersedia: kuantitiTersedia,
          status: status,
          lokasi: lokasi,
          deskripsi: deskripsi || nota || ''
        };
        console.log('Update payload:', payload);
        
        const response = await fetch('/api/admin/barang', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to update barang');
        }

        alert('\u2705 Barang berjaya dikemaskini!');
        closeModalEdit();
        await loadBarang();
      } catch (error) {
        console.error('Error updating barang:', error);
        alert('\u274C Error: ' + error.message);
      }
    }

    // Initialize - Load barang from D1
    loadBarang();
  <\/script>
</body>
</html>`;
}
__name(getStaffBarangHTML, "getStaffBarangHTML");
function getStaffKelulusanHTML() {
  return `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Urus Kelulusan - Staff ICT - iBorrow</title>
  ${getFaviconHTML()}
  <script src="https://cdn.tailwindcss.com"><\/script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    body { font-family: 'Inter', sans-serif; }
  </style>
</head>
<body class="bg-gray-50">
  <div class="min-h-screen p-3 pb-24">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <button onclick="window.location.href='/staff-ict/dashboard'" class="bg-gray-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-gray-600 transition-colors flex items-center gap-1">
              \u2190 Dashboard
            </button>
            <div class="text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
              <span class="text-xs font-medium">\u{1F4CB} KELULUSAN</span>
            </div>
          </div>
          <button onclick="handleLogKeluar()" class="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors">
            Log Keluar
          </button>
        </div>
        
        <div class="text-center">
          <h1 class="text-xl font-bold text-gray-900">\u{1F4CB} Urus Kelulusan</h1>
          <p class="text-gray-600 text-sm mt-1">Luluskan atau tolak tempahan barang ICT</p>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div class="bg-white rounded-xl shadow-sm p-3 text-center">
          <div class="text-lg font-bold text-blue-600" id="statTotal">6</div>
          <div class="text-xs text-gray-600">Total Tempahan</div>
        </div>
        
        <div class="bg-white rounded-xl shadow-sm p-3 text-center">
          <div class="text-lg font-bold text-yellow-600" id="statMenunggu">4</div>
          <div class="text-xs text-gray-600">Menunggu</div>
          <div class="text-xs text-yellow-600 mt-1">Perlu tindakan</div>
        </div>
        
        <div class="bg-white rounded-xl shadow-sm p-3 text-center">
          <div class="text-lg font-bold text-green-600" id="statDiluluskan">1</div>
          <div class="text-xs text-gray-600">Diluluskan</div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-3 text-center">
          <div class="text-lg font-bold text-red-600" id="statDitolak">1</div>
          <div class="text-xs text-gray-600">Ditolak</div>
        </div>
      </div>

      <!-- Filters & Search -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Carian</label>
            <input type="text" id="searchInput" placeholder="Cari nama, barang atau email..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" oninput="filterTempahan()">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Filter Status</label>
            <select id="filterStatus" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" onchange="filterTempahan()">
              <option value="Pending">Menunggu Kelulusan</option>
              <option value="Diluluskan">Diluluskan</option>
              <option value="Ditolak">Ditolak</option>
              <option value="semua">Semua Status</option>
            </select>
          </div>
          <div class="flex items-end">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center w-full">
              <p class="text-blue-800 font-semibold text-sm">
                <span id="countDitemui">4</span> tempahan
              </p>
              <p class="text-blue-600 text-xs">ditemui</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Senarai Tempahan -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-20">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-semibold text-gray-900 text-sm">\u{1F4CB} Senarai Tempahan</h2>
          <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full" id="countTempahan">4 ditemui</span>
        </div>
        
        <div id="tempahanList" class="space-y-3"></div>
      </div>

      ${getStaffBottomNavHTML("kelulusan")}
    </div>
  </div>

  <!-- Modal Tolak Tempahan -->
  <div id="modalTolak" class="hidden fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4 border border-gray-200">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Tolak Tempahan</h3>
        <button onclick="closeModalTolak()" class="text-gray-400 hover:text-gray-600 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <div class="space-y-4">
        <div id="tolakInfo"></div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Sebab Penolakan *
          </label>
          <textarea id="sebabTolakan" rows="4" placeholder="Berikan sebab mengapa tempahan ini ditolak..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"></textarea>
          <p class="text-xs text-gray-500 mt-1">Sebab ini akan dihantar kepada pengguna melalui email</p>
        </div>
      </div>

      <div class="flex gap-3 mt-6">
        <button onclick="closeModalTolak()" class="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
          Batal
        </button>
        <button onclick="handleTolakTempahan()" class="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium">
          Tolak Tempahan
        </button>
      </div>
    </div>
  </div>

  <script>
    let tempahan = [];
    let tempahanDipilih = null;

    // Load tempahan from D1 database
    async function loadTempahan() {
      try {
        console.log('Fetching tempahan...');
        const response = await fetch('/api/staff-ict/kelulusan');
        console.log('Response status:', response.status);
        if (!response.ok) throw new Error('Failed to load tempahan');
        const data = await response.json();
        console.log('Tempahan data:', data);
        tempahan = data.data || [];
        console.log('Loaded tempahan:', tempahan.length);
        
        updateStats();
        filterTempahan();
      } catch (error) {
        console.error('Error loading tempahan:', error);
        document.getElementById('tempahanList').innerHTML = '<div class="text-center py-8"><div class="text-4xl mb-2">\u274C</div><p class="text-red-500 text-sm">Error: ' + error.message + '</p></div>';
      }
    }

    function handleLogKeluar() {
      if (confirm('Adakah anda pasti ingin log keluar?')) {
        window.location.href = '/login';
      }
    }

    function getStatusColor(status) {
      const colors = {
        menunggu: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        diluluskan: 'bg-green-100 text-green-800 border-green-200',
        ditolak: 'bg-red-100 text-red-800 border-red-200'
      };
      return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    }

    function getStatusText(status) {
      const texts = {
        menunggu: 'Menunggu Kelulusan',
        diluluskan: 'Diluluskan',
        ditolak: 'Ditolak'
      };
      return texts[status] || status;
    }

    function getStatusIcon(status) {
      const icons = {
        menunggu: '\u23F3',
        diluluskan: '\u2705',
        ditolak: '\u274C'
      };
      return icons[status] || '\u{1F4CB}';
    }

    function getKategoriColor(kategori) {
      const colors = {
        elektronik: 'bg-blue-100 text-blue-800',
        fotografi: 'bg-purple-100 text-purple-800',
        'alat-tulis': 'bg-orange-100 text-orange-800',
        audio: 'bg-pink-100 text-pink-800'
      };
      return colors[kategori] || 'bg-gray-100 text-gray-800';
    }

    function getKategoriText(kategori) {
      const texts = {
        elektronik: 'Elektronik',
        fotografi: 'Fotografi',
        'alat-tulis': 'Alat Tulis',
        audio: 'Audio'
      };
      return texts[kategori] || kategori;
    }

    function formatTarikh(tarikh) {
      return new Date(tarikh).toLocaleDateString('ms-MY', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }

    function formatTarikhMasa(tarikh) {
      return new Date(tarikh).toLocaleDateString('ms-MY', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    function updateStats() {
      const stats = {
        total: tempahan.length,
        menunggu: tempahan.filter(t => t.status === 'Pending').length,
        diluluskan: tempahan.filter(t => t.status === 'Diluluskan').length,
        ditolak: tempahan.filter(t => t.status === 'Ditolak').length
      };
      
      document.getElementById('statTotal').textContent = stats.total;
      document.getElementById('statMenunggu').textContent = stats.menunggu;
      document.getElementById('statDiluluskan').textContent = stats.diluluskan;
      document.getElementById('statDitolak').textContent = stats.ditolak;
    }

    async function handleLuluskanTempahan(id) {
      if (!confirm('Adakah anda pasti ingin meluluskan tempahan ini?')) return;

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.id) {
        alert('Sila login semula');
        window.location.href = '/login';
        return;
      }

      try {
        const response = await fetch('/api/staff-ict/kelulusan', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tempahanId: id,
            status: 'diluluskan',
            staffId: user.id
          })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to approve');
        }

        alert('\u2705 Tempahan berjaya diluluskan!');
        await loadTempahan();
      } catch (error) {
        console.error('Error approving tempahan:', error);
        alert('\u274C Error: ' + error.message);
      }
    }

    async function handleTolakTempahan() {
      if (!tempahanDipilih) return;

      const sebab = document.getElementById('sebabTolakan').value;
      if (!sebab.trim()) {
        alert('Sila berikan sebab penolakan');
        return;
      }

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.id) {
        alert('Sila login semula');
        window.location.href = '/login';
        return;
      }

      try {
        const response = await fetch('/api/staff-ict/kelulusan', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tempahanId: tempahanDipilih.id,
            status: 'ditolak',
            staffId: user.id,
            sebabTolakan: sebab
          })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to reject');
        }

        alert('\u274C Tempahan berjaya ditolak!');
        closeModalTolak();
        await loadTempahan();
      } catch (error) {
        console.error('Error rejecting tempahan:', error);
        alert('\u274C Error: ' + error.message);
      }
    }

    function filterTempahan() {
      const search = document.getElementById('searchInput').value.toLowerCase();
      const status = document.getElementById('filterStatus').value;

      const filtered = tempahan.filter(item => {
        const matchSearch = (item.namaPemohon || '').toLowerCase().includes(search) ||
                           (item.namaBarang || '').toLowerCase().includes(search) ||
                           (item.emailPemohon || '').toLowerCase().includes(search);
        const matchStatus = status === 'semua' || item.status === status;
        return matchSearch && matchStatus;
      });

      renderTempahan(filtered);
      document.getElementById('countDitemui').textContent = filtered.length;
      document.getElementById('countTempahan').textContent = filtered.length + ' ditemui';
    }

    function renderTempahan(tempahanList = tempahan.filter(t => t.status === 'Pending')) {
      const container = document.getElementById('tempahanList');
      
      if (tempahanList.length === 0) {
        container.innerHTML = \`
          <div class="text-center py-8">
            <div class="text-4xl mb-2">\u{1F4CB}</div>
            <p class="text-gray-500 text-sm">Tiada tempahan ditemui</p>
            <p class="text-gray-400 text-xs mt-1">Cuba ubah carian atau filter anda</p>
          </div>
        \`;
        return;
      }

      container.innerHTML = tempahanList.map(item => \`
        <div class="border rounded-lg p-3 \${getStatusColor(item.status)}">
          <div class="flex flex-col gap-3">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900 text-sm">\${item.namaBarang}</h3>
                <p class="text-gray-600 text-xs mt-1">
                  <strong>Pemohon:</strong> \${item.namaPemohon} (\${item.emailPemohon || 'N/A'})
                </p>
                <p class="text-gray-500 text-xs mt-1">\u{1F4CD} \${item.lokasi || 'N/A'}</p>
                \${item.tujuan ? \`<p class="text-gray-500 text-xs mt-1">\u{1F4DD} \${item.tujuan}</p>\` : ''}
              </div>
              <div class="flex flex-col items-end gap-1">
                <span class="\${getStatusColor(item.status)} text-xs px-2 py-1 rounded border font-medium">
                  \${getStatusIcon(item.status)} \${getStatusText(item.status)}
                </span>
                <span class="\${getKategoriColor(item.kategori)} text-xs px-2 py-1 rounded">
                  \${getKategoriText(item.kategori)}
                </span>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-2 text-xs">
              <div class="bg-white rounded p-2 border">
                <span class="font-medium text-gray-700">Tarikh Tempah:</span>
                <p class="text-gray-900 mt-1">\${formatTarikhMasa(item.createdAt)}</p>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div class="bg-white rounded p-2 border">
                  <span class="font-medium text-gray-700">Tarikh Pinjam:</span>
                  <p class="text-gray-900 mt-1">\${formatTarikh(item.tarikhMula)}</p>
                </div>
                <div class="bg-white rounded p-2 border">
                  <span class="font-medium text-gray-700">Tarikh Pulang:</span>
                  <p class="text-gray-900 mt-1">\${formatTarikh(item.tarikhTamat)}</p>
                </div>
              </div>
            </div>

            \${item.status === 'Diluluskan' && item.diluluskanOleh ? \`
              <div class="p-2 bg-green-50 border border-green-200 rounded-lg">
                <p class="text-green-700 text-xs">
                  \u2705 <strong>Diluluskan oleh:</strong> \${item.diluluskanOleh} pada \${formatTarikhMasa(item.tarikhKelulusan)}
                </p>
              </div>
            \` : ''}
            
            \${item.status === 'Ditolak' && item.catatanKelulusan ? \`
              <div class="p-2 bg-red-50 border border-red-200 rounded-lg">
                <p class="text-red-700 text-xs">
                  \u274C <strong>Ditolak:</strong> \${item.catatanKelulusan}
                </p>
                \${item.diluluskanOleh ? \`
                  <p class="text-red-600 text-xs mt-1">
                    Oleh: \${item.diluluskanOleh} pada \${formatTarikhMasa(item.tarikhKelulusan)}
                  </p>
                \` : ''}
              </div>
            \` : ''}

            \${item.status === 'Pending' ? \`
              <div class="flex gap-2">
                <button onclick="handleLulusTempahan('\${item.id}')" class="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors text-sm">
                  \u2705 Luluskan
                </button>
                <button onclick="openModalTolak('\${item.id}')" class="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors text-sm">
                  \u274C Tolak
                </button>
              </div>
            \` : ''}
          </div>
        </div>
      \`).join('');
    }

    async function handleLulusTempahan(tempahanId) {
      if (!confirm('Adakah anda pasti ingin meluluskan tempahan ini?')) return;

      try {
        const response = await fetch('/api/staff-ict/kelulusan', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: tempahanId,
            status: 'Diluluskan',
            catatan: 'Diluluskan oleh staff ICT'
          })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to approve');
        }

        alert('\u2705 Tempahan berjaya diluluskan! Kuantiti barang telah dikurangkan.');
        await loadTempahan();
      } catch (error) {
        console.error('Error approving tempahan:', error);
        alert('\u274C Error: ' + error.message);
      }
    }

    function openModalTolak(tempahanId) {
      const item = tempahan.find(t => t.id === tempahanId);
      if (!item) return;

      tempahanDipilih = item;
      document.getElementById('sebabTolakan').value = '';
      
      document.getElementById('tolakInfo').innerHTML = \`
        <div>
          <p class="text-sm text-gray-700 mb-2">Anda akan menolak tempahan untuk:</p>
          <p class="font-semibold text-gray-900">\${item.namaBarang}</p>
          <p class="text-sm text-gray-600">Oleh: \${item.namaUser}</p>
        </div>
      \`;
      
      document.getElementById('modalTolak').classList.remove('hidden');
    }

    function closeModalTolak() {
      document.getElementById('modalTolak').classList.add('hidden');
      tempahanDipilih = null;
      document.getElementById('sebabTolakan').value = '';
    }

    async function handleTolakTempahan() {
      if (!tempahanDipilih) return;
      
      const sebabTolakan = document.getElementById('sebabTolakan').value.trim();
      if (!sebabTolakan) {
        alert('Sila berikan sebab penolakan!');
        return;
      }

      try {
        const response = await fetch('/api/staff-ict/kelulusan', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: tempahanDipilih.id,
            status: 'Ditolak',
            catatan: sebabTolakan
          })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to reject');
        }

        alert('\u274C Tempahan berjaya ditolak!');
        closeModalTolak();
        await loadTempahan();
      } catch (error) {
        console.error('Error rejecting tempahan:', error);
        alert('\u274C Error: ' + error.message);
      }
    }

    // Initialize
    loadTempahan();
  <\/script>
</body>
</html>`;
}
__name(getStaffKelulusanHTML, "getStaffKelulusanHTML");
function getStaffProfileHTML() {
  return `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Profil Staff ICT - iBorrow</title>
  ${getFaviconHTML()}
  <script src="https://cdn.tailwindcss.com"><\/script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    body { font-family: 'Inter', sans-serif; }
  </style>
</head>
<body class="bg-gray-50">
  <div class="min-h-screen p-3 pb-24">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <button onclick="window.location.href='/staff-ict/dashboard'" class="bg-gray-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-gray-600 transition-colors flex items-center gap-1">
              \u2190 Dashboard
            </button>
            <div class="text-blue-600 bg-blue-100 px-2 py-1 rounded-full flex items-center gap-1">
              <span class="text-sm">\u{1F464}</span>
              <span class="text-xs font-medium">PROFIL</span>
            </div>
          </div>
          <button onclick="handleLogKeluar()" class="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors">
            Log Keluar
          </button>
        </div>
        
        <div class="text-center">
          <h1 class="text-xl font-bold text-gray-900">\u{1F464} Profil Staff ICT</h1>
          <p class="text-gray-600 text-sm mt-1">Maklumat peribadi dan akaun</p>
        </div>
      </div>

      <!-- Profile Card -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-semibold text-gray-900 text-sm">\u{1F4DD} Maklumat Peribadi</h2>
          <button id="btnEdit" onclick="toggleEdit()" class="bg-blue-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-blue-600 transition-colors">
            \u270F\uFE0F Edit Profil
          </button>
        </div>

        <div class="space-y-4">
          <!-- Profile Picture & Basic Info -->
          <div class="flex items-center gap-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div class="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg" id="avatar">
              AI
            </div>
            <div class="flex-1">
              <h3 class="font-bold text-gray-900 text-sm" id="displayNama">Ahmad bin Ismail</h3>
              <p class="text-gray-600 text-xs" id="displayJawatan">Staff ICT</p>
              <p class="text-gray-500 text-xs" id="displayJabatan">Bahagian Teknologi Maklumat</p>
              <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-1 inline-block">
                Aktif
              </span>
            </div>
          </div>

          <!-- Editable Fields -->
          <div class="grid grid-cols-1 gap-3">
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Nama Penuh</label>
              <input type="text" id="inputNama" value="Ahmad bin Ismail" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" disabled>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Email</label>
                <input type="email" id="inputEmail" value="ahmad.ismail@ilkkm.edu.my" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" disabled>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">No. Telefon</label>
                <input type="tel" id="inputTelefon" value="+6012-345 6789" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" disabled>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">No. Staf</label>
                <input type="text" value="STF2024001" class="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-900" disabled>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Jawatan</label>
                <input type="text" value="Staff ICT" class="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-900" disabled>
              </div>
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Jabatan</label>
              <input type="text" id="inputJabatan" value="Bahagian Teknologi Maklumat" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" disabled>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Tarikh Join</label>
                <input type="text" value="15/01/2024" class="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-900" disabled>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <div class="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm">
                  <span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    Aktif
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Save/Cancel buttons (hidden by default) -->
          <div id="editButtons" class="hidden flex gap-2">
            <button onclick="cancelEdit()" class="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium">
              \u274C Batal
            </button>
            <button onclick="saveProfile()" class="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium">
              \u{1F4BE} Simpan
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <h3 class="font-semibold text-gray-900 text-sm mb-3">\u{1F4C8} Statistik Staff ICT</h3>
        <div class="grid grid-cols-2 gap-3">
          <div class="text-center">
            <div class="text-lg font-bold text-blue-600">12</div>
            <div class="text-xs text-gray-600">Kelulusan</div>
            <div class="text-xs text-blue-600 mt-1">Bulan Ini</div>
          </div>
          <div class="text-center">
            <div class="text-lg font-bold text-green-600">45</div>
            <div class="text-xs text-gray-600">Tempahan</div>
            <div class="text-xs text-green-600 mt-1">Diluluskan</div>
          </div>
          <div class="text-center">
            <div class="text-lg font-bold text-purple-600">3</div>
            <div class="text-xs text-gray-600">Barang</div>
            <div class="text-xs text-purple-600 mt-1">Diurus</div>
          </div>
          <div class="text-center">
            <div class="text-lg font-bold text-orange-600">8</div>
            <div class="text-xs text-gray-600">Laporan</div>
            <div class="text-xs text-orange-600 mt-1">Dihasilkan</div>
          </div>
        </div>
      </div>

      <!-- Account Actions -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <h3 class="font-semibold text-gray-900 text-sm mb-3">\u2699\uFE0F Tindakan Akaun</h3>
        <div class="space-y-2">
          <button class="w-full bg-blue-50 text-blue-700 py-2 px-3 rounded-lg text-xs font-medium text-left hover:bg-blue-100 transition-colors flex items-center justify-between">
            <span>\u{1F510} Tukar Kata Laluan</span>
            <span>\u2192</span>
          </button>
          <button class="w-full bg-yellow-50 text-yellow-700 py-2 px-3 rounded-lg text-xs font-medium text-left hover:bg-yellow-100 transition-colors flex items-center justify-between">
            <span>\u{1F4E7} Tetapan Notifikasi</span>
            <span>\u2192</span>
          </button>
          <button class="w-full bg-red-50 text-red-700 py-2 px-3 rounded-lg text-xs font-medium text-left hover:bg-red-100 transition-colors flex items-center justify-between">
            <span>\u{1F6AB} Tutup Akaun</span>
            <span>\u2192</span>
          </button>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <h3 class="font-semibold text-gray-900 text-sm mb-3">\u{1F4CB} Aktiviti Terkini</h3>
        <div class="space-y-3">
          <div class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div class="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-medium text-gray-900">Meluluskan tempahan #T001</p>
              <div class="flex items-center gap-2 mt-1">
                <p class="text-xs text-gray-500">Hari ini, 10:30 AM</p>
              </div>
            </div>
          </div>
          <div class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div class="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-medium text-gray-900">Update status barang Laptop Dell</p>
              <div class="flex items-center gap-2 mt-1">
                <p class="text-xs text-gray-500">Semalam, 14:20 PM</p>
              </div>
            </div>
          </div>
          <div class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div class="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-medium text-gray-900">Menghasilkan laporan bulanan</p>
              <div class="flex items-center gap-2 mt-1">
                <p class="text-xs text-gray-500">2 hari lalu, 09:15 AM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Information Section -->
      <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
        <div class="flex items-start gap-3">
          <div class="bg-blue-100 p-2 rounded-lg">
            <span class="text-blue-600 text-sm">\u{1F4A1}</span>
          </div>
          <div>
            <h4 class="font-semibold text-blue-800 text-sm mb-2">Maklumat Profil Staff ICT</h4>
            <ul class="text-blue-700 text-xs space-y-1">
              <li>\u2022 <strong>No. Staf</strong> - Pengenalan unik untuk staff ICT</li>
              <li>\u2022 <strong>Jabatan</strong> - Bahagian tempat anda bertugas</li>
              <li>\u2022 <strong>Status Aktif</strong> - Menunjukkan akaun aktif dalam sistem</li>
              <li>\u2022 <strong>Edit Profil</strong> - Kemaskini maklumat peribadi jika perlu</li>
              <li>\u2022 <strong>Statistik</strong> - Prestasi dan aktiviti terkini</li>
            </ul>
          </div>
        </div>
      </div>

      ${getStaffBottomNavHTML("profile")}
    </div>
  </div>

  <script>
    let isEditing = false;
    let originalData = {
      nama: 'Ahmad bin Ismail',
      email: 'ahmad.ismail@ilkkm.edu.my',
      telefon: '+6012-345 6789',
      jabatan: 'Bahagian Teknologi Maklumat'
    };

    function handleLogKeluar() {
      if (confirm('Adakah anda pasti ingin log keluar?')) {
        window.location.href = '/login';
      }
    }

    function toggleEdit() {
      isEditing = !isEditing;
      updateEditMode();
    }

    function updateEditMode() {
      const fields = ['inputNama', 'inputEmail', 'inputTelefon', 'inputJabatan'];
      const btnEdit = document.getElementById('btnEdit');
      const editButtons = document.getElementById('editButtons');

      fields.forEach(fieldId => {
        document.getElementById(fieldId).disabled = !isEditing;
      });

      if (isEditing) {
        btnEdit.classList.add('hidden');
        editButtons.classList.remove('hidden');
      } else {
        btnEdit.classList.remove('hidden');
        editButtons.classList.add('hidden');
      }
    }

    function cancelEdit() {
      // Reset to original data
      document.getElementById('inputNama').value = originalData.nama;
      document.getElementById('inputEmail').value = originalData.email;
      document.getElementById('inputTelefon').value = originalData.telefon;
      document.getElementById('inputJabatan').value = originalData.jabatan;
      
      isEditing = false;
      updateEditMode();
    }

    function saveProfile() {
      const nama = document.getElementById('inputNama').value;
      const email = document.getElementById('inputEmail').value;
      const telefon = document.getElementById('inputTelefon').value;
      const jabatan = document.getElementById('inputJabatan').value;

      if (!nama || !email || !telefon || !jabatan) {
        alert('Sila isi semua maklumat!');
        return;
      }

      // Update original data
      originalData = { nama, email, telefon, jabatan };
      
      // Update display
      document.getElementById('displayNama').textContent = nama;
      document.getElementById('displayJabatan').textContent = jabatan;
      
      // Update avatar
      const initials = nama.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      document.getElementById('avatar').textContent = initials;

      isEditing = false;
      updateEditMode();
      
      alert('Profil berjaya dikemaskini!');
    }
  <\/script>
</body>
</html>`;
}
__name(getStaffProfileHTML, "getStaffProfileHTML");
function getStaffLaporanKeseluruhanHTML() {
  return `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Laporan Keseluruhan - Staff ICT - iBorrow</title>
  ${getFaviconHTML()}
  <script src="https://cdn.tailwindcss.com"><\/script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    body { font-family: 'Inter', sans-serif; }
  </style>
</head>
<body class="bg-gray-50">
  <div class="min-h-screen p-3 pb-24">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <button onclick="window.location.href='/staff-ict/dashboard'" class="bg-gray-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-gray-600 transition-colors flex items-center gap-1">
              \u2190 Dashboard
            </button>
            <div class="text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
              <span class="text-xs font-medium">\u{1F4CA} LAPORAN</span>
            </div>
          </div>
          <button onclick="handleLogKeluar()" class="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors">
            Log Keluar
          </button>
        </div>
        
        <div class="text-center">
          <h1 class="text-xl font-bold text-gray-900">\u{1F4C8} Laporan Keseluruhan</h1>
          <p class="text-gray-600 text-sm mt-1">Statistik menyeluruh sistem tempahan</p>
        </div>

        <!-- Period Selector -->
        <div class="flex justify-center mt-3">
          <select id="periodSelector" onchange="handlePeriodChange()" class="bg-gray-100 border border-gray-300 rounded-lg px-3 py-1 text-sm">
            <option value="minggu-ini">Minggu Ini</option>
            <option value="bulan-ini" selected>Bulan Ini</option>
            <option value="tahun-ini">Tahun Ini</option>
            <option value="semua-masa">Semua Masa</option>
          </select>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <h3 class="font-semibold text-gray-900 text-sm mb-3 text-center">\u{1F4C8} Statistik Ringkas</h3>
        <div class="grid grid-cols-2 gap-3">
          <div class="bg-green-50 rounded-lg p-3 text-center">
            <div class="text-lg font-bold text-green-600">45</div>
            <div class="text-xs text-green-700">Diluluskan</div>
          </div>
          <div class="bg-red-50 rounded-lg p-3 text-center">
            <div class="text-lg font-bold text-red-600">12</div>
            <div class="text-xs text-red-700">Ditolak</div>
          </div>
          <div class="bg-blue-50 rounded-lg p-3 text-center">
            <div class="text-lg font-bold text-blue-600">38</div>
            <div class="text-xs text-blue-700">Dikembalikan</div>
          </div>
          <div class="bg-purple-50 rounded-lg p-3 text-center">
            <div class="text-lg font-bold text-purple-600">15</div>
            <div class="text-xs text-purple-700">Barang Baru</div>
          </div>
        </div>
      </div>

      <!-- Navigation Cards -->
      <div class="space-y-3 mb-4">
        <button class="w-full bg-white rounded-xl shadow-sm p-4 text-left hover:bg-gray-50 transition-colors border border-blue-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="bg-blue-100 p-3 rounded-lg">
                <span class="text-blue-600 text-lg">\u{1F4C8}</span>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 text-sm">Laporan Keseluruhan</h3>
                <p class="text-gray-600 text-xs">Statistik menyeluruh sistem</p>
              </div>
            </div>
            <span class="text-blue-400">\u25CF</span>
          </div>
        </button>
        <button onclick="window.location.href='/staff-ict/laporan/barang'" class="w-full bg-white rounded-xl shadow-sm p-4 text-left hover:bg-gray-50 transition-colors border border-gray-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="bg-green-100 p-3 rounded-lg">
                <span class="text-green-600 text-lg">\u{1F4E6}</span>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 text-sm">Laporan Barang</h3>
                <p class="text-gray-600 text-xs">Analisis penggunaan barang</p>
              </div>
            </div>
            <span class="text-gray-400">\u2192</span>
          </div>
        </button>
        <button onclick="window.location.href='/staff-ict/laporan/tempahan'" class="w-full bg-white rounded-xl shadow-sm p-4 text-left hover:bg-gray-50 transition-colors border border-gray-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="bg-purple-100 p-3 rounded-lg">
                <span class="text-purple-600 text-lg">\u{1F4C4}</span>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 text-sm">Laporan Tempahan</h3>
                <p class="text-gray-600 text-xs">Laporan tempahan sistem</p>
              </div>
            </div>
            <span class="text-gray-400">\u2192</span>
          </div>
        </button>
      </div>

      <!-- Info Section -->
      <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
        <div class="flex items-start gap-3">
          <div class="bg-blue-100 p-2 rounded-lg">
            <span class="text-blue-600 text-sm">\u{1F4A1}</span>
          </div>
          <div>
            <h4 class="font-semibold text-blue-800 text-sm mb-2">Cara Menggunakan Laporan</h4>
            <ul class="text-blue-700 text-xs space-y-1">
              <li>\u2022 <strong>Keseluruhan</strong> - Overview semua aktiviti</li>
              <li>\u2022 <strong>Barang</strong> - Analisis penggunaan inventori</li>
              <li>\u2022 <strong>Tempahan</strong> - Template laporan sedia ada</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Main Stats Grid -->
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div class="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-600">Total Tempahan</p>
              <p class="text-lg font-bold text-gray-900">234</p>
            </div>
            <div class="bg-blue-100 p-2 rounded-lg">
              <span class="text-blue-600 text-sm">\u{1F4CB}</span>
            </div>
          </div>
          <p class="text-gray-500 text-xs mt-1">Semua tempahan</p>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-600">Berjaya</p>
              <p class="text-lg font-bold text-gray-900">189</p>
            </div>
            <div class="bg-green-100 p-2 rounded-lg">
              <span class="text-green-600 text-sm">\u2705</span>
            </div>
          </div>
          <p class="text-gray-500 text-xs mt-1">Diluluskan</p>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-4 border-l-4 border-red-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-600">Ditolak</p>
              <p class="text-lg font-bold text-gray-900">45</p>
            </div>
            <div class="bg-red-100 p-2 rounded-lg">
              <span class="text-red-600 text-sm">\u274C</span>
            </div>
          </div>
          <p class="text-gray-500 text-xs mt-1">Tidak diluluskan</p>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-4 border-l-4 border-purple-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-600">Kadar Kejayaan</p>
              <p class="text-lg font-bold text-gray-900">80.8%</p>
            </div>
            <div class="bg-purple-100 p-2 rounded-lg">
              <span class="text-purple-600 text-sm">\u{1F4CA}</span>
            </div>
          </div>
          <p class="text-gray-500 text-xs mt-1">Nisbah berjaya</p>
        </div>
      </div>

      <!-- Additional Insights -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <h2 class="font-semibold text-gray-900 text-sm mb-3">\u{1F4A1} Analisis Tambahan</h2>
        
        <div class="space-y-3">
          <div class="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div class="flex items-center gap-3">
              <div class="bg-blue-100 p-2 rounded-lg">
                <span class="text-blue-600 text-sm">\u{1F3C6}</span>
              </div>
              <div>
                <p class="text-xs font-medium text-gray-900">Barang Paling Popular</p>
                <p class="text-gray-600 text-xs">Laptop Dell XPS 13</p>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div class="flex items-center gap-3">
              <div class="bg-green-100 p-2 rounded-lg">
                <span class="text-green-600 text-sm">\u23F0</span>
              </div>
              <div>
                <p class="text-xs font-medium text-gray-900">Waktu Permintaan Tinggi</p>
                <p class="text-gray-600 text-xs">10:00 AM - 12:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Trend Chart Placeholder -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <h2 class="font-semibold text-gray-900 text-sm mb-3">\u{1F4C8} Trend Tempahan</h2>
        <div class="bg-gray-50 rounded-lg p-8 text-center">
          <div class="text-4xl mb-3">\u{1F4CA}</div>
          <p class="text-gray-600 text-sm mb-2">Graf trend tempahan</p>
          <p class="text-gray-500 text-xs">Data visualisasi akan dipaparkan di sini</p>
        </div>
      </div>

      <!-- Category Breakdown -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <h2 class="font-semibold text-gray-900 text-sm mb-3">\u{1F4E6} Taburan Mengikut Kategori</h2>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-blue-500 text-sm">\u{1F4BB}</span>
              <span class="text-gray-700 text-sm">Laptop & Komputer</span>
            </div>
            <span class="text-gray-900 text-sm font-medium">45%</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-green-500 text-sm">\u{1F4F1}</span>
              <span class="text-gray-700 text-sm">Tablet & Mobile</span>
            </div>
            <span class="text-gray-900 text-sm font-medium">25%</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-purple-500 text-sm">\u{1F3A5}</span>
              <span class="text-gray-700 text-sm">AV Equipment</span>
            </div>
            <span class="text-gray-900 text-sm font-medium">15%</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-orange-500 text-sm">\u{1F50C}</span>
              <span class="text-gray-700 text-sm">Aksesori</span>
            </div>
            <span class="text-gray-900 text-sm font-medium">10%</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-red-500 text-sm">\u{1F5A8}\uFE0F</span>
              <span class="text-gray-700 text-sm">Printer & Scanner</span>
            </div>
            <span class="text-gray-900 text-sm font-medium">5%</span>
          </div>
        </div>
      </div>

      <!-- Info Section -->
      <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-20">
        <div class="flex items-start gap-3">
          <div class="bg-blue-100 p-2 rounded-lg">
            <span class="text-blue-600 text-sm">\u{1F4A1}</span>
          </div>
          <div>
            <h4 class="font-semibold text-blue-800 text-sm mb-2">Cara Menggunakan Laporan</h4>
            <ul class="text-blue-700 text-xs space-y-1">
              <li>\u2022 <strong>Period Selector</strong> - Pilih tempoh masa untuk analisis</li>
              <li>\u2022 <strong>Stats Cards</strong> - Overview ringkas prestasi sistem</li>
              <li>\u2022 <strong>Trend Chart</strong> - Visualisasi data dari masa ke masa</li>
              <li>\u2022 <strong>Category Breakdown</strong> - Analisis mengikut jenis barang</li>
            </ul>
          </div>
        </div>
      </div>

      ${getStaffBottomNavHTML("laporan")}
    </div>
  </div>

  <script>
    function handleLogKeluar() {
      if (confirm('Adakah anda pasti ingin log keluar?')) {
        window.location.href = '/login';
      }
    }

    function handlePeriodChange() {
      const period = document.getElementById('periodSelector').value;
      console.log('Period changed to:', period);
      // In real app, this would trigger data reload
      alert('Tempoh ditukar kepada: ' + period);
    }
  <\/script>
</body>
</html>`;
}
__name(getStaffLaporanKeseluruhanHTML, "getStaffLaporanKeseluruhanHTML");
function jsonResponse(data, status = 200, additionalHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...additionalHeaders
    }
  });
}
__name(jsonResponse, "jsonResponse");
function getStaffLaporanBarangHTML() {
  return `
<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Laporan Barang - iBorrow</title>
  ${getFaviconHTML()}
  <script src="https://cdn.tailwindcss.com"><\/script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; }
  </style>
</head>
<body class="bg-gray-50">
  <div class="min-h-screen p-3 pb-24">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <button onclick="window.location.href='/staff-ict/dashboard'" class="bg-gray-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-gray-600 transition-colors">
              \u2190 Dashboard
            </button>
            <div class="text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
              <span class="text-xs font-medium">\u{1F4CA} LAPORAN</span>
            </div>
          </div>
          <button onclick="if(confirm('Adakah anda pasti ingin log keluar?')) window.location.href='/login'" class="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors">
            Log Keluar
          </button>
        </div>
        <div class="text-center">
          <h1 class="text-xl font-bold text-gray-900">\u{1F4E6} Laporan Barang</h1>
          <p class="text-gray-600 text-sm mt-1">Analisis dan statistik inventori barang ICT</p>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <h3 class="font-semibold text-gray-900 text-sm mb-3 text-center">\u{1F4C8} Statistik Ringkas</h3>
        <div class="grid grid-cols-2 gap-3">
          <div class="bg-green-50 rounded-lg p-3 text-center">
            <div class="text-lg font-bold text-green-600">45</div>
            <div class="text-xs text-green-700">Diluluskan</div>
          </div>
          <div class="bg-red-50 rounded-lg p-3 text-center">
            <div class="text-lg font-bold text-red-600">12</div>
            <div class="text-xs text-red-700">Ditolak</div>
          </div>
          <div class="bg-blue-50 rounded-lg p-3 text-center">
            <div class="text-lg font-bold text-blue-600">38</div>
            <div class="text-xs text-blue-700">Dikembalikan</div>
          </div>
          <div class="bg-purple-50 rounded-lg p-3 text-center">
            <div class="text-lg font-bold text-purple-600">15</div>
            <div class="text-xs text-purple-700">Barang Baru</div>
          </div>
        </div>
      </div>

      <!-- Navigation Cards -->
      <div class="space-y-3 mb-4">
        <button onclick="window.location.href='/staff-ict/laporan/keseluruhan'" class="w-full bg-white rounded-xl shadow-sm p-4 text-left hover:bg-gray-50 transition-colors border border-gray-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="bg-blue-100 p-3 rounded-lg">
                <span class="text-blue-600 text-lg">\u{1F4C8}</span>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 text-sm">Laporan Keseluruhan</h3>
                <p class="text-gray-600 text-xs">Statistik menyeluruh sistem</p>
              </div>
            </div>
            <span class="text-gray-400">\u2192</span>
          </div>
        </button>
        <button class="w-full bg-white rounded-xl shadow-sm p-4 text-left hover:bg-gray-50 transition-colors border border-blue-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="bg-green-100 p-3 rounded-lg">
                <span class="text-green-600 text-lg">\u{1F4E6}</span>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 text-sm">Laporan Barang</h3>
                <p class="text-gray-600 text-xs">Analisis penggunaan barang</p>
              </div>
            </div>
            <span class="text-blue-400">\u25CF</span>
          </div>
        </button>
        <button onclick="window.location.href='/staff-ict/laporan/tempahan'" class="w-full bg-white rounded-xl shadow-sm p-4 text-left hover:bg-gray-50 transition-colors border border-gray-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="bg-purple-100 p-3 rounded-lg">
                <span class="text-purple-600 text-lg">\u{1F4C4}</span>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 text-sm">Laporan Tempahan</h3>
                <p class="text-gray-600 text-xs">Laporan tempahan sistem</p>
              </div>
            </div>
            <span class="text-gray-400">\u2192</span>
          </div>
        </button>
      </div>

      <!-- Info Section -->
      <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
        <div class="flex items-start gap-3">
          <div class="bg-blue-100 p-2 rounded-lg">
            <span class="text-blue-600 text-sm">\u{1F4A1}</span>
          </div>
          <div>
            <h4 class="font-semibold text-blue-800 text-sm mb-2">Cara Menggunakan Laporan</h4>
            <ul class="text-blue-700 text-xs space-y-1">
              <li>\u2022 <strong>Keseluruhan</strong> - Overview semua aktiviti</li>
              <li>\u2022 <strong>Barang</strong> - Analisis penggunaan inventori</li>
              <li>\u2022 <strong>Tempahan</strong> - Template laporan sedia ada</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Main Stats Cards -->
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div class="bg-white rounded-xl shadow-sm p-3 text-center">
          <div class="text-lg font-bold text-blue-600">156</div>
          <div class="text-xs text-gray-600">Total Barang</div>
          <div class="text-xs text-blue-600 mt-1">Dalam inventori</div>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-3 text-center">
          <div class="text-lg font-bold text-green-600">89</div>
          <div class="text-xs text-gray-600">Tersedia</div>
          <div class="text-xs text-green-600 mt-1">57% dari total</div>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-3 text-center">
          <div class="text-lg font-bold text-orange-600">45</div>
          <div class="text-xs text-gray-600">Dipinjam</div>
          <div class="text-xs text-orange-600 mt-1">Sedang digunakan</div>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-3 text-center">
          <div class="text-lg font-bold text-red-600">22</div>
          <div class="text-xs text-gray-600">Perhatian</div>
          <div class="text-xs text-red-600 mt-1">Rosak & Servis</div>
        </div>
      </div>

      <!-- Additional Stats -->
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div class="bg-white rounded-xl shadow-sm p-3 text-center">
          <div class="text-lg font-bold text-purple-600">68%</div>
          <div class="text-xs text-gray-600">Kadar Penggunaan</div>
          <div class="text-xs text-purple-600 mt-1">Efisiensi inventori</div>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-3 text-center">
          <div class="text-sm font-bold text-gray-800 truncate">Laptop Dell XPS 13</div>
          <div class="text-xs text-gray-600">Barang Popular</div>
          <div class="text-xs text-gray-600 mt-1">Paling banyak dipinjam</div>
        </div>
      </div>

      <!-- Kesihatan Inventori -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <h3 class="font-semibold text-gray-900 text-sm mb-4">\u{1F3E5} Kesihatan Inventori</h3>
        <div class="space-y-3">
          <div>
            <div class="flex justify-between text-xs mb-1">
              <span class="text-gray-600">Barang Baik</span>
              <span class="font-semibold">11</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-green-600 h-2 rounded-full" style="width: 73%"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between text-xs mb-1">
              <span class="text-gray-600">Perlu Servis</span>
              <span class="font-semibold">2</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-yellow-600 h-2 rounded-full" style="width: 13%"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between text-xs mb-1">
              <span class="text-gray-600">Barang Rosak</span>
              <span class="font-semibold">2</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-red-600 h-2 rounded-full" style="width: 13%"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters & Search -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Carian Barang</label>
            <input type="text" placeholder="Cari nama, kod atau lokasi..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Kategori</label>
            <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
              <option>Semua Kategori</option>
              <option>Elektronik</option>
              <option>Fotografi</option>
              <option>Alat Tulis</option>
              <option>Audio</option>
            </select>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Status</label>
            <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
              <option>Semua Status</option>
              <option>Tersedia</option>
              <option>Dipinjam</option>
              <option>Rosak</option>
              <option>Servis</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Kesihatan</label>
            <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
              <option>Semua Kesihatan</option>
              <option>Baik</option>
              <option>Perlu Servis</option>
              <option>Rosak</option>
            </select>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 mt-4">
          <div class="flex-1">
            <label class="block text-xs font-medium text-gray-700 mb-1">Export Laporan</label>
            <button onclick="alert('Laporan barang berjaya diexport ke format CSV!')" class="w-full bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm">
              \u{1F4C8} Export Laporan
            </button>
          </div>
          <div class="flex-1">
            <label class="block text-xs font-medium text-gray-700 mb-1">Actions</label>
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center w-full">
              <p class="text-blue-800 font-semibold text-sm">15 barang</p>
              <p class="text-blue-600 text-xs">ditemui</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Senarai Laporan Barang -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-semibold text-gray-900 text-sm">Detail Inventori Barang</h2>
          <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">15 barang</span>
        </div>
        <div class="space-y-3">
          <!-- Barang 1 -->
          <div class="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
            <div class="flex flex-col gap-3">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-900 text-sm">Laptop Dell XPS 13</h3>
                  <p class="text-gray-600 text-xs mt-1"><strong>Kod:</strong> ICT-LAP-001 | <strong>Lokasi:</strong> Makmal Komputer 1</p>
                  <p class="text-gray-500 text-xs mt-1"><strong>Daftar:</strong> 10 Jan 2024</p>
                </div>
                <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-medium">Elektronik</span>
              </div>
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div class="bg-gray-50 rounded p-2">
                  <span class="text-gray-500">Jumlah Pinjaman:</span>
                  <p class="text-gray-900 mt-1">23 kali</p>
                </div>
                <div class="bg-gray-50 rounded p-2">
                  <span class="text-gray-500">Kadar Penggunaan:</span>
                  <p class="text-gray-900 mt-1">85%</p>
                </div>
                <div class="bg-gray-50 rounded p-2">
                  <span class="text-gray-500">Purata Tempoh:</span>
                  <p class="text-gray-900 mt-1">5.2 hari</p>
                </div>
                <div class="bg-gray-50 rounded p-2">
                  <span class="text-gray-500">Status:</span>
                  <p class="mt-1"><span class="bg-green-100 text-green-800 text-xs px-1 py-0.5 rounded">Tersedia</span></p>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">\u2705 Baik</span>
              </div>
            </div>
          </div>

          <!-- Barang 2 -->
          <div class="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
            <div class="flex flex-col gap-3">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-900 text-sm">Projector Epson EB-X41</h3>
                  <p class="text-gray-600 text-xs mt-1"><strong>Kod:</strong> ICT-PRO-002 | <strong>Lokasi:</strong> Bilik Media</p>
                  <p class="text-gray-500 text-xs mt-1"><strong>Daftar:</strong> 12 Jan 2024</p>
                </div>
                <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-medium">Elektronik</span>
              </div>
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div class="bg-gray-50 rounded p-2">
                  <span class="text-gray-500">Jumlah Pinjaman:</span>
                  <p class="text-gray-900 mt-1">18 kali</p>
                </div>
                <div class="bg-gray-50 rounded p-2">
                  <span class="text-gray-500">Kadar Penggunaan:</span>
                  <p class="text-gray-900 mt-1">72%</p>
                </div>
                <div class="bg-gray-50 rounded p-2">
                  <span class="text-gray-500">Purata Tempoh:</span>
                  <p class="text-gray-900 mt-1">3.8 hari</p>
                </div>
                <div class="bg-gray-50 rounded p-2">
                  <span class="text-gray-500">Status:</span>
                  <p class="mt-1"><span class="bg-blue-100 text-blue-800 text-xs px-1 py-0.5 rounded">Dipinjam</span></p>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <span class="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">\u26A0\uFE0F Perlu Servis</span>
              </div>
              <div class="bg-yellow-50 border border-yellow-200 rounded p-2">
                <p class="text-yellow-700 text-xs">\u{1F4DD} Lampu projector mulai malap</p>
              </div>
            </div>
          </div>

          <!-- Barang 3 -->
          <div class="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
            <div class="flex flex-col gap-3">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-900 text-sm">Kamera Canon EOS R6</h3>
                  <p class="text-gray-600 text-xs mt-1"><strong>Kod:</strong> ICT-CAM-003 | <strong>Lokasi:</strong> Unit Media</p>
                  <p class="text-gray-500 text-xs mt-1"><strong>Daftar:</strong> 8 Jan 2024</p>
                </div>
                <span class="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded font-medium">Fotografi</span>
              </div>
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div class="bg-gray-50 rounded p-2">
                  <span class="text-gray-500">Jumlah Pinjaman:</span>
                  <p class="text-gray-900 mt-1">31 kali</p>
                </div>
                <div class="bg-gray-50 rounded p-2">
                  <span class="text-gray-500">Kadar Penggunaan:</span>
                  <p class="text-gray-900 mt-1">92%</p>
                </div>
                <div class="bg-gray-50 rounded p-2">
                  <span class="text-gray-500">Purata Tempoh:</span>
                  <p class="text-gray-900 mt-1">6.1 hari</p>
                </div>
                <div class="bg-gray-50 rounded p-2">
                  <span class="text-gray-500">Status:</span>
                  <p class="mt-1"><span class="bg-green-100 text-green-800 text-xs px-1 py-0.5 rounded">Tersedia</span></p>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">\u2705 Baik</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      ${getStaffBottomNavHTML("laporan")}
    </div>
  </div>
</body>
</html>
  `;
}
__name(getStaffLaporanBarangHTML, "getStaffLaporanBarangHTML");
function getStaffLaporanTempahanHTML() {
  return `
<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Laporan Tempahan - iBorrow</title>
  ${getFaviconHTML()}
  <script src="https://cdn.tailwindcss.com"><\/script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; }
  </style>
</head>
<body class="bg-gray-50">
  <div class="min-h-screen p-3 pb-24">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <button onclick="window.location.href='/staff-ict/dashboard'" class="bg-gray-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-gray-600 transition-colors">
              \u2190 Dashboard
            </button>
            <div class="text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
              <span class="text-xs font-medium">\u{1F4CA} LAPORAN</span>
            </div>
          </div>
          <button onclick="if(confirm('Adakah anda pasti ingin log keluar?')) window.location.href='/login'" class="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors">
            Log Keluar
          </button>
        </div>
        <div class="text-center">
          <h1 class="text-xl font-bold text-gray-900">\u{1F4C4} Laporan Tempahan</h1>
          <p class="text-gray-600 text-sm mt-1">Laporan dan analisis tempahan sistem</p>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <h3 class="font-semibold text-gray-900 text-sm mb-3 text-center">\u{1F4C8} Statistik Ringkas</h3>
        <div class="grid grid-cols-2 gap-3">
          <div class="bg-green-50 rounded-lg p-3 text-center">
            <div class="text-lg font-bold text-green-600">45</div>
            <div class="text-xs text-green-700">Diluluskan</div>
          </div>
          <div class="bg-red-50 rounded-lg p-3 text-center">
            <div class="text-lg font-bold text-red-600">12</div>
            <div class="text-xs text-red-700">Ditolak</div>
          </div>
          <div class="bg-blue-50 rounded-lg p-3 text-center">
            <div class="text-lg font-bold text-blue-600">38</div>
            <div class="text-xs text-blue-700">Dikembalikan</div>
          </div>
          <div class="bg-purple-50 rounded-lg p-3 text-center">
            <div class="text-lg font-bold text-purple-600">15</div>
            <div class="text-xs text-purple-700">Barang Baru</div>
          </div>
        </div>
      </div>

      <!-- Navigation Cards -->
      <div class="space-y-3 mb-4">
        <button onclick="window.location.href='/staff-ict/laporan/keseluruhan'" class="w-full bg-white rounded-xl shadow-sm p-4 text-left hover:bg-gray-50 transition-colors border border-gray-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="bg-blue-100 p-3 rounded-lg">
                <span class="text-blue-600 text-lg">\u{1F4C8}</span>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 text-sm">Laporan Keseluruhan</h3>
                <p class="text-gray-600 text-xs">Statistik menyeluruh sistem</p>
              </div>
            </div>
            <span class="text-gray-400">\u2192</span>
          </div>
        </button>
        <button onclick="window.location.href='/staff-ict/laporan/barang'" class="w-full bg-white rounded-xl shadow-sm p-4 text-left hover:bg-gray-50 transition-colors border border-gray-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="bg-green-100 p-3 rounded-lg">
                <span class="text-green-600 text-lg">\u{1F4E6}</span>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 text-sm">Laporan Barang</h3>
                <p class="text-gray-600 text-xs">Analisis penggunaan barang</p>
              </div>
            </div>
            <span class="text-gray-400">\u2192</span>
          </div>
        </button>
        <button class="w-full bg-white rounded-xl shadow-sm p-4 text-left hover:bg-gray-50 transition-colors border border-blue-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="bg-purple-100 p-3 rounded-lg">
                <span class="text-purple-600 text-lg">\u{1F4C4}</span>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 text-sm">Laporan Tempahan</h3>
                <p class="text-gray-600 text-xs">Laporan tempahan sistem</p>
              </div>
            </div>
            <span class="text-blue-400">\u25CF</span>
          </div>
        </button>
      </div>

      <!-- Info Section -->
      <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
        <div class="flex items-start gap-3">
          <div class="bg-blue-100 p-2 rounded-lg">
            <span class="text-blue-600 text-sm">\u{1F4A1}</span>
          </div>
          <div>
            <h4 class="font-semibold text-blue-800 text-sm mb-2">Cara Menggunakan Laporan</h4>
            <ul class="text-blue-700 text-xs space-y-1">
              <li>\u2022 <strong>Keseluruhan</strong> - Overview semua aktiviti</li>
              <li>\u2022 <strong>Barang</strong> - Analisis penggunaan inventori</li>
              <li>\u2022 <strong>Tempahan</strong> - Template laporan sedia ada</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div class="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-600">Total Tempahan</p>
              <p class="text-lg font-bold text-gray-900">156</p>
            </div>
            <div class="bg-blue-100 p-2 rounded-lg">
              <span class="text-blue-600 text-sm">\u{1F4E6}</span>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-600">Tempahan Baru</p>
              <p class="text-lg font-bold text-gray-900">12</p>
            </div>
            <div class="bg-green-100 p-2 rounded-lg">
              <span class="text-green-600 text-sm">\u{1F195}</span>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-4 border-l-4 border-yellow-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-600">Menunggu Kelulusan</p>
              <p class="text-lg font-bold text-gray-900">8</p>
            </div>
            <div class="bg-yellow-100 p-2 rounded-lg">
              <span class="text-yellow-600 text-sm">\u23F3</span>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-4 border-l-4 border-purple-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-600">Tempahan Aktif</p>
              <p class="text-lg font-bold text-gray-900">45</p>
            </div>
            <div class="bg-purple-100 p-2 rounded-lg">
              <span class="text-purple-600 text-sm">\u2705</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Analisis Tempahan -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <h2 class="font-semibold text-gray-900 text-sm mb-3">\u{1F4CA} Analisis Tempahan</h2>
        <div class="space-y-3">
          <div class="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div class="flex items-center gap-3">
              <div class="bg-blue-100 p-2 rounded-lg">
                <span class="text-blue-600 text-sm">\u{1F4C8}</span>
              </div>
              <div>
                <p class="text-xs font-medium text-gray-900">Trend Tempahan Bulanan</p>
                <p class="text-gray-600 text-xs">Peningkatan 15% dari bulan lepas</p>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div class="flex items-center gap-3">
              <div class="bg-green-100 p-2 rounded-lg">
                <span class="text-green-600 text-sm">\u23F0</span>
              </div>
              <div>
                <p class="text-xs font-medium text-gray-900">Waktu Puncak</p>
                <p class="text-gray-600 text-xs">Isnin & Selasa (10:00-12:00)</p>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
            <div class="flex items-center gap-3">
              <div class="bg-purple-100 p-2 rounded-lg">
                <span class="text-purple-600 text-sm">\u{1F465}</span>
              </div>
              <div>
                <p class="text-xs font-medium text-gray-900">Pengguna Aktif</p>
                <p class="text-gray-600 text-xs">45 pengguna membuat tempahan</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Template Laporan -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <h2 class="font-semibold text-gray-900 text-sm mb-3">\u{1F4CB} Template Laporan</h2>
        <div class="space-y-2">
          <button onclick="alert('Muat turun laporan harian...')" class="w-full bg-gray-50 rounded-lg p-3 text-left hover:bg-gray-100 transition-colors border border-gray-200">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="bg-blue-100 p-2 rounded-lg">
                  <span class="text-blue-600 text-sm">\u{1F4C5}</span>
                </div>
                <div>
                  <h3 class="font-medium text-gray-900 text-sm">Laporan Harian</h3>
                  <p class="text-gray-600 text-xs">Ringkasan aktiviti harian</p>
                </div>
              </div>
              <span class="text-gray-400 text-sm">\u{1F4E5}</span>
            </div>
          </button>
          <button onclick="alert('Muat turun laporan mingguan...')" class="w-full bg-gray-50 rounded-lg p-3 text-left hover:bg-gray-100 transition-colors border border-gray-200">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="bg-green-100 p-2 rounded-lg">
                  <span class="text-green-600 text-sm">\u{1F4CA}</span>
                </div>
                <div>
                  <h3 class="font-medium text-gray-900 text-sm">Laporan Mingguan</h3>
                  <p class="text-gray-600 text-xs">Analisis prestasi mingguan</p>
                </div>
              </div>
              <span class="text-gray-400 text-sm">\u{1F4E5}</span>
            </div>
          </button>
          <button onclick="alert('Muat turun laporan bulanan...')" class="w-full bg-gray-50 rounded-lg p-3 text-left hover:bg-gray-100 transition-colors border border-gray-200">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="bg-purple-100 p-2 rounded-lg">
                  <span class="text-purple-600 text-sm">\u{1F4C8}</span>
                </div>
                <div>
                  <h3 class="font-medium text-gray-900 text-sm">Laporan Bulanan</h3>
                  <p class="text-gray-600 text-xs">Statistik bulanan lengkap</p>
                </div>
              </div>
              <span class="text-gray-400 text-sm">\u{1F4E5}</span>
            </div>
          </button>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-20">
        <h2 class="font-semibold text-gray-900 text-sm mb-3">\u{1F552} Aktiviti Tempahan Terkini</h2>
        <div class="space-y-2">
          <div class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
            <div class="bg-blue-100 p-1 rounded">
              <span class="text-blue-600 text-xs">\u{1F4CB}</span>
            </div>
            <div class="flex-1">
              <p class="text-xs font-medium text-gray-900">Tempahan baru diterima</p>
              <p class="text-gray-500 text-xs">2 minit lalu</p>
            </div>
          </div>
          <div class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
            <div class="bg-green-100 p-1 rounded">
              <span class="text-green-600 text-xs">\u2705</span>
            </div>
            <div class="flex-1">
              <p class="text-xs font-medium text-gray-900">Tempahan diluluskan</p>
              <p class="text-gray-500 text-xs">1 jam lalu</p>
            </div>
          </div>
          <div class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
            <div class="bg-yellow-100 p-1 rounded">
              <span class="text-yellow-600 text-xs">\u23F3</span>
            </div>
            <div class="flex-1">
              <p class="text-xs font-medium text-gray-900">Menunggu kelulusan</p>
              <p class="text-gray-500 text-xs">3 tempahan</p>
            </div>
          </div>
        </div>
      </div>

      ${getStaffBottomNavHTML("laporan")}
    </div>
  </div>
</body>
</html>
  `;
}
__name(getStaffLaporanTempahanHTML, "getStaffLaporanTempahanHTML");
function getAdminBarangHTML() {
  return `
<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Urus Barang - Admin</title>
  ${getFaviconHTML()}
  <script src="https://cdn.tailwindcss.com"><\/script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; }
  </style>
</head>
<body class="bg-gray-50">
  <div class="min-h-screen p-3 pb-24">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <div class="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div class="flex items-center gap-2 flex-wrap">
            <button onclick="window.location.href='/admin/dashboard'" class="bg-gray-500 text-white px-2 py-1 rounded-lg text-xs sm:text-sm hover:bg-gray-600 transition-colors">
              \u2190 <span class="hidden sm:inline">Dashboard</span><span class="sm:hidden">Back</span>
            </button>
            <div class="text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
              <span class="text-xs font-medium">\u{1F4E6} BARANG</span>
            </div>
          </div>
          <button onclick="if(confirm('Adakah anda pasti ingin log keluar?')) window.location.href='/login'" class="bg-red-500 text-white px-2 py-1 rounded-lg text-xs sm:text-sm hover:bg-red-600 transition-colors">
            <span class="hidden sm:inline">Log Keluar</span><span class="sm:hidden">Logout</span>
          </button>
        </div>
        <div class="text-center">
          <h1 class="text-lg sm:text-xl font-bold text-gray-900">\u{1F4E6} Urus Inventori Barang</h1>
          <p class="text-gray-600 text-xs sm:text-sm mt-1">Manage semua barang dalam sistem i-Borrow</p>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div class="bg-white rounded-xl shadow-sm p-3 text-center">
          <div class="text-lg font-bold text-blue-600">156</div>
          <div class="text-xs text-gray-600">Total Barang</div>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-3 text-center">
          <div class="text-lg font-bold text-green-600">89</div>
          <div class="text-xs text-gray-600">Tersedia</div>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-3 text-center">
          <div class="text-lg font-bold text-purple-600">45</div>
          <div class="text-xs text-gray-600">Dipinjam</div>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-3 text-center">
          <div class="text-lg font-bold text-red-600">22</div>
          <div class="text-xs text-gray-600">Perhatian</div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input type="text" placeholder="Cari nama atau kod barang..." class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
          <button onclick="alert('Tambah barang feature akan ditambah')" class="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm">
            + Tambah Barang
          </button>
        </div>
      </div>

      <!-- Barang List -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <h2 class="font-semibold text-gray-900 text-sm mb-3">\u{1F4CB} Senarai Barang (Coming Soon)</h2>
        <p class="text-gray-500 text-xs text-center py-8">Backend integration akan ditambah</p>
      </div>

      ${getAdminBottomNavHTML("barang")}
    </div>
  </div>
</body>
</html>
  `;
}
__name(getAdminBarangHTML, "getAdminBarangHTML");
function getAdminPenggunaHTML() {
  return `
<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Urus Pengguna - Admin</title>
  ${getFaviconHTML()}
  <script src="https://cdn.tailwindcss.com"><\/script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; }
  </style>
</head>
<body class="bg-gray-50">
  <div class="min-h-screen p-3 pb-24">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <button onclick="window.location.href='/admin/dashboard'" class="bg-gray-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-gray-600 transition-colors">
              \u2190 Dashboard
            </button>
            <div class="text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
              <span class="text-xs font-medium">\u{1F465} PENGGUNA</span>
            </div>
          </div>
          <button onclick="if(confirm('Adakah anda pasti ingin log keluar?')) window.location.href='/login'" class="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors">
            Log Keluar
          </button>
        </div>
        <div class="text-center">
          <h1 class="text-xl font-bold text-gray-900">\u{1F465} Urus Pengguna</h1>
          <p class="text-gray-600 text-sm mt-1">Manage akaun pengguna sistem</p>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div class="bg-white rounded-xl shadow-sm p-3 text-center">
          <div class="text-lg font-bold text-purple-600">234</div>
          <div class="text-xs text-gray-600">Total Pengguna</div>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-3 text-center">
          <div class="text-lg font-bold text-green-600">212</div>
          <div class="text-xs text-gray-600">Aktif</div>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-3 text-center">
          <div class="text-lg font-bold text-blue-600">18</div>
          <div class="text-xs text-gray-600">Staff ICT</div>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-3 text-center">
          <div class="text-lg font-bold text-orange-600">4</div>
          <div class="text-xs text-gray-600">Admin</div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input type="text" placeholder="Cari nama atau email..." class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
          <button onclick="alert('Tambah pengguna feature akan ditambah')" class="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm">
            + Tambah Pengguna
          </button>
        </div>
      </div>

      <!-- Pengguna List -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <h2 class="font-semibold text-gray-900 text-sm mb-3">\u{1F4CB} Senarai Pengguna (Coming Soon)</h2>
        <p class="text-gray-500 text-xs text-center py-8">Backend integration akan ditambah</p>
      </div>

      ${getAdminBottomNavHTML("pengguna")}
    </div>
  </div>
</body>
</html>
  `;
}
__name(getAdminPenggunaHTML, "getAdminPenggunaHTML");
function getAdminLaporanHTML() {
  return `
<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Laporan - Admin</title>
  ${getFaviconHTML()}
  <script src="https://cdn.tailwindcss.com"><\/script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; }
  </style>
</head>
<body class="bg-gray-50">
  <div class="min-h-screen p-3 pb-24">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <button onclick="window.location.href='/admin/dashboard'" class="bg-gray-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-gray-600 transition-colors">
              \u2190 Dashboard
            </button>
            <div class="text-green-600 bg-green-100 px-2 py-1 rounded-full">
              <span class="text-xs font-medium">\u{1F4CA} LAPORAN</span>
            </div>
          </div>
          <button onclick="if(confirm('Adakah anda pasti ingin log keluar?')) window.location.href='/login'" class="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors">
            Log Keluar
          </button>
        </div>
        <div class="text-center">
          <h1 class="text-xl font-bold text-gray-900">\u{1F4CA} Laporan Sistem</h1>
          <p class="text-gray-600 text-sm mt-1">Analisis dan statistik keseluruhan</p>
        </div>
      </div>

      <!-- Laporan Options -->
      <div class="space-y-3 mb-4">
        <div class="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow border border-gray-200">
          <div class="flex items-center gap-3">
            <div class="bg-blue-100 p-3 rounded-lg">
              <span class="text-blue-600 text-lg">\u{1F4C8}</span>
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900 text-sm">Laporan Keseluruhan</h3>
              <p class="text-gray-600 text-xs">Statistik sistem menyeluruh</p>
            </div>
            <button onclick="alert('Laporan akan dijana')" class="bg-blue-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-blue-600">
              Jana
            </button>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow border border-gray-200">
          <div class="flex items-center gap-3">
            <div class="bg-green-100 p-3 rounded-lg">
              <span class="text-green-600 text-lg">\u{1F4E6}</span>
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900 text-sm">Laporan Inventori</h3>
              <p class="text-gray-600 text-xs">Status dan penggunaan barang</p>
            </div>
            <button onclick="alert('Laporan akan dijana')" class="bg-green-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-green-600">
              Jana
            </button>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow border border-gray-200">
          <div class="flex items-center gap-3">
            <div class="bg-purple-100 p-3 rounded-lg">
              <span class="text-purple-600 text-lg">\u{1F465}</span>
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900 text-sm">Laporan Pengguna</h3>
              <p class="text-gray-600 text-xs">Aktiviti dan analisis pengguna</p>
            </div>
            <button onclick="alert('Laporan akan dijana')" class="bg-purple-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-purple-600">
              Jana
            </button>
          </div>
        </div>
      </div>

      <!-- Info -->
      <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
        <div class="flex items-start gap-3">
          <div class="bg-blue-100 p-2 rounded-lg">
            <span class="text-blue-600 text-sm">\u{1F4A1}</span>
          </div>
          <div>
            <h4 class="font-semibold text-blue-800 text-sm mb-2">Info Laporan</h4>
            <p class="text-blue-700 text-xs">Laporan akan dijana dalam format PDF dan boleh dimuat turun.</p>
          </div>
        </div>
      </div>

      ${getAdminBottomNavHTML("laporan")}
    </div>
  </div>
</body>
</html>
  `;
}
__name(getAdminLaporanHTML, "getAdminLaporanHTML");
function getAdminProfileHTML() {
  return `
<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Profil - Admin</title>
  ${getFaviconHTML()}
  <script src="https://cdn.tailwindcss.com"><\/script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; }
  </style>
</head>
<body class="bg-gray-50">
  <div class="min-h-screen p-3 pb-24">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <button onclick="window.location.href='/admin/dashboard'" class="bg-gray-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-gray-600 transition-colors">
              \u2190 Dashboard
            </button>
            <div class="text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
              <span class="text-xs font-medium">\u{1F464} PROFIL</span>
            </div>
          </div>
          <button onclick="if(confirm('Adakah anda pasti ingin log keluar?')) window.location.href='/login'" class="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors">
            Log Keluar
          </button>
        </div>
        <div class="text-center">
          <h1 class="text-xl font-bold text-gray-900">\u{1F464} Profil Admin</h1>
          <p class="text-gray-600 text-sm mt-1">Maklumat akaun anda</p>
        </div>
      </div>

      <!-- Profile Info -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <div class="text-center mb-4">
          <div class="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
            <span class="text-white text-3xl">\u{1F464}</span>
          </div>
          <h2 class="font-bold text-gray-900">Admin System</h2>
          <p class="text-gray-600 text-sm">admin@ilkkm.edu.my</p>
          <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-2 inline-block">Administrator</span>
        </div>
        
        <div class="space-y-3 border-t border-gray-200 pt-4">
          <div class="flex justify-between items-center">
            <span class="text-gray-600 text-sm">Nama Penuh</span>
            <span class="text-gray-900 text-sm font-medium">Admin System</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600 text-sm">Email</span>
            <span class="text-gray-900 text-sm font-medium">admin@ilkkm.edu.my</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600 text-sm">Role</span>
            <span class="text-gray-900 text-sm font-medium">Administrator</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600 text-sm">Bahagian</span>
            <span class="text-gray-900 text-sm font-medium">Unit ICT</span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="space-y-3 mb-4">
        <button onclick="alert('Edit profil akan ditambah')" class="w-full bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition-colors text-sm font-medium">
          \u270F\uFE0F Edit Profil
        </button>
        <button onclick="alert('Tukar password akan ditambah')" class="w-full bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-colors text-sm font-medium">
          \u{1F512} Tukar Password
        </button>
      </div>

      ${getAdminBottomNavHTML("profile")}
    </div>
  </div>
</body>
</html>
  `;
}
__name(getAdminProfileHTML, "getAdminProfileHTML");
function getAdminTetapanSistemHTML() {
  return `
<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tetapan Sistem - Admin</title>
  ${getFaviconHTML()}
  <script src="https://cdn.tailwindcss.com"><\/script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; }
  </style>
</head>
<body class="bg-gray-50">
  <div class="min-h-screen p-3 pb-24">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <button onclick="window.location.href='/admin/dashboard'" class="bg-gray-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-gray-600 transition-colors">
              \u2190 Dashboard
            </button>
            <div class="text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
              <span class="text-xs font-medium">\u2699\uFE0F TETAPAN</span>
            </div>
          </div>
          <button onclick="if(confirm('Adakah anda pasti ingin log keluar?')) window.location.href='/login'" class="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors">
            Log Keluar
          </button>
        </div>
        <div class="text-center">
          <h1 class="text-xl font-bold text-gray-900">\u2699\uFE0F Tetapan Sistem</h1>
          <p class="text-gray-600 text-sm mt-1">Konfigurasi sistem i-Borrow</p>
        </div>
      </div>

      <!-- Tetapan Menu -->
      <div class="space-y-3 mb-4">
        <button onclick="window.location.href='/admin/tetapan/sistem'" class="w-full bg-white rounded-xl shadow-sm p-4 text-left hover:bg-gray-50 transition-colors border border-blue-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="bg-blue-100 p-3 rounded-lg">
                <span class="text-blue-600 text-lg">\u2699\uFE0F</span>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 text-sm">Tetapan Sistem</h3>
                <p class="text-gray-600 text-xs">Konfigurasi am sistem</p>
              </div>
            </div>
            <span class="text-blue-400">\u25CF</span>
          </div>
        </button>

        <button onclick="window.location.href='/admin/tetapan/keselamatan'" class="w-full bg-white rounded-xl shadow-sm p-4 text-left hover:bg-gray-50 transition-colors border border-gray-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="bg-red-100 p-3 rounded-lg">
                <span class="text-red-600 text-lg">\u{1F512}</span>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 text-sm">Keselamatan</h3>
                <p class="text-gray-600 text-xs">Password & authentication</p>
              </div>
            </div>
            <span class="text-gray-400">\u2192</span>
          </div>
        </button>

        <button onclick="window.location.href='/admin/tetapan/log-aktiviti'" class="w-full bg-white rounded-xl shadow-sm p-4 text-left hover:bg-gray-50 transition-colors border border-gray-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="bg-green-100 p-3 rounded-lg">
                <span class="text-green-600 text-lg">\u{1F4CB}</span>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 text-sm">Log Aktiviti</h3>
                <p class="text-gray-600 text-xs">Audit trail sistem</p>
              </div>
            </div>
            <span class="text-gray-400">\u2192</span>
          </div>
        </button>

        <button onclick="window.location.href='/admin/tetapan/backup-pulih'" class="w-full bg-white rounded-xl shadow-sm p-4 text-left hover:bg-gray-50 transition-colors border border-gray-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="bg-purple-100 p-3 rounded-lg">
                <span class="text-purple-600 text-lg">\u{1F4BE}</span>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 text-sm">Backup & Pulih</h3>
                <p class="text-gray-600 text-xs">Database backup</p>
              </div>
            </div>
            <span class="text-gray-400">\u2192</span>
          </div>
        </button>
      </div>

      <!-- Current Settings -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <h3 class="font-semibold text-gray-900 text-sm mb-3">\u{1F4DD} Tetapan Semasa</h3>
        <div class="space-y-3 text-sm">
          <div class="flex justify-between items-center pb-2 border-b">
            <span class="text-gray-600">Nama Sistem</span>
            <span class="text-gray-900 font-medium">i-Borrow ILKKM</span>
          </div>
          <div class="flex justify-between items-center pb-2 border-b">
            <span class="text-gray-600">Versi</span>
            <span class="text-gray-900 font-medium">1.0.0</span>
          </div>
          <div class="flex justify-between items-center pb-2 border-b">
            <span class="text-gray-600">Environment</span>
            <span class="text-gray-900 font-medium">Production</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Status</span>
            <span class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Online</span>
          </div>
        </div>
      </div>

      ${getAdminBottomNavHTML("tetapan")}
    </div>
  </div>
</body>
</html>
  `;
}
__name(getAdminTetapanSistemHTML, "getAdminTetapanSistemHTML");
function getAdminTetapanKeselamatanHTML() {
  return `
<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Keselamatan - Admin</title>
  ${getFaviconHTML()}
  <script src="https://cdn.tailwindcss.com"><\/script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; }
  </style>
</head>
<body class="bg-gray-50">
  <div class="min-h-screen p-3 pb-24">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <button onclick="window.location.href='/admin/tetapan/sistem'" class="bg-gray-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-gray-600 transition-colors">
              \u2190 Tetapan
            </button>
            <div class="text-red-600 bg-red-100 px-2 py-1 rounded-full">
              <span class="text-xs font-medium">\u{1F512} KESELAMATAN</span>
            </div>
          </div>
          <button onclick="if(confirm('Adakah anda pasti ingin log keluar?')) window.location.href='/login'" class="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors">
            Log Keluar
          </button>
        </div>
        <div class="text-center">
          <h1 class="text-xl font-bold text-gray-900">\u{1F512} Keselamatan</h1>
          <p class="text-gray-600 text-sm mt-1">Password & authentication settings</p>
        </div>
      </div>

      <!-- Security Settings -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <h3 class="font-semibold text-gray-900 text-sm mb-3">\u{1F510} Tetapan Password</h3>
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-gray-600 text-sm">Minimum Length</span>
            <input type="number" value="8" class="w-20 px-2 py-1 border rounded text-sm">
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600 text-sm">Require Uppercase</span>
            <input type="checkbox" checked class="w-5 h-5">
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600 text-sm">Require Numbers</span>
            <input type="checkbox" checked class="w-5 h-5">
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600 text-sm">Require Symbols</span>
            <input type="checkbox" class="w-5 h-5">
          </div>
        </div>
        <button onclick="alert('Settings saved')" class="w-full bg-blue-500 text-white py-2 rounded-lg mt-4 hover:bg-blue-600 text-sm">
          Simpan Tetapan
        </button>
      </div>

      ${getAdminBottomNavHTML("tetapan")}
    </div>
  </div>
</body>
</html>
  `;
}
__name(getAdminTetapanKeselamatanHTML, "getAdminTetapanKeselamatanHTML");
function getAdminTetapanLogAktivitiHTML() {
  return `
<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Log Aktiviti - Admin</title>
  ${getFaviconHTML()}
  <script src="https://cdn.tailwindcss.com"><\/script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; }
  </style>
</head>
<body class="bg-gray-50">
  <div class="min-h-screen p-3 pb-24">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <button onclick="window.location.href='/admin/tetapan/sistem'" class="bg-gray-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-gray-600 transition-colors">
              \u2190 Tetapan
            </button>
            <div class="text-green-600 bg-green-100 px-2 py-1 rounded-full">
              <span class="text-xs font-medium">\u{1F4CB} LOG</span>
            </div>
          </div>
          <button onclick="if(confirm('Adakah anda pasti ingin log keluar?')) window.location.href='/login'" class="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors">
            Log Keluar
          </button>
        </div>
        <div class="text-center">
          <h1 class="text-xl font-bold text-gray-900">\u{1F4CB} Log Aktiviti</h1>
          <p class="text-gray-600 text-sm mt-1">Audit trail sistem</p>
        </div>
      </div>

      <!-- Activity Logs -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <h3 class="font-semibold text-gray-900 text-sm mb-3">\u{1F552} Aktiviti Terkini</h3>
        <div class="space-y-2">
          <div class="flex items-start gap-3 p-2 bg-gray-50 rounded">
            <span class="text-lg">\u{1F464}</span>
            <div class="flex-1">
              <p class="text-sm font-medium">User login</p>
              <p class="text-xs text-gray-600">admin@ilkkm.edu.my - 2 minutes ago</p>
            </div>
          </div>
          <div class="flex items-start gap-3 p-2 bg-gray-50 rounded">
            <span class="text-lg">\u{1F4E6}</span>
            <div class="flex-1">
              <p class="text-sm font-medium">Barang updated</p>
              <p class="text-xs text-gray-600">Laptop Dell - Status changed - 15 minutes ago</p>
            </div>
          </div>
          <div class="flex items-start gap-3 p-2 bg-gray-50 rounded">
            <span class="text-lg">\u2705</span>
            <div class="flex-1">
              <p class="text-sm font-medium">Tempahan approved</p>
              <p class="text-xs text-gray-600">Staff ICT approved request - 1 hour ago</p>
            </div>
          </div>
        </div>
      </div>

      ${getAdminBottomNavHTML("tetapan")}
    </div>
  </div>
</body>
</html>
  `;
}
__name(getAdminTetapanLogAktivitiHTML, "getAdminTetapanLogAktivitiHTML");
function getAdminTetapanBackupPulihHTML() {
  return `
<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Backup & Pulih - Admin</title>
  ${getFaviconHTML()}
  <script src="https://cdn.tailwindcss.com"><\/script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; }
  </style>
</head>
<body class="bg-gray-50">
  <div class="min-h-screen p-3 pb-24">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <button onclick="window.location.href='/admin/tetapan/sistem'" class="bg-gray-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-gray-600 transition-colors">
              \u2190 Tetapan
            </button>
            <div class="text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
              <span class="text-xs font-medium">\u{1F4BE} BACKUP</span>
            </div>
          </div>
          <button onclick="if(confirm('Adakah anda pasti ingin log keluar?')) window.location.href='/login'" class="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors">
            Log Keluar
          </button>
        </div>
        <div class="text-center">
          <h1 class="text-xl font-bold text-gray-900">\u{1F4BE} Backup & Pulih</h1>
          <p class="text-gray-600 text-sm mt-1">Database backup management</p>
        </div>
      </div>

      <!-- Backup Actions -->
      <div class="space-y-3 mb-4">
        <button onclick="alert('Backup akan dimulakan')" class="w-full bg-green-500 text-white py-4 rounded-xl hover:bg-green-600 transition-colors text-sm font-medium">
          \u{1F4BE} Buat Backup Sekarang
        </button>
        <button onclick="alert('Restore feature akan ditambah')" class="w-full bg-blue-500 text-white py-4 rounded-xl hover:bg-blue-600 transition-colors text-sm font-medium">
          \u21A9\uFE0F Pulihkan dari Backup
        </button>
      </div>

      <!-- Recent Backups -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <h3 class="font-semibold text-gray-900 text-sm mb-3">\u{1F4CB} Backup Terkini</h3>
        <div class="space-y-2">
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <p class="text-sm font-medium">backup_2025-01-15.sql</p>
              <p class="text-xs text-gray-600">15 Jan 2025, 10:30 AM</p>
            </div>
            <button onclick="alert('Download backup')" class="text-blue-600 text-xs">
              \u2B07\uFE0F Download
            </button>
          </div>
        </div>
      </div>

      <!-- Warning -->
      <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
        <div class="flex items-start gap-3">
          <span class="text-yellow-600 text-lg">\u26A0\uFE0F</span>
          <div>
            <h4 class="font-semibold text-yellow-800 text-sm mb-1">Amaran</h4>
            <p class="text-yellow-700 text-xs">Pastikan anda membuat backup secara berkala untuk elakkan kehilangan data.</p>
          </div>
        </div>
      </div>

      ${getAdminBottomNavHTML("tetapan")}
    </div>
  </div>
</body>
</html>
  `;
}
__name(getAdminTetapanBackupPulihHTML, "getAdminTetapanBackupPulihHTML");
function htmlResponse(html, additionalHeaders = {}, status = 200) {
  return new Response(html, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      ...additionalHeaders
    }
  });
}
__name(htmlResponse, "htmlResponse");
function getRedirectPath(role) {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "staff-ict":
      return "/staff-ict/dashboard";
    case "user":
      return "/user/dashboard";
    default:
      return "/user/dashboard";
  }
}
__name(getRedirectPath, "getRedirectPath");

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } catch (e) {
    const error3 = reduceError(e);
    return Response.json(error3, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-1Tsv3a/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = worker_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env2, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env2, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env2, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env2, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-1Tsv3a/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env2, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env2, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env2, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env2, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env2, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env2, ctx) => {
      this.env = env2;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=worker.js.map
