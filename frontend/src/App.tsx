import { QueryClient, QueryClientProvider } from 'react-query';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Companies from './components/Companies';
import SearchBar from './components/SearchBar';

function App() {
	const queryClient = new QueryClient();
	return (
		<QueryClientProvider client={queryClient}>
			<div className='App'>
				<SearchBar />
				<Routes>
					<Route path='/companies' element={<Companies />} />
				</Routes>
			</div>
		</QueryClientProvider>
	);
}

export default App;
