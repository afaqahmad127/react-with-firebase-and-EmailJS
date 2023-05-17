import React from 'react';
// import { HomePage } from '../../pages';

const authenticatedRoutes = [
	// {
	// 	key: 0,
	// 	path: '/',
	// 	element: HomePage,
	// },
];

function withNavigationWatcher(Component, path) {
	const WrappedComponent = function (props) {
		return <Component {...props} />;
	};
	return <WrappedComponent />;
}
export const privateRoutes = authenticatedRoutes.map((route) => {
	return {
		...route,
		element: withNavigationWatcher(route.element, route.path),
	};
});
