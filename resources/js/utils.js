export const getImagePath = (path) => {
    if (!path) return '/assets/images/post.webp';
    if (path.startsWith('blob:')) return path;
    if (path.startsWith('http')) return path;
    return `/storage/${path}`;
};
