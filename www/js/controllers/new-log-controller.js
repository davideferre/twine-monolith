/*
* CONTENTS
*
* new log controller
*    store the form data
*    update total duration logged this date
*    setup datepickers
*    populate hours dropdown
*    populate minutes dropdown
*    calculate duration
*    populate user_id field
*    process the new log form
*      validate form
*      submit form
*    push to offline data
*/

/*
/*
	> new log controller
*/

	angular.module('app.controllers').controller('NewLogController', function (
		$scope, $stateParams, $http, $state, $filter, $ionicLoading, $localStorage, $rootScope, $timeout, 
		$$api, $$utilities, $$shout, $$offline
	) {

		/*
			>> store the form data
		*/

			$scope.formData = {};

			$scope.volunteers = [];

        	$scope.displayedVolunteers = [];

			$scope.volunteerNameFilter = '';

			$scope.activities = [];

			$scope.isAdmin = $rootScope.isAdmin;

			$scope.selectedVolunteers = [];

			$scope.selectedUser = {
			    id : ''
            };






		/*
			>> update total duration logged this date 
		*/

			$scope.calculateTotalDurationThisDate = function() {
				
				var sqlDate = $scope.formData.date_of_log.split(' ')[0];

				$$api.user.totalHoursForDay($localStorage.user.id, sqlDate).success(function(result) {
					if ($scope.formData.duration === undefined) {
						$scope.formData.duration = 0;
					}
					$scope.formData.totalDurationThisDate = result.data.duration + $scope.formData.duration;
				});

			};

        /*
        >> volunteers selector filtrationa
    	*/

        	$scope.filterVolunteersByName = function (matchString) {
				if (volunteers.length !== 0) {
                    $scope.displayedVolunteers = $scope.volunteers.filter(function (each) {
						return each.name.toLowerCase().indexOf(matchString.toLowerCase()) !== -1
					});
					if ($scope.displayedVolunteers.length === 0) {
                        $scope.displayedVolunteers = $scope.volunteers;
                        $scope.noNameMatches = true;
					} else {
                        $scope.noNameMatches = false;
					}
					$scope.selectedUser.id = '';
				}
            };

        	$scope.removeFromSelected = function (id) {
        		console.log($scope.volunteerNameFilter);
				$scope.selectedVolunteers = $scope.selectedVolunteers.filter(function (value) {
					return value.id !== id;
				})
            };

        	$scope.volunteerSelected = function (id) {
        		if ($scope.isAdmin) {
        			for (var i = 0; i < $scope.selectedVolunteers.length; i++) {
        				if ($scope.selectedVolunteers[i].id === id) {
        					return;
						}
					}
                    $scope.displayedVolunteers.forEach(function (value) {
                        if (value.id === id) {
                            $scope.selectedVolunteers.push({id : value.id, name: value.name});
                        }
                    });
                    $scope.selectedUser.id = '';
				}
            };

        	$scope.isSelected = function (id) {
                for (var i = 0; i < $scope.selectedVolunteers.length; i++) {
                    if ($scope.selectedVolunteers[i].id === id) {
                        return true;
                    }
                }
                return false;
            };




        /*
            >> fill Volonters

        */
			$scope.fillVolonters = function () {
				$$api.volunteers.getVolunteers($rootScope.currentUser.organisation_id)
					.success(function (result) {
						if (result !== null && result !== undefined && result.data.volunteers !== null && result.data.volunteers !== undefined) {
                            $scope.volunteers = result.data.volunteers;
                            var me = angular.copy($rootScope.currentUser);
                            me.name += ' (you)';
                            console.log($rootScope.currentUser, me);
                            $scope.volunteers.unshift(me);
                            $scope.displayedVolunteers = $scope.volunteers;
						}
                    })
            };

			if ($scope.isAdmin) {
				$scope.fillVolonters();
			}

        /*
            >> fill Activities

        */

        $scope.fillActivities = function () {
            $$api.activities.get()
                .success(function (result) {
                    console.log(result);
                    if (result !== null && result !== undefined && result.data !== null && result.data !== undefined)
                        $scope.activities = result.data;
                })
        };

        $scope.fillActivities();


        $scope.calculateTotalDurationThisDate = function() {

            var sqlDate = $scope.formData.date_of_log.split(' ')[0];

            $$api.user.totalHoursForDay($localStorage.user.id, sqlDate).success(function(result) {
                if ($scope.formData.duration === undefined) {
                    $scope.formData.duration = 0;
                }
                $scope.formData.totalDurationThisDate = result.data.duration + $scope.formData.duration;
            });

        }

		/*
			>> setup datepickers
		*/

			$('#createLog .datepicker').pickadate({
				min: $$utilities.getDateFirstOfMonth(),
				date: new Date(),
				container: '.datepicker-container',
				clear: false,
				onStart: function () {
					// set date to today initially
				    var date = new Date();
				    this.set('select', [date.getFullYear(), date.getMonth(), date.getDate()] )

				    // add date to scope in correct format
				    $scope.formData.date_of_log = $filter('date')(this.component.item.select.pick, 'yyyy-MM-dd');

				    // add current time
				    $scope.formData.date_of_log = $scope.formData.date_of_log + ' ' + $$utilities.getCurrentTimeAsString();
				},
				onSet: function(context) {
					// add date to scope in correct format
					$scope.formData.date_of_log = $filter('date')(context.select, 'yyyy-MM-dd');

					// add current time
					$scope.formData.date_of_log = $scope.formData.date_of_log + ' ' + $$utilities.getCurrentTimeAsString();

					$timeout(function() {
						$scope.calculateTotalDurationThisDate();
					}, 300);
				}
			});


		/*
			>> populate hours dropdown
		*/

			$scope.hours = $$utilities.getHoursOptions();


		/*
			>> populate minutes dropdown
		*/

			$scope.minutes = $$utilities.getMinutesOptions();


		/*
			>> calculate duration
			   .. in an integer of minutes based on the hours and minutes dropdowns
		*/

			$scope.formData.duration = 0;

			$scope.calculateDuration = function(hours, minutes) {
				
				// set minutes to 0 if hours == 24
				if (hours === 24) {
					$scope.formData.minutes = 0;
					minutes = 0;
				}

				// get total minutes integer & update form
				$scope.formData.duration = $filter('minutesFromHoursAndMinutes')(hours, minutes);

				// update total duration for this date
				$scope.calculateTotalDurationThisDate();

			}



		/*
			>> populate user_id field
		*/

			if ($rootScope.currentUser.role_id !== 2) {
                $scope.formData.user_id = $localStorage.user.id;
            } else {
                $scope.formData.user_id = null;
			}


		/*
			>> process the new log form
		*/

			$scope.formSubmitted = false;
			$scope.processForm = function(form) {

				// >>> validate form

				// variable to show that form was submitted
				$scope.formSubmitted = true;

				// form is valid
				if (form.$valid) {

					// show loader
					$ionicLoading.show();

					if ($scope.isAdmin) {
					    var selectedIds = [];
					    $scope.selectedVolunteers.forEach(function (value) {
					        selectedIds.push(value.id);
                        });
                        $scope.formData.user_id = selectedIds.join(',');
                    }

					// if offline mode active, push to offline data
					if ($rootScope.offlineMode) {

						// push to offline data, mark as 'needs_pushing'
						$scope.newLogOffline($scope.formData, true, 'Log saved offline.');

					}

					// not offline mode, submit the form
					else {

						// >>> submit form
						var payload = {
							activity: $scope.formData.activity,
							duration: {
								minutes: $scope.formData.duration,
							},
							startedAt: $scope.formData.date_of_log,
							userId: $scope.formData.user_id && $scope.formData.user_id !== $rootScope.currentUser.id || undefined,
						}
						$$api.logs.new(payload).success(function (result) {

							// hide loader
							$ionicLoading.hide();

							// push to offline data
							$scope.newLogOffline(result.data);

							$$shout('Log saved.');

							if ($rootScope.isAdmin) {
								$state.go('tabs.view-logs.hours');
							} else {
								$state.go('tabs.dashboard');
							}

						}).error(function(data, error) {

							// enable offline mode
							$$offline.enable();

							// push to offline data and mark as 'needs_pushing'
							$scope.newLogOffline($scope.formData, true, 'Log saved offline.');

							// process connection error
							$$utilities.processConnectionError(data, error);

						});

					}
				}
				// form is invalid
				else {
					
				}

			};


		/*
			>> push to offline data
		*/

			$scope.newLogOffline = function(data, needs_pushing, message) {

				// hide loader
				$ionicLoading.hide();

				if (needs_pushing === undefined) {
					needs_pushing = false;
				}

				// push to offline data
				$$offline.newLog(data, needs_pushing);

				// shout message
				if (message !== undefined) {
					$$shout(message);
				}

				// go back to dashboard
				$state.go('tabs.dashboard');

			}


	})