import { PostPlayRequestDto } from "apis/request/play";
import { PostPlayResponseDto } from "apis/response/play";
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { Cookies } from "react-cookie";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fileUploadRequest, patchBoardRequest, postBoardRequest, postPlayRequest, signOutRequest } from "../../apis";
import { SignOutRequestDto } from "../../apis/request/auth";
import { PatchBoardRequestDto, PostBoardRequestDto } from "../../apis/request/board";
import { ResponseDto } from "../../apis/response";
import { SignOutResponseDto } from "../../apis/response/auth";
import { PatchBoardResponseDto, PostBoardResponseDto } from "../../apis/response/board";
import {
    AUTH_PATH,
    BOARD_DETAIL_PATH,
    BOARD_MAIN_PATH,
    BOARD_PATH,
    BOARD_UPDATE_PATH,
    BOARD_WRITE_PATH,
    IMAGE_MAIN_PATH,
    MAIN_PATH,
    PLAY_MAIN_PATH,
    PLAY_PATH,
    PLAY_UPLOAD_PATH,
    SEARCH_PATH,
    USER_PATH
} from "../../constant";
import { useBoardStore, useLoginUserStore, usePlayStore } from "../../stores";
import './style.css';

export default function Header() {

    const { loginUser, setLoginUser, resetLoginUser } = useLoginUserStore();

    const { pathname } = useLocation();

    const cookies = new Cookies();
    const [isLogin, setLogin] = useState<boolean>(false);

    const [pageState, setPageState] = useState({
        isAuthPage: false,
        isMainPage: false,
        isSearchPage: false,
        isBoardDetailPage: false,
        isBoardWritePage: false,
        isBoardUpdatePage: false,
        isUserPage: false,
        isPlayUploadPage: false,
        isPlayMainPage: false,
        isBoardMainPage: false,
        isImageMainPage: false
    });

    const navigate = useNavigate();

    const onLogoClickHandler = () => {
        navigate(MAIN_PATH());
    }
    // 게시판 메인 페이지 이벤트 헨들러 //
    const onBoardMainHandler = () => {
        navigate(BOARD_MAIN_PATH());
    }
    const onPlayMainClickHandler = () => {
        navigate(PLAY_MAIN_PATH());
    }
    const onImageMainClickHandler = () => {
        navigate(IMAGE_MAIN_PATH());
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
                setStatus(false);
            }
        },[searchWord]);

        if(status)
            return  (
                <div className='search-icon-button' onClick={onSearchButtonClickHandler}>
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
            if (loginUser) {
                navigate(USER_PATH(loginUser.email));
            }
        }

        const signOutResponse = (responseBody: SignOutResponseDto | ResponseDto | null) => {
            if(!responseBody) {
                alert('네트워크 이상입니다.');
                return;
            }

            const { code } = responseBody;

            if(code === 'DBE') alert('데이터베이스 오류입니다');
            if(code !== 'SU') return;
        }

        const onSignOutButtonClickHandler = () => {
            const accessToken = cookies.get('accessToken');
            const refreshToken = cookies.get('refreshToken');
            const requestBody: SignOutRequestDto = { accessToken, refreshToken };
            signOutRequest(requestBody).then(signOutResponse);

            resetLoginUser();
            cookies.remove('accessToken', { path: '/' });
            cookies.remove('refreshToken', { path: '/' });
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

    const PlayUploadButton = () => {
     
            const { title, content, playUrl, resetPlay }  = usePlayStore();
            const [loading, setLoading] = useState(false);

            const postPlayResponse = (responseBody: PostPlayResponseDto | ResponseDto | null) => {
                if(!responseBody) return;
                const { code } = responseBody;
                if(code === 'DBE') alert('데이터베이스 오류입니다.')
                if(code === 'AF' || code === 'NU') navigate(AUTH_PATH());
                if(code === 'VF') alert('제목과 내용은 필수입니다.');
                if(code !== 'SU') return;
    
                resetPlay();
                if(!loginUser) return;
                const { email } = loginUser;
                navigate(USER_PATH(email));
            }

            const onPlayUploadButtonClickHandler = async () => {
                const accessToken = cookies.get('accessToken');
                if (!accessToken) return;
                let play : string = "";

                if (playUrl) {
                    setLoading(true);
                    const data = new FormData();
                    data.append('file', playUrl);
                    console.log("++++++++", data);

                    try {
                        const url = await fileUploadRequest(data);
                        console.log("++++++++", url);
                        if (url) {
                            play = url;
                        } else {
                            console.error("File upload failed: URL is null or undefined");
                        }
                    } catch (error) {
                        console.error("File upload failed", error);
                        setLoading(false); // 업로드 실패 시 로딩 상태 해제
                        return; // 파일 업로드 실패 시, 이후 로직을 실행하지 않음
                    }
                    setLoading(false); // 업로드 완료 시 로딩 상태 해제
                }

                const isPlayUploadPage = pathname === PLAY_PATH() + '/' + PLAY_UPLOAD_PATH();
                if(isPlayUploadPage) {
                    const requestBody: PostPlayRequestDto = {
                        title, content, play
                    }
                    try {
                        const response = await postPlayRequest(requestBody);
                        postPlayResponse(response);
                    } catch (error) {
                        console.error("Post play request failed", error);
                    }
            }
           }
           //if(title && content )
            return <div className='black-button' onClick={onPlayUploadButtonClickHandler}>{'업로드'}</div>
            //return <div className='disable-button' >{'업로드'}</div>
        }
    

        


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
        const onPlayUploadButtonClickHandler = async () => {
            const accessToken = cookies.get('accessToken');
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
                postBoardRequest(requestBody).then(postBoardResponse);
            } else {
                if(!boardNumber) return;
                const requestBody: PatchBoardRequestDto = {
                    title, content, boardImageList
                }
                patchBoardRequest(requestBody, boardNumber).then(patchBoardResponse);
            }
        }
        


        if(title && content)
        return <div className='black-button' onClick={onPlayUploadButtonClickHandler}>{'업로드'}</div>
        return <div className='disable-button' >{'업로드'}</div>
    }


    useEffect(() => {
        const newState = {
            isAuthPage: pathname.startsWith(AUTH_PATH()),
            isMainPage: pathname === MAIN_PATH(),
            isSearchPage: pathname.startsWith(SEARCH_PATH('')),
            isBoardDetailPage: pathname.startsWith(BOARD_PATH() + '/' + BOARD_DETAIL_PATH('')),
            isBoardWritePage: pathname.startsWith(BOARD_PATH() + '/' + BOARD_WRITE_PATH()),
            isBoardUpdatePage: pathname.startsWith(BOARD_PATH() + '/' + BOARD_UPDATE_PATH('')),
            isUserPage: pathname.startsWith(USER_PATH('')),
            isPlayUploadPage: pathname.startsWith(PLAY_PATH() + '/' + PLAY_UPLOAD_PATH()),
            isPlayMainPage:  pathname.startsWith( PLAY_MAIN_PATH()),
            isBoardMainPage:  pathname.startsWith( BOARD_MAIN_PATH()),
            isImageMainPage:  pathname.startsWith(IMAGE_MAIN_PATH())
        };
        setPageState(newState);
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
                    <div className='header-logo'>{'AllSimple'}</div>
                </div>
                <div className='header-page-button' onClick={onBoardMainHandler}>{'자유 게시판'}</div>
                <div className='header-page-button'onClick={onPlayMainClickHandler}>{'동영상'}</div>
                {/* <div className='header-page-button' onClick={onImageMainClickHandler}>{'이미지'}</div> */}
                {/* <div className='header-page-button' >{'음악'}</div>
                <div className='header-page-button'>{'프로그램&코드'}</div>
                <div className='header-page-button'>{'문의하기'}</div>
                <div className='header-page-button'>{'채팅'}</div> */}
                <div className='header-right-box'>
                    {
                        (
                            pageState.isAuthPage ||
                            pageState.isBoardWritePage ||
                            !pageState.isBoardWritePage ||
                            pageState.isBoardDetailPage ||
                            pageState.isBoardMainPage ||
                            pageState.isImageMainPage ||
                            pageState.isPlayMainPage
                        ) &&
                        <SearchButton />
                    }
                    {
                        (
                            pageState.isMainPage ||
                            pageState.isUserPage ||
                            pageState.isBoardMainPage ||
                            pageState.isImageMainPage ||
                            pageState.isPlayMainPage ||
                            pageState.isSearchPage ||
                            pageState.isBoardDetailPage 

                        ) &&
                        <MyPageButton />
                    }
                    {
                        (pageState.isBoardWritePage || pageState.isBoardUpdatePage  
                         ) &&
                        <UploadButton />
                    }
                    {
                        (pageState.isPlayUploadPage ) &&
                        <PlayUploadButton  />
                    }
                </div>
            </div>
        </div>
    )
}
