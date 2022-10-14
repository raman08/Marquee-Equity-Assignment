import { useState } from 'react';
import AsyncSelect from 'react-select/async';

import styles from './SearchBar.module.css';

type Company = {
	name: string;
	cin: string;
};

type Post = {
	userid: number;
	id: number;
	title: string;
	body: string;
};

const selectStyles = {
	container: (provided: any) => ({
		...provided,
		width: '50%',
	}),

	menu: (provided: any) => ({
		...provided,
		color: 'black',
		padding: 20,
	}),
};

function SearchBar() {
	const [selectedData, setSelectedData] = useState<Post>();

	const filterData = (data: any, searchValue: string) => {
		const result = data.filter((option: any) =>
			option.label.toLowerCase().includes(searchValue.toLowerCase())
		);

		return result;
	};

	const handelSearch = async (q: string, callback: any) => {
		const response = await fetch(
			'https://jsonplaceholder.typicode.com/posts'
		);

		const companyData: Array<Post> = await response.json();

		const data = companyData.map((com: any) => ({
			label: com.title,
			value: com,
		}));

		callback(filterData(data, q));
	};

	const handelSelect = (data: any) => {
		setSelectedData(data.value);
	};

	return (
		<div className={styles.searchBar}>
			<AsyncSelect
				styles={selectStyles}
				cacheOptions
				isClearable
				loadOptions={handelSearch}
				onChange={handelSelect}
				placeholder="Seach For Company and Add to the Database"
			/>
			<button className={styles.searchButton}>Search</button>
		</div>
	);
}

export default SearchBar;
