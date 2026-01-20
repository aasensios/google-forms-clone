import { Inter } from 'next/font/google'
import styles from './page.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.grid}>
        <a href="/forms" className={styles.card}>
          <h2 className={inter.className}>
            Forms <span>-&gt;</span>
          </h2>
          <p className={inter.className}>Play with a clone of Google Forms</p>
        </a>
      </div>
    </main>
  )
}
