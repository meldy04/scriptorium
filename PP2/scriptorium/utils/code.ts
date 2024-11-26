import axios, { AxiosError } from 'axios';

export async function executeCode(language: string, code: string, input: string = '') {
    try {
        const response = await axios.post('/api/code/execute', {
            language,
            code,
            input,
        });
        return response.data.output;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.error || 'Unexpected error occurred.');
        } else {
            throw new Error('Unexpected error occurred.');
        }
    }
}
