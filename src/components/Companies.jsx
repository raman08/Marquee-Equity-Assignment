import { useEffect, useMemo, useState } from 'react';
import { useSortBy, useTable } from 'react-table';

// type Post = {
// 	userid: number;
// 	id: number;
// 	title: string;
// 	body: string;
// };

function Companies() {
	// const [tableData, setTableData] = useState<Post[]>([]);
	const [tableData, setTableData] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch(
				'https://jsonplaceholder.typicode.com/posts'
			);
			const data = await response.json();

			console.log(data);
			setTableData(data);
		};

		fetchData().catch(err => console.log(err));
	}, []);

	const data = useMemo(() => tableData, [tableData]);

	const columns = useMemo(
		() => [
			{
				Header: 'ID',
				accessor: 'id',
			},
			{
				Header: 'User Id',
				accessor: 'userId',
			},
			{
				Header: 'Title',
				accessor: 'title',
			},
			{
				Header: 'Body',
				accessor: 'body',
			},
		],
		[]
	);

	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
		useTable({ columns, data }, useSortBy);

	return (
		<div>
			<table
				{...getTableProps()}
				style={{
					border: 'solid 1px black',
				}}
			>
				<thead>
					{headerGroups.map(headerGroup => (
						<tr {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map(column => (
								<th
									{...column.getHeaderProps(
										column.getSortByToggleProps()
									)}
									style={{
										// borderBottom: 'solid 3px white',
										// color: 'black',
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
							))}
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
												padding: '10px',
												border: 'solid 1px gray',
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
		</div>
	);
}

export default Companies;
