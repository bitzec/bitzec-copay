
'use strict';
angular.module('copayApp.services')
  .factory('sjcl', function bitcoreBzcFactory(bwcService) {
    var sjcl = bwcService.getSJCL();
    return sjcl;
  });
