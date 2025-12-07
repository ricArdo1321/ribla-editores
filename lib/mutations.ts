import { gql } from 'graphql-request';

export const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(input: { clientMutationId: "uniqueId", username: $username, password: $password }) {
      authToken
      refreshToken
      user {
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

export const CREATE_POST_MUTATION = gql`
  mutation CreatePost($title: String!, $content: String!, $status: PostStatusEnum = PUBLISH) {
    createPost(input: { title: $title, content: $content, status: $status }) {
      post {
        id
        slug
        title
        status
      }
    }
  }
`;

export const UPDATE_POST_MUTATION = gql`
  mutation UpdatePost($id: ID!, $title: String!, $content: String!, $status: PostStatusEnum = PUBLISH) {
    updatePost(input: { id: $id, title: $title, content: $content, status: $status }) {
      post {
        id
        slug
        title
        status
      }
    }
  }
`;
