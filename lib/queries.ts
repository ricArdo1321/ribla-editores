import { gql } from 'graphql-request';

export const GET_BOOKS = gql`
  query GetBooks($first: Int = 10) {
    libros(first: $first, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        title
        slug
        libroMeta {
          autor
          genero
          anio
          enlaceAmazon
          sinopsis
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;

export const GET_POSTS = gql`
  query GetPosts($first: Int = 6) {
    posts(first: $first, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        title
        slug
        excerpt
        date
        categories {
          nodes {
            name
            slug
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        author {
          node {
            name
          }
        }
      }
    }
  }
`;

export const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      title
      content
      date
      categories {
        nodes {
          name
        }
      }
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      author {
        node {
          name
        }
      }
    }
  }
`;

export const GET_ALL_POSTS_ADMIN = gql`
  query GetAllPostsAdmin {
    posts(first: 100, where: { orderby: { field: DATE, order: DESC }, status: [PUBLISH, DRAFT, FUTURE, PENDING] }) {
      nodes {
        id
        title
        date
        status
        author {
          node {
            name
          }
        }
      }
    }
  }
`;

export const GET_USERS_ADMIN = gql`
  query GetUsersAdmin {
    users(first: 100) {
      nodes {
        id
        name
        email
        roles {
          nodes {
            name
          }
        }
      }
    }
  }
`;
