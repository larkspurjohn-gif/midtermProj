import { json } from '@sveltejs/kit';
import { connectToDatabase } from '$lib/server/db.js';
import Article from '$lib/server/models/Articles.js';

export async function GET({ params }) {
    await connectToDatabase();

    try {
        // We use params.id because that matches the [id] folder name
        const article = await Article.findById(params.id).lean();

        if (!article) {
            return json({ message: 'Article not found' }, { status: 404 });
        }

        return json(article);
    } catch (err) {
        // This handles cases where the ID might be an invalid format
        return json({ message: 'Invalid ID format or Server Error' }, { status: 500 });
    }
}

export async function PUT({ params, request }) {
	await connectToDatabase();
	const { businessName, businessType, businessDescription, businessOwner, businessHours, businessSubtitle } = await request.json();
	const article = await Article.findByIdAndUpdate(
		params.id,
		{ businessName, businessType, businessDescription, businessOwner, businessHours, businessSubtitle },
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

export async function POST({ params, request }) {
    await connectToDatabase();
    const { type, text } = await request.json();

    const article = await Article.findByIdAndUpdate(
        params.id,
        { $push: { feedback: { type, text } } }, // Adds to the array
       	{ returnDocument: 'after', runValidators: true }
    ).lean();

    return json(article);
}