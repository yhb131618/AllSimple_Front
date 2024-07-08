export default interface CommentListItem {
    id: number;
    parentId?: number | null; // 부모 댓글의 id
    nickname: string;
    profileImage: string | null;
    writeDatetime: string;
    content: string;
    replies?: CommentListItem[];
}
