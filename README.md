# PERN Afro Cinema Blog App | BACKEND

Messaging App API that allows users to send and recieve messages.

### Afro Cinema Blog | Author

[https://github.com/Lspacedev/afro-cinema-blog-author](https://github.com/Lspacedev/afro-cinema-blog-author)

### Afro Cinema Blog | Client

[https://github.com/Lspacedev/afro-cinema-blog-client](https://github.com/Lspacedev/afro-cinema-blog-client)

## Prerequisites

- Nodejs
- Prisma
- A Supabase account, follow the link [here](https://supabase.com/)

## Installation

1. Clone the repository

```bash
git@github.com:Lspacedev/afro-cinema-blog-api.git
```

2. Navigate to the project folder

```bash
cd afro-cinema-blog-api
```

3.  Install all dependencies

```bash
npm install
```

4. Create an env file and add the following:

```bash
DATABASE_URL="Postgres database Uri"
JWT_SECRET="Jwt secret"
SUPABASE_PROJECT_URL="Supabase project url"
SUPABASE_ANON_KEY="Supabase anon key"

```

5. Run the project

```bash
node index
```

## Usage

1. The server should run on PORT 3000, unless a port is specified.
2. Use http://localhost:3000, to test the API on Postman or any other tool.

## Routes:

API is built using a Node Express server, with PostgreSQL as a database.
API uses JWT tokens to authenticate user and Supabase for image storage.

#### Index Router:

- Sign up for an account.
- Log in to an account.

Endpoints

```python
    1. POST /sign-up
        Inputs: username, email, role, password, confirmPassword

    2.1 POST /log-in
            Inputs: username, password
    2.2 POST /api/guest-log-in

```

#### Posts Router:

- Get all author posts.
- Get individual post.
- Create author post.
- Update author post.
- Delete author post.

- Publish author post.
- Unpublish author post.
- Add comment.
- Delete comment.

Endpoints

```python
    1. GET /api/posts

    2. GET /api/posts/postId
            Params: postId

    3. POST /api/posts
           Inputs: title, text, image

    4. PUT /api/posts/postId
            Params: postId
            Inputs: title, text

    5. PUT /api/posts/postId/publish
            Params: postId
            Inputs: publish

    6. PUT /api/posts/postId/unpublish
            Params: postId
            Inputs: publish

    7. DELETE /api/posts/postId
            Params: postId

    8. POST /api/posts/postId/comments
            Params: postId
            Inputs: commentText

    9. DELETE /api/posts/postId/comments/commentId
            Params: postId, commentId


```

#### Public Router:

- Get all public posts.
- Get individual post.
- Create comment.

Endpoints

```python
    1. GET /api/public/posts

    2. GET /api/public/posts/postId
            Params: postId

    3. POST /api/public/posts/postId/comments
            Params: postId
            Inputs: commentText

```

## Tech Stack

- NodeJs
- Express
- PostgreSQL
- Supabase
