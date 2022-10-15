import axios, { AxiosResponse } from 'axios';
import { useState } from 'react';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { GroupBase, OptionsOrGroups } from 'react-select';
import AsyncSelect from 'react-select/async';

import styles from './SearchBar.module.css';

type Company = {
	name: string;
	cin: string;
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
	const [selectedData, setSelectedData] = useState<Company>();
	const navigate = useNavigate();

	const queryClient = useQueryClient();

	const mutation: UseMutationResult<
		AxiosResponse<any, any>,
		unknown,
		Company | undefined,
		unknown
	> = useMutation(
		async () => {
			const response = await axios.post(
				'http://localhost:8080/save',
				selectedData
			);
			return response.data;
		},
		{
			onSuccess: newData => {
				console.log({ newData });
				queryClient.setQueryData('getCompanies', oldData => {
					console.log({ oldData });

					const updateData = {
						companies: [
							...oldData.companies,
							{
								name: newData.name,
								id: newData.id,
								cin: newData.cin,
							},
						],
					};
					return updateData;
				});
			},
		}
	);

	const handelAdd = () => {
		console.log('button clicked', selectedData);
		mutation.mutate(selectedData);
		if (mutation.isError) return;

		navigate('companies');
	};

	const handelSelect = (
		q: string,
		callback: (options: OptionsOrGroups<any, GroupBase<any>>) => void
	): void => {
		axios
			.get(`http://localhost:8080/query?q=${q}`)
			.then(response => {
				console.log(response.data);
				return response.data;
			})
			.then(cData => {
				const data = cData.body.map((com: any) => ({
					label: com.name,
					value: com,
				}));

				callback(data);
			});
	};

	const handelSelectData = (data: any): void => {
		setSelectedData(data?.value);
	};

	return (
		<div className={styles.searchBar}>
			<AsyncSelect
				styles={selectStyles}
				cacheOptions
				isClearable
				loadOptions={handelSelect}
				onChange={handelSelectData}
				placeholder='Seach For Company and Add to the Database'
			/>

			<button
				className={styles.searchButton}
				disabled={mutation.isLoading}
				onClick={handelAdd}
			>
				{mutation.isLoading ? 'Adding' : 'Add'}
			</button>

			{mutation.isLoading ? (
				<p>Adding the company......</p>
			) : (
				<>
					{mutation.isError ? (
						<div>An error occurred: {mutation.error.message}</div>
					) : null}

					{mutation.isSuccess ? <div>Company added!</div> : null}
				</>
			)}
		</div>
	);
}

export default SearchBar;
