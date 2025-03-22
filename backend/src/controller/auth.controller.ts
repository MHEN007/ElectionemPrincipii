import Elysia from "elysia";

export const AuthController = new Elysia()
    .post(
        '/login',
        async ({ body }: { body: {
            username: string;
            password: string;
        }}) => {
            const { username, password } = body;
            if (username === 'admin' && password === 'admin') {
                return { token: 'admin' };
            } else {
                return { error: 'Invalid username or password' };
            }
        }
    )