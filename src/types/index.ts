export interface Tool {
    id: string;
    name: string;
    category: string;
    apiStep: string;
    description: string;
    placeholder: string;
}

export interface CleanTextLabResponse {
    result: string;
    error?: string;
    metadata?: Record<string, unknown>;
}

export interface CleanTextLabRequest {
    input: string;
    steps: string[];
}
