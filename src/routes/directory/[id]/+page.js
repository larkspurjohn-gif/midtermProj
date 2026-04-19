export const load = async ({ fetch, params }) => {
    // params.id comes from the folder name [id]
    const res = await fetch(`/api/articles/${params.id}`);
    const business = await res.json();

    return { business };
};