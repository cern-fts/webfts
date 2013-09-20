angular.module('webfts.resources', ['ngResource'])
.factory('Job', function($resource) {
	return $resource('jobs/:jobId', {}, {
		query: {method: 'GET',
			    isArray: false},
	})
})
.factory('Files', function($resource) {
	return $resource('jobs/:jobId/files', {}, {
		query: {method: 'GET',
			    isArray: false},
	})
})
.factory('ArchivedJobs', function($resource) {
	return $resource('archive', {}, {
		query: {method: 'GET',
			    isArray: false},
	})
})
.factory('Transfers', function($resource) {
	return $resource('transfers', {}, {
		query: {method: 'GET', isArray: false}
	})
})
.factory('Unique', function($resource) {
	return $resource('unique/', {}, {
		all: {method: 'GET', isArray: false}
	})
})
.factory('Overview', function($resource) {
	return $resource('overview', {}, {
		query: {method: 'GET', isArray: false}
	})
})
.factory('Staging', function($resource) {
	return $resource('staging', {}, {
		query: {method: 'GET', isArray: false}
	})
})
.factory('Errors', function($resource) {
	return $resource('errors', {}, {
		query: {method: 'GET', isArray: false}
	})
})
.factory('FilesWithError', function($resource) {
	return $resource('errors/list', {}, {
		query: {method: 'GET', isArray: false}
	})
})
.factory('Configuration', function($resource) {
	return $resource('configuration', {}, {
		query: {method: 'GET', isArray: false}
	})
})
;
