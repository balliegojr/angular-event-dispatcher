describe("eventDispatcherModule", function() {
	'use strict';

	describe("eventDispatcher", function() {
		var dispatcher;
		var stub = {
					fn: function(){}
				};

		beforeEach(module('eventDispatcherModule'));
		beforeEach(inject(function(eventDispatcher) {
			dispatcher = eventDispatcher;
			expect(dispatcher).toBeDefined();

			spyOn(stub, 'fn');
		}));

		describe("the method subscribe", function() {
			it("it's defined", function() {
				expect(dispatcher.subscribe).toBeDefined();
			});

			it("subscribe to an event", function() {
				dispatcher.subscribe('event', function() {

				});
			});

			it("return an unsubscriber", function() {
				var unsub = dispatcher.subscribe('event', function() {

				});

				expect(unsub).not.toBeNull();
				expect(unsub).toBeDefined();
			});

			it("the unsubscriber have a destroy method", function() {
				var unsub = dispatcher.subscribe('event', function() {

				});

				expect(unsub.destroy).toBeDefined();
			});

			it('unsubscribe an event through destroy', function(){
				var unsub = dispatcher.subscribe('event', stub.fn);
				dispatcher.subscribe('event', jasmine.createSpy('spy'));

				unsub.destroy();
				dispatcher.trigger('event');
				expect(stub.fn).not.toHaveBeenCalled();
			});
		});

		describe('the trigger method', function() {
			it('is defined', function() {
				expect(dispatcher.trigger).toBeDefined();
			});

			it('fires an event', function() {
				dispatcher.subscribe('newEvent', stub.fn);

				dispatcher.trigger('newEvent');
				expect(stub.fn).toHaveBeenCalled();
			});


			it('do not fires an event if there is no listener', function() {
				dispatcher.trigger('newEvent');
			});

			it('fires an event for multiples listeners', function() {
				dispatcher.subscribe('newEvent', stub.fn);
				dispatcher.subscribe('newEvent', stub.fn);
				dispatcher.subscribe('newEvent', stub.fn);

				dispatcher.trigger('newEvent');

				expect(stub.fn).toHaveBeenCalled();
				expect(stub.fn.calls.count()).toBe(3);
			});

			it('passes data to the event', function() {

				dispatcher.subscribe('dataEvent', function(arg) {
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

		describe('the unsubscribe method', function() {
			it('is defined', function() {
				expect(dispatcher.unsubscribe).toBeDefined();
			});

			it('unsubscribe an event', function() {
				dispatcher.subscribe('newEvent', stub.fn);
				dispatcher.unsubscribe('newEvent', stub.fn);

				dispatcher.trigger('newEvent');
				expect(stub.fn).not.toHaveBeenCalled();
			});

			it('do nothing if no event was found', function() {
				dispatcher.unsubscribe('newEvent');
			});

			it('unsubscribe only the callback of an event', function() {
				stub.fn2 = function(){};
				spyOn(stub, 'fn2');

				dispatcher.subscribe('newEvent', stub.fn);
				dispatcher.subscribe('newEvent', stub.fn2);
				dispatcher.unsubscribe('newEvent', stub.fn);

				dispatcher.trigger('newEvent');

				expect(stub.fn).not.toHaveBeenCalled();
				expect(stub.fn2).toHaveBeenCalled();
			});
		});
	});
});