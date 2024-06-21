import React from 'react';
import {Outlet, useLocation} from "react-router-dom";
import './style.css'
import Header from "layouts/Header";
import Footer from "layouts/Footer";
import {AUTH_PATH} from "../../constant";
export default function Container() {

    const { pathname } = useLocation();

    return (
        <>
            <Header />
            <Outlet />
            {
                pathname !== AUTH_PATH() &&
                <Footer />
            }
        </>
    )
}

