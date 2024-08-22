import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import Carousel from 'react-bootstrap/Carousel'; // Carousel import
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import backgroundImageTitle from '../../assets/image/1600x720_1714106201469.png';
import backgroundImage from '../../assets/image/leaves-6629581_1280.png';
import slide0 from '../../assets/image/slide0.jpg';
import slide1 from '../../assets/image/slide1.jpg';
import slide2 from '../../assets/image/slide2.jpg';
import slide3 from '../../assets/image/slide3.jpg';
import './style.css';

export default function Main() {

        // 방문자 카운트를 위한 상태 관리
        const [visitorCount, setVisitorCount] = useState<number>(0);

        useEffect(() => {
            // 페이지 로드 시 방문자 카운트를 증가시키는 로직
            const count = localStorage.getItem('visitorCount');
            if (count) {
                const newCount = parseInt(count) + 1;
                localStorage.setItem('visitorCount', newCount.toString());
                setVisitorCount(newCount);
            } else {
                // 처음 방문한 경우
                localStorage.setItem('visitorCount', '1');
                setVisitorCount(1);
            }
        }, []);
    
        // 공지사항 데이터 정의
        const notices = [
            { id: 1, title: '업데이트 공지', author: 'admin', date: '2020-12-23' },
            { id: 2, title: '서비스 점검 안내', author: 'admin', date: '2021-01-15' },
            { id: 3, title: '새로운 기능 추가', author: 'admin', date: '2021-02-10' },
        ];
    return (
        <div id='main-frame' style={{ zIndex: 0, width: '100%', position: 'relative' }}>
            <div id='sub-one-frame'>
                <div style={{
                    fontSize: '62px',
                    textAlign: 'center',
                    color: 'white',
                    padding: '50px',
                    margin: '0px',
                    marginBottom: '100px',
                    backgroundSize: 'cover',
                    backgroundImage: `url(${backgroundImageTitle})`
                }}>
                    Wellcome Community!
                </div>

                <Container style={{ margin: '20px', gap: '20px' }}>
                    <Row>
                        <Col>
                            <Row style={{
                                color: 'White',
                                padding: '15px',
                                height: '50%',
                                fontSize: '16px',
                                borderRadius: '20px',
                                backgroundImage: `url(${backgroundImage})`,
                                backgroundSize: 'cover',
                                marginRight: '20px',
                                marginBottom: '20px',
                            }}>
                                <div style={{ fontWeight: 'bold', fontSize: '22px' }}>
                                    방문하신 것을 환영합니다.
                                </div>
                                <br />
                                이곳에 등록된 컨텐츠는 저작권에서 자유롭습니다. <br />
                                각종 자료를 마음껏 가져다 쓰셔도 됩니다.<br />
                                단, 일부 컨텐츠는 유료일 수 있습니다.<br />
                                더불어 이 서비스는 개인당 1GB의 저장공간이 부여되며 수용인원은 100명입니다.<br />
                                추후 인프라 투자를 통해 저장공간과 수용인원을 늘릴 수 있도록 하겠습니다. <br />
                                <br />
                            </Row>
                            <Row style={{
                                color: 'White',
                                padding: '15px',
                                height: '50%',
                                fontSize: '16px',
                                borderRadius: '20px',
                                backgroundImage: `url(${backgroundImage})`,
                                backgroundSize: 'cover',
                                marginRight: '20px',
                            }}>
                                <div style={{ fontWeight: 'bold', fontSize: '22px' }}>
                                    안내사항
                                </div>
                                <br />
                                소규모 서비스 개발문의 환영합니다. <br />
                                프라이빗 클라우드 환경과 오픈소스로 구축하여 비용을 절감해드리며, <br />
                                최대한 저비용으로 서비스 개발해드립니다. <br />
                                추가적으로 기존 서비스에 추가개발도 가능하며 <br />
                                개인 홈 프라이빗 클라우드 웹 서비스 구축도 가능합니다. <br />
                            </Row>
                        </Col>

                        <Col style={{
                            color: 'white',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center', // 수직 중앙 정렬
                            justifyContent: 'center', // 수평 중앙 정렬
                            textAlign: 'center', // 텍스트 중앙 정렬
                            fontSize: '20px',
                            fontWeight: 'bold',
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' // 텍스트 가독성을 위한 그림자
                        }}>
                            <div>
                                {/* 이미지 슬라이드 추가 */}
                                <Carousel>
                                <Carousel.Item>
                                        <img
                                            src={slide0}
                                            alt="First slide"
                                            className="d-block w-100 carousel-image" // 클래스 추가
                                        />
                                    </Carousel.Item>
                                    <Carousel.Item>
                                        <img
                                            src={slide1}
                                            alt="Second slide"
                                            className="d-block w-100 carousel-image" // 클래스 추가
                                        />
                                    </Carousel.Item>
                                    <Carousel.Item>
                                        <img
                                            src={slide2}
                                            alt="Third slide"
                                            className="d-block w-100 carousel-image" // 클래스 추가
                                        />
                                    </Carousel.Item>
                                    <Carousel.Item>
                                        <img
                                            src={slide3}
                                            alt="Third slide"
                                            className="d-block w-100 carousel-image" // 클래스 추가
                                        />
                                    </Carousel.Item>
                                </Carousel>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
            <div id='sub-two-frame'>
                <Col>
                    <Container style={{ margin: '20px', gap: '20px' }}>
                        
                            <Row>
                                <Col style={{
                                color: 'White',
                                padding: '10px',
                                width: '650px',
                                fontSize: '16px',
                                borderRadius: '20px',
               
                  
                            }}>
                                    {/* 공지사항 테이블 추가 */}
                                    <div style={{ margin: '20px 0' }}>
                                        <h2 style={{ color: 'black', marginBottom: '20px' }}>공지사항</h2>
                                        <Table striped bordered hover variant="dark">
                                            <thead>
                                                <tr>
                                                    <th>NO</th>
                                                    <th>공지사항</th>
                                                    <th>작성자</th>
                                                    <th>작성시간</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {notices.map((notice, index) => (
                                                    <tr key={notice.id}>
                                                        <td>{index + 1}</td>
                                                        <td>{notice.title}</td>
                                                        <td>{notice.author}</td>
                                                        <td>{notice.date}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                </Col>
                                <Col style={{
                                    color: 'Black',
                                    padding: '10px',
                                    width: '650px',
                                    fontSize: '16px',
                                    borderRadius: '20px',
                
                    
                                }}>
                                <div style={{ margin: '20px 0' }}>
                                <h2 style={{ color: 'black', marginBottom: '20px' }}>로그인 접속자</h2>
                
                                <Table striped bordered hover variant="dark">
                                            <thead>
                                                <tr>
                                                    <th>NO</th>
                                                    <th>닉네임</th>
                                                    <th>접속시간</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {notices.map((notice, index) => (
                                                    <tr key={notice.id}>
                                                        <td>{index + 1}</td>
                                                        <td>{notice.author}</td>
                                                        <td>{notice.date}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                </Table>
                                <div style={{ margin: '0px', fontSize: '20px' }}> Today: {visitorCount}명 </div>
                                <div style={{ margin: '0px', fontSize: '20px' }}> Since: {visitorCount}명 </div>
                                 </div>
                
                            </Col>
                            </Row>
     
                        </Container>
                            
                    </Col >
      
            </div>
            <div id='sub-three-frame'></div>
        </div>
    );
}
