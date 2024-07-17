import defaultProfileImage from 'assets/image/default-profile-image.png';
import dayjs from "dayjs";
import { useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { PLAY_DETAIL_PATH, PLAY_PATH } from "../../constant";
import { PlayListItem } from "../../types/interface";
import './style.css';
interface Props {
    playListItem: PlayListItem;
}

export default function PlayItem({ playListItem }: Props) {

    const { playNumber, title, content, play } = playListItem;
    const { favoriteCount, commentCount, viewCount } = playListItem;
    const { writeDatetime, writerNickname, writerProfileImage } = playListItem;
    const videoRef = useRef<HTMLVideoElement>(null);
    const navigate = useNavigate();

    const getElapsedTime = () => {
        const now = dayjs().add(9, 'hour'); // 시간대에 따라 추가/수정 필요할 수 있음
        const writeTime = dayjs(writeDatetime);

        const gap = now.diff(writeTime, 's');
        if (gap < 60) return `${gap}초 전`;
        if (gap < 3600) return `${Math.floor(gap / 60)}분 전`;
        if (gap < 86400) return `${Math.floor(gap / 3600)}시간 전`;
        return `${Math.floor(gap / 86400)}일 전`;
    }

    const now = dayjs().add(9, 'hour'); // 시간대에 따라 추가/수정 필요할 수 있음
    const writeTime = dayjs(writeDatetime);


    const onClickHandler = () => {
        navigate(PLAY_PATH() + '/' + PLAY_DETAIL_PATH(playNumber));
    }



    const handleMouseEnter = () => {
        if (videoRef.current) {
            videoRef.current.play().catch(error => console.log(error));
        }
    };

    const handleMouseLeave = () => {
        if (videoRef.current) {
            videoRef.current.pause();
        }
    };

    return (
        <div className='play-list-item' onClick={onClickHandler}>
            <div className='play-list-item-box'>
                <div className='play-list-item-top'>
                    <div className='play-list-item-profile-box'>
                        <div className='play-list-item-profile-image'
                             style={{ backgroundImage: `url(${writerProfileImage ? writerProfileImage : defaultProfileImage})` }}>
                        </div>
                    </div>
                    <div className='play-list-item-write-box'>
                        <div className='play-list-item-nickname'>{writerNickname}</div>
           
                    </div>
                </div>
                <div className='play-list-item-middle'>
                    <div className='play-list-item-title'>{title}</div>
                </div>
                <div className='play-list-item-bottom'>
                    <div className='play-list-item-write-date'>{`업로드  ${getElapsedTime()}`}</div>
                    <div className='play-list-item-counts'>
                        {`댓글 ${commentCount} · 좋아요 ${favoriteCount} · 조회수 ${viewCount} `}
                    </div>
                    
                </div>
            </div>
    
                <video className='play-list-item-video'  ref={videoRef} 
                                controls
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                    >
                    <source className='play-video' src={play} type="video/mp4" />
                </video>
  
        </div>
    )
}
