import './App.css';
import {Route, Routes} from "react-router-dom";
import Main from "./views/Main";
import Authentication from "./views/Authentication";
import Search from "./views/Search";
import UserP from "./views/User";
import BoardDetail from "./views/Board/Detail";
import BoardWrite from "./views/Board/Write";
import BoardUpdate from "./views/Board/Update";
import Container from "./layouts/Container";
import {
    AUTH_PATH,
    BOARD_DETAIL_PATH,
    BOARD_PATH,
    BOARD_UPDATE_PATH,
    BOARD_WRITE_PATH,
    MAIN_PATH,
    SEARCH_PATH,
    USER_PATH
} from "constant";
import {useEffect} from "react";
import {useCookies} from "react-cookie";
import {useLoginUserStore} from "./stores";
import {GetSignInUserResponseDto} from "./apis/response/user";
import {ResponseDto} from "./apis/response";
import {User} from "./types/interface";
import {getSignInUserRequest} from "./apis";

function App() {

    const {setLoginUser, resetLoginUser} = useLoginUserStore();

    const [cookies, setCookies] = useCookies();

    const getSignInUserResponse = (responseBody: GetSignInUserResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const {code} = responseBody;

        if (code === 'AF' || code === 'NU' || code === 'DBE') {
            resetLoginUser();
            return;
        }
        const loginUser: User = {...responseBody as GetSignInUserResponseDto};
        setLoginUser(loginUser);
    }

    useEffect(() => {
        if (!cookies.accessToken) {
            resetLoginUser();
            return;
        }
        getSignInUserRequest(cookies.accessToken).then(getSignInUserResponse);
    }, [cookies.accessToken]);


    return (
        <Routes>
            <Route element={<Container/>}>
                <Route path={MAIN_PATH()} element={<Main/>}/>
                <Route path={AUTH_PATH()} element={<Authentication/>}/>
                <Route path={SEARCH_PATH(':searchWord')} element={<Search/>}/>
                <Route path={USER_PATH(':userEmail')} element={<UserP/>}/>
                <Route path={BOARD_PATH()}>
                    <Route path={BOARD_WRITE_PATH()} element={<BoardWrite/>}/>
                    <Route path={BOARD_DETAIL_PATH(':boardNumber')} element={<BoardDetail/>}/>
                    <Route path={BOARD_UPDATE_PATH(':boardNumber')} element={<BoardUpdate/>}/>
                </Route>
            </Route>
            <Route path='*' element={<h1>404 Not Found</h1>}/>
        </Routes>

    );
}

export default App;
