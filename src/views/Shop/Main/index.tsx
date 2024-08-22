import axios from "axios";
import { useEffect } from "react";
import cart from '../../../assets/image/cart.png';
import productCart from '../../../assets/image/product.png';
import { Product } from "../../../components/ProductItem";
import styles from './shop.module.css';
interface ProductType {
    id: number; 
    name: string;
    provider: string;
    price: string;
    image: string;
  }
  
  interface ShopProps {
    products: ProductType[]; // JSON 객체 배열로 설정
    setProducts: React.Dispatch<React.SetStateAction<ProductType[]>>; // 상태 업데이트 함수
    convertPrice: (price: string) => string; 
  }
  

export  default  function Shop({ products, setProducts, convertPrice }: ShopProps) {
    useEffect(() => {
        axios.get("/mock/products.json")
          .then((response) => {
            setProducts(response.data.products);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      }, [setProducts]);
    

  return (
    <>
      <div className={styles.cart}>
      <img
            className={styles.cartImage}
            src={productCart}
            alt=" products "
          />
      <img
            className={styles.cartImage}
            src={ cart }
            alt=" cart "
          />
      </div>   
      <div className={styles.filter}>
        <p>최신순</p>
        <p>낮은 가격</p>
        <p>높은 가격</p>
      </div>
      <main className={styles.flex_wrap}>
        {products.map((product) => {
    
          return <Product key={product.id} product={product} convertPrice={convertPrice} />;
        })}
        {/* <Product /> */}
   
      </main>
    </>
  );
}
