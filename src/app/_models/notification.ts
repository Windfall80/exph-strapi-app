import { User } from "./user";

export class Notification {
    id: number;
    message: string;
    link: string;
    read: boolean;
    deleted: boolean;
    user: User;
    created_at: string;
}
