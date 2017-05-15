'use strict';

angular.module('myApp.view1', ['ngAnimate', 'ngSanitize','ui.bootstrap','ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl',function($scope, $http, $uibModal, $log) {
  var map, infoWindow, service, pos,
    slide = "show";

  $scope.isReadonly = true;

  $scope.user = {
    name: null,
    email: null,
    rating: null,
    review: null,
    placeId:null,
    placeName:null
  };
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 5
  });
  service = new google.maps.places.PlacesService(map);
  infoWindow = new google.maps.InfoWindow;

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(pos);
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(pos.lat, pos.lng),
        map: map
      });
      marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png')
      map.setCenter(pos);
      map.setZoom(18);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
  // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

  $scope.findEateries = function() {
    service.nearbySearch({
      location : pos,
      radius : 5000,
      type : [ 'restaurant' ]
    }, callback);
  }

  function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }
    }
  }

  function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }
    }
  }

  function createMarker(place) {

    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map : map,
      position : place.geometry.location
    });
    map.setZoom(14);
    google.maps.event.addListener(marker, 'click', function() {
      return $http({
          url: '/getReviews' + place.id,
          method: "GET",
          headers: {
              'Content-Type': 'application/json'
          }
      }).then(function(data, status, headers, config) {
        if (data.status !== 200) {
          console.log("Something went wrong");
          return;
        }
        var localData = data.data;
        var request = {
          reference: place.reference
        };
        service.getDetails(request, function(place, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            slide = "show";
            animate();
            var contentStr = '<img scr=' + place.photos[0].getUrl({maxHeight:300,maxWidth:300}) + '>' +
            '<h5>'+place.name+'</h5><p>'+place.formatted_address;
            if (!!place.formatted_phone_number) contentStr += '<br>'+place.formatted_phone_number;
            if (!!place.website) contentStr += '<br><a target="_blank" href="'+place.website+'">'+place.website+'</a>';
            contentStr += '<br>'+place.types+'</p>';
            infoWindow.setContent(contentStr);
            infoWindow.open(map,marker);
            $scope.place=place;
            $scope.user.placeId = place.id;
            $scope.user.placeName = place.name;
            $scope.place.reviews = $scope.place.reviews.concat(localData);
            $scope.$apply();

          } else {
            var contentStr = "<h5>No Result, status="+status+"</h5>";
            infoWindow.setContent(contentStr);
            infoWindow.open(map,marker);
          }
          infoWindow.open(map, marker);
        });
      });
    });
  }
  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
  }

  function animate() {
    var element = document.getElementById('anime');
    if (slide == "show") {
      transition.begin(element, "transform translateX(0px) translateX(400px) 1s", {
        beginFromCurrentValue: true
      });
      slide = "hide";
    } else  if(slide == "hide"){
      transition.begin(element, "transform translateX(400px) translateX(0px) 1s", {
        beginFromCurrentValue: true
      });
      slide = "show";
    }
  }

  $scope.hideSlide = function hideSlide() {
    slide = "hide";
      animate();
  }

// creating a modal to add review
  $scope.open = function () {
      $uibModal.open({
        templateUrl: 'myModalContent.html', // loads the template
        backdrop: true, // setting backdrop allows us to close the modal window on clicking outside the modal window
        windowClass: 'modal', // windowClass - additional CSS class(es) to be added to a modal window template
        controller: function ($scope, $uibModalInstance, $log, user) {
          $scope.user = user;
          $scope.submit = function () {
            var data = {
              placeId: $scope.user.placeId,
              placeName: $scope.user.placeName,
              rating: user.rating,
              review: user.review,
              name: user.name,
              email: user.email
            };
            return $http({
              url: '/saveReview',
              method: "POST",
              data: data,
              headers: {
                'Content-Type': 'application/json'
              }
            }).then(function(data, status, headers, config) {
              $uibModalInstance.dismiss('cancel');
              $scope.user.name = $scope.user.email = $scope.user.rating = $scope.user.review = null;
              slide = "hide";
              animate();
                return data;
            });
          }
          $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
            $scope.user.name = $scope.user.email = $scope.user.rating = $scope.user.review = null;
          };
        },
      resolve: {
        user: function () {
          return $scope.user;
        }
      }
    });//end of modal.open
  };// end of scope.open function
})

.directive('starRating', starRating);

function starRating() {
  return {
    restrict: 'EA',
    template:
      '<ul class="star-rating" ng-class="{readonly: readonly}">' +
      '  <li ng-repeat="star in stars" class="star" ng-class="{filled: star.filled}" ng-click="toggle($index)">' +
      '    <i class="fa fa-star"></i>' + // or &#9733
      '  </li>' +
      '</ul>',
    scope: {
      ratingValue: '=ngModel',
      max: '=?', // optional (default is 5)
      onRatingSelect: '&?',
      readonly: '=?'
    },
    link: function(scope, element, attributes) {
      if (scope.max == undefined) {
        scope.max = 5;
      }
      function updateStars() {
        scope.stars = [];
        for (var i = 0; i < scope.max; i++) {
          scope.stars.push({
            filled: i < scope.ratingValue
          });
        }
      };
      scope.toggle = function(index) {
        if (scope.readonly == undefined || scope.readonly === false){
          scope.ratingValue = index + 1;
          scope.onRatingSelect({
            rating: index + 1
          });
        }
      };
      scope.$watch('ratingValue', function(oldValue, newValue) {
        if (newValue || newValue === 0) {
          updateStars();
        }
      });
    }
  };
}