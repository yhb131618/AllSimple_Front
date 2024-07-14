import defaultProfileImage from 'assets/image/default-profile-image.png';
import { useNavigate } from "react-router-dom";
import { PlayListItem } from "../../types/interface";
import './style.css';

interface Props {
    playListItem: PlayListItem;
}

export default function PlayItem({ playListItem }: Props) {

    const { playNumber, title, content, play } = playListItem;
    const { favoriteCount, commentCount, viewCount } = playListItem;
    const { writeDatetime, writerNickname, writerProfileImage } = playListItem;

    const navigate = useNavigate();

    const onClickHandler = () => {
        // navigate(PLAY_PATH() + '/' + PLAY_DETAIL_PATH(boardNumber));
    }

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
                        <div className='play-list-item-write-date'>{writeDatetime}</div>
                    </div>
                </div>
                <div className='play-list-item-middle'>
                    <div className='play-list-item-title'>{title}</div>
                    <div className='play-list-item-content'>{content}</div>
                </div>
                <div className='play-list-item-bottom'>
                    <div className='play-list-item-counts'>
                        {`댓글 ${commentCount} · 좋아요 ${favoriteCount} · 조회수 ${viewCount}`}
                    </div>
                </div>
            </div>
    
                <video className='play-list-item-video' controls>
                    <source className='play-video' src={play} type="video/mp4" />
                </video>
  
        </div>
    )
}
