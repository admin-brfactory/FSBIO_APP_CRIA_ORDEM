sap.ui.define([], function() {
	"use strict";

	return {
		/**
		 * Rounds the currency value to 2 digits
		 *
		 * @public
		 * @param {string} sValue value to be formatted
		 * @returns {string} formatted currency value with 2 digits
		 */
		formatSemana: function(sValue) {
			if(!sValue){
				return;
			}
			
			sValue = sValue.substr(4);
			
			return sValue;
		},

		formatDate: function(sValue) {
			if (!sValue) {
				return;
			}

			sValue = sValue.substr(6) + "/" + sValue.substr(4, 2) + "/" + sValue.substr(0, 4);

			return sValue;

		}

	};

});