var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-QVsdI2/strip-cf-connecting-ip-header.js
function stripCfConnectingIPHeader(input, init2) {
  const request = new Request(input, init2);
  request.headers.delete("CF-Connecting-IP");
  return request;
}
__name(stripCfConnectingIPHeader, "stripCfConnectingIPHeader");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    return Reflect.apply(target, thisArg, [
      stripCfConnectingIPHeader.apply(null, argArray)
    ]);
  }
});

// node_modules/@esbuild-plugins/node-globals-polyfill/process.js
function defaultSetTimout() {
  throw new Error("setTimeout has not been defined");
}
__name(defaultSetTimout, "defaultSetTimout");
function defaultClearTimeout() {
  throw new Error("clearTimeout has not been defined");
}
__name(defaultClearTimeout, "defaultClearTimeout");
var cachedSetTimeout = defaultSetTimout;
var cachedClearTimeout = defaultClearTimeout;
if (typeof globalThis.setTimeout === "function") {
  cachedSetTimeout = setTimeout;
}
if (typeof globalThis.clearTimeout === "function") {
  cachedClearTimeout = clearTimeout;
}
function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    return setTimeout(fun, 0);
  }
  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }
  try {
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e2) {
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}
__name(runTimeout, "runTimeout");
function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    return clearTimeout(marker);
  }
  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }
  try {
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      return cachedClearTimeout.call(null, marker);
    } catch (e2) {
      return cachedClearTimeout.call(this, marker);
    }
  }
}
__name(runClearTimeout, "runClearTimeout");
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;
function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }
  draining = false;
  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }
  if (queue.length) {
    drainQueue();
  }
}
__name(cleanUpNextTick, "cleanUpNextTick");
function drainQueue() {
  if (draining) {
    return;
  }
  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;
  while (len) {
    currentQueue = queue;
    queue = [];
    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }
    queueIndex = -1;
    len = queue.length;
  }
  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}
__name(drainQueue, "drainQueue");
function nextTick(fun) {
  var args = new Array(arguments.length - 1);
  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }
  queue.push(new Item(fun, args));
  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}
__name(nextTick, "nextTick");
function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}
__name(Item, "Item");
Item.prototype.run = function() {
  this.fun.apply(null, this.array);
};
var title = "browser";
var platform = "browser";
var browser = true;
var env = {};
var argv = [];
var version = "";
var versions = {};
var release = {};
var config = {};
function noop() {
}
__name(noop, "noop");
var on = noop;
var addListener = noop;
var once = noop;
var off = noop;
var removeListener = noop;
var removeAllListeners = noop;
var emit = noop;
function binding(name) {
  throw new Error("process.binding is not supported");
}
__name(binding, "binding");
function cwd() {
  return "/";
}
__name(cwd, "cwd");
function chdir(dir) {
  throw new Error("process.chdir is not supported");
}
__name(chdir, "chdir");
function umask() {
  return 0;
}
__name(umask, "umask");
var performance = globalThis.performance || {};
var performanceNow = performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow || function() {
  return (/* @__PURE__ */ new Date()).getTime();
};
function hrtime(previousTimestamp) {
  var clocktime = performanceNow.call(performance) * 1e-3;
  var seconds = Math.floor(clocktime);
  var nanoseconds = Math.floor(clocktime % 1 * 1e9);
  if (previousTimestamp) {
    seconds = seconds - previousTimestamp[0];
    nanoseconds = nanoseconds - previousTimestamp[1];
    if (nanoseconds < 0) {
      seconds--;
      nanoseconds += 1e9;
    }
  }
  return [seconds, nanoseconds];
}
__name(hrtime, "hrtime");
var startTime = /* @__PURE__ */ new Date();
function uptime() {
  var currentTime = /* @__PURE__ */ new Date();
  var dif = currentTime - startTime;
  return dif / 1e3;
}
__name(uptime, "uptime");
var process = {
  nextTick,
  title,
  browser,
  env,
  argv,
  version,
  versions,
  on,
  addListener,
  once,
  off,
  removeListener,
  removeAllListeners,
  emit,
  binding,
  cwd,
  chdir,
  umask,
  hrtime,
  platform,
  release,
  config,
  uptime
};
var defines = {};
Object.keys(defines).forEach((key) => {
  const segs = key.split(".");
  let target = process;
  for (let i = 0; i < segs.length; i++) {
    const seg = segs[i];
    if (i === segs.length - 1) {
      target[seg] = defines[key];
    } else {
      target = target[seg] || (target[seg] = {});
    }
  }
});

// node_modules/@esbuild-plugins/node-globals-polyfill/Buffer.js
var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
var inited = false;
function init() {
  inited = true;
  var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i];
    revLookup[code.charCodeAt(i)] = i;
  }
  revLookup["-".charCodeAt(0)] = 62;
  revLookup["_".charCodeAt(0)] = 63;
}
__name(init, "init");
function base64toByteArray(b64) {
  if (!inited) {
    init();
  }
  var i, j, l, tmp, placeHolders, arr;
  var len = b64.length;
  if (len % 4 > 0) {
    throw new Error("Invalid string. Length must be a multiple of 4");
  }
  placeHolders = b64[len - 2] === "=" ? 2 : b64[len - 1] === "=" ? 1 : 0;
  arr = new Arr(len * 3 / 4 - placeHolders);
  l = placeHolders > 0 ? len - 4 : len;
  var L = 0;
  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
    arr[L++] = tmp >> 16 & 255;
    arr[L++] = tmp >> 8 & 255;
    arr[L++] = tmp & 255;
  }
  if (placeHolders === 2) {
    tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
    arr[L++] = tmp & 255;
  } else if (placeHolders === 1) {
    tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
    arr[L++] = tmp >> 8 & 255;
    arr[L++] = tmp & 255;
  }
  return arr;
}
__name(base64toByteArray, "base64toByteArray");
function tripletToBase64(num) {
  return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
}
__name(tripletToBase64, "tripletToBase64");
function encodeChunk(uint8, start, end) {
  var tmp;
  var output = [];
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + uint8[i + 2];
    output.push(tripletToBase64(tmp));
  }
  return output.join("");
}
__name(encodeChunk, "encodeChunk");
function base64fromByteArray(uint8) {
  if (!inited) {
    init();
  }
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3;
  var output = "";
  var parts = [];
  var maxChunkLength = 16383;
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(
      encodeChunk(
        uint8,
        i,
        i + maxChunkLength > len2 ? len2 : i + maxChunkLength
      )
    );
  }
  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    output += lookup[tmp >> 2];
    output += lookup[tmp << 4 & 63];
    output += "==";
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
    output += lookup[tmp >> 10];
    output += lookup[tmp >> 4 & 63];
    output += lookup[tmp << 2 & 63];
    output += "=";
  }
  parts.push(output);
  return parts.join("");
}
__name(base64fromByteArray, "base64fromByteArray");
Buffer2.TYPED_ARRAY_SUPPORT = globalThis.TYPED_ARRAY_SUPPORT !== void 0 ? globalThis.TYPED_ARRAY_SUPPORT : true;
function kMaxLength() {
  return Buffer2.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
}
__name(kMaxLength, "kMaxLength");
function createBuffer(that, length) {
  if (kMaxLength() < length) {
    throw new RangeError("Invalid typed array length");
  }
  if (Buffer2.TYPED_ARRAY_SUPPORT) {
    that = new Uint8Array(length);
    that.__proto__ = Buffer2.prototype;
  } else {
    if (that === null) {
      that = new Buffer2(length);
    }
    that.length = length;
  }
  return that;
}
__name(createBuffer, "createBuffer");
function Buffer2(arg, encodingOrOffset, length) {
  if (!Buffer2.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer2)) {
    return new Buffer2(arg, encodingOrOffset, length);
  }
  if (typeof arg === "number") {
    if (typeof encodingOrOffset === "string") {
      throw new Error(
        "If encoding is specified then the first argument must be a string"
      );
    }
    return allocUnsafe(this, arg);
  }
  return from(this, arg, encodingOrOffset, length);
}
__name(Buffer2, "Buffer");
Buffer2.poolSize = 8192;
Buffer2._augment = function(arr) {
  arr.__proto__ = Buffer2.prototype;
  return arr;
};
function from(that, value, encodingOrOffset, length) {
  if (typeof value === "number") {
    throw new TypeError('"value" argument must not be a number');
  }
  if (typeof ArrayBuffer !== "undefined" && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length);
  }
  if (typeof value === "string") {
    return fromString(that, value, encodingOrOffset);
  }
  return fromObject(that, value);
}
__name(from, "from");
Buffer2.from = function(value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length);
};
Buffer2.kMaxLength = kMaxLength();
if (Buffer2.TYPED_ARRAY_SUPPORT) {
  Buffer2.prototype.__proto__ = Uint8Array.prototype;
  Buffer2.__proto__ = Uint8Array;
  if (typeof Symbol !== "undefined" && Symbol.species && Buffer2[Symbol.species] === Buffer2) {
  }
}
function assertSize(size) {
  if (typeof size !== "number") {
    throw new TypeError('"size" argument must be a number');
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative');
  }
}
__name(assertSize, "assertSize");
function alloc(that, size, fill2, encoding) {
  assertSize(size);
  if (size <= 0) {
    return createBuffer(that, size);
  }
  if (fill2 !== void 0) {
    return typeof encoding === "string" ? createBuffer(that, size).fill(fill2, encoding) : createBuffer(that, size).fill(fill2);
  }
  return createBuffer(that, size);
}
__name(alloc, "alloc");
Buffer2.alloc = function(size, fill2, encoding) {
  return alloc(null, size, fill2, encoding);
};
function allocUnsafe(that, size) {
  assertSize(size);
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
  if (!Buffer2.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0;
    }
  }
  return that;
}
__name(allocUnsafe, "allocUnsafe");
Buffer2.allocUnsafe = function(size) {
  return allocUnsafe(null, size);
};
Buffer2.allocUnsafeSlow = function(size) {
  return allocUnsafe(null, size);
};
function fromString(that, string, encoding) {
  if (typeof encoding !== "string" || encoding === "") {
    encoding = "utf8";
  }
  if (!Buffer2.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding');
  }
  var length = byteLength(string, encoding) | 0;
  that = createBuffer(that, length);
  var actual = that.write(string, encoding);
  if (actual !== length) {
    that = that.slice(0, actual);
  }
  return that;
}
__name(fromString, "fromString");
function fromArrayLike(that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0;
  that = createBuffer(that, length);
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255;
  }
  return that;
}
__name(fromArrayLike, "fromArrayLike");
function fromArrayBuffer(that, array, byteOffset, length) {
  array.byteLength;
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError("'offset' is out of bounds");
  }
  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError("'length' is out of bounds");
  }
  if (byteOffset === void 0 && length === void 0) {
    array = new Uint8Array(array);
  } else if (length === void 0) {
    array = new Uint8Array(array, byteOffset);
  } else {
    array = new Uint8Array(array, byteOffset, length);
  }
  if (Buffer2.TYPED_ARRAY_SUPPORT) {
    that = array;
    that.__proto__ = Buffer2.prototype;
  } else {
    that = fromArrayLike(that, array);
  }
  return that;
}
__name(fromArrayBuffer, "fromArrayBuffer");
function fromObject(that, obj) {
  if (internalIsBuffer(obj)) {
    var len = checked(obj.length) | 0;
    that = createBuffer(that, len);
    if (that.length === 0) {
      return that;
    }
    obj.copy(that, 0, 0, len);
    return that;
  }
  if (obj) {
    if (typeof ArrayBuffer !== "undefined" && obj.buffer instanceof ArrayBuffer || "length" in obj) {
      if (typeof obj.length !== "number" || isnan(obj.length)) {
        return createBuffer(that, 0);
      }
      return fromArrayLike(that, obj);
    }
    if (obj.type === "Buffer" && Array.isArray(obj.data)) {
      return fromArrayLike(that, obj.data);
    }
  }
  throw new TypeError(
    "First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object."
  );
}
__name(fromObject, "fromObject");
function checked(length) {
  if (length >= kMaxLength()) {
    throw new RangeError(
      "Attempt to allocate Buffer larger than maximum size: 0x" + kMaxLength().toString(16) + " bytes"
    );
  }
  return length | 0;
}
__name(checked, "checked");
Buffer2.isBuffer = isBuffer;
function internalIsBuffer(b) {
  return !!(b != null && b._isBuffer);
}
__name(internalIsBuffer, "internalIsBuffer");
Buffer2.compare = /* @__PURE__ */ __name(function compare(a, b) {
  if (!internalIsBuffer(a) || !internalIsBuffer(b)) {
    throw new TypeError("Arguments must be Buffers");
  }
  if (a === b)
    return 0;
  var x = a.length;
  var y = b.length;
  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }
  if (x < y)
    return -1;
  if (y < x)
    return 1;
  return 0;
}, "compare");
Buffer2.isEncoding = /* @__PURE__ */ __name(function isEncoding(encoding) {
  switch (String(encoding).toLowerCase()) {
    case "hex":
    case "utf8":
    case "utf-8":
    case "ascii":
    case "latin1":
    case "binary":
    case "base64":
    case "ucs2":
    case "ucs-2":
    case "utf16le":
    case "utf-16le":
      return true;
    default:
      return false;
  }
}, "isEncoding");
Buffer2.concat = /* @__PURE__ */ __name(function concat(list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers');
  }
  if (list.length === 0) {
    return Buffer2.alloc(0);
  }
  var i;
  if (length === void 0) {
    length = 0;
    for (i = 0; i < list.length; ++i) {
      length += list[i].length;
    }
  }
  var buffer = Buffer2.allocUnsafe(length);
  var pos = 0;
  for (i = 0; i < list.length; ++i) {
    var buf = list[i];
    if (!internalIsBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers');
    }
    buf.copy(buffer, pos);
    pos += buf.length;
  }
  return buffer;
}, "concat");
function byteLength(string, encoding) {
  if (internalIsBuffer(string)) {
    return string.length;
  }
  if (typeof ArrayBuffer !== "undefined" && typeof ArrayBuffer.isView === "function" && (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength;
  }
  if (typeof string !== "string") {
    string = "" + string;
  }
  var len = string.length;
  if (len === 0)
    return 0;
  var loweredCase = false;
  for (; ; ) {
    switch (encoding) {
      case "ascii":
      case "latin1":
      case "binary":
        return len;
      case "utf8":
      case "utf-8":
      case void 0:
        return utf8ToBytes(string).length;
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return len * 2;
      case "hex":
        return len >>> 1;
      case "base64":
        return base64ToBytes(string).length;
      default:
        if (loweredCase)
          return utf8ToBytes(string).length;
        encoding = ("" + encoding).toLowerCase();
        loweredCase = true;
    }
  }
}
__name(byteLength, "byteLength");
Buffer2.byteLength = byteLength;
function slowToString(encoding, start, end) {
  var loweredCase = false;
  if (start === void 0 || start < 0) {
    start = 0;
  }
  if (start > this.length) {
    return "";
  }
  if (end === void 0 || end > this.length) {
    end = this.length;
  }
  if (end <= 0) {
    return "";
  }
  end >>>= 0;
  start >>>= 0;
  if (end <= start) {
    return "";
  }
  if (!encoding)
    encoding = "utf8";
  while (true) {
    switch (encoding) {
      case "hex":
        return hexSlice(this, start, end);
      case "utf8":
      case "utf-8":
        return utf8Slice(this, start, end);
      case "ascii":
        return asciiSlice(this, start, end);
      case "latin1":
      case "binary":
        return latin1Slice(this, start, end);
      case "base64":
        return base64Slice(this, start, end);
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return utf16leSlice(this, start, end);
      default:
        if (loweredCase)
          throw new TypeError("Unknown encoding: " + encoding);
        encoding = (encoding + "").toLowerCase();
        loweredCase = true;
    }
  }
}
__name(slowToString, "slowToString");
Buffer2.prototype._isBuffer = true;
function swap(b, n, m) {
  var i = b[n];
  b[n] = b[m];
  b[m] = i;
}
__name(swap, "swap");
Buffer2.prototype.swap16 = /* @__PURE__ */ __name(function swap16() {
  var len = this.length;
  if (len % 2 !== 0) {
    throw new RangeError("Buffer size must be a multiple of 16-bits");
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1);
  }
  return this;
}, "swap16");
Buffer2.prototype.swap32 = /* @__PURE__ */ __name(function swap32() {
  var len = this.length;
  if (len % 4 !== 0) {
    throw new RangeError("Buffer size must be a multiple of 32-bits");
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3);
    swap(this, i + 1, i + 2);
  }
  return this;
}, "swap32");
Buffer2.prototype.swap64 = /* @__PURE__ */ __name(function swap64() {
  var len = this.length;
  if (len % 8 !== 0) {
    throw new RangeError("Buffer size must be a multiple of 64-bits");
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7);
    swap(this, i + 1, i + 6);
    swap(this, i + 2, i + 5);
    swap(this, i + 3, i + 4);
  }
  return this;
}, "swap64");
Buffer2.prototype.toString = /* @__PURE__ */ __name(function toString() {
  var length = this.length | 0;
  if (length === 0)
    return "";
  if (arguments.length === 0)
    return utf8Slice(this, 0, length);
  return slowToString.apply(this, arguments);
}, "toString");
Buffer2.prototype.equals = /* @__PURE__ */ __name(function equals(b) {
  if (!internalIsBuffer(b))
    throw new TypeError("Argument must be a Buffer");
  if (this === b)
    return true;
  return Buffer2.compare(this, b) === 0;
}, "equals");
Buffer2.prototype.compare = /* @__PURE__ */ __name(function compare2(target, start, end, thisStart, thisEnd) {
  if (!internalIsBuffer(target)) {
    throw new TypeError("Argument must be a Buffer");
  }
  if (start === void 0) {
    start = 0;
  }
  if (end === void 0) {
    end = target ? target.length : 0;
  }
  if (thisStart === void 0) {
    thisStart = 0;
  }
  if (thisEnd === void 0) {
    thisEnd = this.length;
  }
  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError("out of range index");
  }
  if (thisStart >= thisEnd && start >= end) {
    return 0;
  }
  if (thisStart >= thisEnd) {
    return -1;
  }
  if (start >= end) {
    return 1;
  }
  start >>>= 0;
  end >>>= 0;
  thisStart >>>= 0;
  thisEnd >>>= 0;
  if (this === target)
    return 0;
  var x = thisEnd - thisStart;
  var y = end - start;
  var len = Math.min(x, y);
  var thisCopy = this.slice(thisStart, thisEnd);
  var targetCopy = target.slice(start, end);
  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i];
      y = targetCopy[i];
      break;
    }
  }
  if (x < y)
    return -1;
  if (y < x)
    return 1;
  return 0;
}, "compare");
function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
  if (buffer.length === 0)
    return -1;
  if (typeof byteOffset === "string") {
    encoding = byteOffset;
    byteOffset = 0;
  } else if (byteOffset > 2147483647) {
    byteOffset = 2147483647;
  } else if (byteOffset < -2147483648) {
    byteOffset = -2147483648;
  }
  byteOffset = +byteOffset;
  if (isNaN(byteOffset)) {
    byteOffset = dir ? 0 : buffer.length - 1;
  }
  if (byteOffset < 0)
    byteOffset = buffer.length + byteOffset;
  if (byteOffset >= buffer.length) {
    if (dir)
      return -1;
    else
      byteOffset = buffer.length - 1;
  } else if (byteOffset < 0) {
    if (dir)
      byteOffset = 0;
    else
      return -1;
  }
  if (typeof val === "string") {
    val = Buffer2.from(val, encoding);
  }
  if (internalIsBuffer(val)) {
    if (val.length === 0) {
      return -1;
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
  } else if (typeof val === "number") {
    val = val & 255;
    if (Buffer2.TYPED_ARRAY_SUPPORT && typeof Uint8Array.prototype.indexOf === "function") {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(
          buffer,
          val,
          byteOffset
        );
      } else {
        return Uint8Array.prototype.lastIndexOf.call(
          buffer,
          val,
          byteOffset
        );
      }
    }
    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
  }
  throw new TypeError("val must be string, number or Buffer");
}
__name(bidirectionalIndexOf, "bidirectionalIndexOf");
function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
  var indexSize = 1;
  var arrLength = arr.length;
  var valLength = val.length;
  if (encoding !== void 0) {
    encoding = String(encoding).toLowerCase();
    if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
      if (arr.length < 2 || val.length < 2) {
        return -1;
      }
      indexSize = 2;
      arrLength /= 2;
      valLength /= 2;
      byteOffset /= 2;
    }
  }
  function read(buf, i2) {
    if (indexSize === 1) {
      return buf[i2];
    } else {
      return buf.readUInt16BE(i2 * indexSize);
    }
  }
  __name(read, "read");
  var i;
  if (dir) {
    var foundIndex = -1;
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1)
          foundIndex = i;
        if (i - foundIndex + 1 === valLength)
          return foundIndex * indexSize;
      } else {
        if (foundIndex !== -1)
          i -= i - foundIndex;
        foundIndex = -1;
      }
    }
  } else {
    if (byteOffset + valLength > arrLength)
      byteOffset = arrLength - valLength;
    for (i = byteOffset; i >= 0; i--) {
      var found = true;
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false;
          break;
        }
      }
      if (found)
        return i;
    }
  }
  return -1;
}
__name(arrayIndexOf, "arrayIndexOf");
Buffer2.prototype.includes = /* @__PURE__ */ __name(function includes(val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1;
}, "includes");
Buffer2.prototype.indexOf = /* @__PURE__ */ __name(function indexOf(val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
}, "indexOf");
Buffer2.prototype.lastIndexOf = /* @__PURE__ */ __name(function lastIndexOf(val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
}, "lastIndexOf");
function hexWrite(buf, string, offset, length) {
  offset = Number(offset) || 0;
  var remaining = buf.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = Number(length);
    if (length > remaining) {
      length = remaining;
    }
  }
  var strLen = string.length;
  if (strLen % 2 !== 0)
    throw new TypeError("Invalid hex string");
  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(parsed))
      return i;
    buf[offset + i] = parsed;
  }
  return i;
}
__name(hexWrite, "hexWrite");
function utf8Write(buf, string, offset, length) {
  return blitBuffer(
    utf8ToBytes(string, buf.length - offset),
    buf,
    offset,
    length
  );
}
__name(utf8Write, "utf8Write");
function asciiWrite(buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length);
}
__name(asciiWrite, "asciiWrite");
function latin1Write(buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length);
}
__name(latin1Write, "latin1Write");
function base64Write(buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length);
}
__name(base64Write, "base64Write");
function ucs2Write(buf, string, offset, length) {
  return blitBuffer(
    utf16leToBytes(string, buf.length - offset),
    buf,
    offset,
    length
  );
}
__name(ucs2Write, "ucs2Write");
Buffer2.prototype.write = /* @__PURE__ */ __name(function write(string, offset, length, encoding) {
  if (offset === void 0) {
    encoding = "utf8";
    length = this.length;
    offset = 0;
  } else if (length === void 0 && typeof offset === "string") {
    encoding = offset;
    length = this.length;
    offset = 0;
  } else if (isFinite(offset)) {
    offset = offset | 0;
    if (isFinite(length)) {
      length = length | 0;
      if (encoding === void 0)
        encoding = "utf8";
    } else {
      encoding = length;
      length = void 0;
    }
  } else {
    throw new Error(
      "Buffer.write(string, encoding, offset[, length]) is no longer supported"
    );
  }
  var remaining = this.length - offset;
  if (length === void 0 || length > remaining)
    length = remaining;
  if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
    throw new RangeError("Attempt to write outside buffer bounds");
  }
  if (!encoding)
    encoding = "utf8";
  var loweredCase = false;
  for (; ; ) {
    switch (encoding) {
      case "hex":
        return hexWrite(this, string, offset, length);
      case "utf8":
      case "utf-8":
        return utf8Write(this, string, offset, length);
      case "ascii":
        return asciiWrite(this, string, offset, length);
      case "latin1":
      case "binary":
        return latin1Write(this, string, offset, length);
      case "base64":
        return base64Write(this, string, offset, length);
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return ucs2Write(this, string, offset, length);
      default:
        if (loweredCase)
          throw new TypeError("Unknown encoding: " + encoding);
        encoding = ("" + encoding).toLowerCase();
        loweredCase = true;
    }
  }
}, "write");
Buffer2.prototype.toJSON = /* @__PURE__ */ __name(function toJSON() {
  return {
    type: "Buffer",
    data: Array.prototype.slice.call(this._arr || this, 0)
  };
}, "toJSON");
function base64Slice(buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64fromByteArray(buf);
  } else {
    return base64fromByteArray(buf.slice(start, end));
  }
}
__name(base64Slice, "base64Slice");
function utf8Slice(buf, start, end) {
  end = Math.min(buf.length, end);
  var res = [];
  var i = start;
  while (i < end) {
    var firstByte = buf[i];
    var codePoint = null;
    var bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint;
      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 128) {
            codePoint = firstByte;
          }
          break;
        case 2:
          secondByte = buf[i + 1];
          if ((secondByte & 192) === 128) {
            tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
            if (tempCodePoint > 127) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 3:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
            tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
            if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 4:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          fourthByte = buf[i + 3];
          if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
            tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
            if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
              codePoint = tempCodePoint;
            }
          }
      }
    }
    if (codePoint === null) {
      codePoint = 65533;
      bytesPerSequence = 1;
    } else if (codePoint > 65535) {
      codePoint -= 65536;
      res.push(codePoint >>> 10 & 1023 | 55296);
      codePoint = 56320 | codePoint & 1023;
    }
    res.push(codePoint);
    i += bytesPerSequence;
  }
  return decodeCodePointsArray(res);
}
__name(utf8Slice, "utf8Slice");
var MAX_ARGUMENTS_LENGTH = 4096;
function decodeCodePointsArray(codePoints) {
  var len = codePoints.length;
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints);
  }
  var res = "";
  var i = 0;
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    );
  }
  return res;
}
__name(decodeCodePointsArray, "decodeCodePointsArray");
function asciiSlice(buf, start, end) {
  var ret = "";
  end = Math.min(buf.length, end);
  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 127);
  }
  return ret;
}
__name(asciiSlice, "asciiSlice");
function latin1Slice(buf, start, end) {
  var ret = "";
  end = Math.min(buf.length, end);
  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i]);
  }
  return ret;
}
__name(latin1Slice, "latin1Slice");
function hexSlice(buf, start, end) {
  var len = buf.length;
  if (!start || start < 0)
    start = 0;
  if (!end || end < 0 || end > len)
    end = len;
  var out = "";
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i]);
  }
  return out;
}
__name(hexSlice, "hexSlice");
function utf16leSlice(buf, start, end) {
  var bytes = buf.slice(start, end);
  var res = "";
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
  }
  return res;
}
__name(utf16leSlice, "utf16leSlice");
Buffer2.prototype.slice = /* @__PURE__ */ __name(function slice(start, end) {
  var len = this.length;
  start = ~~start;
  end = end === void 0 ? len : ~~end;
  if (start < 0) {
    start += len;
    if (start < 0)
      start = 0;
  } else if (start > len) {
    start = len;
  }
  if (end < 0) {
    end += len;
    if (end < 0)
      end = 0;
  } else if (end > len) {
    end = len;
  }
  if (end < start)
    end = start;
  var newBuf;
  if (Buffer2.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end);
    newBuf.__proto__ = Buffer2.prototype;
  } else {
    var sliceLen = end - start;
    newBuf = new Buffer2(sliceLen, void 0);
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start];
    }
  }
  return newBuf;
}, "slice");
function checkOffset(offset, ext, length) {
  if (offset % 1 !== 0 || offset < 0)
    throw new RangeError("offset is not uint");
  if (offset + ext > length)
    throw new RangeError("Trying to access beyond buffer length");
}
__name(checkOffset, "checkOffset");
Buffer2.prototype.readUIntLE = /* @__PURE__ */ __name(function readUIntLE(offset, byteLength2, noAssert) {
  offset = offset | 0;
  byteLength2 = byteLength2 | 0;
  if (!noAssert)
    checkOffset(offset, byteLength2, this.length);
  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength2 && (mul *= 256)) {
    val += this[offset + i] * mul;
  }
  return val;
}, "readUIntLE");
Buffer2.prototype.readUIntBE = /* @__PURE__ */ __name(function readUIntBE(offset, byteLength2, noAssert) {
  offset = offset | 0;
  byteLength2 = byteLength2 | 0;
  if (!noAssert) {
    checkOffset(offset, byteLength2, this.length);
  }
  var val = this[offset + --byteLength2];
  var mul = 1;
  while (byteLength2 > 0 && (mul *= 256)) {
    val += this[offset + --byteLength2] * mul;
  }
  return val;
}, "readUIntBE");
Buffer2.prototype.readUInt8 = /* @__PURE__ */ __name(function readUInt8(offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 1, this.length);
  return this[offset];
}, "readUInt8");
Buffer2.prototype.readUInt16LE = /* @__PURE__ */ __name(function readUInt16LE(offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 2, this.length);
  return this[offset] | this[offset + 1] << 8;
}, "readUInt16LE");
Buffer2.prototype.readUInt16BE = /* @__PURE__ */ __name(function readUInt16BE(offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 2, this.length);
  return this[offset] << 8 | this[offset + 1];
}, "readUInt16BE");
Buffer2.prototype.readUInt32LE = /* @__PURE__ */ __name(function readUInt32LE(offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length);
  return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
}, "readUInt32LE");
Buffer2.prototype.readUInt32BE = /* @__PURE__ */ __name(function readUInt32BE(offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length);
  return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
}, "readUInt32BE");
Buffer2.prototype.readIntLE = /* @__PURE__ */ __name(function readIntLE(offset, byteLength2, noAssert) {
  offset = offset | 0;
  byteLength2 = byteLength2 | 0;
  if (!noAssert)
    checkOffset(offset, byteLength2, this.length);
  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength2 && (mul *= 256)) {
    val += this[offset + i] * mul;
  }
  mul *= 128;
  if (val >= mul)
    val -= Math.pow(2, 8 * byteLength2);
  return val;
}, "readIntLE");
Buffer2.prototype.readIntBE = /* @__PURE__ */ __name(function readIntBE(offset, byteLength2, noAssert) {
  offset = offset | 0;
  byteLength2 = byteLength2 | 0;
  if (!noAssert)
    checkOffset(offset, byteLength2, this.length);
  var i = byteLength2;
  var mul = 1;
  var val = this[offset + --i];
  while (i > 0 && (mul *= 256)) {
    val += this[offset + --i] * mul;
  }
  mul *= 128;
  if (val >= mul)
    val -= Math.pow(2, 8 * byteLength2);
  return val;
}, "readIntBE");
Buffer2.prototype.readInt8 = /* @__PURE__ */ __name(function readInt8(offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 1, this.length);
  if (!(this[offset] & 128))
    return this[offset];
  return (255 - this[offset] + 1) * -1;
}, "readInt8");
Buffer2.prototype.readInt16LE = /* @__PURE__ */ __name(function readInt16LE(offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 2, this.length);
  var val = this[offset] | this[offset + 1] << 8;
  return val & 32768 ? val | 4294901760 : val;
}, "readInt16LE");
Buffer2.prototype.readInt16BE = /* @__PURE__ */ __name(function readInt16BE(offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 2, this.length);
  var val = this[offset + 1] | this[offset] << 8;
  return val & 32768 ? val | 4294901760 : val;
}, "readInt16BE");
Buffer2.prototype.readInt32LE = /* @__PURE__ */ __name(function readInt32LE(offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length);
  return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
}, "readInt32LE");
Buffer2.prototype.readInt32BE = /* @__PURE__ */ __name(function readInt32BE(offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length);
  return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
}, "readInt32BE");
Buffer2.prototype.readFloatLE = /* @__PURE__ */ __name(function readFloatLE(offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length);
  return ieee754read(this, offset, true, 23, 4);
}, "readFloatLE");
Buffer2.prototype.readFloatBE = /* @__PURE__ */ __name(function readFloatBE(offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length);
  return ieee754read(this, offset, false, 23, 4);
}, "readFloatBE");
Buffer2.prototype.readDoubleLE = /* @__PURE__ */ __name(function readDoubleLE(offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 8, this.length);
  return ieee754read(this, offset, true, 52, 8);
}, "readDoubleLE");
Buffer2.prototype.readDoubleBE = /* @__PURE__ */ __name(function readDoubleBE(offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 8, this.length);
  return ieee754read(this, offset, false, 52, 8);
}, "readDoubleBE");
function checkInt(buf, value, offset, ext, max, min) {
  if (!internalIsBuffer(buf))
    throw new TypeError('"buffer" argument must be a Buffer instance');
  if (value > max || value < min)
    throw new RangeError('"value" argument is out of bounds');
  if (offset + ext > buf.length)
    throw new RangeError("Index out of range");
}
__name(checkInt, "checkInt");
Buffer2.prototype.writeUIntLE = /* @__PURE__ */ __name(function writeUIntLE(value, offset, byteLength2, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength2 = byteLength2 | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength2) - 1;
    checkInt(this, value, offset, byteLength2, maxBytes, 0);
  }
  var mul = 1;
  var i = 0;
  this[offset] = value & 255;
  while (++i < byteLength2 && (mul *= 256)) {
    this[offset + i] = value / mul & 255;
  }
  return offset + byteLength2;
}, "writeUIntLE");
Buffer2.prototype.writeUIntBE = /* @__PURE__ */ __name(function writeUIntBE(value, offset, byteLength2, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength2 = byteLength2 | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength2) - 1;
    checkInt(this, value, offset, byteLength2, maxBytes, 0);
  }
  var i = byteLength2 - 1;
  var mul = 1;
  this[offset + i] = value & 255;
  while (--i >= 0 && (mul *= 256)) {
    this[offset + i] = value / mul & 255;
  }
  return offset + byteLength2;
}, "writeUIntBE");
Buffer2.prototype.writeUInt8 = /* @__PURE__ */ __name(function writeUInt8(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert)
    checkInt(this, value, offset, 1, 255, 0);
  if (!Buffer2.TYPED_ARRAY_SUPPORT)
    value = Math.floor(value);
  this[offset] = value & 255;
  return offset + 1;
}, "writeUInt8");
function objectWriteUInt16(buf, value, offset, littleEndian) {
  if (value < 0)
    value = 65535 + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & 255 << 8 * (littleEndian ? i : 1 - i)) >>> (littleEndian ? i : 1 - i) * 8;
  }
}
__name(objectWriteUInt16, "objectWriteUInt16");
Buffer2.prototype.writeUInt16LE = /* @__PURE__ */ __name(function writeUInt16LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert)
    checkInt(this, value, offset, 2, 65535, 0);
  if (Buffer2.TYPED_ARRAY_SUPPORT) {
    this[offset] = value & 255;
    this[offset + 1] = value >>> 8;
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2;
}, "writeUInt16LE");
Buffer2.prototype.writeUInt16BE = /* @__PURE__ */ __name(function writeUInt16BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert)
    checkInt(this, value, offset, 2, 65535, 0);
  if (Buffer2.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 8;
    this[offset + 1] = value & 255;
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2;
}, "writeUInt16BE");
function objectWriteUInt32(buf, value, offset, littleEndian) {
  if (value < 0)
    value = 4294967295 + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = value >>> (littleEndian ? i : 3 - i) * 8 & 255;
  }
}
__name(objectWriteUInt32, "objectWriteUInt32");
Buffer2.prototype.writeUInt32LE = /* @__PURE__ */ __name(function writeUInt32LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert)
    checkInt(this, value, offset, 4, 4294967295, 0);
  if (Buffer2.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = value >>> 24;
    this[offset + 2] = value >>> 16;
    this[offset + 1] = value >>> 8;
    this[offset] = value & 255;
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4;
}, "writeUInt32LE");
Buffer2.prototype.writeUInt32BE = /* @__PURE__ */ __name(function writeUInt32BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert)
    checkInt(this, value, offset, 4, 4294967295, 0);
  if (Buffer2.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 255;
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4;
}, "writeUInt32BE");
Buffer2.prototype.writeIntLE = /* @__PURE__ */ __name(function writeIntLE(value, offset, byteLength2, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength2 - 1);
    checkInt(this, value, offset, byteLength2, limit - 1, -limit);
  }
  var i = 0;
  var mul = 1;
  var sub = 0;
  this[offset] = value & 255;
  while (++i < byteLength2 && (mul *= 256)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = (value / mul >> 0) - sub & 255;
  }
  return offset + byteLength2;
}, "writeIntLE");
Buffer2.prototype.writeIntBE = /* @__PURE__ */ __name(function writeIntBE(value, offset, byteLength2, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength2 - 1);
    checkInt(this, value, offset, byteLength2, limit - 1, -limit);
  }
  var i = byteLength2 - 1;
  var mul = 1;
  var sub = 0;
  this[offset + i] = value & 255;
  while (--i >= 0 && (mul *= 256)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = (value / mul >> 0) - sub & 255;
  }
  return offset + byteLength2;
}, "writeIntBE");
Buffer2.prototype.writeInt8 = /* @__PURE__ */ __name(function writeInt8(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert)
    checkInt(this, value, offset, 1, 127, -128);
  if (!Buffer2.TYPED_ARRAY_SUPPORT)
    value = Math.floor(value);
  if (value < 0)
    value = 255 + value + 1;
  this[offset] = value & 255;
  return offset + 1;
}, "writeInt8");
Buffer2.prototype.writeInt16LE = /* @__PURE__ */ __name(function writeInt16LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert)
    checkInt(this, value, offset, 2, 32767, -32768);
  if (Buffer2.TYPED_ARRAY_SUPPORT) {
    this[offset] = value & 255;
    this[offset + 1] = value >>> 8;
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2;
}, "writeInt16LE");
Buffer2.prototype.writeInt16BE = /* @__PURE__ */ __name(function writeInt16BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert)
    checkInt(this, value, offset, 2, 32767, -32768);
  if (Buffer2.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 8;
    this[offset + 1] = value & 255;
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2;
}, "writeInt16BE");
Buffer2.prototype.writeInt32LE = /* @__PURE__ */ __name(function writeInt32LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert)
    checkInt(this, value, offset, 4, 2147483647, -2147483648);
  if (Buffer2.TYPED_ARRAY_SUPPORT) {
    this[offset] = value & 255;
    this[offset + 1] = value >>> 8;
    this[offset + 2] = value >>> 16;
    this[offset + 3] = value >>> 24;
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4;
}, "writeInt32LE");
Buffer2.prototype.writeInt32BE = /* @__PURE__ */ __name(function writeInt32BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert)
    checkInt(this, value, offset, 4, 2147483647, -2147483648);
  if (value < 0)
    value = 4294967295 + value + 1;
  if (Buffer2.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 255;
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4;
}, "writeInt32BE");
function checkIEEE754(buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length)
    throw new RangeError("Index out of range");
  if (offset < 0)
    throw new RangeError("Index out of range");
}
__name(checkIEEE754, "checkIEEE754");
function writeFloat(buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(
      buf,
      value,
      offset,
      4,
      34028234663852886e22,
      -34028234663852886e22
    );
  }
  ieee754write(buf, value, offset, littleEndian, 23, 4);
  return offset + 4;
}
__name(writeFloat, "writeFloat");
Buffer2.prototype.writeFloatLE = /* @__PURE__ */ __name(function writeFloatLE(value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert);
}, "writeFloatLE");
Buffer2.prototype.writeFloatBE = /* @__PURE__ */ __name(function writeFloatBE(value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert);
}, "writeFloatBE");
function writeDouble(buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(
      buf,
      value,
      offset,
      8,
      17976931348623157e292,
      -17976931348623157e292
    );
  }
  ieee754write(buf, value, offset, littleEndian, 52, 8);
  return offset + 8;
}
__name(writeDouble, "writeDouble");
Buffer2.prototype.writeDoubleLE = /* @__PURE__ */ __name(function writeDoubleLE(value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert);
}, "writeDoubleLE");
Buffer2.prototype.writeDoubleBE = /* @__PURE__ */ __name(function writeDoubleBE(value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert);
}, "writeDoubleBE");
Buffer2.prototype.copy = /* @__PURE__ */ __name(function copy(target, targetStart, start, end) {
  if (!start)
    start = 0;
  if (!end && end !== 0)
    end = this.length;
  if (targetStart >= target.length)
    targetStart = target.length;
  if (!targetStart)
    targetStart = 0;
  if (end > 0 && end < start)
    end = start;
  if (end === start)
    return 0;
  if (target.length === 0 || this.length === 0)
    return 0;
  if (targetStart < 0) {
    throw new RangeError("targetStart out of bounds");
  }
  if (start < 0 || start >= this.length)
    throw new RangeError("sourceStart out of bounds");
  if (end < 0)
    throw new RangeError("sourceEnd out of bounds");
  if (end > this.length)
    end = this.length;
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start;
  }
  var len = end - start;
  var i;
  if (this === target && start < targetStart && targetStart < end) {
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start];
    }
  } else if (len < 1e3 || !Buffer2.TYPED_ARRAY_SUPPORT) {
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start];
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    );
  }
  return len;
}, "copy");
Buffer2.prototype.fill = /* @__PURE__ */ __name(function fill(val, start, end, encoding) {
  if (typeof val === "string") {
    if (typeof start === "string") {
      encoding = start;
      start = 0;
      end = this.length;
    } else if (typeof end === "string") {
      encoding = end;
      end = this.length;
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0);
      if (code < 256) {
        val = code;
      }
    }
    if (encoding !== void 0 && typeof encoding !== "string") {
      throw new TypeError("encoding must be a string");
    }
    if (typeof encoding === "string" && !Buffer2.isEncoding(encoding)) {
      throw new TypeError("Unknown encoding: " + encoding);
    }
  } else if (typeof val === "number") {
    val = val & 255;
  }
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError("Out of range index");
  }
  if (end <= start) {
    return this;
  }
  start = start >>> 0;
  end = end === void 0 ? this.length : end >>> 0;
  if (!val)
    val = 0;
  var i;
  if (typeof val === "number") {
    for (i = start; i < end; ++i) {
      this[i] = val;
    }
  } else {
    var bytes = internalIsBuffer(val) ? val : utf8ToBytes(new Buffer2(val, encoding).toString());
    var len = bytes.length;
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len];
    }
  }
  return this;
}, "fill");
var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;
function base64clean(str) {
  str = stringtrim(str).replace(INVALID_BASE64_RE, "");
  if (str.length < 2)
    return "";
  while (str.length % 4 !== 0) {
    str = str + "=";
  }
  return str;
}
__name(base64clean, "base64clean");
function stringtrim(str) {
  if (str.trim)
    return str.trim();
  return str.replace(/^\s+|\s+$/g, "");
}
__name(stringtrim, "stringtrim");
function toHex(n) {
  if (n < 16)
    return "0" + n.toString(16);
  return n.toString(16);
}
__name(toHex, "toHex");
function utf8ToBytes(string, units) {
  units = units || Infinity;
  var codePoint;
  var length = string.length;
  var leadSurrogate = null;
  var bytes = [];
  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i);
    if (codePoint > 55295 && codePoint < 57344) {
      if (!leadSurrogate) {
        if (codePoint > 56319) {
          if ((units -= 3) > -1)
            bytes.push(239, 191, 189);
          continue;
        } else if (i + 1 === length) {
          if ((units -= 3) > -1)
            bytes.push(239, 191, 189);
          continue;
        }
        leadSurrogate = codePoint;
        continue;
      }
      if (codePoint < 56320) {
        if ((units -= 3) > -1)
          bytes.push(239, 191, 189);
        leadSurrogate = codePoint;
        continue;
      }
      codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
    } else if (leadSurrogate) {
      if ((units -= 3) > -1)
        bytes.push(239, 191, 189);
    }
    leadSurrogate = null;
    if (codePoint < 128) {
      if ((units -= 1) < 0)
        break;
      bytes.push(codePoint);
    } else if (codePoint < 2048) {
      if ((units -= 2) < 0)
        break;
      bytes.push(codePoint >> 6 | 192, codePoint & 63 | 128);
    } else if (codePoint < 65536) {
      if ((units -= 3) < 0)
        break;
      bytes.push(
        codePoint >> 12 | 224,
        codePoint >> 6 & 63 | 128,
        codePoint & 63 | 128
      );
    } else if (codePoint < 1114112) {
      if ((units -= 4) < 0)
        break;
      bytes.push(
        codePoint >> 18 | 240,
        codePoint >> 12 & 63 | 128,
        codePoint >> 6 & 63 | 128,
        codePoint & 63 | 128
      );
    } else {
      throw new Error("Invalid code point");
    }
  }
  return bytes;
}
__name(utf8ToBytes, "utf8ToBytes");
function asciiToBytes(str) {
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    byteArray.push(str.charCodeAt(i) & 255);
  }
  return byteArray;
}
__name(asciiToBytes, "asciiToBytes");
function utf16leToBytes(str, units) {
  var c, hi, lo;
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0)
      break;
    c = str.charCodeAt(i);
    hi = c >> 8;
    lo = c % 256;
    byteArray.push(lo);
    byteArray.push(hi);
  }
  return byteArray;
}
__name(utf16leToBytes, "utf16leToBytes");
function base64ToBytes(str) {
  return base64toByteArray(base64clean(str));
}
__name(base64ToBytes, "base64ToBytes");
function blitBuffer(src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if (i + offset >= dst.length || i >= src.length)
      break;
    dst[i + offset] = src[i];
  }
  return i;
}
__name(blitBuffer, "blitBuffer");
function isnan(val) {
  return val !== val;
}
__name(isnan, "isnan");
function isBuffer(obj) {
  return obj != null && (!!obj._isBuffer || isFastBuffer(obj) || isSlowBuffer(obj));
}
__name(isBuffer, "isBuffer");
function isFastBuffer(obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj);
}
__name(isFastBuffer, "isFastBuffer");
function isSlowBuffer(obj) {
  return typeof obj.readFloatLE === "function" && typeof obj.slice === "function" && isFastBuffer(obj.slice(0, 0));
}
__name(isSlowBuffer, "isSlowBuffer");
function ieee754read(buffer, offset, isLE, mLen, nBytes) {
  var e, m;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i = isLE ? nBytes - 1 : 0;
  var d = isLE ? -1 : 1;
  var s = buffer[offset + i];
  i += d;
  e = s & (1 << -nBits) - 1;
  s >>= -nBits;
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {
  }
  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {
  }
  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : (s ? -1 : 1) * Infinity;
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
}
__name(ieee754read, "ieee754read");
function ieee754write(buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
  var i = isLE ? 0 : nBytes - 1;
  var d = isLE ? 1 : -1;
  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
  value = Math.abs(value);
  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }
    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }
  for (; mLen >= 8; buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {
  }
  e = e << mLen | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
  }
  buffer[offset + i - d] |= s * 128;
}
__name(ieee754write, "ieee754write");

// utils/uuid.js
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
}
__name(generateUUID, "generateUUID");
function isValidUUID(uuid) {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
}
__name(isValidUUID, "isValidUUID");

// routes/session.js
async function initSession(request, env2) {
  try {
    const body = await request.json();
    const { userAgent, isDev } = body;
    const existingSessionId = request.headers.get("X-Session-ID");
    if (existingSessionId && isValidUUID(existingSessionId)) {
      const session = await env2.DB.prepare(`
        SELECT session_id, is_dev
        FROM user_sessions
        WHERE session_id = ?
      `).bind(existingSessionId).first();
      if (session) {
        await env2.DB.prepare(`
          UPDATE user_sessions
          SET last_active = datetime('now')
          WHERE session_id = ?
        `).bind(existingSessionId).run();
        return new Response(JSON.stringify({
          sessionId: existingSessionId,
          isNew: false,
          isDev: session.is_dev === 1
        }), {
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    const sessionId = generateUUID();
    await env2.DB.prepare(`
      INSERT INTO user_sessions (session_id, is_dev, user_agent, first_seen, last_active)
      VALUES (?, ?, ?, datetime('now'), datetime('now'))
    `).bind(sessionId, isDev ? 1 : 0, userAgent || "unknown").run();
    return new Response(JSON.stringify({
      sessionId,
      isNew: true,
      isDev: isDev || false
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error in initSession:", error);
    return new Response(JSON.stringify({
      error: "Failed to initialize session",
      message: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(initSession, "initSession");
async function validateSession(request, env2) {
  try {
    const sessionId = request.headers.get("X-Session-ID");
    if (!sessionId || !isValidUUID(sessionId)) {
      return new Response(JSON.stringify({
        valid: false,
        error: "Invalid session ID format"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const session = await env2.DB.prepare(`
      SELECT session_id, is_dev, first_seen
      FROM user_sessions
      WHERE session_id = ?
    `).bind(sessionId).first();
    if (!session) {
      return new Response(JSON.stringify({
        valid: false,
        error: "Session not found"
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    await env2.DB.prepare(`
      UPDATE user_sessions
      SET last_active = datetime('now')
      WHERE session_id = ?
    `).bind(sessionId).run();
    return new Response(JSON.stringify({
      valid: true,
      isDev: session.is_dev === 1,
      firstSeen: session.first_seen
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error in validateSession:", error);
    return new Response(JSON.stringify({
      error: "Failed to validate session",
      message: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(validateSession, "validateSession");

// utils/dates.js
function getTodayDate() {
  const now = /* @__PURE__ */ new Date();
  return formatDate(now);
}
__name(getTodayDate, "getTodayDate");
function formatDate(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
__name(formatDate, "formatDate");
function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getUTCDay();
  const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setUTCDate(diff));
  return formatDate(monday);
}
__name(getWeekStart, "getWeekStart");
function getCurrentWeekStart() {
  return getWeekStart(/* @__PURE__ */ new Date());
}
__name(getCurrentWeekStart, "getCurrentWeekStart");
function hashDate(dateStr) {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    const char = dateStr.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}
__name(hashDate, "hashDate");
function parseDate(dateStr) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}
__name(parseDate, "parseDate");
function isValidDate(dateStr) {
  if (!dateStr || typeof dateStr !== "string")
    return false;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr))
    return false;
  const date = parseDate(dateStr);
  return date instanceof Date && !isNaN(date);
}
__name(isValidDate, "isValidDate");

// utils/movieSelection.js
async function selectDailyMovies(db, date) {
  const existing = await db.prepare(`
    SELECT difficulty, movie_title, movie_year
    FROM daily_movies
    WHERE date = ?
    ORDER BY difficulty
  `).bind(date).all();
  if (existing.results.length === 5) {
    return existing.results.map((m) => ({
      difficulty: m.difficulty,
      title: m.movie_title,
      year: m.movie_year
    }));
  }
  const selectedMovies = [];
  const seed = hashDate(date);
  for (let difficulty = 1; difficulty <= 5; difficulty++) {
    const existingForDifficulty = existing.results.find((m) => m.difficulty === difficulty);
    if (existingForDifficulty) {
      selectedMovies.push({
        difficulty,
        title: existingForDifficulty.movie_title,
        year: existingForDifficulty.movie_year
      });
      continue;
    }
    const moviesOfDifficulty = await db.prepare(`
      SELECT title, year
      FROM movies
      WHERE difficulty = ?
      ORDER BY title
    `).bind(difficulty).all();
    if (moviesOfDifficulty.results.length === 0) {
      throw new Error(`No movies found for difficulty ${difficulty}`);
    }
    const recentlyUsed = await db.prepare(`
      SELECT DISTINCT movie_title
      FROM daily_movies
      WHERE difficulty = ?
        AND date >= date('now', '-365 days')
    `).bind(difficulty).all();
    const usedTitles = new Set(recentlyUsed.results.map((r) => r.movie_title));
    let availableMovies = moviesOfDifficulty.results.filter((m) => !usedTitles.has(m.title));
    if (availableMovies.length === 0) {
      availableMovies = moviesOfDifficulty.results;
    }
    const index = (seed + difficulty * 37) % availableMovies.length;
    const selected = availableMovies[index];
    await db.prepare(`
      INSERT INTO daily_movies (date, difficulty, movie_title, movie_year)
      VALUES (?, ?, ?, ?)
    `).bind(date, difficulty, selected.title, selected.year).run();
    selectedMovies.push({
      difficulty,
      title: selected.title,
      year: selected.year
    });
  }
  return selectedMovies;
}
__name(selectDailyMovies, "selectDailyMovies");
async function getFullMovieDetails(db, movieTitles) {
  const movies = [];
  for (const titleObj of movieTitles) {
    const movie = await db.prepare(`
      SELECT *
      FROM movies
      WHERE title = ? AND difficulty = ?
    `).bind(titleObj.title, titleObj.difficulty).first();
    if (movie) {
      movies.push({
        title: movie.title,
        year: movie.year,
        difficulty: movie.difficulty,
        quotes: [movie.quote1, movie.quote2],
        actors: [movie.actor1, movie.actor2]
      });
    }
  }
  return movies;
}
__name(getFullMovieDetails, "getFullMovieDetails");
async function syncMovieDatabase(db, movieDatabase) {
  let synced = 0;
  let errors = 0;
  for (const movie of movieDatabase) {
    try {
      await db.prepare(`
        INSERT INTO movies (title, year, difficulty, quote1, quote2, actor1, actor2)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(title) DO UPDATE SET
          year = excluded.year,
          difficulty = excluded.difficulty,
          quote1 = excluded.quote1,
          quote2 = excluded.quote2,
          actor1 = excluded.actor1,
          actor2 = excluded.actor2,
          updated_at = datetime('now')
      `).bind(
        movie.title,
        movie.year,
        movie.difficulty,
        movie.quotes[0],
        movie.quotes[1],
        movie.actors[0],
        movie.actors[1]
      ).run();
      synced++;
    } catch (error) {
      console.error(`Error syncing movie ${movie.title}:`, error);
      errors++;
    }
  }
  return { synced, errors, total: movieDatabase.length };
}
__name(syncMovieDatabase, "syncMovieDatabase");

// routes/movies.js
async function getDailyMovies(request, env2) {
  try {
    const url = new URL(request.url);
    let date = url.searchParams.get("date") || getTodayDate();
    if (!isValidDate(date)) {
      return new Response(JSON.stringify({
        error: "Invalid date format. Use YYYY-MM-DD"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const selectedMovies = await selectDailyMovies(env2.DB, date);
    const fullMovies = await getFullMovieDetails(env2.DB, selectedMovies);
    return new Response(JSON.stringify({
      date,
      movies: fullMovies
    }), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600"
        // Cache for 1 hour
      }
    });
  } catch (error) {
    console.error("Error in getDailyMovies:", error);
    return new Response(JSON.stringify({
      error: "Failed to get daily movies",
      message: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(getDailyMovies, "getDailyMovies");
async function getMovieHistory(request, env2) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "30", 10);
    const history = await env2.DB.prepare(`
      SELECT date, difficulty, movie_title, movie_year
      FROM daily_movies
      WHERE date < date('now')
      ORDER BY date DESC, difficulty ASC
      LIMIT ?
    `).bind(Math.min(limit, 365)).all();
    const grouped = {};
    for (const row of history.results) {
      if (!grouped[row.date]) {
        grouped[row.date] = [];
      }
      grouped[row.date].push({
        difficulty: row.difficulty,
        title: row.movie_title,
        year: row.movie_year
      });
    }
    return new Response(JSON.stringify({
      history: Object.entries(grouped).map(([date, movies]) => ({
        date,
        movies
      }))
    }), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600"
      }
    });
  } catch (error) {
    console.error("Error in getMovieHistory:", error);
    return new Response(JSON.stringify({
      error: "Failed to get movie history",
      message: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(getMovieHistory, "getMovieHistory");

// utils/scoring.js
function calculateScore({ wins, rounds, totalHints, perfectRounds }) {
  if (rounds === 0)
    return 0;
  let score = wins * 100;
  const avgHints = rounds > 0 ? totalHints / rounds : 6;
  const efficiencyBonus = Math.max(0, (6 - avgHints) * 60);
  score += efficiencyBonus;
  score += perfectRounds * 200;
  const winRate = rounds > 0 ? wins / rounds : 0;
  const winRateBonus = winRate * 150;
  score += winRateBonus;
  const losses = rounds - wins;
  score -= losses * 5;
  return Math.floor(Math.max(0, score));
}
__name(calculateScore, "calculateScore");
async function updateWeeklyLeaderboard(db, sessionId, weekStart, isDev = false) {
  const weekEnd = new Date(weekStart);
  weekEnd.setUTCDate(weekEnd.getUTCDate() + 7);
  const weekEndStr = weekEnd.toISOString().split("T")[0];
  const results = await db.prepare(`
    SELECT
      COUNT(*) as rounds,
      SUM(won) as wins,
      SUM(hints_used) as totalHints,
      SUM(CASE WHEN won = 1 AND hints_used = 1 THEN 1 ELSE 0 END) as perfectRounds
    FROM round_results
    WHERE session_id = ?
      AND date >= ?
      AND date < ?
      AND is_dev = ?
  `).bind(sessionId, weekStart, weekEndStr, isDev ? 1 : 0).first();
  const stats = {
    wins: results.wins || 0,
    rounds: results.rounds || 0,
    totalHints: results.totalHints || 0,
    perfectRounds: results.perfectRounds || 0
  };
  const score = calculateScore(stats);
  await db.prepare(`
    INSERT INTO weekly_leaderboard
      (session_id, week_start, total_rounds, total_wins, total_hints, perfect_rounds, score, is_dev, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    ON CONFLICT(session_id, week_start) DO UPDATE SET
      total_rounds = excluded.total_rounds,
      total_wins = excluded.total_wins,
      total_hints = excluded.total_hints,
      perfect_rounds = excluded.perfect_rounds,
      score = excluded.score,
      updated_at = datetime('now')
  `).bind(
    sessionId,
    weekStart,
    stats.rounds,
    stats.wins,
    stats.totalHints,
    stats.perfectRounds,
    score,
    isDev ? 1 : 0
  ).run();
  return { ...stats, score };
}
__name(updateWeeklyLeaderboard, "updateWeeklyLeaderboard");
async function getTopPlayers(db, weekStart, limit = 100, isDev = false) {
  const players = await db.prepare(`
    SELECT
      session_id,
      total_rounds,
      total_wins,
      total_hints,
      perfect_rounds,
      score
    FROM weekly_leaderboard
    WHERE week_start = ?
      AND is_dev = ?
      AND total_rounds > 0
    ORDER BY score DESC
    LIMIT ?
  `).bind(weekStart, isDev ? 1 : 0, limit).all();
  return players.results.map((p, index) => ({
    rank: index + 1,
    sessionId: p.session_id.substring(0, 8) + "...",
    // Anonymize
    wins: p.total_wins,
    rounds: p.total_rounds,
    avgHints: p.total_rounds > 0 ? (p.total_hints / p.total_rounds).toFixed(1) : 0,
    perfectRounds: p.perfect_rounds,
    score: p.score
  }));
}
__name(getTopPlayers, "getTopPlayers");
async function getPlayerRank(db, sessionId, weekStart, isDev = false) {
  const playerData = await db.prepare(`
    SELECT score, total_rounds, total_wins, total_hints, perfect_rounds
    FROM weekly_leaderboard
    WHERE session_id = ?
      AND week_start = ?
      AND is_dev = ?
  `).bind(sessionId, weekStart, isDev ? 1 : 0).first();
  if (!playerData) {
    return null;
  }
  const rankData = await db.prepare(`
    SELECT COUNT(*) + 1 as rank
    FROM weekly_leaderboard
    WHERE week_start = ?
      AND is_dev = ?
      AND score > ?
  `).bind(weekStart, isDev ? 1 : 0, playerData.score).first();
  return {
    rank: rankData.rank,
    wins: playerData.total_wins,
    rounds: playerData.total_rounds,
    avgHints: playerData.total_rounds > 0 ? (playerData.total_hints / playerData.total_rounds).toFixed(1) : 0,
    perfectRounds: playerData.perfect_rounds,
    score: playerData.score
  };
}
__name(getPlayerRank, "getPlayerRank");

// routes/results.js
async function submitResult(request, env2) {
  try {
    const sessionId = request.headers.get("X-Session-ID");
    const isDevHeader = request.headers.get("X-Is-Dev");
    const isDev = isDevHeader === "1" || isDevHeader === "true";
    if (!sessionId || !isValidUUID(sessionId)) {
      return new Response(JSON.stringify({
        error: "Invalid or missing session ID"
      }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    const body = await request.json();
    const { date, difficulty, won, hintsUsed } = body;
    if (!isValidDate(date)) {
      return new Response(JSON.stringify({
        error: "Invalid date format"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (difficulty < 1 || difficulty > 5) {
      return new Response(JSON.stringify({
        error: "Difficulty must be between 1 and 5"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (hintsUsed < 1 || hintsUsed > 6) {
      return new Response(JSON.stringify({
        error: "Hints used must be between 1 and 6"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const existing = await env2.DB.prepare(`
      SELECT id
      FROM round_results
      WHERE session_id = ?
        AND date = ?
        AND difficulty = ?
    `).bind(sessionId, date, difficulty).first();
    if (existing) {
      return new Response(JSON.stringify({
        error: "Result already submitted for this round",
        duplicate: true
      }), {
        status: 409,
        headers: { "Content-Type": "application/json" }
      });
    }
    await env2.DB.prepare(`
      INSERT INTO round_results (session_id, date, difficulty, won, hints_used, is_dev)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      sessionId,
      date,
      difficulty,
      won ? 1 : 0,
      hintsUsed,
      isDev ? 1 : 0
    ).run();
    const weekStart = getCurrentWeekStart();
    const leaderboardStats = await updateWeeklyLeaderboard(
      env2.DB,
      sessionId,
      weekStart,
      isDev
    );
    let globalStats = null;
    if (!isDev) {
      const stats = await env2.DB.prepare(`
        SELECT
          COUNT(*) as totalPlayed,
          SUM(won) as totalWon,
          AVG(CAST(hints_used AS FLOAT)) as avgHints
        FROM round_results
        WHERE date = ?
          AND difficulty = ?
          AND is_dev = 0
      `).bind(date, difficulty).first();
      globalStats = {
        totalPlayed: stats.totalPlayed || 0,
        totalWon: stats.totalWon || 0,
        winRate: stats.totalPlayed > 0 ? (stats.totalWon / stats.totalPlayed * 100).toFixed(1) : 0,
        avgHints: stats.avgHints ? parseFloat(stats.avgHints.toFixed(1)) : 0
      };
    }
    return new Response(JSON.stringify({
      success: true,
      globalStats,
      leaderboardStats: isDev ? null : leaderboardStats
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error in submitResult:", error);
    return new Response(JSON.stringify({
      error: "Failed to submit result",
      message: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(submitResult, "submitResult");
async function getUserResults(request, env2) {
  try {
    const sessionId = request.headers.get("X-Session-ID");
    if (!sessionId || !isValidUUID(sessionId)) {
      return new Response(JSON.stringify({
        error: "Invalid or missing session ID"
      }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    const url = new URL(request.url);
    const date = url.searchParams.get("date");
    if (date && !isValidDate(date)) {
      return new Response(JSON.stringify({
        error: "Invalid date format"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const query = date ? `SELECT * FROM round_results WHERE session_id = ? AND date = ? ORDER BY difficulty` : `SELECT * FROM round_results WHERE session_id = ? ORDER BY date DESC, difficulty LIMIT 100`;
    const results = date ? await env2.DB.prepare(query).bind(sessionId, date).all() : await env2.DB.prepare(query).bind(sessionId).all();
    return new Response(JSON.stringify({
      date,
      results: results.results
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error in getUserResults:", error);
    return new Response(JSON.stringify({
      error: "Failed to get user results",
      message: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(getUserResults, "getUserResults");

// routes/stats.js
async function getGlobalStats(request, env2) {
  try {
    const url = new URL(request.url);
    const date = url.searchParams.get("date") || getTodayDate();
    const difficulty = parseInt(url.searchParams.get("difficulty"), 10);
    if (!isValidDate(date)) {
      return new Response(JSON.stringify({
        error: "Invalid date format"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!difficulty || difficulty < 1 || difficulty > 5) {
      return new Response(JSON.stringify({
        error: "Difficulty must be between 1 and 5"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const overallStats = await env2.DB.prepare(`
      SELECT
        COUNT(*) as totalPlayed,
        SUM(won) as totalWon,
        AVG(CAST(hints_used AS FLOAT)) as avgHints
      FROM round_results
      WHERE date = ?
        AND difficulty = ?
        AND is_dev = 0
    `).bind(date, difficulty).first();
    const hintDist = await env2.DB.prepare(`
      SELECT
        hints_used,
        COUNT(*) as count
      FROM round_results
      WHERE date = ?
        AND difficulty = ?
        AND won = 1
        AND is_dev = 0
      GROUP BY hints_used
      ORDER BY hints_used
    `).bind(date, difficulty).all();
    const hintDistribution = [0, 0, 0, 0, 0, 0];
    for (const row of hintDist.results) {
      if (row.hints_used >= 1 && row.hints_used <= 6) {
        hintDistribution[row.hints_used - 1] = row.count;
      }
    }
    const stats = {
      totalPlayed: overallStats.totalPlayed || 0,
      totalWon: overallStats.totalWon || 0,
      winRate: overallStats.totalPlayed > 0 ? parseFloat((overallStats.totalWon / overallStats.totalPlayed * 100).toFixed(1)) : 0,
      avgHints: overallStats.avgHints ? parseFloat(overallStats.avgHints.toFixed(1)) : 0,
      hintDistribution
    };
    return new Response(JSON.stringify({
      date,
      difficulty,
      stats
    }), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300"
        // Cache for 5 minutes
      }
    });
  } catch (error) {
    console.error("Error in getGlobalStats:", error);
    return new Response(JSON.stringify({
      error: "Failed to get global stats",
      message: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(getGlobalStats, "getGlobalStats");
async function getDailyStats(request, env2) {
  try {
    const url = new URL(request.url);
    const date = url.searchParams.get("date") || getTodayDate();
    if (!isValidDate(date)) {
      return new Response(JSON.stringify({
        error: "Invalid date format"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const difficulties = [];
    for (let difficulty = 1; difficulty <= 5; difficulty++) {
      const stats = await env2.DB.prepare(`
        SELECT
          COUNT(*) as totalPlayed,
          SUM(won) as totalWon,
          AVG(CAST(hints_used AS FLOAT)) as avgHints
        FROM round_results
        WHERE date = ?
          AND difficulty = ?
          AND is_dev = 0
      `).bind(date, difficulty).first();
      difficulties.push({
        difficulty,
        totalPlayed: stats.totalPlayed || 0,
        totalWon: stats.totalWon || 0,
        winRate: stats.totalPlayed > 0 ? parseFloat((stats.totalWon / stats.totalPlayed * 100).toFixed(1)) : 0,
        avgHints: stats.avgHints ? parseFloat(stats.avgHints.toFixed(1)) : 0
      });
    }
    return new Response(JSON.stringify({
      date,
      difficulties
    }), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300"
      }
    });
  } catch (error) {
    console.error("Error in getDailyStats:", error);
    return new Response(JSON.stringify({
      error: "Failed to get daily stats",
      message: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(getDailyStats, "getDailyStats");

// routes/leaderboard.js
async function getWeeklyLeaderboard(request, env2) {
  try {
    const url = new URL(request.url);
    let weekStart = url.searchParams.get("week") || getCurrentWeekStart();
    const limit = parseInt(url.searchParams.get("limit") || "100", 10);
    if (!isValidDate(weekStart)) {
      return new Response(JSON.stringify({
        error: "Invalid week format. Use YYYY-MM-DD"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    weekStart = getWeekStart(weekStart);
    const topPlayers = await getTopPlayers(env2.DB, weekStart, Math.min(limit, 500), false);
    let yourRank = null;
    const sessionId = request.headers.get("X-Session-ID");
    if (sessionId && isValidUUID(sessionId)) {
      yourRank = await getPlayerRank(env2.DB, sessionId, weekStart, false);
    }
    return new Response(JSON.stringify({
      weekStart,
      topPlayers,
      yourRank,
      totalPlayers: topPlayers.length
    }), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60"
        // Cache for 1 minute
      }
    });
  } catch (error) {
    console.error("Error in getWeeklyLeaderboard:", error);
    return new Response(JSON.stringify({
      error: "Failed to get weekly leaderboard",
      message: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(getWeeklyLeaderboard, "getWeeklyLeaderboard");
async function getPlayerRankInfo(request, env2) {
  try {
    const sessionId = request.headers.get("X-Session-ID");
    if (!sessionId || !isValidUUID(sessionId)) {
      return new Response(JSON.stringify({
        error: "Invalid or missing session ID"
      }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    const weekStart = getCurrentWeekStart();
    const rankInfo = await getPlayerRank(env2.DB, sessionId, weekStart, false);
    if (!rankInfo) {
      return new Response(JSON.stringify({
        weekStart,
        rank: null,
        message: "No games played this week"
      }), {
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({
      weekStart,
      ...rankInfo
    }), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "private, max-age=30"
      }
    });
  } catch (error) {
    console.error("Error in getPlayerRankInfo:", error);
    return new Response(JSON.stringify({
      error: "Failed to get player rank",
      message: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(getPlayerRankInfo, "getPlayerRankInfo");

// index.js
var CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  // TODO: Restrict to cinemdle.com in production
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Session-ID, X-Is-Dev",
  "Access-Control-Max-Age": "86400"
  // 24 hours
};
function handleOptions() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS
  });
}
__name(handleOptions, "handleOptions");
function addCorsHeaders(response) {
  const newResponse = new Response(response.body, response);
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    newResponse.headers.set(key, value);
  });
  return newResponse;
}
__name(addCorsHeaders, "addCorsHeaders");
var worker_default = {
  async fetch(request, env2, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    if (method === "OPTIONS") {
      return handleOptions();
    }
    try {
      let response;
      if (path === "/api/health" || path === "/health") {
        response = new Response(JSON.stringify({
          status: "ok",
          version: "1.0.0",
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }), {
          headers: { "Content-Type": "application/json" }
        });
      } else if (path === "/api/session/init" && method === "POST") {
        response = await initSession(request, env2);
      } else if (path === "/api/session/validate" && method === "GET") {
        response = await validateSession(request, env2);
      } else if (path === "/api/movies/daily" && method === "GET") {
        response = await getDailyMovies(request, env2);
      } else if (path === "/api/movies/history" && method === "GET") {
        response = await getMovieHistory(request, env2);
      } else if (path === "/api/results/submit" && method === "POST") {
        response = await submitResult(request, env2);
      } else if (path === "/api/results/user" && method === "GET") {
        response = await getUserResults(request, env2);
      } else if (path === "/api/stats/global" && method === "GET") {
        response = await getGlobalStats(request, env2);
      } else if (path === "/api/stats/daily" && method === "GET") {
        response = await getDailyStats(request, env2);
      } else if (path === "/api/leaderboard/weekly" && method === "GET") {
        response = await getWeeklyLeaderboard(request, env2);
      } else if (path === "/api/leaderboard/rank" && method === "GET") {
        response = await getPlayerRankInfo(request, env2);
      } else if (path === "/api/admin/sync-movies" && method === "POST") {
        const body = await request.json();
        const result = await syncMovieDatabase(env2.DB, body.movies);
        response = new Response(JSON.stringify(result), {
          headers: { "Content-Type": "application/json" }
        });
      } else {
        response = new Response(JSON.stringify({
          error: "Not found",
          path,
          method
        }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }
      return addCorsHeaders(response);
    } catch (error) {
      console.error("Worker error:", error);
      const errorResponse = new Response(JSON.stringify({
        error: "Internal server error",
        message: error.message,
        stack: env2.ENVIRONMENT === "development" ? error.stack : void 0
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
      return addCorsHeaders(errorResponse);
    }
  }
};

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
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-QVsdI2/middleware-insertion-facade.js
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

// .wrangler/tmp/bundle-QVsdI2/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__, "__Facade_ScheduledController__");
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
      const dispatcher = /* @__PURE__ */ __name(function(type, init2) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init2.cron ?? "",
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
    #fetchDispatcher = (request, env2, ctx) => {
      this.env = env2;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init2) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init2.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
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
/*! Bundled license information:

@esbuild-plugins/node-globals-polyfill/Buffer.js:
  (*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
   * @license  MIT
   *)
*/
//# sourceMappingURL=index.js.map
