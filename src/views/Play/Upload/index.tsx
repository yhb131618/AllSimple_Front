import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { MAIN_PATH } from "../../../constant";
import { usePlayStore } from "../../../stores";
import './style.css';

export default function PlayUpload() {

    const titleRef = useRef<HTMLTextAreaElement | null>(null);
    const contentRef = useRef<HTMLTextAreaElement | null>(null);
    const playInputRef = useRef<HTMLInputElement | null>(null);

    const { title, setTitle } = usePlayStore();
    const { content, setContent } = usePlayStore();
    const { playUrl, setPlayUrl } = usePlayStore();

    const { resetPlay } = usePlayStore();

    const [cookies, setCookies] = useCookies();

    const [playUrlPre, setPlayUrlPre] = useState<string>("");

    const navigate = useNavigate();

    const onTitleChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const {value} = event.target;
        setTitle(value);
        if (!titleRef.current) return;
        titleRef.current.style.height = 'auto';
        titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
    }
    const onContentChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const {value} = event.target;
        setContent(value);
        if (!contentRef.current) return;
        contentRef.current.style.height = 'auto';
        contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
    }

    const onPlayChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || !event.target.files.length) return;
        const file = event.target.files[0];

        /* 동영상 미리보기용 URL */
        const playUrlPre = URL.createObjectURL(file); 
        setPlayUrlPre(playUrlPre);
        /* 동영상 업로드를 하기 위한 용도 */
        
        setPlayUrl(file);
      

    }
    const onPlayUploadButtonClickHandler = () => {
        if (!playInputRef.current) return;
        playInputRef.current.click();
    }

    const onPlayCloseButtonClickHandler =() => {
        if (!playInputRef.current) return;
        playInputRef.current.value='';

        setPlayUrlPre("");
        setPlayUrl(null);
    }




    useEffect(() => {
        const accessToken = cookies.accessToken;
        if(!accessToken) {
            navigate(MAIN_PATH());
            return
        }
        resetPlay();
    }, []);

    return (
        <div id='board-write-wrapper'>
            <div className='board-write-container'>
                <div className='board-write-box'>
                    <div className='board-write-title-box'>
                        <textarea ref={titleRef} className='board-write-title-textarea' rows={1}
                                  placeholder='동영상 제목을 작성해주세요' value={title}
                                  onChange={onTitleChangeHandler}/>
                    </div>
                    <div className='divider'></div>
                    <div className='board-write-content-box'>
                        <textarea ref={contentRef} className='board-write-content-textarea' placeholder='본문을 작성해주세요'
                                  value={content}
                                  onChange={onContentChangeHandler}/>
                        <div className='icon-button' onClick={onPlayUploadButtonClickHandler}>
                            <div className='icon image-box-light-icon'></div>
                        </div>
                        <input ref={playInputRef} type='file' accept='video/*' style={{display: "none"}}
                               onChange={onPlayChangeHandler}
                        />
                    </div>
                    <div className='board-write-plays-box'>
                    {playUrlPre && (
                            <div className='board-write-play-box'>
                                <video className='board-write-play' width="400" controls>
                                    <source src={playUrlPre} type="video/mp4" />
                            
                                </video>
                                <div className='icon-button play-close' onClick={onPlayCloseButtonClickHandler}>
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