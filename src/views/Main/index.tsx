import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTop3BoardListRequest } from "../../apis";
import { ResponseDto } from "../../apis/response";
import { GetTop3BoardListResponseDto } from "../../apis/response/board";
import Top3Item from "../../components/Top3Item";
import { BoardListItem } from "../../types/interface";
import './style.css';

export default function Main() {

    const navigate = useNavigate();
    const MainTop = () => {

        const [top3BoardList, setTop3BoardList] = useState<BoardListItem[]>([]);

        const getTop3BoardListResponse = (responseBody: GetTop3BoardListResponseDto | ResponseDto | null) => {
            if(!responseBody) return;
            const { code } = responseBody;
            if(code === 'DBE') alert('데이터베이스 오류입니다.');
            if(code !== 'SU') return;

            const { top3List } = responseBody as GetTop3BoardListResponseDto;
            setTop3BoardList(top3List);
        }

        useEffect(() => {
            getTop3BoardListRequest().then(getTop3BoardListResponse);
        }, []);

        return (
            <div id='main-top-wrapper'>
                <div className='main-top-container'>
                    <div className='main-top-title'>
                        {'Welcome Community!'}
                    </div>
                    <div className='main-top-contents-box'>
                        <div className='main-top-contents-title'>{'주간 TOP3 게시글'}</div>
                        <div className='main-top-contents'>
                            {top3BoardList.map((top3ListItem, index) =>
                                <Top3Item key={index} top3ListItem={top3ListItem}/>)}
                        </div>
                    </div>
                </div>
            </div>
        )
    }


    return (
        <>
            <MainTop/>
          
        </>
    )
}
