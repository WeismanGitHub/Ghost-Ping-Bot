export default class CustomError extends Error {
    constructor(message?: string) {
        super(message || 'Something went wrong!');
    }
}
