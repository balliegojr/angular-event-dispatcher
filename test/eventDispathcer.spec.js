describe("eventDispatcherModule", function() {
	'use strict';

	beforeEach(module('eventDispatcherModule'));

	describe('eventDispatcherProvider', function() {
		var provider, eventDispatcher;

		beforeEach(module(['eventDispatcherProvider', function(eventDispatcherProvider) {
			provider = eventDispatcherProvider;
			provider.strictModeOn();
		}]));

		beforeEach(inject(function() {

		}));



		beforeEach(inject(function(_eventDispatcher_) {
			eventDispatcher = _eventDispatcher_;
		}));

		describe('describe a strictModeOn method that', function() {
			it('is defined', function() {
				expect(provider.strictModeOn).toBeDefined();
			});

			it('set the strictMode to ON', function() {
				provider.strictModeOn();
			});

			it('alters the on method behavior', function() {

				var fn = function(){
					eventDispatcher.on('unregistered', function(){});
				};

				expect(fn).toThrow('EventDispatcher: unregistered not registered');
			});

			it('alters the trigger method behavior', function() {
				var fn = function(){
					eventDispatcher.trigger('unregistered', function(){});
				};

				expect(fn).toThrow('EventDispatcher: unregistered not registered');
			});

			it('alters the off method behavior', function() {
				var fn = function(){
					eventDispatcher.off('unregistered', function(){});
				};

				expect(fn).toThrow('EventDispatcher: unregistered not registered');
			});
		});

		describe('the register method that', function() {
			it('it is defined', function() {
				expect(eventDispatcher.register).toBeDefined();
			});

			it('register an event with strict', function() {
				eventDispatcher.register('event');

				var fn = function(){
					eventDispatcher.on('event', function(){});
				};

				expect(fn).not.toThrow();
			});

			it('do nothing if try to register twice', function() {
				eventDispatcher.register('event');

				var fn = jasmine.createSpy('fn');
				eventDispatcher.on('event', fn);

				eventDispatcher.register('event'); //do nothing

				eventDispatcher.trigger('event');

				expect(fn).toHaveBeenCalled();
			});
		});
	});

	describe("eventDispatcher", function() {
		var dispatcher;
		var stub = {
			fn: function(){}
		};

		beforeEach(inject(function(eventDispatcher) {
			dispatcher = eventDispatcher;
			expect(dispatcher).toBeDefined();

			spyOn(stub, 'fn');
		}));

		describe("the method on", function() {
			it("it's defined", function() {
				expect(dispatcher.on).toBeDefined();
			});

			it("subscribe to an event", function() {
				dispatcher.on('event', stub.fn);
				dispatcher.trigger('event');

				expect(stub.fn).toHaveBeenCalled();
			});

			it("subscribe to multiple events", function() {
				dispatcher.on(['event', 'event2', 'event3'], stub.fn);
				dispatcher.trigger('event');
				dispatcher.trigger('event2');
				dispatcher.trigger('event3');

				expect(stub.fn.calls.count()).toBe(3);
			});

			it("return an unsubscriber", function() {
				var unsub = dispatcher.on('event', function() {

				});

				expect(unsub).not.toBeNull();
				expect(unsub).toBeDefined();
			});

			it('unsubscribe an event through the unsubscriber', function(){
				var ev = dispatcher.on('event', stub.fn);
				dispatcher.on('event', jasmine.createSpy('spy'));

				ev();
				dispatcher.trigger('event');
				expect(stub.fn).not.toHaveBeenCalled();
			});

			it('unsubscribe multiple events through the unsubscriber', function(){
				var ev = dispatcher.on(['event', 'event2'], stub.fn);

				ev();
				dispatcher.trigger('event');
				dispatcher.trigger('event2');
				expect(stub.fn).not.toHaveBeenCalled();
			});
		});

		describe('the trigger method', function() {
			it('is defined', function() {
				expect(dispatcher.trigger).toBeDefined();
			});

			it('fires an event', function() {
				dispatcher.on('newEvent', stub.fn);

				dispatcher.trigger('newEvent');
				expect(stub.fn).toHaveBeenCalled();
			});


			it('do not fires an event if there is no listener', function() {
				dispatcher.trigger('newEvent');
			});

			it('fires an event for multiples listeners', function() {
				dispatcher.on('newEvent', stub.fn);
				dispatcher.on('newEvent', stub.fn);
				dispatcher.on('newEvent', stub.fn);

				dispatcher.trigger('newEvent');

				expect(stub.fn).toHaveBeenCalled();
				expect(stub.fn.calls.count()).toBe(3);
			});

			it('passes data to the event', function() {

				dispatcher.on('dataEvent', function(arg) {
					expect(arg.ctx).toBe('value');
				});

				dispatcher.trigger('dataEvent', {
					ctx: 'value'
				});
				dispatcher.trigger('dataEvent', [{
					ctx: 'value'
				}]);
			});

		});

		describe('the off method', function() {
			it('is defined', function() {
				expect(dispatcher.off).toBeDefined();
			});

			it('unsubscribe an event', function() {
				dispatcher.on('newEvent', stub.fn);
				dispatcher.off('newEvent', stub.fn);

				dispatcher.trigger('newEvent');
				expect(stub.fn).not.toHaveBeenCalled();
			});

			it('unsubscribe multiple events', function() {
				var events = ['event', 'event2'];
				dispatcher.on(events, stub.fn);
				dispatcher.off(events, stub.fn);

				dispatcher.trigger('event');
				dispatcher.trigger('event2');
				expect(stub.fn).not.toHaveBeenCalled();
			});

			it('do nothing if no event was found', function() {
				dispatcher.off('newEvent');
			});

			it('unsubscribe only the callback of an event', function() {
				stub.fn2 = function(){};
				spyOn(stub, 'fn2');

				dispatcher.on('newEvent', stub.fn);
				dispatcher.on('newEvent', stub.fn2);
				dispatcher.off('newEvent', stub.fn);

				dispatcher.trigger('newEvent');

				expect(stub.fn).not.toHaveBeenCalled();
				expect(stub.fn2).toHaveBeenCalled();
			});
		});


		it('ensure that no error will stop the execution', function() {
			var errFn = function(){
				throw 'err';
			};

			var fn = jasmine.createSpy('fn');

			dispatcher.on('event', errFn);
			dispatcher.on('event', fn);

			dispatcher.trigger('event');
			expect(fn).toHaveBeenCalled();
		});
	});
});