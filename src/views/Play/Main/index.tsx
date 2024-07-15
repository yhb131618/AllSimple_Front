import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLatestPlayListRequest, getPopularListRequest, getTop3BoardListRequest } from "../../../apis";
import { ResponseDto } from "../../../apis/response";
import { GetLatestPlayListResponseDto, GetTop3PlayListResponseDto } from "../../../apis/response/play";
import { GetPopularListResponseDto } from "../../../apis/response/search";
import PlayItem from "../../../components/PlayItem";
import { SEARCH_PATH } from "../../../constant";
import { usePaginaion } from "../../../hooks";
import { PlayListItem } from "../../../types/interface";
import './style.css';

export default function PlayMain() {

    const navigate = useNavigate();
    const MainTop = () => {

        const [top3BoardList, setTop3BoardList] = useState<PlayListItem[]>([]);

        const getTop3BoardListResponse = (responseBody: GetTop3PlayListResponseDto | ResponseDto | null) => {
            if(!responseBody) return;
            const { code } = responseBody;
            if(code === 'DBE') alert('데이터베이스 오류입니다.');
            if(code !== 'SU') return;

            // const { top3List } = responseBody as GetTop3BoardListResponseDto;
            // setTop3BoardList(top3List);
        }

        useEffect(() => {
            getTop3BoardListRequest().then(getTop3BoardListResponse);
        }, []);

        return (
            <div id='play-main-top-wrapper'>
                <div className='play-main-top-container'>
                    <div className='play-main-top-title'>
           
                    </div>
                    <div className='play-main-top-contents-box'>
                        <div className='play-main-top-contents-title'>{'주간 TOP3 Hot 동영상'}</div>
                        {/* <div className='play-main-top-contents'>
                            {top3BoardList.map((top3ListItem, index) =>
                                <Top3Item key={index} top3ListItem={top3ListItem}/>)}
                        </div> */}
                    </div>
                </div>
            </div>
        )
    }

    const MainBottom = () => {

        const {
            currentPage,
            setCurrentPage,
            currentSection,
            setCurrentSection,
            viewList,
            viewPageList,
            totalSection,
            setTotalList
        } = usePaginaion<PlayListItem>(5);

        const [currentPlayList, setCurrentPlayList] = useState<PlayListItem[]>([]);
        const [popularWordList, setPopularWordList] = useState<string[]>([]);

        const onPupularWordClickHandler = (word:string) => {
            navigate(SEARCH_PATH(word));
        }

        const getLatestPlayListResponse = (responseBody: GetLatestPlayListResponseDto | ResponseDto | null) => {
            if(!responseBody) return;
            const { code } = responseBody;
            if(code === 'DBE') alert('데이터베이스 오류입니다.');
            if(code !== 'SU') return;

            const { latestList } = responseBody as GetLatestPlayListResponseDto;
            setCurrentPlayList(latestList);
            setTotalList(latestList);
        }

        const getPopularListResponse = (responseBody: GetPopularListResponseDto | ResponseDto | null) => {
            if(!responseBody) return;
            const { code } = responseBody;
            if(code === 'DBE') alert('데이터베이스 오류입니다.');
            if(code !== 'SU') return;

            const { popularWordList } = responseBody as GetPopularListResponseDto;
            setPopularWordList(popularWordList);
        }

        useEffect(() => {
            getLatestPlayListRequest().then(getLatestPlayListResponse)
            getPopularListRequest().then(getPopularListResponse)
        }, []);

        return (
            <div id='play-main-bottom-wrapper'>
                <div className="play-main-bottom-container">
                    <div className="play-main-bottom-title">{'최신 업로드'}</div>
                    <div className="play-main-bottom-contents-box">
                        <div className="play-main-bottom-current-contents">
                            {viewList.map((playListItem, index) =>
                                <PlayItem key={index} playListItem={playListItem}/>)}
                        </div>
                        {/* <div className="play-main-bottom-popular-box">
                            <div className="play-main-bottom-popular-card">
                                <div className="play-main-bottom-popular-card-box">
                                    <div className="play-main-bottom-popular-card-container">
                                        <div className="play-main-bottom-popular-card-title">{'인기 검색어'}</div>
                                        <div className="play-main-bottom-popular-card-contents">
                                            {popularWordList.map((word, index) =>
                                                <div key={index} className="word-badge" onClick={() => onPupularWordClickHandler(word)}>{word}</div>)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    </div>
    
                </div>
            </div>
        )
    }

    return (
        <>
            <MainTop/>
            <MainBottom/>
        </>
    )
}
