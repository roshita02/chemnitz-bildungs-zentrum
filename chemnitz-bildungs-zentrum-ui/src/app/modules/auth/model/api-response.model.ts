export class ApiResponse<T>{
    status?: string;
    success?: boolean;
    data?: T;
    message: string | undefined;
    token?: string;
}
