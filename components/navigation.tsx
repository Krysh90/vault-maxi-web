import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import styles from './navigation.module.css'

export default function Navigation() {
  useEffect(() => {
    console.log(styles)
  }, [])

  return (
    <nav className={styles.container}>
      <Link href="/">
        <div className={styles['container-logo']}>
          <Image src="/vault-maxi.png" width={40} height={40} alt="clickable image" />
          <p className={styles.logo}>Vault Maxi</p>
        </div>
      </Link>
      <ul className={styles.nav}>
        <label htmlFor="checkbox_toggle" className={styles.hamburger}>
          &#9776;
        </label>
        <input type="checkbox" id="checkbox_toggle" className={styles.input} />
        <div className={styles.menu}>
          <li>
            <Link href="/vault-maxi">Bot</Link>
          </li>
          <li>
            <Link href="/lm-reinvest">LM reinvest</Link>
          </li>
          <li>
            <Link href="/statistics">Statistics</Link>
          </li>
          <li>
            <Link href="/faq">FAQ</Link>
          </li>
        </div>
      </ul>
    </nav>
  )
}

/*<nav class="navbar">
     <!-- LOGO -->
     <div class="logo">MUO</div>
     <!-- NAVIGATION MENU -->
     <ul class="nav-links">
       <!-- USING CHECKBOX HACK -->
       <input type="checkbox" id="checkbox_toggle" />
       <label for="checkbox_toggle" class="hamburger">&#9776;</label>
       <!-- NAVIGATION MENUS -->
       <div class="menu">
         <li><a href="/">Home</a></li>
         <li><a href="/">About</a></li>
         <li class="services">
           <a href="/">Services</a>
           <!-- DROPDOWN MENU -->
           <ul class="dropdown">
             <li><a href="/">Dropdown 1 </a></li>
             <li><a href="/">Dropdown 2</a></li>
             <li><a href="/">Dropdown 2</a></li>
             <li><a href="/">Dropdown 3</a></li>
             <li><a href="/">Dropdown 4</a></li>
           </ul>
         </li>
         <li><a href="/">Pricing</a></li>
         <li><a href="/">Contact</a></li>
       </div>
     </ul>
   </nav>
*/
