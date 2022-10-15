import axios from 'axios';
import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { useSortBy, useTable } from 'react-table';

import style from './Companies.module.css';

function Companies() {
	const { isLoading, isError, data, error } = useQuery('getCompanies', async () => {

		const response = await axios.get('http://localhost:8080/companies');
		return response.data;
	});

	const memoData = useMemo(() => (data ? data.companies : []), [data]);

	const columns = useMemo(
		() => [
			{
				Header: 'Id',
				accessor: 'id',
			},
			{
				Header: 'Name',
				accessor: 'name',
			},
			{
				Header: 'CIN',
				accessor: 'cin',
			},
		],
		[]
	);

	console.log(data);

	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
		useTable({ columns, data: memoData }, useSortBy);

	return (
		<div className={style.companies}>
			{isLoading ? (
				<span>Loading...</span>
			) : (
				<>
					{isError ? (
						<span>Error: {error.message}</span>
					) : (
						<table
							{...getTableProps()}
							style={{
								border: 'solid 1px white',
								padding: '2px',
							}}
						>
							<thead>
								{headerGroups.map(headerGroup => (
									<tr {...headerGroup.getHeaderGroupProps()}>
										{headerGroup.headers.map(
											(column: any) => (
												<th
													{...column.getHeaderProps(
														column.getSortByToggleProps()
													)}
													style={{
														border: 'solid 1px gray',
														textAlign: 'center',
														padding: '1rem',
														fontStyle: 'italic',
													}}
												>
													{column.render('Header')}
													<span>
														{column.isSorted
															? column.isSortedDesc
																? ' 🔽'
																: ' 🔼'
															: ''}
													</span>
												</th>
											)
										)}
									</tr>
								))}
							</thead>
							<tbody {...getTableBodyProps()}>
								{rows.map(row => {
									prepareRow(row);
									return (
										<tr {...row.getRowProps()}>
											{row.cells.map(cell => {
												return (
													<td
														{...cell.getCellProps()}
														style={{
															padding: '1rem',
															border: 'solid 1px gray',
															textAlign: 'center',
														}}
													>
														{cell.render('Cell')}
													</td>
												);
											})}
										</tr>
									);
								})}
							</tbody>
						</table>
					)}
				</>
			)}
		</div>
	);
}

export default Companies;
