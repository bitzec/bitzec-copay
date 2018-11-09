'use strict';

angular.module('copayApp.controllers').controller('collectEmailController', function($scope, $state, $log, $timeout, $http, $httpParamSerializer, $ionicConfig, profileService, configService, walletService, appConfigService, emailService) {

  var wallet, walletId;
  $scope.data = {};
  // Get more info: https://mashe.hawksey.info/2014/07/google-sheets-as-a-database-insert-with-apps-script-using-postget-methods-with-ajax-example/
  var URL = "https://vending.bitzec.cf/api";

  var _post = function(dataSrc) {
    return {
      method: 'POST',
      url: URL,
      headers: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: $httpParamSerializer(dataSrc)
    };
  };

  $scope.$on("$ionicView.beforeLeave", function() {
    $ionicConfig.views.swipeBackEnabled(true);
  });

  $scope.$on("$ionicView.enter", function() {
    $ionicConfig.views.swipeBackEnabled(false);
  });

  $scope.$on("$ionicView.beforeEnter", function(event, data) {
    walletId = data.stateParams.walletId;
    wallet = profileService.getWallet(walletId);
    $scope.data.accept = true;
  });

  var collectEmail = function() {
    walletService.getAddress(wallet,false,function(err,addr){
      var dataSrc = {
        "type": "register",
        "App": appConfigService.nameCase,
        "emailaddress": $scope.data.email,
        "Platform": ionic.Platform.platform(),
        "DeviceVersion": ionic.Platform.version(),
        "sysUID": ionic.Platform.platform(), //ToDo: Set this to device specific data
        "coinaddress": addr
        };

        $http(_post(dataSrc)).then(function() {
          $log.info("SUCCESS: Email collected");
        }, function(err) {
          $log.error("ERROR: Could not collect email");
        });
      });
  };

  $scope.save = function() {
    $scope.disableButton = true;
    $timeout(function() {
      var enabled = true; // Set enabled email: true

      emailService.updateEmail({
        enabled: enabled,
        email: enabled ? $scope.data.email : null
      });
          
      if ($scope.data.accept) collectEmail();

      $timeout(function() {
        $scope.goNextView();
      }, 200);
    }, 200);
  };

  $scope.goNextView = function() {
    $state.go('onboarding.backupRequest', {
      walletId: walletId
    });
  };

  $scope.confirm = function(emailForm) {
    if (emailForm.$invalid) return;
    $scope.confirmation = true;
  };

  $scope.cancel = function() {
    $scope.confirmation = false;
    $timeout(function() {
      $scope.$digest();
    }, 1);
  };

});
