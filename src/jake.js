define([],
    function () {

        /*
            Jake - Just a little jQuery
         */

        'use strict';

        // Save a reference to some core methods
        var class2type = {},

            // jQuery version this is based upon
            core_version = "1.10.2",

            core_hasOwn = class2type.hasOwnProperty,
            core_toString = class2type.toString,

            support = {},

            isWindow = function (obj) {
                return obj && obj === obj.window;
            },

            getWindow = function (elem) {
                return isWindow(elem) ?
                        elem :
                        elem.nodeType === 9 ?
                                elem.defaultView || elem.parentWindow :
                                false;
            },

            // Returned public functions
            jake = {

                isArraylike : function (obj) {
                    var length = obj.length,
                        type = this.type(obj);

                    if (isWindow(obj)) {
                        return false;
                    }

                    if (obj.nodeType === 1 && length) {
                        return true;
                    }

                    return type === "array" || (type !== "function" &&
                        (length === 0 ||
                            (typeof length === "number" && length > 0 && obj.hasOwnProperty(length - 1))));
                },

                // args is for internal usage only
                each : function (obj, callback, args) {
                    var value,
                        i = 0,
                        length = obj.length,
                        isArray = this.isArraylike(obj);

                    if (args) {
                        if (isArray) {
                            for (i; i < length; i += 1) {
                                value = callback.apply(obj[i], args);

                                if (value === false) {
                                    break;
                                }
                            }
                        } else {
                            for ( i in obj ) {
                                value = callback.apply( obj[ i ], args );

                                if ( value === false ) {
                                    break;
                                }
                            }
                        }

                        // A special, fast, case for the most common use of each
                    } else {
                        if ( isArray ) {
                            for (i; i < length; i++ ) {
                                value = callback.call( obj[ i ], i, obj[ i ] );

                                if ( value === false ) {
                                    break;
                                }
                            }
                        } else {
                            for ( i in obj ) {
                                value = callback.call( obj[ i ], i, obj[ i ] );

                                if ( value === false ) {
                                    break;
                                }
                            }
                        }
                    }

                    return obj;
                },

                // See test/unit/core.js for details concerning isFunction.
                // Since version 1.3, DOM methods and functions like alert
                // aren't supported. They return false on IE (#2968).
                isFunction: function (obj) {
                    return this.type(obj) === "function";
                },

                isArray: Array.isArray || function (obj) {
                    return this.type(obj) === "array";
                },

                isWindow: function (obj) {
                    return obj && obj === obj.window;
                },

                isNumeric: function (obj) {
                    return !isNaN(parseFloat(obj)) && isFinite(obj);
                },

                type: function (obj) {
                    if (obj == null) {
                        return String(obj);
                    }
                    return typeof obj === "object" || typeof obj === "function" ?
                        class2type[core_toString.call(obj)] || "object" :
                            typeof obj;
                },

                isPlainObject: function (obj) {
                    var key;

                    // Must be an Object.
                    // Because of IE, we also have to check the presence of the constructor property.
                    // Make sure that DOM nodes and window objects don't pass through, as well
                    if (!obj || this.type(obj) !== "object" || obj.nodeType || this.isWindow( obj ) ) {
                        return false;
                    }

                    try {
                        // Not own constructor property must be Object
                        if (obj.constructor &&
                            !core_hasOwn.call(obj, "constructor") &&
                            !core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                            return false;
                        }
                    } catch ( e ) {
                        // IE8,9 Will throw exceptions on certain host objects #9897
                        return false;
                    }

                    // Support: IE<9
                    // Handle iteration over inherited properties before own properties.
                    if (support.ownLast) {
                        for ( key in obj ) {
                            return core_hasOwn.call( obj, key );
                        }
                    }

                    // Own properties are enumerated firstly, so to speed up,
                    // if last one is own, then all properties are own.
                    for (key in obj) {}

                    return key === undefined || core_hasOwn.call(obj, key);
                },

                // Calculates the offset top and the offset left of an element.  T
                offset : function (elem) {
                    var docElem, win,
                        box = { top: 0, left: 0 },
                        doc = elem && elem.ownerDocument;

                    if (!doc) {
                        return;
                    }

                    docElem = doc.documentElement;

                    // If we don't have gBCR, just use 0,0 rather than error
                    // BlackBerry 5, iOS 3 (original iPhone)
                    if (typeof elem.getBoundingClientRect !== typeof undefined) {
                        box = elem.getBoundingClientRect();
                    }
                    win = getWindow(doc);

                    return {
                        top: box.top  + (win.pageYOffset || docElem.scrollTop)  -  (docElem.clientTop  || 0),
                        left: box.left + (win.pageXOffset || docElem.scrollLeft) - (docElem.clientLeft || 0)
                    };
                },

                extend : function () {
                    var src, copyIsArray, copy, name, options, clone,
                        target = arguments[0] || {},
                        i = 1,
                        length = arguments.length,
                        deep = false;

                    // Handle a deep copy situation
                    if (typeof target === "boolean") {
                        deep = target;
                        target = arguments[1] || {};
                        // skip the boolean and the target
                        i = 2;
                    }

                    // Handle case when target is a string or something (possible in deep copy)
                    if (typeof target !== "object" && !this.isFunction(target)) {
                        target = {};
                    }

                    // extend jake itself if only one argument is passed
                    if (length === i) {
                        target = this;
                        --i;
                    }

                    for (; i < length; i += 1 ) {
                        // Only deal with non-null/undefined values
                        if ( (options = arguments[ i ]) != null ) {
                            // Extend the base object
                            for ( name in options ) {
                                src = target[ name ];
                                copy = options[ name ];

                                // Prevent never-ending loop
                                if ( target === copy ) {
                                    continue;
                                }

                                // Recurse if we're merging plain objects or arrays
                                if ( deep && copy && ( this.isPlainObject(copy) || (copyIsArray = this.isArray(copy)) ) ) {
                                    if ( copyIsArray ) {
                                        copyIsArray = false;
                                        clone = src && this.isArray(src) ? src : [];

                                    } else {
                                        clone = src && this.isPlainObject(src) ? src : {};
                                    }

                                    // Never move original objects, clone them
                                    target[ name ] = this.extend( deep, clone, copy );

                                    // Don't bring in undefined values
                                } else if ( copy !== undefined ) {
                                    target[ name ] = copy;
                                }
                            }
                        }
                    }

                    // Return the modified object
                    return target;
                }
            }

        jake.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
            class2type[ "[object " + name + "]" ] = name.toLowerCase();
        });

        // Support: IE<9
        // Iteration over object's inherited properties before its own.
        for (var i in support) {
            break;
        }
        support.ownLast = i !== "0";

        return jake;
    });
