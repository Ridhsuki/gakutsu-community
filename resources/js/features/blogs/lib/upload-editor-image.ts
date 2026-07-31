const BLOG_EDITOR_IMAGE_UPLOAD_URL = '/editor/blog-images';

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}

export async function uploadEditorImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);

    const csrfToken =
        document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute('content') ?? '';

    const response = await fetch(BLOG_EDITOR_IMAGE_UPLOAD_URL, {
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': csrfToken,
            'X-Requested-With': 'XMLHttpRequest',
            Accept: 'application/json',
        },
        body: formData,
    });

    const contentType = response.headers.get('content-type') ?? '';
    const isJson = contentType.includes('application/json');
    const payload: unknown = isJson
        ? await response.json()
        : await response.text();

    if (!response.ok) {
        if (isRecord(payload)) {
            const errors = payload.errors;
            const message = payload.message;

            const imageErrors =
                isRecord(errors) && Array.isArray(errors.image)
                    ? errors.image
                    : null;

            const validationMessage =
                imageErrors && typeof imageErrors[0] === 'string'
                    ? imageErrors[0]
                    : null;

            const generalMessage =
                typeof message === 'string' && message.trim() !== ''
                    ? message
                    : validationMessage;

            throw new Error(generalMessage || 'Failed to upload image.');
        }

        if (typeof payload === 'string' && payload.trim() !== '') {
            throw new Error(payload);
        }

        throw new Error('Failed to upload image.');
    }

    if (
        !isRecord(payload) ||
        typeof payload.url !== 'string' ||
        payload.url.trim() === ''
    ) {
        throw new Error('Invalid upload response.');
    }

    return payload.url;
}
