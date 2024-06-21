import React from "react";
import './style.css'
import { BoardListItem } from "../../types/interface";
import { useNavigate } from "react-router-dom";
import defaultProfileImage from 'assets/image/default-profile-image.png'
import {BOARD_DETAIL_PATH, BOARD_PATH} from "../../constant";

interface Props {
    boardListItem: BoardListItem;
}

export default function BoardItem({ boardListItem }: Props) {

    const { boardNumber, title, content, boardTitleImage } = boardListItem;
    const { favoriteCount, commentCount, viewCount } = boardListItem;
    const { writeDatetime, writerNickname, writerProfileImage } = boardListItem;

    const navigate = useNavigate();

    const onClickHandler = () => {
        navigate(BOARD_PATH() + '/' + BOARD_DETAIL_PATH(boardNumber));
    }

    return (
        <div className='board-list-item' onClick={onClickHandler}>
            <div className='board-list-item-box'>
                <div className='board-list-item-top'>
                    <div className='board-list-item-profile-box'>
                        <div className='board-list-item-profile-image'
                             style={{ backgroundImage: `url(${writerProfileImage ? writerProfileImage : defaultProfileImage})` }}>
                        </div>
                    </div>
                    <div className='board-list-item-write-box'>
                        <div className='board-list-item-nickname'>{writerNickname}</div>
                        <div className='board-list-item-write-date'>{writeDatetime}</div>
                    </div>
                </div>
                <div className='board-list-item-middle'>
                    <div className='board-list-item-title'>{title}</div>
                    <div className='board-list-item-content'>{content}</div>
                </div>
                <div className='board-list-item-bottom'>
                    <div className='board-list-item-counts'>
                        {`댓글 ${commentCount} · 좋아요 ${favoriteCount} · 조회수 ${viewCount}`}
                    </div>
                </div>
            </div>
            {
                boardTitleImage !== null && (
                    <div className='board-list-item-image-box'>
                        <div className='board-list-item-image'
                             style={{ backgroundImage: `url(${boardTitleImage})` }}>
                        </div>
                    </div>
                )
            }
        </div>
    )
}
