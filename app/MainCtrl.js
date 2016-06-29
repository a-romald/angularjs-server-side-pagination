angular.module('app').controller('MainCtrl', function($scope, $rootScope, $http) {	    
	
	var vm = this;

    vm.items = []; //declare an empty array
    vm.pageno = 1; // initialize page no to 1
    vm.total_count = 0;
    vm.itemsPerPage = 10; //this could be a dynamic value from a drop down    

    $scope.p = vm.pageno;

    $scope.query = {};

    //Sort functions
    $scope.sortField = undefined;
    $scope.reverse = false;

    //Sort items
    $scope.sort = function(fieldName) {
      if ($scope.sortField === fieldName) {
        $scope.reverse = !$scope.reverse;
      }
      else {
        $scope.sortField = fieldName;
        $scope.reverse = false;
      }      
      
      for (var key in $scope.query)
      {
          if ($scope.query.hasOwnProperty(key))
          {
            if ($scope.query[key] == "") delete $scope.query[key];
          }
      }
      var filters = $scope.query;
      filters = JSON.stringify(filters);

      vm.items = [];
      $http.get("backend/members.php?num=" + vm.itemsPerPage + "&page=" + $scope.p + "&order=" + $scope.sortField + "&desc=" + $scope.reverse + "&query=" + filters).success(function(response){
            //ajax request to fetch data into vm.data
            vm.items = response.data;  // data to be displayed on current page.
            vm.total_count = response.total_count; // total data count.
        });     
    }


    //Sort direction
    $scope.isSortUp = function(fieldName) {
       return $scope.sortField === fieldName && !$scope.reverse;
    }

    $scope.isSortDown = function(fieldName) {
       return $scope.sortField === fieldName && $scope.reverse;
    }
    //end sort
    
        

    vm.getData = function(pageno){ // This would fetch the data on page change.
        for (var key in $scope.query)
        {
            if ($scope.query.hasOwnProperty(key))
            {
              if ($scope.query[key] == "") delete $scope.query[key];
            }
        }
        var filters = $scope.query;
        filters = JSON.stringify(filters); 
        //In practice this should be in a factory.
        vm.items = [];
        $http.get("backend/members.php?num=" + vm.itemsPerPage + "&page=" + pageno + "&order=" + $scope.sortField + "&desc=" + $scope.reverse + "&query=" + filters).success(function(response){
                vm.items = response.data;  // data to be displayed on current page.
                vm.total_count = response.total_count; // total data count.
            });
        $scope.p = pageno;
    };
    vm.getData(vm.pageno); // Call the function to fetch initial data on page load.

    

    $scope.showFiltered = function() {
        for (var key in $scope.query)
        {
            if ($scope.query.hasOwnProperty(key))
            {
              if ($scope.query[key] == "") delete $scope.query[key];
            }
        }
        var filters = $scope.query;
        filters = JSON.stringify(filters);
        //console.log(filters);
        vm.items = [];
        $http.get("backend/members.php?num=" + vm.itemsPerPage + "&page=" + $scope.p + "&order=" + $scope.sortField + "&desc=" + $scope.reverse + "&query=" + filters).success(function(response){
                vm.items = response.data;  // data to be displayed on current page.
                vm.total_count = response.total_count; // total data count.                
            });
    }



	
});