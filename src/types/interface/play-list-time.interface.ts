export default interface PlayListItem {
    playNumber: number;
    title: string;
    content: string;
    play: string;
    favoriteCount: number;
    commentCount: number;
    viewCount: number;
    writeDatetime: string;
    writerNickname: string;
    writerProfileImage: string | null;
}
