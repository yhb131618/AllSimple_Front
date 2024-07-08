import './style.css';

export default function Footer() {

    const onInstaIconButtonClickHandler = () => {
        window.open('https://www.instagram.com');
    }

    const onNaverBlogIconButtonClickHandler = () => {
        window.open('https://blog.naver.com');
    }

    return (
        <div id='footer'>
            <div className='footer-container'>
                <div className='footer-top'>
                    <div className='footer-logo-box'>
                        <div className='icon-box-middle'>
                            <div className='icon logo-white'></div>
                        </div>
                        <div className='footer-logo-text'>{'AllSimple Company'}</div>
                    </div>
                    <div className='footer-link-box'>
                        <div className='footer-email-link'>{'yhb131618@naver.com'}</div>
                        <div className='icon-button'>
                            {/* 깃블로그 아이콘 주소 변경 */}
                            <div className='icon insta-icon' onClick={onInstaIconButtonClickHandler}></div>
                        </div>
                        <div className='icon-button'>
                            {/* 깃허브 아이콘 주소 변경 */}   
                            <div className='icon naver-blog-icon' onClick={onNaverBlogIconButtonClickHandler}></div>
                        </div>
                    </div>
                </div>
                <div className='footer-bottom'>
                    <div className='footer-copyright'>{'© 2024 AllSimple. All rights reserved.'}</div>
                </div>
            </div>
        </div>
    );
};

