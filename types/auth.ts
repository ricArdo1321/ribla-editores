export enum UserRole {
    GLOBAL_ADMIN = 'GLOBAL_ADMIN',
    CONTENT_ADMIN = 'CONTENT_ADMIN',
    COLLABORATOR = 'COLLABORATOR',
}

export type Permission =
    | 'manage_settings'        // Global settings, plugins, users
    | 'manage_products'        // Create/Edit/Delete products
    | 'publish_products'       // Publish products to live
    | 'manage_blog_all'        // Edit/Delete ANY blog post
    | 'manage_blog_own'        // Edit/Delete OWN blog post
    | 'publish_blog'           // Publish blog posts
    | 'upload_media';          // Upload images/files

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    [UserRole.GLOBAL_ADMIN]: [
        'manage_settings',
        'manage_products',
        'publish_products',
        'manage_blog_all',
        'manage_blog_own',
        'publish_blog',
        'upload_media',
    ],
    [UserRole.CONTENT_ADMIN]: [
        'manage_products',
        'publish_products',
        'manage_blog_all',
        'manage_blog_own',
        'publish_blog',
        'upload_media',
    ],
    [UserRole.COLLABORATOR]: [
        'manage_blog_own',
        'publish_blog',
        'upload_media',
    ],
};
