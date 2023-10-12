interface User {
    id: number;
    username: string;
    nickname: string;
    accessToken: string;
    refreshToken: string;
    avatarUrl?: string;
};

export default User;