import axios from "axios";
import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import minus from '../../../assets/image/minus.png';
import plus from '../../../assets/image/plus.png';
import styles from "./detail.module.css";
interface ProductType {
  id: number; 
  name: string;
  provider: string;
  price: string;
  image: string;
}



export default function ShopDetail() {
  const { productNumber } = useParams<{ productNumber: string }>(); // URL의 id 파라미터
  const [product, setProduct] = useState<ProductType | null>(null); // 제품 상태
  const [count, setCount ] = useState<number>(1);
  const handleQuantity = (type: string) => {
    if (type === "plus") {
      setCount(count + 1)
    } else {
      if (count === 1) return;
      setCount (count -1);
    }
  }
  useEffect(() => {
    axios.get("/mock/products.json")
      .then((response) => {
        const foundProduct = response.data.products.find((product: ProductType) => product.id == Number(productNumber));
        setProduct(foundProduct || null); // 제품을 찾지 못하면 null로 설정
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [productNumber]);
  console.log("id", productNumber)

  if (!product) {
    return <div>Loading...</div>; // 제품이 로드되지 않았을 때 로딩 메시지 표시
  }

  return (
    <main className={styles.main}>
      <section className={styles.product}>
        <div className={styles.product_img}>
          <img src={product.image} alt={product.name} />
        </div>
      </section>
      <section className={styles.product}>
        <div className={styles.product_info}>
          <p className={styles.seller_store}>{product.provider}</p>
          <p className={styles.product_name}>{product.name}</p>
          <span className={styles.price}>
            {product.price}
            <span className={styles.unit}>원</span>
          </span>
        </div>

        <div className={styles.delivery}>
          <p>택배배송 / 무료배송</p>
        </div>

        <div className={styles.line}></div>

        <div className={styles.amount}>
          <img
            className={styles.minus}
            src={minus}
            alt="minus"
            onClick={()=> handleQuantity("minus")}
          />

          <div className={styles.count}>
            <span>{count}</span>
          </div>

          <img
            className={styles.plus}
            src={plus}
            alt="plus"
            onClick={()=> handleQuantity("plus")}
          />
        </div>

        <div className={styles.line}></div>

        <div className={styles.sum}>
          <div>
            <span className={styles.sum_price}>총 상품 금액</span>
          </div>

          <div className={styles.total_info}>
            <span className={styles.total}>
              총 수량 <span className={styles.total_count}>{count}개</span>
            </span>
            <span className={styles.total_price}>
              {Number(product.price) * count}
              <span className={styles.total_unit}>원</span>
            </span>
          </div>
        </div>

        <div className={styles.btn}>
          <button className={styles.btn_buy}>바로 구매</button>
          <button className={styles.btn_cart}>장바구니</button>
        </div>
      </section>
    </main>
  );
}
