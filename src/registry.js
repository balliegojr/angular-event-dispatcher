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
