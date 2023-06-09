import React from 'react';
import './App.css';
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
} from 'react-router-dom';
import {
	UnAuthorizedWrapper,
	AuthorizeWrapper,
	privateRoutes,
	publicRoutes,
} from './routes';

function App() {
	let token = sessionStorage.getItem('token');

	function renderRoutes() {
		if (token) {
			return (
				// <MainLayout>
				<Routes>
					<Route
						path="*"
						element={<Navigate to="/" />}
					/>

					{privateRoutes.map(({ path, element, key }) => (
						<Route
							key={key}
							exact
							path={path}
							element={<AuthorizeWrapper />}
						>
							<Route
								key={key + 1}
								exact
								path={path}
								element={element}
							/>
						</Route>
					))}
				</Routes>
				// </MainLayout>
			);
		} else {
			return (
				// <MainLayout>
				<Routes>
					<Route
						path="*"
						element={<Navigate to="/" />}
					/>
					{publicRoutes.map(({ path, element, key }) => (
						<Route
							key={key}
							exact
							path={path}
							element={<UnAuthorizedWrapper />}
						>
							<Route
								key={key + 1}
								exact
								path={path}
								element={element}
							/>
						</Route>
					))}
				</Routes>
				// </MainLayout>
			);
		}
	}
	return <Router>{renderRoutes()}</Router>;
}

export default App;
