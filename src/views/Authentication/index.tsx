import React, {ChangeEvent, KeyboardEvent, useEffect, useRef, useState} from "react";
import './style.css'
import InputBox from "../../components/InputBox";
import {SignInRequestDto, SignUpRequestDto} from "../../apis/request/auth";
import {signInRequest, signUpRequest} from "../../apis";
import {ResponseDto} from "../../apis/response";
import {SignInResponseDto} from "../../apis/response/auth";
import {useCookies} from "react-cookie";
import {MAIN_PATH} from "../../constant";
import {useNavigate} from "react-router-dom";
import {Address, useDaumPostcodePopup} from "react-daum-postcode";

export default function Authentication() {

    const [view, setView] = useState<'sign-in' | 'sign-up'>('sign-in')

    const [cookies, setCookie] = useCookies();

    const navigator = useNavigate();



    const SignInCard = () => {

        const emailRef = useRef<HTMLInputElement | null>(null);
        const passwordRef = useRef<HTMLInputElement | null>(null);

        const [email, setEmail] = useState<string>('');
        const [password, setPassword] = useState<string>('');
        const [passwordType, setPasswordType] = useState<'text' | 'password'>('password');
        const [passwordButtonIcon, setPasswordButtonIcon] =
            useState<'eye-light-off-icon' | 'eye-light-on-icon'>('eye-light-off-icon');

        const signInResponse = (responseBody: SignInRequestDto | ResponseDto | null) => {
            if (!responseBody) {
                alert('네트워크 이상입니다.');
                return;
            }
            const {code} = responseBody as ResponseDto;
            if (code === "DBE") alert('데이터베이스 오류입니다');
            if (code === "SF" || code === 'VF') setError(true);
            if (code !== "SU") return;

            const {token, expirationTime} = responseBody as SignInResponseDto;
            const now = new Date().getTime();
            const expires = new Date(now + expirationTime * 1000);

            setCookie('accessToken', token, {expires, path: MAIN_PATH()});
            navigator(MAIN_PATH());
        }

        const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            setError(false);
            const {value} = event.target;
            setEmail(value);
        }

        const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            setError(false);
            const {value} = event.target;
            setPassword(value);
        }

        const onSignInButtonClickHandler = () => {
            const requestBody: SignInRequestDto = {email, password};
            signInRequest(requestBody).then(signInResponse);
        }

        const onSignUpLinkClickHandler = () => {
            setView('sign-up');
        }
        const onPasswordButtonClickHandler = () => {
            if (passwordType === 'text') {
                setPasswordType('password');
                setPasswordButtonIcon('eye-light-off-icon');
            } else {
                setPasswordType('text');
                setPasswordButtonIcon('eye-light-on-icon');
            }
        }
        const onEmailKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key !== 'Enter') return;
            if (!passwordRef.current) return;
            passwordRef.current.focus();
        }
        const onPasswordKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key !== 'Enter') return;
            onSignInButtonClickHandler();
        }


        const [error, setError] = useState<boolean>(false);

        return (
            <div className={'auth-card'}>
                <div className='auth-card-box'>
                    <div className='auth-card-top'>
                        <div className='auth-card-title-box'></div>
                        <div className='auth-card-title'>{'로그인'}</div>
                        <InputBox ref={emailRef} label='이메일 주소' type='text' placeholder='이메일 주소를 입력해주세요.' error={error}
                                  value={email} onChange={onEmailChangeHandler} onKeyDown={onEmailKeyDownHandler}/>
                        <InputBox ref={passwordRef} label='패스워드' type={passwordType} placeholder='비밀번호를 입력해주세요'
                                  error={error} value={password} onChange={onPasswordChangeHandler}
                                  icon={passwordButtonIcon} onButtonClick={onPasswordButtonClickHandler}
                                  onKeyDown={onPasswordKeyDownHandler}/>
                    </div>
                    <div className='auth-card-bottom'>
                        {error &&
                            <div className='auth-sign-in-error-box'>
                                <div className='auth-sign-in-error-message'>
                                    {'이메일 주소 또는 비밀번호를 잘못 입력했습니다. \n입력하신 내용을 다시 확인해주세요.'}
                                </div>
                            </div>
                        }
                        <div className='black-large-full-button' onClick={onSignInButtonClickHandler}>{'로그인'}</div>
                        <div className='auth-description-box'>
                            <div className='auth-description'>{'신규 사용자이신가요? '}<span className='auth-description-link'
                                                                                    onClick={onSignUpLinkClickHandler}>{'회원가입'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const SignUpCard = () => {

        const emailRef = useRef<HTMLInputElement | null>(null);
        const passwordRef = useRef<HTMLInputElement | null>(null);
        const passwordCheckRef = useRef<HTMLInputElement | null>(null);

        const nicknameRef = useRef<HTMLInputElement | null>(null);
        const telNumberRef = useRef<HTMLInputElement | null>(null);
        const addressRef = useRef<HTMLInputElement | null>(null);
        const addressDetailRef = useRef<HTMLInputElement | null>(null);

        const [nickname, setNickname] = useState<string>('');
        const [telNumber, setTelNumber] = useState<string>('');
        const [address, setAddress] = useState<string>('');
        const [addressDetail, setAddressDetail] = useState<string>('');
        const [agreedPersonal, setAgreedPosonal] = useState<boolean>(false);

        const [page, setPage] = useState<1 | 2>(1);
        const [email, setEmail] = useState<string>('');
        const [password, setPassword] = useState<string>('');
        const [passwordCheck, setPasswordCheck] = useState<string>('');
        const [passwordType, setPasswordType] = useState<'text' | 'password'>('password');
        const [passwordCheckType, setPasswordCheckType] = useState<'text' | 'password'>('password');

        const [isEmailError, setEmailError] = useState<boolean>(false);
        const [isPasswordError, setPasswordError] = useState<boolean>(false);
        const [isPasswordCheckError, setPasswordCheckError] = useState<boolean>(false);
        const [isNicknameError, setNicknameError] = useState<boolean>(false);
        const [isTelNumberError, setTelNumberError] = useState<boolean>(false);
        const [isAddressError, setAddressError] = useState<boolean>(false);
        const [isAgreedPersonalError, setAgreedPersonalError] = useState<boolean>(false);


        const [emailErrorMessage, setEmailErrorMessage] = useState<string>('');
        const [passwordErrorMessage, setpasswordErrorMessage] = useState<string>('');
        const [passwordCheckErrorMessage, setPasswordCheckErrorMessage] = useState<string>('');
        const [nicknameErrorMessage, setNicknameErrorMessage] = useState<string>('');
        const [telNumberErrorMessage, setTelNumberErrorMessage] = useState<string>('');
        const [addressErrorMessage, setAddressErrorMessage] = useState<string>('');

        const [passwordButtonIcon, setPasswordButtonIcon] = useState<'eye-light-off-icon' | 'eye-light-on-icon'>('eye-light-off-icon');
        const [passwordCheckButtonIcon, setPasswordCheckButtonIcon] = useState<'eye-light-off-icon' | 'eye-light-on-icon'>('eye-light-off-icon');

        const open = useDaumPostcodePopup();

        const signUpResponse = (responseBody: SignInResponseDto | ResponseDto | null) => {
            if(!responseBody) {
                alert('네트워크 이상입니다.');
                return;
            }

            const { code } = responseBody;
            if(code ==='DE'){
                setEmailError(true);
                setEmailErrorMessage('중복되는 이메일 주소입니다');
            }

            if(code === 'DN'){
                setNicknameError(true);
                setNicknameErrorMessage('중복되는 닉네임입니다');
            }

            if(code === 'DT'){
                setTelNumberError(true);
                setTelNumberErrorMessage('중복되는 핸드폰번호입니다');
            }

            if(code === 'VF') alert('모든 값을 입력하세요');
            if(code === 'DBE') alert('데이터베이스 오류입니다');

            if(code !== 'SU') return;

            setView('sign-in');
        }

        const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            const {value} = event.target;
            setEmail(value);
            setEmailError(false);
            setEmailErrorMessage('');
        }

        const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            const {value} = event.target;
            setPassword(value);
            setPasswordError(false);
            setpasswordErrorMessage('');
        }

        const onPasswordCheckChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            const {value} = event.target;
            setPasswordCheck(value);
            setPasswordCheckError(false);
            setPasswordCheckErrorMessage('')
        }
        const onPasswordButtonClickHandler = () => {
            if (passwordButtonIcon === 'eye-light-off-icon') {
                setPasswordButtonIcon('eye-light-on-icon');
                setPasswordType('text');
            } else {
                setPasswordButtonIcon('eye-light-off-icon');
                setPasswordType('password');
            }
        }
        const onPasswordCheckButtonClickHandler = () => {
            if (passwordCheckButtonIcon === 'eye-light-off-icon') {
                setPasswordCheckButtonIcon('eye-light-on-icon');
                setPasswordCheckType('text');
            } else {
                setPasswordCheckButtonIcon('eye-light-off-icon');
                setPasswordCheckType('password');
            }
        }

        const onAddressButtonClickHandler = () => {
            open({ onComplete });
        }

        const onAgreedPersonalClickHandler = () => {
            setAgreedPosonal(!agreedPersonal);
            setAgreedPersonalError(false);
        }

        const onNextButtonClickHandler = () => {
            const emailPattern = /^[a-zA-Z0-9]*@([-.]?[a-zA-Z0-9])*\.[a-zA-Z]{2,4}$/;
            const isEmailPattern = emailPattern.test(email);

            if (!isEmailPattern) {
                setEmailError(true);
                setEmailErrorMessage('이메일 주소 포맷이 맞지 않습니다.');
            }

            const isCheckedPassword = password.trim().length >= 8;
            if (!isCheckedPassword) {
                setPasswordError(true);
                setpasswordErrorMessage('비밀번호는 8자 이상 입력해주세요.');
            }

            const isEqualPassword = password === passwordCheck;
            if (!isEqualPassword) {
                setPasswordCheckError(true);
                setPasswordCheckErrorMessage('비밀번호가 일치하지 않습니다.');
            }
            if (!isEmailPattern || !isCheckedPassword || !isEqualPassword) return;

            setPage(2);
        }

        const onSignUpButtonClickHandler = () => {
            const emailPattern = /^[a-zA-Z0-9]*@([-.]?[a-zA-Z0-9])*\.[a-zA-Z]{2,4}$/;
            const isEmailPattern = emailPattern.test(email);

            if (!isEmailPattern) {
                setEmailError(true);
                setEmailErrorMessage('이메일 주소 포맷이 맞지 않습니다.');
            }

            const isCheckedPassword = password.trim().length >= 8;
            if (!isCheckedPassword) {
                setPasswordError(true);
                setpasswordErrorMessage('비밀번호는 8자 이상 입력해주세요.');
            }

            const isEqualPassword = password === passwordCheck;
            if (!isEqualPassword) {
                setPasswordCheckError(true);
                setPasswordCheckErrorMessage('비밀번호가 일치하지 않습니다.');
            }

            if (!isEmailPattern || !isCheckedPassword || !isEqualPassword) {
                setPage(1);
                return;
            }

            const hasNickname = nickname.length !== 0 ;
            if(!hasNickname) {
                setNicknameError(true);
                setNicknameErrorMessage('닉네임을 입력해주세요');
            }

            const telNumberPattern = /^[0-9]{11,13}$/;
            const isTelNumberPattern  = telNumberPattern.test(telNumber);
            if(!isTelNumberPattern) {
                setTelNumberError(true);
                setTelNumberErrorMessage('숫자만 입력해주세요');
            }

            const hasAddress = address.length > 0;
            if(!hasAddress) {
                setAddressError(true);
                setAddressErrorMessage('주소를 선택해주세요');
            }

            if(!agreedPersonal) setAgreedPersonalError(true);

            if(!hasNickname || !isTelNumberPattern || !agreedPersonal) return;

            const requestbody:SignUpRequestDto = {
                email, password, nickname, telNumber, address, addressDetail, agreedPersonal
            };

            signUpRequest(requestbody).then(signUpResponse);
        }

        const onSignInLinkClickHandler = () => {
            setView('sign-in');
        }
        const onEmailKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key !== 'Enter') return;
            if (!passwordRef.current) return;
            passwordRef.current.focus();
        }

        const onPasswordKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key !== 'Enter') return;
            if (!passwordCheckRef.current) return;
            passwordCheckRef.current.focus();
        }

        const onPasswordCheckKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key !== 'Enter') return;
            onNextButtonClickHandler();
        }

        const onNicnknameKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key !== 'Enter') return;
            if (!telNumberRef.current) return;
            telNumberRef.current.focus();
        }

        const onTelNumberKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key !== 'Enter') return;
            onAddressButtonClickHandler();
        }

        const onAddressKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key !== 'Enter') return;
            if (!addressDetailRef.current) return;
            addressDetailRef.current?.focus();
        }

        const onAddressDetailKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key !== 'Enter') return;
            onSignUpButtonClickHandler();
        }

        const onComplete = (data: Address) => {
            const { address } = data;
            setAddress(address);
            setAddressError(false);
            setAddressErrorMessage('');
            if(!addressDetailRef.current) return;
            addressDetailRef.current.focus();
        }


        useEffect(() => {
            if(page === 2 ) {
                if(!nicknameRef.current) return;
                nicknameRef.current?.focus();
            }
        }, [page]);

        const onNicknameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            const {value} = event.target;
            setNickname(value);
            setNicknameError(false);
            setNicknameErrorMessage('');
        }

        const onTelNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            const {value} = event.target;
            setTelNumber(value);
            setTelNumberError(false);
            setTelNumberErrorMessage('');
        }

        const onAddressChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            const {value} = event.target;
            setAddress(value);
            setAddressError(false);
            setAddressErrorMessage('');
        }

        const onAddressDetailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            const {value} = event.target;
            setAddressDetail(value);
        }

        return (
            <div className='auth-card'>
                <div className='auth-card-box'>
                    <div className='auth-card-top'>
                        <div className='auth-card-title-box'>
                            <div className='auth-card-title'>{'회원가입'}</div>
                            <div className='auth-card-page'>{`${page}/2`}</div>
                        </div>

                        {page === 1 &&
                            <>
                                <InputBox ref={emailRef} label={'이메일 주소 *'} type='text' placeholder='이메일 주소를 입력해주세요'
                                          value={email}
                                          error={isEmailError} message={emailErrorMessage}
                                          onChange={onEmailChangeHandler}
                                          onKeyDown={onEmailKeyDownHandler}
                                />

                                <InputBox ref={passwordRef} label={'비밀번호 *'} type={passwordType}
                                          placeholder='비밀번호를 입력해주세요' value={password}
                                          icon={passwordButtonIcon}
                                          error={isPasswordError} message={passwordErrorMessage}
                                          onChange={onPasswordChangeHandler}
                                          onButtonClick={onPasswordButtonClickHandler}
                                          onKeyDown={onPasswordKeyDownHandler}
                                />

                                <InputBox ref={passwordCheckRef} label={'비밀번호 확인 *'} type={passwordCheckType}
                                          placeholder='비밀번호를 다시 입력해주세요' value={passwordCheck}
                                          icon={passwordCheckButtonIcon}
                                          error={isPasswordCheckError} message={passwordCheckErrorMessage}
                                          onChange={onPasswordCheckChangeHandler}
                                          onButtonClick={onPasswordCheckButtonClickHandler}
                                          onKeyDown={onPasswordCheckKeyDownHandler}
                                />
                            </>
                        }
                        {page === 2 &&
                            <>
                                <InputBox label={'닉네임*'} ref={nicknameRef} type='text' placeholder={'닉네임을 입력해주세요'}
                                          value={nickname}
                                          error={isNicknameError} message={nicknameErrorMessage}
                                          onChange={onNicknameChangeHandler}
                                          onKeyDown={onNicnknameKeyDownHandler}

                                />
                                <InputBox label={'핸드폰 번호*'} ref={telNumberRef} type='text'
                                          placeholder={'핸드폰 번호를 입력해주세요'} value={telNumber}
                                          error={isTelNumberError} message={telNumberErrorMessage}
                                          onChange={onTelNumberChangeHandler}
                                          onKeyDown={onTelNumberKeyDownHandler}
                                />

                                <InputBox label={'주소*'} ref={addressRef} type='text' placeholder={'우편번호 찾기'}
                                          value={address}
                                          error={isAddressError} message={addressErrorMessage}
                                          icon='expand-right-light-icon'
                                          onChange={onAddressChangeHandler}
                                          onButtonClick={onAddressButtonClickHandler}
                                          onKeyDown={onAddressKeyDownHandler}
                                />
                                <InputBox label={'상세 주소'} ref={addressDetailRef} type='text'
                                          placeholder={'상세 주소를 입력해주세요'} value={addressDetail}
                                          error={false}
                                          onChange={onAddressDetailChangeHandler}
                                          onKeyDown={onAddressDetailKeyDownHandler}
                                />
                            </>
                        }

                    </div>
                    <div className='auth-card-bottom'>
                        {
                            page === 1 &&
                            <div className='black-large-full-button' onClick={onNextButtonClickHandler}>{'다음 단계'}</div>
                        }
                        {
                            page === 2 &&
                            <>
                                <div className='auth-consent-box'>
                                    <div className='auth-check-box' onClick={onAgreedPersonalClickHandler}>
                                        <div className={`icon ${agreedPersonal ? 'check-round-fill-icon' : 'check-ring-light-icon'}`}></div>
                                    </div>
                                    <div
                                        className={isAgreedPersonalError ? 'auth-consent-title-error' : 'auth-consent-title'}>{'개인정보동의'}</div>
                                    <div className='auth-consent-link'>{'더보기 > '}</div>
                                </div>
                                <div className='black-large-full-button'
                                     onClick={onSignUpButtonClickHandler}>{'회원가입'}</div>
                            </>

                        }
                        <div className='auth-description-box'>
                            <div className='auth-description'>
                                {'이미 계정이 있으신가요? '}
                                <span className='auth-description-link'
                                      onClick={onSignInLinkClickHandler}>{'로그인'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div id='auth-wrapper'>
            <div className='auth-container'>
                <div className='auth-jumbotron-box'>
                    <div className='auth-jumbotron-contents'>
                        <div className='auth-logo-icon'></div>
                        <div className='auth-jumbotron-text-box'>
                            <div className='auth-jumbotron-text'>{'Yellow Board'}</div>
                        </div>
                    </div>
                </div>
                {view === 'sign-in' && <SignInCard/>}
                {view === 'sign-up' && <SignUpCard/>}
            </div>
        </div>
    )
}
