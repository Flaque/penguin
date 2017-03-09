/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
	
	var _fsJetpack = __webpack_require__(1);
	
	var _fsJetpack2 = _interopRequireDefault(_fsJetpack);
	
	document.ondragover = document.ondrop = function (ev) {
	  ev.preventDefault();
	};
	
	document.body.ondrop = function (ev) {
	  var path = ev.dataTransfer.files[0].path;
	  ev.preventDefault();
	
	  var data = _fsJetpack2["default"].read(path);
	
	  console.log(data, path);
	
	  var parser = new DOMParser();
	  var doc = parser.parseFromString(data, "application/xml");
	  var svg = doc.getElementsByTagName("svg")[0];
	
	  Array.prototype.forEach.call(svg.querySelectorAll("*"), function (el) {
	    el.setAttribute('fill', 'green');
	  });
	
	  _fsJetpack2["default"].write(path, svg.outerHTML);
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var jetpack = __webpack_require__(2);
	
	module.exports = jetpack();


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* eslint no-param-reassign:0 */
	
	'use strict';
	
	var util = __webpack_require__(3);
	var pathUtil = __webpack_require__(4);
	var Q = __webpack_require__(5);
	
	var append = __webpack_require__(6);
	var dir = __webpack_require__(11);
	var file = __webpack_require__(31);
	var find = __webpack_require__(32);
	var inspect = __webpack_require__(35);
	var inspectTree = __webpack_require__(40);
	var copy = __webpack_require__(41);
	var exists = __webpack_require__(42);
	var list = __webpack_require__(37);
	var move = __webpack_require__(43);
	var read = __webpack_require__(44);
	var remove = __webpack_require__(45);
	var rename = __webpack_require__(46);
	var symlink = __webpack_require__(47);
	var streams = __webpack_require__(48);
	var write = __webpack_require__(8);
	
	// The Jetpack Context object.
	// It provides the public API, and resolves all paths regarding to
	// passed cwdPath, or default process.cwd() if cwdPath was not specified.
	var jetpackContext = function (cwdPath) {
	  var getCwdPath = function () {
	    return cwdPath || process.cwd();
	  };
	
	  var cwd = function () {
	    var args;
	    var pathParts;
	
	    // return current CWD if no arguments specified...
	    if (arguments.length === 0) {
	      return getCwdPath();
	    }
	
	    // ...create new CWD context otherwise
	    args = Array.prototype.slice.call(arguments);
	    pathParts = [getCwdPath()].concat(args);
	    return jetpackContext(pathUtil.resolve.apply(null, pathParts));
	  };
	
	  // resolves path to inner CWD path of this jetpack instance
	  var resolvePath = function (path) {
	    return pathUtil.resolve(getCwdPath(), path);
	  };
	
	  var getPath = function () {
	    // add CWD base path as first element of arguments array
	    Array.prototype.unshift.call(arguments, getCwdPath());
	    return pathUtil.resolve.apply(null, arguments);
	  };
	
	  var normalizeOptions = function (options) {
	    var opts = options || {};
	    opts.cwd = getCwdPath();
	    return opts;
	  };
	
	  // API
	
	  var api = {
	    cwd: cwd,
	    path: getPath,
	
	    append: function (path, data, options) {
	      append.validateInput('append', path, data, options);
	      append.sync(resolvePath(path), data, options);
	    },
	    appendAsync: function (path, data, options) {
	      append.validateInput('appendAsync', path, data, options);
	      return append.async(resolvePath(path), data, options);
	    },
	
	    copy: function (from, to, options) {
	      copy.validateInput('copy', from, to, options);
	      copy.sync(resolvePath(from), resolvePath(to), options);
	    },
	    copyAsync: function (from, to, options) {
	      copy.validateInput('copyAsync', from, to, options);
	      return copy.async(resolvePath(from), resolvePath(to), options);
	    },
	
	    createWriteStream: function (path, options) {
	      return streams.createWriteStream(resolvePath(path), options);
	    },
	    createReadStream: function (path, options) {
	      return streams.createReadStream(resolvePath(path), options);
	    },
	
	    dir: function (path, criteria) {
	      var normalizedPath;
	      dir.validateInput('dir', path, criteria);
	      normalizedPath = resolvePath(path);
	      dir.sync(normalizedPath, criteria);
	      return cwd(normalizedPath);
	    },
	    dirAsync: function (path, criteria) {
	      var deferred = Q.defer();
	      var normalizedPath;
	      dir.validateInput('dirAsync', path, criteria);
	      normalizedPath = resolvePath(path);
	      dir.async(normalizedPath, criteria)
	      .then(function () {
	        deferred.resolve(cwd(normalizedPath));
	      }, deferred.reject);
	      return deferred.promise;
	    },
	
	    exists: function (path) {
	      exists.validateInput('exists', path);
	      return exists.sync(resolvePath(path));
	    },
	    existsAsync: function (path) {
	      exists.validateInput('existsAsync', path);
	      return exists.async(resolvePath(path));
	    },
	
	    file: function (path, criteria) {
	      file.validateInput('file', path, criteria);
	      file.sync(resolvePath(path), criteria);
	      return this;
	    },
	    fileAsync: function (path, criteria) {
	      var deferred = Q.defer();
	      var that = this;
	      file.validateInput('fileAsync', path, criteria);
	      file.async(resolvePath(path), criteria)
	      .then(function () {
	        deferred.resolve(that);
	      }, deferred.reject);
	      return deferred.promise;
	    },
	
	    find: function (startPath, options) {
	      // startPath is optional parameter, if not specified move rest of params
	      // to proper places and default startPath to CWD.
	      if (typeof options === 'undefined' && typeof startPath === 'object') {
	        options = startPath;
	        startPath = '.';
	      }
	      find.validateInput('find', startPath, options);
	      return find.sync(resolvePath(startPath), normalizeOptions(options));
	    },
	    findAsync: function (startPath, options) {
	      // startPath is optional parameter, if not specified move rest of params
	      // to proper places and default startPath to CWD.
	      if (typeof options === 'undefined' && typeof startPath === 'object') {
	        options = startPath;
	        startPath = '.';
	      }
	      find.validateInput('findAsync', startPath, options);
	      return find.async(resolvePath(startPath), normalizeOptions(options));
	    },
	
	    inspect: function (path, fieldsToInclude) {
	      inspect.validateInput('inspect', path, fieldsToInclude);
	      return inspect.sync(resolvePath(path), fieldsToInclude);
	    },
	    inspectAsync: function (path, fieldsToInclude) {
	      inspect.validateInput('inspectAsync', path, fieldsToInclude);
	      return inspect.async(resolvePath(path), fieldsToInclude);
	    },
	
	    inspectTree: function (path, options) {
	      inspectTree.validateInput('inspectTree', path, options);
	      return inspectTree.sync(resolvePath(path), options);
	    },
	    inspectTreeAsync: function (path, options) {
	      inspectTree.validateInput('inspectTreeAsync', path, options);
	      return inspectTree.async(resolvePath(path), options);
	    },
	
	    list: function (path) {
	      list.validateInput('list', path);
	      return list.sync(resolvePath(path || '.'));
	    },
	    listAsync: function (path) {
	      list.validateInput('listAsync', path);
	      return list.async(resolvePath(path || '.'));
	    },
	
	    move: function (from, to) {
	      move.validateInput('move', from, to);
	      move.sync(resolvePath(from), resolvePath(to));
	    },
	    moveAsync: function (from, to) {
	      move.validateInput('moveAsync', from, to);
	      return move.async(resolvePath(from), resolvePath(to));
	    },
	
	    read: function (path, returnAs) {
	      read.validateInput('read', path, returnAs);
	      return read.sync(resolvePath(path), returnAs);
	    },
	    readAsync: function (path, returnAs) {
	      read.validateInput('readAsync', path, returnAs);
	      return read.async(resolvePath(path), returnAs);
	    },
	
	    remove: function (path) {
	      remove.validateInput('remove', path);
	      // If path not specified defaults to CWD
	      remove.sync(resolvePath(path || '.'));
	    },
	    removeAsync: function (path) {
	      remove.validateInput('removeAsync', path);
	      // If path not specified defaults to CWD
	      return remove.async(resolvePath(path || '.'));
	    },
	
	    rename: function (path, newName) {
	      rename.validateInput('rename', path, newName);
	      rename.sync(resolvePath(path), newName);
	    },
	    renameAsync: function (path, newName) {
	      rename.validateInput('renameAsync', path, newName);
	      return rename.async(resolvePath(path), newName);
	    },
	
	    symlink: function (symlinkValue, path) {
	      symlink.validateInput('symlink', symlinkValue, path);
	      symlink.sync(symlinkValue, resolvePath(path));
	    },
	    symlinkAsync: function (symlinkValue, path) {
	      symlink.validateInput('symlinkAsync', symlinkValue, path);
	      return symlink.async(symlinkValue, resolvePath(path));
	    },
	
	    write: function (path, data, options) {
	      write.validateInput('write', path, data, options);
	      write.sync(resolvePath(path), data, options);
	    },
	    writeAsync: function (path, data, options) {
	      write.validateInput('writeAsync', path, data, options);
	      return write.async(resolvePath(path), data, options);
	    }
	  };
	
	  if (util.inspect.custom !== undefined) {
	    // Without this console.log(jetpack) throws obscure error. Details:
	    // https://github.com/szwacz/fs-jetpack/issues/29
	    // https://nodejs.org/api/util.html#util_custom_inspection_functions_on_objects
	    api[util.inspect.custom] = function () {
	      return '[fs-jetpack CWD: ' + getCwdPath() + ']';
	    };
	  }
	
	  return api;
	};
	
	module.exports = jetpackContext;


/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("util");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	// vim:ts=4:sts=4:sw=4:
	/*!
	 *
	 * Copyright 2009-2012 Kris Kowal under the terms of the MIT
	 * license found at http://github.com/kriskowal/q/raw/master/LICENSE
	 *
	 * With parts by Tyler Close
	 * Copyright 2007-2009 Tyler Close under the terms of the MIT X license found
	 * at http://www.opensource.org/licenses/mit-license.html
	 * Forked at ref_send.js version: 2009-05-11
	 *
	 * With parts by Mark Miller
	 * Copyright (C) 2011 Google Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 *
	 */
	
	(function (definition) {
	    "use strict";
	
	    // This file will function properly as a <script> tag, or a module
	    // using CommonJS and NodeJS or RequireJS module formats.  In
	    // Common/Node/RequireJS, the module exports the Q API and when
	    // executed as a simple <script>, it creates a Q global instead.
	
	    // Montage Require
	    if (typeof bootstrap === "function") {
	        bootstrap("promise", definition);
	
	    // CommonJS
	    } else if (true) {
	        module.exports = definition();
	
	    // RequireJS
	    } else if (typeof define === "function" && define.amd) {
	        define(definition);
	
	    // SES (Secure EcmaScript)
	    } else if (typeof ses !== "undefined") {
	        if (!ses.ok()) {
	            return;
	        } else {
	            ses.makeQ = definition;
	        }
	
	    // <script>
	    } else if (typeof window !== "undefined" || typeof self !== "undefined") {
	        // Prefer window over self for add-on scripts. Use self for
	        // non-windowed contexts.
	        var global = typeof window !== "undefined" ? window : self;
	
	        // Get the `window` object, save the previous Q global
	        // and initialize Q as a global.
	        var previousQ = global.Q;
	        global.Q = definition();
	
	        // Add a noConflict function so Q can be removed from the
	        // global namespace.
	        global.Q.noConflict = function () {
	            global.Q = previousQ;
	            return this;
	        };
	
	    } else {
	        throw new Error("This environment was not anticipated by Q. Please file a bug.");
	    }
	
	})(function () {
	"use strict";
	
	var hasStacks = false;
	try {
	    throw new Error();
	} catch (e) {
	    hasStacks = !!e.stack;
	}
	
	// All code after this point will be filtered from stack traces reported
	// by Q.
	var qStartingLine = captureLine();
	var qFileName;
	
	// shims
	
	// used for fallback in "allResolved"
	var noop = function () {};
	
	// Use the fastest possible means to execute a task in a future turn
	// of the event loop.
	var nextTick =(function () {
	    // linked list of tasks (single, with head node)
	    var head = {task: void 0, next: null};
	    var tail = head;
	    var flushing = false;
	    var requestTick = void 0;
	    var isNodeJS = false;
	    // queue for late tasks, used by unhandled rejection tracking
	    var laterQueue = [];
	
	    function flush() {
	        /* jshint loopfunc: true */
	        var task, domain;
	
	        while (head.next) {
	            head = head.next;
	            task = head.task;
	            head.task = void 0;
	            domain = head.domain;
	
	            if (domain) {
	                head.domain = void 0;
	                domain.enter();
	            }
	            runSingle(task, domain);
	
	        }
	        while (laterQueue.length) {
	            task = laterQueue.pop();
	            runSingle(task);
	        }
	        flushing = false;
	    }
	    // runs a single function in the async queue
	    function runSingle(task, domain) {
	        try {
	            task();
	
	        } catch (e) {
	            if (isNodeJS) {
	                // In node, uncaught exceptions are considered fatal errors.
	                // Re-throw them synchronously to interrupt flushing!
	
	                // Ensure continuation if the uncaught exception is suppressed
	                // listening "uncaughtException" events (as domains does).
	                // Continue in next event to avoid tick recursion.
	                if (domain) {
	                    domain.exit();
	                }
	                setTimeout(flush, 0);
	                if (domain) {
	                    domain.enter();
	                }
	
	                throw e;
	
	            } else {
	                // In browsers, uncaught exceptions are not fatal.
	                // Re-throw them asynchronously to avoid slow-downs.
	                setTimeout(function () {
	                    throw e;
	                }, 0);
	            }
	        }
	
	        if (domain) {
	            domain.exit();
	        }
	    }
	
	    nextTick = function (task) {
	        tail = tail.next = {
	            task: task,
	            domain: isNodeJS && process.domain,
	            next: null
	        };
	
	        if (!flushing) {
	            flushing = true;
	            requestTick();
	        }
	    };
	
	    if (typeof process === "object" &&
	        process.toString() === "[object process]" && process.nextTick) {
	        // Ensure Q is in a real Node environment, with a `process.nextTick`.
	        // To see through fake Node environments:
	        // * Mocha test runner - exposes a `process` global without a `nextTick`
	        // * Browserify - exposes a `process.nexTick` function that uses
	        //   `setTimeout`. In this case `setImmediate` is preferred because
	        //    it is faster. Browserify's `process.toString()` yields
	        //   "[object Object]", while in a real Node environment
	        //   `process.nextTick()` yields "[object process]".
	        isNodeJS = true;
	
	        requestTick = function () {
	            process.nextTick(flush);
	        };
	
	    } else if (typeof setImmediate === "function") {
	        // In IE10, Node.js 0.9+, or https://github.com/NobleJS/setImmediate
	        if (typeof window !== "undefined") {
	            requestTick = setImmediate.bind(window, flush);
	        } else {
	            requestTick = function () {
	                setImmediate(flush);
	            };
	        }
	
	    } else if (typeof MessageChannel !== "undefined") {
	        // modern browsers
	        // http://www.nonblocking.io/2011/06/windownexttick.html
	        var channel = new MessageChannel();
	        // At least Safari Version 6.0.5 (8536.30.1) intermittently cannot create
	        // working message ports the first time a page loads.
	        channel.port1.onmessage = function () {
	            requestTick = requestPortTick;
	            channel.port1.onmessage = flush;
	            flush();
	        };
	        var requestPortTick = function () {
	            // Opera requires us to provide a message payload, regardless of
	            // whether we use it.
	            channel.port2.postMessage(0);
	        };
	        requestTick = function () {
	            setTimeout(flush, 0);
	            requestPortTick();
	        };
	
	    } else {
	        // old browsers
	        requestTick = function () {
	            setTimeout(flush, 0);
	        };
	    }
	    // runs a task after all other tasks have been run
	    // this is useful for unhandled rejection tracking that needs to happen
	    // after all `then`d tasks have been run.
	    nextTick.runAfter = function (task) {
	        laterQueue.push(task);
	        if (!flushing) {
	            flushing = true;
	            requestTick();
	        }
	    };
	    return nextTick;
	})();
	
	// Attempt to make generics safe in the face of downstream
	// modifications.
	// There is no situation where this is necessary.
	// If you need a security guarantee, these primordials need to be
	// deeply frozen anyway, and if you don’t need a security guarantee,
	// this is just plain paranoid.
	// However, this **might** have the nice side-effect of reducing the size of
	// the minified code by reducing x.call() to merely x()
	// See Mark Miller’s explanation of what this does.
	// http://wiki.ecmascript.org/doku.php?id=conventions:safe_meta_programming
	var call = Function.call;
	function uncurryThis(f) {
	    return function () {
	        return call.apply(f, arguments);
	    };
	}
	// This is equivalent, but slower:
	// uncurryThis = Function_bind.bind(Function_bind.call);
	// http://jsperf.com/uncurrythis
	
	var array_slice = uncurryThis(Array.prototype.slice);
	
	var array_reduce = uncurryThis(
	    Array.prototype.reduce || function (callback, basis) {
	        var index = 0,
	            length = this.length;
	        // concerning the initial value, if one is not provided
	        if (arguments.length === 1) {
	            // seek to the first value in the array, accounting
	            // for the possibility that is is a sparse array
	            do {
	                if (index in this) {
	                    basis = this[index++];
	                    break;
	                }
	                if (++index >= length) {
	                    throw new TypeError();
	                }
	            } while (1);
	        }
	        // reduce
	        for (; index < length; index++) {
	            // account for the possibility that the array is sparse
	            if (index in this) {
	                basis = callback(basis, this[index], index);
	            }
	        }
	        return basis;
	    }
	);
	
	var array_indexOf = uncurryThis(
	    Array.prototype.indexOf || function (value) {
	        // not a very good shim, but good enough for our one use of it
	        for (var i = 0; i < this.length; i++) {
	            if (this[i] === value) {
	                return i;
	            }
	        }
	        return -1;
	    }
	);
	
	var array_map = uncurryThis(
	    Array.prototype.map || function (callback, thisp) {
	        var self = this;
	        var collect = [];
	        array_reduce(self, function (undefined, value, index) {
	            collect.push(callback.call(thisp, value, index, self));
	        }, void 0);
	        return collect;
	    }
	);
	
	var object_create = Object.create || function (prototype) {
	    function Type() { }
	    Type.prototype = prototype;
	    return new Type();
	};
	
	var object_hasOwnProperty = uncurryThis(Object.prototype.hasOwnProperty);
	
	var object_keys = Object.keys || function (object) {
	    var keys = [];
	    for (var key in object) {
	        if (object_hasOwnProperty(object, key)) {
	            keys.push(key);
	        }
	    }
	    return keys;
	};
	
	var object_toString = uncurryThis(Object.prototype.toString);
	
	function isObject(value) {
	    return value === Object(value);
	}
	
	// generator related shims
	
	// FIXME: Remove this function once ES6 generators are in SpiderMonkey.
	function isStopIteration(exception) {
	    return (
	        object_toString(exception) === "[object StopIteration]" ||
	        exception instanceof QReturnValue
	    );
	}
	
	// FIXME: Remove this helper and Q.return once ES6 generators are in
	// SpiderMonkey.
	var QReturnValue;
	if (typeof ReturnValue !== "undefined") {
	    QReturnValue = ReturnValue;
	} else {
	    QReturnValue = function (value) {
	        this.value = value;
	    };
	}
	
	// long stack traces
	
	var STACK_JUMP_SEPARATOR = "From previous event:";
	
	function makeStackTraceLong(error, promise) {
	    // If possible, transform the error stack trace by removing Node and Q
	    // cruft, then concatenating with the stack trace of `promise`. See #57.
	    if (hasStacks &&
	        promise.stack &&
	        typeof error === "object" &&
	        error !== null &&
	        error.stack &&
	        error.stack.indexOf(STACK_JUMP_SEPARATOR) === -1
	    ) {
	        var stacks = [];
	        for (var p = promise; !!p; p = p.source) {
	            if (p.stack) {
	                stacks.unshift(p.stack);
	            }
	        }
	        stacks.unshift(error.stack);
	
	        var concatedStacks = stacks.join("\n" + STACK_JUMP_SEPARATOR + "\n");
	        error.stack = filterStackString(concatedStacks);
	    }
	}
	
	function filterStackString(stackString) {
	    var lines = stackString.split("\n");
	    var desiredLines = [];
	    for (var i = 0; i < lines.length; ++i) {
	        var line = lines[i];
	
	        if (!isInternalFrame(line) && !isNodeFrame(line) && line) {
	            desiredLines.push(line);
	        }
	    }
	    return desiredLines.join("\n");
	}
	
	function isNodeFrame(stackLine) {
	    return stackLine.indexOf("(module.js:") !== -1 ||
	           stackLine.indexOf("(node.js:") !== -1;
	}
	
	function getFileNameAndLineNumber(stackLine) {
	    // Named functions: "at functionName (filename:lineNumber:columnNumber)"
	    // In IE10 function name can have spaces ("Anonymous function") O_o
	    var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
	    if (attempt1) {
	        return [attempt1[1], Number(attempt1[2])];
	    }
	
	    // Anonymous functions: "at filename:lineNumber:columnNumber"
	    var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
	    if (attempt2) {
	        return [attempt2[1], Number(attempt2[2])];
	    }
	
	    // Firefox style: "function@filename:lineNumber or @filename:lineNumber"
	    var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
	    if (attempt3) {
	        return [attempt3[1], Number(attempt3[2])];
	    }
	}
	
	function isInternalFrame(stackLine) {
	    var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);
	
	    if (!fileNameAndLineNumber) {
	        return false;
	    }
	
	    var fileName = fileNameAndLineNumber[0];
	    var lineNumber = fileNameAndLineNumber[1];
	
	    return fileName === qFileName &&
	        lineNumber >= qStartingLine &&
	        lineNumber <= qEndingLine;
	}
	
	// discover own file name and line number range for filtering stack
	// traces
	function captureLine() {
	    if (!hasStacks) {
	        return;
	    }
	
	    try {
	        throw new Error();
	    } catch (e) {
	        var lines = e.stack.split("\n");
	        var firstLine = lines[0].indexOf("@") > 0 ? lines[1] : lines[2];
	        var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);
	        if (!fileNameAndLineNumber) {
	            return;
	        }
	
	        qFileName = fileNameAndLineNumber[0];
	        return fileNameAndLineNumber[1];
	    }
	}
	
	function deprecate(callback, name, alternative) {
	    return function () {
	        if (typeof console !== "undefined" &&
	            typeof console.warn === "function") {
	            console.warn(name + " is deprecated, use " + alternative +
	                         " instead.", new Error("").stack);
	        }
	        return callback.apply(callback, arguments);
	    };
	}
	
	// end of shims
	// beginning of real work
	
	/**
	 * Constructs a promise for an immediate reference, passes promises through, or
	 * coerces promises from different systems.
	 * @param value immediate reference or promise
	 */
	function Q(value) {
	    // If the object is already a Promise, return it directly.  This enables
	    // the resolve function to both be used to created references from objects,
	    // but to tolerably coerce non-promises to promises.
	    if (value instanceof Promise) {
	        return value;
	    }
	
	    // assimilate thenables
	    if (isPromiseAlike(value)) {
	        return coerce(value);
	    } else {
	        return fulfill(value);
	    }
	}
	Q.resolve = Q;
	
	/**
	 * Performs a task in a future turn of the event loop.
	 * @param {Function} task
	 */
	Q.nextTick = nextTick;
	
	/**
	 * Controls whether or not long stack traces will be on
	 */
	Q.longStackSupport = false;
	
	// enable long stacks if Q_DEBUG is set
	if (typeof process === "object" && process && process.env && process.env.Q_DEBUG) {
	    Q.longStackSupport = true;
	}
	
	/**
	 * Constructs a {promise, resolve, reject} object.
	 *
	 * `resolve` is a callback to invoke with a more resolved value for the
	 * promise. To fulfill the promise, invoke `resolve` with any value that is
	 * not a thenable. To reject the promise, invoke `resolve` with a rejected
	 * thenable, or invoke `reject` with the reason directly. To resolve the
	 * promise to another thenable, thus putting it in the same state, invoke
	 * `resolve` with that other thenable.
	 */
	Q.defer = defer;
	function defer() {
	    // if "messages" is an "Array", that indicates that the promise has not yet
	    // been resolved.  If it is "undefined", it has been resolved.  Each
	    // element of the messages array is itself an array of complete arguments to
	    // forward to the resolved promise.  We coerce the resolution value to a
	    // promise using the `resolve` function because it handles both fully
	    // non-thenable values and other thenables gracefully.
	    var messages = [], progressListeners = [], resolvedPromise;
	
	    var deferred = object_create(defer.prototype);
	    var promise = object_create(Promise.prototype);
	
	    promise.promiseDispatch = function (resolve, op, operands) {
	        var args = array_slice(arguments);
	        if (messages) {
	            messages.push(args);
	            if (op === "when" && operands[1]) { // progress operand
	                progressListeners.push(operands[1]);
	            }
	        } else {
	            Q.nextTick(function () {
	                resolvedPromise.promiseDispatch.apply(resolvedPromise, args);
	            });
	        }
	    };
	
	    // XXX deprecated
	    promise.valueOf = function () {
	        if (messages) {
	            return promise;
	        }
	        var nearerValue = nearer(resolvedPromise);
	        if (isPromise(nearerValue)) {
	            resolvedPromise = nearerValue; // shorten chain
	        }
	        return nearerValue;
	    };
	
	    promise.inspect = function () {
	        if (!resolvedPromise) {
	            return { state: "pending" };
	        }
	        return resolvedPromise.inspect();
	    };
	
	    if (Q.longStackSupport && hasStacks) {
	        try {
	            throw new Error();
	        } catch (e) {
	            // NOTE: don't try to use `Error.captureStackTrace` or transfer the
	            // accessor around; that causes memory leaks as per GH-111. Just
	            // reify the stack trace as a string ASAP.
	            //
	            // At the same time, cut off the first line; it's always just
	            // "[object Promise]\n", as per the `toString`.
	            promise.stack = e.stack.substring(e.stack.indexOf("\n") + 1);
	        }
	    }
	
	    // NOTE: we do the checks for `resolvedPromise` in each method, instead of
	    // consolidating them into `become`, since otherwise we'd create new
	    // promises with the lines `become(whatever(value))`. See e.g. GH-252.
	
	    function become(newPromise) {
	        resolvedPromise = newPromise;
	        promise.source = newPromise;
	
	        array_reduce(messages, function (undefined, message) {
	            Q.nextTick(function () {
	                newPromise.promiseDispatch.apply(newPromise, message);
	            });
	        }, void 0);
	
	        messages = void 0;
	        progressListeners = void 0;
	    }
	
	    deferred.promise = promise;
	    deferred.resolve = function (value) {
	        if (resolvedPromise) {
	            return;
	        }
	
	        become(Q(value));
	    };
	
	    deferred.fulfill = function (value) {
	        if (resolvedPromise) {
	            return;
	        }
	
	        become(fulfill(value));
	    };
	    deferred.reject = function (reason) {
	        if (resolvedPromise) {
	            return;
	        }
	
	        become(reject(reason));
	    };
	    deferred.notify = function (progress) {
	        if (resolvedPromise) {
	            return;
	        }
	
	        array_reduce(progressListeners, function (undefined, progressListener) {
	            Q.nextTick(function () {
	                progressListener(progress);
	            });
	        }, void 0);
	    };
	
	    return deferred;
	}
	
	/**
	 * Creates a Node-style callback that will resolve or reject the deferred
	 * promise.
	 * @returns a nodeback
	 */
	defer.prototype.makeNodeResolver = function () {
	    var self = this;
	    return function (error, value) {
	        if (error) {
	            self.reject(error);
	        } else if (arguments.length > 2) {
	            self.resolve(array_slice(arguments, 1));
	        } else {
	            self.resolve(value);
	        }
	    };
	};
	
	/**
	 * @param resolver {Function} a function that returns nothing and accepts
	 * the resolve, reject, and notify functions for a deferred.
	 * @returns a promise that may be resolved with the given resolve and reject
	 * functions, or rejected by a thrown exception in resolver
	 */
	Q.Promise = promise; // ES6
	Q.promise = promise;
	function promise(resolver) {
	    if (typeof resolver !== "function") {
	        throw new TypeError("resolver must be a function.");
	    }
	    var deferred = defer();
	    try {
	        resolver(deferred.resolve, deferred.reject, deferred.notify);
	    } catch (reason) {
	        deferred.reject(reason);
	    }
	    return deferred.promise;
	}
	
	promise.race = race; // ES6
	promise.all = all; // ES6
	promise.reject = reject; // ES6
	promise.resolve = Q; // ES6
	
	// XXX experimental.  This method is a way to denote that a local value is
	// serializable and should be immediately dispatched to a remote upon request,
	// instead of passing a reference.
	Q.passByCopy = function (object) {
	    //freeze(object);
	    //passByCopies.set(object, true);
	    return object;
	};
	
	Promise.prototype.passByCopy = function () {
	    //freeze(object);
	    //passByCopies.set(object, true);
	    return this;
	};
	
	/**
	 * If two promises eventually fulfill to the same value, promises that value,
	 * but otherwise rejects.
	 * @param x {Any*}
	 * @param y {Any*}
	 * @returns {Any*} a promise for x and y if they are the same, but a rejection
	 * otherwise.
	 *
	 */
	Q.join = function (x, y) {
	    return Q(x).join(y);
	};
	
	Promise.prototype.join = function (that) {
	    return Q([this, that]).spread(function (x, y) {
	        if (x === y) {
	            // TODO: "===" should be Object.is or equiv
	            return x;
	        } else {
	            throw new Error("Can't join: not the same: " + x + " " + y);
	        }
	    });
	};
	
	/**
	 * Returns a promise for the first of an array of promises to become settled.
	 * @param answers {Array[Any*]} promises to race
	 * @returns {Any*} the first promise to be settled
	 */
	Q.race = race;
	function race(answerPs) {
	    return promise(function (resolve, reject) {
	        // Switch to this once we can assume at least ES5
	        // answerPs.forEach(function (answerP) {
	        //     Q(answerP).then(resolve, reject);
	        // });
	        // Use this in the meantime
	        for (var i = 0, len = answerPs.length; i < len; i++) {
	            Q(answerPs[i]).then(resolve, reject);
	        }
	    });
	}
	
	Promise.prototype.race = function () {
	    return this.then(Q.race);
	};
	
	/**
	 * Constructs a Promise with a promise descriptor object and optional fallback
	 * function.  The descriptor contains methods like when(rejected), get(name),
	 * set(name, value), post(name, args), and delete(name), which all
	 * return either a value, a promise for a value, or a rejection.  The fallback
	 * accepts the operation name, a resolver, and any further arguments that would
	 * have been forwarded to the appropriate method above had a method been
	 * provided with the proper name.  The API makes no guarantees about the nature
	 * of the returned object, apart from that it is usable whereever promises are
	 * bought and sold.
	 */
	Q.makePromise = Promise;
	function Promise(descriptor, fallback, inspect) {
	    if (fallback === void 0) {
	        fallback = function (op) {
	            return reject(new Error(
	                "Promise does not support operation: " + op
	            ));
	        };
	    }
	    if (inspect === void 0) {
	        inspect = function () {
	            return {state: "unknown"};
	        };
	    }
	
	    var promise = object_create(Promise.prototype);
	
	    promise.promiseDispatch = function (resolve, op, args) {
	        var result;
	        try {
	            if (descriptor[op]) {
	                result = descriptor[op].apply(promise, args);
	            } else {
	                result = fallback.call(promise, op, args);
	            }
	        } catch (exception) {
	            result = reject(exception);
	        }
	        if (resolve) {
	            resolve(result);
	        }
	    };
	
	    promise.inspect = inspect;
	
	    // XXX deprecated `valueOf` and `exception` support
	    if (inspect) {
	        var inspected = inspect();
	        if (inspected.state === "rejected") {
	            promise.exception = inspected.reason;
	        }
	
	        promise.valueOf = function () {
	            var inspected = inspect();
	            if (inspected.state === "pending" ||
	                inspected.state === "rejected") {
	                return promise;
	            }
	            return inspected.value;
	        };
	    }
	
	    return promise;
	}
	
	Promise.prototype.toString = function () {
	    return "[object Promise]";
	};
	
	Promise.prototype.then = function (fulfilled, rejected, progressed) {
	    var self = this;
	    var deferred = defer();
	    var done = false;   // ensure the untrusted promise makes at most a
	                        // single call to one of the callbacks
	
	    function _fulfilled(value) {
	        try {
	            return typeof fulfilled === "function" ? fulfilled(value) : value;
	        } catch (exception) {
	            return reject(exception);
	        }
	    }
	
	    function _rejected(exception) {
	        if (typeof rejected === "function") {
	            makeStackTraceLong(exception, self);
	            try {
	                return rejected(exception);
	            } catch (newException) {
	                return reject(newException);
	            }
	        }
	        return reject(exception);
	    }
	
	    function _progressed(value) {
	        return typeof progressed === "function" ? progressed(value) : value;
	    }
	
	    Q.nextTick(function () {
	        self.promiseDispatch(function (value) {
	            if (done) {
	                return;
	            }
	            done = true;
	
	            deferred.resolve(_fulfilled(value));
	        }, "when", [function (exception) {
	            if (done) {
	                return;
	            }
	            done = true;
	
	            deferred.resolve(_rejected(exception));
	        }]);
	    });
	
	    // Progress propagator need to be attached in the current tick.
	    self.promiseDispatch(void 0, "when", [void 0, function (value) {
	        var newValue;
	        var threw = false;
	        try {
	            newValue = _progressed(value);
	        } catch (e) {
	            threw = true;
	            if (Q.onerror) {
	                Q.onerror(e);
	            } else {
	                throw e;
	            }
	        }
	
	        if (!threw) {
	            deferred.notify(newValue);
	        }
	    }]);
	
	    return deferred.promise;
	};
	
	Q.tap = function (promise, callback) {
	    return Q(promise).tap(callback);
	};
	
	/**
	 * Works almost like "finally", but not called for rejections.
	 * Original resolution value is passed through callback unaffected.
	 * Callback may return a promise that will be awaited for.
	 * @param {Function} callback
	 * @returns {Q.Promise}
	 * @example
	 * doSomething()
	 *   .then(...)
	 *   .tap(console.log)
	 *   .then(...);
	 */
	Promise.prototype.tap = function (callback) {
	    callback = Q(callback);
	
	    return this.then(function (value) {
	        return callback.fcall(value).thenResolve(value);
	    });
	};
	
	/**
	 * Registers an observer on a promise.
	 *
	 * Guarantees:
	 *
	 * 1. that fulfilled and rejected will be called only once.
	 * 2. that either the fulfilled callback or the rejected callback will be
	 *    called, but not both.
	 * 3. that fulfilled and rejected will not be called in this turn.
	 *
	 * @param value      promise or immediate reference to observe
	 * @param fulfilled  function to be called with the fulfilled value
	 * @param rejected   function to be called with the rejection exception
	 * @param progressed function to be called on any progress notifications
	 * @return promise for the return value from the invoked callback
	 */
	Q.when = when;
	function when(value, fulfilled, rejected, progressed) {
	    return Q(value).then(fulfilled, rejected, progressed);
	}
	
	Promise.prototype.thenResolve = function (value) {
	    return this.then(function () { return value; });
	};
	
	Q.thenResolve = function (promise, value) {
	    return Q(promise).thenResolve(value);
	};
	
	Promise.prototype.thenReject = function (reason) {
	    return this.then(function () { throw reason; });
	};
	
	Q.thenReject = function (promise, reason) {
	    return Q(promise).thenReject(reason);
	};
	
	/**
	 * If an object is not a promise, it is as "near" as possible.
	 * If a promise is rejected, it is as "near" as possible too.
	 * If it’s a fulfilled promise, the fulfillment value is nearer.
	 * If it’s a deferred promise and the deferred has been resolved, the
	 * resolution is "nearer".
	 * @param object
	 * @returns most resolved (nearest) form of the object
	 */
	
	// XXX should we re-do this?
	Q.nearer = nearer;
	function nearer(value) {
	    if (isPromise(value)) {
	        var inspected = value.inspect();
	        if (inspected.state === "fulfilled") {
	            return inspected.value;
	        }
	    }
	    return value;
	}
	
	/**
	 * @returns whether the given object is a promise.
	 * Otherwise it is a fulfilled value.
	 */
	Q.isPromise = isPromise;
	function isPromise(object) {
	    return object instanceof Promise;
	}
	
	Q.isPromiseAlike = isPromiseAlike;
	function isPromiseAlike(object) {
	    return isObject(object) && typeof object.then === "function";
	}
	
	/**
	 * @returns whether the given object is a pending promise, meaning not
	 * fulfilled or rejected.
	 */
	Q.isPending = isPending;
	function isPending(object) {
	    return isPromise(object) && object.inspect().state === "pending";
	}
	
	Promise.prototype.isPending = function () {
	    return this.inspect().state === "pending";
	};
	
	/**
	 * @returns whether the given object is a value or fulfilled
	 * promise.
	 */
	Q.isFulfilled = isFulfilled;
	function isFulfilled(object) {
	    return !isPromise(object) || object.inspect().state === "fulfilled";
	}
	
	Promise.prototype.isFulfilled = function () {
	    return this.inspect().state === "fulfilled";
	};
	
	/**
	 * @returns whether the given object is a rejected promise.
	 */
	Q.isRejected = isRejected;
	function isRejected(object) {
	    return isPromise(object) && object.inspect().state === "rejected";
	}
	
	Promise.prototype.isRejected = function () {
	    return this.inspect().state === "rejected";
	};
	
	//// BEGIN UNHANDLED REJECTION TRACKING
	
	// This promise library consumes exceptions thrown in handlers so they can be
	// handled by a subsequent promise.  The exceptions get added to this array when
	// they are created, and removed when they are handled.  Note that in ES6 or
	// shimmed environments, this would naturally be a `Set`.
	var unhandledReasons = [];
	var unhandledRejections = [];
	var reportedUnhandledRejections = [];
	var trackUnhandledRejections = true;
	
	function resetUnhandledRejections() {
	    unhandledReasons.length = 0;
	    unhandledRejections.length = 0;
	
	    if (!trackUnhandledRejections) {
	        trackUnhandledRejections = true;
	    }
	}
	
	function trackRejection(promise, reason) {
	    if (!trackUnhandledRejections) {
	        return;
	    }
	    if (typeof process === "object" && typeof process.emit === "function") {
	        Q.nextTick.runAfter(function () {
	            if (array_indexOf(unhandledRejections, promise) !== -1) {
	                process.emit("unhandledRejection", reason, promise);
	                reportedUnhandledRejections.push(promise);
	            }
	        });
	    }
	
	    unhandledRejections.push(promise);
	    if (reason && typeof reason.stack !== "undefined") {
	        unhandledReasons.push(reason.stack);
	    } else {
	        unhandledReasons.push("(no stack) " + reason);
	    }
	}
	
	function untrackRejection(promise) {
	    if (!trackUnhandledRejections) {
	        return;
	    }
	
	    var at = array_indexOf(unhandledRejections, promise);
	    if (at !== -1) {
	        if (typeof process === "object" && typeof process.emit === "function") {
	            Q.nextTick.runAfter(function () {
	                var atReport = array_indexOf(reportedUnhandledRejections, promise);
	                if (atReport !== -1) {
	                    process.emit("rejectionHandled", unhandledReasons[at], promise);
	                    reportedUnhandledRejections.splice(atReport, 1);
	                }
	            });
	        }
	        unhandledRejections.splice(at, 1);
	        unhandledReasons.splice(at, 1);
	    }
	}
	
	Q.resetUnhandledRejections = resetUnhandledRejections;
	
	Q.getUnhandledReasons = function () {
	    // Make a copy so that consumers can't interfere with our internal state.
	    return unhandledReasons.slice();
	};
	
	Q.stopUnhandledRejectionTracking = function () {
	    resetUnhandledRejections();
	    trackUnhandledRejections = false;
	};
	
	resetUnhandledRejections();
	
	//// END UNHANDLED REJECTION TRACKING
	
	/**
	 * Constructs a rejected promise.
	 * @param reason value describing the failure
	 */
	Q.reject = reject;
	function reject(reason) {
	    var rejection = Promise({
	        "when": function (rejected) {
	            // note that the error has been handled
	            if (rejected) {
	                untrackRejection(this);
	            }
	            return rejected ? rejected(reason) : this;
	        }
	    }, function fallback() {
	        return this;
	    }, function inspect() {
	        return { state: "rejected", reason: reason };
	    });
	
	    // Note that the reason has not been handled.
	    trackRejection(rejection, reason);
	
	    return rejection;
	}
	
	/**
	 * Constructs a fulfilled promise for an immediate reference.
	 * @param value immediate reference
	 */
	Q.fulfill = fulfill;
	function fulfill(value) {
	    return Promise({
	        "when": function () {
	            return value;
	        },
	        "get": function (name) {
	            return value[name];
	        },
	        "set": function (name, rhs) {
	            value[name] = rhs;
	        },
	        "delete": function (name) {
	            delete value[name];
	        },
	        "post": function (name, args) {
	            // Mark Miller proposes that post with no name should apply a
	            // promised function.
	            if (name === null || name === void 0) {
	                return value.apply(void 0, args);
	            } else {
	                return value[name].apply(value, args);
	            }
	        },
	        "apply": function (thisp, args) {
	            return value.apply(thisp, args);
	        },
	        "keys": function () {
	            return object_keys(value);
	        }
	    }, void 0, function inspect() {
	        return { state: "fulfilled", value: value };
	    });
	}
	
	/**
	 * Converts thenables to Q promises.
	 * @param promise thenable promise
	 * @returns a Q promise
	 */
	function coerce(promise) {
	    var deferred = defer();
	    Q.nextTick(function () {
	        try {
	            promise.then(deferred.resolve, deferred.reject, deferred.notify);
	        } catch (exception) {
	            deferred.reject(exception);
	        }
	    });
	    return deferred.promise;
	}
	
	/**
	 * Annotates an object such that it will never be
	 * transferred away from this process over any promise
	 * communication channel.
	 * @param object
	 * @returns promise a wrapping of that object that
	 * additionally responds to the "isDef" message
	 * without a rejection.
	 */
	Q.master = master;
	function master(object) {
	    return Promise({
	        "isDef": function () {}
	    }, function fallback(op, args) {
	        return dispatch(object, op, args);
	    }, function () {
	        return Q(object).inspect();
	    });
	}
	
	/**
	 * Spreads the values of a promised array of arguments into the
	 * fulfillment callback.
	 * @param fulfilled callback that receives variadic arguments from the
	 * promised array
	 * @param rejected callback that receives the exception if the promise
	 * is rejected.
	 * @returns a promise for the return value or thrown exception of
	 * either callback.
	 */
	Q.spread = spread;
	function spread(value, fulfilled, rejected) {
	    return Q(value).spread(fulfilled, rejected);
	}
	
	Promise.prototype.spread = function (fulfilled, rejected) {
	    return this.all().then(function (array) {
	        return fulfilled.apply(void 0, array);
	    }, rejected);
	};
	
	/**
	 * The async function is a decorator for generator functions, turning
	 * them into asynchronous generators.  Although generators are only part
	 * of the newest ECMAScript 6 drafts, this code does not cause syntax
	 * errors in older engines.  This code should continue to work and will
	 * in fact improve over time as the language improves.
	 *
	 * ES6 generators are currently part of V8 version 3.19 with the
	 * --harmony-generators runtime flag enabled.  SpiderMonkey has had them
	 * for longer, but under an older Python-inspired form.  This function
	 * works on both kinds of generators.
	 *
	 * Decorates a generator function such that:
	 *  - it may yield promises
	 *  - execution will continue when that promise is fulfilled
	 *  - the value of the yield expression will be the fulfilled value
	 *  - it returns a promise for the return value (when the generator
	 *    stops iterating)
	 *  - the decorated function returns a promise for the return value
	 *    of the generator or the first rejected promise among those
	 *    yielded.
	 *  - if an error is thrown in the generator, it propagates through
	 *    every following yield until it is caught, or until it escapes
	 *    the generator function altogether, and is translated into a
	 *    rejection for the promise returned by the decorated generator.
	 */
	Q.async = async;
	function async(makeGenerator) {
	    return function () {
	        // when verb is "send", arg is a value
	        // when verb is "throw", arg is an exception
	        function continuer(verb, arg) {
	            var result;
	
	            // Until V8 3.19 / Chromium 29 is released, SpiderMonkey is the only
	            // engine that has a deployed base of browsers that support generators.
	            // However, SM's generators use the Python-inspired semantics of
	            // outdated ES6 drafts.  We would like to support ES6, but we'd also
	            // like to make it possible to use generators in deployed browsers, so
	            // we also support Python-style generators.  At some point we can remove
	            // this block.
	
	            if (typeof StopIteration === "undefined") {
	                // ES6 Generators
	                try {
	                    result = generator[verb](arg);
	                } catch (exception) {
	                    return reject(exception);
	                }
	                if (result.done) {
	                    return Q(result.value);
	                } else {
	                    return when(result.value, callback, errback);
	                }
	            } else {
	                // SpiderMonkey Generators
	                // FIXME: Remove this case when SM does ES6 generators.
	                try {
	                    result = generator[verb](arg);
	                } catch (exception) {
	                    if (isStopIteration(exception)) {
	                        return Q(exception.value);
	                    } else {
	                        return reject(exception);
	                    }
	                }
	                return when(result, callback, errback);
	            }
	        }
	        var generator = makeGenerator.apply(this, arguments);
	        var callback = continuer.bind(continuer, "next");
	        var errback = continuer.bind(continuer, "throw");
	        return callback();
	    };
	}
	
	/**
	 * The spawn function is a small wrapper around async that immediately
	 * calls the generator and also ends the promise chain, so that any
	 * unhandled errors are thrown instead of forwarded to the error
	 * handler. This is useful because it's extremely common to run
	 * generators at the top-level to work with libraries.
	 */
	Q.spawn = spawn;
	function spawn(makeGenerator) {
	    Q.done(Q.async(makeGenerator)());
	}
	
	// FIXME: Remove this interface once ES6 generators are in SpiderMonkey.
	/**
	 * Throws a ReturnValue exception to stop an asynchronous generator.
	 *
	 * This interface is a stop-gap measure to support generator return
	 * values in older Firefox/SpiderMonkey.  In browsers that support ES6
	 * generators like Chromium 29, just use "return" in your generator
	 * functions.
	 *
	 * @param value the return value for the surrounding generator
	 * @throws ReturnValue exception with the value.
	 * @example
	 * // ES6 style
	 * Q.async(function* () {
	 *      var foo = yield getFooPromise();
	 *      var bar = yield getBarPromise();
	 *      return foo + bar;
	 * })
	 * // Older SpiderMonkey style
	 * Q.async(function () {
	 *      var foo = yield getFooPromise();
	 *      var bar = yield getBarPromise();
	 *      Q.return(foo + bar);
	 * })
	 */
	Q["return"] = _return;
	function _return(value) {
	    throw new QReturnValue(value);
	}
	
	/**
	 * The promised function decorator ensures that any promise arguments
	 * are settled and passed as values (`this` is also settled and passed
	 * as a value).  It will also ensure that the result of a function is
	 * always a promise.
	 *
	 * @example
	 * var add = Q.promised(function (a, b) {
	 *     return a + b;
	 * });
	 * add(Q(a), Q(B));
	 *
	 * @param {function} callback The function to decorate
	 * @returns {function} a function that has been decorated.
	 */
	Q.promised = promised;
	function promised(callback) {
	    return function () {
	        return spread([this, all(arguments)], function (self, args) {
	            return callback.apply(self, args);
	        });
	    };
	}
	
	/**
	 * sends a message to a value in a future turn
	 * @param object* the recipient
	 * @param op the name of the message operation, e.g., "when",
	 * @param args further arguments to be forwarded to the operation
	 * @returns result {Promise} a promise for the result of the operation
	 */
	Q.dispatch = dispatch;
	function dispatch(object, op, args) {
	    return Q(object).dispatch(op, args);
	}
	
	Promise.prototype.dispatch = function (op, args) {
	    var self = this;
	    var deferred = defer();
	    Q.nextTick(function () {
	        self.promiseDispatch(deferred.resolve, op, args);
	    });
	    return deferred.promise;
	};
	
	/**
	 * Gets the value of a property in a future turn.
	 * @param object    promise or immediate reference for target object
	 * @param name      name of property to get
	 * @return promise for the property value
	 */
	Q.get = function (object, key) {
	    return Q(object).dispatch("get", [key]);
	};
	
	Promise.prototype.get = function (key) {
	    return this.dispatch("get", [key]);
	};
	
	/**
	 * Sets the value of a property in a future turn.
	 * @param object    promise or immediate reference for object object
	 * @param name      name of property to set
	 * @param value     new value of property
	 * @return promise for the return value
	 */
	Q.set = function (object, key, value) {
	    return Q(object).dispatch("set", [key, value]);
	};
	
	Promise.prototype.set = function (key, value) {
	    return this.dispatch("set", [key, value]);
	};
	
	/**
	 * Deletes a property in a future turn.
	 * @param object    promise or immediate reference for target object
	 * @param name      name of property to delete
	 * @return promise for the return value
	 */
	Q.del = // XXX legacy
	Q["delete"] = function (object, key) {
	    return Q(object).dispatch("delete", [key]);
	};
	
	Promise.prototype.del = // XXX legacy
	Promise.prototype["delete"] = function (key) {
	    return this.dispatch("delete", [key]);
	};
	
	/**
	 * Invokes a method in a future turn.
	 * @param object    promise or immediate reference for target object
	 * @param name      name of method to invoke
	 * @param value     a value to post, typically an array of
	 *                  invocation arguments for promises that
	 *                  are ultimately backed with `resolve` values,
	 *                  as opposed to those backed with URLs
	 *                  wherein the posted value can be any
	 *                  JSON serializable object.
	 * @return promise for the return value
	 */
	// bound locally because it is used by other methods
	Q.mapply = // XXX As proposed by "Redsandro"
	Q.post = function (object, name, args) {
	    return Q(object).dispatch("post", [name, args]);
	};
	
	Promise.prototype.mapply = // XXX As proposed by "Redsandro"
	Promise.prototype.post = function (name, args) {
	    return this.dispatch("post", [name, args]);
	};
	
	/**
	 * Invokes a method in a future turn.
	 * @param object    promise or immediate reference for target object
	 * @param name      name of method to invoke
	 * @param ...args   array of invocation arguments
	 * @return promise for the return value
	 */
	Q.send = // XXX Mark Miller's proposed parlance
	Q.mcall = // XXX As proposed by "Redsandro"
	Q.invoke = function (object, name /*...args*/) {
	    return Q(object).dispatch("post", [name, array_slice(arguments, 2)]);
	};
	
	Promise.prototype.send = // XXX Mark Miller's proposed parlance
	Promise.prototype.mcall = // XXX As proposed by "Redsandro"
	Promise.prototype.invoke = function (name /*...args*/) {
	    return this.dispatch("post", [name, array_slice(arguments, 1)]);
	};
	
	/**
	 * Applies the promised function in a future turn.
	 * @param object    promise or immediate reference for target function
	 * @param args      array of application arguments
	 */
	Q.fapply = function (object, args) {
	    return Q(object).dispatch("apply", [void 0, args]);
	};
	
	Promise.prototype.fapply = function (args) {
	    return this.dispatch("apply", [void 0, args]);
	};
	
	/**
	 * Calls the promised function in a future turn.
	 * @param object    promise or immediate reference for target function
	 * @param ...args   array of application arguments
	 */
	Q["try"] =
	Q.fcall = function (object /* ...args*/) {
	    return Q(object).dispatch("apply", [void 0, array_slice(arguments, 1)]);
	};
	
	Promise.prototype.fcall = function (/*...args*/) {
	    return this.dispatch("apply", [void 0, array_slice(arguments)]);
	};
	
	/**
	 * Binds the promised function, transforming return values into a fulfilled
	 * promise and thrown errors into a rejected one.
	 * @param object    promise or immediate reference for target function
	 * @param ...args   array of application arguments
	 */
	Q.fbind = function (object /*...args*/) {
	    var promise = Q(object);
	    var args = array_slice(arguments, 1);
	    return function fbound() {
	        return promise.dispatch("apply", [
	            this,
	            args.concat(array_slice(arguments))
	        ]);
	    };
	};
	Promise.prototype.fbind = function (/*...args*/) {
	    var promise = this;
	    var args = array_slice(arguments);
	    return function fbound() {
	        return promise.dispatch("apply", [
	            this,
	            args.concat(array_slice(arguments))
	        ]);
	    };
	};
	
	/**
	 * Requests the names of the owned properties of a promised
	 * object in a future turn.
	 * @param object    promise or immediate reference for target object
	 * @return promise for the keys of the eventually settled object
	 */
	Q.keys = function (object) {
	    return Q(object).dispatch("keys", []);
	};
	
	Promise.prototype.keys = function () {
	    return this.dispatch("keys", []);
	};
	
	/**
	 * Turns an array of promises into a promise for an array.  If any of
	 * the promises gets rejected, the whole array is rejected immediately.
	 * @param {Array*} an array (or promise for an array) of values (or
	 * promises for values)
	 * @returns a promise for an array of the corresponding values
	 */
	// By Mark Miller
	// http://wiki.ecmascript.org/doku.php?id=strawman:concurrency&rev=1308776521#allfulfilled
	Q.all = all;
	function all(promises) {
	    return when(promises, function (promises) {
	        var pendingCount = 0;
	        var deferred = defer();
	        array_reduce(promises, function (undefined, promise, index) {
	            var snapshot;
	            if (
	                isPromise(promise) &&
	                (snapshot = promise.inspect()).state === "fulfilled"
	            ) {
	                promises[index] = snapshot.value;
	            } else {
	                ++pendingCount;
	                when(
	                    promise,
	                    function (value) {
	                        promises[index] = value;
	                        if (--pendingCount === 0) {
	                            deferred.resolve(promises);
	                        }
	                    },
	                    deferred.reject,
	                    function (progress) {
	                        deferred.notify({ index: index, value: progress });
	                    }
	                );
	            }
	        }, void 0);
	        if (pendingCount === 0) {
	            deferred.resolve(promises);
	        }
	        return deferred.promise;
	    });
	}
	
	Promise.prototype.all = function () {
	    return all(this);
	};
	
	/**
	 * Returns the first resolved promise of an array. Prior rejected promises are
	 * ignored.  Rejects only if all promises are rejected.
	 * @param {Array*} an array containing values or promises for values
	 * @returns a promise fulfilled with the value of the first resolved promise,
	 * or a rejected promise if all promises are rejected.
	 */
	Q.any = any;
	
	function any(promises) {
	    if (promises.length === 0) {
	        return Q.resolve();
	    }
	
	    var deferred = Q.defer();
	    var pendingCount = 0;
	    array_reduce(promises, function (prev, current, index) {
	        var promise = promises[index];
	
	        pendingCount++;
	
	        when(promise, onFulfilled, onRejected, onProgress);
	        function onFulfilled(result) {
	            deferred.resolve(result);
	        }
	        function onRejected() {
	            pendingCount--;
	            if (pendingCount === 0) {
	                deferred.reject(new Error(
	                    "Can't get fulfillment value from any promise, all " +
	                    "promises were rejected."
	                ));
	            }
	        }
	        function onProgress(progress) {
	            deferred.notify({
	                index: index,
	                value: progress
	            });
	        }
	    }, undefined);
	
	    return deferred.promise;
	}
	
	Promise.prototype.any = function () {
	    return any(this);
	};
	
	/**
	 * Waits for all promises to be settled, either fulfilled or
	 * rejected.  This is distinct from `all` since that would stop
	 * waiting at the first rejection.  The promise returned by
	 * `allResolved` will never be rejected.
	 * @param promises a promise for an array (or an array) of promises
	 * (or values)
	 * @return a promise for an array of promises
	 */
	Q.allResolved = deprecate(allResolved, "allResolved", "allSettled");
	function allResolved(promises) {
	    return when(promises, function (promises) {
	        promises = array_map(promises, Q);
	        return when(all(array_map(promises, function (promise) {
	            return when(promise, noop, noop);
	        })), function () {
	            return promises;
	        });
	    });
	}
	
	Promise.prototype.allResolved = function () {
	    return allResolved(this);
	};
	
	/**
	 * @see Promise#allSettled
	 */
	Q.allSettled = allSettled;
	function allSettled(promises) {
	    return Q(promises).allSettled();
	}
	
	/**
	 * Turns an array of promises into a promise for an array of their states (as
	 * returned by `inspect`) when they have all settled.
	 * @param {Array[Any*]} values an array (or promise for an array) of values (or
	 * promises for values)
	 * @returns {Array[State]} an array of states for the respective values.
	 */
	Promise.prototype.allSettled = function () {
	    return this.then(function (promises) {
	        return all(array_map(promises, function (promise) {
	            promise = Q(promise);
	            function regardless() {
	                return promise.inspect();
	            }
	            return promise.then(regardless, regardless);
	        }));
	    });
	};
	
	/**
	 * Captures the failure of a promise, giving an oportunity to recover
	 * with a callback.  If the given promise is fulfilled, the returned
	 * promise is fulfilled.
	 * @param {Any*} promise for something
	 * @param {Function} callback to fulfill the returned promise if the
	 * given promise is rejected
	 * @returns a promise for the return value of the callback
	 */
	Q.fail = // XXX legacy
	Q["catch"] = function (object, rejected) {
	    return Q(object).then(void 0, rejected);
	};
	
	Promise.prototype.fail = // XXX legacy
	Promise.prototype["catch"] = function (rejected) {
	    return this.then(void 0, rejected);
	};
	
	/**
	 * Attaches a listener that can respond to progress notifications from a
	 * promise's originating deferred. This listener receives the exact arguments
	 * passed to ``deferred.notify``.
	 * @param {Any*} promise for something
	 * @param {Function} callback to receive any progress notifications
	 * @returns the given promise, unchanged
	 */
	Q.progress = progress;
	function progress(object, progressed) {
	    return Q(object).then(void 0, void 0, progressed);
	}
	
	Promise.prototype.progress = function (progressed) {
	    return this.then(void 0, void 0, progressed);
	};
	
	/**
	 * Provides an opportunity to observe the settling of a promise,
	 * regardless of whether the promise is fulfilled or rejected.  Forwards
	 * the resolution to the returned promise when the callback is done.
	 * The callback can return a promise to defer completion.
	 * @param {Any*} promise
	 * @param {Function} callback to observe the resolution of the given
	 * promise, takes no arguments.
	 * @returns a promise for the resolution of the given promise when
	 * ``fin`` is done.
	 */
	Q.fin = // XXX legacy
	Q["finally"] = function (object, callback) {
	    return Q(object)["finally"](callback);
	};
	
	Promise.prototype.fin = // XXX legacy
	Promise.prototype["finally"] = function (callback) {
	    callback = Q(callback);
	    return this.then(function (value) {
	        return callback.fcall().then(function () {
	            return value;
	        });
	    }, function (reason) {
	        // TODO attempt to recycle the rejection with "this".
	        return callback.fcall().then(function () {
	            throw reason;
	        });
	    });
	};
	
	/**
	 * Terminates a chain of promises, forcing rejections to be
	 * thrown as exceptions.
	 * @param {Any*} promise at the end of a chain of promises
	 * @returns nothing
	 */
	Q.done = function (object, fulfilled, rejected, progress) {
	    return Q(object).done(fulfilled, rejected, progress);
	};
	
	Promise.prototype.done = function (fulfilled, rejected, progress) {
	    var onUnhandledError = function (error) {
	        // forward to a future turn so that ``when``
	        // does not catch it and turn it into a rejection.
	        Q.nextTick(function () {
	            makeStackTraceLong(error, promise);
	            if (Q.onerror) {
	                Q.onerror(error);
	            } else {
	                throw error;
	            }
	        });
	    };
	
	    // Avoid unnecessary `nextTick`ing via an unnecessary `when`.
	    var promise = fulfilled || rejected || progress ?
	        this.then(fulfilled, rejected, progress) :
	        this;
	
	    if (typeof process === "object" && process && process.domain) {
	        onUnhandledError = process.domain.bind(onUnhandledError);
	    }
	
	    promise.then(void 0, onUnhandledError);
	};
	
	/**
	 * Causes a promise to be rejected if it does not get fulfilled before
	 * some milliseconds time out.
	 * @param {Any*} promise
	 * @param {Number} milliseconds timeout
	 * @param {Any*} custom error message or Error object (optional)
	 * @returns a promise for the resolution of the given promise if it is
	 * fulfilled before the timeout, otherwise rejected.
	 */
	Q.timeout = function (object, ms, error) {
	    return Q(object).timeout(ms, error);
	};
	
	Promise.prototype.timeout = function (ms, error) {
	    var deferred = defer();
	    var timeoutId = setTimeout(function () {
	        if (!error || "string" === typeof error) {
	            error = new Error(error || "Timed out after " + ms + " ms");
	            error.code = "ETIMEDOUT";
	        }
	        deferred.reject(error);
	    }, ms);
	
	    this.then(function (value) {
	        clearTimeout(timeoutId);
	        deferred.resolve(value);
	    }, function (exception) {
	        clearTimeout(timeoutId);
	        deferred.reject(exception);
	    }, deferred.notify);
	
	    return deferred.promise;
	};
	
	/**
	 * Returns a promise for the given value (or promised value), some
	 * milliseconds after it resolved. Passes rejections immediately.
	 * @param {Any*} promise
	 * @param {Number} milliseconds
	 * @returns a promise for the resolution of the given promise after milliseconds
	 * time has elapsed since the resolution of the given promise.
	 * If the given promise rejects, that is passed immediately.
	 */
	Q.delay = function (object, timeout) {
	    if (timeout === void 0) {
	        timeout = object;
	        object = void 0;
	    }
	    return Q(object).delay(timeout);
	};
	
	Promise.prototype.delay = function (timeout) {
	    return this.then(function (value) {
	        var deferred = defer();
	        setTimeout(function () {
	            deferred.resolve(value);
	        }, timeout);
	        return deferred.promise;
	    });
	};
	
	/**
	 * Passes a continuation to a Node function, which is called with the given
	 * arguments provided as an array, and returns a promise.
	 *
	 *      Q.nfapply(FS.readFile, [__filename])
	 *      .then(function (content) {
	 *      })
	 *
	 */
	Q.nfapply = function (callback, args) {
	    return Q(callback).nfapply(args);
	};
	
	Promise.prototype.nfapply = function (args) {
	    var deferred = defer();
	    var nodeArgs = array_slice(args);
	    nodeArgs.push(deferred.makeNodeResolver());
	    this.fapply(nodeArgs).fail(deferred.reject);
	    return deferred.promise;
	};
	
	/**
	 * Passes a continuation to a Node function, which is called with the given
	 * arguments provided individually, and returns a promise.
	 * @example
	 * Q.nfcall(FS.readFile, __filename)
	 * .then(function (content) {
	 * })
	 *
	 */
	Q.nfcall = function (callback /*...args*/) {
	    var args = array_slice(arguments, 1);
	    return Q(callback).nfapply(args);
	};
	
	Promise.prototype.nfcall = function (/*...args*/) {
	    var nodeArgs = array_slice(arguments);
	    var deferred = defer();
	    nodeArgs.push(deferred.makeNodeResolver());
	    this.fapply(nodeArgs).fail(deferred.reject);
	    return deferred.promise;
	};
	
	/**
	 * Wraps a NodeJS continuation passing function and returns an equivalent
	 * version that returns a promise.
	 * @example
	 * Q.nfbind(FS.readFile, __filename)("utf-8")
	 * .then(console.log)
	 * .done()
	 */
	Q.nfbind =
	Q.denodeify = function (callback /*...args*/) {
	    var baseArgs = array_slice(arguments, 1);
	    return function () {
	        var nodeArgs = baseArgs.concat(array_slice(arguments));
	        var deferred = defer();
	        nodeArgs.push(deferred.makeNodeResolver());
	        Q(callback).fapply(nodeArgs).fail(deferred.reject);
	        return deferred.promise;
	    };
	};
	
	Promise.prototype.nfbind =
	Promise.prototype.denodeify = function (/*...args*/) {
	    var args = array_slice(arguments);
	    args.unshift(this);
	    return Q.denodeify.apply(void 0, args);
	};
	
	Q.nbind = function (callback, thisp /*...args*/) {
	    var baseArgs = array_slice(arguments, 2);
	    return function () {
	        var nodeArgs = baseArgs.concat(array_slice(arguments));
	        var deferred = defer();
	        nodeArgs.push(deferred.makeNodeResolver());
	        function bound() {
	            return callback.apply(thisp, arguments);
	        }
	        Q(bound).fapply(nodeArgs).fail(deferred.reject);
	        return deferred.promise;
	    };
	};
	
	Promise.prototype.nbind = function (/*thisp, ...args*/) {
	    var args = array_slice(arguments, 0);
	    args.unshift(this);
	    return Q.nbind.apply(void 0, args);
	};
	
	/**
	 * Calls a method of a Node-style object that accepts a Node-style
	 * callback with a given array of arguments, plus a provided callback.
	 * @param object an object that has the named method
	 * @param {String} name name of the method of object
	 * @param {Array} args arguments to pass to the method; the callback
	 * will be provided by Q and appended to these arguments.
	 * @returns a promise for the value or error
	 */
	Q.nmapply = // XXX As proposed by "Redsandro"
	Q.npost = function (object, name, args) {
	    return Q(object).npost(name, args);
	};
	
	Promise.prototype.nmapply = // XXX As proposed by "Redsandro"
	Promise.prototype.npost = function (name, args) {
	    var nodeArgs = array_slice(args || []);
	    var deferred = defer();
	    nodeArgs.push(deferred.makeNodeResolver());
	    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
	    return deferred.promise;
	};
	
	/**
	 * Calls a method of a Node-style object that accepts a Node-style
	 * callback, forwarding the given variadic arguments, plus a provided
	 * callback argument.
	 * @param object an object that has the named method
	 * @param {String} name name of the method of object
	 * @param ...args arguments to pass to the method; the callback will
	 * be provided by Q and appended to these arguments.
	 * @returns a promise for the value or error
	 */
	Q.nsend = // XXX Based on Mark Miller's proposed "send"
	Q.nmcall = // XXX Based on "Redsandro's" proposal
	Q.ninvoke = function (object, name /*...args*/) {
	    var nodeArgs = array_slice(arguments, 2);
	    var deferred = defer();
	    nodeArgs.push(deferred.makeNodeResolver());
	    Q(object).dispatch("post", [name, nodeArgs]).fail(deferred.reject);
	    return deferred.promise;
	};
	
	Promise.prototype.nsend = // XXX Based on Mark Miller's proposed "send"
	Promise.prototype.nmcall = // XXX Based on "Redsandro's" proposal
	Promise.prototype.ninvoke = function (name /*...args*/) {
	    var nodeArgs = array_slice(arguments, 1);
	    var deferred = defer();
	    nodeArgs.push(deferred.makeNodeResolver());
	    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
	    return deferred.promise;
	};
	
	/**
	 * If a function would like to support both Node continuation-passing-style and
	 * promise-returning-style, it can end its internal promise chain with
	 * `nodeify(nodeback)`, forwarding the optional nodeback argument.  If the user
	 * elects to use a nodeback, the result will be sent there.  If they do not
	 * pass a nodeback, they will receive the result promise.
	 * @param object a result (or a promise for a result)
	 * @param {Function} nodeback a Node.js-style callback
	 * @returns either the promise or nothing
	 */
	Q.nodeify = nodeify;
	function nodeify(object, nodeback) {
	    return Q(object).nodeify(nodeback);
	}
	
	Promise.prototype.nodeify = function (nodeback) {
	    if (nodeback) {
	        this.then(function (value) {
	            Q.nextTick(function () {
	                nodeback(null, value);
	            });
	        }, function (error) {
	            Q.nextTick(function () {
	                nodeback(error);
	            });
	        });
	    } else {
	        return this;
	    }
	};
	
	Q.noConflict = function() {
	    throw new Error("Q.noConflict only works when Q is used as a global");
	};
	
	// All code before this point will be filtered from stack traces.
	var qEndingLine = captureLine();
	
	return Q;
	
	});


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var fs = __webpack_require__(7);
	var Q = __webpack_require__(5);
	var write = __webpack_require__(8);
	var validate = __webpack_require__(10);
	
	var validateInput = function (methodName, path, data, options) {
	  var methodSignature = methodName + '(path, data, [options])';
	  validate.argument(methodSignature, 'path', path, ['string']);
	  validate.argument(methodSignature, 'data', data, ['string', 'buffer']);
	  validate.options(methodSignature, 'options', options, {
	    mode: ['string', 'number']
	  });
	};
	
	// ---------------------------------------------------------
	// SYNC
	// ---------------------------------------------------------
	
	var appendSync = function (path, data, options) {
	  try {
	    fs.appendFileSync(path, data, options);
	  } catch (err) {
	    if (err.code === 'ENOENT') {
	      // Parent directory doesn't exist, so just pass the task to `write`,
	      // which will create the folder and file.
	      write.sync(path, data, options);
	    } else {
	      throw err;
	    }
	  }
	};
	
	// ---------------------------------------------------------
	// ASYNC
	// ---------------------------------------------------------
	
	var promisedAppendFile = Q.denodeify(fs.appendFile);
	
	var appendAsync = function (path, data, options) {
	  var deferred = Q.defer();
	
	  promisedAppendFile(path, data, options)
	  .then(deferred.resolve)
	  .catch(function (err) {
	    if (err.code === 'ENOENT') {
	      // Parent directory doesn't exist, so just pass the task to `write`,
	      // which will create the folder and file.
	      write.async(path, data, options).then(deferred.resolve, deferred.reject);
	    } else {
	      deferred.reject(err);
	    }
	  });
	
	  return deferred.promise;
	};
	
	// ---------------------------------------------------------
	// API
	// ---------------------------------------------------------
	
	exports.validateInput = validateInput;
	exports.sync = appendSync;
	exports.async = appendAsync;


/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var fs = __webpack_require__(7);
	var Q = __webpack_require__(5);
	var mkdirp = __webpack_require__(9);
	var pathUtil = __webpack_require__(4);
	var validate = __webpack_require__(10);
	
	var validateInput = function (methodName, path, data, options) {
	  var methodSignature = methodName + '(path, data, [options])';
	  validate.argument(methodSignature, 'path', path, ['string']);
	  validate.argument(methodSignature, 'data', data, ['string', 'buffer', 'object', 'array']);
	  validate.options(methodSignature, 'options', options, {
	    atomic: ['boolean'],
	    jsonIndent: ['number']
	  });
	};
	
	// Temporary file extensions used for atomic file overwriting.
	var newExt = '.__new__';
	
	var serializeToJsonMaybe = function (data, jsonIndent) {
	  var indent = jsonIndent;
	  if (typeof indent !== 'number') {
	    indent = 2;
	  }
	
	  if (typeof data === 'object'
	      && !Buffer.isBuffer(data)
	      && data !== null) {
	    return JSON.stringify(data, null, indent);
	  }
	
	  return data;
	};
	
	// ---------------------------------------------------------
	// SYNC
	// ---------------------------------------------------------
	
	var writeFileSync = function (path, data, options) {
	  try {
	    fs.writeFileSync(path, data, options);
	  } catch (err) {
	    if (err.code === 'ENOENT') {
	      // Means parent directory doesn't exist, so create it and try again.
	      mkdirp.sync(pathUtil.dirname(path));
	      fs.writeFileSync(path, data, options);
	    } else {
	      throw err;
	    }
	  }
	};
	
	var writeAtomicSync = function (path, data, options) {
	  // we are assuming there is file on given path, and we don't want
	  // to touch it until we are sure our data has been saved correctly,
	  // so write the data into temporary file...
	  writeFileSync(path + newExt, data, options);
	  // ...next rename temp file to replace real path.
	  fs.renameSync(path + newExt, path);
	};
	
	var writeSync = function (path, data, options) {
	  var opts = options || {};
	  var processedData = serializeToJsonMaybe(data, opts.jsonIndent);
	
	  var writeStrategy = writeFileSync;
	  if (opts.atomic) {
	    writeStrategy = writeAtomicSync;
	  }
	  writeStrategy(path, processedData, { mode: opts.mode });
	};
	
	// ---------------------------------------------------------
	// ASYNC
	// ---------------------------------------------------------
	
	var promisedRename = Q.denodeify(fs.rename);
	var promisedWriteFile = Q.denodeify(fs.writeFile);
	var promisedMkdirp = Q.denodeify(mkdirp);
	
	var writeFileAsync = function (path, data, options) {
	  var deferred = Q.defer();
	
	  promisedWriteFile(path, data, options)
	  .then(deferred.resolve)
	  .catch(function (err) {
	    // First attempt to write a file ended with error.
	    // Check if this is not due to nonexistent parent directory.
	    if (err.code === 'ENOENT') {
	      // Parent directory doesn't exist, so create it and try again.
	      promisedMkdirp(pathUtil.dirname(path))
	      .then(function () {
	        return promisedWriteFile(path, data, options);
	      })
	      .then(deferred.resolve, deferred.reject);
	    } else {
	      // Nope, some other error, throw it.
	      deferred.reject(err);
	    }
	  });
	
	  return deferred.promise;
	};
	
	var writeAtomicAsync = function (path, data, options) {
	  var deferred = Q.defer();
	
	  // We are assuming there is file on given path, and we don't want
	  // to touch it until we are sure our data has been saved correctly,
	  // so write the data into temporary file...
	  writeFileAsync(path + newExt, data, options)
	  .then(function () {
	    // ...next rename temp file to real path.
	    return promisedRename(path + newExt, path);
	  })
	  .then(deferred.resolve, deferred.reject);
	
	  return deferred.promise;
	};
	
	var writeAsync = function (path, data, options) {
	  var opts = options || {};
	  var processedData = serializeToJsonMaybe(data, opts.jsonIndent);
	
	  var writeStrategy = writeFileAsync;
	  if (opts.atomic) {
	    writeStrategy = writeAtomicAsync;
	  }
	  return writeStrategy(path, processedData, { mode: opts.mode });
	};
	
	// ---------------------------------------------------------
	// API
	// ---------------------------------------------------------
	
	exports.validateInput = validateInput;
	exports.sync = writeSync;
	exports.async = writeAsync;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var path = __webpack_require__(4);
	var fs = __webpack_require__(7);
	var _0777 = parseInt('0777', 8);
	
	module.exports = mkdirP.mkdirp = mkdirP.mkdirP = mkdirP;
	
	function mkdirP (p, opts, f, made) {
	    if (typeof opts === 'function') {
	        f = opts;
	        opts = {};
	    }
	    else if (!opts || typeof opts !== 'object') {
	        opts = { mode: opts };
	    }
	    
	    var mode = opts.mode;
	    var xfs = opts.fs || fs;
	    
	    if (mode === undefined) {
	        mode = _0777 & (~process.umask());
	    }
	    if (!made) made = null;
	    
	    var cb = f || function () {};
	    p = path.resolve(p);
	    
	    xfs.mkdir(p, mode, function (er) {
	        if (!er) {
	            made = made || p;
	            return cb(null, made);
	        }
	        switch (er.code) {
	            case 'ENOENT':
	                mkdirP(path.dirname(p), opts, function (er, made) {
	                    if (er) cb(er, made);
	                    else mkdirP(p, opts, cb, made);
	                });
	                break;
	
	            // In the case of any other error, just see if there's a dir
	            // there already.  If so, then hooray!  If not, then something
	            // is borked.
	            default:
	                xfs.stat(p, function (er2, stat) {
	                    // if the stat fails, then that's super weird.
	                    // let the original error be the failure reason.
	                    if (er2 || !stat.isDirectory()) cb(er, made)
	                    else cb(null, made);
	                });
	                break;
	        }
	    });
	}
	
	mkdirP.sync = function sync (p, opts, made) {
	    if (!opts || typeof opts !== 'object') {
	        opts = { mode: opts };
	    }
	    
	    var mode = opts.mode;
	    var xfs = opts.fs || fs;
	    
	    if (mode === undefined) {
	        mode = _0777 & (~process.umask());
	    }
	    if (!made) made = null;
	
	    p = path.resolve(p);
	
	    try {
	        xfs.mkdirSync(p, mode);
	        made = made || p;
	    }
	    catch (err0) {
	        switch (err0.code) {
	            case 'ENOENT' :
	                made = sync(path.dirname(p), opts, made);
	                sync(p, opts, made);
	                break;
	
	            // In the case of any other error, just see if there's a dir
	            // there already.  If so, then hooray!  If not, then something
	            // is borked.
	            default:
	                var stat;
	                try {
	                    stat = xfs.statSync(p);
	                }
	                catch (err1) {
	                    throw err0;
	                }
	                if (!stat.isDirectory()) throw err0;
	                break;
	        }
	    }
	
	    return made;
	};


/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';
	
	var prettyPrintTypes = function (types) {
	  var addArticle = function (str) {
	    var vowels = ['a', 'e', 'i', 'o', 'u'];
	    if (vowels.indexOf(str[0]) !== -1) {
	      return 'an ' + str;
	    }
	    return 'a ' + str;
	  };
	
	  return types.map(addArticle).join(' or ');
	};
	
	var isArrayOfNotation = function (typeDefinition) {
	  return /array of /.test(typeDefinition);
	};
	
	var extractTypeFromArrayOfNotation = function (typeDefinition) {
	  // The notation is e.g. 'array of string'
	  return typeDefinition.split(' of ')[1];
	};
	
	var isValidTypeDefinition = function (typeStr) {
	  if (isArrayOfNotation(typeStr)) {
	    return isValidTypeDefinition(extractTypeFromArrayOfNotation(typeStr));
	  }
	
	  return [
	    'string',
	    'number',
	    'boolean',
	    'array',
	    'object',
	    'buffer',
	    'null',
	    'undefined'
	  ].some(function (validType) {
	    return validType === typeStr;
	  });
	};
	
	var detectType = function (value) {
	  if (value === null) {
	    return 'null';
	  }
	  if (Array.isArray(value)) {
	    return 'array';
	  }
	  if (Buffer.isBuffer(value)) {
	    return 'buffer';
	  }
	  return typeof value;
	};
	
	var onlyUniqueValuesInArrayFilter = function (value, index, self) {
	  return self.indexOf(value) === index;
	};
	
	var detectTypeDeep = function (value) {
	  var type = detectType(value);
	  var typesInArray;
	
	  if (type === 'array') {
	    typesInArray = value
	      .map(function (element) {
	        return detectType(element);
	      })
	      .filter(onlyUniqueValuesInArrayFilter);
	    type += ' of ' + typesInArray.join(', ');
	  }
	
	  return type;
	};
	
	var validateArray = function (argumentValue, typeToCheck) {
	  var allowedTypeInArray = extractTypeFromArrayOfNotation(typeToCheck);
	
	  if (detectType(argumentValue) !== 'array') {
	    return false;
	  }
	
	  return argumentValue.every(function (element) {
	    return detectType(element) === allowedTypeInArray;
	  });
	};
	
	var validateArgument = function (methodName, argumentName, argumentValue, argumentMustBe) {
	  var isOneOfAllowedTypes = argumentMustBe.some(function (type) {
	    if (!isValidTypeDefinition(type)) {
	      throw new Error('Unknown type "' + type + '"');
	    }
	
	    if (isArrayOfNotation(type)) {
	      return validateArray(argumentValue, type);
	    }
	
	    return type === detectType(argumentValue);
	  });
	
	  if (!isOneOfAllowedTypes) {
	    throw new Error('Argument "' + argumentName + '" passed to ' + methodName + ' must be '
	      + prettyPrintTypes(argumentMustBe) + '. Received ' + detectTypeDeep(argumentValue));
	  }
	};
	
	var validateOptions = function (methodName, optionsObjName, obj, allowedOptions) {
	  if (obj !== undefined) {
	    validateArgument(methodName, optionsObjName, obj, ['object']);
	    Object.keys(obj).forEach(function (key) {
	      var argName = optionsObjName + '.' + key;
	      if (allowedOptions.hasOwnProperty(key)) {
	        validateArgument(methodName, argName, obj[key], allowedOptions[key]);
	      } else {
	        throw new Error('Unknown argument "' + argName + '" passed to ' + methodName);
	      }
	    });
	  }
	};
	
	module.exports = {
	  argument: validateArgument,
	  options: validateOptions
	};


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var pathUtil = __webpack_require__(4);
	var fs = __webpack_require__(7);
	var Q = __webpack_require__(5);
	var mkdirp = __webpack_require__(9);
	var rimraf = __webpack_require__(12);
	
	var modeUtil = __webpack_require__(30);
	var validate = __webpack_require__(10);
	
	var validateInput = function (methodName, path, criteria) {
	  var methodSignature = methodName + '(path, [criteria])';
	  validate.argument(methodSignature, 'path', path, ['string']);
	  validate.options(methodSignature, 'criteria', criteria, {
	    empty: ['boolean'],
	    mode: ['string', 'number']
	  });
	};
	
	var getCriteriaDefaults = function (passedCriteria) {
	  var criteria = passedCriteria || {};
	  if (typeof criteria.empty !== 'boolean') {
	    criteria.empty = false;
	  }
	  if (criteria.mode !== undefined) {
	    criteria.mode = modeUtil.normalizeFileMode(criteria.mode);
	  }
	  return criteria;
	};
	
	var generatePathOccupiedByNotDirectoryError = function (path) {
	  return new Error('Path ' + path + ' exists but is not a directory.' +
	      ' Halting jetpack.dir() call for safety reasons.');
	};
	
	// ---------------------------------------------------------
	// Sync
	// ---------------------------------------------------------
	
	var checkWhatAlreadyOccupiesPathSync = function (path) {
	  var stat;
	
	  try {
	    stat = fs.statSync(path);
	  } catch (err) {
	    // Detection if path already exists
	    if (err.code !== 'ENOENT') {
	      throw err;
	    }
	  }
	
	  if (stat && !stat.isDirectory()) {
	    throw generatePathOccupiedByNotDirectoryError(path);
	  }
	
	  return stat;
	};
	
	var createBrandNewDirectorySync = function (path, criteria) {
	  mkdirp.sync(path, { mode: criteria.mode });
	};
	
	var checkExistingDirectoryFulfillsCriteriaSync = function (path, stat, criteria) {
	  var checkMode = function () {
	    var mode = modeUtil.normalizeFileMode(stat.mode);
	    if (criteria.mode !== undefined && criteria.mode !== mode) {
	      fs.chmodSync(path, criteria.mode);
	    }
	  };
	
	  var checkEmptiness = function () {
	    var list;
	    if (criteria.empty) {
	      // Delete everything inside this directory
	      list = fs.readdirSync(path);
	      list.forEach(function (filename) {
	        rimraf.sync(pathUtil.resolve(path, filename));
	      });
	    }
	  };
	
	  checkMode();
	  checkEmptiness();
	};
	
	var dirSync = function (path, passedCriteria) {
	  var criteria = getCriteriaDefaults(passedCriteria);
	  var stat = checkWhatAlreadyOccupiesPathSync(path);
	  if (stat) {
	    checkExistingDirectoryFulfillsCriteriaSync(path, stat, criteria);
	  } else {
	    createBrandNewDirectorySync(path, criteria);
	  }
	};
	
	// ---------------------------------------------------------
	// Async
	// ---------------------------------------------------------
	
	var promisedStat = Q.denodeify(fs.stat);
	var promisedChmod = Q.denodeify(fs.chmod);
	var promisedReaddir = Q.denodeify(fs.readdir);
	var promisedRimraf = Q.denodeify(rimraf);
	var promisedMkdirp = Q.denodeify(mkdirp);
	
	var checkWhatAlreadyOccupiesPathAsync = function (path) {
	  var deferred = Q.defer();
	
	  promisedStat(path)
	  .then(function (stat) {
	    if (stat.isDirectory()) {
	      deferred.resolve(stat);
	    } else {
	      deferred.reject(generatePathOccupiedByNotDirectoryError(path));
	    }
	  })
	  .catch(function (err) {
	    if (err.code === 'ENOENT') {
	      // Path doesn't exist
	      deferred.resolve(undefined);
	    } else {
	      // This is other error that nonexistent path, so end here.
	      deferred.reject(err);
	    }
	  });
	
	  return deferred.promise;
	};
	
	// Delete all files and directores inside given directory
	var emptyAsync = function (path) {
	  var deferred = Q.defer();
	
	  promisedReaddir(path)
	  .then(function (list) {
	    var doOne = function (index) {
	      var subPath;
	      if (index === list.length) {
	        deferred.resolve();
	      } else {
	        subPath = pathUtil.resolve(path, list[index]);
	        promisedRimraf(subPath).then(function () {
	          doOne(index + 1);
	        });
	      }
	    };
	
	    doOne(0);
	  })
	  .catch(deferred.reject);
	
	  return deferred.promise;
	};
	
	var checkExistingDirectoryFulfillsCriteriaAsync = function (path, stat, criteria) {
	  var deferred = Q.defer();
	
	  var checkMode = function () {
	    var mode = modeUtil.normalizeFileMode(stat.mode);
	    if (criteria.mode !== undefined && criteria.mode !== mode) {
	      return promisedChmod(path, criteria.mode);
	    }
	    return new Q();
	  };
	
	  var checkEmptiness = function () {
	    if (criteria.empty) {
	      return emptyAsync(path);
	    }
	    return new Q();
	  };
	
	  checkMode()
	  .then(checkEmptiness)
	  .then(deferred.resolve, deferred.reject);
	
	  return deferred.promise;
	};
	
	var createBrandNewDirectoryAsync = function (path, criteria) {
	  return promisedMkdirp(path, { mode: criteria.mode });
	};
	
	var dirAsync = function (path, passedCriteria) {
	  var deferred = Q.defer();
	  var criteria = getCriteriaDefaults(passedCriteria);
	
	  checkWhatAlreadyOccupiesPathAsync(path)
	  .then(function (stat) {
	    if (stat !== undefined) {
	      return checkExistingDirectoryFulfillsCriteriaAsync(path, stat, criteria);
	    }
	    return createBrandNewDirectoryAsync(path, criteria);
	  })
	  .then(deferred.resolve, deferred.reject);
	
	  return deferred.promise;
	};
	
	// ---------------------------------------------------------
	// API
	// ---------------------------------------------------------
	
	module.exports.validateInput = validateInput;
	module.exports.sync = dirSync;
	module.exports.async = dirAsync;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = rimraf
	rimraf.sync = rimrafSync
	
	var assert = __webpack_require__(13)
	var path = __webpack_require__(4)
	var fs = __webpack_require__(7)
	var glob = __webpack_require__(14)
	
	var defaultGlobOpts = {
	  nosort: true,
	  silent: true
	}
	
	// for EMFILE handling
	var timeout = 0
	
	var isWindows = (process.platform === "win32")
	
	function defaults (options) {
	  var methods = [
	    'unlink',
	    'chmod',
	    'stat',
	    'lstat',
	    'rmdir',
	    'readdir'
	  ]
	  methods.forEach(function(m) {
	    options[m] = options[m] || fs[m]
	    m = m + 'Sync'
	    options[m] = options[m] || fs[m]
	  })
	
	  options.maxBusyTries = options.maxBusyTries || 3
	  options.emfileWait = options.emfileWait || 1000
	  if (options.glob === false) {
	    options.disableGlob = true
	  }
	  options.disableGlob = options.disableGlob || false
	  options.glob = options.glob || defaultGlobOpts
	}
	
	function rimraf (p, options, cb) {
	  if (typeof options === 'function') {
	    cb = options
	    options = {}
	  }
	
	  assert(p, 'rimraf: missing path')
	  assert.equal(typeof p, 'string', 'rimraf: path should be a string')
	  assert.equal(typeof cb, 'function', 'rimraf: callback function required')
	  assert(options, 'rimraf: invalid options argument provided')
	  assert.equal(typeof options, 'object', 'rimraf: options should be object')
	
	  defaults(options)
	
	  var busyTries = 0
	  var errState = null
	  var n = 0
	
	  if (options.disableGlob || !glob.hasMagic(p))
	    return afterGlob(null, [p])
	
	  options.lstat(p, function (er, stat) {
	    if (!er)
	      return afterGlob(null, [p])
	
	    glob(p, options.glob, afterGlob)
	  })
	
	  function next (er) {
	    errState = errState || er
	    if (--n === 0)
	      cb(errState)
	  }
	
	  function afterGlob (er, results) {
	    if (er)
	      return cb(er)
	
	    n = results.length
	    if (n === 0)
	      return cb()
	
	    results.forEach(function (p) {
	      rimraf_(p, options, function CB (er) {
	        if (er) {
	          if ((er.code === "EBUSY" || er.code === "ENOTEMPTY" || er.code === "EPERM") &&
	              busyTries < options.maxBusyTries) {
	            busyTries ++
	            var time = busyTries * 100
	            // try again, with the same exact callback as this one.
	            return setTimeout(function () {
	              rimraf_(p, options, CB)
	            }, time)
	          }
	
	          // this one won't happen if graceful-fs is used.
	          if (er.code === "EMFILE" && timeout < options.emfileWait) {
	            return setTimeout(function () {
	              rimraf_(p, options, CB)
	            }, timeout ++)
	          }
	
	          // already gone
	          if (er.code === "ENOENT") er = null
	        }
	
	        timeout = 0
	        next(er)
	      })
	    })
	  }
	}
	
	// Two possible strategies.
	// 1. Assume it's a file.  unlink it, then do the dir stuff on EPERM or EISDIR
	// 2. Assume it's a directory.  readdir, then do the file stuff on ENOTDIR
	//
	// Both result in an extra syscall when you guess wrong.  However, there
	// are likely far more normal files in the world than directories.  This
	// is based on the assumption that a the average number of files per
	// directory is >= 1.
	//
	// If anyone ever complains about this, then I guess the strategy could
	// be made configurable somehow.  But until then, YAGNI.
	function rimraf_ (p, options, cb) {
	  assert(p)
	  assert(options)
	  assert(typeof cb === 'function')
	
	  // sunos lets the root user unlink directories, which is... weird.
	  // so we have to lstat here and make sure it's not a dir.
	  options.lstat(p, function (er, st) {
	    if (er && er.code === "ENOENT")
	      return cb(null)
	
	    // Windows can EPERM on stat.  Life is suffering.
	    if (er && er.code === "EPERM" && isWindows)
	      fixWinEPERM(p, options, er, cb)
	
	    if (st && st.isDirectory())
	      return rmdir(p, options, er, cb)
	
	    options.unlink(p, function (er) {
	      if (er) {
	        if (er.code === "ENOENT")
	          return cb(null)
	        if (er.code === "EPERM")
	          return (isWindows)
	            ? fixWinEPERM(p, options, er, cb)
	            : rmdir(p, options, er, cb)
	        if (er.code === "EISDIR")
	          return rmdir(p, options, er, cb)
	      }
	      return cb(er)
	    })
	  })
	}
	
	function fixWinEPERM (p, options, er, cb) {
	  assert(p)
	  assert(options)
	  assert(typeof cb === 'function')
	  if (er)
	    assert(er instanceof Error)
	
	  options.chmod(p, 666, function (er2) {
	    if (er2)
	      cb(er2.code === "ENOENT" ? null : er)
	    else
	      options.stat(p, function(er3, stats) {
	        if (er3)
	          cb(er3.code === "ENOENT" ? null : er)
	        else if (stats.isDirectory())
	          rmdir(p, options, er, cb)
	        else
	          options.unlink(p, cb)
	      })
	  })
	}
	
	function fixWinEPERMSync (p, options, er) {
	  assert(p)
	  assert(options)
	  if (er)
	    assert(er instanceof Error)
	
	  try {
	    options.chmodSync(p, 666)
	  } catch (er2) {
	    if (er2.code === "ENOENT")
	      return
	    else
	      throw er
	  }
	
	  try {
	    var stats = options.statSync(p)
	  } catch (er3) {
	    if (er3.code === "ENOENT")
	      return
	    else
	      throw er
	  }
	
	  if (stats.isDirectory())
	    rmdirSync(p, options, er)
	  else
	    options.unlinkSync(p)
	}
	
	function rmdir (p, options, originalEr, cb) {
	  assert(p)
	  assert(options)
	  if (originalEr)
	    assert(originalEr instanceof Error)
	  assert(typeof cb === 'function')
	
	  // try to rmdir first, and only readdir on ENOTEMPTY or EEXIST (SunOS)
	  // if we guessed wrong, and it's not a directory, then
	  // raise the original error.
	  options.rmdir(p, function (er) {
	    if (er && (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM"))
	      rmkids(p, options, cb)
	    else if (er && er.code === "ENOTDIR")
	      cb(originalEr)
	    else
	      cb(er)
	  })
	}
	
	function rmkids(p, options, cb) {
	  assert(p)
	  assert(options)
	  assert(typeof cb === 'function')
	
	  options.readdir(p, function (er, files) {
	    if (er)
	      return cb(er)
	    var n = files.length
	    if (n === 0)
	      return options.rmdir(p, cb)
	    var errState
	    files.forEach(function (f) {
	      rimraf(path.join(p, f), options, function (er) {
	        if (errState)
	          return
	        if (er)
	          return cb(errState = er)
	        if (--n === 0)
	          options.rmdir(p, cb)
	      })
	    })
	  })
	}
	
	// this looks simpler, and is strictly *faster*, but will
	// tie up the JavaScript thread and fail on excessively
	// deep directory trees.
	function rimrafSync (p, options) {
	  options = options || {}
	  defaults(options)
	
	  assert(p, 'rimraf: missing path')
	  assert.equal(typeof p, 'string', 'rimraf: path should be a string')
	  assert(options, 'rimraf: missing options')
	  assert.equal(typeof options, 'object', 'rimraf: options should be object')
	
	  var results
	
	  if (options.disableGlob || !glob.hasMagic(p)) {
	    results = [p]
	  } else {
	    try {
	      options.lstatSync(p)
	      results = [p]
	    } catch (er) {
	      results = glob.sync(p, options.glob)
	    }
	  }
	
	  if (!results.length)
	    return
	
	  for (var i = 0; i < results.length; i++) {
	    var p = results[i]
	
	    try {
	      var st = options.lstatSync(p)
	    } catch (er) {
	      if (er.code === "ENOENT")
	        return
	
	      // Windows can EPERM on stat.  Life is suffering.
	      if (er.code === "EPERM" && isWindows)
	        fixWinEPERMSync(p, options, er)
	    }
	
	    try {
	      // sunos lets the root user unlink directories, which is... weird.
	      if (st && st.isDirectory())
	        rmdirSync(p, options, null)
	      else
	        options.unlinkSync(p)
	    } catch (er) {
	      if (er.code === "ENOENT")
	        return
	      if (er.code === "EPERM")
	        return isWindows ? fixWinEPERMSync(p, options, er) : rmdirSync(p, options, er)
	      if (er.code !== "EISDIR")
	        throw er
	
	      rmdirSync(p, options, er)
	    }
	  }
	}
	
	function rmdirSync (p, options, originalEr) {
	  assert(p)
	  assert(options)
	  if (originalEr)
	    assert(originalEr instanceof Error)
	
	  try {
	    options.rmdirSync(p)
	  } catch (er) {
	    if (er.code === "ENOENT")
	      return
	    if (er.code === "ENOTDIR")
	      throw originalEr
	    if (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM")
	      rmkidsSync(p, options)
	  }
	}
	
	function rmkidsSync (p, options) {
	  assert(p)
	  assert(options)
	  options.readdirSync(p).forEach(function (f) {
	    rimrafSync(path.join(p, f), options)
	  })
	
	  // We only end up here once we got ENOTEMPTY at least once, and
	  // at this point, we are guaranteed to have removed all the kids.
	  // So, we know that it won't be ENOENT or ENOTDIR or anything else.
	  // try really hard to delete stuff on windows, because it has a
	  // PROFOUNDLY annoying habit of not closing handles promptly when
	  // files are deleted, resulting in spurious ENOTEMPTY errors.
	  var retries = isWindows ? 100 : 1
	  var i = 0
	  do {
	    var threw = true
	    try {
	      var ret = options.rmdirSync(p, options)
	      threw = false
	      return ret
	    } finally {
	      if (++i < retries && threw)
	        continue
	    }
	  } while (true)
	}


/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = require("assert");

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	// Approach:
	//
	// 1. Get the minimatch set
	// 2. For each pattern in the set, PROCESS(pattern, false)
	// 3. Store matches per-set, then uniq them
	//
	// PROCESS(pattern, inGlobStar)
	// Get the first [n] items from pattern that are all strings
	// Join these together.  This is PREFIX.
	//   If there is no more remaining, then stat(PREFIX) and
	//   add to matches if it succeeds.  END.
	//
	// If inGlobStar and PREFIX is symlink and points to dir
	//   set ENTRIES = []
	// else readdir(PREFIX) as ENTRIES
	//   If fail, END
	//
	// with ENTRIES
	//   If pattern[n] is GLOBSTAR
	//     // handle the case where the globstar match is empty
	//     // by pruning it out, and testing the resulting pattern
	//     PROCESS(pattern[0..n] + pattern[n+1 .. $], false)
	//     // handle other cases.
	//     for ENTRY in ENTRIES (not dotfiles)
	//       // attach globstar + tail onto the entry
	//       // Mark that this entry is a globstar match
	//       PROCESS(pattern[0..n] + ENTRY + pattern[n .. $], true)
	//
	//   else // not globstar
	//     for ENTRY in ENTRIES (not dotfiles, unless pattern[n] is dot)
	//       Test ENTRY against pattern[n]
	//       If fails, continue
	//       If passes, PROCESS(pattern[0..n] + item + pattern[n+1 .. $])
	//
	// Caveat:
	//   Cache all stats and readdirs results to minimize syscall.  Since all
	//   we ever care about is existence and directory-ness, we can just keep
	//   `true` for files, and [children,...] for directories, or `false` for
	//   things that don't exist.
	
	module.exports = glob
	
	var fs = __webpack_require__(7)
	var rp = __webpack_require__(15)
	var minimatch = __webpack_require__(17)
	var Minimatch = minimatch.Minimatch
	var inherits = __webpack_require__(21)
	var EE = __webpack_require__(23).EventEmitter
	var path = __webpack_require__(4)
	var assert = __webpack_require__(13)
	var isAbsolute = __webpack_require__(24)
	var globSync = __webpack_require__(25)
	var common = __webpack_require__(26)
	var alphasort = common.alphasort
	var alphasorti = common.alphasorti
	var setopts = common.setopts
	var ownProp = common.ownProp
	var inflight = __webpack_require__(27)
	var util = __webpack_require__(3)
	var childrenIgnored = common.childrenIgnored
	var isIgnored = common.isIgnored
	
	var once = __webpack_require__(29)
	
	function glob (pattern, options, cb) {
	  if (typeof options === 'function') cb = options, options = {}
	  if (!options) options = {}
	
	  if (options.sync) {
	    if (cb)
	      throw new TypeError('callback provided to sync glob')
	    return globSync(pattern, options)
	  }
	
	  return new Glob(pattern, options, cb)
	}
	
	glob.sync = globSync
	var GlobSync = glob.GlobSync = globSync.GlobSync
	
	// old api surface
	glob.glob = glob
	
	function extend (origin, add) {
	  if (add === null || typeof add !== 'object') {
	    return origin
	  }
	
	  var keys = Object.keys(add)
	  var i = keys.length
	  while (i--) {
	    origin[keys[i]] = add[keys[i]]
	  }
	  return origin
	}
	
	glob.hasMagic = function (pattern, options_) {
	  var options = extend({}, options_)
	  options.noprocess = true
	
	  var g = new Glob(pattern, options)
	  var set = g.minimatch.set
	
	  if (!pattern)
	    return false
	
	  if (set.length > 1)
	    return true
	
	  for (var j = 0; j < set[0].length; j++) {
	    if (typeof set[0][j] !== 'string')
	      return true
	  }
	
	  return false
	}
	
	glob.Glob = Glob
	inherits(Glob, EE)
	function Glob (pattern, options, cb) {
	  if (typeof options === 'function') {
	    cb = options
	    options = null
	  }
	
	  if (options && options.sync) {
	    if (cb)
	      throw new TypeError('callback provided to sync glob')
	    return new GlobSync(pattern, options)
	  }
	
	  if (!(this instanceof Glob))
	    return new Glob(pattern, options, cb)
	
	  setopts(this, pattern, options)
	  this._didRealPath = false
	
	  // process each pattern in the minimatch set
	  var n = this.minimatch.set.length
	
	  // The matches are stored as {<filename>: true,...} so that
	  // duplicates are automagically pruned.
	  // Later, we do an Object.keys() on these.
	  // Keep them as a list so we can fill in when nonull is set.
	  this.matches = new Array(n)
	
	  if (typeof cb === 'function') {
	    cb = once(cb)
	    this.on('error', cb)
	    this.on('end', function (matches) {
	      cb(null, matches)
	    })
	  }
	
	  var self = this
	  var n = this.minimatch.set.length
	  this._processing = 0
	  this.matches = new Array(n)
	
	  this._emitQueue = []
	  this._processQueue = []
	  this.paused = false
	
	  if (this.noprocess)
	    return this
	
	  if (n === 0)
	    return done()
	
	  var sync = true
	  for (var i = 0; i < n; i ++) {
	    this._process(this.minimatch.set[i], i, false, done)
	  }
	  sync = false
	
	  function done () {
	    --self._processing
	    if (self._processing <= 0) {
	      if (sync) {
	        process.nextTick(function () {
	          self._finish()
	        })
	      } else {
	        self._finish()
	      }
	    }
	  }
	}
	
	Glob.prototype._finish = function () {
	  assert(this instanceof Glob)
	  if (this.aborted)
	    return
	
	  if (this.realpath && !this._didRealpath)
	    return this._realpath()
	
	  common.finish(this)
	  this.emit('end', this.found)
	}
	
	Glob.prototype._realpath = function () {
	  if (this._didRealpath)
	    return
	
	  this._didRealpath = true
	
	  var n = this.matches.length
	  if (n === 0)
	    return this._finish()
	
	  var self = this
	  for (var i = 0; i < this.matches.length; i++)
	    this._realpathSet(i, next)
	
	  function next () {
	    if (--n === 0)
	      self._finish()
	  }
	}
	
	Glob.prototype._realpathSet = function (index, cb) {
	  var matchset = this.matches[index]
	  if (!matchset)
	    return cb()
	
	  var found = Object.keys(matchset)
	  var self = this
	  var n = found.length
	
	  if (n === 0)
	    return cb()
	
	  var set = this.matches[index] = Object.create(null)
	  found.forEach(function (p, i) {
	    // If there's a problem with the stat, then it means that
	    // one or more of the links in the realpath couldn't be
	    // resolved.  just return the abs value in that case.
	    p = self._makeAbs(p)
	    rp.realpath(p, self.realpathCache, function (er, real) {
	      if (!er)
	        set[real] = true
	      else if (er.syscall === 'stat')
	        set[p] = true
	      else
	        self.emit('error', er) // srsly wtf right here
	
	      if (--n === 0) {
	        self.matches[index] = set
	        cb()
	      }
	    })
	  })
	}
	
	Glob.prototype._mark = function (p) {
	  return common.mark(this, p)
	}
	
	Glob.prototype._makeAbs = function (f) {
	  return common.makeAbs(this, f)
	}
	
	Glob.prototype.abort = function () {
	  this.aborted = true
	  this.emit('abort')
	}
	
	Glob.prototype.pause = function () {
	  if (!this.paused) {
	    this.paused = true
	    this.emit('pause')
	  }
	}
	
	Glob.prototype.resume = function () {
	  if (this.paused) {
	    this.emit('resume')
	    this.paused = false
	    if (this._emitQueue.length) {
	      var eq = this._emitQueue.slice(0)
	      this._emitQueue.length = 0
	      for (var i = 0; i < eq.length; i ++) {
	        var e = eq[i]
	        this._emitMatch(e[0], e[1])
	      }
	    }
	    if (this._processQueue.length) {
	      var pq = this._processQueue.slice(0)
	      this._processQueue.length = 0
	      for (var i = 0; i < pq.length; i ++) {
	        var p = pq[i]
	        this._processing--
	        this._process(p[0], p[1], p[2], p[3])
	      }
	    }
	  }
	}
	
	Glob.prototype._process = function (pattern, index, inGlobStar, cb) {
	  assert(this instanceof Glob)
	  assert(typeof cb === 'function')
	
	  if (this.aborted)
	    return
	
	  this._processing++
	  if (this.paused) {
	    this._processQueue.push([pattern, index, inGlobStar, cb])
	    return
	  }
	
	  //console.error('PROCESS %d', this._processing, pattern)
	
	  // Get the first [n] parts of pattern that are all strings.
	  var n = 0
	  while (typeof pattern[n] === 'string') {
	    n ++
	  }
	  // now n is the index of the first one that is *not* a string.
	
	  // see if there's anything else
	  var prefix
	  switch (n) {
	    // if not, then this is rather simple
	    case pattern.length:
	      this._processSimple(pattern.join('/'), index, cb)
	      return
	
	    case 0:
	      // pattern *starts* with some non-trivial item.
	      // going to readdir(cwd), but not include the prefix in matches.
	      prefix = null
	      break
	
	    default:
	      // pattern has some string bits in the front.
	      // whatever it starts with, whether that's 'absolute' like /foo/bar,
	      // or 'relative' like '../baz'
	      prefix = pattern.slice(0, n).join('/')
	      break
	  }
	
	  var remain = pattern.slice(n)
	
	  // get the list of entries.
	  var read
	  if (prefix === null)
	    read = '.'
	  else if (isAbsolute(prefix) || isAbsolute(pattern.join('/'))) {
	    if (!prefix || !isAbsolute(prefix))
	      prefix = '/' + prefix
	    read = prefix
	  } else
	    read = prefix
	
	  var abs = this._makeAbs(read)
	
	  //if ignored, skip _processing
	  if (childrenIgnored(this, read))
	    return cb()
	
	  var isGlobStar = remain[0] === minimatch.GLOBSTAR
	  if (isGlobStar)
	    this._processGlobStar(prefix, read, abs, remain, index, inGlobStar, cb)
	  else
	    this._processReaddir(prefix, read, abs, remain, index, inGlobStar, cb)
	}
	
	Glob.prototype._processReaddir = function (prefix, read, abs, remain, index, inGlobStar, cb) {
	  var self = this
	  this._readdir(abs, inGlobStar, function (er, entries) {
	    return self._processReaddir2(prefix, read, abs, remain, index, inGlobStar, entries, cb)
	  })
	}
	
	Glob.prototype._processReaddir2 = function (prefix, read, abs, remain, index, inGlobStar, entries, cb) {
	
	  // if the abs isn't a dir, then nothing can match!
	  if (!entries)
	    return cb()
	
	  // It will only match dot entries if it starts with a dot, or if
	  // dot is set.  Stuff like @(.foo|.bar) isn't allowed.
	  var pn = remain[0]
	  var negate = !!this.minimatch.negate
	  var rawGlob = pn._glob
	  var dotOk = this.dot || rawGlob.charAt(0) === '.'
	
	  var matchedEntries = []
	  for (var i = 0; i < entries.length; i++) {
	    var e = entries[i]
	    if (e.charAt(0) !== '.' || dotOk) {
	      var m
	      if (negate && !prefix) {
	        m = !e.match(pn)
	      } else {
	        m = e.match(pn)
	      }
	      if (m)
	        matchedEntries.push(e)
	    }
	  }
	
	  //console.error('prd2', prefix, entries, remain[0]._glob, matchedEntries)
	
	  var len = matchedEntries.length
	  // If there are no matched entries, then nothing matches.
	  if (len === 0)
	    return cb()
	
	  // if this is the last remaining pattern bit, then no need for
	  // an additional stat *unless* the user has specified mark or
	  // stat explicitly.  We know they exist, since readdir returned
	  // them.
	
	  if (remain.length === 1 && !this.mark && !this.stat) {
	    if (!this.matches[index])
	      this.matches[index] = Object.create(null)
	
	    for (var i = 0; i < len; i ++) {
	      var e = matchedEntries[i]
	      if (prefix) {
	        if (prefix !== '/')
	          e = prefix + '/' + e
	        else
	          e = prefix + e
	      }
	
	      if (e.charAt(0) === '/' && !this.nomount) {
	        e = path.join(this.root, e)
	      }
	      this._emitMatch(index, e)
	    }
	    // This was the last one, and no stats were needed
	    return cb()
	  }
	
	  // now test all matched entries as stand-ins for that part
	  // of the pattern.
	  remain.shift()
	  for (var i = 0; i < len; i ++) {
	    var e = matchedEntries[i]
	    var newPattern
	    if (prefix) {
	      if (prefix !== '/')
	        e = prefix + '/' + e
	      else
	        e = prefix + e
	    }
	    this._process([e].concat(remain), index, inGlobStar, cb)
	  }
	  cb()
	}
	
	Glob.prototype._emitMatch = function (index, e) {
	  if (this.aborted)
	    return
	
	  if (isIgnored(this, e))
	    return
	
	  if (this.paused) {
	    this._emitQueue.push([index, e])
	    return
	  }
	
	  var abs = isAbsolute(e) ? e : this._makeAbs(e)
	
	  if (this.mark)
	    e = this._mark(e)
	
	  if (this.absolute)
	    e = abs
	
	  if (this.matches[index][e])
	    return
	
	  if (this.nodir) {
	    var c = this.cache[abs]
	    if (c === 'DIR' || Array.isArray(c))
	      return
	  }
	
	  this.matches[index][e] = true
	
	  var st = this.statCache[abs]
	  if (st)
	    this.emit('stat', e, st)
	
	  this.emit('match', e)
	}
	
	Glob.prototype._readdirInGlobStar = function (abs, cb) {
	  if (this.aborted)
	    return
	
	  // follow all symlinked directories forever
	  // just proceed as if this is a non-globstar situation
	  if (this.follow)
	    return this._readdir(abs, false, cb)
	
	  var lstatkey = 'lstat\0' + abs
	  var self = this
	  var lstatcb = inflight(lstatkey, lstatcb_)
	
	  if (lstatcb)
	    fs.lstat(abs, lstatcb)
	
	  function lstatcb_ (er, lstat) {
	    if (er && er.code === 'ENOENT')
	      return cb()
	
	    var isSym = lstat && lstat.isSymbolicLink()
	    self.symlinks[abs] = isSym
	
	    // If it's not a symlink or a dir, then it's definitely a regular file.
	    // don't bother doing a readdir in that case.
	    if (!isSym && lstat && !lstat.isDirectory()) {
	      self.cache[abs] = 'FILE'
	      cb()
	    } else
	      self._readdir(abs, false, cb)
	  }
	}
	
	Glob.prototype._readdir = function (abs, inGlobStar, cb) {
	  if (this.aborted)
	    return
	
	  cb = inflight('readdir\0'+abs+'\0'+inGlobStar, cb)
	  if (!cb)
	    return
	
	  //console.error('RD %j %j', +inGlobStar, abs)
	  if (inGlobStar && !ownProp(this.symlinks, abs))
	    return this._readdirInGlobStar(abs, cb)
	
	  if (ownProp(this.cache, abs)) {
	    var c = this.cache[abs]
	    if (!c || c === 'FILE')
	      return cb()
	
	    if (Array.isArray(c))
	      return cb(null, c)
	  }
	
	  var self = this
	  fs.readdir(abs, readdirCb(this, abs, cb))
	}
	
	function readdirCb (self, abs, cb) {
	  return function (er, entries) {
	    if (er)
	      self._readdirError(abs, er, cb)
	    else
	      self._readdirEntries(abs, entries, cb)
	  }
	}
	
	Glob.prototype._readdirEntries = function (abs, entries, cb) {
	  if (this.aborted)
	    return
	
	  // if we haven't asked to stat everything, then just
	  // assume that everything in there exists, so we can avoid
	  // having to stat it a second time.
	  if (!this.mark && !this.stat) {
	    for (var i = 0; i < entries.length; i ++) {
	      var e = entries[i]
	      if (abs === '/')
	        e = abs + e
	      else
	        e = abs + '/' + e
	      this.cache[e] = true
	    }
	  }
	
	  this.cache[abs] = entries
	  return cb(null, entries)
	}
	
	Glob.prototype._readdirError = function (f, er, cb) {
	  if (this.aborted)
	    return
	
	  // handle errors, and cache the information
	  switch (er.code) {
	    case 'ENOTSUP': // https://github.com/isaacs/node-glob/issues/205
	    case 'ENOTDIR': // totally normal. means it *does* exist.
	      var abs = this._makeAbs(f)
	      this.cache[abs] = 'FILE'
	      if (abs === this.cwdAbs) {
	        var error = new Error(er.code + ' invalid cwd ' + this.cwd)
	        error.path = this.cwd
	        error.code = er.code
	        this.emit('error', error)
	        this.abort()
	      }
	      break
	
	    case 'ENOENT': // not terribly unusual
	    case 'ELOOP':
	    case 'ENAMETOOLONG':
	    case 'UNKNOWN':
	      this.cache[this._makeAbs(f)] = false
	      break
	
	    default: // some unusual error.  Treat as failure.
	      this.cache[this._makeAbs(f)] = false
	      if (this.strict) {
	        this.emit('error', er)
	        // If the error is handled, then we abort
	        // if not, we threw out of here
	        this.abort()
	      }
	      if (!this.silent)
	        console.error('glob error', er)
	      break
	  }
	
	  return cb()
	}
	
	Glob.prototype._processGlobStar = function (prefix, read, abs, remain, index, inGlobStar, cb) {
	  var self = this
	  this._readdir(abs, inGlobStar, function (er, entries) {
	    self._processGlobStar2(prefix, read, abs, remain, index, inGlobStar, entries, cb)
	  })
	}
	
	
	Glob.prototype._processGlobStar2 = function (prefix, read, abs, remain, index, inGlobStar, entries, cb) {
	  //console.error('pgs2', prefix, remain[0], entries)
	
	  // no entries means not a dir, so it can never have matches
	  // foo.txt/** doesn't match foo.txt
	  if (!entries)
	    return cb()
	
	  // test without the globstar, and with every child both below
	  // and replacing the globstar.
	  var remainWithoutGlobStar = remain.slice(1)
	  var gspref = prefix ? [ prefix ] : []
	  var noGlobStar = gspref.concat(remainWithoutGlobStar)
	
	  // the noGlobStar pattern exits the inGlobStar state
	  this._process(noGlobStar, index, false, cb)
	
	  var isSym = this.symlinks[abs]
	  var len = entries.length
	
	  // If it's a symlink, and we're in a globstar, then stop
	  if (isSym && inGlobStar)
	    return cb()
	
	  for (var i = 0; i < len; i++) {
	    var e = entries[i]
	    if (e.charAt(0) === '.' && !this.dot)
	      continue
	
	    // these two cases enter the inGlobStar state
	    var instead = gspref.concat(entries[i], remainWithoutGlobStar)
	    this._process(instead, index, true, cb)
	
	    var below = gspref.concat(entries[i], remain)
	    this._process(below, index, true, cb)
	  }
	
	  cb()
	}
	
	Glob.prototype._processSimple = function (prefix, index, cb) {
	  // XXX review this.  Shouldn't it be doing the mounting etc
	  // before doing stat?  kinda weird?
	  var self = this
	  this._stat(prefix, function (er, exists) {
	    self._processSimple2(prefix, index, er, exists, cb)
	  })
	}
	Glob.prototype._processSimple2 = function (prefix, index, er, exists, cb) {
	
	  //console.error('ps2', prefix, exists)
	
	  if (!this.matches[index])
	    this.matches[index] = Object.create(null)
	
	  // If it doesn't exist, then just mark the lack of results
	  if (!exists)
	    return cb()
	
	  if (prefix && isAbsolute(prefix) && !this.nomount) {
	    var trail = /[\/\\]$/.test(prefix)
	    if (prefix.charAt(0) === '/') {
	      prefix = path.join(this.root, prefix)
	    } else {
	      prefix = path.resolve(this.root, prefix)
	      if (trail)
	        prefix += '/'
	    }
	  }
	
	  if (process.platform === 'win32')
	    prefix = prefix.replace(/\\/g, '/')
	
	  // Mark this as a match
	  this._emitMatch(index, prefix)
	  cb()
	}
	
	// Returns either 'DIR', 'FILE', or false
	Glob.prototype._stat = function (f, cb) {
	  var abs = this._makeAbs(f)
	  var needDir = f.slice(-1) === '/'
	
	  if (f.length > this.maxLength)
	    return cb()
	
	  if (!this.stat && ownProp(this.cache, abs)) {
	    var c = this.cache[abs]
	
	    if (Array.isArray(c))
	      c = 'DIR'
	
	    // It exists, but maybe not how we need it
	    if (!needDir || c === 'DIR')
	      return cb(null, c)
	
	    if (needDir && c === 'FILE')
	      return cb()
	
	    // otherwise we have to stat, because maybe c=true
	    // if we know it exists, but not what it is.
	  }
	
	  var exists
	  var stat = this.statCache[abs]
	  if (stat !== undefined) {
	    if (stat === false)
	      return cb(null, stat)
	    else {
	      var type = stat.isDirectory() ? 'DIR' : 'FILE'
	      if (needDir && type === 'FILE')
	        return cb()
	      else
	        return cb(null, type, stat)
	    }
	  }
	
	  var self = this
	  var statcb = inflight('stat\0' + abs, lstatcb_)
	  if (statcb)
	    fs.lstat(abs, statcb)
	
	  function lstatcb_ (er, lstat) {
	    if (lstat && lstat.isSymbolicLink()) {
	      // If it's a symlink, then treat it as the target, unless
	      // the target does not exist, then treat it as a file.
	      return fs.stat(abs, function (er, stat) {
	        if (er)
	          self._stat2(f, abs, null, lstat, cb)
	        else
	          self._stat2(f, abs, er, stat, cb)
	      })
	    } else {
	      self._stat2(f, abs, er, lstat, cb)
	    }
	  }
	}
	
	Glob.prototype._stat2 = function (f, abs, er, stat, cb) {
	  if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {
	    this.statCache[abs] = false
	    return cb()
	  }
	
	  var needDir = f.slice(-1) === '/'
	  this.statCache[abs] = stat
	
	  if (abs.slice(-1) === '/' && stat && !stat.isDirectory())
	    return cb(null, false, stat)
	
	  var c = true
	  if (stat)
	    c = stat.isDirectory() ? 'DIR' : 'FILE'
	  this.cache[abs] = this.cache[abs] || c
	
	  if (needDir && c === 'FILE')
	    return cb()
	
	  return cb(null, c, stat)
	}


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = realpath
	realpath.realpath = realpath
	realpath.sync = realpathSync
	realpath.realpathSync = realpathSync
	realpath.monkeypatch = monkeypatch
	realpath.unmonkeypatch = unmonkeypatch
	
	var fs = __webpack_require__(7)
	var origRealpath = fs.realpath
	var origRealpathSync = fs.realpathSync
	
	var version = process.version
	var ok = /^v[0-5]\./.test(version)
	var old = __webpack_require__(16)
	
	function newError (er) {
	  return er && er.syscall === 'realpath' && (
	    er.code === 'ELOOP' ||
	    er.code === 'ENOMEM' ||
	    er.code === 'ENAMETOOLONG'
	  )
	}
	
	function realpath (p, cache, cb) {
	  if (ok) {
	    return origRealpath(p, cache, cb)
	  }
	
	  if (typeof cache === 'function') {
	    cb = cache
	    cache = null
	  }
	  origRealpath(p, cache, function (er, result) {
	    if (newError(er)) {
	      old.realpath(p, cache, cb)
	    } else {
	      cb(er, result)
	    }
	  })
	}
	
	function realpathSync (p, cache) {
	  if (ok) {
	    return origRealpathSync(p, cache)
	  }
	
	  try {
	    return origRealpathSync(p, cache)
	  } catch (er) {
	    if (newError(er)) {
	      return old.realpathSync(p, cache)
	    } else {
	      throw er
	    }
	  }
	}
	
	function monkeypatch () {
	  fs.realpath = realpath
	  fs.realpathSync = realpathSync
	}
	
	function unmonkeypatch () {
	  fs.realpath = origRealpath
	  fs.realpathSync = origRealpathSync
	}


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	var pathModule = __webpack_require__(4);
	var isWindows = process.platform === 'win32';
	var fs = __webpack_require__(7);
	
	// JavaScript implementation of realpath, ported from node pre-v6
	
	var DEBUG = process.env.NODE_DEBUG && /fs/.test(process.env.NODE_DEBUG);
	
	function rethrow() {
	  // Only enable in debug mode. A backtrace uses ~1000 bytes of heap space and
	  // is fairly slow to generate.
	  var callback;
	  if (DEBUG) {
	    var backtrace = new Error;
	    callback = debugCallback;
	  } else
	    callback = missingCallback;
	
	  return callback;
	
	  function debugCallback(err) {
	    if (err) {
	      backtrace.message = err.message;
	      err = backtrace;
	      missingCallback(err);
	    }
	  }
	
	  function missingCallback(err) {
	    if (err) {
	      if (process.throwDeprecation)
	        throw err;  // Forgot a callback but don't know where? Use NODE_DEBUG=fs
	      else if (!process.noDeprecation) {
	        var msg = 'fs: missing callback ' + (err.stack || err.message);
	        if (process.traceDeprecation)
	          console.trace(msg);
	        else
	          console.error(msg);
	      }
	    }
	  }
	}
	
	function maybeCallback(cb) {
	  return typeof cb === 'function' ? cb : rethrow();
	}
	
	var normalize = pathModule.normalize;
	
	// Regexp that finds the next partion of a (partial) path
	// result is [base_with_slash, base], e.g. ['somedir/', 'somedir']
	if (isWindows) {
	  var nextPartRe = /(.*?)(?:[\/\\]+|$)/g;
	} else {
	  var nextPartRe = /(.*?)(?:[\/]+|$)/g;
	}
	
	// Regex to find the device root, including trailing slash. E.g. 'c:\\'.
	if (isWindows) {
	  var splitRootRe = /^(?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?[\\\/]*/;
	} else {
	  var splitRootRe = /^[\/]*/;
	}
	
	exports.realpathSync = function realpathSync(p, cache) {
	  // make p is absolute
	  p = pathModule.resolve(p);
	
	  if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
	    return cache[p];
	  }
	
	  var original = p,
	      seenLinks = {},
	      knownHard = {};
	
	  // current character position in p
	  var pos;
	  // the partial path so far, including a trailing slash if any
	  var current;
	  // the partial path without a trailing slash (except when pointing at a root)
	  var base;
	  // the partial path scanned in the previous round, with slash
	  var previous;
	
	  start();
	
	  function start() {
	    // Skip over roots
	    var m = splitRootRe.exec(p);
	    pos = m[0].length;
	    current = m[0];
	    base = m[0];
	    previous = '';
	
	    // On windows, check that the root exists. On unix there is no need.
	    if (isWindows && !knownHard[base]) {
	      fs.lstatSync(base);
	      knownHard[base] = true;
	    }
	  }
	
	  // walk down the path, swapping out linked pathparts for their real
	  // values
	  // NB: p.length changes.
	  while (pos < p.length) {
	    // find the next part
	    nextPartRe.lastIndex = pos;
	    var result = nextPartRe.exec(p);
	    previous = current;
	    current += result[0];
	    base = previous + result[1];
	    pos = nextPartRe.lastIndex;
	
	    // continue if not a symlink
	    if (knownHard[base] || (cache && cache[base] === base)) {
	      continue;
	    }
	
	    var resolvedLink;
	    if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
	      // some known symbolic link.  no need to stat again.
	      resolvedLink = cache[base];
	    } else {
	      var stat = fs.lstatSync(base);
	      if (!stat.isSymbolicLink()) {
	        knownHard[base] = true;
	        if (cache) cache[base] = base;
	        continue;
	      }
	
	      // read the link if it wasn't read before
	      // dev/ino always return 0 on windows, so skip the check.
	      var linkTarget = null;
	      if (!isWindows) {
	        var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);
	        if (seenLinks.hasOwnProperty(id)) {
	          linkTarget = seenLinks[id];
	        }
	      }
	      if (linkTarget === null) {
	        fs.statSync(base);
	        linkTarget = fs.readlinkSync(base);
	      }
	      resolvedLink = pathModule.resolve(previous, linkTarget);
	      // track this, if given a cache.
	      if (cache) cache[base] = resolvedLink;
	      if (!isWindows) seenLinks[id] = linkTarget;
	    }
	
	    // resolve the link, then start over
	    p = pathModule.resolve(resolvedLink, p.slice(pos));
	    start();
	  }
	
	  if (cache) cache[original] = p;
	
	  return p;
	};
	
	
	exports.realpath = function realpath(p, cache, cb) {
	  if (typeof cb !== 'function') {
	    cb = maybeCallback(cache);
	    cache = null;
	  }
	
	  // make p is absolute
	  p = pathModule.resolve(p);
	
	  if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
	    return process.nextTick(cb.bind(null, null, cache[p]));
	  }
	
	  var original = p,
	      seenLinks = {},
	      knownHard = {};
	
	  // current character position in p
	  var pos;
	  // the partial path so far, including a trailing slash if any
	  var current;
	  // the partial path without a trailing slash (except when pointing at a root)
	  var base;
	  // the partial path scanned in the previous round, with slash
	  var previous;
	
	  start();
	
	  function start() {
	    // Skip over roots
	    var m = splitRootRe.exec(p);
	    pos = m[0].length;
	    current = m[0];
	    base = m[0];
	    previous = '';
	
	    // On windows, check that the root exists. On unix there is no need.
	    if (isWindows && !knownHard[base]) {
	      fs.lstat(base, function(err) {
	        if (err) return cb(err);
	        knownHard[base] = true;
	        LOOP();
	      });
	    } else {
	      process.nextTick(LOOP);
	    }
	  }
	
	  // walk down the path, swapping out linked pathparts for their real
	  // values
	  function LOOP() {
	    // stop if scanned past end of path
	    if (pos >= p.length) {
	      if (cache) cache[original] = p;
	      return cb(null, p);
	    }
	
	    // find the next part
	    nextPartRe.lastIndex = pos;
	    var result = nextPartRe.exec(p);
	    previous = current;
	    current += result[0];
	    base = previous + result[1];
	    pos = nextPartRe.lastIndex;
	
	    // continue if not a symlink
	    if (knownHard[base] || (cache && cache[base] === base)) {
	      return process.nextTick(LOOP);
	    }
	
	    if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
	      // known symbolic link.  no need to stat again.
	      return gotResolvedLink(cache[base]);
	    }
	
	    return fs.lstat(base, gotStat);
	  }
	
	  function gotStat(err, stat) {
	    if (err) return cb(err);
	
	    // if not a symlink, skip to the next path part
	    if (!stat.isSymbolicLink()) {
	      knownHard[base] = true;
	      if (cache) cache[base] = base;
	      return process.nextTick(LOOP);
	    }
	
	    // stat & read the link if not read before
	    // call gotTarget as soon as the link target is known
	    // dev/ino always return 0 on windows, so skip the check.
	    if (!isWindows) {
	      var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);
	      if (seenLinks.hasOwnProperty(id)) {
	        return gotTarget(null, seenLinks[id], base);
	      }
	    }
	    fs.stat(base, function(err) {
	      if (err) return cb(err);
	
	      fs.readlink(base, function(err, target) {
	        if (!isWindows) seenLinks[id] = target;
	        gotTarget(err, target);
	      });
	    });
	  }
	
	  function gotTarget(err, target, base) {
	    if (err) return cb(err);
	
	    var resolvedLink = pathModule.resolve(previous, target);
	    if (cache) cache[base] = resolvedLink;
	    gotResolvedLink(resolvedLink);
	  }
	
	  function gotResolvedLink(resolvedLink) {
	    // resolve the link, then start over
	    p = pathModule.resolve(resolvedLink, p.slice(pos));
	    start();
	  }
	};


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = minimatch
	minimatch.Minimatch = Minimatch
	
	var path = { sep: '/' }
	try {
	  path = __webpack_require__(4)
	} catch (er) {}
	
	var GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {}
	var expand = __webpack_require__(18)
	
	var plTypes = {
	  '!': { open: '(?:(?!(?:', close: '))[^/]*?)'},
	  '?': { open: '(?:', close: ')?' },
	  '+': { open: '(?:', close: ')+' },
	  '*': { open: '(?:', close: ')*' },
	  '@': { open: '(?:', close: ')' }
	}
	
	// any single thing other than /
	// don't need to escape / when using new RegExp()
	var qmark = '[^/]'
	
	// * => any number of characters
	var star = qmark + '*?'
	
	// ** when dots are allowed.  Anything goes, except .. and .
	// not (^ or / followed by one or two dots followed by $ or /),
	// followed by anything, any number of times.
	var twoStarDot = '(?:(?!(?:\\\/|^)(?:\\.{1,2})($|\\\/)).)*?'
	
	// not a ^ or / followed by a dot,
	// followed by anything, any number of times.
	var twoStarNoDot = '(?:(?!(?:\\\/|^)\\.).)*?'
	
	// characters that need to be escaped in RegExp.
	var reSpecials = charSet('().*{}+?[]^$\\!')
	
	// "abc" -> { a:true, b:true, c:true }
	function charSet (s) {
	  return s.split('').reduce(function (set, c) {
	    set[c] = true
	    return set
	  }, {})
	}
	
	// normalizes slashes.
	var slashSplit = /\/+/
	
	minimatch.filter = filter
	function filter (pattern, options) {
	  options = options || {}
	  return function (p, i, list) {
	    return minimatch(p, pattern, options)
	  }
	}
	
	function ext (a, b) {
	  a = a || {}
	  b = b || {}
	  var t = {}
	  Object.keys(b).forEach(function (k) {
	    t[k] = b[k]
	  })
	  Object.keys(a).forEach(function (k) {
	    t[k] = a[k]
	  })
	  return t
	}
	
	minimatch.defaults = function (def) {
	  if (!def || !Object.keys(def).length) return minimatch
	
	  var orig = minimatch
	
	  var m = function minimatch (p, pattern, options) {
	    return orig.minimatch(p, pattern, ext(def, options))
	  }
	
	  m.Minimatch = function Minimatch (pattern, options) {
	    return new orig.Minimatch(pattern, ext(def, options))
	  }
	
	  return m
	}
	
	Minimatch.defaults = function (def) {
	  if (!def || !Object.keys(def).length) return Minimatch
	  return minimatch.defaults(def).Minimatch
	}
	
	function minimatch (p, pattern, options) {
	  if (typeof pattern !== 'string') {
	    throw new TypeError('glob pattern string required')
	  }
	
	  if (!options) options = {}
	
	  // shortcut: comments match nothing.
	  if (!options.nocomment && pattern.charAt(0) === '#') {
	    return false
	  }
	
	  // "" only matches ""
	  if (pattern.trim() === '') return p === ''
	
	  return new Minimatch(pattern, options).match(p)
	}
	
	function Minimatch (pattern, options) {
	  if (!(this instanceof Minimatch)) {
	    return new Minimatch(pattern, options)
	  }
	
	  if (typeof pattern !== 'string') {
	    throw new TypeError('glob pattern string required')
	  }
	
	  if (!options) options = {}
	  pattern = pattern.trim()
	
	  // windows support: need to use /, not \
	  if (path.sep !== '/') {
	    pattern = pattern.split(path.sep).join('/')
	  }
	
	  this.options = options
	  this.set = []
	  this.pattern = pattern
	  this.regexp = null
	  this.negate = false
	  this.comment = false
	  this.empty = false
	
	  // make the set of regexps etc.
	  this.make()
	}
	
	Minimatch.prototype.debug = function () {}
	
	Minimatch.prototype.make = make
	function make () {
	  // don't do it more than once.
	  if (this._made) return
	
	  var pattern = this.pattern
	  var options = this.options
	
	  // empty patterns and comments match nothing.
	  if (!options.nocomment && pattern.charAt(0) === '#') {
	    this.comment = true
	    return
	  }
	  if (!pattern) {
	    this.empty = true
	    return
	  }
	
	  // step 1: figure out negation, etc.
	  this.parseNegate()
	
	  // step 2: expand braces
	  var set = this.globSet = this.braceExpand()
	
	  if (options.debug) this.debug = console.error
	
	  this.debug(this.pattern, set)
	
	  // step 3: now we have a set, so turn each one into a series of path-portion
	  // matching patterns.
	  // These will be regexps, except in the case of "**", which is
	  // set to the GLOBSTAR object for globstar behavior,
	  // and will not contain any / characters
	  set = this.globParts = set.map(function (s) {
	    return s.split(slashSplit)
	  })
	
	  this.debug(this.pattern, set)
	
	  // glob --> regexps
	  set = set.map(function (s, si, set) {
	    return s.map(this.parse, this)
	  }, this)
	
	  this.debug(this.pattern, set)
	
	  // filter out everything that didn't compile properly.
	  set = set.filter(function (s) {
	    return s.indexOf(false) === -1
	  })
	
	  this.debug(this.pattern, set)
	
	  this.set = set
	}
	
	Minimatch.prototype.parseNegate = parseNegate
	function parseNegate () {
	  var pattern = this.pattern
	  var negate = false
	  var options = this.options
	  var negateOffset = 0
	
	  if (options.nonegate) return
	
	  for (var i = 0, l = pattern.length
	    ; i < l && pattern.charAt(i) === '!'
	    ; i++) {
	    negate = !negate
	    negateOffset++
	  }
	
	  if (negateOffset) this.pattern = pattern.substr(negateOffset)
	  this.negate = negate
	}
	
	// Brace expansion:
	// a{b,c}d -> abd acd
	// a{b,}c -> abc ac
	// a{0..3}d -> a0d a1d a2d a3d
	// a{b,c{d,e}f}g -> abg acdfg acefg
	// a{b,c}d{e,f}g -> abdeg acdeg abdeg abdfg
	//
	// Invalid sets are not expanded.
	// a{2..}b -> a{2..}b
	// a{b}c -> a{b}c
	minimatch.braceExpand = function (pattern, options) {
	  return braceExpand(pattern, options)
	}
	
	Minimatch.prototype.braceExpand = braceExpand
	
	function braceExpand (pattern, options) {
	  if (!options) {
	    if (this instanceof Minimatch) {
	      options = this.options
	    } else {
	      options = {}
	    }
	  }
	
	  pattern = typeof pattern === 'undefined'
	    ? this.pattern : pattern
	
	  if (typeof pattern === 'undefined') {
	    throw new TypeError('undefined pattern')
	  }
	
	  if (options.nobrace ||
	    !pattern.match(/\{.*\}/)) {
	    // shortcut. no need to expand.
	    return [pattern]
	  }
	
	  return expand(pattern)
	}
	
	// parse a component of the expanded set.
	// At this point, no pattern may contain "/" in it
	// so we're going to return a 2d array, where each entry is the full
	// pattern, split on '/', and then turned into a regular expression.
	// A regexp is made at the end which joins each array with an
	// escaped /, and another full one which joins each regexp with |.
	//
	// Following the lead of Bash 4.1, note that "**" only has special meaning
	// when it is the *only* thing in a path portion.  Otherwise, any series
	// of * is equivalent to a single *.  Globstar behavior is enabled by
	// default, and can be disabled by setting options.noglobstar.
	Minimatch.prototype.parse = parse
	var SUBPARSE = {}
	function parse (pattern, isSub) {
	  if (pattern.length > 1024 * 64) {
	    throw new TypeError('pattern is too long')
	  }
	
	  var options = this.options
	
	  // shortcuts
	  if (!options.noglobstar && pattern === '**') return GLOBSTAR
	  if (pattern === '') return ''
	
	  var re = ''
	  var hasMagic = !!options.nocase
	  var escaping = false
	  // ? => one single character
	  var patternListStack = []
	  var negativeLists = []
	  var stateChar
	  var inClass = false
	  var reClassStart = -1
	  var classStart = -1
	  // . and .. never match anything that doesn't start with .,
	  // even when options.dot is set.
	  var patternStart = pattern.charAt(0) === '.' ? '' // anything
	  // not (start or / followed by . or .. followed by / or end)
	  : options.dot ? '(?!(?:^|\\\/)\\.{1,2}(?:$|\\\/))'
	  : '(?!\\.)'
	  var self = this
	
	  function clearStateChar () {
	    if (stateChar) {
	      // we had some state-tracking character
	      // that wasn't consumed by this pass.
	      switch (stateChar) {
	        case '*':
	          re += star
	          hasMagic = true
	        break
	        case '?':
	          re += qmark
	          hasMagic = true
	        break
	        default:
	          re += '\\' + stateChar
	        break
	      }
	      self.debug('clearStateChar %j %j', stateChar, re)
	      stateChar = false
	    }
	  }
	
	  for (var i = 0, len = pattern.length, c
	    ; (i < len) && (c = pattern.charAt(i))
	    ; i++) {
	    this.debug('%s\t%s %s %j', pattern, i, re, c)
	
	    // skip over any that are escaped.
	    if (escaping && reSpecials[c]) {
	      re += '\\' + c
	      escaping = false
	      continue
	    }
	
	    switch (c) {
	      case '/':
	        // completely not allowed, even escaped.
	        // Should already be path-split by now.
	        return false
	
	      case '\\':
	        clearStateChar()
	        escaping = true
	      continue
	
	      // the various stateChar values
	      // for the "extglob" stuff.
	      case '?':
	      case '*':
	      case '+':
	      case '@':
	      case '!':
	        this.debug('%s\t%s %s %j <-- stateChar', pattern, i, re, c)
	
	        // all of those are literals inside a class, except that
	        // the glob [!a] means [^a] in regexp
	        if (inClass) {
	          this.debug('  in class')
	          if (c === '!' && i === classStart + 1) c = '^'
	          re += c
	          continue
	        }
	
	        // if we already have a stateChar, then it means
	        // that there was something like ** or +? in there.
	        // Handle the stateChar, then proceed with this one.
	        self.debug('call clearStateChar %j', stateChar)
	        clearStateChar()
	        stateChar = c
	        // if extglob is disabled, then +(asdf|foo) isn't a thing.
	        // just clear the statechar *now*, rather than even diving into
	        // the patternList stuff.
	        if (options.noext) clearStateChar()
	      continue
	
	      case '(':
	        if (inClass) {
	          re += '('
	          continue
	        }
	
	        if (!stateChar) {
	          re += '\\('
	          continue
	        }
	
	        patternListStack.push({
	          type: stateChar,
	          start: i - 1,
	          reStart: re.length,
	          open: plTypes[stateChar].open,
	          close: plTypes[stateChar].close
	        })
	        // negation is (?:(?!js)[^/]*)
	        re += stateChar === '!' ? '(?:(?!(?:' : '(?:'
	        this.debug('plType %j %j', stateChar, re)
	        stateChar = false
	      continue
	
	      case ')':
	        if (inClass || !patternListStack.length) {
	          re += '\\)'
	          continue
	        }
	
	        clearStateChar()
	        hasMagic = true
	        var pl = patternListStack.pop()
	        // negation is (?:(?!js)[^/]*)
	        // The others are (?:<pattern>)<type>
	        re += pl.close
	        if (pl.type === '!') {
	          negativeLists.push(pl)
	        }
	        pl.reEnd = re.length
	      continue
	
	      case '|':
	        if (inClass || !patternListStack.length || escaping) {
	          re += '\\|'
	          escaping = false
	          continue
	        }
	
	        clearStateChar()
	        re += '|'
	      continue
	
	      // these are mostly the same in regexp and glob
	      case '[':
	        // swallow any state-tracking char before the [
	        clearStateChar()
	
	        if (inClass) {
	          re += '\\' + c
	          continue
	        }
	
	        inClass = true
	        classStart = i
	        reClassStart = re.length
	        re += c
	      continue
	
	      case ']':
	        //  a right bracket shall lose its special
	        //  meaning and represent itself in
	        //  a bracket expression if it occurs
	        //  first in the list.  -- POSIX.2 2.8.3.2
	        if (i === classStart + 1 || !inClass) {
	          re += '\\' + c
	          escaping = false
	          continue
	        }
	
	        // handle the case where we left a class open.
	        // "[z-a]" is valid, equivalent to "\[z-a\]"
	        if (inClass) {
	          // split where the last [ was, make sure we don't have
	          // an invalid re. if so, re-walk the contents of the
	          // would-be class to re-translate any characters that
	          // were passed through as-is
	          // TODO: It would probably be faster to determine this
	          // without a try/catch and a new RegExp, but it's tricky
	          // to do safely.  For now, this is safe and works.
	          var cs = pattern.substring(classStart + 1, i)
	          try {
	            RegExp('[' + cs + ']')
	          } catch (er) {
	            // not a valid class!
	            var sp = this.parse(cs, SUBPARSE)
	            re = re.substr(0, reClassStart) + '\\[' + sp[0] + '\\]'
	            hasMagic = hasMagic || sp[1]
	            inClass = false
	            continue
	          }
	        }
	
	        // finish up the class.
	        hasMagic = true
	        inClass = false
	        re += c
	      continue
	
	      default:
	        // swallow any state char that wasn't consumed
	        clearStateChar()
	
	        if (escaping) {
	          // no need
	          escaping = false
	        } else if (reSpecials[c]
	          && !(c === '^' && inClass)) {
	          re += '\\'
	        }
	
	        re += c
	
	    } // switch
	  } // for
	
	  // handle the case where we left a class open.
	  // "[abc" is valid, equivalent to "\[abc"
	  if (inClass) {
	    // split where the last [ was, and escape it
	    // this is a huge pita.  We now have to re-walk
	    // the contents of the would-be class to re-translate
	    // any characters that were passed through as-is
	    cs = pattern.substr(classStart + 1)
	    sp = this.parse(cs, SUBPARSE)
	    re = re.substr(0, reClassStart) + '\\[' + sp[0]
	    hasMagic = hasMagic || sp[1]
	  }
	
	  // handle the case where we had a +( thing at the *end*
	  // of the pattern.
	  // each pattern list stack adds 3 chars, and we need to go through
	  // and escape any | chars that were passed through as-is for the regexp.
	  // Go through and escape them, taking care not to double-escape any
	  // | chars that were already escaped.
	  for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
	    var tail = re.slice(pl.reStart + pl.open.length)
	    this.debug('setting tail', re, pl)
	    // maybe some even number of \, then maybe 1 \, followed by a |
	    tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, function (_, $1, $2) {
	      if (!$2) {
	        // the | isn't already escaped, so escape it.
	        $2 = '\\'
	      }
	
	      // need to escape all those slashes *again*, without escaping the
	      // one that we need for escaping the | character.  As it works out,
	      // escaping an even number of slashes can be done by simply repeating
	      // it exactly after itself.  That's why this trick works.
	      //
	      // I am sorry that you have to see this.
	      return $1 + $1 + $2 + '|'
	    })
	
	    this.debug('tail=%j\n   %s', tail, tail, pl, re)
	    var t = pl.type === '*' ? star
	      : pl.type === '?' ? qmark
	      : '\\' + pl.type
	
	    hasMagic = true
	    re = re.slice(0, pl.reStart) + t + '\\(' + tail
	  }
	
	  // handle trailing things that only matter at the very end.
	  clearStateChar()
	  if (escaping) {
	    // trailing \\
	    re += '\\\\'
	  }
	
	  // only need to apply the nodot start if the re starts with
	  // something that could conceivably capture a dot
	  var addPatternStart = false
	  switch (re.charAt(0)) {
	    case '.':
	    case '[':
	    case '(': addPatternStart = true
	  }
	
	  // Hack to work around lack of negative lookbehind in JS
	  // A pattern like: *.!(x).!(y|z) needs to ensure that a name
	  // like 'a.xyz.yz' doesn't match.  So, the first negative
	  // lookahead, has to look ALL the way ahead, to the end of
	  // the pattern.
	  for (var n = negativeLists.length - 1; n > -1; n--) {
	    var nl = negativeLists[n]
	
	    var nlBefore = re.slice(0, nl.reStart)
	    var nlFirst = re.slice(nl.reStart, nl.reEnd - 8)
	    var nlLast = re.slice(nl.reEnd - 8, nl.reEnd)
	    var nlAfter = re.slice(nl.reEnd)
	
	    nlLast += nlAfter
	
	    // Handle nested stuff like *(*.js|!(*.json)), where open parens
	    // mean that we should *not* include the ) in the bit that is considered
	    // "after" the negated section.
	    var openParensBefore = nlBefore.split('(').length - 1
	    var cleanAfter = nlAfter
	    for (i = 0; i < openParensBefore; i++) {
	      cleanAfter = cleanAfter.replace(/\)[+*?]?/, '')
	    }
	    nlAfter = cleanAfter
	
	    var dollar = ''
	    if (nlAfter === '' && isSub !== SUBPARSE) {
	      dollar = '$'
	    }
	    var newRe = nlBefore + nlFirst + nlAfter + dollar + nlLast
	    re = newRe
	  }
	
	  // if the re is not "" at this point, then we need to make sure
	  // it doesn't match against an empty path part.
	  // Otherwise a/* will match a/, which it should not.
	  if (re !== '' && hasMagic) {
	    re = '(?=.)' + re
	  }
	
	  if (addPatternStart) {
	    re = patternStart + re
	  }
	
	  // parsing just a piece of a larger pattern.
	  if (isSub === SUBPARSE) {
	    return [re, hasMagic]
	  }
	
	  // skip the regexp for non-magical patterns
	  // unescape anything in it, though, so that it'll be
	  // an exact match against a file etc.
	  if (!hasMagic) {
	    return globUnescape(pattern)
	  }
	
	  var flags = options.nocase ? 'i' : ''
	  try {
	    var regExp = new RegExp('^' + re + '$', flags)
	  } catch (er) {
	    // If it was an invalid regular expression, then it can't match
	    // anything.  This trick looks for a character after the end of
	    // the string, which is of course impossible, except in multi-line
	    // mode, but it's not a /m regex.
	    return new RegExp('$.')
	  }
	
	  regExp._glob = pattern
	  regExp._src = re
	
	  return regExp
	}
	
	minimatch.makeRe = function (pattern, options) {
	  return new Minimatch(pattern, options || {}).makeRe()
	}
	
	Minimatch.prototype.makeRe = makeRe
	function makeRe () {
	  if (this.regexp || this.regexp === false) return this.regexp
	
	  // at this point, this.set is a 2d array of partial
	  // pattern strings, or "**".
	  //
	  // It's better to use .match().  This function shouldn't
	  // be used, really, but it's pretty convenient sometimes,
	  // when you just want to work with a regex.
	  var set = this.set
	
	  if (!set.length) {
	    this.regexp = false
	    return this.regexp
	  }
	  var options = this.options
	
	  var twoStar = options.noglobstar ? star
	    : options.dot ? twoStarDot
	    : twoStarNoDot
	  var flags = options.nocase ? 'i' : ''
	
	  var re = set.map(function (pattern) {
	    return pattern.map(function (p) {
	      return (p === GLOBSTAR) ? twoStar
	      : (typeof p === 'string') ? regExpEscape(p)
	      : p._src
	    }).join('\\\/')
	  }).join('|')
	
	  // must match entire pattern
	  // ending in a * or ** will make it less strict.
	  re = '^(?:' + re + ')$'
	
	  // can match anything, as long as it's not this.
	  if (this.negate) re = '^(?!' + re + ').*$'
	
	  try {
	    this.regexp = new RegExp(re, flags)
	  } catch (ex) {
	    this.regexp = false
	  }
	  return this.regexp
	}
	
	minimatch.match = function (list, pattern, options) {
	  options = options || {}
	  var mm = new Minimatch(pattern, options)
	  list = list.filter(function (f) {
	    return mm.match(f)
	  })
	  if (mm.options.nonull && !list.length) {
	    list.push(pattern)
	  }
	  return list
	}
	
	Minimatch.prototype.match = match
	function match (f, partial) {
	  this.debug('match', f, this.pattern)
	  // short-circuit in the case of busted things.
	  // comments, etc.
	  if (this.comment) return false
	  if (this.empty) return f === ''
	
	  if (f === '/' && partial) return true
	
	  var options = this.options
	
	  // windows: need to use /, not \
	  if (path.sep !== '/') {
	    f = f.split(path.sep).join('/')
	  }
	
	  // treat the test path as a set of pathparts.
	  f = f.split(slashSplit)
	  this.debug(this.pattern, 'split', f)
	
	  // just ONE of the pattern sets in this.set needs to match
	  // in order for it to be valid.  If negating, then just one
	  // match means that we have failed.
	  // Either way, return on the first hit.
	
	  var set = this.set
	  this.debug(this.pattern, 'set', set)
	
	  // Find the basename of the path by looking for the last non-empty segment
	  var filename
	  var i
	  for (i = f.length - 1; i >= 0; i--) {
	    filename = f[i]
	    if (filename) break
	  }
	
	  for (i = 0; i < set.length; i++) {
	    var pattern = set[i]
	    var file = f
	    if (options.matchBase && pattern.length === 1) {
	      file = [filename]
	    }
	    var hit = this.matchOne(file, pattern, partial)
	    if (hit) {
	      if (options.flipNegate) return true
	      return !this.negate
	    }
	  }
	
	  // didn't get any hits.  this is success if it's a negative
	  // pattern, failure otherwise.
	  if (options.flipNegate) return false
	  return this.negate
	}
	
	// set partial to true to test if, for example,
	// "/a/b" matches the start of "/*/b/*/d"
	// Partial means, if you run out of file before you run
	// out of pattern, then that's fine, as long as all
	// the parts match.
	Minimatch.prototype.matchOne = function (file, pattern, partial) {
	  var options = this.options
	
	  this.debug('matchOne',
	    { 'this': this, file: file, pattern: pattern })
	
	  this.debug('matchOne', file.length, pattern.length)
	
	  for (var fi = 0,
	      pi = 0,
	      fl = file.length,
	      pl = pattern.length
	      ; (fi < fl) && (pi < pl)
	      ; fi++, pi++) {
	    this.debug('matchOne loop')
	    var p = pattern[pi]
	    var f = file[fi]
	
	    this.debug(pattern, p, f)
	
	    // should be impossible.
	    // some invalid regexp stuff in the set.
	    if (p === false) return false
	
	    if (p === GLOBSTAR) {
	      this.debug('GLOBSTAR', [pattern, p, f])
	
	      // "**"
	      // a/**/b/**/c would match the following:
	      // a/b/x/y/z/c
	      // a/x/y/z/b/c
	      // a/b/x/b/x/c
	      // a/b/c
	      // To do this, take the rest of the pattern after
	      // the **, and see if it would match the file remainder.
	      // If so, return success.
	      // If not, the ** "swallows" a segment, and try again.
	      // This is recursively awful.
	      //
	      // a/**/b/**/c matching a/b/x/y/z/c
	      // - a matches a
	      // - doublestar
	      //   - matchOne(b/x/y/z/c, b/**/c)
	      //     - b matches b
	      //     - doublestar
	      //       - matchOne(x/y/z/c, c) -> no
	      //       - matchOne(y/z/c, c) -> no
	      //       - matchOne(z/c, c) -> no
	      //       - matchOne(c, c) yes, hit
	      var fr = fi
	      var pr = pi + 1
	      if (pr === pl) {
	        this.debug('** at the end')
	        // a ** at the end will just swallow the rest.
	        // We have found a match.
	        // however, it will not swallow /.x, unless
	        // options.dot is set.
	        // . and .. are *never* matched by **, for explosively
	        // exponential reasons.
	        for (; fi < fl; fi++) {
	          if (file[fi] === '.' || file[fi] === '..' ||
	            (!options.dot && file[fi].charAt(0) === '.')) return false
	        }
	        return true
	      }
	
	      // ok, let's see if we can swallow whatever we can.
	      while (fr < fl) {
	        var swallowee = file[fr]
	
	        this.debug('\nglobstar while', file, fr, pattern, pr, swallowee)
	
	        // XXX remove this slice.  Just pass the start index.
	        if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
	          this.debug('globstar found match!', fr, fl, swallowee)
	          // found a match.
	          return true
	        } else {
	          // can't swallow "." or ".." ever.
	          // can only swallow ".foo" when explicitly asked.
	          if (swallowee === '.' || swallowee === '..' ||
	            (!options.dot && swallowee.charAt(0) === '.')) {
	            this.debug('dot detected!', file, fr, pattern, pr)
	            break
	          }
	
	          // ** swallows a segment, and continue.
	          this.debug('globstar swallow a segment, and continue')
	          fr++
	        }
	      }
	
	      // no match was found.
	      // However, in partial mode, we can't say this is necessarily over.
	      // If there's more *pattern* left, then
	      if (partial) {
	        // ran out of file
	        this.debug('\n>>> no match, partial?', file, fr, pattern, pr)
	        if (fr === fl) return true
	      }
	      return false
	    }
	
	    // something other than **
	    // non-magic patterns just have to match exactly
	    // patterns with magic have been turned into regexps.
	    var hit
	    if (typeof p === 'string') {
	      if (options.nocase) {
	        hit = f.toLowerCase() === p.toLowerCase()
	      } else {
	        hit = f === p
	      }
	      this.debug('string match', p, f, hit)
	    } else {
	      hit = f.match(p)
	      this.debug('pattern match', p, f, hit)
	    }
	
	    if (!hit) return false
	  }
	
	  // Note: ending in / means that we'll get a final ""
	  // at the end of the pattern.  This can only match a
	  // corresponding "" at the end of the file.
	  // If the file ends in /, then it can only match a
	  // a pattern that ends in /, unless the pattern just
	  // doesn't have any more for it. But, a/b/ should *not*
	  // match "a/b/*", even though "" matches against the
	  // [^/]*? pattern, except in partial mode, where it might
	  // simply not be reached yet.
	  // However, a/b/ should still satisfy a/*
	
	  // now either we fell off the end of the pattern, or we're done.
	  if (fi === fl && pi === pl) {
	    // ran out of pattern and filename at the same time.
	    // an exact hit!
	    return true
	  } else if (fi === fl) {
	    // ran out of file, but still had pattern left.
	    // this is ok if we're doing the match as part of
	    // a glob fs traversal.
	    return partial
	  } else if (pi === pl) {
	    // ran out of pattern, still have file left.
	    // this is only acceptable if we're on the very last
	    // empty segment of a file with a trailing slash.
	    // a/* should match a/b/
	    var emptyFileEnd = (fi === fl - 1) && (file[fi] === '')
	    return emptyFileEnd
	  }
	
	  // should be unreachable.
	  throw new Error('wtf?')
	}
	
	// replace stuff like \* with *
	function globUnescape (s) {
	  return s.replace(/\\(.)/g, '$1')
	}
	
	function regExpEscape (s) {
	  return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
	}


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var concatMap = __webpack_require__(19);
	var balanced = __webpack_require__(20);
	
	module.exports = expandTop;
	
	var escSlash = '\0SLASH'+Math.random()+'\0';
	var escOpen = '\0OPEN'+Math.random()+'\0';
	var escClose = '\0CLOSE'+Math.random()+'\0';
	var escComma = '\0COMMA'+Math.random()+'\0';
	var escPeriod = '\0PERIOD'+Math.random()+'\0';
	
	function numeric(str) {
	  return parseInt(str, 10) == str
	    ? parseInt(str, 10)
	    : str.charCodeAt(0);
	}
	
	function escapeBraces(str) {
	  return str.split('\\\\').join(escSlash)
	            .split('\\{').join(escOpen)
	            .split('\\}').join(escClose)
	            .split('\\,').join(escComma)
	            .split('\\.').join(escPeriod);
	}
	
	function unescapeBraces(str) {
	  return str.split(escSlash).join('\\')
	            .split(escOpen).join('{')
	            .split(escClose).join('}')
	            .split(escComma).join(',')
	            .split(escPeriod).join('.');
	}
	
	
	// Basically just str.split(","), but handling cases
	// where we have nested braced sections, which should be
	// treated as individual members, like {a,{b,c},d}
	function parseCommaParts(str) {
	  if (!str)
	    return [''];
	
	  var parts = [];
	  var m = balanced('{', '}', str);
	
	  if (!m)
	    return str.split(',');
	
	  var pre = m.pre;
	  var body = m.body;
	  var post = m.post;
	  var p = pre.split(',');
	
	  p[p.length-1] += '{' + body + '}';
	  var postParts = parseCommaParts(post);
	  if (post.length) {
	    p[p.length-1] += postParts.shift();
	    p.push.apply(p, postParts);
	  }
	
	  parts.push.apply(parts, p);
	
	  return parts;
	}
	
	function expandTop(str) {
	  if (!str)
	    return [];
	
	  // I don't know why Bash 4.3 does this, but it does.
	  // Anything starting with {} will have the first two bytes preserved
	  // but *only* at the top level, so {},a}b will not expand to anything,
	  // but a{},b}c will be expanded to [a}c,abc].
	  // One could argue that this is a bug in Bash, but since the goal of
	  // this module is to match Bash's rules, we escape a leading {}
	  if (str.substr(0, 2) === '{}') {
	    str = '\\{\\}' + str.substr(2);
	  }
	
	  return expand(escapeBraces(str), true).map(unescapeBraces);
	}
	
	function identity(e) {
	  return e;
	}
	
	function embrace(str) {
	  return '{' + str + '}';
	}
	function isPadded(el) {
	  return /^-?0\d/.test(el);
	}
	
	function lte(i, y) {
	  return i <= y;
	}
	function gte(i, y) {
	  return i >= y;
	}
	
	function expand(str, isTop) {
	  var expansions = [];
	
	  var m = balanced('{', '}', str);
	  if (!m || /\$$/.test(m.pre)) return [str];
	
	  var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
	  var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
	  var isSequence = isNumericSequence || isAlphaSequence;
	  var isOptions = /^(.*,)+(.+)?$/.test(m.body);
	  if (!isSequence && !isOptions) {
	    // {a},b}
	    if (m.post.match(/,.*\}/)) {
	      str = m.pre + '{' + m.body + escClose + m.post;
	      return expand(str);
	    }
	    return [str];
	  }
	
	  var n;
	  if (isSequence) {
	    n = m.body.split(/\.\./);
	  } else {
	    n = parseCommaParts(m.body);
	    if (n.length === 1) {
	      // x{{a,b}}y ==> x{a}y x{b}y
	      n = expand(n[0], false).map(embrace);
	      if (n.length === 1) {
	        var post = m.post.length
	          ? expand(m.post, false)
	          : [''];
	        return post.map(function(p) {
	          return m.pre + n[0] + p;
	        });
	      }
	    }
	  }
	
	  // at this point, n is the parts, and we know it's not a comma set
	  // with a single entry.
	
	  // no need to expand pre, since it is guaranteed to be free of brace-sets
	  var pre = m.pre;
	  var post = m.post.length
	    ? expand(m.post, false)
	    : [''];
	
	  var N;
	
	  if (isSequence) {
	    var x = numeric(n[0]);
	    var y = numeric(n[1]);
	    var width = Math.max(n[0].length, n[1].length)
	    var incr = n.length == 3
	      ? Math.abs(numeric(n[2]))
	      : 1;
	    var test = lte;
	    var reverse = y < x;
	    if (reverse) {
	      incr *= -1;
	      test = gte;
	    }
	    var pad = n.some(isPadded);
	
	    N = [];
	
	    for (var i = x; test(i, y); i += incr) {
	      var c;
	      if (isAlphaSequence) {
	        c = String.fromCharCode(i);
	        if (c === '\\')
	          c = '';
	      } else {
	        c = String(i);
	        if (pad) {
	          var need = width - c.length;
	          if (need > 0) {
	            var z = new Array(need + 1).join('0');
	            if (i < 0)
	              c = '-' + z + c.slice(1);
	            else
	              c = z + c;
	          }
	        }
	      }
	      N.push(c);
	    }
	  } else {
	    N = concatMap(n, function(el) { return expand(el, false) });
	  }
	
	  for (var j = 0; j < N.length; j++) {
	    for (var k = 0; k < post.length; k++) {
	      var expansion = pre + N[j] + post[k];
	      if (!isTop || isSequence || expansion)
	        expansions.push(expansion);
	    }
	  }
	
	  return expansions;
	}
	


/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = function (xs, fn) {
	    var res = [];
	    for (var i = 0; i < xs.length; i++) {
	        var x = fn(xs[i], i);
	        if (isArray(x)) res.push.apply(res, x);
	        else res.push(x);
	    }
	    return res;
	};
	
	var isArray = Array.isArray || function (xs) {
	    return Object.prototype.toString.call(xs) === '[object Array]';
	};


/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = balanced;
	function balanced(a, b, str) {
	  if (a instanceof RegExp) a = maybeMatch(a, str);
	  if (b instanceof RegExp) b = maybeMatch(b, str);
	
	  var r = range(a, b, str);
	
	  return r && {
	    start: r[0],
	    end: r[1],
	    pre: str.slice(0, r[0]),
	    body: str.slice(r[0] + a.length, r[1]),
	    post: str.slice(r[1] + b.length)
	  };
	}
	
	function maybeMatch(reg, str) {
	  var m = str.match(reg);
	  return m ? m[0] : null;
	}
	
	balanced.range = range;
	function range(a, b, str) {
	  var begs, beg, left, right, result;
	  var ai = str.indexOf(a);
	  var bi = str.indexOf(b, ai + 1);
	  var i = ai;
	
	  if (ai >= 0 && bi > 0) {
	    begs = [];
	    left = str.length;
	
	    while (i >= 0 && !result) {
	      if (i == ai) {
	        begs.push(i);
	        ai = str.indexOf(a, i + 1);
	      } else if (begs.length == 1) {
	        result = [ begs.pop(), bi ];
	      } else {
	        beg = begs.pop();
	        if (beg < left) {
	          left = beg;
	          right = bi;
	        }
	
	        bi = str.indexOf(b, i + 1);
	      }
	
	      i = ai < bi && ai >= 0 ? ai : bi;
	    }
	
	    if (begs.length) {
	      result = [ left, right ];
	    }
	  }
	
	  return result;
	}


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	try {
	  var util = __webpack_require__(3);
	  if (typeof util.inherits !== 'function') throw '';
	  module.exports = util.inherits;
	} catch (e) {
	  module.exports = __webpack_require__(22);
	}


/***/ },
/* 22 */
/***/ function(module, exports) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = require("events");

/***/ },
/* 24 */
/***/ function(module, exports) {

	'use strict';
	
	function posix(path) {
		return path.charAt(0) === '/';
	}
	
	function win32(path) {
		// https://github.com/nodejs/node/blob/b3fcc245fb25539909ef1d5eaa01dbf92e168633/lib/path.js#L56
		var splitDeviceRe = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;
		var result = splitDeviceRe.exec(path);
		var device = result[1] || '';
		var isUnc = Boolean(device && device.charAt(1) !== ':');
	
		// UNC paths are always absolute
		return Boolean(result[2] || isUnc);
	}
	
	module.exports = process.platform === 'win32' ? win32 : posix;
	module.exports.posix = posix;
	module.exports.win32 = win32;


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = globSync
	globSync.GlobSync = GlobSync
	
	var fs = __webpack_require__(7)
	var rp = __webpack_require__(15)
	var minimatch = __webpack_require__(17)
	var Minimatch = minimatch.Minimatch
	var Glob = __webpack_require__(14).Glob
	var util = __webpack_require__(3)
	var path = __webpack_require__(4)
	var assert = __webpack_require__(13)
	var isAbsolute = __webpack_require__(24)
	var common = __webpack_require__(26)
	var alphasort = common.alphasort
	var alphasorti = common.alphasorti
	var setopts = common.setopts
	var ownProp = common.ownProp
	var childrenIgnored = common.childrenIgnored
	var isIgnored = common.isIgnored
	
	function globSync (pattern, options) {
	  if (typeof options === 'function' || arguments.length === 3)
	    throw new TypeError('callback provided to sync glob\n'+
	                        'See: https://github.com/isaacs/node-glob/issues/167')
	
	  return new GlobSync(pattern, options).found
	}
	
	function GlobSync (pattern, options) {
	  if (!pattern)
	    throw new Error('must provide pattern')
	
	  if (typeof options === 'function' || arguments.length === 3)
	    throw new TypeError('callback provided to sync glob\n'+
	                        'See: https://github.com/isaacs/node-glob/issues/167')
	
	  if (!(this instanceof GlobSync))
	    return new GlobSync(pattern, options)
	
	  setopts(this, pattern, options)
	
	  if (this.noprocess)
	    return this
	
	  var n = this.minimatch.set.length
	  this.matches = new Array(n)
	  for (var i = 0; i < n; i ++) {
	    this._process(this.minimatch.set[i], i, false)
	  }
	  this._finish()
	}
	
	GlobSync.prototype._finish = function () {
	  assert(this instanceof GlobSync)
	  if (this.realpath) {
	    var self = this
	    this.matches.forEach(function (matchset, index) {
	      var set = self.matches[index] = Object.create(null)
	      for (var p in matchset) {
	        try {
	          p = self._makeAbs(p)
	          var real = rp.realpathSync(p, self.realpathCache)
	          set[real] = true
	        } catch (er) {
	          if (er.syscall === 'stat')
	            set[self._makeAbs(p)] = true
	          else
	            throw er
	        }
	      }
	    })
	  }
	  common.finish(this)
	}
	
	
	GlobSync.prototype._process = function (pattern, index, inGlobStar) {
	  assert(this instanceof GlobSync)
	
	  // Get the first [n] parts of pattern that are all strings.
	  var n = 0
	  while (typeof pattern[n] === 'string') {
	    n ++
	  }
	  // now n is the index of the first one that is *not* a string.
	
	  // See if there's anything else
	  var prefix
	  switch (n) {
	    // if not, then this is rather simple
	    case pattern.length:
	      this._processSimple(pattern.join('/'), index)
	      return
	
	    case 0:
	      // pattern *starts* with some non-trivial item.
	      // going to readdir(cwd), but not include the prefix in matches.
	      prefix = null
	      break
	
	    default:
	      // pattern has some string bits in the front.
	      // whatever it starts with, whether that's 'absolute' like /foo/bar,
	      // or 'relative' like '../baz'
	      prefix = pattern.slice(0, n).join('/')
	      break
	  }
	
	  var remain = pattern.slice(n)
	
	  // get the list of entries.
	  var read
	  if (prefix === null)
	    read = '.'
	  else if (isAbsolute(prefix) || isAbsolute(pattern.join('/'))) {
	    if (!prefix || !isAbsolute(prefix))
	      prefix = '/' + prefix
	    read = prefix
	  } else
	    read = prefix
	
	  var abs = this._makeAbs(read)
	
	  //if ignored, skip processing
	  if (childrenIgnored(this, read))
	    return
	
	  var isGlobStar = remain[0] === minimatch.GLOBSTAR
	  if (isGlobStar)
	    this._processGlobStar(prefix, read, abs, remain, index, inGlobStar)
	  else
	    this._processReaddir(prefix, read, abs, remain, index, inGlobStar)
	}
	
	
	GlobSync.prototype._processReaddir = function (prefix, read, abs, remain, index, inGlobStar) {
	  var entries = this._readdir(abs, inGlobStar)
	
	  // if the abs isn't a dir, then nothing can match!
	  if (!entries)
	    return
	
	  // It will only match dot entries if it starts with a dot, or if
	  // dot is set.  Stuff like @(.foo|.bar) isn't allowed.
	  var pn = remain[0]
	  var negate = !!this.minimatch.negate
	  var rawGlob = pn._glob
	  var dotOk = this.dot || rawGlob.charAt(0) === '.'
	
	  var matchedEntries = []
	  for (var i = 0; i < entries.length; i++) {
	    var e = entries[i]
	    if (e.charAt(0) !== '.' || dotOk) {
	      var m
	      if (negate && !prefix) {
	        m = !e.match(pn)
	      } else {
	        m = e.match(pn)
	      }
	      if (m)
	        matchedEntries.push(e)
	    }
	  }
	
	  var len = matchedEntries.length
	  // If there are no matched entries, then nothing matches.
	  if (len === 0)
	    return
	
	  // if this is the last remaining pattern bit, then no need for
	  // an additional stat *unless* the user has specified mark or
	  // stat explicitly.  We know they exist, since readdir returned
	  // them.
	
	  if (remain.length === 1 && !this.mark && !this.stat) {
	    if (!this.matches[index])
	      this.matches[index] = Object.create(null)
	
	    for (var i = 0; i < len; i ++) {
	      var e = matchedEntries[i]
	      if (prefix) {
	        if (prefix.slice(-1) !== '/')
	          e = prefix + '/' + e
	        else
	          e = prefix + e
	      }
	
	      if (e.charAt(0) === '/' && !this.nomount) {
	        e = path.join(this.root, e)
	      }
	      this._emitMatch(index, e)
	    }
	    // This was the last one, and no stats were needed
	    return
	  }
	
	  // now test all matched entries as stand-ins for that part
	  // of the pattern.
	  remain.shift()
	  for (var i = 0; i < len; i ++) {
	    var e = matchedEntries[i]
	    var newPattern
	    if (prefix)
	      newPattern = [prefix, e]
	    else
	      newPattern = [e]
	    this._process(newPattern.concat(remain), index, inGlobStar)
	  }
	}
	
	
	GlobSync.prototype._emitMatch = function (index, e) {
	  if (isIgnored(this, e))
	    return
	
	  var abs = this._makeAbs(e)
	
	  if (this.mark)
	    e = this._mark(e)
	
	  if (this.absolute) {
	    e = abs
	  }
	
	  if (this.matches[index][e])
	    return
	
	  if (this.nodir) {
	    var c = this.cache[abs]
	    if (c === 'DIR' || Array.isArray(c))
	      return
	  }
	
	  this.matches[index][e] = true
	
	  if (this.stat)
	    this._stat(e)
	}
	
	
	GlobSync.prototype._readdirInGlobStar = function (abs) {
	  // follow all symlinked directories forever
	  // just proceed as if this is a non-globstar situation
	  if (this.follow)
	    return this._readdir(abs, false)
	
	  var entries
	  var lstat
	  var stat
	  try {
	    lstat = fs.lstatSync(abs)
	  } catch (er) {
	    if (er.code === 'ENOENT') {
	      // lstat failed, doesn't exist
	      return null
	    }
	  }
	
	  var isSym = lstat && lstat.isSymbolicLink()
	  this.symlinks[abs] = isSym
	
	  // If it's not a symlink or a dir, then it's definitely a regular file.
	  // don't bother doing a readdir in that case.
	  if (!isSym && lstat && !lstat.isDirectory())
	    this.cache[abs] = 'FILE'
	  else
	    entries = this._readdir(abs, false)
	
	  return entries
	}
	
	GlobSync.prototype._readdir = function (abs, inGlobStar) {
	  var entries
	
	  if (inGlobStar && !ownProp(this.symlinks, abs))
	    return this._readdirInGlobStar(abs)
	
	  if (ownProp(this.cache, abs)) {
	    var c = this.cache[abs]
	    if (!c || c === 'FILE')
	      return null
	
	    if (Array.isArray(c))
	      return c
	  }
	
	  try {
	    return this._readdirEntries(abs, fs.readdirSync(abs))
	  } catch (er) {
	    this._readdirError(abs, er)
	    return null
	  }
	}
	
	GlobSync.prototype._readdirEntries = function (abs, entries) {
	  // if we haven't asked to stat everything, then just
	  // assume that everything in there exists, so we can avoid
	  // having to stat it a second time.
	  if (!this.mark && !this.stat) {
	    for (var i = 0; i < entries.length; i ++) {
	      var e = entries[i]
	      if (abs === '/')
	        e = abs + e
	      else
	        e = abs + '/' + e
	      this.cache[e] = true
	    }
	  }
	
	  this.cache[abs] = entries
	
	  // mark and cache dir-ness
	  return entries
	}
	
	GlobSync.prototype._readdirError = function (f, er) {
	  // handle errors, and cache the information
	  switch (er.code) {
	    case 'ENOTSUP': // https://github.com/isaacs/node-glob/issues/205
	    case 'ENOTDIR': // totally normal. means it *does* exist.
	      var abs = this._makeAbs(f)
	      this.cache[abs] = 'FILE'
	      if (abs === this.cwdAbs) {
	        var error = new Error(er.code + ' invalid cwd ' + this.cwd)
	        error.path = this.cwd
	        error.code = er.code
	        throw error
	      }
	      break
	
	    case 'ENOENT': // not terribly unusual
	    case 'ELOOP':
	    case 'ENAMETOOLONG':
	    case 'UNKNOWN':
	      this.cache[this._makeAbs(f)] = false
	      break
	
	    default: // some unusual error.  Treat as failure.
	      this.cache[this._makeAbs(f)] = false
	      if (this.strict)
	        throw er
	      if (!this.silent)
	        console.error('glob error', er)
	      break
	  }
	}
	
	GlobSync.prototype._processGlobStar = function (prefix, read, abs, remain, index, inGlobStar) {
	
	  var entries = this._readdir(abs, inGlobStar)
	
	  // no entries means not a dir, so it can never have matches
	  // foo.txt/** doesn't match foo.txt
	  if (!entries)
	    return
	
	  // test without the globstar, and with every child both below
	  // and replacing the globstar.
	  var remainWithoutGlobStar = remain.slice(1)
	  var gspref = prefix ? [ prefix ] : []
	  var noGlobStar = gspref.concat(remainWithoutGlobStar)
	
	  // the noGlobStar pattern exits the inGlobStar state
	  this._process(noGlobStar, index, false)
	
	  var len = entries.length
	  var isSym = this.symlinks[abs]
	
	  // If it's a symlink, and we're in a globstar, then stop
	  if (isSym && inGlobStar)
	    return
	
	  for (var i = 0; i < len; i++) {
	    var e = entries[i]
	    if (e.charAt(0) === '.' && !this.dot)
	      continue
	
	    // these two cases enter the inGlobStar state
	    var instead = gspref.concat(entries[i], remainWithoutGlobStar)
	    this._process(instead, index, true)
	
	    var below = gspref.concat(entries[i], remain)
	    this._process(below, index, true)
	  }
	}
	
	GlobSync.prototype._processSimple = function (prefix, index) {
	  // XXX review this.  Shouldn't it be doing the mounting etc
	  // before doing stat?  kinda weird?
	  var exists = this._stat(prefix)
	
	  if (!this.matches[index])
	    this.matches[index] = Object.create(null)
	
	  // If it doesn't exist, then just mark the lack of results
	  if (!exists)
	    return
	
	  if (prefix && isAbsolute(prefix) && !this.nomount) {
	    var trail = /[\/\\]$/.test(prefix)
	    if (prefix.charAt(0) === '/') {
	      prefix = path.join(this.root, prefix)
	    } else {
	      prefix = path.resolve(this.root, prefix)
	      if (trail)
	        prefix += '/'
	    }
	  }
	
	  if (process.platform === 'win32')
	    prefix = prefix.replace(/\\/g, '/')
	
	  // Mark this as a match
	  this._emitMatch(index, prefix)
	}
	
	// Returns either 'DIR', 'FILE', or false
	GlobSync.prototype._stat = function (f) {
	  var abs = this._makeAbs(f)
	  var needDir = f.slice(-1) === '/'
	
	  if (f.length > this.maxLength)
	    return false
	
	  if (!this.stat && ownProp(this.cache, abs)) {
	    var c = this.cache[abs]
	
	    if (Array.isArray(c))
	      c = 'DIR'
	
	    // It exists, but maybe not how we need it
	    if (!needDir || c === 'DIR')
	      return c
	
	    if (needDir && c === 'FILE')
	      return false
	
	    // otherwise we have to stat, because maybe c=true
	    // if we know it exists, but not what it is.
	  }
	
	  var exists
	  var stat = this.statCache[abs]
	  if (!stat) {
	    var lstat
	    try {
	      lstat = fs.lstatSync(abs)
	    } catch (er) {
	      if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {
	        this.statCache[abs] = false
	        return false
	      }
	    }
	
	    if (lstat && lstat.isSymbolicLink()) {
	      try {
	        stat = fs.statSync(abs)
	      } catch (er) {
	        stat = lstat
	      }
	    } else {
	      stat = lstat
	    }
	  }
	
	  this.statCache[abs] = stat
	
	  var c = true
	  if (stat)
	    c = stat.isDirectory() ? 'DIR' : 'FILE'
	
	  this.cache[abs] = this.cache[abs] || c
	
	  if (needDir && c === 'FILE')
	    return false
	
	  return c
	}
	
	GlobSync.prototype._mark = function (p) {
	  return common.mark(this, p)
	}
	
	GlobSync.prototype._makeAbs = function (f) {
	  return common.makeAbs(this, f)
	}


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	exports.alphasort = alphasort
	exports.alphasorti = alphasorti
	exports.setopts = setopts
	exports.ownProp = ownProp
	exports.makeAbs = makeAbs
	exports.finish = finish
	exports.mark = mark
	exports.isIgnored = isIgnored
	exports.childrenIgnored = childrenIgnored
	
	function ownProp (obj, field) {
	  return Object.prototype.hasOwnProperty.call(obj, field)
	}
	
	var path = __webpack_require__(4)
	var minimatch = __webpack_require__(17)
	var isAbsolute = __webpack_require__(24)
	var Minimatch = minimatch.Minimatch
	
	function alphasorti (a, b) {
	  return a.toLowerCase().localeCompare(b.toLowerCase())
	}
	
	function alphasort (a, b) {
	  return a.localeCompare(b)
	}
	
	function setupIgnores (self, options) {
	  self.ignore = options.ignore || []
	
	  if (!Array.isArray(self.ignore))
	    self.ignore = [self.ignore]
	
	  if (self.ignore.length) {
	    self.ignore = self.ignore.map(ignoreMap)
	  }
	}
	
	// ignore patterns are always in dot:true mode.
	function ignoreMap (pattern) {
	  var gmatcher = null
	  if (pattern.slice(-3) === '/**') {
	    var gpattern = pattern.replace(/(\/\*\*)+$/, '')
	    gmatcher = new Minimatch(gpattern, { dot: true })
	  }
	
	  return {
	    matcher: new Minimatch(pattern, { dot: true }),
	    gmatcher: gmatcher
	  }
	}
	
	function setopts (self, pattern, options) {
	  if (!options)
	    options = {}
	
	  // base-matching: just use globstar for that.
	  if (options.matchBase && -1 === pattern.indexOf("/")) {
	    if (options.noglobstar) {
	      throw new Error("base matching requires globstar")
	    }
	    pattern = "**/" + pattern
	  }
	
	  self.silent = !!options.silent
	  self.pattern = pattern
	  self.strict = options.strict !== false
	  self.realpath = !!options.realpath
	  self.realpathCache = options.realpathCache || Object.create(null)
	  self.follow = !!options.follow
	  self.dot = !!options.dot
	  self.mark = !!options.mark
	  self.nodir = !!options.nodir
	  if (self.nodir)
	    self.mark = true
	  self.sync = !!options.sync
	  self.nounique = !!options.nounique
	  self.nonull = !!options.nonull
	  self.nosort = !!options.nosort
	  self.nocase = !!options.nocase
	  self.stat = !!options.stat
	  self.noprocess = !!options.noprocess
	  self.absolute = !!options.absolute
	
	  self.maxLength = options.maxLength || Infinity
	  self.cache = options.cache || Object.create(null)
	  self.statCache = options.statCache || Object.create(null)
	  self.symlinks = options.symlinks || Object.create(null)
	
	  setupIgnores(self, options)
	
	  self.changedCwd = false
	  var cwd = process.cwd()
	  if (!ownProp(options, "cwd"))
	    self.cwd = cwd
	  else {
	    self.cwd = path.resolve(options.cwd)
	    self.changedCwd = self.cwd !== cwd
	  }
	
	  self.root = options.root || path.resolve(self.cwd, "/")
	  self.root = path.resolve(self.root)
	  if (process.platform === "win32")
	    self.root = self.root.replace(/\\/g, "/")
	
	  // TODO: is an absolute `cwd` supposed to be resolved against `root`?
	  // e.g. { cwd: '/test', root: __dirname } === path.join(__dirname, '/test')
	  self.cwdAbs = isAbsolute(self.cwd) ? self.cwd : makeAbs(self, self.cwd)
	  if (process.platform === "win32")
	    self.cwdAbs = self.cwdAbs.replace(/\\/g, "/")
	  self.nomount = !!options.nomount
	
	  // disable comments and negation in Minimatch.
	  // Note that they are not supported in Glob itself anyway.
	  options.nonegate = true
	  options.nocomment = true
	
	  self.minimatch = new Minimatch(pattern, options)
	  self.options = self.minimatch.options
	}
	
	function finish (self) {
	  var nou = self.nounique
	  var all = nou ? [] : Object.create(null)
	
	  for (var i = 0, l = self.matches.length; i < l; i ++) {
	    var matches = self.matches[i]
	    if (!matches || Object.keys(matches).length === 0) {
	      if (self.nonull) {
	        // do like the shell, and spit out the literal glob
	        var literal = self.minimatch.globSet[i]
	        if (nou)
	          all.push(literal)
	        else
	          all[literal] = true
	      }
	    } else {
	      // had matches
	      var m = Object.keys(matches)
	      if (nou)
	        all.push.apply(all, m)
	      else
	        m.forEach(function (m) {
	          all[m] = true
	        })
	    }
	  }
	
	  if (!nou)
	    all = Object.keys(all)
	
	  if (!self.nosort)
	    all = all.sort(self.nocase ? alphasorti : alphasort)
	
	  // at *some* point we statted all of these
	  if (self.mark) {
	    for (var i = 0; i < all.length; i++) {
	      all[i] = self._mark(all[i])
	    }
	    if (self.nodir) {
	      all = all.filter(function (e) {
	        var notDir = !(/\/$/.test(e))
	        var c = self.cache[e] || self.cache[makeAbs(self, e)]
	        if (notDir && c)
	          notDir = c !== 'DIR' && !Array.isArray(c)
	        return notDir
	      })
	    }
	  }
	
	  if (self.ignore.length)
	    all = all.filter(function(m) {
	      return !isIgnored(self, m)
	    })
	
	  self.found = all
	}
	
	function mark (self, p) {
	  var abs = makeAbs(self, p)
	  var c = self.cache[abs]
	  var m = p
	  if (c) {
	    var isDir = c === 'DIR' || Array.isArray(c)
	    var slash = p.slice(-1) === '/'
	
	    if (isDir && !slash)
	      m += '/'
	    else if (!isDir && slash)
	      m = m.slice(0, -1)
	
	    if (m !== p) {
	      var mabs = makeAbs(self, m)
	      self.statCache[mabs] = self.statCache[abs]
	      self.cache[mabs] = self.cache[abs]
	    }
	  }
	
	  return m
	}
	
	// lotta situps...
	function makeAbs (self, f) {
	  var abs = f
	  if (f.charAt(0) === '/') {
	    abs = path.join(self.root, f)
	  } else if (isAbsolute(f) || f === '') {
	    abs = f
	  } else if (self.changedCwd) {
	    abs = path.resolve(self.cwd, f)
	  } else {
	    abs = path.resolve(f)
	  }
	
	  if (process.platform === 'win32')
	    abs = abs.replace(/\\/g, '/')
	
	  return abs
	}
	
	
	// Return true, if pattern ends with globstar '**', for the accompanying parent directory.
	// Ex:- If node_modules/** is the pattern, add 'node_modules' to ignore list along with it's contents
	function isIgnored (self, path) {
	  if (!self.ignore.length)
	    return false
	
	  return self.ignore.some(function(item) {
	    return item.matcher.match(path) || !!(item.gmatcher && item.gmatcher.match(path))
	  })
	}
	
	function childrenIgnored (self, path) {
	  if (!self.ignore.length)
	    return false
	
	  return self.ignore.some(function(item) {
	    return !!(item.gmatcher && item.gmatcher.match(path))
	  })
	}


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var wrappy = __webpack_require__(28)
	var reqs = Object.create(null)
	var once = __webpack_require__(29)
	
	module.exports = wrappy(inflight)
	
	function inflight (key, cb) {
	  if (reqs[key]) {
	    reqs[key].push(cb)
	    return null
	  } else {
	    reqs[key] = [cb]
	    return makeres(key)
	  }
	}
	
	function makeres (key) {
	  return once(function RES () {
	    var cbs = reqs[key]
	    var len = cbs.length
	    var args = slice(arguments)
	
	    // XXX It's somewhat ambiguous whether a new callback added in this
	    // pass should be queued for later execution if something in the
	    // list of callbacks throws, or if it should just be discarded.
	    // However, it's such an edge case that it hardly matters, and either
	    // choice is likely as surprising as the other.
	    // As it happens, we do go ahead and schedule it for later execution.
	    try {
	      for (var i = 0; i < len; i++) {
	        cbs[i].apply(null, args)
	      }
	    } finally {
	      if (cbs.length > len) {
	        // added more in the interim.
	        // de-zalgo, just in case, but don't call again.
	        cbs.splice(0, len)
	        process.nextTick(function () {
	          RES.apply(null, args)
	        })
	      } else {
	        delete reqs[key]
	      }
	    }
	  })
	}
	
	function slice (args) {
	  var length = args.length
	  var array = []
	
	  for (var i = 0; i < length; i++) array[i] = args[i]
	  return array
	}


/***/ },
/* 28 */
/***/ function(module, exports) {

	// Returns a wrapper function that returns a wrapped callback
	// The wrapper function should do some stuff, and return a
	// presumably different callback function.
	// This makes sure that own properties are retained, so that
	// decorations and such are not lost along the way.
	module.exports = wrappy
	function wrappy (fn, cb) {
	  if (fn && cb) return wrappy(fn)(cb)
	
	  if (typeof fn !== 'function')
	    throw new TypeError('need wrapper function')
	
	  Object.keys(fn).forEach(function (k) {
	    wrapper[k] = fn[k]
	  })
	
	  return wrapper
	
	  function wrapper() {
	    var args = new Array(arguments.length)
	    for (var i = 0; i < args.length; i++) {
	      args[i] = arguments[i]
	    }
	    var ret = fn.apply(this, args)
	    var cb = args[args.length-1]
	    if (typeof ret === 'function' && ret !== cb) {
	      Object.keys(cb).forEach(function (k) {
	        ret[k] = cb[k]
	      })
	    }
	    return ret
	  }
	}


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var wrappy = __webpack_require__(28)
	module.exports = wrappy(once)
	module.exports.strict = wrappy(onceStrict)
	
	once.proto = once(function () {
	  Object.defineProperty(Function.prototype, 'once', {
	    value: function () {
	      return once(this)
	    },
	    configurable: true
	  })
	
	  Object.defineProperty(Function.prototype, 'onceStrict', {
	    value: function () {
	      return onceStrict(this)
	    },
	    configurable: true
	  })
	})
	
	function once (fn) {
	  var f = function () {
	    if (f.called) return f.value
	    f.called = true
	    return f.value = fn.apply(this, arguments)
	  }
	  f.called = false
	  return f
	}
	
	function onceStrict (fn) {
	  var f = function () {
	    if (f.called)
	      throw new Error(f.onceError)
	    f.called = true
	    return f.value = fn.apply(this, arguments)
	  }
	  var name = fn.name || 'Function wrapped with `once`'
	  f.onceError = name + " shouldn't be called more than once"
	  f.called = false
	  return f
	}


/***/ },
/* 30 */
/***/ function(module, exports) {

	// Logic for unix file mode operations.
	
	'use strict';
	
	// Converts mode to string 3 characters long.
	exports.normalizeFileMode = function (mode) {
	  var modeAsString;
	  if (typeof mode === 'number') {
	    modeAsString = mode.toString(8);
	  } else {
	    modeAsString = mode;
	  }
	  return modeAsString.substring(modeAsString.length - 3);
	};


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var fs = __webpack_require__(7);
	var Q = __webpack_require__(5);
	
	var modeUtil = __webpack_require__(30);
	var validate = __webpack_require__(10);
	var write = __webpack_require__(8);
	
	var validateInput = function (methodName, path, criteria) {
	  var methodSignature = methodName + '(path, [criteria])';
	  validate.argument(methodSignature, 'path', path, ['string']);
	  validate.options(methodSignature, 'criteria', criteria, {
	    content: ['string', 'buffer', 'object', 'array'],
	    jsonIndent: ['number'],
	    mode: ['string', 'number']
	  });
	};
	
	var getCriteriaDefaults = function (passedCriteria) {
	  var criteria = passedCriteria || {};
	  if (criteria.mode !== undefined) {
	    criteria.mode = modeUtil.normalizeFileMode(criteria.mode);
	  }
	  return criteria;
	};
	
	var generatePathOccupiedByNotFileError = function (path) {
	  return new Error('Path ' + path + ' exists but is not a file.' +
	      ' Halting jetpack.file() call for safety reasons.');
	};
	
	// ---------------------------------------------------------
	// Sync
	// ---------------------------------------------------------
	
	var checkWhatAlreadyOccupiesPathSync = function (path) {
	  var stat;
	
	  try {
	    stat = fs.statSync(path);
	  } catch (err) {
	    // Detection if path exists
	    if (err.code !== 'ENOENT') {
	      throw err;
	    }
	  }
	
	  if (stat && !stat.isFile()) {
	    throw generatePathOccupiedByNotFileError(path);
	  }
	
	  return stat;
	};
	
	var checkExistingFileFulfillsCriteriaSync = function (path, stat, criteria) {
	  var mode = modeUtil.normalizeFileMode(stat.mode);
	
	  var checkContent = function () {
	    if (criteria.content !== undefined) {
	      write.sync(path, criteria.content, {
	        mode: mode,
	        jsonIndent: criteria.jsonIndent
	      });
	      return true;
	    }
	    return false;
	  };
	
	  var checkMode = function () {
	    if (criteria.mode !== undefined && criteria.mode !== mode) {
	      fs.chmodSync(path, criteria.mode);
	    }
	  };
	
	  var contentReplaced = checkContent();
	  if (!contentReplaced) {
	    checkMode();
	  }
	};
	
	var createBrandNewFileSync = function (path, criteria) {
	  var content = '';
	  if (criteria.content !== undefined) {
	    content = criteria.content;
	  }
	  write.sync(path, content, {
	    mode: criteria.mode,
	    jsonIndent: criteria.jsonIndent
	  });
	};
	
	var fileSync = function (path, passedCriteria) {
	  var criteria = getCriteriaDefaults(passedCriteria);
	  var stat = checkWhatAlreadyOccupiesPathSync(path);
	  if (stat !== undefined) {
	    checkExistingFileFulfillsCriteriaSync(path, stat, criteria);
	  } else {
	    createBrandNewFileSync(path, criteria);
	  }
	};
	
	// ---------------------------------------------------------
	// Async
	// ---------------------------------------------------------
	
	var promisedStat = Q.denodeify(fs.stat);
	var promisedChmod = Q.denodeify(fs.chmod);
	
	var checkWhatAlreadyOccupiesPathAsync = function (path) {
	  var deferred = Q.defer();
	
	  promisedStat(path)
	  .then(function (stat) {
	    if (stat.isFile()) {
	      deferred.resolve(stat);
	    } else {
	      deferred.reject(generatePathOccupiedByNotFileError(path));
	    }
	  })
	  .catch(function (err) {
	    if (err.code === 'ENOENT') {
	      // Path doesn't exist.
	      deferred.resolve(undefined);
	    } else {
	      // This is other error. Must end here.
	      deferred.reject(err);
	    }
	  });
	
	  return deferred.promise;
	};
	
	var checkExistingFileFulfillsCriteriaAsync = function (path, stat, criteria) {
	  var mode = modeUtil.normalizeFileMode(stat.mode);
	
	  var checkContent = function () {
	    var deferred = Q.defer();
	
	    if (criteria.content !== undefined) {
	      write.async(path, criteria.content, {
	        mode: mode,
	        jsonIndent: criteria.jsonIndent
	      })
	      .then(function () {
	        deferred.resolve(true);
	      })
	      .catch(deferred.reject);
	    } else {
	      deferred.resolve(false);
	    }
	
	    return deferred.promise;
	  };
	
	  var checkMode = function () {
	    if (criteria.mode !== undefined && criteria.mode !== mode) {
	      return promisedChmod(path, criteria.mode);
	    }
	    return undefined;
	  };
	
	  return checkContent()
	  .then(function (contentReplaced) {
	    if (!contentReplaced) {
	      return checkMode();
	    }
	    return undefined;
	  });
	};
	
	var createBrandNewFileAsync = function (path, criteria) {
	  var content = '';
	  if (criteria.content !== undefined) {
	    content = criteria.content;
	  }
	
	  return write.async(path, content, {
	    mode: criteria.mode,
	    jsonIndent: criteria.jsonIndent
	  });
	};
	
	var fileAsync = function (path, passedCriteria) {
	  var deferred = Q.defer();
	  var criteria = getCriteriaDefaults(passedCriteria);
	
	  checkWhatAlreadyOccupiesPathAsync(path)
	  .then(function (stat) {
	    if (stat !== undefined) {
	      return checkExistingFileFulfillsCriteriaAsync(path, stat, criteria);
	    }
	    return createBrandNewFileAsync(path, criteria);
	  })
	  .then(deferred.resolve, deferred.reject);
	
	  return deferred.promise;
	};
	
	// ---------------------------------------------------------
	// API
	// ---------------------------------------------------------
	
	exports.validateInput = validateInput;
	exports.sync = fileSync;
	exports.async = fileAsync;


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var pathUtil = __webpack_require__(4);
	var Q = __webpack_require__(5);
	var treeWalker = __webpack_require__(33);
	var inspect = __webpack_require__(35);
	var matcher = __webpack_require__(38);
	var validate = __webpack_require__(10);
	
	var validateInput = function (methodName, path, options) {
	  var methodSignature = methodName + '([path], options)';
	  validate.argument(methodSignature, 'path', path, ['string']);
	  validate.options(methodSignature, 'options', options, {
	    matching: ['string', 'array of string'],
	    files: ['boolean'],
	    directories: ['boolean'],
	    recursive: ['boolean']
	  });
	};
	
	var normalizeOptions = function (options) {
	  var opts = options || {};
	  // defaults:
	  if (opts.files === undefined) {
	    opts.files = true;
	  }
	  if (opts.directories === undefined) {
	    opts.directories = false;
	  }
	  if (opts.recursive === undefined) {
	    opts.recursive = true;
	  }
	  return opts;
	};
	
	var processFoundObjects = function (foundObjects, cwd) {
	  return foundObjects.map(function (inspectObj) {
	    return pathUtil.relative(cwd, inspectObj.absolutePath);
	  });
	};
	
	var generatePathDoesntExistError = function (path) {
	  var err = new Error("Path you want to find stuff in doesn't exist " + path);
	  err.code = 'ENOENT';
	  return err;
	};
	
	var generatePathNotDirectoryError = function (path) {
	  var err = new Error('Path you want to find stuff in must be a directory ' + path);
	  err.code = 'ENOTDIR';
	  return err;
	};
	
	// ---------------------------------------------------------
	// Sync
	// ---------------------------------------------------------
	
	var findSync = function (path, options) {
	  var foundInspectObjects = [];
	  var matchesAnyOfGlobs = matcher.create(path, options.matching);
	
	  treeWalker.sync(path, {
	    maxLevelsDeep: options.recursive ? Infinity : 1,
	    inspectOptions: {
	      absolutePath: true
	    }
	  }, function (itemPath, item) {
	    if (itemPath !== path && matchesAnyOfGlobs(itemPath)) {
	      if ((item.type === 'file' && options.files === true)
	        || (item.type === 'dir' && options.directories === true)) {
	        foundInspectObjects.push(item);
	      }
	    }
	  });
	
	  return processFoundObjects(foundInspectObjects, options.cwd);
	};
	
	var findSyncInit = function (path, options) {
	  var entryPointInspect = inspect.sync(path);
	  if (entryPointInspect === undefined) {
	    throw generatePathDoesntExistError(path);
	  } else if (entryPointInspect.type !== 'dir') {
	    throw generatePathNotDirectoryError(path);
	  }
	
	  return findSync(path, normalizeOptions(options));
	};
	
	// ---------------------------------------------------------
	// Async
	// ---------------------------------------------------------
	
	var findAsync = function (path, options) {
	  var deferred = Q.defer();
	  var foundInspectObjects = [];
	  var matchesAnyOfGlobs = matcher.create(path, options.matching);
	
	  var walker = treeWalker.stream(path, {
	    maxLevelsDeep: options.recursive ? Infinity : 1,
	    inspectOptions: {
	      absolutePath: true
	    }
	  })
	  .on('readable', function () {
	    var data = walker.read();
	    var item;
	    if (data && data.path !== path && matchesAnyOfGlobs(data.path)) {
	      item = data.item;
	      if ((item.type === 'file' && options.files === true)
	        || (item.type === 'dir' && options.directories === true)) {
	        foundInspectObjects.push(item);
	      }
	    }
	  })
	  .on('error', deferred.reject)
	  .on('end', function () {
	    deferred.resolve(processFoundObjects(foundInspectObjects, options.cwd));
	  });
	
	  return deferred.promise;
	};
	
	var findAsyncInit = function (path, options) {
	  return inspect.async(path)
	  .then(function (entryPointInspect) {
	    if (entryPointInspect === undefined) {
	      throw generatePathDoesntExistError(path);
	    } else if (entryPointInspect.type !== 'dir') {
	      throw generatePathNotDirectoryError(path);
	    }
	    return findAsync(path, normalizeOptions(options));
	  });
	};
	
	// ---------------------------------------------------------
	// API
	// ---------------------------------------------------------
	
	exports.validateInput = validateInput;
	exports.sync = findSyncInit;
	exports.async = findAsyncInit;


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	/* eslint no-underscore-dangle:0 */
	
	'use strict';
	
	var Readable = __webpack_require__(34).Readable;
	var pathUtil = __webpack_require__(4);
	var inspect = __webpack_require__(35);
	var list = __webpack_require__(37);
	
	// ---------------------------------------------------------
	// SYNC
	// ---------------------------------------------------------
	
	var walkSync = function (path, options, callback, currentLevel) {
	  var item = inspect.sync(path, options.inspectOptions);
	
	  if (options.maxLevelsDeep === undefined) {
	    options.maxLevelsDeep = Infinity;
	  }
	  if (currentLevel === undefined) {
	    currentLevel = 0;
	  }
	
	  callback(path, item);
	  if (item && item.type === 'dir' && currentLevel < options.maxLevelsDeep) {
	    list.sync(path).forEach(function (child) {
	      walkSync(path + pathUtil.sep + child, options, callback, currentLevel + 1);
	    });
	  }
	};
	
	// ---------------------------------------------------------
	// STREAM
	// ---------------------------------------------------------
	
	var walkStream = function (path, options) {
	  var rs = new Readable({ objectMode: true });
	  var nextTreeNode = {
	    path: path,
	    parent: undefined,
	    level: 0
	  };
	  var running = false;
	  var readSome;
	
	  var error = function (err) {
	    rs.emit('error', err);
	  };
	
	  var findNextUnprocessedNode = function (node) {
	    if (node.nextSibling) {
	      return node.nextSibling;
	    } else if (node.parent) {
	      return findNextUnprocessedNode(node.parent);
	    }
	    return undefined;
	  };
	
	  var pushAndContinueMaybe = function (data) {
	    var theyWantMore = rs.push(data);
	    running = false;
	    if (!nextTreeNode) {
	      // Previous was the last node. The job is done.
	      rs.push(null);
	    } else if (theyWantMore) {
	      readSome();
	    }
	  };
	
	  if (options.maxLevelsDeep === undefined) {
	    options.maxLevelsDeep = Infinity;
	  }
	
	  readSome = function () {
	    var theNode = nextTreeNode;
	
	    running = true;
	
	    inspect.async(theNode.path, options.inspectOptions)
	    .then(function (inspected) {
	      theNode.inspected = inspected;
	      if (inspected && inspected.type === 'dir' && theNode.level < options.maxLevelsDeep) {
	        list.async(theNode.path)
	        .then(function (childrenNames) {
	          var children = childrenNames.map(function (name) {
	            return {
	              name: name,
	              path: theNode.path + pathUtil.sep + name,
	              parent: theNode,
	              level: theNode.level + 1
	            };
	          });
	          children.forEach(function (child, index) {
	            child.nextSibling = children[index + 1];
	          });
	
	          nextTreeNode = children[0] || findNextUnprocessedNode(theNode);
	          pushAndContinueMaybe({ path: theNode.path, item: inspected });
	        })
	        .catch(error);
	      } else {
	        nextTreeNode = findNextUnprocessedNode(theNode);
	        pushAndContinueMaybe({ path: theNode.path, item: inspected });
	      }
	    })
	    .catch(error);
	  };
	
	  rs._read = function () {
	    if (!running) {
	      readSome();
	    }
	  };
	
	  return rs;
	};
	
	// ---------------------------------------------------------
	// API
	// ---------------------------------------------------------
	
	exports.sync = walkSync;
	exports.stream = walkStream;


/***/ },
/* 34 */
/***/ function(module, exports) {

	module.exports = require("stream");

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var fs = __webpack_require__(7);
	var crypto = __webpack_require__(36);
	var pathUtil = __webpack_require__(4);
	var Q = __webpack_require__(5);
	var validate = __webpack_require__(10);
	
	var supportedChecksumAlgorithms = ['md5', 'sha1', 'sha256', 'sha512'];
	
	var symlinkOptions = ['report', 'follow'];
	
	var validateInput = function (methodName, path, options) {
	  var methodSignature = methodName + '(path, [options])';
	  validate.argument(methodSignature, 'path', path, ['string']);
	  validate.options(methodSignature, 'options', options, {
	    checksum: ['string'],
	    mode: ['boolean'],
	    times: ['boolean'],
	    absolutePath: ['boolean'],
	    symlinks: ['string']
	  });
	
	  if (options && options.checksum !== undefined
	    && supportedChecksumAlgorithms.indexOf(options.checksum) === -1) {
	    throw new Error('Argument "options.checksum" passed to ' + methodSignature
	      + ' must have one of values: ' + supportedChecksumAlgorithms.join(', '));
	  }
	
	  if (options && options.symlinks !== undefined
	    && symlinkOptions.indexOf(options.symlinks) === -1) {
	    throw new Error('Argument "options.symlinks" passed to ' + methodSignature
	      + ' must have one of values: ' + symlinkOptions.join(', '));
	  }
	};
	
	var createInspectObj = function (path, options, stat) {
	  var obj = {};
	
	  obj.name = pathUtil.basename(path);
	
	  if (stat.isFile()) {
	    obj.type = 'file';
	    obj.size = stat.size;
	  } else if (stat.isDirectory()) {
	    obj.type = 'dir';
	  } else if (stat.isSymbolicLink()) {
	    obj.type = 'symlink';
	  } else {
	    obj.type = 'other';
	  }
	
	  if (options.mode) {
	    obj.mode = stat.mode;
	  }
	
	  if (options.times) {
	    obj.accessTime = stat.atime;
	    obj.modifyTime = stat.mtime;
	    obj.changeTime = stat.ctime;
	  }
	
	  if (options.absolutePath) {
	    obj.absolutePath = path;
	  }
	
	  return obj;
	};
	
	// ---------------------------------------------------------
	// Sync
	// ---------------------------------------------------------
	
	var fileChecksum = function (path, algo) {
	  var hash = crypto.createHash(algo);
	  var data = fs.readFileSync(path);
	  hash.update(data);
	  return hash.digest('hex');
	};
	
	var addExtraFieldsSync = function (path, inspectObj, options) {
	  if (inspectObj.type === 'file' && options.checksum) {
	    inspectObj[options.checksum] = fileChecksum(path, options.checksum);
	  } else if (inspectObj.type === 'symlink') {
	    inspectObj.pointsAt = fs.readlinkSync(path);
	  }
	};
	
	var inspectSync = function (path, options) {
	  var statOperation = fs.lstatSync;
	  var stat;
	  var inspectObj;
	  options = options || {};
	
	  if (options.symlinks === 'follow') {
	    statOperation = fs.statSync;
	  }
	
	  try {
	    stat = statOperation(path);
	  } catch (err) {
	    // Detection if path exists
	    if (err.code === 'ENOENT') {
	      // Doesn't exist. Return undefined instead of throwing.
	      return undefined;
	    }
	    throw err;
	  }
	
	  inspectObj = createInspectObj(path, options, stat);
	  addExtraFieldsSync(path, inspectObj, options);
	
	  return inspectObj;
	};
	
	// ---------------------------------------------------------
	// Async
	// ---------------------------------------------------------
	
	var promisedStat = Q.denodeify(fs.stat);
	var promisedLstat = Q.denodeify(fs.lstat);
	var promisedReadlink = Q.denodeify(fs.readlink);
	
	var fileChecksumAsync = function (path, algo) {
	  var deferred = Q.defer();
	
	  var hash = crypto.createHash(algo);
	  var s = fs.createReadStream(path);
	  s.on('data', function (data) {
	    hash.update(data);
	  });
	  s.on('end', function () {
	    deferred.resolve(hash.digest('hex'));
	  });
	  s.on('error', deferred.reject);
	
	  return deferred.promise;
	};
	
	var addExtraFieldsAsync = function (path, inspectObj, options) {
	  if (inspectObj.type === 'file' && options.checksum) {
	    return fileChecksumAsync(path, options.checksum)
	    .then(function (checksum) {
	      inspectObj[options.checksum] = checksum;
	      return inspectObj;
	    });
	  } else if (inspectObj.type === 'symlink') {
	    return promisedReadlink(path)
	    .then(function (linkPath) {
	      inspectObj.pointsAt = linkPath;
	      return inspectObj;
	    });
	  }
	  return new Q(inspectObj);
	};
	
	var inspectAsync = function (path, options) {
	  var deferred = Q.defer();
	  var statOperation = promisedLstat;
	  options = options || {};
	
	  if (options.symlinks === 'follow') {
	    statOperation = promisedStat;
	  }
	
	  statOperation(path)
	  .then(function (stat) {
	    var inspectObj = createInspectObj(path, options, stat);
	    addExtraFieldsAsync(path, inspectObj, options)
	    .then(deferred.resolve, deferred.reject);
	  })
	  .catch(function (err) {
	    // Detection if path exists
	    if (err.code === 'ENOENT') {
	      // Doesn't exist. Return undefined instead of throwing.
	      deferred.resolve(undefined);
	    } else {
	      deferred.reject(err);
	    }
	  });
	
	  return deferred.promise;
	};
	
	// ---------------------------------------------------------
	// API
	// ---------------------------------------------------------
	
	exports.supportedChecksumAlgorithms = supportedChecksumAlgorithms;
	exports.symlinkOptions = symlinkOptions;
	exports.validateInput = validateInput;
	exports.sync = inspectSync;
	exports.async = inspectAsync;


/***/ },
/* 36 */
/***/ function(module, exports) {

	module.exports = require("crypto");

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var fs = __webpack_require__(7);
	var Q = __webpack_require__(5);
	var validate = __webpack_require__(10);
	
	var validateInput = function (methodName, path) {
	  var methodSignature = methodName + '(path)';
	  validate.argument(methodSignature, 'path', path, ['string', 'undefined']);
	};
	
	// ---------------------------------------------------------
	// Sync
	// ---------------------------------------------------------
	
	var listSync = function (path) {
	  try {
	    return fs.readdirSync(path);
	  } catch (err) {
	    if (err.code === 'ENOENT') {
	      // Doesn't exist. Return undefined instead of throwing.
	      return undefined;
	    }
	    throw err;
	  }
	};
	
	// ---------------------------------------------------------
	// Async
	// ---------------------------------------------------------
	
	var promisedReaddir = Q.denodeify(fs.readdir);
	
	var listAsync = function (path) {
	  var deferred = Q.defer();
	
	  promisedReaddir(path)
	  .then(function (list) {
	    deferred.resolve(list);
	  })
	  .catch(function (err) {
	    if (err.code === 'ENOENT') {
	      // Doesn't exist. Return undefined instead of throwing.
	      deferred.resolve(undefined);
	    } else {
	      deferred.reject(err);
	    }
	  });
	
	  return deferred.promise;
	};
	
	// ---------------------------------------------------------
	// API
	// ---------------------------------------------------------
	
	exports.validateInput = validateInput;
	exports.sync = listSync;
	exports.async = listAsync;


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Minimatch = __webpack_require__(39).Minimatch;
	
	var convertPatternToAbsolutePath = function (basePath, pattern) {
	  // All patterns without slash are left as they are, if pattern contain
	  // any slash we need to turn it into absolute path.
	  var hasSlash = (pattern.indexOf('/') !== -1);
	  var isAbsolute = /^!?\//.test(pattern);
	  var isNegated = /^!/.test(pattern);
	  var separator;
	
	  if (!isAbsolute && hasSlash) {
	    // Throw out meaningful characters from the beginning ("!", "./").
	    pattern = pattern.replace(/^!/, '').replace(/^\.\//, '');
	
	    if (/\/$/.test(basePath)) {
	      separator = '';
	    } else {
	      separator = '/';
	    }
	
	    if (isNegated) {
	      return '!' + basePath + separator + pattern;
	    }
	    return basePath + separator + pattern;
	  }
	
	  return pattern;
	};
	
	exports.create = function (basePath, patterns) {
	  var matchers;
	
	  if (typeof patterns === 'string') {
	    patterns = [patterns];
	  }
	
	  matchers = patterns.map(function (pattern) {
	    return convertPatternToAbsolutePath(basePath, pattern);
	  })
	  .map(function (pattern) {
	    return new Minimatch(pattern, {
	      matchBase: true,
	      nocomment: true,
	      dot: true
	    });
	  });
	
	  return function performMatch(absolutePath) {
	    var mode = 'matching';
	    var weHaveMatch = false;
	    var currentMatcher;
	    var i;
	
	    for (i = 0; i < matchers.length; i += 1) {
	      currentMatcher = matchers[i];
	
	      if (currentMatcher.negate) {
	        mode = 'negation';
	        if (i === 0) {
	          // There are only negated patterns in the set,
	          // so make everything matching by default and
	          // start to reject stuff.
	          weHaveMatch = true;
	        }
	      }
	
	      if (mode === 'negation' && weHaveMatch && !currentMatcher.match(absolutePath)) {
	        // One negation match is enought to know we can reject this one.
	        return false;
	      }
	
	      if (mode === 'matching' && !weHaveMatch) {
	        weHaveMatch = currentMatcher.match(absolutePath);
	      }
	    }
	
	    return weHaveMatch;
	  };
	};


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = minimatch
	minimatch.Minimatch = Minimatch
	
	var path = { sep: '/' }
	try {
	  path = __webpack_require__(4)
	} catch (er) {}
	
	var GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {}
	var expand = __webpack_require__(18)
	
	var plTypes = {
	  '!': { open: '(?:(?!(?:', close: '))[^/]*?)'},
	  '?': { open: '(?:', close: ')?' },
	  '+': { open: '(?:', close: ')+' },
	  '*': { open: '(?:', close: ')*' },
	  '@': { open: '(?:', close: ')' }
	}
	
	// any single thing other than /
	// don't need to escape / when using new RegExp()
	var qmark = '[^/]'
	
	// * => any number of characters
	var star = qmark + '*?'
	
	// ** when dots are allowed.  Anything goes, except .. and .
	// not (^ or / followed by one or two dots followed by $ or /),
	// followed by anything, any number of times.
	var twoStarDot = '(?:(?!(?:\\\/|^)(?:\\.{1,2})($|\\\/)).)*?'
	
	// not a ^ or / followed by a dot,
	// followed by anything, any number of times.
	var twoStarNoDot = '(?:(?!(?:\\\/|^)\\.).)*?'
	
	// characters that need to be escaped in RegExp.
	var reSpecials = charSet('().*{}+?[]^$\\!')
	
	// "abc" -> { a:true, b:true, c:true }
	function charSet (s) {
	  return s.split('').reduce(function (set, c) {
	    set[c] = true
	    return set
	  }, {})
	}
	
	// normalizes slashes.
	var slashSplit = /\/+/
	
	minimatch.filter = filter
	function filter (pattern, options) {
	  options = options || {}
	  return function (p, i, list) {
	    return minimatch(p, pattern, options)
	  }
	}
	
	function ext (a, b) {
	  a = a || {}
	  b = b || {}
	  var t = {}
	  Object.keys(b).forEach(function (k) {
	    t[k] = b[k]
	  })
	  Object.keys(a).forEach(function (k) {
	    t[k] = a[k]
	  })
	  return t
	}
	
	minimatch.defaults = function (def) {
	  if (!def || !Object.keys(def).length) return minimatch
	
	  var orig = minimatch
	
	  var m = function minimatch (p, pattern, options) {
	    return orig.minimatch(p, pattern, ext(def, options))
	  }
	
	  m.Minimatch = function Minimatch (pattern, options) {
	    return new orig.Minimatch(pattern, ext(def, options))
	  }
	
	  return m
	}
	
	Minimatch.defaults = function (def) {
	  if (!def || !Object.keys(def).length) return Minimatch
	  return minimatch.defaults(def).Minimatch
	}
	
	function minimatch (p, pattern, options) {
	  if (typeof pattern !== 'string') {
	    throw new TypeError('glob pattern string required')
	  }
	
	  if (!options) options = {}
	
	  // shortcut: comments match nothing.
	  if (!options.nocomment && pattern.charAt(0) === '#') {
	    return false
	  }
	
	  // "" only matches ""
	  if (pattern.trim() === '') return p === ''
	
	  return new Minimatch(pattern, options).match(p)
	}
	
	function Minimatch (pattern, options) {
	  if (!(this instanceof Minimatch)) {
	    return new Minimatch(pattern, options)
	  }
	
	  if (typeof pattern !== 'string') {
	    throw new TypeError('glob pattern string required')
	  }
	
	  if (!options) options = {}
	  pattern = pattern.trim()
	
	  // windows support: need to use /, not \
	  if (path.sep !== '/') {
	    pattern = pattern.split(path.sep).join('/')
	  }
	
	  this.options = options
	  this.set = []
	  this.pattern = pattern
	  this.regexp = null
	  this.negate = false
	  this.comment = false
	  this.empty = false
	
	  // make the set of regexps etc.
	  this.make()
	}
	
	Minimatch.prototype.debug = function () {}
	
	Minimatch.prototype.make = make
	function make () {
	  // don't do it more than once.
	  if (this._made) return
	
	  var pattern = this.pattern
	  var options = this.options
	
	  // empty patterns and comments match nothing.
	  if (!options.nocomment && pattern.charAt(0) === '#') {
	    this.comment = true
	    return
	  }
	  if (!pattern) {
	    this.empty = true
	    return
	  }
	
	  // step 1: figure out negation, etc.
	  this.parseNegate()
	
	  // step 2: expand braces
	  var set = this.globSet = this.braceExpand()
	
	  if (options.debug) this.debug = console.error
	
	  this.debug(this.pattern, set)
	
	  // step 3: now we have a set, so turn each one into a series of path-portion
	  // matching patterns.
	  // These will be regexps, except in the case of "**", which is
	  // set to the GLOBSTAR object for globstar behavior,
	  // and will not contain any / characters
	  set = this.globParts = set.map(function (s) {
	    return s.split(slashSplit)
	  })
	
	  this.debug(this.pattern, set)
	
	  // glob --> regexps
	  set = set.map(function (s, si, set) {
	    return s.map(this.parse, this)
	  }, this)
	
	  this.debug(this.pattern, set)
	
	  // filter out everything that didn't compile properly.
	  set = set.filter(function (s) {
	    return s.indexOf(false) === -1
	  })
	
	  this.debug(this.pattern, set)
	
	  this.set = set
	}
	
	Minimatch.prototype.parseNegate = parseNegate
	function parseNegate () {
	  var pattern = this.pattern
	  var negate = false
	  var options = this.options
	  var negateOffset = 0
	
	  if (options.nonegate) return
	
	  for (var i = 0, l = pattern.length
	    ; i < l && pattern.charAt(i) === '!'
	    ; i++) {
	    negate = !negate
	    negateOffset++
	  }
	
	  if (negateOffset) this.pattern = pattern.substr(negateOffset)
	  this.negate = negate
	}
	
	// Brace expansion:
	// a{b,c}d -> abd acd
	// a{b,}c -> abc ac
	// a{0..3}d -> a0d a1d a2d a3d
	// a{b,c{d,e}f}g -> abg acdfg acefg
	// a{b,c}d{e,f}g -> abdeg acdeg abdeg abdfg
	//
	// Invalid sets are not expanded.
	// a{2..}b -> a{2..}b
	// a{b}c -> a{b}c
	minimatch.braceExpand = function (pattern, options) {
	  return braceExpand(pattern, options)
	}
	
	Minimatch.prototype.braceExpand = braceExpand
	
	function braceExpand (pattern, options) {
	  if (!options) {
	    if (this instanceof Minimatch) {
	      options = this.options
	    } else {
	      options = {}
	    }
	  }
	
	  pattern = typeof pattern === 'undefined'
	    ? this.pattern : pattern
	
	  if (typeof pattern === 'undefined') {
	    throw new TypeError('undefined pattern')
	  }
	
	  if (options.nobrace ||
	    !pattern.match(/\{.*\}/)) {
	    // shortcut. no need to expand.
	    return [pattern]
	  }
	
	  return expand(pattern)
	}
	
	// parse a component of the expanded set.
	// At this point, no pattern may contain "/" in it
	// so we're going to return a 2d array, where each entry is the full
	// pattern, split on '/', and then turned into a regular expression.
	// A regexp is made at the end which joins each array with an
	// escaped /, and another full one which joins each regexp with |.
	//
	// Following the lead of Bash 4.1, note that "**" only has special meaning
	// when it is the *only* thing in a path portion.  Otherwise, any series
	// of * is equivalent to a single *.  Globstar behavior is enabled by
	// default, and can be disabled by setting options.noglobstar.
	Minimatch.prototype.parse = parse
	var SUBPARSE = {}
	function parse (pattern, isSub) {
	  if (pattern.length > 1024 * 64) {
	    throw new TypeError('pattern is too long')
	  }
	
	  var options = this.options
	
	  // shortcuts
	  if (!options.noglobstar && pattern === '**') return GLOBSTAR
	  if (pattern === '') return ''
	
	  var re = ''
	  var hasMagic = !!options.nocase
	  var escaping = false
	  // ? => one single character
	  var patternListStack = []
	  var negativeLists = []
	  var stateChar
	  var inClass = false
	  var reClassStart = -1
	  var classStart = -1
	  // . and .. never match anything that doesn't start with .,
	  // even when options.dot is set.
	  var patternStart = pattern.charAt(0) === '.' ? '' // anything
	  // not (start or / followed by . or .. followed by / or end)
	  : options.dot ? '(?!(?:^|\\\/)\\.{1,2}(?:$|\\\/))'
	  : '(?!\\.)'
	  var self = this
	
	  function clearStateChar () {
	    if (stateChar) {
	      // we had some state-tracking character
	      // that wasn't consumed by this pass.
	      switch (stateChar) {
	        case '*':
	          re += star
	          hasMagic = true
	        break
	        case '?':
	          re += qmark
	          hasMagic = true
	        break
	        default:
	          re += '\\' + stateChar
	        break
	      }
	      self.debug('clearStateChar %j %j', stateChar, re)
	      stateChar = false
	    }
	  }
	
	  for (var i = 0, len = pattern.length, c
	    ; (i < len) && (c = pattern.charAt(i))
	    ; i++) {
	    this.debug('%s\t%s %s %j', pattern, i, re, c)
	
	    // skip over any that are escaped.
	    if (escaping && reSpecials[c]) {
	      re += '\\' + c
	      escaping = false
	      continue
	    }
	
	    switch (c) {
	      case '/':
	        // completely not allowed, even escaped.
	        // Should already be path-split by now.
	        return false
	
	      case '\\':
	        clearStateChar()
	        escaping = true
	      continue
	
	      // the various stateChar values
	      // for the "extglob" stuff.
	      case '?':
	      case '*':
	      case '+':
	      case '@':
	      case '!':
	        this.debug('%s\t%s %s %j <-- stateChar', pattern, i, re, c)
	
	        // all of those are literals inside a class, except that
	        // the glob [!a] means [^a] in regexp
	        if (inClass) {
	          this.debug('  in class')
	          if (c === '!' && i === classStart + 1) c = '^'
	          re += c
	          continue
	        }
	
	        // if we already have a stateChar, then it means
	        // that there was something like ** or +? in there.
	        // Handle the stateChar, then proceed with this one.
	        self.debug('call clearStateChar %j', stateChar)
	        clearStateChar()
	        stateChar = c
	        // if extglob is disabled, then +(asdf|foo) isn't a thing.
	        // just clear the statechar *now*, rather than even diving into
	        // the patternList stuff.
	        if (options.noext) clearStateChar()
	      continue
	
	      case '(':
	        if (inClass) {
	          re += '('
	          continue
	        }
	
	        if (!stateChar) {
	          re += '\\('
	          continue
	        }
	
	        patternListStack.push({
	          type: stateChar,
	          start: i - 1,
	          reStart: re.length,
	          open: plTypes[stateChar].open,
	          close: plTypes[stateChar].close
	        })
	        // negation is (?:(?!js)[^/]*)
	        re += stateChar === '!' ? '(?:(?!(?:' : '(?:'
	        this.debug('plType %j %j', stateChar, re)
	        stateChar = false
	      continue
	
	      case ')':
	        if (inClass || !patternListStack.length) {
	          re += '\\)'
	          continue
	        }
	
	        clearStateChar()
	        hasMagic = true
	        var pl = patternListStack.pop()
	        // negation is (?:(?!js)[^/]*)
	        // The others are (?:<pattern>)<type>
	        re += pl.close
	        if (pl.type === '!') {
	          negativeLists.push(pl)
	        }
	        pl.reEnd = re.length
	      continue
	
	      case '|':
	        if (inClass || !patternListStack.length || escaping) {
	          re += '\\|'
	          escaping = false
	          continue
	        }
	
	        clearStateChar()
	        re += '|'
	      continue
	
	      // these are mostly the same in regexp and glob
	      case '[':
	        // swallow any state-tracking char before the [
	        clearStateChar()
	
	        if (inClass) {
	          re += '\\' + c
	          continue
	        }
	
	        inClass = true
	        classStart = i
	        reClassStart = re.length
	        re += c
	      continue
	
	      case ']':
	        //  a right bracket shall lose its special
	        //  meaning and represent itself in
	        //  a bracket expression if it occurs
	        //  first in the list.  -- POSIX.2 2.8.3.2
	        if (i === classStart + 1 || !inClass) {
	          re += '\\' + c
	          escaping = false
	          continue
	        }
	
	        // handle the case where we left a class open.
	        // "[z-a]" is valid, equivalent to "\[z-a\]"
	        if (inClass) {
	          // split where the last [ was, make sure we don't have
	          // an invalid re. if so, re-walk the contents of the
	          // would-be class to re-translate any characters that
	          // were passed through as-is
	          // TODO: It would probably be faster to determine this
	          // without a try/catch and a new RegExp, but it's tricky
	          // to do safely.  For now, this is safe and works.
	          var cs = pattern.substring(classStart + 1, i)
	          try {
	            RegExp('[' + cs + ']')
	          } catch (er) {
	            // not a valid class!
	            var sp = this.parse(cs, SUBPARSE)
	            re = re.substr(0, reClassStart) + '\\[' + sp[0] + '\\]'
	            hasMagic = hasMagic || sp[1]
	            inClass = false
	            continue
	          }
	        }
	
	        // finish up the class.
	        hasMagic = true
	        inClass = false
	        re += c
	      continue
	
	      default:
	        // swallow any state char that wasn't consumed
	        clearStateChar()
	
	        if (escaping) {
	          // no need
	          escaping = false
	        } else if (reSpecials[c]
	          && !(c === '^' && inClass)) {
	          re += '\\'
	        }
	
	        re += c
	
	    } // switch
	  } // for
	
	  // handle the case where we left a class open.
	  // "[abc" is valid, equivalent to "\[abc"
	  if (inClass) {
	    // split where the last [ was, and escape it
	    // this is a huge pita.  We now have to re-walk
	    // the contents of the would-be class to re-translate
	    // any characters that were passed through as-is
	    cs = pattern.substr(classStart + 1)
	    sp = this.parse(cs, SUBPARSE)
	    re = re.substr(0, reClassStart) + '\\[' + sp[0]
	    hasMagic = hasMagic || sp[1]
	  }
	
	  // handle the case where we had a +( thing at the *end*
	  // of the pattern.
	  // each pattern list stack adds 3 chars, and we need to go through
	  // and escape any | chars that were passed through as-is for the regexp.
	  // Go through and escape them, taking care not to double-escape any
	  // | chars that were already escaped.
	  for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
	    var tail = re.slice(pl.reStart + pl.open.length)
	    this.debug('setting tail', re, pl)
	    // maybe some even number of \, then maybe 1 \, followed by a |
	    tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, function (_, $1, $2) {
	      if (!$2) {
	        // the | isn't already escaped, so escape it.
	        $2 = '\\'
	      }
	
	      // need to escape all those slashes *again*, without escaping the
	      // one that we need for escaping the | character.  As it works out,
	      // escaping an even number of slashes can be done by simply repeating
	      // it exactly after itself.  That's why this trick works.
	      //
	      // I am sorry that you have to see this.
	      return $1 + $1 + $2 + '|'
	    })
	
	    this.debug('tail=%j\n   %s', tail, tail, pl, re)
	    var t = pl.type === '*' ? star
	      : pl.type === '?' ? qmark
	      : '\\' + pl.type
	
	    hasMagic = true
	    re = re.slice(0, pl.reStart) + t + '\\(' + tail
	  }
	
	  // handle trailing things that only matter at the very end.
	  clearStateChar()
	  if (escaping) {
	    // trailing \\
	    re += '\\\\'
	  }
	
	  // only need to apply the nodot start if the re starts with
	  // something that could conceivably capture a dot
	  var addPatternStart = false
	  switch (re.charAt(0)) {
	    case '.':
	    case '[':
	    case '(': addPatternStart = true
	  }
	
	  // Hack to work around lack of negative lookbehind in JS
	  // A pattern like: *.!(x).!(y|z) needs to ensure that a name
	  // like 'a.xyz.yz' doesn't match.  So, the first negative
	  // lookahead, has to look ALL the way ahead, to the end of
	  // the pattern.
	  for (var n = negativeLists.length - 1; n > -1; n--) {
	    var nl = negativeLists[n]
	
	    var nlBefore = re.slice(0, nl.reStart)
	    var nlFirst = re.slice(nl.reStart, nl.reEnd - 8)
	    var nlLast = re.slice(nl.reEnd - 8, nl.reEnd)
	    var nlAfter = re.slice(nl.reEnd)
	
	    nlLast += nlAfter
	
	    // Handle nested stuff like *(*.js|!(*.json)), where open parens
	    // mean that we should *not* include the ) in the bit that is considered
	    // "after" the negated section.
	    var openParensBefore = nlBefore.split('(').length - 1
	    var cleanAfter = nlAfter
	    for (i = 0; i < openParensBefore; i++) {
	      cleanAfter = cleanAfter.replace(/\)[+*?]?/, '')
	    }
	    nlAfter = cleanAfter
	
	    var dollar = ''
	    if (nlAfter === '' && isSub !== SUBPARSE) {
	      dollar = '$'
	    }
	    var newRe = nlBefore + nlFirst + nlAfter + dollar + nlLast
	    re = newRe
	  }
	
	  // if the re is not "" at this point, then we need to make sure
	  // it doesn't match against an empty path part.
	  // Otherwise a/* will match a/, which it should not.
	  if (re !== '' && hasMagic) {
	    re = '(?=.)' + re
	  }
	
	  if (addPatternStart) {
	    re = patternStart + re
	  }
	
	  // parsing just a piece of a larger pattern.
	  if (isSub === SUBPARSE) {
	    return [re, hasMagic]
	  }
	
	  // skip the regexp for non-magical patterns
	  // unescape anything in it, though, so that it'll be
	  // an exact match against a file etc.
	  if (!hasMagic) {
	    return globUnescape(pattern)
	  }
	
	  var flags = options.nocase ? 'i' : ''
	  try {
	    var regExp = new RegExp('^' + re + '$', flags)
	  } catch (er) {
	    // If it was an invalid regular expression, then it can't match
	    // anything.  This trick looks for a character after the end of
	    // the string, which is of course impossible, except in multi-line
	    // mode, but it's not a /m regex.
	    return new RegExp('$.')
	  }
	
	  regExp._glob = pattern
	  regExp._src = re
	
	  return regExp
	}
	
	minimatch.makeRe = function (pattern, options) {
	  return new Minimatch(pattern, options || {}).makeRe()
	}
	
	Minimatch.prototype.makeRe = makeRe
	function makeRe () {
	  if (this.regexp || this.regexp === false) return this.regexp
	
	  // at this point, this.set is a 2d array of partial
	  // pattern strings, or "**".
	  //
	  // It's better to use .match().  This function shouldn't
	  // be used, really, but it's pretty convenient sometimes,
	  // when you just want to work with a regex.
	  var set = this.set
	
	  if (!set.length) {
	    this.regexp = false
	    return this.regexp
	  }
	  var options = this.options
	
	  var twoStar = options.noglobstar ? star
	    : options.dot ? twoStarDot
	    : twoStarNoDot
	  var flags = options.nocase ? 'i' : ''
	
	  var re = set.map(function (pattern) {
	    return pattern.map(function (p) {
	      return (p === GLOBSTAR) ? twoStar
	      : (typeof p === 'string') ? regExpEscape(p)
	      : p._src
	    }).join('\\\/')
	  }).join('|')
	
	  // must match entire pattern
	  // ending in a * or ** will make it less strict.
	  re = '^(?:' + re + ')$'
	
	  // can match anything, as long as it's not this.
	  if (this.negate) re = '^(?!' + re + ').*$'
	
	  try {
	    this.regexp = new RegExp(re, flags)
	  } catch (ex) {
	    this.regexp = false
	  }
	  return this.regexp
	}
	
	minimatch.match = function (list, pattern, options) {
	  options = options || {}
	  var mm = new Minimatch(pattern, options)
	  list = list.filter(function (f) {
	    return mm.match(f)
	  })
	  if (mm.options.nonull && !list.length) {
	    list.push(pattern)
	  }
	  return list
	}
	
	Minimatch.prototype.match = match
	function match (f, partial) {
	  this.debug('match', f, this.pattern)
	  // short-circuit in the case of busted things.
	  // comments, etc.
	  if (this.comment) return false
	  if (this.empty) return f === ''
	
	  if (f === '/' && partial) return true
	
	  var options = this.options
	
	  // windows: need to use /, not \
	  if (path.sep !== '/') {
	    f = f.split(path.sep).join('/')
	  }
	
	  // treat the test path as a set of pathparts.
	  f = f.split(slashSplit)
	  this.debug(this.pattern, 'split', f)
	
	  // just ONE of the pattern sets in this.set needs to match
	  // in order for it to be valid.  If negating, then just one
	  // match means that we have failed.
	  // Either way, return on the first hit.
	
	  var set = this.set
	  this.debug(this.pattern, 'set', set)
	
	  // Find the basename of the path by looking for the last non-empty segment
	  var filename
	  var i
	  for (i = f.length - 1; i >= 0; i--) {
	    filename = f[i]
	    if (filename) break
	  }
	
	  for (i = 0; i < set.length; i++) {
	    var pattern = set[i]
	    var file = f
	    if (options.matchBase && pattern.length === 1) {
	      file = [filename]
	    }
	    var hit = this.matchOne(file, pattern, partial)
	    if (hit) {
	      if (options.flipNegate) return true
	      return !this.negate
	    }
	  }
	
	  // didn't get any hits.  this is success if it's a negative
	  // pattern, failure otherwise.
	  if (options.flipNegate) return false
	  return this.negate
	}
	
	// set partial to true to test if, for example,
	// "/a/b" matches the start of "/*/b/*/d"
	// Partial means, if you run out of file before you run
	// out of pattern, then that's fine, as long as all
	// the parts match.
	Minimatch.prototype.matchOne = function (file, pattern, partial) {
	  var options = this.options
	
	  this.debug('matchOne',
	    { 'this': this, file: file, pattern: pattern })
	
	  this.debug('matchOne', file.length, pattern.length)
	
	  for (var fi = 0,
	      pi = 0,
	      fl = file.length,
	      pl = pattern.length
	      ; (fi < fl) && (pi < pl)
	      ; fi++, pi++) {
	    this.debug('matchOne loop')
	    var p = pattern[pi]
	    var f = file[fi]
	
	    this.debug(pattern, p, f)
	
	    // should be impossible.
	    // some invalid regexp stuff in the set.
	    if (p === false) return false
	
	    if (p === GLOBSTAR) {
	      this.debug('GLOBSTAR', [pattern, p, f])
	
	      // "**"
	      // a/**/b/**/c would match the following:
	      // a/b/x/y/z/c
	      // a/x/y/z/b/c
	      // a/b/x/b/x/c
	      // a/b/c
	      // To do this, take the rest of the pattern after
	      // the **, and see if it would match the file remainder.
	      // If so, return success.
	      // If not, the ** "swallows" a segment, and try again.
	      // This is recursively awful.
	      //
	      // a/**/b/**/c matching a/b/x/y/z/c
	      // - a matches a
	      // - doublestar
	      //   - matchOne(b/x/y/z/c, b/**/c)
	      //     - b matches b
	      //     - doublestar
	      //       - matchOne(x/y/z/c, c) -> no
	      //       - matchOne(y/z/c, c) -> no
	      //       - matchOne(z/c, c) -> no
	      //       - matchOne(c, c) yes, hit
	      var fr = fi
	      var pr = pi + 1
	      if (pr === pl) {
	        this.debug('** at the end')
	        // a ** at the end will just swallow the rest.
	        // We have found a match.
	        // however, it will not swallow /.x, unless
	        // options.dot is set.
	        // . and .. are *never* matched by **, for explosively
	        // exponential reasons.
	        for (; fi < fl; fi++) {
	          if (file[fi] === '.' || file[fi] === '..' ||
	            (!options.dot && file[fi].charAt(0) === '.')) return false
	        }
	        return true
	      }
	
	      // ok, let's see if we can swallow whatever we can.
	      while (fr < fl) {
	        var swallowee = file[fr]
	
	        this.debug('\nglobstar while', file, fr, pattern, pr, swallowee)
	
	        // XXX remove this slice.  Just pass the start index.
	        if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
	          this.debug('globstar found match!', fr, fl, swallowee)
	          // found a match.
	          return true
	        } else {
	          // can't swallow "." or ".." ever.
	          // can only swallow ".foo" when explicitly asked.
	          if (swallowee === '.' || swallowee === '..' ||
	            (!options.dot && swallowee.charAt(0) === '.')) {
	            this.debug('dot detected!', file, fr, pattern, pr)
	            break
	          }
	
	          // ** swallows a segment, and continue.
	          this.debug('globstar swallow a segment, and continue')
	          fr++
	        }
	      }
	
	      // no match was found.
	      // However, in partial mode, we can't say this is necessarily over.
	      // If there's more *pattern* left, then
	      if (partial) {
	        // ran out of file
	        this.debug('\n>>> no match, partial?', file, fr, pattern, pr)
	        if (fr === fl) return true
	      }
	      return false
	    }
	
	    // something other than **
	    // non-magic patterns just have to match exactly
	    // patterns with magic have been turned into regexps.
	    var hit
	    if (typeof p === 'string') {
	      if (options.nocase) {
	        hit = f.toLowerCase() === p.toLowerCase()
	      } else {
	        hit = f === p
	      }
	      this.debug('string match', p, f, hit)
	    } else {
	      hit = f.match(p)
	      this.debug('pattern match', p, f, hit)
	    }
	
	    if (!hit) return false
	  }
	
	  // Note: ending in / means that we'll get a final ""
	  // at the end of the pattern.  This can only match a
	  // corresponding "" at the end of the file.
	  // If the file ends in /, then it can only match a
	  // a pattern that ends in /, unless the pattern just
	  // doesn't have any more for it. But, a/b/ should *not*
	  // match "a/b/*", even though "" matches against the
	  // [^/]*? pattern, except in partial mode, where it might
	  // simply not be reached yet.
	  // However, a/b/ should still satisfy a/*
	
	  // now either we fell off the end of the pattern, or we're done.
	  if (fi === fl && pi === pl) {
	    // ran out of pattern and filename at the same time.
	    // an exact hit!
	    return true
	  } else if (fi === fl) {
	    // ran out of file, but still had pattern left.
	    // this is ok if we're doing the match as part of
	    // a glob fs traversal.
	    return partial
	  } else if (pi === pl) {
	    // ran out of pattern, still have file left.
	    // this is only acceptable if we're on the very last
	    // empty segment of a file with a trailing slash.
	    // a/* should match a/b/
	    var emptyFileEnd = (fi === fl - 1) && (file[fi] === '')
	    return emptyFileEnd
	  }
	
	  // should be unreachable.
	  throw new Error('wtf?')
	}
	
	// replace stuff like \* with *
	function globUnescape (s) {
	  return s.replace(/\\(.)/g, '$1')
	}
	
	function regExpEscape (s) {
	  return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
	}


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var crypto = __webpack_require__(36);
	var pathUtil = __webpack_require__(4);
	var Q = __webpack_require__(5);
	var inspect = __webpack_require__(35);
	var list = __webpack_require__(37);
	var validate = __webpack_require__(10);
	
	var validateInput = function (methodName, path, options) {
	  var methodSignature = methodName + '(path, [options])';
	  validate.argument(methodSignature, 'path', path, ['string']);
	  validate.options(methodSignature, 'options', options, {
	    checksum: ['string'],
	    relativePath: ['boolean'],
	    symlinks: ['string']
	  });
	
	  if (options && options.checksum !== undefined
	    && inspect.supportedChecksumAlgorithms.indexOf(options.checksum) === -1) {
	    throw new Error('Argument "options.checksum" passed to ' + methodSignature
	      + ' must have one of values: ' + inspect.supportedChecksumAlgorithms.join(', '));
	  }
	
	  if (options && options.symlinks !== undefined
	    && inspect.symlinkOptions.indexOf(options.symlinks) === -1) {
	    throw new Error('Argument "options.symlinks" passed to ' + methodSignature
	      + ' must have one of values: ' + inspect.symlinkOptions.join(', '));
	  }
	};
	
	var generateTreeNodeRelativePath = function (parent, path) {
	  if (!parent) {
	    return '.';
	  }
	  return parent.relativePath + '/' + pathUtil.basename(path);
	};
	
	// Creates checksum of a directory by using
	// checksums and names of all its children inside.
	var checksumOfDir = function (inspectList, algo) {
	  var hash = crypto.createHash(algo);
	  inspectList.forEach(function (inspectObj) {
	    hash.update(inspectObj.name + inspectObj[algo]);
	  });
	  return hash.digest('hex');
	};
	
	// ---------------------------------------------------------
	// Sync
	// ---------------------------------------------------------
	
	var inspectTreeNodeSync = function (path, options, parent) {
	  var treeBranch = inspect.sync(path, options);
	
	  if (treeBranch) {
	    if (options.relativePath) {
	      treeBranch.relativePath = generateTreeNodeRelativePath(parent, path);
	    }
	
	    if (treeBranch.type === 'dir') {
	      treeBranch.size = 0;
	      treeBranch.children = list.sync(path).map(function (filename) {
	        var subBranchPath = pathUtil.join(path, filename);
	        var treeSubBranch = inspectTreeNodeSync(subBranchPath, options, treeBranch);
	        // Add together all childrens' size to get directory combined size.
	        treeBranch.size += treeSubBranch.size || 0;
	        return treeSubBranch;
	      });
	
	      if (options.checksum) {
	        treeBranch[options.checksum] = checksumOfDir(treeBranch.children, options.checksum);
	      }
	    }
	  }
	
	  return treeBranch;
	};
	
	var inspectTreeSync = function (path, options) {
	  options = options || {};
	
	  return inspectTreeNodeSync(path, options, undefined);
	};
	
	// ---------------------------------------------------------
	// Async
	// ---------------------------------------------------------
	
	var inspectTreeNodeAsync = function (path, options, parent) {
	  var deferred = Q.defer();
	
	  var inspectAllChildren = function (treeBranch) {
	    var subDirDeferred = Q.defer();
	
	    list.async(path).then(function (children) {
	      var doNext = function (index) {
	        var subPath;
	        if (index === children.length) {
	          if (options.checksum) {
	            // We are done, but still have to calculate checksum of whole directory.
	            treeBranch[options.checksum] = checksumOfDir(treeBranch.children, options.checksum);
	          }
	          subDirDeferred.resolve();
	        } else {
	          subPath = pathUtil.join(path, children[index]);
	          inspectTreeNodeAsync(subPath, options, treeBranch)
	          .then(function (treeSubBranch) {
	            children[index] = treeSubBranch;
	            treeBranch.size += treeSubBranch.size || 0;
	            doNext(index + 1);
	          })
	          .catch(subDirDeferred.reject);
	        }
	      };
	
	      treeBranch.children = children;
	      treeBranch.size = 0;
	
	      doNext(0);
	    });
	
	    return subDirDeferred.promise;
	  };
	
	  inspect.async(path, options)
	  .then(function (treeBranch) {
	    if (!treeBranch) {
	      // Given path doesn't exist. We are done.
	      deferred.resolve(treeBranch);
	    } else {
	      if (options.relativePath) {
	        treeBranch.relativePath = generateTreeNodeRelativePath(parent, path);
	      }
	
	      if (treeBranch.type !== 'dir') {
	        deferred.resolve(treeBranch);
	      } else {
	        inspectAllChildren(treeBranch)
	        .then(function () {
	          deferred.resolve(treeBranch);
	        })
	        .catch(deferred.reject);
	      }
	    }
	  })
	  .catch(deferred.reject);
	
	  return deferred.promise;
	};
	
	var inspectTreeAsync = function (path, options) {
	  options = options || {};
	
	  return inspectTreeNodeAsync(path, options);
	};
	
	// ---------------------------------------------------------
	// API
	// ---------------------------------------------------------
	
	exports.validateInput = validateInput;
	exports.sync = inspectTreeSync;
	exports.async = inspectTreeAsync;


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var pathUtil = __webpack_require__(4);
	var fs = __webpack_require__(7);
	var Q = __webpack_require__(5);
	var mkdirp = __webpack_require__(9);
	
	var exists = __webpack_require__(42);
	var matcher = __webpack_require__(38);
	var fileMode = __webpack_require__(30);
	var treeWalker = __webpack_require__(33);
	var validate = __webpack_require__(10);
	var write = __webpack_require__(8);
	
	var validateInput = function (methodName, from, to, options) {
	  var methodSignature = methodName + '(from, to, [options])';
	  validate.argument(methodSignature, 'from', from, ['string']);
	  validate.argument(methodSignature, 'to', to, ['string']);
	  validate.options(methodSignature, 'options', options, {
	    overwrite: ['boolean'],
	    matching: ['string', 'array of string']
	  });
	};
	
	var parseOptions = function (options, from) {
	  var opts = options || {};
	  var parsedOptions = {};
	
	  parsedOptions.overwrite = opts.overwrite;
	
	  if (opts.matching) {
	    parsedOptions.allowedToCopy = matcher.create(from, opts.matching);
	  } else {
	    parsedOptions.allowedToCopy = function () {
	      // Default behaviour - copy everything.
	      return true;
	    };
	  }
	
	  return parsedOptions;
	};
	
	var generateNoSourceError = function (path) {
	  var err = new Error("Path to copy doesn't exist " + path);
	  err.code = 'ENOENT';
	  return err;
	};
	
	var generateDestinationExistsError = function (path) {
	  var err = new Error('Destination path already exists ' + path);
	  err.code = 'EEXIST';
	  return err;
	};
	
	// ---------------------------------------------------------
	// Sync
	// ---------------------------------------------------------
	
	var checksBeforeCopyingSync = function (from, to, opts) {
	  if (!exists.sync(from)) {
	    throw generateNoSourceError(from);
	  }
	
	  if (exists.sync(to) && !opts.overwrite) {
	    throw generateDestinationExistsError(to);
	  }
	};
	
	var copyFileSync = function (from, to, mode) {
	  var data = fs.readFileSync(from);
	  write.sync(to, data, { mode: mode });
	};
	
	var copySymlinkSync = function (from, to) {
	  var symlinkPointsAt = fs.readlinkSync(from);
	  try {
	    fs.symlinkSync(symlinkPointsAt, to);
	  } catch (err) {
	    // There is already file/symlink with this name on destination location.
	    // Must erase it manually, otherwise system won't allow us to place symlink there.
	    if (err.code === 'EEXIST') {
	      fs.unlinkSync(to);
	      // Retry...
	      fs.symlinkSync(symlinkPointsAt, to);
	    } else {
	      throw err;
	    }
	  }
	};
	
	var copyItemSync = function (from, inspectData, to) {
	  var mode = fileMode.normalizeFileMode(inspectData.mode);
	  if (inspectData.type === 'dir') {
	    mkdirp.sync(to, { mode: mode });
	  } else if (inspectData.type === 'file') {
	    copyFileSync(from, to, mode);
	  } else if (inspectData.type === 'symlink') {
	    copySymlinkSync(from, to);
	  }
	};
	
	var copySync = function (from, to, options) {
	  var opts = parseOptions(options, from);
	
	  checksBeforeCopyingSync(from, to, opts);
	
	  treeWalker.sync(from, {
	    inspectOptions: {
	      mode: true,
	      symlinks: true
	    }
	  }, function (path, inspectData) {
	    var rel = pathUtil.relative(from, path);
	    var destPath = pathUtil.resolve(to, rel);
	    if (opts.allowedToCopy(path)) {
	      copyItemSync(path, inspectData, destPath);
	    }
	  });
	};
	
	// ---------------------------------------------------------
	// Async
	// ---------------------------------------------------------
	
	var promisedSymlink = Q.denodeify(fs.symlink);
	var promisedReadlink = Q.denodeify(fs.readlink);
	var promisedUnlink = Q.denodeify(fs.unlink);
	var promisedMkdirp = Q.denodeify(mkdirp);
	
	var checksBeforeCopyingAsync = function (from, to, opts) {
	  return exists.async(from)
	  .then(function (srcPathExists) {
	    if (!srcPathExists) {
	      throw generateNoSourceError(from);
	    } else {
	      return exists.async(to);
	    }
	  })
	  .then(function (destPathExists) {
	    if (destPathExists && !opts.overwrite) {
	      throw generateDestinationExistsError(to);
	    }
	  });
	};
	
	var copyFileAsync = function (from, to, mode, retriedAttempt) {
	  var deferred = Q.defer();
	
	  var readStream = fs.createReadStream(from);
	  var writeStream = fs.createWriteStream(to, { mode: mode });
	
	  readStream.on('error', deferred.reject);
	
	  writeStream.on('error', function (err) {
	    var toDirPath = pathUtil.dirname(to);
	
	    // Force read stream to close, since write stream errored
	    // read stream serves us no purpose.
	    readStream.resume();
	
	    if (err.code === 'ENOENT' && retriedAttempt === undefined) {
	      // Some parent directory doesn't exits. Create it and retry.
	      promisedMkdirp(toDirPath).then(function () {
	        // Make retry attempt only once to prevent vicious infinite loop
	        // (when for some obscure reason I/O will keep returning ENOENT error).
	        // Passing retriedAttempt = true.
	        copyFileAsync(from, to, mode, true)
	        .then(deferred.resolve)
	        .catch(deferred.reject);
	      });
	    } else {
	      deferred.reject(err);
	    }
	  });
	
	  writeStream.on('finish', deferred.resolve);
	
	  readStream.pipe(writeStream);
	
	  return deferred.promise;
	};
	
	var copySymlinkAsync = function (from, to) {
	  return promisedReadlink(from)
	  .then(function (symlinkPointsAt) {
	    var deferred = Q.defer();
	
	    promisedSymlink(symlinkPointsAt, to)
	    .then(deferred.resolve)
	    .catch(function (err) {
	      if (err.code === 'EEXIST') {
	        // There is already file/symlink with this name on destination location.
	        // Must erase it manually, otherwise system won't allow us to place symlink there.
	        promisedUnlink(to)
	        .then(function () {
	          // Retry...
	          return promisedSymlink(symlinkPointsAt, to);
	        })
	        .then(deferred.resolve, deferred.reject);
	      } else {
	        deferred.reject(err);
	      }
	    });
	
	    return deferred.promise;
	  });
	};
	
	var copyItemAsync = function (from, inspectData, to) {
	  var mode = fileMode.normalizeFileMode(inspectData.mode);
	  if (inspectData.type === 'dir') {
	    return promisedMkdirp(to, { mode: mode });
	  } else if (inspectData.type === 'file') {
	    return copyFileAsync(from, to, mode);
	  } else if (inspectData.type === 'symlink') {
	    return copySymlinkAsync(from, to);
	  }
	  // Ha! This is none of supported file system entities. What now?
	  // Just continuing without actually copying sounds sane.
	  return new Q();
	};
	
	var copyAsync = function (from, to, options) {
	  var deferred = Q.defer();
	  var opts = parseOptions(options, from);
	
	  checksBeforeCopyingAsync(from, to, opts)
	  .then(function () {
	    var allFilesDelivered = false;
	    var filesInProgress = 0;
	
	    var stream = treeWalker.stream(from, {
	      inspectOptions: {
	        mode: true,
	        symlinks: true
	      }
	    })
	    .on('readable', function () {
	      var item = stream.read();
	      var rel;
	      var destPath;
	      if (item) {
	        rel = pathUtil.relative(from, item.path);
	        destPath = pathUtil.resolve(to, rel);
	        if (opts.allowedToCopy(item.path)) {
	          filesInProgress += 1;
	          copyItemAsync(item.path, item.item, destPath)
	          .then(function () {
	            filesInProgress -= 1;
	            if (allFilesDelivered && filesInProgress === 0) {
	              deferred.resolve();
	            }
	          })
	          .catch(deferred.reject);
	        }
	      }
	    })
	    .on('error', deferred.reject)
	    .on('end', function () {
	      allFilesDelivered = true;
	      if (allFilesDelivered && filesInProgress === 0) {
	        deferred.resolve();
	      }
	    });
	  })
	  .catch(deferred.reject);
	
	  return deferred.promise;
	};
	
	// ---------------------------------------------------------
	// API
	// ---------------------------------------------------------
	
	exports.validateInput = validateInput;
	exports.sync = copySync;
	exports.async = copyAsync;


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var fs = __webpack_require__(7);
	var Q = __webpack_require__(5);
	var validate = __webpack_require__(10);
	
	var validateInput = function (methodName, path) {
	  var methodSignature = methodName + '(path)';
	  validate.argument(methodSignature, 'path', path, ['string']);
	};
	
	// ---------------------------------------------------------
	// Sync
	// ---------------------------------------------------------
	
	var existsSync = function (path) {
	  var stat;
	  try {
	    stat = fs.statSync(path);
	    if (stat.isDirectory()) {
	      return 'dir';
	    } else if (stat.isFile()) {
	      return 'file';
	    }
	    return 'other';
	  } catch (err) {
	    if (err.code !== 'ENOENT') {
	      throw err;
	    }
	  }
	
	  return false;
	};
	
	// ---------------------------------------------------------
	// Async
	// ---------------------------------------------------------
	
	var existsAsync = function (path) {
	  var deferred = Q.defer();
	
	  fs.stat(path, function (err, stat) {
	    if (err) {
	      if (err.code === 'ENOENT') {
	        deferred.resolve(false);
	      } else {
	        deferred.reject(err);
	      }
	    } else if (stat.isDirectory()) {
	      deferred.resolve('dir');
	    } else if (stat.isFile()) {
	      deferred.resolve('file');
	    } else {
	      deferred.resolve('other');
	    }
	  });
	
	  return deferred.promise;
	};
	
	// ---------------------------------------------------------
	// API
	// ---------------------------------------------------------
	
	exports.validateInput = validateInput;
	exports.sync = existsSync;
	exports.async = existsAsync;


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var pathUtil = __webpack_require__(4);
	var fs = __webpack_require__(7);
	var Q = __webpack_require__(5);
	var mkdirp = __webpack_require__(9);
	var exists = __webpack_require__(42);
	var validate = __webpack_require__(10);
	
	var validateInput = function (methodName, from, to) {
	  var methodSignature = methodName + '(from, to)';
	  validate.argument(methodSignature, 'from', from, ['string']);
	  validate.argument(methodSignature, 'to', to, ['string']);
	};
	
	var generateSourceDoesntExistError = function (path) {
	  var err = new Error("Path to move doesn't exist " + path);
	  err.code = 'ENOENT';
	  return err;
	};
	
	// ---------------------------------------------------------
	// Sync
	// ---------------------------------------------------------
	
	var moveSync = function (from, to) {
	  try {
	    fs.renameSync(from, to);
	  } catch (err) {
	    if (err.code !== 'ENOENT') {
	      // We can't make sense of this error. Rethrow it.
	      throw err;
	    } else {
	      // Ok, source or destination path doesn't exist.
	      // Must do more investigation.
	      if (!exists.sync(from)) {
	        throw generateSourceDoesntExistError(from);
	      }
	      if (!exists.sync(to)) {
	        // Some parent directory doesn't exist. Create it.
	        mkdirp.sync(pathUtil.dirname(to));
	        // Retry the attempt
	        fs.renameSync(from, to);
	      }
	    }
	  }
	};
	
	// ---------------------------------------------------------
	// Async
	// ---------------------------------------------------------
	
	var promisedRename = Q.denodeify(fs.rename);
	var promisedMkdirp = Q.denodeify(mkdirp);
	
	var ensureDestinationPathExistsAsync = function (to) {
	  var deferred = Q.defer();
	
	  var destDir = pathUtil.dirname(to);
	  exists.async(destDir)
	  .then(function (dstExists) {
	    if (!dstExists) {
	      promisedMkdirp(destDir)
	      .then(deferred.resolve, deferred.reject);
	    } else {
	      // Hah, no idea.
	      deferred.reject();
	    }
	  })
	  .catch(deferred.reject);
	
	  return deferred.promise;
	};
	
	var moveAsync = function (from, to) {
	  var deferred = Q.defer();
	
	  promisedRename(from, to)
	  .then(deferred.resolve)
	  .catch(function (err) {
	    if (err.code !== 'ENOENT') {
	      // Something unknown. Rethrow original error.
	      deferred.reject(err);
	    } else {
	      // Ok, source or destination path doesn't exist.
	      // Must do more investigation.
	      exists.async(from)
	      .then(function (srcExists) {
	        if (!srcExists) {
	          deferred.reject(generateSourceDoesntExistError(from));
	        } else {
	          ensureDestinationPathExistsAsync(to)
	          .then(function () {
	            // Retry the attempt
	            return promisedRename(from, to);
	          })
	          .then(deferred.resolve, deferred.reject);
	        }
	      })
	      .catch(deferred.reject);
	    }
	  });
	
	  return deferred.promise;
	};
	
	// ---------------------------------------------------------
	// API
	// ---------------------------------------------------------
	
	exports.validateInput = validateInput;
	exports.sync = moveSync;
	exports.async = moveAsync;


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	/* eslint no-console:1 */
	
	'use strict';
	
	var fs = __webpack_require__(7);
	var Q = __webpack_require__(5);
	var validate = __webpack_require__(10);
	
	var supportedReturnAs = ['utf8', 'buffer', 'json', 'jsonWithDates'];
	
	var validateInput = function (methodName, path, returnAs) {
	  var methodSignature = methodName + '(path, returnAs)';
	  validate.argument(methodSignature, 'path', path, ['string']);
	  validate.argument(methodSignature, 'returnAs', returnAs, ['string', 'undefined']);
	
	  if (returnAs && supportedReturnAs.indexOf(returnAs) === -1) {
	    throw new Error('Argument "returnAs" passed to ' + methodSignature
	      + ' must have one of values: ' + supportedReturnAs.join(', '));
	  }
	};
	
	// Matches strings generated by Date.toJSON()
	// which is called to serialize date to JSON.
	var jsonDateParser = function (key, value) {
	  var reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
	  if (typeof value === 'string') {
	    if (reISO.exec(value)) {
	      return new Date(value);
	    }
	  }
	  return value;
	};
	
	var makeNicerJsonParsingError = function (path, err) {
	  var nicerError = new Error('JSON parsing failed while reading '
	  + path + ' [' + err + ']');
	  nicerError.originalError = err;
	  return nicerError;
	};
	
	// ---------------------------------------------------------
	// SYNC
	// ---------------------------------------------------------
	
	var readSync = function (path, returnAs) {
	  var retAs = returnAs || 'utf8';
	  var data;
	
	  var encoding = 'utf8';
	  if (retAs === 'buffer') {
	    encoding = null;
	  }
	
	  try {
	    data = fs.readFileSync(path, { encoding: encoding });
	  } catch (err) {
	    if (err.code === 'ENOENT') {
	      // If file doesn't exist return undefined instead of throwing.
	      return undefined;
	    }
	    // Otherwise rethrow the error
	    throw err;
	  }
	
	  try {
	    if (retAs === 'json') {
	      data = JSON.parse(data);
	    } else if (retAs === 'jsonWithDates') {
	      data = JSON.parse(data, jsonDateParser);
	    }
	  } catch (err) {
	    throw makeNicerJsonParsingError(path, err);
	  }
	
	  return data;
	};
	
	// ---------------------------------------------------------
	// ASYNC
	// ---------------------------------------------------------
	
	var promisedReadFile = Q.denodeify(fs.readFile);
	
	var readAsync = function (path, returnAs) {
	  var deferred = Q.defer();
	
	  var retAs = returnAs || 'utf8';
	  var encoding = 'utf8';
	  if (retAs === 'buffer') {
	    encoding = null;
	  }
	
	  promisedReadFile(path, { encoding: encoding })
	  .then(function (data) {
	    // Make final parsing of the data before returning.
	    try {
	      if (retAs === 'json') {
	        deferred.resolve(JSON.parse(data));
	      } else if (retAs === 'jsonWithDates') {
	        deferred.resolve(JSON.parse(data, jsonDateParser));
	      } else {
	        deferred.resolve(data);
	      }
	    } catch (err) {
	      deferred.reject(makeNicerJsonParsingError(path, err));
	    }
	  })
	  .catch(function (err) {
	    if (err.code === 'ENOENT') {
	      // If file doesn't exist return undefined instead of throwing.
	      deferred.resolve(undefined);
	    } else {
	      // Otherwise throw
	      deferred.reject(err);
	    }
	  });
	
	  return deferred.promise;
	};
	
	// ---------------------------------------------------------
	// API
	// ---------------------------------------------------------
	
	exports.validateInput = validateInput;
	exports.sync = readSync;
	exports.async = readAsync;


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Q = __webpack_require__(5);
	var rimraf = __webpack_require__(12);
	
	var validate = __webpack_require__(10);
	
	var validateInput = function (methodName, path) {
	  var methodSignature = methodName + '([path])';
	  validate.argument(methodSignature, 'path', path, ['string', 'undefined']);
	};
	
	// ---------------------------------------------------------
	// Sync
	// ---------------------------------------------------------
	
	var removeSync = function (path) {
	  rimraf.sync(path);
	};
	
	// ---------------------------------------------------------
	// Async
	// ---------------------------------------------------------
	
	var qRimraf = Q.denodeify(rimraf);
	
	var removeAsync = function (path) {
	  return qRimraf(path);
	};
	
	// ---------------------------------------------------------
	// API
	// ---------------------------------------------------------
	
	exports.validateInput = validateInput;
	exports.sync = removeSync;
	exports.async = removeAsync;


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var pathUtil = __webpack_require__(4);
	var move = __webpack_require__(43);
	var validate = __webpack_require__(10);
	
	var validateInput = function (methodName, path, newName) {
	  var methodSignature = methodName + '(path, newName)';
	  validate.argument(methodSignature, 'path', path, ['string']);
	  validate.argument(methodSignature, 'newName', newName, ['string']);
	};
	
	// ---------------------------------------------------------
	// Sync
	// ---------------------------------------------------------
	
	var renameSync = function (path, newName) {
	  var newPath = pathUtil.join(pathUtil.dirname(path), newName);
	  move.sync(path, newPath);
	};
	
	// ---------------------------------------------------------
	// Async
	// ---------------------------------------------------------
	
	var renameAsync = function (path, newName) {
	  var newPath = pathUtil.join(pathUtil.dirname(path), newName);
	  return move.async(path, newPath);
	};
	
	// ---------------------------------------------------------
	// API
	// ---------------------------------------------------------
	
	exports.validateInput = validateInput;
	exports.sync = renameSync;
	exports.async = renameAsync;


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Q = __webpack_require__(5);
	var fs = __webpack_require__(7);
	var mkdirp = __webpack_require__(9);
	var pathUtil = __webpack_require__(4);
	var validate = __webpack_require__(10);
	
	var validateInput = function (methodName, symlinkValue, path) {
	  var methodSignature = methodName + '(symlinkValue, path)';
	  validate.argument(methodSignature, 'symlinkValue', symlinkValue, ['string']);
	  validate.argument(methodSignature, 'path', path, ['string']);
	};
	
	// ---------------------------------------------------------
	// Sync
	// ---------------------------------------------------------
	
	var symlinkSync = function (symlinkValue, path) {
	  try {
	    fs.symlinkSync(symlinkValue, path);
	  } catch (err) {
	    if (err.code === 'ENOENT') {
	      // Parent directories don't exist. Just create them and rety.
	      mkdirp.sync(pathUtil.dirname(path));
	      fs.symlinkSync(symlinkValue, path);
	    } else {
	      throw err;
	    }
	  }
	};
	
	// ---------------------------------------------------------
	// Async
	// ---------------------------------------------------------
	
	var promisedSymlink = Q.denodeify(fs.symlink);
	var promisedMkdirp = Q.denodeify(mkdirp);
	
	var symlinkAsync = function (symlinkValue, path) {
	  var deferred = Q.defer();
	
	  promisedSymlink(symlinkValue, path)
	  .then(deferred.resolve)
	  .catch(function (err) {
	    if (err.code === 'ENOENT') {
	      // Parent directories don't exist. Just create them and rety.
	      promisedMkdirp(pathUtil.dirname(path))
	      .then(function () {
	        return promisedSymlink(symlinkValue, path);
	      })
	      .then(deferred.resolve, deferred.reject);
	    } else {
	      deferred.reject(err);
	    }
	  });
	
	  return deferred.promise;
	};
	
	// ---------------------------------------------------------
	// API
	// ---------------------------------------------------------
	
	exports.validateInput = validateInput;
	exports.sync = symlinkSync;
	exports.async = symlinkAsync;


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var fs = __webpack_require__(7);
	
	exports.createWriteStream = fs.createWriteStream;
	exports.createReadStream = fs.createReadStream;


/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMjExYjA0MzFlOWZhODhhMDMxN2UiLCJ3ZWJwYWNrOi8vLy4vc3JjL21haW4uanMiLCJ3ZWJwYWNrOi8vLy4vfi9mcy1qZXRwYWNrL21haW4uanMiLCJ3ZWJwYWNrOi8vLy4vfi9mcy1qZXRwYWNrL2xpYi9qZXRwYWNrLmpzIiwid2VicGFjazovLy9leHRlcm5hbCBcInV0aWxcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJwYXRoXCIiLCJ3ZWJwYWNrOi8vLy4vfi9xL3EuanMiLCJ3ZWJwYWNrOi8vLy4vfi9mcy1qZXRwYWNrL2xpYi9hcHBlbmQuanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZnNcIiIsIndlYnBhY2s6Ly8vLi9+L2ZzLWpldHBhY2svbGliL3dyaXRlLmpzIiwid2VicGFjazovLy8uL34vbWtkaXJwL2luZGV4LmpzIiwid2VicGFjazovLy8uL34vZnMtamV0cGFjay9saWIvdXRpbHMvdmFsaWRhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vfi9mcy1qZXRwYWNrL2xpYi9kaXIuanMiLCJ3ZWJwYWNrOi8vLy4vfi9yaW1yYWYvcmltcmFmLmpzIiwid2VicGFjazovLy9leHRlcm5hbCBcImFzc2VydFwiIiwid2VicGFjazovLy8uL34vZ2xvYi9nbG9iLmpzIiwid2VicGFjazovLy8uL34vZnMucmVhbHBhdGgvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vfi9mcy5yZWFscGF0aC9vbGQuanMiLCJ3ZWJwYWNrOi8vLy4vfi9nbG9iL34vbWluaW1hdGNoL21pbmltYXRjaC5qcyIsIndlYnBhY2s6Ly8vLi9+L2JyYWNlLWV4cGFuc2lvbi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvbmNhdC1tYXAvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vfi9iYWxhbmNlZC1tYXRjaC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L2luaGVyaXRzL2luaGVyaXRzLmpzIiwid2VicGFjazovLy8uL34vaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJldmVudHNcIiIsIndlYnBhY2s6Ly8vLi9+L3BhdGgtaXMtYWJzb2x1dGUvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vfi9nbG9iL3N5bmMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9nbG9iL2NvbW1vbi5qcyIsIndlYnBhY2s6Ly8vLi9+L2luZmxpZ2h0L2luZmxpZ2h0LmpzIiwid2VicGFjazovLy8uL34vd3JhcHB5L3dyYXBweS5qcyIsIndlYnBhY2s6Ly8vLi9+L29uY2Uvb25jZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2ZzLWpldHBhY2svbGliL3V0aWxzL21vZGUuanMiLCJ3ZWJwYWNrOi8vLy4vfi9mcy1qZXRwYWNrL2xpYi9maWxlLmpzIiwid2VicGFjazovLy8uL34vZnMtamV0cGFjay9saWIvZmluZC5qcyIsIndlYnBhY2s6Ly8vLi9+L2ZzLWpldHBhY2svbGliL3V0aWxzL3RyZWVfd2Fsa2VyLmpzIiwid2VicGFjazovLy9leHRlcm5hbCBcInN0cmVhbVwiIiwid2VicGFjazovLy8uL34vZnMtamV0cGFjay9saWIvaW5zcGVjdC5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJjcnlwdG9cIiIsIndlYnBhY2s6Ly8vLi9+L2ZzLWpldHBhY2svbGliL2xpc3QuanMiLCJ3ZWJwYWNrOi8vLy4vfi9mcy1qZXRwYWNrL2xpYi91dGlscy9tYXRjaGVyLmpzIiwid2VicGFjazovLy8uL34vZnMtamV0cGFjay9+L21pbmltYXRjaC9taW5pbWF0Y2guanMiLCJ3ZWJwYWNrOi8vLy4vfi9mcy1qZXRwYWNrL2xpYi9pbnNwZWN0X3RyZWUuanMiLCJ3ZWJwYWNrOi8vLy4vfi9mcy1qZXRwYWNrL2xpYi9jb3B5LmpzIiwid2VicGFjazovLy8uL34vZnMtamV0cGFjay9saWIvZXhpc3RzLmpzIiwid2VicGFjazovLy8uL34vZnMtamV0cGFjay9saWIvbW92ZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2ZzLWpldHBhY2svbGliL3JlYWQuanMiLCJ3ZWJwYWNrOi8vLy4vfi9mcy1qZXRwYWNrL2xpYi9yZW1vdmUuanMiLCJ3ZWJwYWNrOi8vLy4vfi9mcy1qZXRwYWNrL2xpYi9yZW5hbWUuanMiLCJ3ZWJwYWNrOi8vLy4vfi9mcy1qZXRwYWNrL2xpYi9zeW1saW5rLmpzIiwid2VicGFjazovLy8uL34vZnMtamV0cGFjay9saWIvc3RyZWFtcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7c0NDdENvQixDQUFZOzs7O0FBRWhDLFNBQVEsQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDLE1BQU0sR0FBRyxVQUFDLEVBQUUsRUFBSztBQUM5QyxLQUFFLENBQUMsY0FBYyxFQUFFO0VBQ3BCOztBQUVELFNBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLFVBQUMsRUFBRSxFQUFLO0FBQzdCLE9BQUksSUFBSSxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUk7QUFDeEMsS0FBRSxDQUFDLGNBQWMsRUFBRTs7QUFFbkIsT0FBSSxJQUFJLEdBQUcsdUJBQVEsSUFBSSxDQUFDLElBQUksQ0FBQzs7QUFFN0IsVUFBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDOztBQUV2QixPQUFJLE1BQU0sR0FBRyxJQUFJLFNBQVMsRUFBRSxDQUFDO0FBQzdCLE9BQUksR0FBRyxHQUFHLE1BQU0sQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLGlCQUFpQixDQUFDLENBQUM7QUFDMUQsT0FBSSxHQUFHLEdBQUcsR0FBRyxDQUFDLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFNUMsUUFBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsRUFBRSxVQUFDLEVBQUUsRUFBSztBQUM5RCxPQUFFLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUM7SUFDakMsQ0FBQzs7QUFFRiwwQkFBUSxLQUFLLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxTQUFTLENBQUM7RUFDbkMsQzs7Ozs7O0FDdkJEOztBQUVBOztBQUVBOzs7Ozs7O0FDSkE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUNqUUEsa0M7Ozs7OztBQ0FBLGtDOzs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsTUFBSztBQUNMO0FBQ0E7O0FBRUEsRUFBQztBQUNEOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEVBQUM7QUFDRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBLGVBQWMsZ0JBQWdCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esd0JBQXVCLGlCQUFpQjtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE2QixLQUFLO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esb0JBQW1CLGtCQUFrQjtBQUNyQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxZQUFXLFNBQVM7QUFDcEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGtCQUFpQix5QkFBeUI7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0RBQStDO0FBQy9DO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTBDO0FBQzFDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUJBQW9CO0FBQ3BCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQSxnQ0FBK0I7QUFDL0I7QUFDQTtBQUNBLHlEQUF3RDtBQUN4RDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYixVQUFTOztBQUVUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2IsVUFBUztBQUNUOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxxQkFBb0IsU0FBUztBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHFCQUFvQjtBQUNwQixtQkFBa0I7QUFDbEIseUJBQXdCO0FBQ3hCLHFCQUFvQjs7QUFFcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYixjQUFhO0FBQ2IsY0FBYSxLQUFLO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBLG9CQUFtQixZQUFZO0FBQy9CLGNBQWEsS0FBSztBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQVk7QUFDWjtBQUNBLCtDQUE4QyxTQUFTO0FBQ3ZEO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQW9CO0FBQ3BCO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHNCQUFxQjtBQUNyQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsVUFBUztBQUNULE1BQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVcsU0FBUztBQUNwQixjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxtQ0FBa0MsY0FBYyxFQUFFO0FBQ2xEOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG1DQUFrQyxjQUFjLEVBQUU7QUFDbEQ7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBLE1BQUs7QUFDTCxpQkFBZ0I7QUFDaEIsTUFBSzs7QUFFTDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTCxpQkFBZ0I7QUFDaEIsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBLE1BQUs7QUFDTDtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUk7QUFDSjtBQUNBO0FBQ0EsWUFBVyxTQUFTO0FBQ3BCLGNBQWEsU0FBUztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQW9CLFFBQVE7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFXLE9BQU87QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0E7QUFDQSwwQ0FBeUMsZ0NBQWdDO0FBQ3pFO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBVyxPQUFPO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQSxNQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBLFVBQVM7QUFDVCxNQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVcsWUFBWTtBQUN2QjtBQUNBLGNBQWEsYUFBYTtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1QsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVyxLQUFLO0FBQ2hCLFlBQVcsU0FBUztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVcsS0FBSztBQUNoQixZQUFXLFNBQVM7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVyxLQUFLO0FBQ2hCLFlBQVcsU0FBUztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVCxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNULE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFXLEtBQUs7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBVyxLQUFLO0FBQ2hCLFlBQVcsT0FBTztBQUNsQixZQUFXLEtBQUs7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVcsS0FBSztBQUNoQixZQUFXLE9BQU87QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFXLE9BQU87QUFDbEIsWUFBVyxNQUFNLHNDQUFzQztBQUN2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFXLE9BQU87QUFDbEIsbURBQWtEO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFXLFNBQVM7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2IsVUFBUztBQUNUO0FBQ0E7QUFDQSxjQUFhO0FBQ2IsVUFBUztBQUNULE1BQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUEsRUFBQzs7Ozs7OztBQy8vREQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7O0FDaEVBLGdDOzs7Ozs7QUNBQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUFzQyxrQkFBa0I7QUFDeEQ7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQTZDLGtCQUFrQjtBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7O0FDM0lBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBZ0I7QUFDaEI7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQSxpQkFBZ0I7QUFDaEI7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQ2pHQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUMzSEE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxzQkFBcUIsc0JBQXNCO0FBQzNDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBLElBQUc7QUFDSDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsZ0NBQStCLHNCQUFzQjtBQUNyRDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7Ozs7OztBQzlNQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsUUFBTztBQUNQLE1BQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTCxJQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1AsSUFBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1AsTUFBSztBQUNMLElBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsa0JBQWlCLG9CQUFvQjtBQUNyQzs7QUFFQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDs7Ozs7OztBQzFXQSxvQzs7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMEJBQXlCO0FBQ3pCOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBLGtCQUFpQixtQkFBbUI7QUFDcEM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxpQ0FBZ0MscUJBQXFCO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLGtCQUFpQixPQUFPO0FBQ3hCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1QsUUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGtCQUFpQix5QkFBeUI7QUFDMUM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTCxJQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUIsZUFBZTtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFxQixlQUFlO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxrQkFBaUIsb0JBQW9CO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxvQkFBbUIsU0FBUztBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQixTQUFTO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW1CLG9CQUFvQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGtCQUFpQixTQUFTO0FBQzFCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1AsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQ3Z4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUJBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUM7QUFDRDtBQUNBOztBQUVBO0FBQ0E7QUFDQSwyQ0FBMEMsRUFBRTtBQUM1QyxFQUFDO0FBQ0Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EscUJBQW9CO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EscUJBQW9CO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQLE1BQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQLE1BQUs7QUFDTDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQzlTQTtBQUNBOztBQUVBLGFBQVk7QUFDWjtBQUNBO0FBQ0EsRUFBQzs7QUFFRDtBQUNBOztBQUVBO0FBQ0EsU0FBUSx1Q0FBdUM7QUFDL0MsU0FBUSwyQkFBMkI7QUFDbkMsU0FBUSwyQkFBMkI7QUFDbkMsU0FBUSwyQkFBMkI7QUFDbkMsU0FBUTtBQUNSOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDBDQUF5QyxJQUFJOztBQUU3QztBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQ0FBZ0M7O0FBRWhDLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUcsSUFBSTtBQUNQOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFHOztBQUVIOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsTUFBSztBQUNMLE1BQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsTUFBSyxJQUFJO0FBQ1QsTUFBSyxHQUFHO0FBQ1IsTUFBSyxLQUFLO0FBQ1YsTUFBSyxJQUFJLElBQUksRUFBRTtBQUNmLE1BQUssSUFBSSxFQUFFLElBQUk7QUFDZjtBQUNBO0FBQ0EsTUFBSyxJQUFJLE9BQU8sSUFBSTtBQUNwQixNQUFLLEVBQUUsT0FBTyxFQUFFO0FBQ2hCO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx1QkFBc0IsSUFBSTtBQUMxQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQW9DLElBQUk7QUFDeEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxNQUFLO0FBQ0wsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsTUFBSztBQUNMLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFtQyxJQUFJO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBLGlDQUFnQyxFQUFFLEVBQUUsS0FBSztBQUN6QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBd0MsUUFBUTtBQUNoRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWUsc0JBQXNCO0FBQ3JDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLDhDQUE2QztBQUM3Qzs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMLElBQUc7O0FBRUg7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EseUJBQXdCLFFBQVE7QUFDaEM7QUFDQTtBQUNBOztBQUVBLGNBQWEsZ0JBQWdCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLE1BQUssNkNBQTZDOztBQUVsRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUCxRQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFjLFNBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDRCQUEyQjtBQUMzQjs7Ozs7OztBQzE1QkE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHdCQUF1QjtBQUN2Qix3QkFBdUI7QUFDdkI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQ0FBbUM7QUFDbkMscUNBQW9DO0FBQ3BDO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBLHlDQUF3QyxHQUFHLElBQUk7QUFDL0M7QUFDQTtBQUNBOztBQUVBO0FBQ0Esc0JBQXFCLEtBQUs7O0FBRTFCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsc0JBQXFCLGFBQWE7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLCtCQUE4QjtBQUM5Qix3Q0FBdUMsR0FBRztBQUMxQyxhQUFZLEdBQUcseUJBQXlCO0FBQ3hDO0FBQ0E7QUFDQSwrQkFBOEI7QUFDOUIsZUFBYyxHQUFHO0FBQ2pCOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsWUFBVyxZQUFZO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLHNCQUFxQixLQUFLO0FBQzFCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFRLEVBQUU7QUFDViw0QkFBMkI7QUFDM0IsdUJBQXNCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0EsYUFBWSxLQUFLLFFBQVEsRUFBRSxJQUFJLEVBQUU7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLG9CQUFtQixZQUFZO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSCxvQ0FBbUMsMkJBQTJCO0FBQzlEOztBQUVBLGtCQUFpQixjQUFjO0FBQy9CLG9CQUFtQixpQkFBaUI7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7OztBQ3ZNQTtBQUNBO0FBQ0Esb0JBQW1CLGVBQWU7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7Ozs7OztBQ1pBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBLFFBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBQztBQUNEO0FBQ0E7Ozs7Ozs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0EsRUFBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ3RCQSxvQzs7Ozs7O0FDQUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwwQ0FBeUMsRUFBRTtBQUMzQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7Ozs7OztBQ25CQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGtCQUFpQixPQUFPO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGtCQUFpQixvQkFBb0I7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLG9CQUFtQixTQUFTO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCLFNBQVM7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFtQixvQkFBb0I7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxrQkFBaUIsU0FBUztBQUMxQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNyZUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUNBQXdDLFlBQVk7QUFDcEQ7O0FBRUE7QUFDQSxzQ0FBcUMsWUFBWTtBQUNqRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxZQUFXLGdDQUFnQztBQUMzQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLDJDQUEwQyxPQUFPO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQkFBbUIsZ0JBQWdCO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0EsSUFBRztBQUNIO0FBQ0EsSUFBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7Ozs7Ozs7QUMvT0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUIsU0FBUztBQUM5QjtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVCxRQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxrQkFBaUIsWUFBWTtBQUM3QjtBQUNBOzs7Ozs7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDs7QUFFQTtBQUNBO0FBQ0Esb0JBQW1CLGlCQUFpQjtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ2hDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBLElBQUc7QUFDSCxFQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUN6Q0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ2JBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBLE1BQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7Ozs7OztBQzdNQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7QUM3SUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMEJBQXlCLG1CQUFtQjtBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFXO0FBQ1g7QUFDQTtBQUNBLFlBQVc7O0FBRVg7QUFDQSxpQ0FBZ0Msc0NBQXNDO0FBQ3RFLFVBQVM7QUFDVDtBQUNBLFFBQU87QUFDUDtBQUNBLCtCQUE4QixzQ0FBc0M7QUFDcEU7QUFDQSxNQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUMxSEEsb0M7Ozs7OztBQ0FBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBLElBQUc7QUFDSDtBQUNBLElBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBLElBQUc7QUFDSDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTCxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ2hNQSxvQzs7Ozs7O0FDQUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7Ozs7OztBQzFEQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0wsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGdCQUFlLHFCQUFxQjtBQUNwQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7O0FDaEZBO0FBQ0E7O0FBRUEsYUFBWTtBQUNaO0FBQ0E7QUFDQSxFQUFDOztBQUVEO0FBQ0E7O0FBRUE7QUFDQSxTQUFRLHVDQUF1QztBQUMvQyxTQUFRLDJCQUEyQjtBQUNuQyxTQUFRLDJCQUEyQjtBQUNuQyxTQUFRLDJCQUEyQjtBQUNuQyxTQUFRO0FBQ1I7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsMENBQXlDLElBQUk7O0FBRTdDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlDQUFnQzs7QUFFaEMsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRyxJQUFJO0FBQ1A7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFHOztBQUVIOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxNQUFLO0FBQ0wsTUFBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxNQUFLLElBQUk7QUFDVCxNQUFLLEdBQUc7QUFDUixNQUFLLEtBQUs7QUFDVixNQUFLLElBQUksSUFBSSxFQUFFO0FBQ2YsTUFBSyxJQUFJLEVBQUUsSUFBSTtBQUNmO0FBQ0E7QUFDQSxNQUFLLElBQUksT0FBTyxJQUFJO0FBQ3BCLE1BQUssRUFBRSxPQUFPLEVBQUU7QUFDaEI7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHVCQUFzQixJQUFJO0FBQzFCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBb0MsSUFBSTtBQUN4QztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLE1BQUs7QUFDTCxNQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxNQUFLO0FBQ0wsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW1DLElBQUk7QUFDdkM7QUFDQTtBQUNBO0FBQ0EsaUNBQWdDLEVBQUUsRUFBRSxLQUFLO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlDQUF3QyxRQUFRO0FBQ2hEOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZSxzQkFBc0I7QUFDckM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsOENBQTZDO0FBQzdDOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0wsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx5QkFBd0IsUUFBUTtBQUNoQztBQUNBO0FBQ0E7O0FBRUEsY0FBYSxnQkFBZ0I7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsTUFBSyw2Q0FBNkM7O0FBRWxEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQLFFBQU87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWMsU0FBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsNEJBQTJCO0FBQzNCOzs7Ozs7O0FDMTVCQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVc7QUFDWDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7Ozs7OztBQ25LQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHlCQUF3QixhQUFhO0FBQ3JDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUIsYUFBYTtBQUNsQyxJQUFHO0FBQ0g7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLCtDQUE4QyxhQUFhOztBQUUzRDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1AsTUFBSztBQUNMO0FBQ0E7QUFDQSxJQUFHOztBQUVIOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQSxRQUFPO0FBQ1A7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQSxJQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0NBQStCLGFBQWE7QUFDNUMsSUFBRztBQUNIO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTCxJQUFHO0FBQ0g7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7O0FDcFJBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQSxNQUFLO0FBQ0w7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7O0FDbEVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFXO0FBQ1g7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNoSEE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EscUJBQW9CLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRTtBQUM5RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG1DQUFrQyxxQkFBcUI7QUFDdkQsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDJCQUEwQixxQkFBcUI7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBLFFBQU87QUFDUDtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7QUM5SEE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7Ozs7OztBQ3BDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNwQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7Ozs7OztBQ2xFQTs7QUFFQTs7QUFFQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAyMTFiMDQzMWU5ZmE4OGEwMzE3ZSIsImltcG9ydCBqZXRwYWNrIGZyb20gJ2ZzLWpldHBhY2snXG5cbmRvY3VtZW50Lm9uZHJhZ292ZXIgPSBkb2N1bWVudC5vbmRyb3AgPSAoZXYpID0+IHtcbiAgZXYucHJldmVudERlZmF1bHQoKVxufVxuXG5kb2N1bWVudC5ib2R5Lm9uZHJvcCA9IChldikgPT4ge1xuICBsZXQgcGF0aCA9IGV2LmRhdGFUcmFuc2Zlci5maWxlc1swXS5wYXRoXG4gIGV2LnByZXZlbnREZWZhdWx0KClcblxuICBsZXQgZGF0YSA9IGpldHBhY2sucmVhZChwYXRoKVxuXG4gIGNvbnNvbGUubG9nKGRhdGEsIHBhdGgpXG5cbiAgdmFyIHBhcnNlciA9IG5ldyBET01QYXJzZXIoKTtcbiAgdmFyIGRvYyA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcoZGF0YSwgXCJhcHBsaWNhdGlvbi94bWxcIik7XG4gIGxldCBzdmcgPSBkb2MuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzdmdcIilbMF1cblxuICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKHN2Zy5xdWVyeVNlbGVjdG9yQWxsKFwiKlwiKSwgKGVsKSA9PiB7XG4gICAgZWwuc2V0QXR0cmlidXRlKCdmaWxsJywgJ2dyZWVuJylcbiAgfSlcblxuICBqZXRwYWNrLndyaXRlKHBhdGgsIHN2Zy5vdXRlckhUTUwpXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbWFpbi5qcyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGpldHBhY2sgPSByZXF1aXJlKCcuL2xpYi9qZXRwYWNrJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gamV0cGFjaygpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZzLWpldHBhY2svbWFpbi5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKiBlc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciB1dGlsID0gcmVxdWlyZSgndXRpbCcpO1xudmFyIHBhdGhVdGlsID0gcmVxdWlyZSgncGF0aCcpO1xudmFyIFEgPSByZXF1aXJlKCdxJyk7XG5cbnZhciBhcHBlbmQgPSByZXF1aXJlKCcuL2FwcGVuZCcpO1xudmFyIGRpciA9IHJlcXVpcmUoJy4vZGlyJyk7XG52YXIgZmlsZSA9IHJlcXVpcmUoJy4vZmlsZScpO1xudmFyIGZpbmQgPSByZXF1aXJlKCcuL2ZpbmQnKTtcbnZhciBpbnNwZWN0ID0gcmVxdWlyZSgnLi9pbnNwZWN0Jyk7XG52YXIgaW5zcGVjdFRyZWUgPSByZXF1aXJlKCcuL2luc3BlY3RfdHJlZScpO1xudmFyIGNvcHkgPSByZXF1aXJlKCcuL2NvcHknKTtcbnZhciBleGlzdHMgPSByZXF1aXJlKCcuL2V4aXN0cycpO1xudmFyIGxpc3QgPSByZXF1aXJlKCcuL2xpc3QnKTtcbnZhciBtb3ZlID0gcmVxdWlyZSgnLi9tb3ZlJyk7XG52YXIgcmVhZCA9IHJlcXVpcmUoJy4vcmVhZCcpO1xudmFyIHJlbW92ZSA9IHJlcXVpcmUoJy4vcmVtb3ZlJyk7XG52YXIgcmVuYW1lID0gcmVxdWlyZSgnLi9yZW5hbWUnKTtcbnZhciBzeW1saW5rID0gcmVxdWlyZSgnLi9zeW1saW5rJyk7XG52YXIgc3RyZWFtcyA9IHJlcXVpcmUoJy4vc3RyZWFtcycpO1xudmFyIHdyaXRlID0gcmVxdWlyZSgnLi93cml0ZScpO1xuXG4vLyBUaGUgSmV0cGFjayBDb250ZXh0IG9iamVjdC5cbi8vIEl0IHByb3ZpZGVzIHRoZSBwdWJsaWMgQVBJLCBhbmQgcmVzb2x2ZXMgYWxsIHBhdGhzIHJlZ2FyZGluZyB0b1xuLy8gcGFzc2VkIGN3ZFBhdGgsIG9yIGRlZmF1bHQgcHJvY2Vzcy5jd2QoKSBpZiBjd2RQYXRoIHdhcyBub3Qgc3BlY2lmaWVkLlxudmFyIGpldHBhY2tDb250ZXh0ID0gZnVuY3Rpb24gKGN3ZFBhdGgpIHtcbiAgdmFyIGdldEN3ZFBhdGggPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGN3ZFBhdGggfHwgcHJvY2Vzcy5jd2QoKTtcbiAgfTtcblxuICB2YXIgY3dkID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBhcmdzO1xuICAgIHZhciBwYXRoUGFydHM7XG5cbiAgICAvLyByZXR1cm4gY3VycmVudCBDV0QgaWYgbm8gYXJndW1lbnRzIHNwZWNpZmllZC4uLlxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gZ2V0Q3dkUGF0aCgpO1xuICAgIH1cblxuICAgIC8vIC4uLmNyZWF0ZSBuZXcgQ1dEIGNvbnRleHQgb3RoZXJ3aXNlXG4gICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgcGF0aFBhcnRzID0gW2dldEN3ZFBhdGgoKV0uY29uY2F0KGFyZ3MpO1xuICAgIHJldHVybiBqZXRwYWNrQ29udGV4dChwYXRoVXRpbC5yZXNvbHZlLmFwcGx5KG51bGwsIHBhdGhQYXJ0cykpO1xuICB9O1xuXG4gIC8vIHJlc29sdmVzIHBhdGggdG8gaW5uZXIgQ1dEIHBhdGggb2YgdGhpcyBqZXRwYWNrIGluc3RhbmNlXG4gIHZhciByZXNvbHZlUGF0aCA9IGZ1bmN0aW9uIChwYXRoKSB7XG4gICAgcmV0dXJuIHBhdGhVdGlsLnJlc29sdmUoZ2V0Q3dkUGF0aCgpLCBwYXRoKTtcbiAgfTtcblxuICB2YXIgZ2V0UGF0aCA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBhZGQgQ1dEIGJhc2UgcGF0aCBhcyBmaXJzdCBlbGVtZW50IG9mIGFyZ3VtZW50cyBhcnJheVxuICAgIEFycmF5LnByb3RvdHlwZS51bnNoaWZ0LmNhbGwoYXJndW1lbnRzLCBnZXRDd2RQYXRoKCkpO1xuICAgIHJldHVybiBwYXRoVXRpbC5yZXNvbHZlLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gIH07XG5cbiAgdmFyIG5vcm1hbGl6ZU9wdGlvbnMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHZhciBvcHRzID0gb3B0aW9ucyB8fCB7fTtcbiAgICBvcHRzLmN3ZCA9IGdldEN3ZFBhdGgoKTtcbiAgICByZXR1cm4gb3B0cztcbiAgfTtcblxuICAvLyBBUElcblxuICB2YXIgYXBpID0ge1xuICAgIGN3ZDogY3dkLFxuICAgIHBhdGg6IGdldFBhdGgsXG5cbiAgICBhcHBlbmQ6IGZ1bmN0aW9uIChwYXRoLCBkYXRhLCBvcHRpb25zKSB7XG4gICAgICBhcHBlbmQudmFsaWRhdGVJbnB1dCgnYXBwZW5kJywgcGF0aCwgZGF0YSwgb3B0aW9ucyk7XG4gICAgICBhcHBlbmQuc3luYyhyZXNvbHZlUGF0aChwYXRoKSwgZGF0YSwgb3B0aW9ucyk7XG4gICAgfSxcbiAgICBhcHBlbmRBc3luYzogZnVuY3Rpb24gKHBhdGgsIGRhdGEsIG9wdGlvbnMpIHtcbiAgICAgIGFwcGVuZC52YWxpZGF0ZUlucHV0KCdhcHBlbmRBc3luYycsIHBhdGgsIGRhdGEsIG9wdGlvbnMpO1xuICAgICAgcmV0dXJuIGFwcGVuZC5hc3luYyhyZXNvbHZlUGF0aChwYXRoKSwgZGF0YSwgb3B0aW9ucyk7XG4gICAgfSxcblxuICAgIGNvcHk6IGZ1bmN0aW9uIChmcm9tLCB0bywgb3B0aW9ucykge1xuICAgICAgY29weS52YWxpZGF0ZUlucHV0KCdjb3B5JywgZnJvbSwgdG8sIG9wdGlvbnMpO1xuICAgICAgY29weS5zeW5jKHJlc29sdmVQYXRoKGZyb20pLCByZXNvbHZlUGF0aCh0byksIG9wdGlvbnMpO1xuICAgIH0sXG4gICAgY29weUFzeW5jOiBmdW5jdGlvbiAoZnJvbSwgdG8sIG9wdGlvbnMpIHtcbiAgICAgIGNvcHkudmFsaWRhdGVJbnB1dCgnY29weUFzeW5jJywgZnJvbSwgdG8sIG9wdGlvbnMpO1xuICAgICAgcmV0dXJuIGNvcHkuYXN5bmMocmVzb2x2ZVBhdGgoZnJvbSksIHJlc29sdmVQYXRoKHRvKSwgb3B0aW9ucyk7XG4gICAgfSxcblxuICAgIGNyZWF0ZVdyaXRlU3RyZWFtOiBmdW5jdGlvbiAocGF0aCwgb3B0aW9ucykge1xuICAgICAgcmV0dXJuIHN0cmVhbXMuY3JlYXRlV3JpdGVTdHJlYW0ocmVzb2x2ZVBhdGgocGF0aCksIG9wdGlvbnMpO1xuICAgIH0sXG4gICAgY3JlYXRlUmVhZFN0cmVhbTogZnVuY3Rpb24gKHBhdGgsIG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiBzdHJlYW1zLmNyZWF0ZVJlYWRTdHJlYW0ocmVzb2x2ZVBhdGgocGF0aCksIG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICBkaXI6IGZ1bmN0aW9uIChwYXRoLCBjcml0ZXJpYSkge1xuICAgICAgdmFyIG5vcm1hbGl6ZWRQYXRoO1xuICAgICAgZGlyLnZhbGlkYXRlSW5wdXQoJ2RpcicsIHBhdGgsIGNyaXRlcmlhKTtcbiAgICAgIG5vcm1hbGl6ZWRQYXRoID0gcmVzb2x2ZVBhdGgocGF0aCk7XG4gICAgICBkaXIuc3luYyhub3JtYWxpemVkUGF0aCwgY3JpdGVyaWEpO1xuICAgICAgcmV0dXJuIGN3ZChub3JtYWxpemVkUGF0aCk7XG4gICAgfSxcbiAgICBkaXJBc3luYzogZnVuY3Rpb24gKHBhdGgsIGNyaXRlcmlhKSB7XG4gICAgICB2YXIgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgICB2YXIgbm9ybWFsaXplZFBhdGg7XG4gICAgICBkaXIudmFsaWRhdGVJbnB1dCgnZGlyQXN5bmMnLCBwYXRoLCBjcml0ZXJpYSk7XG4gICAgICBub3JtYWxpemVkUGF0aCA9IHJlc29sdmVQYXRoKHBhdGgpO1xuICAgICAgZGlyLmFzeW5jKG5vcm1hbGl6ZWRQYXRoLCBjcml0ZXJpYSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShjd2Qobm9ybWFsaXplZFBhdGgpKTtcbiAgICAgIH0sIGRlZmVycmVkLnJlamVjdCk7XG4gICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9LFxuXG4gICAgZXhpc3RzOiBmdW5jdGlvbiAocGF0aCkge1xuICAgICAgZXhpc3RzLnZhbGlkYXRlSW5wdXQoJ2V4aXN0cycsIHBhdGgpO1xuICAgICAgcmV0dXJuIGV4aXN0cy5zeW5jKHJlc29sdmVQYXRoKHBhdGgpKTtcbiAgICB9LFxuICAgIGV4aXN0c0FzeW5jOiBmdW5jdGlvbiAocGF0aCkge1xuICAgICAgZXhpc3RzLnZhbGlkYXRlSW5wdXQoJ2V4aXN0c0FzeW5jJywgcGF0aCk7XG4gICAgICByZXR1cm4gZXhpc3RzLmFzeW5jKHJlc29sdmVQYXRoKHBhdGgpKTtcbiAgICB9LFxuXG4gICAgZmlsZTogZnVuY3Rpb24gKHBhdGgsIGNyaXRlcmlhKSB7XG4gICAgICBmaWxlLnZhbGlkYXRlSW5wdXQoJ2ZpbGUnLCBwYXRoLCBjcml0ZXJpYSk7XG4gICAgICBmaWxlLnN5bmMocmVzb2x2ZVBhdGgocGF0aCksIGNyaXRlcmlhKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgZmlsZUFzeW5jOiBmdW5jdGlvbiAocGF0aCwgY3JpdGVyaWEpIHtcbiAgICAgIHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgIGZpbGUudmFsaWRhdGVJbnB1dCgnZmlsZUFzeW5jJywgcGF0aCwgY3JpdGVyaWEpO1xuICAgICAgZmlsZS5hc3luYyhyZXNvbHZlUGF0aChwYXRoKSwgY3JpdGVyaWEpXG4gICAgICAudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUodGhhdCk7XG4gICAgICB9LCBkZWZlcnJlZC5yZWplY3QpO1xuICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgfSxcblxuICAgIGZpbmQ6IGZ1bmN0aW9uIChzdGFydFBhdGgsIG9wdGlvbnMpIHtcbiAgICAgIC8vIHN0YXJ0UGF0aCBpcyBvcHRpb25hbCBwYXJhbWV0ZXIsIGlmIG5vdCBzcGVjaWZpZWQgbW92ZSByZXN0IG9mIHBhcmFtc1xuICAgICAgLy8gdG8gcHJvcGVyIHBsYWNlcyBhbmQgZGVmYXVsdCBzdGFydFBhdGggdG8gQ1dELlxuICAgICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAndW5kZWZpbmVkJyAmJiB0eXBlb2Ygc3RhcnRQYXRoID09PSAnb2JqZWN0Jykge1xuICAgICAgICBvcHRpb25zID0gc3RhcnRQYXRoO1xuICAgICAgICBzdGFydFBhdGggPSAnLic7XG4gICAgICB9XG4gICAgICBmaW5kLnZhbGlkYXRlSW5wdXQoJ2ZpbmQnLCBzdGFydFBhdGgsIG9wdGlvbnMpO1xuICAgICAgcmV0dXJuIGZpbmQuc3luYyhyZXNvbHZlUGF0aChzdGFydFBhdGgpLCBub3JtYWxpemVPcHRpb25zKG9wdGlvbnMpKTtcbiAgICB9LFxuICAgIGZpbmRBc3luYzogZnVuY3Rpb24gKHN0YXJ0UGF0aCwgb3B0aW9ucykge1xuICAgICAgLy8gc3RhcnRQYXRoIGlzIG9wdGlvbmFsIHBhcmFtZXRlciwgaWYgbm90IHNwZWNpZmllZCBtb3ZlIHJlc3Qgb2YgcGFyYW1zXG4gICAgICAvLyB0byBwcm9wZXIgcGxhY2VzIGFuZCBkZWZhdWx0IHN0YXJ0UGF0aCB0byBDV0QuXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBzdGFydFBhdGggPT09ICdvYmplY3QnKSB7XG4gICAgICAgIG9wdGlvbnMgPSBzdGFydFBhdGg7XG4gICAgICAgIHN0YXJ0UGF0aCA9ICcuJztcbiAgICAgIH1cbiAgICAgIGZpbmQudmFsaWRhdGVJbnB1dCgnZmluZEFzeW5jJywgc3RhcnRQYXRoLCBvcHRpb25zKTtcbiAgICAgIHJldHVybiBmaW5kLmFzeW5jKHJlc29sdmVQYXRoKHN0YXJ0UGF0aCksIG5vcm1hbGl6ZU9wdGlvbnMob3B0aW9ucykpO1xuICAgIH0sXG5cbiAgICBpbnNwZWN0OiBmdW5jdGlvbiAocGF0aCwgZmllbGRzVG9JbmNsdWRlKSB7XG4gICAgICBpbnNwZWN0LnZhbGlkYXRlSW5wdXQoJ2luc3BlY3QnLCBwYXRoLCBmaWVsZHNUb0luY2x1ZGUpO1xuICAgICAgcmV0dXJuIGluc3BlY3Quc3luYyhyZXNvbHZlUGF0aChwYXRoKSwgZmllbGRzVG9JbmNsdWRlKTtcbiAgICB9LFxuICAgIGluc3BlY3RBc3luYzogZnVuY3Rpb24gKHBhdGgsIGZpZWxkc1RvSW5jbHVkZSkge1xuICAgICAgaW5zcGVjdC52YWxpZGF0ZUlucHV0KCdpbnNwZWN0QXN5bmMnLCBwYXRoLCBmaWVsZHNUb0luY2x1ZGUpO1xuICAgICAgcmV0dXJuIGluc3BlY3QuYXN5bmMocmVzb2x2ZVBhdGgocGF0aCksIGZpZWxkc1RvSW5jbHVkZSk7XG4gICAgfSxcblxuICAgIGluc3BlY3RUcmVlOiBmdW5jdGlvbiAocGF0aCwgb3B0aW9ucykge1xuICAgICAgaW5zcGVjdFRyZWUudmFsaWRhdGVJbnB1dCgnaW5zcGVjdFRyZWUnLCBwYXRoLCBvcHRpb25zKTtcbiAgICAgIHJldHVybiBpbnNwZWN0VHJlZS5zeW5jKHJlc29sdmVQYXRoKHBhdGgpLCBvcHRpb25zKTtcbiAgICB9LFxuICAgIGluc3BlY3RUcmVlQXN5bmM6IGZ1bmN0aW9uIChwYXRoLCBvcHRpb25zKSB7XG4gICAgICBpbnNwZWN0VHJlZS52YWxpZGF0ZUlucHV0KCdpbnNwZWN0VHJlZUFzeW5jJywgcGF0aCwgb3B0aW9ucyk7XG4gICAgICByZXR1cm4gaW5zcGVjdFRyZWUuYXN5bmMocmVzb2x2ZVBhdGgocGF0aCksIG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICBsaXN0OiBmdW5jdGlvbiAocGF0aCkge1xuICAgICAgbGlzdC52YWxpZGF0ZUlucHV0KCdsaXN0JywgcGF0aCk7XG4gICAgICByZXR1cm4gbGlzdC5zeW5jKHJlc29sdmVQYXRoKHBhdGggfHwgJy4nKSk7XG4gICAgfSxcbiAgICBsaXN0QXN5bmM6IGZ1bmN0aW9uIChwYXRoKSB7XG4gICAgICBsaXN0LnZhbGlkYXRlSW5wdXQoJ2xpc3RBc3luYycsIHBhdGgpO1xuICAgICAgcmV0dXJuIGxpc3QuYXN5bmMocmVzb2x2ZVBhdGgocGF0aCB8fCAnLicpKTtcbiAgICB9LFxuXG4gICAgbW92ZTogZnVuY3Rpb24gKGZyb20sIHRvKSB7XG4gICAgICBtb3ZlLnZhbGlkYXRlSW5wdXQoJ21vdmUnLCBmcm9tLCB0byk7XG4gICAgICBtb3ZlLnN5bmMocmVzb2x2ZVBhdGgoZnJvbSksIHJlc29sdmVQYXRoKHRvKSk7XG4gICAgfSxcbiAgICBtb3ZlQXN5bmM6IGZ1bmN0aW9uIChmcm9tLCB0bykge1xuICAgICAgbW92ZS52YWxpZGF0ZUlucHV0KCdtb3ZlQXN5bmMnLCBmcm9tLCB0byk7XG4gICAgICByZXR1cm4gbW92ZS5hc3luYyhyZXNvbHZlUGF0aChmcm9tKSwgcmVzb2x2ZVBhdGgodG8pKTtcbiAgICB9LFxuXG4gICAgcmVhZDogZnVuY3Rpb24gKHBhdGgsIHJldHVybkFzKSB7XG4gICAgICByZWFkLnZhbGlkYXRlSW5wdXQoJ3JlYWQnLCBwYXRoLCByZXR1cm5Bcyk7XG4gICAgICByZXR1cm4gcmVhZC5zeW5jKHJlc29sdmVQYXRoKHBhdGgpLCByZXR1cm5Bcyk7XG4gICAgfSxcbiAgICByZWFkQXN5bmM6IGZ1bmN0aW9uIChwYXRoLCByZXR1cm5Bcykge1xuICAgICAgcmVhZC52YWxpZGF0ZUlucHV0KCdyZWFkQXN5bmMnLCBwYXRoLCByZXR1cm5Bcyk7XG4gICAgICByZXR1cm4gcmVhZC5hc3luYyhyZXNvbHZlUGF0aChwYXRoKSwgcmV0dXJuQXMpO1xuICAgIH0sXG5cbiAgICByZW1vdmU6IGZ1bmN0aW9uIChwYXRoKSB7XG4gICAgICByZW1vdmUudmFsaWRhdGVJbnB1dCgncmVtb3ZlJywgcGF0aCk7XG4gICAgICAvLyBJZiBwYXRoIG5vdCBzcGVjaWZpZWQgZGVmYXVsdHMgdG8gQ1dEXG4gICAgICByZW1vdmUuc3luYyhyZXNvbHZlUGF0aChwYXRoIHx8ICcuJykpO1xuICAgIH0sXG4gICAgcmVtb3ZlQXN5bmM6IGZ1bmN0aW9uIChwYXRoKSB7XG4gICAgICByZW1vdmUudmFsaWRhdGVJbnB1dCgncmVtb3ZlQXN5bmMnLCBwYXRoKTtcbiAgICAgIC8vIElmIHBhdGggbm90IHNwZWNpZmllZCBkZWZhdWx0cyB0byBDV0RcbiAgICAgIHJldHVybiByZW1vdmUuYXN5bmMocmVzb2x2ZVBhdGgocGF0aCB8fCAnLicpKTtcbiAgICB9LFxuXG4gICAgcmVuYW1lOiBmdW5jdGlvbiAocGF0aCwgbmV3TmFtZSkge1xuICAgICAgcmVuYW1lLnZhbGlkYXRlSW5wdXQoJ3JlbmFtZScsIHBhdGgsIG5ld05hbWUpO1xuICAgICAgcmVuYW1lLnN5bmMocmVzb2x2ZVBhdGgocGF0aCksIG5ld05hbWUpO1xuICAgIH0sXG4gICAgcmVuYW1lQXN5bmM6IGZ1bmN0aW9uIChwYXRoLCBuZXdOYW1lKSB7XG4gICAgICByZW5hbWUudmFsaWRhdGVJbnB1dCgncmVuYW1lQXN5bmMnLCBwYXRoLCBuZXdOYW1lKTtcbiAgICAgIHJldHVybiByZW5hbWUuYXN5bmMocmVzb2x2ZVBhdGgocGF0aCksIG5ld05hbWUpO1xuICAgIH0sXG5cbiAgICBzeW1saW5rOiBmdW5jdGlvbiAoc3ltbGlua1ZhbHVlLCBwYXRoKSB7XG4gICAgICBzeW1saW5rLnZhbGlkYXRlSW5wdXQoJ3N5bWxpbmsnLCBzeW1saW5rVmFsdWUsIHBhdGgpO1xuICAgICAgc3ltbGluay5zeW5jKHN5bWxpbmtWYWx1ZSwgcmVzb2x2ZVBhdGgocGF0aCkpO1xuICAgIH0sXG4gICAgc3ltbGlua0FzeW5jOiBmdW5jdGlvbiAoc3ltbGlua1ZhbHVlLCBwYXRoKSB7XG4gICAgICBzeW1saW5rLnZhbGlkYXRlSW5wdXQoJ3N5bWxpbmtBc3luYycsIHN5bWxpbmtWYWx1ZSwgcGF0aCk7XG4gICAgICByZXR1cm4gc3ltbGluay5hc3luYyhzeW1saW5rVmFsdWUsIHJlc29sdmVQYXRoKHBhdGgpKTtcbiAgICB9LFxuXG4gICAgd3JpdGU6IGZ1bmN0aW9uIChwYXRoLCBkYXRhLCBvcHRpb25zKSB7XG4gICAgICB3cml0ZS52YWxpZGF0ZUlucHV0KCd3cml0ZScsIHBhdGgsIGRhdGEsIG9wdGlvbnMpO1xuICAgICAgd3JpdGUuc3luYyhyZXNvbHZlUGF0aChwYXRoKSwgZGF0YSwgb3B0aW9ucyk7XG4gICAgfSxcbiAgICB3cml0ZUFzeW5jOiBmdW5jdGlvbiAocGF0aCwgZGF0YSwgb3B0aW9ucykge1xuICAgICAgd3JpdGUudmFsaWRhdGVJbnB1dCgnd3JpdGVBc3luYycsIHBhdGgsIGRhdGEsIG9wdGlvbnMpO1xuICAgICAgcmV0dXJuIHdyaXRlLmFzeW5jKHJlc29sdmVQYXRoKHBhdGgpLCBkYXRhLCBvcHRpb25zKTtcbiAgICB9XG4gIH07XG5cbiAgaWYgKHV0aWwuaW5zcGVjdC5jdXN0b20gIT09IHVuZGVmaW5lZCkge1xuICAgIC8vIFdpdGhvdXQgdGhpcyBjb25zb2xlLmxvZyhqZXRwYWNrKSB0aHJvd3Mgb2JzY3VyZSBlcnJvci4gRGV0YWlsczpcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vc3p3YWN6L2ZzLWpldHBhY2svaXNzdWVzLzI5XG4gICAgLy8gaHR0cHM6Ly9ub2RlanMub3JnL2FwaS91dGlsLmh0bWwjdXRpbF9jdXN0b21faW5zcGVjdGlvbl9mdW5jdGlvbnNfb25fb2JqZWN0c1xuICAgIGFwaVt1dGlsLmluc3BlY3QuY3VzdG9tXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiAnW2ZzLWpldHBhY2sgQ1dEOiAnICsgZ2V0Q3dkUGF0aCgpICsgJ10nO1xuICAgIH07XG4gIH1cblxuICByZXR1cm4gYXBpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBqZXRwYWNrQ29udGV4dDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9mcy1qZXRwYWNrL2xpYi9qZXRwYWNrLmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInV0aWxcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJ1dGlsXCJcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInBhdGhcIlxuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyB2aW06dHM9NDpzdHM9NDpzdz00OlxuLyohXG4gKlxuICogQ29weXJpZ2h0IDIwMDktMjAxMiBLcmlzIEtvd2FsIHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgTUlUXG4gKiBsaWNlbnNlIGZvdW5kIGF0IGh0dHA6Ly9naXRodWIuY29tL2tyaXNrb3dhbC9xL3Jhdy9tYXN0ZXIvTElDRU5TRVxuICpcbiAqIFdpdGggcGFydHMgYnkgVHlsZXIgQ2xvc2VcbiAqIENvcHlyaWdodCAyMDA3LTIwMDkgVHlsZXIgQ2xvc2UgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBNSVQgWCBsaWNlbnNlIGZvdW5kXG4gKiBhdCBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLmh0bWxcbiAqIEZvcmtlZCBhdCByZWZfc2VuZC5qcyB2ZXJzaW9uOiAyMDA5LTA1LTExXG4gKlxuICogV2l0aCBwYXJ0cyBieSBNYXJrIE1pbGxlclxuICogQ29weXJpZ2h0IChDKSAyMDExIEdvb2dsZSBJbmMuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICovXG5cbihmdW5jdGlvbiAoZGVmaW5pdGlvbikge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgLy8gVGhpcyBmaWxlIHdpbGwgZnVuY3Rpb24gcHJvcGVybHkgYXMgYSA8c2NyaXB0PiB0YWcsIG9yIGEgbW9kdWxlXG4gICAgLy8gdXNpbmcgQ29tbW9uSlMgYW5kIE5vZGVKUyBvciBSZXF1aXJlSlMgbW9kdWxlIGZvcm1hdHMuICBJblxuICAgIC8vIENvbW1vbi9Ob2RlL1JlcXVpcmVKUywgdGhlIG1vZHVsZSBleHBvcnRzIHRoZSBRIEFQSSBhbmQgd2hlblxuICAgIC8vIGV4ZWN1dGVkIGFzIGEgc2ltcGxlIDxzY3JpcHQ+LCBpdCBjcmVhdGVzIGEgUSBnbG9iYWwgaW5zdGVhZC5cblxuICAgIC8vIE1vbnRhZ2UgUmVxdWlyZVxuICAgIGlmICh0eXBlb2YgYm9vdHN0cmFwID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgYm9vdHN0cmFwKFwicHJvbWlzZVwiLCBkZWZpbml0aW9uKTtcblxuICAgIC8vIENvbW1vbkpTXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZGVmaW5pdGlvbigpO1xuXG4gICAgLy8gUmVxdWlyZUpTXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoZGVmaW5pdGlvbik7XG5cbiAgICAvLyBTRVMgKFNlY3VyZSBFY21hU2NyaXB0KVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIHNlcyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAoIXNlcy5vaygpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZXMubWFrZVEgPSBkZWZpbml0aW9uO1xuICAgICAgICB9XG5cbiAgICAvLyA8c2NyaXB0PlxuICAgIH0gZWxzZSBpZiAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiB8fCB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAvLyBQcmVmZXIgd2luZG93IG92ZXIgc2VsZiBmb3IgYWRkLW9uIHNjcmlwdHMuIFVzZSBzZWxmIGZvclxuICAgICAgICAvLyBub24td2luZG93ZWQgY29udGV4dHMuXG4gICAgICAgIHZhciBnbG9iYWwgPSB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDogc2VsZjtcblxuICAgICAgICAvLyBHZXQgdGhlIGB3aW5kb3dgIG9iamVjdCwgc2F2ZSB0aGUgcHJldmlvdXMgUSBnbG9iYWxcbiAgICAgICAgLy8gYW5kIGluaXRpYWxpemUgUSBhcyBhIGdsb2JhbC5cbiAgICAgICAgdmFyIHByZXZpb3VzUSA9IGdsb2JhbC5RO1xuICAgICAgICBnbG9iYWwuUSA9IGRlZmluaXRpb24oKTtcblxuICAgICAgICAvLyBBZGQgYSBub0NvbmZsaWN0IGZ1bmN0aW9uIHNvIFEgY2FuIGJlIHJlbW92ZWQgZnJvbSB0aGVcbiAgICAgICAgLy8gZ2xvYmFsIG5hbWVzcGFjZS5cbiAgICAgICAgZ2xvYmFsLlEubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGdsb2JhbC5RID0gcHJldmlvdXNRO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH07XG5cbiAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGlzIGVudmlyb25tZW50IHdhcyBub3QgYW50aWNpcGF0ZWQgYnkgUS4gUGxlYXNlIGZpbGUgYSBidWcuXCIpO1xuICAgIH1cblxufSkoZnVuY3Rpb24gKCkge1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBoYXNTdGFja3MgPSBmYWxzZTtcbnRyeSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCk7XG59IGNhdGNoIChlKSB7XG4gICAgaGFzU3RhY2tzID0gISFlLnN0YWNrO1xufVxuXG4vLyBBbGwgY29kZSBhZnRlciB0aGlzIHBvaW50IHdpbGwgYmUgZmlsdGVyZWQgZnJvbSBzdGFjayB0cmFjZXMgcmVwb3J0ZWRcbi8vIGJ5IFEuXG52YXIgcVN0YXJ0aW5nTGluZSA9IGNhcHR1cmVMaW5lKCk7XG52YXIgcUZpbGVOYW1lO1xuXG4vLyBzaGltc1xuXG4vLyB1c2VkIGZvciBmYWxsYmFjayBpbiBcImFsbFJlc29sdmVkXCJcbnZhciBub29wID0gZnVuY3Rpb24gKCkge307XG5cbi8vIFVzZSB0aGUgZmFzdGVzdCBwb3NzaWJsZSBtZWFucyB0byBleGVjdXRlIGEgdGFzayBpbiBhIGZ1dHVyZSB0dXJuXG4vLyBvZiB0aGUgZXZlbnQgbG9vcC5cbnZhciBuZXh0VGljayA9KGZ1bmN0aW9uICgpIHtcbiAgICAvLyBsaW5rZWQgbGlzdCBvZiB0YXNrcyAoc2luZ2xlLCB3aXRoIGhlYWQgbm9kZSlcbiAgICB2YXIgaGVhZCA9IHt0YXNrOiB2b2lkIDAsIG5leHQ6IG51bGx9O1xuICAgIHZhciB0YWlsID0gaGVhZDtcbiAgICB2YXIgZmx1c2hpbmcgPSBmYWxzZTtcbiAgICB2YXIgcmVxdWVzdFRpY2sgPSB2b2lkIDA7XG4gICAgdmFyIGlzTm9kZUpTID0gZmFsc2U7XG4gICAgLy8gcXVldWUgZm9yIGxhdGUgdGFza3MsIHVzZWQgYnkgdW5oYW5kbGVkIHJlamVjdGlvbiB0cmFja2luZ1xuICAgIHZhciBsYXRlclF1ZXVlID0gW107XG5cbiAgICBmdW5jdGlvbiBmbHVzaCgpIHtcbiAgICAgICAgLyoganNoaW50IGxvb3BmdW5jOiB0cnVlICovXG4gICAgICAgIHZhciB0YXNrLCBkb21haW47XG5cbiAgICAgICAgd2hpbGUgKGhlYWQubmV4dCkge1xuICAgICAgICAgICAgaGVhZCA9IGhlYWQubmV4dDtcbiAgICAgICAgICAgIHRhc2sgPSBoZWFkLnRhc2s7XG4gICAgICAgICAgICBoZWFkLnRhc2sgPSB2b2lkIDA7XG4gICAgICAgICAgICBkb21haW4gPSBoZWFkLmRvbWFpbjtcblxuICAgICAgICAgICAgaWYgKGRvbWFpbikge1xuICAgICAgICAgICAgICAgIGhlYWQuZG9tYWluID0gdm9pZCAwO1xuICAgICAgICAgICAgICAgIGRvbWFpbi5lbnRlcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcnVuU2luZ2xlKHRhc2ssIGRvbWFpbik7XG5cbiAgICAgICAgfVxuICAgICAgICB3aGlsZSAobGF0ZXJRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRhc2sgPSBsYXRlclF1ZXVlLnBvcCgpO1xuICAgICAgICAgICAgcnVuU2luZ2xlKHRhc2spO1xuICAgICAgICB9XG4gICAgICAgIGZsdXNoaW5nID0gZmFsc2U7XG4gICAgfVxuICAgIC8vIHJ1bnMgYSBzaW5nbGUgZnVuY3Rpb24gaW4gdGhlIGFzeW5jIHF1ZXVlXG4gICAgZnVuY3Rpb24gcnVuU2luZ2xlKHRhc2ssIGRvbWFpbikge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGFzaygpO1xuXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGlmIChpc05vZGVKUykge1xuICAgICAgICAgICAgICAgIC8vIEluIG5vZGUsIHVuY2F1Z2h0IGV4Y2VwdGlvbnMgYXJlIGNvbnNpZGVyZWQgZmF0YWwgZXJyb3JzLlxuICAgICAgICAgICAgICAgIC8vIFJlLXRocm93IHRoZW0gc3luY2hyb25vdXNseSB0byBpbnRlcnJ1cHQgZmx1c2hpbmchXG5cbiAgICAgICAgICAgICAgICAvLyBFbnN1cmUgY29udGludWF0aW9uIGlmIHRoZSB1bmNhdWdodCBleGNlcHRpb24gaXMgc3VwcHJlc3NlZFxuICAgICAgICAgICAgICAgIC8vIGxpc3RlbmluZyBcInVuY2F1Z2h0RXhjZXB0aW9uXCIgZXZlbnRzIChhcyBkb21haW5zIGRvZXMpLlxuICAgICAgICAgICAgICAgIC8vIENvbnRpbnVlIGluIG5leHQgZXZlbnQgdG8gYXZvaWQgdGljayByZWN1cnNpb24uXG4gICAgICAgICAgICAgICAgaWYgKGRvbWFpbikge1xuICAgICAgICAgICAgICAgICAgICBkb21haW4uZXhpdCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZsdXNoLCAwKTtcbiAgICAgICAgICAgICAgICBpZiAoZG9tYWluKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvbWFpbi5lbnRlcigpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRocm93IGU7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gSW4gYnJvd3NlcnMsIHVuY2F1Z2h0IGV4Y2VwdGlvbnMgYXJlIG5vdCBmYXRhbC5cbiAgICAgICAgICAgICAgICAvLyBSZS10aHJvdyB0aGVtIGFzeW5jaHJvbm91c2x5IHRvIGF2b2lkIHNsb3ctZG93bnMuXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgICAgICAgfSwgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZG9tYWluKSB7XG4gICAgICAgICAgICBkb21haW4uZXhpdCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmV4dFRpY2sgPSBmdW5jdGlvbiAodGFzaykge1xuICAgICAgICB0YWlsID0gdGFpbC5uZXh0ID0ge1xuICAgICAgICAgICAgdGFzazogdGFzayxcbiAgICAgICAgICAgIGRvbWFpbjogaXNOb2RlSlMgJiYgcHJvY2Vzcy5kb21haW4sXG4gICAgICAgICAgICBuZXh0OiBudWxsXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKCFmbHVzaGluZykge1xuICAgICAgICAgICAgZmx1c2hpbmcgPSB0cnVlO1xuICAgICAgICAgICAgcmVxdWVzdFRpY2soKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAodHlwZW9mIHByb2Nlc3MgPT09IFwib2JqZWN0XCIgJiZcbiAgICAgICAgcHJvY2Vzcy50b1N0cmluZygpID09PSBcIltvYmplY3QgcHJvY2Vzc11cIiAmJiBwcm9jZXNzLm5leHRUaWNrKSB7XG4gICAgICAgIC8vIEVuc3VyZSBRIGlzIGluIGEgcmVhbCBOb2RlIGVudmlyb25tZW50LCB3aXRoIGEgYHByb2Nlc3MubmV4dFRpY2tgLlxuICAgICAgICAvLyBUbyBzZWUgdGhyb3VnaCBmYWtlIE5vZGUgZW52aXJvbm1lbnRzOlxuICAgICAgICAvLyAqIE1vY2hhIHRlc3QgcnVubmVyIC0gZXhwb3NlcyBhIGBwcm9jZXNzYCBnbG9iYWwgd2l0aG91dCBhIGBuZXh0VGlja2BcbiAgICAgICAgLy8gKiBCcm93c2VyaWZ5IC0gZXhwb3NlcyBhIGBwcm9jZXNzLm5leFRpY2tgIGZ1bmN0aW9uIHRoYXQgdXNlc1xuICAgICAgICAvLyAgIGBzZXRUaW1lb3V0YC4gSW4gdGhpcyBjYXNlIGBzZXRJbW1lZGlhdGVgIGlzIHByZWZlcnJlZCBiZWNhdXNlXG4gICAgICAgIC8vICAgIGl0IGlzIGZhc3Rlci4gQnJvd3NlcmlmeSdzIGBwcm9jZXNzLnRvU3RyaW5nKClgIHlpZWxkc1xuICAgICAgICAvLyAgIFwiW29iamVjdCBPYmplY3RdXCIsIHdoaWxlIGluIGEgcmVhbCBOb2RlIGVudmlyb25tZW50XG4gICAgICAgIC8vICAgYHByb2Nlc3MubmV4dFRpY2soKWAgeWllbGRzIFwiW29iamVjdCBwcm9jZXNzXVwiLlxuICAgICAgICBpc05vZGVKUyA9IHRydWU7XG5cbiAgICAgICAgcmVxdWVzdFRpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBwcm9jZXNzLm5leHRUaWNrKGZsdXNoKTtcbiAgICAgICAgfTtcblxuICAgIH0gZWxzZSBpZiAodHlwZW9mIHNldEltbWVkaWF0ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIC8vIEluIElFMTAsIE5vZGUuanMgMC45Kywgb3IgaHR0cHM6Ly9naXRodWIuY29tL05vYmxlSlMvc2V0SW1tZWRpYXRlXG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICByZXF1ZXN0VGljayA9IHNldEltbWVkaWF0ZS5iaW5kKHdpbmRvdywgZmx1c2gpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVxdWVzdFRpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2V0SW1tZWRpYXRlKGZsdXNoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgIH0gZWxzZSBpZiAodHlwZW9mIE1lc3NhZ2VDaGFubmVsICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIC8vIG1vZGVybiBicm93c2Vyc1xuICAgICAgICAvLyBodHRwOi8vd3d3Lm5vbmJsb2NraW5nLmlvLzIwMTEvMDYvd2luZG93bmV4dHRpY2suaHRtbFxuICAgICAgICB2YXIgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbCgpO1xuICAgICAgICAvLyBBdCBsZWFzdCBTYWZhcmkgVmVyc2lvbiA2LjAuNSAoODUzNi4zMC4xKSBpbnRlcm1pdHRlbnRseSBjYW5ub3QgY3JlYXRlXG4gICAgICAgIC8vIHdvcmtpbmcgbWVzc2FnZSBwb3J0cyB0aGUgZmlyc3QgdGltZSBhIHBhZ2UgbG9hZHMuXG4gICAgICAgIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmVxdWVzdFRpY2sgPSByZXF1ZXN0UG9ydFRpY2s7XG4gICAgICAgICAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGZsdXNoO1xuICAgICAgICAgICAgZmx1c2goKTtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIHJlcXVlc3RQb3J0VGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIE9wZXJhIHJlcXVpcmVzIHVzIHRvIHByb3ZpZGUgYSBtZXNzYWdlIHBheWxvYWQsIHJlZ2FyZGxlc3Mgb2ZcbiAgICAgICAgICAgIC8vIHdoZXRoZXIgd2UgdXNlIGl0LlxuICAgICAgICAgICAgY2hhbm5lbC5wb3J0Mi5wb3N0TWVzc2FnZSgwKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmVxdWVzdFRpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZsdXNoLCAwKTtcbiAgICAgICAgICAgIHJlcXVlc3RQb3J0VGljaygpO1xuICAgICAgICB9O1xuXG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gb2xkIGJyb3dzZXJzXG4gICAgICAgIHJlcXVlc3RUaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc2V0VGltZW91dChmbHVzaCwgMCk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIC8vIHJ1bnMgYSB0YXNrIGFmdGVyIGFsbCBvdGhlciB0YXNrcyBoYXZlIGJlZW4gcnVuXG4gICAgLy8gdGhpcyBpcyB1c2VmdWwgZm9yIHVuaGFuZGxlZCByZWplY3Rpb24gdHJhY2tpbmcgdGhhdCBuZWVkcyB0byBoYXBwZW5cbiAgICAvLyBhZnRlciBhbGwgYHRoZW5gZCB0YXNrcyBoYXZlIGJlZW4gcnVuLlxuICAgIG5leHRUaWNrLnJ1bkFmdGVyID0gZnVuY3Rpb24gKHRhc2spIHtcbiAgICAgICAgbGF0ZXJRdWV1ZS5wdXNoKHRhc2spO1xuICAgICAgICBpZiAoIWZsdXNoaW5nKSB7XG4gICAgICAgICAgICBmbHVzaGluZyA9IHRydWU7XG4gICAgICAgICAgICByZXF1ZXN0VGljaygpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gbmV4dFRpY2s7XG59KSgpO1xuXG4vLyBBdHRlbXB0IHRvIG1ha2UgZ2VuZXJpY3Mgc2FmZSBpbiB0aGUgZmFjZSBvZiBkb3duc3RyZWFtXG4vLyBtb2RpZmljYXRpb25zLlxuLy8gVGhlcmUgaXMgbm8gc2l0dWF0aW9uIHdoZXJlIHRoaXMgaXMgbmVjZXNzYXJ5LlxuLy8gSWYgeW91IG5lZWQgYSBzZWN1cml0eSBndWFyYW50ZWUsIHRoZXNlIHByaW1vcmRpYWxzIG5lZWQgdG8gYmVcbi8vIGRlZXBseSBmcm96ZW4gYW55d2F5LCBhbmQgaWYgeW91IGRvbuKAmXQgbmVlZCBhIHNlY3VyaXR5IGd1YXJhbnRlZSxcbi8vIHRoaXMgaXMganVzdCBwbGFpbiBwYXJhbm9pZC5cbi8vIEhvd2V2ZXIsIHRoaXMgKiptaWdodCoqIGhhdmUgdGhlIG5pY2Ugc2lkZS1lZmZlY3Qgb2YgcmVkdWNpbmcgdGhlIHNpemUgb2Zcbi8vIHRoZSBtaW5pZmllZCBjb2RlIGJ5IHJlZHVjaW5nIHguY2FsbCgpIHRvIG1lcmVseSB4KClcbi8vIFNlZSBNYXJrIE1pbGxlcuKAmXMgZXhwbGFuYXRpb24gb2Ygd2hhdCB0aGlzIGRvZXMuXG4vLyBodHRwOi8vd2lraS5lY21hc2NyaXB0Lm9yZy9kb2t1LnBocD9pZD1jb252ZW50aW9uczpzYWZlX21ldGFfcHJvZ3JhbW1pbmdcbnZhciBjYWxsID0gRnVuY3Rpb24uY2FsbDtcbmZ1bmN0aW9uIHVuY3VycnlUaGlzKGYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gY2FsbC5hcHBseShmLCBhcmd1bWVudHMpO1xuICAgIH07XG59XG4vLyBUaGlzIGlzIGVxdWl2YWxlbnQsIGJ1dCBzbG93ZXI6XG4vLyB1bmN1cnJ5VGhpcyA9IEZ1bmN0aW9uX2JpbmQuYmluZChGdW5jdGlvbl9iaW5kLmNhbGwpO1xuLy8gaHR0cDovL2pzcGVyZi5jb20vdW5jdXJyeXRoaXNcblxudmFyIGFycmF5X3NsaWNlID0gdW5jdXJyeVRoaXMoQXJyYXkucHJvdG90eXBlLnNsaWNlKTtcblxudmFyIGFycmF5X3JlZHVjZSA9IHVuY3VycnlUaGlzKFxuICAgIEFycmF5LnByb3RvdHlwZS5yZWR1Y2UgfHwgZnVuY3Rpb24gKGNhbGxiYWNrLCBiYXNpcykge1xuICAgICAgICB2YXIgaW5kZXggPSAwLFxuICAgICAgICAgICAgbGVuZ3RoID0gdGhpcy5sZW5ndGg7XG4gICAgICAgIC8vIGNvbmNlcm5pbmcgdGhlIGluaXRpYWwgdmFsdWUsIGlmIG9uZSBpcyBub3QgcHJvdmlkZWRcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIC8vIHNlZWsgdG8gdGhlIGZpcnN0IHZhbHVlIGluIHRoZSBhcnJheSwgYWNjb3VudGluZ1xuICAgICAgICAgICAgLy8gZm9yIHRoZSBwb3NzaWJpbGl0eSB0aGF0IGlzIGlzIGEgc3BhcnNlIGFycmF5XG4gICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgaWYgKGluZGV4IGluIHRoaXMpIHtcbiAgICAgICAgICAgICAgICAgICAgYmFzaXMgPSB0aGlzW2luZGV4KytdO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCsraW5kZXggPj0gbGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IHdoaWxlICgxKTtcbiAgICAgICAgfVxuICAgICAgICAvLyByZWR1Y2VcbiAgICAgICAgZm9yICg7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAvLyBhY2NvdW50IGZvciB0aGUgcG9zc2liaWxpdHkgdGhhdCB0aGUgYXJyYXkgaXMgc3BhcnNlXG4gICAgICAgICAgICBpZiAoaW5kZXggaW4gdGhpcykge1xuICAgICAgICAgICAgICAgIGJhc2lzID0gY2FsbGJhY2soYmFzaXMsIHRoaXNbaW5kZXhdLCBpbmRleCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJhc2lzO1xuICAgIH1cbik7XG5cbnZhciBhcnJheV9pbmRleE9mID0gdW5jdXJyeVRoaXMoXG4gICAgQXJyYXkucHJvdG90eXBlLmluZGV4T2YgfHwgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIC8vIG5vdCBhIHZlcnkgZ29vZCBzaGltLCBidXQgZ29vZCBlbm91Z2ggZm9yIG91ciBvbmUgdXNlIG9mIGl0XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXNbaV0gPT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cbik7XG5cbnZhciBhcnJheV9tYXAgPSB1bmN1cnJ5VGhpcyhcbiAgICBBcnJheS5wcm90b3R5cGUubWFwIHx8IGZ1bmN0aW9uIChjYWxsYmFjaywgdGhpc3ApIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgY29sbGVjdCA9IFtdO1xuICAgICAgICBhcnJheV9yZWR1Y2Uoc2VsZiwgZnVuY3Rpb24gKHVuZGVmaW5lZCwgdmFsdWUsIGluZGV4KSB7XG4gICAgICAgICAgICBjb2xsZWN0LnB1c2goY2FsbGJhY2suY2FsbCh0aGlzcCwgdmFsdWUsIGluZGV4LCBzZWxmKSk7XG4gICAgICAgIH0sIHZvaWQgMCk7XG4gICAgICAgIHJldHVybiBjb2xsZWN0O1xuICAgIH1cbik7XG5cbnZhciBvYmplY3RfY3JlYXRlID0gT2JqZWN0LmNyZWF0ZSB8fCBmdW5jdGlvbiAocHJvdG90eXBlKSB7XG4gICAgZnVuY3Rpb24gVHlwZSgpIHsgfVxuICAgIFR5cGUucHJvdG90eXBlID0gcHJvdG90eXBlO1xuICAgIHJldHVybiBuZXcgVHlwZSgpO1xufTtcblxudmFyIG9iamVjdF9oYXNPd25Qcm9wZXJ0eSA9IHVuY3VycnlUaGlzKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkpO1xuXG52YXIgb2JqZWN0X2tleXMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiAob2JqZWN0KSB7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgIGlmIChvYmplY3RfaGFzT3duUHJvcGVydHkob2JqZWN0LCBrZXkpKSB7XG4gICAgICAgICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ga2V5cztcbn07XG5cbnZhciBvYmplY3RfdG9TdHJpbmcgPSB1bmN1cnJ5VGhpcyhPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nKTtcblxuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IE9iamVjdCh2YWx1ZSk7XG59XG5cbi8vIGdlbmVyYXRvciByZWxhdGVkIHNoaW1zXG5cbi8vIEZJWE1FOiBSZW1vdmUgdGhpcyBmdW5jdGlvbiBvbmNlIEVTNiBnZW5lcmF0b3JzIGFyZSBpbiBTcGlkZXJNb25rZXkuXG5mdW5jdGlvbiBpc1N0b3BJdGVyYXRpb24oZXhjZXB0aW9uKSB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgb2JqZWN0X3RvU3RyaW5nKGV4Y2VwdGlvbikgPT09IFwiW29iamVjdCBTdG9wSXRlcmF0aW9uXVwiIHx8XG4gICAgICAgIGV4Y2VwdGlvbiBpbnN0YW5jZW9mIFFSZXR1cm5WYWx1ZVxuICAgICk7XG59XG5cbi8vIEZJWE1FOiBSZW1vdmUgdGhpcyBoZWxwZXIgYW5kIFEucmV0dXJuIG9uY2UgRVM2IGdlbmVyYXRvcnMgYXJlIGluXG4vLyBTcGlkZXJNb25rZXkuXG52YXIgUVJldHVyblZhbHVlO1xuaWYgKHR5cGVvZiBSZXR1cm5WYWx1ZSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIFFSZXR1cm5WYWx1ZSA9IFJldHVyblZhbHVlO1xufSBlbHNlIHtcbiAgICBRUmV0dXJuVmFsdWUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIH07XG59XG5cbi8vIGxvbmcgc3RhY2sgdHJhY2VzXG5cbnZhciBTVEFDS19KVU1QX1NFUEFSQVRPUiA9IFwiRnJvbSBwcmV2aW91cyBldmVudDpcIjtcblxuZnVuY3Rpb24gbWFrZVN0YWNrVHJhY2VMb25nKGVycm9yLCBwcm9taXNlKSB7XG4gICAgLy8gSWYgcG9zc2libGUsIHRyYW5zZm9ybSB0aGUgZXJyb3Igc3RhY2sgdHJhY2UgYnkgcmVtb3ZpbmcgTm9kZSBhbmQgUVxuICAgIC8vIGNydWZ0LCB0aGVuIGNvbmNhdGVuYXRpbmcgd2l0aCB0aGUgc3RhY2sgdHJhY2Ugb2YgYHByb21pc2VgLiBTZWUgIzU3LlxuICAgIGlmIChoYXNTdGFja3MgJiZcbiAgICAgICAgcHJvbWlzZS5zdGFjayAmJlxuICAgICAgICB0eXBlb2YgZXJyb3IgPT09IFwib2JqZWN0XCIgJiZcbiAgICAgICAgZXJyb3IgIT09IG51bGwgJiZcbiAgICAgICAgZXJyb3Iuc3RhY2sgJiZcbiAgICAgICAgZXJyb3Iuc3RhY2suaW5kZXhPZihTVEFDS19KVU1QX1NFUEFSQVRPUikgPT09IC0xXG4gICAgKSB7XG4gICAgICAgIHZhciBzdGFja3MgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgcCA9IHByb21pc2U7ICEhcDsgcCA9IHAuc291cmNlKSB7XG4gICAgICAgICAgICBpZiAocC5zdGFjaykge1xuICAgICAgICAgICAgICAgIHN0YWNrcy51bnNoaWZ0KHAuc3RhY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHN0YWNrcy51bnNoaWZ0KGVycm9yLnN0YWNrKTtcblxuICAgICAgICB2YXIgY29uY2F0ZWRTdGFja3MgPSBzdGFja3Muam9pbihcIlxcblwiICsgU1RBQ0tfSlVNUF9TRVBBUkFUT1IgKyBcIlxcblwiKTtcbiAgICAgICAgZXJyb3Iuc3RhY2sgPSBmaWx0ZXJTdGFja1N0cmluZyhjb25jYXRlZFN0YWNrcyk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBmaWx0ZXJTdGFja1N0cmluZyhzdGFja1N0cmluZykge1xuICAgIHZhciBsaW5lcyA9IHN0YWNrU3RyaW5nLnNwbGl0KFwiXFxuXCIpO1xuICAgIHZhciBkZXNpcmVkTGluZXMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHZhciBsaW5lID0gbGluZXNbaV07XG5cbiAgICAgICAgaWYgKCFpc0ludGVybmFsRnJhbWUobGluZSkgJiYgIWlzTm9kZUZyYW1lKGxpbmUpICYmIGxpbmUpIHtcbiAgICAgICAgICAgIGRlc2lyZWRMaW5lcy5wdXNoKGxpbmUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkZXNpcmVkTGluZXMuam9pbihcIlxcblwiKTtcbn1cblxuZnVuY3Rpb24gaXNOb2RlRnJhbWUoc3RhY2tMaW5lKSB7XG4gICAgcmV0dXJuIHN0YWNrTGluZS5pbmRleE9mKFwiKG1vZHVsZS5qczpcIikgIT09IC0xIHx8XG4gICAgICAgICAgIHN0YWNrTGluZS5pbmRleE9mKFwiKG5vZGUuanM6XCIpICE9PSAtMTtcbn1cblxuZnVuY3Rpb24gZ2V0RmlsZU5hbWVBbmRMaW5lTnVtYmVyKHN0YWNrTGluZSkge1xuICAgIC8vIE5hbWVkIGZ1bmN0aW9uczogXCJhdCBmdW5jdGlvbk5hbWUgKGZpbGVuYW1lOmxpbmVOdW1iZXI6Y29sdW1uTnVtYmVyKVwiXG4gICAgLy8gSW4gSUUxMCBmdW5jdGlvbiBuYW1lIGNhbiBoYXZlIHNwYWNlcyAoXCJBbm9ueW1vdXMgZnVuY3Rpb25cIikgT19vXG4gICAgdmFyIGF0dGVtcHQxID0gL2F0IC4rIFxcKCguKyk6KFxcZCspOig/OlxcZCspXFwpJC8uZXhlYyhzdGFja0xpbmUpO1xuICAgIGlmIChhdHRlbXB0MSkge1xuICAgICAgICByZXR1cm4gW2F0dGVtcHQxWzFdLCBOdW1iZXIoYXR0ZW1wdDFbMl0pXTtcbiAgICB9XG5cbiAgICAvLyBBbm9ueW1vdXMgZnVuY3Rpb25zOiBcImF0IGZpbGVuYW1lOmxpbmVOdW1iZXI6Y29sdW1uTnVtYmVyXCJcbiAgICB2YXIgYXR0ZW1wdDIgPSAvYXQgKFteIF0rKTooXFxkKyk6KD86XFxkKykkLy5leGVjKHN0YWNrTGluZSk7XG4gICAgaWYgKGF0dGVtcHQyKSB7XG4gICAgICAgIHJldHVybiBbYXR0ZW1wdDJbMV0sIE51bWJlcihhdHRlbXB0MlsyXSldO1xuICAgIH1cblxuICAgIC8vIEZpcmVmb3ggc3R5bGU6IFwiZnVuY3Rpb25AZmlsZW5hbWU6bGluZU51bWJlciBvciBAZmlsZW5hbWU6bGluZU51bWJlclwiXG4gICAgdmFyIGF0dGVtcHQzID0gLy4qQCguKyk6KFxcZCspJC8uZXhlYyhzdGFja0xpbmUpO1xuICAgIGlmIChhdHRlbXB0Mykge1xuICAgICAgICByZXR1cm4gW2F0dGVtcHQzWzFdLCBOdW1iZXIoYXR0ZW1wdDNbMl0pXTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGlzSW50ZXJuYWxGcmFtZShzdGFja0xpbmUpIHtcbiAgICB2YXIgZmlsZU5hbWVBbmRMaW5lTnVtYmVyID0gZ2V0RmlsZU5hbWVBbmRMaW5lTnVtYmVyKHN0YWNrTGluZSk7XG5cbiAgICBpZiAoIWZpbGVOYW1lQW5kTGluZU51bWJlcikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIGZpbGVOYW1lID0gZmlsZU5hbWVBbmRMaW5lTnVtYmVyWzBdO1xuICAgIHZhciBsaW5lTnVtYmVyID0gZmlsZU5hbWVBbmRMaW5lTnVtYmVyWzFdO1xuXG4gICAgcmV0dXJuIGZpbGVOYW1lID09PSBxRmlsZU5hbWUgJiZcbiAgICAgICAgbGluZU51bWJlciA+PSBxU3RhcnRpbmdMaW5lICYmXG4gICAgICAgIGxpbmVOdW1iZXIgPD0gcUVuZGluZ0xpbmU7XG59XG5cbi8vIGRpc2NvdmVyIG93biBmaWxlIG5hbWUgYW5kIGxpbmUgbnVtYmVyIHJhbmdlIGZvciBmaWx0ZXJpbmcgc3RhY2tcbi8vIHRyYWNlc1xuZnVuY3Rpb24gY2FwdHVyZUxpbmUoKSB7XG4gICAgaWYgKCFoYXNTdGFja3MpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgdmFyIGxpbmVzID0gZS5zdGFjay5zcGxpdChcIlxcblwiKTtcbiAgICAgICAgdmFyIGZpcnN0TGluZSA9IGxpbmVzWzBdLmluZGV4T2YoXCJAXCIpID4gMCA/IGxpbmVzWzFdIDogbGluZXNbMl07XG4gICAgICAgIHZhciBmaWxlTmFtZUFuZExpbmVOdW1iZXIgPSBnZXRGaWxlTmFtZUFuZExpbmVOdW1iZXIoZmlyc3RMaW5lKTtcbiAgICAgICAgaWYgKCFmaWxlTmFtZUFuZExpbmVOdW1iZXIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHFGaWxlTmFtZSA9IGZpbGVOYW1lQW5kTGluZU51bWJlclswXTtcbiAgICAgICAgcmV0dXJuIGZpbGVOYW1lQW5kTGluZU51bWJlclsxXTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRlcHJlY2F0ZShjYWxsYmFjaywgbmFtZSwgYWx0ZXJuYXRpdmUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09IFwidW5kZWZpbmVkXCIgJiZcbiAgICAgICAgICAgIHR5cGVvZiBjb25zb2xlLndhcm4gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKG5hbWUgKyBcIiBpcyBkZXByZWNhdGVkLCB1c2UgXCIgKyBhbHRlcm5hdGl2ZSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgXCIgaW5zdGVhZC5cIiwgbmV3IEVycm9yKFwiXCIpLnN0YWNrKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2FsbGJhY2suYXBwbHkoY2FsbGJhY2ssIGFyZ3VtZW50cyk7XG4gICAgfTtcbn1cblxuLy8gZW5kIG9mIHNoaW1zXG4vLyBiZWdpbm5pbmcgb2YgcmVhbCB3b3JrXG5cbi8qKlxuICogQ29uc3RydWN0cyBhIHByb21pc2UgZm9yIGFuIGltbWVkaWF0ZSByZWZlcmVuY2UsIHBhc3NlcyBwcm9taXNlcyB0aHJvdWdoLCBvclxuICogY29lcmNlcyBwcm9taXNlcyBmcm9tIGRpZmZlcmVudCBzeXN0ZW1zLlxuICogQHBhcmFtIHZhbHVlIGltbWVkaWF0ZSByZWZlcmVuY2Ugb3IgcHJvbWlzZVxuICovXG5mdW5jdGlvbiBRKHZhbHVlKSB7XG4gICAgLy8gSWYgdGhlIG9iamVjdCBpcyBhbHJlYWR5IGEgUHJvbWlzZSwgcmV0dXJuIGl0IGRpcmVjdGx5LiAgVGhpcyBlbmFibGVzXG4gICAgLy8gdGhlIHJlc29sdmUgZnVuY3Rpb24gdG8gYm90aCBiZSB1c2VkIHRvIGNyZWF0ZWQgcmVmZXJlbmNlcyBmcm9tIG9iamVjdHMsXG4gICAgLy8gYnV0IHRvIHRvbGVyYWJseSBjb2VyY2Ugbm9uLXByb21pc2VzIHRvIHByb21pc2VzLlxuICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIC8vIGFzc2ltaWxhdGUgdGhlbmFibGVzXG4gICAgaWYgKGlzUHJvbWlzZUFsaWtlKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gY29lcmNlKHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZnVsZmlsbCh2YWx1ZSk7XG4gICAgfVxufVxuUS5yZXNvbHZlID0gUTtcblxuLyoqXG4gKiBQZXJmb3JtcyBhIHRhc2sgaW4gYSBmdXR1cmUgdHVybiBvZiB0aGUgZXZlbnQgbG9vcC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHRhc2tcbiAqL1xuUS5uZXh0VGljayA9IG5leHRUaWNrO1xuXG4vKipcbiAqIENvbnRyb2xzIHdoZXRoZXIgb3Igbm90IGxvbmcgc3RhY2sgdHJhY2VzIHdpbGwgYmUgb25cbiAqL1xuUS5sb25nU3RhY2tTdXBwb3J0ID0gZmFsc2U7XG5cbi8vIGVuYWJsZSBsb25nIHN0YWNrcyBpZiBRX0RFQlVHIGlzIHNldFxuaWYgKHR5cGVvZiBwcm9jZXNzID09PSBcIm9iamVjdFwiICYmIHByb2Nlc3MgJiYgcHJvY2Vzcy5lbnYgJiYgcHJvY2Vzcy5lbnYuUV9ERUJVRykge1xuICAgIFEubG9uZ1N0YWNrU3VwcG9ydCA9IHRydWU7XG59XG5cbi8qKlxuICogQ29uc3RydWN0cyBhIHtwcm9taXNlLCByZXNvbHZlLCByZWplY3R9IG9iamVjdC5cbiAqXG4gKiBgcmVzb2x2ZWAgaXMgYSBjYWxsYmFjayB0byBpbnZva2Ugd2l0aCBhIG1vcmUgcmVzb2x2ZWQgdmFsdWUgZm9yIHRoZVxuICogcHJvbWlzZS4gVG8gZnVsZmlsbCB0aGUgcHJvbWlzZSwgaW52b2tlIGByZXNvbHZlYCB3aXRoIGFueSB2YWx1ZSB0aGF0IGlzXG4gKiBub3QgYSB0aGVuYWJsZS4gVG8gcmVqZWN0IHRoZSBwcm9taXNlLCBpbnZva2UgYHJlc29sdmVgIHdpdGggYSByZWplY3RlZFxuICogdGhlbmFibGUsIG9yIGludm9rZSBgcmVqZWN0YCB3aXRoIHRoZSByZWFzb24gZGlyZWN0bHkuIFRvIHJlc29sdmUgdGhlXG4gKiBwcm9taXNlIHRvIGFub3RoZXIgdGhlbmFibGUsIHRodXMgcHV0dGluZyBpdCBpbiB0aGUgc2FtZSBzdGF0ZSwgaW52b2tlXG4gKiBgcmVzb2x2ZWAgd2l0aCB0aGF0IG90aGVyIHRoZW5hYmxlLlxuICovXG5RLmRlZmVyID0gZGVmZXI7XG5mdW5jdGlvbiBkZWZlcigpIHtcbiAgICAvLyBpZiBcIm1lc3NhZ2VzXCIgaXMgYW4gXCJBcnJheVwiLCB0aGF0IGluZGljYXRlcyB0aGF0IHRoZSBwcm9taXNlIGhhcyBub3QgeWV0XG4gICAgLy8gYmVlbiByZXNvbHZlZC4gIElmIGl0IGlzIFwidW5kZWZpbmVkXCIsIGl0IGhhcyBiZWVuIHJlc29sdmVkLiAgRWFjaFxuICAgIC8vIGVsZW1lbnQgb2YgdGhlIG1lc3NhZ2VzIGFycmF5IGlzIGl0c2VsZiBhbiBhcnJheSBvZiBjb21wbGV0ZSBhcmd1bWVudHMgdG9cbiAgICAvLyBmb3J3YXJkIHRvIHRoZSByZXNvbHZlZCBwcm9taXNlLiAgV2UgY29lcmNlIHRoZSByZXNvbHV0aW9uIHZhbHVlIHRvIGFcbiAgICAvLyBwcm9taXNlIHVzaW5nIHRoZSBgcmVzb2x2ZWAgZnVuY3Rpb24gYmVjYXVzZSBpdCBoYW5kbGVzIGJvdGggZnVsbHlcbiAgICAvLyBub24tdGhlbmFibGUgdmFsdWVzIGFuZCBvdGhlciB0aGVuYWJsZXMgZ3JhY2VmdWxseS5cbiAgICB2YXIgbWVzc2FnZXMgPSBbXSwgcHJvZ3Jlc3NMaXN0ZW5lcnMgPSBbXSwgcmVzb2x2ZWRQcm9taXNlO1xuXG4gICAgdmFyIGRlZmVycmVkID0gb2JqZWN0X2NyZWF0ZShkZWZlci5wcm90b3R5cGUpO1xuICAgIHZhciBwcm9taXNlID0gb2JqZWN0X2NyZWF0ZShQcm9taXNlLnByb3RvdHlwZSk7XG5cbiAgICBwcm9taXNlLnByb21pc2VEaXNwYXRjaCA9IGZ1bmN0aW9uIChyZXNvbHZlLCBvcCwgb3BlcmFuZHMpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBhcnJheV9zbGljZShhcmd1bWVudHMpO1xuICAgICAgICBpZiAobWVzc2FnZXMpIHtcbiAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2goYXJncyk7XG4gICAgICAgICAgICBpZiAob3AgPT09IFwid2hlblwiICYmIG9wZXJhbmRzWzFdKSB7IC8vIHByb2dyZXNzIG9wZXJhbmRcbiAgICAgICAgICAgICAgICBwcm9ncmVzc0xpc3RlbmVycy5wdXNoKG9wZXJhbmRzWzFdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIFEubmV4dFRpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJlc29sdmVkUHJvbWlzZS5wcm9taXNlRGlzcGF0Y2guYXBwbHkocmVzb2x2ZWRQcm9taXNlLCBhcmdzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIFhYWCBkZXByZWNhdGVkXG4gICAgcHJvbWlzZS52YWx1ZU9mID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAobWVzc2FnZXMpIHtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBuZWFyZXJWYWx1ZSA9IG5lYXJlcihyZXNvbHZlZFByb21pc2UpO1xuICAgICAgICBpZiAoaXNQcm9taXNlKG5lYXJlclZhbHVlKSkge1xuICAgICAgICAgICAgcmVzb2x2ZWRQcm9taXNlID0gbmVhcmVyVmFsdWU7IC8vIHNob3J0ZW4gY2hhaW5cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmVhcmVyVmFsdWU7XG4gICAgfTtcblxuICAgIHByb21pc2UuaW5zcGVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCFyZXNvbHZlZFByb21pc2UpIHtcbiAgICAgICAgICAgIHJldHVybiB7IHN0YXRlOiBcInBlbmRpbmdcIiB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXNvbHZlZFByb21pc2UuaW5zcGVjdCgpO1xuICAgIH07XG5cbiAgICBpZiAoUS5sb25nU3RhY2tTdXBwb3J0ICYmIGhhc1N0YWNrcykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIC8vIE5PVEU6IGRvbid0IHRyeSB0byB1c2UgYEVycm9yLmNhcHR1cmVTdGFja1RyYWNlYCBvciB0cmFuc2ZlciB0aGVcbiAgICAgICAgICAgIC8vIGFjY2Vzc29yIGFyb3VuZDsgdGhhdCBjYXVzZXMgbWVtb3J5IGxlYWtzIGFzIHBlciBHSC0xMTEuIEp1c3RcbiAgICAgICAgICAgIC8vIHJlaWZ5IHRoZSBzdGFjayB0cmFjZSBhcyBhIHN0cmluZyBBU0FQLlxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIEF0IHRoZSBzYW1lIHRpbWUsIGN1dCBvZmYgdGhlIGZpcnN0IGxpbmU7IGl0J3MgYWx3YXlzIGp1c3RcbiAgICAgICAgICAgIC8vIFwiW29iamVjdCBQcm9taXNlXVxcblwiLCBhcyBwZXIgdGhlIGB0b1N0cmluZ2AuXG4gICAgICAgICAgICBwcm9taXNlLnN0YWNrID0gZS5zdGFjay5zdWJzdHJpbmcoZS5zdGFjay5pbmRleE9mKFwiXFxuXCIpICsgMSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBOT1RFOiB3ZSBkbyB0aGUgY2hlY2tzIGZvciBgcmVzb2x2ZWRQcm9taXNlYCBpbiBlYWNoIG1ldGhvZCwgaW5zdGVhZCBvZlxuICAgIC8vIGNvbnNvbGlkYXRpbmcgdGhlbSBpbnRvIGBiZWNvbWVgLCBzaW5jZSBvdGhlcndpc2Ugd2UnZCBjcmVhdGUgbmV3XG4gICAgLy8gcHJvbWlzZXMgd2l0aCB0aGUgbGluZXMgYGJlY29tZSh3aGF0ZXZlcih2YWx1ZSkpYC4gU2VlIGUuZy4gR0gtMjUyLlxuXG4gICAgZnVuY3Rpb24gYmVjb21lKG5ld1Byb21pc2UpIHtcbiAgICAgICAgcmVzb2x2ZWRQcm9taXNlID0gbmV3UHJvbWlzZTtcbiAgICAgICAgcHJvbWlzZS5zb3VyY2UgPSBuZXdQcm9taXNlO1xuXG4gICAgICAgIGFycmF5X3JlZHVjZShtZXNzYWdlcywgZnVuY3Rpb24gKHVuZGVmaW5lZCwgbWVzc2FnZSkge1xuICAgICAgICAgICAgUS5uZXh0VGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgbmV3UHJvbWlzZS5wcm9taXNlRGlzcGF0Y2guYXBwbHkobmV3UHJvbWlzZSwgbWVzc2FnZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSwgdm9pZCAwKTtcblxuICAgICAgICBtZXNzYWdlcyA9IHZvaWQgMDtcbiAgICAgICAgcHJvZ3Jlc3NMaXN0ZW5lcnMgPSB2b2lkIDA7XG4gICAgfVxuXG4gICAgZGVmZXJyZWQucHJvbWlzZSA9IHByb21pc2U7XG4gICAgZGVmZXJyZWQucmVzb2x2ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICBpZiAocmVzb2x2ZWRQcm9taXNlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBiZWNvbWUoUSh2YWx1ZSkpO1xuICAgIH07XG5cbiAgICBkZWZlcnJlZC5mdWxmaWxsID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIGlmIChyZXNvbHZlZFByb21pc2UpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGJlY29tZShmdWxmaWxsKHZhbHVlKSk7XG4gICAgfTtcbiAgICBkZWZlcnJlZC5yZWplY3QgPSBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAgIGlmIChyZXNvbHZlZFByb21pc2UpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGJlY29tZShyZWplY3QocmVhc29uKSk7XG4gICAgfTtcbiAgICBkZWZlcnJlZC5ub3RpZnkgPSBmdW5jdGlvbiAocHJvZ3Jlc3MpIHtcbiAgICAgICAgaWYgKHJlc29sdmVkUHJvbWlzZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgYXJyYXlfcmVkdWNlKHByb2dyZXNzTGlzdGVuZXJzLCBmdW5jdGlvbiAodW5kZWZpbmVkLCBwcm9ncmVzc0xpc3RlbmVyKSB7XG4gICAgICAgICAgICBRLm5leHRUaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBwcm9ncmVzc0xpc3RlbmVyKHByb2dyZXNzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LCB2b2lkIDApO1xuICAgIH07XG5cbiAgICByZXR1cm4gZGVmZXJyZWQ7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIE5vZGUtc3R5bGUgY2FsbGJhY2sgdGhhdCB3aWxsIHJlc29sdmUgb3IgcmVqZWN0IHRoZSBkZWZlcnJlZFxuICogcHJvbWlzZS5cbiAqIEByZXR1cm5zIGEgbm9kZWJhY2tcbiAqL1xuZGVmZXIucHJvdG90eXBlLm1ha2VOb2RlUmVzb2x2ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHJldHVybiBmdW5jdGlvbiAoZXJyb3IsIHZhbHVlKSB7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgc2VsZi5yZWplY3QoZXJyb3IpO1xuICAgICAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAyKSB7XG4gICAgICAgICAgICBzZWxmLnJlc29sdmUoYXJyYXlfc2xpY2UoYXJndW1lbnRzLCAxKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZWxmLnJlc29sdmUodmFsdWUpO1xuICAgICAgICB9XG4gICAgfTtcbn07XG5cbi8qKlxuICogQHBhcmFtIHJlc29sdmVyIHtGdW5jdGlvbn0gYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgbm90aGluZyBhbmQgYWNjZXB0c1xuICogdGhlIHJlc29sdmUsIHJlamVjdCwgYW5kIG5vdGlmeSBmdW5jdGlvbnMgZm9yIGEgZGVmZXJyZWQuXG4gKiBAcmV0dXJucyBhIHByb21pc2UgdGhhdCBtYXkgYmUgcmVzb2x2ZWQgd2l0aCB0aGUgZ2l2ZW4gcmVzb2x2ZSBhbmQgcmVqZWN0XG4gKiBmdW5jdGlvbnMsIG9yIHJlamVjdGVkIGJ5IGEgdGhyb3duIGV4Y2VwdGlvbiBpbiByZXNvbHZlclxuICovXG5RLlByb21pc2UgPSBwcm9taXNlOyAvLyBFUzZcblEucHJvbWlzZSA9IHByb21pc2U7XG5mdW5jdGlvbiBwcm9taXNlKHJlc29sdmVyKSB7XG4gICAgaWYgKHR5cGVvZiByZXNvbHZlciAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJyZXNvbHZlciBtdXN0IGJlIGEgZnVuY3Rpb24uXCIpO1xuICAgIH1cbiAgICB2YXIgZGVmZXJyZWQgPSBkZWZlcigpO1xuICAgIHRyeSB7XG4gICAgICAgIHJlc29sdmVyKGRlZmVycmVkLnJlc29sdmUsIGRlZmVycmVkLnJlamVjdCwgZGVmZXJyZWQubm90aWZ5KTtcbiAgICB9IGNhdGNoIChyZWFzb24pIHtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KHJlYXNvbik7XG4gICAgfVxuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufVxuXG5wcm9taXNlLnJhY2UgPSByYWNlOyAvLyBFUzZcbnByb21pc2UuYWxsID0gYWxsOyAvLyBFUzZcbnByb21pc2UucmVqZWN0ID0gcmVqZWN0OyAvLyBFUzZcbnByb21pc2UucmVzb2x2ZSA9IFE7IC8vIEVTNlxuXG4vLyBYWFggZXhwZXJpbWVudGFsLiAgVGhpcyBtZXRob2QgaXMgYSB3YXkgdG8gZGVub3RlIHRoYXQgYSBsb2NhbCB2YWx1ZSBpc1xuLy8gc2VyaWFsaXphYmxlIGFuZCBzaG91bGQgYmUgaW1tZWRpYXRlbHkgZGlzcGF0Y2hlZCB0byBhIHJlbW90ZSB1cG9uIHJlcXVlc3QsXG4vLyBpbnN0ZWFkIG9mIHBhc3NpbmcgYSByZWZlcmVuY2UuXG5RLnBhc3NCeUNvcHkgPSBmdW5jdGlvbiAob2JqZWN0KSB7XG4gICAgLy9mcmVlemUob2JqZWN0KTtcbiAgICAvL3Bhc3NCeUNvcGllcy5zZXQob2JqZWN0LCB0cnVlKTtcbiAgICByZXR1cm4gb2JqZWN0O1xufTtcblxuUHJvbWlzZS5wcm90b3R5cGUucGFzc0J5Q29weSA9IGZ1bmN0aW9uICgpIHtcbiAgICAvL2ZyZWV6ZShvYmplY3QpO1xuICAgIC8vcGFzc0J5Q29waWVzLnNldChvYmplY3QsIHRydWUpO1xuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBJZiB0d28gcHJvbWlzZXMgZXZlbnR1YWxseSBmdWxmaWxsIHRvIHRoZSBzYW1lIHZhbHVlLCBwcm9taXNlcyB0aGF0IHZhbHVlLFxuICogYnV0IG90aGVyd2lzZSByZWplY3RzLlxuICogQHBhcmFtIHgge0FueSp9XG4gKiBAcGFyYW0geSB7QW55Kn1cbiAqIEByZXR1cm5zIHtBbnkqfSBhIHByb21pc2UgZm9yIHggYW5kIHkgaWYgdGhleSBhcmUgdGhlIHNhbWUsIGJ1dCBhIHJlamVjdGlvblxuICogb3RoZXJ3aXNlLlxuICpcbiAqL1xuUS5qb2luID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICByZXR1cm4gUSh4KS5qb2luKHkpO1xufTtcblxuUHJvbWlzZS5wcm90b3R5cGUuam9pbiA9IGZ1bmN0aW9uICh0aGF0KSB7XG4gICAgcmV0dXJuIFEoW3RoaXMsIHRoYXRdKS5zcHJlYWQoZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgaWYgKHggPT09IHkpIHtcbiAgICAgICAgICAgIC8vIFRPRE86IFwiPT09XCIgc2hvdWxkIGJlIE9iamVjdC5pcyBvciBlcXVpdlxuICAgICAgICAgICAgcmV0dXJuIHg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCBqb2luOiBub3QgdGhlIHNhbWU6IFwiICsgeCArIFwiIFwiICsgeSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5cbi8qKlxuICogUmV0dXJucyBhIHByb21pc2UgZm9yIHRoZSBmaXJzdCBvZiBhbiBhcnJheSBvZiBwcm9taXNlcyB0byBiZWNvbWUgc2V0dGxlZC5cbiAqIEBwYXJhbSBhbnN3ZXJzIHtBcnJheVtBbnkqXX0gcHJvbWlzZXMgdG8gcmFjZVxuICogQHJldHVybnMge0FueSp9IHRoZSBmaXJzdCBwcm9taXNlIHRvIGJlIHNldHRsZWRcbiAqL1xuUS5yYWNlID0gcmFjZTtcbmZ1bmN0aW9uIHJhY2UoYW5zd2VyUHMpIHtcbiAgICByZXR1cm4gcHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIC8vIFN3aXRjaCB0byB0aGlzIG9uY2Ugd2UgY2FuIGFzc3VtZSBhdCBsZWFzdCBFUzVcbiAgICAgICAgLy8gYW5zd2VyUHMuZm9yRWFjaChmdW5jdGlvbiAoYW5zd2VyUCkge1xuICAgICAgICAvLyAgICAgUShhbnN3ZXJQKS50aGVuKHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIC8vIH0pO1xuICAgICAgICAvLyBVc2UgdGhpcyBpbiB0aGUgbWVhbnRpbWVcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGFuc3dlclBzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBRKGFuc3dlclBzW2ldKS50aGVuKHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuUHJvbWlzZS5wcm90b3R5cGUucmFjZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy50aGVuKFEucmFjZSk7XG59O1xuXG4vKipcbiAqIENvbnN0cnVjdHMgYSBQcm9taXNlIHdpdGggYSBwcm9taXNlIGRlc2NyaXB0b3Igb2JqZWN0IGFuZCBvcHRpb25hbCBmYWxsYmFja1xuICogZnVuY3Rpb24uICBUaGUgZGVzY3JpcHRvciBjb250YWlucyBtZXRob2RzIGxpa2Ugd2hlbihyZWplY3RlZCksIGdldChuYW1lKSxcbiAqIHNldChuYW1lLCB2YWx1ZSksIHBvc3QobmFtZSwgYXJncyksIGFuZCBkZWxldGUobmFtZSksIHdoaWNoIGFsbFxuICogcmV0dXJuIGVpdGhlciBhIHZhbHVlLCBhIHByb21pc2UgZm9yIGEgdmFsdWUsIG9yIGEgcmVqZWN0aW9uLiAgVGhlIGZhbGxiYWNrXG4gKiBhY2NlcHRzIHRoZSBvcGVyYXRpb24gbmFtZSwgYSByZXNvbHZlciwgYW5kIGFueSBmdXJ0aGVyIGFyZ3VtZW50cyB0aGF0IHdvdWxkXG4gKiBoYXZlIGJlZW4gZm9yd2FyZGVkIHRvIHRoZSBhcHByb3ByaWF0ZSBtZXRob2QgYWJvdmUgaGFkIGEgbWV0aG9kIGJlZW5cbiAqIHByb3ZpZGVkIHdpdGggdGhlIHByb3BlciBuYW1lLiAgVGhlIEFQSSBtYWtlcyBubyBndWFyYW50ZWVzIGFib3V0IHRoZSBuYXR1cmVcbiAqIG9mIHRoZSByZXR1cm5lZCBvYmplY3QsIGFwYXJ0IGZyb20gdGhhdCBpdCBpcyB1c2FibGUgd2hlcmVldmVyIHByb21pc2VzIGFyZVxuICogYm91Z2h0IGFuZCBzb2xkLlxuICovXG5RLm1ha2VQcm9taXNlID0gUHJvbWlzZTtcbmZ1bmN0aW9uIFByb21pc2UoZGVzY3JpcHRvciwgZmFsbGJhY2ssIGluc3BlY3QpIHtcbiAgICBpZiAoZmFsbGJhY2sgPT09IHZvaWQgMCkge1xuICAgICAgICBmYWxsYmFjayA9IGZ1bmN0aW9uIChvcCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlamVjdChuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgXCJQcm9taXNlIGRvZXMgbm90IHN1cHBvcnQgb3BlcmF0aW9uOiBcIiArIG9wXG4gICAgICAgICAgICApKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgaWYgKGluc3BlY3QgPT09IHZvaWQgMCkge1xuICAgICAgICBpbnNwZWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHtzdGF0ZTogXCJ1bmtub3duXCJ9O1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHZhciBwcm9taXNlID0gb2JqZWN0X2NyZWF0ZShQcm9taXNlLnByb3RvdHlwZSk7XG5cbiAgICBwcm9taXNlLnByb21pc2VEaXNwYXRjaCA9IGZ1bmN0aW9uIChyZXNvbHZlLCBvcCwgYXJncykge1xuICAgICAgICB2YXIgcmVzdWx0O1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKGRlc2NyaXB0b3Jbb3BdKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gZGVzY3JpcHRvcltvcF0uYXBwbHkocHJvbWlzZSwgYXJncyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGZhbGxiYWNrLmNhbGwocHJvbWlzZSwgb3AsIGFyZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHJlamVjdChleGNlcHRpb24pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXNvbHZlKSB7XG4gICAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcHJvbWlzZS5pbnNwZWN0ID0gaW5zcGVjdDtcblxuICAgIC8vIFhYWCBkZXByZWNhdGVkIGB2YWx1ZU9mYCBhbmQgYGV4Y2VwdGlvbmAgc3VwcG9ydFxuICAgIGlmIChpbnNwZWN0KSB7XG4gICAgICAgIHZhciBpbnNwZWN0ZWQgPSBpbnNwZWN0KCk7XG4gICAgICAgIGlmIChpbnNwZWN0ZWQuc3RhdGUgPT09IFwicmVqZWN0ZWRcIikge1xuICAgICAgICAgICAgcHJvbWlzZS5leGNlcHRpb24gPSBpbnNwZWN0ZWQucmVhc29uO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvbWlzZS52YWx1ZU9mID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGluc3BlY3RlZCA9IGluc3BlY3QoKTtcbiAgICAgICAgICAgIGlmIChpbnNwZWN0ZWQuc3RhdGUgPT09IFwicGVuZGluZ1wiIHx8XG4gICAgICAgICAgICAgICAgaW5zcGVjdGVkLnN0YXRlID09PSBcInJlamVjdGVkXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBpbnNwZWN0ZWQudmFsdWU7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHByb21pc2U7XG59XG5cblByb21pc2UucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBcIltvYmplY3QgUHJvbWlzZV1cIjtcbn07XG5cblByb21pc2UucHJvdG90eXBlLnRoZW4gPSBmdW5jdGlvbiAoZnVsZmlsbGVkLCByZWplY3RlZCwgcHJvZ3Jlc3NlZCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgZGVmZXJyZWQgPSBkZWZlcigpO1xuICAgIHZhciBkb25lID0gZmFsc2U7ICAgLy8gZW5zdXJlIHRoZSB1bnRydXN0ZWQgcHJvbWlzZSBtYWtlcyBhdCBtb3N0IGFcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNpbmdsZSBjYWxsIHRvIG9uZSBvZiB0aGUgY2FsbGJhY2tzXG5cbiAgICBmdW5jdGlvbiBfZnVsZmlsbGVkKHZhbHVlKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIGZ1bGZpbGxlZCA9PT0gXCJmdW5jdGlvblwiID8gZnVsZmlsbGVkKHZhbHVlKSA6IHZhbHVlO1xuICAgICAgICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiByZWplY3QoZXhjZXB0aW9uKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9yZWplY3RlZChleGNlcHRpb24pIHtcbiAgICAgICAgaWYgKHR5cGVvZiByZWplY3RlZCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICBtYWtlU3RhY2tUcmFjZUxvbmcoZXhjZXB0aW9uLCBzZWxmKTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlamVjdGVkKGV4Y2VwdGlvbik7XG4gICAgICAgICAgICB9IGNhdGNoIChuZXdFeGNlcHRpb24pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVqZWN0KG5ld0V4Y2VwdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlamVjdChleGNlcHRpb24pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9wcm9ncmVzc2VkKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB0eXBlb2YgcHJvZ3Jlc3NlZCA9PT0gXCJmdW5jdGlvblwiID8gcHJvZ3Jlc3NlZCh2YWx1ZSkgOiB2YWx1ZTtcbiAgICB9XG5cbiAgICBRLm5leHRUaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZi5wcm9taXNlRGlzcGF0Y2goZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAoZG9uZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRvbmUgPSB0cnVlO1xuXG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKF9mdWxmaWxsZWQodmFsdWUpKTtcbiAgICAgICAgfSwgXCJ3aGVuXCIsIFtmdW5jdGlvbiAoZXhjZXB0aW9uKSB7XG4gICAgICAgICAgICBpZiAoZG9uZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRvbmUgPSB0cnVlO1xuXG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKF9yZWplY3RlZChleGNlcHRpb24pKTtcbiAgICAgICAgfV0pO1xuICAgIH0pO1xuXG4gICAgLy8gUHJvZ3Jlc3MgcHJvcGFnYXRvciBuZWVkIHRvIGJlIGF0dGFjaGVkIGluIHRoZSBjdXJyZW50IHRpY2suXG4gICAgc2VsZi5wcm9taXNlRGlzcGF0Y2godm9pZCAwLCBcIndoZW5cIiwgW3ZvaWQgMCwgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHZhciBuZXdWYWx1ZTtcbiAgICAgICAgdmFyIHRocmV3ID0gZmFsc2U7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBuZXdWYWx1ZSA9IF9wcm9ncmVzc2VkKHZhbHVlKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhyZXcgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKFEub25lcnJvcikge1xuICAgICAgICAgICAgICAgIFEub25lcnJvcihlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhyZXcpIHtcbiAgICAgICAgICAgIGRlZmVycmVkLm5vdGlmeShuZXdWYWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cblEudGFwID0gZnVuY3Rpb24gKHByb21pc2UsIGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIFEocHJvbWlzZSkudGFwKGNhbGxiYWNrKTtcbn07XG5cbi8qKlxuICogV29ya3MgYWxtb3N0IGxpa2UgXCJmaW5hbGx5XCIsIGJ1dCBub3QgY2FsbGVkIGZvciByZWplY3Rpb25zLlxuICogT3JpZ2luYWwgcmVzb2x1dGlvbiB2YWx1ZSBpcyBwYXNzZWQgdGhyb3VnaCBjYWxsYmFjayB1bmFmZmVjdGVkLlxuICogQ2FsbGJhY2sgbWF5IHJldHVybiBhIHByb21pc2UgdGhhdCB3aWxsIGJlIGF3YWl0ZWQgZm9yLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAqIEByZXR1cm5zIHtRLlByb21pc2V9XG4gKiBAZXhhbXBsZVxuICogZG9Tb21ldGhpbmcoKVxuICogICAudGhlbiguLi4pXG4gKiAgIC50YXAoY29uc29sZS5sb2cpXG4gKiAgIC50aGVuKC4uLik7XG4gKi9cblByb21pc2UucHJvdG90eXBlLnRhcCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgIGNhbGxiYWNrID0gUShjYWxsYmFjayk7XG5cbiAgICByZXR1cm4gdGhpcy50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gY2FsbGJhY2suZmNhbGwodmFsdWUpLnRoZW5SZXNvbHZlKHZhbHVlKTtcbiAgICB9KTtcbn07XG5cbi8qKlxuICogUmVnaXN0ZXJzIGFuIG9ic2VydmVyIG9uIGEgcHJvbWlzZS5cbiAqXG4gKiBHdWFyYW50ZWVzOlxuICpcbiAqIDEuIHRoYXQgZnVsZmlsbGVkIGFuZCByZWplY3RlZCB3aWxsIGJlIGNhbGxlZCBvbmx5IG9uY2UuXG4gKiAyLiB0aGF0IGVpdGhlciB0aGUgZnVsZmlsbGVkIGNhbGxiYWNrIG9yIHRoZSByZWplY3RlZCBjYWxsYmFjayB3aWxsIGJlXG4gKiAgICBjYWxsZWQsIGJ1dCBub3QgYm90aC5cbiAqIDMuIHRoYXQgZnVsZmlsbGVkIGFuZCByZWplY3RlZCB3aWxsIG5vdCBiZSBjYWxsZWQgaW4gdGhpcyB0dXJuLlxuICpcbiAqIEBwYXJhbSB2YWx1ZSAgICAgIHByb21pc2Ugb3IgaW1tZWRpYXRlIHJlZmVyZW5jZSB0byBvYnNlcnZlXG4gKiBAcGFyYW0gZnVsZmlsbGVkICBmdW5jdGlvbiB0byBiZSBjYWxsZWQgd2l0aCB0aGUgZnVsZmlsbGVkIHZhbHVlXG4gKiBAcGFyYW0gcmVqZWN0ZWQgICBmdW5jdGlvbiB0byBiZSBjYWxsZWQgd2l0aCB0aGUgcmVqZWN0aW9uIGV4Y2VwdGlvblxuICogQHBhcmFtIHByb2dyZXNzZWQgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIG9uIGFueSBwcm9ncmVzcyBub3RpZmljYXRpb25zXG4gKiBAcmV0dXJuIHByb21pc2UgZm9yIHRoZSByZXR1cm4gdmFsdWUgZnJvbSB0aGUgaW52b2tlZCBjYWxsYmFja1xuICovXG5RLndoZW4gPSB3aGVuO1xuZnVuY3Rpb24gd2hlbih2YWx1ZSwgZnVsZmlsbGVkLCByZWplY3RlZCwgcHJvZ3Jlc3NlZCkge1xuICAgIHJldHVybiBRKHZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQsIHByb2dyZXNzZWQpO1xufVxuXG5Qcm9taXNlLnByb3RvdHlwZS50aGVuUmVzb2x2ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLnRoZW4oZnVuY3Rpb24gKCkgeyByZXR1cm4gdmFsdWU7IH0pO1xufTtcblxuUS50aGVuUmVzb2x2ZSA9IGZ1bmN0aW9uIChwcm9taXNlLCB2YWx1ZSkge1xuICAgIHJldHVybiBRKHByb21pc2UpLnRoZW5SZXNvbHZlKHZhbHVlKTtcbn07XG5cblByb21pc2UucHJvdG90eXBlLnRoZW5SZWplY3QgPSBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgcmV0dXJuIHRoaXMudGhlbihmdW5jdGlvbiAoKSB7IHRocm93IHJlYXNvbjsgfSk7XG59O1xuXG5RLnRoZW5SZWplY3QgPSBmdW5jdGlvbiAocHJvbWlzZSwgcmVhc29uKSB7XG4gICAgcmV0dXJuIFEocHJvbWlzZSkudGhlblJlamVjdChyZWFzb24pO1xufTtcblxuLyoqXG4gKiBJZiBhbiBvYmplY3QgaXMgbm90IGEgcHJvbWlzZSwgaXQgaXMgYXMgXCJuZWFyXCIgYXMgcG9zc2libGUuXG4gKiBJZiBhIHByb21pc2UgaXMgcmVqZWN0ZWQsIGl0IGlzIGFzIFwibmVhclwiIGFzIHBvc3NpYmxlIHRvby5cbiAqIElmIGl04oCZcyBhIGZ1bGZpbGxlZCBwcm9taXNlLCB0aGUgZnVsZmlsbG1lbnQgdmFsdWUgaXMgbmVhcmVyLlxuICogSWYgaXTigJlzIGEgZGVmZXJyZWQgcHJvbWlzZSBhbmQgdGhlIGRlZmVycmVkIGhhcyBiZWVuIHJlc29sdmVkLCB0aGVcbiAqIHJlc29sdXRpb24gaXMgXCJuZWFyZXJcIi5cbiAqIEBwYXJhbSBvYmplY3RcbiAqIEByZXR1cm5zIG1vc3QgcmVzb2x2ZWQgKG5lYXJlc3QpIGZvcm0gb2YgdGhlIG9iamVjdFxuICovXG5cbi8vIFhYWCBzaG91bGQgd2UgcmUtZG8gdGhpcz9cblEubmVhcmVyID0gbmVhcmVyO1xuZnVuY3Rpb24gbmVhcmVyKHZhbHVlKSB7XG4gICAgaWYgKGlzUHJvbWlzZSh2YWx1ZSkpIHtcbiAgICAgICAgdmFyIGluc3BlY3RlZCA9IHZhbHVlLmluc3BlY3QoKTtcbiAgICAgICAgaWYgKGluc3BlY3RlZC5zdGF0ZSA9PT0gXCJmdWxmaWxsZWRcIikge1xuICAgICAgICAgICAgcmV0dXJuIGluc3BlY3RlZC52YWx1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG59XG5cbi8qKlxuICogQHJldHVybnMgd2hldGhlciB0aGUgZ2l2ZW4gb2JqZWN0IGlzIGEgcHJvbWlzZS5cbiAqIE90aGVyd2lzZSBpdCBpcyBhIGZ1bGZpbGxlZCB2YWx1ZS5cbiAqL1xuUS5pc1Byb21pc2UgPSBpc1Byb21pc2U7XG5mdW5jdGlvbiBpc1Byb21pc2Uob2JqZWN0KSB7XG4gICAgcmV0dXJuIG9iamVjdCBpbnN0YW5jZW9mIFByb21pc2U7XG59XG5cblEuaXNQcm9taXNlQWxpa2UgPSBpc1Byb21pc2VBbGlrZTtcbmZ1bmN0aW9uIGlzUHJvbWlzZUFsaWtlKG9iamVjdCkge1xuICAgIHJldHVybiBpc09iamVjdChvYmplY3QpICYmIHR5cGVvZiBvYmplY3QudGhlbiA9PT0gXCJmdW5jdGlvblwiO1xufVxuXG4vKipcbiAqIEByZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmVuIG9iamVjdCBpcyBhIHBlbmRpbmcgcHJvbWlzZSwgbWVhbmluZyBub3RcbiAqIGZ1bGZpbGxlZCBvciByZWplY3RlZC5cbiAqL1xuUS5pc1BlbmRpbmcgPSBpc1BlbmRpbmc7XG5mdW5jdGlvbiBpc1BlbmRpbmcob2JqZWN0KSB7XG4gICAgcmV0dXJuIGlzUHJvbWlzZShvYmplY3QpICYmIG9iamVjdC5pbnNwZWN0KCkuc3RhdGUgPT09IFwicGVuZGluZ1wiO1xufVxuXG5Qcm9taXNlLnByb3RvdHlwZS5pc1BlbmRpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5zcGVjdCgpLnN0YXRlID09PSBcInBlbmRpbmdcIjtcbn07XG5cbi8qKlxuICogQHJldHVybnMgd2hldGhlciB0aGUgZ2l2ZW4gb2JqZWN0IGlzIGEgdmFsdWUgb3IgZnVsZmlsbGVkXG4gKiBwcm9taXNlLlxuICovXG5RLmlzRnVsZmlsbGVkID0gaXNGdWxmaWxsZWQ7XG5mdW5jdGlvbiBpc0Z1bGZpbGxlZChvYmplY3QpIHtcbiAgICByZXR1cm4gIWlzUHJvbWlzZShvYmplY3QpIHx8IG9iamVjdC5pbnNwZWN0KCkuc3RhdGUgPT09IFwiZnVsZmlsbGVkXCI7XG59XG5cblByb21pc2UucHJvdG90eXBlLmlzRnVsZmlsbGVkID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmluc3BlY3QoKS5zdGF0ZSA9PT0gXCJmdWxmaWxsZWRcIjtcbn07XG5cbi8qKlxuICogQHJldHVybnMgd2hldGhlciB0aGUgZ2l2ZW4gb2JqZWN0IGlzIGEgcmVqZWN0ZWQgcHJvbWlzZS5cbiAqL1xuUS5pc1JlamVjdGVkID0gaXNSZWplY3RlZDtcbmZ1bmN0aW9uIGlzUmVqZWN0ZWQob2JqZWN0KSB7XG4gICAgcmV0dXJuIGlzUHJvbWlzZShvYmplY3QpICYmIG9iamVjdC5pbnNwZWN0KCkuc3RhdGUgPT09IFwicmVqZWN0ZWRcIjtcbn1cblxuUHJvbWlzZS5wcm90b3R5cGUuaXNSZWplY3RlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5pbnNwZWN0KCkuc3RhdGUgPT09IFwicmVqZWN0ZWRcIjtcbn07XG5cbi8vLy8gQkVHSU4gVU5IQU5ETEVEIFJFSkVDVElPTiBUUkFDS0lOR1xuXG4vLyBUaGlzIHByb21pc2UgbGlicmFyeSBjb25zdW1lcyBleGNlcHRpb25zIHRocm93biBpbiBoYW5kbGVycyBzbyB0aGV5IGNhbiBiZVxuLy8gaGFuZGxlZCBieSBhIHN1YnNlcXVlbnQgcHJvbWlzZS4gIFRoZSBleGNlcHRpb25zIGdldCBhZGRlZCB0byB0aGlzIGFycmF5IHdoZW5cbi8vIHRoZXkgYXJlIGNyZWF0ZWQsIGFuZCByZW1vdmVkIHdoZW4gdGhleSBhcmUgaGFuZGxlZC4gIE5vdGUgdGhhdCBpbiBFUzYgb3Jcbi8vIHNoaW1tZWQgZW52aXJvbm1lbnRzLCB0aGlzIHdvdWxkIG5hdHVyYWxseSBiZSBhIGBTZXRgLlxudmFyIHVuaGFuZGxlZFJlYXNvbnMgPSBbXTtcbnZhciB1bmhhbmRsZWRSZWplY3Rpb25zID0gW107XG52YXIgcmVwb3J0ZWRVbmhhbmRsZWRSZWplY3Rpb25zID0gW107XG52YXIgdHJhY2tVbmhhbmRsZWRSZWplY3Rpb25zID0gdHJ1ZTtcblxuZnVuY3Rpb24gcmVzZXRVbmhhbmRsZWRSZWplY3Rpb25zKCkge1xuICAgIHVuaGFuZGxlZFJlYXNvbnMubGVuZ3RoID0gMDtcbiAgICB1bmhhbmRsZWRSZWplY3Rpb25zLmxlbmd0aCA9IDA7XG5cbiAgICBpZiAoIXRyYWNrVW5oYW5kbGVkUmVqZWN0aW9ucykge1xuICAgICAgICB0cmFja1VuaGFuZGxlZFJlamVjdGlvbnMgPSB0cnVlO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gdHJhY2tSZWplY3Rpb24ocHJvbWlzZSwgcmVhc29uKSB7XG4gICAgaWYgKCF0cmFja1VuaGFuZGxlZFJlamVjdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHByb2Nlc3MgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIHByb2Nlc3MuZW1pdCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIFEubmV4dFRpY2sucnVuQWZ0ZXIoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKGFycmF5X2luZGV4T2YodW5oYW5kbGVkUmVqZWN0aW9ucywgcHJvbWlzZSkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgcHJvY2Vzcy5lbWl0KFwidW5oYW5kbGVkUmVqZWN0aW9uXCIsIHJlYXNvbiwgcHJvbWlzZSk7XG4gICAgICAgICAgICAgICAgcmVwb3J0ZWRVbmhhbmRsZWRSZWplY3Rpb25zLnB1c2gocHJvbWlzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHVuaGFuZGxlZFJlamVjdGlvbnMucHVzaChwcm9taXNlKTtcbiAgICBpZiAocmVhc29uICYmIHR5cGVvZiByZWFzb24uc3RhY2sgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgdW5oYW5kbGVkUmVhc29ucy5wdXNoKHJlYXNvbi5zdGFjayk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdW5oYW5kbGVkUmVhc29ucy5wdXNoKFwiKG5vIHN0YWNrKSBcIiArIHJlYXNvbik7XG4gICAgfVxufVxuXG5mdW5jdGlvbiB1bnRyYWNrUmVqZWN0aW9uKHByb21pc2UpIHtcbiAgICBpZiAoIXRyYWNrVW5oYW5kbGVkUmVqZWN0aW9ucykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGF0ID0gYXJyYXlfaW5kZXhPZih1bmhhbmRsZWRSZWplY3Rpb25zLCBwcm9taXNlKTtcbiAgICBpZiAoYXQgIT09IC0xKSB7XG4gICAgICAgIGlmICh0eXBlb2YgcHJvY2VzcyA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgcHJvY2Vzcy5lbWl0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIFEubmV4dFRpY2sucnVuQWZ0ZXIoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBhdFJlcG9ydCA9IGFycmF5X2luZGV4T2YocmVwb3J0ZWRVbmhhbmRsZWRSZWplY3Rpb25zLCBwcm9taXNlKTtcbiAgICAgICAgICAgICAgICBpZiAoYXRSZXBvcnQgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb2Nlc3MuZW1pdChcInJlamVjdGlvbkhhbmRsZWRcIiwgdW5oYW5kbGVkUmVhc29uc1thdF0sIHByb21pc2UpO1xuICAgICAgICAgICAgICAgICAgICByZXBvcnRlZFVuaGFuZGxlZFJlamVjdGlvbnMuc3BsaWNlKGF0UmVwb3J0LCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB1bmhhbmRsZWRSZWplY3Rpb25zLnNwbGljZShhdCwgMSk7XG4gICAgICAgIHVuaGFuZGxlZFJlYXNvbnMuc3BsaWNlKGF0LCAxKTtcbiAgICB9XG59XG5cblEucmVzZXRVbmhhbmRsZWRSZWplY3Rpb25zID0gcmVzZXRVbmhhbmRsZWRSZWplY3Rpb25zO1xuXG5RLmdldFVuaGFuZGxlZFJlYXNvbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gTWFrZSBhIGNvcHkgc28gdGhhdCBjb25zdW1lcnMgY2FuJ3QgaW50ZXJmZXJlIHdpdGggb3VyIGludGVybmFsIHN0YXRlLlxuICAgIHJldHVybiB1bmhhbmRsZWRSZWFzb25zLnNsaWNlKCk7XG59O1xuXG5RLnN0b3BVbmhhbmRsZWRSZWplY3Rpb25UcmFja2luZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXNldFVuaGFuZGxlZFJlamVjdGlvbnMoKTtcbiAgICB0cmFja1VuaGFuZGxlZFJlamVjdGlvbnMgPSBmYWxzZTtcbn07XG5cbnJlc2V0VW5oYW5kbGVkUmVqZWN0aW9ucygpO1xuXG4vLy8vIEVORCBVTkhBTkRMRUQgUkVKRUNUSU9OIFRSQUNLSU5HXG5cbi8qKlxuICogQ29uc3RydWN0cyBhIHJlamVjdGVkIHByb21pc2UuXG4gKiBAcGFyYW0gcmVhc29uIHZhbHVlIGRlc2NyaWJpbmcgdGhlIGZhaWx1cmVcbiAqL1xuUS5yZWplY3QgPSByZWplY3Q7XG5mdW5jdGlvbiByZWplY3QocmVhc29uKSB7XG4gICAgdmFyIHJlamVjdGlvbiA9IFByb21pc2Uoe1xuICAgICAgICBcIndoZW5cIjogZnVuY3Rpb24gKHJlamVjdGVkKSB7XG4gICAgICAgICAgICAvLyBub3RlIHRoYXQgdGhlIGVycm9yIGhhcyBiZWVuIGhhbmRsZWRcbiAgICAgICAgICAgIGlmIChyZWplY3RlZCkge1xuICAgICAgICAgICAgICAgIHVudHJhY2tSZWplY3Rpb24odGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVqZWN0ZWQgPyByZWplY3RlZChyZWFzb24pIDogdGhpcztcbiAgICAgICAgfVxuICAgIH0sIGZ1bmN0aW9uIGZhbGxiYWNrKCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LCBmdW5jdGlvbiBpbnNwZWN0KCkge1xuICAgICAgICByZXR1cm4geyBzdGF0ZTogXCJyZWplY3RlZFwiLCByZWFzb246IHJlYXNvbiB9O1xuICAgIH0pO1xuXG4gICAgLy8gTm90ZSB0aGF0IHRoZSByZWFzb24gaGFzIG5vdCBiZWVuIGhhbmRsZWQuXG4gICAgdHJhY2tSZWplY3Rpb24ocmVqZWN0aW9uLCByZWFzb24pO1xuXG4gICAgcmV0dXJuIHJlamVjdGlvbjtcbn1cblxuLyoqXG4gKiBDb25zdHJ1Y3RzIGEgZnVsZmlsbGVkIHByb21pc2UgZm9yIGFuIGltbWVkaWF0ZSByZWZlcmVuY2UuXG4gKiBAcGFyYW0gdmFsdWUgaW1tZWRpYXRlIHJlZmVyZW5jZVxuICovXG5RLmZ1bGZpbGwgPSBmdWxmaWxsO1xuZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkge1xuICAgIHJldHVybiBQcm9taXNlKHtcbiAgICAgICAgXCJ3aGVuXCI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgXCJnZXRcIjogZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZVtuYW1lXTtcbiAgICAgICAgfSxcbiAgICAgICAgXCJzZXRcIjogZnVuY3Rpb24gKG5hbWUsIHJocykge1xuICAgICAgICAgICAgdmFsdWVbbmFtZV0gPSByaHM7XG4gICAgICAgIH0sXG4gICAgICAgIFwiZGVsZXRlXCI6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICBkZWxldGUgdmFsdWVbbmFtZV07XG4gICAgICAgIH0sXG4gICAgICAgIFwicG9zdFwiOiBmdW5jdGlvbiAobmFtZSwgYXJncykge1xuICAgICAgICAgICAgLy8gTWFyayBNaWxsZXIgcHJvcG9zZXMgdGhhdCBwb3N0IHdpdGggbm8gbmFtZSBzaG91bGQgYXBwbHkgYVxuICAgICAgICAgICAgLy8gcHJvbWlzZWQgZnVuY3Rpb24uXG4gICAgICAgICAgICBpZiAobmFtZSA9PT0gbnVsbCB8fCBuYW1lID09PSB2b2lkIDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUuYXBwbHkodm9pZCAwLCBhcmdzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlW25hbWVdLmFwcGx5KHZhbHVlLCBhcmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJhcHBseVwiOiBmdW5jdGlvbiAodGhpc3AsIGFyZ3MpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZS5hcHBseSh0aGlzcCwgYXJncyk7XG4gICAgICAgIH0sXG4gICAgICAgIFwia2V5c1wiOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqZWN0X2tleXModmFsdWUpO1xuICAgICAgICB9XG4gICAgfSwgdm9pZCAwLCBmdW5jdGlvbiBpbnNwZWN0KCkge1xuICAgICAgICByZXR1cm4geyBzdGF0ZTogXCJmdWxmaWxsZWRcIiwgdmFsdWU6IHZhbHVlIH07XG4gICAgfSk7XG59XG5cbi8qKlxuICogQ29udmVydHMgdGhlbmFibGVzIHRvIFEgcHJvbWlzZXMuXG4gKiBAcGFyYW0gcHJvbWlzZSB0aGVuYWJsZSBwcm9taXNlXG4gKiBAcmV0dXJucyBhIFEgcHJvbWlzZVxuICovXG5mdW5jdGlvbiBjb2VyY2UocHJvbWlzZSkge1xuICAgIHZhciBkZWZlcnJlZCA9IGRlZmVyKCk7XG4gICAgUS5uZXh0VGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBwcm9taXNlLnRoZW4oZGVmZXJyZWQucmVzb2x2ZSwgZGVmZXJyZWQucmVqZWN0LCBkZWZlcnJlZC5ub3RpZnkpO1xuICAgICAgICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChleGNlcHRpb24pO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59XG5cbi8qKlxuICogQW5ub3RhdGVzIGFuIG9iamVjdCBzdWNoIHRoYXQgaXQgd2lsbCBuZXZlciBiZVxuICogdHJhbnNmZXJyZWQgYXdheSBmcm9tIHRoaXMgcHJvY2VzcyBvdmVyIGFueSBwcm9taXNlXG4gKiBjb21tdW5pY2F0aW9uIGNoYW5uZWwuXG4gKiBAcGFyYW0gb2JqZWN0XG4gKiBAcmV0dXJucyBwcm9taXNlIGEgd3JhcHBpbmcgb2YgdGhhdCBvYmplY3QgdGhhdFxuICogYWRkaXRpb25hbGx5IHJlc3BvbmRzIHRvIHRoZSBcImlzRGVmXCIgbWVzc2FnZVxuICogd2l0aG91dCBhIHJlamVjdGlvbi5cbiAqL1xuUS5tYXN0ZXIgPSBtYXN0ZXI7XG5mdW5jdGlvbiBtYXN0ZXIob2JqZWN0KSB7XG4gICAgcmV0dXJuIFByb21pc2Uoe1xuICAgICAgICBcImlzRGVmXCI6IGZ1bmN0aW9uICgpIHt9XG4gICAgfSwgZnVuY3Rpb24gZmFsbGJhY2sob3AsIGFyZ3MpIHtcbiAgICAgICAgcmV0dXJuIGRpc3BhdGNoKG9iamVjdCwgb3AsIGFyZ3MpO1xuICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFEob2JqZWN0KS5pbnNwZWN0KCk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogU3ByZWFkcyB0aGUgdmFsdWVzIG9mIGEgcHJvbWlzZWQgYXJyYXkgb2YgYXJndW1lbnRzIGludG8gdGhlXG4gKiBmdWxmaWxsbWVudCBjYWxsYmFjay5cbiAqIEBwYXJhbSBmdWxmaWxsZWQgY2FsbGJhY2sgdGhhdCByZWNlaXZlcyB2YXJpYWRpYyBhcmd1bWVudHMgZnJvbSB0aGVcbiAqIHByb21pc2VkIGFycmF5XG4gKiBAcGFyYW0gcmVqZWN0ZWQgY2FsbGJhY2sgdGhhdCByZWNlaXZlcyB0aGUgZXhjZXB0aW9uIGlmIHRoZSBwcm9taXNlXG4gKiBpcyByZWplY3RlZC5cbiAqIEByZXR1cm5zIGEgcHJvbWlzZSBmb3IgdGhlIHJldHVybiB2YWx1ZSBvciB0aHJvd24gZXhjZXB0aW9uIG9mXG4gKiBlaXRoZXIgY2FsbGJhY2suXG4gKi9cblEuc3ByZWFkID0gc3ByZWFkO1xuZnVuY3Rpb24gc3ByZWFkKHZhbHVlLCBmdWxmaWxsZWQsIHJlamVjdGVkKSB7XG4gICAgcmV0dXJuIFEodmFsdWUpLnNwcmVhZChmdWxmaWxsZWQsIHJlamVjdGVkKTtcbn1cblxuUHJvbWlzZS5wcm90b3R5cGUuc3ByZWFkID0gZnVuY3Rpb24gKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpIHtcbiAgICByZXR1cm4gdGhpcy5hbGwoKS50aGVuKGZ1bmN0aW9uIChhcnJheSkge1xuICAgICAgICByZXR1cm4gZnVsZmlsbGVkLmFwcGx5KHZvaWQgMCwgYXJyYXkpO1xuICAgIH0sIHJlamVjdGVkKTtcbn07XG5cbi8qKlxuICogVGhlIGFzeW5jIGZ1bmN0aW9uIGlzIGEgZGVjb3JhdG9yIGZvciBnZW5lcmF0b3IgZnVuY3Rpb25zLCB0dXJuaW5nXG4gKiB0aGVtIGludG8gYXN5bmNocm9ub3VzIGdlbmVyYXRvcnMuICBBbHRob3VnaCBnZW5lcmF0b3JzIGFyZSBvbmx5IHBhcnRcbiAqIG9mIHRoZSBuZXdlc3QgRUNNQVNjcmlwdCA2IGRyYWZ0cywgdGhpcyBjb2RlIGRvZXMgbm90IGNhdXNlIHN5bnRheFxuICogZXJyb3JzIGluIG9sZGVyIGVuZ2luZXMuICBUaGlzIGNvZGUgc2hvdWxkIGNvbnRpbnVlIHRvIHdvcmsgYW5kIHdpbGxcbiAqIGluIGZhY3QgaW1wcm92ZSBvdmVyIHRpbWUgYXMgdGhlIGxhbmd1YWdlIGltcHJvdmVzLlxuICpcbiAqIEVTNiBnZW5lcmF0b3JzIGFyZSBjdXJyZW50bHkgcGFydCBvZiBWOCB2ZXJzaW9uIDMuMTkgd2l0aCB0aGVcbiAqIC0taGFybW9ueS1nZW5lcmF0b3JzIHJ1bnRpbWUgZmxhZyBlbmFibGVkLiAgU3BpZGVyTW9ua2V5IGhhcyBoYWQgdGhlbVxuICogZm9yIGxvbmdlciwgYnV0IHVuZGVyIGFuIG9sZGVyIFB5dGhvbi1pbnNwaXJlZCBmb3JtLiAgVGhpcyBmdW5jdGlvblxuICogd29ya3Mgb24gYm90aCBraW5kcyBvZiBnZW5lcmF0b3JzLlxuICpcbiAqIERlY29yYXRlcyBhIGdlbmVyYXRvciBmdW5jdGlvbiBzdWNoIHRoYXQ6XG4gKiAgLSBpdCBtYXkgeWllbGQgcHJvbWlzZXNcbiAqICAtIGV4ZWN1dGlvbiB3aWxsIGNvbnRpbnVlIHdoZW4gdGhhdCBwcm9taXNlIGlzIGZ1bGZpbGxlZFxuICogIC0gdGhlIHZhbHVlIG9mIHRoZSB5aWVsZCBleHByZXNzaW9uIHdpbGwgYmUgdGhlIGZ1bGZpbGxlZCB2YWx1ZVxuICogIC0gaXQgcmV0dXJucyBhIHByb21pc2UgZm9yIHRoZSByZXR1cm4gdmFsdWUgKHdoZW4gdGhlIGdlbmVyYXRvclxuICogICAgc3RvcHMgaXRlcmF0aW5nKVxuICogIC0gdGhlIGRlY29yYXRlZCBmdW5jdGlvbiByZXR1cm5zIGEgcHJvbWlzZSBmb3IgdGhlIHJldHVybiB2YWx1ZVxuICogICAgb2YgdGhlIGdlbmVyYXRvciBvciB0aGUgZmlyc3QgcmVqZWN0ZWQgcHJvbWlzZSBhbW9uZyB0aG9zZVxuICogICAgeWllbGRlZC5cbiAqICAtIGlmIGFuIGVycm9yIGlzIHRocm93biBpbiB0aGUgZ2VuZXJhdG9yLCBpdCBwcm9wYWdhdGVzIHRocm91Z2hcbiAqICAgIGV2ZXJ5IGZvbGxvd2luZyB5aWVsZCB1bnRpbCBpdCBpcyBjYXVnaHQsIG9yIHVudGlsIGl0IGVzY2FwZXNcbiAqICAgIHRoZSBnZW5lcmF0b3IgZnVuY3Rpb24gYWx0b2dldGhlciwgYW5kIGlzIHRyYW5zbGF0ZWQgaW50byBhXG4gKiAgICByZWplY3Rpb24gZm9yIHRoZSBwcm9taXNlIHJldHVybmVkIGJ5IHRoZSBkZWNvcmF0ZWQgZ2VuZXJhdG9yLlxuICovXG5RLmFzeW5jID0gYXN5bmM7XG5mdW5jdGlvbiBhc3luYyhtYWtlR2VuZXJhdG9yKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gd2hlbiB2ZXJiIGlzIFwic2VuZFwiLCBhcmcgaXMgYSB2YWx1ZVxuICAgICAgICAvLyB3aGVuIHZlcmIgaXMgXCJ0aHJvd1wiLCBhcmcgaXMgYW4gZXhjZXB0aW9uXG4gICAgICAgIGZ1bmN0aW9uIGNvbnRpbnVlcih2ZXJiLCBhcmcpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQ7XG5cbiAgICAgICAgICAgIC8vIFVudGlsIFY4IDMuMTkgLyBDaHJvbWl1bSAyOSBpcyByZWxlYXNlZCwgU3BpZGVyTW9ua2V5IGlzIHRoZSBvbmx5XG4gICAgICAgICAgICAvLyBlbmdpbmUgdGhhdCBoYXMgYSBkZXBsb3llZCBiYXNlIG9mIGJyb3dzZXJzIHRoYXQgc3VwcG9ydCBnZW5lcmF0b3JzLlxuICAgICAgICAgICAgLy8gSG93ZXZlciwgU00ncyBnZW5lcmF0b3JzIHVzZSB0aGUgUHl0aG9uLWluc3BpcmVkIHNlbWFudGljcyBvZlxuICAgICAgICAgICAgLy8gb3V0ZGF0ZWQgRVM2IGRyYWZ0cy4gIFdlIHdvdWxkIGxpa2UgdG8gc3VwcG9ydCBFUzYsIGJ1dCB3ZSdkIGFsc29cbiAgICAgICAgICAgIC8vIGxpa2UgdG8gbWFrZSBpdCBwb3NzaWJsZSB0byB1c2UgZ2VuZXJhdG9ycyBpbiBkZXBsb3llZCBicm93c2Vycywgc29cbiAgICAgICAgICAgIC8vIHdlIGFsc28gc3VwcG9ydCBQeXRob24tc3R5bGUgZ2VuZXJhdG9ycy4gIEF0IHNvbWUgcG9pbnQgd2UgY2FuIHJlbW92ZVxuICAgICAgICAgICAgLy8gdGhpcyBibG9jay5cblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBTdG9wSXRlcmF0aW9uID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgLy8gRVM2IEdlbmVyYXRvcnNcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBnZW5lcmF0b3JbdmVyYl0oYXJnKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlamVjdChleGNlcHRpb24pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0LmRvbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFEocmVzdWx0LnZhbHVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gd2hlbihyZXN1bHQudmFsdWUsIGNhbGxiYWNrLCBlcnJiYWNrKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIFNwaWRlck1vbmtleSBHZW5lcmF0b3JzXG4gICAgICAgICAgICAgICAgLy8gRklYTUU6IFJlbW92ZSB0aGlzIGNhc2Ugd2hlbiBTTSBkb2VzIEVTNiBnZW5lcmF0b3JzLlxuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IGdlbmVyYXRvclt2ZXJiXShhcmcpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNTdG9wSXRlcmF0aW9uKGV4Y2VwdGlvbikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBRKGV4Y2VwdGlvbi52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVqZWN0KGV4Y2VwdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHdoZW4ocmVzdWx0LCBjYWxsYmFjaywgZXJyYmFjayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGdlbmVyYXRvciA9IG1ha2VHZW5lcmF0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gY29udGludWVyLmJpbmQoY29udGludWVyLCBcIm5leHRcIik7XG4gICAgICAgIHZhciBlcnJiYWNrID0gY29udGludWVyLmJpbmQoY29udGludWVyLCBcInRocm93XCIpO1xuICAgICAgICByZXR1cm4gY2FsbGJhY2soKTtcbiAgICB9O1xufVxuXG4vKipcbiAqIFRoZSBzcGF3biBmdW5jdGlvbiBpcyBhIHNtYWxsIHdyYXBwZXIgYXJvdW5kIGFzeW5jIHRoYXQgaW1tZWRpYXRlbHlcbiAqIGNhbGxzIHRoZSBnZW5lcmF0b3IgYW5kIGFsc28gZW5kcyB0aGUgcHJvbWlzZSBjaGFpbiwgc28gdGhhdCBhbnlcbiAqIHVuaGFuZGxlZCBlcnJvcnMgYXJlIHRocm93biBpbnN0ZWFkIG9mIGZvcndhcmRlZCB0byB0aGUgZXJyb3JcbiAqIGhhbmRsZXIuIFRoaXMgaXMgdXNlZnVsIGJlY2F1c2UgaXQncyBleHRyZW1lbHkgY29tbW9uIHRvIHJ1blxuICogZ2VuZXJhdG9ycyBhdCB0aGUgdG9wLWxldmVsIHRvIHdvcmsgd2l0aCBsaWJyYXJpZXMuXG4gKi9cblEuc3Bhd24gPSBzcGF3bjtcbmZ1bmN0aW9uIHNwYXduKG1ha2VHZW5lcmF0b3IpIHtcbiAgICBRLmRvbmUoUS5hc3luYyhtYWtlR2VuZXJhdG9yKSgpKTtcbn1cblxuLy8gRklYTUU6IFJlbW92ZSB0aGlzIGludGVyZmFjZSBvbmNlIEVTNiBnZW5lcmF0b3JzIGFyZSBpbiBTcGlkZXJNb25rZXkuXG4vKipcbiAqIFRocm93cyBhIFJldHVyblZhbHVlIGV4Y2VwdGlvbiB0byBzdG9wIGFuIGFzeW5jaHJvbm91cyBnZW5lcmF0b3IuXG4gKlxuICogVGhpcyBpbnRlcmZhY2UgaXMgYSBzdG9wLWdhcCBtZWFzdXJlIHRvIHN1cHBvcnQgZ2VuZXJhdG9yIHJldHVyblxuICogdmFsdWVzIGluIG9sZGVyIEZpcmVmb3gvU3BpZGVyTW9ua2V5LiAgSW4gYnJvd3NlcnMgdGhhdCBzdXBwb3J0IEVTNlxuICogZ2VuZXJhdG9ycyBsaWtlIENocm9taXVtIDI5LCBqdXN0IHVzZSBcInJldHVyblwiIGluIHlvdXIgZ2VuZXJhdG9yXG4gKiBmdW5jdGlvbnMuXG4gKlxuICogQHBhcmFtIHZhbHVlIHRoZSByZXR1cm4gdmFsdWUgZm9yIHRoZSBzdXJyb3VuZGluZyBnZW5lcmF0b3JcbiAqIEB0aHJvd3MgUmV0dXJuVmFsdWUgZXhjZXB0aW9uIHdpdGggdGhlIHZhbHVlLlxuICogQGV4YW1wbGVcbiAqIC8vIEVTNiBzdHlsZVxuICogUS5hc3luYyhmdW5jdGlvbiogKCkge1xuICogICAgICB2YXIgZm9vID0geWllbGQgZ2V0Rm9vUHJvbWlzZSgpO1xuICogICAgICB2YXIgYmFyID0geWllbGQgZ2V0QmFyUHJvbWlzZSgpO1xuICogICAgICByZXR1cm4gZm9vICsgYmFyO1xuICogfSlcbiAqIC8vIE9sZGVyIFNwaWRlck1vbmtleSBzdHlsZVxuICogUS5hc3luYyhmdW5jdGlvbiAoKSB7XG4gKiAgICAgIHZhciBmb28gPSB5aWVsZCBnZXRGb29Qcm9taXNlKCk7XG4gKiAgICAgIHZhciBiYXIgPSB5aWVsZCBnZXRCYXJQcm9taXNlKCk7XG4gKiAgICAgIFEucmV0dXJuKGZvbyArIGJhcik7XG4gKiB9KVxuICovXG5RW1wicmV0dXJuXCJdID0gX3JldHVybjtcbmZ1bmN0aW9uIF9yZXR1cm4odmFsdWUpIHtcbiAgICB0aHJvdyBuZXcgUVJldHVyblZhbHVlKHZhbHVlKTtcbn1cblxuLyoqXG4gKiBUaGUgcHJvbWlzZWQgZnVuY3Rpb24gZGVjb3JhdG9yIGVuc3VyZXMgdGhhdCBhbnkgcHJvbWlzZSBhcmd1bWVudHNcbiAqIGFyZSBzZXR0bGVkIGFuZCBwYXNzZWQgYXMgdmFsdWVzIChgdGhpc2AgaXMgYWxzbyBzZXR0bGVkIGFuZCBwYXNzZWRcbiAqIGFzIGEgdmFsdWUpLiAgSXQgd2lsbCBhbHNvIGVuc3VyZSB0aGF0IHRoZSByZXN1bHQgb2YgYSBmdW5jdGlvbiBpc1xuICogYWx3YXlzIGEgcHJvbWlzZS5cbiAqXG4gKiBAZXhhbXBsZVxuICogdmFyIGFkZCA9IFEucHJvbWlzZWQoZnVuY3Rpb24gKGEsIGIpIHtcbiAqICAgICByZXR1cm4gYSArIGI7XG4gKiB9KTtcbiAqIGFkZChRKGEpLCBRKEIpKTtcbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgZnVuY3Rpb24gdG8gZGVjb3JhdGVcbiAqIEByZXR1cm5zIHtmdW5jdGlvbn0gYSBmdW5jdGlvbiB0aGF0IGhhcyBiZWVuIGRlY29yYXRlZC5cbiAqL1xuUS5wcm9taXNlZCA9IHByb21pc2VkO1xuZnVuY3Rpb24gcHJvbWlzZWQoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gc3ByZWFkKFt0aGlzLCBhbGwoYXJndW1lbnRzKV0sIGZ1bmN0aW9uIChzZWxmLCBhcmdzKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2suYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgICAgIH0pO1xuICAgIH07XG59XG5cbi8qKlxuICogc2VuZHMgYSBtZXNzYWdlIHRvIGEgdmFsdWUgaW4gYSBmdXR1cmUgdHVyblxuICogQHBhcmFtIG9iamVjdCogdGhlIHJlY2lwaWVudFxuICogQHBhcmFtIG9wIHRoZSBuYW1lIG9mIHRoZSBtZXNzYWdlIG9wZXJhdGlvbiwgZS5nLiwgXCJ3aGVuXCIsXG4gKiBAcGFyYW0gYXJncyBmdXJ0aGVyIGFyZ3VtZW50cyB0byBiZSBmb3J3YXJkZWQgdG8gdGhlIG9wZXJhdGlvblxuICogQHJldHVybnMgcmVzdWx0IHtQcm9taXNlfSBhIHByb21pc2UgZm9yIHRoZSByZXN1bHQgb2YgdGhlIG9wZXJhdGlvblxuICovXG5RLmRpc3BhdGNoID0gZGlzcGF0Y2g7XG5mdW5jdGlvbiBkaXNwYXRjaChvYmplY3QsIG9wLCBhcmdzKSB7XG4gICAgcmV0dXJuIFEob2JqZWN0KS5kaXNwYXRjaChvcCwgYXJncyk7XG59XG5cblByb21pc2UucHJvdG90eXBlLmRpc3BhdGNoID0gZnVuY3Rpb24gKG9wLCBhcmdzKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBkZWZlcnJlZCA9IGRlZmVyKCk7XG4gICAgUS5uZXh0VGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGYucHJvbWlzZURpc3BhdGNoKGRlZmVycmVkLnJlc29sdmUsIG9wLCBhcmdzKTtcbiAgICB9KTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cbi8qKlxuICogR2V0cyB0aGUgdmFsdWUgb2YgYSBwcm9wZXJ0eSBpbiBhIGZ1dHVyZSB0dXJuLlxuICogQHBhcmFtIG9iamVjdCAgICBwcm9taXNlIG9yIGltbWVkaWF0ZSByZWZlcmVuY2UgZm9yIHRhcmdldCBvYmplY3RcbiAqIEBwYXJhbSBuYW1lICAgICAgbmFtZSBvZiBwcm9wZXJ0eSB0byBnZXRcbiAqIEByZXR1cm4gcHJvbWlzZSBmb3IgdGhlIHByb3BlcnR5IHZhbHVlXG4gKi9cblEuZ2V0ID0gZnVuY3Rpb24gKG9iamVjdCwga2V5KSB7XG4gICAgcmV0dXJuIFEob2JqZWN0KS5kaXNwYXRjaChcImdldFwiLCBba2V5XSk7XG59O1xuXG5Qcm9taXNlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2goXCJnZXRcIiwgW2tleV0pO1xufTtcblxuLyoqXG4gKiBTZXRzIHRoZSB2YWx1ZSBvZiBhIHByb3BlcnR5IGluIGEgZnV0dXJlIHR1cm4uXG4gKiBAcGFyYW0gb2JqZWN0ICAgIHByb21pc2Ugb3IgaW1tZWRpYXRlIHJlZmVyZW5jZSBmb3Igb2JqZWN0IG9iamVjdFxuICogQHBhcmFtIG5hbWUgICAgICBuYW1lIG9mIHByb3BlcnR5IHRvIHNldFxuICogQHBhcmFtIHZhbHVlICAgICBuZXcgdmFsdWUgb2YgcHJvcGVydHlcbiAqIEByZXR1cm4gcHJvbWlzZSBmb3IgdGhlIHJldHVybiB2YWx1ZVxuICovXG5RLnNldCA9IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgICByZXR1cm4gUShvYmplY3QpLmRpc3BhdGNoKFwic2V0XCIsIFtrZXksIHZhbHVlXSk7XG59O1xuXG5Qcm9taXNlLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLmRpc3BhdGNoKFwic2V0XCIsIFtrZXksIHZhbHVlXSk7XG59O1xuXG4vKipcbiAqIERlbGV0ZXMgYSBwcm9wZXJ0eSBpbiBhIGZ1dHVyZSB0dXJuLlxuICogQHBhcmFtIG9iamVjdCAgICBwcm9taXNlIG9yIGltbWVkaWF0ZSByZWZlcmVuY2UgZm9yIHRhcmdldCBvYmplY3RcbiAqIEBwYXJhbSBuYW1lICAgICAgbmFtZSBvZiBwcm9wZXJ0eSB0byBkZWxldGVcbiAqIEByZXR1cm4gcHJvbWlzZSBmb3IgdGhlIHJldHVybiB2YWx1ZVxuICovXG5RLmRlbCA9IC8vIFhYWCBsZWdhY3lcblFbXCJkZWxldGVcIl0gPSBmdW5jdGlvbiAob2JqZWN0LCBrZXkpIHtcbiAgICByZXR1cm4gUShvYmplY3QpLmRpc3BhdGNoKFwiZGVsZXRlXCIsIFtrZXldKTtcbn07XG5cblByb21pc2UucHJvdG90eXBlLmRlbCA9IC8vIFhYWCBsZWdhY3lcblByb21pc2UucHJvdG90eXBlW1wiZGVsZXRlXCJdID0gZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiB0aGlzLmRpc3BhdGNoKFwiZGVsZXRlXCIsIFtrZXldKTtcbn07XG5cbi8qKlxuICogSW52b2tlcyBhIG1ldGhvZCBpbiBhIGZ1dHVyZSB0dXJuLlxuICogQHBhcmFtIG9iamVjdCAgICBwcm9taXNlIG9yIGltbWVkaWF0ZSByZWZlcmVuY2UgZm9yIHRhcmdldCBvYmplY3RcbiAqIEBwYXJhbSBuYW1lICAgICAgbmFtZSBvZiBtZXRob2QgdG8gaW52b2tlXG4gKiBAcGFyYW0gdmFsdWUgICAgIGEgdmFsdWUgdG8gcG9zdCwgdHlwaWNhbGx5IGFuIGFycmF5IG9mXG4gKiAgICAgICAgICAgICAgICAgIGludm9jYXRpb24gYXJndW1lbnRzIGZvciBwcm9taXNlcyB0aGF0XG4gKiAgICAgICAgICAgICAgICAgIGFyZSB1bHRpbWF0ZWx5IGJhY2tlZCB3aXRoIGByZXNvbHZlYCB2YWx1ZXMsXG4gKiAgICAgICAgICAgICAgICAgIGFzIG9wcG9zZWQgdG8gdGhvc2UgYmFja2VkIHdpdGggVVJMc1xuICogICAgICAgICAgICAgICAgICB3aGVyZWluIHRoZSBwb3N0ZWQgdmFsdWUgY2FuIGJlIGFueVxuICogICAgICAgICAgICAgICAgICBKU09OIHNlcmlhbGl6YWJsZSBvYmplY3QuXG4gKiBAcmV0dXJuIHByb21pc2UgZm9yIHRoZSByZXR1cm4gdmFsdWVcbiAqL1xuLy8gYm91bmQgbG9jYWxseSBiZWNhdXNlIGl0IGlzIHVzZWQgYnkgb3RoZXIgbWV0aG9kc1xuUS5tYXBwbHkgPSAvLyBYWFggQXMgcHJvcG9zZWQgYnkgXCJSZWRzYW5kcm9cIlxuUS5wb3N0ID0gZnVuY3Rpb24gKG9iamVjdCwgbmFtZSwgYXJncykge1xuICAgIHJldHVybiBRKG9iamVjdCkuZGlzcGF0Y2goXCJwb3N0XCIsIFtuYW1lLCBhcmdzXSk7XG59O1xuXG5Qcm9taXNlLnByb3RvdHlwZS5tYXBwbHkgPSAvLyBYWFggQXMgcHJvcG9zZWQgYnkgXCJSZWRzYW5kcm9cIlxuUHJvbWlzZS5wcm90b3R5cGUucG9zdCA9IGZ1bmN0aW9uIChuYW1lLCBhcmdzKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2goXCJwb3N0XCIsIFtuYW1lLCBhcmdzXSk7XG59O1xuXG4vKipcbiAqIEludm9rZXMgYSBtZXRob2QgaW4gYSBmdXR1cmUgdHVybi5cbiAqIEBwYXJhbSBvYmplY3QgICAgcHJvbWlzZSBvciBpbW1lZGlhdGUgcmVmZXJlbmNlIGZvciB0YXJnZXQgb2JqZWN0XG4gKiBAcGFyYW0gbmFtZSAgICAgIG5hbWUgb2YgbWV0aG9kIHRvIGludm9rZVxuICogQHBhcmFtIC4uLmFyZ3MgICBhcnJheSBvZiBpbnZvY2F0aW9uIGFyZ3VtZW50c1xuICogQHJldHVybiBwcm9taXNlIGZvciB0aGUgcmV0dXJuIHZhbHVlXG4gKi9cblEuc2VuZCA9IC8vIFhYWCBNYXJrIE1pbGxlcidzIHByb3Bvc2VkIHBhcmxhbmNlXG5RLm1jYWxsID0gLy8gWFhYIEFzIHByb3Bvc2VkIGJ5IFwiUmVkc2FuZHJvXCJcblEuaW52b2tlID0gZnVuY3Rpb24gKG9iamVjdCwgbmFtZSAvKi4uLmFyZ3MqLykge1xuICAgIHJldHVybiBRKG9iamVjdCkuZGlzcGF0Y2goXCJwb3N0XCIsIFtuYW1lLCBhcnJheV9zbGljZShhcmd1bWVudHMsIDIpXSk7XG59O1xuXG5Qcm9taXNlLnByb3RvdHlwZS5zZW5kID0gLy8gWFhYIE1hcmsgTWlsbGVyJ3MgcHJvcG9zZWQgcGFybGFuY2VcblByb21pc2UucHJvdG90eXBlLm1jYWxsID0gLy8gWFhYIEFzIHByb3Bvc2VkIGJ5IFwiUmVkc2FuZHJvXCJcblByb21pc2UucHJvdG90eXBlLmludm9rZSA9IGZ1bmN0aW9uIChuYW1lIC8qLi4uYXJncyovKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2goXCJwb3N0XCIsIFtuYW1lLCBhcnJheV9zbGljZShhcmd1bWVudHMsIDEpXSk7XG59O1xuXG4vKipcbiAqIEFwcGxpZXMgdGhlIHByb21pc2VkIGZ1bmN0aW9uIGluIGEgZnV0dXJlIHR1cm4uXG4gKiBAcGFyYW0gb2JqZWN0ICAgIHByb21pc2Ugb3IgaW1tZWRpYXRlIHJlZmVyZW5jZSBmb3IgdGFyZ2V0IGZ1bmN0aW9uXG4gKiBAcGFyYW0gYXJncyAgICAgIGFycmF5IG9mIGFwcGxpY2F0aW9uIGFyZ3VtZW50c1xuICovXG5RLmZhcHBseSA9IGZ1bmN0aW9uIChvYmplY3QsIGFyZ3MpIHtcbiAgICByZXR1cm4gUShvYmplY3QpLmRpc3BhdGNoKFwiYXBwbHlcIiwgW3ZvaWQgMCwgYXJnc10pO1xufTtcblxuUHJvbWlzZS5wcm90b3R5cGUuZmFwcGx5ID0gZnVuY3Rpb24gKGFyZ3MpIHtcbiAgICByZXR1cm4gdGhpcy5kaXNwYXRjaChcImFwcGx5XCIsIFt2b2lkIDAsIGFyZ3NdKTtcbn07XG5cbi8qKlxuICogQ2FsbHMgdGhlIHByb21pc2VkIGZ1bmN0aW9uIGluIGEgZnV0dXJlIHR1cm4uXG4gKiBAcGFyYW0gb2JqZWN0ICAgIHByb21pc2Ugb3IgaW1tZWRpYXRlIHJlZmVyZW5jZSBmb3IgdGFyZ2V0IGZ1bmN0aW9uXG4gKiBAcGFyYW0gLi4uYXJncyAgIGFycmF5IG9mIGFwcGxpY2F0aW9uIGFyZ3VtZW50c1xuICovXG5RW1widHJ5XCJdID1cblEuZmNhbGwgPSBmdW5jdGlvbiAob2JqZWN0IC8qIC4uLmFyZ3MqLykge1xuICAgIHJldHVybiBRKG9iamVjdCkuZGlzcGF0Y2goXCJhcHBseVwiLCBbdm9pZCAwLCBhcnJheV9zbGljZShhcmd1bWVudHMsIDEpXSk7XG59O1xuXG5Qcm9taXNlLnByb3RvdHlwZS5mY2FsbCA9IGZ1bmN0aW9uICgvKi4uLmFyZ3MqLykge1xuICAgIHJldHVybiB0aGlzLmRpc3BhdGNoKFwiYXBwbHlcIiwgW3ZvaWQgMCwgYXJyYXlfc2xpY2UoYXJndW1lbnRzKV0pO1xufTtcblxuLyoqXG4gKiBCaW5kcyB0aGUgcHJvbWlzZWQgZnVuY3Rpb24sIHRyYW5zZm9ybWluZyByZXR1cm4gdmFsdWVzIGludG8gYSBmdWxmaWxsZWRcbiAqIHByb21pc2UgYW5kIHRocm93biBlcnJvcnMgaW50byBhIHJlamVjdGVkIG9uZS5cbiAqIEBwYXJhbSBvYmplY3QgICAgcHJvbWlzZSBvciBpbW1lZGlhdGUgcmVmZXJlbmNlIGZvciB0YXJnZXQgZnVuY3Rpb25cbiAqIEBwYXJhbSAuLi5hcmdzICAgYXJyYXkgb2YgYXBwbGljYXRpb24gYXJndW1lbnRzXG4gKi9cblEuZmJpbmQgPSBmdW5jdGlvbiAob2JqZWN0IC8qLi4uYXJncyovKSB7XG4gICAgdmFyIHByb21pc2UgPSBRKG9iamVjdCk7XG4gICAgdmFyIGFyZ3MgPSBhcnJheV9zbGljZShhcmd1bWVudHMsIDEpO1xuICAgIHJldHVybiBmdW5jdGlvbiBmYm91bmQoKSB7XG4gICAgICAgIHJldHVybiBwcm9taXNlLmRpc3BhdGNoKFwiYXBwbHlcIiwgW1xuICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgIGFyZ3MuY29uY2F0KGFycmF5X3NsaWNlKGFyZ3VtZW50cykpXG4gICAgICAgIF0pO1xuICAgIH07XG59O1xuUHJvbWlzZS5wcm90b3R5cGUuZmJpbmQgPSBmdW5jdGlvbiAoLyouLi5hcmdzKi8pIHtcbiAgICB2YXIgcHJvbWlzZSA9IHRoaXM7XG4gICAgdmFyIGFyZ3MgPSBhcnJheV9zbGljZShhcmd1bWVudHMpO1xuICAgIHJldHVybiBmdW5jdGlvbiBmYm91bmQoKSB7XG4gICAgICAgIHJldHVybiBwcm9taXNlLmRpc3BhdGNoKFwiYXBwbHlcIiwgW1xuICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgIGFyZ3MuY29uY2F0KGFycmF5X3NsaWNlKGFyZ3VtZW50cykpXG4gICAgICAgIF0pO1xuICAgIH07XG59O1xuXG4vKipcbiAqIFJlcXVlc3RzIHRoZSBuYW1lcyBvZiB0aGUgb3duZWQgcHJvcGVydGllcyBvZiBhIHByb21pc2VkXG4gKiBvYmplY3QgaW4gYSBmdXR1cmUgdHVybi5cbiAqIEBwYXJhbSBvYmplY3QgICAgcHJvbWlzZSBvciBpbW1lZGlhdGUgcmVmZXJlbmNlIGZvciB0YXJnZXQgb2JqZWN0XG4gKiBAcmV0dXJuIHByb21pc2UgZm9yIHRoZSBrZXlzIG9mIHRoZSBldmVudHVhbGx5IHNldHRsZWQgb2JqZWN0XG4gKi9cblEua2V5cyA9IGZ1bmN0aW9uIChvYmplY3QpIHtcbiAgICByZXR1cm4gUShvYmplY3QpLmRpc3BhdGNoKFwia2V5c1wiLCBbXSk7XG59O1xuXG5Qcm9taXNlLnByb3RvdHlwZS5rZXlzID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmRpc3BhdGNoKFwia2V5c1wiLCBbXSk7XG59O1xuXG4vKipcbiAqIFR1cm5zIGFuIGFycmF5IG9mIHByb21pc2VzIGludG8gYSBwcm9taXNlIGZvciBhbiBhcnJheS4gIElmIGFueSBvZlxuICogdGhlIHByb21pc2VzIGdldHMgcmVqZWN0ZWQsIHRoZSB3aG9sZSBhcnJheSBpcyByZWplY3RlZCBpbW1lZGlhdGVseS5cbiAqIEBwYXJhbSB7QXJyYXkqfSBhbiBhcnJheSAob3IgcHJvbWlzZSBmb3IgYW4gYXJyYXkpIG9mIHZhbHVlcyAob3JcbiAqIHByb21pc2VzIGZvciB2YWx1ZXMpXG4gKiBAcmV0dXJucyBhIHByb21pc2UgZm9yIGFuIGFycmF5IG9mIHRoZSBjb3JyZXNwb25kaW5nIHZhbHVlc1xuICovXG4vLyBCeSBNYXJrIE1pbGxlclxuLy8gaHR0cDovL3dpa2kuZWNtYXNjcmlwdC5vcmcvZG9rdS5waHA/aWQ9c3RyYXdtYW46Y29uY3VycmVuY3kmcmV2PTEzMDg3NzY1MjEjYWxsZnVsZmlsbGVkXG5RLmFsbCA9IGFsbDtcbmZ1bmN0aW9uIGFsbChwcm9taXNlcykge1xuICAgIHJldHVybiB3aGVuKHByb21pc2VzLCBmdW5jdGlvbiAocHJvbWlzZXMpIHtcbiAgICAgICAgdmFyIHBlbmRpbmdDb3VudCA9IDA7XG4gICAgICAgIHZhciBkZWZlcnJlZCA9IGRlZmVyKCk7XG4gICAgICAgIGFycmF5X3JlZHVjZShwcm9taXNlcywgZnVuY3Rpb24gKHVuZGVmaW5lZCwgcHJvbWlzZSwgaW5kZXgpIHtcbiAgICAgICAgICAgIHZhciBzbmFwc2hvdDtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBpc1Byb21pc2UocHJvbWlzZSkgJiZcbiAgICAgICAgICAgICAgICAoc25hcHNob3QgPSBwcm9taXNlLmluc3BlY3QoKSkuc3RhdGUgPT09IFwiZnVsZmlsbGVkXCJcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHByb21pc2VzW2luZGV4XSA9IHNuYXBzaG90LnZhbHVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICArK3BlbmRpbmdDb3VudDtcbiAgICAgICAgICAgICAgICB3aGVuKFxuICAgICAgICAgICAgICAgICAgICBwcm9taXNlLFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2VzW2luZGV4XSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKC0tcGVuZGluZ0NvdW50ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShwcm9taXNlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCxcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHByb2dyZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5ub3RpZnkoeyBpbmRleDogaW5kZXgsIHZhbHVlOiBwcm9ncmVzcyB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHZvaWQgMCk7XG4gICAgICAgIGlmIChwZW5kaW5nQ291bnQgPT09IDApIHtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocHJvbWlzZXMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH0pO1xufVxuXG5Qcm9taXNlLnByb3RvdHlwZS5hbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGFsbCh0aGlzKTtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgZmlyc3QgcmVzb2x2ZWQgcHJvbWlzZSBvZiBhbiBhcnJheS4gUHJpb3IgcmVqZWN0ZWQgcHJvbWlzZXMgYXJlXG4gKiBpZ25vcmVkLiAgUmVqZWN0cyBvbmx5IGlmIGFsbCBwcm9taXNlcyBhcmUgcmVqZWN0ZWQuXG4gKiBAcGFyYW0ge0FycmF5Kn0gYW4gYXJyYXkgY29udGFpbmluZyB2YWx1ZXMgb3IgcHJvbWlzZXMgZm9yIHZhbHVlc1xuICogQHJldHVybnMgYSBwcm9taXNlIGZ1bGZpbGxlZCB3aXRoIHRoZSB2YWx1ZSBvZiB0aGUgZmlyc3QgcmVzb2x2ZWQgcHJvbWlzZSxcbiAqIG9yIGEgcmVqZWN0ZWQgcHJvbWlzZSBpZiBhbGwgcHJvbWlzZXMgYXJlIHJlamVjdGVkLlxuICovXG5RLmFueSA9IGFueTtcblxuZnVuY3Rpb24gYW55KHByb21pc2VzKSB7XG4gICAgaWYgKHByb21pc2VzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gUS5yZXNvbHZlKCk7XG4gICAgfVxuXG4gICAgdmFyIGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIHZhciBwZW5kaW5nQ291bnQgPSAwO1xuICAgIGFycmF5X3JlZHVjZShwcm9taXNlcywgZnVuY3Rpb24gKHByZXYsIGN1cnJlbnQsIGluZGV4KSB7XG4gICAgICAgIHZhciBwcm9taXNlID0gcHJvbWlzZXNbaW5kZXhdO1xuXG4gICAgICAgIHBlbmRpbmdDb3VudCsrO1xuXG4gICAgICAgIHdoZW4ocHJvbWlzZSwgb25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQsIG9uUHJvZ3Jlc3MpO1xuICAgICAgICBmdW5jdGlvbiBvbkZ1bGZpbGxlZChyZXN1bHQpIHtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBvblJlamVjdGVkKCkge1xuICAgICAgICAgICAgcGVuZGluZ0NvdW50LS07XG4gICAgICAgICAgICBpZiAocGVuZGluZ0NvdW50ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgXCJDYW4ndCBnZXQgZnVsZmlsbG1lbnQgdmFsdWUgZnJvbSBhbnkgcHJvbWlzZSwgYWxsIFwiICtcbiAgICAgICAgICAgICAgICAgICAgXCJwcm9taXNlcyB3ZXJlIHJlamVjdGVkLlwiXG4gICAgICAgICAgICAgICAgKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gb25Qcm9ncmVzcyhwcm9ncmVzcykge1xuICAgICAgICAgICAgZGVmZXJyZWQubm90aWZ5KHtcbiAgICAgICAgICAgICAgICBpbmRleDogaW5kZXgsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHByb2dyZXNzXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sIHVuZGVmaW5lZCk7XG5cbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn1cblxuUHJvbWlzZS5wcm90b3R5cGUuYW55ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBhbnkodGhpcyk7XG59O1xuXG4vKipcbiAqIFdhaXRzIGZvciBhbGwgcHJvbWlzZXMgdG8gYmUgc2V0dGxlZCwgZWl0aGVyIGZ1bGZpbGxlZCBvclxuICogcmVqZWN0ZWQuICBUaGlzIGlzIGRpc3RpbmN0IGZyb20gYGFsbGAgc2luY2UgdGhhdCB3b3VsZCBzdG9wXG4gKiB3YWl0aW5nIGF0IHRoZSBmaXJzdCByZWplY3Rpb24uICBUaGUgcHJvbWlzZSByZXR1cm5lZCBieVxuICogYGFsbFJlc29sdmVkYCB3aWxsIG5ldmVyIGJlIHJlamVjdGVkLlxuICogQHBhcmFtIHByb21pc2VzIGEgcHJvbWlzZSBmb3IgYW4gYXJyYXkgKG9yIGFuIGFycmF5KSBvZiBwcm9taXNlc1xuICogKG9yIHZhbHVlcylcbiAqIEByZXR1cm4gYSBwcm9taXNlIGZvciBhbiBhcnJheSBvZiBwcm9taXNlc1xuICovXG5RLmFsbFJlc29sdmVkID0gZGVwcmVjYXRlKGFsbFJlc29sdmVkLCBcImFsbFJlc29sdmVkXCIsIFwiYWxsU2V0dGxlZFwiKTtcbmZ1bmN0aW9uIGFsbFJlc29sdmVkKHByb21pc2VzKSB7XG4gICAgcmV0dXJuIHdoZW4ocHJvbWlzZXMsIGZ1bmN0aW9uIChwcm9taXNlcykge1xuICAgICAgICBwcm9taXNlcyA9IGFycmF5X21hcChwcm9taXNlcywgUSk7XG4gICAgICAgIHJldHVybiB3aGVuKGFsbChhcnJheV9tYXAocHJvbWlzZXMsIGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICByZXR1cm4gd2hlbihwcm9taXNlLCBub29wLCBub29wKTtcbiAgICAgICAgfSkpLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZXM7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG5Qcm9taXNlLnByb3RvdHlwZS5hbGxSZXNvbHZlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gYWxsUmVzb2x2ZWQodGhpcyk7XG59O1xuXG4vKipcbiAqIEBzZWUgUHJvbWlzZSNhbGxTZXR0bGVkXG4gKi9cblEuYWxsU2V0dGxlZCA9IGFsbFNldHRsZWQ7XG5mdW5jdGlvbiBhbGxTZXR0bGVkKHByb21pc2VzKSB7XG4gICAgcmV0dXJuIFEocHJvbWlzZXMpLmFsbFNldHRsZWQoKTtcbn1cblxuLyoqXG4gKiBUdXJucyBhbiBhcnJheSBvZiBwcm9taXNlcyBpbnRvIGEgcHJvbWlzZSBmb3IgYW4gYXJyYXkgb2YgdGhlaXIgc3RhdGVzIChhc1xuICogcmV0dXJuZWQgYnkgYGluc3BlY3RgKSB3aGVuIHRoZXkgaGF2ZSBhbGwgc2V0dGxlZC5cbiAqIEBwYXJhbSB7QXJyYXlbQW55Kl19IHZhbHVlcyBhbiBhcnJheSAob3IgcHJvbWlzZSBmb3IgYW4gYXJyYXkpIG9mIHZhbHVlcyAob3JcbiAqIHByb21pc2VzIGZvciB2YWx1ZXMpXG4gKiBAcmV0dXJucyB7QXJyYXlbU3RhdGVdfSBhbiBhcnJheSBvZiBzdGF0ZXMgZm9yIHRoZSByZXNwZWN0aXZlIHZhbHVlcy5cbiAqL1xuUHJvbWlzZS5wcm90b3R5cGUuYWxsU2V0dGxlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy50aGVuKGZ1bmN0aW9uIChwcm9taXNlcykge1xuICAgICAgICByZXR1cm4gYWxsKGFycmF5X21hcChwcm9taXNlcywgZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgIHByb21pc2UgPSBRKHByb21pc2UpO1xuICAgICAgICAgICAgZnVuY3Rpb24gcmVnYXJkbGVzcygpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvbWlzZS5pbnNwZWN0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZS50aGVuKHJlZ2FyZGxlc3MsIHJlZ2FyZGxlc3MpO1xuICAgICAgICB9KSk7XG4gICAgfSk7XG59O1xuXG4vKipcbiAqIENhcHR1cmVzIHRoZSBmYWlsdXJlIG9mIGEgcHJvbWlzZSwgZ2l2aW5nIGFuIG9wb3J0dW5pdHkgdG8gcmVjb3ZlclxuICogd2l0aCBhIGNhbGxiYWNrLiAgSWYgdGhlIGdpdmVuIHByb21pc2UgaXMgZnVsZmlsbGVkLCB0aGUgcmV0dXJuZWRcbiAqIHByb21pc2UgaXMgZnVsZmlsbGVkLlxuICogQHBhcmFtIHtBbnkqfSBwcm9taXNlIGZvciBzb21ldGhpbmdcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIHRvIGZ1bGZpbGwgdGhlIHJldHVybmVkIHByb21pc2UgaWYgdGhlXG4gKiBnaXZlbiBwcm9taXNlIGlzIHJlamVjdGVkXG4gKiBAcmV0dXJucyBhIHByb21pc2UgZm9yIHRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIGNhbGxiYWNrXG4gKi9cblEuZmFpbCA9IC8vIFhYWCBsZWdhY3lcblFbXCJjYXRjaFwiXSA9IGZ1bmN0aW9uIChvYmplY3QsIHJlamVjdGVkKSB7XG4gICAgcmV0dXJuIFEob2JqZWN0KS50aGVuKHZvaWQgMCwgcmVqZWN0ZWQpO1xufTtcblxuUHJvbWlzZS5wcm90b3R5cGUuZmFpbCA9IC8vIFhYWCBsZWdhY3lcblByb21pc2UucHJvdG90eXBlW1wiY2F0Y2hcIl0gPSBmdW5jdGlvbiAocmVqZWN0ZWQpIHtcbiAgICByZXR1cm4gdGhpcy50aGVuKHZvaWQgMCwgcmVqZWN0ZWQpO1xufTtcblxuLyoqXG4gKiBBdHRhY2hlcyBhIGxpc3RlbmVyIHRoYXQgY2FuIHJlc3BvbmQgdG8gcHJvZ3Jlc3Mgbm90aWZpY2F0aW9ucyBmcm9tIGFcbiAqIHByb21pc2UncyBvcmlnaW5hdGluZyBkZWZlcnJlZC4gVGhpcyBsaXN0ZW5lciByZWNlaXZlcyB0aGUgZXhhY3QgYXJndW1lbnRzXG4gKiBwYXNzZWQgdG8gYGBkZWZlcnJlZC5ub3RpZnlgYC5cbiAqIEBwYXJhbSB7QW55Kn0gcHJvbWlzZSBmb3Igc29tZXRoaW5nXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayB0byByZWNlaXZlIGFueSBwcm9ncmVzcyBub3RpZmljYXRpb25zXG4gKiBAcmV0dXJucyB0aGUgZ2l2ZW4gcHJvbWlzZSwgdW5jaGFuZ2VkXG4gKi9cblEucHJvZ3Jlc3MgPSBwcm9ncmVzcztcbmZ1bmN0aW9uIHByb2dyZXNzKG9iamVjdCwgcHJvZ3Jlc3NlZCkge1xuICAgIHJldHVybiBRKG9iamVjdCkudGhlbih2b2lkIDAsIHZvaWQgMCwgcHJvZ3Jlc3NlZCk7XG59XG5cblByb21pc2UucHJvdG90eXBlLnByb2dyZXNzID0gZnVuY3Rpb24gKHByb2dyZXNzZWQpIHtcbiAgICByZXR1cm4gdGhpcy50aGVuKHZvaWQgMCwgdm9pZCAwLCBwcm9ncmVzc2VkKTtcbn07XG5cbi8qKlxuICogUHJvdmlkZXMgYW4gb3Bwb3J0dW5pdHkgdG8gb2JzZXJ2ZSB0aGUgc2V0dGxpbmcgb2YgYSBwcm9taXNlLFxuICogcmVnYXJkbGVzcyBvZiB3aGV0aGVyIHRoZSBwcm9taXNlIGlzIGZ1bGZpbGxlZCBvciByZWplY3RlZC4gIEZvcndhcmRzXG4gKiB0aGUgcmVzb2x1dGlvbiB0byB0aGUgcmV0dXJuZWQgcHJvbWlzZSB3aGVuIHRoZSBjYWxsYmFjayBpcyBkb25lLlxuICogVGhlIGNhbGxiYWNrIGNhbiByZXR1cm4gYSBwcm9taXNlIHRvIGRlZmVyIGNvbXBsZXRpb24uXG4gKiBAcGFyYW0ge0FueSp9IHByb21pc2VcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIHRvIG9ic2VydmUgdGhlIHJlc29sdXRpb24gb2YgdGhlIGdpdmVuXG4gKiBwcm9taXNlLCB0YWtlcyBubyBhcmd1bWVudHMuXG4gKiBAcmV0dXJucyBhIHByb21pc2UgZm9yIHRoZSByZXNvbHV0aW9uIG9mIHRoZSBnaXZlbiBwcm9taXNlIHdoZW5cbiAqIGBgZmluYGAgaXMgZG9uZS5cbiAqL1xuUS5maW4gPSAvLyBYWFggbGVnYWN5XG5RW1wiZmluYWxseVwiXSA9IGZ1bmN0aW9uIChvYmplY3QsIGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIFEob2JqZWN0KVtcImZpbmFsbHlcIl0oY2FsbGJhY2spO1xufTtcblxuUHJvbWlzZS5wcm90b3R5cGUuZmluID0gLy8gWFhYIGxlZ2FjeVxuUHJvbWlzZS5wcm90b3R5cGVbXCJmaW5hbGx5XCJdID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgY2FsbGJhY2sgPSBRKGNhbGxiYWNrKTtcbiAgICByZXR1cm4gdGhpcy50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gY2FsbGJhY2suZmNhbGwoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfSk7XG4gICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgICAvLyBUT0RPIGF0dGVtcHQgdG8gcmVjeWNsZSB0aGUgcmVqZWN0aW9uIHdpdGggXCJ0aGlzXCIuXG4gICAgICAgIHJldHVybiBjYWxsYmFjay5mY2FsbCgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhyb3cgcmVhc29uO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn07XG5cbi8qKlxuICogVGVybWluYXRlcyBhIGNoYWluIG9mIHByb21pc2VzLCBmb3JjaW5nIHJlamVjdGlvbnMgdG8gYmVcbiAqIHRocm93biBhcyBleGNlcHRpb25zLlxuICogQHBhcmFtIHtBbnkqfSBwcm9taXNlIGF0IHRoZSBlbmQgb2YgYSBjaGFpbiBvZiBwcm9taXNlc1xuICogQHJldHVybnMgbm90aGluZ1xuICovXG5RLmRvbmUgPSBmdW5jdGlvbiAob2JqZWN0LCBmdWxmaWxsZWQsIHJlamVjdGVkLCBwcm9ncmVzcykge1xuICAgIHJldHVybiBRKG9iamVjdCkuZG9uZShmdWxmaWxsZWQsIHJlamVjdGVkLCBwcm9ncmVzcyk7XG59O1xuXG5Qcm9taXNlLnByb3RvdHlwZS5kb25lID0gZnVuY3Rpb24gKGZ1bGZpbGxlZCwgcmVqZWN0ZWQsIHByb2dyZXNzKSB7XG4gICAgdmFyIG9uVW5oYW5kbGVkRXJyb3IgPSBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgLy8gZm9yd2FyZCB0byBhIGZ1dHVyZSB0dXJuIHNvIHRoYXQgYGB3aGVuYGBcbiAgICAgICAgLy8gZG9lcyBub3QgY2F0Y2ggaXQgYW5kIHR1cm4gaXQgaW50byBhIHJlamVjdGlvbi5cbiAgICAgICAgUS5uZXh0VGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBtYWtlU3RhY2tUcmFjZUxvbmcoZXJyb3IsIHByb21pc2UpO1xuICAgICAgICAgICAgaWYgKFEub25lcnJvcikge1xuICAgICAgICAgICAgICAgIFEub25lcnJvcihlcnJvcik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy8gQXZvaWQgdW5uZWNlc3NhcnkgYG5leHRUaWNrYGluZyB2aWEgYW4gdW5uZWNlc3NhcnkgYHdoZW5gLlxuICAgIHZhciBwcm9taXNlID0gZnVsZmlsbGVkIHx8IHJlamVjdGVkIHx8IHByb2dyZXNzID9cbiAgICAgICAgdGhpcy50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQsIHByb2dyZXNzKSA6XG4gICAgICAgIHRoaXM7XG5cbiAgICBpZiAodHlwZW9mIHByb2Nlc3MgPT09IFwib2JqZWN0XCIgJiYgcHJvY2VzcyAmJiBwcm9jZXNzLmRvbWFpbikge1xuICAgICAgICBvblVuaGFuZGxlZEVycm9yID0gcHJvY2Vzcy5kb21haW4uYmluZChvblVuaGFuZGxlZEVycm9yKTtcbiAgICB9XG5cbiAgICBwcm9taXNlLnRoZW4odm9pZCAwLCBvblVuaGFuZGxlZEVycm9yKTtcbn07XG5cbi8qKlxuICogQ2F1c2VzIGEgcHJvbWlzZSB0byBiZSByZWplY3RlZCBpZiBpdCBkb2VzIG5vdCBnZXQgZnVsZmlsbGVkIGJlZm9yZVxuICogc29tZSBtaWxsaXNlY29uZHMgdGltZSBvdXQuXG4gKiBAcGFyYW0ge0FueSp9IHByb21pc2VcbiAqIEBwYXJhbSB7TnVtYmVyfSBtaWxsaXNlY29uZHMgdGltZW91dFxuICogQHBhcmFtIHtBbnkqfSBjdXN0b20gZXJyb3IgbWVzc2FnZSBvciBFcnJvciBvYmplY3QgKG9wdGlvbmFsKVxuICogQHJldHVybnMgYSBwcm9taXNlIGZvciB0aGUgcmVzb2x1dGlvbiBvZiB0aGUgZ2l2ZW4gcHJvbWlzZSBpZiBpdCBpc1xuICogZnVsZmlsbGVkIGJlZm9yZSB0aGUgdGltZW91dCwgb3RoZXJ3aXNlIHJlamVjdGVkLlxuICovXG5RLnRpbWVvdXQgPSBmdW5jdGlvbiAob2JqZWN0LCBtcywgZXJyb3IpIHtcbiAgICByZXR1cm4gUShvYmplY3QpLnRpbWVvdXQobXMsIGVycm9yKTtcbn07XG5cblByb21pc2UucHJvdG90eXBlLnRpbWVvdXQgPSBmdW5jdGlvbiAobXMsIGVycm9yKSB7XG4gICAgdmFyIGRlZmVycmVkID0gZGVmZXIoKTtcbiAgICB2YXIgdGltZW91dElkID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghZXJyb3IgfHwgXCJzdHJpbmdcIiA9PT0gdHlwZW9mIGVycm9yKSB7XG4gICAgICAgICAgICBlcnJvciA9IG5ldyBFcnJvcihlcnJvciB8fCBcIlRpbWVkIG91dCBhZnRlciBcIiArIG1zICsgXCIgbXNcIik7XG4gICAgICAgICAgICBlcnJvci5jb2RlID0gXCJFVElNRURPVVRcIjtcbiAgICAgICAgfVxuICAgICAgICBkZWZlcnJlZC5yZWplY3QoZXJyb3IpO1xuICAgIH0sIG1zKTtcblxuICAgIHRoaXMudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUodmFsdWUpO1xuICAgIH0sIGZ1bmN0aW9uIChleGNlcHRpb24pIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdChleGNlcHRpb24pO1xuICAgIH0sIGRlZmVycmVkLm5vdGlmeSk7XG5cbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cbi8qKlxuICogUmV0dXJucyBhIHByb21pc2UgZm9yIHRoZSBnaXZlbiB2YWx1ZSAob3IgcHJvbWlzZWQgdmFsdWUpLCBzb21lXG4gKiBtaWxsaXNlY29uZHMgYWZ0ZXIgaXQgcmVzb2x2ZWQuIFBhc3NlcyByZWplY3Rpb25zIGltbWVkaWF0ZWx5LlxuICogQHBhcmFtIHtBbnkqfSBwcm9taXNlXG4gKiBAcGFyYW0ge051bWJlcn0gbWlsbGlzZWNvbmRzXG4gKiBAcmV0dXJucyBhIHByb21pc2UgZm9yIHRoZSByZXNvbHV0aW9uIG9mIHRoZSBnaXZlbiBwcm9taXNlIGFmdGVyIG1pbGxpc2Vjb25kc1xuICogdGltZSBoYXMgZWxhcHNlZCBzaW5jZSB0aGUgcmVzb2x1dGlvbiBvZiB0aGUgZ2l2ZW4gcHJvbWlzZS5cbiAqIElmIHRoZSBnaXZlbiBwcm9taXNlIHJlamVjdHMsIHRoYXQgaXMgcGFzc2VkIGltbWVkaWF0ZWx5LlxuICovXG5RLmRlbGF5ID0gZnVuY3Rpb24gKG9iamVjdCwgdGltZW91dCkge1xuICAgIGlmICh0aW1lb3V0ID09PSB2b2lkIDApIHtcbiAgICAgICAgdGltZW91dCA9IG9iamVjdDtcbiAgICAgICAgb2JqZWN0ID0gdm9pZCAwO1xuICAgIH1cbiAgICByZXR1cm4gUShvYmplY3QpLmRlbGF5KHRpbWVvdXQpO1xufTtcblxuUHJvbWlzZS5wcm90b3R5cGUuZGVsYXkgPSBmdW5jdGlvbiAodGltZW91dCkge1xuICAgIHJldHVybiB0aGlzLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHZhciBkZWZlcnJlZCA9IGRlZmVyKCk7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSh2YWx1ZSk7XG4gICAgICAgIH0sIHRpbWVvdXQpO1xuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9KTtcbn07XG5cbi8qKlxuICogUGFzc2VzIGEgY29udGludWF0aW9uIHRvIGEgTm9kZSBmdW5jdGlvbiwgd2hpY2ggaXMgY2FsbGVkIHdpdGggdGhlIGdpdmVuXG4gKiBhcmd1bWVudHMgcHJvdmlkZWQgYXMgYW4gYXJyYXksIGFuZCByZXR1cm5zIGEgcHJvbWlzZS5cbiAqXG4gKiAgICAgIFEubmZhcHBseShGUy5yZWFkRmlsZSwgW19fZmlsZW5hbWVdKVxuICogICAgICAudGhlbihmdW5jdGlvbiAoY29udGVudCkge1xuICogICAgICB9KVxuICpcbiAqL1xuUS5uZmFwcGx5ID0gZnVuY3Rpb24gKGNhbGxiYWNrLCBhcmdzKSB7XG4gICAgcmV0dXJuIFEoY2FsbGJhY2spLm5mYXBwbHkoYXJncyk7XG59O1xuXG5Qcm9taXNlLnByb3RvdHlwZS5uZmFwcGx5ID0gZnVuY3Rpb24gKGFyZ3MpIHtcbiAgICB2YXIgZGVmZXJyZWQgPSBkZWZlcigpO1xuICAgIHZhciBub2RlQXJncyA9IGFycmF5X3NsaWNlKGFyZ3MpO1xuICAgIG5vZGVBcmdzLnB1c2goZGVmZXJyZWQubWFrZU5vZGVSZXNvbHZlcigpKTtcbiAgICB0aGlzLmZhcHBseShub2RlQXJncykuZmFpbChkZWZlcnJlZC5yZWplY3QpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufTtcblxuLyoqXG4gKiBQYXNzZXMgYSBjb250aW51YXRpb24gdG8gYSBOb2RlIGZ1bmN0aW9uLCB3aGljaCBpcyBjYWxsZWQgd2l0aCB0aGUgZ2l2ZW5cbiAqIGFyZ3VtZW50cyBwcm92aWRlZCBpbmRpdmlkdWFsbHksIGFuZCByZXR1cm5zIGEgcHJvbWlzZS5cbiAqIEBleGFtcGxlXG4gKiBRLm5mY2FsbChGUy5yZWFkRmlsZSwgX19maWxlbmFtZSlcbiAqIC50aGVuKGZ1bmN0aW9uIChjb250ZW50KSB7XG4gKiB9KVxuICpcbiAqL1xuUS5uZmNhbGwgPSBmdW5jdGlvbiAoY2FsbGJhY2sgLyouLi5hcmdzKi8pIHtcbiAgICB2YXIgYXJncyA9IGFycmF5X3NsaWNlKGFyZ3VtZW50cywgMSk7XG4gICAgcmV0dXJuIFEoY2FsbGJhY2spLm5mYXBwbHkoYXJncyk7XG59O1xuXG5Qcm9taXNlLnByb3RvdHlwZS5uZmNhbGwgPSBmdW5jdGlvbiAoLyouLi5hcmdzKi8pIHtcbiAgICB2YXIgbm9kZUFyZ3MgPSBhcnJheV9zbGljZShhcmd1bWVudHMpO1xuICAgIHZhciBkZWZlcnJlZCA9IGRlZmVyKCk7XG4gICAgbm9kZUFyZ3MucHVzaChkZWZlcnJlZC5tYWtlTm9kZVJlc29sdmVyKCkpO1xuICAgIHRoaXMuZmFwcGx5KG5vZGVBcmdzKS5mYWlsKGRlZmVycmVkLnJlamVjdCk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59O1xuXG4vKipcbiAqIFdyYXBzIGEgTm9kZUpTIGNvbnRpbnVhdGlvbiBwYXNzaW5nIGZ1bmN0aW9uIGFuZCByZXR1cm5zIGFuIGVxdWl2YWxlbnRcbiAqIHZlcnNpb24gdGhhdCByZXR1cm5zIGEgcHJvbWlzZS5cbiAqIEBleGFtcGxlXG4gKiBRLm5mYmluZChGUy5yZWFkRmlsZSwgX19maWxlbmFtZSkoXCJ1dGYtOFwiKVxuICogLnRoZW4oY29uc29sZS5sb2cpXG4gKiAuZG9uZSgpXG4gKi9cblEubmZiaW5kID1cblEuZGVub2RlaWZ5ID0gZnVuY3Rpb24gKGNhbGxiYWNrIC8qLi4uYXJncyovKSB7XG4gICAgdmFyIGJhc2VBcmdzID0gYXJyYXlfc2xpY2UoYXJndW1lbnRzLCAxKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbm9kZUFyZ3MgPSBiYXNlQXJncy5jb25jYXQoYXJyYXlfc2xpY2UoYXJndW1lbnRzKSk7XG4gICAgICAgIHZhciBkZWZlcnJlZCA9IGRlZmVyKCk7XG4gICAgICAgIG5vZGVBcmdzLnB1c2goZGVmZXJyZWQubWFrZU5vZGVSZXNvbHZlcigpKTtcbiAgICAgICAgUShjYWxsYmFjaykuZmFwcGx5KG5vZGVBcmdzKS5mYWlsKGRlZmVycmVkLnJlamVjdCk7XG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH07XG59O1xuXG5Qcm9taXNlLnByb3RvdHlwZS5uZmJpbmQgPVxuUHJvbWlzZS5wcm90b3R5cGUuZGVub2RlaWZ5ID0gZnVuY3Rpb24gKC8qLi4uYXJncyovKSB7XG4gICAgdmFyIGFyZ3MgPSBhcnJheV9zbGljZShhcmd1bWVudHMpO1xuICAgIGFyZ3MudW5zaGlmdCh0aGlzKTtcbiAgICByZXR1cm4gUS5kZW5vZGVpZnkuYXBwbHkodm9pZCAwLCBhcmdzKTtcbn07XG5cblEubmJpbmQgPSBmdW5jdGlvbiAoY2FsbGJhY2ssIHRoaXNwIC8qLi4uYXJncyovKSB7XG4gICAgdmFyIGJhc2VBcmdzID0gYXJyYXlfc2xpY2UoYXJndW1lbnRzLCAyKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbm9kZUFyZ3MgPSBiYXNlQXJncy5jb25jYXQoYXJyYXlfc2xpY2UoYXJndW1lbnRzKSk7XG4gICAgICAgIHZhciBkZWZlcnJlZCA9IGRlZmVyKCk7XG4gICAgICAgIG5vZGVBcmdzLnB1c2goZGVmZXJyZWQubWFrZU5vZGVSZXNvbHZlcigpKTtcbiAgICAgICAgZnVuY3Rpb24gYm91bmQoKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2suYXBwbHkodGhpc3AsIGFyZ3VtZW50cyk7XG4gICAgICAgIH1cbiAgICAgICAgUShib3VuZCkuZmFwcGx5KG5vZGVBcmdzKS5mYWlsKGRlZmVycmVkLnJlamVjdCk7XG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH07XG59O1xuXG5Qcm9taXNlLnByb3RvdHlwZS5uYmluZCA9IGZ1bmN0aW9uICgvKnRoaXNwLCAuLi5hcmdzKi8pIHtcbiAgICB2YXIgYXJncyA9IGFycmF5X3NsaWNlKGFyZ3VtZW50cywgMCk7XG4gICAgYXJncy51bnNoaWZ0KHRoaXMpO1xuICAgIHJldHVybiBRLm5iaW5kLmFwcGx5KHZvaWQgMCwgYXJncyk7XG59O1xuXG4vKipcbiAqIENhbGxzIGEgbWV0aG9kIG9mIGEgTm9kZS1zdHlsZSBvYmplY3QgdGhhdCBhY2NlcHRzIGEgTm9kZS1zdHlsZVxuICogY2FsbGJhY2sgd2l0aCBhIGdpdmVuIGFycmF5IG9mIGFyZ3VtZW50cywgcGx1cyBhIHByb3ZpZGVkIGNhbGxiYWNrLlxuICogQHBhcmFtIG9iamVjdCBhbiBvYmplY3QgdGhhdCBoYXMgdGhlIG5hbWVkIG1ldGhvZFxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgbmFtZSBvZiB0aGUgbWV0aG9kIG9mIG9iamVjdFxuICogQHBhcmFtIHtBcnJheX0gYXJncyBhcmd1bWVudHMgdG8gcGFzcyB0byB0aGUgbWV0aG9kOyB0aGUgY2FsbGJhY2tcbiAqIHdpbGwgYmUgcHJvdmlkZWQgYnkgUSBhbmQgYXBwZW5kZWQgdG8gdGhlc2UgYXJndW1lbnRzLlxuICogQHJldHVybnMgYSBwcm9taXNlIGZvciB0aGUgdmFsdWUgb3IgZXJyb3JcbiAqL1xuUS5ubWFwcGx5ID0gLy8gWFhYIEFzIHByb3Bvc2VkIGJ5IFwiUmVkc2FuZHJvXCJcblEubnBvc3QgPSBmdW5jdGlvbiAob2JqZWN0LCBuYW1lLCBhcmdzKSB7XG4gICAgcmV0dXJuIFEob2JqZWN0KS5ucG9zdChuYW1lLCBhcmdzKTtcbn07XG5cblByb21pc2UucHJvdG90eXBlLm5tYXBwbHkgPSAvLyBYWFggQXMgcHJvcG9zZWQgYnkgXCJSZWRzYW5kcm9cIlxuUHJvbWlzZS5wcm90b3R5cGUubnBvc3QgPSBmdW5jdGlvbiAobmFtZSwgYXJncykge1xuICAgIHZhciBub2RlQXJncyA9IGFycmF5X3NsaWNlKGFyZ3MgfHwgW10pO1xuICAgIHZhciBkZWZlcnJlZCA9IGRlZmVyKCk7XG4gICAgbm9kZUFyZ3MucHVzaChkZWZlcnJlZC5tYWtlTm9kZVJlc29sdmVyKCkpO1xuICAgIHRoaXMuZGlzcGF0Y2goXCJwb3N0XCIsIFtuYW1lLCBub2RlQXJnc10pLmZhaWwoZGVmZXJyZWQucmVqZWN0KTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cbi8qKlxuICogQ2FsbHMgYSBtZXRob2Qgb2YgYSBOb2RlLXN0eWxlIG9iamVjdCB0aGF0IGFjY2VwdHMgYSBOb2RlLXN0eWxlXG4gKiBjYWxsYmFjaywgZm9yd2FyZGluZyB0aGUgZ2l2ZW4gdmFyaWFkaWMgYXJndW1lbnRzLCBwbHVzIGEgcHJvdmlkZWRcbiAqIGNhbGxiYWNrIGFyZ3VtZW50LlxuICogQHBhcmFtIG9iamVjdCBhbiBvYmplY3QgdGhhdCBoYXMgdGhlIG5hbWVkIG1ldGhvZFxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgbmFtZSBvZiB0aGUgbWV0aG9kIG9mIG9iamVjdFxuICogQHBhcmFtIC4uLmFyZ3MgYXJndW1lbnRzIHRvIHBhc3MgdG8gdGhlIG1ldGhvZDsgdGhlIGNhbGxiYWNrIHdpbGxcbiAqIGJlIHByb3ZpZGVkIGJ5IFEgYW5kIGFwcGVuZGVkIHRvIHRoZXNlIGFyZ3VtZW50cy5cbiAqIEByZXR1cm5zIGEgcHJvbWlzZSBmb3IgdGhlIHZhbHVlIG9yIGVycm9yXG4gKi9cblEubnNlbmQgPSAvLyBYWFggQmFzZWQgb24gTWFyayBNaWxsZXIncyBwcm9wb3NlZCBcInNlbmRcIlxuUS5ubWNhbGwgPSAvLyBYWFggQmFzZWQgb24gXCJSZWRzYW5kcm8nc1wiIHByb3Bvc2FsXG5RLm5pbnZva2UgPSBmdW5jdGlvbiAob2JqZWN0LCBuYW1lIC8qLi4uYXJncyovKSB7XG4gICAgdmFyIG5vZGVBcmdzID0gYXJyYXlfc2xpY2UoYXJndW1lbnRzLCAyKTtcbiAgICB2YXIgZGVmZXJyZWQgPSBkZWZlcigpO1xuICAgIG5vZGVBcmdzLnB1c2goZGVmZXJyZWQubWFrZU5vZGVSZXNvbHZlcigpKTtcbiAgICBRKG9iamVjdCkuZGlzcGF0Y2goXCJwb3N0XCIsIFtuYW1lLCBub2RlQXJnc10pLmZhaWwoZGVmZXJyZWQucmVqZWN0KTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cblByb21pc2UucHJvdG90eXBlLm5zZW5kID0gLy8gWFhYIEJhc2VkIG9uIE1hcmsgTWlsbGVyJ3MgcHJvcG9zZWQgXCJzZW5kXCJcblByb21pc2UucHJvdG90eXBlLm5tY2FsbCA9IC8vIFhYWCBCYXNlZCBvbiBcIlJlZHNhbmRybydzXCIgcHJvcG9zYWxcblByb21pc2UucHJvdG90eXBlLm5pbnZva2UgPSBmdW5jdGlvbiAobmFtZSAvKi4uLmFyZ3MqLykge1xuICAgIHZhciBub2RlQXJncyA9IGFycmF5X3NsaWNlKGFyZ3VtZW50cywgMSk7XG4gICAgdmFyIGRlZmVycmVkID0gZGVmZXIoKTtcbiAgICBub2RlQXJncy5wdXNoKGRlZmVycmVkLm1ha2VOb2RlUmVzb2x2ZXIoKSk7XG4gICAgdGhpcy5kaXNwYXRjaChcInBvc3RcIiwgW25hbWUsIG5vZGVBcmdzXSkuZmFpbChkZWZlcnJlZC5yZWplY3QpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufTtcblxuLyoqXG4gKiBJZiBhIGZ1bmN0aW9uIHdvdWxkIGxpa2UgdG8gc3VwcG9ydCBib3RoIE5vZGUgY29udGludWF0aW9uLXBhc3Npbmctc3R5bGUgYW5kXG4gKiBwcm9taXNlLXJldHVybmluZy1zdHlsZSwgaXQgY2FuIGVuZCBpdHMgaW50ZXJuYWwgcHJvbWlzZSBjaGFpbiB3aXRoXG4gKiBgbm9kZWlmeShub2RlYmFjaylgLCBmb3J3YXJkaW5nIHRoZSBvcHRpb25hbCBub2RlYmFjayBhcmd1bWVudC4gIElmIHRoZSB1c2VyXG4gKiBlbGVjdHMgdG8gdXNlIGEgbm9kZWJhY2ssIHRoZSByZXN1bHQgd2lsbCBiZSBzZW50IHRoZXJlLiAgSWYgdGhleSBkbyBub3RcbiAqIHBhc3MgYSBub2RlYmFjaywgdGhleSB3aWxsIHJlY2VpdmUgdGhlIHJlc3VsdCBwcm9taXNlLlxuICogQHBhcmFtIG9iamVjdCBhIHJlc3VsdCAob3IgYSBwcm9taXNlIGZvciBhIHJlc3VsdClcbiAqIEBwYXJhbSB7RnVuY3Rpb259IG5vZGViYWNrIGEgTm9kZS5qcy1zdHlsZSBjYWxsYmFja1xuICogQHJldHVybnMgZWl0aGVyIHRoZSBwcm9taXNlIG9yIG5vdGhpbmdcbiAqL1xuUS5ub2RlaWZ5ID0gbm9kZWlmeTtcbmZ1bmN0aW9uIG5vZGVpZnkob2JqZWN0LCBub2RlYmFjaykge1xuICAgIHJldHVybiBRKG9iamVjdCkubm9kZWlmeShub2RlYmFjayk7XG59XG5cblByb21pc2UucHJvdG90eXBlLm5vZGVpZnkgPSBmdW5jdGlvbiAobm9kZWJhY2spIHtcbiAgICBpZiAobm9kZWJhY2spIHtcbiAgICAgICAgdGhpcy50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgUS5uZXh0VGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgbm9kZWJhY2sobnVsbCwgdmFsdWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgUS5uZXh0VGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgbm9kZWJhY2soZXJyb3IpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn07XG5cblEubm9Db25mbGljdCA9IGZ1bmN0aW9uKCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIlEubm9Db25mbGljdCBvbmx5IHdvcmtzIHdoZW4gUSBpcyB1c2VkIGFzIGEgZ2xvYmFsXCIpO1xufTtcblxuLy8gQWxsIGNvZGUgYmVmb3JlIHRoaXMgcG9pbnQgd2lsbCBiZSBmaWx0ZXJlZCBmcm9tIHN0YWNrIHRyYWNlcy5cbnZhciBxRW5kaW5nTGluZSA9IGNhcHR1cmVMaW5lKCk7XG5cbnJldHVybiBRO1xuXG59KTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9xL3EuanNcbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZnMgPSByZXF1aXJlKCdmcycpO1xudmFyIFEgPSByZXF1aXJlKCdxJyk7XG52YXIgd3JpdGUgPSByZXF1aXJlKCcuL3dyaXRlJyk7XG52YXIgdmFsaWRhdGUgPSByZXF1aXJlKCcuL3V0aWxzL3ZhbGlkYXRlJyk7XG5cbnZhciB2YWxpZGF0ZUlucHV0ID0gZnVuY3Rpb24gKG1ldGhvZE5hbWUsIHBhdGgsIGRhdGEsIG9wdGlvbnMpIHtcbiAgdmFyIG1ldGhvZFNpZ25hdHVyZSA9IG1ldGhvZE5hbWUgKyAnKHBhdGgsIGRhdGEsIFtvcHRpb25zXSknO1xuICB2YWxpZGF0ZS5hcmd1bWVudChtZXRob2RTaWduYXR1cmUsICdwYXRoJywgcGF0aCwgWydzdHJpbmcnXSk7XG4gIHZhbGlkYXRlLmFyZ3VtZW50KG1ldGhvZFNpZ25hdHVyZSwgJ2RhdGEnLCBkYXRhLCBbJ3N0cmluZycsICdidWZmZXInXSk7XG4gIHZhbGlkYXRlLm9wdGlvbnMobWV0aG9kU2lnbmF0dXJlLCAnb3B0aW9ucycsIG9wdGlvbnMsIHtcbiAgICBtb2RlOiBbJ3N0cmluZycsICdudW1iZXInXVxuICB9KTtcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gU1lOQ1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBhcHBlbmRTeW5jID0gZnVuY3Rpb24gKHBhdGgsIGRhdGEsIG9wdGlvbnMpIHtcbiAgdHJ5IHtcbiAgICBmcy5hcHBlbmRGaWxlU3luYyhwYXRoLCBkYXRhLCBvcHRpb25zKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgaWYgKGVyci5jb2RlID09PSAnRU5PRU5UJykge1xuICAgICAgLy8gUGFyZW50IGRpcmVjdG9yeSBkb2Vzbid0IGV4aXN0LCBzbyBqdXN0IHBhc3MgdGhlIHRhc2sgdG8gYHdyaXRlYCxcbiAgICAgIC8vIHdoaWNoIHdpbGwgY3JlYXRlIHRoZSBmb2xkZXIgYW5kIGZpbGUuXG4gICAgICB3cml0ZS5zeW5jKHBhdGgsIGRhdGEsIG9wdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBlcnI7XG4gICAgfVxuICB9XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEFTWU5DXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIHByb21pc2VkQXBwZW5kRmlsZSA9IFEuZGVub2RlaWZ5KGZzLmFwcGVuZEZpbGUpO1xuXG52YXIgYXBwZW5kQXN5bmMgPSBmdW5jdGlvbiAocGF0aCwgZGF0YSwgb3B0aW9ucykge1xuICB2YXIgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG5cbiAgcHJvbWlzZWRBcHBlbmRGaWxlKHBhdGgsIGRhdGEsIG9wdGlvbnMpXG4gIC50aGVuKGRlZmVycmVkLnJlc29sdmUpXG4gIC5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gICAgaWYgKGVyci5jb2RlID09PSAnRU5PRU5UJykge1xuICAgICAgLy8gUGFyZW50IGRpcmVjdG9yeSBkb2Vzbid0IGV4aXN0LCBzbyBqdXN0IHBhc3MgdGhlIHRhc2sgdG8gYHdyaXRlYCxcbiAgICAgIC8vIHdoaWNoIHdpbGwgY3JlYXRlIHRoZSBmb2xkZXIgYW5kIGZpbGUuXG4gICAgICB3cml0ZS5hc3luYyhwYXRoLCBkYXRhLCBvcHRpb25zKS50aGVuKGRlZmVycmVkLnJlc29sdmUsIGRlZmVycmVkLnJlamVjdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlZmVycmVkLnJlamVjdChlcnIpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEFQSVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmV4cG9ydHMudmFsaWRhdGVJbnB1dCA9IHZhbGlkYXRlSW5wdXQ7XG5leHBvcnRzLnN5bmMgPSBhcHBlbmRTeW5jO1xuZXhwb3J0cy5hc3luYyA9IGFwcGVuZEFzeW5jO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZzLWpldHBhY2svbGliL2FwcGVuZC5qc1xuLy8gbW9kdWxlIGlkID0gNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJmc1wiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImZzXCJcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZnMgPSByZXF1aXJlKCdmcycpO1xudmFyIFEgPSByZXF1aXJlKCdxJyk7XG52YXIgbWtkaXJwID0gcmVxdWlyZSgnbWtkaXJwJyk7XG52YXIgcGF0aFV0aWwgPSByZXF1aXJlKCdwYXRoJyk7XG52YXIgdmFsaWRhdGUgPSByZXF1aXJlKCcuL3V0aWxzL3ZhbGlkYXRlJyk7XG5cbnZhciB2YWxpZGF0ZUlucHV0ID0gZnVuY3Rpb24gKG1ldGhvZE5hbWUsIHBhdGgsIGRhdGEsIG9wdGlvbnMpIHtcbiAgdmFyIG1ldGhvZFNpZ25hdHVyZSA9IG1ldGhvZE5hbWUgKyAnKHBhdGgsIGRhdGEsIFtvcHRpb25zXSknO1xuICB2YWxpZGF0ZS5hcmd1bWVudChtZXRob2RTaWduYXR1cmUsICdwYXRoJywgcGF0aCwgWydzdHJpbmcnXSk7XG4gIHZhbGlkYXRlLmFyZ3VtZW50KG1ldGhvZFNpZ25hdHVyZSwgJ2RhdGEnLCBkYXRhLCBbJ3N0cmluZycsICdidWZmZXInLCAnb2JqZWN0JywgJ2FycmF5J10pO1xuICB2YWxpZGF0ZS5vcHRpb25zKG1ldGhvZFNpZ25hdHVyZSwgJ29wdGlvbnMnLCBvcHRpb25zLCB7XG4gICAgYXRvbWljOiBbJ2Jvb2xlYW4nXSxcbiAgICBqc29uSW5kZW50OiBbJ251bWJlciddXG4gIH0pO1xufTtcblxuLy8gVGVtcG9yYXJ5IGZpbGUgZXh0ZW5zaW9ucyB1c2VkIGZvciBhdG9taWMgZmlsZSBvdmVyd3JpdGluZy5cbnZhciBuZXdFeHQgPSAnLl9fbmV3X18nO1xuXG52YXIgc2VyaWFsaXplVG9Kc29uTWF5YmUgPSBmdW5jdGlvbiAoZGF0YSwganNvbkluZGVudCkge1xuICB2YXIgaW5kZW50ID0ganNvbkluZGVudDtcbiAgaWYgKHR5cGVvZiBpbmRlbnQgIT09ICdudW1iZXInKSB7XG4gICAgaW5kZW50ID0gMjtcbiAgfVxuXG4gIGlmICh0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCdcbiAgICAgICYmICFCdWZmZXIuaXNCdWZmZXIoZGF0YSlcbiAgICAgICYmIGRhdGEgIT09IG51bGwpIHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoZGF0YSwgbnVsbCwgaW5kZW50KTtcbiAgfVxuXG4gIHJldHVybiBkYXRhO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBTWU5DXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIHdyaXRlRmlsZVN5bmMgPSBmdW5jdGlvbiAocGF0aCwgZGF0YSwgb3B0aW9ucykge1xuICB0cnkge1xuICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aCwgZGF0YSwgb3B0aW9ucyk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGlmIChlcnIuY29kZSA9PT0gJ0VOT0VOVCcpIHtcbiAgICAgIC8vIE1lYW5zIHBhcmVudCBkaXJlY3RvcnkgZG9lc24ndCBleGlzdCwgc28gY3JlYXRlIGl0IGFuZCB0cnkgYWdhaW4uXG4gICAgICBta2RpcnAuc3luYyhwYXRoVXRpbC5kaXJuYW1lKHBhdGgpKTtcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aCwgZGF0YSwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IGVycjtcbiAgICB9XG4gIH1cbn07XG5cbnZhciB3cml0ZUF0b21pY1N5bmMgPSBmdW5jdGlvbiAocGF0aCwgZGF0YSwgb3B0aW9ucykge1xuICAvLyB3ZSBhcmUgYXNzdW1pbmcgdGhlcmUgaXMgZmlsZSBvbiBnaXZlbiBwYXRoLCBhbmQgd2UgZG9uJ3Qgd2FudFxuICAvLyB0byB0b3VjaCBpdCB1bnRpbCB3ZSBhcmUgc3VyZSBvdXIgZGF0YSBoYXMgYmVlbiBzYXZlZCBjb3JyZWN0bHksXG4gIC8vIHNvIHdyaXRlIHRoZSBkYXRhIGludG8gdGVtcG9yYXJ5IGZpbGUuLi5cbiAgd3JpdGVGaWxlU3luYyhwYXRoICsgbmV3RXh0LCBkYXRhLCBvcHRpb25zKTtcbiAgLy8gLi4ubmV4dCByZW5hbWUgdGVtcCBmaWxlIHRvIHJlcGxhY2UgcmVhbCBwYXRoLlxuICBmcy5yZW5hbWVTeW5jKHBhdGggKyBuZXdFeHQsIHBhdGgpO1xufTtcblxudmFyIHdyaXRlU3luYyA9IGZ1bmN0aW9uIChwYXRoLCBkYXRhLCBvcHRpb25zKSB7XG4gIHZhciBvcHRzID0gb3B0aW9ucyB8fCB7fTtcbiAgdmFyIHByb2Nlc3NlZERhdGEgPSBzZXJpYWxpemVUb0pzb25NYXliZShkYXRhLCBvcHRzLmpzb25JbmRlbnQpO1xuXG4gIHZhciB3cml0ZVN0cmF0ZWd5ID0gd3JpdGVGaWxlU3luYztcbiAgaWYgKG9wdHMuYXRvbWljKSB7XG4gICAgd3JpdGVTdHJhdGVneSA9IHdyaXRlQXRvbWljU3luYztcbiAgfVxuICB3cml0ZVN0cmF0ZWd5KHBhdGgsIHByb2Nlc3NlZERhdGEsIHsgbW9kZTogb3B0cy5tb2RlIH0pO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBBU1lOQ1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBwcm9taXNlZFJlbmFtZSA9IFEuZGVub2RlaWZ5KGZzLnJlbmFtZSk7XG52YXIgcHJvbWlzZWRXcml0ZUZpbGUgPSBRLmRlbm9kZWlmeShmcy53cml0ZUZpbGUpO1xudmFyIHByb21pc2VkTWtkaXJwID0gUS5kZW5vZGVpZnkobWtkaXJwKTtcblxudmFyIHdyaXRlRmlsZUFzeW5jID0gZnVuY3Rpb24gKHBhdGgsIGRhdGEsIG9wdGlvbnMpIHtcbiAgdmFyIGRlZmVycmVkID0gUS5kZWZlcigpO1xuXG4gIHByb21pc2VkV3JpdGVGaWxlKHBhdGgsIGRhdGEsIG9wdGlvbnMpXG4gIC50aGVuKGRlZmVycmVkLnJlc29sdmUpXG4gIC5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gICAgLy8gRmlyc3QgYXR0ZW1wdCB0byB3cml0ZSBhIGZpbGUgZW5kZWQgd2l0aCBlcnJvci5cbiAgICAvLyBDaGVjayBpZiB0aGlzIGlzIG5vdCBkdWUgdG8gbm9uZXhpc3RlbnQgcGFyZW50IGRpcmVjdG9yeS5cbiAgICBpZiAoZXJyLmNvZGUgPT09ICdFTk9FTlQnKSB7XG4gICAgICAvLyBQYXJlbnQgZGlyZWN0b3J5IGRvZXNuJ3QgZXhpc3QsIHNvIGNyZWF0ZSBpdCBhbmQgdHJ5IGFnYWluLlxuICAgICAgcHJvbWlzZWRNa2RpcnAocGF0aFV0aWwuZGlybmFtZShwYXRoKSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHByb21pc2VkV3JpdGVGaWxlKHBhdGgsIGRhdGEsIG9wdGlvbnMpO1xuICAgICAgfSlcbiAgICAgIC50aGVuKGRlZmVycmVkLnJlc29sdmUsIGRlZmVycmVkLnJlamVjdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIE5vcGUsIHNvbWUgb3RoZXIgZXJyb3IsIHRocm93IGl0LlxuICAgICAgZGVmZXJyZWQucmVqZWN0KGVycik7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cbnZhciB3cml0ZUF0b21pY0FzeW5jID0gZnVuY3Rpb24gKHBhdGgsIGRhdGEsIG9wdGlvbnMpIHtcbiAgdmFyIGRlZmVycmVkID0gUS5kZWZlcigpO1xuXG4gIC8vIFdlIGFyZSBhc3N1bWluZyB0aGVyZSBpcyBmaWxlIG9uIGdpdmVuIHBhdGgsIGFuZCB3ZSBkb24ndCB3YW50XG4gIC8vIHRvIHRvdWNoIGl0IHVudGlsIHdlIGFyZSBzdXJlIG91ciBkYXRhIGhhcyBiZWVuIHNhdmVkIGNvcnJlY3RseSxcbiAgLy8gc28gd3JpdGUgdGhlIGRhdGEgaW50byB0ZW1wb3JhcnkgZmlsZS4uLlxuICB3cml0ZUZpbGVBc3luYyhwYXRoICsgbmV3RXh0LCBkYXRhLCBvcHRpb25zKVxuICAudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgLy8gLi4ubmV4dCByZW5hbWUgdGVtcCBmaWxlIHRvIHJlYWwgcGF0aC5cbiAgICByZXR1cm4gcHJvbWlzZWRSZW5hbWUocGF0aCArIG5ld0V4dCwgcGF0aCk7XG4gIH0pXG4gIC50aGVuKGRlZmVycmVkLnJlc29sdmUsIGRlZmVycmVkLnJlamVjdCk7XG5cbiAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59O1xuXG52YXIgd3JpdGVBc3luYyA9IGZ1bmN0aW9uIChwYXRoLCBkYXRhLCBvcHRpb25zKSB7XG4gIHZhciBvcHRzID0gb3B0aW9ucyB8fCB7fTtcbiAgdmFyIHByb2Nlc3NlZERhdGEgPSBzZXJpYWxpemVUb0pzb25NYXliZShkYXRhLCBvcHRzLmpzb25JbmRlbnQpO1xuXG4gIHZhciB3cml0ZVN0cmF0ZWd5ID0gd3JpdGVGaWxlQXN5bmM7XG4gIGlmIChvcHRzLmF0b21pYykge1xuICAgIHdyaXRlU3RyYXRlZ3kgPSB3cml0ZUF0b21pY0FzeW5jO1xuICB9XG4gIHJldHVybiB3cml0ZVN0cmF0ZWd5KHBhdGgsIHByb2Nlc3NlZERhdGEsIHsgbW9kZTogb3B0cy5tb2RlIH0pO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBBUElcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5leHBvcnRzLnZhbGlkYXRlSW5wdXQgPSB2YWxpZGF0ZUlucHV0O1xuZXhwb3J0cy5zeW5jID0gd3JpdGVTeW5jO1xuZXhwb3J0cy5hc3luYyA9IHdyaXRlQXN5bmM7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZnMtamV0cGFjay9saWIvd3JpdGUuanNcbi8vIG1vZHVsZSBpZCA9IDhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG52YXIgZnMgPSByZXF1aXJlKCdmcycpO1xudmFyIF8wNzc3ID0gcGFyc2VJbnQoJzA3NzcnLCA4KTtcblxubW9kdWxlLmV4cG9ydHMgPSBta2RpclAubWtkaXJwID0gbWtkaXJQLm1rZGlyUCA9IG1rZGlyUDtcblxuZnVuY3Rpb24gbWtkaXJQIChwLCBvcHRzLCBmLCBtYWRlKSB7XG4gICAgaWYgKHR5cGVvZiBvcHRzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGYgPSBvcHRzO1xuICAgICAgICBvcHRzID0ge307XG4gICAgfVxuICAgIGVsc2UgaWYgKCFvcHRzIHx8IHR5cGVvZiBvcHRzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBvcHRzID0geyBtb2RlOiBvcHRzIH07XG4gICAgfVxuICAgIFxuICAgIHZhciBtb2RlID0gb3B0cy5tb2RlO1xuICAgIHZhciB4ZnMgPSBvcHRzLmZzIHx8IGZzO1xuICAgIFxuICAgIGlmIChtb2RlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbW9kZSA9IF8wNzc3ICYgKH5wcm9jZXNzLnVtYXNrKCkpO1xuICAgIH1cbiAgICBpZiAoIW1hZGUpIG1hZGUgPSBudWxsO1xuICAgIFxuICAgIHZhciBjYiA9IGYgfHwgZnVuY3Rpb24gKCkge307XG4gICAgcCA9IHBhdGgucmVzb2x2ZShwKTtcbiAgICBcbiAgICB4ZnMubWtkaXIocCwgbW9kZSwgZnVuY3Rpb24gKGVyKSB7XG4gICAgICAgIGlmICghZXIpIHtcbiAgICAgICAgICAgIG1hZGUgPSBtYWRlIHx8IHA7XG4gICAgICAgICAgICByZXR1cm4gY2IobnVsbCwgbWFkZSk7XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoIChlci5jb2RlKSB7XG4gICAgICAgICAgICBjYXNlICdFTk9FTlQnOlxuICAgICAgICAgICAgICAgIG1rZGlyUChwYXRoLmRpcm5hbWUocCksIG9wdHMsIGZ1bmN0aW9uIChlciwgbWFkZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXIpIGNiKGVyLCBtYWRlKTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBta2RpclAocCwgb3B0cywgY2IsIG1hZGUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAvLyBJbiB0aGUgY2FzZSBvZiBhbnkgb3RoZXIgZXJyb3IsIGp1c3Qgc2VlIGlmIHRoZXJlJ3MgYSBkaXJcbiAgICAgICAgICAgIC8vIHRoZXJlIGFscmVhZHkuICBJZiBzbywgdGhlbiBob29yYXkhICBJZiBub3QsIHRoZW4gc29tZXRoaW5nXG4gICAgICAgICAgICAvLyBpcyBib3JrZWQuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHhmcy5zdGF0KHAsIGZ1bmN0aW9uIChlcjIsIHN0YXQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIHN0YXQgZmFpbHMsIHRoZW4gdGhhdCdzIHN1cGVyIHdlaXJkLlxuICAgICAgICAgICAgICAgICAgICAvLyBsZXQgdGhlIG9yaWdpbmFsIGVycm9yIGJlIHRoZSBmYWlsdXJlIHJlYXNvbi5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGVyMiB8fCAhc3RhdC5pc0RpcmVjdG9yeSgpKSBjYihlciwgbWFkZSlcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBjYihudWxsLCBtYWRlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5ta2RpclAuc3luYyA9IGZ1bmN0aW9uIHN5bmMgKHAsIG9wdHMsIG1hZGUpIHtcbiAgICBpZiAoIW9wdHMgfHwgdHlwZW9mIG9wdHMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIG9wdHMgPSB7IG1vZGU6IG9wdHMgfTtcbiAgICB9XG4gICAgXG4gICAgdmFyIG1vZGUgPSBvcHRzLm1vZGU7XG4gICAgdmFyIHhmcyA9IG9wdHMuZnMgfHwgZnM7XG4gICAgXG4gICAgaWYgKG1vZGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBtb2RlID0gXzA3NzcgJiAofnByb2Nlc3MudW1hc2soKSk7XG4gICAgfVxuICAgIGlmICghbWFkZSkgbWFkZSA9IG51bGw7XG5cbiAgICBwID0gcGF0aC5yZXNvbHZlKHApO1xuXG4gICAgdHJ5IHtcbiAgICAgICAgeGZzLm1rZGlyU3luYyhwLCBtb2RlKTtcbiAgICAgICAgbWFkZSA9IG1hZGUgfHwgcDtcbiAgICB9XG4gICAgY2F0Y2ggKGVycjApIHtcbiAgICAgICAgc3dpdGNoIChlcnIwLmNvZGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ0VOT0VOVCcgOlxuICAgICAgICAgICAgICAgIG1hZGUgPSBzeW5jKHBhdGguZGlybmFtZShwKSwgb3B0cywgbWFkZSk7XG4gICAgICAgICAgICAgICAgc3luYyhwLCBvcHRzLCBtYWRlKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgLy8gSW4gdGhlIGNhc2Ugb2YgYW55IG90aGVyIGVycm9yLCBqdXN0IHNlZSBpZiB0aGVyZSdzIGEgZGlyXG4gICAgICAgICAgICAvLyB0aGVyZSBhbHJlYWR5LiAgSWYgc28sIHRoZW4gaG9vcmF5ISAgSWYgbm90LCB0aGVuIHNvbWV0aGluZ1xuICAgICAgICAgICAgLy8gaXMgYm9ya2VkLlxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB2YXIgc3RhdDtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBzdGF0ID0geGZzLnN0YXRTeW5jKHApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZXJyMSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnIwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIXN0YXQuaXNEaXJlY3RvcnkoKSkgdGhyb3cgZXJyMDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBtYWRlO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9ta2RpcnAvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcHJldHR5UHJpbnRUeXBlcyA9IGZ1bmN0aW9uICh0eXBlcykge1xuICB2YXIgYWRkQXJ0aWNsZSA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgICB2YXIgdm93ZWxzID0gWydhJywgJ2UnLCAnaScsICdvJywgJ3UnXTtcbiAgICBpZiAodm93ZWxzLmluZGV4T2Yoc3RyWzBdKSAhPT0gLTEpIHtcbiAgICAgIHJldHVybiAnYW4gJyArIHN0cjtcbiAgICB9XG4gICAgcmV0dXJuICdhICcgKyBzdHI7XG4gIH07XG5cbiAgcmV0dXJuIHR5cGVzLm1hcChhZGRBcnRpY2xlKS5qb2luKCcgb3IgJyk7XG59O1xuXG52YXIgaXNBcnJheU9mTm90YXRpb24gPSBmdW5jdGlvbiAodHlwZURlZmluaXRpb24pIHtcbiAgcmV0dXJuIC9hcnJheSBvZiAvLnRlc3QodHlwZURlZmluaXRpb24pO1xufTtcblxudmFyIGV4dHJhY3RUeXBlRnJvbUFycmF5T2ZOb3RhdGlvbiA9IGZ1bmN0aW9uICh0eXBlRGVmaW5pdGlvbikge1xuICAvLyBUaGUgbm90YXRpb24gaXMgZS5nLiAnYXJyYXkgb2Ygc3RyaW5nJ1xuICByZXR1cm4gdHlwZURlZmluaXRpb24uc3BsaXQoJyBvZiAnKVsxXTtcbn07XG5cbnZhciBpc1ZhbGlkVHlwZURlZmluaXRpb24gPSBmdW5jdGlvbiAodHlwZVN0cikge1xuICBpZiAoaXNBcnJheU9mTm90YXRpb24odHlwZVN0cikpIHtcbiAgICByZXR1cm4gaXNWYWxpZFR5cGVEZWZpbml0aW9uKGV4dHJhY3RUeXBlRnJvbUFycmF5T2ZOb3RhdGlvbih0eXBlU3RyKSk7XG4gIH1cblxuICByZXR1cm4gW1xuICAgICdzdHJpbmcnLFxuICAgICdudW1iZXInLFxuICAgICdib29sZWFuJyxcbiAgICAnYXJyYXknLFxuICAgICdvYmplY3QnLFxuICAgICdidWZmZXInLFxuICAgICdudWxsJyxcbiAgICAndW5kZWZpbmVkJ1xuICBdLnNvbWUoZnVuY3Rpb24gKHZhbGlkVHlwZSkge1xuICAgIHJldHVybiB2YWxpZFR5cGUgPT09IHR5cGVTdHI7XG4gIH0pO1xufTtcblxudmFyIGRldGVjdFR5cGUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgcmV0dXJuICdudWxsJztcbiAgfVxuICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICByZXR1cm4gJ2FycmF5JztcbiAgfVxuICBpZiAoQnVmZmVyLmlzQnVmZmVyKHZhbHVlKSkge1xuICAgIHJldHVybiAnYnVmZmVyJztcbiAgfVxuICByZXR1cm4gdHlwZW9mIHZhbHVlO1xufTtcblxudmFyIG9ubHlVbmlxdWVWYWx1ZXNJbkFycmF5RmlsdGVyID0gZnVuY3Rpb24gKHZhbHVlLCBpbmRleCwgc2VsZikge1xuICByZXR1cm4gc2VsZi5pbmRleE9mKHZhbHVlKSA9PT0gaW5kZXg7XG59O1xuXG52YXIgZGV0ZWN0VHlwZURlZXAgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSBkZXRlY3RUeXBlKHZhbHVlKTtcbiAgdmFyIHR5cGVzSW5BcnJheTtcblxuICBpZiAodHlwZSA9PT0gJ2FycmF5Jykge1xuICAgIHR5cGVzSW5BcnJheSA9IHZhbHVlXG4gICAgICAubWFwKGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBkZXRlY3RUeXBlKGVsZW1lbnQpO1xuICAgICAgfSlcbiAgICAgIC5maWx0ZXIob25seVVuaXF1ZVZhbHVlc0luQXJyYXlGaWx0ZXIpO1xuICAgIHR5cGUgKz0gJyBvZiAnICsgdHlwZXNJbkFycmF5LmpvaW4oJywgJyk7XG4gIH1cblxuICByZXR1cm4gdHlwZTtcbn07XG5cbnZhciB2YWxpZGF0ZUFycmF5ID0gZnVuY3Rpb24gKGFyZ3VtZW50VmFsdWUsIHR5cGVUb0NoZWNrKSB7XG4gIHZhciBhbGxvd2VkVHlwZUluQXJyYXkgPSBleHRyYWN0VHlwZUZyb21BcnJheU9mTm90YXRpb24odHlwZVRvQ2hlY2spO1xuXG4gIGlmIChkZXRlY3RUeXBlKGFyZ3VtZW50VmFsdWUpICE9PSAnYXJyYXknKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIGFyZ3VtZW50VmFsdWUuZXZlcnkoZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICByZXR1cm4gZGV0ZWN0VHlwZShlbGVtZW50KSA9PT0gYWxsb3dlZFR5cGVJbkFycmF5O1xuICB9KTtcbn07XG5cbnZhciB2YWxpZGF0ZUFyZ3VtZW50ID0gZnVuY3Rpb24gKG1ldGhvZE5hbWUsIGFyZ3VtZW50TmFtZSwgYXJndW1lbnRWYWx1ZSwgYXJndW1lbnRNdXN0QmUpIHtcbiAgdmFyIGlzT25lT2ZBbGxvd2VkVHlwZXMgPSBhcmd1bWVudE11c3RCZS5zb21lKGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgaWYgKCFpc1ZhbGlkVHlwZURlZmluaXRpb24odHlwZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biB0eXBlIFwiJyArIHR5cGUgKyAnXCInKTtcbiAgICB9XG5cbiAgICBpZiAoaXNBcnJheU9mTm90YXRpb24odHlwZSkpIHtcbiAgICAgIHJldHVybiB2YWxpZGF0ZUFycmF5KGFyZ3VtZW50VmFsdWUsIHR5cGUpO1xuICAgIH1cblxuICAgIHJldHVybiB0eXBlID09PSBkZXRlY3RUeXBlKGFyZ3VtZW50VmFsdWUpO1xuICB9KTtcblxuICBpZiAoIWlzT25lT2ZBbGxvd2VkVHlwZXMpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0FyZ3VtZW50IFwiJyArIGFyZ3VtZW50TmFtZSArICdcIiBwYXNzZWQgdG8gJyArIG1ldGhvZE5hbWUgKyAnIG11c3QgYmUgJ1xuICAgICAgKyBwcmV0dHlQcmludFR5cGVzKGFyZ3VtZW50TXVzdEJlKSArICcuIFJlY2VpdmVkICcgKyBkZXRlY3RUeXBlRGVlcChhcmd1bWVudFZhbHVlKSk7XG4gIH1cbn07XG5cbnZhciB2YWxpZGF0ZU9wdGlvbnMgPSBmdW5jdGlvbiAobWV0aG9kTmFtZSwgb3B0aW9uc09iak5hbWUsIG9iaiwgYWxsb3dlZE9wdGlvbnMpIHtcbiAgaWYgKG9iaiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdmFsaWRhdGVBcmd1bWVudChtZXRob2ROYW1lLCBvcHRpb25zT2JqTmFtZSwgb2JqLCBbJ29iamVjdCddKTtcbiAgICBPYmplY3Qua2V5cyhvYmopLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgdmFyIGFyZ05hbWUgPSBvcHRpb25zT2JqTmFtZSArICcuJyArIGtleTtcbiAgICAgIGlmIChhbGxvd2VkT3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIHZhbGlkYXRlQXJndW1lbnQobWV0aG9kTmFtZSwgYXJnTmFtZSwgb2JqW2tleV0sIGFsbG93ZWRPcHRpb25zW2tleV0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGFyZ3VtZW50IFwiJyArIGFyZ05hbWUgKyAnXCIgcGFzc2VkIHRvICcgKyBtZXRob2ROYW1lKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFyZ3VtZW50OiB2YWxpZGF0ZUFyZ3VtZW50LFxuICBvcHRpb25zOiB2YWxpZGF0ZU9wdGlvbnNcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZnMtamV0cGFjay9saWIvdXRpbHMvdmFsaWRhdGUuanNcbi8vIG1vZHVsZSBpZCA9IDEwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxudmFyIHBhdGhVdGlsID0gcmVxdWlyZSgncGF0aCcpO1xudmFyIGZzID0gcmVxdWlyZSgnZnMnKTtcbnZhciBRID0gcmVxdWlyZSgncScpO1xudmFyIG1rZGlycCA9IHJlcXVpcmUoJ21rZGlycCcpO1xudmFyIHJpbXJhZiA9IHJlcXVpcmUoJ3JpbXJhZicpO1xuXG52YXIgbW9kZVV0aWwgPSByZXF1aXJlKCcuL3V0aWxzL21vZGUnKTtcbnZhciB2YWxpZGF0ZSA9IHJlcXVpcmUoJy4vdXRpbHMvdmFsaWRhdGUnKTtcblxudmFyIHZhbGlkYXRlSW5wdXQgPSBmdW5jdGlvbiAobWV0aG9kTmFtZSwgcGF0aCwgY3JpdGVyaWEpIHtcbiAgdmFyIG1ldGhvZFNpZ25hdHVyZSA9IG1ldGhvZE5hbWUgKyAnKHBhdGgsIFtjcml0ZXJpYV0pJztcbiAgdmFsaWRhdGUuYXJndW1lbnQobWV0aG9kU2lnbmF0dXJlLCAncGF0aCcsIHBhdGgsIFsnc3RyaW5nJ10pO1xuICB2YWxpZGF0ZS5vcHRpb25zKG1ldGhvZFNpZ25hdHVyZSwgJ2NyaXRlcmlhJywgY3JpdGVyaWEsIHtcbiAgICBlbXB0eTogWydib29sZWFuJ10sXG4gICAgbW9kZTogWydzdHJpbmcnLCAnbnVtYmVyJ11cbiAgfSk7XG59O1xuXG52YXIgZ2V0Q3JpdGVyaWFEZWZhdWx0cyA9IGZ1bmN0aW9uIChwYXNzZWRDcml0ZXJpYSkge1xuICB2YXIgY3JpdGVyaWEgPSBwYXNzZWRDcml0ZXJpYSB8fCB7fTtcbiAgaWYgKHR5cGVvZiBjcml0ZXJpYS5lbXB0eSAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgY3JpdGVyaWEuZW1wdHkgPSBmYWxzZTtcbiAgfVxuICBpZiAoY3JpdGVyaWEubW9kZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgY3JpdGVyaWEubW9kZSA9IG1vZGVVdGlsLm5vcm1hbGl6ZUZpbGVNb2RlKGNyaXRlcmlhLm1vZGUpO1xuICB9XG4gIHJldHVybiBjcml0ZXJpYTtcbn07XG5cbnZhciBnZW5lcmF0ZVBhdGhPY2N1cGllZEJ5Tm90RGlyZWN0b3J5RXJyb3IgPSBmdW5jdGlvbiAocGF0aCkge1xuICByZXR1cm4gbmV3IEVycm9yKCdQYXRoICcgKyBwYXRoICsgJyBleGlzdHMgYnV0IGlzIG5vdCBhIGRpcmVjdG9yeS4nICtcbiAgICAgICcgSGFsdGluZyBqZXRwYWNrLmRpcigpIGNhbGwgZm9yIHNhZmV0eSByZWFzb25zLicpO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBTeW5jXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNoZWNrV2hhdEFscmVhZHlPY2N1cGllc1BhdGhTeW5jID0gZnVuY3Rpb24gKHBhdGgpIHtcbiAgdmFyIHN0YXQ7XG5cbiAgdHJ5IHtcbiAgICBzdGF0ID0gZnMuc3RhdFN5bmMocGF0aCk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIC8vIERldGVjdGlvbiBpZiBwYXRoIGFscmVhZHkgZXhpc3RzXG4gICAgaWYgKGVyci5jb2RlICE9PSAnRU5PRU5UJykge1xuICAgICAgdGhyb3cgZXJyO1xuICAgIH1cbiAgfVxuXG4gIGlmIChzdGF0ICYmICFzdGF0LmlzRGlyZWN0b3J5KCkpIHtcbiAgICB0aHJvdyBnZW5lcmF0ZVBhdGhPY2N1cGllZEJ5Tm90RGlyZWN0b3J5RXJyb3IocGF0aCk7XG4gIH1cblxuICByZXR1cm4gc3RhdDtcbn07XG5cbnZhciBjcmVhdGVCcmFuZE5ld0RpcmVjdG9yeVN5bmMgPSBmdW5jdGlvbiAocGF0aCwgY3JpdGVyaWEpIHtcbiAgbWtkaXJwLnN5bmMocGF0aCwgeyBtb2RlOiBjcml0ZXJpYS5tb2RlIH0pO1xufTtcblxudmFyIGNoZWNrRXhpc3RpbmdEaXJlY3RvcnlGdWxmaWxsc0NyaXRlcmlhU3luYyA9IGZ1bmN0aW9uIChwYXRoLCBzdGF0LCBjcml0ZXJpYSkge1xuICB2YXIgY2hlY2tNb2RlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBtb2RlID0gbW9kZVV0aWwubm9ybWFsaXplRmlsZU1vZGUoc3RhdC5tb2RlKTtcbiAgICBpZiAoY3JpdGVyaWEubW9kZSAhPT0gdW5kZWZpbmVkICYmIGNyaXRlcmlhLm1vZGUgIT09IG1vZGUpIHtcbiAgICAgIGZzLmNobW9kU3luYyhwYXRoLCBjcml0ZXJpYS5tb2RlKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIGNoZWNrRW1wdGluZXNzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBsaXN0O1xuICAgIGlmIChjcml0ZXJpYS5lbXB0eSkge1xuICAgICAgLy8gRGVsZXRlIGV2ZXJ5dGhpbmcgaW5zaWRlIHRoaXMgZGlyZWN0b3J5XG4gICAgICBsaXN0ID0gZnMucmVhZGRpclN5bmMocGF0aCk7XG4gICAgICBsaXN0LmZvckVhY2goZnVuY3Rpb24gKGZpbGVuYW1lKSB7XG4gICAgICAgIHJpbXJhZi5zeW5jKHBhdGhVdGlsLnJlc29sdmUocGF0aCwgZmlsZW5hbWUpKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBjaGVja01vZGUoKTtcbiAgY2hlY2tFbXB0aW5lc3MoKTtcbn07XG5cbnZhciBkaXJTeW5jID0gZnVuY3Rpb24gKHBhdGgsIHBhc3NlZENyaXRlcmlhKSB7XG4gIHZhciBjcml0ZXJpYSA9IGdldENyaXRlcmlhRGVmYXVsdHMocGFzc2VkQ3JpdGVyaWEpO1xuICB2YXIgc3RhdCA9IGNoZWNrV2hhdEFscmVhZHlPY2N1cGllc1BhdGhTeW5jKHBhdGgpO1xuICBpZiAoc3RhdCkge1xuICAgIGNoZWNrRXhpc3RpbmdEaXJlY3RvcnlGdWxmaWxsc0NyaXRlcmlhU3luYyhwYXRoLCBzdGF0LCBjcml0ZXJpYSk7XG4gIH0gZWxzZSB7XG4gICAgY3JlYXRlQnJhbmROZXdEaXJlY3RvcnlTeW5jKHBhdGgsIGNyaXRlcmlhKTtcbiAgfVxufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBBc3luY1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBwcm9taXNlZFN0YXQgPSBRLmRlbm9kZWlmeShmcy5zdGF0KTtcbnZhciBwcm9taXNlZENobW9kID0gUS5kZW5vZGVpZnkoZnMuY2htb2QpO1xudmFyIHByb21pc2VkUmVhZGRpciA9IFEuZGVub2RlaWZ5KGZzLnJlYWRkaXIpO1xudmFyIHByb21pc2VkUmltcmFmID0gUS5kZW5vZGVpZnkocmltcmFmKTtcbnZhciBwcm9taXNlZE1rZGlycCA9IFEuZGVub2RlaWZ5KG1rZGlycCk7XG5cbnZhciBjaGVja1doYXRBbHJlYWR5T2NjdXBpZXNQYXRoQXN5bmMgPSBmdW5jdGlvbiAocGF0aCkge1xuICB2YXIgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG5cbiAgcHJvbWlzZWRTdGF0KHBhdGgpXG4gIC50aGVuKGZ1bmN0aW9uIChzdGF0KSB7XG4gICAgaWYgKHN0YXQuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgZGVmZXJyZWQucmVzb2x2ZShzdGF0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVmZXJyZWQucmVqZWN0KGdlbmVyYXRlUGF0aE9jY3VwaWVkQnlOb3REaXJlY3RvcnlFcnJvcihwYXRoKSk7XG4gICAgfVxuICB9KVxuICAuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgIGlmIChlcnIuY29kZSA9PT0gJ0VOT0VOVCcpIHtcbiAgICAgIC8vIFBhdGggZG9lc24ndCBleGlzdFxuICAgICAgZGVmZXJyZWQucmVzb2x2ZSh1bmRlZmluZWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBUaGlzIGlzIG90aGVyIGVycm9yIHRoYXQgbm9uZXhpc3RlbnQgcGF0aCwgc28gZW5kIGhlcmUuXG4gICAgICBkZWZlcnJlZC5yZWplY3QoZXJyKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufTtcblxuLy8gRGVsZXRlIGFsbCBmaWxlcyBhbmQgZGlyZWN0b3JlcyBpbnNpZGUgZ2l2ZW4gZGlyZWN0b3J5XG52YXIgZW1wdHlBc3luYyA9IGZ1bmN0aW9uIChwYXRoKSB7XG4gIHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcblxuICBwcm9taXNlZFJlYWRkaXIocGF0aClcbiAgLnRoZW4oZnVuY3Rpb24gKGxpc3QpIHtcbiAgICB2YXIgZG9PbmUgPSBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgIHZhciBzdWJQYXRoO1xuICAgICAgaWYgKGluZGV4ID09PSBsaXN0Lmxlbmd0aCkge1xuICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdWJQYXRoID0gcGF0aFV0aWwucmVzb2x2ZShwYXRoLCBsaXN0W2luZGV4XSk7XG4gICAgICAgIHByb21pc2VkUmltcmFmKHN1YlBhdGgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGRvT25lKGluZGV4ICsgMSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBkb09uZSgwKTtcbiAgfSlcbiAgLmNhdGNoKGRlZmVycmVkLnJlamVjdCk7XG5cbiAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59O1xuXG52YXIgY2hlY2tFeGlzdGluZ0RpcmVjdG9yeUZ1bGZpbGxzQ3JpdGVyaWFBc3luYyA9IGZ1bmN0aW9uIChwYXRoLCBzdGF0LCBjcml0ZXJpYSkge1xuICB2YXIgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG5cbiAgdmFyIGNoZWNrTW9kZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbW9kZSA9IG1vZGVVdGlsLm5vcm1hbGl6ZUZpbGVNb2RlKHN0YXQubW9kZSk7XG4gICAgaWYgKGNyaXRlcmlhLm1vZGUgIT09IHVuZGVmaW5lZCAmJiBjcml0ZXJpYS5tb2RlICE9PSBtb2RlKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZWRDaG1vZChwYXRoLCBjcml0ZXJpYS5tb2RlKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBRKCk7XG4gIH07XG5cbiAgdmFyIGNoZWNrRW1wdGluZXNzID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChjcml0ZXJpYS5lbXB0eSkge1xuICAgICAgcmV0dXJuIGVtcHR5QXN5bmMocGF0aCk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUSgpO1xuICB9O1xuXG4gIGNoZWNrTW9kZSgpXG4gIC50aGVuKGNoZWNrRW1wdGluZXNzKVxuICAudGhlbihkZWZlcnJlZC5yZXNvbHZlLCBkZWZlcnJlZC5yZWplY3QpO1xuXG4gIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufTtcblxudmFyIGNyZWF0ZUJyYW5kTmV3RGlyZWN0b3J5QXN5bmMgPSBmdW5jdGlvbiAocGF0aCwgY3JpdGVyaWEpIHtcbiAgcmV0dXJuIHByb21pc2VkTWtkaXJwKHBhdGgsIHsgbW9kZTogY3JpdGVyaWEubW9kZSB9KTtcbn07XG5cbnZhciBkaXJBc3luYyA9IGZ1bmN0aW9uIChwYXRoLCBwYXNzZWRDcml0ZXJpYSkge1xuICB2YXIgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gIHZhciBjcml0ZXJpYSA9IGdldENyaXRlcmlhRGVmYXVsdHMocGFzc2VkQ3JpdGVyaWEpO1xuXG4gIGNoZWNrV2hhdEFscmVhZHlPY2N1cGllc1BhdGhBc3luYyhwYXRoKVxuICAudGhlbihmdW5jdGlvbiAoc3RhdCkge1xuICAgIGlmIChzdGF0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBjaGVja0V4aXN0aW5nRGlyZWN0b3J5RnVsZmlsbHNDcml0ZXJpYUFzeW5jKHBhdGgsIHN0YXQsIGNyaXRlcmlhKTtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUJyYW5kTmV3RGlyZWN0b3J5QXN5bmMocGF0aCwgY3JpdGVyaWEpO1xuICB9KVxuICAudGhlbihkZWZlcnJlZC5yZXNvbHZlLCBkZWZlcnJlZC5yZWplY3QpO1xuXG4gIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBBUElcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5tb2R1bGUuZXhwb3J0cy52YWxpZGF0ZUlucHV0ID0gdmFsaWRhdGVJbnB1dDtcbm1vZHVsZS5leHBvcnRzLnN5bmMgPSBkaXJTeW5jO1xubW9kdWxlLmV4cG9ydHMuYXN5bmMgPSBkaXJBc3luYztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9mcy1qZXRwYWNrL2xpYi9kaXIuanNcbi8vIG1vZHVsZSBpZCA9IDExXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gcmltcmFmXG5yaW1yYWYuc3luYyA9IHJpbXJhZlN5bmNcblxudmFyIGFzc2VydCA9IHJlcXVpcmUoXCJhc3NlcnRcIilcbnZhciBwYXRoID0gcmVxdWlyZShcInBhdGhcIilcbnZhciBmcyA9IHJlcXVpcmUoXCJmc1wiKVxudmFyIGdsb2IgPSByZXF1aXJlKFwiZ2xvYlwiKVxuXG52YXIgZGVmYXVsdEdsb2JPcHRzID0ge1xuICBub3NvcnQ6IHRydWUsXG4gIHNpbGVudDogdHJ1ZVxufVxuXG4vLyBmb3IgRU1GSUxFIGhhbmRsaW5nXG52YXIgdGltZW91dCA9IDBcblxudmFyIGlzV2luZG93cyA9IChwcm9jZXNzLnBsYXRmb3JtID09PSBcIndpbjMyXCIpXG5cbmZ1bmN0aW9uIGRlZmF1bHRzIChvcHRpb25zKSB7XG4gIHZhciBtZXRob2RzID0gW1xuICAgICd1bmxpbmsnLFxuICAgICdjaG1vZCcsXG4gICAgJ3N0YXQnLFxuICAgICdsc3RhdCcsXG4gICAgJ3JtZGlyJyxcbiAgICAncmVhZGRpcidcbiAgXVxuICBtZXRob2RzLmZvckVhY2goZnVuY3Rpb24obSkge1xuICAgIG9wdGlvbnNbbV0gPSBvcHRpb25zW21dIHx8IGZzW21dXG4gICAgbSA9IG0gKyAnU3luYydcbiAgICBvcHRpb25zW21dID0gb3B0aW9uc1ttXSB8fCBmc1ttXVxuICB9KVxuXG4gIG9wdGlvbnMubWF4QnVzeVRyaWVzID0gb3B0aW9ucy5tYXhCdXN5VHJpZXMgfHwgM1xuICBvcHRpb25zLmVtZmlsZVdhaXQgPSBvcHRpb25zLmVtZmlsZVdhaXQgfHwgMTAwMFxuICBpZiAob3B0aW9ucy5nbG9iID09PSBmYWxzZSkge1xuICAgIG9wdGlvbnMuZGlzYWJsZUdsb2IgPSB0cnVlXG4gIH1cbiAgb3B0aW9ucy5kaXNhYmxlR2xvYiA9IG9wdGlvbnMuZGlzYWJsZUdsb2IgfHwgZmFsc2VcbiAgb3B0aW9ucy5nbG9iID0gb3B0aW9ucy5nbG9iIHx8IGRlZmF1bHRHbG9iT3B0c1xufVxuXG5mdW5jdGlvbiByaW1yYWYgKHAsIG9wdGlvbnMsIGNiKSB7XG4gIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNiID0gb3B0aW9uc1xuICAgIG9wdGlvbnMgPSB7fVxuICB9XG5cbiAgYXNzZXJ0KHAsICdyaW1yYWY6IG1pc3NpbmcgcGF0aCcpXG4gIGFzc2VydC5lcXVhbCh0eXBlb2YgcCwgJ3N0cmluZycsICdyaW1yYWY6IHBhdGggc2hvdWxkIGJlIGEgc3RyaW5nJylcbiAgYXNzZXJ0LmVxdWFsKHR5cGVvZiBjYiwgJ2Z1bmN0aW9uJywgJ3JpbXJhZjogY2FsbGJhY2sgZnVuY3Rpb24gcmVxdWlyZWQnKVxuICBhc3NlcnQob3B0aW9ucywgJ3JpbXJhZjogaW52YWxpZCBvcHRpb25zIGFyZ3VtZW50IHByb3ZpZGVkJylcbiAgYXNzZXJ0LmVxdWFsKHR5cGVvZiBvcHRpb25zLCAnb2JqZWN0JywgJ3JpbXJhZjogb3B0aW9ucyBzaG91bGQgYmUgb2JqZWN0JylcblxuICBkZWZhdWx0cyhvcHRpb25zKVxuXG4gIHZhciBidXN5VHJpZXMgPSAwXG4gIHZhciBlcnJTdGF0ZSA9IG51bGxcbiAgdmFyIG4gPSAwXG5cbiAgaWYgKG9wdGlvbnMuZGlzYWJsZUdsb2IgfHwgIWdsb2IuaGFzTWFnaWMocCkpXG4gICAgcmV0dXJuIGFmdGVyR2xvYihudWxsLCBbcF0pXG5cbiAgb3B0aW9ucy5sc3RhdChwLCBmdW5jdGlvbiAoZXIsIHN0YXQpIHtcbiAgICBpZiAoIWVyKVxuICAgICAgcmV0dXJuIGFmdGVyR2xvYihudWxsLCBbcF0pXG5cbiAgICBnbG9iKHAsIG9wdGlvbnMuZ2xvYiwgYWZ0ZXJHbG9iKVxuICB9KVxuXG4gIGZ1bmN0aW9uIG5leHQgKGVyKSB7XG4gICAgZXJyU3RhdGUgPSBlcnJTdGF0ZSB8fCBlclxuICAgIGlmICgtLW4gPT09IDApXG4gICAgICBjYihlcnJTdGF0ZSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGFmdGVyR2xvYiAoZXIsIHJlc3VsdHMpIHtcbiAgICBpZiAoZXIpXG4gICAgICByZXR1cm4gY2IoZXIpXG5cbiAgICBuID0gcmVzdWx0cy5sZW5ndGhcbiAgICBpZiAobiA9PT0gMClcbiAgICAgIHJldHVybiBjYigpXG5cbiAgICByZXN1bHRzLmZvckVhY2goZnVuY3Rpb24gKHApIHtcbiAgICAgIHJpbXJhZl8ocCwgb3B0aW9ucywgZnVuY3Rpb24gQ0IgKGVyKSB7XG4gICAgICAgIGlmIChlcikge1xuICAgICAgICAgIGlmICgoZXIuY29kZSA9PT0gXCJFQlVTWVwiIHx8IGVyLmNvZGUgPT09IFwiRU5PVEVNUFRZXCIgfHwgZXIuY29kZSA9PT0gXCJFUEVSTVwiKSAmJlxuICAgICAgICAgICAgICBidXN5VHJpZXMgPCBvcHRpb25zLm1heEJ1c3lUcmllcykge1xuICAgICAgICAgICAgYnVzeVRyaWVzICsrXG4gICAgICAgICAgICB2YXIgdGltZSA9IGJ1c3lUcmllcyAqIDEwMFxuICAgICAgICAgICAgLy8gdHJ5IGFnYWluLCB3aXRoIHRoZSBzYW1lIGV4YWN0IGNhbGxiYWNrIGFzIHRoaXMgb25lLlxuICAgICAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICByaW1yYWZfKHAsIG9wdGlvbnMsIENCKVxuICAgICAgICAgICAgfSwgdGltZSlcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyB0aGlzIG9uZSB3b24ndCBoYXBwZW4gaWYgZ3JhY2VmdWwtZnMgaXMgdXNlZC5cbiAgICAgICAgICBpZiAoZXIuY29kZSA9PT0gXCJFTUZJTEVcIiAmJiB0aW1lb3V0IDwgb3B0aW9ucy5lbWZpbGVXYWl0KSB7XG4gICAgICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHJpbXJhZl8ocCwgb3B0aW9ucywgQ0IpXG4gICAgICAgICAgICB9LCB0aW1lb3V0ICsrKVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIGFscmVhZHkgZ29uZVxuICAgICAgICAgIGlmIChlci5jb2RlID09PSBcIkVOT0VOVFwiKSBlciA9IG51bGxcbiAgICAgICAgfVxuXG4gICAgICAgIHRpbWVvdXQgPSAwXG4gICAgICAgIG5leHQoZXIpXG4gICAgICB9KVxuICAgIH0pXG4gIH1cbn1cblxuLy8gVHdvIHBvc3NpYmxlIHN0cmF0ZWdpZXMuXG4vLyAxLiBBc3N1bWUgaXQncyBhIGZpbGUuICB1bmxpbmsgaXQsIHRoZW4gZG8gdGhlIGRpciBzdHVmZiBvbiBFUEVSTSBvciBFSVNESVJcbi8vIDIuIEFzc3VtZSBpdCdzIGEgZGlyZWN0b3J5LiAgcmVhZGRpciwgdGhlbiBkbyB0aGUgZmlsZSBzdHVmZiBvbiBFTk9URElSXG4vL1xuLy8gQm90aCByZXN1bHQgaW4gYW4gZXh0cmEgc3lzY2FsbCB3aGVuIHlvdSBndWVzcyB3cm9uZy4gIEhvd2V2ZXIsIHRoZXJlXG4vLyBhcmUgbGlrZWx5IGZhciBtb3JlIG5vcm1hbCBmaWxlcyBpbiB0aGUgd29ybGQgdGhhbiBkaXJlY3Rvcmllcy4gIFRoaXNcbi8vIGlzIGJhc2VkIG9uIHRoZSBhc3N1bXB0aW9uIHRoYXQgYSB0aGUgYXZlcmFnZSBudW1iZXIgb2YgZmlsZXMgcGVyXG4vLyBkaXJlY3RvcnkgaXMgPj0gMS5cbi8vXG4vLyBJZiBhbnlvbmUgZXZlciBjb21wbGFpbnMgYWJvdXQgdGhpcywgdGhlbiBJIGd1ZXNzIHRoZSBzdHJhdGVneSBjb3VsZFxuLy8gYmUgbWFkZSBjb25maWd1cmFibGUgc29tZWhvdy4gIEJ1dCB1bnRpbCB0aGVuLCBZQUdOSS5cbmZ1bmN0aW9uIHJpbXJhZl8gKHAsIG9wdGlvbnMsIGNiKSB7XG4gIGFzc2VydChwKVxuICBhc3NlcnQob3B0aW9ucylcbiAgYXNzZXJ0KHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJylcblxuICAvLyBzdW5vcyBsZXRzIHRoZSByb290IHVzZXIgdW5saW5rIGRpcmVjdG9yaWVzLCB3aGljaCBpcy4uLiB3ZWlyZC5cbiAgLy8gc28gd2UgaGF2ZSB0byBsc3RhdCBoZXJlIGFuZCBtYWtlIHN1cmUgaXQncyBub3QgYSBkaXIuXG4gIG9wdGlvbnMubHN0YXQocCwgZnVuY3Rpb24gKGVyLCBzdCkge1xuICAgIGlmIChlciAmJiBlci5jb2RlID09PSBcIkVOT0VOVFwiKVxuICAgICAgcmV0dXJuIGNiKG51bGwpXG5cbiAgICAvLyBXaW5kb3dzIGNhbiBFUEVSTSBvbiBzdGF0LiAgTGlmZSBpcyBzdWZmZXJpbmcuXG4gICAgaWYgKGVyICYmIGVyLmNvZGUgPT09IFwiRVBFUk1cIiAmJiBpc1dpbmRvd3MpXG4gICAgICBmaXhXaW5FUEVSTShwLCBvcHRpb25zLCBlciwgY2IpXG5cbiAgICBpZiAoc3QgJiYgc3QuaXNEaXJlY3RvcnkoKSlcbiAgICAgIHJldHVybiBybWRpcihwLCBvcHRpb25zLCBlciwgY2IpXG5cbiAgICBvcHRpb25zLnVubGluayhwLCBmdW5jdGlvbiAoZXIpIHtcbiAgICAgIGlmIChlcikge1xuICAgICAgICBpZiAoZXIuY29kZSA9PT0gXCJFTk9FTlRcIilcbiAgICAgICAgICByZXR1cm4gY2IobnVsbClcbiAgICAgICAgaWYgKGVyLmNvZGUgPT09IFwiRVBFUk1cIilcbiAgICAgICAgICByZXR1cm4gKGlzV2luZG93cylcbiAgICAgICAgICAgID8gZml4V2luRVBFUk0ocCwgb3B0aW9ucywgZXIsIGNiKVxuICAgICAgICAgICAgOiBybWRpcihwLCBvcHRpb25zLCBlciwgY2IpXG4gICAgICAgIGlmIChlci5jb2RlID09PSBcIkVJU0RJUlwiKVxuICAgICAgICAgIHJldHVybiBybWRpcihwLCBvcHRpb25zLCBlciwgY2IpXG4gICAgICB9XG4gICAgICByZXR1cm4gY2IoZXIpXG4gICAgfSlcbiAgfSlcbn1cblxuZnVuY3Rpb24gZml4V2luRVBFUk0gKHAsIG9wdGlvbnMsIGVyLCBjYikge1xuICBhc3NlcnQocClcbiAgYXNzZXJ0KG9wdGlvbnMpXG4gIGFzc2VydCh0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpXG4gIGlmIChlcilcbiAgICBhc3NlcnQoZXIgaW5zdGFuY2VvZiBFcnJvcilcblxuICBvcHRpb25zLmNobW9kKHAsIDY2NiwgZnVuY3Rpb24gKGVyMikge1xuICAgIGlmIChlcjIpXG4gICAgICBjYihlcjIuY29kZSA9PT0gXCJFTk9FTlRcIiA/IG51bGwgOiBlcilcbiAgICBlbHNlXG4gICAgICBvcHRpb25zLnN0YXQocCwgZnVuY3Rpb24oZXIzLCBzdGF0cykge1xuICAgICAgICBpZiAoZXIzKVxuICAgICAgICAgIGNiKGVyMy5jb2RlID09PSBcIkVOT0VOVFwiID8gbnVsbCA6IGVyKVxuICAgICAgICBlbHNlIGlmIChzdGF0cy5pc0RpcmVjdG9yeSgpKVxuICAgICAgICAgIHJtZGlyKHAsIG9wdGlvbnMsIGVyLCBjYilcbiAgICAgICAgZWxzZVxuICAgICAgICAgIG9wdGlvbnMudW5saW5rKHAsIGNiKVxuICAgICAgfSlcbiAgfSlcbn1cblxuZnVuY3Rpb24gZml4V2luRVBFUk1TeW5jIChwLCBvcHRpb25zLCBlcikge1xuICBhc3NlcnQocClcbiAgYXNzZXJ0KG9wdGlvbnMpXG4gIGlmIChlcilcbiAgICBhc3NlcnQoZXIgaW5zdGFuY2VvZiBFcnJvcilcblxuICB0cnkge1xuICAgIG9wdGlvbnMuY2htb2RTeW5jKHAsIDY2NilcbiAgfSBjYXRjaCAoZXIyKSB7XG4gICAgaWYgKGVyMi5jb2RlID09PSBcIkVOT0VOVFwiKVxuICAgICAgcmV0dXJuXG4gICAgZWxzZVxuICAgICAgdGhyb3cgZXJcbiAgfVxuXG4gIHRyeSB7XG4gICAgdmFyIHN0YXRzID0gb3B0aW9ucy5zdGF0U3luYyhwKVxuICB9IGNhdGNoIChlcjMpIHtcbiAgICBpZiAoZXIzLmNvZGUgPT09IFwiRU5PRU5UXCIpXG4gICAgICByZXR1cm5cbiAgICBlbHNlXG4gICAgICB0aHJvdyBlclxuICB9XG5cbiAgaWYgKHN0YXRzLmlzRGlyZWN0b3J5KCkpXG4gICAgcm1kaXJTeW5jKHAsIG9wdGlvbnMsIGVyKVxuICBlbHNlXG4gICAgb3B0aW9ucy51bmxpbmtTeW5jKHApXG59XG5cbmZ1bmN0aW9uIHJtZGlyIChwLCBvcHRpb25zLCBvcmlnaW5hbEVyLCBjYikge1xuICBhc3NlcnQocClcbiAgYXNzZXJ0KG9wdGlvbnMpXG4gIGlmIChvcmlnaW5hbEVyKVxuICAgIGFzc2VydChvcmlnaW5hbEVyIGluc3RhbmNlb2YgRXJyb3IpXG4gIGFzc2VydCh0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpXG5cbiAgLy8gdHJ5IHRvIHJtZGlyIGZpcnN0LCBhbmQgb25seSByZWFkZGlyIG9uIEVOT1RFTVBUWSBvciBFRVhJU1QgKFN1bk9TKVxuICAvLyBpZiB3ZSBndWVzc2VkIHdyb25nLCBhbmQgaXQncyBub3QgYSBkaXJlY3RvcnksIHRoZW5cbiAgLy8gcmFpc2UgdGhlIG9yaWdpbmFsIGVycm9yLlxuICBvcHRpb25zLnJtZGlyKHAsIGZ1bmN0aW9uIChlcikge1xuICAgIGlmIChlciAmJiAoZXIuY29kZSA9PT0gXCJFTk9URU1QVFlcIiB8fCBlci5jb2RlID09PSBcIkVFWElTVFwiIHx8IGVyLmNvZGUgPT09IFwiRVBFUk1cIikpXG4gICAgICBybWtpZHMocCwgb3B0aW9ucywgY2IpXG4gICAgZWxzZSBpZiAoZXIgJiYgZXIuY29kZSA9PT0gXCJFTk9URElSXCIpXG4gICAgICBjYihvcmlnaW5hbEVyKVxuICAgIGVsc2VcbiAgICAgIGNiKGVyKVxuICB9KVxufVxuXG5mdW5jdGlvbiBybWtpZHMocCwgb3B0aW9ucywgY2IpIHtcbiAgYXNzZXJ0KHApXG4gIGFzc2VydChvcHRpb25zKVxuICBhc3NlcnQodHlwZW9mIGNiID09PSAnZnVuY3Rpb24nKVxuXG4gIG9wdGlvbnMucmVhZGRpcihwLCBmdW5jdGlvbiAoZXIsIGZpbGVzKSB7XG4gICAgaWYgKGVyKVxuICAgICAgcmV0dXJuIGNiKGVyKVxuICAgIHZhciBuID0gZmlsZXMubGVuZ3RoXG4gICAgaWYgKG4gPT09IDApXG4gICAgICByZXR1cm4gb3B0aW9ucy5ybWRpcihwLCBjYilcbiAgICB2YXIgZXJyU3RhdGVcbiAgICBmaWxlcy5mb3JFYWNoKGZ1bmN0aW9uIChmKSB7XG4gICAgICByaW1yYWYocGF0aC5qb2luKHAsIGYpLCBvcHRpb25zLCBmdW5jdGlvbiAoZXIpIHtcbiAgICAgICAgaWYgKGVyclN0YXRlKVxuICAgICAgICAgIHJldHVyblxuICAgICAgICBpZiAoZXIpXG4gICAgICAgICAgcmV0dXJuIGNiKGVyclN0YXRlID0gZXIpXG4gICAgICAgIGlmICgtLW4gPT09IDApXG4gICAgICAgICAgb3B0aW9ucy5ybWRpcihwLCBjYilcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcbn1cblxuLy8gdGhpcyBsb29rcyBzaW1wbGVyLCBhbmQgaXMgc3RyaWN0bHkgKmZhc3RlciosIGJ1dCB3aWxsXG4vLyB0aWUgdXAgdGhlIEphdmFTY3JpcHQgdGhyZWFkIGFuZCBmYWlsIG9uIGV4Y2Vzc2l2ZWx5XG4vLyBkZWVwIGRpcmVjdG9yeSB0cmVlcy5cbmZ1bmN0aW9uIHJpbXJhZlN5bmMgKHAsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgZGVmYXVsdHMob3B0aW9ucylcblxuICBhc3NlcnQocCwgJ3JpbXJhZjogbWlzc2luZyBwYXRoJylcbiAgYXNzZXJ0LmVxdWFsKHR5cGVvZiBwLCAnc3RyaW5nJywgJ3JpbXJhZjogcGF0aCBzaG91bGQgYmUgYSBzdHJpbmcnKVxuICBhc3NlcnQob3B0aW9ucywgJ3JpbXJhZjogbWlzc2luZyBvcHRpb25zJylcbiAgYXNzZXJ0LmVxdWFsKHR5cGVvZiBvcHRpb25zLCAnb2JqZWN0JywgJ3JpbXJhZjogb3B0aW9ucyBzaG91bGQgYmUgb2JqZWN0JylcblxuICB2YXIgcmVzdWx0c1xuXG4gIGlmIChvcHRpb25zLmRpc2FibGVHbG9iIHx8ICFnbG9iLmhhc01hZ2ljKHApKSB7XG4gICAgcmVzdWx0cyA9IFtwXVxuICB9IGVsc2Uge1xuICAgIHRyeSB7XG4gICAgICBvcHRpb25zLmxzdGF0U3luYyhwKVxuICAgICAgcmVzdWx0cyA9IFtwXVxuICAgIH0gY2F0Y2ggKGVyKSB7XG4gICAgICByZXN1bHRzID0gZ2xvYi5zeW5jKHAsIG9wdGlvbnMuZ2xvYilcbiAgICB9XG4gIH1cblxuICBpZiAoIXJlc3VsdHMubGVuZ3RoKVxuICAgIHJldHVyblxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzdWx0cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBwID0gcmVzdWx0c1tpXVxuXG4gICAgdHJ5IHtcbiAgICAgIHZhciBzdCA9IG9wdGlvbnMubHN0YXRTeW5jKHApXG4gICAgfSBjYXRjaCAoZXIpIHtcbiAgICAgIGlmIChlci5jb2RlID09PSBcIkVOT0VOVFwiKVxuICAgICAgICByZXR1cm5cblxuICAgICAgLy8gV2luZG93cyBjYW4gRVBFUk0gb24gc3RhdC4gIExpZmUgaXMgc3VmZmVyaW5nLlxuICAgICAgaWYgKGVyLmNvZGUgPT09IFwiRVBFUk1cIiAmJiBpc1dpbmRvd3MpXG4gICAgICAgIGZpeFdpbkVQRVJNU3luYyhwLCBvcHRpb25zLCBlcilcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgLy8gc3Vub3MgbGV0cyB0aGUgcm9vdCB1c2VyIHVubGluayBkaXJlY3Rvcmllcywgd2hpY2ggaXMuLi4gd2VpcmQuXG4gICAgICBpZiAoc3QgJiYgc3QuaXNEaXJlY3RvcnkoKSlcbiAgICAgICAgcm1kaXJTeW5jKHAsIG9wdGlvbnMsIG51bGwpXG4gICAgICBlbHNlXG4gICAgICAgIG9wdGlvbnMudW5saW5rU3luYyhwKVxuICAgIH0gY2F0Y2ggKGVyKSB7XG4gICAgICBpZiAoZXIuY29kZSA9PT0gXCJFTk9FTlRcIilcbiAgICAgICAgcmV0dXJuXG4gICAgICBpZiAoZXIuY29kZSA9PT0gXCJFUEVSTVwiKVxuICAgICAgICByZXR1cm4gaXNXaW5kb3dzID8gZml4V2luRVBFUk1TeW5jKHAsIG9wdGlvbnMsIGVyKSA6IHJtZGlyU3luYyhwLCBvcHRpb25zLCBlcilcbiAgICAgIGlmIChlci5jb2RlICE9PSBcIkVJU0RJUlwiKVxuICAgICAgICB0aHJvdyBlclxuXG4gICAgICBybWRpclN5bmMocCwgb3B0aW9ucywgZXIpXG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHJtZGlyU3luYyAocCwgb3B0aW9ucywgb3JpZ2luYWxFcikge1xuICBhc3NlcnQocClcbiAgYXNzZXJ0KG9wdGlvbnMpXG4gIGlmIChvcmlnaW5hbEVyKVxuICAgIGFzc2VydChvcmlnaW5hbEVyIGluc3RhbmNlb2YgRXJyb3IpXG5cbiAgdHJ5IHtcbiAgICBvcHRpb25zLnJtZGlyU3luYyhwKVxuICB9IGNhdGNoIChlcikge1xuICAgIGlmIChlci5jb2RlID09PSBcIkVOT0VOVFwiKVxuICAgICAgcmV0dXJuXG4gICAgaWYgKGVyLmNvZGUgPT09IFwiRU5PVERJUlwiKVxuICAgICAgdGhyb3cgb3JpZ2luYWxFclxuICAgIGlmIChlci5jb2RlID09PSBcIkVOT1RFTVBUWVwiIHx8IGVyLmNvZGUgPT09IFwiRUVYSVNUXCIgfHwgZXIuY29kZSA9PT0gXCJFUEVSTVwiKVxuICAgICAgcm1raWRzU3luYyhwLCBvcHRpb25zKVxuICB9XG59XG5cbmZ1bmN0aW9uIHJta2lkc1N5bmMgKHAsIG9wdGlvbnMpIHtcbiAgYXNzZXJ0KHApXG4gIGFzc2VydChvcHRpb25zKVxuICBvcHRpb25zLnJlYWRkaXJTeW5jKHApLmZvckVhY2goZnVuY3Rpb24gKGYpIHtcbiAgICByaW1yYWZTeW5jKHBhdGguam9pbihwLCBmKSwgb3B0aW9ucylcbiAgfSlcblxuICAvLyBXZSBvbmx5IGVuZCB1cCBoZXJlIG9uY2Ugd2UgZ290IEVOT1RFTVBUWSBhdCBsZWFzdCBvbmNlLCBhbmRcbiAgLy8gYXQgdGhpcyBwb2ludCwgd2UgYXJlIGd1YXJhbnRlZWQgdG8gaGF2ZSByZW1vdmVkIGFsbCB0aGUga2lkcy5cbiAgLy8gU28sIHdlIGtub3cgdGhhdCBpdCB3b24ndCBiZSBFTk9FTlQgb3IgRU5PVERJUiBvciBhbnl0aGluZyBlbHNlLlxuICAvLyB0cnkgcmVhbGx5IGhhcmQgdG8gZGVsZXRlIHN0dWZmIG9uIHdpbmRvd3MsIGJlY2F1c2UgaXQgaGFzIGFcbiAgLy8gUFJPRk9VTkRMWSBhbm5veWluZyBoYWJpdCBvZiBub3QgY2xvc2luZyBoYW5kbGVzIHByb21wdGx5IHdoZW5cbiAgLy8gZmlsZXMgYXJlIGRlbGV0ZWQsIHJlc3VsdGluZyBpbiBzcHVyaW91cyBFTk9URU1QVFkgZXJyb3JzLlxuICB2YXIgcmV0cmllcyA9IGlzV2luZG93cyA/IDEwMCA6IDFcbiAgdmFyIGkgPSAwXG4gIGRvIHtcbiAgICB2YXIgdGhyZXcgPSB0cnVlXG4gICAgdHJ5IHtcbiAgICAgIHZhciByZXQgPSBvcHRpb25zLnJtZGlyU3luYyhwLCBvcHRpb25zKVxuICAgICAgdGhyZXcgPSBmYWxzZVxuICAgICAgcmV0dXJuIHJldFxuICAgIH0gZmluYWxseSB7XG4gICAgICBpZiAoKytpIDwgcmV0cmllcyAmJiB0aHJldylcbiAgICAgICAgY29udGludWVcbiAgICB9XG4gIH0gd2hpbGUgKHRydWUpXG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmltcmFmL3JpbXJhZi5qc1xuLy8gbW9kdWxlIGlkID0gMTJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYXNzZXJ0XCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiYXNzZXJ0XCJcbi8vIG1vZHVsZSBpZCA9IDEzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIEFwcHJvYWNoOlxuLy9cbi8vIDEuIEdldCB0aGUgbWluaW1hdGNoIHNldFxuLy8gMi4gRm9yIGVhY2ggcGF0dGVybiBpbiB0aGUgc2V0LCBQUk9DRVNTKHBhdHRlcm4sIGZhbHNlKVxuLy8gMy4gU3RvcmUgbWF0Y2hlcyBwZXItc2V0LCB0aGVuIHVuaXEgdGhlbVxuLy9cbi8vIFBST0NFU1MocGF0dGVybiwgaW5HbG9iU3Rhcilcbi8vIEdldCB0aGUgZmlyc3QgW25dIGl0ZW1zIGZyb20gcGF0dGVybiB0aGF0IGFyZSBhbGwgc3RyaW5nc1xuLy8gSm9pbiB0aGVzZSB0b2dldGhlci4gIFRoaXMgaXMgUFJFRklYLlxuLy8gICBJZiB0aGVyZSBpcyBubyBtb3JlIHJlbWFpbmluZywgdGhlbiBzdGF0KFBSRUZJWCkgYW5kXG4vLyAgIGFkZCB0byBtYXRjaGVzIGlmIGl0IHN1Y2NlZWRzLiAgRU5ELlxuLy9cbi8vIElmIGluR2xvYlN0YXIgYW5kIFBSRUZJWCBpcyBzeW1saW5rIGFuZCBwb2ludHMgdG8gZGlyXG4vLyAgIHNldCBFTlRSSUVTID0gW11cbi8vIGVsc2UgcmVhZGRpcihQUkVGSVgpIGFzIEVOVFJJRVNcbi8vICAgSWYgZmFpbCwgRU5EXG4vL1xuLy8gd2l0aCBFTlRSSUVTXG4vLyAgIElmIHBhdHRlcm5bbl0gaXMgR0xPQlNUQVJcbi8vICAgICAvLyBoYW5kbGUgdGhlIGNhc2Ugd2hlcmUgdGhlIGdsb2JzdGFyIG1hdGNoIGlzIGVtcHR5XG4vLyAgICAgLy8gYnkgcHJ1bmluZyBpdCBvdXQsIGFuZCB0ZXN0aW5nIHRoZSByZXN1bHRpbmcgcGF0dGVyblxuLy8gICAgIFBST0NFU1MocGF0dGVyblswLi5uXSArIHBhdHRlcm5bbisxIC4uICRdLCBmYWxzZSlcbi8vICAgICAvLyBoYW5kbGUgb3RoZXIgY2FzZXMuXG4vLyAgICAgZm9yIEVOVFJZIGluIEVOVFJJRVMgKG5vdCBkb3RmaWxlcylcbi8vICAgICAgIC8vIGF0dGFjaCBnbG9ic3RhciArIHRhaWwgb250byB0aGUgZW50cnlcbi8vICAgICAgIC8vIE1hcmsgdGhhdCB0aGlzIGVudHJ5IGlzIGEgZ2xvYnN0YXIgbWF0Y2hcbi8vICAgICAgIFBST0NFU1MocGF0dGVyblswLi5uXSArIEVOVFJZICsgcGF0dGVybltuIC4uICRdLCB0cnVlKVxuLy9cbi8vICAgZWxzZSAvLyBub3QgZ2xvYnN0YXJcbi8vICAgICBmb3IgRU5UUlkgaW4gRU5UUklFUyAobm90IGRvdGZpbGVzLCB1bmxlc3MgcGF0dGVybltuXSBpcyBkb3QpXG4vLyAgICAgICBUZXN0IEVOVFJZIGFnYWluc3QgcGF0dGVybltuXVxuLy8gICAgICAgSWYgZmFpbHMsIGNvbnRpbnVlXG4vLyAgICAgICBJZiBwYXNzZXMsIFBST0NFU1MocGF0dGVyblswLi5uXSArIGl0ZW0gKyBwYXR0ZXJuW24rMSAuLiAkXSlcbi8vXG4vLyBDYXZlYXQ6XG4vLyAgIENhY2hlIGFsbCBzdGF0cyBhbmQgcmVhZGRpcnMgcmVzdWx0cyB0byBtaW5pbWl6ZSBzeXNjYWxsLiAgU2luY2UgYWxsXG4vLyAgIHdlIGV2ZXIgY2FyZSBhYm91dCBpcyBleGlzdGVuY2UgYW5kIGRpcmVjdG9yeS1uZXNzLCB3ZSBjYW4ganVzdCBrZWVwXG4vLyAgIGB0cnVlYCBmb3IgZmlsZXMsIGFuZCBbY2hpbGRyZW4sLi4uXSBmb3IgZGlyZWN0b3JpZXMsIG9yIGBmYWxzZWAgZm9yXG4vLyAgIHRoaW5ncyB0aGF0IGRvbid0IGV4aXN0LlxuXG5tb2R1bGUuZXhwb3J0cyA9IGdsb2JcblxudmFyIGZzID0gcmVxdWlyZSgnZnMnKVxudmFyIHJwID0gcmVxdWlyZSgnZnMucmVhbHBhdGgnKVxudmFyIG1pbmltYXRjaCA9IHJlcXVpcmUoJ21pbmltYXRjaCcpXG52YXIgTWluaW1hdGNoID0gbWluaW1hdGNoLk1pbmltYXRjaFxudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKVxudmFyIEVFID0gcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyXG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxudmFyIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydCcpXG52YXIgaXNBYnNvbHV0ZSA9IHJlcXVpcmUoJ3BhdGgtaXMtYWJzb2x1dGUnKVxudmFyIGdsb2JTeW5jID0gcmVxdWlyZSgnLi9zeW5jLmpzJylcbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbi5qcycpXG52YXIgYWxwaGFzb3J0ID0gY29tbW9uLmFscGhhc29ydFxudmFyIGFscGhhc29ydGkgPSBjb21tb24uYWxwaGFzb3J0aVxudmFyIHNldG9wdHMgPSBjb21tb24uc2V0b3B0c1xudmFyIG93blByb3AgPSBjb21tb24ub3duUHJvcFxudmFyIGluZmxpZ2h0ID0gcmVxdWlyZSgnaW5mbGlnaHQnKVxudmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsJylcbnZhciBjaGlsZHJlbklnbm9yZWQgPSBjb21tb24uY2hpbGRyZW5JZ25vcmVkXG52YXIgaXNJZ25vcmVkID0gY29tbW9uLmlzSWdub3JlZFxuXG52YXIgb25jZSA9IHJlcXVpcmUoJ29uY2UnKVxuXG5mdW5jdGlvbiBnbG9iIChwYXR0ZXJuLCBvcHRpb25zLCBjYikge1xuICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdmdW5jdGlvbicpIGNiID0gb3B0aW9ucywgb3B0aW9ucyA9IHt9XG4gIGlmICghb3B0aW9ucykgb3B0aW9ucyA9IHt9XG5cbiAgaWYgKG9wdGlvbnMuc3luYykge1xuICAgIGlmIChjYilcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2NhbGxiYWNrIHByb3ZpZGVkIHRvIHN5bmMgZ2xvYicpXG4gICAgcmV0dXJuIGdsb2JTeW5jKHBhdHRlcm4sIG9wdGlvbnMpXG4gIH1cblxuICByZXR1cm4gbmV3IEdsb2IocGF0dGVybiwgb3B0aW9ucywgY2IpXG59XG5cbmdsb2Iuc3luYyA9IGdsb2JTeW5jXG52YXIgR2xvYlN5bmMgPSBnbG9iLkdsb2JTeW5jID0gZ2xvYlN5bmMuR2xvYlN5bmNcblxuLy8gb2xkIGFwaSBzdXJmYWNlXG5nbG9iLmdsb2IgPSBnbG9iXG5cbmZ1bmN0aW9uIGV4dGVuZCAob3JpZ2luLCBhZGQpIHtcbiAgaWYgKGFkZCA9PT0gbnVsbCB8fCB0eXBlb2YgYWRkICE9PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBvcmlnaW5cbiAgfVxuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMoYWRkKVxuICB2YXIgaSA9IGtleXMubGVuZ3RoXG4gIHdoaWxlIChpLS0pIHtcbiAgICBvcmlnaW5ba2V5c1tpXV0gPSBhZGRba2V5c1tpXV1cbiAgfVxuICByZXR1cm4gb3JpZ2luXG59XG5cbmdsb2IuaGFzTWFnaWMgPSBmdW5jdGlvbiAocGF0dGVybiwgb3B0aW9uc18pIHtcbiAgdmFyIG9wdGlvbnMgPSBleHRlbmQoe30sIG9wdGlvbnNfKVxuICBvcHRpb25zLm5vcHJvY2VzcyA9IHRydWVcblxuICB2YXIgZyA9IG5ldyBHbG9iKHBhdHRlcm4sIG9wdGlvbnMpXG4gIHZhciBzZXQgPSBnLm1pbmltYXRjaC5zZXRcblxuICBpZiAoIXBhdHRlcm4pXG4gICAgcmV0dXJuIGZhbHNlXG5cbiAgaWYgKHNldC5sZW5ndGggPiAxKVxuICAgIHJldHVybiB0cnVlXG5cbiAgZm9yICh2YXIgaiA9IDA7IGogPCBzZXRbMF0ubGVuZ3RoOyBqKyspIHtcbiAgICBpZiAodHlwZW9mIHNldFswXVtqXSAhPT0gJ3N0cmluZycpXG4gICAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlXG59XG5cbmdsb2IuR2xvYiA9IEdsb2JcbmluaGVyaXRzKEdsb2IsIEVFKVxuZnVuY3Rpb24gR2xvYiAocGF0dGVybiwgb3B0aW9ucywgY2IpIHtcbiAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY2IgPSBvcHRpb25zXG4gICAgb3B0aW9ucyA9IG51bGxcbiAgfVxuXG4gIGlmIChvcHRpb25zICYmIG9wdGlvbnMuc3luYykge1xuICAgIGlmIChjYilcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2NhbGxiYWNrIHByb3ZpZGVkIHRvIHN5bmMgZ2xvYicpXG4gICAgcmV0dXJuIG5ldyBHbG9iU3luYyhwYXR0ZXJuLCBvcHRpb25zKVxuICB9XG5cbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEdsb2IpKVxuICAgIHJldHVybiBuZXcgR2xvYihwYXR0ZXJuLCBvcHRpb25zLCBjYilcblxuICBzZXRvcHRzKHRoaXMsIHBhdHRlcm4sIG9wdGlvbnMpXG4gIHRoaXMuX2RpZFJlYWxQYXRoID0gZmFsc2VcblxuICAvLyBwcm9jZXNzIGVhY2ggcGF0dGVybiBpbiB0aGUgbWluaW1hdGNoIHNldFxuICB2YXIgbiA9IHRoaXMubWluaW1hdGNoLnNldC5sZW5ndGhcblxuICAvLyBUaGUgbWF0Y2hlcyBhcmUgc3RvcmVkIGFzIHs8ZmlsZW5hbWU+OiB0cnVlLC4uLn0gc28gdGhhdFxuICAvLyBkdXBsaWNhdGVzIGFyZSBhdXRvbWFnaWNhbGx5IHBydW5lZC5cbiAgLy8gTGF0ZXIsIHdlIGRvIGFuIE9iamVjdC5rZXlzKCkgb24gdGhlc2UuXG4gIC8vIEtlZXAgdGhlbSBhcyBhIGxpc3Qgc28gd2UgY2FuIGZpbGwgaW4gd2hlbiBub251bGwgaXMgc2V0LlxuICB0aGlzLm1hdGNoZXMgPSBuZXcgQXJyYXkobilcblxuICBpZiAodHlwZW9mIGNiID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY2IgPSBvbmNlKGNiKVxuICAgIHRoaXMub24oJ2Vycm9yJywgY2IpXG4gICAgdGhpcy5vbignZW5kJywgZnVuY3Rpb24gKG1hdGNoZXMpIHtcbiAgICAgIGNiKG51bGwsIG1hdGNoZXMpXG4gICAgfSlcbiAgfVxuXG4gIHZhciBzZWxmID0gdGhpc1xuICB2YXIgbiA9IHRoaXMubWluaW1hdGNoLnNldC5sZW5ndGhcbiAgdGhpcy5fcHJvY2Vzc2luZyA9IDBcbiAgdGhpcy5tYXRjaGVzID0gbmV3IEFycmF5KG4pXG5cbiAgdGhpcy5fZW1pdFF1ZXVlID0gW11cbiAgdGhpcy5fcHJvY2Vzc1F1ZXVlID0gW11cbiAgdGhpcy5wYXVzZWQgPSBmYWxzZVxuXG4gIGlmICh0aGlzLm5vcHJvY2VzcylcbiAgICByZXR1cm4gdGhpc1xuXG4gIGlmIChuID09PSAwKVxuICAgIHJldHVybiBkb25lKClcblxuICB2YXIgc3luYyA9IHRydWVcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBuOyBpICsrKSB7XG4gICAgdGhpcy5fcHJvY2Vzcyh0aGlzLm1pbmltYXRjaC5zZXRbaV0sIGksIGZhbHNlLCBkb25lKVxuICB9XG4gIHN5bmMgPSBmYWxzZVxuXG4gIGZ1bmN0aW9uIGRvbmUgKCkge1xuICAgIC0tc2VsZi5fcHJvY2Vzc2luZ1xuICAgIGlmIChzZWxmLl9wcm9jZXNzaW5nIDw9IDApIHtcbiAgICAgIGlmIChzeW5jKSB7XG4gICAgICAgIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHNlbGYuX2ZpbmlzaCgpXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWxmLl9maW5pc2goKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5HbG9iLnByb3RvdHlwZS5fZmluaXNoID0gZnVuY3Rpb24gKCkge1xuICBhc3NlcnQodGhpcyBpbnN0YW5jZW9mIEdsb2IpXG4gIGlmICh0aGlzLmFib3J0ZWQpXG4gICAgcmV0dXJuXG5cbiAgaWYgKHRoaXMucmVhbHBhdGggJiYgIXRoaXMuX2RpZFJlYWxwYXRoKVxuICAgIHJldHVybiB0aGlzLl9yZWFscGF0aCgpXG5cbiAgY29tbW9uLmZpbmlzaCh0aGlzKVxuICB0aGlzLmVtaXQoJ2VuZCcsIHRoaXMuZm91bmQpXG59XG5cbkdsb2IucHJvdG90eXBlLl9yZWFscGF0aCA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHRoaXMuX2RpZFJlYWxwYXRoKVxuICAgIHJldHVyblxuXG4gIHRoaXMuX2RpZFJlYWxwYXRoID0gdHJ1ZVxuXG4gIHZhciBuID0gdGhpcy5tYXRjaGVzLmxlbmd0aFxuICBpZiAobiA9PT0gMClcbiAgICByZXR1cm4gdGhpcy5fZmluaXNoKClcblxuICB2YXIgc2VsZiA9IHRoaXNcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm1hdGNoZXMubGVuZ3RoOyBpKyspXG4gICAgdGhpcy5fcmVhbHBhdGhTZXQoaSwgbmV4dClcblxuICBmdW5jdGlvbiBuZXh0ICgpIHtcbiAgICBpZiAoLS1uID09PSAwKVxuICAgICAgc2VsZi5fZmluaXNoKClcbiAgfVxufVxuXG5HbG9iLnByb3RvdHlwZS5fcmVhbHBhdGhTZXQgPSBmdW5jdGlvbiAoaW5kZXgsIGNiKSB7XG4gIHZhciBtYXRjaHNldCA9IHRoaXMubWF0Y2hlc1tpbmRleF1cbiAgaWYgKCFtYXRjaHNldClcbiAgICByZXR1cm4gY2IoKVxuXG4gIHZhciBmb3VuZCA9IE9iamVjdC5rZXlzKG1hdGNoc2V0KVxuICB2YXIgc2VsZiA9IHRoaXNcbiAgdmFyIG4gPSBmb3VuZC5sZW5ndGhcblxuICBpZiAobiA9PT0gMClcbiAgICByZXR1cm4gY2IoKVxuXG4gIHZhciBzZXQgPSB0aGlzLm1hdGNoZXNbaW5kZXhdID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuICBmb3VuZC5mb3JFYWNoKGZ1bmN0aW9uIChwLCBpKSB7XG4gICAgLy8gSWYgdGhlcmUncyBhIHByb2JsZW0gd2l0aCB0aGUgc3RhdCwgdGhlbiBpdCBtZWFucyB0aGF0XG4gICAgLy8gb25lIG9yIG1vcmUgb2YgdGhlIGxpbmtzIGluIHRoZSByZWFscGF0aCBjb3VsZG4ndCBiZVxuICAgIC8vIHJlc29sdmVkLiAganVzdCByZXR1cm4gdGhlIGFicyB2YWx1ZSBpbiB0aGF0IGNhc2UuXG4gICAgcCA9IHNlbGYuX21ha2VBYnMocClcbiAgICBycC5yZWFscGF0aChwLCBzZWxmLnJlYWxwYXRoQ2FjaGUsIGZ1bmN0aW9uIChlciwgcmVhbCkge1xuICAgICAgaWYgKCFlcilcbiAgICAgICAgc2V0W3JlYWxdID0gdHJ1ZVxuICAgICAgZWxzZSBpZiAoZXIuc3lzY2FsbCA9PT0gJ3N0YXQnKVxuICAgICAgICBzZXRbcF0gPSB0cnVlXG4gICAgICBlbHNlXG4gICAgICAgIHNlbGYuZW1pdCgnZXJyb3InLCBlcikgLy8gc3JzbHkgd3RmIHJpZ2h0IGhlcmVcblxuICAgICAgaWYgKC0tbiA9PT0gMCkge1xuICAgICAgICBzZWxmLm1hdGNoZXNbaW5kZXhdID0gc2V0XG4gICAgICAgIGNiKClcbiAgICAgIH1cbiAgICB9KVxuICB9KVxufVxuXG5HbG9iLnByb3RvdHlwZS5fbWFyayA9IGZ1bmN0aW9uIChwKSB7XG4gIHJldHVybiBjb21tb24ubWFyayh0aGlzLCBwKVxufVxuXG5HbG9iLnByb3RvdHlwZS5fbWFrZUFicyA9IGZ1bmN0aW9uIChmKSB7XG4gIHJldHVybiBjb21tb24ubWFrZUFicyh0aGlzLCBmKVxufVxuXG5HbG9iLnByb3RvdHlwZS5hYm9ydCA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5hYm9ydGVkID0gdHJ1ZVxuICB0aGlzLmVtaXQoJ2Fib3J0Jylcbn1cblxuR2xvYi5wcm90b3R5cGUucGF1c2UgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICghdGhpcy5wYXVzZWQpIHtcbiAgICB0aGlzLnBhdXNlZCA9IHRydWVcbiAgICB0aGlzLmVtaXQoJ3BhdXNlJylcbiAgfVxufVxuXG5HbG9iLnByb3RvdHlwZS5yZXN1bWUgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0aGlzLnBhdXNlZCkge1xuICAgIHRoaXMuZW1pdCgncmVzdW1lJylcbiAgICB0aGlzLnBhdXNlZCA9IGZhbHNlXG4gICAgaWYgKHRoaXMuX2VtaXRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgIHZhciBlcSA9IHRoaXMuX2VtaXRRdWV1ZS5zbGljZSgwKVxuICAgICAgdGhpcy5fZW1pdFF1ZXVlLmxlbmd0aCA9IDBcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXEubGVuZ3RoOyBpICsrKSB7XG4gICAgICAgIHZhciBlID0gZXFbaV1cbiAgICAgICAgdGhpcy5fZW1pdE1hdGNoKGVbMF0sIGVbMV0pXG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLl9wcm9jZXNzUXVldWUubGVuZ3RoKSB7XG4gICAgICB2YXIgcHEgPSB0aGlzLl9wcm9jZXNzUXVldWUuc2xpY2UoMClcbiAgICAgIHRoaXMuX3Byb2Nlc3NRdWV1ZS5sZW5ndGggPSAwXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBxLmxlbmd0aDsgaSArKykge1xuICAgICAgICB2YXIgcCA9IHBxW2ldXG4gICAgICAgIHRoaXMuX3Byb2Nlc3NpbmctLVxuICAgICAgICB0aGlzLl9wcm9jZXNzKHBbMF0sIHBbMV0sIHBbMl0sIHBbM10pXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbkdsb2IucHJvdG90eXBlLl9wcm9jZXNzID0gZnVuY3Rpb24gKHBhdHRlcm4sIGluZGV4LCBpbkdsb2JTdGFyLCBjYikge1xuICBhc3NlcnQodGhpcyBpbnN0YW5jZW9mIEdsb2IpXG4gIGFzc2VydCh0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpXG5cbiAgaWYgKHRoaXMuYWJvcnRlZClcbiAgICByZXR1cm5cblxuICB0aGlzLl9wcm9jZXNzaW5nKytcbiAgaWYgKHRoaXMucGF1c2VkKSB7XG4gICAgdGhpcy5fcHJvY2Vzc1F1ZXVlLnB1c2goW3BhdHRlcm4sIGluZGV4LCBpbkdsb2JTdGFyLCBjYl0pXG4gICAgcmV0dXJuXG4gIH1cblxuICAvL2NvbnNvbGUuZXJyb3IoJ1BST0NFU1MgJWQnLCB0aGlzLl9wcm9jZXNzaW5nLCBwYXR0ZXJuKVxuXG4gIC8vIEdldCB0aGUgZmlyc3QgW25dIHBhcnRzIG9mIHBhdHRlcm4gdGhhdCBhcmUgYWxsIHN0cmluZ3MuXG4gIHZhciBuID0gMFxuICB3aGlsZSAodHlwZW9mIHBhdHRlcm5bbl0gPT09ICdzdHJpbmcnKSB7XG4gICAgbiArK1xuICB9XG4gIC8vIG5vdyBuIGlzIHRoZSBpbmRleCBvZiB0aGUgZmlyc3Qgb25lIHRoYXQgaXMgKm5vdCogYSBzdHJpbmcuXG5cbiAgLy8gc2VlIGlmIHRoZXJlJ3MgYW55dGhpbmcgZWxzZVxuICB2YXIgcHJlZml4XG4gIHN3aXRjaCAobikge1xuICAgIC8vIGlmIG5vdCwgdGhlbiB0aGlzIGlzIHJhdGhlciBzaW1wbGVcbiAgICBjYXNlIHBhdHRlcm4ubGVuZ3RoOlxuICAgICAgdGhpcy5fcHJvY2Vzc1NpbXBsZShwYXR0ZXJuLmpvaW4oJy8nKSwgaW5kZXgsIGNiKVxuICAgICAgcmV0dXJuXG5cbiAgICBjYXNlIDA6XG4gICAgICAvLyBwYXR0ZXJuICpzdGFydHMqIHdpdGggc29tZSBub24tdHJpdmlhbCBpdGVtLlxuICAgICAgLy8gZ29pbmcgdG8gcmVhZGRpcihjd2QpLCBidXQgbm90IGluY2x1ZGUgdGhlIHByZWZpeCBpbiBtYXRjaGVzLlxuICAgICAgcHJlZml4ID0gbnVsbFxuICAgICAgYnJlYWtcblxuICAgIGRlZmF1bHQ6XG4gICAgICAvLyBwYXR0ZXJuIGhhcyBzb21lIHN0cmluZyBiaXRzIGluIHRoZSBmcm9udC5cbiAgICAgIC8vIHdoYXRldmVyIGl0IHN0YXJ0cyB3aXRoLCB3aGV0aGVyIHRoYXQncyAnYWJzb2x1dGUnIGxpa2UgL2Zvby9iYXIsXG4gICAgICAvLyBvciAncmVsYXRpdmUnIGxpa2UgJy4uL2JheidcbiAgICAgIHByZWZpeCA9IHBhdHRlcm4uc2xpY2UoMCwgbikuam9pbignLycpXG4gICAgICBicmVha1xuICB9XG5cbiAgdmFyIHJlbWFpbiA9IHBhdHRlcm4uc2xpY2UobilcblxuICAvLyBnZXQgdGhlIGxpc3Qgb2YgZW50cmllcy5cbiAgdmFyIHJlYWRcbiAgaWYgKHByZWZpeCA9PT0gbnVsbClcbiAgICByZWFkID0gJy4nXG4gIGVsc2UgaWYgKGlzQWJzb2x1dGUocHJlZml4KSB8fCBpc0Fic29sdXRlKHBhdHRlcm4uam9pbignLycpKSkge1xuICAgIGlmICghcHJlZml4IHx8ICFpc0Fic29sdXRlKHByZWZpeCkpXG4gICAgICBwcmVmaXggPSAnLycgKyBwcmVmaXhcbiAgICByZWFkID0gcHJlZml4XG4gIH0gZWxzZVxuICAgIHJlYWQgPSBwcmVmaXhcblxuICB2YXIgYWJzID0gdGhpcy5fbWFrZUFicyhyZWFkKVxuXG4gIC8vaWYgaWdub3JlZCwgc2tpcCBfcHJvY2Vzc2luZ1xuICBpZiAoY2hpbGRyZW5JZ25vcmVkKHRoaXMsIHJlYWQpKVxuICAgIHJldHVybiBjYigpXG5cbiAgdmFyIGlzR2xvYlN0YXIgPSByZW1haW5bMF0gPT09IG1pbmltYXRjaC5HTE9CU1RBUlxuICBpZiAoaXNHbG9iU3RhcilcbiAgICB0aGlzLl9wcm9jZXNzR2xvYlN0YXIocHJlZml4LCByZWFkLCBhYnMsIHJlbWFpbiwgaW5kZXgsIGluR2xvYlN0YXIsIGNiKVxuICBlbHNlXG4gICAgdGhpcy5fcHJvY2Vzc1JlYWRkaXIocHJlZml4LCByZWFkLCBhYnMsIHJlbWFpbiwgaW5kZXgsIGluR2xvYlN0YXIsIGNiKVxufVxuXG5HbG9iLnByb3RvdHlwZS5fcHJvY2Vzc1JlYWRkaXIgPSBmdW5jdGlvbiAocHJlZml4LCByZWFkLCBhYnMsIHJlbWFpbiwgaW5kZXgsIGluR2xvYlN0YXIsIGNiKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuICB0aGlzLl9yZWFkZGlyKGFicywgaW5HbG9iU3RhciwgZnVuY3Rpb24gKGVyLCBlbnRyaWVzKSB7XG4gICAgcmV0dXJuIHNlbGYuX3Byb2Nlc3NSZWFkZGlyMihwcmVmaXgsIHJlYWQsIGFicywgcmVtYWluLCBpbmRleCwgaW5HbG9iU3RhciwgZW50cmllcywgY2IpXG4gIH0pXG59XG5cbkdsb2IucHJvdG90eXBlLl9wcm9jZXNzUmVhZGRpcjIgPSBmdW5jdGlvbiAocHJlZml4LCByZWFkLCBhYnMsIHJlbWFpbiwgaW5kZXgsIGluR2xvYlN0YXIsIGVudHJpZXMsIGNiKSB7XG5cbiAgLy8gaWYgdGhlIGFicyBpc24ndCBhIGRpciwgdGhlbiBub3RoaW5nIGNhbiBtYXRjaCFcbiAgaWYgKCFlbnRyaWVzKVxuICAgIHJldHVybiBjYigpXG5cbiAgLy8gSXQgd2lsbCBvbmx5IG1hdGNoIGRvdCBlbnRyaWVzIGlmIGl0IHN0YXJ0cyB3aXRoIGEgZG90LCBvciBpZlxuICAvLyBkb3QgaXMgc2V0LiAgU3R1ZmYgbGlrZSBAKC5mb298LmJhcikgaXNuJ3QgYWxsb3dlZC5cbiAgdmFyIHBuID0gcmVtYWluWzBdXG4gIHZhciBuZWdhdGUgPSAhIXRoaXMubWluaW1hdGNoLm5lZ2F0ZVxuICB2YXIgcmF3R2xvYiA9IHBuLl9nbG9iXG4gIHZhciBkb3RPayA9IHRoaXMuZG90IHx8IHJhd0dsb2IuY2hhckF0KDApID09PSAnLidcblxuICB2YXIgbWF0Y2hlZEVudHJpZXMgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGVudHJpZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgZSA9IGVudHJpZXNbaV1cbiAgICBpZiAoZS5jaGFyQXQoMCkgIT09ICcuJyB8fCBkb3RPaykge1xuICAgICAgdmFyIG1cbiAgICAgIGlmIChuZWdhdGUgJiYgIXByZWZpeCkge1xuICAgICAgICBtID0gIWUubWF0Y2gocG4pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtID0gZS5tYXRjaChwbilcbiAgICAgIH1cbiAgICAgIGlmIChtKVxuICAgICAgICBtYXRjaGVkRW50cmllcy5wdXNoKGUpXG4gICAgfVxuICB9XG5cbiAgLy9jb25zb2xlLmVycm9yKCdwcmQyJywgcHJlZml4LCBlbnRyaWVzLCByZW1haW5bMF0uX2dsb2IsIG1hdGNoZWRFbnRyaWVzKVxuXG4gIHZhciBsZW4gPSBtYXRjaGVkRW50cmllcy5sZW5ndGhcbiAgLy8gSWYgdGhlcmUgYXJlIG5vIG1hdGNoZWQgZW50cmllcywgdGhlbiBub3RoaW5nIG1hdGNoZXMuXG4gIGlmIChsZW4gPT09IDApXG4gICAgcmV0dXJuIGNiKClcblxuICAvLyBpZiB0aGlzIGlzIHRoZSBsYXN0IHJlbWFpbmluZyBwYXR0ZXJuIGJpdCwgdGhlbiBubyBuZWVkIGZvclxuICAvLyBhbiBhZGRpdGlvbmFsIHN0YXQgKnVubGVzcyogdGhlIHVzZXIgaGFzIHNwZWNpZmllZCBtYXJrIG9yXG4gIC8vIHN0YXQgZXhwbGljaXRseS4gIFdlIGtub3cgdGhleSBleGlzdCwgc2luY2UgcmVhZGRpciByZXR1cm5lZFxuICAvLyB0aGVtLlxuXG4gIGlmIChyZW1haW4ubGVuZ3RoID09PSAxICYmICF0aGlzLm1hcmsgJiYgIXRoaXMuc3RhdCkge1xuICAgIGlmICghdGhpcy5tYXRjaGVzW2luZGV4XSlcbiAgICAgIHRoaXMubWF0Y2hlc1tpbmRleF0gPSBPYmplY3QuY3JlYXRlKG51bGwpXG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArKykge1xuICAgICAgdmFyIGUgPSBtYXRjaGVkRW50cmllc1tpXVxuICAgICAgaWYgKHByZWZpeCkge1xuICAgICAgICBpZiAocHJlZml4ICE9PSAnLycpXG4gICAgICAgICAgZSA9IHByZWZpeCArICcvJyArIGVcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGUgPSBwcmVmaXggKyBlXG4gICAgICB9XG5cbiAgICAgIGlmIChlLmNoYXJBdCgwKSA9PT0gJy8nICYmICF0aGlzLm5vbW91bnQpIHtcbiAgICAgICAgZSA9IHBhdGguam9pbih0aGlzLnJvb3QsIGUpXG4gICAgICB9XG4gICAgICB0aGlzLl9lbWl0TWF0Y2goaW5kZXgsIGUpXG4gICAgfVxuICAgIC8vIFRoaXMgd2FzIHRoZSBsYXN0IG9uZSwgYW5kIG5vIHN0YXRzIHdlcmUgbmVlZGVkXG4gICAgcmV0dXJuIGNiKClcbiAgfVxuXG4gIC8vIG5vdyB0ZXN0IGFsbCBtYXRjaGVkIGVudHJpZXMgYXMgc3RhbmQtaW5zIGZvciB0aGF0IHBhcnRcbiAgLy8gb2YgdGhlIHBhdHRlcm4uXG4gIHJlbWFpbi5zaGlmdCgpXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpICsrKSB7XG4gICAgdmFyIGUgPSBtYXRjaGVkRW50cmllc1tpXVxuICAgIHZhciBuZXdQYXR0ZXJuXG4gICAgaWYgKHByZWZpeCkge1xuICAgICAgaWYgKHByZWZpeCAhPT0gJy8nKVxuICAgICAgICBlID0gcHJlZml4ICsgJy8nICsgZVxuICAgICAgZWxzZVxuICAgICAgICBlID0gcHJlZml4ICsgZVxuICAgIH1cbiAgICB0aGlzLl9wcm9jZXNzKFtlXS5jb25jYXQocmVtYWluKSwgaW5kZXgsIGluR2xvYlN0YXIsIGNiKVxuICB9XG4gIGNiKClcbn1cblxuR2xvYi5wcm90b3R5cGUuX2VtaXRNYXRjaCA9IGZ1bmN0aW9uIChpbmRleCwgZSkge1xuICBpZiAodGhpcy5hYm9ydGVkKVxuICAgIHJldHVyblxuXG4gIGlmIChpc0lnbm9yZWQodGhpcywgZSkpXG4gICAgcmV0dXJuXG5cbiAgaWYgKHRoaXMucGF1c2VkKSB7XG4gICAgdGhpcy5fZW1pdFF1ZXVlLnB1c2goW2luZGV4LCBlXSlcbiAgICByZXR1cm5cbiAgfVxuXG4gIHZhciBhYnMgPSBpc0Fic29sdXRlKGUpID8gZSA6IHRoaXMuX21ha2VBYnMoZSlcblxuICBpZiAodGhpcy5tYXJrKVxuICAgIGUgPSB0aGlzLl9tYXJrKGUpXG5cbiAgaWYgKHRoaXMuYWJzb2x1dGUpXG4gICAgZSA9IGFic1xuXG4gIGlmICh0aGlzLm1hdGNoZXNbaW5kZXhdW2VdKVxuICAgIHJldHVyblxuXG4gIGlmICh0aGlzLm5vZGlyKSB7XG4gICAgdmFyIGMgPSB0aGlzLmNhY2hlW2Fic11cbiAgICBpZiAoYyA9PT0gJ0RJUicgfHwgQXJyYXkuaXNBcnJheShjKSlcbiAgICAgIHJldHVyblxuICB9XG5cbiAgdGhpcy5tYXRjaGVzW2luZGV4XVtlXSA9IHRydWVcblxuICB2YXIgc3QgPSB0aGlzLnN0YXRDYWNoZVthYnNdXG4gIGlmIChzdClcbiAgICB0aGlzLmVtaXQoJ3N0YXQnLCBlLCBzdClcblxuICB0aGlzLmVtaXQoJ21hdGNoJywgZSlcbn1cblxuR2xvYi5wcm90b3R5cGUuX3JlYWRkaXJJbkdsb2JTdGFyID0gZnVuY3Rpb24gKGFicywgY2IpIHtcbiAgaWYgKHRoaXMuYWJvcnRlZClcbiAgICByZXR1cm5cblxuICAvLyBmb2xsb3cgYWxsIHN5bWxpbmtlZCBkaXJlY3RvcmllcyBmb3JldmVyXG4gIC8vIGp1c3QgcHJvY2VlZCBhcyBpZiB0aGlzIGlzIGEgbm9uLWdsb2JzdGFyIHNpdHVhdGlvblxuICBpZiAodGhpcy5mb2xsb3cpXG4gICAgcmV0dXJuIHRoaXMuX3JlYWRkaXIoYWJzLCBmYWxzZSwgY2IpXG5cbiAgdmFyIGxzdGF0a2V5ID0gJ2xzdGF0XFwwJyArIGFic1xuICB2YXIgc2VsZiA9IHRoaXNcbiAgdmFyIGxzdGF0Y2IgPSBpbmZsaWdodChsc3RhdGtleSwgbHN0YXRjYl8pXG5cbiAgaWYgKGxzdGF0Y2IpXG4gICAgZnMubHN0YXQoYWJzLCBsc3RhdGNiKVxuXG4gIGZ1bmN0aW9uIGxzdGF0Y2JfIChlciwgbHN0YXQpIHtcbiAgICBpZiAoZXIgJiYgZXIuY29kZSA9PT0gJ0VOT0VOVCcpXG4gICAgICByZXR1cm4gY2IoKVxuXG4gICAgdmFyIGlzU3ltID0gbHN0YXQgJiYgbHN0YXQuaXNTeW1ib2xpY0xpbmsoKVxuICAgIHNlbGYuc3ltbGlua3NbYWJzXSA9IGlzU3ltXG5cbiAgICAvLyBJZiBpdCdzIG5vdCBhIHN5bWxpbmsgb3IgYSBkaXIsIHRoZW4gaXQncyBkZWZpbml0ZWx5IGEgcmVndWxhciBmaWxlLlxuICAgIC8vIGRvbid0IGJvdGhlciBkb2luZyBhIHJlYWRkaXIgaW4gdGhhdCBjYXNlLlxuICAgIGlmICghaXNTeW0gJiYgbHN0YXQgJiYgIWxzdGF0LmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgIHNlbGYuY2FjaGVbYWJzXSA9ICdGSUxFJ1xuICAgICAgY2IoKVxuICAgIH0gZWxzZVxuICAgICAgc2VsZi5fcmVhZGRpcihhYnMsIGZhbHNlLCBjYilcbiAgfVxufVxuXG5HbG9iLnByb3RvdHlwZS5fcmVhZGRpciA9IGZ1bmN0aW9uIChhYnMsIGluR2xvYlN0YXIsIGNiKSB7XG4gIGlmICh0aGlzLmFib3J0ZWQpXG4gICAgcmV0dXJuXG5cbiAgY2IgPSBpbmZsaWdodCgncmVhZGRpclxcMCcrYWJzKydcXDAnK2luR2xvYlN0YXIsIGNiKVxuICBpZiAoIWNiKVxuICAgIHJldHVyblxuXG4gIC8vY29uc29sZS5lcnJvcignUkQgJWogJWonLCAraW5HbG9iU3RhciwgYWJzKVxuICBpZiAoaW5HbG9iU3RhciAmJiAhb3duUHJvcCh0aGlzLnN5bWxpbmtzLCBhYnMpKVxuICAgIHJldHVybiB0aGlzLl9yZWFkZGlySW5HbG9iU3RhcihhYnMsIGNiKVxuXG4gIGlmIChvd25Qcm9wKHRoaXMuY2FjaGUsIGFicykpIHtcbiAgICB2YXIgYyA9IHRoaXMuY2FjaGVbYWJzXVxuICAgIGlmICghYyB8fCBjID09PSAnRklMRScpXG4gICAgICByZXR1cm4gY2IoKVxuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoYykpXG4gICAgICByZXR1cm4gY2IobnVsbCwgYylcbiAgfVxuXG4gIHZhciBzZWxmID0gdGhpc1xuICBmcy5yZWFkZGlyKGFicywgcmVhZGRpckNiKHRoaXMsIGFicywgY2IpKVxufVxuXG5mdW5jdGlvbiByZWFkZGlyQ2IgKHNlbGYsIGFicywgY2IpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChlciwgZW50cmllcykge1xuICAgIGlmIChlcilcbiAgICAgIHNlbGYuX3JlYWRkaXJFcnJvcihhYnMsIGVyLCBjYilcbiAgICBlbHNlXG4gICAgICBzZWxmLl9yZWFkZGlyRW50cmllcyhhYnMsIGVudHJpZXMsIGNiKVxuICB9XG59XG5cbkdsb2IucHJvdG90eXBlLl9yZWFkZGlyRW50cmllcyA9IGZ1bmN0aW9uIChhYnMsIGVudHJpZXMsIGNiKSB7XG4gIGlmICh0aGlzLmFib3J0ZWQpXG4gICAgcmV0dXJuXG5cbiAgLy8gaWYgd2UgaGF2ZW4ndCBhc2tlZCB0byBzdGF0IGV2ZXJ5dGhpbmcsIHRoZW4ganVzdFxuICAvLyBhc3N1bWUgdGhhdCBldmVyeXRoaW5nIGluIHRoZXJlIGV4aXN0cywgc28gd2UgY2FuIGF2b2lkXG4gIC8vIGhhdmluZyB0byBzdGF0IGl0IGEgc2Vjb25kIHRpbWUuXG4gIGlmICghdGhpcy5tYXJrICYmICF0aGlzLnN0YXQpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVudHJpZXMubGVuZ3RoOyBpICsrKSB7XG4gICAgICB2YXIgZSA9IGVudHJpZXNbaV1cbiAgICAgIGlmIChhYnMgPT09ICcvJylcbiAgICAgICAgZSA9IGFicyArIGVcbiAgICAgIGVsc2VcbiAgICAgICAgZSA9IGFicyArICcvJyArIGVcbiAgICAgIHRoaXMuY2FjaGVbZV0gPSB0cnVlXG4gICAgfVxuICB9XG5cbiAgdGhpcy5jYWNoZVthYnNdID0gZW50cmllc1xuICByZXR1cm4gY2IobnVsbCwgZW50cmllcylcbn1cblxuR2xvYi5wcm90b3R5cGUuX3JlYWRkaXJFcnJvciA9IGZ1bmN0aW9uIChmLCBlciwgY2IpIHtcbiAgaWYgKHRoaXMuYWJvcnRlZClcbiAgICByZXR1cm5cblxuICAvLyBoYW5kbGUgZXJyb3JzLCBhbmQgY2FjaGUgdGhlIGluZm9ybWF0aW9uXG4gIHN3aXRjaCAoZXIuY29kZSkge1xuICAgIGNhc2UgJ0VOT1RTVVAnOiAvLyBodHRwczovL2dpdGh1Yi5jb20vaXNhYWNzL25vZGUtZ2xvYi9pc3N1ZXMvMjA1XG4gICAgY2FzZSAnRU5PVERJUic6IC8vIHRvdGFsbHkgbm9ybWFsLiBtZWFucyBpdCAqZG9lcyogZXhpc3QuXG4gICAgICB2YXIgYWJzID0gdGhpcy5fbWFrZUFicyhmKVxuICAgICAgdGhpcy5jYWNoZVthYnNdID0gJ0ZJTEUnXG4gICAgICBpZiAoYWJzID09PSB0aGlzLmN3ZEFicykge1xuICAgICAgICB2YXIgZXJyb3IgPSBuZXcgRXJyb3IoZXIuY29kZSArICcgaW52YWxpZCBjd2QgJyArIHRoaXMuY3dkKVxuICAgICAgICBlcnJvci5wYXRoID0gdGhpcy5jd2RcbiAgICAgICAgZXJyb3IuY29kZSA9IGVyLmNvZGVcbiAgICAgICAgdGhpcy5lbWl0KCdlcnJvcicsIGVycm9yKVxuICAgICAgICB0aGlzLmFib3J0KClcbiAgICAgIH1cbiAgICAgIGJyZWFrXG5cbiAgICBjYXNlICdFTk9FTlQnOiAvLyBub3QgdGVycmlibHkgdW51c3VhbFxuICAgIGNhc2UgJ0VMT09QJzpcbiAgICBjYXNlICdFTkFNRVRPT0xPTkcnOlxuICAgIGNhc2UgJ1VOS05PV04nOlxuICAgICAgdGhpcy5jYWNoZVt0aGlzLl9tYWtlQWJzKGYpXSA9IGZhbHNlXG4gICAgICBicmVha1xuXG4gICAgZGVmYXVsdDogLy8gc29tZSB1bnVzdWFsIGVycm9yLiAgVHJlYXQgYXMgZmFpbHVyZS5cbiAgICAgIHRoaXMuY2FjaGVbdGhpcy5fbWFrZUFicyhmKV0gPSBmYWxzZVxuICAgICAgaWYgKHRoaXMuc3RyaWN0KSB7XG4gICAgICAgIHRoaXMuZW1pdCgnZXJyb3InLCBlcilcbiAgICAgICAgLy8gSWYgdGhlIGVycm9yIGlzIGhhbmRsZWQsIHRoZW4gd2UgYWJvcnRcbiAgICAgICAgLy8gaWYgbm90LCB3ZSB0aHJldyBvdXQgb2YgaGVyZVxuICAgICAgICB0aGlzLmFib3J0KClcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5zaWxlbnQpXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ2dsb2IgZXJyb3InLCBlcilcbiAgICAgIGJyZWFrXG4gIH1cblxuICByZXR1cm4gY2IoKVxufVxuXG5HbG9iLnByb3RvdHlwZS5fcHJvY2Vzc0dsb2JTdGFyID0gZnVuY3Rpb24gKHByZWZpeCwgcmVhZCwgYWJzLCByZW1haW4sIGluZGV4LCBpbkdsb2JTdGFyLCBjYikge1xuICB2YXIgc2VsZiA9IHRoaXNcbiAgdGhpcy5fcmVhZGRpcihhYnMsIGluR2xvYlN0YXIsIGZ1bmN0aW9uIChlciwgZW50cmllcykge1xuICAgIHNlbGYuX3Byb2Nlc3NHbG9iU3RhcjIocHJlZml4LCByZWFkLCBhYnMsIHJlbWFpbiwgaW5kZXgsIGluR2xvYlN0YXIsIGVudHJpZXMsIGNiKVxuICB9KVxufVxuXG5cbkdsb2IucHJvdG90eXBlLl9wcm9jZXNzR2xvYlN0YXIyID0gZnVuY3Rpb24gKHByZWZpeCwgcmVhZCwgYWJzLCByZW1haW4sIGluZGV4LCBpbkdsb2JTdGFyLCBlbnRyaWVzLCBjYikge1xuICAvL2NvbnNvbGUuZXJyb3IoJ3BnczInLCBwcmVmaXgsIHJlbWFpblswXSwgZW50cmllcylcblxuICAvLyBubyBlbnRyaWVzIG1lYW5zIG5vdCBhIGRpciwgc28gaXQgY2FuIG5ldmVyIGhhdmUgbWF0Y2hlc1xuICAvLyBmb28udHh0LyoqIGRvZXNuJ3QgbWF0Y2ggZm9vLnR4dFxuICBpZiAoIWVudHJpZXMpXG4gICAgcmV0dXJuIGNiKClcblxuICAvLyB0ZXN0IHdpdGhvdXQgdGhlIGdsb2JzdGFyLCBhbmQgd2l0aCBldmVyeSBjaGlsZCBib3RoIGJlbG93XG4gIC8vIGFuZCByZXBsYWNpbmcgdGhlIGdsb2JzdGFyLlxuICB2YXIgcmVtYWluV2l0aG91dEdsb2JTdGFyID0gcmVtYWluLnNsaWNlKDEpXG4gIHZhciBnc3ByZWYgPSBwcmVmaXggPyBbIHByZWZpeCBdIDogW11cbiAgdmFyIG5vR2xvYlN0YXIgPSBnc3ByZWYuY29uY2F0KHJlbWFpbldpdGhvdXRHbG9iU3RhcilcblxuICAvLyB0aGUgbm9HbG9iU3RhciBwYXR0ZXJuIGV4aXRzIHRoZSBpbkdsb2JTdGFyIHN0YXRlXG4gIHRoaXMuX3Byb2Nlc3Mobm9HbG9iU3RhciwgaW5kZXgsIGZhbHNlLCBjYilcblxuICB2YXIgaXNTeW0gPSB0aGlzLnN5bWxpbmtzW2Fic11cbiAgdmFyIGxlbiA9IGVudHJpZXMubGVuZ3RoXG5cbiAgLy8gSWYgaXQncyBhIHN5bWxpbmssIGFuZCB3ZSdyZSBpbiBhIGdsb2JzdGFyLCB0aGVuIHN0b3BcbiAgaWYgKGlzU3ltICYmIGluR2xvYlN0YXIpXG4gICAgcmV0dXJuIGNiKClcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgdmFyIGUgPSBlbnRyaWVzW2ldXG4gICAgaWYgKGUuY2hhckF0KDApID09PSAnLicgJiYgIXRoaXMuZG90KVxuICAgICAgY29udGludWVcblxuICAgIC8vIHRoZXNlIHR3byBjYXNlcyBlbnRlciB0aGUgaW5HbG9iU3RhciBzdGF0ZVxuICAgIHZhciBpbnN0ZWFkID0gZ3NwcmVmLmNvbmNhdChlbnRyaWVzW2ldLCByZW1haW5XaXRob3V0R2xvYlN0YXIpXG4gICAgdGhpcy5fcHJvY2VzcyhpbnN0ZWFkLCBpbmRleCwgdHJ1ZSwgY2IpXG5cbiAgICB2YXIgYmVsb3cgPSBnc3ByZWYuY29uY2F0KGVudHJpZXNbaV0sIHJlbWFpbilcbiAgICB0aGlzLl9wcm9jZXNzKGJlbG93LCBpbmRleCwgdHJ1ZSwgY2IpXG4gIH1cblxuICBjYigpXG59XG5cbkdsb2IucHJvdG90eXBlLl9wcm9jZXNzU2ltcGxlID0gZnVuY3Rpb24gKHByZWZpeCwgaW5kZXgsIGNiKSB7XG4gIC8vIFhYWCByZXZpZXcgdGhpcy4gIFNob3VsZG4ndCBpdCBiZSBkb2luZyB0aGUgbW91bnRpbmcgZXRjXG4gIC8vIGJlZm9yZSBkb2luZyBzdGF0PyAga2luZGEgd2VpcmQ/XG4gIHZhciBzZWxmID0gdGhpc1xuICB0aGlzLl9zdGF0KHByZWZpeCwgZnVuY3Rpb24gKGVyLCBleGlzdHMpIHtcbiAgICBzZWxmLl9wcm9jZXNzU2ltcGxlMihwcmVmaXgsIGluZGV4LCBlciwgZXhpc3RzLCBjYilcbiAgfSlcbn1cbkdsb2IucHJvdG90eXBlLl9wcm9jZXNzU2ltcGxlMiA9IGZ1bmN0aW9uIChwcmVmaXgsIGluZGV4LCBlciwgZXhpc3RzLCBjYikge1xuXG4gIC8vY29uc29sZS5lcnJvcigncHMyJywgcHJlZml4LCBleGlzdHMpXG5cbiAgaWYgKCF0aGlzLm1hdGNoZXNbaW5kZXhdKVxuICAgIHRoaXMubWF0Y2hlc1tpbmRleF0gPSBPYmplY3QuY3JlYXRlKG51bGwpXG5cbiAgLy8gSWYgaXQgZG9lc24ndCBleGlzdCwgdGhlbiBqdXN0IG1hcmsgdGhlIGxhY2sgb2YgcmVzdWx0c1xuICBpZiAoIWV4aXN0cylcbiAgICByZXR1cm4gY2IoKVxuXG4gIGlmIChwcmVmaXggJiYgaXNBYnNvbHV0ZShwcmVmaXgpICYmICF0aGlzLm5vbW91bnQpIHtcbiAgICB2YXIgdHJhaWwgPSAvW1xcL1xcXFxdJC8udGVzdChwcmVmaXgpXG4gICAgaWYgKHByZWZpeC5jaGFyQXQoMCkgPT09ICcvJykge1xuICAgICAgcHJlZml4ID0gcGF0aC5qb2luKHRoaXMucm9vdCwgcHJlZml4KVxuICAgIH0gZWxzZSB7XG4gICAgICBwcmVmaXggPSBwYXRoLnJlc29sdmUodGhpcy5yb290LCBwcmVmaXgpXG4gICAgICBpZiAodHJhaWwpXG4gICAgICAgIHByZWZpeCArPSAnLydcbiAgICB9XG4gIH1cblxuICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJylcbiAgICBwcmVmaXggPSBwcmVmaXgucmVwbGFjZSgvXFxcXC9nLCAnLycpXG5cbiAgLy8gTWFyayB0aGlzIGFzIGEgbWF0Y2hcbiAgdGhpcy5fZW1pdE1hdGNoKGluZGV4LCBwcmVmaXgpXG4gIGNiKClcbn1cblxuLy8gUmV0dXJucyBlaXRoZXIgJ0RJUicsICdGSUxFJywgb3IgZmFsc2Vcbkdsb2IucHJvdG90eXBlLl9zdGF0ID0gZnVuY3Rpb24gKGYsIGNiKSB7XG4gIHZhciBhYnMgPSB0aGlzLl9tYWtlQWJzKGYpXG4gIHZhciBuZWVkRGlyID0gZi5zbGljZSgtMSkgPT09ICcvJ1xuXG4gIGlmIChmLmxlbmd0aCA+IHRoaXMubWF4TGVuZ3RoKVxuICAgIHJldHVybiBjYigpXG5cbiAgaWYgKCF0aGlzLnN0YXQgJiYgb3duUHJvcCh0aGlzLmNhY2hlLCBhYnMpKSB7XG4gICAgdmFyIGMgPSB0aGlzLmNhY2hlW2Fic11cblxuICAgIGlmIChBcnJheS5pc0FycmF5KGMpKVxuICAgICAgYyA9ICdESVInXG5cbiAgICAvLyBJdCBleGlzdHMsIGJ1dCBtYXliZSBub3QgaG93IHdlIG5lZWQgaXRcbiAgICBpZiAoIW5lZWREaXIgfHwgYyA9PT0gJ0RJUicpXG4gICAgICByZXR1cm4gY2IobnVsbCwgYylcblxuICAgIGlmIChuZWVkRGlyICYmIGMgPT09ICdGSUxFJylcbiAgICAgIHJldHVybiBjYigpXG5cbiAgICAvLyBvdGhlcndpc2Ugd2UgaGF2ZSB0byBzdGF0LCBiZWNhdXNlIG1heWJlIGM9dHJ1ZVxuICAgIC8vIGlmIHdlIGtub3cgaXQgZXhpc3RzLCBidXQgbm90IHdoYXQgaXQgaXMuXG4gIH1cblxuICB2YXIgZXhpc3RzXG4gIHZhciBzdGF0ID0gdGhpcy5zdGF0Q2FjaGVbYWJzXVxuICBpZiAoc3RhdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaWYgKHN0YXQgPT09IGZhbHNlKVxuICAgICAgcmV0dXJuIGNiKG51bGwsIHN0YXQpXG4gICAgZWxzZSB7XG4gICAgICB2YXIgdHlwZSA9IHN0YXQuaXNEaXJlY3RvcnkoKSA/ICdESVInIDogJ0ZJTEUnXG4gICAgICBpZiAobmVlZERpciAmJiB0eXBlID09PSAnRklMRScpXG4gICAgICAgIHJldHVybiBjYigpXG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiBjYihudWxsLCB0eXBlLCBzdGF0KVxuICAgIH1cbiAgfVxuXG4gIHZhciBzZWxmID0gdGhpc1xuICB2YXIgc3RhdGNiID0gaW5mbGlnaHQoJ3N0YXRcXDAnICsgYWJzLCBsc3RhdGNiXylcbiAgaWYgKHN0YXRjYilcbiAgICBmcy5sc3RhdChhYnMsIHN0YXRjYilcblxuICBmdW5jdGlvbiBsc3RhdGNiXyAoZXIsIGxzdGF0KSB7XG4gICAgaWYgKGxzdGF0ICYmIGxzdGF0LmlzU3ltYm9saWNMaW5rKCkpIHtcbiAgICAgIC8vIElmIGl0J3MgYSBzeW1saW5rLCB0aGVuIHRyZWF0IGl0IGFzIHRoZSB0YXJnZXQsIHVubGVzc1xuICAgICAgLy8gdGhlIHRhcmdldCBkb2VzIG5vdCBleGlzdCwgdGhlbiB0cmVhdCBpdCBhcyBhIGZpbGUuXG4gICAgICByZXR1cm4gZnMuc3RhdChhYnMsIGZ1bmN0aW9uIChlciwgc3RhdCkge1xuICAgICAgICBpZiAoZXIpXG4gICAgICAgICAgc2VsZi5fc3RhdDIoZiwgYWJzLCBudWxsLCBsc3RhdCwgY2IpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBzZWxmLl9zdGF0MihmLCBhYnMsIGVyLCBzdGF0LCBjYilcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGYuX3N0YXQyKGYsIGFicywgZXIsIGxzdGF0LCBjYilcbiAgICB9XG4gIH1cbn1cblxuR2xvYi5wcm90b3R5cGUuX3N0YXQyID0gZnVuY3Rpb24gKGYsIGFicywgZXIsIHN0YXQsIGNiKSB7XG4gIGlmIChlciAmJiAoZXIuY29kZSA9PT0gJ0VOT0VOVCcgfHwgZXIuY29kZSA9PT0gJ0VOT1RESVInKSkge1xuICAgIHRoaXMuc3RhdENhY2hlW2Fic10gPSBmYWxzZVxuICAgIHJldHVybiBjYigpXG4gIH1cblxuICB2YXIgbmVlZERpciA9IGYuc2xpY2UoLTEpID09PSAnLydcbiAgdGhpcy5zdGF0Q2FjaGVbYWJzXSA9IHN0YXRcblxuICBpZiAoYWJzLnNsaWNlKC0xKSA9PT0gJy8nICYmIHN0YXQgJiYgIXN0YXQuaXNEaXJlY3RvcnkoKSlcbiAgICByZXR1cm4gY2IobnVsbCwgZmFsc2UsIHN0YXQpXG5cbiAgdmFyIGMgPSB0cnVlXG4gIGlmIChzdGF0KVxuICAgIGMgPSBzdGF0LmlzRGlyZWN0b3J5KCkgPyAnRElSJyA6ICdGSUxFJ1xuICB0aGlzLmNhY2hlW2Fic10gPSB0aGlzLmNhY2hlW2Fic10gfHwgY1xuXG4gIGlmIChuZWVkRGlyICYmIGMgPT09ICdGSUxFJylcbiAgICByZXR1cm4gY2IoKVxuXG4gIHJldHVybiBjYihudWxsLCBjLCBzdGF0KVxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2dsb2IvZ2xvYi5qc1xuLy8gbW9kdWxlIGlkID0gMTRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSByZWFscGF0aFxucmVhbHBhdGgucmVhbHBhdGggPSByZWFscGF0aFxucmVhbHBhdGguc3luYyA9IHJlYWxwYXRoU3luY1xucmVhbHBhdGgucmVhbHBhdGhTeW5jID0gcmVhbHBhdGhTeW5jXG5yZWFscGF0aC5tb25rZXlwYXRjaCA9IG1vbmtleXBhdGNoXG5yZWFscGF0aC51bm1vbmtleXBhdGNoID0gdW5tb25rZXlwYXRjaFxuXG52YXIgZnMgPSByZXF1aXJlKCdmcycpXG52YXIgb3JpZ1JlYWxwYXRoID0gZnMucmVhbHBhdGhcbnZhciBvcmlnUmVhbHBhdGhTeW5jID0gZnMucmVhbHBhdGhTeW5jXG5cbnZhciB2ZXJzaW9uID0gcHJvY2Vzcy52ZXJzaW9uXG52YXIgb2sgPSAvXnZbMC01XVxcLi8udGVzdCh2ZXJzaW9uKVxudmFyIG9sZCA9IHJlcXVpcmUoJy4vb2xkLmpzJylcblxuZnVuY3Rpb24gbmV3RXJyb3IgKGVyKSB7XG4gIHJldHVybiBlciAmJiBlci5zeXNjYWxsID09PSAncmVhbHBhdGgnICYmIChcbiAgICBlci5jb2RlID09PSAnRUxPT1AnIHx8XG4gICAgZXIuY29kZSA9PT0gJ0VOT01FTScgfHxcbiAgICBlci5jb2RlID09PSAnRU5BTUVUT09MT05HJ1xuICApXG59XG5cbmZ1bmN0aW9uIHJlYWxwYXRoIChwLCBjYWNoZSwgY2IpIHtcbiAgaWYgKG9rKSB7XG4gICAgcmV0dXJuIG9yaWdSZWFscGF0aChwLCBjYWNoZSwgY2IpXG4gIH1cblxuICBpZiAodHlwZW9mIGNhY2hlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY2IgPSBjYWNoZVxuICAgIGNhY2hlID0gbnVsbFxuICB9XG4gIG9yaWdSZWFscGF0aChwLCBjYWNoZSwgZnVuY3Rpb24gKGVyLCByZXN1bHQpIHtcbiAgICBpZiAobmV3RXJyb3IoZXIpKSB7XG4gICAgICBvbGQucmVhbHBhdGgocCwgY2FjaGUsIGNiKVxuICAgIH0gZWxzZSB7XG4gICAgICBjYihlciwgcmVzdWx0KVxuICAgIH1cbiAgfSlcbn1cblxuZnVuY3Rpb24gcmVhbHBhdGhTeW5jIChwLCBjYWNoZSkge1xuICBpZiAob2spIHtcbiAgICByZXR1cm4gb3JpZ1JlYWxwYXRoU3luYyhwLCBjYWNoZSlcbiAgfVxuXG4gIHRyeSB7XG4gICAgcmV0dXJuIG9yaWdSZWFscGF0aFN5bmMocCwgY2FjaGUpXG4gIH0gY2F0Y2ggKGVyKSB7XG4gICAgaWYgKG5ld0Vycm9yKGVyKSkge1xuICAgICAgcmV0dXJuIG9sZC5yZWFscGF0aFN5bmMocCwgY2FjaGUpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IGVyXG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIG1vbmtleXBhdGNoICgpIHtcbiAgZnMucmVhbHBhdGggPSByZWFscGF0aFxuICBmcy5yZWFscGF0aFN5bmMgPSByZWFscGF0aFN5bmNcbn1cblxuZnVuY3Rpb24gdW5tb25rZXlwYXRjaCAoKSB7XG4gIGZzLnJlYWxwYXRoID0gb3JpZ1JlYWxwYXRoXG4gIGZzLnJlYWxwYXRoU3luYyA9IG9yaWdSZWFscGF0aFN5bmNcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9mcy5yZWFscGF0aC9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gMTVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbnZhciBwYXRoTW9kdWxlID0gcmVxdWlyZSgncGF0aCcpO1xudmFyIGlzV2luZG93cyA9IHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMic7XG52YXIgZnMgPSByZXF1aXJlKCdmcycpO1xuXG4vLyBKYXZhU2NyaXB0IGltcGxlbWVudGF0aW9uIG9mIHJlYWxwYXRoLCBwb3J0ZWQgZnJvbSBub2RlIHByZS12NlxuXG52YXIgREVCVUcgPSBwcm9jZXNzLmVudi5OT0RFX0RFQlVHICYmIC9mcy8udGVzdChwcm9jZXNzLmVudi5OT0RFX0RFQlVHKTtcblxuZnVuY3Rpb24gcmV0aHJvdygpIHtcbiAgLy8gT25seSBlbmFibGUgaW4gZGVidWcgbW9kZS4gQSBiYWNrdHJhY2UgdXNlcyB+MTAwMCBieXRlcyBvZiBoZWFwIHNwYWNlIGFuZFxuICAvLyBpcyBmYWlybHkgc2xvdyB0byBnZW5lcmF0ZS5cbiAgdmFyIGNhbGxiYWNrO1xuICBpZiAoREVCVUcpIHtcbiAgICB2YXIgYmFja3RyYWNlID0gbmV3IEVycm9yO1xuICAgIGNhbGxiYWNrID0gZGVidWdDYWxsYmFjaztcbiAgfSBlbHNlXG4gICAgY2FsbGJhY2sgPSBtaXNzaW5nQ2FsbGJhY2s7XG5cbiAgcmV0dXJuIGNhbGxiYWNrO1xuXG4gIGZ1bmN0aW9uIGRlYnVnQ2FsbGJhY2soZXJyKSB7XG4gICAgaWYgKGVycikge1xuICAgICAgYmFja3RyYWNlLm1lc3NhZ2UgPSBlcnIubWVzc2FnZTtcbiAgICAgIGVyciA9IGJhY2t0cmFjZTtcbiAgICAgIG1pc3NpbmdDYWxsYmFjayhlcnIpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG1pc3NpbmdDYWxsYmFjayhlcnIpIHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICBpZiAocHJvY2Vzcy50aHJvd0RlcHJlY2F0aW9uKVxuICAgICAgICB0aHJvdyBlcnI7ICAvLyBGb3Jnb3QgYSBjYWxsYmFjayBidXQgZG9uJ3Qga25vdyB3aGVyZT8gVXNlIE5PREVfREVCVUc9ZnNcbiAgICAgIGVsc2UgaWYgKCFwcm9jZXNzLm5vRGVwcmVjYXRpb24pIHtcbiAgICAgICAgdmFyIG1zZyA9ICdmczogbWlzc2luZyBjYWxsYmFjayAnICsgKGVyci5zdGFjayB8fCBlcnIubWVzc2FnZSk7XG4gICAgICAgIGlmIChwcm9jZXNzLnRyYWNlRGVwcmVjYXRpb24pXG4gICAgICAgICAgY29uc29sZS50cmFjZShtc2cpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgY29uc29sZS5lcnJvcihtc2cpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBtYXliZUNhbGxiYWNrKGNiKSB7XG4gIHJldHVybiB0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicgPyBjYiA6IHJldGhyb3coKTtcbn1cblxudmFyIG5vcm1hbGl6ZSA9IHBhdGhNb2R1bGUubm9ybWFsaXplO1xuXG4vLyBSZWdleHAgdGhhdCBmaW5kcyB0aGUgbmV4dCBwYXJ0aW9uIG9mIGEgKHBhcnRpYWwpIHBhdGhcbi8vIHJlc3VsdCBpcyBbYmFzZV93aXRoX3NsYXNoLCBiYXNlXSwgZS5nLiBbJ3NvbWVkaXIvJywgJ3NvbWVkaXInXVxuaWYgKGlzV2luZG93cykge1xuICB2YXIgbmV4dFBhcnRSZSA9IC8oLio/KSg/OltcXC9cXFxcXSt8JCkvZztcbn0gZWxzZSB7XG4gIHZhciBuZXh0UGFydFJlID0gLyguKj8pKD86W1xcL10rfCQpL2c7XG59XG5cbi8vIFJlZ2V4IHRvIGZpbmQgdGhlIGRldmljZSByb290LCBpbmNsdWRpbmcgdHJhaWxpbmcgc2xhc2guIEUuZy4gJ2M6XFxcXCcuXG5pZiAoaXNXaW5kb3dzKSB7XG4gIHZhciBzcGxpdFJvb3RSZSA9IC9eKD86W2EtekEtWl06fFtcXFxcXFwvXXsyfVteXFxcXFxcL10rW1xcXFxcXC9dW15cXFxcXFwvXSspP1tcXFxcXFwvXSovO1xufSBlbHNlIHtcbiAgdmFyIHNwbGl0Um9vdFJlID0gL15bXFwvXSovO1xufVxuXG5leHBvcnRzLnJlYWxwYXRoU3luYyA9IGZ1bmN0aW9uIHJlYWxwYXRoU3luYyhwLCBjYWNoZSkge1xuICAvLyBtYWtlIHAgaXMgYWJzb2x1dGVcbiAgcCA9IHBhdGhNb2R1bGUucmVzb2x2ZShwKTtcblxuICBpZiAoY2FjaGUgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGNhY2hlLCBwKSkge1xuICAgIHJldHVybiBjYWNoZVtwXTtcbiAgfVxuXG4gIHZhciBvcmlnaW5hbCA9IHAsXG4gICAgICBzZWVuTGlua3MgPSB7fSxcbiAgICAgIGtub3duSGFyZCA9IHt9O1xuXG4gIC8vIGN1cnJlbnQgY2hhcmFjdGVyIHBvc2l0aW9uIGluIHBcbiAgdmFyIHBvcztcbiAgLy8gdGhlIHBhcnRpYWwgcGF0aCBzbyBmYXIsIGluY2x1ZGluZyBhIHRyYWlsaW5nIHNsYXNoIGlmIGFueVxuICB2YXIgY3VycmVudDtcbiAgLy8gdGhlIHBhcnRpYWwgcGF0aCB3aXRob3V0IGEgdHJhaWxpbmcgc2xhc2ggKGV4Y2VwdCB3aGVuIHBvaW50aW5nIGF0IGEgcm9vdClcbiAgdmFyIGJhc2U7XG4gIC8vIHRoZSBwYXJ0aWFsIHBhdGggc2Nhbm5lZCBpbiB0aGUgcHJldmlvdXMgcm91bmQsIHdpdGggc2xhc2hcbiAgdmFyIHByZXZpb3VzO1xuXG4gIHN0YXJ0KCk7XG5cbiAgZnVuY3Rpb24gc3RhcnQoKSB7XG4gICAgLy8gU2tpcCBvdmVyIHJvb3RzXG4gICAgdmFyIG0gPSBzcGxpdFJvb3RSZS5leGVjKHApO1xuICAgIHBvcyA9IG1bMF0ubGVuZ3RoO1xuICAgIGN1cnJlbnQgPSBtWzBdO1xuICAgIGJhc2UgPSBtWzBdO1xuICAgIHByZXZpb3VzID0gJyc7XG5cbiAgICAvLyBPbiB3aW5kb3dzLCBjaGVjayB0aGF0IHRoZSByb290IGV4aXN0cy4gT24gdW5peCB0aGVyZSBpcyBubyBuZWVkLlxuICAgIGlmIChpc1dpbmRvd3MgJiYgIWtub3duSGFyZFtiYXNlXSkge1xuICAgICAgZnMubHN0YXRTeW5jKGJhc2UpO1xuICAgICAga25vd25IYXJkW2Jhc2VdID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICAvLyB3YWxrIGRvd24gdGhlIHBhdGgsIHN3YXBwaW5nIG91dCBsaW5rZWQgcGF0aHBhcnRzIGZvciB0aGVpciByZWFsXG4gIC8vIHZhbHVlc1xuICAvLyBOQjogcC5sZW5ndGggY2hhbmdlcy5cbiAgd2hpbGUgKHBvcyA8IHAubGVuZ3RoKSB7XG4gICAgLy8gZmluZCB0aGUgbmV4dCBwYXJ0XG4gICAgbmV4dFBhcnRSZS5sYXN0SW5kZXggPSBwb3M7XG4gICAgdmFyIHJlc3VsdCA9IG5leHRQYXJ0UmUuZXhlYyhwKTtcbiAgICBwcmV2aW91cyA9IGN1cnJlbnQ7XG4gICAgY3VycmVudCArPSByZXN1bHRbMF07XG4gICAgYmFzZSA9IHByZXZpb3VzICsgcmVzdWx0WzFdO1xuICAgIHBvcyA9IG5leHRQYXJ0UmUubGFzdEluZGV4O1xuXG4gICAgLy8gY29udGludWUgaWYgbm90IGEgc3ltbGlua1xuICAgIGlmIChrbm93bkhhcmRbYmFzZV0gfHwgKGNhY2hlICYmIGNhY2hlW2Jhc2VdID09PSBiYXNlKSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgdmFyIHJlc29sdmVkTGluaztcbiAgICBpZiAoY2FjaGUgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGNhY2hlLCBiYXNlKSkge1xuICAgICAgLy8gc29tZSBrbm93biBzeW1ib2xpYyBsaW5rLiAgbm8gbmVlZCB0byBzdGF0IGFnYWluLlxuICAgICAgcmVzb2x2ZWRMaW5rID0gY2FjaGVbYmFzZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBzdGF0ID0gZnMubHN0YXRTeW5jKGJhc2UpO1xuICAgICAgaWYgKCFzdGF0LmlzU3ltYm9saWNMaW5rKCkpIHtcbiAgICAgICAga25vd25IYXJkW2Jhc2VdID0gdHJ1ZTtcbiAgICAgICAgaWYgKGNhY2hlKSBjYWNoZVtiYXNlXSA9IGJhc2U7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyByZWFkIHRoZSBsaW5rIGlmIGl0IHdhc24ndCByZWFkIGJlZm9yZVxuICAgICAgLy8gZGV2L2lubyBhbHdheXMgcmV0dXJuIDAgb24gd2luZG93cywgc28gc2tpcCB0aGUgY2hlY2suXG4gICAgICB2YXIgbGlua1RhcmdldCA9IG51bGw7XG4gICAgICBpZiAoIWlzV2luZG93cykge1xuICAgICAgICB2YXIgaWQgPSBzdGF0LmRldi50b1N0cmluZygzMikgKyAnOicgKyBzdGF0Lmluby50b1N0cmluZygzMik7XG4gICAgICAgIGlmIChzZWVuTGlua3MuaGFzT3duUHJvcGVydHkoaWQpKSB7XG4gICAgICAgICAgbGlua1RhcmdldCA9IHNlZW5MaW5rc1tpZF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChsaW5rVGFyZ2V0ID09PSBudWxsKSB7XG4gICAgICAgIGZzLnN0YXRTeW5jKGJhc2UpO1xuICAgICAgICBsaW5rVGFyZ2V0ID0gZnMucmVhZGxpbmtTeW5jKGJhc2UpO1xuICAgICAgfVxuICAgICAgcmVzb2x2ZWRMaW5rID0gcGF0aE1vZHVsZS5yZXNvbHZlKHByZXZpb3VzLCBsaW5rVGFyZ2V0KTtcbiAgICAgIC8vIHRyYWNrIHRoaXMsIGlmIGdpdmVuIGEgY2FjaGUuXG4gICAgICBpZiAoY2FjaGUpIGNhY2hlW2Jhc2VdID0gcmVzb2x2ZWRMaW5rO1xuICAgICAgaWYgKCFpc1dpbmRvd3MpIHNlZW5MaW5rc1tpZF0gPSBsaW5rVGFyZ2V0O1xuICAgIH1cblxuICAgIC8vIHJlc29sdmUgdGhlIGxpbmssIHRoZW4gc3RhcnQgb3ZlclxuICAgIHAgPSBwYXRoTW9kdWxlLnJlc29sdmUocmVzb2x2ZWRMaW5rLCBwLnNsaWNlKHBvcykpO1xuICAgIHN0YXJ0KCk7XG4gIH1cblxuICBpZiAoY2FjaGUpIGNhY2hlW29yaWdpbmFsXSA9IHA7XG5cbiAgcmV0dXJuIHA7XG59O1xuXG5cbmV4cG9ydHMucmVhbHBhdGggPSBmdW5jdGlvbiByZWFscGF0aChwLCBjYWNoZSwgY2IpIHtcbiAgaWYgKHR5cGVvZiBjYiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIGNiID0gbWF5YmVDYWxsYmFjayhjYWNoZSk7XG4gICAgY2FjaGUgPSBudWxsO1xuICB9XG5cbiAgLy8gbWFrZSBwIGlzIGFic29sdXRlXG4gIHAgPSBwYXRoTW9kdWxlLnJlc29sdmUocCk7XG5cbiAgaWYgKGNhY2hlICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChjYWNoZSwgcCkpIHtcbiAgICByZXR1cm4gcHJvY2Vzcy5uZXh0VGljayhjYi5iaW5kKG51bGwsIG51bGwsIGNhY2hlW3BdKSk7XG4gIH1cblxuICB2YXIgb3JpZ2luYWwgPSBwLFxuICAgICAgc2VlbkxpbmtzID0ge30sXG4gICAgICBrbm93bkhhcmQgPSB7fTtcblxuICAvLyBjdXJyZW50IGNoYXJhY3RlciBwb3NpdGlvbiBpbiBwXG4gIHZhciBwb3M7XG4gIC8vIHRoZSBwYXJ0aWFsIHBhdGggc28gZmFyLCBpbmNsdWRpbmcgYSB0cmFpbGluZyBzbGFzaCBpZiBhbnlcbiAgdmFyIGN1cnJlbnQ7XG4gIC8vIHRoZSBwYXJ0aWFsIHBhdGggd2l0aG91dCBhIHRyYWlsaW5nIHNsYXNoIChleGNlcHQgd2hlbiBwb2ludGluZyBhdCBhIHJvb3QpXG4gIHZhciBiYXNlO1xuICAvLyB0aGUgcGFydGlhbCBwYXRoIHNjYW5uZWQgaW4gdGhlIHByZXZpb3VzIHJvdW5kLCB3aXRoIHNsYXNoXG4gIHZhciBwcmV2aW91cztcblxuICBzdGFydCgpO1xuXG4gIGZ1bmN0aW9uIHN0YXJ0KCkge1xuICAgIC8vIFNraXAgb3ZlciByb290c1xuICAgIHZhciBtID0gc3BsaXRSb290UmUuZXhlYyhwKTtcbiAgICBwb3MgPSBtWzBdLmxlbmd0aDtcbiAgICBjdXJyZW50ID0gbVswXTtcbiAgICBiYXNlID0gbVswXTtcbiAgICBwcmV2aW91cyA9ICcnO1xuXG4gICAgLy8gT24gd2luZG93cywgY2hlY2sgdGhhdCB0aGUgcm9vdCBleGlzdHMuIE9uIHVuaXggdGhlcmUgaXMgbm8gbmVlZC5cbiAgICBpZiAoaXNXaW5kb3dzICYmICFrbm93bkhhcmRbYmFzZV0pIHtcbiAgICAgIGZzLmxzdGF0KGJhc2UsIGZ1bmN0aW9uKGVycikge1xuICAgICAgICBpZiAoZXJyKSByZXR1cm4gY2IoZXJyKTtcbiAgICAgICAga25vd25IYXJkW2Jhc2VdID0gdHJ1ZTtcbiAgICAgICAgTE9PUCgpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soTE9PUCk7XG4gICAgfVxuICB9XG5cbiAgLy8gd2FsayBkb3duIHRoZSBwYXRoLCBzd2FwcGluZyBvdXQgbGlua2VkIHBhdGhwYXJ0cyBmb3IgdGhlaXIgcmVhbFxuICAvLyB2YWx1ZXNcbiAgZnVuY3Rpb24gTE9PUCgpIHtcbiAgICAvLyBzdG9wIGlmIHNjYW5uZWQgcGFzdCBlbmQgb2YgcGF0aFxuICAgIGlmIChwb3MgPj0gcC5sZW5ndGgpIHtcbiAgICAgIGlmIChjYWNoZSkgY2FjaGVbb3JpZ2luYWxdID0gcDtcbiAgICAgIHJldHVybiBjYihudWxsLCBwKTtcbiAgICB9XG5cbiAgICAvLyBmaW5kIHRoZSBuZXh0IHBhcnRcbiAgICBuZXh0UGFydFJlLmxhc3RJbmRleCA9IHBvcztcbiAgICB2YXIgcmVzdWx0ID0gbmV4dFBhcnRSZS5leGVjKHApO1xuICAgIHByZXZpb3VzID0gY3VycmVudDtcbiAgICBjdXJyZW50ICs9IHJlc3VsdFswXTtcbiAgICBiYXNlID0gcHJldmlvdXMgKyByZXN1bHRbMV07XG4gICAgcG9zID0gbmV4dFBhcnRSZS5sYXN0SW5kZXg7XG5cbiAgICAvLyBjb250aW51ZSBpZiBub3QgYSBzeW1saW5rXG4gICAgaWYgKGtub3duSGFyZFtiYXNlXSB8fCAoY2FjaGUgJiYgY2FjaGVbYmFzZV0gPT09IGJhc2UpKSB7XG4gICAgICByZXR1cm4gcHJvY2Vzcy5uZXh0VGljayhMT09QKTtcbiAgICB9XG5cbiAgICBpZiAoY2FjaGUgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGNhY2hlLCBiYXNlKSkge1xuICAgICAgLy8ga25vd24gc3ltYm9saWMgbGluay4gIG5vIG5lZWQgdG8gc3RhdCBhZ2Fpbi5cbiAgICAgIHJldHVybiBnb3RSZXNvbHZlZExpbmsoY2FjaGVbYmFzZV0pO1xuICAgIH1cblxuICAgIHJldHVybiBmcy5sc3RhdChiYXNlLCBnb3RTdGF0KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdvdFN0YXQoZXJyLCBzdGF0KSB7XG4gICAgaWYgKGVycikgcmV0dXJuIGNiKGVycik7XG5cbiAgICAvLyBpZiBub3QgYSBzeW1saW5rLCBza2lwIHRvIHRoZSBuZXh0IHBhdGggcGFydFxuICAgIGlmICghc3RhdC5pc1N5bWJvbGljTGluaygpKSB7XG4gICAgICBrbm93bkhhcmRbYmFzZV0gPSB0cnVlO1xuICAgICAgaWYgKGNhY2hlKSBjYWNoZVtiYXNlXSA9IGJhc2U7XG4gICAgICByZXR1cm4gcHJvY2Vzcy5uZXh0VGljayhMT09QKTtcbiAgICB9XG5cbiAgICAvLyBzdGF0ICYgcmVhZCB0aGUgbGluayBpZiBub3QgcmVhZCBiZWZvcmVcbiAgICAvLyBjYWxsIGdvdFRhcmdldCBhcyBzb29uIGFzIHRoZSBsaW5rIHRhcmdldCBpcyBrbm93blxuICAgIC8vIGRldi9pbm8gYWx3YXlzIHJldHVybiAwIG9uIHdpbmRvd3MsIHNvIHNraXAgdGhlIGNoZWNrLlxuICAgIGlmICghaXNXaW5kb3dzKSB7XG4gICAgICB2YXIgaWQgPSBzdGF0LmRldi50b1N0cmluZygzMikgKyAnOicgKyBzdGF0Lmluby50b1N0cmluZygzMik7XG4gICAgICBpZiAoc2VlbkxpbmtzLmhhc093blByb3BlcnR5KGlkKSkge1xuICAgICAgICByZXR1cm4gZ290VGFyZ2V0KG51bGwsIHNlZW5MaW5rc1tpZF0sIGJhc2UpO1xuICAgICAgfVxuICAgIH1cbiAgICBmcy5zdGF0KGJhc2UsIGZ1bmN0aW9uKGVycikge1xuICAgICAgaWYgKGVycikgcmV0dXJuIGNiKGVycik7XG5cbiAgICAgIGZzLnJlYWRsaW5rKGJhc2UsIGZ1bmN0aW9uKGVyciwgdGFyZ2V0KSB7XG4gICAgICAgIGlmICghaXNXaW5kb3dzKSBzZWVuTGlua3NbaWRdID0gdGFyZ2V0O1xuICAgICAgICBnb3RUYXJnZXQoZXJyLCB0YXJnZXQpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBnb3RUYXJnZXQoZXJyLCB0YXJnZXQsIGJhc2UpIHtcbiAgICBpZiAoZXJyKSByZXR1cm4gY2IoZXJyKTtcblxuICAgIHZhciByZXNvbHZlZExpbmsgPSBwYXRoTW9kdWxlLnJlc29sdmUocHJldmlvdXMsIHRhcmdldCk7XG4gICAgaWYgKGNhY2hlKSBjYWNoZVtiYXNlXSA9IHJlc29sdmVkTGluaztcbiAgICBnb3RSZXNvbHZlZExpbmsocmVzb2x2ZWRMaW5rKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdvdFJlc29sdmVkTGluayhyZXNvbHZlZExpbmspIHtcbiAgICAvLyByZXNvbHZlIHRoZSBsaW5rLCB0aGVuIHN0YXJ0IG92ZXJcbiAgICBwID0gcGF0aE1vZHVsZS5yZXNvbHZlKHJlc29sdmVkTGluaywgcC5zbGljZShwb3MpKTtcbiAgICBzdGFydCgpO1xuICB9XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZzLnJlYWxwYXRoL29sZC5qc1xuLy8gbW9kdWxlIGlkID0gMTZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBtaW5pbWF0Y2hcbm1pbmltYXRjaC5NaW5pbWF0Y2ggPSBNaW5pbWF0Y2hcblxudmFyIHBhdGggPSB7IHNlcDogJy8nIH1cbnRyeSB7XG4gIHBhdGggPSByZXF1aXJlKCdwYXRoJylcbn0gY2F0Y2ggKGVyKSB7fVxuXG52YXIgR0xPQlNUQVIgPSBtaW5pbWF0Y2guR0xPQlNUQVIgPSBNaW5pbWF0Y2guR0xPQlNUQVIgPSB7fVxudmFyIGV4cGFuZCA9IHJlcXVpcmUoJ2JyYWNlLWV4cGFuc2lvbicpXG5cbnZhciBwbFR5cGVzID0ge1xuICAnISc6IHsgb3BlbjogJyg/Oig/ISg/OicsIGNsb3NlOiAnKSlbXi9dKj8pJ30sXG4gICc/JzogeyBvcGVuOiAnKD86JywgY2xvc2U6ICcpPycgfSxcbiAgJysnOiB7IG9wZW46ICcoPzonLCBjbG9zZTogJykrJyB9LFxuICAnKic6IHsgb3BlbjogJyg/OicsIGNsb3NlOiAnKSonIH0sXG4gICdAJzogeyBvcGVuOiAnKD86JywgY2xvc2U6ICcpJyB9XG59XG5cbi8vIGFueSBzaW5nbGUgdGhpbmcgb3RoZXIgdGhhbiAvXG4vLyBkb24ndCBuZWVkIHRvIGVzY2FwZSAvIHdoZW4gdXNpbmcgbmV3IFJlZ0V4cCgpXG52YXIgcW1hcmsgPSAnW14vXSdcblxuLy8gKiA9PiBhbnkgbnVtYmVyIG9mIGNoYXJhY3RlcnNcbnZhciBzdGFyID0gcW1hcmsgKyAnKj8nXG5cbi8vICoqIHdoZW4gZG90cyBhcmUgYWxsb3dlZC4gIEFueXRoaW5nIGdvZXMsIGV4Y2VwdCAuLiBhbmQgLlxuLy8gbm90ICheIG9yIC8gZm9sbG93ZWQgYnkgb25lIG9yIHR3byBkb3RzIGZvbGxvd2VkIGJ5ICQgb3IgLyksXG4vLyBmb2xsb3dlZCBieSBhbnl0aGluZywgYW55IG51bWJlciBvZiB0aW1lcy5cbnZhciB0d29TdGFyRG90ID0gJyg/Oig/ISg/OlxcXFxcXC98XikoPzpcXFxcLnsxLDJ9KSgkfFxcXFxcXC8pKS4pKj8nXG5cbi8vIG5vdCBhIF4gb3IgLyBmb2xsb3dlZCBieSBhIGRvdCxcbi8vIGZvbGxvd2VkIGJ5IGFueXRoaW5nLCBhbnkgbnVtYmVyIG9mIHRpbWVzLlxudmFyIHR3b1N0YXJOb0RvdCA9ICcoPzooPyEoPzpcXFxcXFwvfF4pXFxcXC4pLikqPydcblxuLy8gY2hhcmFjdGVycyB0aGF0IG5lZWQgdG8gYmUgZXNjYXBlZCBpbiBSZWdFeHAuXG52YXIgcmVTcGVjaWFscyA9IGNoYXJTZXQoJygpLip7fSs/W11eJFxcXFwhJylcblxuLy8gXCJhYmNcIiAtPiB7IGE6dHJ1ZSwgYjp0cnVlLCBjOnRydWUgfVxuZnVuY3Rpb24gY2hhclNldCAocykge1xuICByZXR1cm4gcy5zcGxpdCgnJykucmVkdWNlKGZ1bmN0aW9uIChzZXQsIGMpIHtcbiAgICBzZXRbY10gPSB0cnVlXG4gICAgcmV0dXJuIHNldFxuICB9LCB7fSlcbn1cblxuLy8gbm9ybWFsaXplcyBzbGFzaGVzLlxudmFyIHNsYXNoU3BsaXQgPSAvXFwvKy9cblxubWluaW1hdGNoLmZpbHRlciA9IGZpbHRlclxuZnVuY3Rpb24gZmlsdGVyIChwYXR0ZXJuLCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gIHJldHVybiBmdW5jdGlvbiAocCwgaSwgbGlzdCkge1xuICAgIHJldHVybiBtaW5pbWF0Y2gocCwgcGF0dGVybiwgb3B0aW9ucylcbiAgfVxufVxuXG5mdW5jdGlvbiBleHQgKGEsIGIpIHtcbiAgYSA9IGEgfHwge31cbiAgYiA9IGIgfHwge31cbiAgdmFyIHQgPSB7fVxuICBPYmplY3Qua2V5cyhiKS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7XG4gICAgdFtrXSA9IGJba11cbiAgfSlcbiAgT2JqZWN0LmtleXMoYSkuZm9yRWFjaChmdW5jdGlvbiAoaykge1xuICAgIHRba10gPSBhW2tdXG4gIH0pXG4gIHJldHVybiB0XG59XG5cbm1pbmltYXRjaC5kZWZhdWx0cyA9IGZ1bmN0aW9uIChkZWYpIHtcbiAgaWYgKCFkZWYgfHwgIU9iamVjdC5rZXlzKGRlZikubGVuZ3RoKSByZXR1cm4gbWluaW1hdGNoXG5cbiAgdmFyIG9yaWcgPSBtaW5pbWF0Y2hcblxuICB2YXIgbSA9IGZ1bmN0aW9uIG1pbmltYXRjaCAocCwgcGF0dGVybiwgb3B0aW9ucykge1xuICAgIHJldHVybiBvcmlnLm1pbmltYXRjaChwLCBwYXR0ZXJuLCBleHQoZGVmLCBvcHRpb25zKSlcbiAgfVxuXG4gIG0uTWluaW1hdGNoID0gZnVuY3Rpb24gTWluaW1hdGNoIChwYXR0ZXJuLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIG5ldyBvcmlnLk1pbmltYXRjaChwYXR0ZXJuLCBleHQoZGVmLCBvcHRpb25zKSlcbiAgfVxuXG4gIHJldHVybiBtXG59XG5cbk1pbmltYXRjaC5kZWZhdWx0cyA9IGZ1bmN0aW9uIChkZWYpIHtcbiAgaWYgKCFkZWYgfHwgIU9iamVjdC5rZXlzKGRlZikubGVuZ3RoKSByZXR1cm4gTWluaW1hdGNoXG4gIHJldHVybiBtaW5pbWF0Y2guZGVmYXVsdHMoZGVmKS5NaW5pbWF0Y2hcbn1cblxuZnVuY3Rpb24gbWluaW1hdGNoIChwLCBwYXR0ZXJuLCBvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgcGF0dGVybiAhPT0gJ3N0cmluZycpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdnbG9iIHBhdHRlcm4gc3RyaW5nIHJlcXVpcmVkJylcbiAgfVxuXG4gIGlmICghb3B0aW9ucykgb3B0aW9ucyA9IHt9XG5cbiAgLy8gc2hvcnRjdXQ6IGNvbW1lbnRzIG1hdGNoIG5vdGhpbmcuXG4gIGlmICghb3B0aW9ucy5ub2NvbW1lbnQgJiYgcGF0dGVybi5jaGFyQXQoMCkgPT09ICcjJykge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgLy8gXCJcIiBvbmx5IG1hdGNoZXMgXCJcIlxuICBpZiAocGF0dGVybi50cmltKCkgPT09ICcnKSByZXR1cm4gcCA9PT0gJydcblxuICByZXR1cm4gbmV3IE1pbmltYXRjaChwYXR0ZXJuLCBvcHRpb25zKS5tYXRjaChwKVxufVxuXG5mdW5jdGlvbiBNaW5pbWF0Y2ggKHBhdHRlcm4sIG9wdGlvbnMpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIE1pbmltYXRjaCkpIHtcbiAgICByZXR1cm4gbmV3IE1pbmltYXRjaChwYXR0ZXJuLCBvcHRpb25zKVxuICB9XG5cbiAgaWYgKHR5cGVvZiBwYXR0ZXJuICE9PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2dsb2IgcGF0dGVybiBzdHJpbmcgcmVxdWlyZWQnKVxuICB9XG5cbiAgaWYgKCFvcHRpb25zKSBvcHRpb25zID0ge31cbiAgcGF0dGVybiA9IHBhdHRlcm4udHJpbSgpXG5cbiAgLy8gd2luZG93cyBzdXBwb3J0OiBuZWVkIHRvIHVzZSAvLCBub3QgXFxcbiAgaWYgKHBhdGguc2VwICE9PSAnLycpIHtcbiAgICBwYXR0ZXJuID0gcGF0dGVybi5zcGxpdChwYXRoLnNlcCkuam9pbignLycpXG4gIH1cblxuICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG4gIHRoaXMuc2V0ID0gW11cbiAgdGhpcy5wYXR0ZXJuID0gcGF0dGVyblxuICB0aGlzLnJlZ2V4cCA9IG51bGxcbiAgdGhpcy5uZWdhdGUgPSBmYWxzZVxuICB0aGlzLmNvbW1lbnQgPSBmYWxzZVxuICB0aGlzLmVtcHR5ID0gZmFsc2VcblxuICAvLyBtYWtlIHRoZSBzZXQgb2YgcmVnZXhwcyBldGMuXG4gIHRoaXMubWFrZSgpXG59XG5cbk1pbmltYXRjaC5wcm90b3R5cGUuZGVidWcgPSBmdW5jdGlvbiAoKSB7fVxuXG5NaW5pbWF0Y2gucHJvdG90eXBlLm1ha2UgPSBtYWtlXG5mdW5jdGlvbiBtYWtlICgpIHtcbiAgLy8gZG9uJ3QgZG8gaXQgbW9yZSB0aGFuIG9uY2UuXG4gIGlmICh0aGlzLl9tYWRlKSByZXR1cm5cblxuICB2YXIgcGF0dGVybiA9IHRoaXMucGF0dGVyblxuICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9uc1xuXG4gIC8vIGVtcHR5IHBhdHRlcm5zIGFuZCBjb21tZW50cyBtYXRjaCBub3RoaW5nLlxuICBpZiAoIW9wdGlvbnMubm9jb21tZW50ICYmIHBhdHRlcm4uY2hhckF0KDApID09PSAnIycpIHtcbiAgICB0aGlzLmNvbW1lbnQgPSB0cnVlXG4gICAgcmV0dXJuXG4gIH1cbiAgaWYgKCFwYXR0ZXJuKSB7XG4gICAgdGhpcy5lbXB0eSA9IHRydWVcbiAgICByZXR1cm5cbiAgfVxuXG4gIC8vIHN0ZXAgMTogZmlndXJlIG91dCBuZWdhdGlvbiwgZXRjLlxuICB0aGlzLnBhcnNlTmVnYXRlKClcblxuICAvLyBzdGVwIDI6IGV4cGFuZCBicmFjZXNcbiAgdmFyIHNldCA9IHRoaXMuZ2xvYlNldCA9IHRoaXMuYnJhY2VFeHBhbmQoKVxuXG4gIGlmIChvcHRpb25zLmRlYnVnKSB0aGlzLmRlYnVnID0gY29uc29sZS5lcnJvclxuXG4gIHRoaXMuZGVidWcodGhpcy5wYXR0ZXJuLCBzZXQpXG5cbiAgLy8gc3RlcCAzOiBub3cgd2UgaGF2ZSBhIHNldCwgc28gdHVybiBlYWNoIG9uZSBpbnRvIGEgc2VyaWVzIG9mIHBhdGgtcG9ydGlvblxuICAvLyBtYXRjaGluZyBwYXR0ZXJucy5cbiAgLy8gVGhlc2Ugd2lsbCBiZSByZWdleHBzLCBleGNlcHQgaW4gdGhlIGNhc2Ugb2YgXCIqKlwiLCB3aGljaCBpc1xuICAvLyBzZXQgdG8gdGhlIEdMT0JTVEFSIG9iamVjdCBmb3IgZ2xvYnN0YXIgYmVoYXZpb3IsXG4gIC8vIGFuZCB3aWxsIG5vdCBjb250YWluIGFueSAvIGNoYXJhY3RlcnNcbiAgc2V0ID0gdGhpcy5nbG9iUGFydHMgPSBzZXQubWFwKGZ1bmN0aW9uIChzKSB7XG4gICAgcmV0dXJuIHMuc3BsaXQoc2xhc2hTcGxpdClcbiAgfSlcblxuICB0aGlzLmRlYnVnKHRoaXMucGF0dGVybiwgc2V0KVxuXG4gIC8vIGdsb2IgLS0+IHJlZ2V4cHNcbiAgc2V0ID0gc2V0Lm1hcChmdW5jdGlvbiAocywgc2ksIHNldCkge1xuICAgIHJldHVybiBzLm1hcCh0aGlzLnBhcnNlLCB0aGlzKVxuICB9LCB0aGlzKVxuXG4gIHRoaXMuZGVidWcodGhpcy5wYXR0ZXJuLCBzZXQpXG5cbiAgLy8gZmlsdGVyIG91dCBldmVyeXRoaW5nIHRoYXQgZGlkbid0IGNvbXBpbGUgcHJvcGVybHkuXG4gIHNldCA9IHNldC5maWx0ZXIoZnVuY3Rpb24gKHMpIHtcbiAgICByZXR1cm4gcy5pbmRleE9mKGZhbHNlKSA9PT0gLTFcbiAgfSlcblxuICB0aGlzLmRlYnVnKHRoaXMucGF0dGVybiwgc2V0KVxuXG4gIHRoaXMuc2V0ID0gc2V0XG59XG5cbk1pbmltYXRjaC5wcm90b3R5cGUucGFyc2VOZWdhdGUgPSBwYXJzZU5lZ2F0ZVxuZnVuY3Rpb24gcGFyc2VOZWdhdGUgKCkge1xuICB2YXIgcGF0dGVybiA9IHRoaXMucGF0dGVyblxuICB2YXIgbmVnYXRlID0gZmFsc2VcbiAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnNcbiAgdmFyIG5lZ2F0ZU9mZnNldCA9IDBcblxuICBpZiAob3B0aW9ucy5ub25lZ2F0ZSkgcmV0dXJuXG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBwYXR0ZXJuLmxlbmd0aFxuICAgIDsgaSA8IGwgJiYgcGF0dGVybi5jaGFyQXQoaSkgPT09ICchJ1xuICAgIDsgaSsrKSB7XG4gICAgbmVnYXRlID0gIW5lZ2F0ZVxuICAgIG5lZ2F0ZU9mZnNldCsrXG4gIH1cblxuICBpZiAobmVnYXRlT2Zmc2V0KSB0aGlzLnBhdHRlcm4gPSBwYXR0ZXJuLnN1YnN0cihuZWdhdGVPZmZzZXQpXG4gIHRoaXMubmVnYXRlID0gbmVnYXRlXG59XG5cbi8vIEJyYWNlIGV4cGFuc2lvbjpcbi8vIGF7YixjfWQgLT4gYWJkIGFjZFxuLy8gYXtiLH1jIC0+IGFiYyBhY1xuLy8gYXswLi4zfWQgLT4gYTBkIGExZCBhMmQgYTNkXG4vLyBhe2IsY3tkLGV9Zn1nIC0+IGFiZyBhY2RmZyBhY2VmZ1xuLy8gYXtiLGN9ZHtlLGZ9ZyAtPiBhYmRlZyBhY2RlZyBhYmRlZyBhYmRmZ1xuLy9cbi8vIEludmFsaWQgc2V0cyBhcmUgbm90IGV4cGFuZGVkLlxuLy8gYXsyLi59YiAtPiBhezIuLn1iXG4vLyBhe2J9YyAtPiBhe2J9Y1xubWluaW1hdGNoLmJyYWNlRXhwYW5kID0gZnVuY3Rpb24gKHBhdHRlcm4sIG9wdGlvbnMpIHtcbiAgcmV0dXJuIGJyYWNlRXhwYW5kKHBhdHRlcm4sIG9wdGlvbnMpXG59XG5cbk1pbmltYXRjaC5wcm90b3R5cGUuYnJhY2VFeHBhbmQgPSBicmFjZUV4cGFuZFxuXG5mdW5jdGlvbiBicmFjZUV4cGFuZCAocGF0dGVybiwgb3B0aW9ucykge1xuICBpZiAoIW9wdGlvbnMpIHtcbiAgICBpZiAodGhpcyBpbnN0YW5jZW9mIE1pbmltYXRjaCkge1xuICAgICAgb3B0aW9ucyA9IHRoaXMub3B0aW9uc1xuICAgIH0gZWxzZSB7XG4gICAgICBvcHRpb25zID0ge31cbiAgICB9XG4gIH1cblxuICBwYXR0ZXJuID0gdHlwZW9mIHBhdHRlcm4gPT09ICd1bmRlZmluZWQnXG4gICAgPyB0aGlzLnBhdHRlcm4gOiBwYXR0ZXJuXG5cbiAgaWYgKHR5cGVvZiBwYXR0ZXJuID09PSAndW5kZWZpbmVkJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3VuZGVmaW5lZCBwYXR0ZXJuJylcbiAgfVxuXG4gIGlmIChvcHRpb25zLm5vYnJhY2UgfHxcbiAgICAhcGF0dGVybi5tYXRjaCgvXFx7LipcXH0vKSkge1xuICAgIC8vIHNob3J0Y3V0LiBubyBuZWVkIHRvIGV4cGFuZC5cbiAgICByZXR1cm4gW3BhdHRlcm5dXG4gIH1cblxuICByZXR1cm4gZXhwYW5kKHBhdHRlcm4pXG59XG5cbi8vIHBhcnNlIGEgY29tcG9uZW50IG9mIHRoZSBleHBhbmRlZCBzZXQuXG4vLyBBdCB0aGlzIHBvaW50LCBubyBwYXR0ZXJuIG1heSBjb250YWluIFwiL1wiIGluIGl0XG4vLyBzbyB3ZSdyZSBnb2luZyB0byByZXR1cm4gYSAyZCBhcnJheSwgd2hlcmUgZWFjaCBlbnRyeSBpcyB0aGUgZnVsbFxuLy8gcGF0dGVybiwgc3BsaXQgb24gJy8nLCBhbmQgdGhlbiB0dXJuZWQgaW50byBhIHJlZ3VsYXIgZXhwcmVzc2lvbi5cbi8vIEEgcmVnZXhwIGlzIG1hZGUgYXQgdGhlIGVuZCB3aGljaCBqb2lucyBlYWNoIGFycmF5IHdpdGggYW5cbi8vIGVzY2FwZWQgLywgYW5kIGFub3RoZXIgZnVsbCBvbmUgd2hpY2ggam9pbnMgZWFjaCByZWdleHAgd2l0aCB8LlxuLy9cbi8vIEZvbGxvd2luZyB0aGUgbGVhZCBvZiBCYXNoIDQuMSwgbm90ZSB0aGF0IFwiKipcIiBvbmx5IGhhcyBzcGVjaWFsIG1lYW5pbmdcbi8vIHdoZW4gaXQgaXMgdGhlICpvbmx5KiB0aGluZyBpbiBhIHBhdGggcG9ydGlvbi4gIE90aGVyd2lzZSwgYW55IHNlcmllc1xuLy8gb2YgKiBpcyBlcXVpdmFsZW50IHRvIGEgc2luZ2xlICouICBHbG9ic3RhciBiZWhhdmlvciBpcyBlbmFibGVkIGJ5XG4vLyBkZWZhdWx0LCBhbmQgY2FuIGJlIGRpc2FibGVkIGJ5IHNldHRpbmcgb3B0aW9ucy5ub2dsb2JzdGFyLlxuTWluaW1hdGNoLnByb3RvdHlwZS5wYXJzZSA9IHBhcnNlXG52YXIgU1VCUEFSU0UgPSB7fVxuZnVuY3Rpb24gcGFyc2UgKHBhdHRlcm4sIGlzU3ViKSB7XG4gIGlmIChwYXR0ZXJuLmxlbmd0aCA+IDEwMjQgKiA2NCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3BhdHRlcm4gaXMgdG9vIGxvbmcnKVxuICB9XG5cbiAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnNcblxuICAvLyBzaG9ydGN1dHNcbiAgaWYgKCFvcHRpb25zLm5vZ2xvYnN0YXIgJiYgcGF0dGVybiA9PT0gJyoqJykgcmV0dXJuIEdMT0JTVEFSXG4gIGlmIChwYXR0ZXJuID09PSAnJykgcmV0dXJuICcnXG5cbiAgdmFyIHJlID0gJydcbiAgdmFyIGhhc01hZ2ljID0gISFvcHRpb25zLm5vY2FzZVxuICB2YXIgZXNjYXBpbmcgPSBmYWxzZVxuICAvLyA/ID0+IG9uZSBzaW5nbGUgY2hhcmFjdGVyXG4gIHZhciBwYXR0ZXJuTGlzdFN0YWNrID0gW11cbiAgdmFyIG5lZ2F0aXZlTGlzdHMgPSBbXVxuICB2YXIgc3RhdGVDaGFyXG4gIHZhciBpbkNsYXNzID0gZmFsc2VcbiAgdmFyIHJlQ2xhc3NTdGFydCA9IC0xXG4gIHZhciBjbGFzc1N0YXJ0ID0gLTFcbiAgLy8gLiBhbmQgLi4gbmV2ZXIgbWF0Y2ggYW55dGhpbmcgdGhhdCBkb2Vzbid0IHN0YXJ0IHdpdGggLixcbiAgLy8gZXZlbiB3aGVuIG9wdGlvbnMuZG90IGlzIHNldC5cbiAgdmFyIHBhdHRlcm5TdGFydCA9IHBhdHRlcm4uY2hhckF0KDApID09PSAnLicgPyAnJyAvLyBhbnl0aGluZ1xuICAvLyBub3QgKHN0YXJ0IG9yIC8gZm9sbG93ZWQgYnkgLiBvciAuLiBmb2xsb3dlZCBieSAvIG9yIGVuZClcbiAgOiBvcHRpb25zLmRvdCA/ICcoPyEoPzpefFxcXFxcXC8pXFxcXC57MSwyfSg/OiR8XFxcXFxcLykpJ1xuICA6ICcoPyFcXFxcLiknXG4gIHZhciBzZWxmID0gdGhpc1xuXG4gIGZ1bmN0aW9uIGNsZWFyU3RhdGVDaGFyICgpIHtcbiAgICBpZiAoc3RhdGVDaGFyKSB7XG4gICAgICAvLyB3ZSBoYWQgc29tZSBzdGF0ZS10cmFja2luZyBjaGFyYWN0ZXJcbiAgICAgIC8vIHRoYXQgd2Fzbid0IGNvbnN1bWVkIGJ5IHRoaXMgcGFzcy5cbiAgICAgIHN3aXRjaCAoc3RhdGVDaGFyKSB7XG4gICAgICAgIGNhc2UgJyonOlxuICAgICAgICAgIHJlICs9IHN0YXJcbiAgICAgICAgICBoYXNNYWdpYyA9IHRydWVcbiAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnPyc6XG4gICAgICAgICAgcmUgKz0gcW1hcmtcbiAgICAgICAgICBoYXNNYWdpYyA9IHRydWVcbiAgICAgICAgYnJlYWtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICByZSArPSAnXFxcXCcgKyBzdGF0ZUNoYXJcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICAgIHNlbGYuZGVidWcoJ2NsZWFyU3RhdGVDaGFyICVqICVqJywgc3RhdGVDaGFyLCByZSlcbiAgICAgIHN0YXRlQ2hhciA9IGZhbHNlXG4gICAgfVxuICB9XG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHBhdHRlcm4ubGVuZ3RoLCBjXG4gICAgOyAoaSA8IGxlbikgJiYgKGMgPSBwYXR0ZXJuLmNoYXJBdChpKSlcbiAgICA7IGkrKykge1xuICAgIHRoaXMuZGVidWcoJyVzXFx0JXMgJXMgJWonLCBwYXR0ZXJuLCBpLCByZSwgYylcblxuICAgIC8vIHNraXAgb3ZlciBhbnkgdGhhdCBhcmUgZXNjYXBlZC5cbiAgICBpZiAoZXNjYXBpbmcgJiYgcmVTcGVjaWFsc1tjXSkge1xuICAgICAgcmUgKz0gJ1xcXFwnICsgY1xuICAgICAgZXNjYXBpbmcgPSBmYWxzZVxuICAgICAgY29udGludWVcbiAgICB9XG5cbiAgICBzd2l0Y2ggKGMpIHtcbiAgICAgIGNhc2UgJy8nOlxuICAgICAgICAvLyBjb21wbGV0ZWx5IG5vdCBhbGxvd2VkLCBldmVuIGVzY2FwZWQuXG4gICAgICAgIC8vIFNob3VsZCBhbHJlYWR5IGJlIHBhdGgtc3BsaXQgYnkgbm93LlxuICAgICAgICByZXR1cm4gZmFsc2VcblxuICAgICAgY2FzZSAnXFxcXCc6XG4gICAgICAgIGNsZWFyU3RhdGVDaGFyKClcbiAgICAgICAgZXNjYXBpbmcgPSB0cnVlXG4gICAgICBjb250aW51ZVxuXG4gICAgICAvLyB0aGUgdmFyaW91cyBzdGF0ZUNoYXIgdmFsdWVzXG4gICAgICAvLyBmb3IgdGhlIFwiZXh0Z2xvYlwiIHN0dWZmLlxuICAgICAgY2FzZSAnPyc6XG4gICAgICBjYXNlICcqJzpcbiAgICAgIGNhc2UgJysnOlxuICAgICAgY2FzZSAnQCc6XG4gICAgICBjYXNlICchJzpcbiAgICAgICAgdGhpcy5kZWJ1ZygnJXNcXHQlcyAlcyAlaiA8LS0gc3RhdGVDaGFyJywgcGF0dGVybiwgaSwgcmUsIGMpXG5cbiAgICAgICAgLy8gYWxsIG9mIHRob3NlIGFyZSBsaXRlcmFscyBpbnNpZGUgYSBjbGFzcywgZXhjZXB0IHRoYXRcbiAgICAgICAgLy8gdGhlIGdsb2IgWyFhXSBtZWFucyBbXmFdIGluIHJlZ2V4cFxuICAgICAgICBpZiAoaW5DbGFzcykge1xuICAgICAgICAgIHRoaXMuZGVidWcoJyAgaW4gY2xhc3MnKVxuICAgICAgICAgIGlmIChjID09PSAnIScgJiYgaSA9PT0gY2xhc3NTdGFydCArIDEpIGMgPSAnXidcbiAgICAgICAgICByZSArPSBjXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlmIHdlIGFscmVhZHkgaGF2ZSBhIHN0YXRlQ2hhciwgdGhlbiBpdCBtZWFuc1xuICAgICAgICAvLyB0aGF0IHRoZXJlIHdhcyBzb21ldGhpbmcgbGlrZSAqKiBvciArPyBpbiB0aGVyZS5cbiAgICAgICAgLy8gSGFuZGxlIHRoZSBzdGF0ZUNoYXIsIHRoZW4gcHJvY2VlZCB3aXRoIHRoaXMgb25lLlxuICAgICAgICBzZWxmLmRlYnVnKCdjYWxsIGNsZWFyU3RhdGVDaGFyICVqJywgc3RhdGVDaGFyKVxuICAgICAgICBjbGVhclN0YXRlQ2hhcigpXG4gICAgICAgIHN0YXRlQ2hhciA9IGNcbiAgICAgICAgLy8gaWYgZXh0Z2xvYiBpcyBkaXNhYmxlZCwgdGhlbiArKGFzZGZ8Zm9vKSBpc24ndCBhIHRoaW5nLlxuICAgICAgICAvLyBqdXN0IGNsZWFyIHRoZSBzdGF0ZWNoYXIgKm5vdyosIHJhdGhlciB0aGFuIGV2ZW4gZGl2aW5nIGludG9cbiAgICAgICAgLy8gdGhlIHBhdHRlcm5MaXN0IHN0dWZmLlxuICAgICAgICBpZiAob3B0aW9ucy5ub2V4dCkgY2xlYXJTdGF0ZUNoYXIoKVxuICAgICAgY29udGludWVcblxuICAgICAgY2FzZSAnKCc6XG4gICAgICAgIGlmIChpbkNsYXNzKSB7XG4gICAgICAgICAgcmUgKz0gJygnXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghc3RhdGVDaGFyKSB7XG4gICAgICAgICAgcmUgKz0gJ1xcXFwoJ1xuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICBwYXR0ZXJuTGlzdFN0YWNrLnB1c2goe1xuICAgICAgICAgIHR5cGU6IHN0YXRlQ2hhcixcbiAgICAgICAgICBzdGFydDogaSAtIDEsXG4gICAgICAgICAgcmVTdGFydDogcmUubGVuZ3RoLFxuICAgICAgICAgIG9wZW46IHBsVHlwZXNbc3RhdGVDaGFyXS5vcGVuLFxuICAgICAgICAgIGNsb3NlOiBwbFR5cGVzW3N0YXRlQ2hhcl0uY2xvc2VcbiAgICAgICAgfSlcbiAgICAgICAgLy8gbmVnYXRpb24gaXMgKD86KD8hanMpW14vXSopXG4gICAgICAgIHJlICs9IHN0YXRlQ2hhciA9PT0gJyEnID8gJyg/Oig/ISg/OicgOiAnKD86J1xuICAgICAgICB0aGlzLmRlYnVnKCdwbFR5cGUgJWogJWonLCBzdGF0ZUNoYXIsIHJlKVxuICAgICAgICBzdGF0ZUNoYXIgPSBmYWxzZVxuICAgICAgY29udGludWVcblxuICAgICAgY2FzZSAnKSc6XG4gICAgICAgIGlmIChpbkNsYXNzIHx8ICFwYXR0ZXJuTGlzdFN0YWNrLmxlbmd0aCkge1xuICAgICAgICAgIHJlICs9ICdcXFxcKSdcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgY2xlYXJTdGF0ZUNoYXIoKVxuICAgICAgICBoYXNNYWdpYyA9IHRydWVcbiAgICAgICAgdmFyIHBsID0gcGF0dGVybkxpc3RTdGFjay5wb3AoKVxuICAgICAgICAvLyBuZWdhdGlvbiBpcyAoPzooPyFqcylbXi9dKilcbiAgICAgICAgLy8gVGhlIG90aGVycyBhcmUgKD86PHBhdHRlcm4+KTx0eXBlPlxuICAgICAgICByZSArPSBwbC5jbG9zZVxuICAgICAgICBpZiAocGwudHlwZSA9PT0gJyEnKSB7XG4gICAgICAgICAgbmVnYXRpdmVMaXN0cy5wdXNoKHBsKVxuICAgICAgICB9XG4gICAgICAgIHBsLnJlRW5kID0gcmUubGVuZ3RoXG4gICAgICBjb250aW51ZVxuXG4gICAgICBjYXNlICd8JzpcbiAgICAgICAgaWYgKGluQ2xhc3MgfHwgIXBhdHRlcm5MaXN0U3RhY2subGVuZ3RoIHx8IGVzY2FwaW5nKSB7XG4gICAgICAgICAgcmUgKz0gJ1xcXFx8J1xuICAgICAgICAgIGVzY2FwaW5nID0gZmFsc2VcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgY2xlYXJTdGF0ZUNoYXIoKVxuICAgICAgICByZSArPSAnfCdcbiAgICAgIGNvbnRpbnVlXG5cbiAgICAgIC8vIHRoZXNlIGFyZSBtb3N0bHkgdGhlIHNhbWUgaW4gcmVnZXhwIGFuZCBnbG9iXG4gICAgICBjYXNlICdbJzpcbiAgICAgICAgLy8gc3dhbGxvdyBhbnkgc3RhdGUtdHJhY2tpbmcgY2hhciBiZWZvcmUgdGhlIFtcbiAgICAgICAgY2xlYXJTdGF0ZUNoYXIoKVxuXG4gICAgICAgIGlmIChpbkNsYXNzKSB7XG4gICAgICAgICAgcmUgKz0gJ1xcXFwnICsgY1xuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICBpbkNsYXNzID0gdHJ1ZVxuICAgICAgICBjbGFzc1N0YXJ0ID0gaVxuICAgICAgICByZUNsYXNzU3RhcnQgPSByZS5sZW5ndGhcbiAgICAgICAgcmUgKz0gY1xuICAgICAgY29udGludWVcblxuICAgICAgY2FzZSAnXSc6XG4gICAgICAgIC8vICBhIHJpZ2h0IGJyYWNrZXQgc2hhbGwgbG9zZSBpdHMgc3BlY2lhbFxuICAgICAgICAvLyAgbWVhbmluZyBhbmQgcmVwcmVzZW50IGl0c2VsZiBpblxuICAgICAgICAvLyAgYSBicmFja2V0IGV4cHJlc3Npb24gaWYgaXQgb2NjdXJzXG4gICAgICAgIC8vICBmaXJzdCBpbiB0aGUgbGlzdC4gIC0tIFBPU0lYLjIgMi44LjMuMlxuICAgICAgICBpZiAoaSA9PT0gY2xhc3NTdGFydCArIDEgfHwgIWluQ2xhc3MpIHtcbiAgICAgICAgICByZSArPSAnXFxcXCcgKyBjXG4gICAgICAgICAgZXNjYXBpbmcgPSBmYWxzZVxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICAvLyBoYW5kbGUgdGhlIGNhc2Ugd2hlcmUgd2UgbGVmdCBhIGNsYXNzIG9wZW4uXG4gICAgICAgIC8vIFwiW3otYV1cIiBpcyB2YWxpZCwgZXF1aXZhbGVudCB0byBcIlxcW3otYVxcXVwiXG4gICAgICAgIGlmIChpbkNsYXNzKSB7XG4gICAgICAgICAgLy8gc3BsaXQgd2hlcmUgdGhlIGxhc3QgWyB3YXMsIG1ha2Ugc3VyZSB3ZSBkb24ndCBoYXZlXG4gICAgICAgICAgLy8gYW4gaW52YWxpZCByZS4gaWYgc28sIHJlLXdhbGsgdGhlIGNvbnRlbnRzIG9mIHRoZVxuICAgICAgICAgIC8vIHdvdWxkLWJlIGNsYXNzIHRvIHJlLXRyYW5zbGF0ZSBhbnkgY2hhcmFjdGVycyB0aGF0XG4gICAgICAgICAgLy8gd2VyZSBwYXNzZWQgdGhyb3VnaCBhcy1pc1xuICAgICAgICAgIC8vIFRPRE86IEl0IHdvdWxkIHByb2JhYmx5IGJlIGZhc3RlciB0byBkZXRlcm1pbmUgdGhpc1xuICAgICAgICAgIC8vIHdpdGhvdXQgYSB0cnkvY2F0Y2ggYW5kIGEgbmV3IFJlZ0V4cCwgYnV0IGl0J3MgdHJpY2t5XG4gICAgICAgICAgLy8gdG8gZG8gc2FmZWx5LiAgRm9yIG5vdywgdGhpcyBpcyBzYWZlIGFuZCB3b3Jrcy5cbiAgICAgICAgICB2YXIgY3MgPSBwYXR0ZXJuLnN1YnN0cmluZyhjbGFzc1N0YXJ0ICsgMSwgaSlcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgUmVnRXhwKCdbJyArIGNzICsgJ10nKVxuICAgICAgICAgIH0gY2F0Y2ggKGVyKSB7XG4gICAgICAgICAgICAvLyBub3QgYSB2YWxpZCBjbGFzcyFcbiAgICAgICAgICAgIHZhciBzcCA9IHRoaXMucGFyc2UoY3MsIFNVQlBBUlNFKVxuICAgICAgICAgICAgcmUgPSByZS5zdWJzdHIoMCwgcmVDbGFzc1N0YXJ0KSArICdcXFxcWycgKyBzcFswXSArICdcXFxcXSdcbiAgICAgICAgICAgIGhhc01hZ2ljID0gaGFzTWFnaWMgfHwgc3BbMV1cbiAgICAgICAgICAgIGluQ2xhc3MgPSBmYWxzZVxuICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBmaW5pc2ggdXAgdGhlIGNsYXNzLlxuICAgICAgICBoYXNNYWdpYyA9IHRydWVcbiAgICAgICAgaW5DbGFzcyA9IGZhbHNlXG4gICAgICAgIHJlICs9IGNcbiAgICAgIGNvbnRpbnVlXG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIC8vIHN3YWxsb3cgYW55IHN0YXRlIGNoYXIgdGhhdCB3YXNuJ3QgY29uc3VtZWRcbiAgICAgICAgY2xlYXJTdGF0ZUNoYXIoKVxuXG4gICAgICAgIGlmIChlc2NhcGluZykge1xuICAgICAgICAgIC8vIG5vIG5lZWRcbiAgICAgICAgICBlc2NhcGluZyA9IGZhbHNlXG4gICAgICAgIH0gZWxzZSBpZiAocmVTcGVjaWFsc1tjXVxuICAgICAgICAgICYmICEoYyA9PT0gJ14nICYmIGluQ2xhc3MpKSB7XG4gICAgICAgICAgcmUgKz0gJ1xcXFwnXG4gICAgICAgIH1cblxuICAgICAgICByZSArPSBjXG5cbiAgICB9IC8vIHN3aXRjaFxuICB9IC8vIGZvclxuXG4gIC8vIGhhbmRsZSB0aGUgY2FzZSB3aGVyZSB3ZSBsZWZ0IGEgY2xhc3Mgb3Blbi5cbiAgLy8gXCJbYWJjXCIgaXMgdmFsaWQsIGVxdWl2YWxlbnQgdG8gXCJcXFthYmNcIlxuICBpZiAoaW5DbGFzcykge1xuICAgIC8vIHNwbGl0IHdoZXJlIHRoZSBsYXN0IFsgd2FzLCBhbmQgZXNjYXBlIGl0XG4gICAgLy8gdGhpcyBpcyBhIGh1Z2UgcGl0YS4gIFdlIG5vdyBoYXZlIHRvIHJlLXdhbGtcbiAgICAvLyB0aGUgY29udGVudHMgb2YgdGhlIHdvdWxkLWJlIGNsYXNzIHRvIHJlLXRyYW5zbGF0ZVxuICAgIC8vIGFueSBjaGFyYWN0ZXJzIHRoYXQgd2VyZSBwYXNzZWQgdGhyb3VnaCBhcy1pc1xuICAgIGNzID0gcGF0dGVybi5zdWJzdHIoY2xhc3NTdGFydCArIDEpXG4gICAgc3AgPSB0aGlzLnBhcnNlKGNzLCBTVUJQQVJTRSlcbiAgICByZSA9IHJlLnN1YnN0cigwLCByZUNsYXNzU3RhcnQpICsgJ1xcXFxbJyArIHNwWzBdXG4gICAgaGFzTWFnaWMgPSBoYXNNYWdpYyB8fCBzcFsxXVxuICB9XG5cbiAgLy8gaGFuZGxlIHRoZSBjYXNlIHdoZXJlIHdlIGhhZCBhICsoIHRoaW5nIGF0IHRoZSAqZW5kKlxuICAvLyBvZiB0aGUgcGF0dGVybi5cbiAgLy8gZWFjaCBwYXR0ZXJuIGxpc3Qgc3RhY2sgYWRkcyAzIGNoYXJzLCBhbmQgd2UgbmVlZCB0byBnbyB0aHJvdWdoXG4gIC8vIGFuZCBlc2NhcGUgYW55IHwgY2hhcnMgdGhhdCB3ZXJlIHBhc3NlZCB0aHJvdWdoIGFzLWlzIGZvciB0aGUgcmVnZXhwLlxuICAvLyBHbyB0aHJvdWdoIGFuZCBlc2NhcGUgdGhlbSwgdGFraW5nIGNhcmUgbm90IHRvIGRvdWJsZS1lc2NhcGUgYW55XG4gIC8vIHwgY2hhcnMgdGhhdCB3ZXJlIGFscmVhZHkgZXNjYXBlZC5cbiAgZm9yIChwbCA9IHBhdHRlcm5MaXN0U3RhY2sucG9wKCk7IHBsOyBwbCA9IHBhdHRlcm5MaXN0U3RhY2sucG9wKCkpIHtcbiAgICB2YXIgdGFpbCA9IHJlLnNsaWNlKHBsLnJlU3RhcnQgKyBwbC5vcGVuLmxlbmd0aClcbiAgICB0aGlzLmRlYnVnKCdzZXR0aW5nIHRhaWwnLCByZSwgcGwpXG4gICAgLy8gbWF5YmUgc29tZSBldmVuIG51bWJlciBvZiBcXCwgdGhlbiBtYXliZSAxIFxcLCBmb2xsb3dlZCBieSBhIHxcbiAgICB0YWlsID0gdGFpbC5yZXBsYWNlKC8oKD86XFxcXHsyfSl7MCw2NH0pKFxcXFw/KVxcfC9nLCBmdW5jdGlvbiAoXywgJDEsICQyKSB7XG4gICAgICBpZiAoISQyKSB7XG4gICAgICAgIC8vIHRoZSB8IGlzbid0IGFscmVhZHkgZXNjYXBlZCwgc28gZXNjYXBlIGl0LlxuICAgICAgICAkMiA9ICdcXFxcJ1xuICAgICAgfVxuXG4gICAgICAvLyBuZWVkIHRvIGVzY2FwZSBhbGwgdGhvc2Ugc2xhc2hlcyAqYWdhaW4qLCB3aXRob3V0IGVzY2FwaW5nIHRoZVxuICAgICAgLy8gb25lIHRoYXQgd2UgbmVlZCBmb3IgZXNjYXBpbmcgdGhlIHwgY2hhcmFjdGVyLiAgQXMgaXQgd29ya3Mgb3V0LFxuICAgICAgLy8gZXNjYXBpbmcgYW4gZXZlbiBudW1iZXIgb2Ygc2xhc2hlcyBjYW4gYmUgZG9uZSBieSBzaW1wbHkgcmVwZWF0aW5nXG4gICAgICAvLyBpdCBleGFjdGx5IGFmdGVyIGl0c2VsZi4gIFRoYXQncyB3aHkgdGhpcyB0cmljayB3b3Jrcy5cbiAgICAgIC8vXG4gICAgICAvLyBJIGFtIHNvcnJ5IHRoYXQgeW91IGhhdmUgdG8gc2VlIHRoaXMuXG4gICAgICByZXR1cm4gJDEgKyAkMSArICQyICsgJ3wnXG4gICAgfSlcblxuICAgIHRoaXMuZGVidWcoJ3RhaWw9JWpcXG4gICAlcycsIHRhaWwsIHRhaWwsIHBsLCByZSlcbiAgICB2YXIgdCA9IHBsLnR5cGUgPT09ICcqJyA/IHN0YXJcbiAgICAgIDogcGwudHlwZSA9PT0gJz8nID8gcW1hcmtcbiAgICAgIDogJ1xcXFwnICsgcGwudHlwZVxuXG4gICAgaGFzTWFnaWMgPSB0cnVlXG4gICAgcmUgPSByZS5zbGljZSgwLCBwbC5yZVN0YXJ0KSArIHQgKyAnXFxcXCgnICsgdGFpbFxuICB9XG5cbiAgLy8gaGFuZGxlIHRyYWlsaW5nIHRoaW5ncyB0aGF0IG9ubHkgbWF0dGVyIGF0IHRoZSB2ZXJ5IGVuZC5cbiAgY2xlYXJTdGF0ZUNoYXIoKVxuICBpZiAoZXNjYXBpbmcpIHtcbiAgICAvLyB0cmFpbGluZyBcXFxcXG4gICAgcmUgKz0gJ1xcXFxcXFxcJ1xuICB9XG5cbiAgLy8gb25seSBuZWVkIHRvIGFwcGx5IHRoZSBub2RvdCBzdGFydCBpZiB0aGUgcmUgc3RhcnRzIHdpdGhcbiAgLy8gc29tZXRoaW5nIHRoYXQgY291bGQgY29uY2VpdmFibHkgY2FwdHVyZSBhIGRvdFxuICB2YXIgYWRkUGF0dGVyblN0YXJ0ID0gZmFsc2VcbiAgc3dpdGNoIChyZS5jaGFyQXQoMCkpIHtcbiAgICBjYXNlICcuJzpcbiAgICBjYXNlICdbJzpcbiAgICBjYXNlICcoJzogYWRkUGF0dGVyblN0YXJ0ID0gdHJ1ZVxuICB9XG5cbiAgLy8gSGFjayB0byB3b3JrIGFyb3VuZCBsYWNrIG9mIG5lZ2F0aXZlIGxvb2tiZWhpbmQgaW4gSlNcbiAgLy8gQSBwYXR0ZXJuIGxpa2U6ICouISh4KS4hKHl8eikgbmVlZHMgdG8gZW5zdXJlIHRoYXQgYSBuYW1lXG4gIC8vIGxpa2UgJ2EueHl6Lnl6JyBkb2Vzbid0IG1hdGNoLiAgU28sIHRoZSBmaXJzdCBuZWdhdGl2ZVxuICAvLyBsb29rYWhlYWQsIGhhcyB0byBsb29rIEFMTCB0aGUgd2F5IGFoZWFkLCB0byB0aGUgZW5kIG9mXG4gIC8vIHRoZSBwYXR0ZXJuLlxuICBmb3IgKHZhciBuID0gbmVnYXRpdmVMaXN0cy5sZW5ndGggLSAxOyBuID4gLTE7IG4tLSkge1xuICAgIHZhciBubCA9IG5lZ2F0aXZlTGlzdHNbbl1cblxuICAgIHZhciBubEJlZm9yZSA9IHJlLnNsaWNlKDAsIG5sLnJlU3RhcnQpXG4gICAgdmFyIG5sRmlyc3QgPSByZS5zbGljZShubC5yZVN0YXJ0LCBubC5yZUVuZCAtIDgpXG4gICAgdmFyIG5sTGFzdCA9IHJlLnNsaWNlKG5sLnJlRW5kIC0gOCwgbmwucmVFbmQpXG4gICAgdmFyIG5sQWZ0ZXIgPSByZS5zbGljZShubC5yZUVuZClcblxuICAgIG5sTGFzdCArPSBubEFmdGVyXG5cbiAgICAvLyBIYW5kbGUgbmVzdGVkIHN0dWZmIGxpa2UgKigqLmpzfCEoKi5qc29uKSksIHdoZXJlIG9wZW4gcGFyZW5zXG4gICAgLy8gbWVhbiB0aGF0IHdlIHNob3VsZCAqbm90KiBpbmNsdWRlIHRoZSApIGluIHRoZSBiaXQgdGhhdCBpcyBjb25zaWRlcmVkXG4gICAgLy8gXCJhZnRlclwiIHRoZSBuZWdhdGVkIHNlY3Rpb24uXG4gICAgdmFyIG9wZW5QYXJlbnNCZWZvcmUgPSBubEJlZm9yZS5zcGxpdCgnKCcpLmxlbmd0aCAtIDFcbiAgICB2YXIgY2xlYW5BZnRlciA9IG5sQWZ0ZXJcbiAgICBmb3IgKGkgPSAwOyBpIDwgb3BlblBhcmVuc0JlZm9yZTsgaSsrKSB7XG4gICAgICBjbGVhbkFmdGVyID0gY2xlYW5BZnRlci5yZXBsYWNlKC9cXClbKyo/XT8vLCAnJylcbiAgICB9XG4gICAgbmxBZnRlciA9IGNsZWFuQWZ0ZXJcblxuICAgIHZhciBkb2xsYXIgPSAnJ1xuICAgIGlmIChubEFmdGVyID09PSAnJyAmJiBpc1N1YiAhPT0gU1VCUEFSU0UpIHtcbiAgICAgIGRvbGxhciA9ICckJ1xuICAgIH1cbiAgICB2YXIgbmV3UmUgPSBubEJlZm9yZSArIG5sRmlyc3QgKyBubEFmdGVyICsgZG9sbGFyICsgbmxMYXN0XG4gICAgcmUgPSBuZXdSZVxuICB9XG5cbiAgLy8gaWYgdGhlIHJlIGlzIG5vdCBcIlwiIGF0IHRoaXMgcG9pbnQsIHRoZW4gd2UgbmVlZCB0byBtYWtlIHN1cmVcbiAgLy8gaXQgZG9lc24ndCBtYXRjaCBhZ2FpbnN0IGFuIGVtcHR5IHBhdGggcGFydC5cbiAgLy8gT3RoZXJ3aXNlIGEvKiB3aWxsIG1hdGNoIGEvLCB3aGljaCBpdCBzaG91bGQgbm90LlxuICBpZiAocmUgIT09ICcnICYmIGhhc01hZ2ljKSB7XG4gICAgcmUgPSAnKD89LiknICsgcmVcbiAgfVxuXG4gIGlmIChhZGRQYXR0ZXJuU3RhcnQpIHtcbiAgICByZSA9IHBhdHRlcm5TdGFydCArIHJlXG4gIH1cblxuICAvLyBwYXJzaW5nIGp1c3QgYSBwaWVjZSBvZiBhIGxhcmdlciBwYXR0ZXJuLlxuICBpZiAoaXNTdWIgPT09IFNVQlBBUlNFKSB7XG4gICAgcmV0dXJuIFtyZSwgaGFzTWFnaWNdXG4gIH1cblxuICAvLyBza2lwIHRoZSByZWdleHAgZm9yIG5vbi1tYWdpY2FsIHBhdHRlcm5zXG4gIC8vIHVuZXNjYXBlIGFueXRoaW5nIGluIGl0LCB0aG91Z2gsIHNvIHRoYXQgaXQnbGwgYmVcbiAgLy8gYW4gZXhhY3QgbWF0Y2ggYWdhaW5zdCBhIGZpbGUgZXRjLlxuICBpZiAoIWhhc01hZ2ljKSB7XG4gICAgcmV0dXJuIGdsb2JVbmVzY2FwZShwYXR0ZXJuKVxuICB9XG5cbiAgdmFyIGZsYWdzID0gb3B0aW9ucy5ub2Nhc2UgPyAnaScgOiAnJ1xuICB0cnkge1xuICAgIHZhciByZWdFeHAgPSBuZXcgUmVnRXhwKCdeJyArIHJlICsgJyQnLCBmbGFncylcbiAgfSBjYXRjaCAoZXIpIHtcbiAgICAvLyBJZiBpdCB3YXMgYW4gaW52YWxpZCByZWd1bGFyIGV4cHJlc3Npb24sIHRoZW4gaXQgY2FuJ3QgbWF0Y2hcbiAgICAvLyBhbnl0aGluZy4gIFRoaXMgdHJpY2sgbG9va3MgZm9yIGEgY2hhcmFjdGVyIGFmdGVyIHRoZSBlbmQgb2ZcbiAgICAvLyB0aGUgc3RyaW5nLCB3aGljaCBpcyBvZiBjb3Vyc2UgaW1wb3NzaWJsZSwgZXhjZXB0IGluIG11bHRpLWxpbmVcbiAgICAvLyBtb2RlLCBidXQgaXQncyBub3QgYSAvbSByZWdleC5cbiAgICByZXR1cm4gbmV3IFJlZ0V4cCgnJC4nKVxuICB9XG5cbiAgcmVnRXhwLl9nbG9iID0gcGF0dGVyblxuICByZWdFeHAuX3NyYyA9IHJlXG5cbiAgcmV0dXJuIHJlZ0V4cFxufVxuXG5taW5pbWF0Y2gubWFrZVJlID0gZnVuY3Rpb24gKHBhdHRlcm4sIG9wdGlvbnMpIHtcbiAgcmV0dXJuIG5ldyBNaW5pbWF0Y2gocGF0dGVybiwgb3B0aW9ucyB8fCB7fSkubWFrZVJlKClcbn1cblxuTWluaW1hdGNoLnByb3RvdHlwZS5tYWtlUmUgPSBtYWtlUmVcbmZ1bmN0aW9uIG1ha2VSZSAoKSB7XG4gIGlmICh0aGlzLnJlZ2V4cCB8fCB0aGlzLnJlZ2V4cCA9PT0gZmFsc2UpIHJldHVybiB0aGlzLnJlZ2V4cFxuXG4gIC8vIGF0IHRoaXMgcG9pbnQsIHRoaXMuc2V0IGlzIGEgMmQgYXJyYXkgb2YgcGFydGlhbFxuICAvLyBwYXR0ZXJuIHN0cmluZ3MsIG9yIFwiKipcIi5cbiAgLy9cbiAgLy8gSXQncyBiZXR0ZXIgdG8gdXNlIC5tYXRjaCgpLiAgVGhpcyBmdW5jdGlvbiBzaG91bGRuJ3RcbiAgLy8gYmUgdXNlZCwgcmVhbGx5LCBidXQgaXQncyBwcmV0dHkgY29udmVuaWVudCBzb21ldGltZXMsXG4gIC8vIHdoZW4geW91IGp1c3Qgd2FudCB0byB3b3JrIHdpdGggYSByZWdleC5cbiAgdmFyIHNldCA9IHRoaXMuc2V0XG5cbiAgaWYgKCFzZXQubGVuZ3RoKSB7XG4gICAgdGhpcy5yZWdleHAgPSBmYWxzZVxuICAgIHJldHVybiB0aGlzLnJlZ2V4cFxuICB9XG4gIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zXG5cbiAgdmFyIHR3b1N0YXIgPSBvcHRpb25zLm5vZ2xvYnN0YXIgPyBzdGFyXG4gICAgOiBvcHRpb25zLmRvdCA/IHR3b1N0YXJEb3RcbiAgICA6IHR3b1N0YXJOb0RvdFxuICB2YXIgZmxhZ3MgPSBvcHRpb25zLm5vY2FzZSA/ICdpJyA6ICcnXG5cbiAgdmFyIHJlID0gc2V0Lm1hcChmdW5jdGlvbiAocGF0dGVybikge1xuICAgIHJldHVybiBwYXR0ZXJuLm1hcChmdW5jdGlvbiAocCkge1xuICAgICAgcmV0dXJuIChwID09PSBHTE9CU1RBUikgPyB0d29TdGFyXG4gICAgICA6ICh0eXBlb2YgcCA9PT0gJ3N0cmluZycpID8gcmVnRXhwRXNjYXBlKHApXG4gICAgICA6IHAuX3NyY1xuICAgIH0pLmpvaW4oJ1xcXFxcXC8nKVxuICB9KS5qb2luKCd8JylcblxuICAvLyBtdXN0IG1hdGNoIGVudGlyZSBwYXR0ZXJuXG4gIC8vIGVuZGluZyBpbiBhICogb3IgKiogd2lsbCBtYWtlIGl0IGxlc3Mgc3RyaWN0LlxuICByZSA9ICdeKD86JyArIHJlICsgJykkJ1xuXG4gIC8vIGNhbiBtYXRjaCBhbnl0aGluZywgYXMgbG9uZyBhcyBpdCdzIG5vdCB0aGlzLlxuICBpZiAodGhpcy5uZWdhdGUpIHJlID0gJ14oPyEnICsgcmUgKyAnKS4qJCdcblxuICB0cnkge1xuICAgIHRoaXMucmVnZXhwID0gbmV3IFJlZ0V4cChyZSwgZmxhZ3MpXG4gIH0gY2F0Y2ggKGV4KSB7XG4gICAgdGhpcy5yZWdleHAgPSBmYWxzZVxuICB9XG4gIHJldHVybiB0aGlzLnJlZ2V4cFxufVxuXG5taW5pbWF0Y2gubWF0Y2ggPSBmdW5jdGlvbiAobGlzdCwgcGF0dGVybiwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICB2YXIgbW0gPSBuZXcgTWluaW1hdGNoKHBhdHRlcm4sIG9wdGlvbnMpXG4gIGxpc3QgPSBsaXN0LmZpbHRlcihmdW5jdGlvbiAoZikge1xuICAgIHJldHVybiBtbS5tYXRjaChmKVxuICB9KVxuICBpZiAobW0ub3B0aW9ucy5ub251bGwgJiYgIWxpc3QubGVuZ3RoKSB7XG4gICAgbGlzdC5wdXNoKHBhdHRlcm4pXG4gIH1cbiAgcmV0dXJuIGxpc3Rcbn1cblxuTWluaW1hdGNoLnByb3RvdHlwZS5tYXRjaCA9IG1hdGNoXG5mdW5jdGlvbiBtYXRjaCAoZiwgcGFydGlhbCkge1xuICB0aGlzLmRlYnVnKCdtYXRjaCcsIGYsIHRoaXMucGF0dGVybilcbiAgLy8gc2hvcnQtY2lyY3VpdCBpbiB0aGUgY2FzZSBvZiBidXN0ZWQgdGhpbmdzLlxuICAvLyBjb21tZW50cywgZXRjLlxuICBpZiAodGhpcy5jb21tZW50KSByZXR1cm4gZmFsc2VcbiAgaWYgKHRoaXMuZW1wdHkpIHJldHVybiBmID09PSAnJ1xuXG4gIGlmIChmID09PSAnLycgJiYgcGFydGlhbCkgcmV0dXJuIHRydWVcblxuICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9uc1xuXG4gIC8vIHdpbmRvd3M6IG5lZWQgdG8gdXNlIC8sIG5vdCBcXFxuICBpZiAocGF0aC5zZXAgIT09ICcvJykge1xuICAgIGYgPSBmLnNwbGl0KHBhdGguc2VwKS5qb2luKCcvJylcbiAgfVxuXG4gIC8vIHRyZWF0IHRoZSB0ZXN0IHBhdGggYXMgYSBzZXQgb2YgcGF0aHBhcnRzLlxuICBmID0gZi5zcGxpdChzbGFzaFNwbGl0KVxuICB0aGlzLmRlYnVnKHRoaXMucGF0dGVybiwgJ3NwbGl0JywgZilcblxuICAvLyBqdXN0IE9ORSBvZiB0aGUgcGF0dGVybiBzZXRzIGluIHRoaXMuc2V0IG5lZWRzIHRvIG1hdGNoXG4gIC8vIGluIG9yZGVyIGZvciBpdCB0byBiZSB2YWxpZC4gIElmIG5lZ2F0aW5nLCB0aGVuIGp1c3Qgb25lXG4gIC8vIG1hdGNoIG1lYW5zIHRoYXQgd2UgaGF2ZSBmYWlsZWQuXG4gIC8vIEVpdGhlciB3YXksIHJldHVybiBvbiB0aGUgZmlyc3QgaGl0LlxuXG4gIHZhciBzZXQgPSB0aGlzLnNldFxuICB0aGlzLmRlYnVnKHRoaXMucGF0dGVybiwgJ3NldCcsIHNldClcblxuICAvLyBGaW5kIHRoZSBiYXNlbmFtZSBvZiB0aGUgcGF0aCBieSBsb29raW5nIGZvciB0aGUgbGFzdCBub24tZW1wdHkgc2VnbWVudFxuICB2YXIgZmlsZW5hbWVcbiAgdmFyIGlcbiAgZm9yIChpID0gZi5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIGZpbGVuYW1lID0gZltpXVxuICAgIGlmIChmaWxlbmFtZSkgYnJlYWtcbiAgfVxuXG4gIGZvciAoaSA9IDA7IGkgPCBzZXQubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgcGF0dGVybiA9IHNldFtpXVxuICAgIHZhciBmaWxlID0gZlxuICAgIGlmIChvcHRpb25zLm1hdGNoQmFzZSAmJiBwYXR0ZXJuLmxlbmd0aCA9PT0gMSkge1xuICAgICAgZmlsZSA9IFtmaWxlbmFtZV1cbiAgICB9XG4gICAgdmFyIGhpdCA9IHRoaXMubWF0Y2hPbmUoZmlsZSwgcGF0dGVybiwgcGFydGlhbClcbiAgICBpZiAoaGl0KSB7XG4gICAgICBpZiAob3B0aW9ucy5mbGlwTmVnYXRlKSByZXR1cm4gdHJ1ZVxuICAgICAgcmV0dXJuICF0aGlzLm5lZ2F0ZVxuICAgIH1cbiAgfVxuXG4gIC8vIGRpZG4ndCBnZXQgYW55IGhpdHMuICB0aGlzIGlzIHN1Y2Nlc3MgaWYgaXQncyBhIG5lZ2F0aXZlXG4gIC8vIHBhdHRlcm4sIGZhaWx1cmUgb3RoZXJ3aXNlLlxuICBpZiAob3B0aW9ucy5mbGlwTmVnYXRlKSByZXR1cm4gZmFsc2VcbiAgcmV0dXJuIHRoaXMubmVnYXRlXG59XG5cbi8vIHNldCBwYXJ0aWFsIHRvIHRydWUgdG8gdGVzdCBpZiwgZm9yIGV4YW1wbGUsXG4vLyBcIi9hL2JcIiBtYXRjaGVzIHRoZSBzdGFydCBvZiBcIi8qL2IvKi9kXCJcbi8vIFBhcnRpYWwgbWVhbnMsIGlmIHlvdSBydW4gb3V0IG9mIGZpbGUgYmVmb3JlIHlvdSBydW5cbi8vIG91dCBvZiBwYXR0ZXJuLCB0aGVuIHRoYXQncyBmaW5lLCBhcyBsb25nIGFzIGFsbFxuLy8gdGhlIHBhcnRzIG1hdGNoLlxuTWluaW1hdGNoLnByb3RvdHlwZS5tYXRjaE9uZSA9IGZ1bmN0aW9uIChmaWxlLCBwYXR0ZXJuLCBwYXJ0aWFsKSB7XG4gIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zXG5cbiAgdGhpcy5kZWJ1ZygnbWF0Y2hPbmUnLFxuICAgIHsgJ3RoaXMnOiB0aGlzLCBmaWxlOiBmaWxlLCBwYXR0ZXJuOiBwYXR0ZXJuIH0pXG5cbiAgdGhpcy5kZWJ1ZygnbWF0Y2hPbmUnLCBmaWxlLmxlbmd0aCwgcGF0dGVybi5sZW5ndGgpXG5cbiAgZm9yICh2YXIgZmkgPSAwLFxuICAgICAgcGkgPSAwLFxuICAgICAgZmwgPSBmaWxlLmxlbmd0aCxcbiAgICAgIHBsID0gcGF0dGVybi5sZW5ndGhcbiAgICAgIDsgKGZpIDwgZmwpICYmIChwaSA8IHBsKVxuICAgICAgOyBmaSsrLCBwaSsrKSB7XG4gICAgdGhpcy5kZWJ1ZygnbWF0Y2hPbmUgbG9vcCcpXG4gICAgdmFyIHAgPSBwYXR0ZXJuW3BpXVxuICAgIHZhciBmID0gZmlsZVtmaV1cblxuICAgIHRoaXMuZGVidWcocGF0dGVybiwgcCwgZilcblxuICAgIC8vIHNob3VsZCBiZSBpbXBvc3NpYmxlLlxuICAgIC8vIHNvbWUgaW52YWxpZCByZWdleHAgc3R1ZmYgaW4gdGhlIHNldC5cbiAgICBpZiAocCA9PT0gZmFsc2UpIHJldHVybiBmYWxzZVxuXG4gICAgaWYgKHAgPT09IEdMT0JTVEFSKSB7XG4gICAgICB0aGlzLmRlYnVnKCdHTE9CU1RBUicsIFtwYXR0ZXJuLCBwLCBmXSlcblxuICAgICAgLy8gXCIqKlwiXG4gICAgICAvLyBhLyoqL2IvKiovYyB3b3VsZCBtYXRjaCB0aGUgZm9sbG93aW5nOlxuICAgICAgLy8gYS9iL3gveS96L2NcbiAgICAgIC8vIGEveC95L3ovYi9jXG4gICAgICAvLyBhL2IveC9iL3gvY1xuICAgICAgLy8gYS9iL2NcbiAgICAgIC8vIFRvIGRvIHRoaXMsIHRha2UgdGhlIHJlc3Qgb2YgdGhlIHBhdHRlcm4gYWZ0ZXJcbiAgICAgIC8vIHRoZSAqKiwgYW5kIHNlZSBpZiBpdCB3b3VsZCBtYXRjaCB0aGUgZmlsZSByZW1haW5kZXIuXG4gICAgICAvLyBJZiBzbywgcmV0dXJuIHN1Y2Nlc3MuXG4gICAgICAvLyBJZiBub3QsIHRoZSAqKiBcInN3YWxsb3dzXCIgYSBzZWdtZW50LCBhbmQgdHJ5IGFnYWluLlxuICAgICAgLy8gVGhpcyBpcyByZWN1cnNpdmVseSBhd2Z1bC5cbiAgICAgIC8vXG4gICAgICAvLyBhLyoqL2IvKiovYyBtYXRjaGluZyBhL2IveC95L3ovY1xuICAgICAgLy8gLSBhIG1hdGNoZXMgYVxuICAgICAgLy8gLSBkb3VibGVzdGFyXG4gICAgICAvLyAgIC0gbWF0Y2hPbmUoYi94L3kvei9jLCBiLyoqL2MpXG4gICAgICAvLyAgICAgLSBiIG1hdGNoZXMgYlxuICAgICAgLy8gICAgIC0gZG91Ymxlc3RhclxuICAgICAgLy8gICAgICAgLSBtYXRjaE9uZSh4L3kvei9jLCBjKSAtPiBub1xuICAgICAgLy8gICAgICAgLSBtYXRjaE9uZSh5L3ovYywgYykgLT4gbm9cbiAgICAgIC8vICAgICAgIC0gbWF0Y2hPbmUoei9jLCBjKSAtPiBub1xuICAgICAgLy8gICAgICAgLSBtYXRjaE9uZShjLCBjKSB5ZXMsIGhpdFxuICAgICAgdmFyIGZyID0gZmlcbiAgICAgIHZhciBwciA9IHBpICsgMVxuICAgICAgaWYgKHByID09PSBwbCkge1xuICAgICAgICB0aGlzLmRlYnVnKCcqKiBhdCB0aGUgZW5kJylcbiAgICAgICAgLy8gYSAqKiBhdCB0aGUgZW5kIHdpbGwganVzdCBzd2FsbG93IHRoZSByZXN0LlxuICAgICAgICAvLyBXZSBoYXZlIGZvdW5kIGEgbWF0Y2guXG4gICAgICAgIC8vIGhvd2V2ZXIsIGl0IHdpbGwgbm90IHN3YWxsb3cgLy54LCB1bmxlc3NcbiAgICAgICAgLy8gb3B0aW9ucy5kb3QgaXMgc2V0LlxuICAgICAgICAvLyAuIGFuZCAuLiBhcmUgKm5ldmVyKiBtYXRjaGVkIGJ5ICoqLCBmb3IgZXhwbG9zaXZlbHlcbiAgICAgICAgLy8gZXhwb25lbnRpYWwgcmVhc29ucy5cbiAgICAgICAgZm9yICg7IGZpIDwgZmw7IGZpKyspIHtcbiAgICAgICAgICBpZiAoZmlsZVtmaV0gPT09ICcuJyB8fCBmaWxlW2ZpXSA9PT0gJy4uJyB8fFxuICAgICAgICAgICAgKCFvcHRpb25zLmRvdCAmJiBmaWxlW2ZpXS5jaGFyQXQoMCkgPT09ICcuJykpIHJldHVybiBmYWxzZVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG5cbiAgICAgIC8vIG9rLCBsZXQncyBzZWUgaWYgd2UgY2FuIHN3YWxsb3cgd2hhdGV2ZXIgd2UgY2FuLlxuICAgICAgd2hpbGUgKGZyIDwgZmwpIHtcbiAgICAgICAgdmFyIHN3YWxsb3dlZSA9IGZpbGVbZnJdXG5cbiAgICAgICAgdGhpcy5kZWJ1ZygnXFxuZ2xvYnN0YXIgd2hpbGUnLCBmaWxlLCBmciwgcGF0dGVybiwgcHIsIHN3YWxsb3dlZSlcblxuICAgICAgICAvLyBYWFggcmVtb3ZlIHRoaXMgc2xpY2UuICBKdXN0IHBhc3MgdGhlIHN0YXJ0IGluZGV4LlxuICAgICAgICBpZiAodGhpcy5tYXRjaE9uZShmaWxlLnNsaWNlKGZyKSwgcGF0dGVybi5zbGljZShwciksIHBhcnRpYWwpKSB7XG4gICAgICAgICAgdGhpcy5kZWJ1ZygnZ2xvYnN0YXIgZm91bmQgbWF0Y2ghJywgZnIsIGZsLCBzd2FsbG93ZWUpXG4gICAgICAgICAgLy8gZm91bmQgYSBtYXRjaC5cbiAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGNhbid0IHN3YWxsb3cgXCIuXCIgb3IgXCIuLlwiIGV2ZXIuXG4gICAgICAgICAgLy8gY2FuIG9ubHkgc3dhbGxvdyBcIi5mb29cIiB3aGVuIGV4cGxpY2l0bHkgYXNrZWQuXG4gICAgICAgICAgaWYgKHN3YWxsb3dlZSA9PT0gJy4nIHx8IHN3YWxsb3dlZSA9PT0gJy4uJyB8fFxuICAgICAgICAgICAgKCFvcHRpb25zLmRvdCAmJiBzd2FsbG93ZWUuY2hhckF0KDApID09PSAnLicpKSB7XG4gICAgICAgICAgICB0aGlzLmRlYnVnKCdkb3QgZGV0ZWN0ZWQhJywgZmlsZSwgZnIsIHBhdHRlcm4sIHByKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyAqKiBzd2FsbG93cyBhIHNlZ21lbnQsIGFuZCBjb250aW51ZS5cbiAgICAgICAgICB0aGlzLmRlYnVnKCdnbG9ic3RhciBzd2FsbG93IGEgc2VnbWVudCwgYW5kIGNvbnRpbnVlJylcbiAgICAgICAgICBmcisrXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gbm8gbWF0Y2ggd2FzIGZvdW5kLlxuICAgICAgLy8gSG93ZXZlciwgaW4gcGFydGlhbCBtb2RlLCB3ZSBjYW4ndCBzYXkgdGhpcyBpcyBuZWNlc3NhcmlseSBvdmVyLlxuICAgICAgLy8gSWYgdGhlcmUncyBtb3JlICpwYXR0ZXJuKiBsZWZ0LCB0aGVuXG4gICAgICBpZiAocGFydGlhbCkge1xuICAgICAgICAvLyByYW4gb3V0IG9mIGZpbGVcbiAgICAgICAgdGhpcy5kZWJ1ZygnXFxuPj4+IG5vIG1hdGNoLCBwYXJ0aWFsPycsIGZpbGUsIGZyLCBwYXR0ZXJuLCBwcilcbiAgICAgICAgaWYgKGZyID09PSBmbCkgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIC8vIHNvbWV0aGluZyBvdGhlciB0aGFuICoqXG4gICAgLy8gbm9uLW1hZ2ljIHBhdHRlcm5zIGp1c3QgaGF2ZSB0byBtYXRjaCBleGFjdGx5XG4gICAgLy8gcGF0dGVybnMgd2l0aCBtYWdpYyBoYXZlIGJlZW4gdHVybmVkIGludG8gcmVnZXhwcy5cbiAgICB2YXIgaGl0XG4gICAgaWYgKHR5cGVvZiBwID09PSAnc3RyaW5nJykge1xuICAgICAgaWYgKG9wdGlvbnMubm9jYXNlKSB7XG4gICAgICAgIGhpdCA9IGYudG9Mb3dlckNhc2UoKSA9PT0gcC50b0xvd2VyQ2FzZSgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBoaXQgPSBmID09PSBwXG4gICAgICB9XG4gICAgICB0aGlzLmRlYnVnKCdzdHJpbmcgbWF0Y2gnLCBwLCBmLCBoaXQpXG4gICAgfSBlbHNlIHtcbiAgICAgIGhpdCA9IGYubWF0Y2gocClcbiAgICAgIHRoaXMuZGVidWcoJ3BhdHRlcm4gbWF0Y2gnLCBwLCBmLCBoaXQpXG4gICAgfVxuXG4gICAgaWYgKCFoaXQpIHJldHVybiBmYWxzZVxuICB9XG5cbiAgLy8gTm90ZTogZW5kaW5nIGluIC8gbWVhbnMgdGhhdCB3ZSdsbCBnZXQgYSBmaW5hbCBcIlwiXG4gIC8vIGF0IHRoZSBlbmQgb2YgdGhlIHBhdHRlcm4uICBUaGlzIGNhbiBvbmx5IG1hdGNoIGFcbiAgLy8gY29ycmVzcG9uZGluZyBcIlwiIGF0IHRoZSBlbmQgb2YgdGhlIGZpbGUuXG4gIC8vIElmIHRoZSBmaWxlIGVuZHMgaW4gLywgdGhlbiBpdCBjYW4gb25seSBtYXRjaCBhXG4gIC8vIGEgcGF0dGVybiB0aGF0IGVuZHMgaW4gLywgdW5sZXNzIHRoZSBwYXR0ZXJuIGp1c3RcbiAgLy8gZG9lc24ndCBoYXZlIGFueSBtb3JlIGZvciBpdC4gQnV0LCBhL2IvIHNob3VsZCAqbm90KlxuICAvLyBtYXRjaCBcImEvYi8qXCIsIGV2ZW4gdGhvdWdoIFwiXCIgbWF0Y2hlcyBhZ2FpbnN0IHRoZVxuICAvLyBbXi9dKj8gcGF0dGVybiwgZXhjZXB0IGluIHBhcnRpYWwgbW9kZSwgd2hlcmUgaXQgbWlnaHRcbiAgLy8gc2ltcGx5IG5vdCBiZSByZWFjaGVkIHlldC5cbiAgLy8gSG93ZXZlciwgYS9iLyBzaG91bGQgc3RpbGwgc2F0aXNmeSBhLypcblxuICAvLyBub3cgZWl0aGVyIHdlIGZlbGwgb2ZmIHRoZSBlbmQgb2YgdGhlIHBhdHRlcm4sIG9yIHdlJ3JlIGRvbmUuXG4gIGlmIChmaSA9PT0gZmwgJiYgcGkgPT09IHBsKSB7XG4gICAgLy8gcmFuIG91dCBvZiBwYXR0ZXJuIGFuZCBmaWxlbmFtZSBhdCB0aGUgc2FtZSB0aW1lLlxuICAgIC8vIGFuIGV4YWN0IGhpdCFcbiAgICByZXR1cm4gdHJ1ZVxuICB9IGVsc2UgaWYgKGZpID09PSBmbCkge1xuICAgIC8vIHJhbiBvdXQgb2YgZmlsZSwgYnV0IHN0aWxsIGhhZCBwYXR0ZXJuIGxlZnQuXG4gICAgLy8gdGhpcyBpcyBvayBpZiB3ZSdyZSBkb2luZyB0aGUgbWF0Y2ggYXMgcGFydCBvZlxuICAgIC8vIGEgZ2xvYiBmcyB0cmF2ZXJzYWwuXG4gICAgcmV0dXJuIHBhcnRpYWxcbiAgfSBlbHNlIGlmIChwaSA9PT0gcGwpIHtcbiAgICAvLyByYW4gb3V0IG9mIHBhdHRlcm4sIHN0aWxsIGhhdmUgZmlsZSBsZWZ0LlxuICAgIC8vIHRoaXMgaXMgb25seSBhY2NlcHRhYmxlIGlmIHdlJ3JlIG9uIHRoZSB2ZXJ5IGxhc3RcbiAgICAvLyBlbXB0eSBzZWdtZW50IG9mIGEgZmlsZSB3aXRoIGEgdHJhaWxpbmcgc2xhc2guXG4gICAgLy8gYS8qIHNob3VsZCBtYXRjaCBhL2IvXG4gICAgdmFyIGVtcHR5RmlsZUVuZCA9IChmaSA9PT0gZmwgLSAxKSAmJiAoZmlsZVtmaV0gPT09ICcnKVxuICAgIHJldHVybiBlbXB0eUZpbGVFbmRcbiAgfVxuXG4gIC8vIHNob3VsZCBiZSB1bnJlYWNoYWJsZS5cbiAgdGhyb3cgbmV3IEVycm9yKCd3dGY/Jylcbn1cblxuLy8gcmVwbGFjZSBzdHVmZiBsaWtlIFxcKiB3aXRoICpcbmZ1bmN0aW9uIGdsb2JVbmVzY2FwZSAocykge1xuICByZXR1cm4gcy5yZXBsYWNlKC9cXFxcKC4pL2csICckMScpXG59XG5cbmZ1bmN0aW9uIHJlZ0V4cEVzY2FwZSAocykge1xuICByZXR1cm4gcy5yZXBsYWNlKC9bLVtcXF17fSgpKis/LixcXFxcXiR8I1xcc10vZywgJ1xcXFwkJicpXG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZ2xvYi9+L21pbmltYXRjaC9taW5pbWF0Y2guanNcbi8vIG1vZHVsZSBpZCA9IDE3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBjb25jYXRNYXAgPSByZXF1aXJlKCdjb25jYXQtbWFwJyk7XG52YXIgYmFsYW5jZWQgPSByZXF1aXJlKCdiYWxhbmNlZC1tYXRjaCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cGFuZFRvcDtcblxudmFyIGVzY1NsYXNoID0gJ1xcMFNMQVNIJytNYXRoLnJhbmRvbSgpKydcXDAnO1xudmFyIGVzY09wZW4gPSAnXFwwT1BFTicrTWF0aC5yYW5kb20oKSsnXFwwJztcbnZhciBlc2NDbG9zZSA9ICdcXDBDTE9TRScrTWF0aC5yYW5kb20oKSsnXFwwJztcbnZhciBlc2NDb21tYSA9ICdcXDBDT01NQScrTWF0aC5yYW5kb20oKSsnXFwwJztcbnZhciBlc2NQZXJpb2QgPSAnXFwwUEVSSU9EJytNYXRoLnJhbmRvbSgpKydcXDAnO1xuXG5mdW5jdGlvbiBudW1lcmljKHN0cikge1xuICByZXR1cm4gcGFyc2VJbnQoc3RyLCAxMCkgPT0gc3RyXG4gICAgPyBwYXJzZUludChzdHIsIDEwKVxuICAgIDogc3RyLmNoYXJDb2RlQXQoMCk7XG59XG5cbmZ1bmN0aW9uIGVzY2FwZUJyYWNlcyhzdHIpIHtcbiAgcmV0dXJuIHN0ci5zcGxpdCgnXFxcXFxcXFwnKS5qb2luKGVzY1NsYXNoKVxuICAgICAgICAgICAgLnNwbGl0KCdcXFxceycpLmpvaW4oZXNjT3BlbilcbiAgICAgICAgICAgIC5zcGxpdCgnXFxcXH0nKS5qb2luKGVzY0Nsb3NlKVxuICAgICAgICAgICAgLnNwbGl0KCdcXFxcLCcpLmpvaW4oZXNjQ29tbWEpXG4gICAgICAgICAgICAuc3BsaXQoJ1xcXFwuJykuam9pbihlc2NQZXJpb2QpO1xufVxuXG5mdW5jdGlvbiB1bmVzY2FwZUJyYWNlcyhzdHIpIHtcbiAgcmV0dXJuIHN0ci5zcGxpdChlc2NTbGFzaCkuam9pbignXFxcXCcpXG4gICAgICAgICAgICAuc3BsaXQoZXNjT3Blbikuam9pbigneycpXG4gICAgICAgICAgICAuc3BsaXQoZXNjQ2xvc2UpLmpvaW4oJ30nKVxuICAgICAgICAgICAgLnNwbGl0KGVzY0NvbW1hKS5qb2luKCcsJylcbiAgICAgICAgICAgIC5zcGxpdChlc2NQZXJpb2QpLmpvaW4oJy4nKTtcbn1cblxuXG4vLyBCYXNpY2FsbHkganVzdCBzdHIuc3BsaXQoXCIsXCIpLCBidXQgaGFuZGxpbmcgY2FzZXNcbi8vIHdoZXJlIHdlIGhhdmUgbmVzdGVkIGJyYWNlZCBzZWN0aW9ucywgd2hpY2ggc2hvdWxkIGJlXG4vLyB0cmVhdGVkIGFzIGluZGl2aWR1YWwgbWVtYmVycywgbGlrZSB7YSx7YixjfSxkfVxuZnVuY3Rpb24gcGFyc2VDb21tYVBhcnRzKHN0cikge1xuICBpZiAoIXN0cilcbiAgICByZXR1cm4gWycnXTtcblxuICB2YXIgcGFydHMgPSBbXTtcbiAgdmFyIG0gPSBiYWxhbmNlZCgneycsICd9Jywgc3RyKTtcblxuICBpZiAoIW0pXG4gICAgcmV0dXJuIHN0ci5zcGxpdCgnLCcpO1xuXG4gIHZhciBwcmUgPSBtLnByZTtcbiAgdmFyIGJvZHkgPSBtLmJvZHk7XG4gIHZhciBwb3N0ID0gbS5wb3N0O1xuICB2YXIgcCA9IHByZS5zcGxpdCgnLCcpO1xuXG4gIHBbcC5sZW5ndGgtMV0gKz0gJ3snICsgYm9keSArICd9JztcbiAgdmFyIHBvc3RQYXJ0cyA9IHBhcnNlQ29tbWFQYXJ0cyhwb3N0KTtcbiAgaWYgKHBvc3QubGVuZ3RoKSB7XG4gICAgcFtwLmxlbmd0aC0xXSArPSBwb3N0UGFydHMuc2hpZnQoKTtcbiAgICBwLnB1c2guYXBwbHkocCwgcG9zdFBhcnRzKTtcbiAgfVxuXG4gIHBhcnRzLnB1c2guYXBwbHkocGFydHMsIHApO1xuXG4gIHJldHVybiBwYXJ0cztcbn1cblxuZnVuY3Rpb24gZXhwYW5kVG9wKHN0cikge1xuICBpZiAoIXN0cilcbiAgICByZXR1cm4gW107XG5cbiAgLy8gSSBkb24ndCBrbm93IHdoeSBCYXNoIDQuMyBkb2VzIHRoaXMsIGJ1dCBpdCBkb2VzLlxuICAvLyBBbnl0aGluZyBzdGFydGluZyB3aXRoIHt9IHdpbGwgaGF2ZSB0aGUgZmlyc3QgdHdvIGJ5dGVzIHByZXNlcnZlZFxuICAvLyBidXQgKm9ubHkqIGF0IHRoZSB0b3AgbGV2ZWwsIHNvIHt9LGF9YiB3aWxsIG5vdCBleHBhbmQgdG8gYW55dGhpbmcsXG4gIC8vIGJ1dCBhe30sYn1jIHdpbGwgYmUgZXhwYW5kZWQgdG8gW2F9YyxhYmNdLlxuICAvLyBPbmUgY291bGQgYXJndWUgdGhhdCB0aGlzIGlzIGEgYnVnIGluIEJhc2gsIGJ1dCBzaW5jZSB0aGUgZ29hbCBvZlxuICAvLyB0aGlzIG1vZHVsZSBpcyB0byBtYXRjaCBCYXNoJ3MgcnVsZXMsIHdlIGVzY2FwZSBhIGxlYWRpbmcge31cbiAgaWYgKHN0ci5zdWJzdHIoMCwgMikgPT09ICd7fScpIHtcbiAgICBzdHIgPSAnXFxcXHtcXFxcfScgKyBzdHIuc3Vic3RyKDIpO1xuICB9XG5cbiAgcmV0dXJuIGV4cGFuZChlc2NhcGVCcmFjZXMoc3RyKSwgdHJ1ZSkubWFwKHVuZXNjYXBlQnJhY2VzKTtcbn1cblxuZnVuY3Rpb24gaWRlbnRpdHkoZSkge1xuICByZXR1cm4gZTtcbn1cblxuZnVuY3Rpb24gZW1icmFjZShzdHIpIHtcbiAgcmV0dXJuICd7JyArIHN0ciArICd9Jztcbn1cbmZ1bmN0aW9uIGlzUGFkZGVkKGVsKSB7XG4gIHJldHVybiAvXi0/MFxcZC8udGVzdChlbCk7XG59XG5cbmZ1bmN0aW9uIGx0ZShpLCB5KSB7XG4gIHJldHVybiBpIDw9IHk7XG59XG5mdW5jdGlvbiBndGUoaSwgeSkge1xuICByZXR1cm4gaSA+PSB5O1xufVxuXG5mdW5jdGlvbiBleHBhbmQoc3RyLCBpc1RvcCkge1xuICB2YXIgZXhwYW5zaW9ucyA9IFtdO1xuXG4gIHZhciBtID0gYmFsYW5jZWQoJ3snLCAnfScsIHN0cik7XG4gIGlmICghbSB8fCAvXFwkJC8udGVzdChtLnByZSkpIHJldHVybiBbc3RyXTtcblxuICB2YXIgaXNOdW1lcmljU2VxdWVuY2UgPSAvXi0/XFxkK1xcLlxcLi0/XFxkKyg/OlxcLlxcLi0/XFxkKyk/JC8udGVzdChtLmJvZHkpO1xuICB2YXIgaXNBbHBoYVNlcXVlbmNlID0gL15bYS16QS1aXVxcLlxcLlthLXpBLVpdKD86XFwuXFwuLT9cXGQrKT8kLy50ZXN0KG0uYm9keSk7XG4gIHZhciBpc1NlcXVlbmNlID0gaXNOdW1lcmljU2VxdWVuY2UgfHwgaXNBbHBoYVNlcXVlbmNlO1xuICB2YXIgaXNPcHRpb25zID0gL14oLiosKSsoLispPyQvLnRlc3QobS5ib2R5KTtcbiAgaWYgKCFpc1NlcXVlbmNlICYmICFpc09wdGlvbnMpIHtcbiAgICAvLyB7YX0sYn1cbiAgICBpZiAobS5wb3N0Lm1hdGNoKC8sLipcXH0vKSkge1xuICAgICAgc3RyID0gbS5wcmUgKyAneycgKyBtLmJvZHkgKyBlc2NDbG9zZSArIG0ucG9zdDtcbiAgICAgIHJldHVybiBleHBhbmQoc3RyKTtcbiAgICB9XG4gICAgcmV0dXJuIFtzdHJdO1xuICB9XG5cbiAgdmFyIG47XG4gIGlmIChpc1NlcXVlbmNlKSB7XG4gICAgbiA9IG0uYm9keS5zcGxpdCgvXFwuXFwuLyk7XG4gIH0gZWxzZSB7XG4gICAgbiA9IHBhcnNlQ29tbWFQYXJ0cyhtLmJvZHkpO1xuICAgIGlmIChuLmxlbmd0aCA9PT0gMSkge1xuICAgICAgLy8geHt7YSxifX15ID09PiB4e2F9eSB4e2J9eVxuICAgICAgbiA9IGV4cGFuZChuWzBdLCBmYWxzZSkubWFwKGVtYnJhY2UpO1xuICAgICAgaWYgKG4ubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHZhciBwb3N0ID0gbS5wb3N0Lmxlbmd0aFxuICAgICAgICAgID8gZXhwYW5kKG0ucG9zdCwgZmFsc2UpXG4gICAgICAgICAgOiBbJyddO1xuICAgICAgICByZXR1cm4gcG9zdC5tYXAoZnVuY3Rpb24ocCkge1xuICAgICAgICAgIHJldHVybiBtLnByZSArIG5bMF0gKyBwO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBhdCB0aGlzIHBvaW50LCBuIGlzIHRoZSBwYXJ0cywgYW5kIHdlIGtub3cgaXQncyBub3QgYSBjb21tYSBzZXRcbiAgLy8gd2l0aCBhIHNpbmdsZSBlbnRyeS5cblxuICAvLyBubyBuZWVkIHRvIGV4cGFuZCBwcmUsIHNpbmNlIGl0IGlzIGd1YXJhbnRlZWQgdG8gYmUgZnJlZSBvZiBicmFjZS1zZXRzXG4gIHZhciBwcmUgPSBtLnByZTtcbiAgdmFyIHBvc3QgPSBtLnBvc3QubGVuZ3RoXG4gICAgPyBleHBhbmQobS5wb3N0LCBmYWxzZSlcbiAgICA6IFsnJ107XG5cbiAgdmFyIE47XG5cbiAgaWYgKGlzU2VxdWVuY2UpIHtcbiAgICB2YXIgeCA9IG51bWVyaWMoblswXSk7XG4gICAgdmFyIHkgPSBudW1lcmljKG5bMV0pO1xuICAgIHZhciB3aWR0aCA9IE1hdGgubWF4KG5bMF0ubGVuZ3RoLCBuWzFdLmxlbmd0aClcbiAgICB2YXIgaW5jciA9IG4ubGVuZ3RoID09IDNcbiAgICAgID8gTWF0aC5hYnMobnVtZXJpYyhuWzJdKSlcbiAgICAgIDogMTtcbiAgICB2YXIgdGVzdCA9IGx0ZTtcbiAgICB2YXIgcmV2ZXJzZSA9IHkgPCB4O1xuICAgIGlmIChyZXZlcnNlKSB7XG4gICAgICBpbmNyICo9IC0xO1xuICAgICAgdGVzdCA9IGd0ZTtcbiAgICB9XG4gICAgdmFyIHBhZCA9IG4uc29tZShpc1BhZGRlZCk7XG5cbiAgICBOID0gW107XG5cbiAgICBmb3IgKHZhciBpID0geDsgdGVzdChpLCB5KTsgaSArPSBpbmNyKSB7XG4gICAgICB2YXIgYztcbiAgICAgIGlmIChpc0FscGhhU2VxdWVuY2UpIHtcbiAgICAgICAgYyA9IFN0cmluZy5mcm9tQ2hhckNvZGUoaSk7XG4gICAgICAgIGlmIChjID09PSAnXFxcXCcpXG4gICAgICAgICAgYyA9ICcnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYyA9IFN0cmluZyhpKTtcbiAgICAgICAgaWYgKHBhZCkge1xuICAgICAgICAgIHZhciBuZWVkID0gd2lkdGggLSBjLmxlbmd0aDtcbiAgICAgICAgICBpZiAobmVlZCA+IDApIHtcbiAgICAgICAgICAgIHZhciB6ID0gbmV3IEFycmF5KG5lZWQgKyAxKS5qb2luKCcwJyk7XG4gICAgICAgICAgICBpZiAoaSA8IDApXG4gICAgICAgICAgICAgIGMgPSAnLScgKyB6ICsgYy5zbGljZSgxKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgYyA9IHogKyBjO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgTi5wdXNoKGMpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBOID0gY29uY2F0TWFwKG4sIGZ1bmN0aW9uKGVsKSB7IHJldHVybiBleHBhbmQoZWwsIGZhbHNlKSB9KTtcbiAgfVxuXG4gIGZvciAodmFyIGogPSAwOyBqIDwgTi5sZW5ndGg7IGorKykge1xuICAgIGZvciAodmFyIGsgPSAwOyBrIDwgcG9zdC5sZW5ndGg7IGsrKykge1xuICAgICAgdmFyIGV4cGFuc2lvbiA9IHByZSArIE5bal0gKyBwb3N0W2tdO1xuICAgICAgaWYgKCFpc1RvcCB8fCBpc1NlcXVlbmNlIHx8IGV4cGFuc2lvbilcbiAgICAgICAgZXhwYW5zaW9ucy5wdXNoKGV4cGFuc2lvbik7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGV4cGFuc2lvbnM7XG59XG5cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9icmFjZS1leHBhbnNpb24vaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDE4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHhzLCBmbikge1xuICAgIHZhciByZXMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHhzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciB4ID0gZm4oeHNbaV0sIGkpO1xuICAgICAgICBpZiAoaXNBcnJheSh4KSkgcmVzLnB1c2guYXBwbHkocmVzLCB4KTtcbiAgICAgICAgZWxzZSByZXMucHVzaCh4KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbn07XG5cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoeHMpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHhzKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29uY2F0LW1hcC9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gMTlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBiYWxhbmNlZDtcbmZ1bmN0aW9uIGJhbGFuY2VkKGEsIGIsIHN0cikge1xuICBpZiAoYSBpbnN0YW5jZW9mIFJlZ0V4cCkgYSA9IG1heWJlTWF0Y2goYSwgc3RyKTtcbiAgaWYgKGIgaW5zdGFuY2VvZiBSZWdFeHApIGIgPSBtYXliZU1hdGNoKGIsIHN0cik7XG5cbiAgdmFyIHIgPSByYW5nZShhLCBiLCBzdHIpO1xuXG4gIHJldHVybiByICYmIHtcbiAgICBzdGFydDogclswXSxcbiAgICBlbmQ6IHJbMV0sXG4gICAgcHJlOiBzdHIuc2xpY2UoMCwgclswXSksXG4gICAgYm9keTogc3RyLnNsaWNlKHJbMF0gKyBhLmxlbmd0aCwgclsxXSksXG4gICAgcG9zdDogc3RyLnNsaWNlKHJbMV0gKyBiLmxlbmd0aClcbiAgfTtcbn1cblxuZnVuY3Rpb24gbWF5YmVNYXRjaChyZWcsIHN0cikge1xuICB2YXIgbSA9IHN0ci5tYXRjaChyZWcpO1xuICByZXR1cm4gbSA/IG1bMF0gOiBudWxsO1xufVxuXG5iYWxhbmNlZC5yYW5nZSA9IHJhbmdlO1xuZnVuY3Rpb24gcmFuZ2UoYSwgYiwgc3RyKSB7XG4gIHZhciBiZWdzLCBiZWcsIGxlZnQsIHJpZ2h0LCByZXN1bHQ7XG4gIHZhciBhaSA9IHN0ci5pbmRleE9mKGEpO1xuICB2YXIgYmkgPSBzdHIuaW5kZXhPZihiLCBhaSArIDEpO1xuICB2YXIgaSA9IGFpO1xuXG4gIGlmIChhaSA+PSAwICYmIGJpID4gMCkge1xuICAgIGJlZ3MgPSBbXTtcbiAgICBsZWZ0ID0gc3RyLmxlbmd0aDtcblxuICAgIHdoaWxlIChpID49IDAgJiYgIXJlc3VsdCkge1xuICAgICAgaWYgKGkgPT0gYWkpIHtcbiAgICAgICAgYmVncy5wdXNoKGkpO1xuICAgICAgICBhaSA9IHN0ci5pbmRleE9mKGEsIGkgKyAxKTtcbiAgICAgIH0gZWxzZSBpZiAoYmVncy5sZW5ndGggPT0gMSkge1xuICAgICAgICByZXN1bHQgPSBbIGJlZ3MucG9wKCksIGJpIF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBiZWcgPSBiZWdzLnBvcCgpO1xuICAgICAgICBpZiAoYmVnIDwgbGVmdCkge1xuICAgICAgICAgIGxlZnQgPSBiZWc7XG4gICAgICAgICAgcmlnaHQgPSBiaTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJpID0gc3RyLmluZGV4T2YoYiwgaSArIDEpO1xuICAgICAgfVxuXG4gICAgICBpID0gYWkgPCBiaSAmJiBhaSA+PSAwID8gYWkgOiBiaTtcbiAgICB9XG5cbiAgICBpZiAoYmVncy5sZW5ndGgpIHtcbiAgICAgIHJlc3VsdCA9IFsgbGVmdCwgcmlnaHQgXTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2JhbGFuY2VkLW1hdGNoL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAyMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ0cnkge1xuICB2YXIgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcbiAgaWYgKHR5cGVvZiB1dGlsLmluaGVyaXRzICE9PSAnZnVuY3Rpb24nKSB0aHJvdyAnJztcbiAgbW9kdWxlLmV4cG9ydHMgPSB1dGlsLmluaGVyaXRzO1xufSBjYXRjaCAoZSkge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vaW5oZXJpdHNfYnJvd3Nlci5qcycpO1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2luaGVyaXRzL2luaGVyaXRzLmpzXG4vLyBtb2R1bGUgaWQgPSAyMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpZiAodHlwZW9mIE9iamVjdC5jcmVhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgLy8gaW1wbGVtZW50YXRpb24gZnJvbSBzdGFuZGFyZCBub2RlLmpzICd1dGlsJyBtb2R1bGVcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIGN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLCB7XG4gICAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgICB2YWx1ZTogY3RvcixcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn0gZWxzZSB7XG4gIC8vIG9sZCBzY2hvb2wgc2hpbSBmb3Igb2xkIGJyb3dzZXJzXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICB2YXIgVGVtcEN0b3IgPSBmdW5jdGlvbiAoKSB7fVxuICAgIFRlbXBDdG9yLnByb3RvdHlwZSA9IHN1cGVyQ3Rvci5wcm90b3R5cGVcbiAgICBjdG9yLnByb3RvdHlwZSA9IG5ldyBUZW1wQ3RvcigpXG4gICAgY3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjdG9yXG4gIH1cbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9pbmhlcml0cy9pbmhlcml0c19icm93c2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAyMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJldmVudHNcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJldmVudHNcIlxuLy8gbW9kdWxlIGlkID0gMjNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBwb3NpeChwYXRoKSB7XG5cdHJldHVybiBwYXRoLmNoYXJBdCgwKSA9PT0gJy8nO1xufVxuXG5mdW5jdGlvbiB3aW4zMihwYXRoKSB7XG5cdC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9ub2RlanMvbm9kZS9ibG9iL2IzZmNjMjQ1ZmIyNTUzOTkwOWVmMWQ1ZWFhMDFkYmY5MmUxNjg2MzMvbGliL3BhdGguanMjTDU2XG5cdHZhciBzcGxpdERldmljZVJlID0gL14oW2EtekEtWl06fFtcXFxcXFwvXXsyfVteXFxcXFxcL10rW1xcXFxcXC9dK1teXFxcXFxcL10rKT8oW1xcXFxcXC9dKT8oW1xcc1xcU10qPykkLztcblx0dmFyIHJlc3VsdCA9IHNwbGl0RGV2aWNlUmUuZXhlYyhwYXRoKTtcblx0dmFyIGRldmljZSA9IHJlc3VsdFsxXSB8fCAnJztcblx0dmFyIGlzVW5jID0gQm9vbGVhbihkZXZpY2UgJiYgZGV2aWNlLmNoYXJBdCgxKSAhPT0gJzonKTtcblxuXHQvLyBVTkMgcGF0aHMgYXJlIGFsd2F5cyBhYnNvbHV0ZVxuXHRyZXR1cm4gQm9vbGVhbihyZXN1bHRbMl0gfHwgaXNVbmMpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMicgPyB3aW4zMiA6IHBvc2l4O1xubW9kdWxlLmV4cG9ydHMucG9zaXggPSBwb3NpeDtcbm1vZHVsZS5leHBvcnRzLndpbjMyID0gd2luMzI7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcGF0aC1pcy1hYnNvbHV0ZS9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gMjRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBnbG9iU3luY1xuZ2xvYlN5bmMuR2xvYlN5bmMgPSBHbG9iU3luY1xuXG52YXIgZnMgPSByZXF1aXJlKCdmcycpXG52YXIgcnAgPSByZXF1aXJlKCdmcy5yZWFscGF0aCcpXG52YXIgbWluaW1hdGNoID0gcmVxdWlyZSgnbWluaW1hdGNoJylcbnZhciBNaW5pbWF0Y2ggPSBtaW5pbWF0Y2guTWluaW1hdGNoXG52YXIgR2xvYiA9IHJlcXVpcmUoJy4vZ2xvYi5qcycpLkdsb2JcbnZhciB1dGlsID0gcmVxdWlyZSgndXRpbCcpXG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxudmFyIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydCcpXG52YXIgaXNBYnNvbHV0ZSA9IHJlcXVpcmUoJ3BhdGgtaXMtYWJzb2x1dGUnKVxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uLmpzJylcbnZhciBhbHBoYXNvcnQgPSBjb21tb24uYWxwaGFzb3J0XG52YXIgYWxwaGFzb3J0aSA9IGNvbW1vbi5hbHBoYXNvcnRpXG52YXIgc2V0b3B0cyA9IGNvbW1vbi5zZXRvcHRzXG52YXIgb3duUHJvcCA9IGNvbW1vbi5vd25Qcm9wXG52YXIgY2hpbGRyZW5JZ25vcmVkID0gY29tbW9uLmNoaWxkcmVuSWdub3JlZFxudmFyIGlzSWdub3JlZCA9IGNvbW1vbi5pc0lnbm9yZWRcblxuZnVuY3Rpb24gZ2xvYlN5bmMgKHBhdHRlcm4sIG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnZnVuY3Rpb24nIHx8IGFyZ3VtZW50cy5sZW5ndGggPT09IDMpXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignY2FsbGJhY2sgcHJvdmlkZWQgdG8gc3luYyBnbG9iXFxuJytcbiAgICAgICAgICAgICAgICAgICAgICAgICdTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9pc2FhY3Mvbm9kZS1nbG9iL2lzc3Vlcy8xNjcnKVxuXG4gIHJldHVybiBuZXcgR2xvYlN5bmMocGF0dGVybiwgb3B0aW9ucykuZm91bmRcbn1cblxuZnVuY3Rpb24gR2xvYlN5bmMgKHBhdHRlcm4sIG9wdGlvbnMpIHtcbiAgaWYgKCFwYXR0ZXJuKVxuICAgIHRocm93IG5ldyBFcnJvcignbXVzdCBwcm92aWRlIHBhdHRlcm4nKVxuXG4gIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJyB8fCBhcmd1bWVudHMubGVuZ3RoID09PSAzKVxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2NhbGxiYWNrIHByb3ZpZGVkIHRvIHN5bmMgZ2xvYlxcbicrXG4gICAgICAgICAgICAgICAgICAgICAgICAnU2VlOiBodHRwczovL2dpdGh1Yi5jb20vaXNhYWNzL25vZGUtZ2xvYi9pc3N1ZXMvMTY3JylcblxuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgR2xvYlN5bmMpKVxuICAgIHJldHVybiBuZXcgR2xvYlN5bmMocGF0dGVybiwgb3B0aW9ucylcblxuICBzZXRvcHRzKHRoaXMsIHBhdHRlcm4sIG9wdGlvbnMpXG5cbiAgaWYgKHRoaXMubm9wcm9jZXNzKVxuICAgIHJldHVybiB0aGlzXG5cbiAgdmFyIG4gPSB0aGlzLm1pbmltYXRjaC5zZXQubGVuZ3RoXG4gIHRoaXMubWF0Y2hlcyA9IG5ldyBBcnJheShuKVxuICBmb3IgKHZhciBpID0gMDsgaSA8IG47IGkgKyspIHtcbiAgICB0aGlzLl9wcm9jZXNzKHRoaXMubWluaW1hdGNoLnNldFtpXSwgaSwgZmFsc2UpXG4gIH1cbiAgdGhpcy5fZmluaXNoKClcbn1cblxuR2xvYlN5bmMucHJvdG90eXBlLl9maW5pc2ggPSBmdW5jdGlvbiAoKSB7XG4gIGFzc2VydCh0aGlzIGluc3RhbmNlb2YgR2xvYlN5bmMpXG4gIGlmICh0aGlzLnJlYWxwYXRoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgdGhpcy5tYXRjaGVzLmZvckVhY2goZnVuY3Rpb24gKG1hdGNoc2V0LCBpbmRleCkge1xuICAgICAgdmFyIHNldCA9IHNlbGYubWF0Y2hlc1tpbmRleF0gPSBPYmplY3QuY3JlYXRlKG51bGwpXG4gICAgICBmb3IgKHZhciBwIGluIG1hdGNoc2V0KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcCA9IHNlbGYuX21ha2VBYnMocClcbiAgICAgICAgICB2YXIgcmVhbCA9IHJwLnJlYWxwYXRoU3luYyhwLCBzZWxmLnJlYWxwYXRoQ2FjaGUpXG4gICAgICAgICAgc2V0W3JlYWxdID0gdHJ1ZVxuICAgICAgICB9IGNhdGNoIChlcikge1xuICAgICAgICAgIGlmIChlci5zeXNjYWxsID09PSAnc3RhdCcpXG4gICAgICAgICAgICBzZXRbc2VsZi5fbWFrZUFicyhwKV0gPSB0cnVlXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhyb3cgZXJcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIH1cbiAgY29tbW9uLmZpbmlzaCh0aGlzKVxufVxuXG5cbkdsb2JTeW5jLnByb3RvdHlwZS5fcHJvY2VzcyA9IGZ1bmN0aW9uIChwYXR0ZXJuLCBpbmRleCwgaW5HbG9iU3Rhcikge1xuICBhc3NlcnQodGhpcyBpbnN0YW5jZW9mIEdsb2JTeW5jKVxuXG4gIC8vIEdldCB0aGUgZmlyc3QgW25dIHBhcnRzIG9mIHBhdHRlcm4gdGhhdCBhcmUgYWxsIHN0cmluZ3MuXG4gIHZhciBuID0gMFxuICB3aGlsZSAodHlwZW9mIHBhdHRlcm5bbl0gPT09ICdzdHJpbmcnKSB7XG4gICAgbiArK1xuICB9XG4gIC8vIG5vdyBuIGlzIHRoZSBpbmRleCBvZiB0aGUgZmlyc3Qgb25lIHRoYXQgaXMgKm5vdCogYSBzdHJpbmcuXG5cbiAgLy8gU2VlIGlmIHRoZXJlJ3MgYW55dGhpbmcgZWxzZVxuICB2YXIgcHJlZml4XG4gIHN3aXRjaCAobikge1xuICAgIC8vIGlmIG5vdCwgdGhlbiB0aGlzIGlzIHJhdGhlciBzaW1wbGVcbiAgICBjYXNlIHBhdHRlcm4ubGVuZ3RoOlxuICAgICAgdGhpcy5fcHJvY2Vzc1NpbXBsZShwYXR0ZXJuLmpvaW4oJy8nKSwgaW5kZXgpXG4gICAgICByZXR1cm5cblxuICAgIGNhc2UgMDpcbiAgICAgIC8vIHBhdHRlcm4gKnN0YXJ0cyogd2l0aCBzb21lIG5vbi10cml2aWFsIGl0ZW0uXG4gICAgICAvLyBnb2luZyB0byByZWFkZGlyKGN3ZCksIGJ1dCBub3QgaW5jbHVkZSB0aGUgcHJlZml4IGluIG1hdGNoZXMuXG4gICAgICBwcmVmaXggPSBudWxsXG4gICAgICBicmVha1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIC8vIHBhdHRlcm4gaGFzIHNvbWUgc3RyaW5nIGJpdHMgaW4gdGhlIGZyb250LlxuICAgICAgLy8gd2hhdGV2ZXIgaXQgc3RhcnRzIHdpdGgsIHdoZXRoZXIgdGhhdCdzICdhYnNvbHV0ZScgbGlrZSAvZm9vL2JhcixcbiAgICAgIC8vIG9yICdyZWxhdGl2ZScgbGlrZSAnLi4vYmF6J1xuICAgICAgcHJlZml4ID0gcGF0dGVybi5zbGljZSgwLCBuKS5qb2luKCcvJylcbiAgICAgIGJyZWFrXG4gIH1cblxuICB2YXIgcmVtYWluID0gcGF0dGVybi5zbGljZShuKVxuXG4gIC8vIGdldCB0aGUgbGlzdCBvZiBlbnRyaWVzLlxuICB2YXIgcmVhZFxuICBpZiAocHJlZml4ID09PSBudWxsKVxuICAgIHJlYWQgPSAnLidcbiAgZWxzZSBpZiAoaXNBYnNvbHV0ZShwcmVmaXgpIHx8IGlzQWJzb2x1dGUocGF0dGVybi5qb2luKCcvJykpKSB7XG4gICAgaWYgKCFwcmVmaXggfHwgIWlzQWJzb2x1dGUocHJlZml4KSlcbiAgICAgIHByZWZpeCA9ICcvJyArIHByZWZpeFxuICAgIHJlYWQgPSBwcmVmaXhcbiAgfSBlbHNlXG4gICAgcmVhZCA9IHByZWZpeFxuXG4gIHZhciBhYnMgPSB0aGlzLl9tYWtlQWJzKHJlYWQpXG5cbiAgLy9pZiBpZ25vcmVkLCBza2lwIHByb2Nlc3NpbmdcbiAgaWYgKGNoaWxkcmVuSWdub3JlZCh0aGlzLCByZWFkKSlcbiAgICByZXR1cm5cblxuICB2YXIgaXNHbG9iU3RhciA9IHJlbWFpblswXSA9PT0gbWluaW1hdGNoLkdMT0JTVEFSXG4gIGlmIChpc0dsb2JTdGFyKVxuICAgIHRoaXMuX3Byb2Nlc3NHbG9iU3RhcihwcmVmaXgsIHJlYWQsIGFicywgcmVtYWluLCBpbmRleCwgaW5HbG9iU3RhcilcbiAgZWxzZVxuICAgIHRoaXMuX3Byb2Nlc3NSZWFkZGlyKHByZWZpeCwgcmVhZCwgYWJzLCByZW1haW4sIGluZGV4LCBpbkdsb2JTdGFyKVxufVxuXG5cbkdsb2JTeW5jLnByb3RvdHlwZS5fcHJvY2Vzc1JlYWRkaXIgPSBmdW5jdGlvbiAocHJlZml4LCByZWFkLCBhYnMsIHJlbWFpbiwgaW5kZXgsIGluR2xvYlN0YXIpIHtcbiAgdmFyIGVudHJpZXMgPSB0aGlzLl9yZWFkZGlyKGFicywgaW5HbG9iU3RhcilcblxuICAvLyBpZiB0aGUgYWJzIGlzbid0IGEgZGlyLCB0aGVuIG5vdGhpbmcgY2FuIG1hdGNoIVxuICBpZiAoIWVudHJpZXMpXG4gICAgcmV0dXJuXG5cbiAgLy8gSXQgd2lsbCBvbmx5IG1hdGNoIGRvdCBlbnRyaWVzIGlmIGl0IHN0YXJ0cyB3aXRoIGEgZG90LCBvciBpZlxuICAvLyBkb3QgaXMgc2V0LiAgU3R1ZmYgbGlrZSBAKC5mb298LmJhcikgaXNuJ3QgYWxsb3dlZC5cbiAgdmFyIHBuID0gcmVtYWluWzBdXG4gIHZhciBuZWdhdGUgPSAhIXRoaXMubWluaW1hdGNoLm5lZ2F0ZVxuICB2YXIgcmF3R2xvYiA9IHBuLl9nbG9iXG4gIHZhciBkb3RPayA9IHRoaXMuZG90IHx8IHJhd0dsb2IuY2hhckF0KDApID09PSAnLidcblxuICB2YXIgbWF0Y2hlZEVudHJpZXMgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGVudHJpZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgZSA9IGVudHJpZXNbaV1cbiAgICBpZiAoZS5jaGFyQXQoMCkgIT09ICcuJyB8fCBkb3RPaykge1xuICAgICAgdmFyIG1cbiAgICAgIGlmIChuZWdhdGUgJiYgIXByZWZpeCkge1xuICAgICAgICBtID0gIWUubWF0Y2gocG4pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtID0gZS5tYXRjaChwbilcbiAgICAgIH1cbiAgICAgIGlmIChtKVxuICAgICAgICBtYXRjaGVkRW50cmllcy5wdXNoKGUpXG4gICAgfVxuICB9XG5cbiAgdmFyIGxlbiA9IG1hdGNoZWRFbnRyaWVzLmxlbmd0aFxuICAvLyBJZiB0aGVyZSBhcmUgbm8gbWF0Y2hlZCBlbnRyaWVzLCB0aGVuIG5vdGhpbmcgbWF0Y2hlcy5cbiAgaWYgKGxlbiA9PT0gMClcbiAgICByZXR1cm5cblxuICAvLyBpZiB0aGlzIGlzIHRoZSBsYXN0IHJlbWFpbmluZyBwYXR0ZXJuIGJpdCwgdGhlbiBubyBuZWVkIGZvclxuICAvLyBhbiBhZGRpdGlvbmFsIHN0YXQgKnVubGVzcyogdGhlIHVzZXIgaGFzIHNwZWNpZmllZCBtYXJrIG9yXG4gIC8vIHN0YXQgZXhwbGljaXRseS4gIFdlIGtub3cgdGhleSBleGlzdCwgc2luY2UgcmVhZGRpciByZXR1cm5lZFxuICAvLyB0aGVtLlxuXG4gIGlmIChyZW1haW4ubGVuZ3RoID09PSAxICYmICF0aGlzLm1hcmsgJiYgIXRoaXMuc3RhdCkge1xuICAgIGlmICghdGhpcy5tYXRjaGVzW2luZGV4XSlcbiAgICAgIHRoaXMubWF0Y2hlc1tpbmRleF0gPSBPYmplY3QuY3JlYXRlKG51bGwpXG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArKykge1xuICAgICAgdmFyIGUgPSBtYXRjaGVkRW50cmllc1tpXVxuICAgICAgaWYgKHByZWZpeCkge1xuICAgICAgICBpZiAocHJlZml4LnNsaWNlKC0xKSAhPT0gJy8nKVxuICAgICAgICAgIGUgPSBwcmVmaXggKyAnLycgKyBlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBlID0gcHJlZml4ICsgZVxuICAgICAgfVxuXG4gICAgICBpZiAoZS5jaGFyQXQoMCkgPT09ICcvJyAmJiAhdGhpcy5ub21vdW50KSB7XG4gICAgICAgIGUgPSBwYXRoLmpvaW4odGhpcy5yb290LCBlKVxuICAgICAgfVxuICAgICAgdGhpcy5fZW1pdE1hdGNoKGluZGV4LCBlKVxuICAgIH1cbiAgICAvLyBUaGlzIHdhcyB0aGUgbGFzdCBvbmUsIGFuZCBubyBzdGF0cyB3ZXJlIG5lZWRlZFxuICAgIHJldHVyblxuICB9XG5cbiAgLy8gbm93IHRlc3QgYWxsIG1hdGNoZWQgZW50cmllcyBhcyBzdGFuZC1pbnMgZm9yIHRoYXQgcGFydFxuICAvLyBvZiB0aGUgcGF0dGVybi5cbiAgcmVtYWluLnNoaWZ0KClcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKyspIHtcbiAgICB2YXIgZSA9IG1hdGNoZWRFbnRyaWVzW2ldXG4gICAgdmFyIG5ld1BhdHRlcm5cbiAgICBpZiAocHJlZml4KVxuICAgICAgbmV3UGF0dGVybiA9IFtwcmVmaXgsIGVdXG4gICAgZWxzZVxuICAgICAgbmV3UGF0dGVybiA9IFtlXVxuICAgIHRoaXMuX3Byb2Nlc3MobmV3UGF0dGVybi5jb25jYXQocmVtYWluKSwgaW5kZXgsIGluR2xvYlN0YXIpXG4gIH1cbn1cblxuXG5HbG9iU3luYy5wcm90b3R5cGUuX2VtaXRNYXRjaCA9IGZ1bmN0aW9uIChpbmRleCwgZSkge1xuICBpZiAoaXNJZ25vcmVkKHRoaXMsIGUpKVxuICAgIHJldHVyblxuXG4gIHZhciBhYnMgPSB0aGlzLl9tYWtlQWJzKGUpXG5cbiAgaWYgKHRoaXMubWFyaylcbiAgICBlID0gdGhpcy5fbWFyayhlKVxuXG4gIGlmICh0aGlzLmFic29sdXRlKSB7XG4gICAgZSA9IGFic1xuICB9XG5cbiAgaWYgKHRoaXMubWF0Y2hlc1tpbmRleF1bZV0pXG4gICAgcmV0dXJuXG5cbiAgaWYgKHRoaXMubm9kaXIpIHtcbiAgICB2YXIgYyA9IHRoaXMuY2FjaGVbYWJzXVxuICAgIGlmIChjID09PSAnRElSJyB8fCBBcnJheS5pc0FycmF5KGMpKVxuICAgICAgcmV0dXJuXG4gIH1cblxuICB0aGlzLm1hdGNoZXNbaW5kZXhdW2VdID0gdHJ1ZVxuXG4gIGlmICh0aGlzLnN0YXQpXG4gICAgdGhpcy5fc3RhdChlKVxufVxuXG5cbkdsb2JTeW5jLnByb3RvdHlwZS5fcmVhZGRpckluR2xvYlN0YXIgPSBmdW5jdGlvbiAoYWJzKSB7XG4gIC8vIGZvbGxvdyBhbGwgc3ltbGlua2VkIGRpcmVjdG9yaWVzIGZvcmV2ZXJcbiAgLy8ganVzdCBwcm9jZWVkIGFzIGlmIHRoaXMgaXMgYSBub24tZ2xvYnN0YXIgc2l0dWF0aW9uXG4gIGlmICh0aGlzLmZvbGxvdylcbiAgICByZXR1cm4gdGhpcy5fcmVhZGRpcihhYnMsIGZhbHNlKVxuXG4gIHZhciBlbnRyaWVzXG4gIHZhciBsc3RhdFxuICB2YXIgc3RhdFxuICB0cnkge1xuICAgIGxzdGF0ID0gZnMubHN0YXRTeW5jKGFicylcbiAgfSBjYXRjaCAoZXIpIHtcbiAgICBpZiAoZXIuY29kZSA9PT0gJ0VOT0VOVCcpIHtcbiAgICAgIC8vIGxzdGF0IGZhaWxlZCwgZG9lc24ndCBleGlzdFxuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gIH1cblxuICB2YXIgaXNTeW0gPSBsc3RhdCAmJiBsc3RhdC5pc1N5bWJvbGljTGluaygpXG4gIHRoaXMuc3ltbGlua3NbYWJzXSA9IGlzU3ltXG5cbiAgLy8gSWYgaXQncyBub3QgYSBzeW1saW5rIG9yIGEgZGlyLCB0aGVuIGl0J3MgZGVmaW5pdGVseSBhIHJlZ3VsYXIgZmlsZS5cbiAgLy8gZG9uJ3QgYm90aGVyIGRvaW5nIGEgcmVhZGRpciBpbiB0aGF0IGNhc2UuXG4gIGlmICghaXNTeW0gJiYgbHN0YXQgJiYgIWxzdGF0LmlzRGlyZWN0b3J5KCkpXG4gICAgdGhpcy5jYWNoZVthYnNdID0gJ0ZJTEUnXG4gIGVsc2VcbiAgICBlbnRyaWVzID0gdGhpcy5fcmVhZGRpcihhYnMsIGZhbHNlKVxuXG4gIHJldHVybiBlbnRyaWVzXG59XG5cbkdsb2JTeW5jLnByb3RvdHlwZS5fcmVhZGRpciA9IGZ1bmN0aW9uIChhYnMsIGluR2xvYlN0YXIpIHtcbiAgdmFyIGVudHJpZXNcblxuICBpZiAoaW5HbG9iU3RhciAmJiAhb3duUHJvcCh0aGlzLnN5bWxpbmtzLCBhYnMpKVxuICAgIHJldHVybiB0aGlzLl9yZWFkZGlySW5HbG9iU3RhcihhYnMpXG5cbiAgaWYgKG93blByb3AodGhpcy5jYWNoZSwgYWJzKSkge1xuICAgIHZhciBjID0gdGhpcy5jYWNoZVthYnNdXG4gICAgaWYgKCFjIHx8IGMgPT09ICdGSUxFJylcbiAgICAgIHJldHVybiBudWxsXG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShjKSlcbiAgICAgIHJldHVybiBjXG4gIH1cblxuICB0cnkge1xuICAgIHJldHVybiB0aGlzLl9yZWFkZGlyRW50cmllcyhhYnMsIGZzLnJlYWRkaXJTeW5jKGFicykpXG4gIH0gY2F0Y2ggKGVyKSB7XG4gICAgdGhpcy5fcmVhZGRpckVycm9yKGFicywgZXIpXG4gICAgcmV0dXJuIG51bGxcbiAgfVxufVxuXG5HbG9iU3luYy5wcm90b3R5cGUuX3JlYWRkaXJFbnRyaWVzID0gZnVuY3Rpb24gKGFicywgZW50cmllcykge1xuICAvLyBpZiB3ZSBoYXZlbid0IGFza2VkIHRvIHN0YXQgZXZlcnl0aGluZywgdGhlbiBqdXN0XG4gIC8vIGFzc3VtZSB0aGF0IGV2ZXJ5dGhpbmcgaW4gdGhlcmUgZXhpc3RzLCBzbyB3ZSBjYW4gYXZvaWRcbiAgLy8gaGF2aW5nIHRvIHN0YXQgaXQgYSBzZWNvbmQgdGltZS5cbiAgaWYgKCF0aGlzLm1hcmsgJiYgIXRoaXMuc3RhdCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZW50cmllcy5sZW5ndGg7IGkgKyspIHtcbiAgICAgIHZhciBlID0gZW50cmllc1tpXVxuICAgICAgaWYgKGFicyA9PT0gJy8nKVxuICAgICAgICBlID0gYWJzICsgZVxuICAgICAgZWxzZVxuICAgICAgICBlID0gYWJzICsgJy8nICsgZVxuICAgICAgdGhpcy5jYWNoZVtlXSA9IHRydWVcbiAgICB9XG4gIH1cblxuICB0aGlzLmNhY2hlW2Fic10gPSBlbnRyaWVzXG5cbiAgLy8gbWFyayBhbmQgY2FjaGUgZGlyLW5lc3NcbiAgcmV0dXJuIGVudHJpZXNcbn1cblxuR2xvYlN5bmMucHJvdG90eXBlLl9yZWFkZGlyRXJyb3IgPSBmdW5jdGlvbiAoZiwgZXIpIHtcbiAgLy8gaGFuZGxlIGVycm9ycywgYW5kIGNhY2hlIHRoZSBpbmZvcm1hdGlvblxuICBzd2l0Y2ggKGVyLmNvZGUpIHtcbiAgICBjYXNlICdFTk9UU1VQJzogLy8gaHR0cHM6Ly9naXRodWIuY29tL2lzYWFjcy9ub2RlLWdsb2IvaXNzdWVzLzIwNVxuICAgIGNhc2UgJ0VOT1RESVInOiAvLyB0b3RhbGx5IG5vcm1hbC4gbWVhbnMgaXQgKmRvZXMqIGV4aXN0LlxuICAgICAgdmFyIGFicyA9IHRoaXMuX21ha2VBYnMoZilcbiAgICAgIHRoaXMuY2FjaGVbYWJzXSA9ICdGSUxFJ1xuICAgICAgaWYgKGFicyA9PT0gdGhpcy5jd2RBYnMpIHtcbiAgICAgICAgdmFyIGVycm9yID0gbmV3IEVycm9yKGVyLmNvZGUgKyAnIGludmFsaWQgY3dkICcgKyB0aGlzLmN3ZClcbiAgICAgICAgZXJyb3IucGF0aCA9IHRoaXMuY3dkXG4gICAgICAgIGVycm9yLmNvZGUgPSBlci5jb2RlXG4gICAgICAgIHRocm93IGVycm9yXG4gICAgICB9XG4gICAgICBicmVha1xuXG4gICAgY2FzZSAnRU5PRU5UJzogLy8gbm90IHRlcnJpYmx5IHVudXN1YWxcbiAgICBjYXNlICdFTE9PUCc6XG4gICAgY2FzZSAnRU5BTUVUT09MT05HJzpcbiAgICBjYXNlICdVTktOT1dOJzpcbiAgICAgIHRoaXMuY2FjaGVbdGhpcy5fbWFrZUFicyhmKV0gPSBmYWxzZVxuICAgICAgYnJlYWtcblxuICAgIGRlZmF1bHQ6IC8vIHNvbWUgdW51c3VhbCBlcnJvci4gIFRyZWF0IGFzIGZhaWx1cmUuXG4gICAgICB0aGlzLmNhY2hlW3RoaXMuX21ha2VBYnMoZildID0gZmFsc2VcbiAgICAgIGlmICh0aGlzLnN0cmljdClcbiAgICAgICAgdGhyb3cgZXJcbiAgICAgIGlmICghdGhpcy5zaWxlbnQpXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ2dsb2IgZXJyb3InLCBlcilcbiAgICAgIGJyZWFrXG4gIH1cbn1cblxuR2xvYlN5bmMucHJvdG90eXBlLl9wcm9jZXNzR2xvYlN0YXIgPSBmdW5jdGlvbiAocHJlZml4LCByZWFkLCBhYnMsIHJlbWFpbiwgaW5kZXgsIGluR2xvYlN0YXIpIHtcblxuICB2YXIgZW50cmllcyA9IHRoaXMuX3JlYWRkaXIoYWJzLCBpbkdsb2JTdGFyKVxuXG4gIC8vIG5vIGVudHJpZXMgbWVhbnMgbm90IGEgZGlyLCBzbyBpdCBjYW4gbmV2ZXIgaGF2ZSBtYXRjaGVzXG4gIC8vIGZvby50eHQvKiogZG9lc24ndCBtYXRjaCBmb28udHh0XG4gIGlmICghZW50cmllcylcbiAgICByZXR1cm5cblxuICAvLyB0ZXN0IHdpdGhvdXQgdGhlIGdsb2JzdGFyLCBhbmQgd2l0aCBldmVyeSBjaGlsZCBib3RoIGJlbG93XG4gIC8vIGFuZCByZXBsYWNpbmcgdGhlIGdsb2JzdGFyLlxuICB2YXIgcmVtYWluV2l0aG91dEdsb2JTdGFyID0gcmVtYWluLnNsaWNlKDEpXG4gIHZhciBnc3ByZWYgPSBwcmVmaXggPyBbIHByZWZpeCBdIDogW11cbiAgdmFyIG5vR2xvYlN0YXIgPSBnc3ByZWYuY29uY2F0KHJlbWFpbldpdGhvdXRHbG9iU3RhcilcblxuICAvLyB0aGUgbm9HbG9iU3RhciBwYXR0ZXJuIGV4aXRzIHRoZSBpbkdsb2JTdGFyIHN0YXRlXG4gIHRoaXMuX3Byb2Nlc3Mobm9HbG9iU3RhciwgaW5kZXgsIGZhbHNlKVxuXG4gIHZhciBsZW4gPSBlbnRyaWVzLmxlbmd0aFxuICB2YXIgaXNTeW0gPSB0aGlzLnN5bWxpbmtzW2Fic11cblxuICAvLyBJZiBpdCdzIGEgc3ltbGluaywgYW5kIHdlJ3JlIGluIGEgZ2xvYnN0YXIsIHRoZW4gc3RvcFxuICBpZiAoaXNTeW0gJiYgaW5HbG9iU3RhcilcbiAgICByZXR1cm5cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgdmFyIGUgPSBlbnRyaWVzW2ldXG4gICAgaWYgKGUuY2hhckF0KDApID09PSAnLicgJiYgIXRoaXMuZG90KVxuICAgICAgY29udGludWVcblxuICAgIC8vIHRoZXNlIHR3byBjYXNlcyBlbnRlciB0aGUgaW5HbG9iU3RhciBzdGF0ZVxuICAgIHZhciBpbnN0ZWFkID0gZ3NwcmVmLmNvbmNhdChlbnRyaWVzW2ldLCByZW1haW5XaXRob3V0R2xvYlN0YXIpXG4gICAgdGhpcy5fcHJvY2VzcyhpbnN0ZWFkLCBpbmRleCwgdHJ1ZSlcblxuICAgIHZhciBiZWxvdyA9IGdzcHJlZi5jb25jYXQoZW50cmllc1tpXSwgcmVtYWluKVxuICAgIHRoaXMuX3Byb2Nlc3MoYmVsb3csIGluZGV4LCB0cnVlKVxuICB9XG59XG5cbkdsb2JTeW5jLnByb3RvdHlwZS5fcHJvY2Vzc1NpbXBsZSA9IGZ1bmN0aW9uIChwcmVmaXgsIGluZGV4KSB7XG4gIC8vIFhYWCByZXZpZXcgdGhpcy4gIFNob3VsZG4ndCBpdCBiZSBkb2luZyB0aGUgbW91bnRpbmcgZXRjXG4gIC8vIGJlZm9yZSBkb2luZyBzdGF0PyAga2luZGEgd2VpcmQ/XG4gIHZhciBleGlzdHMgPSB0aGlzLl9zdGF0KHByZWZpeClcblxuICBpZiAoIXRoaXMubWF0Y2hlc1tpbmRleF0pXG4gICAgdGhpcy5tYXRjaGVzW2luZGV4XSA9IE9iamVjdC5jcmVhdGUobnVsbClcblxuICAvLyBJZiBpdCBkb2Vzbid0IGV4aXN0LCB0aGVuIGp1c3QgbWFyayB0aGUgbGFjayBvZiByZXN1bHRzXG4gIGlmICghZXhpc3RzKVxuICAgIHJldHVyblxuXG4gIGlmIChwcmVmaXggJiYgaXNBYnNvbHV0ZShwcmVmaXgpICYmICF0aGlzLm5vbW91bnQpIHtcbiAgICB2YXIgdHJhaWwgPSAvW1xcL1xcXFxdJC8udGVzdChwcmVmaXgpXG4gICAgaWYgKHByZWZpeC5jaGFyQXQoMCkgPT09ICcvJykge1xuICAgICAgcHJlZml4ID0gcGF0aC5qb2luKHRoaXMucm9vdCwgcHJlZml4KVxuICAgIH0gZWxzZSB7XG4gICAgICBwcmVmaXggPSBwYXRoLnJlc29sdmUodGhpcy5yb290LCBwcmVmaXgpXG4gICAgICBpZiAodHJhaWwpXG4gICAgICAgIHByZWZpeCArPSAnLydcbiAgICB9XG4gIH1cblxuICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJylcbiAgICBwcmVmaXggPSBwcmVmaXgucmVwbGFjZSgvXFxcXC9nLCAnLycpXG5cbiAgLy8gTWFyayB0aGlzIGFzIGEgbWF0Y2hcbiAgdGhpcy5fZW1pdE1hdGNoKGluZGV4LCBwcmVmaXgpXG59XG5cbi8vIFJldHVybnMgZWl0aGVyICdESVInLCAnRklMRScsIG9yIGZhbHNlXG5HbG9iU3luYy5wcm90b3R5cGUuX3N0YXQgPSBmdW5jdGlvbiAoZikge1xuICB2YXIgYWJzID0gdGhpcy5fbWFrZUFicyhmKVxuICB2YXIgbmVlZERpciA9IGYuc2xpY2UoLTEpID09PSAnLydcblxuICBpZiAoZi5sZW5ndGggPiB0aGlzLm1heExlbmd0aClcbiAgICByZXR1cm4gZmFsc2VcblxuICBpZiAoIXRoaXMuc3RhdCAmJiBvd25Qcm9wKHRoaXMuY2FjaGUsIGFicykpIHtcbiAgICB2YXIgYyA9IHRoaXMuY2FjaGVbYWJzXVxuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoYykpXG4gICAgICBjID0gJ0RJUidcblxuICAgIC8vIEl0IGV4aXN0cywgYnV0IG1heWJlIG5vdCBob3cgd2UgbmVlZCBpdFxuICAgIGlmICghbmVlZERpciB8fCBjID09PSAnRElSJylcbiAgICAgIHJldHVybiBjXG5cbiAgICBpZiAobmVlZERpciAmJiBjID09PSAnRklMRScpXG4gICAgICByZXR1cm4gZmFsc2VcblxuICAgIC8vIG90aGVyd2lzZSB3ZSBoYXZlIHRvIHN0YXQsIGJlY2F1c2UgbWF5YmUgYz10cnVlXG4gICAgLy8gaWYgd2Uga25vdyBpdCBleGlzdHMsIGJ1dCBub3Qgd2hhdCBpdCBpcy5cbiAgfVxuXG4gIHZhciBleGlzdHNcbiAgdmFyIHN0YXQgPSB0aGlzLnN0YXRDYWNoZVthYnNdXG4gIGlmICghc3RhdCkge1xuICAgIHZhciBsc3RhdFxuICAgIHRyeSB7XG4gICAgICBsc3RhdCA9IGZzLmxzdGF0U3luYyhhYnMpXG4gICAgfSBjYXRjaCAoZXIpIHtcbiAgICAgIGlmIChlciAmJiAoZXIuY29kZSA9PT0gJ0VOT0VOVCcgfHwgZXIuY29kZSA9PT0gJ0VOT1RESVInKSkge1xuICAgICAgICB0aGlzLnN0YXRDYWNoZVthYnNdID0gZmFsc2VcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGxzdGF0ICYmIGxzdGF0LmlzU3ltYm9saWNMaW5rKCkpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHN0YXQgPSBmcy5zdGF0U3luYyhhYnMpXG4gICAgICB9IGNhdGNoIChlcikge1xuICAgICAgICBzdGF0ID0gbHN0YXRcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3RhdCA9IGxzdGF0XG4gICAgfVxuICB9XG5cbiAgdGhpcy5zdGF0Q2FjaGVbYWJzXSA9IHN0YXRcblxuICB2YXIgYyA9IHRydWVcbiAgaWYgKHN0YXQpXG4gICAgYyA9IHN0YXQuaXNEaXJlY3RvcnkoKSA/ICdESVInIDogJ0ZJTEUnXG5cbiAgdGhpcy5jYWNoZVthYnNdID0gdGhpcy5jYWNoZVthYnNdIHx8IGNcblxuICBpZiAobmVlZERpciAmJiBjID09PSAnRklMRScpXG4gICAgcmV0dXJuIGZhbHNlXG5cbiAgcmV0dXJuIGNcbn1cblxuR2xvYlN5bmMucHJvdG90eXBlLl9tYXJrID0gZnVuY3Rpb24gKHApIHtcbiAgcmV0dXJuIGNvbW1vbi5tYXJrKHRoaXMsIHApXG59XG5cbkdsb2JTeW5jLnByb3RvdHlwZS5fbWFrZUFicyA9IGZ1bmN0aW9uIChmKSB7XG4gIHJldHVybiBjb21tb24ubWFrZUFicyh0aGlzLCBmKVxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2dsb2Ivc3luYy5qc1xuLy8gbW9kdWxlIGlkID0gMjVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0cy5hbHBoYXNvcnQgPSBhbHBoYXNvcnRcbmV4cG9ydHMuYWxwaGFzb3J0aSA9IGFscGhhc29ydGlcbmV4cG9ydHMuc2V0b3B0cyA9IHNldG9wdHNcbmV4cG9ydHMub3duUHJvcCA9IG93blByb3BcbmV4cG9ydHMubWFrZUFicyA9IG1ha2VBYnNcbmV4cG9ydHMuZmluaXNoID0gZmluaXNoXG5leHBvcnRzLm1hcmsgPSBtYXJrXG5leHBvcnRzLmlzSWdub3JlZCA9IGlzSWdub3JlZFxuZXhwb3J0cy5jaGlsZHJlbklnbm9yZWQgPSBjaGlsZHJlbklnbm9yZWRcblxuZnVuY3Rpb24gb3duUHJvcCAob2JqLCBmaWVsZCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgZmllbGQpXG59XG5cbnZhciBwYXRoID0gcmVxdWlyZShcInBhdGhcIilcbnZhciBtaW5pbWF0Y2ggPSByZXF1aXJlKFwibWluaW1hdGNoXCIpXG52YXIgaXNBYnNvbHV0ZSA9IHJlcXVpcmUoXCJwYXRoLWlzLWFic29sdXRlXCIpXG52YXIgTWluaW1hdGNoID0gbWluaW1hdGNoLk1pbmltYXRjaFxuXG5mdW5jdGlvbiBhbHBoYXNvcnRpIChhLCBiKSB7XG4gIHJldHVybiBhLnRvTG93ZXJDYXNlKCkubG9jYWxlQ29tcGFyZShiLnRvTG93ZXJDYXNlKCkpXG59XG5cbmZ1bmN0aW9uIGFscGhhc29ydCAoYSwgYikge1xuICByZXR1cm4gYS5sb2NhbGVDb21wYXJlKGIpXG59XG5cbmZ1bmN0aW9uIHNldHVwSWdub3JlcyAoc2VsZiwgb3B0aW9ucykge1xuICBzZWxmLmlnbm9yZSA9IG9wdGlvbnMuaWdub3JlIHx8IFtdXG5cbiAgaWYgKCFBcnJheS5pc0FycmF5KHNlbGYuaWdub3JlKSlcbiAgICBzZWxmLmlnbm9yZSA9IFtzZWxmLmlnbm9yZV1cblxuICBpZiAoc2VsZi5pZ25vcmUubGVuZ3RoKSB7XG4gICAgc2VsZi5pZ25vcmUgPSBzZWxmLmlnbm9yZS5tYXAoaWdub3JlTWFwKVxuICB9XG59XG5cbi8vIGlnbm9yZSBwYXR0ZXJucyBhcmUgYWx3YXlzIGluIGRvdDp0cnVlIG1vZGUuXG5mdW5jdGlvbiBpZ25vcmVNYXAgKHBhdHRlcm4pIHtcbiAgdmFyIGdtYXRjaGVyID0gbnVsbFxuICBpZiAocGF0dGVybi5zbGljZSgtMykgPT09ICcvKionKSB7XG4gICAgdmFyIGdwYXR0ZXJuID0gcGF0dGVybi5yZXBsYWNlKC8oXFwvXFwqXFwqKSskLywgJycpXG4gICAgZ21hdGNoZXIgPSBuZXcgTWluaW1hdGNoKGdwYXR0ZXJuLCB7IGRvdDogdHJ1ZSB9KVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBtYXRjaGVyOiBuZXcgTWluaW1hdGNoKHBhdHRlcm4sIHsgZG90OiB0cnVlIH0pLFxuICAgIGdtYXRjaGVyOiBnbWF0Y2hlclxuICB9XG59XG5cbmZ1bmN0aW9uIHNldG9wdHMgKHNlbGYsIHBhdHRlcm4sIG9wdGlvbnMpIHtcbiAgaWYgKCFvcHRpb25zKVxuICAgIG9wdGlvbnMgPSB7fVxuXG4gIC8vIGJhc2UtbWF0Y2hpbmc6IGp1c3QgdXNlIGdsb2JzdGFyIGZvciB0aGF0LlxuICBpZiAob3B0aW9ucy5tYXRjaEJhc2UgJiYgLTEgPT09IHBhdHRlcm4uaW5kZXhPZihcIi9cIikpIHtcbiAgICBpZiAob3B0aW9ucy5ub2dsb2JzdGFyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJiYXNlIG1hdGNoaW5nIHJlcXVpcmVzIGdsb2JzdGFyXCIpXG4gICAgfVxuICAgIHBhdHRlcm4gPSBcIioqL1wiICsgcGF0dGVyblxuICB9XG5cbiAgc2VsZi5zaWxlbnQgPSAhIW9wdGlvbnMuc2lsZW50XG4gIHNlbGYucGF0dGVybiA9IHBhdHRlcm5cbiAgc2VsZi5zdHJpY3QgPSBvcHRpb25zLnN0cmljdCAhPT0gZmFsc2VcbiAgc2VsZi5yZWFscGF0aCA9ICEhb3B0aW9ucy5yZWFscGF0aFxuICBzZWxmLnJlYWxwYXRoQ2FjaGUgPSBvcHRpb25zLnJlYWxwYXRoQ2FjaGUgfHwgT2JqZWN0LmNyZWF0ZShudWxsKVxuICBzZWxmLmZvbGxvdyA9ICEhb3B0aW9ucy5mb2xsb3dcbiAgc2VsZi5kb3QgPSAhIW9wdGlvbnMuZG90XG4gIHNlbGYubWFyayA9ICEhb3B0aW9ucy5tYXJrXG4gIHNlbGYubm9kaXIgPSAhIW9wdGlvbnMubm9kaXJcbiAgaWYgKHNlbGYubm9kaXIpXG4gICAgc2VsZi5tYXJrID0gdHJ1ZVxuICBzZWxmLnN5bmMgPSAhIW9wdGlvbnMuc3luY1xuICBzZWxmLm5vdW5pcXVlID0gISFvcHRpb25zLm5vdW5pcXVlXG4gIHNlbGYubm9udWxsID0gISFvcHRpb25zLm5vbnVsbFxuICBzZWxmLm5vc29ydCA9ICEhb3B0aW9ucy5ub3NvcnRcbiAgc2VsZi5ub2Nhc2UgPSAhIW9wdGlvbnMubm9jYXNlXG4gIHNlbGYuc3RhdCA9ICEhb3B0aW9ucy5zdGF0XG4gIHNlbGYubm9wcm9jZXNzID0gISFvcHRpb25zLm5vcHJvY2Vzc1xuICBzZWxmLmFic29sdXRlID0gISFvcHRpb25zLmFic29sdXRlXG5cbiAgc2VsZi5tYXhMZW5ndGggPSBvcHRpb25zLm1heExlbmd0aCB8fCBJbmZpbml0eVxuICBzZWxmLmNhY2hlID0gb3B0aW9ucy5jYWNoZSB8fCBPYmplY3QuY3JlYXRlKG51bGwpXG4gIHNlbGYuc3RhdENhY2hlID0gb3B0aW9ucy5zdGF0Q2FjaGUgfHwgT2JqZWN0LmNyZWF0ZShudWxsKVxuICBzZWxmLnN5bWxpbmtzID0gb3B0aW9ucy5zeW1saW5rcyB8fCBPYmplY3QuY3JlYXRlKG51bGwpXG5cbiAgc2V0dXBJZ25vcmVzKHNlbGYsIG9wdGlvbnMpXG5cbiAgc2VsZi5jaGFuZ2VkQ3dkID0gZmFsc2VcbiAgdmFyIGN3ZCA9IHByb2Nlc3MuY3dkKClcbiAgaWYgKCFvd25Qcm9wKG9wdGlvbnMsIFwiY3dkXCIpKVxuICAgIHNlbGYuY3dkID0gY3dkXG4gIGVsc2Uge1xuICAgIHNlbGYuY3dkID0gcGF0aC5yZXNvbHZlKG9wdGlvbnMuY3dkKVxuICAgIHNlbGYuY2hhbmdlZEN3ZCA9IHNlbGYuY3dkICE9PSBjd2RcbiAgfVxuXG4gIHNlbGYucm9vdCA9IG9wdGlvbnMucm9vdCB8fCBwYXRoLnJlc29sdmUoc2VsZi5jd2QsIFwiL1wiKVxuICBzZWxmLnJvb3QgPSBwYXRoLnJlc29sdmUoc2VsZi5yb290KVxuICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gXCJ3aW4zMlwiKVxuICAgIHNlbGYucm9vdCA9IHNlbGYucm9vdC5yZXBsYWNlKC9cXFxcL2csIFwiL1wiKVxuXG4gIC8vIFRPRE86IGlzIGFuIGFic29sdXRlIGBjd2RgIHN1cHBvc2VkIHRvIGJlIHJlc29sdmVkIGFnYWluc3QgYHJvb3RgP1xuICAvLyBlLmcuIHsgY3dkOiAnL3Rlc3QnLCByb290OiBfX2Rpcm5hbWUgfSA9PT0gcGF0aC5qb2luKF9fZGlybmFtZSwgJy90ZXN0JylcbiAgc2VsZi5jd2RBYnMgPSBpc0Fic29sdXRlKHNlbGYuY3dkKSA/IHNlbGYuY3dkIDogbWFrZUFicyhzZWxmLCBzZWxmLmN3ZClcbiAgaWYgKHByb2Nlc3MucGxhdGZvcm0gPT09IFwid2luMzJcIilcbiAgICBzZWxmLmN3ZEFicyA9IHNlbGYuY3dkQWJzLnJlcGxhY2UoL1xcXFwvZywgXCIvXCIpXG4gIHNlbGYubm9tb3VudCA9ICEhb3B0aW9ucy5ub21vdW50XG5cbiAgLy8gZGlzYWJsZSBjb21tZW50cyBhbmQgbmVnYXRpb24gaW4gTWluaW1hdGNoLlxuICAvLyBOb3RlIHRoYXQgdGhleSBhcmUgbm90IHN1cHBvcnRlZCBpbiBHbG9iIGl0c2VsZiBhbnl3YXkuXG4gIG9wdGlvbnMubm9uZWdhdGUgPSB0cnVlXG4gIG9wdGlvbnMubm9jb21tZW50ID0gdHJ1ZVxuXG4gIHNlbGYubWluaW1hdGNoID0gbmV3IE1pbmltYXRjaChwYXR0ZXJuLCBvcHRpb25zKVxuICBzZWxmLm9wdGlvbnMgPSBzZWxmLm1pbmltYXRjaC5vcHRpb25zXG59XG5cbmZ1bmN0aW9uIGZpbmlzaCAoc2VsZikge1xuICB2YXIgbm91ID0gc2VsZi5ub3VuaXF1ZVxuICB2YXIgYWxsID0gbm91ID8gW10gOiBPYmplY3QuY3JlYXRlKG51bGwpXG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBzZWxmLm1hdGNoZXMubGVuZ3RoOyBpIDwgbDsgaSArKykge1xuICAgIHZhciBtYXRjaGVzID0gc2VsZi5tYXRjaGVzW2ldXG4gICAgaWYgKCFtYXRjaGVzIHx8IE9iamVjdC5rZXlzKG1hdGNoZXMpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgaWYgKHNlbGYubm9udWxsKSB7XG4gICAgICAgIC8vIGRvIGxpa2UgdGhlIHNoZWxsLCBhbmQgc3BpdCBvdXQgdGhlIGxpdGVyYWwgZ2xvYlxuICAgICAgICB2YXIgbGl0ZXJhbCA9IHNlbGYubWluaW1hdGNoLmdsb2JTZXRbaV1cbiAgICAgICAgaWYgKG5vdSlcbiAgICAgICAgICBhbGwucHVzaChsaXRlcmFsKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgYWxsW2xpdGVyYWxdID0gdHJ1ZVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBoYWQgbWF0Y2hlc1xuICAgICAgdmFyIG0gPSBPYmplY3Qua2V5cyhtYXRjaGVzKVxuICAgICAgaWYgKG5vdSlcbiAgICAgICAgYWxsLnB1c2guYXBwbHkoYWxsLCBtKVxuICAgICAgZWxzZVxuICAgICAgICBtLmZvckVhY2goZnVuY3Rpb24gKG0pIHtcbiAgICAgICAgICBhbGxbbV0gPSB0cnVlXG4gICAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgaWYgKCFub3UpXG4gICAgYWxsID0gT2JqZWN0LmtleXMoYWxsKVxuXG4gIGlmICghc2VsZi5ub3NvcnQpXG4gICAgYWxsID0gYWxsLnNvcnQoc2VsZi5ub2Nhc2UgPyBhbHBoYXNvcnRpIDogYWxwaGFzb3J0KVxuXG4gIC8vIGF0ICpzb21lKiBwb2ludCB3ZSBzdGF0dGVkIGFsbCBvZiB0aGVzZVxuICBpZiAoc2VsZi5tYXJrKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbGwubGVuZ3RoOyBpKyspIHtcbiAgICAgIGFsbFtpXSA9IHNlbGYuX21hcmsoYWxsW2ldKVxuICAgIH1cbiAgICBpZiAoc2VsZi5ub2Rpcikge1xuICAgICAgYWxsID0gYWxsLmZpbHRlcihmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgbm90RGlyID0gISgvXFwvJC8udGVzdChlKSlcbiAgICAgICAgdmFyIGMgPSBzZWxmLmNhY2hlW2VdIHx8IHNlbGYuY2FjaGVbbWFrZUFicyhzZWxmLCBlKV1cbiAgICAgICAgaWYgKG5vdERpciAmJiBjKVxuICAgICAgICAgIG5vdERpciA9IGMgIT09ICdESVInICYmICFBcnJheS5pc0FycmF5KGMpXG4gICAgICAgIHJldHVybiBub3REaXJcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgaWYgKHNlbGYuaWdub3JlLmxlbmd0aClcbiAgICBhbGwgPSBhbGwuZmlsdGVyKGZ1bmN0aW9uKG0pIHtcbiAgICAgIHJldHVybiAhaXNJZ25vcmVkKHNlbGYsIG0pXG4gICAgfSlcblxuICBzZWxmLmZvdW5kID0gYWxsXG59XG5cbmZ1bmN0aW9uIG1hcmsgKHNlbGYsIHApIHtcbiAgdmFyIGFicyA9IG1ha2VBYnMoc2VsZiwgcClcbiAgdmFyIGMgPSBzZWxmLmNhY2hlW2Fic11cbiAgdmFyIG0gPSBwXG4gIGlmIChjKSB7XG4gICAgdmFyIGlzRGlyID0gYyA9PT0gJ0RJUicgfHwgQXJyYXkuaXNBcnJheShjKVxuICAgIHZhciBzbGFzaCA9IHAuc2xpY2UoLTEpID09PSAnLydcblxuICAgIGlmIChpc0RpciAmJiAhc2xhc2gpXG4gICAgICBtICs9ICcvJ1xuICAgIGVsc2UgaWYgKCFpc0RpciAmJiBzbGFzaClcbiAgICAgIG0gPSBtLnNsaWNlKDAsIC0xKVxuXG4gICAgaWYgKG0gIT09IHApIHtcbiAgICAgIHZhciBtYWJzID0gbWFrZUFicyhzZWxmLCBtKVxuICAgICAgc2VsZi5zdGF0Q2FjaGVbbWFic10gPSBzZWxmLnN0YXRDYWNoZVthYnNdXG4gICAgICBzZWxmLmNhY2hlW21hYnNdID0gc2VsZi5jYWNoZVthYnNdXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG1cbn1cblxuLy8gbG90dGEgc2l0dXBzLi4uXG5mdW5jdGlvbiBtYWtlQWJzIChzZWxmLCBmKSB7XG4gIHZhciBhYnMgPSBmXG4gIGlmIChmLmNoYXJBdCgwKSA9PT0gJy8nKSB7XG4gICAgYWJzID0gcGF0aC5qb2luKHNlbGYucm9vdCwgZilcbiAgfSBlbHNlIGlmIChpc0Fic29sdXRlKGYpIHx8IGYgPT09ICcnKSB7XG4gICAgYWJzID0gZlxuICB9IGVsc2UgaWYgKHNlbGYuY2hhbmdlZEN3ZCkge1xuICAgIGFicyA9IHBhdGgucmVzb2x2ZShzZWxmLmN3ZCwgZilcbiAgfSBlbHNlIHtcbiAgICBhYnMgPSBwYXRoLnJlc29sdmUoZilcbiAgfVxuXG4gIGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInKVxuICAgIGFicyA9IGFicy5yZXBsYWNlKC9cXFxcL2csICcvJylcblxuICByZXR1cm4gYWJzXG59XG5cblxuLy8gUmV0dXJuIHRydWUsIGlmIHBhdHRlcm4gZW5kcyB3aXRoIGdsb2JzdGFyICcqKicsIGZvciB0aGUgYWNjb21wYW55aW5nIHBhcmVudCBkaXJlY3RvcnkuXG4vLyBFeDotIElmIG5vZGVfbW9kdWxlcy8qKiBpcyB0aGUgcGF0dGVybiwgYWRkICdub2RlX21vZHVsZXMnIHRvIGlnbm9yZSBsaXN0IGFsb25nIHdpdGggaXQncyBjb250ZW50c1xuZnVuY3Rpb24gaXNJZ25vcmVkIChzZWxmLCBwYXRoKSB7XG4gIGlmICghc2VsZi5pZ25vcmUubGVuZ3RoKVxuICAgIHJldHVybiBmYWxzZVxuXG4gIHJldHVybiBzZWxmLmlnbm9yZS5zb21lKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICByZXR1cm4gaXRlbS5tYXRjaGVyLm1hdGNoKHBhdGgpIHx8ICEhKGl0ZW0uZ21hdGNoZXIgJiYgaXRlbS5nbWF0Y2hlci5tYXRjaChwYXRoKSlcbiAgfSlcbn1cblxuZnVuY3Rpb24gY2hpbGRyZW5JZ25vcmVkIChzZWxmLCBwYXRoKSB7XG4gIGlmICghc2VsZi5pZ25vcmUubGVuZ3RoKVxuICAgIHJldHVybiBmYWxzZVxuXG4gIHJldHVybiBzZWxmLmlnbm9yZS5zb21lKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICByZXR1cm4gISEoaXRlbS5nbWF0Y2hlciAmJiBpdGVtLmdtYXRjaGVyLm1hdGNoKHBhdGgpKVxuICB9KVxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2dsb2IvY29tbW9uLmpzXG4vLyBtb2R1bGUgaWQgPSAyNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgd3JhcHB5ID0gcmVxdWlyZSgnd3JhcHB5JylcbnZhciByZXFzID0gT2JqZWN0LmNyZWF0ZShudWxsKVxudmFyIG9uY2UgPSByZXF1aXJlKCdvbmNlJylcblxubW9kdWxlLmV4cG9ydHMgPSB3cmFwcHkoaW5mbGlnaHQpXG5cbmZ1bmN0aW9uIGluZmxpZ2h0IChrZXksIGNiKSB7XG4gIGlmIChyZXFzW2tleV0pIHtcbiAgICByZXFzW2tleV0ucHVzaChjYilcbiAgICByZXR1cm4gbnVsbFxuICB9IGVsc2Uge1xuICAgIHJlcXNba2V5XSA9IFtjYl1cbiAgICByZXR1cm4gbWFrZXJlcyhrZXkpXG4gIH1cbn1cblxuZnVuY3Rpb24gbWFrZXJlcyAoa2V5KSB7XG4gIHJldHVybiBvbmNlKGZ1bmN0aW9uIFJFUyAoKSB7XG4gICAgdmFyIGNicyA9IHJlcXNba2V5XVxuICAgIHZhciBsZW4gPSBjYnMubGVuZ3RoXG4gICAgdmFyIGFyZ3MgPSBzbGljZShhcmd1bWVudHMpXG5cbiAgICAvLyBYWFggSXQncyBzb21ld2hhdCBhbWJpZ3VvdXMgd2hldGhlciBhIG5ldyBjYWxsYmFjayBhZGRlZCBpbiB0aGlzXG4gICAgLy8gcGFzcyBzaG91bGQgYmUgcXVldWVkIGZvciBsYXRlciBleGVjdXRpb24gaWYgc29tZXRoaW5nIGluIHRoZVxuICAgIC8vIGxpc3Qgb2YgY2FsbGJhY2tzIHRocm93cywgb3IgaWYgaXQgc2hvdWxkIGp1c3QgYmUgZGlzY2FyZGVkLlxuICAgIC8vIEhvd2V2ZXIsIGl0J3Mgc3VjaCBhbiBlZGdlIGNhc2UgdGhhdCBpdCBoYXJkbHkgbWF0dGVycywgYW5kIGVpdGhlclxuICAgIC8vIGNob2ljZSBpcyBsaWtlbHkgYXMgc3VycHJpc2luZyBhcyB0aGUgb3RoZXIuXG4gICAgLy8gQXMgaXQgaGFwcGVucywgd2UgZG8gZ28gYWhlYWQgYW5kIHNjaGVkdWxlIGl0IGZvciBsYXRlciBleGVjdXRpb24uXG4gICAgdHJ5IHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgY2JzW2ldLmFwcGx5KG51bGwsIGFyZ3MpXG4gICAgICB9XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmIChjYnMubGVuZ3RoID4gbGVuKSB7XG4gICAgICAgIC8vIGFkZGVkIG1vcmUgaW4gdGhlIGludGVyaW0uXG4gICAgICAgIC8vIGRlLXphbGdvLCBqdXN0IGluIGNhc2UsIGJ1dCBkb24ndCBjYWxsIGFnYWluLlxuICAgICAgICBjYnMuc3BsaWNlKDAsIGxlbilcbiAgICAgICAgcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgUkVTLmFwcGx5KG51bGwsIGFyZ3MpXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkZWxldGUgcmVxc1trZXldXG4gICAgICB9XG4gICAgfVxuICB9KVxufVxuXG5mdW5jdGlvbiBzbGljZSAoYXJncykge1xuICB2YXIgbGVuZ3RoID0gYXJncy5sZW5ndGhcbiAgdmFyIGFycmF5ID0gW11cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSBhcnJheVtpXSA9IGFyZ3NbaV1cbiAgcmV0dXJuIGFycmF5XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vaW5mbGlnaHQvaW5mbGlnaHQuanNcbi8vIG1vZHVsZSBpZCA9IDI3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIFJldHVybnMgYSB3cmFwcGVyIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIHdyYXBwZWQgY2FsbGJhY2tcbi8vIFRoZSB3cmFwcGVyIGZ1bmN0aW9uIHNob3VsZCBkbyBzb21lIHN0dWZmLCBhbmQgcmV0dXJuIGFcbi8vIHByZXN1bWFibHkgZGlmZmVyZW50IGNhbGxiYWNrIGZ1bmN0aW9uLlxuLy8gVGhpcyBtYWtlcyBzdXJlIHRoYXQgb3duIHByb3BlcnRpZXMgYXJlIHJldGFpbmVkLCBzbyB0aGF0XG4vLyBkZWNvcmF0aW9ucyBhbmQgc3VjaCBhcmUgbm90IGxvc3QgYWxvbmcgdGhlIHdheS5cbm1vZHVsZS5leHBvcnRzID0gd3JhcHB5XG5mdW5jdGlvbiB3cmFwcHkgKGZuLCBjYikge1xuICBpZiAoZm4gJiYgY2IpIHJldHVybiB3cmFwcHkoZm4pKGNiKVxuXG4gIGlmICh0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicpXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignbmVlZCB3cmFwcGVyIGZ1bmN0aW9uJylcblxuICBPYmplY3Qua2V5cyhmbikuZm9yRWFjaChmdW5jdGlvbiAoaykge1xuICAgIHdyYXBwZXJba10gPSBmbltrXVxuICB9KVxuXG4gIHJldHVybiB3cmFwcGVyXG5cbiAgZnVuY3Rpb24gd3JhcHBlcigpIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoKVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50c1tpXVxuICAgIH1cbiAgICB2YXIgcmV0ID0gZm4uYXBwbHkodGhpcywgYXJncylcbiAgICB2YXIgY2IgPSBhcmdzW2FyZ3MubGVuZ3RoLTFdXG4gICAgaWYgKHR5cGVvZiByZXQgPT09ICdmdW5jdGlvbicgJiYgcmV0ICE9PSBjYikge1xuICAgICAgT2JqZWN0LmtleXMoY2IpLmZvckVhY2goZnVuY3Rpb24gKGspIHtcbiAgICAgICAgcmV0W2tdID0gY2Jba11cbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiByZXRcbiAgfVxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3dyYXBweS93cmFwcHkuanNcbi8vIG1vZHVsZSBpZCA9IDI4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciB3cmFwcHkgPSByZXF1aXJlKCd3cmFwcHknKVxubW9kdWxlLmV4cG9ydHMgPSB3cmFwcHkob25jZSlcbm1vZHVsZS5leHBvcnRzLnN0cmljdCA9IHdyYXBweShvbmNlU3RyaWN0KVxuXG5vbmNlLnByb3RvID0gb25jZShmdW5jdGlvbiAoKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShGdW5jdGlvbi5wcm90b3R5cGUsICdvbmNlJywge1xuICAgIHZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gb25jZSh0aGlzKVxuICAgIH0sXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pXG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEZ1bmN0aW9uLnByb3RvdHlwZSwgJ29uY2VTdHJpY3QnLCB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBvbmNlU3RyaWN0KHRoaXMpXG4gICAgfSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSlcbn0pXG5cbmZ1bmN0aW9uIG9uY2UgKGZuKSB7XG4gIHZhciBmID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChmLmNhbGxlZCkgcmV0dXJuIGYudmFsdWVcbiAgICBmLmNhbGxlZCA9IHRydWVcbiAgICByZXR1cm4gZi52YWx1ZSA9IGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgfVxuICBmLmNhbGxlZCA9IGZhbHNlXG4gIHJldHVybiBmXG59XG5cbmZ1bmN0aW9uIG9uY2VTdHJpY3QgKGZuKSB7XG4gIHZhciBmID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChmLmNhbGxlZClcbiAgICAgIHRocm93IG5ldyBFcnJvcihmLm9uY2VFcnJvcilcbiAgICBmLmNhbGxlZCA9IHRydWVcbiAgICByZXR1cm4gZi52YWx1ZSA9IGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgfVxuICB2YXIgbmFtZSA9IGZuLm5hbWUgfHwgJ0Z1bmN0aW9uIHdyYXBwZWQgd2l0aCBgb25jZWAnXG4gIGYub25jZUVycm9yID0gbmFtZSArIFwiIHNob3VsZG4ndCBiZSBjYWxsZWQgbW9yZSB0aGFuIG9uY2VcIlxuICBmLmNhbGxlZCA9IGZhbHNlXG4gIHJldHVybiBmXG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vb25jZS9vbmNlLmpzXG4vLyBtb2R1bGUgaWQgPSAyOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBMb2dpYyBmb3IgdW5peCBmaWxlIG1vZGUgb3BlcmF0aW9ucy5cblxuJ3VzZSBzdHJpY3QnO1xuXG4vLyBDb252ZXJ0cyBtb2RlIHRvIHN0cmluZyAzIGNoYXJhY3RlcnMgbG9uZy5cbmV4cG9ydHMubm9ybWFsaXplRmlsZU1vZGUgPSBmdW5jdGlvbiAobW9kZSkge1xuICB2YXIgbW9kZUFzU3RyaW5nO1xuICBpZiAodHlwZW9mIG1vZGUgPT09ICdudW1iZXInKSB7XG4gICAgbW9kZUFzU3RyaW5nID0gbW9kZS50b1N0cmluZyg4KTtcbiAgfSBlbHNlIHtcbiAgICBtb2RlQXNTdHJpbmcgPSBtb2RlO1xuICB9XG4gIHJldHVybiBtb2RlQXNTdHJpbmcuc3Vic3RyaW5nKG1vZGVBc1N0cmluZy5sZW5ndGggLSAzKTtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZnMtamV0cGFjay9saWIvdXRpbHMvbW9kZS5qc1xuLy8gbW9kdWxlIGlkID0gMzBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZnMgPSByZXF1aXJlKCdmcycpO1xudmFyIFEgPSByZXF1aXJlKCdxJyk7XG5cbnZhciBtb2RlVXRpbCA9IHJlcXVpcmUoJy4vdXRpbHMvbW9kZScpO1xudmFyIHZhbGlkYXRlID0gcmVxdWlyZSgnLi91dGlscy92YWxpZGF0ZScpO1xudmFyIHdyaXRlID0gcmVxdWlyZSgnLi93cml0ZScpO1xuXG52YXIgdmFsaWRhdGVJbnB1dCA9IGZ1bmN0aW9uIChtZXRob2ROYW1lLCBwYXRoLCBjcml0ZXJpYSkge1xuICB2YXIgbWV0aG9kU2lnbmF0dXJlID0gbWV0aG9kTmFtZSArICcocGF0aCwgW2NyaXRlcmlhXSknO1xuICB2YWxpZGF0ZS5hcmd1bWVudChtZXRob2RTaWduYXR1cmUsICdwYXRoJywgcGF0aCwgWydzdHJpbmcnXSk7XG4gIHZhbGlkYXRlLm9wdGlvbnMobWV0aG9kU2lnbmF0dXJlLCAnY3JpdGVyaWEnLCBjcml0ZXJpYSwge1xuICAgIGNvbnRlbnQ6IFsnc3RyaW5nJywgJ2J1ZmZlcicsICdvYmplY3QnLCAnYXJyYXknXSxcbiAgICBqc29uSW5kZW50OiBbJ251bWJlciddLFxuICAgIG1vZGU6IFsnc3RyaW5nJywgJ251bWJlciddXG4gIH0pO1xufTtcblxudmFyIGdldENyaXRlcmlhRGVmYXVsdHMgPSBmdW5jdGlvbiAocGFzc2VkQ3JpdGVyaWEpIHtcbiAgdmFyIGNyaXRlcmlhID0gcGFzc2VkQ3JpdGVyaWEgfHwge307XG4gIGlmIChjcml0ZXJpYS5tb2RlICE9PSB1bmRlZmluZWQpIHtcbiAgICBjcml0ZXJpYS5tb2RlID0gbW9kZVV0aWwubm9ybWFsaXplRmlsZU1vZGUoY3JpdGVyaWEubW9kZSk7XG4gIH1cbiAgcmV0dXJuIGNyaXRlcmlhO1xufTtcblxudmFyIGdlbmVyYXRlUGF0aE9jY3VwaWVkQnlOb3RGaWxlRXJyb3IgPSBmdW5jdGlvbiAocGF0aCkge1xuICByZXR1cm4gbmV3IEVycm9yKCdQYXRoICcgKyBwYXRoICsgJyBleGlzdHMgYnV0IGlzIG5vdCBhIGZpbGUuJyArXG4gICAgICAnIEhhbHRpbmcgamV0cGFjay5maWxlKCkgY2FsbCBmb3Igc2FmZXR5IHJlYXNvbnMuJyk7XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFN5bmNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgY2hlY2tXaGF0QWxyZWFkeU9jY3VwaWVzUGF0aFN5bmMgPSBmdW5jdGlvbiAocGF0aCkge1xuICB2YXIgc3RhdDtcblxuICB0cnkge1xuICAgIHN0YXQgPSBmcy5zdGF0U3luYyhwYXRoKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgLy8gRGV0ZWN0aW9uIGlmIHBhdGggZXhpc3RzXG4gICAgaWYgKGVyci5jb2RlICE9PSAnRU5PRU5UJykge1xuICAgICAgdGhyb3cgZXJyO1xuICAgIH1cbiAgfVxuXG4gIGlmIChzdGF0ICYmICFzdGF0LmlzRmlsZSgpKSB7XG4gICAgdGhyb3cgZ2VuZXJhdGVQYXRoT2NjdXBpZWRCeU5vdEZpbGVFcnJvcihwYXRoKTtcbiAgfVxuXG4gIHJldHVybiBzdGF0O1xufTtcblxudmFyIGNoZWNrRXhpc3RpbmdGaWxlRnVsZmlsbHNDcml0ZXJpYVN5bmMgPSBmdW5jdGlvbiAocGF0aCwgc3RhdCwgY3JpdGVyaWEpIHtcbiAgdmFyIG1vZGUgPSBtb2RlVXRpbC5ub3JtYWxpemVGaWxlTW9kZShzdGF0Lm1vZGUpO1xuXG4gIHZhciBjaGVja0NvbnRlbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGNyaXRlcmlhLmNvbnRlbnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgd3JpdGUuc3luYyhwYXRoLCBjcml0ZXJpYS5jb250ZW50LCB7XG4gICAgICAgIG1vZGU6IG1vZGUsXG4gICAgICAgIGpzb25JbmRlbnQ6IGNyaXRlcmlhLmpzb25JbmRlbnRcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICB2YXIgY2hlY2tNb2RlID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChjcml0ZXJpYS5tb2RlICE9PSB1bmRlZmluZWQgJiYgY3JpdGVyaWEubW9kZSAhPT0gbW9kZSkge1xuICAgICAgZnMuY2htb2RTeW5jKHBhdGgsIGNyaXRlcmlhLm1vZGUpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgY29udGVudFJlcGxhY2VkID0gY2hlY2tDb250ZW50KCk7XG4gIGlmICghY29udGVudFJlcGxhY2VkKSB7XG4gICAgY2hlY2tNb2RlKCk7XG4gIH1cbn07XG5cbnZhciBjcmVhdGVCcmFuZE5ld0ZpbGVTeW5jID0gZnVuY3Rpb24gKHBhdGgsIGNyaXRlcmlhKSB7XG4gIHZhciBjb250ZW50ID0gJyc7XG4gIGlmIChjcml0ZXJpYS5jb250ZW50ICE9PSB1bmRlZmluZWQpIHtcbiAgICBjb250ZW50ID0gY3JpdGVyaWEuY29udGVudDtcbiAgfVxuICB3cml0ZS5zeW5jKHBhdGgsIGNvbnRlbnQsIHtcbiAgICBtb2RlOiBjcml0ZXJpYS5tb2RlLFxuICAgIGpzb25JbmRlbnQ6IGNyaXRlcmlhLmpzb25JbmRlbnRcbiAgfSk7XG59O1xuXG52YXIgZmlsZVN5bmMgPSBmdW5jdGlvbiAocGF0aCwgcGFzc2VkQ3JpdGVyaWEpIHtcbiAgdmFyIGNyaXRlcmlhID0gZ2V0Q3JpdGVyaWFEZWZhdWx0cyhwYXNzZWRDcml0ZXJpYSk7XG4gIHZhciBzdGF0ID0gY2hlY2tXaGF0QWxyZWFkeU9jY3VwaWVzUGF0aFN5bmMocGF0aCk7XG4gIGlmIChzdGF0ICE9PSB1bmRlZmluZWQpIHtcbiAgICBjaGVja0V4aXN0aW5nRmlsZUZ1bGZpbGxzQ3JpdGVyaWFTeW5jKHBhdGgsIHN0YXQsIGNyaXRlcmlhKTtcbiAgfSBlbHNlIHtcbiAgICBjcmVhdGVCcmFuZE5ld0ZpbGVTeW5jKHBhdGgsIGNyaXRlcmlhKTtcbiAgfVxufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBBc3luY1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBwcm9taXNlZFN0YXQgPSBRLmRlbm9kZWlmeShmcy5zdGF0KTtcbnZhciBwcm9taXNlZENobW9kID0gUS5kZW5vZGVpZnkoZnMuY2htb2QpO1xuXG52YXIgY2hlY2tXaGF0QWxyZWFkeU9jY3VwaWVzUGF0aEFzeW5jID0gZnVuY3Rpb24gKHBhdGgpIHtcbiAgdmFyIGRlZmVycmVkID0gUS5kZWZlcigpO1xuXG4gIHByb21pc2VkU3RhdChwYXRoKVxuICAudGhlbihmdW5jdGlvbiAoc3RhdCkge1xuICAgIGlmIChzdGF0LmlzRmlsZSgpKSB7XG4gICAgICBkZWZlcnJlZC5yZXNvbHZlKHN0YXQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWZlcnJlZC5yZWplY3QoZ2VuZXJhdGVQYXRoT2NjdXBpZWRCeU5vdEZpbGVFcnJvcihwYXRoKSk7XG4gICAgfVxuICB9KVxuICAuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgIGlmIChlcnIuY29kZSA9PT0gJ0VOT0VOVCcpIHtcbiAgICAgIC8vIFBhdGggZG9lc24ndCBleGlzdC5cbiAgICAgIGRlZmVycmVkLnJlc29sdmUodW5kZWZpbmVkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVGhpcyBpcyBvdGhlciBlcnJvci4gTXVzdCBlbmQgaGVyZS5cbiAgICAgIGRlZmVycmVkLnJlamVjdChlcnIpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59O1xuXG52YXIgY2hlY2tFeGlzdGluZ0ZpbGVGdWxmaWxsc0NyaXRlcmlhQXN5bmMgPSBmdW5jdGlvbiAocGF0aCwgc3RhdCwgY3JpdGVyaWEpIHtcbiAgdmFyIG1vZGUgPSBtb2RlVXRpbC5ub3JtYWxpemVGaWxlTW9kZShzdGF0Lm1vZGUpO1xuXG4gIHZhciBjaGVja0NvbnRlbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGRlZmVycmVkID0gUS5kZWZlcigpO1xuXG4gICAgaWYgKGNyaXRlcmlhLmNvbnRlbnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgd3JpdGUuYXN5bmMocGF0aCwgY3JpdGVyaWEuY29udGVudCwge1xuICAgICAgICBtb2RlOiBtb2RlLFxuICAgICAgICBqc29uSW5kZW50OiBjcml0ZXJpYS5qc29uSW5kZW50XG4gICAgICB9KVxuICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHRydWUpO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaChkZWZlcnJlZC5yZWplY3QpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWZlcnJlZC5yZXNvbHZlKGZhbHNlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgfTtcblxuICB2YXIgY2hlY2tNb2RlID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChjcml0ZXJpYS5tb2RlICE9PSB1bmRlZmluZWQgJiYgY3JpdGVyaWEubW9kZSAhPT0gbW9kZSkge1xuICAgICAgcmV0dXJuIHByb21pc2VkQ2htb2QocGF0aCwgY3JpdGVyaWEubW9kZSk7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH07XG5cbiAgcmV0dXJuIGNoZWNrQ29udGVudCgpXG4gIC50aGVuKGZ1bmN0aW9uIChjb250ZW50UmVwbGFjZWQpIHtcbiAgICBpZiAoIWNvbnRlbnRSZXBsYWNlZCkge1xuICAgICAgcmV0dXJuIGNoZWNrTW9kZSgpO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9KTtcbn07XG5cbnZhciBjcmVhdGVCcmFuZE5ld0ZpbGVBc3luYyA9IGZ1bmN0aW9uIChwYXRoLCBjcml0ZXJpYSkge1xuICB2YXIgY29udGVudCA9ICcnO1xuICBpZiAoY3JpdGVyaWEuY29udGVudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgY29udGVudCA9IGNyaXRlcmlhLmNvbnRlbnQ7XG4gIH1cblxuICByZXR1cm4gd3JpdGUuYXN5bmMocGF0aCwgY29udGVudCwge1xuICAgIG1vZGU6IGNyaXRlcmlhLm1vZGUsXG4gICAganNvbkluZGVudDogY3JpdGVyaWEuanNvbkluZGVudFxuICB9KTtcbn07XG5cbnZhciBmaWxlQXN5bmMgPSBmdW5jdGlvbiAocGF0aCwgcGFzc2VkQ3JpdGVyaWEpIHtcbiAgdmFyIGRlZmVycmVkID0gUS5kZWZlcigpO1xuICB2YXIgY3JpdGVyaWEgPSBnZXRDcml0ZXJpYURlZmF1bHRzKHBhc3NlZENyaXRlcmlhKTtcblxuICBjaGVja1doYXRBbHJlYWR5T2NjdXBpZXNQYXRoQXN5bmMocGF0aClcbiAgLnRoZW4oZnVuY3Rpb24gKHN0YXQpIHtcbiAgICBpZiAoc3RhdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gY2hlY2tFeGlzdGluZ0ZpbGVGdWxmaWxsc0NyaXRlcmlhQXN5bmMocGF0aCwgc3RhdCwgY3JpdGVyaWEpO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQnJhbmROZXdGaWxlQXN5bmMocGF0aCwgY3JpdGVyaWEpO1xuICB9KVxuICAudGhlbihkZWZlcnJlZC5yZXNvbHZlLCBkZWZlcnJlZC5yZWplY3QpO1xuXG4gIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBBUElcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5leHBvcnRzLnZhbGlkYXRlSW5wdXQgPSB2YWxpZGF0ZUlucHV0O1xuZXhwb3J0cy5zeW5jID0gZmlsZVN5bmM7XG5leHBvcnRzLmFzeW5jID0gZmlsZUFzeW5jO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZzLWpldHBhY2svbGliL2ZpbGUuanNcbi8vIG1vZHVsZSBpZCA9IDMxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxudmFyIHBhdGhVdGlsID0gcmVxdWlyZSgncGF0aCcpO1xudmFyIFEgPSByZXF1aXJlKCdxJyk7XG52YXIgdHJlZVdhbGtlciA9IHJlcXVpcmUoJy4vdXRpbHMvdHJlZV93YWxrZXInKTtcbnZhciBpbnNwZWN0ID0gcmVxdWlyZSgnLi9pbnNwZWN0Jyk7XG52YXIgbWF0Y2hlciA9IHJlcXVpcmUoJy4vdXRpbHMvbWF0Y2hlcicpO1xudmFyIHZhbGlkYXRlID0gcmVxdWlyZSgnLi91dGlscy92YWxpZGF0ZScpO1xuXG52YXIgdmFsaWRhdGVJbnB1dCA9IGZ1bmN0aW9uIChtZXRob2ROYW1lLCBwYXRoLCBvcHRpb25zKSB7XG4gIHZhciBtZXRob2RTaWduYXR1cmUgPSBtZXRob2ROYW1lICsgJyhbcGF0aF0sIG9wdGlvbnMpJztcbiAgdmFsaWRhdGUuYXJndW1lbnQobWV0aG9kU2lnbmF0dXJlLCAncGF0aCcsIHBhdGgsIFsnc3RyaW5nJ10pO1xuICB2YWxpZGF0ZS5vcHRpb25zKG1ldGhvZFNpZ25hdHVyZSwgJ29wdGlvbnMnLCBvcHRpb25zLCB7XG4gICAgbWF0Y2hpbmc6IFsnc3RyaW5nJywgJ2FycmF5IG9mIHN0cmluZyddLFxuICAgIGZpbGVzOiBbJ2Jvb2xlYW4nXSxcbiAgICBkaXJlY3RvcmllczogWydib29sZWFuJ10sXG4gICAgcmVjdXJzaXZlOiBbJ2Jvb2xlYW4nXVxuICB9KTtcbn07XG5cbnZhciBub3JtYWxpemVPcHRpb25zID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgdmFyIG9wdHMgPSBvcHRpb25zIHx8IHt9O1xuICAvLyBkZWZhdWx0czpcbiAgaWYgKG9wdHMuZmlsZXMgPT09IHVuZGVmaW5lZCkge1xuICAgIG9wdHMuZmlsZXMgPSB0cnVlO1xuICB9XG4gIGlmIChvcHRzLmRpcmVjdG9yaWVzID09PSB1bmRlZmluZWQpIHtcbiAgICBvcHRzLmRpcmVjdG9yaWVzID0gZmFsc2U7XG4gIH1cbiAgaWYgKG9wdHMucmVjdXJzaXZlID09PSB1bmRlZmluZWQpIHtcbiAgICBvcHRzLnJlY3Vyc2l2ZSA9IHRydWU7XG4gIH1cbiAgcmV0dXJuIG9wdHM7XG59O1xuXG52YXIgcHJvY2Vzc0ZvdW5kT2JqZWN0cyA9IGZ1bmN0aW9uIChmb3VuZE9iamVjdHMsIGN3ZCkge1xuICByZXR1cm4gZm91bmRPYmplY3RzLm1hcChmdW5jdGlvbiAoaW5zcGVjdE9iaikge1xuICAgIHJldHVybiBwYXRoVXRpbC5yZWxhdGl2ZShjd2QsIGluc3BlY3RPYmouYWJzb2x1dGVQYXRoKTtcbiAgfSk7XG59O1xuXG52YXIgZ2VuZXJhdGVQYXRoRG9lc250RXhpc3RFcnJvciA9IGZ1bmN0aW9uIChwYXRoKSB7XG4gIHZhciBlcnIgPSBuZXcgRXJyb3IoXCJQYXRoIHlvdSB3YW50IHRvIGZpbmQgc3R1ZmYgaW4gZG9lc24ndCBleGlzdCBcIiArIHBhdGgpO1xuICBlcnIuY29kZSA9ICdFTk9FTlQnO1xuICByZXR1cm4gZXJyO1xufTtcblxudmFyIGdlbmVyYXRlUGF0aE5vdERpcmVjdG9yeUVycm9yID0gZnVuY3Rpb24gKHBhdGgpIHtcbiAgdmFyIGVyciA9IG5ldyBFcnJvcignUGF0aCB5b3Ugd2FudCB0byBmaW5kIHN0dWZmIGluIG11c3QgYmUgYSBkaXJlY3RvcnkgJyArIHBhdGgpO1xuICBlcnIuY29kZSA9ICdFTk9URElSJztcbiAgcmV0dXJuIGVycjtcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gU3luY1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBmaW5kU3luYyA9IGZ1bmN0aW9uIChwYXRoLCBvcHRpb25zKSB7XG4gIHZhciBmb3VuZEluc3BlY3RPYmplY3RzID0gW107XG4gIHZhciBtYXRjaGVzQW55T2ZHbG9icyA9IG1hdGNoZXIuY3JlYXRlKHBhdGgsIG9wdGlvbnMubWF0Y2hpbmcpO1xuXG4gIHRyZWVXYWxrZXIuc3luYyhwYXRoLCB7XG4gICAgbWF4TGV2ZWxzRGVlcDogb3B0aW9ucy5yZWN1cnNpdmUgPyBJbmZpbml0eSA6IDEsXG4gICAgaW5zcGVjdE9wdGlvbnM6IHtcbiAgICAgIGFic29sdXRlUGF0aDogdHJ1ZVxuICAgIH1cbiAgfSwgZnVuY3Rpb24gKGl0ZW1QYXRoLCBpdGVtKSB7XG4gICAgaWYgKGl0ZW1QYXRoICE9PSBwYXRoICYmIG1hdGNoZXNBbnlPZkdsb2JzKGl0ZW1QYXRoKSkge1xuICAgICAgaWYgKChpdGVtLnR5cGUgPT09ICdmaWxlJyAmJiBvcHRpb25zLmZpbGVzID09PSB0cnVlKVxuICAgICAgICB8fCAoaXRlbS50eXBlID09PSAnZGlyJyAmJiBvcHRpb25zLmRpcmVjdG9yaWVzID09PSB0cnVlKSkge1xuICAgICAgICBmb3VuZEluc3BlY3RPYmplY3RzLnB1c2goaXRlbSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gcHJvY2Vzc0ZvdW5kT2JqZWN0cyhmb3VuZEluc3BlY3RPYmplY3RzLCBvcHRpb25zLmN3ZCk7XG59O1xuXG52YXIgZmluZFN5bmNJbml0ID0gZnVuY3Rpb24gKHBhdGgsIG9wdGlvbnMpIHtcbiAgdmFyIGVudHJ5UG9pbnRJbnNwZWN0ID0gaW5zcGVjdC5zeW5jKHBhdGgpO1xuICBpZiAoZW50cnlQb2ludEluc3BlY3QgPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IGdlbmVyYXRlUGF0aERvZXNudEV4aXN0RXJyb3IocGF0aCk7XG4gIH0gZWxzZSBpZiAoZW50cnlQb2ludEluc3BlY3QudHlwZSAhPT0gJ2RpcicpIHtcbiAgICB0aHJvdyBnZW5lcmF0ZVBhdGhOb3REaXJlY3RvcnlFcnJvcihwYXRoKTtcbiAgfVxuXG4gIHJldHVybiBmaW5kU3luYyhwYXRoLCBub3JtYWxpemVPcHRpb25zKG9wdGlvbnMpKTtcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gQXN5bmNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgZmluZEFzeW5jID0gZnVuY3Rpb24gKHBhdGgsIG9wdGlvbnMpIHtcbiAgdmFyIGRlZmVycmVkID0gUS5kZWZlcigpO1xuICB2YXIgZm91bmRJbnNwZWN0T2JqZWN0cyA9IFtdO1xuICB2YXIgbWF0Y2hlc0FueU9mR2xvYnMgPSBtYXRjaGVyLmNyZWF0ZShwYXRoLCBvcHRpb25zLm1hdGNoaW5nKTtcblxuICB2YXIgd2Fsa2VyID0gdHJlZVdhbGtlci5zdHJlYW0ocGF0aCwge1xuICAgIG1heExldmVsc0RlZXA6IG9wdGlvbnMucmVjdXJzaXZlID8gSW5maW5pdHkgOiAxLFxuICAgIGluc3BlY3RPcHRpb25zOiB7XG4gICAgICBhYnNvbHV0ZVBhdGg6IHRydWVcbiAgICB9XG4gIH0pXG4gIC5vbigncmVhZGFibGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGRhdGEgPSB3YWxrZXIucmVhZCgpO1xuICAgIHZhciBpdGVtO1xuICAgIGlmIChkYXRhICYmIGRhdGEucGF0aCAhPT0gcGF0aCAmJiBtYXRjaGVzQW55T2ZHbG9icyhkYXRhLnBhdGgpKSB7XG4gICAgICBpdGVtID0gZGF0YS5pdGVtO1xuICAgICAgaWYgKChpdGVtLnR5cGUgPT09ICdmaWxlJyAmJiBvcHRpb25zLmZpbGVzID09PSB0cnVlKVxuICAgICAgICB8fCAoaXRlbS50eXBlID09PSAnZGlyJyAmJiBvcHRpb25zLmRpcmVjdG9yaWVzID09PSB0cnVlKSkge1xuICAgICAgICBmb3VuZEluc3BlY3RPYmplY3RzLnB1c2goaXRlbSk7XG4gICAgICB9XG4gICAgfVxuICB9KVxuICAub24oJ2Vycm9yJywgZGVmZXJyZWQucmVqZWN0KVxuICAub24oJ2VuZCcsIGZ1bmN0aW9uICgpIHtcbiAgICBkZWZlcnJlZC5yZXNvbHZlKHByb2Nlc3NGb3VuZE9iamVjdHMoZm91bmRJbnNwZWN0T2JqZWN0cywgb3B0aW9ucy5jd2QpKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59O1xuXG52YXIgZmluZEFzeW5jSW5pdCA9IGZ1bmN0aW9uIChwYXRoLCBvcHRpb25zKSB7XG4gIHJldHVybiBpbnNwZWN0LmFzeW5jKHBhdGgpXG4gIC50aGVuKGZ1bmN0aW9uIChlbnRyeVBvaW50SW5zcGVjdCkge1xuICAgIGlmIChlbnRyeVBvaW50SW5zcGVjdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBnZW5lcmF0ZVBhdGhEb2VzbnRFeGlzdEVycm9yKHBhdGgpO1xuICAgIH0gZWxzZSBpZiAoZW50cnlQb2ludEluc3BlY3QudHlwZSAhPT0gJ2RpcicpIHtcbiAgICAgIHRocm93IGdlbmVyYXRlUGF0aE5vdERpcmVjdG9yeUVycm9yKHBhdGgpO1xuICAgIH1cbiAgICByZXR1cm4gZmluZEFzeW5jKHBhdGgsIG5vcm1hbGl6ZU9wdGlvbnMob3B0aW9ucykpO1xuICB9KTtcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gQVBJXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZXhwb3J0cy52YWxpZGF0ZUlucHV0ID0gdmFsaWRhdGVJbnB1dDtcbmV4cG9ydHMuc3luYyA9IGZpbmRTeW5jSW5pdDtcbmV4cG9ydHMuYXN5bmMgPSBmaW5kQXN5bmNJbml0O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZzLWpldHBhY2svbGliL2ZpbmQuanNcbi8vIG1vZHVsZSBpZCA9IDMyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qIGVzbGludCBuby11bmRlcnNjb3JlLWRhbmdsZTowICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIFJlYWRhYmxlID0gcmVxdWlyZSgnc3RyZWFtJykuUmVhZGFibGU7XG52YXIgcGF0aFV0aWwgPSByZXF1aXJlKCdwYXRoJyk7XG52YXIgaW5zcGVjdCA9IHJlcXVpcmUoJy4uL2luc3BlY3QnKTtcbnZhciBsaXN0ID0gcmVxdWlyZSgnLi4vbGlzdCcpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFNZTkNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgd2Fsa1N5bmMgPSBmdW5jdGlvbiAocGF0aCwgb3B0aW9ucywgY2FsbGJhY2ssIGN1cnJlbnRMZXZlbCkge1xuICB2YXIgaXRlbSA9IGluc3BlY3Quc3luYyhwYXRoLCBvcHRpb25zLmluc3BlY3RPcHRpb25zKTtcblxuICBpZiAob3B0aW9ucy5tYXhMZXZlbHNEZWVwID09PSB1bmRlZmluZWQpIHtcbiAgICBvcHRpb25zLm1heExldmVsc0RlZXAgPSBJbmZpbml0eTtcbiAgfVxuICBpZiAoY3VycmVudExldmVsID09PSB1bmRlZmluZWQpIHtcbiAgICBjdXJyZW50TGV2ZWwgPSAwO1xuICB9XG5cbiAgY2FsbGJhY2socGF0aCwgaXRlbSk7XG4gIGlmIChpdGVtICYmIGl0ZW0udHlwZSA9PT0gJ2RpcicgJiYgY3VycmVudExldmVsIDwgb3B0aW9ucy5tYXhMZXZlbHNEZWVwKSB7XG4gICAgbGlzdC5zeW5jKHBhdGgpLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICB3YWxrU3luYyhwYXRoICsgcGF0aFV0aWwuc2VwICsgY2hpbGQsIG9wdGlvbnMsIGNhbGxiYWNrLCBjdXJyZW50TGV2ZWwgKyAxKTtcbiAgICB9KTtcbiAgfVxufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBTVFJFQU1cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgd2Fsa1N0cmVhbSA9IGZ1bmN0aW9uIChwYXRoLCBvcHRpb25zKSB7XG4gIHZhciBycyA9IG5ldyBSZWFkYWJsZSh7IG9iamVjdE1vZGU6IHRydWUgfSk7XG4gIHZhciBuZXh0VHJlZU5vZGUgPSB7XG4gICAgcGF0aDogcGF0aCxcbiAgICBwYXJlbnQ6IHVuZGVmaW5lZCxcbiAgICBsZXZlbDogMFxuICB9O1xuICB2YXIgcnVubmluZyA9IGZhbHNlO1xuICB2YXIgcmVhZFNvbWU7XG5cbiAgdmFyIGVycm9yID0gZnVuY3Rpb24gKGVycikge1xuICAgIHJzLmVtaXQoJ2Vycm9yJywgZXJyKTtcbiAgfTtcblxuICB2YXIgZmluZE5leHRVbnByb2Nlc3NlZE5vZGUgPSBmdW5jdGlvbiAobm9kZSkge1xuICAgIGlmIChub2RlLm5leHRTaWJsaW5nKSB7XG4gICAgICByZXR1cm4gbm9kZS5uZXh0U2libGluZztcbiAgICB9IGVsc2UgaWYgKG5vZGUucGFyZW50KSB7XG4gICAgICByZXR1cm4gZmluZE5leHRVbnByb2Nlc3NlZE5vZGUobm9kZS5wYXJlbnQpO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9O1xuXG4gIHZhciBwdXNoQW5kQ29udGludWVNYXliZSA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdmFyIHRoZXlXYW50TW9yZSA9IHJzLnB1c2goZGF0YSk7XG4gICAgcnVubmluZyA9IGZhbHNlO1xuICAgIGlmICghbmV4dFRyZWVOb2RlKSB7XG4gICAgICAvLyBQcmV2aW91cyB3YXMgdGhlIGxhc3Qgbm9kZS4gVGhlIGpvYiBpcyBkb25lLlxuICAgICAgcnMucHVzaChudWxsKTtcbiAgICB9IGVsc2UgaWYgKHRoZXlXYW50TW9yZSkge1xuICAgICAgcmVhZFNvbWUoKTtcbiAgICB9XG4gIH07XG5cbiAgaWYgKG9wdGlvbnMubWF4TGV2ZWxzRGVlcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgb3B0aW9ucy5tYXhMZXZlbHNEZWVwID0gSW5maW5pdHk7XG4gIH1cblxuICByZWFkU29tZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGhlTm9kZSA9IG5leHRUcmVlTm9kZTtcblxuICAgIHJ1bm5pbmcgPSB0cnVlO1xuXG4gICAgaW5zcGVjdC5hc3luYyh0aGVOb2RlLnBhdGgsIG9wdGlvbnMuaW5zcGVjdE9wdGlvbnMpXG4gICAgLnRoZW4oZnVuY3Rpb24gKGluc3BlY3RlZCkge1xuICAgICAgdGhlTm9kZS5pbnNwZWN0ZWQgPSBpbnNwZWN0ZWQ7XG4gICAgICBpZiAoaW5zcGVjdGVkICYmIGluc3BlY3RlZC50eXBlID09PSAnZGlyJyAmJiB0aGVOb2RlLmxldmVsIDwgb3B0aW9ucy5tYXhMZXZlbHNEZWVwKSB7XG4gICAgICAgIGxpc3QuYXN5bmModGhlTm9kZS5wYXRoKVxuICAgICAgICAudGhlbihmdW5jdGlvbiAoY2hpbGRyZW5OYW1lcykge1xuICAgICAgICAgIHZhciBjaGlsZHJlbiA9IGNoaWxkcmVuTmFtZXMubWFwKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICAgICAgICBwYXRoOiB0aGVOb2RlLnBhdGggKyBwYXRoVXRpbC5zZXAgKyBuYW1lLFxuICAgICAgICAgICAgICBwYXJlbnQ6IHRoZU5vZGUsXG4gICAgICAgICAgICAgIGxldmVsOiB0aGVOb2RlLmxldmVsICsgMVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCwgaW5kZXgpIHtcbiAgICAgICAgICAgIGNoaWxkLm5leHRTaWJsaW5nID0gY2hpbGRyZW5baW5kZXggKyAxXTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIG5leHRUcmVlTm9kZSA9IGNoaWxkcmVuWzBdIHx8IGZpbmROZXh0VW5wcm9jZXNzZWROb2RlKHRoZU5vZGUpO1xuICAgICAgICAgIHB1c2hBbmRDb250aW51ZU1heWJlKHsgcGF0aDogdGhlTm9kZS5wYXRoLCBpdGVtOiBpbnNwZWN0ZWQgfSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChlcnJvcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXh0VHJlZU5vZGUgPSBmaW5kTmV4dFVucHJvY2Vzc2VkTm9kZSh0aGVOb2RlKTtcbiAgICAgICAgcHVzaEFuZENvbnRpbnVlTWF5YmUoeyBwYXRoOiB0aGVOb2RlLnBhdGgsIGl0ZW06IGluc3BlY3RlZCB9KTtcbiAgICAgIH1cbiAgICB9KVxuICAgIC5jYXRjaChlcnJvcik7XG4gIH07XG5cbiAgcnMuX3JlYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCFydW5uaW5nKSB7XG4gICAgICByZWFkU29tZSgpO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gcnM7XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEFQSVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmV4cG9ydHMuc3luYyA9IHdhbGtTeW5jO1xuZXhwb3J0cy5zdHJlYW0gPSB3YWxrU3RyZWFtO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZzLWpldHBhY2svbGliL3V0aWxzL3RyZWVfd2Fsa2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAzM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJzdHJlYW1cIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJzdHJlYW1cIlxuLy8gbW9kdWxlIGlkID0gMzRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZnMgPSByZXF1aXJlKCdmcycpO1xudmFyIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xudmFyIHBhdGhVdGlsID0gcmVxdWlyZSgncGF0aCcpO1xudmFyIFEgPSByZXF1aXJlKCdxJyk7XG52YXIgdmFsaWRhdGUgPSByZXF1aXJlKCcuL3V0aWxzL3ZhbGlkYXRlJyk7XG5cbnZhciBzdXBwb3J0ZWRDaGVja3N1bUFsZ29yaXRobXMgPSBbJ21kNScsICdzaGExJywgJ3NoYTI1NicsICdzaGE1MTInXTtcblxudmFyIHN5bWxpbmtPcHRpb25zID0gWydyZXBvcnQnLCAnZm9sbG93J107XG5cbnZhciB2YWxpZGF0ZUlucHV0ID0gZnVuY3Rpb24gKG1ldGhvZE5hbWUsIHBhdGgsIG9wdGlvbnMpIHtcbiAgdmFyIG1ldGhvZFNpZ25hdHVyZSA9IG1ldGhvZE5hbWUgKyAnKHBhdGgsIFtvcHRpb25zXSknO1xuICB2YWxpZGF0ZS5hcmd1bWVudChtZXRob2RTaWduYXR1cmUsICdwYXRoJywgcGF0aCwgWydzdHJpbmcnXSk7XG4gIHZhbGlkYXRlLm9wdGlvbnMobWV0aG9kU2lnbmF0dXJlLCAnb3B0aW9ucycsIG9wdGlvbnMsIHtcbiAgICBjaGVja3N1bTogWydzdHJpbmcnXSxcbiAgICBtb2RlOiBbJ2Jvb2xlYW4nXSxcbiAgICB0aW1lczogWydib29sZWFuJ10sXG4gICAgYWJzb2x1dGVQYXRoOiBbJ2Jvb2xlYW4nXSxcbiAgICBzeW1saW5rczogWydzdHJpbmcnXVxuICB9KTtcblxuICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmNoZWNrc3VtICE9PSB1bmRlZmluZWRcbiAgICAmJiBzdXBwb3J0ZWRDaGVja3N1bUFsZ29yaXRobXMuaW5kZXhPZihvcHRpb25zLmNoZWNrc3VtKSA9PT0gLTEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0FyZ3VtZW50IFwib3B0aW9ucy5jaGVja3N1bVwiIHBhc3NlZCB0byAnICsgbWV0aG9kU2lnbmF0dXJlXG4gICAgICArICcgbXVzdCBoYXZlIG9uZSBvZiB2YWx1ZXM6ICcgKyBzdXBwb3J0ZWRDaGVja3N1bUFsZ29yaXRobXMuam9pbignLCAnKSk7XG4gIH1cblxuICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnN5bWxpbmtzICE9PSB1bmRlZmluZWRcbiAgICAmJiBzeW1saW5rT3B0aW9ucy5pbmRleE9mKG9wdGlvbnMuc3ltbGlua3MpID09PSAtMSkge1xuICAgIHRocm93IG5ldyBFcnJvcignQXJndW1lbnQgXCJvcHRpb25zLnN5bWxpbmtzXCIgcGFzc2VkIHRvICcgKyBtZXRob2RTaWduYXR1cmVcbiAgICAgICsgJyBtdXN0IGhhdmUgb25lIG9mIHZhbHVlczogJyArIHN5bWxpbmtPcHRpb25zLmpvaW4oJywgJykpO1xuICB9XG59O1xuXG52YXIgY3JlYXRlSW5zcGVjdE9iaiA9IGZ1bmN0aW9uIChwYXRoLCBvcHRpb25zLCBzdGF0KSB7XG4gIHZhciBvYmogPSB7fTtcblxuICBvYmoubmFtZSA9IHBhdGhVdGlsLmJhc2VuYW1lKHBhdGgpO1xuXG4gIGlmIChzdGF0LmlzRmlsZSgpKSB7XG4gICAgb2JqLnR5cGUgPSAnZmlsZSc7XG4gICAgb2JqLnNpemUgPSBzdGF0LnNpemU7XG4gIH0gZWxzZSBpZiAoc3RhdC5pc0RpcmVjdG9yeSgpKSB7XG4gICAgb2JqLnR5cGUgPSAnZGlyJztcbiAgfSBlbHNlIGlmIChzdGF0LmlzU3ltYm9saWNMaW5rKCkpIHtcbiAgICBvYmoudHlwZSA9ICdzeW1saW5rJztcbiAgfSBlbHNlIHtcbiAgICBvYmoudHlwZSA9ICdvdGhlcic7XG4gIH1cblxuICBpZiAob3B0aW9ucy5tb2RlKSB7XG4gICAgb2JqLm1vZGUgPSBzdGF0Lm1vZGU7XG4gIH1cblxuICBpZiAob3B0aW9ucy50aW1lcykge1xuICAgIG9iai5hY2Nlc3NUaW1lID0gc3RhdC5hdGltZTtcbiAgICBvYmoubW9kaWZ5VGltZSA9IHN0YXQubXRpbWU7XG4gICAgb2JqLmNoYW5nZVRpbWUgPSBzdGF0LmN0aW1lO1xuICB9XG5cbiAgaWYgKG9wdGlvbnMuYWJzb2x1dGVQYXRoKSB7XG4gICAgb2JqLmFic29sdXRlUGF0aCA9IHBhdGg7XG4gIH1cblxuICByZXR1cm4gb2JqO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBTeW5jXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGZpbGVDaGVja3N1bSA9IGZ1bmN0aW9uIChwYXRoLCBhbGdvKSB7XG4gIHZhciBoYXNoID0gY3J5cHRvLmNyZWF0ZUhhc2goYWxnbyk7XG4gIHZhciBkYXRhID0gZnMucmVhZEZpbGVTeW5jKHBhdGgpO1xuICBoYXNoLnVwZGF0ZShkYXRhKTtcbiAgcmV0dXJuIGhhc2guZGlnZXN0KCdoZXgnKTtcbn07XG5cbnZhciBhZGRFeHRyYUZpZWxkc1N5bmMgPSBmdW5jdGlvbiAocGF0aCwgaW5zcGVjdE9iaiwgb3B0aW9ucykge1xuICBpZiAoaW5zcGVjdE9iai50eXBlID09PSAnZmlsZScgJiYgb3B0aW9ucy5jaGVja3N1bSkge1xuICAgIGluc3BlY3RPYmpbb3B0aW9ucy5jaGVja3N1bV0gPSBmaWxlQ2hlY2tzdW0ocGF0aCwgb3B0aW9ucy5jaGVja3N1bSk7XG4gIH0gZWxzZSBpZiAoaW5zcGVjdE9iai50eXBlID09PSAnc3ltbGluaycpIHtcbiAgICBpbnNwZWN0T2JqLnBvaW50c0F0ID0gZnMucmVhZGxpbmtTeW5jKHBhdGgpO1xuICB9XG59O1xuXG52YXIgaW5zcGVjdFN5bmMgPSBmdW5jdGlvbiAocGF0aCwgb3B0aW9ucykge1xuICB2YXIgc3RhdE9wZXJhdGlvbiA9IGZzLmxzdGF0U3luYztcbiAgdmFyIHN0YXQ7XG4gIHZhciBpbnNwZWN0T2JqO1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICBpZiAob3B0aW9ucy5zeW1saW5rcyA9PT0gJ2ZvbGxvdycpIHtcbiAgICBzdGF0T3BlcmF0aW9uID0gZnMuc3RhdFN5bmM7XG4gIH1cblxuICB0cnkge1xuICAgIHN0YXQgPSBzdGF0T3BlcmF0aW9uKHBhdGgpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICAvLyBEZXRlY3Rpb24gaWYgcGF0aCBleGlzdHNcbiAgICBpZiAoZXJyLmNvZGUgPT09ICdFTk9FTlQnKSB7XG4gICAgICAvLyBEb2Vzbid0IGV4aXN0LiBSZXR1cm4gdW5kZWZpbmVkIGluc3RlYWQgb2YgdGhyb3dpbmcuXG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICB0aHJvdyBlcnI7XG4gIH1cblxuICBpbnNwZWN0T2JqID0gY3JlYXRlSW5zcGVjdE9iaihwYXRoLCBvcHRpb25zLCBzdGF0KTtcbiAgYWRkRXh0cmFGaWVsZHNTeW5jKHBhdGgsIGluc3BlY3RPYmosIG9wdGlvbnMpO1xuXG4gIHJldHVybiBpbnNwZWN0T2JqO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBBc3luY1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBwcm9taXNlZFN0YXQgPSBRLmRlbm9kZWlmeShmcy5zdGF0KTtcbnZhciBwcm9taXNlZExzdGF0ID0gUS5kZW5vZGVpZnkoZnMubHN0YXQpO1xudmFyIHByb21pc2VkUmVhZGxpbmsgPSBRLmRlbm9kZWlmeShmcy5yZWFkbGluayk7XG5cbnZhciBmaWxlQ2hlY2tzdW1Bc3luYyA9IGZ1bmN0aW9uIChwYXRoLCBhbGdvKSB7XG4gIHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcblxuICB2YXIgaGFzaCA9IGNyeXB0by5jcmVhdGVIYXNoKGFsZ28pO1xuICB2YXIgcyA9IGZzLmNyZWF0ZVJlYWRTdHJlYW0ocGF0aCk7XG4gIHMub24oJ2RhdGEnLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgIGhhc2gudXBkYXRlKGRhdGEpO1xuICB9KTtcbiAgcy5vbignZW5kJywgZnVuY3Rpb24gKCkge1xuICAgIGRlZmVycmVkLnJlc29sdmUoaGFzaC5kaWdlc3QoJ2hleCcpKTtcbiAgfSk7XG4gIHMub24oJ2Vycm9yJywgZGVmZXJyZWQucmVqZWN0KTtcblxuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cbnZhciBhZGRFeHRyYUZpZWxkc0FzeW5jID0gZnVuY3Rpb24gKHBhdGgsIGluc3BlY3RPYmosIG9wdGlvbnMpIHtcbiAgaWYgKGluc3BlY3RPYmoudHlwZSA9PT0gJ2ZpbGUnICYmIG9wdGlvbnMuY2hlY2tzdW0pIHtcbiAgICByZXR1cm4gZmlsZUNoZWNrc3VtQXN5bmMocGF0aCwgb3B0aW9ucy5jaGVja3N1bSlcbiAgICAudGhlbihmdW5jdGlvbiAoY2hlY2tzdW0pIHtcbiAgICAgIGluc3BlY3RPYmpbb3B0aW9ucy5jaGVja3N1bV0gPSBjaGVja3N1bTtcbiAgICAgIHJldHVybiBpbnNwZWN0T2JqO1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKGluc3BlY3RPYmoudHlwZSA9PT0gJ3N5bWxpbmsnKSB7XG4gICAgcmV0dXJuIHByb21pc2VkUmVhZGxpbmsocGF0aClcbiAgICAudGhlbihmdW5jdGlvbiAobGlua1BhdGgpIHtcbiAgICAgIGluc3BlY3RPYmoucG9pbnRzQXQgPSBsaW5rUGF0aDtcbiAgICAgIHJldHVybiBpbnNwZWN0T2JqO1xuICAgIH0pO1xuICB9XG4gIHJldHVybiBuZXcgUShpbnNwZWN0T2JqKTtcbn07XG5cbnZhciBpbnNwZWN0QXN5bmMgPSBmdW5jdGlvbiAocGF0aCwgb3B0aW9ucykge1xuICB2YXIgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gIHZhciBzdGF0T3BlcmF0aW9uID0gcHJvbWlzZWRMc3RhdDtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgaWYgKG9wdGlvbnMuc3ltbGlua3MgPT09ICdmb2xsb3cnKSB7XG4gICAgc3RhdE9wZXJhdGlvbiA9IHByb21pc2VkU3RhdDtcbiAgfVxuXG4gIHN0YXRPcGVyYXRpb24ocGF0aClcbiAgLnRoZW4oZnVuY3Rpb24gKHN0YXQpIHtcbiAgICB2YXIgaW5zcGVjdE9iaiA9IGNyZWF0ZUluc3BlY3RPYmoocGF0aCwgb3B0aW9ucywgc3RhdCk7XG4gICAgYWRkRXh0cmFGaWVsZHNBc3luYyhwYXRoLCBpbnNwZWN0T2JqLCBvcHRpb25zKVxuICAgIC50aGVuKGRlZmVycmVkLnJlc29sdmUsIGRlZmVycmVkLnJlamVjdCk7XG4gIH0pXG4gIC5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gICAgLy8gRGV0ZWN0aW9uIGlmIHBhdGggZXhpc3RzXG4gICAgaWYgKGVyci5jb2RlID09PSAnRU5PRU5UJykge1xuICAgICAgLy8gRG9lc24ndCBleGlzdC4gUmV0dXJuIHVuZGVmaW5lZCBpbnN0ZWFkIG9mIHRocm93aW5nLlxuICAgICAgZGVmZXJyZWQucmVzb2x2ZSh1bmRlZmluZWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWZlcnJlZC5yZWplY3QoZXJyKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBBUElcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5leHBvcnRzLnN1cHBvcnRlZENoZWNrc3VtQWxnb3JpdGhtcyA9IHN1cHBvcnRlZENoZWNrc3VtQWxnb3JpdGhtcztcbmV4cG9ydHMuc3ltbGlua09wdGlvbnMgPSBzeW1saW5rT3B0aW9ucztcbmV4cG9ydHMudmFsaWRhdGVJbnB1dCA9IHZhbGlkYXRlSW5wdXQ7XG5leHBvcnRzLnN5bmMgPSBpbnNwZWN0U3luYztcbmV4cG9ydHMuYXN5bmMgPSBpbnNwZWN0QXN5bmM7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZnMtamV0cGFjay9saWIvaW5zcGVjdC5qc1xuLy8gbW9kdWxlIGlkID0gMzVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY3J5cHRvXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiY3J5cHRvXCJcbi8vIG1vZHVsZSBpZCA9IDM2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxudmFyIGZzID0gcmVxdWlyZSgnZnMnKTtcbnZhciBRID0gcmVxdWlyZSgncScpO1xudmFyIHZhbGlkYXRlID0gcmVxdWlyZSgnLi91dGlscy92YWxpZGF0ZScpO1xuXG52YXIgdmFsaWRhdGVJbnB1dCA9IGZ1bmN0aW9uIChtZXRob2ROYW1lLCBwYXRoKSB7XG4gIHZhciBtZXRob2RTaWduYXR1cmUgPSBtZXRob2ROYW1lICsgJyhwYXRoKSc7XG4gIHZhbGlkYXRlLmFyZ3VtZW50KG1ldGhvZFNpZ25hdHVyZSwgJ3BhdGgnLCBwYXRoLCBbJ3N0cmluZycsICd1bmRlZmluZWQnXSk7XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFN5bmNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgbGlzdFN5bmMgPSBmdW5jdGlvbiAocGF0aCkge1xuICB0cnkge1xuICAgIHJldHVybiBmcy5yZWFkZGlyU3luYyhwYXRoKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgaWYgKGVyci5jb2RlID09PSAnRU5PRU5UJykge1xuICAgICAgLy8gRG9lc24ndCBleGlzdC4gUmV0dXJuIHVuZGVmaW5lZCBpbnN0ZWFkIG9mIHRocm93aW5nLlxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgdGhyb3cgZXJyO1xuICB9XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEFzeW5jXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIHByb21pc2VkUmVhZGRpciA9IFEuZGVub2RlaWZ5KGZzLnJlYWRkaXIpO1xuXG52YXIgbGlzdEFzeW5jID0gZnVuY3Rpb24gKHBhdGgpIHtcbiAgdmFyIGRlZmVycmVkID0gUS5kZWZlcigpO1xuXG4gIHByb21pc2VkUmVhZGRpcihwYXRoKVxuICAudGhlbihmdW5jdGlvbiAobGlzdCkge1xuICAgIGRlZmVycmVkLnJlc29sdmUobGlzdCk7XG4gIH0pXG4gIC5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gICAgaWYgKGVyci5jb2RlID09PSAnRU5PRU5UJykge1xuICAgICAgLy8gRG9lc24ndCBleGlzdC4gUmV0dXJuIHVuZGVmaW5lZCBpbnN0ZWFkIG9mIHRocm93aW5nLlxuICAgICAgZGVmZXJyZWQucmVzb2x2ZSh1bmRlZmluZWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWZlcnJlZC5yZWplY3QoZXJyKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBBUElcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5leHBvcnRzLnZhbGlkYXRlSW5wdXQgPSB2YWxpZGF0ZUlucHV0O1xuZXhwb3J0cy5zeW5jID0gbGlzdFN5bmM7XG5leHBvcnRzLmFzeW5jID0gbGlzdEFzeW5jO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZzLWpldHBhY2svbGliL2xpc3QuanNcbi8vIG1vZHVsZSBpZCA9IDM3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxudmFyIE1pbmltYXRjaCA9IHJlcXVpcmUoJ21pbmltYXRjaCcpLk1pbmltYXRjaDtcblxudmFyIGNvbnZlcnRQYXR0ZXJuVG9BYnNvbHV0ZVBhdGggPSBmdW5jdGlvbiAoYmFzZVBhdGgsIHBhdHRlcm4pIHtcbiAgLy8gQWxsIHBhdHRlcm5zIHdpdGhvdXQgc2xhc2ggYXJlIGxlZnQgYXMgdGhleSBhcmUsIGlmIHBhdHRlcm4gY29udGFpblxuICAvLyBhbnkgc2xhc2ggd2UgbmVlZCB0byB0dXJuIGl0IGludG8gYWJzb2x1dGUgcGF0aC5cbiAgdmFyIGhhc1NsYXNoID0gKHBhdHRlcm4uaW5kZXhPZignLycpICE9PSAtMSk7XG4gIHZhciBpc0Fic29sdXRlID0gL14hP1xcLy8udGVzdChwYXR0ZXJuKTtcbiAgdmFyIGlzTmVnYXRlZCA9IC9eIS8udGVzdChwYXR0ZXJuKTtcbiAgdmFyIHNlcGFyYXRvcjtcblxuICBpZiAoIWlzQWJzb2x1dGUgJiYgaGFzU2xhc2gpIHtcbiAgICAvLyBUaHJvdyBvdXQgbWVhbmluZ2Z1bCBjaGFyYWN0ZXJzIGZyb20gdGhlIGJlZ2lubmluZyAoXCIhXCIsIFwiLi9cIikuXG4gICAgcGF0dGVybiA9IHBhdHRlcm4ucmVwbGFjZSgvXiEvLCAnJykucmVwbGFjZSgvXlxcLlxcLy8sICcnKTtcblxuICAgIGlmICgvXFwvJC8udGVzdChiYXNlUGF0aCkpIHtcbiAgICAgIHNlcGFyYXRvciA9ICcnO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZXBhcmF0b3IgPSAnLyc7XG4gICAgfVxuXG4gICAgaWYgKGlzTmVnYXRlZCkge1xuICAgICAgcmV0dXJuICchJyArIGJhc2VQYXRoICsgc2VwYXJhdG9yICsgcGF0dGVybjtcbiAgICB9XG4gICAgcmV0dXJuIGJhc2VQYXRoICsgc2VwYXJhdG9yICsgcGF0dGVybjtcbiAgfVxuXG4gIHJldHVybiBwYXR0ZXJuO1xufTtcblxuZXhwb3J0cy5jcmVhdGUgPSBmdW5jdGlvbiAoYmFzZVBhdGgsIHBhdHRlcm5zKSB7XG4gIHZhciBtYXRjaGVycztcblxuICBpZiAodHlwZW9mIHBhdHRlcm5zID09PSAnc3RyaW5nJykge1xuICAgIHBhdHRlcm5zID0gW3BhdHRlcm5zXTtcbiAgfVxuXG4gIG1hdGNoZXJzID0gcGF0dGVybnMubWFwKGZ1bmN0aW9uIChwYXR0ZXJuKSB7XG4gICAgcmV0dXJuIGNvbnZlcnRQYXR0ZXJuVG9BYnNvbHV0ZVBhdGgoYmFzZVBhdGgsIHBhdHRlcm4pO1xuICB9KVxuICAubWFwKGZ1bmN0aW9uIChwYXR0ZXJuKSB7XG4gICAgcmV0dXJuIG5ldyBNaW5pbWF0Y2gocGF0dGVybiwge1xuICAgICAgbWF0Y2hCYXNlOiB0cnVlLFxuICAgICAgbm9jb21tZW50OiB0cnVlLFxuICAgICAgZG90OiB0cnVlXG4gICAgfSk7XG4gIH0pO1xuXG4gIHJldHVybiBmdW5jdGlvbiBwZXJmb3JtTWF0Y2goYWJzb2x1dGVQYXRoKSB7XG4gICAgdmFyIG1vZGUgPSAnbWF0Y2hpbmcnO1xuICAgIHZhciB3ZUhhdmVNYXRjaCA9IGZhbHNlO1xuICAgIHZhciBjdXJyZW50TWF0Y2hlcjtcbiAgICB2YXIgaTtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBtYXRjaGVycy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgY3VycmVudE1hdGNoZXIgPSBtYXRjaGVyc1tpXTtcblxuICAgICAgaWYgKGN1cnJlbnRNYXRjaGVyLm5lZ2F0ZSkge1xuICAgICAgICBtb2RlID0gJ25lZ2F0aW9uJztcbiAgICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICAvLyBUaGVyZSBhcmUgb25seSBuZWdhdGVkIHBhdHRlcm5zIGluIHRoZSBzZXQsXG4gICAgICAgICAgLy8gc28gbWFrZSBldmVyeXRoaW5nIG1hdGNoaW5nIGJ5IGRlZmF1bHQgYW5kXG4gICAgICAgICAgLy8gc3RhcnQgdG8gcmVqZWN0IHN0dWZmLlxuICAgICAgICAgIHdlSGF2ZU1hdGNoID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAobW9kZSA9PT0gJ25lZ2F0aW9uJyAmJiB3ZUhhdmVNYXRjaCAmJiAhY3VycmVudE1hdGNoZXIubWF0Y2goYWJzb2x1dGVQYXRoKSkge1xuICAgICAgICAvLyBPbmUgbmVnYXRpb24gbWF0Y2ggaXMgZW5vdWdodCB0byBrbm93IHdlIGNhbiByZWplY3QgdGhpcyBvbmUuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKG1vZGUgPT09ICdtYXRjaGluZycgJiYgIXdlSGF2ZU1hdGNoKSB7XG4gICAgICAgIHdlSGF2ZU1hdGNoID0gY3VycmVudE1hdGNoZXIubWF0Y2goYWJzb2x1dGVQYXRoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gd2VIYXZlTWF0Y2g7XG4gIH07XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZzLWpldHBhY2svbGliL3V0aWxzL21hdGNoZXIuanNcbi8vIG1vZHVsZSBpZCA9IDM4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gbWluaW1hdGNoXG5taW5pbWF0Y2guTWluaW1hdGNoID0gTWluaW1hdGNoXG5cbnZhciBwYXRoID0geyBzZXA6ICcvJyB9XG50cnkge1xuICBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG59IGNhdGNoIChlcikge31cblxudmFyIEdMT0JTVEFSID0gbWluaW1hdGNoLkdMT0JTVEFSID0gTWluaW1hdGNoLkdMT0JTVEFSID0ge31cbnZhciBleHBhbmQgPSByZXF1aXJlKCdicmFjZS1leHBhbnNpb24nKVxuXG52YXIgcGxUeXBlcyA9IHtcbiAgJyEnOiB7IG9wZW46ICcoPzooPyEoPzonLCBjbG9zZTogJykpW14vXSo/KSd9LFxuICAnPyc6IHsgb3BlbjogJyg/OicsIGNsb3NlOiAnKT8nIH0sXG4gICcrJzogeyBvcGVuOiAnKD86JywgY2xvc2U6ICcpKycgfSxcbiAgJyonOiB7IG9wZW46ICcoPzonLCBjbG9zZTogJykqJyB9LFxuICAnQCc6IHsgb3BlbjogJyg/OicsIGNsb3NlOiAnKScgfVxufVxuXG4vLyBhbnkgc2luZ2xlIHRoaW5nIG90aGVyIHRoYW4gL1xuLy8gZG9uJ3QgbmVlZCB0byBlc2NhcGUgLyB3aGVuIHVzaW5nIG5ldyBSZWdFeHAoKVxudmFyIHFtYXJrID0gJ1teL10nXG5cbi8vICogPT4gYW55IG51bWJlciBvZiBjaGFyYWN0ZXJzXG52YXIgc3RhciA9IHFtYXJrICsgJyo/J1xuXG4vLyAqKiB3aGVuIGRvdHMgYXJlIGFsbG93ZWQuICBBbnl0aGluZyBnb2VzLCBleGNlcHQgLi4gYW5kIC5cbi8vIG5vdCAoXiBvciAvIGZvbGxvd2VkIGJ5IG9uZSBvciB0d28gZG90cyBmb2xsb3dlZCBieSAkIG9yIC8pLFxuLy8gZm9sbG93ZWQgYnkgYW55dGhpbmcsIGFueSBudW1iZXIgb2YgdGltZXMuXG52YXIgdHdvU3RhckRvdCA9ICcoPzooPyEoPzpcXFxcXFwvfF4pKD86XFxcXC57MSwyfSkoJHxcXFxcXFwvKSkuKSo/J1xuXG4vLyBub3QgYSBeIG9yIC8gZm9sbG93ZWQgYnkgYSBkb3QsXG4vLyBmb2xsb3dlZCBieSBhbnl0aGluZywgYW55IG51bWJlciBvZiB0aW1lcy5cbnZhciB0d29TdGFyTm9Eb3QgPSAnKD86KD8hKD86XFxcXFxcL3xeKVxcXFwuKS4pKj8nXG5cbi8vIGNoYXJhY3RlcnMgdGhhdCBuZWVkIHRvIGJlIGVzY2FwZWQgaW4gUmVnRXhwLlxudmFyIHJlU3BlY2lhbHMgPSBjaGFyU2V0KCcoKS4qe30rP1tdXiRcXFxcIScpXG5cbi8vIFwiYWJjXCIgLT4geyBhOnRydWUsIGI6dHJ1ZSwgYzp0cnVlIH1cbmZ1bmN0aW9uIGNoYXJTZXQgKHMpIHtcbiAgcmV0dXJuIHMuc3BsaXQoJycpLnJlZHVjZShmdW5jdGlvbiAoc2V0LCBjKSB7XG4gICAgc2V0W2NdID0gdHJ1ZVxuICAgIHJldHVybiBzZXRcbiAgfSwge30pXG59XG5cbi8vIG5vcm1hbGl6ZXMgc2xhc2hlcy5cbnZhciBzbGFzaFNwbGl0ID0gL1xcLysvXG5cbm1pbmltYXRjaC5maWx0ZXIgPSBmaWx0ZXJcbmZ1bmN0aW9uIGZpbHRlciAocGF0dGVybiwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICByZXR1cm4gZnVuY3Rpb24gKHAsIGksIGxpc3QpIHtcbiAgICByZXR1cm4gbWluaW1hdGNoKHAsIHBhdHRlcm4sIG9wdGlvbnMpXG4gIH1cbn1cblxuZnVuY3Rpb24gZXh0IChhLCBiKSB7XG4gIGEgPSBhIHx8IHt9XG4gIGIgPSBiIHx8IHt9XG4gIHZhciB0ID0ge31cbiAgT2JqZWN0LmtleXMoYikuZm9yRWFjaChmdW5jdGlvbiAoaykge1xuICAgIHRba10gPSBiW2tdXG4gIH0pXG4gIE9iamVjdC5rZXlzKGEpLmZvckVhY2goZnVuY3Rpb24gKGspIHtcbiAgICB0W2tdID0gYVtrXVxuICB9KVxuICByZXR1cm4gdFxufVxuXG5taW5pbWF0Y2guZGVmYXVsdHMgPSBmdW5jdGlvbiAoZGVmKSB7XG4gIGlmICghZGVmIHx8ICFPYmplY3Qua2V5cyhkZWYpLmxlbmd0aCkgcmV0dXJuIG1pbmltYXRjaFxuXG4gIHZhciBvcmlnID0gbWluaW1hdGNoXG5cbiAgdmFyIG0gPSBmdW5jdGlvbiBtaW5pbWF0Y2ggKHAsIHBhdHRlcm4sIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gb3JpZy5taW5pbWF0Y2gocCwgcGF0dGVybiwgZXh0KGRlZiwgb3B0aW9ucykpXG4gIH1cblxuICBtLk1pbmltYXRjaCA9IGZ1bmN0aW9uIE1pbmltYXRjaCAocGF0dGVybiwgb3B0aW9ucykge1xuICAgIHJldHVybiBuZXcgb3JpZy5NaW5pbWF0Y2gocGF0dGVybiwgZXh0KGRlZiwgb3B0aW9ucykpXG4gIH1cblxuICByZXR1cm4gbVxufVxuXG5NaW5pbWF0Y2guZGVmYXVsdHMgPSBmdW5jdGlvbiAoZGVmKSB7XG4gIGlmICghZGVmIHx8ICFPYmplY3Qua2V5cyhkZWYpLmxlbmd0aCkgcmV0dXJuIE1pbmltYXRjaFxuICByZXR1cm4gbWluaW1hdGNoLmRlZmF1bHRzKGRlZikuTWluaW1hdGNoXG59XG5cbmZ1bmN0aW9uIG1pbmltYXRjaCAocCwgcGF0dGVybiwgb3B0aW9ucykge1xuICBpZiAodHlwZW9mIHBhdHRlcm4gIT09ICdzdHJpbmcnKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZ2xvYiBwYXR0ZXJuIHN0cmluZyByZXF1aXJlZCcpXG4gIH1cblxuICBpZiAoIW9wdGlvbnMpIG9wdGlvbnMgPSB7fVxuXG4gIC8vIHNob3J0Y3V0OiBjb21tZW50cyBtYXRjaCBub3RoaW5nLlxuICBpZiAoIW9wdGlvbnMubm9jb21tZW50ICYmIHBhdHRlcm4uY2hhckF0KDApID09PSAnIycpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIC8vIFwiXCIgb25seSBtYXRjaGVzIFwiXCJcbiAgaWYgKHBhdHRlcm4udHJpbSgpID09PSAnJykgcmV0dXJuIHAgPT09ICcnXG5cbiAgcmV0dXJuIG5ldyBNaW5pbWF0Y2gocGF0dGVybiwgb3B0aW9ucykubWF0Y2gocClcbn1cblxuZnVuY3Rpb24gTWluaW1hdGNoIChwYXR0ZXJuLCBvcHRpb25zKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBNaW5pbWF0Y2gpKSB7XG4gICAgcmV0dXJuIG5ldyBNaW5pbWF0Y2gocGF0dGVybiwgb3B0aW9ucylcbiAgfVxuXG4gIGlmICh0eXBlb2YgcGF0dGVybiAhPT0gJ3N0cmluZycpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdnbG9iIHBhdHRlcm4gc3RyaW5nIHJlcXVpcmVkJylcbiAgfVxuXG4gIGlmICghb3B0aW9ucykgb3B0aW9ucyA9IHt9XG4gIHBhdHRlcm4gPSBwYXR0ZXJuLnRyaW0oKVxuXG4gIC8vIHdpbmRvd3Mgc3VwcG9ydDogbmVlZCB0byB1c2UgLywgbm90IFxcXG4gIGlmIChwYXRoLnNlcCAhPT0gJy8nKSB7XG4gICAgcGF0dGVybiA9IHBhdHRlcm4uc3BsaXQocGF0aC5zZXApLmpvaW4oJy8nKVxuICB9XG5cbiAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xuICB0aGlzLnNldCA9IFtdXG4gIHRoaXMucGF0dGVybiA9IHBhdHRlcm5cbiAgdGhpcy5yZWdleHAgPSBudWxsXG4gIHRoaXMubmVnYXRlID0gZmFsc2VcbiAgdGhpcy5jb21tZW50ID0gZmFsc2VcbiAgdGhpcy5lbXB0eSA9IGZhbHNlXG5cbiAgLy8gbWFrZSB0aGUgc2V0IG9mIHJlZ2V4cHMgZXRjLlxuICB0aGlzLm1ha2UoKVxufVxuXG5NaW5pbWF0Y2gucHJvdG90eXBlLmRlYnVnID0gZnVuY3Rpb24gKCkge31cblxuTWluaW1hdGNoLnByb3RvdHlwZS5tYWtlID0gbWFrZVxuZnVuY3Rpb24gbWFrZSAoKSB7XG4gIC8vIGRvbid0IGRvIGl0IG1vcmUgdGhhbiBvbmNlLlxuICBpZiAodGhpcy5fbWFkZSkgcmV0dXJuXG5cbiAgdmFyIHBhdHRlcm4gPSB0aGlzLnBhdHRlcm5cbiAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnNcblxuICAvLyBlbXB0eSBwYXR0ZXJucyBhbmQgY29tbWVudHMgbWF0Y2ggbm90aGluZy5cbiAgaWYgKCFvcHRpb25zLm5vY29tbWVudCAmJiBwYXR0ZXJuLmNoYXJBdCgwKSA9PT0gJyMnKSB7XG4gICAgdGhpcy5jb21tZW50ID0gdHJ1ZVxuICAgIHJldHVyblxuICB9XG4gIGlmICghcGF0dGVybikge1xuICAgIHRoaXMuZW1wdHkgPSB0cnVlXG4gICAgcmV0dXJuXG4gIH1cblxuICAvLyBzdGVwIDE6IGZpZ3VyZSBvdXQgbmVnYXRpb24sIGV0Yy5cbiAgdGhpcy5wYXJzZU5lZ2F0ZSgpXG5cbiAgLy8gc3RlcCAyOiBleHBhbmQgYnJhY2VzXG4gIHZhciBzZXQgPSB0aGlzLmdsb2JTZXQgPSB0aGlzLmJyYWNlRXhwYW5kKClcblxuICBpZiAob3B0aW9ucy5kZWJ1ZykgdGhpcy5kZWJ1ZyA9IGNvbnNvbGUuZXJyb3JcblxuICB0aGlzLmRlYnVnKHRoaXMucGF0dGVybiwgc2V0KVxuXG4gIC8vIHN0ZXAgMzogbm93IHdlIGhhdmUgYSBzZXQsIHNvIHR1cm4gZWFjaCBvbmUgaW50byBhIHNlcmllcyBvZiBwYXRoLXBvcnRpb25cbiAgLy8gbWF0Y2hpbmcgcGF0dGVybnMuXG4gIC8vIFRoZXNlIHdpbGwgYmUgcmVnZXhwcywgZXhjZXB0IGluIHRoZSBjYXNlIG9mIFwiKipcIiwgd2hpY2ggaXNcbiAgLy8gc2V0IHRvIHRoZSBHTE9CU1RBUiBvYmplY3QgZm9yIGdsb2JzdGFyIGJlaGF2aW9yLFxuICAvLyBhbmQgd2lsbCBub3QgY29udGFpbiBhbnkgLyBjaGFyYWN0ZXJzXG4gIHNldCA9IHRoaXMuZ2xvYlBhcnRzID0gc2V0Lm1hcChmdW5jdGlvbiAocykge1xuICAgIHJldHVybiBzLnNwbGl0KHNsYXNoU3BsaXQpXG4gIH0pXG5cbiAgdGhpcy5kZWJ1Zyh0aGlzLnBhdHRlcm4sIHNldClcblxuICAvLyBnbG9iIC0tPiByZWdleHBzXG4gIHNldCA9IHNldC5tYXAoZnVuY3Rpb24gKHMsIHNpLCBzZXQpIHtcbiAgICByZXR1cm4gcy5tYXAodGhpcy5wYXJzZSwgdGhpcylcbiAgfSwgdGhpcylcblxuICB0aGlzLmRlYnVnKHRoaXMucGF0dGVybiwgc2V0KVxuXG4gIC8vIGZpbHRlciBvdXQgZXZlcnl0aGluZyB0aGF0IGRpZG4ndCBjb21waWxlIHByb3Blcmx5LlxuICBzZXQgPSBzZXQuZmlsdGVyKGZ1bmN0aW9uIChzKSB7XG4gICAgcmV0dXJuIHMuaW5kZXhPZihmYWxzZSkgPT09IC0xXG4gIH0pXG5cbiAgdGhpcy5kZWJ1Zyh0aGlzLnBhdHRlcm4sIHNldClcblxuICB0aGlzLnNldCA9IHNldFxufVxuXG5NaW5pbWF0Y2gucHJvdG90eXBlLnBhcnNlTmVnYXRlID0gcGFyc2VOZWdhdGVcbmZ1bmN0aW9uIHBhcnNlTmVnYXRlICgpIHtcbiAgdmFyIHBhdHRlcm4gPSB0aGlzLnBhdHRlcm5cbiAgdmFyIG5lZ2F0ZSA9IGZhbHNlXG4gIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zXG4gIHZhciBuZWdhdGVPZmZzZXQgPSAwXG5cbiAgaWYgKG9wdGlvbnMubm9uZWdhdGUpIHJldHVyblxuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gcGF0dGVybi5sZW5ndGhcbiAgICA7IGkgPCBsICYmIHBhdHRlcm4uY2hhckF0KGkpID09PSAnISdcbiAgICA7IGkrKykge1xuICAgIG5lZ2F0ZSA9ICFuZWdhdGVcbiAgICBuZWdhdGVPZmZzZXQrK1xuICB9XG5cbiAgaWYgKG5lZ2F0ZU9mZnNldCkgdGhpcy5wYXR0ZXJuID0gcGF0dGVybi5zdWJzdHIobmVnYXRlT2Zmc2V0KVxuICB0aGlzLm5lZ2F0ZSA9IG5lZ2F0ZVxufVxuXG4vLyBCcmFjZSBleHBhbnNpb246XG4vLyBhe2IsY31kIC0+IGFiZCBhY2Rcbi8vIGF7Yix9YyAtPiBhYmMgYWNcbi8vIGF7MC4uM31kIC0+IGEwZCBhMWQgYTJkIGEzZFxuLy8gYXtiLGN7ZCxlfWZ9ZyAtPiBhYmcgYWNkZmcgYWNlZmdcbi8vIGF7YixjfWR7ZSxmfWcgLT4gYWJkZWcgYWNkZWcgYWJkZWcgYWJkZmdcbi8vXG4vLyBJbnZhbGlkIHNldHMgYXJlIG5vdCBleHBhbmRlZC5cbi8vIGF7Mi4ufWIgLT4gYXsyLi59YlxuLy8gYXtifWMgLT4gYXtifWNcbm1pbmltYXRjaC5icmFjZUV4cGFuZCA9IGZ1bmN0aW9uIChwYXR0ZXJuLCBvcHRpb25zKSB7XG4gIHJldHVybiBicmFjZUV4cGFuZChwYXR0ZXJuLCBvcHRpb25zKVxufVxuXG5NaW5pbWF0Y2gucHJvdG90eXBlLmJyYWNlRXhwYW5kID0gYnJhY2VFeHBhbmRcblxuZnVuY3Rpb24gYnJhY2VFeHBhbmQgKHBhdHRlcm4sIG9wdGlvbnMpIHtcbiAgaWYgKCFvcHRpb25zKSB7XG4gICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBNaW5pbWF0Y2gpIHtcbiAgICAgIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnNcbiAgICB9IGVsc2Uge1xuICAgICAgb3B0aW9ucyA9IHt9XG4gICAgfVxuICB9XG5cbiAgcGF0dGVybiA9IHR5cGVvZiBwYXR0ZXJuID09PSAndW5kZWZpbmVkJ1xuICAgID8gdGhpcy5wYXR0ZXJuIDogcGF0dGVyblxuXG4gIGlmICh0eXBlb2YgcGF0dGVybiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCd1bmRlZmluZWQgcGF0dGVybicpXG4gIH1cblxuICBpZiAob3B0aW9ucy5ub2JyYWNlIHx8XG4gICAgIXBhdHRlcm4ubWF0Y2goL1xcey4qXFx9LykpIHtcbiAgICAvLyBzaG9ydGN1dC4gbm8gbmVlZCB0byBleHBhbmQuXG4gICAgcmV0dXJuIFtwYXR0ZXJuXVxuICB9XG5cbiAgcmV0dXJuIGV4cGFuZChwYXR0ZXJuKVxufVxuXG4vLyBwYXJzZSBhIGNvbXBvbmVudCBvZiB0aGUgZXhwYW5kZWQgc2V0LlxuLy8gQXQgdGhpcyBwb2ludCwgbm8gcGF0dGVybiBtYXkgY29udGFpbiBcIi9cIiBpbiBpdFxuLy8gc28gd2UncmUgZ29pbmcgdG8gcmV0dXJuIGEgMmQgYXJyYXksIHdoZXJlIGVhY2ggZW50cnkgaXMgdGhlIGZ1bGxcbi8vIHBhdHRlcm4sIHNwbGl0IG9uICcvJywgYW5kIHRoZW4gdHVybmVkIGludG8gYSByZWd1bGFyIGV4cHJlc3Npb24uXG4vLyBBIHJlZ2V4cCBpcyBtYWRlIGF0IHRoZSBlbmQgd2hpY2ggam9pbnMgZWFjaCBhcnJheSB3aXRoIGFuXG4vLyBlc2NhcGVkIC8sIGFuZCBhbm90aGVyIGZ1bGwgb25lIHdoaWNoIGpvaW5zIGVhY2ggcmVnZXhwIHdpdGggfC5cbi8vXG4vLyBGb2xsb3dpbmcgdGhlIGxlYWQgb2YgQmFzaCA0LjEsIG5vdGUgdGhhdCBcIioqXCIgb25seSBoYXMgc3BlY2lhbCBtZWFuaW5nXG4vLyB3aGVuIGl0IGlzIHRoZSAqb25seSogdGhpbmcgaW4gYSBwYXRoIHBvcnRpb24uICBPdGhlcndpc2UsIGFueSBzZXJpZXNcbi8vIG9mICogaXMgZXF1aXZhbGVudCB0byBhIHNpbmdsZSAqLiAgR2xvYnN0YXIgYmVoYXZpb3IgaXMgZW5hYmxlZCBieVxuLy8gZGVmYXVsdCwgYW5kIGNhbiBiZSBkaXNhYmxlZCBieSBzZXR0aW5nIG9wdGlvbnMubm9nbG9ic3Rhci5cbk1pbmltYXRjaC5wcm90b3R5cGUucGFyc2UgPSBwYXJzZVxudmFyIFNVQlBBUlNFID0ge31cbmZ1bmN0aW9uIHBhcnNlIChwYXR0ZXJuLCBpc1N1Yikge1xuICBpZiAocGF0dGVybi5sZW5ndGggPiAxMDI0ICogNjQpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdwYXR0ZXJuIGlzIHRvbyBsb25nJylcbiAgfVxuXG4gIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zXG5cbiAgLy8gc2hvcnRjdXRzXG4gIGlmICghb3B0aW9ucy5ub2dsb2JzdGFyICYmIHBhdHRlcm4gPT09ICcqKicpIHJldHVybiBHTE9CU1RBUlxuICBpZiAocGF0dGVybiA9PT0gJycpIHJldHVybiAnJ1xuXG4gIHZhciByZSA9ICcnXG4gIHZhciBoYXNNYWdpYyA9ICEhb3B0aW9ucy5ub2Nhc2VcbiAgdmFyIGVzY2FwaW5nID0gZmFsc2VcbiAgLy8gPyA9PiBvbmUgc2luZ2xlIGNoYXJhY3RlclxuICB2YXIgcGF0dGVybkxpc3RTdGFjayA9IFtdXG4gIHZhciBuZWdhdGl2ZUxpc3RzID0gW11cbiAgdmFyIHN0YXRlQ2hhclxuICB2YXIgaW5DbGFzcyA9IGZhbHNlXG4gIHZhciByZUNsYXNzU3RhcnQgPSAtMVxuICB2YXIgY2xhc3NTdGFydCA9IC0xXG4gIC8vIC4gYW5kIC4uIG5ldmVyIG1hdGNoIGFueXRoaW5nIHRoYXQgZG9lc24ndCBzdGFydCB3aXRoIC4sXG4gIC8vIGV2ZW4gd2hlbiBvcHRpb25zLmRvdCBpcyBzZXQuXG4gIHZhciBwYXR0ZXJuU3RhcnQgPSBwYXR0ZXJuLmNoYXJBdCgwKSA9PT0gJy4nID8gJycgLy8gYW55dGhpbmdcbiAgLy8gbm90IChzdGFydCBvciAvIGZvbGxvd2VkIGJ5IC4gb3IgLi4gZm9sbG93ZWQgYnkgLyBvciBlbmQpXG4gIDogb3B0aW9ucy5kb3QgPyAnKD8hKD86XnxcXFxcXFwvKVxcXFwuezEsMn0oPzokfFxcXFxcXC8pKSdcbiAgOiAnKD8hXFxcXC4pJ1xuICB2YXIgc2VsZiA9IHRoaXNcblxuICBmdW5jdGlvbiBjbGVhclN0YXRlQ2hhciAoKSB7XG4gICAgaWYgKHN0YXRlQ2hhcikge1xuICAgICAgLy8gd2UgaGFkIHNvbWUgc3RhdGUtdHJhY2tpbmcgY2hhcmFjdGVyXG4gICAgICAvLyB0aGF0IHdhc24ndCBjb25zdW1lZCBieSB0aGlzIHBhc3MuXG4gICAgICBzd2l0Y2ggKHN0YXRlQ2hhcikge1xuICAgICAgICBjYXNlICcqJzpcbiAgICAgICAgICByZSArPSBzdGFyXG4gICAgICAgICAgaGFzTWFnaWMgPSB0cnVlXG4gICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJz8nOlxuICAgICAgICAgIHJlICs9IHFtYXJrXG4gICAgICAgICAgaGFzTWFnaWMgPSB0cnVlXG4gICAgICAgIGJyZWFrXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgcmUgKz0gJ1xcXFwnICsgc3RhdGVDaGFyXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgICBzZWxmLmRlYnVnKCdjbGVhclN0YXRlQ2hhciAlaiAlaicsIHN0YXRlQ2hhciwgcmUpXG4gICAgICBzdGF0ZUNoYXIgPSBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBwYXR0ZXJuLmxlbmd0aCwgY1xuICAgIDsgKGkgPCBsZW4pICYmIChjID0gcGF0dGVybi5jaGFyQXQoaSkpXG4gICAgOyBpKyspIHtcbiAgICB0aGlzLmRlYnVnKCclc1xcdCVzICVzICVqJywgcGF0dGVybiwgaSwgcmUsIGMpXG5cbiAgICAvLyBza2lwIG92ZXIgYW55IHRoYXQgYXJlIGVzY2FwZWQuXG4gICAgaWYgKGVzY2FwaW5nICYmIHJlU3BlY2lhbHNbY10pIHtcbiAgICAgIHJlICs9ICdcXFxcJyArIGNcbiAgICAgIGVzY2FwaW5nID0gZmFsc2VcbiAgICAgIGNvbnRpbnVlXG4gICAgfVxuXG4gICAgc3dpdGNoIChjKSB7XG4gICAgICBjYXNlICcvJzpcbiAgICAgICAgLy8gY29tcGxldGVseSBub3QgYWxsb3dlZCwgZXZlbiBlc2NhcGVkLlxuICAgICAgICAvLyBTaG91bGQgYWxyZWFkeSBiZSBwYXRoLXNwbGl0IGJ5IG5vdy5cbiAgICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgICAgIGNhc2UgJ1xcXFwnOlxuICAgICAgICBjbGVhclN0YXRlQ2hhcigpXG4gICAgICAgIGVzY2FwaW5nID0gdHJ1ZVxuICAgICAgY29udGludWVcblxuICAgICAgLy8gdGhlIHZhcmlvdXMgc3RhdGVDaGFyIHZhbHVlc1xuICAgICAgLy8gZm9yIHRoZSBcImV4dGdsb2JcIiBzdHVmZi5cbiAgICAgIGNhc2UgJz8nOlxuICAgICAgY2FzZSAnKic6XG4gICAgICBjYXNlICcrJzpcbiAgICAgIGNhc2UgJ0AnOlxuICAgICAgY2FzZSAnISc6XG4gICAgICAgIHRoaXMuZGVidWcoJyVzXFx0JXMgJXMgJWogPC0tIHN0YXRlQ2hhcicsIHBhdHRlcm4sIGksIHJlLCBjKVxuXG4gICAgICAgIC8vIGFsbCBvZiB0aG9zZSBhcmUgbGl0ZXJhbHMgaW5zaWRlIGEgY2xhc3MsIGV4Y2VwdCB0aGF0XG4gICAgICAgIC8vIHRoZSBnbG9iIFshYV0gbWVhbnMgW15hXSBpbiByZWdleHBcbiAgICAgICAgaWYgKGluQ2xhc3MpIHtcbiAgICAgICAgICB0aGlzLmRlYnVnKCcgIGluIGNsYXNzJylcbiAgICAgICAgICBpZiAoYyA9PT0gJyEnICYmIGkgPT09IGNsYXNzU3RhcnQgKyAxKSBjID0gJ14nXG4gICAgICAgICAgcmUgKz0gY1xuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICAvLyBpZiB3ZSBhbHJlYWR5IGhhdmUgYSBzdGF0ZUNoYXIsIHRoZW4gaXQgbWVhbnNcbiAgICAgICAgLy8gdGhhdCB0aGVyZSB3YXMgc29tZXRoaW5nIGxpa2UgKiogb3IgKz8gaW4gdGhlcmUuXG4gICAgICAgIC8vIEhhbmRsZSB0aGUgc3RhdGVDaGFyLCB0aGVuIHByb2NlZWQgd2l0aCB0aGlzIG9uZS5cbiAgICAgICAgc2VsZi5kZWJ1ZygnY2FsbCBjbGVhclN0YXRlQ2hhciAlaicsIHN0YXRlQ2hhcilcbiAgICAgICAgY2xlYXJTdGF0ZUNoYXIoKVxuICAgICAgICBzdGF0ZUNoYXIgPSBjXG4gICAgICAgIC8vIGlmIGV4dGdsb2IgaXMgZGlzYWJsZWQsIHRoZW4gKyhhc2RmfGZvbykgaXNuJ3QgYSB0aGluZy5cbiAgICAgICAgLy8ganVzdCBjbGVhciB0aGUgc3RhdGVjaGFyICpub3cqLCByYXRoZXIgdGhhbiBldmVuIGRpdmluZyBpbnRvXG4gICAgICAgIC8vIHRoZSBwYXR0ZXJuTGlzdCBzdHVmZi5cbiAgICAgICAgaWYgKG9wdGlvbnMubm9leHQpIGNsZWFyU3RhdGVDaGFyKClcbiAgICAgIGNvbnRpbnVlXG5cbiAgICAgIGNhc2UgJygnOlxuICAgICAgICBpZiAoaW5DbGFzcykge1xuICAgICAgICAgIHJlICs9ICcoJ1xuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXN0YXRlQ2hhcikge1xuICAgICAgICAgIHJlICs9ICdcXFxcKCdcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgcGF0dGVybkxpc3RTdGFjay5wdXNoKHtcbiAgICAgICAgICB0eXBlOiBzdGF0ZUNoYXIsXG4gICAgICAgICAgc3RhcnQ6IGkgLSAxLFxuICAgICAgICAgIHJlU3RhcnQ6IHJlLmxlbmd0aCxcbiAgICAgICAgICBvcGVuOiBwbFR5cGVzW3N0YXRlQ2hhcl0ub3BlbixcbiAgICAgICAgICBjbG9zZTogcGxUeXBlc1tzdGF0ZUNoYXJdLmNsb3NlXG4gICAgICAgIH0pXG4gICAgICAgIC8vIG5lZ2F0aW9uIGlzICg/Oig/IWpzKVteL10qKVxuICAgICAgICByZSArPSBzdGF0ZUNoYXIgPT09ICchJyA/ICcoPzooPyEoPzonIDogJyg/OidcbiAgICAgICAgdGhpcy5kZWJ1ZygncGxUeXBlICVqICVqJywgc3RhdGVDaGFyLCByZSlcbiAgICAgICAgc3RhdGVDaGFyID0gZmFsc2VcbiAgICAgIGNvbnRpbnVlXG5cbiAgICAgIGNhc2UgJyknOlxuICAgICAgICBpZiAoaW5DbGFzcyB8fCAhcGF0dGVybkxpc3RTdGFjay5sZW5ndGgpIHtcbiAgICAgICAgICByZSArPSAnXFxcXCknXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuXG4gICAgICAgIGNsZWFyU3RhdGVDaGFyKClcbiAgICAgICAgaGFzTWFnaWMgPSB0cnVlXG4gICAgICAgIHZhciBwbCA9IHBhdHRlcm5MaXN0U3RhY2sucG9wKClcbiAgICAgICAgLy8gbmVnYXRpb24gaXMgKD86KD8hanMpW14vXSopXG4gICAgICAgIC8vIFRoZSBvdGhlcnMgYXJlICg/OjxwYXR0ZXJuPik8dHlwZT5cbiAgICAgICAgcmUgKz0gcGwuY2xvc2VcbiAgICAgICAgaWYgKHBsLnR5cGUgPT09ICchJykge1xuICAgICAgICAgIG5lZ2F0aXZlTGlzdHMucHVzaChwbClcbiAgICAgICAgfVxuICAgICAgICBwbC5yZUVuZCA9IHJlLmxlbmd0aFxuICAgICAgY29udGludWVcblxuICAgICAgY2FzZSAnfCc6XG4gICAgICAgIGlmIChpbkNsYXNzIHx8ICFwYXR0ZXJuTGlzdFN0YWNrLmxlbmd0aCB8fCBlc2NhcGluZykge1xuICAgICAgICAgIHJlICs9ICdcXFxcfCdcbiAgICAgICAgICBlc2NhcGluZyA9IGZhbHNlXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuXG4gICAgICAgIGNsZWFyU3RhdGVDaGFyKClcbiAgICAgICAgcmUgKz0gJ3wnXG4gICAgICBjb250aW51ZVxuXG4gICAgICAvLyB0aGVzZSBhcmUgbW9zdGx5IHRoZSBzYW1lIGluIHJlZ2V4cCBhbmQgZ2xvYlxuICAgICAgY2FzZSAnWyc6XG4gICAgICAgIC8vIHN3YWxsb3cgYW55IHN0YXRlLXRyYWNraW5nIGNoYXIgYmVmb3JlIHRoZSBbXG4gICAgICAgIGNsZWFyU3RhdGVDaGFyKClcblxuICAgICAgICBpZiAoaW5DbGFzcykge1xuICAgICAgICAgIHJlICs9ICdcXFxcJyArIGNcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgaW5DbGFzcyA9IHRydWVcbiAgICAgICAgY2xhc3NTdGFydCA9IGlcbiAgICAgICAgcmVDbGFzc1N0YXJ0ID0gcmUubGVuZ3RoXG4gICAgICAgIHJlICs9IGNcbiAgICAgIGNvbnRpbnVlXG5cbiAgICAgIGNhc2UgJ10nOlxuICAgICAgICAvLyAgYSByaWdodCBicmFja2V0IHNoYWxsIGxvc2UgaXRzIHNwZWNpYWxcbiAgICAgICAgLy8gIG1lYW5pbmcgYW5kIHJlcHJlc2VudCBpdHNlbGYgaW5cbiAgICAgICAgLy8gIGEgYnJhY2tldCBleHByZXNzaW9uIGlmIGl0IG9jY3Vyc1xuICAgICAgICAvLyAgZmlyc3QgaW4gdGhlIGxpc3QuICAtLSBQT1NJWC4yIDIuOC4zLjJcbiAgICAgICAgaWYgKGkgPT09IGNsYXNzU3RhcnQgKyAxIHx8ICFpbkNsYXNzKSB7XG4gICAgICAgICAgcmUgKz0gJ1xcXFwnICsgY1xuICAgICAgICAgIGVzY2FwaW5nID0gZmFsc2VcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gaGFuZGxlIHRoZSBjYXNlIHdoZXJlIHdlIGxlZnQgYSBjbGFzcyBvcGVuLlxuICAgICAgICAvLyBcIlt6LWFdXCIgaXMgdmFsaWQsIGVxdWl2YWxlbnQgdG8gXCJcXFt6LWFcXF1cIlxuICAgICAgICBpZiAoaW5DbGFzcykge1xuICAgICAgICAgIC8vIHNwbGl0IHdoZXJlIHRoZSBsYXN0IFsgd2FzLCBtYWtlIHN1cmUgd2UgZG9uJ3QgaGF2ZVxuICAgICAgICAgIC8vIGFuIGludmFsaWQgcmUuIGlmIHNvLCByZS13YWxrIHRoZSBjb250ZW50cyBvZiB0aGVcbiAgICAgICAgICAvLyB3b3VsZC1iZSBjbGFzcyB0byByZS10cmFuc2xhdGUgYW55IGNoYXJhY3RlcnMgdGhhdFxuICAgICAgICAgIC8vIHdlcmUgcGFzc2VkIHRocm91Z2ggYXMtaXNcbiAgICAgICAgICAvLyBUT0RPOiBJdCB3b3VsZCBwcm9iYWJseSBiZSBmYXN0ZXIgdG8gZGV0ZXJtaW5lIHRoaXNcbiAgICAgICAgICAvLyB3aXRob3V0IGEgdHJ5L2NhdGNoIGFuZCBhIG5ldyBSZWdFeHAsIGJ1dCBpdCdzIHRyaWNreVxuICAgICAgICAgIC8vIHRvIGRvIHNhZmVseS4gIEZvciBub3csIHRoaXMgaXMgc2FmZSBhbmQgd29ya3MuXG4gICAgICAgICAgdmFyIGNzID0gcGF0dGVybi5zdWJzdHJpbmcoY2xhc3NTdGFydCArIDEsIGkpXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIFJlZ0V4cCgnWycgKyBjcyArICddJylcbiAgICAgICAgICB9IGNhdGNoIChlcikge1xuICAgICAgICAgICAgLy8gbm90IGEgdmFsaWQgY2xhc3MhXG4gICAgICAgICAgICB2YXIgc3AgPSB0aGlzLnBhcnNlKGNzLCBTVUJQQVJTRSlcbiAgICAgICAgICAgIHJlID0gcmUuc3Vic3RyKDAsIHJlQ2xhc3NTdGFydCkgKyAnXFxcXFsnICsgc3BbMF0gKyAnXFxcXF0nXG4gICAgICAgICAgICBoYXNNYWdpYyA9IGhhc01hZ2ljIHx8IHNwWzFdXG4gICAgICAgICAgICBpbkNsYXNzID0gZmFsc2VcbiAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gZmluaXNoIHVwIHRoZSBjbGFzcy5cbiAgICAgICAgaGFzTWFnaWMgPSB0cnVlXG4gICAgICAgIGluQ2xhc3MgPSBmYWxzZVxuICAgICAgICByZSArPSBjXG4gICAgICBjb250aW51ZVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICAvLyBzd2FsbG93IGFueSBzdGF0ZSBjaGFyIHRoYXQgd2Fzbid0IGNvbnN1bWVkXG4gICAgICAgIGNsZWFyU3RhdGVDaGFyKClcblxuICAgICAgICBpZiAoZXNjYXBpbmcpIHtcbiAgICAgICAgICAvLyBubyBuZWVkXG4gICAgICAgICAgZXNjYXBpbmcgPSBmYWxzZVxuICAgICAgICB9IGVsc2UgaWYgKHJlU3BlY2lhbHNbY11cbiAgICAgICAgICAmJiAhKGMgPT09ICdeJyAmJiBpbkNsYXNzKSkge1xuICAgICAgICAgIHJlICs9ICdcXFxcJ1xuICAgICAgICB9XG5cbiAgICAgICAgcmUgKz0gY1xuXG4gICAgfSAvLyBzd2l0Y2hcbiAgfSAvLyBmb3JcblxuICAvLyBoYW5kbGUgdGhlIGNhc2Ugd2hlcmUgd2UgbGVmdCBhIGNsYXNzIG9wZW4uXG4gIC8vIFwiW2FiY1wiIGlzIHZhbGlkLCBlcXVpdmFsZW50IHRvIFwiXFxbYWJjXCJcbiAgaWYgKGluQ2xhc3MpIHtcbiAgICAvLyBzcGxpdCB3aGVyZSB0aGUgbGFzdCBbIHdhcywgYW5kIGVzY2FwZSBpdFxuICAgIC8vIHRoaXMgaXMgYSBodWdlIHBpdGEuICBXZSBub3cgaGF2ZSB0byByZS13YWxrXG4gICAgLy8gdGhlIGNvbnRlbnRzIG9mIHRoZSB3b3VsZC1iZSBjbGFzcyB0byByZS10cmFuc2xhdGVcbiAgICAvLyBhbnkgY2hhcmFjdGVycyB0aGF0IHdlcmUgcGFzc2VkIHRocm91Z2ggYXMtaXNcbiAgICBjcyA9IHBhdHRlcm4uc3Vic3RyKGNsYXNzU3RhcnQgKyAxKVxuICAgIHNwID0gdGhpcy5wYXJzZShjcywgU1VCUEFSU0UpXG4gICAgcmUgPSByZS5zdWJzdHIoMCwgcmVDbGFzc1N0YXJ0KSArICdcXFxcWycgKyBzcFswXVxuICAgIGhhc01hZ2ljID0gaGFzTWFnaWMgfHwgc3BbMV1cbiAgfVxuXG4gIC8vIGhhbmRsZSB0aGUgY2FzZSB3aGVyZSB3ZSBoYWQgYSArKCB0aGluZyBhdCB0aGUgKmVuZCpcbiAgLy8gb2YgdGhlIHBhdHRlcm4uXG4gIC8vIGVhY2ggcGF0dGVybiBsaXN0IHN0YWNrIGFkZHMgMyBjaGFycywgYW5kIHdlIG5lZWQgdG8gZ28gdGhyb3VnaFxuICAvLyBhbmQgZXNjYXBlIGFueSB8IGNoYXJzIHRoYXQgd2VyZSBwYXNzZWQgdGhyb3VnaCBhcy1pcyBmb3IgdGhlIHJlZ2V4cC5cbiAgLy8gR28gdGhyb3VnaCBhbmQgZXNjYXBlIHRoZW0sIHRha2luZyBjYXJlIG5vdCB0byBkb3VibGUtZXNjYXBlIGFueVxuICAvLyB8IGNoYXJzIHRoYXQgd2VyZSBhbHJlYWR5IGVzY2FwZWQuXG4gIGZvciAocGwgPSBwYXR0ZXJuTGlzdFN0YWNrLnBvcCgpOyBwbDsgcGwgPSBwYXR0ZXJuTGlzdFN0YWNrLnBvcCgpKSB7XG4gICAgdmFyIHRhaWwgPSByZS5zbGljZShwbC5yZVN0YXJ0ICsgcGwub3Blbi5sZW5ndGgpXG4gICAgdGhpcy5kZWJ1Zygnc2V0dGluZyB0YWlsJywgcmUsIHBsKVxuICAgIC8vIG1heWJlIHNvbWUgZXZlbiBudW1iZXIgb2YgXFwsIHRoZW4gbWF5YmUgMSBcXCwgZm9sbG93ZWQgYnkgYSB8XG4gICAgdGFpbCA9IHRhaWwucmVwbGFjZSgvKCg/OlxcXFx7Mn0pezAsNjR9KShcXFxcPylcXHwvZywgZnVuY3Rpb24gKF8sICQxLCAkMikge1xuICAgICAgaWYgKCEkMikge1xuICAgICAgICAvLyB0aGUgfCBpc24ndCBhbHJlYWR5IGVzY2FwZWQsIHNvIGVzY2FwZSBpdC5cbiAgICAgICAgJDIgPSAnXFxcXCdcbiAgICAgIH1cblxuICAgICAgLy8gbmVlZCB0byBlc2NhcGUgYWxsIHRob3NlIHNsYXNoZXMgKmFnYWluKiwgd2l0aG91dCBlc2NhcGluZyB0aGVcbiAgICAgIC8vIG9uZSB0aGF0IHdlIG5lZWQgZm9yIGVzY2FwaW5nIHRoZSB8IGNoYXJhY3Rlci4gIEFzIGl0IHdvcmtzIG91dCxcbiAgICAgIC8vIGVzY2FwaW5nIGFuIGV2ZW4gbnVtYmVyIG9mIHNsYXNoZXMgY2FuIGJlIGRvbmUgYnkgc2ltcGx5IHJlcGVhdGluZ1xuICAgICAgLy8gaXQgZXhhY3RseSBhZnRlciBpdHNlbGYuICBUaGF0J3Mgd2h5IHRoaXMgdHJpY2sgd29ya3MuXG4gICAgICAvL1xuICAgICAgLy8gSSBhbSBzb3JyeSB0aGF0IHlvdSBoYXZlIHRvIHNlZSB0aGlzLlxuICAgICAgcmV0dXJuICQxICsgJDEgKyAkMiArICd8J1xuICAgIH0pXG5cbiAgICB0aGlzLmRlYnVnKCd0YWlsPSVqXFxuICAgJXMnLCB0YWlsLCB0YWlsLCBwbCwgcmUpXG4gICAgdmFyIHQgPSBwbC50eXBlID09PSAnKicgPyBzdGFyXG4gICAgICA6IHBsLnR5cGUgPT09ICc/JyA/IHFtYXJrXG4gICAgICA6ICdcXFxcJyArIHBsLnR5cGVcblxuICAgIGhhc01hZ2ljID0gdHJ1ZVxuICAgIHJlID0gcmUuc2xpY2UoMCwgcGwucmVTdGFydCkgKyB0ICsgJ1xcXFwoJyArIHRhaWxcbiAgfVxuXG4gIC8vIGhhbmRsZSB0cmFpbGluZyB0aGluZ3MgdGhhdCBvbmx5IG1hdHRlciBhdCB0aGUgdmVyeSBlbmQuXG4gIGNsZWFyU3RhdGVDaGFyKClcbiAgaWYgKGVzY2FwaW5nKSB7XG4gICAgLy8gdHJhaWxpbmcgXFxcXFxuICAgIHJlICs9ICdcXFxcXFxcXCdcbiAgfVxuXG4gIC8vIG9ubHkgbmVlZCB0byBhcHBseSB0aGUgbm9kb3Qgc3RhcnQgaWYgdGhlIHJlIHN0YXJ0cyB3aXRoXG4gIC8vIHNvbWV0aGluZyB0aGF0IGNvdWxkIGNvbmNlaXZhYmx5IGNhcHR1cmUgYSBkb3RcbiAgdmFyIGFkZFBhdHRlcm5TdGFydCA9IGZhbHNlXG4gIHN3aXRjaCAocmUuY2hhckF0KDApKSB7XG4gICAgY2FzZSAnLic6XG4gICAgY2FzZSAnWyc6XG4gICAgY2FzZSAnKCc6IGFkZFBhdHRlcm5TdGFydCA9IHRydWVcbiAgfVxuXG4gIC8vIEhhY2sgdG8gd29yayBhcm91bmQgbGFjayBvZiBuZWdhdGl2ZSBsb29rYmVoaW5kIGluIEpTXG4gIC8vIEEgcGF0dGVybiBsaWtlOiAqLiEoeCkuISh5fHopIG5lZWRzIHRvIGVuc3VyZSB0aGF0IGEgbmFtZVxuICAvLyBsaWtlICdhLnh5ei55eicgZG9lc24ndCBtYXRjaC4gIFNvLCB0aGUgZmlyc3QgbmVnYXRpdmVcbiAgLy8gbG9va2FoZWFkLCBoYXMgdG8gbG9vayBBTEwgdGhlIHdheSBhaGVhZCwgdG8gdGhlIGVuZCBvZlxuICAvLyB0aGUgcGF0dGVybi5cbiAgZm9yICh2YXIgbiA9IG5lZ2F0aXZlTGlzdHMubGVuZ3RoIC0gMTsgbiA+IC0xOyBuLS0pIHtcbiAgICB2YXIgbmwgPSBuZWdhdGl2ZUxpc3RzW25dXG5cbiAgICB2YXIgbmxCZWZvcmUgPSByZS5zbGljZSgwLCBubC5yZVN0YXJ0KVxuICAgIHZhciBubEZpcnN0ID0gcmUuc2xpY2UobmwucmVTdGFydCwgbmwucmVFbmQgLSA4KVxuICAgIHZhciBubExhc3QgPSByZS5zbGljZShubC5yZUVuZCAtIDgsIG5sLnJlRW5kKVxuICAgIHZhciBubEFmdGVyID0gcmUuc2xpY2UobmwucmVFbmQpXG5cbiAgICBubExhc3QgKz0gbmxBZnRlclxuXG4gICAgLy8gSGFuZGxlIG5lc3RlZCBzdHVmZiBsaWtlICooKi5qc3whKCouanNvbikpLCB3aGVyZSBvcGVuIHBhcmVuc1xuICAgIC8vIG1lYW4gdGhhdCB3ZSBzaG91bGQgKm5vdCogaW5jbHVkZSB0aGUgKSBpbiB0aGUgYml0IHRoYXQgaXMgY29uc2lkZXJlZFxuICAgIC8vIFwiYWZ0ZXJcIiB0aGUgbmVnYXRlZCBzZWN0aW9uLlxuICAgIHZhciBvcGVuUGFyZW5zQmVmb3JlID0gbmxCZWZvcmUuc3BsaXQoJygnKS5sZW5ndGggLSAxXG4gICAgdmFyIGNsZWFuQWZ0ZXIgPSBubEFmdGVyXG4gICAgZm9yIChpID0gMDsgaSA8IG9wZW5QYXJlbnNCZWZvcmU7IGkrKykge1xuICAgICAgY2xlYW5BZnRlciA9IGNsZWFuQWZ0ZXIucmVwbGFjZSgvXFwpWysqP10/LywgJycpXG4gICAgfVxuICAgIG5sQWZ0ZXIgPSBjbGVhbkFmdGVyXG5cbiAgICB2YXIgZG9sbGFyID0gJydcbiAgICBpZiAobmxBZnRlciA9PT0gJycgJiYgaXNTdWIgIT09IFNVQlBBUlNFKSB7XG4gICAgICBkb2xsYXIgPSAnJCdcbiAgICB9XG4gICAgdmFyIG5ld1JlID0gbmxCZWZvcmUgKyBubEZpcnN0ICsgbmxBZnRlciArIGRvbGxhciArIG5sTGFzdFxuICAgIHJlID0gbmV3UmVcbiAgfVxuXG4gIC8vIGlmIHRoZSByZSBpcyBub3QgXCJcIiBhdCB0aGlzIHBvaW50LCB0aGVuIHdlIG5lZWQgdG8gbWFrZSBzdXJlXG4gIC8vIGl0IGRvZXNuJ3QgbWF0Y2ggYWdhaW5zdCBhbiBlbXB0eSBwYXRoIHBhcnQuXG4gIC8vIE90aGVyd2lzZSBhLyogd2lsbCBtYXRjaCBhLywgd2hpY2ggaXQgc2hvdWxkIG5vdC5cbiAgaWYgKHJlICE9PSAnJyAmJiBoYXNNYWdpYykge1xuICAgIHJlID0gJyg/PS4pJyArIHJlXG4gIH1cblxuICBpZiAoYWRkUGF0dGVyblN0YXJ0KSB7XG4gICAgcmUgPSBwYXR0ZXJuU3RhcnQgKyByZVxuICB9XG5cbiAgLy8gcGFyc2luZyBqdXN0IGEgcGllY2Ugb2YgYSBsYXJnZXIgcGF0dGVybi5cbiAgaWYgKGlzU3ViID09PSBTVUJQQVJTRSkge1xuICAgIHJldHVybiBbcmUsIGhhc01hZ2ljXVxuICB9XG5cbiAgLy8gc2tpcCB0aGUgcmVnZXhwIGZvciBub24tbWFnaWNhbCBwYXR0ZXJuc1xuICAvLyB1bmVzY2FwZSBhbnl0aGluZyBpbiBpdCwgdGhvdWdoLCBzbyB0aGF0IGl0J2xsIGJlXG4gIC8vIGFuIGV4YWN0IG1hdGNoIGFnYWluc3QgYSBmaWxlIGV0Yy5cbiAgaWYgKCFoYXNNYWdpYykge1xuICAgIHJldHVybiBnbG9iVW5lc2NhcGUocGF0dGVybilcbiAgfVxuXG4gIHZhciBmbGFncyA9IG9wdGlvbnMubm9jYXNlID8gJ2knIDogJydcbiAgdHJ5IHtcbiAgICB2YXIgcmVnRXhwID0gbmV3IFJlZ0V4cCgnXicgKyByZSArICckJywgZmxhZ3MpXG4gIH0gY2F0Y2ggKGVyKSB7XG4gICAgLy8gSWYgaXQgd2FzIGFuIGludmFsaWQgcmVndWxhciBleHByZXNzaW9uLCB0aGVuIGl0IGNhbid0IG1hdGNoXG4gICAgLy8gYW55dGhpbmcuICBUaGlzIHRyaWNrIGxvb2tzIGZvciBhIGNoYXJhY3RlciBhZnRlciB0aGUgZW5kIG9mXG4gICAgLy8gdGhlIHN0cmluZywgd2hpY2ggaXMgb2YgY291cnNlIGltcG9zc2libGUsIGV4Y2VwdCBpbiBtdWx0aS1saW5lXG4gICAgLy8gbW9kZSwgYnV0IGl0J3Mgbm90IGEgL20gcmVnZXguXG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoJyQuJylcbiAgfVxuXG4gIHJlZ0V4cC5fZ2xvYiA9IHBhdHRlcm5cbiAgcmVnRXhwLl9zcmMgPSByZVxuXG4gIHJldHVybiByZWdFeHBcbn1cblxubWluaW1hdGNoLm1ha2VSZSA9IGZ1bmN0aW9uIChwYXR0ZXJuLCBvcHRpb25zKSB7XG4gIHJldHVybiBuZXcgTWluaW1hdGNoKHBhdHRlcm4sIG9wdGlvbnMgfHwge30pLm1ha2VSZSgpXG59XG5cbk1pbmltYXRjaC5wcm90b3R5cGUubWFrZVJlID0gbWFrZVJlXG5mdW5jdGlvbiBtYWtlUmUgKCkge1xuICBpZiAodGhpcy5yZWdleHAgfHwgdGhpcy5yZWdleHAgPT09IGZhbHNlKSByZXR1cm4gdGhpcy5yZWdleHBcblxuICAvLyBhdCB0aGlzIHBvaW50LCB0aGlzLnNldCBpcyBhIDJkIGFycmF5IG9mIHBhcnRpYWxcbiAgLy8gcGF0dGVybiBzdHJpbmdzLCBvciBcIioqXCIuXG4gIC8vXG4gIC8vIEl0J3MgYmV0dGVyIHRvIHVzZSAubWF0Y2goKS4gIFRoaXMgZnVuY3Rpb24gc2hvdWxkbid0XG4gIC8vIGJlIHVzZWQsIHJlYWxseSwgYnV0IGl0J3MgcHJldHR5IGNvbnZlbmllbnQgc29tZXRpbWVzLFxuICAvLyB3aGVuIHlvdSBqdXN0IHdhbnQgdG8gd29yayB3aXRoIGEgcmVnZXguXG4gIHZhciBzZXQgPSB0aGlzLnNldFxuXG4gIGlmICghc2V0Lmxlbmd0aCkge1xuICAgIHRoaXMucmVnZXhwID0gZmFsc2VcbiAgICByZXR1cm4gdGhpcy5yZWdleHBcbiAgfVxuICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9uc1xuXG4gIHZhciB0d29TdGFyID0gb3B0aW9ucy5ub2dsb2JzdGFyID8gc3RhclxuICAgIDogb3B0aW9ucy5kb3QgPyB0d29TdGFyRG90XG4gICAgOiB0d29TdGFyTm9Eb3RcbiAgdmFyIGZsYWdzID0gb3B0aW9ucy5ub2Nhc2UgPyAnaScgOiAnJ1xuXG4gIHZhciByZSA9IHNldC5tYXAoZnVuY3Rpb24gKHBhdHRlcm4pIHtcbiAgICByZXR1cm4gcGF0dGVybi5tYXAoZnVuY3Rpb24gKHApIHtcbiAgICAgIHJldHVybiAocCA9PT0gR0xPQlNUQVIpID8gdHdvU3RhclxuICAgICAgOiAodHlwZW9mIHAgPT09ICdzdHJpbmcnKSA/IHJlZ0V4cEVzY2FwZShwKVxuICAgICAgOiBwLl9zcmNcbiAgICB9KS5qb2luKCdcXFxcXFwvJylcbiAgfSkuam9pbignfCcpXG5cbiAgLy8gbXVzdCBtYXRjaCBlbnRpcmUgcGF0dGVyblxuICAvLyBlbmRpbmcgaW4gYSAqIG9yICoqIHdpbGwgbWFrZSBpdCBsZXNzIHN0cmljdC5cbiAgcmUgPSAnXig/OicgKyByZSArICcpJCdcblxuICAvLyBjYW4gbWF0Y2ggYW55dGhpbmcsIGFzIGxvbmcgYXMgaXQncyBub3QgdGhpcy5cbiAgaWYgKHRoaXMubmVnYXRlKSByZSA9ICdeKD8hJyArIHJlICsgJykuKiQnXG5cbiAgdHJ5IHtcbiAgICB0aGlzLnJlZ2V4cCA9IG5ldyBSZWdFeHAocmUsIGZsYWdzKVxuICB9IGNhdGNoIChleCkge1xuICAgIHRoaXMucmVnZXhwID0gZmFsc2VcbiAgfVxuICByZXR1cm4gdGhpcy5yZWdleHBcbn1cblxubWluaW1hdGNoLm1hdGNoID0gZnVuY3Rpb24gKGxpc3QsIHBhdHRlcm4sIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgdmFyIG1tID0gbmV3IE1pbmltYXRjaChwYXR0ZXJuLCBvcHRpb25zKVxuICBsaXN0ID0gbGlzdC5maWx0ZXIoZnVuY3Rpb24gKGYpIHtcbiAgICByZXR1cm4gbW0ubWF0Y2goZilcbiAgfSlcbiAgaWYgKG1tLm9wdGlvbnMubm9udWxsICYmICFsaXN0Lmxlbmd0aCkge1xuICAgIGxpc3QucHVzaChwYXR0ZXJuKVxuICB9XG4gIHJldHVybiBsaXN0XG59XG5cbk1pbmltYXRjaC5wcm90b3R5cGUubWF0Y2ggPSBtYXRjaFxuZnVuY3Rpb24gbWF0Y2ggKGYsIHBhcnRpYWwpIHtcbiAgdGhpcy5kZWJ1ZygnbWF0Y2gnLCBmLCB0aGlzLnBhdHRlcm4pXG4gIC8vIHNob3J0LWNpcmN1aXQgaW4gdGhlIGNhc2Ugb2YgYnVzdGVkIHRoaW5ncy5cbiAgLy8gY29tbWVudHMsIGV0Yy5cbiAgaWYgKHRoaXMuY29tbWVudCkgcmV0dXJuIGZhbHNlXG4gIGlmICh0aGlzLmVtcHR5KSByZXR1cm4gZiA9PT0gJydcblxuICBpZiAoZiA9PT0gJy8nICYmIHBhcnRpYWwpIHJldHVybiB0cnVlXG5cbiAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnNcblxuICAvLyB3aW5kb3dzOiBuZWVkIHRvIHVzZSAvLCBub3QgXFxcbiAgaWYgKHBhdGguc2VwICE9PSAnLycpIHtcbiAgICBmID0gZi5zcGxpdChwYXRoLnNlcCkuam9pbignLycpXG4gIH1cblxuICAvLyB0cmVhdCB0aGUgdGVzdCBwYXRoIGFzIGEgc2V0IG9mIHBhdGhwYXJ0cy5cbiAgZiA9IGYuc3BsaXQoc2xhc2hTcGxpdClcbiAgdGhpcy5kZWJ1Zyh0aGlzLnBhdHRlcm4sICdzcGxpdCcsIGYpXG5cbiAgLy8ganVzdCBPTkUgb2YgdGhlIHBhdHRlcm4gc2V0cyBpbiB0aGlzLnNldCBuZWVkcyB0byBtYXRjaFxuICAvLyBpbiBvcmRlciBmb3IgaXQgdG8gYmUgdmFsaWQuICBJZiBuZWdhdGluZywgdGhlbiBqdXN0IG9uZVxuICAvLyBtYXRjaCBtZWFucyB0aGF0IHdlIGhhdmUgZmFpbGVkLlxuICAvLyBFaXRoZXIgd2F5LCByZXR1cm4gb24gdGhlIGZpcnN0IGhpdC5cblxuICB2YXIgc2V0ID0gdGhpcy5zZXRcbiAgdGhpcy5kZWJ1Zyh0aGlzLnBhdHRlcm4sICdzZXQnLCBzZXQpXG5cbiAgLy8gRmluZCB0aGUgYmFzZW5hbWUgb2YgdGhlIHBhdGggYnkgbG9va2luZyBmb3IgdGhlIGxhc3Qgbm9uLWVtcHR5IHNlZ21lbnRcbiAgdmFyIGZpbGVuYW1lXG4gIHZhciBpXG4gIGZvciAoaSA9IGYubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBmaWxlbmFtZSA9IGZbaV1cbiAgICBpZiAoZmlsZW5hbWUpIGJyZWFrXG4gIH1cblxuICBmb3IgKGkgPSAwOyBpIDwgc2V0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHBhdHRlcm4gPSBzZXRbaV1cbiAgICB2YXIgZmlsZSA9IGZcbiAgICBpZiAob3B0aW9ucy5tYXRjaEJhc2UgJiYgcGF0dGVybi5sZW5ndGggPT09IDEpIHtcbiAgICAgIGZpbGUgPSBbZmlsZW5hbWVdXG4gICAgfVxuICAgIHZhciBoaXQgPSB0aGlzLm1hdGNoT25lKGZpbGUsIHBhdHRlcm4sIHBhcnRpYWwpXG4gICAgaWYgKGhpdCkge1xuICAgICAgaWYgKG9wdGlvbnMuZmxpcE5lZ2F0ZSkgcmV0dXJuIHRydWVcbiAgICAgIHJldHVybiAhdGhpcy5uZWdhdGVcbiAgICB9XG4gIH1cblxuICAvLyBkaWRuJ3QgZ2V0IGFueSBoaXRzLiAgdGhpcyBpcyBzdWNjZXNzIGlmIGl0J3MgYSBuZWdhdGl2ZVxuICAvLyBwYXR0ZXJuLCBmYWlsdXJlIG90aGVyd2lzZS5cbiAgaWYgKG9wdGlvbnMuZmxpcE5lZ2F0ZSkgcmV0dXJuIGZhbHNlXG4gIHJldHVybiB0aGlzLm5lZ2F0ZVxufVxuXG4vLyBzZXQgcGFydGlhbCB0byB0cnVlIHRvIHRlc3QgaWYsIGZvciBleGFtcGxlLFxuLy8gXCIvYS9iXCIgbWF0Y2hlcyB0aGUgc3RhcnQgb2YgXCIvKi9iLyovZFwiXG4vLyBQYXJ0aWFsIG1lYW5zLCBpZiB5b3UgcnVuIG91dCBvZiBmaWxlIGJlZm9yZSB5b3UgcnVuXG4vLyBvdXQgb2YgcGF0dGVybiwgdGhlbiB0aGF0J3MgZmluZSwgYXMgbG9uZyBhcyBhbGxcbi8vIHRoZSBwYXJ0cyBtYXRjaC5cbk1pbmltYXRjaC5wcm90b3R5cGUubWF0Y2hPbmUgPSBmdW5jdGlvbiAoZmlsZSwgcGF0dGVybiwgcGFydGlhbCkge1xuICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9uc1xuXG4gIHRoaXMuZGVidWcoJ21hdGNoT25lJyxcbiAgICB7ICd0aGlzJzogdGhpcywgZmlsZTogZmlsZSwgcGF0dGVybjogcGF0dGVybiB9KVxuXG4gIHRoaXMuZGVidWcoJ21hdGNoT25lJywgZmlsZS5sZW5ndGgsIHBhdHRlcm4ubGVuZ3RoKVxuXG4gIGZvciAodmFyIGZpID0gMCxcbiAgICAgIHBpID0gMCxcbiAgICAgIGZsID0gZmlsZS5sZW5ndGgsXG4gICAgICBwbCA9IHBhdHRlcm4ubGVuZ3RoXG4gICAgICA7IChmaSA8IGZsKSAmJiAocGkgPCBwbClcbiAgICAgIDsgZmkrKywgcGkrKykge1xuICAgIHRoaXMuZGVidWcoJ21hdGNoT25lIGxvb3AnKVxuICAgIHZhciBwID0gcGF0dGVybltwaV1cbiAgICB2YXIgZiA9IGZpbGVbZmldXG5cbiAgICB0aGlzLmRlYnVnKHBhdHRlcm4sIHAsIGYpXG5cbiAgICAvLyBzaG91bGQgYmUgaW1wb3NzaWJsZS5cbiAgICAvLyBzb21lIGludmFsaWQgcmVnZXhwIHN0dWZmIGluIHRoZSBzZXQuXG4gICAgaWYgKHAgPT09IGZhbHNlKSByZXR1cm4gZmFsc2VcblxuICAgIGlmIChwID09PSBHTE9CU1RBUikge1xuICAgICAgdGhpcy5kZWJ1ZygnR0xPQlNUQVInLCBbcGF0dGVybiwgcCwgZl0pXG5cbiAgICAgIC8vIFwiKipcIlxuICAgICAgLy8gYS8qKi9iLyoqL2Mgd291bGQgbWF0Y2ggdGhlIGZvbGxvd2luZzpcbiAgICAgIC8vIGEvYi94L3kvei9jXG4gICAgICAvLyBhL3gveS96L2IvY1xuICAgICAgLy8gYS9iL3gvYi94L2NcbiAgICAgIC8vIGEvYi9jXG4gICAgICAvLyBUbyBkbyB0aGlzLCB0YWtlIHRoZSByZXN0IG9mIHRoZSBwYXR0ZXJuIGFmdGVyXG4gICAgICAvLyB0aGUgKiosIGFuZCBzZWUgaWYgaXQgd291bGQgbWF0Y2ggdGhlIGZpbGUgcmVtYWluZGVyLlxuICAgICAgLy8gSWYgc28sIHJldHVybiBzdWNjZXNzLlxuICAgICAgLy8gSWYgbm90LCB0aGUgKiogXCJzd2FsbG93c1wiIGEgc2VnbWVudCwgYW5kIHRyeSBhZ2Fpbi5cbiAgICAgIC8vIFRoaXMgaXMgcmVjdXJzaXZlbHkgYXdmdWwuXG4gICAgICAvL1xuICAgICAgLy8gYS8qKi9iLyoqL2MgbWF0Y2hpbmcgYS9iL3gveS96L2NcbiAgICAgIC8vIC0gYSBtYXRjaGVzIGFcbiAgICAgIC8vIC0gZG91Ymxlc3RhclxuICAgICAgLy8gICAtIG1hdGNoT25lKGIveC95L3ovYywgYi8qKi9jKVxuICAgICAgLy8gICAgIC0gYiBtYXRjaGVzIGJcbiAgICAgIC8vICAgICAtIGRvdWJsZXN0YXJcbiAgICAgIC8vICAgICAgIC0gbWF0Y2hPbmUoeC95L3ovYywgYykgLT4gbm9cbiAgICAgIC8vICAgICAgIC0gbWF0Y2hPbmUoeS96L2MsIGMpIC0+IG5vXG4gICAgICAvLyAgICAgICAtIG1hdGNoT25lKHovYywgYykgLT4gbm9cbiAgICAgIC8vICAgICAgIC0gbWF0Y2hPbmUoYywgYykgeWVzLCBoaXRcbiAgICAgIHZhciBmciA9IGZpXG4gICAgICB2YXIgcHIgPSBwaSArIDFcbiAgICAgIGlmIChwciA9PT0gcGwpIHtcbiAgICAgICAgdGhpcy5kZWJ1ZygnKiogYXQgdGhlIGVuZCcpXG4gICAgICAgIC8vIGEgKiogYXQgdGhlIGVuZCB3aWxsIGp1c3Qgc3dhbGxvdyB0aGUgcmVzdC5cbiAgICAgICAgLy8gV2UgaGF2ZSBmb3VuZCBhIG1hdGNoLlxuICAgICAgICAvLyBob3dldmVyLCBpdCB3aWxsIG5vdCBzd2FsbG93IC8ueCwgdW5sZXNzXG4gICAgICAgIC8vIG9wdGlvbnMuZG90IGlzIHNldC5cbiAgICAgICAgLy8gLiBhbmQgLi4gYXJlICpuZXZlciogbWF0Y2hlZCBieSAqKiwgZm9yIGV4cGxvc2l2ZWx5XG4gICAgICAgIC8vIGV4cG9uZW50aWFsIHJlYXNvbnMuXG4gICAgICAgIGZvciAoOyBmaSA8IGZsOyBmaSsrKSB7XG4gICAgICAgICAgaWYgKGZpbGVbZmldID09PSAnLicgfHwgZmlsZVtmaV0gPT09ICcuLicgfHxcbiAgICAgICAgICAgICghb3B0aW9ucy5kb3QgJiYgZmlsZVtmaV0uY2hhckF0KDApID09PSAnLicpKSByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuXG4gICAgICAvLyBvaywgbGV0J3Mgc2VlIGlmIHdlIGNhbiBzd2FsbG93IHdoYXRldmVyIHdlIGNhbi5cbiAgICAgIHdoaWxlIChmciA8IGZsKSB7XG4gICAgICAgIHZhciBzd2FsbG93ZWUgPSBmaWxlW2ZyXVxuXG4gICAgICAgIHRoaXMuZGVidWcoJ1xcbmdsb2JzdGFyIHdoaWxlJywgZmlsZSwgZnIsIHBhdHRlcm4sIHByLCBzd2FsbG93ZWUpXG5cbiAgICAgICAgLy8gWFhYIHJlbW92ZSB0aGlzIHNsaWNlLiAgSnVzdCBwYXNzIHRoZSBzdGFydCBpbmRleC5cbiAgICAgICAgaWYgKHRoaXMubWF0Y2hPbmUoZmlsZS5zbGljZShmciksIHBhdHRlcm4uc2xpY2UocHIpLCBwYXJ0aWFsKSkge1xuICAgICAgICAgIHRoaXMuZGVidWcoJ2dsb2JzdGFyIGZvdW5kIG1hdGNoIScsIGZyLCBmbCwgc3dhbGxvd2VlKVxuICAgICAgICAgIC8vIGZvdW5kIGEgbWF0Y2guXG4gICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBjYW4ndCBzd2FsbG93IFwiLlwiIG9yIFwiLi5cIiBldmVyLlxuICAgICAgICAgIC8vIGNhbiBvbmx5IHN3YWxsb3cgXCIuZm9vXCIgd2hlbiBleHBsaWNpdGx5IGFza2VkLlxuICAgICAgICAgIGlmIChzd2FsbG93ZWUgPT09ICcuJyB8fCBzd2FsbG93ZWUgPT09ICcuLicgfHxcbiAgICAgICAgICAgICghb3B0aW9ucy5kb3QgJiYgc3dhbGxvd2VlLmNoYXJBdCgwKSA9PT0gJy4nKSkge1xuICAgICAgICAgICAgdGhpcy5kZWJ1ZygnZG90IGRldGVjdGVkIScsIGZpbGUsIGZyLCBwYXR0ZXJuLCBwcilcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gKiogc3dhbGxvd3MgYSBzZWdtZW50LCBhbmQgY29udGludWUuXG4gICAgICAgICAgdGhpcy5kZWJ1ZygnZ2xvYnN0YXIgc3dhbGxvdyBhIHNlZ21lbnQsIGFuZCBjb250aW51ZScpXG4gICAgICAgICAgZnIrK1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIG5vIG1hdGNoIHdhcyBmb3VuZC5cbiAgICAgIC8vIEhvd2V2ZXIsIGluIHBhcnRpYWwgbW9kZSwgd2UgY2FuJ3Qgc2F5IHRoaXMgaXMgbmVjZXNzYXJpbHkgb3Zlci5cbiAgICAgIC8vIElmIHRoZXJlJ3MgbW9yZSAqcGF0dGVybiogbGVmdCwgdGhlblxuICAgICAgaWYgKHBhcnRpYWwpIHtcbiAgICAgICAgLy8gcmFuIG91dCBvZiBmaWxlXG4gICAgICAgIHRoaXMuZGVidWcoJ1xcbj4+PiBubyBtYXRjaCwgcGFydGlhbD8nLCBmaWxlLCBmciwgcGF0dGVybiwgcHIpXG4gICAgICAgIGlmIChmciA9PT0gZmwpIHJldHVybiB0cnVlXG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICAvLyBzb21ldGhpbmcgb3RoZXIgdGhhbiAqKlxuICAgIC8vIG5vbi1tYWdpYyBwYXR0ZXJucyBqdXN0IGhhdmUgdG8gbWF0Y2ggZXhhY3RseVxuICAgIC8vIHBhdHRlcm5zIHdpdGggbWFnaWMgaGF2ZSBiZWVuIHR1cm5lZCBpbnRvIHJlZ2V4cHMuXG4gICAgdmFyIGhpdFxuICAgIGlmICh0eXBlb2YgcCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGlmIChvcHRpb25zLm5vY2FzZSkge1xuICAgICAgICBoaXQgPSBmLnRvTG93ZXJDYXNlKCkgPT09IHAudG9Mb3dlckNhc2UoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaGl0ID0gZiA9PT0gcFxuICAgICAgfVxuICAgICAgdGhpcy5kZWJ1Zygnc3RyaW5nIG1hdGNoJywgcCwgZiwgaGl0KVxuICAgIH0gZWxzZSB7XG4gICAgICBoaXQgPSBmLm1hdGNoKHApXG4gICAgICB0aGlzLmRlYnVnKCdwYXR0ZXJuIG1hdGNoJywgcCwgZiwgaGl0KVxuICAgIH1cblxuICAgIGlmICghaGl0KSByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIC8vIE5vdGU6IGVuZGluZyBpbiAvIG1lYW5zIHRoYXQgd2UnbGwgZ2V0IGEgZmluYWwgXCJcIlxuICAvLyBhdCB0aGUgZW5kIG9mIHRoZSBwYXR0ZXJuLiAgVGhpcyBjYW4gb25seSBtYXRjaCBhXG4gIC8vIGNvcnJlc3BvbmRpbmcgXCJcIiBhdCB0aGUgZW5kIG9mIHRoZSBmaWxlLlxuICAvLyBJZiB0aGUgZmlsZSBlbmRzIGluIC8sIHRoZW4gaXQgY2FuIG9ubHkgbWF0Y2ggYVxuICAvLyBhIHBhdHRlcm4gdGhhdCBlbmRzIGluIC8sIHVubGVzcyB0aGUgcGF0dGVybiBqdXN0XG4gIC8vIGRvZXNuJ3QgaGF2ZSBhbnkgbW9yZSBmb3IgaXQuIEJ1dCwgYS9iLyBzaG91bGQgKm5vdCpcbiAgLy8gbWF0Y2ggXCJhL2IvKlwiLCBldmVuIHRob3VnaCBcIlwiIG1hdGNoZXMgYWdhaW5zdCB0aGVcbiAgLy8gW14vXSo/IHBhdHRlcm4sIGV4Y2VwdCBpbiBwYXJ0aWFsIG1vZGUsIHdoZXJlIGl0IG1pZ2h0XG4gIC8vIHNpbXBseSBub3QgYmUgcmVhY2hlZCB5ZXQuXG4gIC8vIEhvd2V2ZXIsIGEvYi8gc2hvdWxkIHN0aWxsIHNhdGlzZnkgYS8qXG5cbiAgLy8gbm93IGVpdGhlciB3ZSBmZWxsIG9mZiB0aGUgZW5kIG9mIHRoZSBwYXR0ZXJuLCBvciB3ZSdyZSBkb25lLlxuICBpZiAoZmkgPT09IGZsICYmIHBpID09PSBwbCkge1xuICAgIC8vIHJhbiBvdXQgb2YgcGF0dGVybiBhbmQgZmlsZW5hbWUgYXQgdGhlIHNhbWUgdGltZS5cbiAgICAvLyBhbiBleGFjdCBoaXQhXG4gICAgcmV0dXJuIHRydWVcbiAgfSBlbHNlIGlmIChmaSA9PT0gZmwpIHtcbiAgICAvLyByYW4gb3V0IG9mIGZpbGUsIGJ1dCBzdGlsbCBoYWQgcGF0dGVybiBsZWZ0LlxuICAgIC8vIHRoaXMgaXMgb2sgaWYgd2UncmUgZG9pbmcgdGhlIG1hdGNoIGFzIHBhcnQgb2ZcbiAgICAvLyBhIGdsb2IgZnMgdHJhdmVyc2FsLlxuICAgIHJldHVybiBwYXJ0aWFsXG4gIH0gZWxzZSBpZiAocGkgPT09IHBsKSB7XG4gICAgLy8gcmFuIG91dCBvZiBwYXR0ZXJuLCBzdGlsbCBoYXZlIGZpbGUgbGVmdC5cbiAgICAvLyB0aGlzIGlzIG9ubHkgYWNjZXB0YWJsZSBpZiB3ZSdyZSBvbiB0aGUgdmVyeSBsYXN0XG4gICAgLy8gZW1wdHkgc2VnbWVudCBvZiBhIGZpbGUgd2l0aCBhIHRyYWlsaW5nIHNsYXNoLlxuICAgIC8vIGEvKiBzaG91bGQgbWF0Y2ggYS9iL1xuICAgIHZhciBlbXB0eUZpbGVFbmQgPSAoZmkgPT09IGZsIC0gMSkgJiYgKGZpbGVbZmldID09PSAnJylcbiAgICByZXR1cm4gZW1wdHlGaWxlRW5kXG4gIH1cblxuICAvLyBzaG91bGQgYmUgdW5yZWFjaGFibGUuXG4gIHRocm93IG5ldyBFcnJvcignd3RmPycpXG59XG5cbi8vIHJlcGxhY2Ugc3R1ZmYgbGlrZSBcXCogd2l0aCAqXG5mdW5jdGlvbiBnbG9iVW5lc2NhcGUgKHMpIHtcbiAgcmV0dXJuIHMucmVwbGFjZSgvXFxcXCguKS9nLCAnJDEnKVxufVxuXG5mdW5jdGlvbiByZWdFeHBFc2NhcGUgKHMpIHtcbiAgcmV0dXJuIHMucmVwbGFjZSgvWy1bXFxde30oKSorPy4sXFxcXF4kfCNcXHNdL2csICdcXFxcJCYnKVxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZzLWpldHBhY2svfi9taW5pbWF0Y2gvbWluaW1hdGNoLmpzXG4vLyBtb2R1bGUgaWQgPSAzOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbnZhciBjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTtcbnZhciBwYXRoVXRpbCA9IHJlcXVpcmUoJ3BhdGgnKTtcbnZhciBRID0gcmVxdWlyZSgncScpO1xudmFyIGluc3BlY3QgPSByZXF1aXJlKCcuL2luc3BlY3QnKTtcbnZhciBsaXN0ID0gcmVxdWlyZSgnLi9saXN0Jyk7XG52YXIgdmFsaWRhdGUgPSByZXF1aXJlKCcuL3V0aWxzL3ZhbGlkYXRlJyk7XG5cbnZhciB2YWxpZGF0ZUlucHV0ID0gZnVuY3Rpb24gKG1ldGhvZE5hbWUsIHBhdGgsIG9wdGlvbnMpIHtcbiAgdmFyIG1ldGhvZFNpZ25hdHVyZSA9IG1ldGhvZE5hbWUgKyAnKHBhdGgsIFtvcHRpb25zXSknO1xuICB2YWxpZGF0ZS5hcmd1bWVudChtZXRob2RTaWduYXR1cmUsICdwYXRoJywgcGF0aCwgWydzdHJpbmcnXSk7XG4gIHZhbGlkYXRlLm9wdGlvbnMobWV0aG9kU2lnbmF0dXJlLCAnb3B0aW9ucycsIG9wdGlvbnMsIHtcbiAgICBjaGVja3N1bTogWydzdHJpbmcnXSxcbiAgICByZWxhdGl2ZVBhdGg6IFsnYm9vbGVhbiddLFxuICAgIHN5bWxpbmtzOiBbJ3N0cmluZyddXG4gIH0pO1xuXG4gIGlmIChvcHRpb25zICYmIG9wdGlvbnMuY2hlY2tzdW0gIT09IHVuZGVmaW5lZFxuICAgICYmIGluc3BlY3Quc3VwcG9ydGVkQ2hlY2tzdW1BbGdvcml0aG1zLmluZGV4T2Yob3B0aW9ucy5jaGVja3N1bSkgPT09IC0xKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdBcmd1bWVudCBcIm9wdGlvbnMuY2hlY2tzdW1cIiBwYXNzZWQgdG8gJyArIG1ldGhvZFNpZ25hdHVyZVxuICAgICAgKyAnIG11c3QgaGF2ZSBvbmUgb2YgdmFsdWVzOiAnICsgaW5zcGVjdC5zdXBwb3J0ZWRDaGVja3N1bUFsZ29yaXRobXMuam9pbignLCAnKSk7XG4gIH1cblxuICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnN5bWxpbmtzICE9PSB1bmRlZmluZWRcbiAgICAmJiBpbnNwZWN0LnN5bWxpbmtPcHRpb25zLmluZGV4T2Yob3B0aW9ucy5zeW1saW5rcykgPT09IC0xKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdBcmd1bWVudCBcIm9wdGlvbnMuc3ltbGlua3NcIiBwYXNzZWQgdG8gJyArIG1ldGhvZFNpZ25hdHVyZVxuICAgICAgKyAnIG11c3QgaGF2ZSBvbmUgb2YgdmFsdWVzOiAnICsgaW5zcGVjdC5zeW1saW5rT3B0aW9ucy5qb2luKCcsICcpKTtcbiAgfVxufTtcblxudmFyIGdlbmVyYXRlVHJlZU5vZGVSZWxhdGl2ZVBhdGggPSBmdW5jdGlvbiAocGFyZW50LCBwYXRoKSB7XG4gIGlmICghcGFyZW50KSB7XG4gICAgcmV0dXJuICcuJztcbiAgfVxuICByZXR1cm4gcGFyZW50LnJlbGF0aXZlUGF0aCArICcvJyArIHBhdGhVdGlsLmJhc2VuYW1lKHBhdGgpO1xufTtcblxuLy8gQ3JlYXRlcyBjaGVja3N1bSBvZiBhIGRpcmVjdG9yeSBieSB1c2luZ1xuLy8gY2hlY2tzdW1zIGFuZCBuYW1lcyBvZiBhbGwgaXRzIGNoaWxkcmVuIGluc2lkZS5cbnZhciBjaGVja3N1bU9mRGlyID0gZnVuY3Rpb24gKGluc3BlY3RMaXN0LCBhbGdvKSB7XG4gIHZhciBoYXNoID0gY3J5cHRvLmNyZWF0ZUhhc2goYWxnbyk7XG4gIGluc3BlY3RMaXN0LmZvckVhY2goZnVuY3Rpb24gKGluc3BlY3RPYmopIHtcbiAgICBoYXNoLnVwZGF0ZShpbnNwZWN0T2JqLm5hbWUgKyBpbnNwZWN0T2JqW2FsZ29dKTtcbiAgfSk7XG4gIHJldHVybiBoYXNoLmRpZ2VzdCgnaGV4Jyk7XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFN5bmNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgaW5zcGVjdFRyZWVOb2RlU3luYyA9IGZ1bmN0aW9uIChwYXRoLCBvcHRpb25zLCBwYXJlbnQpIHtcbiAgdmFyIHRyZWVCcmFuY2ggPSBpbnNwZWN0LnN5bmMocGF0aCwgb3B0aW9ucyk7XG5cbiAgaWYgKHRyZWVCcmFuY2gpIHtcbiAgICBpZiAob3B0aW9ucy5yZWxhdGl2ZVBhdGgpIHtcbiAgICAgIHRyZWVCcmFuY2gucmVsYXRpdmVQYXRoID0gZ2VuZXJhdGVUcmVlTm9kZVJlbGF0aXZlUGF0aChwYXJlbnQsIHBhdGgpO1xuICAgIH1cblxuICAgIGlmICh0cmVlQnJhbmNoLnR5cGUgPT09ICdkaXInKSB7XG4gICAgICB0cmVlQnJhbmNoLnNpemUgPSAwO1xuICAgICAgdHJlZUJyYW5jaC5jaGlsZHJlbiA9IGxpc3Quc3luYyhwYXRoKS5tYXAoZnVuY3Rpb24gKGZpbGVuYW1lKSB7XG4gICAgICAgIHZhciBzdWJCcmFuY2hQYXRoID0gcGF0aFV0aWwuam9pbihwYXRoLCBmaWxlbmFtZSk7XG4gICAgICAgIHZhciB0cmVlU3ViQnJhbmNoID0gaW5zcGVjdFRyZWVOb2RlU3luYyhzdWJCcmFuY2hQYXRoLCBvcHRpb25zLCB0cmVlQnJhbmNoKTtcbiAgICAgICAgLy8gQWRkIHRvZ2V0aGVyIGFsbCBjaGlsZHJlbnMnIHNpemUgdG8gZ2V0IGRpcmVjdG9yeSBjb21iaW5lZCBzaXplLlxuICAgICAgICB0cmVlQnJhbmNoLnNpemUgKz0gdHJlZVN1YkJyYW5jaC5zaXplIHx8IDA7XG4gICAgICAgIHJldHVybiB0cmVlU3ViQnJhbmNoO1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChvcHRpb25zLmNoZWNrc3VtKSB7XG4gICAgICAgIHRyZWVCcmFuY2hbb3B0aW9ucy5jaGVja3N1bV0gPSBjaGVja3N1bU9mRGlyKHRyZWVCcmFuY2guY2hpbGRyZW4sIG9wdGlvbnMuY2hlY2tzdW0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cmVlQnJhbmNoO1xufTtcblxudmFyIGluc3BlY3RUcmVlU3luYyA9IGZ1bmN0aW9uIChwYXRoLCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIHJldHVybiBpbnNwZWN0VHJlZU5vZGVTeW5jKHBhdGgsIG9wdGlvbnMsIHVuZGVmaW5lZCk7XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEFzeW5jXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGluc3BlY3RUcmVlTm9kZUFzeW5jID0gZnVuY3Rpb24gKHBhdGgsIG9wdGlvbnMsIHBhcmVudCkge1xuICB2YXIgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG5cbiAgdmFyIGluc3BlY3RBbGxDaGlsZHJlbiA9IGZ1bmN0aW9uICh0cmVlQnJhbmNoKSB7XG4gICAgdmFyIHN1YkRpckRlZmVycmVkID0gUS5kZWZlcigpO1xuXG4gICAgbGlzdC5hc3luYyhwYXRoKS50aGVuKGZ1bmN0aW9uIChjaGlsZHJlbikge1xuICAgICAgdmFyIGRvTmV4dCA9IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICB2YXIgc3ViUGF0aDtcbiAgICAgICAgaWYgKGluZGV4ID09PSBjaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgICAgICBpZiAob3B0aW9ucy5jaGVja3N1bSkge1xuICAgICAgICAgICAgLy8gV2UgYXJlIGRvbmUsIGJ1dCBzdGlsbCBoYXZlIHRvIGNhbGN1bGF0ZSBjaGVja3N1bSBvZiB3aG9sZSBkaXJlY3RvcnkuXG4gICAgICAgICAgICB0cmVlQnJhbmNoW29wdGlvbnMuY2hlY2tzdW1dID0gY2hlY2tzdW1PZkRpcih0cmVlQnJhbmNoLmNoaWxkcmVuLCBvcHRpb25zLmNoZWNrc3VtKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc3ViRGlyRGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN1YlBhdGggPSBwYXRoVXRpbC5qb2luKHBhdGgsIGNoaWxkcmVuW2luZGV4XSk7XG4gICAgICAgICAgaW5zcGVjdFRyZWVOb2RlQXN5bmMoc3ViUGF0aCwgb3B0aW9ucywgdHJlZUJyYW5jaClcbiAgICAgICAgICAudGhlbihmdW5jdGlvbiAodHJlZVN1YkJyYW5jaCkge1xuICAgICAgICAgICAgY2hpbGRyZW5baW5kZXhdID0gdHJlZVN1YkJyYW5jaDtcbiAgICAgICAgICAgIHRyZWVCcmFuY2guc2l6ZSArPSB0cmVlU3ViQnJhbmNoLnNpemUgfHwgMDtcbiAgICAgICAgICAgIGRvTmV4dChpbmRleCArIDEpO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLmNhdGNoKHN1YkRpckRlZmVycmVkLnJlamVjdCk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHRyZWVCcmFuY2guY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgICAgIHRyZWVCcmFuY2guc2l6ZSA9IDA7XG5cbiAgICAgIGRvTmV4dCgwKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBzdWJEaXJEZWZlcnJlZC5wcm9taXNlO1xuICB9O1xuXG4gIGluc3BlY3QuYXN5bmMocGF0aCwgb3B0aW9ucylcbiAgLnRoZW4oZnVuY3Rpb24gKHRyZWVCcmFuY2gpIHtcbiAgICBpZiAoIXRyZWVCcmFuY2gpIHtcbiAgICAgIC8vIEdpdmVuIHBhdGggZG9lc24ndCBleGlzdC4gV2UgYXJlIGRvbmUuXG4gICAgICBkZWZlcnJlZC5yZXNvbHZlKHRyZWVCcmFuY2gpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAob3B0aW9ucy5yZWxhdGl2ZVBhdGgpIHtcbiAgICAgICAgdHJlZUJyYW5jaC5yZWxhdGl2ZVBhdGggPSBnZW5lcmF0ZVRyZWVOb2RlUmVsYXRpdmVQYXRoKHBhcmVudCwgcGF0aCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0cmVlQnJhbmNoLnR5cGUgIT09ICdkaXInKSB7XG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUodHJlZUJyYW5jaCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnNwZWN0QWxsQ2hpbGRyZW4odHJlZUJyYW5jaClcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUodHJlZUJyYW5jaCk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChkZWZlcnJlZC5yZWplY3QpO1xuICAgICAgfVxuICAgIH1cbiAgfSlcbiAgLmNhdGNoKGRlZmVycmVkLnJlamVjdCk7XG5cbiAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59O1xuXG52YXIgaW5zcGVjdFRyZWVBc3luYyA9IGZ1bmN0aW9uIChwYXRoLCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIHJldHVybiBpbnNwZWN0VHJlZU5vZGVBc3luYyhwYXRoLCBvcHRpb25zKTtcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gQVBJXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZXhwb3J0cy52YWxpZGF0ZUlucHV0ID0gdmFsaWRhdGVJbnB1dDtcbmV4cG9ydHMuc3luYyA9IGluc3BlY3RUcmVlU3luYztcbmV4cG9ydHMuYXN5bmMgPSBpbnNwZWN0VHJlZUFzeW5jO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZzLWpldHBhY2svbGliL2luc3BlY3RfdHJlZS5qc1xuLy8gbW9kdWxlIGlkID0gNDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcGF0aFV0aWwgPSByZXF1aXJlKCdwYXRoJyk7XG52YXIgZnMgPSByZXF1aXJlKCdmcycpO1xudmFyIFEgPSByZXF1aXJlKCdxJyk7XG52YXIgbWtkaXJwID0gcmVxdWlyZSgnbWtkaXJwJyk7XG5cbnZhciBleGlzdHMgPSByZXF1aXJlKCcuL2V4aXN0cycpO1xudmFyIG1hdGNoZXIgPSByZXF1aXJlKCcuL3V0aWxzL21hdGNoZXInKTtcbnZhciBmaWxlTW9kZSA9IHJlcXVpcmUoJy4vdXRpbHMvbW9kZScpO1xudmFyIHRyZWVXYWxrZXIgPSByZXF1aXJlKCcuL3V0aWxzL3RyZWVfd2Fsa2VyJyk7XG52YXIgdmFsaWRhdGUgPSByZXF1aXJlKCcuL3V0aWxzL3ZhbGlkYXRlJyk7XG52YXIgd3JpdGUgPSByZXF1aXJlKCcuL3dyaXRlJyk7XG5cbnZhciB2YWxpZGF0ZUlucHV0ID0gZnVuY3Rpb24gKG1ldGhvZE5hbWUsIGZyb20sIHRvLCBvcHRpb25zKSB7XG4gIHZhciBtZXRob2RTaWduYXR1cmUgPSBtZXRob2ROYW1lICsgJyhmcm9tLCB0bywgW29wdGlvbnNdKSc7XG4gIHZhbGlkYXRlLmFyZ3VtZW50KG1ldGhvZFNpZ25hdHVyZSwgJ2Zyb20nLCBmcm9tLCBbJ3N0cmluZyddKTtcbiAgdmFsaWRhdGUuYXJndW1lbnQobWV0aG9kU2lnbmF0dXJlLCAndG8nLCB0bywgWydzdHJpbmcnXSk7XG4gIHZhbGlkYXRlLm9wdGlvbnMobWV0aG9kU2lnbmF0dXJlLCAnb3B0aW9ucycsIG9wdGlvbnMsIHtcbiAgICBvdmVyd3JpdGU6IFsnYm9vbGVhbiddLFxuICAgIG1hdGNoaW5nOiBbJ3N0cmluZycsICdhcnJheSBvZiBzdHJpbmcnXVxuICB9KTtcbn07XG5cbnZhciBwYXJzZU9wdGlvbnMgPSBmdW5jdGlvbiAob3B0aW9ucywgZnJvbSkge1xuICB2YXIgb3B0cyA9IG9wdGlvbnMgfHwge307XG4gIHZhciBwYXJzZWRPcHRpb25zID0ge307XG5cbiAgcGFyc2VkT3B0aW9ucy5vdmVyd3JpdGUgPSBvcHRzLm92ZXJ3cml0ZTtcblxuICBpZiAob3B0cy5tYXRjaGluZykge1xuICAgIHBhcnNlZE9wdGlvbnMuYWxsb3dlZFRvQ29weSA9IG1hdGNoZXIuY3JlYXRlKGZyb20sIG9wdHMubWF0Y2hpbmcpO1xuICB9IGVsc2Uge1xuICAgIHBhcnNlZE9wdGlvbnMuYWxsb3dlZFRvQ29weSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIERlZmF1bHQgYmVoYXZpb3VyIC0gY29weSBldmVyeXRoaW5nLlxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBwYXJzZWRPcHRpb25zO1xufTtcblxudmFyIGdlbmVyYXRlTm9Tb3VyY2VFcnJvciA9IGZ1bmN0aW9uIChwYXRoKSB7XG4gIHZhciBlcnIgPSBuZXcgRXJyb3IoXCJQYXRoIHRvIGNvcHkgZG9lc24ndCBleGlzdCBcIiArIHBhdGgpO1xuICBlcnIuY29kZSA9ICdFTk9FTlQnO1xuICByZXR1cm4gZXJyO1xufTtcblxudmFyIGdlbmVyYXRlRGVzdGluYXRpb25FeGlzdHNFcnJvciA9IGZ1bmN0aW9uIChwYXRoKSB7XG4gIHZhciBlcnIgPSBuZXcgRXJyb3IoJ0Rlc3RpbmF0aW9uIHBhdGggYWxyZWFkeSBleGlzdHMgJyArIHBhdGgpO1xuICBlcnIuY29kZSA9ICdFRVhJU1QnO1xuICByZXR1cm4gZXJyO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBTeW5jXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNoZWNrc0JlZm9yZUNvcHlpbmdTeW5jID0gZnVuY3Rpb24gKGZyb20sIHRvLCBvcHRzKSB7XG4gIGlmICghZXhpc3RzLnN5bmMoZnJvbSkpIHtcbiAgICB0aHJvdyBnZW5lcmF0ZU5vU291cmNlRXJyb3IoZnJvbSk7XG4gIH1cblxuICBpZiAoZXhpc3RzLnN5bmModG8pICYmICFvcHRzLm92ZXJ3cml0ZSkge1xuICAgIHRocm93IGdlbmVyYXRlRGVzdGluYXRpb25FeGlzdHNFcnJvcih0byk7XG4gIH1cbn07XG5cbnZhciBjb3B5RmlsZVN5bmMgPSBmdW5jdGlvbiAoZnJvbSwgdG8sIG1vZGUpIHtcbiAgdmFyIGRhdGEgPSBmcy5yZWFkRmlsZVN5bmMoZnJvbSk7XG4gIHdyaXRlLnN5bmModG8sIGRhdGEsIHsgbW9kZTogbW9kZSB9KTtcbn07XG5cbnZhciBjb3B5U3ltbGlua1N5bmMgPSBmdW5jdGlvbiAoZnJvbSwgdG8pIHtcbiAgdmFyIHN5bWxpbmtQb2ludHNBdCA9IGZzLnJlYWRsaW5rU3luYyhmcm9tKTtcbiAgdHJ5IHtcbiAgICBmcy5zeW1saW5rU3luYyhzeW1saW5rUG9pbnRzQXQsIHRvKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgLy8gVGhlcmUgaXMgYWxyZWFkeSBmaWxlL3N5bWxpbmsgd2l0aCB0aGlzIG5hbWUgb24gZGVzdGluYXRpb24gbG9jYXRpb24uXG4gICAgLy8gTXVzdCBlcmFzZSBpdCBtYW51YWxseSwgb3RoZXJ3aXNlIHN5c3RlbSB3b24ndCBhbGxvdyB1cyB0byBwbGFjZSBzeW1saW5rIHRoZXJlLlxuICAgIGlmIChlcnIuY29kZSA9PT0gJ0VFWElTVCcpIHtcbiAgICAgIGZzLnVubGlua1N5bmModG8pO1xuICAgICAgLy8gUmV0cnkuLi5cbiAgICAgIGZzLnN5bWxpbmtTeW5jKHN5bWxpbmtQb2ludHNBdCwgdG8pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBlcnI7XG4gICAgfVxuICB9XG59O1xuXG52YXIgY29weUl0ZW1TeW5jID0gZnVuY3Rpb24gKGZyb20sIGluc3BlY3REYXRhLCB0bykge1xuICB2YXIgbW9kZSA9IGZpbGVNb2RlLm5vcm1hbGl6ZUZpbGVNb2RlKGluc3BlY3REYXRhLm1vZGUpO1xuICBpZiAoaW5zcGVjdERhdGEudHlwZSA9PT0gJ2RpcicpIHtcbiAgICBta2RpcnAuc3luYyh0bywgeyBtb2RlOiBtb2RlIH0pO1xuICB9IGVsc2UgaWYgKGluc3BlY3REYXRhLnR5cGUgPT09ICdmaWxlJykge1xuICAgIGNvcHlGaWxlU3luYyhmcm9tLCB0bywgbW9kZSk7XG4gIH0gZWxzZSBpZiAoaW5zcGVjdERhdGEudHlwZSA9PT0gJ3N5bWxpbmsnKSB7XG4gICAgY29weVN5bWxpbmtTeW5jKGZyb20sIHRvKTtcbiAgfVxufTtcblxudmFyIGNvcHlTeW5jID0gZnVuY3Rpb24gKGZyb20sIHRvLCBvcHRpb25zKSB7XG4gIHZhciBvcHRzID0gcGFyc2VPcHRpb25zKG9wdGlvbnMsIGZyb20pO1xuXG4gIGNoZWNrc0JlZm9yZUNvcHlpbmdTeW5jKGZyb20sIHRvLCBvcHRzKTtcblxuICB0cmVlV2Fsa2VyLnN5bmMoZnJvbSwge1xuICAgIGluc3BlY3RPcHRpb25zOiB7XG4gICAgICBtb2RlOiB0cnVlLFxuICAgICAgc3ltbGlua3M6IHRydWVcbiAgICB9XG4gIH0sIGZ1bmN0aW9uIChwYXRoLCBpbnNwZWN0RGF0YSkge1xuICAgIHZhciByZWwgPSBwYXRoVXRpbC5yZWxhdGl2ZShmcm9tLCBwYXRoKTtcbiAgICB2YXIgZGVzdFBhdGggPSBwYXRoVXRpbC5yZXNvbHZlKHRvLCByZWwpO1xuICAgIGlmIChvcHRzLmFsbG93ZWRUb0NvcHkocGF0aCkpIHtcbiAgICAgIGNvcHlJdGVtU3luYyhwYXRoLCBpbnNwZWN0RGF0YSwgZGVzdFBhdGgpO1xuICAgIH1cbiAgfSk7XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEFzeW5jXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIHByb21pc2VkU3ltbGluayA9IFEuZGVub2RlaWZ5KGZzLnN5bWxpbmspO1xudmFyIHByb21pc2VkUmVhZGxpbmsgPSBRLmRlbm9kZWlmeShmcy5yZWFkbGluayk7XG52YXIgcHJvbWlzZWRVbmxpbmsgPSBRLmRlbm9kZWlmeShmcy51bmxpbmspO1xudmFyIHByb21pc2VkTWtkaXJwID0gUS5kZW5vZGVpZnkobWtkaXJwKTtcblxudmFyIGNoZWNrc0JlZm9yZUNvcHlpbmdBc3luYyA9IGZ1bmN0aW9uIChmcm9tLCB0bywgb3B0cykge1xuICByZXR1cm4gZXhpc3RzLmFzeW5jKGZyb20pXG4gIC50aGVuKGZ1bmN0aW9uIChzcmNQYXRoRXhpc3RzKSB7XG4gICAgaWYgKCFzcmNQYXRoRXhpc3RzKSB7XG4gICAgICB0aHJvdyBnZW5lcmF0ZU5vU291cmNlRXJyb3IoZnJvbSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBleGlzdHMuYXN5bmModG8pO1xuICAgIH1cbiAgfSlcbiAgLnRoZW4oZnVuY3Rpb24gKGRlc3RQYXRoRXhpc3RzKSB7XG4gICAgaWYgKGRlc3RQYXRoRXhpc3RzICYmICFvcHRzLm92ZXJ3cml0ZSkge1xuICAgICAgdGhyb3cgZ2VuZXJhdGVEZXN0aW5hdGlvbkV4aXN0c0Vycm9yKHRvKTtcbiAgICB9XG4gIH0pO1xufTtcblxudmFyIGNvcHlGaWxlQXN5bmMgPSBmdW5jdGlvbiAoZnJvbSwgdG8sIG1vZGUsIHJldHJpZWRBdHRlbXB0KSB7XG4gIHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcblxuICB2YXIgcmVhZFN0cmVhbSA9IGZzLmNyZWF0ZVJlYWRTdHJlYW0oZnJvbSk7XG4gIHZhciB3cml0ZVN0cmVhbSA9IGZzLmNyZWF0ZVdyaXRlU3RyZWFtKHRvLCB7IG1vZGU6IG1vZGUgfSk7XG5cbiAgcmVhZFN0cmVhbS5vbignZXJyb3InLCBkZWZlcnJlZC5yZWplY3QpO1xuXG4gIHdyaXRlU3RyZWFtLm9uKCdlcnJvcicsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICB2YXIgdG9EaXJQYXRoID0gcGF0aFV0aWwuZGlybmFtZSh0byk7XG5cbiAgICAvLyBGb3JjZSByZWFkIHN0cmVhbSB0byBjbG9zZSwgc2luY2Ugd3JpdGUgc3RyZWFtIGVycm9yZWRcbiAgICAvLyByZWFkIHN0cmVhbSBzZXJ2ZXMgdXMgbm8gcHVycG9zZS5cbiAgICByZWFkU3RyZWFtLnJlc3VtZSgpO1xuXG4gICAgaWYgKGVyci5jb2RlID09PSAnRU5PRU5UJyAmJiByZXRyaWVkQXR0ZW1wdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBTb21lIHBhcmVudCBkaXJlY3RvcnkgZG9lc24ndCBleGl0cy4gQ3JlYXRlIGl0IGFuZCByZXRyeS5cbiAgICAgIHByb21pc2VkTWtkaXJwKHRvRGlyUGF0aCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIE1ha2UgcmV0cnkgYXR0ZW1wdCBvbmx5IG9uY2UgdG8gcHJldmVudCB2aWNpb3VzIGluZmluaXRlIGxvb3BcbiAgICAgICAgLy8gKHdoZW4gZm9yIHNvbWUgb2JzY3VyZSByZWFzb24gSS9PIHdpbGwga2VlcCByZXR1cm5pbmcgRU5PRU5UIGVycm9yKS5cbiAgICAgICAgLy8gUGFzc2luZyByZXRyaWVkQXR0ZW1wdCA9IHRydWUuXG4gICAgICAgIGNvcHlGaWxlQXN5bmMoZnJvbSwgdG8sIG1vZGUsIHRydWUpXG4gICAgICAgIC50aGVuKGRlZmVycmVkLnJlc29sdmUpXG4gICAgICAgIC5jYXRjaChkZWZlcnJlZC5yZWplY3QpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlZmVycmVkLnJlamVjdChlcnIpO1xuICAgIH1cbiAgfSk7XG5cbiAgd3JpdGVTdHJlYW0ub24oJ2ZpbmlzaCcsIGRlZmVycmVkLnJlc29sdmUpO1xuXG4gIHJlYWRTdHJlYW0ucGlwZSh3cml0ZVN0cmVhbSk7XG5cbiAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59O1xuXG52YXIgY29weVN5bWxpbmtBc3luYyA9IGZ1bmN0aW9uIChmcm9tLCB0bykge1xuICByZXR1cm4gcHJvbWlzZWRSZWFkbGluayhmcm9tKVxuICAudGhlbihmdW5jdGlvbiAoc3ltbGlua1BvaW50c0F0KSB7XG4gICAgdmFyIGRlZmVycmVkID0gUS5kZWZlcigpO1xuXG4gICAgcHJvbWlzZWRTeW1saW5rKHN5bWxpbmtQb2ludHNBdCwgdG8pXG4gICAgLnRoZW4oZGVmZXJyZWQucmVzb2x2ZSlcbiAgICAuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgaWYgKGVyci5jb2RlID09PSAnRUVYSVNUJykge1xuICAgICAgICAvLyBUaGVyZSBpcyBhbHJlYWR5IGZpbGUvc3ltbGluayB3aXRoIHRoaXMgbmFtZSBvbiBkZXN0aW5hdGlvbiBsb2NhdGlvbi5cbiAgICAgICAgLy8gTXVzdCBlcmFzZSBpdCBtYW51YWxseSwgb3RoZXJ3aXNlIHN5c3RlbSB3b24ndCBhbGxvdyB1cyB0byBwbGFjZSBzeW1saW5rIHRoZXJlLlxuICAgICAgICBwcm9taXNlZFVubGluayh0bylcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIC8vIFJldHJ5Li4uXG4gICAgICAgICAgcmV0dXJuIHByb21pc2VkU3ltbGluayhzeW1saW5rUG9pbnRzQXQsIHRvKTtcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4oZGVmZXJyZWQucmVzb2x2ZSwgZGVmZXJyZWQucmVqZWN0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdChlcnIpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH0pO1xufTtcblxudmFyIGNvcHlJdGVtQXN5bmMgPSBmdW5jdGlvbiAoZnJvbSwgaW5zcGVjdERhdGEsIHRvKSB7XG4gIHZhciBtb2RlID0gZmlsZU1vZGUubm9ybWFsaXplRmlsZU1vZGUoaW5zcGVjdERhdGEubW9kZSk7XG4gIGlmIChpbnNwZWN0RGF0YS50eXBlID09PSAnZGlyJykge1xuICAgIHJldHVybiBwcm9taXNlZE1rZGlycCh0bywgeyBtb2RlOiBtb2RlIH0pO1xuICB9IGVsc2UgaWYgKGluc3BlY3REYXRhLnR5cGUgPT09ICdmaWxlJykge1xuICAgIHJldHVybiBjb3B5RmlsZUFzeW5jKGZyb20sIHRvLCBtb2RlKTtcbiAgfSBlbHNlIGlmIChpbnNwZWN0RGF0YS50eXBlID09PSAnc3ltbGluaycpIHtcbiAgICByZXR1cm4gY29weVN5bWxpbmtBc3luYyhmcm9tLCB0byk7XG4gIH1cbiAgLy8gSGEhIFRoaXMgaXMgbm9uZSBvZiBzdXBwb3J0ZWQgZmlsZSBzeXN0ZW0gZW50aXRpZXMuIFdoYXQgbm93P1xuICAvLyBKdXN0IGNvbnRpbnVpbmcgd2l0aG91dCBhY3R1YWxseSBjb3B5aW5nIHNvdW5kcyBzYW5lLlxuICByZXR1cm4gbmV3IFEoKTtcbn07XG5cbnZhciBjb3B5QXN5bmMgPSBmdW5jdGlvbiAoZnJvbSwgdG8sIG9wdGlvbnMpIHtcbiAgdmFyIGRlZmVycmVkID0gUS5kZWZlcigpO1xuICB2YXIgb3B0cyA9IHBhcnNlT3B0aW9ucyhvcHRpb25zLCBmcm9tKTtcblxuICBjaGVja3NCZWZvcmVDb3B5aW5nQXN5bmMoZnJvbSwgdG8sIG9wdHMpXG4gIC50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYWxsRmlsZXNEZWxpdmVyZWQgPSBmYWxzZTtcbiAgICB2YXIgZmlsZXNJblByb2dyZXNzID0gMDtcblxuICAgIHZhciBzdHJlYW0gPSB0cmVlV2Fsa2VyLnN0cmVhbShmcm9tLCB7XG4gICAgICBpbnNwZWN0T3B0aW9uczoge1xuICAgICAgICBtb2RlOiB0cnVlLFxuICAgICAgICBzeW1saW5rczogdHJ1ZVxuICAgICAgfVxuICAgIH0pXG4gICAgLm9uKCdyZWFkYWJsZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBpdGVtID0gc3RyZWFtLnJlYWQoKTtcbiAgICAgIHZhciByZWw7XG4gICAgICB2YXIgZGVzdFBhdGg7XG4gICAgICBpZiAoaXRlbSkge1xuICAgICAgICByZWwgPSBwYXRoVXRpbC5yZWxhdGl2ZShmcm9tLCBpdGVtLnBhdGgpO1xuICAgICAgICBkZXN0UGF0aCA9IHBhdGhVdGlsLnJlc29sdmUodG8sIHJlbCk7XG4gICAgICAgIGlmIChvcHRzLmFsbG93ZWRUb0NvcHkoaXRlbS5wYXRoKSkge1xuICAgICAgICAgIGZpbGVzSW5Qcm9ncmVzcyArPSAxO1xuICAgICAgICAgIGNvcHlJdGVtQXN5bmMoaXRlbS5wYXRoLCBpdGVtLml0ZW0sIGRlc3RQYXRoKVxuICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGZpbGVzSW5Qcm9ncmVzcyAtPSAxO1xuICAgICAgICAgICAgaWYgKGFsbEZpbGVzRGVsaXZlcmVkICYmIGZpbGVzSW5Qcm9ncmVzcyA9PT0gMCkge1xuICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuY2F0Y2goZGVmZXJyZWQucmVqZWN0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gICAgLm9uKCdlcnJvcicsIGRlZmVycmVkLnJlamVjdClcbiAgICAub24oJ2VuZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGFsbEZpbGVzRGVsaXZlcmVkID0gdHJ1ZTtcbiAgICAgIGlmIChhbGxGaWxlc0RlbGl2ZXJlZCAmJiBmaWxlc0luUHJvZ3Jlc3MgPT09IDApIHtcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KVxuICAuY2F0Y2goZGVmZXJyZWQucmVqZWN0KTtcblxuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gQVBJXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZXhwb3J0cy52YWxpZGF0ZUlucHV0ID0gdmFsaWRhdGVJbnB1dDtcbmV4cG9ydHMuc3luYyA9IGNvcHlTeW5jO1xuZXhwb3J0cy5hc3luYyA9IGNvcHlBc3luYztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9mcy1qZXRwYWNrL2xpYi9jb3B5LmpzXG4vLyBtb2R1bGUgaWQgPSA0MVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbnZhciBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG52YXIgUSA9IHJlcXVpcmUoJ3EnKTtcbnZhciB2YWxpZGF0ZSA9IHJlcXVpcmUoJy4vdXRpbHMvdmFsaWRhdGUnKTtcblxudmFyIHZhbGlkYXRlSW5wdXQgPSBmdW5jdGlvbiAobWV0aG9kTmFtZSwgcGF0aCkge1xuICB2YXIgbWV0aG9kU2lnbmF0dXJlID0gbWV0aG9kTmFtZSArICcocGF0aCknO1xuICB2YWxpZGF0ZS5hcmd1bWVudChtZXRob2RTaWduYXR1cmUsICdwYXRoJywgcGF0aCwgWydzdHJpbmcnXSk7XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFN5bmNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgZXhpc3RzU3luYyA9IGZ1bmN0aW9uIChwYXRoKSB7XG4gIHZhciBzdGF0O1xuICB0cnkge1xuICAgIHN0YXQgPSBmcy5zdGF0U3luYyhwYXRoKTtcbiAgICBpZiAoc3RhdC5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICByZXR1cm4gJ2Rpcic7XG4gICAgfSBlbHNlIGlmIChzdGF0LmlzRmlsZSgpKSB7XG4gICAgICByZXR1cm4gJ2ZpbGUnO1xuICAgIH1cbiAgICByZXR1cm4gJ290aGVyJztcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgaWYgKGVyci5jb2RlICE9PSAnRU5PRU5UJykge1xuICAgICAgdGhyb3cgZXJyO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gQXN5bmNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgZXhpc3RzQXN5bmMgPSBmdW5jdGlvbiAocGF0aCkge1xuICB2YXIgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG5cbiAgZnMuc3RhdChwYXRoLCBmdW5jdGlvbiAoZXJyLCBzdGF0KSB7XG4gICAgaWYgKGVycikge1xuICAgICAgaWYgKGVyci5jb2RlID09PSAnRU5PRU5UJykge1xuICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGZhbHNlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdChlcnIpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoc3RhdC5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICBkZWZlcnJlZC5yZXNvbHZlKCdkaXInKTtcbiAgICB9IGVsc2UgaWYgKHN0YXQuaXNGaWxlKCkpIHtcbiAgICAgIGRlZmVycmVkLnJlc29sdmUoJ2ZpbGUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVmZXJyZWQucmVzb2x2ZSgnb3RoZXInKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBBUElcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5leHBvcnRzLnZhbGlkYXRlSW5wdXQgPSB2YWxpZGF0ZUlucHV0O1xuZXhwb3J0cy5zeW5jID0gZXhpc3RzU3luYztcbmV4cG9ydHMuYXN5bmMgPSBleGlzdHNBc3luYztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9mcy1qZXRwYWNrL2xpYi9leGlzdHMuanNcbi8vIG1vZHVsZSBpZCA9IDQyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxudmFyIHBhdGhVdGlsID0gcmVxdWlyZSgncGF0aCcpO1xudmFyIGZzID0gcmVxdWlyZSgnZnMnKTtcbnZhciBRID0gcmVxdWlyZSgncScpO1xudmFyIG1rZGlycCA9IHJlcXVpcmUoJ21rZGlycCcpO1xudmFyIGV4aXN0cyA9IHJlcXVpcmUoJy4vZXhpc3RzJyk7XG52YXIgdmFsaWRhdGUgPSByZXF1aXJlKCcuL3V0aWxzL3ZhbGlkYXRlJyk7XG5cbnZhciB2YWxpZGF0ZUlucHV0ID0gZnVuY3Rpb24gKG1ldGhvZE5hbWUsIGZyb20sIHRvKSB7XG4gIHZhciBtZXRob2RTaWduYXR1cmUgPSBtZXRob2ROYW1lICsgJyhmcm9tLCB0byknO1xuICB2YWxpZGF0ZS5hcmd1bWVudChtZXRob2RTaWduYXR1cmUsICdmcm9tJywgZnJvbSwgWydzdHJpbmcnXSk7XG4gIHZhbGlkYXRlLmFyZ3VtZW50KG1ldGhvZFNpZ25hdHVyZSwgJ3RvJywgdG8sIFsnc3RyaW5nJ10pO1xufTtcblxudmFyIGdlbmVyYXRlU291cmNlRG9lc250RXhpc3RFcnJvciA9IGZ1bmN0aW9uIChwYXRoKSB7XG4gIHZhciBlcnIgPSBuZXcgRXJyb3IoXCJQYXRoIHRvIG1vdmUgZG9lc24ndCBleGlzdCBcIiArIHBhdGgpO1xuICBlcnIuY29kZSA9ICdFTk9FTlQnO1xuICByZXR1cm4gZXJyO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBTeW5jXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIG1vdmVTeW5jID0gZnVuY3Rpb24gKGZyb20sIHRvKSB7XG4gIHRyeSB7XG4gICAgZnMucmVuYW1lU3luYyhmcm9tLCB0byk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGlmIChlcnIuY29kZSAhPT0gJ0VOT0VOVCcpIHtcbiAgICAgIC8vIFdlIGNhbid0IG1ha2Ugc2Vuc2Ugb2YgdGhpcyBlcnJvci4gUmV0aHJvdyBpdC5cbiAgICAgIHRocm93IGVycjtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gT2ssIHNvdXJjZSBvciBkZXN0aW5hdGlvbiBwYXRoIGRvZXNuJ3QgZXhpc3QuXG4gICAgICAvLyBNdXN0IGRvIG1vcmUgaW52ZXN0aWdhdGlvbi5cbiAgICAgIGlmICghZXhpc3RzLnN5bmMoZnJvbSkpIHtcbiAgICAgICAgdGhyb3cgZ2VuZXJhdGVTb3VyY2VEb2VzbnRFeGlzdEVycm9yKGZyb20pO1xuICAgICAgfVxuICAgICAgaWYgKCFleGlzdHMuc3luYyh0bykpIHtcbiAgICAgICAgLy8gU29tZSBwYXJlbnQgZGlyZWN0b3J5IGRvZXNuJ3QgZXhpc3QuIENyZWF0ZSBpdC5cbiAgICAgICAgbWtkaXJwLnN5bmMocGF0aFV0aWwuZGlybmFtZSh0bykpO1xuICAgICAgICAvLyBSZXRyeSB0aGUgYXR0ZW1wdFxuICAgICAgICBmcy5yZW5hbWVTeW5jKGZyb20sIHRvKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gQXN5bmNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgcHJvbWlzZWRSZW5hbWUgPSBRLmRlbm9kZWlmeShmcy5yZW5hbWUpO1xudmFyIHByb21pc2VkTWtkaXJwID0gUS5kZW5vZGVpZnkobWtkaXJwKTtcblxudmFyIGVuc3VyZURlc3RpbmF0aW9uUGF0aEV4aXN0c0FzeW5jID0gZnVuY3Rpb24gKHRvKSB7XG4gIHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcblxuICB2YXIgZGVzdERpciA9IHBhdGhVdGlsLmRpcm5hbWUodG8pO1xuICBleGlzdHMuYXN5bmMoZGVzdERpcilcbiAgLnRoZW4oZnVuY3Rpb24gKGRzdEV4aXN0cykge1xuICAgIGlmICghZHN0RXhpc3RzKSB7XG4gICAgICBwcm9taXNlZE1rZGlycChkZXN0RGlyKVxuICAgICAgLnRoZW4oZGVmZXJyZWQucmVzb2x2ZSwgZGVmZXJyZWQucmVqZWN0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSGFoLCBubyBpZGVhLlxuICAgICAgZGVmZXJyZWQucmVqZWN0KCk7XG4gICAgfVxuICB9KVxuICAuY2F0Y2goZGVmZXJyZWQucmVqZWN0KTtcblxuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cbnZhciBtb3ZlQXN5bmMgPSBmdW5jdGlvbiAoZnJvbSwgdG8pIHtcbiAgdmFyIGRlZmVycmVkID0gUS5kZWZlcigpO1xuXG4gIHByb21pc2VkUmVuYW1lKGZyb20sIHRvKVxuICAudGhlbihkZWZlcnJlZC5yZXNvbHZlKVxuICAuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgIGlmIChlcnIuY29kZSAhPT0gJ0VOT0VOVCcpIHtcbiAgICAgIC8vIFNvbWV0aGluZyB1bmtub3duLiBSZXRocm93IG9yaWdpbmFsIGVycm9yLlxuICAgICAgZGVmZXJyZWQucmVqZWN0KGVycik7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIE9rLCBzb3VyY2Ugb3IgZGVzdGluYXRpb24gcGF0aCBkb2Vzbid0IGV4aXN0LlxuICAgICAgLy8gTXVzdCBkbyBtb3JlIGludmVzdGlnYXRpb24uXG4gICAgICBleGlzdHMuYXN5bmMoZnJvbSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uIChzcmNFeGlzdHMpIHtcbiAgICAgICAgaWYgKCFzcmNFeGlzdHMpIHtcbiAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoZ2VuZXJhdGVTb3VyY2VEb2VzbnRFeGlzdEVycm9yKGZyb20pKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbnN1cmVEZXN0aW5hdGlvblBhdGhFeGlzdHNBc3luYyh0bylcbiAgICAgICAgICAudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBSZXRyeSB0aGUgYXR0ZW1wdFxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2VkUmVuYW1lKGZyb20sIHRvKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC50aGVuKGRlZmVycmVkLnJlc29sdmUsIGRlZmVycmVkLnJlamVjdCk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuY2F0Y2goZGVmZXJyZWQucmVqZWN0KTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBBUElcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5leHBvcnRzLnZhbGlkYXRlSW5wdXQgPSB2YWxpZGF0ZUlucHV0O1xuZXhwb3J0cy5zeW5jID0gbW92ZVN5bmM7XG5leHBvcnRzLmFzeW5jID0gbW92ZUFzeW5jO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZzLWpldHBhY2svbGliL21vdmUuanNcbi8vIG1vZHVsZSBpZCA9IDQzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qIGVzbGludCBuby1jb25zb2xlOjEgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgZnMgPSByZXF1aXJlKCdmcycpO1xudmFyIFEgPSByZXF1aXJlKCdxJyk7XG52YXIgdmFsaWRhdGUgPSByZXF1aXJlKCcuL3V0aWxzL3ZhbGlkYXRlJyk7XG5cbnZhciBzdXBwb3J0ZWRSZXR1cm5BcyA9IFsndXRmOCcsICdidWZmZXInLCAnanNvbicsICdqc29uV2l0aERhdGVzJ107XG5cbnZhciB2YWxpZGF0ZUlucHV0ID0gZnVuY3Rpb24gKG1ldGhvZE5hbWUsIHBhdGgsIHJldHVybkFzKSB7XG4gIHZhciBtZXRob2RTaWduYXR1cmUgPSBtZXRob2ROYW1lICsgJyhwYXRoLCByZXR1cm5BcyknO1xuICB2YWxpZGF0ZS5hcmd1bWVudChtZXRob2RTaWduYXR1cmUsICdwYXRoJywgcGF0aCwgWydzdHJpbmcnXSk7XG4gIHZhbGlkYXRlLmFyZ3VtZW50KG1ldGhvZFNpZ25hdHVyZSwgJ3JldHVybkFzJywgcmV0dXJuQXMsIFsnc3RyaW5nJywgJ3VuZGVmaW5lZCddKTtcblxuICBpZiAocmV0dXJuQXMgJiYgc3VwcG9ydGVkUmV0dXJuQXMuaW5kZXhPZihyZXR1cm5BcykgPT09IC0xKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdBcmd1bWVudCBcInJldHVybkFzXCIgcGFzc2VkIHRvICcgKyBtZXRob2RTaWduYXR1cmVcbiAgICAgICsgJyBtdXN0IGhhdmUgb25lIG9mIHZhbHVlczogJyArIHN1cHBvcnRlZFJldHVybkFzLmpvaW4oJywgJykpO1xuICB9XG59O1xuXG4vLyBNYXRjaGVzIHN0cmluZ3MgZ2VuZXJhdGVkIGJ5IERhdGUudG9KU09OKClcbi8vIHdoaWNoIGlzIGNhbGxlZCB0byBzZXJpYWxpemUgZGF0ZSB0byBKU09OLlxudmFyIGpzb25EYXRlUGFyc2VyID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgdmFyIHJlSVNPID0gL14oXFxkezR9KS0oXFxkezJ9KS0oXFxkezJ9KVQoXFxkezJ9KTooXFxkezJ9KTooXFxkezJ9KD86XFwuXFxkKikpKD86WnwoXFwrfC0pKFtcXGR8Ol0qKSk/JC87XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgaWYgKHJlSVNPLmV4ZWModmFsdWUpKSB7XG4gICAgICByZXR1cm4gbmV3IERhdGUodmFsdWUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdmFsdWU7XG59O1xuXG52YXIgbWFrZU5pY2VySnNvblBhcnNpbmdFcnJvciA9IGZ1bmN0aW9uIChwYXRoLCBlcnIpIHtcbiAgdmFyIG5pY2VyRXJyb3IgPSBuZXcgRXJyb3IoJ0pTT04gcGFyc2luZyBmYWlsZWQgd2hpbGUgcmVhZGluZyAnXG4gICsgcGF0aCArICcgWycgKyBlcnIgKyAnXScpO1xuICBuaWNlckVycm9yLm9yaWdpbmFsRXJyb3IgPSBlcnI7XG4gIHJldHVybiBuaWNlckVycm9yO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBTWU5DXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIHJlYWRTeW5jID0gZnVuY3Rpb24gKHBhdGgsIHJldHVybkFzKSB7XG4gIHZhciByZXRBcyA9IHJldHVybkFzIHx8ICd1dGY4JztcbiAgdmFyIGRhdGE7XG5cbiAgdmFyIGVuY29kaW5nID0gJ3V0ZjgnO1xuICBpZiAocmV0QXMgPT09ICdidWZmZXInKSB7XG4gICAgZW5jb2RpbmcgPSBudWxsO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBkYXRhID0gZnMucmVhZEZpbGVTeW5jKHBhdGgsIHsgZW5jb2Rpbmc6IGVuY29kaW5nIH0pO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBpZiAoZXJyLmNvZGUgPT09ICdFTk9FTlQnKSB7XG4gICAgICAvLyBJZiBmaWxlIGRvZXNuJ3QgZXhpc3QgcmV0dXJuIHVuZGVmaW5lZCBpbnN0ZWFkIG9mIHRocm93aW5nLlxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgLy8gT3RoZXJ3aXNlIHJldGhyb3cgdGhlIGVycm9yXG4gICAgdGhyb3cgZXJyO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBpZiAocmV0QXMgPT09ICdqc29uJykge1xuICAgICAgZGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XG4gICAgfSBlbHNlIGlmIChyZXRBcyA9PT0gJ2pzb25XaXRoRGF0ZXMnKSB7XG4gICAgICBkYXRhID0gSlNPTi5wYXJzZShkYXRhLCBqc29uRGF0ZVBhcnNlcik7XG4gICAgfVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICB0aHJvdyBtYWtlTmljZXJKc29uUGFyc2luZ0Vycm9yKHBhdGgsIGVycik7XG4gIH1cblxuICByZXR1cm4gZGF0YTtcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gQVNZTkNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgcHJvbWlzZWRSZWFkRmlsZSA9IFEuZGVub2RlaWZ5KGZzLnJlYWRGaWxlKTtcblxudmFyIHJlYWRBc3luYyA9IGZ1bmN0aW9uIChwYXRoLCByZXR1cm5Bcykge1xuICB2YXIgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG5cbiAgdmFyIHJldEFzID0gcmV0dXJuQXMgfHwgJ3V0ZjgnO1xuICB2YXIgZW5jb2RpbmcgPSAndXRmOCc7XG4gIGlmIChyZXRBcyA9PT0gJ2J1ZmZlcicpIHtcbiAgICBlbmNvZGluZyA9IG51bGw7XG4gIH1cblxuICBwcm9taXNlZFJlYWRGaWxlKHBhdGgsIHsgZW5jb2Rpbmc6IGVuY29kaW5nIH0pXG4gIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgLy8gTWFrZSBmaW5hbCBwYXJzaW5nIG9mIHRoZSBkYXRhIGJlZm9yZSByZXR1cm5pbmcuXG4gICAgdHJ5IHtcbiAgICAgIGlmIChyZXRBcyA9PT0gJ2pzb24nKSB7XG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUoSlNPTi5wYXJzZShkYXRhKSk7XG4gICAgICB9IGVsc2UgaWYgKHJldEFzID09PSAnanNvbldpdGhEYXRlcycpIHtcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShKU09OLnBhcnNlKGRhdGEsIGpzb25EYXRlUGFyc2VyKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGRhdGEpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgZGVmZXJyZWQucmVqZWN0KG1ha2VOaWNlckpzb25QYXJzaW5nRXJyb3IocGF0aCwgZXJyKSk7XG4gICAgfVxuICB9KVxuICAuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgIGlmIChlcnIuY29kZSA9PT0gJ0VOT0VOVCcpIHtcbiAgICAgIC8vIElmIGZpbGUgZG9lc24ndCBleGlzdCByZXR1cm4gdW5kZWZpbmVkIGluc3RlYWQgb2YgdGhyb3dpbmcuXG4gICAgICBkZWZlcnJlZC5yZXNvbHZlKHVuZGVmaW5lZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIE90aGVyd2lzZSB0aHJvd1xuICAgICAgZGVmZXJyZWQucmVqZWN0KGVycik7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gQVBJXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZXhwb3J0cy52YWxpZGF0ZUlucHV0ID0gdmFsaWRhdGVJbnB1dDtcbmV4cG9ydHMuc3luYyA9IHJlYWRTeW5jO1xuZXhwb3J0cy5hc3luYyA9IHJlYWRBc3luYztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9mcy1qZXRwYWNrL2xpYi9yZWFkLmpzXG4vLyBtb2R1bGUgaWQgPSA0NFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbnZhciBRID0gcmVxdWlyZSgncScpO1xudmFyIHJpbXJhZiA9IHJlcXVpcmUoJ3JpbXJhZicpO1xuXG52YXIgdmFsaWRhdGUgPSByZXF1aXJlKCcuL3V0aWxzL3ZhbGlkYXRlJyk7XG5cbnZhciB2YWxpZGF0ZUlucHV0ID0gZnVuY3Rpb24gKG1ldGhvZE5hbWUsIHBhdGgpIHtcbiAgdmFyIG1ldGhvZFNpZ25hdHVyZSA9IG1ldGhvZE5hbWUgKyAnKFtwYXRoXSknO1xuICB2YWxpZGF0ZS5hcmd1bWVudChtZXRob2RTaWduYXR1cmUsICdwYXRoJywgcGF0aCwgWydzdHJpbmcnLCAndW5kZWZpbmVkJ10pO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBTeW5jXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIHJlbW92ZVN5bmMgPSBmdW5jdGlvbiAocGF0aCkge1xuICByaW1yYWYuc3luYyhwYXRoKTtcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gQXN5bmNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgcVJpbXJhZiA9IFEuZGVub2RlaWZ5KHJpbXJhZik7XG5cbnZhciByZW1vdmVBc3luYyA9IGZ1bmN0aW9uIChwYXRoKSB7XG4gIHJldHVybiBxUmltcmFmKHBhdGgpO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBBUElcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5leHBvcnRzLnZhbGlkYXRlSW5wdXQgPSB2YWxpZGF0ZUlucHV0O1xuZXhwb3J0cy5zeW5jID0gcmVtb3ZlU3luYztcbmV4cG9ydHMuYXN5bmMgPSByZW1vdmVBc3luYztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9mcy1qZXRwYWNrL2xpYi9yZW1vdmUuanNcbi8vIG1vZHVsZSBpZCA9IDQ1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxudmFyIHBhdGhVdGlsID0gcmVxdWlyZSgncGF0aCcpO1xudmFyIG1vdmUgPSByZXF1aXJlKCcuL21vdmUnKTtcbnZhciB2YWxpZGF0ZSA9IHJlcXVpcmUoJy4vdXRpbHMvdmFsaWRhdGUnKTtcblxudmFyIHZhbGlkYXRlSW5wdXQgPSBmdW5jdGlvbiAobWV0aG9kTmFtZSwgcGF0aCwgbmV3TmFtZSkge1xuICB2YXIgbWV0aG9kU2lnbmF0dXJlID0gbWV0aG9kTmFtZSArICcocGF0aCwgbmV3TmFtZSknO1xuICB2YWxpZGF0ZS5hcmd1bWVudChtZXRob2RTaWduYXR1cmUsICdwYXRoJywgcGF0aCwgWydzdHJpbmcnXSk7XG4gIHZhbGlkYXRlLmFyZ3VtZW50KG1ldGhvZFNpZ25hdHVyZSwgJ25ld05hbWUnLCBuZXdOYW1lLCBbJ3N0cmluZyddKTtcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gU3luY1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciByZW5hbWVTeW5jID0gZnVuY3Rpb24gKHBhdGgsIG5ld05hbWUpIHtcbiAgdmFyIG5ld1BhdGggPSBwYXRoVXRpbC5qb2luKHBhdGhVdGlsLmRpcm5hbWUocGF0aCksIG5ld05hbWUpO1xuICBtb3ZlLnN5bmMocGF0aCwgbmV3UGF0aCk7XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEFzeW5jXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIHJlbmFtZUFzeW5jID0gZnVuY3Rpb24gKHBhdGgsIG5ld05hbWUpIHtcbiAgdmFyIG5ld1BhdGggPSBwYXRoVXRpbC5qb2luKHBhdGhVdGlsLmRpcm5hbWUocGF0aCksIG5ld05hbWUpO1xuICByZXR1cm4gbW92ZS5hc3luYyhwYXRoLCBuZXdQYXRoKTtcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gQVBJXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZXhwb3J0cy52YWxpZGF0ZUlucHV0ID0gdmFsaWRhdGVJbnB1dDtcbmV4cG9ydHMuc3luYyA9IHJlbmFtZVN5bmM7XG5leHBvcnRzLmFzeW5jID0gcmVuYW1lQXN5bmM7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZnMtamV0cGFjay9saWIvcmVuYW1lLmpzXG4vLyBtb2R1bGUgaWQgPSA0NlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbnZhciBRID0gcmVxdWlyZSgncScpO1xudmFyIGZzID0gcmVxdWlyZSgnZnMnKTtcbnZhciBta2RpcnAgPSByZXF1aXJlKCdta2RpcnAnKTtcbnZhciBwYXRoVXRpbCA9IHJlcXVpcmUoJ3BhdGgnKTtcbnZhciB2YWxpZGF0ZSA9IHJlcXVpcmUoJy4vdXRpbHMvdmFsaWRhdGUnKTtcblxudmFyIHZhbGlkYXRlSW5wdXQgPSBmdW5jdGlvbiAobWV0aG9kTmFtZSwgc3ltbGlua1ZhbHVlLCBwYXRoKSB7XG4gIHZhciBtZXRob2RTaWduYXR1cmUgPSBtZXRob2ROYW1lICsgJyhzeW1saW5rVmFsdWUsIHBhdGgpJztcbiAgdmFsaWRhdGUuYXJndW1lbnQobWV0aG9kU2lnbmF0dXJlLCAnc3ltbGlua1ZhbHVlJywgc3ltbGlua1ZhbHVlLCBbJ3N0cmluZyddKTtcbiAgdmFsaWRhdGUuYXJndW1lbnQobWV0aG9kU2lnbmF0dXJlLCAncGF0aCcsIHBhdGgsIFsnc3RyaW5nJ10pO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBTeW5jXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIHN5bWxpbmtTeW5jID0gZnVuY3Rpb24gKHN5bWxpbmtWYWx1ZSwgcGF0aCkge1xuICB0cnkge1xuICAgIGZzLnN5bWxpbmtTeW5jKHN5bWxpbmtWYWx1ZSwgcGF0aCk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGlmIChlcnIuY29kZSA9PT0gJ0VOT0VOVCcpIHtcbiAgICAgIC8vIFBhcmVudCBkaXJlY3RvcmllcyBkb24ndCBleGlzdC4gSnVzdCBjcmVhdGUgdGhlbSBhbmQgcmV0eS5cbiAgICAgIG1rZGlycC5zeW5jKHBhdGhVdGlsLmRpcm5hbWUocGF0aCkpO1xuICAgICAgZnMuc3ltbGlua1N5bmMoc3ltbGlua1ZhbHVlLCBwYXRoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgZXJyO1xuICAgIH1cbiAgfVxufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBBc3luY1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBwcm9taXNlZFN5bWxpbmsgPSBRLmRlbm9kZWlmeShmcy5zeW1saW5rKTtcbnZhciBwcm9taXNlZE1rZGlycCA9IFEuZGVub2RlaWZ5KG1rZGlycCk7XG5cbnZhciBzeW1saW5rQXN5bmMgPSBmdW5jdGlvbiAoc3ltbGlua1ZhbHVlLCBwYXRoKSB7XG4gIHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcblxuICBwcm9taXNlZFN5bWxpbmsoc3ltbGlua1ZhbHVlLCBwYXRoKVxuICAudGhlbihkZWZlcnJlZC5yZXNvbHZlKVxuICAuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgIGlmIChlcnIuY29kZSA9PT0gJ0VOT0VOVCcpIHtcbiAgICAgIC8vIFBhcmVudCBkaXJlY3RvcmllcyBkb24ndCBleGlzdC4gSnVzdCBjcmVhdGUgdGhlbSBhbmQgcmV0eS5cbiAgICAgIHByb21pc2VkTWtkaXJwKHBhdGhVdGlsLmRpcm5hbWUocGF0aCkpXG4gICAgICAudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBwcm9taXNlZFN5bWxpbmsoc3ltbGlua1ZhbHVlLCBwYXRoKTtcbiAgICAgIH0pXG4gICAgICAudGhlbihkZWZlcnJlZC5yZXNvbHZlLCBkZWZlcnJlZC5yZWplY3QpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWZlcnJlZC5yZWplY3QoZXJyKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBBUElcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5leHBvcnRzLnZhbGlkYXRlSW5wdXQgPSB2YWxpZGF0ZUlucHV0O1xuZXhwb3J0cy5zeW5jID0gc3ltbGlua1N5bmM7XG5leHBvcnRzLmFzeW5jID0gc3ltbGlua0FzeW5jO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZzLWpldHBhY2svbGliL3N5bWxpbmsuanNcbi8vIG1vZHVsZSBpZCA9IDQ3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxudmFyIGZzID0gcmVxdWlyZSgnZnMnKTtcblxuZXhwb3J0cy5jcmVhdGVXcml0ZVN0cmVhbSA9IGZzLmNyZWF0ZVdyaXRlU3RyZWFtO1xuZXhwb3J0cy5jcmVhdGVSZWFkU3RyZWFtID0gZnMuY3JlYXRlUmVhZFN0cmVhbTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9mcy1qZXRwYWNrL2xpYi9zdHJlYW1zLmpzXG4vLyBtb2R1bGUgaWQgPSA0OFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9