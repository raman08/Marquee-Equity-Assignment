import { Route, Routes } from 'react-router-dom';
import './App.css';
import Companies from './components/Companies';
import SearchBar from './components/SearchBar';

function App() {
	return (
		<div className='App'>
			<SearchBar />
			<Routes>
				<Route path='/companies' element={<Companies />} />
			</Routes>
		</div>
	);
}

export default App;
