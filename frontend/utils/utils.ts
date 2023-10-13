export const getTokenFromHeader = (header: string) => {
    return header.substring(7);
}