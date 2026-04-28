import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

export function AppShell() {
  return (
    <>
      <Navbar />
      <main className="flex-1 container-page py-10 md:py-16">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
