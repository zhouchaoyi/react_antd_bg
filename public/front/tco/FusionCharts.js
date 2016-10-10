/*jslint white: true, browser: true, windows: true, forin: true,  undef: true,
  eqeqeq: true, plusplus: true, bitwise: true, regexp: true, immed: true */

/*global window: false */

/**!
 * @license FusionCharts JavaScript Library
 * Copyright FusionCharts Technologies LLP
 * License Information at <http://www.fusioncharts.com/license>
 *
 * @version fusioncharts/3.3.1-sr3.21100
 *
 * @attributions (infers respective third-party copyrights)
 * Raphael 2.1.0 (modified as "Red Raphael") <http://raphaeljs.com/license.html>
 * SWFObject v2.2 (modified) <http://code.google.com/p/swfobject/>
 * JSON v2 <http://www.JSON.org/js.html>
 * jQuery 1.8.3 <http://jquery.com/>
 * Firebug Lite 1.3.0 <http://getfirebug.com/firebuglite>
 */

/**
 * FusionCharts Core Framework
 * This module contains the basic routines required by subsequent modules to
 * extend/scale or add functionality to the FusionCharts object.
 */
(function () {

    // In case FusionCharts object already exists, we skip this function.
    if (window.FusionCharts && window.FusionCharts.version) {
        return;
    }

    /**
     * @var {object} global The global variable would store all private methods
     * and properties available to each module.
     *
     * @var {object} modules For maintaining module information.
     */
    var global = {},
        win = window,
        doc = win.document,
        nav = win.navigator,
        modules = global.modules = {},
        interpreters = global.interpreters = {},

        objectToStringFn = Object.prototype.toString,

        isIE = /msie/i.test(nav.userAgent) && !win.opera,
        hasLoaded = /loaded|complete/,
        hasSVG = !!doc.createElementNS &&
            !!doc.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect,

        mapLegacyDiscovered = false, // flag to keep track of legacy map script
        notifyLibraryInit = function () {// function to notify init of library
            var wasReady = global.ready;
            global.ready = true;
            if (global.raiseEvent) {
                global.readyNotified = true;
                global.raiseEvent('ready', {
                    version: global.core.version,
                    now: !wasReady
                }, global.core);
            }
            global.readyNow = !wasReady;
        },

        // recursive function that copies one object into another.
        merge = function (obj1, obj2) {
            var item, str;
            //check whether obj2 is an array
            //if array then iterate through it's index
            //**** MOOTOOLS precution
            if (obj2 instanceof Array) {
                for (item = 0; item < obj2.length; item += 1) {
                    if (typeof obj2[item] !== 'object') {
                        obj1[item] = obj2[item];
                    } else {
                        if (typeof obj1[item] !== 'object') {
                            obj1[item] = obj2[item] instanceof Array ? [] : {};
                        }
                        merge(obj1[item], obj2[item]);
                    }
                }
            }
            else {
                for (item in obj2) {
                    if (typeof obj2[item] === 'object') {
                        str = objectToStringFn.call(obj2[item]);
                        if (str === "[object Object]") {
                            if (typeof obj1[item] !== 'object') {
                                obj1[item] = {};
                            }
                            merge(obj1[item], obj2[item]);
                        }
                        else if (str === "[object Array]") {
                            if (!(obj1[item] instanceof Array)) {
                                obj1[item] = [];
                            }
                            merge(obj1[item], obj2[item]);
                        }
                        else {
                            obj1[item] = obj2[item];
                        }
                    }
                    else {
                        obj1[item] = obj2[item];
                    }
                }
            }
            return obj1
        };

    /**
     * This method, when added to the prototype of an object,
     * allows shallow or deep extension of the object with another
     * object.
     */
    global.extend = function (sink, source, proto, deep) {
        var item;
        // When 'proto' is marked as true, the methods and properties
        // of source is not added to the prototype of the sink.
        if (proto && sink.prototype) {
            sink = sink.prototype;
        }

        // If deep extend is specified, then we use the deep copy function
        // "merge"
        if (deep === true) {
            merge(sink, source);
        }
        // Copy all methods and properties of the object passed in parameter
        // to the object to which this function is attached.
        else {
            for (item in source) {
                sink[item] = source[item];
            }
        }

        return sink;
    };

    // Function that auto-generates a unique id.
    global.uniqueId = function () {
        return 'chartobject-' + (global.uniqueId.lastId += 1);
    };
    global.uniqueId.lastId = 0;

    // Define the policy to create default parameters for the swfObject.
    // Values are in format [sourceOption, defaultValue]
    // This helps in building the initial FusionCharts object when new instances
    // are created from user parameters.
    global.policies = {

        /**
         * Contains all the customizable options that are
         * used by the library internally and has nothing to do with renderer
         * attributes, vars or parameters.
         * @type {object} options
         */
        options: {
            swfSrcPath: ['swfSrcPath', undefined],
            product: ['product', 'v3'],
            insertMode: ['insertMode', 'replace'],
            safeMode: ['safeMode', true],
            overlayButton: ['overlayButton', undefined],
            containerBackgroundColor: ['backgroundColor', '#ffffff'],
            chartType: ['type', undefined]
        },
        /**
         * @var attributes {object} Contains configurations pertaining to the
         * host (browser) environment.
         */
        attributes: {
            lang: ['lang', 'EN'],
            'class': ['className', 'FusionCharts'],
            id: ['id', undefined]
        },

        /**
         * @var {Array} width configuration for width of the chart.
         * @var {Array} height configuration for height of the chart.
         * @var {Array} src specifies chart swf url
         */
        width: ['width', '100%'],
        height: ['height', '100%'],
        src: ['swfUrl', '']
    };

    // Specifies the order in which the parameters of the new
    // FusionCharts objects are interpreted and converted to options object.
    interpreters.stat = ['swfUrl', 'id', 'width', 'height',
            'debugMode', 'registerWithJS', 'backgroundColor', 'scaleMode',
            'lang', 'detectFlashVersion', 'autoInstallRedirect']

    /**
     * Allows the core to process an arguments object based on a set of policies
     * and construct an object out of it that is mapped exactly as respective
     * parameter policy defines. In other words, it uses an object and
     * creates another object or updates another object with values from the
     * original arguments object in a particular hierarchy and name that a set
     * of rules (policies) define.
     */
    global.parsePolicies = function (obj, policies, options) {
        var prop, policy, value;

        // Iterate through the data policy and correspondingly create the
        // three stacks of parameters, attributes and flashVars
        for (policy in policies) {

            // Set just the policy object in case of single-level policy.
            if (global.policies[policy] instanceof Array) {
                value = options[policies[policy][0]];
                obj[policy] = value === undefined ? policies[policy][1] : value;

            } else {

                // Define objects that would hold parameters for swfobject. Also
                // populate with variables from the parameters
                if (typeof obj[policy] !== 'object') {
                    obj[policy] = {};
                }

                // Set every sub-object for two-level policy
                for (prop in policies[policy]) {
                    value = options[policies[policy][prop][0]];
                    obj[policy][prop] = value === undefined ?
                    policies[policy][prop][1] : value;
                }
            }
        }
    };

    /**
     * Parse commands (command interpretor) based on a specified interpreter
     * structure
     */
    global.parseCommands = function (obj, interpreter, args) {
        var i,
            l;

        if (typeof interpreter === 'string') {
            interpreter = interpreters[interpreter] || [];
        }

        // Iterate through the arguments template and add the keys to the
        // options object while fetching corresponding values from arguments
        // array.
        for (i = 0, l = interpreter.length; i < l; i++) {
            obj[interpreter[i]] = args[i];
        }

        return obj;
    };

    global.core = function (command) {
        // This point onwards, we must check whether this is being used as a
        // constructor or not
        if (!(this instanceof global.core)) {
            // Allow private communication with modules. In case FusionCharts is
            // not called as constructor and it is passed an array that is marked
            // to do private communication, then share the global variable.
            if (arguments.length === 1 &&
                    command instanceof Array && command[0] === 'private') {
                // Prevent overwriting and duplicate execution of modules.
                if (modules[command[1]]) {
                    return undefined;
                }
                modules[command[1]] = {};

                // Check for module-specific information
                if (command[3] instanceof Array) {
                    global.core.version[command[1]] = command[3];
                }

                // Execute module function
                if (typeof command[2] === 'function') {
                    return command[2].call(global, modules[command[1]]);
                }
                else {
                    return global;
                }
            }

            // Allow using FusionCharts object to directly access its new items
            if (arguments.length === 1 && typeof command === 'string') {
                return global.core.items[command];
            }
            // In case all above combination of arguments fail, we can unsafely
            // assume that user forgot the 'new' keyword.
            global.raiseError &&
                global.raiseError(this, '25081840', 'run', '', new SyntaxError(
                "Use the \"new\" keyword while creating a new FusionCharts object"));
        }

        // Define a variable for iterative key in various loops and the
        // object variable that stores the options.
        var options = {};

        /**
         * @var {object} __state maintains internal state related information.
         * @private
         */
        this.__state = {};

        // Check whether linear arguments are sent and convert it to object.
        if (arguments.length === 1 && typeof arguments[0] === 'object') {
            // If the above condition matches, then we can safely assume that
            // the first parameter is the options object.
            options = arguments[0];
        }
        else {
            // Parse command interpreter policies
            global.parseCommands(options, interpreters.stat, arguments);

            // Do a special treatment of swfUrl (first argument)
            if (global.core.options.sensePreferredRenderer && options.swfUrl &&
                    options.swfUrl.match && !options.swfUrl.match(/[^a-z0-9]+/ig)) {
                options.type = options.swfUrl;
            }
        }

        // Incorporate the trailing object parameter as object-style
        // parameter input overrides.
        if (arguments.length > 1 &&
                typeof arguments[arguments.length - 1] === 'object') {
            delete options[interpreters.stat[arguments.length - 1]];
            global.extend(options, arguments[arguments.length - 1]);
        }

        // Set autogenerated chart-id in case one is not specified
        this.id = typeof options.id === 'undefined' ?
            this.id = global.uniqueId() : options.id;

        // Set dimension passed by user and subsequently validate the options.
        // - Remove trailing 'px'
        this.args = options;

        // If an item is created with same id, the previous item is disposed.
        if (global.core.items[this.id] instanceof global.core) {
            global.raiseWarning(this, '06091847', 'param', '',
                new Error('A FusionChart oject with the specified id \"' + this.id +
                    '\" already exists. Renaming it to ' + (this.id = global.uniqueId())
                    ));
        }

        // Use the "type" attribute if provided and override swfUrl.
        if (options.type && options.type.toString) {
            // when type is provided, default renderer is JS unless overridden.
            if (!global.renderer.userSetDefault && (isIE || hasSVG)) {
                options.renderer = options.renderer || 'javascript';
            }

            // The swfUrl is first compunded with swfSrcPath and if unavailable,
            // scriptBaseUri.
            options.swfUrl = (global.core.options.swfSrcPath || options.swfSrcPath ||
                global.core.options.scriptBaseUri).replace(/\/\s*$/g, '') +
                '/' + options.type.replace(/\.swf\s*?$/ig, '') + '.swf';
        }

        // Parse global policies.
        global.parsePolicies(this, global.policies, options);

        // Copy chart id to attributes
        this.attributes.id = this.id;

        // Set initial dimension of charts
        this.resizeTo(options.width, options.height, true);

        // Execute all constructors one after the other using events.
        global.raiseEvent('BeforeInitialize', options, this);

        // Add this object to the repository of objects within core object.
        global.core.items[this.id] = this;

        // Raise initialization event.
        global.raiseEvent('Initialized', options, this);

        return this;
    };

    // Make the core extensible and reset the constructor of the object
    // for maintaining correct prototype chain.
    global.core.prototype = {};
    // Reset constructor.
    global.core.prototype.constructor = global.core;

    global.extend(global.core, {
        id: 'FusionCharts',
        /**
         * The version of FusionCharts.js
         */
        version: [3, 3, 1, 'sr3', 21100],

        // Add a container of all chart objects. This will allow easy returning
        // of FusionCharts objects through getChartFromId.
        items: {},

        // Add an object to store options
        options: {
            sensePreferredRenderer: true
        },

        // Add function to access the object created by renderers.
        getObjectReference: function (id) {
            return global.core.items[id].ref;
        }
    }, false);

    // Expose the core to the global scope.
    win.FusionCharts = global.core;

    // Check whether legacy FusionMaps already exists at this point in execution
    // time. If yes, then we need to perform routines to assimilate it.
    if (win.FusionMaps && win.FusionMaps.legacy) {
        global.core(['private', 'modules.core.geo',
            win.FusionMaps.legacy, win.FusionMaps.version]);
        mapLegacyDiscovered = true;
    }
    // If FusionMaps legacy was not discovered, we give it another shot after
    // the page has loaded.
    if (!(hasLoaded.test(doc.readyState) || doc.loaded)) {
        (function () {

            var _timer;

            function init() {
                // quit if this function has already been called
                if (arguments.callee.done) return;

                // flag this function so we don't do the same thing twice
                arguments.callee.done = true;

                // kill the timer
                if (_timer) clearTimeout(_timer);

                if (!mapLegacyDiscovered) {
                    if (win.FusionMaps && win.FusionMaps.legacy) {
                        global.core(['private', 'modules.core.geo',
                            win.FusionMaps.legacy, win.FusionMaps.version]);
                    }
                    win.FusionMaps = global.core;
                }

                // Notify that library is ready for consumption.
                setTimeout(notifyLibraryInit, 1);
            };

            function checkInit () {
                if (hasLoaded.test(doc.readyState)) {
                    init(); // call the onload handler
                }
                else {
                    _timer = setTimeout(checkInit, 10);
                }
            }

            if (doc.addEventListener) {
                doc.addEventListener("DOMContentLoaded", init, false);
            }
            else if (doc.attachEvent) {
                win.attachEvent("onLoad", init);
            }

            if (isIE) {
              try {
                  if (win.location.protocol === 'https:') {
                      doc.write('<script id="__ie_onload_fusioncharts" defer="defer" src="//:"><\/script>');
                  }
                  else {
                      doc.write('<script id="__ie_onload_fusioncharts" defer="defer" src="javascript:void(0)"><\/script>');
                  }
                  var script = doc.getElementById("__ie_onload_fusioncharts");
                  script.onreadystatechange = function() {
                        if (this.readyState == "complete") {
                            init(); // call the onload handler
                        }
                  };
              } catch (e) {}
            }

            if (/WebKit/i.test(nav.userAgent)) { // sniff
                _timer = setTimeout(checkInit, 10);
            }

            win.onload = function (callback) {
                return function () {
                    init();
                    callback && callback.call && callback.call(win);
                };
            }(win.onload);
        }());
    }
    else {
        // already marking it ready means that notifier will let know that page
        // has already been loaded.
        global.ready = true;
        setTimeout(notifyLibraryInit, 1);
    }

    // In any case, we expose the latest core. If legacy overrides it on page
    // load, that would be handled
    win.FusionMaps = global.core;
}());



/*jslint white: true, browser: true, windows: true, forin: true,  undef: true,
  eqeqeq: true, plusplus: true, bitwise: true, regexp: true, immed: true */

/*global Array: false, FusionCharts, window: false */

/*members "*", BeforeDispose, BeforeInitialize, DataLoadCancelled, BeforeDataUpdate,
    DataLoadError, DataLoadRequestCancelled, DataLoadRequestCompleted, DataUpdateCancelled,
    DataLoadRequested, DataLoaded, DataXMLInvalid, Disposed, DrawComplete,
    FusionChartsEvents, Initialized, InvalidDataError, Loaded, DataUpdated
    NoDataToDisplay, Rendered, Resized, addEventListener, addListener, call,
    cancel, core, eventId, eventType, extend, items, lastEventId, length,
    listeners, push, raiseError, raiseEvent, removeEventListener,
    removeListener, sender, splice, stopPropagation, toLowerCase,
    triggerEvent
*/

/**
 * -----------------------------------------------------------------------------
 * Event Handler Framework
 * This module allows FusionCharts to work with W3C Level 2 style events for
 * allowing multiple handlers per event and also to do event driven development
 * on a global or per-chart basis.
 * -----------------------------------------------------------------------------
 */
(function () {

    // Try register the module with FusionCharts.
    var global = FusionCharts(['private', 'EventManager']);
    // Check whether the module has been already registered. If true, then
    // do not bother to re-register.
    if (global === undefined) {
        return;
    }

    // Collection of FusionCharts events
    window.FusionChartsEvents = {
        BeforeInitialize: 'beforeinitialize',
        Initialized: 'initialized',
        Loaded: 'loaded',
        BeforeRender: 'beforerender',
        Rendered: 'rendered',
        DataLoadRequested: 'dataloadrequested',
        DataLoadRequestCancelled: 'dataloadrequestcancelled',
        DataLoadRequestCompleted: 'dataloadrequestcompleted',
        BeforeDataUpdate: 'beforedataupdate',
        DataUpdateCancelled: 'dataupdatecancelled',
        DataUpdated: 'dataupdated',
        DataLoadCancelled: 'dataloadcancelled',
        DataLoaded: 'dataloaded',
        DataLoadError: 'dataloaderror',
        NoDataToDisplay: 'nodatatodisplay',
        DataXMLInvalid: 'dataxmlinvalid',
        InvalidDataError: 'invaliddataerror',
        DrawComplete: 'drawcomplete',
        Resized: 'resized',
        BeforeDispose: 'beforedispose',
        Disposed: 'disposed',
        Exported: 'exported'
    };

    // A function to create an abstraction layer so that the try-catch /
    // error suppression of flash can be avoided while raising events.
    var managedFnCall = function (item, scope, event, args) {
        // We change the scope of the function with respect to the
        // object that raised the event.
        try {
            item[0].call(scope, event, args || {});
        }
        catch (e) {
            // Call error in a separate thread to avoid stopping
            // of chart load.
            setTimeout(function () {
                throw e;
            }, 0);
        }
    };

    // Function that executes all functions that are to be invoked upon trigger
    // of an event.
    var slotLoader = function (slot, event, args) {
        // If slot does not have a queue, we assume that the listener
        // was never added and halt method.
        if (!(slot instanceof Array)) {
            // Statutory W3C NOT preventDefault flag
            return;
        }

        // Initialize variables.
        var i = 0, scope;

        // Iterate through the slot and look for match with respect to
        // type and binding.
        for (; i < slot.length; i += 1) {

            // If there is a match found w.r.t. type and bind, we fire it.
            if (slot[i][1] === event.sender || slot[i][1] === undefined) {

                // Determine the sender of the event for global events.
                // The choice of scope differes depending on whether a
                // global or a local event is being raised.
                scope = slot[i][1] === event.sender ?
                    event.sender : global.core;

                managedFnCall(slot[i], scope, event, args);

                // Check if the user wanted to detach the event
                if (event.detached === true) {
                    slot.splice(i, 1);
                    i -= 1;
                    event.detached = false;
                }
            }

            // Check whether propagation flag is set to false and discontnue
            // iteration if needed.
            if (event.cancelled === true) {
                break;
            }
        }
    };

    var EventTarget = {

        unpropagator: function () {
            return (this.cancelled = true) === false;
        },
        detacher: function () {
            return (this.detached = true) === false;
        },
        undefaulter: function () {
            return (this.prevented = true) === false;
        },

        // Entire collection of listeners.
        listeners: {},

        // The last raised event id. Allows to calculate the next event id.
        lastEventId: 0,

        addListener: function (type, listener, bind) {

            // In case type is sent as array, we recurse this function.
            if (type instanceof Array) {
                // We look into each item of the 'type' parameter and send it,
                // along with other parameters to a recursed addListener
                // method.
                for (var i = 0; i < type.length; i += 1) {
                    EventTarget.addListener(type[i], listener, bind);
                }
                return;
            }

            // Validate the type parameter. Listener cannot be added without
            // valid type.
            if (typeof type !== 'string') {
                global.raiseError(bind || global.core, '03091549', 'param',
                    '::EventTarget.addListener', new Error('Unspecified Event Type'));
                return;
            }

            // Listener must be a function. It will not eval a string.
            if (typeof listener !== 'function') {
                global.raiseError(bind || global.core, '03091550', 'param',
                    '::EventTarget.addListener', new Error('Invalid Event Listener'));
                return;
            }

            // Desensitize the type case for user accessability.
            type = type.toLowerCase();

            // If the insertion position does not have a queue, then create one.
            if (!(EventTarget.listeners[type] instanceof Array)) {
                EventTarget.listeners[type] = [];
            }

            // Add the listener to the queue.
            EventTarget.listeners[type].push([listener, bind]);

        },

        removeListener: function (type, listener, bind) {

            var slot,
                i;

            // Listener must be a function. Else we have nothing to remove!
            if (typeof listener !== 'function') {
                global.raiseError(bind || global.core, '03091560', 'param', '::EventTarget.removeListener',
                    new Error('Invalid Event Listener'));
                return;
            }

            // In case type is sent as array, we recurse this function.
            if (type instanceof Array) {
                // We look into each item of the 'type' parameter and send it,
                // along with other parameters to a recursed addListener
                // method.
                for (i = 0; i < type.length; i += 1) {
                    EventTarget.removeListener(type[i], listener, bind);
                }
                return;
            }

            // Validate the type parameter. Listener cannot be removed without
            // valid type.
            if (typeof type !== 'string') {
                global.raiseError(bind || global.core, '03091559', 'param', '::EventTarget.removeListener',
                    new Error('Unspecified Event Type'));
                return;
            }

            // Desensitize the type case for user accessability.
            type = type.toLowerCase();

            // Create a reference to the slot for easy lookup in this method.
            slot = EventTarget.listeners[type];

            // If slot does not have a queue, we assume that the listener
            // was never added and halt method.
            if (!(slot instanceof Array)) {
                return;
            }

            // Iterate through the slot and remove every instance of the
            // event handler.
            for (i = 0; i < slot.length; i += 1) {
                // Remove all instances of the listener found in the queue.
                if (slot[i][0] === listener && slot[i][1] === bind) {
                    slot.splice(i, 1);
                    i -= 1;
                }
            }
        },

        // opts can have { async:true, omni:true }
        triggerEvent: function (type, sender, args, source, defaultFn) {

            // In case, event type is missing, dispatch cannot proceed.
            if (typeof type !== 'string') {
                global.raiseError(sender, '03091602', 'param', '::EventTarget.dispatchEvent',
                    new Error('Invalid Event Type'));
                return undefined;
            }

            // Desensitize the type case for user accessability.
            type = type.toLowerCase();

            // Model the event as per W3C standards. Add the function to cancel
            // event propagation by user handlers. Also append an incremental
            // event id.
            var event = {
                eventType: type,
                eventId: (EventTarget.lastEventId += 1),
                sender: sender || new Error('Orphan Event'),
                cancel: false,
                stopPropagation: this.unpropagator,
                prevented: false,
                preventDefault: this.undefaulter,
                detached: false,
                detachHandler: this.detacher
            };

            // Add underlyingEvent object
            if (source) {
                event.originalEvent = source;
            }

            // Execute the functions present within the event slot (collection
            // of functions for a particular event).
            slotLoader(EventTarget.listeners[type], event, args);

            // Facilitate the call of a global event listener.
            slotLoader(EventTarget.listeners['*'], event, args);

            // Execute default action
            if (defaultFn && event.prevented === false) {
                managedFnCall(defaultFn, event.sender, event, args);
            }

            // Statutory W3C NOT preventDefault flag
            return true;
        }
    };

    // Facilitate for raising events internally.
    global.raiseEvent = function (type, args, obj, sourceEvent, defaultFn) {
        return EventTarget.triggerEvent(type, obj, args, sourceEvent, defaultFn);
    };

    // Extend the eventlisteners to internal global.
    global.addEventListener = function (type, listener) {
        return EventTarget.addListener(type, listener);
    };
    global.removeEventListener = function (type, listener) {
        return EventTarget.removeListener(type, listener);
    };

    // Add eventListener extensibility to FusionCharts object
    global.extend(global.core, {
        addEventListener: global.addEventListener,
        removeEventListener: global.removeEventListener
    }, false);

    // Add eventListener extensibility to FusionCharts prototype so that
    // individual FusionCharts objects can use per-chart events
    global.extend(global.core, {
        addEventListener: function (type, listener) {
            return EventTarget.addListener(type, listener, this);
        },
        removeEventListener: function (type, listener) {
            return EventTarget.removeListener(type, listener, this);
        }
    }, true);

    // Cleanup on dispose
    global.addEventListener('BeforeDispose', function (e) {
        var type, i;
        // Iterate through all events in the collection of listeners
        for (type in EventTarget.listeners) {
            for (i = 0; i < EventTarget.listeners[type].length; i += 1) {
                // When a match is found, delete the listener from the
                // collection.
                if (EventTarget.listeners[type][i][1] === e.sender) {
                    EventTarget.listeners[type].splice(i, 1);
                }
            }
        }
    });

    // Raise library initialization event, if not already done.
    if (global.ready && !global.readyNotified) {
        global.readyNotified = true;
        global.raiseEvent('ready', {
            version: global.core.version,
            now: global.readyNow
        }, global.core);
    }

}());



/*jslint white: true, browser: true, windows: true, forin: true,  undef: true,
  eqeqeq: true, plusplus: true, bitwise: true, regexp: true, immed: true */

/*global Array: false, FusionCharts, window: false, console: false */

/*members _enableFirebugLite, appendChild, comp, console, core,
    createElement, currentOutputHelper, debugMode, enabled, event, eventId,
    eventType, extend, firebug, getElementsByTagName, id, impl, length,
    level, log, message, module, name, nature, onload, onreadystatechange,
    options, outputFailed, outputFormat, outputHandler, outputHelpers,
    outputTo, param, raiseError, raiseEvent, raiseWarning, range,
    readyState, run, scriptBaseUri, sender, setTimeout, source, src, text,
    toLowerCase, toString, type, undefined, verbose
*/

/**
 * -----------------------------------------------------------------------------
 * FusionCharts JavaScript Library
 * Error Handler Framework
 *
 * This module allows other FusionCharts JavaScript Library modules to raise
 * error and warning messages.
 * -----------------------------------------------------------------------------
 */
(function () {

    // Try register the module with FusionCharts.
    var global = FusionCharts(['private', 'ErrorHandler']);
    // Check whether the module has been already registered. If true, then
    // do not bother to re-register.
    if (global === undefined) {
        return;
    }

    // Set the default options for the default output helper.
    var DEFAULT_OUTPUT_HELPER = 'text';

    /**
     * @var {object} errorNature is an enumeration containing possible error
     * types. This is used so that shorthand reference to .raiseError and
     * .raiseWarning can be expanded for easier user reference.
     */
    var errorNatures = {
        type: 'TypeException',
        range: 'ValueRangeException',
        impl: 'NotImplementedException',
        param: 'ParameterException',
        run: 'RuntimeException',
        comp: 'DesignTimeError',
        'undefined': 'UnspecifiedException'
    };


    /**
     * This function raises the error event after appropriately formatting the
     * parameters.
     * @param {FusionCharts} sender
     * @param {string} id Is the error reference id.
     * @param {string} nature Is a cue as to what category of error is this.
     *         The value of this param must be same as one of the "keys" within
     *         the "errorNatures" collection.
     * @param {string} source Is a cue as to which object/module caused this
     *         error.
     * @param {Error} err
     * @param {string} level Indicates whether this error event is an error
     *         or warning event. Its values can be "Error" or "Warning".
     *
     * @type void
     */
    var raiseEWEvent = function (sender, id, nature, source, err, level) {

        // We create a human-readable message for this error.
        var message = '#' + id + ' ' + (sender ? sender.id : 'unknown-source') +
            source + ' ' + level + ' >> ';

        // If err is sent as error object, we input more details to the error
        // object
        if (err instanceof Error) {
            err.name = errorNatures[nature];
            err.module = 'FusionCharts' + source;
            err.level = level;

            // Update the error message.
            err.message = message + err.message;
            message = err.message;

            // Throw error in a separate scope so that the execution of this script
            // is not blocked. Do this only when debugMode is enabled
            window.setTimeout(function () {
                throw err;
            }, 0);

        }
        else {
            // Append the message string to the error message and sync with err.
            message = message + err;
        }

        // Prepare the event argument object.
        var args = {
            id: id,
            nature: errorNatures[nature],
            source: 'FusionCharts' + source,
            message: message
        };
        // Raise the appropriate event.
        global.raiseEvent(level, args, sender);

        // Raise legacy events
        if (typeof window['FC_' + level] === 'function') {
            window['FC_' + level](args);
        }

    };

    /**
     * This function raises an "Error" event based upon the parameters passed
     * to it.
     * @param {FusionCharts} sender
     * @param {string} id Is the error reference id.
     * @param {string} nature Is a cue as to what category of error is this.
     *         The value of this param must be same as one of the "keys" within
     *         the "errorNatures" collection.
     * @param {string} source Is a cue as to which object/module caused this
     *         error.
     * @param {string} message
     *
     * @type void
     */
    global.raiseError = function (sender, id, nature, source, message) {
        raiseEWEvent(sender, id, nature, source, message, 'Error');
    };

    /**
     * This function raises an "Warning" event based upon the parameters passed
     * to it.
     * @param {FusionCharts} sender
     * @param {string} id Is the error reference id.
     * @param {string} nature Is a cue as to what category of error is this.
     *         The value of this param must be same as one of the "keys" within
     *         the "errorNatures" collection.
     * @param {string} source Is a cue as to which object/module caused this
     *         error.
     * @param {string} message
     *
     * @type void
     */
    global.raiseWarning = function (sender, id, nature, source, message) {
        raiseEWEvent(sender, id, nature, source, message, 'Warning');
    };

    /**
     * @var {object} logger Conatins all routines pertaining to logging a debug
     * outout.
     */
    var logger = {
        /**
         * @var {object} outputHelpers Is the collection of functions that calls
         * the outputTo function with arguments formatted in a specific manner.
         */
        outputHelpers: {
            // Simple text output function.
            'text': function (e, a) {
                var sender = (e.sender.id || e.sender).toString();
                logger.outputTo('#' + e.eventId + ' [' + sender + '] fired "' +
                    e.eventType + '" event. ' + (e.eventType === 'error' ||
                    e.eventType === 'warning' ? a.message : ''));
            },
            // Function that calls the debugger method in typical FusionCharts
            // events argument format.
            'event': function (e, a) {
                this.outputTo(e, a);
            },
            // This function formats outputs with all details, and still,
            // maintaining human readable format. It is best used in conjunction
            // with an advanced JS console.
            'verbose': function (e, a) {
                logger.outputTo(e.eventId, e.sender.id, e.eventType, a);
            }
        },

        /**
         * @var {object} outputHandler Is the eventHandler that indirectly calls
         * the output function via output helpers whenever any event is raised.
         */
        outputHandler: function (e, a) {
            // Verify whether the output function exists or not.
            if (typeof logger.outputTo !== 'function') {
                global.core.debugMode.outputFailed = true;
                return;
            }
            // Clear flag of data load fail upon reaching this line.
            global.core.debugMode.outputFailed = false;
            // Call the current outputHelper in order to invoke the
            // required function.
            logger.currentOutputHelper(e, a);
        },

        /**
         * @var {function} currentOutputHelper Is the function that formats the
         * debug output if event format to different formats as arguments.
         * @var {function} outputTo Is the reference to the function that is
         * called when a debug event is raised.
         * @var {boolean} keeps a track whether the logger is enabled or not.
         */
        currentOutputHelper: undefined,

        outputTo: undefined,

        enabled: false
    };

    // Set the initial default output helper to the one specified as default.
    logger.currentOutputHelper = logger.outputHelpers[DEFAULT_OUTPUT_HELPER];

    // Add debugMode API to FusionCharts core object, so that it can be accessed
    // by users globally.
    global.extend(global.core, {
        debugMode: {

            syncStateWithCharts: true,

            /**
             * Specifies how to format the output to the function that will
             * accept output from the debugger.
             * @id FusionCharts.debugMode.outputFormat
             *
             * @param {string} format Can be one of the accepted format names
             * such as "text", "verbose", "event".
             *
             * @type boolean
             */
            outputFormat: function (format) {
                // Validate the parameter.
                if (format && typeof format.toLowerCase === 'function' &&
                    typeof logger.outputHelpers[format = format.toLowerCase()] === 'function') {
                    // set the current output helper function to the one specified
                    // in parameter
                    logger.currentOutputHelper = logger.outputHelpers[format];
                    // Return "true" to users, indicating, output format
                    // successfully updated.
                    return true;
                }
                // In case validation fails, notify user that it failed by
                // returning false;
                return false;
            },

            /**
             * Allows you to specify the function to which the debugger output
             * will be redirected.
             * @id FusionCharts.debugMode.outputTo
             *
             * @param {function} fn is the function to which the debugMode output
             * will be passed on.
             *
             * @type void
             */
            outputTo: function (fn) {
                // Check whether the logger is a function or not. If it is a
                // function, we set a reference to it to be used later as the
                // logger function.
                if (typeof fn === 'function') {
                    logger.outputTo = fn;
                }

                // In case user sends 'null' as the value of the logger function,
                // we can assume that user wants not to log any output.
                else if (fn === null) {
                    global.core.debugMode.enabled(false);
                    delete logger.outputTo;
                }
            },

            /**
             * Enables, disables and configures the debugMode.
             * @FusionCHarts.edbugMode.enabled
             *
             * @param {boolean} state specifies whether to enable logging of
             * debug information.
             * @param {function} outputTo is the function to which the debugMode
             * output will be passed on.
             * @param {string} outputFormat Can be one of the accepted format names
             * such as "text", "verbose", "event".
             *
             * @return The current 'enable' state of the debugMode.
             * @type boolean
             */
            enabled: function (state, outputTo, outputFormat) {

                // Allow object to be sent as configuration parameter.
                var config;
                // In case the first parameter is object and the only parameter,
                // we copy its contents to various linear parameters and save
                // a copy of the object for later use.
                if (typeof state === 'object' && arguments.length === 1) {
                    config = state;
                    state = config.state;
                    outputTo = config.outputTo;
                    outputFormat = config.outputFormat;
                }

                // In case user send in only one parameter and that too a
                // function, we can assume that he wants to use it as a logger
                // function and also enable logging.
                if (typeof state === 'function') {
                    if (typeof outputTo === 'string' && (arguments.length === 2 || config)) {
                        outputFormat = outputTo;
                    }
                    outputTo = state;
                    state = true;
                }

                // In case user sends in a valid parameter to change the current
                // state of the debugger, we update the debugger state.
                if (typeof state === 'boolean' && state !== logger.enabled) {
                    global.core[(logger.enabled = state) ? 'addEventListener'
                        : 'removeEventListener']('*', logger.outputHandler);
                }

                // If user sends in a parameter for the logger parameter, we
                // set it to the logger function reference.
                if (typeof outputTo === 'function') {
                    logger.outputTo = outputTo;
                }

                // Set output format if needed.
                global.core.debugMode.outputFormat(outputFormat);

                // Finally send the current debugger state to the user.
                return logger.enabled;
            },

            /**
             * This method fetches FirebugLite component's code and adds it to
             * current page. Subsequently, on load of the script it enables
             * advanced console logging to it.
             * @id FusionCharts.debugMode._enableFirebugLite
             *
             *
             * @type void
             * @private true
             */
            _enableFirebugLite: function () {
                // Check whether firebug already exists.
                if (window.console && window.console.firebug) {
                    // If firebug already exists, we do not need to include any
                    // script for firebu-lite and we simply enable logging to
                    //console.
                    global.core.debugMode.enabled(console.log, 'verbose');
                    return;
                }

                // Install firebug-lite within page by creating new 'script'
                // element and appending to page head.
                global.loadScript('firebug-lite.js', function () {
                    global.core.debugMode.enabled(console.log, 'verbose');
                }, '{ startOpened: true }');

            }
        }
    }, false);


}());



/*jslint white: true, browser: true, windows: true, forin: true,  undef: true,
  eqeqeq: true, plusplus: true, bitwise: true, regexp: true, immed: true */

/*global window: false, Array, FusionCharts, Error: false */


FusionCharts(['private', 'modules.mantle.ajax', function () {


    var global = this,
    // define constants for future use.
    FUNCTION = 'function',
    MSXMLHTTP = 'Microsoft.XMLHTTP',
    MSXMLHTTP2 = 'Msxml2.XMLHTTP',
    GET = 'GET',
    POST = 'POST',
    XHREQERROR = 'XmlHttprequest Error',
    RUN = 'run',
    ERRNO = '1110111515A',
    win = window, // keep a local reference of window scope

    // Probe IE version
    version = parseFloat(navigator.appVersion.split("MSIE")[1]),
    ielt8 = (version >= 5.5 && version <= 7) ? true : false,
    //
    // Calculate flags.
    // Check whether the page is on file protocol.
    fileProtocol = win.location.protocol === 'file:',
    axObject = win.ActiveXObject,

    // Check if native xhr is present
    xhrNative = (!axObject || !fileProtocol) && win.XMLHttpRequest,

    // stats
    counters = {
        objects: 0,
        xhr: 0,
        requests: 0,
        success: 0,
        failure: 0,
        idle: 0
    },

    // Prepare function to retrieve compatible xmlhttprequest.
    newXmlHttpRequest = function() {
        var xmlhttp;

        // if xmlhttprequest is present as native, use it.
        if (xhrNative) {
            newXmlHttpRequest = function () {
                counters.xhr++;
                return new xhrNative();
            };
            return newXmlHttpRequest();
        }

        // Use activeX for IE
        try {
            xmlhttp = new axObject(MSXMLHTTP2);
            newXmlHttpRequest = function () {
                counters.xhr++;
                return new axObject(MSXMLHTTP2);
            };
        }
        catch (e) {
            try {
                xmlhttp = new axObject(MSXMLHTTP);
                newXmlHttpRequest = function () {
                    counters.xhr++;
                    return new axObject(MSXMLHTTP);
                };
            }
            catch (e) {
                xmlhttp = false;
            }
        }
        return xmlhttp;
    },

    // Ajax class.
    Ajax = global.ajax = function (success, error) {
        this.onSuccess = success;
        this.onError = error;
        this.open = false;
        counters.objects++;
        counters.idle++;
    };

    Ajax.stats = function (type) {
        return type ? counters[type] : global.extend({}, counters);
    };

    Ajax.prototype.headers = {
        'If-Modified-Since': 'Sat, 29 Oct 1994 19:43:31 GMT',
        'X-Requested-With': 'XMLHttpRequest',
        'X-Requested-By': 'FusionCharts',
        'Accept': 'text/plain, */*',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    };

    Ajax.prototype.transact = function (method, url, data, callbackArgs) {
        var wrapper = this,
            xmlhttp = wrapper.xmlhttp,
            headers = wrapper.headers,
            errorCallback = wrapper.onError,
            successCallback = wrapper.onSuccess,
            isPost = (method === POST),
            postData,
            i;

        if (!xmlhttp || ielt8) {
            xmlhttp = newXmlHttpRequest();
            wrapper.xmlhttp = xmlhttp;
        }

        xmlhttp.onreadystatechange = function () {
            try {
                if (xmlhttp.readyState === 4) {
                    if ((!xmlhttp.status && fileProtocol) || (xmlhttp.status >= 200 &&
                            xmlhttp.status < 300) || xmlhttp.status === 304 ||
                            xmlhttp.status === 1223 || xmlhttp.status === 0) {
                        successCallback &&
                            successCallback(xmlhttp.responseText, wrapper,
                            callbackArgs, url);
                        counters.success++;
                    }
                    else if (errorCallback) {
                        errorCallback(Error(XHREQERROR), wrapper, callbackArgs, url);
                        counters.failure++;
                    }
                    counters.idle--;
                    wrapper.open = false;
                }
            }
            catch (error) {
                if (errorCallback) {
                    errorCallback(error, wrapper, callbackArgs, url);
                }
                if (window.FC_DEV_ENVIRONMENT) {
                    setTimeout(function () {
                        throw error;
                    }, 0);
                }
                counters.failure++;
            }
        };

        try {
            if (xmlhttp.overrideMimeType) {
                xmlhttp.overrideMimeType('text/plain');
            }
            if (isPost) {
                xmlhttp.open(POST, url, true);
                if (typeof data === 'string') {
                    postData = data;
                }
                else {
                    postData = [];
                    for (i in data) {
                        postData.push(i + '=' + (data[i]+"")
                                .replace(/\=/g, '%3D').replace(/\&/g, '%26'));
                    }
                    postData = postData.join('&');
                }
            }
            else {
                xmlhttp.open(GET, url, true);
                postData = null;
            }
            for (i in headers) {
                xmlhttp.setRequestHeader(i, headers[i]);
            }

            xmlhttp.send(postData);
            counters.requests++;
            counters.idle++;
            wrapper.open = true;
        }
        catch (e) {
            global.raiseError(global.core, ERRNO, RUN, XHREQERROR,
                e.message);
        }

        return xmlhttp;
    };

    Ajax.prototype.get = function (url, callbackArgs) {
        return this.transact(GET, url, undefined, callbackArgs);
    };

    Ajax.prototype.post = function (url, data, callbackArgs) {
        return this.transact(POST, url, data, callbackArgs);
    };

    Ajax.prototype.abort = function () {
        var instance = this,
            xmlhttp = instance.xmlhttp;

        instance.open = false;
        return xmlhttp && typeof xmlhttp.abort === FUNCTION && xmlhttp.readyState &&
                xmlhttp.readyState !== 0 && xmlhttp.abort();
    };

    Ajax.prototype.dispose = function () {
        var instance = this;
        instance.open && instance.abort();

        delete instance.onError;
        delete instance.onSuccess;
        delete instance.xmlhttp;
        delete instance.open;

        counters.objects--;
        return (instance = null);
    };

}]);


/*jslint white: true, browser: true, windows: true, forin: true,  undef: true,
    eqeqeq: true, plusplus: true, bitwise: true, immed: true */

/*global window: false, Array: false, FusionCharts: false,
    FusionChartsEvents: false, FusionChartsDataFormats: false*/


/**
 * Generic Runtime Module
 */
(function () {

    // Register the module with FusionCharts.
    var global = FusionCharts(['private', 'modules.mantle.runtime;1.1']);
    // Check whether the module has been already registered. If true, then
    // do not bother to re-register.
    if (global === undefined) {
        return;
    }

    // Set the FusionCharts filename possibilities as regular expression.
    var SCRIPT_NAME_REGEX = /(^|[\/\\])(fusioncharts\.js|fusioncharts\.debug\.js|fusioncharts\.core\.js|fusioncharts\.min\.js)([\?#].*)?$/ig,
        BLOCK_EXTERNAL_SCRIPT_LOADING = false,
        DISALLOW_CROSSDOMAIN_RESOURCE = false,
        SCRIPT_LOAD_TIMEOUTMS = 15000;

    /**
     * Function to determine the script base uri for a script name
     */
    global.getScriptBaseUri = function (scriptNameRegex) {
        // Get a collection of all script nodes.
        var scripts = document.getElementsByTagName('script'),
        l = scripts.length,
        src,
        i;

        // Iterate through the script node collection and match whether its
        // 'src' attribute contains fusioncharts file name.
        for (i = 0; i < l; i += 1) {
            src = scripts[i].getAttribute('src');
            if (!(src === undefined || src === null ||
                src.match(scriptNameRegex) === null)) {
                return src.replace(scriptNameRegex, '$1');
            }
        }
        return undefined;
    };

    // Get the script base uri. (Regexp has been updated)
    global.core.options.scriptBaseUri = (function () {
        var baseUri = global.getScriptBaseUri(SCRIPT_NAME_REGEX);

        if (baseUri === undefined) {
            global.raiseError(FusionCharts, '1603111624', 'run',
                '>GenericRuntime~scriptBaseUri',
                'Unable to locate FusionCharts script source location (URL).');
            return '';
        }
        return baseUri;
    }());

    /**
     * Regular Expressions that helps to check XSS security loops.
     */
    var checkBadChars = /[\\\"<>;&]/,
        hasProtocolDef = /^[^\S]*?(sf|f|ht)(tp|tps):\/\//i,
        LOAD_EVENTNAME = FusionChartsEvents.ExternalResourceLoad = 'externalresourceload',

        /**
         * To keep a track of scripts requested.
         * @type Object
         */
        scriptsRequested = {},

        /**
         * To keep a track of loaded script tags
         */
        scriptTags = {},

        /**
         * To keep a track of scripts loaded.
         * @type Object
         */
        scriptsLoaded = {},

        /**
         * Keep a track of load failure check
         * @type object
         */
        scriptLoadFailureTimeout = {};

    /**
     * Function that allows users to verify whether a string contains any XSS
     * unsafe code. This is used while setting various urls.
     * @param {string} str The string that has to be checked for XSS
     * @param {boolean} proto Specify whether to test any protocol definition
     */
    global.isXSSSafe = function (str, proto) {
        if (proto && hasProtocolDef.exec(str) !== null) {
            return false;
        }
        return (checkBadChars.exec(str) === null);
    };

    /**
     * Loads a JS using head script attach method
     */
    global.loadScript = function (file, callback, scriptText, includeOnce, pathInFile) {

        // If file is not specified, we exit
        if (!file) {
            return false;
        }

        // Check security block.
        if (BLOCK_EXTERNAL_SCRIPT_LOADING === true) {
            global.raiseWarning(global.core, '04031935', 'run', '>genericRuntime~loadScript',
                'External Script loading has been blocked');
            return false;
        }

        var script,
            success = callback && callback.success || callback,
            failure = callback && callback.failure,
            path,
            src,
            eventArgs = {
                type: 'script',
                success: false
            },
            notify = function () {
                // clear stalled 404 check
                scriptLoadFailureTimeout[src] =
                        clearTimeout(scriptLoadFailureTimeout[src]);

                // execute callbacks
                eventArgs.success ? (success && success(file, src)) :
                        (failure && failure(file, src));
                global.raiseEvent(LOAD_EVENTNAME, eventArgs, global.core);
            };

        // Prepare path.
        if (pathInFile) {
            path = '';
        }
        else {
            path = global.core.options.scriptBaseUri;
        }

        // Prepare the full src
        src = path + file;

        // we do not allow XSS unsafe string
        if (!global.isXSSSafe(src, DISALLOW_CROSSDOMAIN_RESOURCE)) {
            src = typeof window.encodeURIComponent === 'function' ?
            window.encodeURIComponent(src) : window.escape(src);
        }

        // Update event arguments
        eventArgs.path = path;
        eventArgs.src = src;
        eventArgs.file = file;

        // Do not reload the script once loaded.
        if (scriptsLoaded[src] === true && includeOnce) {
            eventArgs.success = true;
            eventArgs.notReloaded = true;
            if (typeof callback === 'function') {
                callback();
                global.raiseEvent(LOAD_EVENTNAME, eventArgs, global.core);
            }
            return true;
        }

        // Check whether this script has been already loaded once and whether
        // multiple inclusion is prevented.
        if (scriptsRequested[src] && includeOnce) {
            return false;
        }
        // Add the src to the lists of scripts loaded.
        scriptsRequested[src] = true;

        // If a script tag with same src exists, then we need to delete the
        // previous one
        if (scriptTags[src] && scriptTags[src].parentNode) {
            scriptTags[src].parentNode.removeChild(scriptTags[src]);
        }

        // Create the script element with its attributes.
        script = scriptTags[src] = document.createElement('script')
        // Set the script type to javaScript
        script.type = 'text/javascript';
        // Set the prepared src as the script's src.
        script.src = src;
        // Set script inner text to what user passed as parameter.
        if (scriptText) {
            script[('\v' === 'v' ? 'text' : 'innerHTML')] = scriptText;
        }

        // Execute callback function when the script was loaded.
        if (typeof success === 'function') {
            scriptsLoaded[src] = false;
            scriptLoadFailureTimeout[src] =
                    clearTimeout(scriptLoadFailureTimeout[src]);

            script.onload = function () {
                scriptsLoaded[src] = true;
                eventArgs.success = true;

                notify();
            };

            script.onerror = function () {
                scriptsLoaded[src] = false;
                scriptsRequested[src] = false; // in case of error cancel request
                notify();
            };

            script.onreadystatechange = function () {
                if (this.readyState === 'complete' || this.readyState === 'loaded') {
                    scriptsLoaded[src] = true;
                    eventArgs.success = true;

                    notify();
                }
            };
        }

        // Append the script to the head of this page.
        document.getElementsByTagName('head')[0].appendChild(script);

        // Prepare the timeout check for script load failure
        if (typeof failure === 'function') {
            scriptLoadFailureTimeout[src]= setTimeout(function () {
                if (scriptsLoaded[src]) {
                    return;
                }
                notify();
            }, global.core.options.html5ResourceLoadTimeout || SCRIPT_LOAD_TIMEOUTMS);
        }

        return true;
    };

    /**
     * Capitalizes first letter of a word
     */
    global.capitalizeString = function (str, all) {
        return str ? str.replace(all ? (/(^|\s)([a-z])/g) : (/(^|\s)([a-z])/), function(m,p1,p2){
            return p1 + p2.toUpperCase();
        }) : str;
    };

    /**
     * Function that safely deletes all items in a DOM element.
     */
    var purgeDOM = global.purgeDOM = function (d) {
        var a = d.attributes, i, l, n;
        if (a) {
            for (i = a.length - 1; i >= 0; i -= 1) {
                n = a[i].name;
                if (typeof d[n] === 'function') {
                    d[n] = null;
                }
            }
        }
        a = d.childNodes;
        if (a) {
            l = a.length;
            for (i = 0; i < l; i += 1) {
                purgeDOM(d.childNodes[i]);
            }
        }
    },

    // Deconstruct policies.
    // Update the arguments with latest copy of all variables by
    // reverse engineering the policies.
    deconstructPolicySet = function (policies, options, obj) {
        var policy;

        for (policy in policies) {
            var prop;

            // Set just the policy object in case of single-level policy.
            if (policies[policy] instanceof Array) {
                options[policies[policy][0]] = obj[policy];
            } else {
                // Copy the source of multi-level policies
                for (prop in policies[policy]) {
                    options[policies[policy][prop][0]] = obj[policy][prop];
                }
            }
        }
    },
    lengthCleanupRegex = /[^\%\d]*$/ig,
    signatureMatchRegex = /^(FusionCharts|FusionWidgets|FusionMaps)/;

    global.extend(global.core, {
        // Add default object management prototype method to raise deletion
        // event.
        dispose: function () {
            // The event must be async in order to prevent integrity.
            global.raiseEvent('BeforeDispose', {}, this);

            // Call dispose on the renderer. Renderer should dispose between
            // the beforeDispose and disposed event.
            global.renderer.dispose(this);

            // Delete the reference of the item
            delete global.core.items[this.id];
            // Raise a post-disposal event
            global.raiseEvent('Disposed', {}, this);

            // Remove all variables within this object, making this variable not
            // usable.
            for (var prop in this) {
                delete this[prop];
            }
        },

        clone: function (params, cloneParametersOnly) {

            // Create a copy of arguments of this object.
            var typeofParams = (typeof params),
                crcObjects = {},
                options = global.extend({}, this.args, false, false);

            // Recreate construction parameters by reverse calculating the global
            // policies.
            deconstructPolicySet(global.policies, options, this);
            // Also deconstruct the rendere specific policies.
            deconstructPolicySet(global.renderer.getRendererPolicy(this.options.renderer),
                options, this);

            // Remove any specific parameters that if cloned will create issues.
            delete options.id;
            delete options.animate;
            delete options.stallLoad;
            crcObjects.link = options.link; // link was removed as it prevents deep cloning

            // Now, deep clone the entire object to separate both instances
            options = global.extend({}, options, false, false);

            // restore crc Objects
            options.link = crcObjects.link;

            switch (typeofParams) {
                // Override any of the options by parameters sent by user
                case 'object':
                    global.extend(options, params);
                    break;

                // In case user sends only one boolean param marking not to
                // create new chart.
                case 'boolean':
                    cloneParametersOnly = params;
                    break;
            }

            // Create new FusionCharts object from the computed options
            return cloneParametersOnly ? options: new global.core(options);

        },

        isActive: function () {
            if (!this.ref || document.getElementById(this.id) !==
                this.ref || typeof this.ref.signature !== 'function') {
                return false;
            }

            try {
                return signatureMatchRegex.test(this.ref.signature());
            } catch (e) {
                return false;
            }
        },

        resizeTo: function (w, h, noUpdate) {
            var dimension = {
                width: w,
                height: h
            };

            if (typeof arguments[0] === 'object') {
                dimension.width = arguments[0].width;
                dimension.height = arguments[0].height;
                noUpdate = h;
            }

            if (dimension.width && typeof dimension.width.toString === 'function') {
                this.width = dimension.width.toString().replace(lengthCleanupRegex, '');
            }
            if (dimension.height && typeof dimension.height.toString === 'function') {
                this.height = dimension.height.toString().replace(lengthCleanupRegex, '');
            }

            if (noUpdate !== true) {
                global.renderer.resize(this, dimension);
            }
        },

        // Add function to get chart type name from SWF
        chartType: function (value) {
            var chartObj = this,
                src = chartObj.src,
                url;

            if (typeof value === 'string') {
                chartObj.src = value;
                chartObj.isActive() && chartObj.render();
            }

            // Note that we need to replace 'fcmap_' when there.
            return (url = (url = src.substring(src.indexOf('.swf'), 0)) ?
                url : src).substring(url.lastIndexOf('/') + 1).toLowerCase()
                    .replace(/^fcmap_/i, '');
        }

    }, true);

    // Globally expose getChartFromId method.
    window.getChartFromId = window.getMapFromId = function (id) {
        global.raiseWarning(this, '11133001041', 'run',
            'GenericRuntime~getObjectFromId()',
            'Use of deprecated getChartFromId() or getMapFromId(). Replace ' +
            'with "FusionCharts()" or FusionCharts.items[].');
        return global.core.items[id] instanceof global.core ?
            global.core.items[id].ref : window.swfobject.getObjectById(id);
    };

}());



/*jslint white: true, browser: true, windows: true, forin: true,  undef: true,
  eqeqeq: true, plusplus: true, bitwise: true, regexp: true, immed: true */

/*global Array: false, FusionCharts, RegExp: false, window: false
    FusionChartsDataFormats: true */

/*members FusionCharts, XMLURL, addEventListener, appendChild, apply,
    args, call, config, configure, containerElement, containerElementId,
    core, createElement, currentRendererName, dataFormat, extend,
    firstChild, getAttribute, getElementById, getElementsByTagName,
    getExternalInterfaceMethods, getRenderer, getRendererPolicy,
    hasChildNodes, id, init, initialized, insertMode, items, length,
    options, parsePolicies, policies, prototype, raiseError, raiseEvent,
    ref, register, removeChild, render, renderer, resize, sender,
    setAttribute, setCurrentRenderer, setDefault, slice, split, success,
    toLowerCase, toString, undefined, update, __state, rendering, dispose,
    events
*/

/**
 * -----------------------------------------------------------------------------
 * Renderer Abstraction Framework
 * This module allows developers to abstract the entire rendering engine. This
 * helps in multiple implementations of FusionCharts in various technologies
 * such as flash, HTML5, etc.
 * -----------------------------------------------------------------------------
 */
(function () {

    // Register the module with FusionCharts.
    var global = FusionCharts(['private', 'RendererManager']);
    // Check whether the module has been already registered. If true, then
    // do not bother to re-register.
    if (global === undefined) {
        return;
    }

    // Allow FusionCharts to accept parameter to specify where to render the
    // chart.
    global.policies.options.containerElementId = ['renderAt', undefined];
    global.policies.options.renderer = ['renderer', undefined];

    // Function to normalize dimension for style setting
    global.normalizeCSSDimension = function (width, height, container) {
        // optimize dimensions
            var w = width === undefined ? (container.offsetWidth || parseFloat(container.style.width)) : width,
                h = height === undefined ? (container.offsetHeight || parseFloat(container.style.height)) : height,
                p;

            // Do initial testing by setting dimensions
            container.style.width = w = w.toString ? w.toString() : '0';
            container.style.height = h = h.toString ? h.toString() : '0';

            if (w.match(/^\s*\d*\.?\d*\%\s*$/) && !w.match(/^\s*0\%\s*$/) &&
                    container.offsetWidth === 0) {
                p = container;
                while ((p = p.offsetParent)) {
                    if (p.offsetWidth > 0) {
                        w = (p.offsetWidth * parseFloat(w.match(/\d*/)[0]) / 100).toString();
                        break;
                    }
                }
            }

            if (h.match(/^\s*\d*\.?\d*\%\s*$/) && !h.match(/^\s*0\%\s*$/) &&
                    container.offsetHeight <= 20) {
                p = container;
                while ((p = p.offsetParent)) {
                    if (p.offsetHeight > 0) {
                        h = (p.offsetHeight * parseFloat(h.match(/\d*/)[0]) / 100).toString();
                        break;
                    }
                }
            }

            // Re-use variable 'p' to store the final dimensioms
            p = {
                width: (w.replace ? w.replace(/^\s*(\d*\.?\d*)\s*$/ig, '$1px') : w),
                height: (h.replace ? h.replace(/^\s*(\d*\.?\d*)\s*$/ig, '$1px') : h)
            };

            // Finally apply the dimensions
            container.style.width = p.width;
            container.style.height = p.height;

            return p
    };

    // Collection of renderers.
    var notDefined = function () {
        global.raiseError(this, '25081845', 'run', '::RendererManager',
            new Error('No active renderer'));
        return;
    },
    renderers = {
        'undefined': {
            render: notDefined,
            remove: notDefined,
            update: notDefined,
            resize: notDefined,
            config: notDefined,
            policies: {}
        }
    },

    store = {}, // store which chart has what renderer

    // API to add renderer and also to set/get the current renderer.
    renderer = global.renderer = {
        register: function (name, obj) {
            // Validate parameters
            if (!name || typeof name.toString !== 'function') {
                throw "#03091436 ~renderer.register() Invalid value for renderer name.";
            }

            // Desensitize character case for renderer name
            name = name.toString().toLowerCase();

            // Prevent addition of duplicate renderer
            if (renderers[name] !== undefined) {
                global.raiseError(global.core, '03091438', 'param', '::RendererManager>register',
                    'Duplicate renderer name specified in "name"');
                return false;
            }

            // Add renderer to the collection of renderers.
            renderers[name] = obj;
            // Return true when a new renderer is successfully added.
            return true;
        },

        // Flag that tracks whether user has updated the default value.
        userSetDefault: false,

        // Set the current renderer
        setDefault: function (name) {
            // Validate parameters
            if (!name || typeof name.toString !== 'function') {
                global.raiseError(global.core, '25081731', 'param', '::RendererManager>setDefault',
                    'Invalid renderer name specified in "name"');
                return false;
            }

            // Validate the renderer name and see whether the parameter refers to a
            // valid renderer.
            // ALSO: Desensitize character case for renderer name.
            if (renderers[name = name.toString().toLowerCase()] === undefined) {
                global.raiseError(global.core, '25081733', 'range', '::RendererManager>setDefault',
                    'The specified renderer does not exist.');
                return false;
            }

            // Mark auto-set default renderer. When user specifically sets
            // renderer, this flag needs to be overwritten.
            this.userSetDefault = false;

            // Set reference to the current renderer.
            global.policies.options.renderer = ['renderer', name];
            return true;
        },

        // Define a function that saves the reference to the embedded object
        // after it has been rendered.
        notifyRender: function (status) {
            // Lookup corresponding chartObject for the renderer notif.
            var chartObj = global.core.items[(status && status.id)];

            // Check whether the render was successful.
            if (!chartObj || (status.success === false && !status.silent)) {
                global.raiseError(global.core.items[status.id], '25081850', 'run', '::RendererManager',
                    new Error('There was an error rendering the chart. ' +
                        'Enable FusionCharts JS debugMode for more information.'));
            }

            // Lookup the FusionCharts object within its "items" repository.
            chartObj.ref = status.ref;

            // If the ref has been created, create a reverse reference.
            if (status.ref) {
                status.ref.FusionCharts = global.core.items[status.id];

            }

            // Raise event that this chart has a DOM element
            global.raiseEvent('internal.DOMElementCreated', status,
                chartObj);

        },

        protectedMethods: {
            options: true,
            attributes: true,
            src: true,
            ref: true,
            constructor: true,
            signature: true,
            link: true,
            addEventListener: true,
            removeEventListener: true
        },

        getRenderer: function (name) {
            return renderers[name];
        },

        getRendererPolicy: function (name) {
            var policies = renderers[name].policies;
            return typeof policies === 'object' ? policies : {};
        },

        currentRendererName: function () {
            return global.policies.options.renderer[1];
        },

        update: function (obj) {
            store[obj.id].update.apply(obj,
                Array.prototype.slice.call(arguments, 1));
        },

        render: function (obj) {
            store[obj.id].render.apply(obj,
                Array.prototype.slice.call(arguments, 1));
        },

        remove: function (obj) {
            store[obj.id].remove.apply(obj,
                Array.prototype.slice.call(arguments, 1));
        },

        resize: function (obj) {
            store[obj.id].resize.apply(obj,
                Array.prototype.slice.call(arguments, 1));
        },

        config: function (obj) {
            store[obj.id].config.apply(obj,
                Array.prototype.slice.call(arguments, 1));
        },

        dispose: function (obj) {
            store[obj.id].dispose.apply(obj,
                Array.prototype.slice.call(arguments, 1));
        }
    };


    // This function allows users to make a generic call to external interface
    // of the chart via the FusionCharts object
    var eiCall = function (method) {
        return function () {
            // Verify whether the chart is valid object and then proceed.
            if (this.ref === undefined  || this.ref === null  ||
                typeof this.ref[method] !== 'function') {
                // Raise error event to notify that a method on the renderer was
                // invoked while the renderer does not have such a method.
                global.raiseError(this, '25081617', 'run', '~' + method + '()',
                    'ExternalInterface call failed. Check whether chart has been rendered.');
                return undefined;
            }

            return this.ref[method].apply(this.ref, arguments);
        };
    };

    // Constructor to add renderer functions
    global.addEventListener('BeforeInitialize', function (event) {
        // Reference to event sender.
        var obj = event.sender, item;

        // Check if construction has the default renderer name saved.
        if (typeof obj.options.renderer === 'string' &&
            renderers[obj.options.renderer.toLowerCase()] === undefined) {
            obj.options.renderer = global.policies.options.renderer[1];
        }
        // Desensitize the case of the parameter.
        obj.options.renderer = obj.options.renderer.toLowerCase();

        // Keep a reference
        store[obj.id] = renderers[obj.options.renderer];

        // Check whether this particular renderer has been rendered.
        if (store[obj.id].initialized !== true &&
            typeof store[obj.id].init === 'function') {
            // Call the 'init' function on the renderer and set a flag.
            store[obj.id].init();
            store[obj.id].initialized = true;
        }

        // Parse construction policies specific to this renderer.
        global.parsePolicies(obj, store[obj.id].policies || {}, obj.args);

        // Copy the prototype of the renderer specified in constructor to the
        // main object.
        for (var prop in store[obj.id].prototype) {
            obj[prop] = store[obj.id].prototype[prop];
        }

        // Attach event liseners of the renderer to this object.
        for (item in store[obj.id].events) {
            obj.addEventListener(item, store[obj.id].events[item]);
        }

    });

    global.addEventListener('Loaded', function (e) {

        // Store a reference to the chart swf HTML Node.
        var obj = e.sender, chartObj = e.sender.ref;

        // Clear the flag that keeps a track whether the chart is presently
        // in a 'rendering' state
        if (obj instanceof global.core) {
            delete obj.__state.rendering;
        }

        // Validate whether the chart swf node exists and that it has
        // the prerequisite externalInterface functions.
        if (chartObj === undefined || chartObj === null || typeof
            chartObj.getExternalInterfaceMethods !== 'function') {
            return;
        }

        // The externalInterfaceMethods names are parsed from CSV to
        // Array.
        var eiItems, i;
        // Check whether the external interface methods are being called or not.
        // If not, then there is an error (probably cross-domain).
        try {
            eiItems = chartObj.getExternalInterfaceMethods();
            eiItems = typeof eiItems === 'string' ? eiItems.split(',') : [];
        }
        catch (err) {
            eiItems = [];

            global.raiseError(obj, '13111126041', 'run', 'RendererManager^Loaded',
                Error('Error while retrieving data from the chart-object.' +
                    (err.message && err.message.indexOf('NPObject') >= 0 ?
                        ' Possible cross-domain security restriction.' :
                        '')));

        }

        // We iterate through all the externalInterface method names and
        // create an extensible API object that is added to main
        // FusionCharts object as reference.
        for (i = 0; i < eiItems.length; i += 1) {
            // Copy method from renderer only when a local method does not exist
            if (obj[eiItems[i]] === undefined) {
                obj[eiItems[i]] = eiCall(eiItems[i]);
            }
        }
    });


    // This function allows users to make a generic call from renderer
    // of the chart to main FusionCharts object.
    var jsCall = function (obj, prop) {
        // Check whether me
        if (typeof obj[prop] === 'function') {
            return function () {
                return obj[prop].apply(obj, arguments);
            };
        }
        return obj[prop];
    };

    /**
     * Extend FusionCharts capabilities to swf HTMLNode object
     */
    global.addEventListener('loaded', function (event, args) {
        var sender = event.sender;
        // Check whether the object was added to DOM or not.
        if (!sender.ref) {
            return;
        }

        // List the properties that are not to be extended.
        var ignore1 = global.renderer.protectedMethods,
            ignore2 = global.renderer.getRenderer(sender.options.renderer).protectedMethods,
            prop;


        // Iterate through the FusionCharts object and add its variables to the
        // HTMLNode object.
        for (prop in event.sender) {
            // Discontinue adding this object in case the property is marked to
            // be ignored.
            if (ignore2 && !(ignore1[prop] || ignore2[prop] || sender.ref[prop] !== undefined)) {
                try {
                    sender.ref[prop] = jsCall(event.sender, prop);
                } catch (e) { }
            }
        }
    });

// ============================================================================

    // Function that checks duplicate.
    var isDuplicateId = function (lookupId, container) {
        // Get the lookup element from the ID sent via parameter.
        var lookupElement = document.getElementById(lookupId),
            // Get the ID of the container element.
            containerId = container.getAttribute('id');

        // Check whether the element exists or not. If it does not exist, it
        // implies that there cannot be any duplicate.
        if (lookupElement === null) {
            return false;
        }

        // In case chart's Id and container's Id is same then is duplicate.
        if (lookupId === containerId) {
            return true;
        }

        // Check whether the lookup element returned before is actually
        // inside container or not.
        var children = container.getElementsByTagName('*');
        for (var i = 0; i < children.length; i += 1) {
            if (children[i] === lookupElement) {
                return false;
            }
        }
        // If the lookupElement is outside/before the container, it implies
        // that it is a duplicate.
        return true;
    };


    global.extend(global.core, {
        render: function (containerElement) {

            // Dispose the renderer in case of re-render. This checks whether there
            // is any previous DOM element in case the chart is re-rendered and
            // correspondingly deletes it. (B#565)
            var ref, s;
            if ((ref = window[this.id]) && ref.FusionCharts && ref.FusionCharts === this ||
                (ref = this.ref) && ref.FusionCharts && ref.FusionCharts === this) {
                global.renderer.dispose(this);
            }

            // Check IE-Safe variable name collision within Global Scope
            if (window[this.id] !== undefined) {
                global.raiseError(this, '25081843', 'comp', '.render',
                    new Error('#25081843:IECompatibility() Chart ' +
                    'Id is same as a JavaScript variable name. Variable naming ' +
                    'error. Please use unique name for chart JS variable, ' +
                    'chart-id and container id.'));
            }

            // Create a blank element inside to mimic alternativecontent
            var insertMode = this.options.insertMode.toLowerCase() || 'replace',
                alt;

            // Procure containerElement from internal object options that has
            // been passed via parameters.
            if (containerElement === undefined) {
                containerElement = this.options.containerElementId;
            }

            // In case user sends the element id, we get the object from it
            if (typeof containerElement === 'string') {
                containerElement = document.getElementById(containerElement);
            }
            if (containerElement === undefined || containerElement === null) {
                global.raiseError(this, '03091456', 'run', '.render()',
                    new Error("Unable to find the container DOM element."));
                return this;
            }

            // Check duplicate rendering with same id
            if (isDuplicateId(this.id, containerElement)) {
                global.raiseError(this, '05102109', 'run', '.render()',
                    new Error("A duplicate object already exists with the specific Id: " + this.id));
                return this;
            }

            // Set the attribute of this element that will be replaced by
            // swfobject
            alt = document.createElement(this.options.containerElementType ||
                    'span');
            alt.setAttribute('id', this.id);

            // Clear the contents of the containerElement and subsequently
            // append the new alt content.
            if (insertMode !== 'append' && insertMode !== 'prepend') {
                while (containerElement.hasChildNodes()) {
                    containerElement.removeChild(containerElement.firstChild);
                }
            }
            // Check whether we are to prepend this item or append.
            if (insertMode === 'prepend' && containerElement.firstChild) {
                containerElement.insertBefore(alt, containerElement.firstChild);
            }
            else {
                containerElement.appendChild(alt);
            }

            // Update the present container details in object.
            this.options.containerElement = containerElement;
            this.options.containerElementId = containerElement.id;

            // Set the chart element style property to make it display as an
            // inline-block element.
            if ((s = alt.style)) {
                s.position = 'relative';
                s.textAlign = 'left';
                s.lineHeight = '100%';
                s.display = 'inline-block';
                s.zoom = '1';
                s.fontWeight = 'normal';
                s.fontVariant = 'normal';
                s.fontStyle = 'normal';
                s.textDecoration = 'none';
                s['*DISPLAY'] = 'inline';
            }

            // Fix percentage width issues
            global.normalizeCSSDimension(this.width, this.height, alt);

            // Set state that the chart is rendering
            this.__state.rendering = true;

            // Raise event before rendering
            global.raiseEvent('BeforeRender', {
                container: containerElement,
                width: this.width,
                height: this.height,
                renderer: this.options.renderer
            }, this);

            // Call the current renderer.
            global.renderer.render(this, alt, global.renderer.notifyRender);

            // Return the fusioncharts object for chainability
            return this;
        },

        remove: function () {
            global.renderer.remove(this);
            return this; // chain
        },

        configure: function (key, value) {
            var hash;
            if (!key) {
                return;
            }
            else if (typeof key === 'string') {
                hash = {};
                hash[key] = value;
            }
            else {
                hash = key;
            }
            global.renderer.config(this, hash);
        }
    }, true);

    global.extend(global.core, {
        setCurrentRenderer: function () {
            var ret = renderer.setDefault.apply(renderer, arguments);
            renderer.userSetDefault = true; // Mark this renderer as user set.
            return ret;
        },

        getCurrentRenderer: function () {
            return renderer.currentRendererName.apply(renderer, arguments);
        },

        /**
         * Render FusionCharts directly using the simplest one-line argument
         * parameter.
         * This function directly renders FusionCharts into the container
         * specified in arguments.
         */
        render: function () {

            // The order in which to parse the linear parameters.
            var argsT = ['swfUrl', 'id', 'width', 'height', 'renderAt',
                'dataSource', 'dataFormat'], params = {}, i;

            // If a FusionCharts object is sent to it, it calls render method of
            // it.
            if (arguments[0] instanceof global.core) {
                arguments[0].render();
                return arguments[0];
            }

            // Iterate through the linear parameters using the argument template
            // array defined above and create a parameter object out of it.
            for (i = 0; (i < arguments.length && i < argsT.length); i += 1) {
                params[argsT[i]] = arguments[i];
            }

            // Incorporate the trailing object parameter as object-style
            // parameter input overrides.
            if (typeof arguments[arguments.length - 1] === 'object') {
                delete params[argsT[i - 1]];
                global.extend(params, arguments[arguments.length - 1]);
            }

            // Pre-specify the 'xmlurl' format
            if (params.dataFormat === undefined) {
                params.dataFormat = FusionChartsDataFormats.XMLURL;
            }

            // Render a new FusionCharts out of the parameters and return the
            // object.
            return new global.core(params).render();

        }
    }, false);
}());



/*jslint white: true, browser: true, windows: true, forin: true,  undef: true,
  eqeqeq: true, plusplus: true, bitwise: true, regexp: true, immed: true */

/*global window: false, Array, FusionCharts, Error: false */

/**
 * -----------------------------------------------------------------------------
 * Data-Handler Abstraction Framework
 * This allows developers to dynamically integrate a data transcoder so that
 * FusionCharts core can seamlessly work with multiple formats for data
 * provisioning.
 * -----------------------------------------------------------------------------
 */

(function () {

    // Register the module with FusionCharts.
    var global = FusionCharts(['private', 'DataHandlerManager']);
    // Check whether the module has been already registered. If true, then
    // do not bother to re-register.
    if (global === undefined) {
        return;
    }

    // Collection of Data Formats
    window.FusionChartsDataFormats = {};

    // Store all data handlers here in a collection and also store all 'data' of
    // every chart in an object.
    /**
     * @var {object} cache stores the parsed JSON data as a cache location, so
     * that multiple calls to decode JSON does not involve redundant conversion.
     */
    var SOURCENAME = 'XmlHttpRequest',
        handlers = global.transcoders = {},
        dataStore = {},
        cache = {},
        isUrl =  /url$/i,

        xmlhttpSuccess = function (responseText, wrapper, data, url) {
            // Allow cancellation of data loaing
            var cancelDLFlag = false,
            obj = data.obj,
            baseFormat = data.format,
            silent = data.silent;

            // Raise pre data-load event
            global.raiseEvent('DataLoadRequestCompleted', {
                source: SOURCENAME,
                url: url,
                data: responseText,
                dataFormat: baseFormat,
                cancelDataLoad: function () {
                    cancelDLFlag = true;
                    wrapper.abort();
                    this.cancelDataLoad = function () {
                        return false;
                    };
                    return true;
                },
                xmlHttpRequestObject: wrapper.xhr
            }, obj);

            // Update the chart's dataStore with data received
            // from url.
            if (cancelDLFlag !== true) {
                // Set the chart's data received from url.
                obj.setChartData(responseText, baseFormat, silent);

            } else {
                // Raise post data load event .
                global.raiseEvent('DataLoadCancelled', {
                    source: SOURCENAME,
                    url: url,
                    dataFormat: baseFormat,
                    xmlHttpRequestObject: wrapper.xhr
                }, obj);
            }
        },

        xmlhttpFailure =  function (resp, wrapper, data, url) {
            // Compile argument for event.
            var obj = data.obj,
            eventArgs = {
                source: SOURCENAME,
                url: url,
                xmlHttpRequestObject: wrapper.xhr,
                error: resp,
                httpStatus: (wrapper.xhr && wrapper.xhr.status) ?
                wrapper.xhr.status : -1
            };

            // Raise data load error message.
            global.raiseEvent('DataLoadError', eventArgs, obj);

            // Call legacy event handler.
            if (typeof window.FC_DataLoadError === 'function') {
                window.FC_DataLoadError(obj.id, eventArgs);
            }
        };


    // Allow data-related parameters to be passed in constructor
    global.policies.options.dataSource = ['dataSource', undefined];
    global.policies.options.dataFormat = ['dataFormat', undefined];
    global.policies.options.dataConfiguration = ['dataConfiguration', undefined];
    global.policies.options.showDataLoadingMessage = ['showDataLoadingMessage', true];

    // Expose Data handler and related management API.
    global.addDataHandler = function (name, obj) {
        if (typeof name !== 'string' || handlers[name.toLowerCase()] !== undefined) {
            global.raiseError(global.core, '03091606', 'param',
                '::DataManager.addDataHandler', new Error('Invalid Data Handler Name'));
            return;
        }
        var api = {}, lcaseName = name.toLowerCase();

        // Add handler to collection
        handlers[lcaseName] = obj;
        obj.name = name;

        // Create Handler Direct Access API. This adds common fuctions for the
        // handler.
        api['set' + name + 'Url'] = function (url) { // unused param: [1]config
            return this.setChartDataUrl(url, name);
        };

        api['set' + name + 'Data'] = function (data, config) {
            return this.setChartData(data, name, false, config);
        };

        api['get' + name + 'Data'] = function () {
            return this.getChartData(name);
        };

        // Add data formats to global formats collection
        window.FusionChartsDataFormats[name] = lcaseName;
        window.FusionChartsDataFormats[name + 'URL'] = lcaseName + 'URL';

        // Extend FusionCharts objects
        global.extend(global.core, api, true);
    };

    // Add constructor to initialize datastore or to clear any garbage.
    global.addEventListener('BeforeInitialize', function (event) {

        // Get short reference to the event sender.
        var obj = event.sender,
            dataSource = obj.options.dataSource;

        // Clear the dataStore, cache and xStore when new chart is created.
        dataStore[obj.id] = '';
        cache[obj.id] = {};


        // Set intitial data if present
        if (dataSource !== undefined && dataSource !== null) {
            obj.__state.dataSetDuringConstruction = true;
            // If data formay was not specified during construction, try
            // auto-detection.
            if (typeof obj.options.dataFormat !== 'string') {
                switch (typeof dataSource) {
                    case "function":
                        dataSource = obj.options.dataSource = dataSource(obj);
                        obj.options.dataFormat = 'JSON';
                        break;
                    case "string":
                        obj.options.dataFormat =
                            /^\s*?\{[\s\S]*\}\s*?$/g.test(obj.options.dataFormat) ?
                            'JSON' : 'XML';
                        break;
                    case "object":
                        obj.options.dataFormat = "JSON";
                        break;
                };
            }
            obj.setChartData(dataSource, obj.options.dataFormat);
        }
    });

    // Add method to make sure to delete all fusioncharts objects when
    // dispose method is invoked
    global.addEventListener('BeforeDispose', function (e) {
        var obj = e.sender;
        delete dataStore[e.sender.id];
        delete cache[e.sender.id];
        if (obj && obj.__state && obj.__state.dhmXhrObj) {
            obj.__state.dhmXhrObj.abort();
        }
    });

    // Add getter and setter to FusionCharts Objects
    global.extend(global.core, {
        setChartDataUrl: function (url, format, silent) {
            if (format === undefined || format === null || typeof format.toString !== 'function') {
                global.raiseError(global.core, '03091609', 'param',
                    '.setChartDataUrl', new Error('Invalid Data Format'));
                return;
            }

            // Desensitize case of parameter.
            format = format.toString().toLowerCase();

            /**
             * @var {Boolean} cancelDLRFlag is to allow users to flag that
             * data-load request has to be cancelled.
             */
            var baseFormat, obj = this,
                // This is an out-of architecture implementation to specifically
                // look for FlashRenderer specific instruction.
                cancelDLRFlag = (obj.options && (obj.options.renderer === 'flash') &&
                    obj.options.useLegacyXMLTransport) || false,
                xhr;

            // Check whether the data-format has "url" at the end of it.
            // We compute the base format and update the format accordingly so
            // that format always ends with 'url' and the baseFormat contains real
            // format name.
            if (isUrl.test(format)) {
                baseFormat = format.slice(0, -3);
            } else {
                baseFormat = format;
                format = format + 'url';
            }

            // Raise event to notify xmlhttprequest transaction start.
            global.raiseEvent('DataLoadRequested', {
                source: SOURCENAME,
                url: url,
                dataFormat: baseFormat,
                cancelDataLoadRequest: function () {
                    cancelDLRFlag = true;
                    global.raiseEvent('DataLoadRequestCancelled', {
                        source: SOURCENAME,
                        url: url,
                        dataFormat: baseFormat
                    }, obj);

                    try {
                        if (this.__state && this.__state.dhmXhrObj) {
                            this.__state.dhmXhrObj.abort();
                        }
                    }
                    catch (e) { }
                    this.cancelDataLoadRequest = function () {
                        return false;
                    };
                    return true;
                }
            }, obj);

            // In case cancel was hit even before this function reached here,
            // we then do not proceed.
            if (cancelDLRFlag) {
                if (this.__state && this.__state.dhmXhrObj) {
                    try {
                        this.__state.dhmXhrObj.abort();
                    }
                    catch (e) { }
                }
                return;
            }

            // Update reference to data-source.
            this.options.dataSource = url;

            // Create an XMLHttpRequest object if it is not already
            if (!this.__state.dhmXhrObj) {
                this.__state.dhmXhrObj = new global.ajax(xmlhttpSuccess,
                    xmlhttpFailure);
            }
            xhr = this.__state.dhmXhrObj;

            // Initiate XmlHttpRequest.
            xhr.get(typeof window.decodeURIComponent === 'function' ?
                window.decodeURIComponent(url) : window.unescape(url), {
                    obj: this,
                    format: baseFormat,
                    silent: silent
                });


        },

        setChartData: function (data, format, silent) {
            // In case format is not a string, we raise an error
            if (format === undefined || format === null || typeof format.toString !== 'function') {
                global.raiseError(global.core, '03091610', 'param',
                    '.setChartData', new Error('Invalid Data Format'));
                return;
            }
            // Desensitize case of parameter.
            format = format.toString().toLowerCase();

            // Thebase format is set by truncating fetching method from the
            // formatg-string and then stored in 'baseFormat' variable.
            var baseFormat;

            // Check whether the data-format has "url" at the end of it. If true,
            // then we call the setChartDataUrl method and that in turn calls this
            // method as callback (marked as _recursed.)
            if (isUrl.test(format)) {
                this.setChartDataUrl(data, format, silent);
                return;
            } else {
                // When there is no trailing "url" in data-format, we assume that
                // the format provided is baseFormat itself.
                // Update the dataSource here only when we know that this call
                // was not recursed for dataurl purpose
                this.options.dataSource = data;
                baseFormat = format;
            }
            // Update chart's internal data-format options
            this.options.dataFormat = format;

            // Fetch the data-handler function from the dataHandler collection.
            var handler = handlers[baseFormat], parseResult, cancelDUFlag = false;

            // If the handler has been successfully fetched, execute it.
            if (typeof handler === 'undefined') {
                global.raiseError(global.core, '03091611', 'param',
                    '.setChartData', new Error('Data Format not recognized'));
                return;
            }

            // Execute the parser and fetch the parsing result. Also check whether
            // the parser returns a valid object, if not, use a blank object.
            parseResult = handler.encode(data, this, this.options.dataConfiguration) || {};

            // Updated the result so that it can be passed as event argument.
            parseResult.format = parseResult.dataFormat = baseFormat;
            // Add additional argument for events in parser result
            parseResult.dataSource = data;
            parseResult.cancelDataUpdate = function () {
                cancelDUFlag = true;
                this.cancelDataUpdate = function () {
                    return false;
                };
                return true;
            };

            global.raiseEvent('BeforeDataUpdate', parseResult, this);
            delete parseResult.cancelDataUpdate; // Remove cancellation fn.

            // Update event only if it is not marked to be cancelled by user.
            if (cancelDUFlag === true) {
                global.raiseEvent('DataUpdateCancelled', parseResult, this);
                return;
            }

            // Save data within dataStore
            dataStore[this.id] = parseResult.data || '';

            // Clear cache
            cache[this.id] = {};

            // Raise data updation event if it is not marked as silent data
            // updating.
            if (silent !== true) {
                // stall this update if this is stuck in between a render and loading
                if (this.options.safeMode === true &&
                    this.__state.rendering === true && !this.isActive()) {
                    this.__state.updatePending = parseResult;
                    global.raiseWarning(this, '23091255', 'run', '::DataHandler~update',
                        'Renderer update was postponed due to async loading.');
                } else {
                    delete this.__state.updatePending;
                    global.renderer.update(this, parseResult);
                }
            }

            // Clear any decision flag whether data is ready for chart to be
            // rendered.
            this.__state.dataReady = undefined;

            // DevNote: This event must not be raised asynchronously in order
            // to maintain integrity and timing of related codes.
            global.raiseEvent('DataUpdated', parseResult, this);
        },

        getChartData: function (format, advanced) {

            // Variable to store a reference to the data-handler.
            var handler, parseResult;
            // Desensitize case of parameter and fetch the data-handler
            // function from the dataHandler collection within the validation
            // check itself.

            if (format === undefined || typeof format.toString !== 'function' ||
                (handler = handlers[format =
                    format.toString().toLowerCase()]) === undefined) {
                global.raiseError(this, '25081543', 'param', '~getChartData()',
                    new Error('Unrecognized data-format specified in "format"'));
                return undefined;
            }

            // Check presence of cached data or call the decoder routine of
            // the data-handler and return the decoded data.
            parseResult = (typeof cache[this.id][format] === 'object') ?
            cache[this.id][format] :
            cache[this.id][format] = handler.decode(dataStore[this.id], this,
                this.options.dataConfiguration);

            // Return the eminent data (in advanced mode if needed.
            return Boolean(advanced) === true ? parseResult : parseResult.data;
        },

        /**
         * Function returns whether the chart has it's data ready or not.
         */
        dataReady: function () {
            return this.__state.dataReady;
        }
    }, true); // extend the prototype

    global.extend(global.core, {
        transcodeData: function (data, from, to, advanced, configuration) {

            // Validate parameters.
            if (!from || typeof from.toString !== 'function' || !to ||
                typeof to.toString !== 'function' ||
                handlers[(to = to.toString().toLowerCase())] === undefined ||
                handlers[(from = from.toString().toLowerCase())] === undefined) {
                global.raiseError(this, '14090217', 'param', 'transcodeData()',
                    new Error('Unrecognized data-format specified during transcoding.'));
                return undefined;
            }

            // Chain the decoder and encoder.
            var l1 = handlers[from].encode(data, this, configuration),
            l2 = handlers[to].decode(l1.data, this, configuration);

            // Carry the error.
            if (!(l2.error instanceof Error)) {
                l2.error = l1.error;
            }
            return advanced ? l2 : l2.data;
        }
    }, false);

    // Attach an event handler to clear the data cache when chart is disposed.
    global.addEventListener('Disposed', function (e) {
        delete cache[e.sender.id];
    });

    // Check for pending data updates
    global.addEventListener('Loaded', function (e) {
        var obj = e.sender;
        if (obj instanceof global.core && obj.__state.updatePending !== undefined) {
            global.renderer.update(obj, obj.__state.updatePending);
            delete obj.__state.updatePending;
        }
    });

    // Check for event when renderer declares that there is no data
    global.addEventListener('NoDataToDisplay', function (e) {
        var obj = e.sender;
        obj.__state.dataReady = false;
    });

    // Enumeration of charts that has exceptional implementation of 'getXMLData'
    // method. The value [dynamicDatRouter, dynamicAttributeRouter]
    // A reference of this enum is stored at global._interactiveCharts so that
    // it can be accessed by ChartAttributes module. This is done so that for
    // interactive charts, when data is fetched, we fetch the updated data and not
    // the initial data state.
    var interactiveCharts = global._interactiveCharts = {
        'selectscatter': [true, false],
        'dragcolumn2d': [true, true],
        'dragarea': [true, true],
        'dragline': [true, true],
        'dragnode': [true, true]
    };

    global.addEventListener('Loaded', function (event) {
        var obj = event.sender,
            state = obj.__state,
            transcoder,
            dataGetterName,
            transcoderName;

        // We specially address the getXMLData function of PowerCharts.
        // We check whether the loaded chart is one of the listed charts that
        // are known to have the anomalous implementation.
        if (obj.chartType && interactiveCharts[obj.chartType()] &&
            interactiveCharts[obj.chartType()][0]) {
            // We set a modified getXXXData method that allows users to bypass
            // the JS method and use the flash method instead.
            for (transcoder in global.transcoders) {
                transcoderName = global.transcoders[transcoder].name;
                dataGetterName = 'get' + transcoderName + 'Data';

                obj[dataGetterName] = function (format, protoHandler) {
                    return function (fresh) {
                        // obj redefined here so that on chart change, old obj
                        // is not reused.
                        var obj = this;

                        if (fresh === false) { // check false positive
                            return protoHandler.apply(obj);
                        }
                        else if (obj.ref.getUpdatedXMLData) { // for flash
                            return global.core.transcodeData(obj.ref.getUpdatedXMLData(),
                                    'xml', format);
                        }
                        else if (obj.getData) { // for js charts
                            return obj.getData(format);
                        }
                        else { // if all fail, return stale data
                            return protoHandler.apply(obj);
                        }
                    };
                }(transcoder, obj.constructor.prototype[dataGetterName]);
                obj[dataGetterName]._dynamicdatarouter = true; // flag
            }

            state.dynamicDataRoutingEnabled = true; // flag
        }
        // Remove for other chart types if it was earlier inserted.
        else if (state.dynamicDataRoutingEnabled){
            for (transcoder in global.transcoders) {
                transcoderName = global.transcoders[transcoder].name;
                dataGetterName = 'get' + transcoderName + 'Data';
                if (obj.hasOwnProperty(dataGetterName) &&
                        obj[dataGetterName]._dynamicdatarouter) {
                    delete obj[dataGetterName];
                }
            }
            state.dynamicDataRoutingEnabled = false;
        }

    });

}());


/* SWFObject v2.2 <http://code.google.com/p/swfobject/> modified by FusionCharts Technologies LLP <http://www.fusioncharts.com/>
	Copyright (c) 2007-2008 Geoff Stearns, Michael Williams, and Bobby van der Sluis
	This software is released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
	Copyright (c) for modifications 2010-2011 FusionCharts Technologies LLP.
*/var swfobject = window.swfobject = function () {

		var UNDEF = "undefined",
				OBJECT = "object",
				SHOCKWAVE_FLASH = "Shockwave Flash",
				SHOCKWAVE_FLASH_AX = "ShockwaveFlash.ShockwaveFlash",
				FLASH_MIME_TYPE = "application/x-shockwave-flash",
				EXPRESS_INSTALL_ID = "SWFObjectExprInst",
				ON_READY_STATE_CHANGE = "onreadystatechange",

				win = window,
				doc = document,
				nav = navigator,

				plugin = false,
				domLoadFnArr = [main],
				regObjArr = [],
				objIdArr = [],
				listenersArr = [],
				storedAltContent,
				storedAltContentId,
				storedCallbackFn,
				storedCallbackObj,
				isDomLoaded = false,
				isExpressInstallActive = false,
				dynamicStylesheet,
				dynamicStylesheetMedia,
				autoHideShow = true,

		/* Centralized function for browser feature detection
				- User agent string detection is only used when no good alternative is possible
				- Is executed directly for optimal performance
		*/
		ua = function () {
				var w3cdom = typeof doc.getElementById != UNDEF && typeof doc.getElementsByTagName != UNDEF && typeof doc.createElement != UNDEF,
						u = nav.userAgent.toLowerCase(),
						p = nav.platform.toLowerCase(),
						windows = p ? /win/.test(p) : /win/.test(u),
						mac = p ? /mac/.test(p) : /mac/.test(u),
						webkit = /webkit/.test(u) ? parseFloat(u.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : false, // returns either the webkit version or false if not webkit
						ie = !+"\v1", // feature detection based on Andrea Giammarchi's solution: http://webreflection.blogspot.com/2009/01/32-bytes-to-know-if-your-browser-is-ie.html
						playerVersion = [0,0,0],
						d = null;
				if (typeof nav.plugins != UNDEF && typeof nav.plugins[SHOCKWAVE_FLASH] == OBJECT) {
						d = nav.plugins[SHOCKWAVE_FLASH].description;
						if (d && !(typeof nav.mimeTypes != UNDEF && nav.mimeTypes[FLASH_MIME_TYPE] && !nav.mimeTypes[FLASH_MIME_TYPE].enabledPlugin)) { // navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin indicates whether plug-ins are enabled or disabled in Safari 3+
								plugin = true;
								ie = false; // cascaded feature detection for Internet Explorer
								d = d.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
								playerVersion[0] = parseInt(d.replace(/^(.*)\..*$/, "$1"), 10);
								playerVersion[1] = parseInt(d.replace(/^.*\.(.*)\s.*$/, "$1"), 10);
								playerVersion[2] = /[a-zA-Z]/.test(d) ? parseInt(d.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0;
						}
				}
				else if (typeof win.ActiveXObject != UNDEF) {
						try {
								var a = new ActiveXObject(SHOCKWAVE_FLASH_AX);
								if (a) { // a will return null when ActiveX is disabled
										// Fix for /bug#462
										//!// d = a.GetVariable("$version");
										try {
											d = a.GetVariable("$version");
										}
										catch (e) { }
										// End fix for /bug#462
										if (d) {
												ie = true; // cascaded feature detection for Internet Explorer
												d = d.split(" ")[1].split(",");
												playerVersion = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
										}
								}
						}
						catch(e) {}
				}
				return {w3:w3cdom, pv:playerVersion, wk:webkit, ie:ie, win:windows, mac:mac};
		}(),

		/* Cross-browser onDomLoad
				- Will fire an event as soon as the DOM of a web page is loaded
				- Internet Explorer workaround based on Diego Perini's solution: http://javascript.nwbox.com/IEContentLoaded/
				- Regular onload serves as fallback
		*/
		onDomLoad = function() {
				if (!ua.w3) {return;}
				if ((typeof doc.readyState != UNDEF && doc.readyState == "complete") || (typeof doc.readyState == UNDEF && (doc.getElementsByTagName("body")[0] || doc.body))) { // function is fired after onload, e.g. when script is inserted dynamically
						callDomLoadFunctions();
				}
				if (!isDomLoaded) {
						if (typeof doc.addEventListener != UNDEF) {
								doc.addEventListener("DOMContentLoaded", callDomLoadFunctions, false);
						}
						if (ua.ie && ua.win) {
								doc.attachEvent(ON_READY_STATE_CHANGE, function() {
										if (doc.readyState == "complete") {
												doc.detachEvent(ON_READY_STATE_CHANGE, arguments.callee);
												callDomLoadFunctions();
										}
								});
								if (win == top) { // if not inside an iframe
										(function(){
												if (isDomLoaded) {return;}
												try {
														doc.documentElement.doScroll("left");
												}
												catch(e) {
														setTimeout(arguments.callee, 0);
														return;
												}
												callDomLoadFunctions();
										})();
								}
						}
						if (ua.wk) {
								(function(){
										if (isDomLoaded) {return;}
										if (!/loaded|complete/.test(doc.readyState)) {
												setTimeout(arguments.callee, 0);
												return;
										}
										callDomLoadFunctions();
								})();
						}
						addLoadEvent(callDomLoadFunctions);
				}
		}();

		function callDomLoadFunctions() {
				if (isDomLoaded) {return;}
				try { // test if we can really add/remove elements to/from the DOM; we don't want to fire it too early
						var t = doc.getElementsByTagName("body")[0].appendChild(createElement("span"));
						t.parentNode.removeChild(t);
				}
				catch (e) {return;}
				isDomLoaded = true;
				var dl = domLoadFnArr.length;
				for (var i = 0; i < dl; i++) {
						domLoadFnArr[i]();
				}
		}

		function addDomLoadEvent(fn) {
				if (isDomLoaded) {
						fn();
				}
				else {
						domLoadFnArr[domLoadFnArr.length] = fn; // Array.push() is only available in IE5.5+
				}
		}

		/* Cross-browser onload
				- Based on James Edwards' solution: http://brothercake.com/site/resources/scripts/onload/
				- Will fire an event as soon as a web page including all of its assets are loaded
		 */
		function addLoadEvent(fn) {
				if (typeof win.addEventListener != UNDEF) {
						win.addEventListener("load", fn, false);
				}
				else if (typeof doc.addEventListener != UNDEF) {
						doc.addEventListener("load", fn, false);
				}
				else if (typeof win.attachEvent != UNDEF) {
						addListener(win, "onload", fn);
				}
				else if (typeof win.onload == "function") {
						var fnOld = win.onload;
						win.onload = function() {
								fnOld();
								fn();
						};
				}
				else {
						win.onload = fn;
				}
		}

		/* Main function
				- Will preferably execute onDomLoad, otherwise onload (as a fallback)
		*/
		function main() {
				if (plugin) {
						testPlayerVersion();
				}
				else {
						matchVersions();
				}
		}

		/* Detect the Flash Player version for non-Internet Explorer browsers
				- Detecting the plug-in version via the object element is more precise than using the plugins collection item's description:
				  a. Both release and build numbers can be detected
				  b. Avoid wrong descriptions by corrupt installers provided by Adobe
				  c. Avoid wrong descriptions by multiple Flash Player entries in the plugin Array, caused by incorrect browser imports
				- Disadvantage of this method is that it depends on the availability of the DOM, while the plugins collection is immediately available
		*/
		function testPlayerVersion() {
				var b = doc.getElementsByTagName("body")[0];
				var o = createElement(OBJECT);
				o.setAttribute("type", FLASH_MIME_TYPE);
				var t = b.appendChild(o);
				if (t) {
						var counter = 0;
						(function(){
								if (typeof t.GetVariable != UNDEF) {
										// Fix for /bug#462
										//!// var d = t.GetVariable("$version");
										var d;
										try {
											d = t.GetVariable("$version");
										}
										catch (e) { }
										// End fix for /bug#462
										if (d) {
												d = d.split(" ")[1].split(",");
												ua.pv = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
										}
								}
								else if (counter < 10) {
										counter++;
										setTimeout(arguments.callee, 10);
										return;
								}
								b.removeChild(o);
								t = null;
								matchVersions();
						})();
				}
				else {
						matchVersions();
				}
		}

		/* Perform Flash Player and SWF version matching; static publishing only
		*/
		function matchVersions() {
				var rl = regObjArr.length;
				if (rl > 0) {
						for (var i = 0; i < rl; i++) { // for each registered object element
								var id = regObjArr[i].id;
								var cb = regObjArr[i].callbackFn;
								var cbObj = regObjArr[i].userData || {};
                                                                cbObj.success = false;
                                                                cbObj.id = id;
								if (ua.pv[0] > 0) {
										var obj = getElementById(id);
										if (obj) {
												if (hasPlayerVersion(regObjArr[i].swfVersion) && !(ua.wk && ua.wk < 312)) { // Flash Player version >= published SWF version: Houston, we have a match!
														setVisibility(id, true);
														if (cb) {
																cbObj.success = true;
																cbObj.ref = getObjectById(id);
																cb(cbObj);
														}
												}
												else if (regObjArr[i].expressInstall && canExpressInstall()) { // show the Adobe Express Install dialog if set by the web page author and if supported
														var att = {};
														att.data = regObjArr[i].expressInstall;
														att.width = obj.getAttribute("width") || "0";
														att.height = obj.getAttribute("height") || "0";
														if (obj.getAttribute("class")) {att.styleclass = obj.getAttribute("class");}
														if (obj.getAttribute("align")) {att.align = obj.getAttribute("align");}
														// parse HTML object param element's name-value pairs
														var par = {};
														var p = obj.getElementsByTagName("param");
														var pl = p.length;
														for (var j = 0; j < pl; j++) {
																if (p[j].getAttribute("name").toLowerCase() != "movie") {
																		par[p[j].getAttribute("name")] = p[j].getAttribute("value");
																}
														}
														showExpressInstall(att, par, id, cb);
												}
												else { // Flash Player and SWF version mismatch or an older Webkit engine that ignores the HTML object element's nested param elements: display alternative content instead of SWF
														displayAltContent(obj);
														if (cb) {cb(cbObj);}
												}
										}
								}
								else {	// if no Flash Player is installed or the fp version cannot be detected we let the HTML object element do its job (either show a SWF or alternative content)
										setVisibility(id, true);
										if (cb) {
												var o = getObjectById(id); // test whether there is an HTML object element or not
												if (o && typeof o.SetVariable != UNDEF) {
														cbObj.success = true;
														cbObj.ref = o;
												}
												cb(cbObj);
										}
								}
						}
				}
		}

		function getObjectById(objectIdStr) {
				var o, r = null;
				/* ORIGINAL CODE
				o = getElementById(objectIdStr);
				if (o && o.nodeName == "OBJECT") {
						if (typeof o.SetVariable != UNDEF) {
								r = o;
						}
						else {
								var n = o.getElementsByTagName(OBJECT)[0];
								if (n) {
										r = n;
								}
						}
				} */
				/* fix for access embeds */
				if (!(document.embeds && (o = document.embeds[objectIdStr]))) {
					if (!((o = getElementById(objectIdStr)) && o.nodeName == "OBJECT")) {
						o = window[objectIdStr];
					}
				}

				if (!o) {
					return r;
				}

				if (typeof o.SetVariable != UNDEF) {
						r = o;
				}
				else {
						var n = o.getElementsByTagName(OBJECT)[0];
						if (n) {
								r = n;
						}
				}
				/* fix for access embeds ends */
				return r;
		}

		/* Requirements for Adobe Express Install
				- only one instance can be active at a time
				- fp 6.0.65 or higher
				- Win/Mac OS only
				- no Webkit engines older than version 312
		*/
		function canExpressInstall() {
				return !isExpressInstallActive && hasPlayerVersion("6.0.65") && (ua.win || ua.mac) && !(ua.wk && ua.wk < 312);
		}

		/* Show the Adobe Express Install dialog
				- Reference: http://www.adobe.com/cfusion/knowledgebase/index.cfm?id=6a253b75
		*/
		function showExpressInstall(att, par, replaceElemIdStr, callbackFn) {
				isExpressInstallActive = true;
				storedCallbackFn = callbackFn || null;
				storedCallbackObj = {success:false, id:replaceElemIdStr};
				var obj = getElementById(replaceElemIdStr);
				if (obj) {
						if (obj.nodeName == "OBJECT") { // static publishing
								storedAltContent = abstractAltContent(obj);
								storedAltContentId = null;
						}
						else { // dynamic publishing
								storedAltContent = obj;
								storedAltContentId = replaceElemIdStr;
						}
						att.id = EXPRESS_INSTALL_ID;
						if (typeof att.width == UNDEF || (!/%$/.test(att.width) && parseInt(att.width, 10) < 310)) {att.width = "310";}
						if (typeof att.height == UNDEF || (!/%$/.test(att.height) && parseInt(att.height, 10) < 137)) {att.height = "137";}
						doc.title = doc.title.slice(0, 47) + " - Flash Player Installation";
						var pt = ua.ie && ua.win ? "ActiveX" : "PlugIn",
								fv = "MMredirectURL=" + win.location.toString().replace(/&/g,"%26") + "&MMplayerType=" + pt + "&MMdoctitle=" + doc.title;
						if (typeof par.flashvars != UNDEF) {
								par.flashvars += "&" + fv;
						}
						else {
								par.flashvars = fv;
						}
						// IE only: when a SWF is loading (AND: not available in cache) wait for the readyState of the object element to become 4 before removing it,
						// because you cannot properly cancel a loading SWF file without breaking browser load references, also obj.onreadystatechange doesn't work
						if (ua.ie && ua.win && obj.readyState != 4) {
								var newObj = createElement("div");
								replaceElemIdStr += "SWFObjectNew";
								newObj.setAttribute("id", replaceElemIdStr);
								obj.parentNode.insertBefore(newObj, obj); // insert placeholder div that will be replaced by the object element that loads expressinstall.swf
								obj.style.display = "none";
								(function(){
										if (obj.readyState == 4) {
												obj.parentNode.removeChild(obj);
										}
										else {
												setTimeout(arguments.callee, 10);
										}
								})();
						}
						createSWF(att, par, replaceElemIdStr);
				}
		}

		/* Functions to abstract and display alternative content
		*/
		function displayAltContent(obj) {
				if (ua.ie && ua.win && obj.readyState != 4) {
						// IE only: when a SWF is loading (AND: not available in cache) wait for the readyState of the object element to become 4 before removing it,
						// because you cannot properly cancel a loading SWF file without breaking browser load references, also obj.onreadystatechange doesn't work
						var el = createElement("div");
						obj.parentNode.insertBefore(el, obj); // insert placeholder div that will be replaced by the alternative content
						el.parentNode.replaceChild(abstractAltContent(obj), el);
						obj.style.display = "none";
						(function(){
								if (obj.readyState == 4) {
										obj.parentNode.removeChild(obj);
								}
								else {
										setTimeout(arguments.callee, 10);
								}
						})();
				}
				else {
						obj.parentNode.replaceChild(abstractAltContent(obj), obj);
				}
		}

		function abstractAltContent(obj) {
				var ac = createElement("div");
				if (ua.win && ua.ie) {
						ac.innerHTML = obj.innerHTML;
				}
				else {
						var nestedObj = obj.getElementsByTagName(OBJECT)[0];
						if (nestedObj) {
								var c = nestedObj.childNodes;
								if (c) {
										var cl = c.length;
										for (var i = 0; i < cl; i++) {
												if (!(c[i].nodeType == 1 && c[i].nodeName == "PARAM") && !(c[i].nodeType == 8)) {
														ac.appendChild(c[i].cloneNode(true));
												}
										}
								}
						}
				}
				return ac;
		}

		/* Cross-browser dynamic SWF creation
		*/
		function createSWF(attObj, parObj, id) {
				var r, el = getElementById(id);
				if (ua.wk && ua.wk < 312) {return r;}
				if (el) {
						if (typeof attObj.id == UNDEF) { // if no 'id' is defined for the object element, it will inherit the 'id' from the alternative content
								attObj.id = el.id;
						}
						if (ua.ie && ua.win) { // Internet Explorer + the HTML object element + W3C DOM methods do not combine: fall back to outerHTML
								var att = "";
								for (var i in attObj) {
										if (attObj[i] != Object.prototype[i]) { // filter out prototype additions from other potential libraries
												if (i.toLowerCase() == "data") {
														parObj.movie = attObj[i];
												}
												else if (i.toLowerCase() == "styleclass") { // 'class' is an ECMA4 reserved keyword
														att += ' class="' + attObj[i] + '"';
												}
												else if (i.toLowerCase() != "classid") {
														att += ' ' + i + '="' + attObj[i] + '"';
												}
										}
								}
								var par = "";
								for (var j in parObj) {
										if (parObj[j] != Object.prototype[j]) { // filter out prototype additions from other potential libraries
												par += '<param name="' + j + '" value="' + parObj[j] + '" />';
										}
								}
								el.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + att + '>' + par + '</object>';
								objIdArr[objIdArr.length] = attObj.id; // stored to fix object 'leaks' on unload (dynamic publishing only)
								r = getElementById(attObj.id);
						}
						else { // well-behaving browsers
								var o = createElement(OBJECT);
								o.setAttribute("type", FLASH_MIME_TYPE);
								for (var m in attObj) {
										if (attObj[m] != Object.prototype[m]) { // filter out prototype additions from other potential libraries
												if (m.toLowerCase() == "styleclass") { // 'class' is an ECMA4 reserved keyword
														o.setAttribute("class", attObj[m]);
												}
												else if (m.toLowerCase() != "classid") { // filter out IE specific attribute
														o.setAttribute(m, attObj[m]);
												}
										}
								}
								for (var n in parObj) {
										if (parObj[n] != Object.prototype[n] && n.toLowerCase() != "movie") { // filter out prototype additions from other potential libraries and IE specific param element
												createObjParam(o, n, parObj[n]);
										}
								}
								el.parentNode.replaceChild(o, el);
								r = o;
						}
				}
				return r;
		}

		function createObjParam(el, pName, pValue) {
				var p = createElement("param");
				p.setAttribute("name", pName);
				p.setAttribute("value", pValue);
				el.appendChild(p);
		}

		/* Cross-browser SWF removal
				- Especially needed to safely and completely remove a SWF in Internet Explorer
		*/
		function removeSWF(id) {
				var obj = getElementById(id);
				if (obj && obj.nodeName == "OBJECT") {
						if (ua.ie && ua.win) {
								obj.style.display = "none";
								(function(){
										if (obj.readyState == 4) {
												removeObjectInIE(id);
										}
										else {
												setTimeout(arguments.callee, 10);
										}
								})();
						}
						else {
								obj.parentNode.removeChild(obj);
						}
				}
		}

		function removeObjectInIE(id) {
				var obj = getElementById(id);
				if (obj) {
						for (var i in obj) {
								if (typeof obj[i] == "function") {
										obj[i] = null;
								}
						}
						obj.parentNode.removeChild(obj);
				}
		}

		/* Functions to optimize JavaScript compression
		*/
		function getElementById(id) {
				var el = null;
				try {
						el = doc.getElementById(id);
				}
				catch (e) {}
				return el;
		}

		function createElement(el) {
				return doc.createElement(el);
		}

		/* Updated attachEvent function for Internet Explorer
				- Stores attachEvent information in an Array, so on unload the detachEvent functions can be called to avoid memory leaks
		*/
		function addListener(target, eventType, fn) {
				target.attachEvent(eventType, fn);
				listenersArr[listenersArr.length] = [target, eventType, fn];
		}

		/* Flash Player and SWF content version matching
		*/
		function hasPlayerVersion(rv) {
				var pv = ua.pv, v = rv.split(".");
				v[0] = parseInt(v[0], 10);
				v[1] = parseInt(v[1], 10) || 0; // supports short notation, e.g. "9" instead of "9.0.0"
				v[2] = parseInt(v[2], 10) || 0;
				return (pv[0] > v[0] || (pv[0] == v[0] && pv[1] > v[1]) || (pv[0] == v[0] && pv[1] == v[1] && pv[2] >= v[2])) ? true : false;
		}

		/* Cross-browser dynamic CSS creation
				- Based on Bobby van der Sluis' solution: http://www.bobbyvandersluis.com/articles/dynamicCSS.php
		*/
		function createCSS(sel, decl, media, newStyle) {
				if (ua.ie && ua.mac) {return;}
				var h = doc.getElementsByTagName("head")[0];
				if (!h) {return;} // to also support badly authored HTML pages that lack a head element
				var m = (media && typeof media == "string") ? media : "screen";
				if (newStyle) {
						dynamicStylesheet = null;
						dynamicStylesheetMedia = null;
				}
				if (!dynamicStylesheet || dynamicStylesheetMedia != m) {
						// create dynamic stylesheet + get a global reference to it
						var s = createElement("style");
						s.setAttribute("type", "text/css");
						s.setAttribute("media", m);
						dynamicStylesheet = h.appendChild(s);
						if (ua.ie && ua.win && typeof doc.styleSheets != UNDEF && doc.styleSheets.length > 0) {
								dynamicStylesheet = doc.styleSheets[doc.styleSheets.length - 1];
						}
						dynamicStylesheetMedia = m;
				}
				// add style rule
				if (ua.ie && ua.win) {
						if (dynamicStylesheet && typeof dynamicStylesheet.addRule == OBJECT) {
								dynamicStylesheet.addRule(sel, decl);
						}
				}
				else {
						if (dynamicStylesheet && typeof doc.createTextNode != UNDEF) {
								dynamicStylesheet.appendChild(doc.createTextNode(sel + " {" + decl + "}"));
						}
				}
		}

		function setVisibility(id, isVisible) {
				if (!autoHideShow) {return;}
				var v = isVisible ? "visible" : "hidden";
				if (isDomLoaded && getElementById(id)) {
						getElementById(id).style.visibility = v;
				}
				else {
						createCSS("#" + id, "visibility:" + v);
				}
		}

		/* Filter to avoid XSS attacks
		*/
		function urlEncodeIfNecessary(s) {
				var regex = /[\\\"<>\.;]/;
				var hasBadChars = regex.exec(s) != null;
				return hasBadChars && typeof encodeURIComponent != UNDEF ? encodeURIComponent(s) : s;
		}

		/* Release memory to avoid memory leaks caused by closures, fix hanging audio/video threads and force open sockets/NetConnections to disconnect (Internet Explorer only)
		*/
		var cleanup = function() {
				if (ua.ie && ua.win) {
						window.attachEvent("onunload", function() {
								// remove listeners to avoid memory leaks
								var ll = listenersArr.length;
								for (var i = 0; i < ll; i++) {
										listenersArr[i][0].detachEvent(listenersArr[i][1], listenersArr[i][2]);
								}
								// cleanup dynamically embedded objects to fix audio/video threads and force open sockets and NetConnections to disconnect
								var il = objIdArr.length;
								for (var j = 0; j < il; j++) {
										removeSWF(objIdArr[j]);
								}
								// cleanup library's main closures to avoid memory leaks
								for (var k in ua) {
										ua[k] = null;
								}
								ua = null;
								for (var l in swfobject) {
										swfobject[l] = null;
								}
								swfobject = null;
						});
				}
		}();

		return {
				/* Public API
						- Reference: http://code.google.com/p/swfobject/wiki/documentation
				*/
                                FusionChartsModified: true,

				registerObject: function(objectIdStr, swfVersionStr, xiSwfUrlStr, callbackFn, data) {
                                                var regObj = data || {};
						if (ua.w3 && objectIdStr && swfVersionStr) {
								regObj.id = objectIdStr;
								regObj.swfVersion = swfVersionStr;
								regObj.expressInstall = xiSwfUrlStr;
								regObj.callbackFn = callbackFn;
								regObj.userData = data;
								regObjArr[regObjArr.length] = regObj;
								setVisibility(objectIdStr, false);
						}
						else if (callbackFn) {
                                                                regObj.success = false;
                                                                regObj.id = objectIdStr;
								callbackFn(regObj);
						}
				},

				getObjectById: function(objectIdStr) {
						if (ua.w3) {
								return getObjectById(objectIdStr);
						}
				},

				embedSWF: function(swfUrlStr, replaceElemIdStr, widthStr, heightStr, swfVersionStr, xiSwfUrlStr, flashvarsObj, parObj, attObj, callbackFn, data) {
						var callbackObj = data || {};
                                                callbackObj.success = false;
                                                callbackObj.id = replaceElemIdStr;
						if (ua.w3 && !(ua.wk && ua.wk < 312) && swfUrlStr && replaceElemIdStr && widthStr && heightStr && swfVersionStr) {
								setVisibility(replaceElemIdStr, false);
								addDomLoadEvent(function() {
										widthStr += ""; // auto-convert to string
										heightStr += "";
										var att = {};
										if (attObj && typeof attObj === OBJECT) {
												for (var i in attObj) { // copy object to avoid the use of references, because web authors often reuse attObj for multiple SWFs
														att[i] = attObj[i];
												}
										}
										att.data = swfUrlStr;
										att.width = widthStr;
										att.height = heightStr;
										var par = {};
										if (parObj && typeof parObj === OBJECT) {
												for (var j in parObj) { // copy object to avoid the use of references, because web authors often reuse parObj for multiple SWFs
														par[j] = parObj[j];
												}
										}
										if (flashvarsObj && typeof flashvarsObj === OBJECT) {
												for (var k in flashvarsObj) { // copy object to avoid the use of references, because web authors often reuse flashvarsObj for multiple SWFs
														if (typeof par.flashvars != UNDEF) {
																par.flashvars += "&" + k + "=" + flashvarsObj[k];
														}
														else {
																par.flashvars = k + "=" + flashvarsObj[k];
														}
												}
										}
										if (hasPlayerVersion(swfVersionStr)) { // create SWF
												var obj = createSWF(att, par, replaceElemIdStr);
												if (att.id == replaceElemIdStr) {
														setVisibility(replaceElemIdStr, true);
												}
												callbackObj.success = true;
												callbackObj.ref = obj;
										}
										else if (xiSwfUrlStr && canExpressInstall()) { // show Adobe Express Install
												att.data = xiSwfUrlStr;
												showExpressInstall(att, par, replaceElemIdStr, callbackFn);
												return;
										}
										else { // show alternative content
												setVisibility(replaceElemIdStr, true);
										}
										if (callbackFn) {callbackFn(callbackObj);}
								});
						}
						else if (callbackFn) {callbackFn(callbackObj);}
				},

				switchOffAutoHideShow: function() {
						autoHideShow = false;
				},

				ua: ua,

				getFlashPlayerVersion: function() {
						return {major:ua.pv[0], minor:ua.pv[1], release:ua.pv[2]};
				},

				hasFlashPlayerVersion: hasPlayerVersion,

				createSWF: function(attObj, parObj, replaceElemIdStr) {
						if (ua.w3) {
								return createSWF(attObj, parObj, replaceElemIdStr);
						}
						else {
								return undefined;
						}
				},

				showExpressInstall: function(att, par, replaceElemIdStr, callbackFn) {
						if (ua.w3 && canExpressInstall()) {
								showExpressInstall(att, par, replaceElemIdStr, callbackFn);
						}
				},

				removeSWF: function(objElemIdStr) {
						if (ua.w3) {
								removeSWF(objElemIdStr);
						}
				},

				createCSS: function(selStr, declStr, mediaStr, newStyleBoolean) {
						if (ua.w3) {
								createCSS(selStr, declStr, mediaStr, newStyleBoolean);
						}
				},

				addDomLoadEvent: addDomLoadEvent,

				addLoadEvent: addLoadEvent,

				getQueryParamValue: function(param) {
						var q = doc.location.search || doc.location.hash;
						if (q) {
								if (/\?/.test(q)) {q = q.split("?")[1];} // strip question mark
								if (param == null) {
										return urlEncodeIfNecessary(q);
								}
								var pairs = q.split("&");
								for (var i = 0; i < pairs.length; i++) {
										if (pairs[i].substring(0, pairs[i].indexOf("=")) == param) {
												return urlEncodeIfNecessary(pairs[i].substring((pairs[i].indexOf("=") + 1)));
										}
								}
						}
						return "";
				},

				// For internal usage only
				expressInstallCallback: function() {
						if (isExpressInstallActive) {
								var obj = getElementById(EXPRESS_INSTALL_ID);
								if (obj && storedAltContent) {
										obj.parentNode.replaceChild(storedAltContent, obj);
										if (storedAltContentId) {
												setVisibility(storedAltContentId, true);
												if (ua.ie && ua.win) {storedAltContent.style.display = "block";}
										}
										if (storedCallbackFn) {storedCallbackFn(storedCallbackObj);}
								}
								isExpressInstallActive = false;
						}
				}
		};
}();
/*jslint white: true, browser: true, windows: true, forin: true,  undef: true,
    plusplus: true, bitwise: true, immed: true */
/*global Array: false, FusionCharts, window: false,
    FusionChartsDataFormats: false */

/**
 * Flash Renderer Module
 * This module is to add functionalities and interfaces for Flash-based
 * FusionCharts rendering.
 *
 * @include swfobject JavaScript Library to perform managed renedring of Flash
 * media objects.
 *
 * @since 1.0
 */
FusionCharts(['private', 'modules.renderer.flash', function () {

    var global = this,
        win = window,
        doc = document,

        OBJECT = 'object',
        STRING = 'string',
        FUNCTION = 'function',

        isFunction = function (obj) {
            return (typeof obj === FUNCTION);
        },

        urlEncode = win.encodeURIComponent ? function (str) {
            return win.encodeURIComponent(str);
        } : function (str) {
            return win.escape(str);
        };

    // Fix for Firefox 4 dotted outline issue.
    try {
        global.swfobject = win.swfobject;
        win.swfobject.createCSS('object.FusionCharts:focus, embed.FusionCharts:focus',
            'outline: none');
    }
    catch (err) { } // Suppress any error caused.

    // Set flags for minimum version of flash-player needed.
    global.core.options.requiredFlashPlayerVersion = '8';
    // The redirection URL
    global.core.options.flashInstallerUrl = 'http://get.adobe.com/flashplayer/';
    // Message to show upon auto install redirect.
    global.core.options.installRedirectMessage = 'You need Adobe Flash ' +
        'Player 8 (or above) to view the charts on this page. It is a free, ' +
        'lightweight and safe installation from Adobe Systems Incorporated.' +
        '\n\nWould you like to go to Adobe\'s website and install Flash Player?';

    /**
     * This method will check whether the browser has the requared
     * flash player version
     * @param {string} version [optional] the minimum version of the
     * flash player that is requared
     * @return {boolean} true if the browser has equal or greter version
     */
    global.core.hasRequiredFlashVersion = function (version) {
        //if no version is provided then check for the FusionCharts
        //minimum requared version
        if (typeof version === 'undefined') {
            version = global.core.options.requiredFlashPlayerVersion;
        }
        // Check flash version.
        return win.swfobject ?
            win.swfobject.hasFlashPlayerVersion(version) : undefined;
    };

    /**
     * Flag that keeps track whether the user has been once notified that Flash
     * is absent. This flag is checked before notifying users, in order to
     * prevent duplicate notifications on every chart.
     * @type boolan
     */
    var noFlashRedirectNotified = false,

        // Regular expression to match whether a right trimmedstring ends with
        // percentage sign or not.
        isPercentRegex = /.*?\%\s*?$/g,

        // List of flashVars that needs to be always encoded
        alwaysEncodedFlashVars = {
            chartWidth: true,
            chartHeight: true,
            mapWidth: true,
            mapHeight: true
        },


    // TODO: Not Implemented.
    probeParamsFromDOM = function (id) {
        // Get reference to the HTMLNode from the id that has been sent. To
        // ensure that object/embed elements are properly located, we use the
        // swfobject's getObjectById method.
        var ref = win.swfobject.getObjectById(id), i, l, paramName, tags,
        params = {}, parent, vars, attrs = {};

        // We test whether an object was located or not.
        if (!ref && typeof ref.tagName !== STRING) {
            return undefined;
        }

        // Get the parentNode as container. For that we first test whether the
        // object has a parentNode or not. It has to be really really wierd to
        // not have a parentNode and yet reach this point in code. Still, we
        // do a check.
        if ((parent = ref.parentNode) && parent.tagName &&
            parent.tagName.toLowerCase() === OBJECT && parent.parentNode) {
            // When we know that the parentNode of the object exists, we need to
            // check whether it is an embed element within object element.
            parent = parent.parentNode;
        }
        if (!parent) {
            return undefined;
        }
        params.renderAt = parent;

        // Get flashVars. First check whether there is any attribute within
        // the root tag named as flashVars as because this is the syntax for
        // <embed> tag.
        if (!(ref.tagName.toLowerCase() !== OBJECT && ref.getAttribute &&
            (vars = ref.getAttribute('flashvars') || '')) && ref.hasChildNodes &&
        ref.hasChildNodes()) {
            // When flashvars attribute is not found, we try to iterate through
            // the childnodes to find the <param> node that contains the
            // flashVars.
            tags = ref.childNodes;
            for (i = 0, l = tags.length; i < l; i += 1) {
                if (tags[i].tagName === 'PARAM' &&
                    (paramName = tags[i].getAttribute('name')) &&
                    paramName.toLowerCase() === 'flashvars') {
                    vars = tags[i].getAttribute('value') || '';
                }
            }
        }

        // Convert the flashVars attribute into flashVars object:
        // Split the attribute string with = and &. Then put the odd indices
        // as keys and evens as values
        if (vars && isFunction(vars.toString)) {
            vars = vars.split(/\=|&/g);
            params.flashVars = {};
            for (i = 0, l = vars.length; i < l; i += 2) {
                params.flashVars[vars[i]] = vars[i + 1];
            }
        }
        return params;

    },

    /**
     * Event listener that updates local chart data when there has
     * been a remote data update on renderer.
     */
    syncDataStore =  function (e, a) {

        // Verify whether the event has been raised by JS or by Flash.
        // If event has been raised by JS, we do not need to do
        // anything further.
        // TODO: Filter out non-internal data-load event.
        if (a && a.source === 'XmlHttpRequest') {
            return;
        }

        // Reference to chartObj.
        var obj = e.sender;

        // Test whether the required functions are available.
        if (obj.ref && isFunction(obj.ref.dataInvokedOnSWF) &&
            obj.ref.dataInvokedOnSWF() && isFunction(obj.ref.getXML)) {

            // Raise a warning for the same.
            global.raiseWarning(obj, '08300116', 'run',
                '::DataHandler~__fusioncharts_vars',
                'Data was set in UTF unsafe manner');

            // Silently update/sync the internal data of FusionCharts JS
            // objects with the new data that was directly sent to flash.
            obj.setChartData(win.unescape(e.sender.ref.getXML({
                escaped: true
            })), FusionChartsDataFormats.XML, true);

            // Update the flashVars as well.
            obj.flashVars.dataXML = obj.getChartData(FusionChartsDataFormats.XML);

            // Since further data communication involves the presence of
            // data-xml in state, we remove the dataURL from flashVars and
            // keep XML fetched from chart.
            delete obj.flashVars.dataURL;
        }

        // Remove ebent handler association so that normal dataLoad is not
        // intercepted.
        e.sender.removeEventListener('DataLoaded', syncDataStore);
    };


    // This code-block exposes a function that assists FusionCharts swf objects
    // to receive updated and accurate dimension information in case of
    // percentage size.
    win.__fusioncharts_dimension = (function () {

        // No point documenting this piece of unreadable code! In short, it
        // simply calculates the width of the chart based on the offsetWidth of
        // the container. Same is for height.
        return function (id) {
            var obj,
                parent;

            return !((obj = global.core(id)) instanceof global.core &&
                obj.ref && (parent = obj.ref.parentNode)) ? {} : {
                    width: parent.offsetWidth * (isPercentRegex.test(obj.width) ?
                        parseInt(obj.width, 10) / 100 : 1),
                    height: parent.offsetHeight * (isPercentRegex.test(obj.height) ?
                        parseInt(obj.height, 10) / 100 : 1)
                };
            };
    }());

    // Routines to manage state between SWF and FusionCharts JS Object
    win.__fusioncharts_vars = function (id, vars) {

        var obj = global.core.items[id], params, ref;

        // Verify whether corresponding FusionCharts object exists.
        if (!(obj instanceof global.core)) {
            // We check whether a flash movie was loaded by html-embed
            // method and we accordingly absorb it in our JS.
            setTimeout(function () {
                if (id !== undefined && (params = probeParamsFromDOM(id))) {/*
                    // Reference to DOM object for sending "ref" value to the
                    // renderer.
                    ref = window.swfobject.getObjectById(id);

                    // Mark in the parameters that this item was created using
                    // HTMLEmbed Injection.
                    params.htmlEmbedInjection = true;
                    // Create a new FusionCharts object from the parameters that
                    // has been probed.
                    new global.core(params);
                    // Register this object with swfObject routines.
                    window.swfobject.registerObject(id,
                        global.core.options.requiredFlashPlayerVersion, undefined,
                        global.renderer.notifyRender);*/
                }
                else {
                    // Throw error when FusionCharts obj not found.
                    global.raiseError(global.core, '25081621', 'run', '::FlashRenderer',
                        'FusionCharts Flash object is accessing flashVars of non-existent object.');
                }
            }, 0);

            return false;
        }

        // When 'vars' parameter is sent, we sync the local vars object
        if (typeof vars === OBJECT) {

            // We check whether there was a direct update of data on SWF. In
            // case it is true, we proceed with datastore sync.
            if (obj.ref && isFunction(obj.ref.dataInvokedOnSWF) &&
                obj.ref.dataInvokedOnSWF()) {

                // In case dataURL has been updated, we probe into an event that
                // updates local dataStore
                if (vars.dataURL !== undefined) {
                    obj.addEventListener('DataLoaded', syncDataStore);
                }
                // Specifically unescape the dataXML updated
                else if (vars.dataXML !== undefined) {
                    vars.dataXML = win.unescape(vars.dataXML);
                }

                obj.__state.flashUpdatedFlashVars = true;
            }
            else {
                // Clear data related variables to prevent sync with local
                // store.
                delete vars.dataURL;
                delete vars.dataXML;
            }

            // If corresponding FusionCharts object is found, we update the
            // vars.
            global.extend(obj.flashVars, vars);

            return true;
        }

        // Here we check whether data was set during construction, requires
        // special handling.
        if (obj.__state.dataSetDuringConstruction &&
                obj.flashVars.dataXML === undefined &&
                obj.options.dataSource !== undefined &&
                typeof obj.options.dataFormat === STRING) {

            obj.flashVars.dataXML = obj.options.dataSource;
        }
        obj.__state.flashInvokedFlashVarsRequest = true;
        return obj.flashVars;
    };


    // Bind EventTarget with the FusionCharts global event handler
    win.__fusioncharts_event = function (event, args) {
        // Create an abstraction layer so that the try-catch / error suppression
        // of flash can be avoided.
        setTimeout(function () {
            global.raiseEvent(event.type, args, global.core.items[event.sender]);
        }, 0);
    };

    var onBeforeInitialize = function (event) {
        // Get short reference to the event sender.
        var obj = event.sender;

        // Filter objects that are generated by flash renderer only.
        if (obj.options.renderer !== 'flash') {
            return;
        }

        // Prevention is better than cure. So is precaution!
        if (obj.width === undefined) {
            obj.width = global.renderer.policies.flashVars.chartWidth[1];
        }
        if (obj.height === undefined) {
            obj.height = global.renderer.policies.flashVars.chartHeight[1];
        }
        if (obj.flashVars.DOMId === undefined) {
            obj.flashVars.DOMId = obj.id;
        }

        // Default flashVars that are to be set.
        global.extend(obj.flashVars, {
            registerWithJS: '1',
            chartWidth: obj.width,
            chartHeight: obj.height,
            InvalidXMLText: 'Invalid data.'
        });

        // AutoInstallRedirect action routine.
        if (Boolean(obj.options.autoInstallRedirect) === true &&
                !win.swfobject.hasFlashPlayerVersion(
                global.core.options.requiredFlashPlayerVersion.toString()) &&
                noFlashRedirectNotified === false) {
            noFlashRedirectNotified = true;
            if (global.core.options.installRedirectMessage &&
                win.confirm(global.core.options.installRedirectMessage)) {
                win.location.href = global.core.options.flashInstallerUrl;
            }
        }

        // Set initial state of charts
        if (obj.options.dataFormat === undefined &&
                obj.options.dataSource === undefined) {
            obj.options.dataFormat = FusionChartsDataFormats.XMLURL;
            obj.options.dataSource = 'Data.xml';
        }
    };

    var renderer = {
        // Default data format supported by this renderer
        dataFormat: 'xml',

        init: function () {
            // When this renderer is invoked for the first time (init) we attach
            // the construction event handler.
            global.addEventListener('BeforeInitialize', onBeforeInitialize);
        },

        policies: {
            // Add construction policies specific to ActiveX parameters.
            params: {
                scaleMode: ['scaleMode', 'noScale'],
                scale: ['scaleMode', 'noScale'],
                wMode: ['wMode', 'opaque'],
                menu: ['menu', undefined],
                bgColor: ['backgroundColor', '#ffffff'],
                allowScriptAccess: ['allowScriptAccess', 'always'],
                quality: ['quality', 'best'],
                swLiveConnect: ['swLiveConnect', undefined],
                base: ['base', undefined],
                align: ['align', undefined],
                salign: ['sAlign', undefined]
            },
            /**
             * @var vars {object} Contains all the veriables that are local to every
             * renderer. This has a direct implication to the FlashVars of the
             * 'flash' renderer.
             */
            flashVars: {
                lang: ['lang', 'EN'],
                debugMode: ['debugMode', undefined],
                scaleMode: ['scaleMode', 'noScale'], // Issue #1440
                // @note: Deprecated and hardcoded in beforeinitialize event.
                // registerWithJS: ['registerWithJS', '1'],
                animation: ['animate', undefined]
            },

            options: {
                autoInstallRedirect: ['autoInstallRedirect', false],
                useLegacyXMLTransport: ['_useLegacyXMLTransport', false]
            }
        },

        render: function (container, callBack) {

            // Remove the 'animation' flag of the chart.
            if (Boolean(this.flashVars.animation) === true) {
                delete this.flashVars.animation;
            }

            // Check for valid 'src' attribute
            if (!this.src) {
                global.raiseError(this, '03102348', 'run', '::FlashRenderer.render',
                    'Could not find a valid "src" attribute. swfUrl or chart ' +
                    'type missing.');
            }

            // Copy the flashVars and encodeURIComponent all of them before
            // sending to swfObject
            var encodedVars = {},
                dataXML = this.flashVars.dataXML,
                dataURL = this.flashVars.dataURL,
                item,
                swfoData;
            global.extend(encodedVars, this.flashVars);

            // For backward compatibility, set the flashVar to have reference
            // to xml or xmlurl in case render is called while the charts are
            // flagged to be stalled.
            if (this.flashVars.stallLoad === true) {
                if (this.options.dataFormat === FusionChartsDataFormats.XML) {
                    dataXML = this.options.dataSource;
                }
                if (this.options.dataFormat === FusionChartsDataFormats.XMLURL) {
                    dataURL = this.options.dataSource;
                }
            }
            // Check if debugMode has been pre-enabled.
            if (global.core.debugMode.enabled() && global.core.debugMode.syncStateWithCharts &&
                encodedVars.debugMode === undefined && this.options.safeMode) {
                encodedVars.debugMode = '1';
            }

            // Store a copy of the currently rendered src value for later
            // use while comparing during update.
            this.__state.lastRenderedSrc = this.src;

            // Encode dataXML and dataURL
            encodedVars.dataXML = urlEncode(dataXML) || '';
            // check XSS before saving URL request.
            if (global.isXSSSafe(dataURL)) {
                encodedVars.dataURL = dataURL || '';
            }
            else {
                encodedVars.dataURL = urlEncode(dataURL) || '';
            }

            // Encode width and height in case they have percentage.
            for (item in alwaysEncodedFlashVars) {
                if (encodedVars.hasOwnProperty(item)) {
                    encodedVars[item] = urlEncode(encodedVars[item]);
                }
            }

            // Check for the presence of swfobject in window scope. It should be present
            // either provided externally by user or as part of stitched build.
            if (!(win.swfobject && win.swfobject.embedSWF && win.swfobject.FusionChartsModified))  {
                win.swfobject = global.swfobject;
            }

            // Prepare aditional renderer data that will be smoothly passed on
            // via callback.
            // Suppress raising error when no install redirect message has been
            // shown.
            if (noFlashRedirectNotified && !global.core.options.installRedirectMessage) {
                swfoData = {silent: true};
            }

            if (win.swfobject && win.swfobject.embedSWF) {
                // Call swfobject API to render the chart
                win.swfobject.embedSWF(this.src, container.id, this.width,
                    this.height, global.core.options.requiredFlashPlayerVersion,
                    undefined, encodedVars, this.params, this.attributes,
                    callBack, swfoData);
            }
            else {
                global.raiseError(this, '1113061611', 'run', 'FlashRenderer~render',
                    Error('Could not find swfobject library or embedSWF API'));
            }
        },

        // Listen to the dataUpdated event, so that charts can be re-rendered with
        // new data, when data is updated on JS variable post render
        update: function (vars) {
            // Point to direct SWFObject and also get the latest data
            var chart = this.ref, data = vars.data;

            // When updating states that dataXML has been updated
            // Update FlashVars
            this.flashVars.dataXML = data;

            // Check whether there was an error or not.
            if (vars.error === undefined) {
                // Call ExternalInterface method and update the data
                if (this.isActive() && isFunction(chart.setDataXML)) {
                    // Check whether the chart-type has changed since last update.
                    // If yes then we re-render the chart.
                    if (this.src !== this.__state.lastRenderedSrc) {
                        this.render();
                    }
                    else {
                        chart.setDataXML(data, false);
                    }
                }
                else {
                    // Remove the 'animation' flag of the chart while data was
                    // updated during unavailability of SWF
                    delete this.flashVars.dataURL;
                    delete this.flashVars.animation;
                }
            }
            // Show error message.
            else {
                // Call ExternalInterface method to show message
                if (this.isActive() && isFunction(chart.showChartMessage)) {
                    chart.showChartMessage('InvalidXMLText');
                }
                else {
                    // Remove the 'animation' flag of the chart while data was
                    // updated during unavailability of SWF
                    this.flashVars.dataXML = '<Invalid' + vars.format.toUpperCase() + '>';
                    delete this.flashVars.dataURL;
                    delete this.flashVars.animation;
                }
            }
        },

        // Handle renderer resize.
        resize: function () {
            // Updated flashVars with new dimension
            this.flashVars.chartWidth = this.width;
            this.flashVars.chartHeight = this.height;

            if (this.ref !== undefined) {
                // Set sizes of DOM elements.
                this.ref.width = this.width;
                this.ref.height = this.height;
                if (isFunction(this.ref.resize)) {
                    // Force resize on charts.
                    this.ref.resize(this.ref.offsetWidth, this.ref.offsetHeight);
                }
            }
        },

        // Send chart configuration
        config: function (items) {
            global.extend(this.flashVars, items);
        },

        dispose: function () {
            var container;

            // Managed removal of chart using swfObject library
            win.swfobject.removeSWF(this.id);

            // Proceed with disposal only when the HTML element exists.
            if ((container = this.ref)) {
                // Delete DOM element
                if (container.parentNode) {
                    container.parentNode.removeChild(container);
                }

            }
        },

        protectedMethods: {
            flashVars: true,
            params: true,
            setDataXML: true,
            setDataURL: true,
            hasRendered: true,
            getXML: true,
            getDataAsCSV: true,
            print: true,
            exportChart: true
        },


        events: {
            Loaded: function (e) {

                var obj = e.sender;
                // Upon render completion, disable animation of the chart by updating the
                // 'animation' flag in flashVars. This fixes the issue of FusionCharts
                // loosing its state when it is re-rendered after being hidden.
                // Set disable animation flag for state management.
                obj.flashVars.animation = '0';
            },

            DataLoadRequested: function (event, args) {
                // Reference to event sender.
                var obj = event.sender,
                url = args.url,
                legacyTransport = false;

                // Do not use AJAX in case of local file protocol.
                if (args.dataFormat === FusionChartsDataFormats.XML && (
                    win.location.protocol === 'file:' && Boolean(obj.options.safeMode) ||
                    Boolean(obj.options.useLegacyXMLTransport))) {

                    if (obj.ref) {
                        if (obj.ref.setDataURL) {
                            obj.ref.setDataURL(url, false);
                        }
                        else {
                            global.raiseError(this, '0109112330', 'run',
                                '>FlashRenderer^DataLoadRequested',
                                Error('Unable to fetch URL due to security restriction on Flash Player. Update global security settings.'));
                        }
                    }
                    else {
                        // Update the flashVars with new URL
                        obj.flashVars.dataURL = url;
                    }

                    // Stop further activities on this event.
                    event.stopPropagation();

                    // Cancel the AJAX data-load request.
                    legacyTransport = true;
                    args.cancelDataLoadRequest();
                    obj.addEventListener('DataLoaded', syncDataStore);
                }

                // In case we have an active chart, we show the loading
                // message in chart itself.
                if (obj.ref && obj.showChartMessage) {
                    delete obj.flashVars.stallLoad;
                    if (obj.options.showDataLoadingMessage) {
                        obj.ref.showChartMessage('XMLLoadingText');
                    }
                }
                // In case chart object is not available, we set a flashvar saying that
                // loading is to be stalled.
                else if (!legacyTransport) {
                    obj.flashVars.stallLoad = true;
                }
            },

            DataLoadRequestCancelled: function (event) {
                // Reference to event sender.
                var obj = event.sender;

                // In case we have an active chart, we hide the loading message in chart
                // itself.
                if (obj.ref && isFunction(obj.showChartMessage)) {
                    obj.ref.showChartMessage();
                }
                // In case chart object is not available, we set a flashvar saying that
                // loading is to be stalled.
                delete obj.flashVars.stallLoad;
            },

            DataLoadError: function (event, args) {
                // Reference to event sender.
                var obj = event.sender;

                // On data load error, one needs to display "No Data To Display" on
                // charts.
                if (obj.ref && isFunction(obj.ref.showChartMessage) &&
                    args.source === 'XmlHttpRequest') {
                    // Show Data Load Error Message.
                    obj.ref.showChartMessage('LoadDataErrorText');
                }
                else {
                    delete obj.flashVars.dataURL;// = 'XmlHttpRequestDataLoadError: ' + args.url;
                    obj.flashVars.dataXML = '<JSON parsing error>';
                    delete obj.flashVars.stallLoad;
                }

            },

            DataLoadRequestCompleted: function (event, args) {
                // Reference to event sender.
                var obj = event.sender;

                // Process this event only when raised by AJAX data handler!
                if (args.source !== 'XmlHttpRequest') {
                    return;
                }

                // Clear load prevention flag.
                delete obj.flashVars.stallLoad;
            }
        }
    };

    // Add flash renderer legacy functions.
    renderer.prototype = {
        // Legacy function
        getSWFHTML: function () {

            // Create temporary elements and temporary access Id
            var outElm = doc.createElement('span'),
            inElm = doc.createElement('span'),
            tempId = 'RnVzaW9uQ2hhcnRz' + (new Date()).getTime();

            // Create DOM hierarchy
            outElm.appendChild(inElm);
            // Specify temp access Id
            inElm.setAttribute('id', tempId);
            // Hide this element from user.
            outElm.style.display = 'none';
            // Add the element to DOM.
            doc.getElementsByTagName('body')[0].appendChild(outElm);

            // Temporarily embed the swf in the above-created element.
            win.swfobject.embedSWF(this.src, tempId, this.width,
                this.height, '8.0.0', undefined, this.flashVars, this.params,
                this.attrs);

            // Get the HTML from the temp objects.
            var html = outElm.innerHTML.replace(tempId, this.id);

            // Clean up the dirty work.
            win.swfobject.removeSWF(tempId);
            outElm.parentNode.removeChild(outElm);

            // Return the HTML with its ID set to normal.
            return html;
        },

        // Add legacy setTransparent function
        setTransparent: function (transparency) {
            // Sets chart to transparent mode when isTransparent (wMode) is true
            // (default). When no parameter is passed, we assume transparent to
            // be true.
            if (typeof transparency !== 'boolean' && transparency !== null) {
                transparency = true;
            }

            // Set the property.
            this.params.wMode = transparency === null ? 'window' :
            (transparency === true ? 'transparent' : 'opaque');
        },

        registerObject: function () {

        },

        // Reference to deprecated "addVariable API"
        addVariable: function () {
            global.raiseWarning(this, '1012141919', 'run', 'FlashRenderer~addVariable()',
                'Use of deprecated "addVariable()". Replace with "configure()".');
            global.core.prototype.configure.apply(this, arguments);
        },

        /**
         * Legacy function that simply calls setDataXML on JS object.
         * @id FusionCharts.setDataXML
         *
         * @param {string} xml The data as string in FusionCharts compatible XML
         * format.
         *
         * @type void
         * @deprecated
         */
        setDataXML: function (xml) {
            global.raiseWarning(this, '11033001081', 'run', 'GenericRuntime~setDataXML()',
                'Use of deprecated "setDataXML()". Replace with "setXMLData()".');
            // Check whether the XML as parameter can be converted to
            // string or not and then send data to chart.
            if (xml === undefined || xml === null || !isFunction(xml.toString)) {
                // Notify using error event that invalid data was provided as xml.
                global.raiseError(this, '25081627', 'param', '~setDataXML',
                    'Invalid data type for parameter "xml"');
                return;
            }

            // We check whether the renderer has setDataXML function, we set it.
            if (this.ref === undefined || this.ref === null ||
                !isFunction(this.ref.setDataXML)) {
                this.setChartData(xml.toString(), FusionChartsDataFormats.XML);
            } else {
                // When direct XML updated API is available we use it to directly
                // do remote update of XML.
                this.ref.setDataXML(xml.toString());
            }

        },

        /**
         * @id FusionCharts.setDataURL
         *
         * @param {string} url
         *
         * @type void
         * @deprecated
         */
        setDataURL: function (url) {
            global.raiseWarning(this, '11033001082', 'run', 'GenericRuntime~setDataURL()',
                'Use of deprecated "setDataURL()". Replace with "setXMLUrl()".');
            // Check whether the URL as parameter can be converted to
            // string or not.
            if (url === undefined || url === null || !isFunction(url.toString)) {
                // Notify using error event that invalid data was provided as xml.
                global.raiseError(this, '25081724', 'param', '~setDataURL',
                    'Invalid data type for parameter "url"');
                return;
            }

            // We check whether the renderer has setDataURL function, we set it.
            if (this.ref === undefined || this.ref === null ||
                    !isFunction(this.ref.setDataURL)) {
                // For flash renderer, we set the flashVars, so that it is picked
                // up when chart renders.
                this.setChartData(url.toString(), FusionChartsDataFormats.XMLURL);
            } else {
                // When direct XML updated API is available we use it to directly
                // do remote update of XML.
                this.ref.setDataURL(url.toString());
            }
        }
    };

    // Add the renderer to FusionCharts core repository
    global.renderer.register('flash', renderer);
    // Set default renderer
    global.renderer.setDefault('flash');

}]);



/*jslint white: true, browser: true, windows: true, forin: true,  undef: true,
  plusplus: true, bitwise: true, immed: true */
/*global Array: false, FusionCharts, RegExp: false, jQuery: false, window: false,
  $: true, FusionChartsDataFormats: false, FC_Loaded,
  FC_DataLoaded, FC_Rendered, FC_DrawComplete */


/**
 * This is the JavaScript Renderer bootstrap. Its basic functionalities are to
 * create interfaces between FusionCharts JS Renderer Manager and the renderer.
 *
 * @since 1.0
 */

FusionCharts(['private', 'modules.renderer.js', function () {

    var
    global = this,
    win = window,
    doc = document,
    coreOptions = global.core.options,
    extendedCoreOptions = {
        html5ScriptNameSuffix:  '.js',
        html5ScriptNamePrefix: 'FusionCharts.HC.',
        jQuerySourceFileName: 'jquery.min.js'
    },

    /**
     * This flag sets whether the JavaScript renderer will be used primarily or
     * Flash renderer would be given priority if player exists.
     * @id SET_AS_PRIMARY_RENDERER
     * @type boolean
     * @const
     */
    SET_AS_PRIMARY_RENDERER = false,

    LOADER_CSS_TEXT = 'display: inline-block; *zoom:1; *display:inline; width: 100%; ' +
        'font-family: Verdana; font-size: 10px; color: #666666; text-align: center;',
    MODULE_NAME_BASE = 'modules.renderer.js-',

    isIE = /msie/i.test(navigator.userAgent) && !win.opera,
    hasSVG = !!doc.createElementNS && !!doc.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect,

    // Create the renderer object.
    renderer = function () {},

    // Create an object in global that would store Renderer Library
    lib = global.hcLib = {
        cmdQueue: []
    },

    moduleCmdQueue = lib.moduleCmdQueue = {
        jquery: [],
        base: [],
        charts: [],
        powercharts: [],
        widgets: [],
        maps: []
    },

    moduleDependencies = lib.moduleDependencies = {},

    /**
     * The enumeration of default filenames for each of the dependent
     * modules.
     * @type object
     * @constant
     */
    moduleMeta = lib.moduleMeta = {
        jquery: 'jquery.min.js',
        base: 'FusionCharts.HC.js',
        charts: 'FusionCharts.HC.Charts.js',
        powercharts: 'FusionCharts.HC.PowerCharts.js',
        widgets: 'FusionCharts.HC.Widgets.js',
        maps: 'FusionCharts.HC.Maps.js'
    },

    /**
     * Stores a list of modules that are blocked from loading.
     */
    blockedModules = {},

    /**
     * Find the relevant required module names from a given chart type.
     *
     * @param {string} type depermines the chart type (alias) that needs to
     * be looked up for dependent module names
     *
     * @type Array
     */
    getDependentModuleName = lib.getDependentModuleName = function (type) {
        var modules = [],
            i,
            j;

        for (i in moduleDependencies) {
            if ((j = moduleDependencies[i][type]) === undefined) {
                continue;
            }
            modules[j] = i;
        }

        return modules;
    },

    /**
     * Adds a dynamic dependency item
     */
    injectModuleDependency = lib.injectModuleDependency = function (module, alias, order) {
        var isInjected = false;

        if (alias === undefined) {
            alias = module;
        }

        if (!moduleDependencies[module]) {
            moduleDependencies[module] = {};
            if (!moduleCmdQueue[module]) {
                moduleCmdQueue[module] = [];
                lib.moduleMeta[module] = coreOptions.html5ScriptNamePrefix +
                        alias + coreOptions.html5ScriptNameSuffix;
            }
            isInjected = true;
        }
        moduleDependencies[module][alias] = order || 0;

        return isInjected; // indicate alias already injected
    },

    // Function that checks whether a particular module is loaded.
    hasModule = lib.hasModule = function (name) {
        var i, l;

        // In case we check presense of multiple modules.
        if (name instanceof Array) {
            for (i = 0, l = name.length; i < l; i += 1) {
                if (!Boolean(global.modules[MODULE_NAME_BASE + name]) ||
                        (name === 'jquery' && !Boolean(win.jQuery))) {
                    return false;
                }
            }
            return true;
        }

        // Do special check for jQuery as it does not declare a specific module
        if (name === 'jquery') {
            return Boolean(win.jQuery);
        }

        return Boolean(global.modules[MODULE_NAME_BASE + name]);
    },

    // Determine whether a chart-type needs a particular module.
    needsModule = lib.needsModule = function (name, type) {
        return (lib.moduleDependencies[name] &&
                lib.moduleDependencies[name][type]) !== undefined;
    },

    // Function to call the global loadScript function for loading an html5
    // module.
    loadModule = lib.loadModule = function (name, success, failure, source) {

        // convert single string to array of one string.
        if (!(name instanceof Array)) {
            name = [name];
        }


        var
        l = name.length,
        count = 0,
        loadFile = function () {

            // Proceed with callback when load completes.
            if (count >= l) {
                success && success();
                return;
            }

            var metaKey = name[count], meta = moduleMeta[metaKey], userSrc;

            // Increment counter.
            count += 1;

            if (!metaKey) {
                failure && failure(metaKey);
            }
            // Check if module already exists
            else if (hasModule(metaKey)) {
                loadFile();
                return;
            }
	    // Check if loading has been blocked. If yes, then assume that
            // module exists.
            else if (blockedModules[metaKey]) {
                global.raiseError(source || global.core,
                '1112201445A', 'run', 'JavaScriptRenderer~loadModule() ',
                'required resources are absent or blocked from loading.');
                failure && failure(metaKey);
                return;
            }

            // If user has overridden file names.
            userSrc = (metaKey === 'jquery') ? // handle jquery legacy
                global.core.options.jQuerySourceFileName :
            global.core.options['html5' + global.capitalizeString(metaKey) + 'Src'];

            global.loadScript(userSrc == undefined ? meta : userSrc, {
                success: function () {
                    // Even after successful load, we should check whether it
                    // actually loaded the module.
                    if (hasModule(metaKey)) {
                        loadFile();
                    }
                    else {
                        failure && failure(metaKey);
                    }
                },

                failure: failure && function () {
                    failure(metaKey);
                }
            }, undefined, true);
        };

        loadFile();
    },

    /**
     * Execute renderer interface commands that are queued due to renderer
     * not being ready.
     */
    executeWaitingCommands = lib.executeWaitingCommands = function (queue) {
        var item;

        // Iterate through all FusionCharts objects
        while ((item = queue.shift())) {
            // Now we execute 'command' on all charts that are waiting
            // for the renderer to get ready.
            if (typeof item === 'object') {
                renderer[item.cmd].apply(item.obj, item.args);
            }
        }

    },

    /**
     * Remove all waiting commands for a specific chart-object
     */
    cleanupWaitingCommands = lib.cleanupWaitingCommands = function (chart) {
        var type = chart.chartType(),
            modules = getDependentModuleName(type),
            module,
            requeue = [],
            queue,
            item;

        // Iterate through all modules that this chart is dependent on.
        while ((module = modules.shift())) {
            queue = moduleCmdQueue[module] || [];
            while ((item = queue.shift())) {
                // Check whether the scope object matches the one passed in params.
                if (typeof item === 'object' && item.obj !== chart) {
                    requeue.push(item);
                }
            }
            // Restore re-queued items back in queue
            queue.concat(requeue);
            requeue = [];
        }
    },

    clearStateEventHandler = function (event) {
        delete event.sender.jsVars._reflowData;
        event.sender.jsVars._reflowData = {};
        //delete reflowclean
        delete event.sender.jsVars._reflowClean;
    },

    // Messege configuration
    ChartMessage = function () {
        var api = function () {};
        api.prototype = {
            "LoadDataErrorText": 'Error in loading data.',
            "XMLLoadingText": 'Retrieving data. Please wait',
            "InvalidXMLText": 'Invalid data.',
            "ChartNoDataText": 'No data to display.',
            "ReadingDataText": 'Reading data. Please wait',
            "ChartNotSupported": 'Chart type not supported.',
            "PBarLoadingText": '',
            "LoadingText": 'Loading chart. Please wait',
            "RenderChartErrorText": 'Unable to render chart.'
        };
        return api.prototype.constructor = api;
    }(),

    showLoadingMessage = function (chart, container) {
        var vars = chart.jsVars,
            msgs = vars.msgStore;

        if (container && chart.options.showLoadingMessage) {
            // Show loading message as HTML block since HTML5 renderer is not
            // loaded yet.
            container.innerHTML = '<small style="'+ LOADER_CSS_TEXT +
                ' padding-top: ' +
                ((parseInt(container.style.height, 10) / 2) - 5) +'px">' +
                (msgs.PBarLoadingText || msgs.LoadingText) + '</small>';
            // Set the container's background color only when
            // transparent mode is not set.
            container.style.backgroundColor = vars.transparent ?
                'transparent' :
                (chart.options.containerBackgroundColor || '#ffffff');
        }
    };

    // Define default configuration options pertaining to HTML5 renderer.
    global.extend(global.core.options, extendedCoreOptions);

    // Create the renderer interface functions
    global.extend(renderer, {
        dataFormat: 'json',
        ready: false,

        policies: {
            jsVars: {
                // userModules: ['dependentModules', []] // enable if needed
            },
            options: {
                // Shows messages while chart is loading JS files.
                showLoadingMessage: ['showLoadingMessage', true]
            }
        },

        init: function () {
            /**
             * @algorithm
             * 1. Load external libraries (jQuery -> Renderer)
             * 2. After loading is completed, render the queued charts.
             */

            // jQuery MUST be loaded in order to proceed. (Include Once is set
            // to true in order to avoid loop.)
            if (!win.jQuery) {
                loadModule('jquery', function () {
                    // if jQuery was loaded by FusionCharts, we would like to
                    // set it to noConflict mode and then re-assign it to $
                    // value if no other script is using $.
                    jQuery.noConflict();
                    if (win.$ === undefined) {
                        win.$ = jQuery;
                    }

                    // call init again after jQuery is loaded.
                    renderer.init();
                }, undefined, global.core);
                return;
            }

            // Now that jQuery exists, we know that 'base' has to be loaded. Had
            // base been loaded, this function would not have had existed.
            if (!hasModule('base')) {
                loadModule('base', function () {
                    // All scripts are loaded, hence renderer is ready
                    renderer.ready = true;

                    // Clear any object that has been waiting for render
                    executeWaitingCommands(lib.cmdQueue);
                }, undefined, global.core);
                return;
            }

            // If code is here, implies renderer is ready
            renderer.ready = true;
        },

        // This is almost a stub render function as its job is to queue objects.
        render: function (container) {

            // Show message in HTML form
            showLoadingMessage(this, container);

            // As renderer is not ready, push it to queue
            lib.cmdQueue.push({
                cmd: 'render',
                obj: this,
                args: arguments
            });
        },

        update: function () {
            // As renderer is not ready, push it to queue
            lib.cmdQueue.push({
                cmd: 'update',
                obj: this,
                args: arguments
            });
        },

        resize: function () {
            lib.cmdQueue.push({
                cmd: 'resize',
                obj: this,
                args: arguments
            });
        },

        dispose: function () {
            var queue = lib.cmdQueue, i, l;
            // Since renderer is not ready, we clear the command queue
            for (i = 0, l = queue.length; i < l; i += 1) {
                // We remove commands specific to this particular object.
                if (queue[i].obj === this) {
                    queue.splice(i, 1);
                    l -= 1; // subtract length as item was removed
                    i -= 1;
                }
            }
        },

        load: function () {
            lib.cmdQueue.push({
                cmd: 'load',
                obj: this,
                args: arguments
            });
        },

        config: function (items, optionalValue) {
            var item,
                vars = this.jsVars,
                msgs = vars.msgStore,
                cfg = vars.cfgStore;

            if (typeof items === 'string' && arguments.length > 1) {
                item = items;
                items = {};
                items[item] = optionalValue;
            }

            // store data at respective places.
            for (item in items) {
                // if the config is part of chart messages, we store it there.
                if (msgs[item] !== undefined) {
                    msgs[item] = items[item];
                }
                // otherwise we store it to the config store.
                else {
                    cfg[item.toLowerCase()] = items[item];
                }
            }
        },

        protectedMethods: {
        },

        events: {
            BeforeInitialize: function (event) {
                var sender = event.sender,
                    vars = sender.jsVars,
                    chartType = this.chartType(),
                    userArg;

                vars.fcObj = sender;
                vars.msgStore = vars.msgStore || new ChartMessage();
                vars.cfgStore = vars.cfgStore || {};
                vars.previousDrawCount = -1;
                vars.drawCount = 0;
                vars._reflowData = {};

                // validate user-defined dependent module names
                if (!(vars.userModules instanceof Array)) {
                    userArg = vars.userModules;
                    vars.userModules = [];
                    if (typeof userArg === 'string') {
                        vars.userModules =
                            vars.userModules.concat(userArg.split(','));
                    }
                }

                // check presence of API
                if (!lib.chartAPI || !lib.chartAPI[chartType]) {
                    vars.needsLoaderCall = true;
                }
            },

            Initialized: function (event) {
                var chart = event.sender,
                    vars = chart.jsVars;

                if (vars.needsLoaderCall) {
                    delete vars.needsLoaderCall;
                    // Request load of the specific chart module
                    renderer.load.call(chart);
                }

            },

            BeforeDataUpdate: clearStateEventHandler,
            BeforeDispose: clearStateEventHandler,

            BeforeRender: function (event) {
                var chart = event.sender,
                    vars = chart.jsVars;

                delete vars.drLoadAttempted;
                delete vars.waitingModule;
                delete vars.waitingModuleError;

                clearStateEventHandler.apply(this, arguments);
            },

            DataLoadRequested: function (event, args) {

                // Reference to event sender.
                var obj = event.sender,
                vars = obj.jsVars;

                delete vars.loadError;

                // In case we have an active chart, we show the loading
                // message in chart itself.
                if (obj.ref && obj.options.showDataLoadingMessage) {
                    if (vars.hcObj && !vars.hasNativeMessage &&
                            vars.hcObj.showLoading) {
                        vars.hcObj.showMessage(vars.msgStore.XMLLoadingText);
                    }
                    else if (obj.ref.showChartMessage) {
                        obj.ref.showChartMessage('XMLLoadingText');
                    }
                    else {
                        vars.stallLoad = true;
                    }
                }
                else {
                    vars.stallLoad = true;
                }
            },

            DataLoadRequestCompleted: function (event) {
                // Reference to event sender.
                var obj = event.sender,
                vars = obj.id;

                // Clear load prevention flags.
                delete vars.stallLoad;
            },

            DataLoadError: function (event) {

                // Reference to event sender.
                var obj = event.sender,
                vars = obj.jsVars;

                // On data load error, one needs to display "No Data To Display"
                // on charts.
                delete vars.stallLoad;
                vars.loadError = true;
                if (obj.ref && typeof obj.ref.showChartMessage === 'function') {
                    obj.ref.showChartMessage('LoadDataErrorText');
                }
                clearStateEventHandler.apply(this, arguments);

            }

        },

        // Not required for interface, but needed for runtime definition of
        // chartAPI
        '_call': function (fn, args, scope) {
            fn.apply(scope || win, args || []);
        }
    });

    // Add functions that will be inherited by every chart instance created out
    // of this instance.
    global.extend(renderer.prototype, {
        getSWFHTML: function () {
            global.raiseWarning(this, '11090611381', 'run', 'JavaScriptRenderer~getSWFHTML()',
                'getSWFHTML() is not supported for JavaScript charts.');
        },

        addVariable: function () {
            global.raiseWarning(this, '11090611381', 'run', 'JavaScriptRenderer~addVariable()',
                'Use of deprecated "addVariable()". Replace with "configure()".');

            global.core.prototype.configure.apply(this, arguments);
        },

        getXML: function () {
            global.raiseWarning(this, '11171116291', 'run', 'JavaScriptRenderer~getXML()',
                'Use of deprecated "getXML()". Replace with "getXMLData()".');
            return this.getXMLData.apply(this, arguments);
        },


        setDataXML: function () {
            global.raiseWarning(this, '11171116292', 'run', 'JavaScriptRenderer~setDataXML()',
                'Use of deprecated "setDataXML()". Replace with "setXMLData()".');
            return this.setXMLData.apply(this, arguments);
        },

        setDataURL: function () {
            global.raiseWarning(this, '11171116293', 'run', 'JavaScriptRenderer~setDataURL()',
                'Use of deprecated "SetDataURL()". Replace with "setXMLUrl()".');
            return this.setXMLUrl.apply(this, arguments);
        },

        hasRendered: function () {
            return this.jsVars.hcObj && this.jsVars.hcObj.hasRendered;
        },

        setTransparent: function (transparency) {
            var vars;

            if (!(vars = this.jsVars)) {
                return;
            }

            // Sets chart to transparent mode when isTransparent (wMode) is true
            // (default). When no parameter is passed, we assume transparent to
            // be true.
            if (typeof transparency !== 'boolean' && transparency !== null) {
                transparency = true;
            }

            // Set the property.
            vars.transparent = transparency === null ? false :
                (transparency === true ? true : false);
        }

    })



    global.extend(global.core, {
        /**
         * Provide API for auto fall-back to JS chart when no flash is installed.
         */
        _fallbackJSChartWhenNoFlash: function () {
            // Check flash version.
            if (!win.swfobject.hasFlashPlayerVersion(global.core.options.requiredFlashPlayerVersion)) {
                // If flash version is missing, we fallback to javascript
                global.renderer.setDefault('javascript');
            }
        },

        /**
         * Specify to enable JavaScript renderer as default, based on browser
         * userAgent.
         * @param {string} str Is the regular expression used to detect browser
         * userAgent
         *
         * @note: Regexp for Apple Devices: /\(iPhone;|\(iPod;|\(iPad;/i
         */
        _enableJSChartsForSelectedBrowsers: function (str) {
            // str is a required parameter. If not set, we exit this function.
            if (str === undefined || str === null) {
                return;
            }

            // Register the js renderer in case we have iPad or iPhone and flash
            // for rest.
            global.renderer.setDefault((new RegExp(str).test(navigator.userAgent)) ? 'javascript' : 'flash');
        },

        /**
         * Let user specify not to load specific external scripts.
         * @param {object} flags is the object that specifies which external
         * script is not to be loadd.
         *
         * @example
         * // Prevent FusionCharts from loading its own jQuery
         * if (FusionCharts._doNotLoadHTML5ExternalScript) {
         * 		FusionCharts._doNotLoadHTML5ExternalScript({ jQuery: false })]
         * }
         */
        _doNotLoadExternalScript: function (flags) {
            var item, srcKey;
            for (item in flags) {
                srcKey = item.toLowerCase();
                if (moduleMeta[srcKey]) {
                    blockedModules[srcKey] = Boolean(flags[item]);
                }
            }
        },

        _preloadJSChartModule: function (name) {
            

            throw "NotImplemented()";
        }
    });

    // Add the renderer to FusionCharts core repository
    global.renderer.register('javascript', renderer);

    // In case JavaScript is configured to be set as primary renderer, check for
    // SVG support or IE browser.
    if (SET_AS_PRIMARY_RENDERER && (hasSVG || isIE)) {
        global.renderer.setDefault('javascript');
    }
    // Otherwise check for Flash support and finally fall back to JavaScript.
    else if (win.swfobject && win.swfobject.hasFlashPlayerVersion &&
        !win.swfobject.hasFlashPlayerVersion(global.core.options.requiredFlashPlayerVersion)) {
        global.raiseWarning(global.core, '1204111846', 'run', 'JSRenderer',
            'Switched to JavaScript as default rendering due to absence of required Flash Player.');
        // If flash version is missing, we fallback to javascript
        global.renderer.setDefault('javascript');
    }

}]);
/*jslint white: true, browser: true, windows: true, forin: true,  undef: true,
  eqeqeq: true, plusplus: true, bitwise: true, regexp: true, immed: true */

/*global FusionCharts */

/*members addDataHandler, data, decode, encode, error
*/

/**
 * -----------------------------------------------------------------------------
 * XML Data Handler Stub Module
 * -----------------------------------------------------------------------------
 * This module contains the XML transcoder. This module adds the 'XML' data
 * handler.
 */
(function () {

    // Register the module with FusionCharts.
    var global = FusionCharts(['private', 'XMLDataHandler']);
    // Check whether the module has been already registered. If true, then
    // do not bother to re-register.
    if (global === undefined) {
        return;
    }

    /**
     * Function to convert a variable into a FusionCharts data-handler API
     * compatible object.
     *
     * @param {variant} data can be anything.
     * @type object
     */
    var stubCoder = function (data) {
        // We do not need to normalize the data while encoding as because
        // the data is saved in JS scope and is now not sent via flashVars.
        return {
            data: data,
            error: undefined
        };
    };

    // Add Abstract data handler as because when the primary data-type is XML,
    // it requires a transparent transcoder that has nothing to do.
    global.addDataHandler('XML', {
        encode: stubCoder,
        decode: stubCoder
    });

}());



/*jslint evil: true, strict: false, regexp: false */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

var JSON;
if (!JSON) {
    JSON = {};
}

(function () {
    "use strict";

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                this.getUTCFullYear()     + '-' +
                f(this.getUTCMonth() + 1) + '-' +
                f(this.getUTCDate())      + 'T' +
                f(this.getUTCHours())     + ':' +
                f(this.getUTCMinutes())   + ':' +
                f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string' ? c :
                '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' : gap ?
                    '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
                    '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' : gap ?
                '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
                '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());/*jslint white: true, browser: true, windows: true, forin: true,  undef: true,
    eqeqeq: true, plusplus: true, bitwise: true, immed: true */
/*global Array: false, FusionCharts, RegExp: false, window: false */


/**
 * JSON Data-Handler Module
 * This module performs the routines involved to transcode FusionCharts XML and
 * JSON. The module depends upon json2.js component from json.org and the same
 * has been included
 *
 * @since 3.2
 * @build 2400
 */


(function () {

    // Register the module with FusionCharts.
    var global = FusionCharts(['private', 'JSON_DataHandler']);
    // Check whether the module has been already registered. If true, then
    // do not bother to re-register.
    if (global === undefined) {
        return;
    }

    if (window.JSON === undefined) {
        global.raiseError(this, '1113062012', 'run', 'JSONDataHandler',
            Error('Could not find library support for JSON parsing.'));

    }

    // Add policy to allow safe XML parsing in IE using XML Islands
    global.core.options.allowIESafeXMLParsing = ['_allowIESafeXMLParsing', true];


    var
    COMPACTDATAMODE = 'compactdatamode',
    STRING = 'string',
    FUNCTION = 'function',
    OBJECT = 'object',
    /**
     * Trims a long string at lightning fast speed of less than an ms!
     * @param {string} str is the string to be trimmed.
     * @type string
     */
    fastTrim = function (str) {
        str = str.replace(/^\s\s*/, '');
        var ws = /\s/, i = str.length;
        while (ws.test(str.charAt(i -= 1))) {}
        return str.slice(0, i + 1);
    },

    XSSEncode = function (s) {
        if (s === null || s === undefined || typeof s.toString !== FUNCTION) {
            return '';
        }

        // do we convert to numerical or html entity?
        s = s.toString()
            .replace(/&/g, '&amp;')
            .replace(/\'/g, '&#39;') //no HTML equivalent as &apos is not cross browser supported
            .replace(/\"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        return s;
    };

    var xml2json = (function () {

        var rules = {
            /**
             * @var {object} arr contains the nodeNames that are marked to be
             * expanded as an array.
             *
             * There are two ways of defining the type:
             * (a) in case the node is not constrained under a specific parent,
             * we simply specify <code>nodeName: true</code>
             *
             */
            arr: {
                set: true,
                trendlines: true,
                vtrendlines: true,
                line: {
                    trendlines: true,
                    vtrendlines: true
                },
                data: true,
                dataset: true,
                lineset : true,
                categories: true,
                category: true,

                //styles: true, // uncomment this to disable support for compact style syntax.
                linkeddata: true,

                // For application and definition, though we know that they are
                // always under <styles>, yet we cannot specify that here as these
                // two are in 'group' rule.
                application: true,
                definition: true,

                // PowerCharts group of rules
                axis: true,
                connectors: true,
                connector: {connectors: true},
                trendset: true,
                row: {rows: true},
                column: {columns: true},
                label: {labels: true},

                // Widgets specific rules
                color: {colorrange: true}, // +powercharts
                dial: {dials: true},
                pointer: {pointers: true},
                point: {trendpoints: true},

                process: {processes: true}, // gantt
                task: {tasks: true}, // gantt
                milestone: {milestones: true}, // gantt
                datacolumn: {datatable: true}, // gantt
                text: {datacolumn: true}, // gantt
                item: {legend: true}, // gantt

                alert: {alerts: true}, // alert manager

                groups: {annotations: true}, //annot
                items: {groups: true}, // annot

                // maps
                shapes: true,
                shape: {shapes: true},
                entitydef: true, // map
                entity: {entitydef: true}
            },

            /**
             * @var {object} tag contains nodeNames that are to be transformed
             * to a different nodeName as specified within this rule's meta.
             * @note supports comparison with base object.
             */
            tag: {
                chart: 'linkedchart',
                map: 'linkedmap',
                set: 'data',
                vline: {
                    chart: 'data',
                    graph: 'data', // legacy
                    dataset: 'data',
                    categories: 'category',
                    linkedchart: 'data'
                },
                apply: {
                    application: 'application'
                },
                style: {
                    definition: 'definition'
                },

                marker: { // map
                    application: 'application',
                    definition: 'definition'
                },
                entity: { // map
                    entitydef: 'entitydef',
                    data: 'data'
                },
                shape: { // map and powercharts
                    shapes: 'shapes'
                },
                connector: { // map and powercharts
                    connectors: {
                        chart: 'connector',
                        linkedchart: 'connector',
                        map: 'connectors',
                        linkedmap: 'connectors'
                    }
                },

                // annotations
                annotationgroup: {
                    annotations: 'groups'
                },
                annotation: {
                    groups: 'items'
                }
            },

            /**
             * @var {object} attr is the rule that defines the default
             * JSON variables to add in case a particular XML nodeName is found
             */
            attr: {
                vline: {
                    vline: 'true'
                }
            },

            /**
             * @var {object} ins contains nodeNames, that are treated as source
             * of attributes for a grand-child with same name as that of the
             * child.
             */
            ins: {
                chart: true,
                map: true,
                graph: true
            },

            /**
             * @var {object} dsv contains nodeNames that are specially expected
             * to be delimiter separated textnodes. Useful for "compactDataMode".
             */
            dsv: {
                dataset: 'data',
                categories: 'category'
            },

            /**
             * @var {object} text rule specifies the nodes that are always
             * treated as text node and appended to its parent with specified
             * name.
             *
             * When specified as an array, it denotes that the text values are
             * to be accumulated within a sibling array with specified name under
             * a specified parent.
             *
             * When enclosed in an object it specifies the parent restriction.
             *
             * NOTE: That for allowing text rule to work, to append it parent
             * we need to insert corresponding item in "group" rule.
             *
             * @code
             * nodeName: equivalentJSONKey // simple key: 'value' result
             */
            text: {
                target: 'target',
                value: 'value'
            },

            /**
             * @var {object} group specifies which are the tags that are to
             * be promoted/inserted into its parent node (as in rule meta).
             */
            group: {
                styles: {
                    definition: true,
                    application: true
                },
                chart: {
                    value: true, // widgets
                    target: true // widgets
                },
                graph: { // legacy
                    value: true, // legacy widgets
                    target: true // legacy widgets
                },
                linkedchart: {
                    value: true, // widgets
                    target: true // widgets
                },
                 // maps
                markers: {
                    definition: true,
                    application: true,
                    shapes: true,
                    connectors: true
                },
                map: {
                    entitydef: true,
                    data: true
                },
                linkedmap: {
                    entitydef: true,
                    data: true
                }
            }
        };

        var XML_CHILDNODE = 1, XML_TEXTNODE = 3;

        var parse = {
            append: function (childObj, obj, nodeName, parentNodeName) {
                // Before we append the childNode returned from the
                // previous recursion, we need to decide whether to
                // simply put that object with the nodeName as key, or
                // whether there is a qualification of 'arr' rule, by
                // which we push the data onto parent array.
                if (rules.arr[nodeName] && (rules.arr[nodeName] === true || rules.arr[nodeName][parentNodeName] === true)) {
                    if (!(obj[nodeName] instanceof Array)) {
                        obj[nodeName] = [];
                    }
                    obj[nodeName].push(childObj);
                }
                else {
                    obj[nodeName] = childObj;
                }
            },

            child: function (obj, children, parentNodeName, baseObj) {
                var i, nodeName, childNode, childObj, temp, rule;

                // Iterate through the children and parse it depending upon its
                // nodeType
                for (i = 0; i < children.length; i += 1) {

                    // Retain reference to the child node
                    childNode = children[i];

                    // Desensitize the case of the nodeName
                    nodeName = childNode.nodeName.toLowerCase();

                    // When the child object is a child node, we need to recurse
                    // onto it and also separately parse its attributes.
                    switch (childNode.nodeType) {
                        case XML_CHILDNODE:

                            // Parse the attributes of the XML Node.
                            childObj = parse.attr(childNode.attributes);

                            rule = rules.ins[nodeName];
                            if (rule === true) {
                                // In case 'ins' rule is matched, we transfer the
                                // parsed attributes to a grand-child having the node
                                // name of child and rename the child to the new name
                                // specified in the meta of 'tag' rule.
                                temp = childObj;
                                childObj = {};
                                childObj[nodeName] = temp;
                                temp = undefined;
                            }

                            // Apply the "attr" rule to add defalt flag variables.
                            rule = rules.attr[nodeName]
                            if (typeof rule === OBJECT) {
                                global.extend(childObj, rule);
                            }

                            // Parse the tag rule.
                            rule = rules.tag[nodeName]
                            if (rule) {
                                // Apply nodeName transformation 'tag' rule with
                                // base-parent-child relationship.
                                if (typeof rule === OBJECT &&
                                        typeof rule[parentNodeName] === OBJECT) {
                                    temp = undefined;
                                    for (temp in rule[parentNodeName]) {
                                        if (baseObj[temp]) {
                                            nodeName = rule[parentNodeName][temp];
                                            break;
                                        }
                                    }

                                }
                                // Apply nodeName transformation 'tag' rule with
                                // parent-child relationship.
                                else if (typeof rule === OBJECT &&
                                        typeof rule[parentNodeName] === STRING) {
                                    nodeName = rule[parentNodeName];

                                }

                                // Apply nodeName transformation 'tag' rule with parent
                                // independent relationship.
                                else if (typeof rule === STRING) {
                                    nodeName = rule;
                                }
                            }

                            // We now need to parse the rest of the childnodes as
                            // recursed into this function.
                            if (childNode.childNodes.length) {
                                // Match the group rule. To check whether we need to append
                                // the parsed children or treat the parsed children as siblings.
                                rule = rules.group[parentNodeName];
                                if (rule && rule[nodeName]) {
                                    parse.child(obj, childNode.childNodes,
                                        nodeName, baseObj);
                                }
                                else {
                                    parse.child(childObj, childNode.childNodes,
                                        nodeName, baseObj);
                                }
                            }

                            // Append the computed childObject to parent depending
                            // upon whether it has to be appended to an array or as
                            // a child object.
                            // Note: We append only when the "group" rule was not matched
                            rule = rules.group[parentNodeName];
                            if (!(rule && rule[nodeName])) {
                                parse.append(childObj, obj, nodeName, parentNodeName);
                            }
                            /*else {
                                if (nodeName === 'entity' && parentNodeName === 'entitydef') {
                                    if (!obj.i) {obj.i = 1}
                                    else {obj.i++}
                                }
                            }*/
                            break;

                    // In case the child object is a text node and meets some
                    // other requirements, we parse it as textNode
                    case XML_TEXTNODE:

                        // Parse mandatory text-node rule.
                        rule = rules.text[parentNodeName];
                        if (rule) {
                            nodeName = rule;
                            childObj = childNode.data;

                            // Append the computed childObject to parent depending
                            // upon whether it has to be appended to an array or as
                            // a child object.
                            parse.append(childObj, obj, nodeName, parentNodeName);
                        }

                        // Parse compact-data mode / optional text-node rule
                        rule = rules.dsv[parentNodeName];
                        if (typeof rule === STRING && baseObj.chart &&
                                parseInt(baseObj.chart[COMPACTDATAMODE], 10)) {
                            // Create text node
                            nodeName = rule;
                            childObj = childNode.data;

                            // Since this is DSV type text node, it is directly
                            // appended to the object.
                            obj[nodeName] = obj[nodeName] ?
                                    obj[nodeName] + childObj : childObj;
                        }
                        break;

                    } // end switching based on node-type
                }
            },

            attr: function (attrObj) {
                var i, obj = {};
                // Check whether a valid xml attr NamedNode is passed.
                if (!attrObj || !attrObj.length) {
                    return obj;
                }
                // Iterate through the attribute list and populate the return
                // object with the nodeValues.
                for (i = 0; i < attrObj.length; i += 1) {
                    obj[attrObj[i].nodeName.toLowerCase()] = attrObj[i].value || attrObj[i].nodeValue;
                }

                // Finally return the converted object.
                return obj;
            }

        };

        var parser = function (xml) {

            var jsonObj = {},
                xmlDoc,
                root,
                rootName,
                newNode,
                nodeEle,
                rootAttrs,
                childNodes,
                i;

            // Validate parameters to check that xml can be converted into a string.
            if (typeof xml !== OBJECT && typeof xml.toString !== FUNCTION) {
                parser.errorObject = new TypeError('xml2json.parse()');
                return jsonObj;
            }

            xml = xml.toString()
                .replace(/<\!--[\s\S]*?-->/g, '') // remove xml comments
                .replace(/<\?xml[\s\S]*?\?>/ig, '') // remove xml definition
                //.replace(/\<\!\[cdata[\s\S]*?\]\]\>/ig, '') // remove CDATA
                //.replace(/(=\s*?\"[\s\S]*?\")(\w)/ig, '$1 $2') // fix whitespace attr with quot
                //.replace(/(=\s*?\'[\s\S]*?\')(\w)/ig, '$1 $2') // fix whitespace attr with apos
                .replace(/&(?!([^;\n\r]+?;))/g, '&amp;$1'); // fix ampersand
            xml = fastTrim(xml);

            // Check whether unwanted data like undefined, null blank string etc.
            if (!xml) {
                //parser.errorObject = new TypeError('xml2json.parse()');
                return jsonObj;
            }
            // Get XML Parser object depending upon browser capability and
            // subsequently load xml string.
            try {
                if (window.DOMParser) {
                    xmlDoc = (new window.DOMParser()).parseFromString(xml, "text/xml");
                }
                else { // Internet Explorer
                    if (document.body && global.core.options.allowIESafeXMLParsing) { // Check if xml islands can be used
                        var xmlElem = document.createElement("xml");
                        xmlElem.innerHTML = xml;
                        document.body.appendChild(xmlElem);
                        xmlDoc = xmlElem.XMLDocument;
                        document.body.removeChild(xmlElem);
                        xmlElem = null;
                    }
                    else {
                        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                        xmlDoc.async = "false";
                        xmlDoc.loadXML(xml);
                    }
                }

                if (!(xmlDoc && xmlDoc.childNodes && xmlDoc.childNodes.length === 1
                    && (root = xmlDoc.childNodes[0]) && root.nodeName &&
                    (rootName = root.nodeName.toLowerCase()) &&
                    (rootName === 'chart' || rootName === 'map' || rootName === 'graph'))) {
                    parser.errorObject = new TypeError('xml2json.parse()');
                    return jsonObj;
                }
                else if (rootName === 'graph') {

                    newNode = xmlDoc.createElement('chart');
                    rootAttrs = root.attributes;
                    i = (rootAttrs && rootAttrs.length) || 0;
                    while (i--) {
                        newNode.setAttribute(rootAttrs[i].name, rootAttrs[i].value);
                        rootAttrs.removeNamedItem(rootAttrs[i].name);
                     }

                    childNodes = root.childNodes;
                    i = (childNodes && childNodes.length) || 0;

                    if (i) {
                        i -= 1;
                        nodeEle = root.removeChild(childNodes[i]);
                        newNode.appendChild(nodeEle);
                    }

                    while (i--) {
                        nodeEle = root.removeChild(childNodes[i]);
                        newNode.insertBefore(nodeEle, newNode.firstChild);
                    }

                    xmlDoc.replaceChild(newNode, root);
                    root = newNode;
                }
            }
            catch (e) {
                parser.errorObject = e;
            }

            if (root) {
                // Do initial attribute parsing
                if (root.attributes) {
                    jsonObj[rootName] = parse.attr(root.attributes);
                }

                // Parse all childNodes.
                if (root.childNodes) {
                    parse.child(jsonObj, root.childNodes, rootName, jsonObj);
                }

                // Delete error flag.
                delete parser.errorObject;
            }
            else {
                parser.errorObject = new TypeError('xml2json.parse()');
            }

            return jsonObj;
        };

        return function (xml) {
            // Clear error flags of parser.
            delete parser.errorObject;

            // Call JSON2XML parser to retrieve the parsed data.
            var jsonData = parser(xml);

            // Compile a return object for encoding function.
            return {
                data: jsonData,
                error: parser.errorObject
            };
        };
    }());

    /**
     * This function accepts a JSON string or object and converts it to
     * FusionCharts data XML.
     * @type string
     *
     */
    var json2xml = (function () {

        /**
         * This function verifies whether an
         */
        var rules = {

            /**
             * @var {object} items Collection of rules that are required to convert
             * JSON to FusionCharts XML.
             *
             * @note The rules are in the form:
             *       ruleType: { namespace: { nodeName: ruleMeta } }
             */
            items: {
                /**
                 * @var {object} explode Comprises of JSON attributes that needs to
                 * be converted to a particular set of nodes. Generally the value of
                 * such attributes/properties are an array of objects. Each object
                 * in these arrays are converted to a particular XML node specified
                 * within the rule meta.
                 */
                explode: {
                    data: 'set',
                    groups: {
                        annotations: 'annotationgroup'
                    },
                    items: {
                        groups: 'annotation'
                    }
                },

                /**
                 * @var {object} text Comprises of JSON keys that are to be
                 * always treated as text-node
                 */
                text: {
                    chart: {
                        target: 'target',
                        value: 'value'
                    },
                    graph: { // legacy
                        target: 'target',
                        value: 'value'
                    }
                },

                /**
                 * @var {object} dsv contains nodeNames that are specially expected
                 * to be delimiter separated textnodes. Useful for "compactDataMode".
                 */
                dsv: {
                    dataset: {
                        data: 'dataset'
                    },
                    categories: {
                        category: 'categories'
                    }
                },

                /**
                 * @var {object} attr Comprises of JSON attributes whose values are
                 * always added to the XML attributes of its namespace. Such nodes
                 * generally are object containing strings. The keys within them
                 * are to be converted to XML attributes and the values become XML
                 * attribute values.
                 *
                 */
                attr: {
                    chart: {
                        chart: 'chart'
                    },
                    graph: { // legacy
                        graph: 'graph'
                    },
                    map: {
                        map: 'map'
                    },
                    linkedmap: {
                        map: 'map'
                    },
                    linkedchart : {
                        chart: 'chart'
                    }

                },

                /**
                 * @var {object} group Comprises of JSON attributes whose children
                 * are to be grouped under a particular node. The parentNode where
                 * it has to be grouped are specified in the rule meta.
                 */
                group: {
                    styles: {
                        definition: 'style',
                        application: 'apply'
                    },
                    map: {
                        data: 'entity',
                        entitydef: 'entity'
                    },
                    markers: { // for maps
                        definition: 'marker',
                        application: 'marker',
                        shapes: 'shape',
                        connectors: 'connector'
                    }
                }
            },

            /**
             * This method verifies whether a name-item pair qualifies for a
             * rule or not. If so, it also returns the meta information of the
             * qualified rule.
             * @type string
             *
             * @param {string} rule is the name of the rule that you want to
             * verify. There must be a corresponding rule group in the items
             * object.
             * @param {variant} item
             * @param {variant} namespace
             */
            qualify: function (rule, item, namespace) {
                return typeof this.items[rule][namespace] === OBJECT ?
                    this.items[rule][namespace][item] :
                    this.items[rule][namespace];
            }
        };

        /**
         * This function accepts a JSON object and converts it to FusionCharts
         * data xml.
         *
         * @param obj {object} JSON object to be parsed.
         * @param namespace {string} is the parent/root namespace within which
         * the JSON object is contained.
         */
        var parser = function (obj, namespace, namespaceparent, flags) {

            // Initialize variables that stores the current namespace's XML
            // construction parameters.
            /**
             * @var {string} attrString The serialized set of attributes key:value
             *      pairs generated for this namespace.
             * @var {string} innerXML The innerXML of the node generated in this NS.
             * @var {string} nodeName The current node name devised from the NS.
             * @var {string} outerXML The outer XML generated for this JSON tree.
             * @var {string} item The current child being processed within an NS.
             * @var {string} lcaseItem The case desensitized current node item.
             * @var {string} lcaseNS The case desensitized namespace.
             */
            var attrString = '', innerXML = '', nodeName = '', outerXML = '',
            item, lowerItem, qualifier;

            // Desensitize case of namespace.
            if (namespace && typeof namespace.toLowerCase === 'function') {
                namespace = namespace.toLowerCase();
            }

            // Special root namespace flag setting
            if (namespaceparent === undefined && obj[namespace]) {
                for (item in obj[namespace]) {
                    lowerItem = item.toLowerCase();
                    if (lowerItem === COMPACTDATAMODE) {
                        flags.applyDSV = (obj[namespace][item] == 1);
                    }
                }
            }

            // In case the object is an array, apply explosion rule.
            if (obj instanceof Array) {
                // Iterate through every item within the array and expand it.
                for (item = 0; item < obj.length; item += 1) {
                    // If the value of the node is string we expand its contents
                    // into the content of the node for COMPACT_MODE data
                    if (typeof obj[item] === STRING) {
                        outerXML += XSSEncode(obj[item]);
                    }
                    // If the node is not string, we process its contents as
                    // another node.
                    else {
                        outerXML += parser(obj[item], namespace,
                            namespaceparent, flags);
                    }
                }
            }
            // For any other data-type other than Array we iterate through the
            // contents of the variable and parse each node.
            else {
                for (item in obj) {

                    // Store a lower-case version of this
                    lowerItem = item.toLowerCase();

                    // Parse "group" rule. Here, we test whether we are to group
                    // a JSON Array under a particular XML node.
                    // @example where this rule matches x for y:
                    // x: [a, b, c] is <y><x a /><x b /><x c/></y>
                    if (obj[item] instanceof Array &&
                        (qualifier = rules.qualify('group', lowerItem, namespace))) {
                        innerXML += '<' + lowerItem + '>' + parser(obj[item],
                            qualifier, namespace, flags) + '</' + lowerItem + '>';
                    }

                    // Parse "attr" rule. Here we test whether to use the items
                    // within a particular item as the XML attributes of the
                    // parent namespace.
                    else if (typeof obj[item] === OBJECT) {

                        // Check whether there is a qualifying rule for using
                        // an OBJECT as source of attributes of a namespace.
                        if ((qualifier = rules.qualify('attr', lowerItem, namespace))) {
                            nodeName = parser(obj[item], qualifier, namespace, flags)
                                .replace(/\/\>/ig, '');
                            namespace = lowerItem;
                        }
                        // Otherwise, recurse the parser to process the object
                        // as a child JSON object.
                        else {
                            innerXML += parser(obj[item], lowerItem, namespace, flags);
                        }
                    }
                    // Parse "vLine" and other static rules.
                    else {

                        if (flags.applyDSV && (qualifier = rules.qualify('dsv', lowerItem, namespace)) ) {
                            innerXML += obj[item];
                        }// Check for text qualifier
                        else if ((qualifier = rules.qualify('text', lowerItem, namespace))) {
                            innerXML += '<' + qualifier + '>' + obj[item] +
                                '</' + qualifier + '>';
                        }
                        else if (lowerItem === 'vline' && Boolean(obj[item])) {
                            namespace = 'vline';
                        }
                        else {
                            attrString += ' ' + lowerItem + '=\"' + XSSEncode(obj[item])
                            .toString().replace(/\"/ig, '&quot;') + '\"';
                        }
                    }
                }

                // When parsing completes, we need to check whether we have any
                // namespace adjustments or not.
                // Explode rule.

                if ((qualifier = rules.qualify('explode', namespaceparent, namespace))) {
                    namespace = qualifier;
                }

                // Build the final XML node string.
                outerXML = (nodeName !== '' ? nodeName : '<' + namespace) +
                attrString + (innerXML !== '' ? '>' + innerXML + '</' +
                    namespace + '>' : ' />');
            }

            return outerXML;
        };

        return function (jsonData) {
            // Clear error flags of parser.
            delete parser.errorObject;

            // In case user sends the JSON data as STRING, we need to parse
            // it and convert to JSON object.
            if (jsonData && typeof jsonData === STRING) {
                // Parse the data within atry block in order to receive all
                // errors.
                try {
                    jsonData = JSON.parse(jsonData);
                }
                catch (e) {
                    parser.errorObject = e;
                }
            }

            // Call JSON2XML parser to retrieve the parsed data.
            var rootNS = jsonData && jsonData.graph ? 'graph' :
                    (jsonData && jsonData.map ? 'map' : 'chart'),
                xmlData = parser(jsonData, rootNS, undefined, {});

            // Compile a return object for encoding function.
            return {
                data: xmlData,
                error: parser.errorObject
            };
        };
    }());

    // Add the data-handler to FusionCharts collection of data-handlers
    global.addDataHandler('JSON', {
        encode: json2xml,
        decode: xml2json
    });

}());



/*jslint white: true, browser: true, windows: true, forin: true,  undef: true,
  eqeqeq: true, plusplus: true, bitwise: true, regexp: true, immed: true */

/*global FusionCharts */

/*properties data, decodeLiterals, addDataHandler, addEventListener,
    categories, category, chart, columnCount, configure, core, data,
    dataset, decode, delimiter, encode, eolCharacter, error,
    exportdataqualifier, exportdataseparator, getCSVData, getDataAsCSV,
    join, label, length, name, options, prototype, qualifier, raiseError,
    ref, renderer, replace, rowCount, sender, separator, seriesname, set,
    slice, toString, transcodeData, value, vline, xaxisname, yaxisname
*/

/**
 * -----------------------------------------------------------------------------
 * CSV Data Handler Stub Module
 * -----------------------------------------------------------------------------
 * This module contains the CSV transcoder. This module adds the 'CSV' data
 * handler.
 */

FusionCharts(['private', 'CSVDataHandler', function () {

    var global = this,
        BLANK = "",
        COMMA = ",",
        QUOTE = "\"",
        APOS = "\'",
        TAB = "\t",
        CRLF = "\r\n",
        LIT_QUOT = "{quot}",
        LIT_TAB = "{tab}",
        LIT_APOS = "{apos}",

        DSV, // constructor
        decoder;

    DSV = function (config) {
        this.data = [];
        this.rowCount = 0;
        this.columnCount = 0;
        this.configure(config);
    };

    DSV.decodeLiterals = function (str, defaultValue) {
        if (str === undefined || str === null || !str.toString) {
            return defaultValue;
        }
        return str.replace(LIT_TAB, TAB).replace(LIT_QUOT, QUOTE)
            .replace(LIT_APOS, APOS);
    };

    DSV.prototype.set = function (row, col, value) {

        var i; // Initialize a counter

        // In case data is being set to a row that does not exist, we pad those
        // many empty spaces with a blank array. So that, there is no error
        // while setting data anywhere between them.
        if (this.rowCount <= row) {
            for (i = this.rowCount; i <= row; i += 1) {
                this.data[i] = [];
            }
            // Increment rowCount
            this.rowCount = row + 1;
        }

        // Increment columnCount
        if (this.columnCount <= col) {
            this.columnCount = col + 1;
        }

        // Set the value
        this.data[row][col] = value;
    };

    DSV.prototype.setRow = function (row, value) {
        var i;

        // In case data is being set to a row that does not exist, we pad those
        // many empty spaces with a blank array. So that, there is no error
        // while setting data anywhere between them.
        if (this.rowCount <= row) {
            for (i = this.rowCount; i <= row; i += 1) {
                this.data[i] = [];
            }
            // Increment rowCount
            this.rowCount = row + 1;
        }

        // Increment columnCount
        if (this.columnCount < value.length) {
            this.columnCount = value.length;
        }
        // Set column.
        this.data[row] = value;
    };

    DSV.prototype.get = function (row, col) {
        var data = this.data;
        return data[row] && data[row][col];
    };

    DSV.prototype.configure = function (config) {
        var decodeLiterals = DSV.decodeLiterals;
        this.delimiter = decodeLiterals(config.delimiter, COMMA);
        this.qualifier = decodeLiterals(config.qualifier, QUOTE);
        this.eolCharacter = decodeLiterals(config.eolCharacter, CRLF);
    };

    DSV.prototype.clear = function () {
        this.data = [];
        this.rowCount = 0;
        this.columnCount = 0;
    };

    DSV.prototype.toString = function () {
        var row, col, str = '';

        // Iterate through all rows and generate the string structure
        for (row = 0; row < this.rowCount; row += 1) {
            col = this.qualifier + this.data[row].join(this.qualifier + this.delimiter +
                this.qualifier) + this.qualifier;
            str += (col === "\"\"" ? this.eolCharacter : col + this.eolCharacter);
        }

        // Truncate extra line-break generated while forming the CSV.
        if (this.rowCount > 0) {
            str = str.slice(0, str.length - 2);
        }

        return str;
    };

    /**
     * Function to convert a variable into a FusionCharts data-handler API
     * compatible object.
     *
     * @param {variant} data is the dataSource passed on to the decoder.
     *
     * @marap {FusionCharts} obj is the FusionCharts object for which the
     * decoding will take place.
     * @marap {object} options are the dataOptions passed to this data handler.
     *
     * @type object
     */
    decoder = function (data) {

        var jsondata = global.core.transcodeData(data, 'xml', 'json') || {},
            csv,
            row,
            column,
            g,
            i,
            j,
            k,
            l,
            chartAttrs = jsondata.chart || jsondata.map || jsondata.graph || {},
            forceErrorColumns = Boolean(chartAttrs.exporterrorcolumns || 0),
            categories = (jsondata.categories && jsondata.categories[0] &&
                jsondata.categories[0].category) || [],
            isGeoPlot = jsondata.map && !jsondata.chart,
            isXYPlot = false,
            isErrorPlot = false,
            isMapPlot = false,
            compactDataMode = false,
            datasets,
            lineset,
            axisset,
            dataCollectionLength,
            categoryLength,
            datasetLength,
            categoryItem,
            dataCollection, // for ms stacked
            datasetItem,
            dataLength,
            dataItem,
            dataValue,
            bumpColumnCount,
            // for map plots
            mapRows,
            mapColumns;

        // Create a CSV based Delimiter data store
        csv = new DSV({
            separator: chartAttrs.exportdataseparator,
            qualifier: chartAttrs.exportdataqualifier
        });

        // Try probe maps. For GEO plot, getDataAsCSV exists on chart API.
        if (isGeoPlot) {
            csv.setRow(0, ['Id', ' Short Name', 'Long Name', 'Value',
                'Formatted Value']);
        }
        // Probe widgets.
        else if ((datasets = (jsondata.dials && jsondata.dials.dial) ||
                (jsondata.pointers && jsondata.pointers.pointer) ||
                jsondata.value) !== undefined) {

            // Prepare CSV for single-value input.
            if (typeof datasets === 'string') {
                csv.set(0, 0, datasets);
                // Separate single-value for bullet graphs "target" tag
                if (typeof jsondata.target === 'string') {
                    csv.set(0,1, jsondata.target)
                }
            }
            // For multi-value gauges having dials or pointers.
            else {
                // Set column headers.
                csv.setRow(0, ['Id', 'Value']);
                for (i = 0, k = 1, j = datasets.length; i < j; i += 1, k += 1) {
                    csv.setRow(k, [k, datasets[i].value]);
                }
            }
        }

        // Take multi-series decision here.
        else if ((datasets = jsondata.dataset ||
                (!(jsondata.data instanceof Array) && []))) {
            column = 1;

            // Merge lineset with dataset for easy algorithm (will be separated
            // later.)
            lineset = jsondata.lineset;
            if (lineset) {
                datasets = datasets.concat(lineset);
            }

            // Merge axis for multi-axis data
            axisset = jsondata.axis;
            if (axisset) {
                datasets = datasets.concat(axisset);
            }

            datasetLength = datasets.length;
            categoryLength = categories.length;

            // Add only category rows in case no dataset has been found.
            if (!(datasetLength = datasets.length)) {
                for (i = 0; i < categoryLength; i += 1) {
                    categoryItem = categories[i];
                    csv.set(i+1, 0, categoryItem.label || categoryItem.name);
                }
            }

            for (i = 0; i < datasetLength; i += 1) {

                dataCollection = datasets;
                if (dataCollection[i].dataset) {
                    dataCollection = dataCollection[i].dataset;
                    g = 0;
                    dataCollectionLength = dataCollection.length;
                }
                else {
                    dataCollection = datasets;
                    g = i;
                    dataCollectionLength = g + 1;
                }

                for (; g < dataCollectionLength && !isXYPlot && !isMapPlot;
                        g += 1, column += 1) {
                    // Refer to the dataset item that contains the data and
                    // forms a column.
                    datasetItem = dataCollection[g];

                    // Set the column header equalling to series name
                    csv.set(0, column, datasetItem.seriesname);

                    if (typeof datasetItem.data === 'string') {
                        compactDataMode = true;
                        datasetItem.data =
                            datasetItem.data.split(chartAttrs.dataseparator || '|');
                    }

                    // Loop through categories and fill the values of each column
                    // with its values
                    for (j = 0, k = 0, dataLength = datasetItem.data && datasetItem.data.length || 0;
                            j < dataLength || j < categoryLength; j += 1) {
                        categoryItem = categories[j];
                        row = k + 1;

                        dataItem = datasetItem.data && datasetItem.data[k] || {};

                        // Keep checking for scatter chart. If present then
                        // raise a flag and exit processing.
                        if (dataItem.x !== undefined && dataItem.y !== undefined) {
                            isXYPlot = true;
                            break;
                        }

                        // Keep checking for HeatMap chart
                        if (dataItem.rowid !== undefined && dataItem.columnid !== undefined) {
                            isMapPlot = true;
                            break
                        }

                        // trap surplus data here
                        if (j < categoryLength && !categoryItem.vline) {
                            csv.set(row, 0, categoryItem.label || categoryItem.name);
                            dataValue = parseFloat(dataItem ? dataItem.value : '');
                            dataValue = isNaN(dataValue) ? '' : dataValue;

                            csv.set(row, column, dataValue);

                            // Perform check for errorValue on error charts
                            if (isErrorPlot || forceErrorColumns || dataItem.errorvalue) {
                                // Set the next column header and flag that this
                                // dataset has error values.
                                if (!isErrorPlot) {
                                    isErrorPlot = true;
                                    csv.set(0, column + 1, "Error");
                                }
                                bumpColumnCount = 1;
                                csv.set(row, column + 1, dataItem.errorvalue)
                            }

                            // Increment the auxilliary counter to ensure sync with
                            // dataset count even after ignoring of vline in category.
                            k += 1;
                        }
                    }

                    // Reset flag for checking error value in set and
                    // bump a column to accomodate error.
                    if (bumpColumnCount) {
                        column += bumpColumnCount;
                        bumpColumnCount = 0;
                    }
                }
            }

            // Split the previously merged lineset and axisset
            if (lineset) {
                datasets = datasets.slice(0, -lineset.length);
            }

            if (axisset) {
                datasets = datasets.slice(0, -axisset.length);
            }
        }
        // for non-ms data.
        else if ((datasets = jsondata.data)){
            csv.set(0, 1, chartAttrs.yaxisname || 'Value');

            for (i = 0, categoryLength = datasets.length;
                    i < categoryLength; i += 1) {
                dataItem = datasets[i];
                // Ignore vLines
                if (!dataItem.vline) {
                    // Set the row value.
                    dataValue = parseFloat(dataItem.value ? dataItem.value : '');
                    dataValue = isNaN(dataValue) ? '' : dataValue;
                    csv.setRow(i + 1, [dataItem.label || dataItem.name, dataValue]);
                }
            }
        }

        // Special processing for x-y plot data.
        if (isXYPlot) {
            // Reset any processing done earlier.
            csv.clear();
            isErrorPlot = false;
            bumpColumnCount = 0;

            // Set new column headers.
            csv.setRow(0, ['Series', 'x', 'y']);

            // Iterate through all datasets.
            for (i = 0, row = 1, datasets = jsondata.dataset,
                    dataCollectionLength = datasets.length;
                    i < dataCollectionLength; i += 1) {
                for (j = 0, datasetItem = datasets[i] && datasets[i].data || [],
                        datasetLength = datasetItem.length; j < datasetLength;
                        j += 1, row += 1) {
                    dataItem = datasetItem[j] || {};
                    dataValue = [datasets[i].seriesname, dataItem.x, dataItem.y];

                    // check z index value for bubble charts
                    if (dataItem.z !== undefined) {
                        dataValue.push(dataItem.z);
                        // Set flag for z by using bump column flag. Later
                        // when error values will be set, it would detect whether
                        // z was added from this value.
                        if (!bumpColumnCount) {
                            csv.set(0, 3, 'z');
                            bumpColumnCount = 1;
                        }
                    }
                    // Set values for error charts after probing presense of
                    // error values. Note that after one errorvalue has been
                    // probed, it will no longer need to compute so many logic
                    // operations since isErrorPlot flag will then be true.
                    if (isErrorPlot || forceErrorColumns ||
                            dataItem.errorvalue !== undefined ||
                            dataItem.horizontalerrorvalue !== undefined ||
                            dataItem.verticalerrorvalue !== undefined) {

                        dataValue.push(dataItem.errorvalue,
                            dataItem.horizontalerrorvalue === undefined ?
                                dataItem.errorvalue : dataItem.horizontalerrorvalue,
                            dataItem.verticalerrorvalue === undefined ?
                                dataItem.errorvalue : dataItem.verticalerrorvalue)

                        // Set column headers.
                        if (!isErrorPlot) {
                            csv.set(0, bumpColumnCount + 3, 'Error');
                            csv.set(0, bumpColumnCount + 4, 'Horizontal Error');
                            csv.set(0, bumpColumnCount + 5, 'Vertical Error');
                        }
                        isErrorPlot = true;
                    }

                    // Now set the entire row of data
                    csv.setRow(row, dataValue);
                }
            }
        }
        else if (isMapPlot) {
            // reset parsing;
            csv.clear();

            mapRows = {};
            mapColumns = {};

            // Iterate through all rows and create a reverse map of id to row
            // index.
            for (i = 0, j = 1, categories = jsondata.rows && jsondata.rows.row || [],
                    l = categories.length; i < l; i += 1, j += 1) {
                categoryItem = categories[i];
                if (categoryItem.id) {
                    mapRows[categoryItem.id.toLowerCase()] = j; // desensitize
                    csv.set(j, 0, categoryItem.label || categoryItem.id);
                }
            }
            // Iterate through all columns and reverse map id to column index.
            for (i = 0, j = 1, categories = jsondata.columns && jsondata.columns.column || [],
                    l = categories.length; i < l; i += 1, j += 1) {
                categoryItem = categories[i];
                if (categoryItem.id) {
                    mapColumns[categoryItem.id.toLowerCase()] = j; // desensitize
                    csv.set(0, j, categoryItem.label || categoryItem.id);
                }
            }

            // Select first dtaset
            datasetItem = jsondata.dataset && jsondata.dataset[0] &&
                jsondata.dataset[0].data || [];

            // Iterate through data and based on row and col id of the values,
            // use the reverseMap to place them on csv.
            for (i = 0, l = datasetItem.length; i < l; i += 1) {
                dataItem = datasetItem[i];
                row = dataItem.rowid.toLowerCase();
                column = dataItem.columnid.toLowerCase();

                // If a row is not found on the map, append one.
                if (!mapRows[row]) {
                    mapRows[row] = csv.rowCount;
                    csv.set(csv.rowCount, 0, dataItem.rowid); // add header
                }
                // If a column is not found on the map, append one.
                if (!mapColumns[column]) {
                    mapColumns[column] = csv.columnCount;
                    csv.set(0, csv.columnCount, dataItem.columnid); // add header
                }

                csv.set(mapRows[row], mapColumns[column], dataItem.value);
            }

        }

        // cleanup
        axisset = null;
        lineset = null;
        categories = null;
        datasets = null;

        if (csv.rowCount > 0 && csv.get(0, 0) === undefined) {
            csv.set(0, 0, chartAttrs.xaxisname || 'Label');
        }

        return {
            data: csv.toString(),
            error: undefined
        };
    };

    // Add Abstract data handler as because when the primary data-type is XML,
    // it requires a transparent transcoder that has nothing to do.
    global.addDataHandler('CSV', {
        encode: function (data, obj) {
            global.raiseError(obj, '0604111215A', 'run', '::CSVDataHandler.encode()',
                'FusionCharts CSV data-handler only supports encoding of data.');
            throw "FeatureNotSupportedException()";
        },
        decode: decoder
    });

    // Add the function reference to getDataAsCSV for JS charts.
    global.core.addEventListener('Loaded', function (event) {
        var obj = event.sender;

        // Execute this event for JS charts only.
        if (obj.options.renderer !== 'javascript') {
            return;
        }

        // Override the getDataAsCSV
        if (!obj.getDataAsCSV) {
            obj.getDataAsCSV = obj.ref.getDataAsCSV = obj.getCSVData;
        }
    });

}]);



/*jslint white: true, browser: true, windows: true, forin: true,  undef: true,
  eqeqeq: true, plusplus: true, bitwise: true, regexp: true, immed: true */

/*global Array: false, FusionCharts, RegExp: false, FusionChartsDataFormats: false */

/*members JSON, animation, chart, extend, getChartAttribute,
    getChartData, graph, length, raiseError, setChartAttribute,
    setChartData, toLowerCase, toString
*/

/**
 * -----------------------------------------------------------------------------
 * Dynamic Chart Attributes Module
 * -----------------------------------------------------------------------------
 * This module contains codes required to get and set chart attributes from a
 * FusionCharts object using simple getter and setter functions. These method
 * completely bypasses the data transfer from the SWF and computes chart
 * attributes based on the last set data.
 */
(function () {

    // Register the module with FusionCharts.
    var global = FusionCharts(['private', 'DynamicChartAttributes']);
    // Check whether the module has been already registered. If true, then
    // do not bother to re-register.
    if (global === undefined) {
        return;
    }

    global.extend(global.core, {
        /**
         * Updates a FusionCharts object's XML root's attribute with the new
         * attribute-value pair. In case the attribute does not exist, it adds
         * it.
         *
         * @param attributes {object} The attributes to be updated.
         *
         * @type string
         * @return Updated FusionCharts DataXML with the new attribute added or
         * updated
         */
        setChartAttribute: function (attributes, value) {

            // In case attribute is sent as separate arguments, combine them
            // to one object.
            if (typeof attributes === 'string') {
                var temp = arguments[0];
                attributes = {};
                attributes[temp] = value;
            }
            // In case user sends invalid parameters for attributes.
            else if (attributes === null || typeof attributes !== 'object') {
                return;
            }

            var i = 0, json = this.getChartData(FusionChartsDataFormats.JSON), prop,
                attList = json.chart || json.graph || json.map || {};

            // Iterate through attributes and update them.
            for (prop in attributes) {
                i += 1;
                if (attributes[prop] === null) {
                    delete attList[prop.toLowerCase()];
                    continue;
                }
                attList[prop.toLowerCase()] = attributes[prop];
            }
            // Update chart's XML.
            if (i > 0) {
                // In case animation is not specified, then turn it off.
                if (typeof attList.animation === 'undefined') {
                    attList.animation = '0';
                }
                this.setChartData(json, FusionChartsDataFormats.JSON);
            }
        },

        /**
         * Returns the value of a specific chart attribute.
         *
         * @param attribute {string} The attributes to be fetched.
         *
         * @type string
         * @return The value of the attribute.
         */
        getChartAttribute: function (attribute) {

            // Get chart attributes.
            var attList = (attList =
                    this.getChartData(FusionChartsDataFormats.JSON)).chart ||
                    attList.graph || attList.map;

            // In case no argument is passed, we return the entire set of
            // chart attributes object.
            if (arguments.length === 0 || attribute === undefined ||
                    attList === undefined) {
                return attList;
            }

            // Create a variable that will store reference to the parameter that
            // contains attributes. This helps in case user sends one attribute
            // as string, we covert it to an array witj one element.
            var value, i;

            // Convert single attribute to array with one element or directly
            // send the value as return.
            if (typeof attribute === 'string') {
                value = attList[attribute.toString().toLowerCase()];
            }

            // In case user sends an array of attributes, we compile an object
            // for the same and return.
            else if (attribute instanceof Array) {
                value = {};
                for (i = 0; i < attribute.length; i += 1) {
                    value[attribute[i]] =
                        attList[attribute[i].toString().toLowerCase()];
                }
            }

            // If all above conditions fail, there must be some issue with the
            // parameters.
            else {
                global.raiseError(this, '25081429', 'param',
                    '~getChartAttribute()', 'Unexpected value of "attribute"');
            }

            // We return 'value' variable here as because it is equivalent to
            // sending '{}' in case above conditions fail.
            return value;
        }
    }, true);

}());



/*jslint white: true, browser: true, windows: true, forin: true,  undef: true,
  eqeqeq: true, plusplus: true, bitwise: true, immed: true */

/*global window: false, Array: false, FusionCharts: false, FusionChartsEvents: false
    FusionChartsDataFormats: false */

/* -----------------------------------------------------------------------------
 * Link Manager Module
 * -----------------------------------------------------------------------------
 * This module allows for easy drill-down of charts by handling the link
 * attrribute of charts.
 */
(function () {

    // Register the module with FusionCharts.
    var global = FusionCharts(['private', 'api.LinkManager']);
    // Check whether the module has been already registered. If true, then
    // do not bother to re-register.
    if (global === undefined) {
        return;
    }

    // Add parameter policy to pass link information during construction of
    // new FusionCharts object.
    global.policies.link = ['link', undefined];

    // Create Constants for Link InserModes
    var FusionChartsDOMInsertModes = window.FusionChartsDOMInsertModes = {
            REPLACE: 'replace',
            APPEND: 'append',
            PREPEND: 'prepend'
        },
        // Create a collection to store configuration of every root link.
        store = {},

        // Store root and parent reference of every element. This would allow us
        // to save the parent and root reference of the "link" object of every
        // chart.
        LinkInformation = function (root, parent) {
            this.items = {};
            this.root = root;
            this.parent = parent;

            // Do initialization work in case this is the root link. We verify root
            // link in case parent is undefined
            if (parent instanceof global.core) {
                this.level = this.parent.link.level + 1;
            } else {
            // Parent is not an instance of FusionCharts, this implies this link is
            // a root link
                store[root.id] = [{}];
                this.level = 0;
            }
        },

        checkObjectRenderLocationOverride = function (obj, parent) {
            return (obj.options.containerElement ===
                parent.options.containerElement || obj.options.containerElementId ===
                parent.options.containerElementId) && obj.options.insertMode  ===
                FusionChartsDOMInsertModes.REPLACE;
        };

    // This function would return the current configuration of the link that is
    // to be used for construction of a new chart.
    LinkInformation.prototype.configuration = function () {
        var param = store[this.root.id][this.level] ||
            (store[this.root.id][this.level] = {});

        // Return the parameters
        return param;
    };

    // Add global link configuration API using which users will be able to set
    // parameters for every level of link.
    global.extend(global.core, {
        configureLink: function (param, level) {
            var i;

            // In case user provides an array of configuration, we assume that the
            // user wants to redefine the entire configuration train.
            if (param instanceof Array) {
                for (i = 0; i < param.length; i += 1) {
                    // We initialize a blank configuration object for
                    // the link configuration train, in case it is not
                    // pre-defined.
                    if (typeof store[this.link.root.id][i] !== 'object') {
                        store[this.link.root.id][i] = {};
                    }
                    // The configuration is one-by-one copied two the store.
                    global.extend(store[this.link.root.id][i], param[i]);
                }
                // Delete any extra configuration.
                store[this.link.root.id].splice(param.length);
            } else if (typeof param === 'object') {
            // If user has sent one object, we assume he wants to configure
                // In case level is undefined, we need to assign the current
                // level of the object.
                if (typeof level !== 'number') {
                    level = this.link.level;
                }
                // Create a blank parameter object in store in case it is not
                // defined.
                if (store[this.link.root.id][level] === undefined) {
                    store[this.link.root.id][level] = {};
                }
		// Copy all parameters passed on to the store.
                global.extend(store[this.link.root.id][level], param);
            } else {
                global.raiseError(this, '25081731', 'param', '~configureLink()',
                    'Unable to update link configuration from set parameters');
            }
        }
    }, true);


    // Add construction routines to manage link parameters.
    global.addEventListener('BeforeInitialize', function (event) {

        // If LinkInformation is not present in the object, we can assume
        // that this chart is a root chart and hence we need to create
        // link related information.
        if (!(event.sender.link instanceof LinkInformation)) {
            event.sender.link = new LinkInformation(event.sender);
        } else {
        // In case link is predefined, we need to add the new object to the
        // 'items' collection of parent of the new object.
            // In case of root link, parent is undefined, we do not need to
            // add any type of item configuration.
            if (event.sender.link.parent instanceof global.core) {
                event.sender.link.parent.link.items[event.sender.id] = event.sender;
            }
        }
    });

    // Handle the linked-chart click event.
    global.addEventListener('LinkedChartInvoked', function (event, args) {
        var obj = event.sender,
            param = obj.clone({
                dataSource: args.data,
                dataFormat: args.linkType,
                // Create a new link between the source chart and the to-be-created
                // new chart.
                link: new LinkInformation(obj.link.root, obj)
            }, true),
            alias = args.alias;

        // Pass on the chart alias if passed by event.
        if (alias) {
            // In case no swf path is specifed, try to recover the same from
            // swfUrl.
            if (!param.swfSrcPath && param.swfUrl) {
                param.swfSrcPath = param.swfUrl
                        .replace(/(.*?)?[^\/]*\.swf.*?/ig, '$1');
            }
            param.type = alias;
        }

        // Delete certain default or post-render state related variables from
        // params.
        if (obj.args && parseInt(obj.args.animate, 10) !== 0) {
            delete param.animate;
        }
        // Update parameters by overrides set by user
        global.extend(param, obj.link.configuration());

        // Raise event to denote event that linked chart is going to be
        // rendererd.
        global.raiseEvent('BeforeLinkedItemOpen', {
            level: obj.link.level
        }, obj.link.root);

        // Delete the chart with same id, if there is one.
        if (global.core.items[param.id] instanceof global.core) {
            global.core.items[param.id].dispose();
        }

        // Create a new FusionCharts object with the construction parameters of
        // the above link configuration.
        var childObj = new global.core(param);


        // Check whether the overlay button text is "close" or "back" depending
        // upon the place of render of the chart.
        if (!checkObjectRenderLocationOverride(childObj, obj) &&
                !(obj.options.overlayButton
                && obj.options.overlayButton.message)) {

            if (typeof obj.options.overlayButton !== 'object') {
                obj.options.overlayButton = {};
            }
            obj.options.overlayButton.message = 'Close';
        }

        // Render the linked chart.
        childObj.render();

        // Raise event to denote that linked item was invoked on a chart.
        global.raiseEvent('LinkedItemOpened', {
            level: obj.link.level,
            item: childObj
        }, obj.link.root);
    });

    /**
     * This method handles the routines that are performed when a linked chart
     * is closed.
     */
    global.addEventListener('OverlayButtonClick', function (event, args) {

        // We need to verify whether this overlay button was initiated by
        // link-manager or not.
        if (args.id !== 'LinkManager') {
            return;
        }

        var sender = event.sender,
            level = sender.link.level - 1, // compute the target link level
            parent = sender.link.parent,
            root = sender.link.root;

        // Raise event to denote event that linked chart is going to be disposed.
        global.raiseEvent('BeforeLinkedItemClose', {
            level: level,
            item: sender
        }, root);

        setTimeout(function () {
            if (global.core.items[sender.id] ) {
                sender.dispose();
            }

             // Raise event that link has been closed for a root chart.
            global.raiseEvent('LinkedItemClosed', {
                level: level
            }, root);
        }, 0);

        // In case link item was closed for an object whose parent is not
        // active, we re-render it.
        if (!parent.isActive() &&
                checkObjectRenderLocationOverride(sender, parent)) {
            parent.render();
        }

    });

    global.addEventListener('Loaded', function (event) {

        var obj = event.sender;
        // When Chart is rendered using HTML rendering "event.sender.link" is undefined.
        if (!obj || obj.link === undefined) {
            return;
        }
        // Verify whether the loaded item is a root item or not. In case the
        // item is a root item, we do not need to process an overlay button.
        if (obj.link.root === obj || !(obj.link.parent instanceof global.core)) {
            return;
        }

        // Verify whether overlay button API is available
        if (!(obj.ref && typeof obj.ref.drawOverlayButton === 'function')) {
            // Warn that it could not draw overlay button.
            global.raiseWarning(obj, '04091602', 'run', '::LinkManager^Loaded',
                'Unable to draw overlay button on object. -' + obj.id);
            return;
        }

        // Get configuration of overlay button
        var config = global.extend({
            show: true,
            id: 'LinkManager'
        }, obj.link.parent.options.overlayButton);
        global.extend(config, obj.link.parent.link.configuration().overlayButton || {});
        obj.ref.drawOverlayButton(config);
    });

    // Add method to make sure to delete all fusioncharts objects when
    // dispose method is invoked.
    global.addEventListener('BeforeDispose', function (e) {
        var obj = e.sender;
        // Validate environment to check sender and its link exists.
        if (!(obj && obj.link instanceof LinkInformation)) {
            return;
        }

        // In case the object is not a root object, we would need to perform
        // additional cleanup.
        if (obj.link.parent instanceof global.core) {
            // Cleanup the reference to this object to the 'items' collection
            // of its parent.
            delete obj.link.parent.link.items[e.sender.id];
        }
        // Remove any configuration set as root configuration
        delete store[obj.id];
    });

    FusionChartsEvents.LinkedItemOpened = 'linkeditemopened';
    FusionChartsEvents.BeforeLinkedItemOpen = 'beforelinkeditemopen';
    FusionChartsEvents.LinkedItemClosed = 'linkeditemclosed';
    FusionChartsEvents.BeforeLinkedItemClose = 'beforelinkeditemclose';

}());



/*jslint white: true, browser: true, windows: true, forin: true,  undef: true,
  eqeqeq: true, plusplus: true, bitwise: true, regexp: true, immed: true */

/*global window: false, FusionCharts: false, FusionChartsEvents: false,
    G_vmlCanvasManager: false */

/* -----------------------------------------------------------------------------
 * Print Manager Module
 * -----------------------------------------------------------------------------
 */
(function () {

    // Register the module with FusionCharts.
    var global = FusionCharts(['private', 'PrintManager']);
    // Check whether the module has been already registered. If true, then
    // do not bother to re-register.
    if (global === undefined) {
        return;
    }

    // Default configuration of print manager. This can be overriden using
    // parameter of constructor.
    var config = {
        enabled: false,
        invokeCSS: true,
        processPollInterval: 2000,
        message: 'Chart is being prepared for print.',
        useExCanvas: false,
        bypass: false
    };

    // Contains all independent library functions to be used by various sections
    // of this code.
    var lib = {

        getCanvasElementOf: function (obj, width, height) {
            // Proceed with creating canvas only if it is not already created.
            if (obj.__fusioncharts__canvascreated !== true) {
                // Create <canvas> DOM element.
                var canvas = document.createElement('canvas'),
                    identifier = global.core.items[obj.id].attributes['class'];
                // ExCanvas initialization.
                if (config.useExCanvas && G_vmlCanvasManager) {
                    G_vmlCanvasManager.initElement(canvas);
                }

                // Set the class of the canvas to an identifyable value.
                canvas.setAttribute('class', identifier);
                canvas.__fusioncharts__reference = obj.id;

                // Insert the canvas immediately after the embed element.
                obj.parentNode.insertBefore(canvas, obj.nextSibling);
                // Mark that canvas has been created.
                obj.__fusioncharts__canvascreated = true;
            }

            // Set dimensions of canvas element
            obj.nextSibling.setAttribute('width', width || obj.offsetWidth || 2);
            obj.nextSibling.setAttribute('height', height || obj.offsetHeight || 2);

            // Return the canvas element for further manipulation.
            return obj.nextSibling;
        },

        removeCanvasElementOf: function (obj) {
            var container = obj.ref && obj.ref.parentNode ?
                obj.ref.parentNode : (obj.options.containerElement ||
                    window.getElementById(obj.options.containerElementId));

            if (!container) {
                return;
            }

            var canvasItems = container.getElementsByTagName('canvas'),
                l,
				i;

            for (i = 0, l = canvasItems.length; i < l; i += 1) {
                if (canvasItems[i].__fusioncharts__reference === obj.id) {
					container.removeChild(canvasItems[i]);
                    if (obj.ref) {
                        obj.ref.__fusioncharts__canvascreated = false;
                    }
                }
            }

        },

        rle2rgba: function (rle, rgba, base) {

            // Check if base colour has been provided. If not then set it to
            // white.
            if (typeof base !== 'string') {
                base = "FFFFFF";
            }

            // Tokenize the incoming RLE stream data.
            var raw = rle.split(/[;,_]/), run, i, r, g, b, x = 0;
            // Process every token.
            for (i = 0; i < raw.length; i += 2) {
                // Replace missing colour with base colour.
                if (raw[i] === '') {
                    raw[i] = base;
                }

                // Padding maximum left of the colour-data by 0. This allows
                // easy string manipulation from the right.
                raw[i] = ('000000' + raw[i]).substr(-6);

                // Separate the colour components and convert decimal to hex.
                r = parseInt('0x' + raw[i].substring(0, 2), 16);
                g = parseInt('0x' + raw[i].substring(2, 4), 16);
                b = parseInt('0x' + raw[i].substring(4, 6), 16);

                // Fill the run-length with the extracted rgba data.
                for (run = 0; run < raw[i + 1]; run += 1) {
                    rgba[x] = r;
                    rgba[x + 1] = g;
                    rgba[x + 2] = b;
                    rgba[x + 3] = 255;
                    x += 4;
                }
            }
            return rgba;
        },

        rle2array: function (rle, base) {
            // Check if base colour has been provided. If not then set it to
            // white.
            if (typeof base !== 'string') {
                base = "FFFFFF";
            }

            // Tokenize the RLE stream.
            var raw = rle.split(';'), run, i;
            for (run in raw) {
                // Tokenize every run within the stream.
                raw[run] = raw[run].split(/[_,]/);
                for (i = 0; i < raw[run].length; i += 2) {
                    // Restore RLE sub-compression losses.
                    // As per processed value, update it with base colour or
                    // Left-pad zero.
                    raw[run][i] = raw[run][i] === '' ?
                        base : ('000000' + raw[run][i]).substr(-6);
                }
            }
            return raw;
        },

        drawText: function (canvas, text, width, height) {
            var context = canvas.getContext('2d'), w = width || 2,
                h = height || 2;
            context.clearRect(0, 0, w, h);
            context.textBaseline = 'middle';
            context.textAlign = 'center';
            context.font = '8pt verdana';
            context.fillStyle = '#776666';

            if (typeof context.fillText === 'function') {
                context.fillText(text, w / 2, h / 2);
            } else if (typeof context.mozDrawText === 'function') {
                context.translate(w / 2, h / 2);
                context.mozDrawText(text);
            } else {
                global.raiseWarning(global.core, '25081803', 'run',
                    '::PrintManager>lib.drawText',
                    'Canvas text drawing is not supported in browser');
            }
            return true;
        },

        // Appends a given CSS Text to the page <head> element.
        appendCSS: function (css) {
            // Create a DOM style element and set its required attributes.
            var el = document.createElement('style');
            el.setAttribute('type', 'text/css');

            // Add the CSS passed as argument to the newly created style element.
            // For IE, use the 'stylesheet.cssText' property and for rest, simply
            // add the CSS as text to the style element.
            if (typeof el.styleSheet === 'undefined') {
                el.appendChild(document.createTextNode(css));
            } else {
                el.styleSheet.cssText = css;
            }

            // Append the style element to DOM head and return the same.
            return document.getElementsByTagName('head')[0].appendChild(el);
        }
    };

	lib.drawRLE = function (canvas, rle, width, height, baseColor) {

		// Failsafe height and width parameters
		width = width || 2;
		height = height || 2;

		// Adjust canvas dimension
		canvas.setAttribute('width', width);
		canvas.setAttribute('height', height);

		var context = canvas.getContext('2d'), imageData;

		// Prepare image data from rle sent from embed parameter.
		if (typeof context.putImageData === 'function' &&
				typeof context.createImageData === 'function') {
			imageData = context.createImageData(width, height);
			lib.rle2rgba(rle, imageData.data, baseColor);
			context.putImageData(imageData, 0, 0);
		} else { // Fall-back drawing method
			imageData = lib.rle2array(rle, baseColor);
			var x = 0, y = 0, z = 0;
			for (y in imageData) {
				x = 0;
				for (z = 0; z < imageData[y].length; z += 2) {
					context.fillStyle = "#" + imageData[y][z];
					context.fillRect(x, y, imageData[y][z + 1], 1);
					x += parseInt(imageData[y][z + 1], 10);
				}

			}
		}
		return true;
	};

    // Manages the dynamically generated CSS of the page
    var css = {
        // Available library styles.
        styles: {
            print: 'canvas.FusionCharts{display:none;}@media print{object.FusionCharts{display:none;}canvas.FusionCharts{display:block;}}',
            error: 'canvas.FusionCharts{display:none;}',
            normal: ''
        },

        // A common variable that stores a reference to the current stylesheet.
        cssNode: undefined
    }, activeItems = {}, queuedItems = {}, activeCount = 0, queueTrigger;

	// Define function that allows switch between stylesheets.
	css.invoke = function (style) {
		// Check whether to use one of the available library styles.
		if (typeof this.styles[style] !== 'undefined') {
			style = this.styles[style];
		}
		// If style is not set as undefined, set the style.
		if (typeof style !== 'undefined') {
			if (this.cssNode !== undefined && this.cssNode.parentNode !== undefined) {
				this.cssNode.parentNode.removeChild(this.cssNode);
			}
			css.cssNode = lib.appendCSS(style);
		}
	};

    var onDrawComplete = function (event) {
			// Get reference to the rendered object refetence
			var obj = event.sender.ref, w, h;

			// We just verify the external interface for safety sake. Though it is
			// very unlikely that this event will be fired with crippled EI.
			if (obj === undefined || typeof obj.prepareImageDataStream !== 'function' ||
					obj.prepareImageDataStream() === false) {
				// Request obj to prepare image data stream or queue it up in case SWF
				// is busy.
				queueTrigger(event.sender);
				return;
			}
			// Add the object to te collection of active objects post successful
			// imagestream preparation call.
			if (!activeItems[event.sender.id]) {
				activeItems[event.sender.id] = obj;
				activeCount += 1;
				if (activeCount === 1) {
					global.raiseEvent('PrintReadyStateChange', {
						ready: false,
						bypass: config.bypass
					}, event.sender);
				}
			}
			// While image is being prepared, render the "waiting" message.
			try {
				w = obj.offsetWidth;
				h = obj.offsetHeight;
				lib.drawText(lib.getCanvasElementOf(obj, w, h), config.message, w, h);
			} catch (e) {
			// In case of error, remove the CSS so that the SWF is still
			// printable.
				css.invoke('error'); // invoke the css that hides canvas
				global.raiseError(event.sender, '25081807', 'run',
					'::PrintManager>onDrawComplete',
					'There was an error while showing message to user via canvas.');
			}
		},

		onImageStreamReady = function (event, args) {
			try {
				if (lib.drawRLE(lib.getCanvasElementOf(event.sender.ref,
						args.width, args.height), args.stream, args.width,
						args.height, args.bgColor) === true) {
					// On successful canvas rendering, remove the item from active
					// item collection.
					if (activeItems[event.sender.id]) {
						delete activeItems[event.sender.id];
						activeCount -= 1;

						if (activeCount === 0) {
							global.raiseEvent('PrintReadyStateChange', {
								ready: true,
								bypass: config.bypass
							}, event.sender);
						}
					}
				}
			} catch (e) {
			// In case of error, remove the CSS so that the SWF is still
			// printable.
				css.invoke('error'); // invoke the css that hides canvas
				global.raiseError(event.sender, '25081810', 'run',
					'::PrintManager>onImageStreamReady',
					'There was an error while drawing canvas.');
			}
		},

		// Method to remove canvas and other print manager stuffs when an object is
		// disposed.
		onBeforeDispose = function (event) {
			lib.removeCanvasElementOf(event.sender);
		},

		subscribeToEvents = function (state) {
			var eventAction = state ? 'addEventListener' :
					'removeEventListener';

			// Apply the event listener states to the eventHandlers.
			global.core[eventAction]('ImageStreamReady', onImageStreamReady);
			global.core[eventAction]('DrawComplete', onDrawComplete);
			global.core[eventAction]('BeforeDispose', onBeforeDispose);
		},

		initialize = function () {
			var item;

			if (config.invokeCSS === true) {
				css.invoke('print');
			}
			// Iterate through all FusionCharts object reference and
			// do a fake call to onDrawComplete event
			for (item in global.core.items) {
				queueTrigger(global.core.items[item]);
				queueTrigger();
			}

		},

		destroy = function () {
			var item;

			// Hide any of the canvas element in case user disables
			// print manager.
			css.invoke('error');
			// Iterate through all FusionCharts object reference and remove
			// their canvases if present.
			for (item in global.core.items) {
				lib.removeCanvasElementOf(global.core.items[item]);
			}
			if (!config.bypass) {
				global.raiseEvent('PrintReadyStateChange', {
					ready: false,
					bypass: config.bypass
				});
			}
			// Finally remove all traces of CSS
			css.invoke('normal');
		};

    queueTrigger  = function (obj) {
		var item;
        // In case the first argument is not undefined, it implies that an item
        // is to be queued up
        if (obj instanceof global.core) {
            queuedItems[obj.id] = obj;
            return;
        }

        // Proceed with processing the queue
        for (item in queuedItems) {
            onDrawComplete({
                sender: queuedItems[item]
            }, {});
            delete queuedItems[item];
        }
    };

    global.extend(global.core, {
        printManager: {
            // This method allows users to confiure and reconfigure the
            // configuration of this script.
            configure: function (configuration) {
                global.extend(config, configuration || {});
            },

            isReady: function () {

                // In case the printManager is bypassed, we always say that it
                // is ready. This keeps dependent scripts not to fail.
                if (config.bypass) {
                    return true;
                }

                // Check if there is any active job or not and whether printManager
                // is disabled. In either case, it is not ready.
                if (activeCount > 0 || !config.enabled) {
                    return false;
                }

                var item, ref;
                // Check each element to see whether it is rendered. In
                // case they are rendered, and there is no active jobs (as
                // checked earlier), it implies that all items are successfully
                // rendered.
                for (item in global.core.items) {
                    if ((ref = global.core.items[item].ref) !== undefined &&
							ref.hasRendered && ref.hasRendered() === false) {
						return false;
                    }

                }
                return true;
            },

            // Enable or disable canvas print manager. In case browser is not
            // supported, do not allow to enable
            enabled: function (state) {
                // If no parameter is passed, it is assumed that user simply
                // needs the current status. So we return the current status.
                if (state === undefined) {
                    return config.enabled;
                }

                // Check browser capability to fulfill minimum requirements for
                // this script. Do not proceed if browser is IE
                if ('\v' === 'v' || global.renderer.currentRendererName() !== 'flash' ||
						typeof document.createElement('canvas').getContext !== 'function') {
                    config.bypass = true;
                    global.raiseEvent('PrintReadyStateChange', {
                        ready: true,
                        bypass: config.bypass
                    });
                    global.raiseWarning(global.core, '25081816', 'run', '.printManager.enabled',
                        'printManager is not compatible with your browser');
                    return config.enabled;
                }
                config.bypass = false;

                // Apply the event listener states to the eventHandlers.
                subscribeToEvents(state);

                // Perform initialization or cleanup depending upon the state.
                if (state === true) {
                    initialize();
                } else {
                    destroy();
                }
                // Return the updated state value.
                return (config.enabled = state);
            },

            managedPrint: function (eventArg) {

                // In case printManager is bypassed due to some reason, we directly
                // invoke the print function of browser.
                if (config.bypass) {
                    window.print();
                    return;
                }

                // In case managedPrint is called and PrintManager is not enabled,
                // we enable it and then wait to raise windows print function
                // as printreadystatechange returns true.
                if (!global.core.printManager.isReady()) {
                    // Enable Print Manager
                    if (global.core.printManager.enabled(true) !== true) {
                        // If enabling fails, then just invoke a print.
                        window.print();
                        return;
                    }
                    // Subscribe to the print ready state change event
                    global.addEventListener('PrintReadyStateChange',
                        global.core.printManager.managedPrint);

                    return;
                }

                // In case this function is invoked by event-handler, I check
                // when active is marked as true.
                if (typeof eventArg === 'object' && eventArg.ready !== true) {
                    return;
                }

                // Remove the event that watches completion of canvas image creation
                global.removeEventListener('PrintReadyStateChange',
                    global.core.printManager.managedPrint);

                // Execute Printing.
                window.print();
            }
        }
    }, false);

    // Add the event names that this module raises to the events collection.
    FusionChartsEvents.PrintReadyStateChange = 'printreadystatechange';

}());



