import { GraphQLClient } from 'graphql-request';

const WP_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL as string;

export const wpClient = new GraphQLClient(WP_API_URL);

// Helper for authenticated requests (if needed later)
export const getAuthClient = (token: string) => {
    return new GraphQLClient(WP_API_URL, {
        headers: {
            authorization: `Bearer ${token}`,
        },
    });
};
