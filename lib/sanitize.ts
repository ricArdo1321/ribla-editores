import DOMPurify from 'dompurify';

export const sanitizeContent = (content: string): string => {
    // Check if running on client (DOMPurify needs window)
    if (typeof window === 'undefined') {
        return content; // Or use JSDOM if server-side sanitization is strictly needed
    }

    return DOMPurify.sanitize(content, {
        ALLOWED_TAGS: [
            'p', 'b', 'i', 'em', 'strong', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'img', 'hr', 'br', 'div', 'span'
        ],
        ALLOWED_ATTR: [
            'href', 'target', 'src', 'alt', 'class', 'style', 'width', 'height'
        ],
    });
};
