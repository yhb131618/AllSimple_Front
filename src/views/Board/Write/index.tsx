import React, {ChangeEvent, useEffect, useRef, useState} from "react";
import './style.css'
import {useBoardStore} from "../../../stores";
import {useNavigate} from "react-router-dom";
import {MAIN_PATH} from "../../../constant";
import {useCookies} from "react-cookie";

export default function BoardWrite() {

    const titleRef = useRef<HTMLTextAreaElement | null>(null);
    const contentRef = useRef<HTMLTextAreaElement | null>(null);
    const imageInputRef = useRef<HTMLInputElement | null>(null);

    const { title, setTitle } = useBoardStore();
    const { content, setContent } = useBoardStore();
    const { boardImageFileList, setBoardImageFileList } = useBoardStore();

    const { resetBoard } = useBoardStore();

    const [cookies, setCookies] = useCookies();

    const [imageUrls, setImageUrls] = useState<string[]>([]);

    const navigate = useNavigate();

    const onTitleChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const {value} = event.target;
        setTitle(value);
        if (!titleRef.current) return;
        titleRef.current.style.height = 'auto';
        titleRef.current.style.height = `${titleRef.current?.scrollHeight}px`;
    }
    const onContentChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const {value} = event.target;
        setContent(value);
        if (!contentRef.current) return;
        contentRef.current.style.height = 'auto';
        contentRef.current.style.height = `${contentRef.current?.scrollHeight}px`;
    }

    const onImageChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || !event.target.files.length) return;
        const file = event.target.files[0];

        /* 이미지 미리보기용 URL */
        const imageUrl = URL.createObjectURL(file); //임시 파일 url 생성
        const newImageUrls = imageUrls.map(item => item);
        newImageUrls.push(imageUrl);
        setImageUrls(newImageUrls);

        /* 이미지 업로드를 하기 위한 용도 */
        const newBoardImageFileList = boardImageFileList.map(item => item);
        newBoardImageFileList.push(file);
        setBoardImageFileList(newBoardImageFileList);

        /* 동일한 이미지 업로드 가능하게 함 */
        if(!imageInputRef.current) return;
        imageInputRef.current.value='';
    }
    const onImageUploadButtonClickHandler = () => {
        if (!imageInputRef.current) return;
        imageInputRef.current.click();
    }

    const onImageCloseButtonClickHandler =(deleteIndex: number) => {
        if (!imageInputRef.current) return;
        imageInputRef.current.value='';

        const newImageUrls = imageUrls.filter((url, index) => index !== deleteIndex);
        setImageUrls(newImageUrls);

        const newBoardImageFileList = boardImageFileList.filter((file, index) => index !== deleteIndex);
        setBoardImageFileList(newBoardImageFileList);
    }

    useEffect(() => {
        const accessToken = cookies.accessToken;
        if(!accessToken) {
            navigate(MAIN_PATH());
            return
        }
        resetBoard();
    }, []);

    return (
        <div id='board-write-wrapper'>
            <div className='board-write-container'>
                <div className='board-write-box'>
                    <div className='board-write-title-box'>
                        <textarea ref={titleRef} className='board-write-title-textarea' rows={1}
                                  placeholder='제목을 작성해주세요' value={title}
                                  onChange={onTitleChangeHandler}/>
                    </div>
                    <div className='divider'></div>
                    <div className='board-write-content-box'>
                        <textarea ref={contentRef} className='board-write-content-textarea' placeholder='본문을 작성해주세요'
                                  value={content}
                                  onChange={onContentChangeHandler}/>
                        <div className='icon-button' onClick={onImageUploadButtonClickHandler}>
                            <div className='icon image-box-light-icon'></div>
                        </div>
                        <input ref={imageInputRef} type='file' accept='image/*' style={{display: "none"}}
                               onChange={onImageChangeHandler}
                        />
                    </div>
                    <div className='board-write-images-box'>
                        {imageUrls.map((imageUrl, index) =>
                            <div className='board-write-image-box'>
                                <img className='board-write-image' src={imageUrl}/>
                                <div className='icon-button image-close' onClick={() => onImageCloseButtonClickHandler(index)}>
                                    <div className='icon close-icon'></div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}
