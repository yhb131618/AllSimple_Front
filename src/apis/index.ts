import api, { apiV2 } from './api-instance';
import { SignInRequestDto, SignOutRequestDto, SignUpRequestDto } from "./request/auth";
import { PatchBoardRequestDto, PostBoardRequestDto, PostCommentRequestDto } from "./request/board";
import { PostPlayRequestDto } from './request/play';
import { PatchNicknameRequestDto, PatchProfileImageRequestDto } from "./request/user";
import { ResponseDto } from "./response";
import { SignInResponseDto, SignUpResponseDto } from "./response/auth";
import {
    DeleteBoardResponseDto,
    GetBoardResponseDto,
    GetCommentListResponseDto,
    GetFavoriteListResponseDto,
    GetLatestBoardLiseResponseDto,
    GetSearchBoardListResponseDto,
    GetTop3BoardListResponseDto,
    GetUserBoardListResponseDto,
    IncreaseViewCountResponseDto,
    PatchBoardResponseDto,
    PostBoardResponseDto,
    PostCommentReponseDto,
    PutFavoriteResponseDto
} from "./response/board";
import { GetLatestPlayListResponseDto, PostPlayResponseDto } from './response/play';
import { GetPopularListResponseDto, GetRelationListResponseDto } from "./response/search";
import {
    GetSignInUserResponseDto,
    GetUserResponseDto,
    PatchNicknameResponseDto,
    PatchProfileImageResponseDto
} from "./response/user";

const SIGN_IN_URL = () => '/auth/sign-in';
const SIGN_OUT_URL = () => '/auth/sign-out';
const SIGN_UP_URL = () => '/auth/sign-up';

export const signInRequest = async (requestBody: SignInRequestDto) => {
    const result = await api.post(SIGN_IN_URL(), requestBody)
        .then(response => {
            const responseBody: SignInResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const signOutRequest = async (requestBody: SignOutRequestDto) => {
    const result = await api.post(SIGN_OUT_URL(), requestBody)
        .then(response => {
            const reponseBody: ResponseDto = response.data;
            return reponseBody;
        }).catch(error => {
            if(!error.reseponse) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}
export const signUpRequest = async (requestBody: SignUpRequestDto) => {

    const result = await api.post(SIGN_UP_URL(), requestBody)
        .then(response => {
            const responseBody: SignUpResponseDto = response.data;
            return responseBody;
        }).catch(error => {
            if (!error.response.data) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
}

const GET_BOARD_URL = (boardNumber: number | string) => `/board/${boardNumber}`;
const POST_BOARD_URL = () =>  '/board';
const GET_USER_BOARD_URL = (email: string) => `/board/user-board-list/${email}`;
const GET_LATEST_BOARD_LIST_URL= () => '/board/latest-list';
const GET_TOP3_BOARD_LIST_URL= () => '/board/top3';
const PATCH_BOARD_URL = (boardNumber: number | string) => `/board/${boardNumber}`;
const DELETE_BOARD_URL = (boardNumber: number | string) =>  `/board/${boardNumber}`;
const INCREASE_VIEW_COUNT_URL = (boardNumber: number | string) => `/board/${boardNumber}/increase-view-count`;
const GET_FAVORITE_LIST_URL = (boardNumber: number | string) => `/board/${boardNumber}/favorite-list`;
const PUT_FAVORITE_URL = (boardNumber: number | string) => `/board/${boardNumber}/favorite`;
const GET_COMMENT_LIST_URL = (boardNumber: number | string) => `/board/${boardNumber}/comment-list`;
const POST_COMMENT_URL = (boardNumber: number | string) => `/board/${boardNumber}/comment`
const GET_SEARCH_BOARD_LIST_URL  = (searchWord: string, preSearchWord: string | null) => `/board/search-list/${searchWord}${preSearchWord? '/' + preSearchWord : ''}`;
const POST_PLAY_URL = () => '/play';
const GET_LATEST_PLAY_LIST_URL = ()=> '/play/latest-list';

export const getBoardRequest = async (boardNumber: number | string) => {
    const result = await api.get(GET_BOARD_URL(boardNumber))
        .then(response => {
            const responseBody: GetBoardResponseDto = response.data;
            return responseBody;
        }).catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const getLatestBoardListRequest = async () => {
    const result = await api.get(GET_LATEST_BOARD_LIST_URL())
        .then(response => {
            const responseBody: GetLatestBoardLiseResponseDto = response.data;
            return responseBody;
        }).catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const getTop3BoardListRequest = async () => {
    const result = await api.get(GET_TOP3_BOARD_LIST_URL())
        .then(response => {
            const responseBody: GetTop3BoardListResponseDto = response.data;
            return responseBody;
        }).catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const getSearchBoardListRequest = async (searchWord: string, preSearchWord: string | null) => {
    const result = await api.get(GET_SEARCH_BOARD_LIST_URL(searchWord, preSearchWord))
        .then(response => {
            const responseBody: GetSearchBoardListResponseDto = response.data;
            return responseBody;
        }).catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const getUserBoardListRequest = async (email: string) => {
    const result = await api.get(GET_USER_BOARD_URL(email))
        .then(response => {
            const responseBody: GetUserBoardListResponseDto = response.data;
            return responseBody;
        }).catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const increaseViewCount = async (boardNumber: number | string) => {
    const result = api.get(INCREASE_VIEW_COUNT_URL(boardNumber))
        .then(response => {
            const responseBody: IncreaseViewCountResponseDto = response.data;
            return responseBody;
        }).catch(error => {
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const postBoardRequest = async (requestBody: PostBoardRequestDto) => {
    const result = await api.post(POST_BOARD_URL(), requestBody)
        .then(response => {
            const responseBody: PostBoardResponseDto = response.data;
            return responseBody;
        }).catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}


export const postPlayRequest =  async (requestBody: PostPlayRequestDto) => {
        const result = await apiV2.post(POST_PLAY_URL(), requestBody)
        .then(response => {
            const responseBody: PostPlayResponseDto = response.data;
            return responseBody;
        }).catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const getLatestPlayListRequest = async () => {
    const result = await apiV2.get(GET_LATEST_PLAY_LIST_URL())
        .then(response => {
            const responseBody: GetLatestPlayListResponseDto = response.data;
            return responseBody;
        }).catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const patchBoardRequest  = async (requestBody: PatchBoardRequestDto, boardNumber: number | string) => {
    const result = await api.patch(PATCH_BOARD_URL(boardNumber), requestBody)
        .then(response => {
            const responseBody: PatchBoardResponseDto = response.data;
            return responseBody;
        }).catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}
export const deleteBoardRequest = async (boardNumber: number | string) => {
    const result = await api.delete(DELETE_BOARD_URL(boardNumber))
        .then(response => {
            const responseBody: DeleteBoardResponseDto = response.data;
            return responseBody;
        }).catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const getFavoriteListRequest = async (boardNumber: number | string) => {
    const result = await api.get(GET_FAVORITE_LIST_URL(boardNumber))
        .then(reponse => {
            const responseBody: GetFavoriteListResponseDto = reponse.data;
            return responseBody;
        }).catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
}
export const getCommentListRequest = async (boardNumber: number | string) => {
    const result = await api.get(GET_COMMENT_LIST_URL(boardNumber))
        .then(reponse => {
            const responseBody: GetCommentListResponseDto = reponse.data;
            return responseBody;
        }).catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
}

export const postCommentRequest = async (boardNumber: number | string, requestBody: PostCommentRequestDto) => {
    const result = await api.post(POST_COMMENT_URL(boardNumber), requestBody)
        .then(response => {
            const responseBody: PostCommentReponseDto = response.data;
            return responseBody;
        }).catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const putFavoriteRequest = async (boardNumber: number | string) => {
    const result = await api.put(PUT_FAVORITE_URL(boardNumber), {})
        .then(response => {
            const responseBody: PutFavoriteResponseDto = response.data;
            return responseBody;
        }).catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}


const GET_POPULAR_LIST_URL = () => '/search/popular-list';
const GET_RELATION_LIST_URL = (searchWord: string) => `/search/${searchWord}/relation-list`;

export const getRelationListRequest = async (searchWord: string) => {
    const result = await api.get(GET_RELATION_LIST_URL(searchWord))
        .then(response => {
            const responseBody: GetRelationListResponseDto = response.data;
            return responseBody;
        }).catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}
export const getPopularListRequest = async () => {
    const result = await api.get(GET_POPULAR_LIST_URL())
        .then(response => {
            const responseBody: GetPopularListResponseDto = response.data;
            return responseBody;
        }).catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

const GET_USER_URL = (email: string) => `/user/${email}`;
const GET_SIGN_IN_USER_URL = () => '/user';
const PATCH_NICKNAME_URL = () => '/user/nickname';
const PATCH_PROFILE_IMAGE_URL = () => '/user/profile-image';

export const getUserRequest = async (email: string) => {
    const result =
        await api.get(GET_USER_URL(email))
            .then(response => {
                const responseBody: GetUserResponseDto = response.data;
                return responseBody;
            }). catch(error => {
                if(!error.response) return null;
                return error.response.data as ResponseDto;
            });
    return result;
}
export const getSignInUserRequest = async () => {
    const result =
        await api.get(GET_SIGN_IN_USER_URL())
            .then(response => {
                const responseBody: GetSignInUserResponseDto = response.data;
                return responseBody;
            }). catch(error => {
                if(!error.response) return null;
                return error.response.data as ResponseDto;
            });
    return result;
}

export const patchNicknameRequest = async (requestBody: PatchNicknameRequestDto) => {
    const result =
        await api.patch(PATCH_NICKNAME_URL(), requestBody)
            .then(response => {
                const responseBody: PatchNicknameResponseDto = response.data;
                return responseBody;
            }). catch(error => {
                if(!error.response) return null;
                return error.response.data as ResponseDto;
            });
    return result;
}

export const patchProfileImageRequest = async (requestBody: PatchProfileImageRequestDto) => {
    const result =
        await api.patch(PATCH_PROFILE_IMAGE_URL(), requestBody)
            .then(response => {
                const responseBody: PatchProfileImageResponseDto = response.data;
                return responseBody;
            }). catch(error => {
                if(!error.response) return null;
                return error.response.data as ResponseDto;
            });
    return result;
}


const FILE_UPLOAD_URL = () => '/file/upload';

const multipartFormData = { headers: {'Content-Type' : 'multipart/form-data'},timeout: 600000 };

export const fileUploadRequest = async (data: FormData) => {
    const result = await api.post(FILE_UPLOAD_URL(), data, multipartFormData)
        .then(response => {
            const responseBody: string = response.data;
            return responseBody;
        }).catch(error => {
            return null;
        });
    return result;
}
