describe("eventDispatcherModule", function() {
	'use strict';

	beforeEach(module('RegistryModule'));
	describe("the Registry factory", function() {
		var registryFactory;

		beforeEach(inject(function(RegistryFactory) {
			registryFactory = RegistryFactory;

			expect(registryFactory).toBeDefined();
		}));

		describe("the newRegistry method", function() {
			it("should be defined", function() {
				expect(registryFactory.newRegistry).toBeDefined();
			});

			it("should return a new Registry", function() {
				var registry = registryFactory.newRegistry();
				expect(registry).toBeDefined();

			});

			it("should return a new Registry with defaultValue", function() {
				var registry = registryFactory.newRegistry('defaultValue');
				expect(registry.getValue('prop')).toBe('defaultValue');
			});

			describe("the register method", function() {
				it("should be defined", function() {
					var registry = registryFactory.newRegistry();
					expect(registry.register).toBeDefined();
				});
				it("should register a value", function() {
					var registry = registryFactory.newRegistry();
					registry.register('prop', 'value');

					expect(registry.getValue('prop')).toBe('value');
				});
			});

			describe("the getValue method", function() {
				it("should be defined", function() {
					var registry = registryFactory.newRegistry();
					expect(registry.getValue).toBeDefined();
				});

				it("should return a value", function() {
					var registry = registryFactory.newRegistry();
					registry.register('prop', 'value');
					expect(registry.getValue('prop')).toBe('value');
				});

				it("should return the defaultValue if none is defined", function() {
					var registry = registryFactory.newRegistry('default');
					expect(registry.getValue('prop')).toBe('default');
				});
			});

			describe('the getValues method', function() {
				it("should be defined", function() {
					var registry = registryFactory.newRegistry();
					expect(registry.getValues).toBeDefined();
				});

				it('should return all the values from the registry', function() {
					var registry = registryFactory.newRegistry();
					registry.register('prop', 'value');
					registry.register('prop2', 'value2');

					expect(registry.getValues()).toContain('value');
					expect(registry.getValues()).toContain('value2');
				});
			});

			it("should be isolated", function() {
				var registry = registryFactory.newRegistry();
				var registryTwo = registryFactory.newRegistry();

				registry.register('prop', 'value');
				expect(registryTwo.getValue('prop')).toBeUndefined();
			});
		});
	});
});