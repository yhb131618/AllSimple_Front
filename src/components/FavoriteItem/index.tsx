import React from "react";
import './style.css'
import {FavoriteListItem} from "../../types/interface";
import defaultProfileImage from 'assets/image/default-profile-image.png'

interface Props {
    favoriteListItem: FavoriteListItem
}

export default function FavoriteItem ( { favoriteListItem } : Props) {

    const { nickname, profileImage } = favoriteListItem;

    return (
        <div className='favorite-list-item'>
            <div className='favorite-list-item-profile-box'>
                <div className='favorite-list-item-profile-image' style={{ backgroundImage: `url(${profileImage ? profileImage : defaultProfileImage})` }}></div>
            </div>
            <div className='favorite-list-item-nickname'>{nickname}</div>
        </div>
    )
}
