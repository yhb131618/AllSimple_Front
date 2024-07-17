import defaultProfileImage from 'assets/image/default-profile-image.png';
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";
import {
    getPlayRequest,
    increasePlayViewCount,
} from "../../../apis";
import { ResponseDto } from "../../../apis/response";
import {
    DeletePlayResponseDto,
    IncreasePlayViewCountResponseDto,
} from "../../../apis/response/play";
import GetPlayResponseDto from "../../../apis/response/play/get-play.response.dto";

import { MAIN_PATH, PLAY_PATH, PLAY_UPDATE_PATH, USER_PATH } from "../../../constant";
import { useLoginUserStore } from "../../../stores";
import { Play } from "../../../types/interface";
import './style.css';

export default function PlayDetail() {

    const { playNumber } = useParams();
    const { loginUser } = useLoginUserStore();
    const [cookies, setCookies] = useCookies();
    const navigate = useNavigate();
    const increasePlayViewCountResponse = (responseBody: IncreasePlayViewCountResponseDto | ResponseDto | null) => {
        if(!responseBody) return;
        const { code } = responseBody;
        if(code === 'NB') alert('존재하지 않는 게시물입니다.');
        if(code === 'DBE') alert('데이터베이스 오류입니다..');
    }

    const PlayDetailTop = () => {

        const [isWriter, setWriter] = useState<boolean>(false);
        const [play, setPlay] = useState<Play| null>(null);
        const [showMore, setShowMore] = useState<boolean>(false);
        const getWriteDatetimeFormat = () => {
            if (!play) return;
            const date = dayjs(play.writeDatetime);
            return date.format('YYYY. MM. DD.');
        }

        const getPlayResponse = (responseBody: GetPlayResponseDto | ResponseDto | null) => {
            if(!responseBody) return;
            const { code } = responseBody;
            if(code === 'NB') alert('존재하지 않는 게시물 입니다.');
            if(code === 'DBE') alert('데이터베이스 오류입니다.')
            if(code !== 'SU') {
                navigate(MAIN_PATH());
                return;
            }

            const play: Play = {...responseBody as GetPlayResponseDto}
            console.log(play)
            setPlay(play);
            if(!loginUser) {
                setWriter(false);
                return;
            }
            const isWriter = loginUser.email === play.writerEmail;
            setWriter(isWriter);
        }

        const deletePlayResponse = (responseBody: DeletePlayResponseDto | ResponseDto | null) => {
            if(!responseBody) return;

            const { code } = responseBody;
            if(code === 'VF') alert('잘못된 접근입니다.');
            if(code === 'NU') alert('존재하지 않는 유저입니다.');
            if(code === 'NB') alert('존재하지 않는 게시물입니다.');
            if(code === 'AF') alert('인증에 실패했습니다.');
            if(code === 'NP') alert('권한이 없습니다.');
            if(code === 'DBE') alert('데이터베이스 오류입니다.');
            if(code !== 'SU') return;

            navigate(MAIN_PATH());
        }
        const onNicknameClickHandler = () => {
            if(!play) return;
            navigate(USER_PATH(play.writerEmail));
        }

        const onMoreButtonClickHandler = () => {
            setShowMore(!showMore);
        }

        const onUpdateButtonClickHandler = () => {
            if(!play || !loginUser) return;
            if(loginUser.email !== play.writerEmail) return;
            navigate(PLAY_PATH() + '/' + PLAY_UPDATE_PATH(play.playNumber));
        }

        const onDeleteButtonClickHandler = () => {
            if(!play || !playNumber || !loginUser || !cookies.accessToken) return;
            if(loginUser.email !== play.writerEmail) return;

            // deletePlayRequest(playNumber).then(deletePlayResponse);
            // navigate(MAIN_PATH());
        }

        useEffect(() => {
            // setPlay(boardMock);
            if(!playNumber) {
                navigate(MAIN_PATH());
                return;
            }
            getPlayRequest(playNumber).then(getPlayResponse);
        }, [playNumber]);

        if(!play) return <></>

        return (
            <div id='board-detail-top'>
                <div className='board-detail-top-header'>
                    <div className='board-detail-title'>{play.title}</div>
                    <div className='board-detail-top-sub-box'>
                        <div className='board-detail-write-info-box'>
                            <div className='board-detail-writer-profile-image'
                                 style={{ backgroundImage: `url(${play.writerProfileImage ? play.writerProfileImage : defaultProfileImage})`}}></div>
                            <div className='board-detail-writer-nickname' onClick={onNicknameClickHandler}>{play?.writerNickname}</div>
                            <div className='board-detail-info-divider'>{'\|'}</div>
                            <div className='board-detail-write-date'>{getWriteDatetimeFormat()}</div>
                        </div>
                        {isWriter &&
                            <div className='icon-button' onClick={onMoreButtonClickHandler}>
                                <div className='icon more-icon'></div>
                            </div>
                        }
                        {showMore &&
                            <div className='board-detail-more-box'>
                                <div className='board-detail-update-button' onClick={onUpdateButtonClickHandler}>{'수정'}</div>
                                <div className='divider'></div>
                                <div className='board-detail-delete-button' onClick={onDeleteButtonClickHandler}>{'삭제'}</div>
                            </div>
                        }
                    </div>
                </div>
                <div className='divider'></div>
                <div className='board-detail-top-main'>
                    <div className='board-detail-main-text'>{play.content}</div>
                    <video controls>
                    <source src={play.play  } type="video/mp4" />
                    </video>
                </div>
            </div>
        )
    }

    // const PlayDetailBottom = () => {

    //     const commentRef = useRef<HTMLTextAreaElement | null>(null);
    //     const [favoriteList, setFavoriteList] = useState<FavoriteListItem[]>([]);

    //     const {
    //         currentPage,currentSection
    //         ,viewList,viewPageList,totalSection
    //         ,setCurrentPage ,setCurrentSection,setTotalList
    //     } = usePaginaion<CommentListItem>(4)

    //     // const [commentList, setCommentList] = useState<CommentListItem[]>([]);

    //     const [isFavorite, setFavorite] = useState<boolean>(false);

    //     const [showFavorite, setShowFavorite] = useState<boolean>(false);
    //     const [totalCommentCount, setTotalCommentCount] = useState<number>(0);
    //     const [comment, setComment] = useState<string>('');
    //     const [showComment, setShowComment] = useState<boolean>(false);

    //     const getFavoriteListResponse = (responseBody: GetFavoriteListResponseDto | ResponseDto | null) => {
    //         if(!responseBody) return;
    //         const { code } = responseBody;

    //         if(code === 'NB') alert('존재하지 않는 게시물입니다.');
    //         if(code === 'DBE') alert('데이터베이스 오류입니다.');
    //         if(code !== 'SU') return;

    //         const { favoriteList } = responseBody as GetFavoriteListResponseDto;
    //         setFavoriteList(favoriteList);
    //         if(!loginUser) {
    //             setFavorite(false);
    //             return;
    //         }

    //         const isFavorite = favoriteList.findIndex(favorite => favorite.email === loginUser.email) !== -1;
    //         setFavorite(isFavorite);
    //     }

    //     const putFavoriteReseponse = (responseBody: PutFavoriteResponseDto | ResponseDto | null) => {
    //         if(!responseBody) return;
    //         const { code } = responseBody;
    //         if(code === 'VF') alert('잘못된 접근입니다.');
    //         if(code === 'NU') alert('존재하지 않는 유저입니다.');
    //         if(code === 'NB') alert('존재하지 않는 게시물입니다.');
    //         if(code === 'AF') alert('인증에 실패했습니다.');
    //         if(code === 'DBE') alert('데이터베이스 오류입니다.');
    //         if(code !== 'SU') return;

    //         if(!playNumber) return;
    //         getFavoriteListRequest(playNumber).then(getFavoriteListResponse);
    //     }

    //     const postCommentResponse = (responseBody: PostCommentReponseDto | ResponseDto | null) => {
    //         if(!responseBody) return;
    //         const { code } = responseBody;
    //         if(code === 'VF') alert('잘못된 접근입니다.');
    //         if(code === 'NU') alert('존재하지 않는 유저입니다.');
    //         if(code === 'NB') alert('존재하지 않는 게시물입니다.');
    //         if(code === 'AF') alert('인증에 실패했습니다.');
    //         if(code === 'DBE') alert('데이터베이스 오류입니다.');
    //         if(code !== 'SU') return;

    //         setComment('');
    //         if(!playNumber) return;
    //         getCommentListRequest(playNumber).then(getCommentListResponse);
    //     }

    //     const getCommentListResponse = (responseBody: GetCommentListResponseDto | ResponseDto | null) => {
    //         if(!responseBody) return;

    //         const { code }  = responseBody;
    //         if(code === 'NB') alert('존재하지 않는 게시물입니다.');
    //         if(code === 'DBE') alert('데이터베이스 오류입니다.');
    //         if(code !== 'SU') return;

    //         const { commentList } = responseBody as GetCommentListResponseDto;
    //         setTotalList(commentList);
    //         setTotalCommentCount(commentList.length);
    //     }

    //     const onFavoriteClickHandler = () => {
    //         if(!playNumber || !loginUser || !cookies.accessToken) return;
    //         putFavoriteRequest(playNumber).then(putFavoriteReseponse);
    //     }

    //     const onShowFavoirteClickHandler = () => {
    //         setShowFavorite(!showFavorite);
    //     }

    //     const onShowCommentClickHandler = () => {
    //         setShowComment(!showComment);
    //     }

    //     const onCommentChangeHandler = (event:ChangeEvent<HTMLTextAreaElement>) => {
    //         const { value } = event.target;
    //         setComment(value);

    //         if(!commentRef.current) return;
    //         commentRef.current.style.height='auto';
    //         commentRef.current.style.height=`${commentRef.current.scrollHeight}px`;
    //     }

    //     const onCommentSubmitButtonClickHandler = () => {
    //         if(!comment || !playNumber || !loginUser || !cookies.accessToken) return;
    //         const requestBody: PostCommentRequestDto = { comment };
    //         postCommentRequest(playNumber, requestBody).then(postCommentResponse);
    //     }


    //     useEffect(() => {
    //         if(!playNumber) return;
    //         getFavoriteListRequest(playNumber).then(getFavoriteListResponse);
    //         getCommentListRequest(playNumber).then(getCommentListResponse);
    //     }, [playNumber]);

    //     return (
    //         <div id='board-detail-bottom'>
    //             <div className='board-detail-bottom-button-box'>
    //                 <div className='board-detail-bottom-button-group'>
    //                     <div className='icon-button' onClick={onFavoriteClickHandler}>
    //                         {isFavorite ?
    //                             <div className='icon favorite-fill-icon'></div> :
    //                             <div className='icon favorite-light-icon'></div>
    //                         }
    //                     </div>
    //                     <div className='board-detail-bottm-button-text'>{`좋아요  ${favoriteList.length}`}</div>
    //                     <div className='icon-button' onClick={onShowFavoirteClickHandler}>
    //                         {showFavorite ?
    //                             <div className='icon up-light-icon'></div> :
    //                             <div className='icon down-light-icon'></div>
    //                         }
    //                     </div>
    //                 </div>
    //                 <div className='board-detail-bottom-button-group'>
    //                     <div className='icon-button'>
    //                         <div className='icon comment-icon'></div>
    //                     </div>
    //                     <div className='board-detail-bottm-button-text'>{`댓글  ${totalCommentCount}`}</div>
    //                     <div className='icon-button' onClick={onShowCommentClickHandler}>
    //                         {showComment ?
    //                             <div className='icon up-light-icon'></div> :
    //                             <div className='icon down-light-icon'></div>
    //                         }
    //                     </div>
    //                 </div>
    //             </div>
    //             {showFavorite &&
    //                 <div className='board-detail-bottom-favorite-box'>
    //                     <div className='board-detail-bottom-favorite-container'>
    //                         <div className='board-detail-bottom-favorite-title'>
    //                             {'좋아요  '}<span className='emphasis'>{favoriteList.length}</span></div>
    //                         <div className='board-detail-bottom-favorite-content'>
    //                             {favoriteList.map((item, index) => <FavoriteItem key={index} favoriteListItem={item}/>)}
    //                         </div>
    //                     </div>
    //                 </div>
    //             }
    //             {showComment &&
    //             <div className='board-detail-bottom-comment-box'>
    //                 <div className='board-detail-bottom-comment-container'>
    //                     <div className='board-detail-bottom-comment-title'>
    //                         {'댓글  '}<span className='emphasis'>{totalCommentCount}</span></div>
    //                     <div className='board-detail-bottom-comment-list-container'>
    //                         {viewList.map((item,index) => <CommentItem key={index} commentListItem={item} />)}
    //                     </div>
    //                 </div>
    //                 <div className='divider'></div>
    //                 <div className='board-detail-bottom-comment-pagination-box'>
    //                     <Pagination
    //                         currentPage={currentPage}
    //                         currentSection={currentSection}
    //                         setCurrentPage={setCurrentPage}
    //                         setCurrentSection={setCurrentSection}
    //                         viewPageList={viewPageList}
    //                         totalSection={totalSection}
    //                     />
    //                 </div>
    //                 {loginUser !== null &&
    //                     <div className='board-detail-bottom-comment-input-box'>
    //                         <div className='board-detail-bottom-comment-input-container'>
    //                         <textarea ref={commentRef} className='board-detail-bottom-comment-textarea' placeholder='댓글을 작성해주세요'
    //                                   value={comment} onChange={onCommentChangeHandler}/>
    //                             <div className='board-detail-bottom-comment-button-box'>
    //                                 <div className={comment === ''? 'disable-button' : 'black-button'}
    //                                      onClick={onCommentSubmitButtonClickHandler}
    //                                 >{'댓글달기'}</div>
    //                             </div>
    //                         </div>
    //                     </div>
                                
    //                 }

    //             </div>
    //             }
    //         </div>
    //     )
    // }


    let effectFlag = true;
    useEffect(() => {
        if(!playNumber) return;
        if(effectFlag) {
            effectFlag = false;
            return;
        }

        increasePlayViewCount(playNumber).then(increasePlayViewCountResponse );
    }, [playNumber]);

    return (
        <div id='board-detail-wrapper'>
            <div className='board-detail-container'>
                <PlayDetailTop/>
                {/* <PlayDetailBottom/> */}
            </div>
        </div>
    )
}
