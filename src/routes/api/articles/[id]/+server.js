import { json } from '@sveltejs/kit';
import { connectToDatabase } from '$lib/server/db.js';
import Article from '$lib/server/models/Articles.js';

export async function PUT({ params, request }) {
	await connectToDatabase();
	const { businessName, businessType, businessRating } = await request.json();
	const article = await Article.findByIdAndUpdate(
		params.id,
		{ businessName, businessType, businessRating },
		{ returnDocument: 'after', runValidators: true }
	).lean();

	if (!article) {
		return json({ message: 'Article not found' }, { status: 404 });
	}

	return json(article);
}

export async function DELETE({ params }) {
	await connectToDatabase();
	const article = await Article.findByIdAndDelete(params.id).lean();

	if (!article) {
		return json({ message: 'Article not found' }, { status: 404 });
	}

	return json({ success: true });
}
