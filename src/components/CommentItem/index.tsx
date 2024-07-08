import defaultProfileImage from 'assets/image/default-profile-image.png';
import dayjs from "dayjs";
import React from "react";
import { CommentListItem } from "../../types/interface";
import './style.css';

interface Props {
    commentListItem: CommentListItem;
}

const CommentItem: React.FC<Props> = ({ commentListItem }) => {
    const { nickname, profileImage, writeDatetime, content, replies } = commentListItem;

    const getElapsedTime = () => {
        const now = dayjs().add(9, 'hour'); // 시간대에 따라 추가/수정 필요할 수 있음
        const writeTime = dayjs(writeDatetime);

        const gap = now.diff(writeTime, 's');
        if (gap < 60) return `${gap}초 전`;
        if (gap < 3600) return `${Math.floor(gap / 60)}분 전`;
        if (gap < 86400) return `${Math.floor(gap / 3600)}시간 전`;
        return `${Math.floor(gap / 86400)}일 전`;
    }

    return (
        <div className='comment-list-item'>
            <div className='comment-list-item-top'>
                <div className='comment-list-item-profile-box'>
                    <div className='comment-list-item-profile-image' style={{ backgroundImage: `url(${profileImage ? profileImage : defaultProfileImage})` }}></div>
                </div>
                <div className='comment-list-item-nickname'>{nickname}</div>
                <div className='comment-list-item-divider'>{'\|'}</div>
                <div className='comment-list-item-time'>{getElapsedTime()}</div>
            </div>
            <div className='comment-list-item-main'>
                <div className='comment-list-item-content'>{content}</div>
                {replies && replies.length > 0 && (
                    <div className='comment-list-item-replies'>
                        {replies.map(reply => (
                            <CommentItem key={reply.id} commentListItem={reply} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default CommentItem;
