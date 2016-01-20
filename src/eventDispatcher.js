/*global angular, Registry*/

(function() {
	'use strict';

	function Dispatcher(registryFactory, strictMode){
		this._eventSubscriptions = registryFactory.newRegistry();
		this._strictMode = strictMode;
	}

	function Unsubscriber(that, eventName, callback) {
		return function() {
			that.off(eventName, callback);
		};
	}

	/*

		Register a new event of the given name
		Must be used when strictMode = true

	*/
	Dispatcher.prototype.register = function(eventName){
		var subscribers = this._eventSubscriptions.getValue(eventName);

		if (typeof subscribers === 'undefined') {
			// If no subscribers for this event were found,
			// initialize a new empty array
			subscribers = [];
			this._eventSubscriptions.register(eventName, subscribers);
		}
	};

	Dispatcher.prototype._subscribe = function(eventName, callback){
		// Retrieve a list of current subscribers for eventName (if any)
		var subscribers = this._eventSubscriptions.getValue(eventName);
		console.error(this._strictMode);

		if (typeof subscribers === 'undefined'){
			if (this._strictMode === true){
				throw 'EventDispatcher: ' + eventName + ' not registered';
			}

			this.register(eventName);
			subscribers = this._eventSubscriptions.getValue(eventName);
		}


		// Add the given callback function to the end of the array with
		// eventSubscriptions for this event.
		subscribers.push(callback);
	};

	Dispatcher.prototype._unsubscribe = function(eventName, callback){
		var subscribers = this._eventSubscriptions.getValue(eventName),
			i;

		if ( typeof subscribers === 'undefined') {
			// No list found for this event, return early to abort execution

			if (!this._strictMode){
				return;
			}

			throw 'EventDispatcher: ' + eventName + ' not registered';
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
	Dispatcher.prototype.on = function(eventName, callback) {
		if (eventName instanceof Array){
			for (var i = 0; i < eventName.length; i++) {
				this._subscribe(eventName[i], callback);
			}
		} else {
			this._subscribe(eventName, callback);
		}

		return new Unsubscriber(this,eventName, callback);
	};



	Dispatcher.prototype.off = function(eventName, callback) {
		if (eventName instanceof Array){
			for (var i = 0; i < eventName.length; i++) {
				this._unsubscribe(eventName[i], callback);
			}
		} else {
			this._unsubscribe(eventName, callback);
		}
	};

	Dispatcher.prototype.trigger = function(eventName, data, context) {
		var subscribers = this._eventSubscriptions.getValue(eventName),
			i;

		if (typeof subscribers === 'undefined') {
			// No list found for this event, return early to abort execution
			if (!this._strictMode){
				return;
			}

			throw 'EventDispatcher: ' + eventName + ' not registered';
		}

		// Ensure data is an array or is wrapped in an array,
		// for Function.prototype.apply use
		data = (data instanceof Array) ? data : [data];

		// Set a default value for `this` in the callback
		context = context || this.caller;

		for (i = subscribers.length - 1; i >= 0; i--) {
			try {
				subscribers[i].apply(context, data);
			} catch (e) {
				console.error(e);
			}
		}
	};

	angular.module('eventDispatcherModule', ['RegistryModule'])
	.provider('eventDispatcher', [function() {

		var strictMode = false;

		this.strictModeOn = function(){
			strictMode = true;
		};


		this.$get = ['RegistryFactory', function(RegistryFactory){
			return new Dispatcher(RegistryFactory, strictMode);
		}];

	}]);
})();