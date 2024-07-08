export const MAIN_PATH = ()=> '/';
export const AUTH_PATH = ()=> '/auth';
export const SEARCH_PATH = (searchWord: string)=> `/search/${searchWord}`;
export const USER_PATH = (userEmail: string)=> `/user/${userEmail}`;
export const BOARD_PATH = () => '/board'
export const BOARD_MAIN_PATH = () => '/board/main';
export const BOARD_DETAIL_PATH = (boardNumber: string | number)=> `detail/${boardNumber}`;
export const BOARD_WRITE_PATH = () => 'write';
export const BOARD_UPDATE_PATH = (boardNUmber: string | number) => `update/${boardNUmber}`;
export const PLAY_PATH = () => '/play';
export const PLAY_MAIN_PATH = () => '/play/main';
export const PLAY_UPLOAD_PATH = () => 'upload';
export const IMAGE_MAIN_PATH = () => '/image/main';
export const IMAGE_PATH = () => 'image';

