import Footer from "layouts/Footer";
import Header from "layouts/Header";
import { Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";
import { AUTH_PATH } from "../../constant";
import './style.css';

export default function Container() {

    const {pathname} = useLocation();

    return (
        <>
            {pathname === AUTH_PATH() ?
                <Outlet/>
            :
                <>
                    <Header/>
                    <OutletWrapper>
                        <Outlet/>
                    </OutletWrapper>
                    <Footer/>
                </>
            }
        </>
    )
}

const OutletWrapper = styled.div`
  margin-top: 90px;
  padding-bottom: 90px;
`

