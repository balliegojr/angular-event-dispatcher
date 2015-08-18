/*global angular*/

(function() {
	'use strict';

	angular.module('eventDispatcherModule', ['RegistryModule']).service('eventDispatcher', ['RegistryFactory', function(RegistryFactory) {
		var eventSubscriptions = RegistryFactory.newRegistry();

		function Unsubscriber(eventName, callback) {
			this.destroy = function() {
				var subscribers = eventSubscriptions.getValue(eventName),
					i;

				for (i = subscribers.length - 1; i >= 0; i--) {
					if (subscribers[i] === callback) {
						subscribers.splice(i, 1);
					}
				}
			};
		}

		this.subscribe = function(eventName, callback) {
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
			return new Unsubscriber(eventName, callback);
		};

		this.unsubscribe = function(eventName, callback) {
			var subscribers = eventSubscriptions.getValue(eventName),
				i;

			if (typeof subscribers === 'undefined') {
				// No list found for this event, return early to abort execution
				return;
			}

			for (i = subscribers.length - 1; i >= 0; i--) {
				if (subscribers[i] === callback) {
					subscribers.splice(i, 1);
				}
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