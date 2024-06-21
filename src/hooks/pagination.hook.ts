import {useEffect, useState} from "react";

const usePaginaion = <T>(countPerPage: number) => {

    // 타입은 호출시에 결정하기 위해 제네릭 형태로 지정 == 매개타입
    const [totalList, setTotalList] = useState<T[]>([]);

    const [viewList, setViewList] = useState<T[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPageList, setTotalPageList] = useState<number[]>([1]);
    const [viewPageList, setViewPageList] = useState<number[]>([1]);
    const [currentSection, setCurrentSection] = useState<number>(1);
    const [totalSection, setTotalSection] = useState<number>(1);

    const setView = () => {
        const FIRST_INDEX = countPerPage * (currentPage - 1);
        const LAST_INDEX = totalList.length > countPerPage * currentPage ? countPerPage * currentPage : totalList.length;
        const viewList = totalList.slice(FIRST_INDEX, LAST_INDEX);
        setViewList(viewList);
    }

    const setViewPage = () => {
        const FIRST_INDEX = 10 * (currentSection - 1);
        const LAST_INDEX = totalPageList.length > 10 * currentSection ? 10 * currentSection : totalPageList.length;
        const viewPageList = totalPageList.slice(FIRST_INDEX, LAST_INDEX);
        setViewPageList(viewPageList);
    }

    useEffect(() => {
        const totalPage = Math.ceil(totalList.length / countPerPage);
        const totalPageList:number[] = [];
        for(let page = 1; page <= totalPage; page++) totalPageList.push(page);
        setTotalPageList(totalPageList);

        const totalSection = Math.ceil(totalList.length / (countPerPage * 10));
        setTotalSection(totalSection);

        setCurrentPage(1);
        setCurrentSection(1);

        setView();
        setViewPage();
    }, [totalList]);

    useEffect(setView,[currentPage]);
    useEffect(setViewPage,[currentPage]);

    return{
        currentPage,  //현재페이지가 어디에 있는지
        setCurrentPage, //현재페이지를 변경
        currentSection,  //현재 화면의 섹션
        setCurrentSection, //이전, 다음을 눌렀을 때 섹션을 변경
        viewList,
        viewPageList,
        totalSection,
        setTotalList
    };
}

export default usePaginaion;
