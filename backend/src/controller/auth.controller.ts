import Elysia from "elysia";

export const AuthController = new Elysia()
    .post(
        '/login',
        async ({ body } : { body: {username: string; password: string; } }) => {
            if (body.username === 'admin' && body.password === 'admin') {
                return { token: 'admin', username: 'admin' };
            } else {
                return { error: 'Invalid username or password' };
            }
        },
    )