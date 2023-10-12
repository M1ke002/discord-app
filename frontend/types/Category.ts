//sample:
// {
//     "id": 4,
//     "name": "Text channels",
//     "serverId": 2,
//     "createdAt": "2023-09-23T15:48:45.299+00:00",
//     "updatedAt": null
// },

interface Category {
    id: number;
    name: string;
    serverId: number;
    createdAt: string | null;
    updatedAt: string | null;
}

export default Category;