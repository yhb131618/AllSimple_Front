import {
    AUTH_PATH,
    BOARD_DETAIL_PATH,
    BOARD_MAIN_PATH,
    BOARD_PATH,
    BOARD_UPDATE_PATH,
    BOARD_WRITE_PATH,
    IMAGE_MAIN_PATH,
    IMAGE_PATH,
    MAIN_PATH,
    PLAY_DETAIL_PATH,
    PLAY_MAIN_PATH,
    PLAY_PATH,
    PLAY_UPLOAD_PATH,
    SEARCH_PATH,
    SHOP_DETAIL_PATH,
    SHOP_MAIN_PATH,
    SHOP_PATH,
    USER_PATH
} from "constant";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Route, Routes } from "react-router-dom";
import PlayDetail from "views/Play/Detail";
import PlayUpload from "views/Play/Upload";
import './App.css';
import { getSignInUserRequest } from "./apis";
import { ResponseDto } from "./apis/response";
import { GetSignInUserResponseDto } from "./apis/response/user";
import Container from "./layouts/Container";
import { useLoginUserStore } from "./stores";
import { User } from "./types/interface";
import Authentication from "./views/Authentication";
import BoardDetail from "./views/Board/Detail";
import BoardMain from "./views/Board/Main";
import BoardUpdate from "./views/Board/Update";
import BoardWrite from "./views/Board/Write";
import ImageMain from './views/Image/Main';
import Main from "./views/Main";
import PlayMain from "./views/Play/Main";
import Search from "./views/Search";
import ShopDetail from "./views/Shop/Detail";
import ShopMain from "./views/Shop/Main";
import UserP from "./views/User";
function App() {
    interface ProductType {
        id: number; 
        name: string;
        provider: string;
        price: string;
        image: string;
      }
    

    //shop
    const [products, setProducts] = useState<ProductType[]>([]); // products와 setProducts를 useState로 정의
    const convertPrice = (price: number | string): string => {
        // 숫자가 아닌 경우 숫자로 변환
        const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    
        // 변환된 숫자가 유효한지 확인
        if (isNaN(numericPrice)) return 'Invalid Price';
    
        // 정규식을 사용해 천 단위 구분 기호 추가
        return numericPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

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
        getSignInUserRequest().then(getSignInUserResponse);
    }, [cookies.accessToken]);


    return (
        <Routes>
            <Route element={<Container/>}>
                <Route path={MAIN_PATH()} element={<Main/>}/>
                <Route path={SHOP_PATH()}> 
                    <Route path={SHOP_MAIN_PATH()} element={<ShopMain products={products} setProducts={setProducts} convertPrice={convertPrice} />} />
                    <Route path={SHOP_DETAIL_PATH(':productNumber')} element={<ShopDetail />} />
                </Route>
                <Route path={AUTH_PATH()} element={<Authentication/>}/>
                <Route path={SEARCH_PATH(':searchWord')} element={<Search/>}/>
                <Route path={USER_PATH(':userEmail')} element={<UserP/>}/>
                <Route path={PLAY_PATH()}> 
                    <Route path={PLAY_MAIN_PATH()} element={<PlayMain/>}/>
                    <Route path={PLAY_DETAIL_PATH(':playNumber')} element={<PlayDetail/>}/>
                    <Route path={PLAY_UPLOAD_PATH()} element={<PlayUpload/>}/> 
                </Route>
                <Route path={IMAGE_PATH()}> 
                    <Route path={IMAGE_MAIN_PATH()} element={<ImageMain/>}/>
                </Route>
                <Route path={BOARD_PATH()}>
                    <Route path={BOARD_MAIN_PATH()} element={<BoardMain/>}/>
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
