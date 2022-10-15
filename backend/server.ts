import axios from 'axios';
import express, { Request } from 'express';
import parse from 'node-html-parser';
import cors from 'cors';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

app.use(cors<Request>());

const QUERT_URL = 'https://www.zaubacorp.com/custom-search';

app.get('/', (_req, res): void => {
	res.json({
		message: 'Running Node with Express and Typescript',
	});
});

app.get('/query', async (req, res) => {
	try {
		const query = req.query.q;
		const body: Object = {
			search: query,
			filter: 'company',
		};

		const response = await axios.post(QUERT_URL, body);

		const parsed = parse(`<div>${response.data}</div>`);

		const selector = parsed.querySelectorAll('.show');

		const company = selector.map(sel => {
			const id = sel.id;
			const sp = id.split('/');

			return {
				name: sp[1].replaceAll('-', ' '),
				cin: sp[2],
			};
		});

		return res.json({
			body: company,
		});
	} catch {
		return res.status(500).json({ error: 'Something Went Wrong' });
	}
});

app.post('/save', async (req, res) => {
	try {
		const body: any = req.body;

		try {
			const result = await prisma.company.create({ data: body });
			return res.json(result);
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				if (e.code === 'P2002') {
					console.log(
						'There is a unique constraint violation, a new user cannot be created with this email'
					);
				}
			}
			return res
				.status(400)
				.json({ error: 'unique constraint violation' });
		}
	} catch {
		return res.status(500).json({ error: 'Something Went Wrong' });
	}
});

app.get('/companies', async (_req, res) => {
	try {
		const result = await prisma.company.findMany({
			select: {
				id: true,
				name: true,
				cin: true,
			},
		});

		return res.json({ companies: result });
	} catch {
		return res.status(500).json({ error: 'Something Went Wrong' });
	}
});

app.listen(8080, () => {
	console.log('Server Running at http:localhost:8080');
});
