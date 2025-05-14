interface IApiResponseOptions<T> {
    statusCode: number;
    data: T;
    message?: string;
}

class ApiResponse<T> {
    public readonly statusCode: number;
    public readonly data: T;
    public readonly message: string;
    public readonly success: boolean;
    public readonly timestamp: Date;

    constructor({ statusCode, data, message = "Success" }: IApiResponseOptions<T>) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
        this.timestamp = new Date();
    }

    public toJSON() {
        return {
            success: this.success,
            statusCode: this.statusCode,
            message: this.message,
            data: this.data,
            timestamp: this.timestamp.toISOString()
        };
    }

    // Common response factory methods
    public static success<T>(data: T, message?: string): ApiResponse<T> {
        return new ApiResponse({ statusCode: 200, data, message });
    }

    public static created<T>(data: T, message?: string): ApiResponse<T> {
        return new ApiResponse({ statusCode: 201, data, message });
    }

    public static noContent(message = "No Content"): ApiResponse<null> {
        return new ApiResponse({ statusCode: 204, data: null, message });
    }
}

export default ApiResponse;