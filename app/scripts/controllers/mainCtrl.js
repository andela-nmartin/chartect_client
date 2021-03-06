angular.module('charts.controllers')
  .controller('MainCtrl', ['$rootScope', '$scope', '$mdDialog', '$mdMedia',
    '$timeout', '$mdSidenav', '$log',

    function($rootScope, $scope, $mdDialog, $mdMedia, $timeout,
      $mdSidenav, $log) {

      $scope.showPrompt = function(ev) {
        var useFullScreen = ($mdMedia('sm') ||
          $mdMedia('xs')) && $scope.customFullscreen;

        $mdDialog.show({
            controller: 'DataCtrl',
            templateUrl: 'views/data.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: useFullScreen
          })
          .then(function(answer) {
            $scope.status = 'You said the information was "' + answer + '".';
          }, function() {
            $scope.status = 'You cancelled the dialog.';
          });
        $scope.$watch(function() {
          return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
          $scope.customFullscreen = (wantsFullScreen === true);
        });
      };

      // side nav

      $scope.toggleLeft = buildDelayedToggler('left');

      function debounce(func, wait, context) {
        var timer;
        return function debounced() {
          context = $scope;
          var args = Array.prototype.slice.call(arguments);
          $timeout.cancel(timer);
          timer = $timeout(function() {
            timer = undefined;
            func.apply(context, args);
          }, wait || 10);
        };
      }
      /**
       * Build handler to open/close a SideNav; when animation finishes
       * report completion in console
       */
      function buildDelayedToggler(navID) {
        return debounce(function() {
          // Component lookup should always be available
          $mdSidenav(navID)
            .toggle()
            .then(function() {
              $log.debug('toggle ' + navID + ' is done');
            });
        }, 200);
      }

      function buildToggler(navID) {
        return function() {
          // Component lookup should always be available
          $mdSidenav(navID)
            .toggle()
            .then(function() {
              $log.debug('toggle ' + navID + ' is done');
            });
        };
      }
      $scope.close = function() {
        // Component lookup should always be available -we are not using `ng-if`
        $mdSidenav('left').close()
          .then(function() {
            $log.debug('close LEFT is done');
          });
      };
    }
  ]);
