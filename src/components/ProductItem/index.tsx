import { Link } from "react-router-dom";
import styles from "./product.module.css";
interface ProductType {
  id: number;
  name: string;
  provider: string;
  price: string;
  image: string;
}

interface ProductProps {
  product: ProductType;
  convertPrice: (price: string) => string; 
} 

export const Product = ( { product,convertPrice }: ProductProps) => {

  console.log("wh2",product)
  console.log("wh", product.name)
  return (
    <div className={styles.product}>
      <Link to={`/shop/detail/${product.id}`}>
        <div className={styles.product_image}>
        <img src={product.image} alt="product" />
        </div>
      </Link>
      <div className={styles.store}>
        <span>{product.provider}</span>
      </div>

      <div className={styles.product_name}>
        <span>{product.name}</span>
      </div>

      <div className={styles.product_price}>
        <span className={styles.price}>{convertPrice(product.price)}</span>
        <span className={styles.unit}>원</span>
      </div>
    </div>
  );
};
