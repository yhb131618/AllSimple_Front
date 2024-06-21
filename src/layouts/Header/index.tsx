import React, {ChangeEvent, KeyboardEvent, useEffect, useRef, useState} from "react";
import './style.css'
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {
    AUTH_PATH,
    BOARD_DETAIL_PATH,
    BOARD_PATH,
    BOARD_UPDATE_PATH,
    BOARD_WRITE_PATH,
    MAIN_PATH,
    SEARCH_PATH,
    USER_PATH
} from "../../constant";
import {useCookies} from "react-cookie";
import {useBoardStore, useLoginUserStore} from "../../stores";
import {fileUploadRequest, patchBoardRequset, postBoardRequest} from "../../apis";
import {PatchBoardRequestDto, PostBoardRequestDto} from "../../apis/request/board";
import {PatchBoardResponseDto, PostBoardResponseDto} from "../../apis/response/board";
import {ResponseDto} from "../../apis/response";

export default function Header() {

    const { loginUser, setLoginUser, resetLoginUser } = useLoginUserStore();

    const { pathname } = useLocation();

    const [cookies, setCookies] = useCookies();
    const [isLogin, setLogin] = useState<boolean>(false);
    const [isAuthPage, setAuthPage] = useState<boolean>(false);
    const [isMainPage, setMainPage] = useState<boolean>(false);
    const [isSearchPage, setSearchPage] = useState<boolean>(false);
    const [isBoardDetailPage, setBoardDetailPage] = useState<boolean>(false);
    const [isBoardWritePage, setBoardWritePage] = useState<boolean>(false);
    const [isBoardUpdatePage, setBoardUpdatePage] = useState<boolean>(false);
    const [isUserPage, setUserPage] = useState<boolean>(false);

    const navigate = useNavigate();

    const onLogoClickHandler = () => {
        navigate(MAIN_PATH());
    }
    const SearchButton = () => {

        const searchButtonRef = useRef<HTMLDivElement | null>(null);

        const [status, setStatus] = useState<boolean>(false);
        const [word, setWord] = useState<string>('');

        const { searchWord } = useParams()

        const onSearchWordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value;
            setWord(value)
        };
        const onSearchWordKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
            if(event.key !== 'Enter') return;
            if(!searchButtonRef.current) return ;
            searchButtonRef.current.click();
            navigate(SEARCH_PATH(word));
        };
        const onSearchButtonClickHandler = () => {
            if(!status) {
                setStatus(!status);
                return;
            }
            navigate(SEARCH_PATH(word));
        };
        useEffect(()=> {
            if(searchWord) {
                setWord(searchWord);
                setStatus(true);
            }
        },[searchWord]);

        if(status)
            return  (
                <div className='icon-button' onClick={onSearchButtonClickHandler}>
                    <div className='icon search-light-icon'></div>
                </div>
            );
            return  (
                <div className='header-search-input-box'>
                    <input className='header-search-input'
                           type='text'
                           placeholder='검색어를 입력해주세요.'
                           value={word}
                           onChange={onSearchWordChangeHandler}
                           onKeyDown={onSearchWordKeyDownHandler}
                    />
                    <div
                        ref={searchButtonRef}
                        className='icon-button'
                        onClick={onSearchButtonClickHandler}
                    >
                        <div className='icon search-light-icon'></div>
                    </div>
                </div>
            );
    }

    const MyPageButton = () => {

        const { userEmail } = useParams();
        const onMyPageButtonClickHandler = () => {
            if(!loginUser) return;
            const { email } = loginUser;
            navigate(USER_PATH(email));
        }

        const onSignOutButtonClickHandler = () => {
            resetLoginUser();
            setCookies('accessToken', '', { path: MAIN_PATH(), expires: new Date() });
            navigate(MAIN_PATH());
        }

        const onSignInButtonClickHandler = () => {
            navigate(AUTH_PATH());
        }

        if(isLogin && userEmail === loginUser?.email)
        return <div className='white-button' onClick={onSignOutButtonClickHandler}>{'로그아웃'}</div>

        if(isLogin)
        return <div className='white-button' onClick={onMyPageButtonClickHandler}>{'마이페이지'}</div>
        return <div className='black-button' onClick={onSignInButtonClickHandler}>{'로그인'}</div>
    };

    const UploadButton = () => {

        const { boardNumber } = useParams();
        const { title, content, boardImageFileList, resetBoard }  = useBoardStore();
        const postBoardResponse = (responseBody: PostBoardResponseDto | ResponseDto | null) => {
            if(!responseBody) return;
            const { code } = responseBody;
            if(code === 'DBE') alert('데이터베이스 오류입니다.')
            if(code === 'AF' || code === 'NU') navigate(AUTH_PATH());
            if(code === 'VF') alert('제목과 내용은 필수입니다.');
            if(code !== 'SU') return;

            resetBoard();
            if(!loginUser) return;
            const { email } = loginUser;
            navigate(USER_PATH(email));
        }

        const patchBoardResponse = (responseBody: PatchBoardResponseDto | ResponseDto| null) => {
            if(!responseBody) return;
            const { code } = responseBody;
            if(code === 'DBE') alert('데이터베이스 오류입니다.')
            if(code === 'AF' || code === 'NU'|| code === 'NB' || code === 'NP') navigate(AUTH_PATH());
            if(code === 'VF') alert('제목과 내용은 필수입니다.');
            if(code !== 'SU') return;

            if(!boardNumber) return;
            navigate(BOARD_PATH() + '/' + BOARD_DETAIL_PATH(boardNumber));
        }
        const onUploadButtonClickHandler = async () => {
            const accessToken = cookies.accessToken;
            if (!accessToken) return;

            const boardImageList: string[] = [];
            for (const file of boardImageFileList) {
                const data = new FormData();
                data.append('file', file);
                const url = await fileUploadRequest(data);
                if (url) boardImageList.push(url);
            }

            const isWriterPage = pathname === BOARD_PATH() + '/' + BOARD_WRITE_PATH();
            if(isWriterPage) {
                const requestBody: PostBoardRequestDto = {
                    title, content, boardImageList
                }
                postBoardRequest(requestBody, accessToken).then(postBoardResponse);
            } else {
                if(!boardNumber) return;
                const requestBody: PatchBoardRequestDto = {
                    title, content, boardImageList
                }
                patchBoardRequset(requestBody, boardNumber, accessToken).then(patchBoardResponse);
            }
        }

        if(title && content)
        return <div className='black-button' onClick={onUploadButtonClickHandler}>{'업로드'}</div>
        return <div className='disable-button' >{'업로드'}</div>
    }

    useEffect(() => {

        const isAuthPage = pathname.startsWith(AUTH_PATH());
        setAuthPage(isAuthPage);
        const isMainPage = pathname === MAIN_PATH();
        setMainPage(isMainPage);
        const isSearchPage = pathname.startsWith(SEARCH_PATH(''));
        setSearchPage(isSearchPage);
        const isBoardDetailPage = pathname.startsWith(BOARD_PATH() + '/' + BOARD_DETAIL_PATH(''));
        setBoardDetailPage(isBoardDetailPage);
        const isBoardWritePage = pathname.startsWith(BOARD_PATH() + '/' + BOARD_WRITE_PATH());
        setBoardWritePage(isBoardWritePage);
        const isBoardUpdatePage = pathname.startsWith(BOARD_PATH() + '/' + BOARD_UPDATE_PATH(''));
        setBoardUpdatePage(isBoardUpdatePage);
        const isUserPage = pathname.startsWith(USER_PATH(''));
        setUserPage(isUserPage);
    }, [pathname]);

    useEffect(() => {
        setLogin(loginUser !== null);
    }, [loginUser]);


    return (
        <div id='header'>
            <div className='header-container'>
                <div className='header-left-box' onClick={onLogoClickHandler}>
                    <div className='icon-box-middle'>
                        <div className='icon logo-yellow'></div>
                    </div>
                    <div className='header-logo'>{'Yellow Board'}</div>
                </div>
                <div className='header-right-box'>
                    {
                        (isAuthPage || isBoardWritePage || !isBoardUpdatePage || isBoardDetailPage) &&
                        <SearchButton />
                    }
                    {
                        (isMainPage || isSearchPage || isBoardDetailPage || isUserPage) &&
                        <MyPageButton />
                    }
                    {
                        (isBoardWritePage || isBoardUpdatePage ) &&
                        <UploadButton />
                    }
                </div>
            </div>
        </div>
    )
}
