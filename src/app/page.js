import styles from "./page.module.scss";
import Calculator from '../components/calculator'

export default function Home() {
  return (
  <div className={styles.page}>
    <Calculator/>
  </div>
  )
}
