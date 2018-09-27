'use strict';
angular.module('copayApp.services')
  .factory('bitcoreBzc', function bitcoreBzcFactory(bwcService) {
    var bitcoreBzc = bwcService.getBitcoreBzc();
    return bitcoreBzc;
  });
