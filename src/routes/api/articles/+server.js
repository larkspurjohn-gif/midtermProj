import { json } from '@sveltejs/kit';
import { connectToDatabase } from '$lib/server/db.js';
import Article from '$lib/server/models/Articles.js';

export async function GET() {
	await connectToDatabase();
  	const articles = await Article.find().lean();
	return json(articles);
}

export async function POST({ request }) {
	await connectToDatabase();
	const { businessName, businessType, businessRating } = await request.json();
	const article = await Article.create({ businessName, businessType, businessRating });
	return json(article, { status: 201 });
}