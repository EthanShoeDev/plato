import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import AnimatedHeading from "../components/animatedHeading";
import AsyncCanvasBackgroundAnimation from "../components/asyncCanvasBackgroundEffect";
import styles from "../styles/index.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Ethan Portfolio</title>
        <meta name="description" content="Code samples and demos" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AnimatedHeading className={styles.animatedHeader} />
      <AsyncCanvasBackgroundAnimation />
      <main className={styles.main}>
        <div className={styles.spacer} />

        <h1 className={styles.title}>Ethan's Portfolio</h1>

        <p className={styles.description}>
          Check out some of my demos{" "}
          <code className={styles.code}>pages/index.tsx</code>
        </p>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>Documentation &rarr;</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h2>Learn &rarr;</h2>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/canary/examples"
            className={styles.card}
          >
            <h2>Examples &rarr;</h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.card}
          >
            <h2>Deploy &rarr;</h2>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          See how this site was created{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
