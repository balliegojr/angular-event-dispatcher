/*global angular*/

(function() {
	'use strict';

	angular.module('eventDispatcherModule', ['RegistryModule']).service('eventDispatcher', ['RegistryFactory', function(RegistryFactory) {
		var eventSubscriptions = RegistryFactory.newRegistry();
		var that = this;
		function Unsubscriber(eventName, callback) {
			return function() {
				that.off(eventName, callback);
			};
		}

		var subscribe = function(eventName, callback){
			// Retrieve a list of current subscribers for eventName (if any)
			var subscribers = eventSubscriptions.getValue(eventName);

			if (typeof subscribers === 'undefined') {
				// If no subscribers for this event were found,
				// initialize a new empty array
				subscribers = [];
				eventSubscriptions.register(eventName, subscribers);
			}

			// Add the given callback function to the end of the array with
			// eventSubscriptions for this event.
			subscribers.push(callback);
		};

		var unsubscribe = function(eventName, callback){
			var subscribers = eventSubscriptions.getValue(eventName),
				i;

			if ( typeof subscribers === 'undefined') {
				// No list found for this event, return early to abort execution
				return;
			}

			for (i = subscribers.length - 1; i >= 0; i--) {
				if (subscribers[i] === callback) {
					subscribers.splice(i, 1);
				}
			}
		};

		/*
			Subscribe to an event or array of events
			returns an object to destroy the eventListener
		*/
		this.on = function(eventName, callback) {
			if (eventName instanceof Array){
				for (var i = 0; i < eventName.length; i++) {
					subscribe(eventName[i], callback);
				}
			} else {
				subscribe(eventName, callback);
			}

			return new Unsubscriber(eventName, callback);
		};



		this.off = function(eventName, callback) {
			if (eventName instanceof Array){
				for (var i = 0; i < eventName.length; i++) {
					unsubscribe(eventName[i], callback);
				}
			} else {
				unsubscribe(eventName, callback);
			}
		};

		this.trigger = function(eventName, data, context) {
			var subscribers = eventSubscriptions.getValue(eventName),
				i;

			if (typeof subscribers === 'undefined') {
				// No list found for this event, return early to abort execution
				return;
			}

			// Ensure data is an array or is wrapped in an array,
			// for Function.prototype.apply use
			data = (data instanceof Array) ? data : [data];

			// Set a default value for `this` in the callback
			context = context || this.caller;

			for (i = subscribers.length - 1; i >= 0; i--) {
				subscribers[i].apply(context, data);
			}
		};
	}]);
})();
/* global angular */

(function(){
	'use strict';

	function Registry(defaultValue) {
		var _values = Object.create(null);
		var _defaultValue = defaultValue;

		this.register = function(name, value){
			_values[name] = value;
		};

		this.getValue = function(name) {
			if (Object.prototype.hasOwnProperty.call(_values, name)) {
				return _values[name];
			}

			return _defaultValue;
		};

		this.getValues = function(){
			var values = [];
			for (var value in _values){
				values.push(_values[value]);
			}

			return values;
		};
	}

	/**
	* Registry Module
	*
	* Description
	*/
	angular.module('RegistryModule', []).factory('RegistryFactory', [function() {
		return {
			newRegistry: function(defaultValue){
				return new Registry(defaultValue);
			}
		};
	}]);


})();
