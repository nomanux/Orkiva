import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router'
import { TopBar } from './components/layout/TopBar'
import { NAV_ITEMS } from './components/layout/navItems'
import { Dashboard } from './pages/Dashboard'
import { CheckEmail } from './pages/auth/CheckEmail'
import { ForgotPassword } from './pages/auth/ForgotPassword'
import { Login } from './pages/auth/Login'
import { ResetPassword } from './pages/auth/ResetPassword'
import { SignUp } from './pages/auth/SignUp'
import { VerifyCode } from './pages/auth/VerifyCode'
import { SettingsPage } from './pages/settings/SettingsPage'
import { ProjectsPage } from './pages/projects/ProjectsPage'
import { InboxPage } from './pages/inbox/InboxPage'
import { CalendarPage } from './pages/calendar/CalendarPage'
import { MeetingsPage } from './pages/meetings/MeetingsPage'
import { AiAssistantPage } from './pages/ai/AiAssistantPage'

function AppLayout() {
  return (
    <div className="overflow-x-auto">
      <div className="w-full min-w-[1280px] px-6 pt-6 pb-[42px]">
        <TopBar />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function ComingSoon() {
  const { pathname } = useLocation()
  const label = NAV_ITEMS.find((item) => item.path === pathname)?.label ?? 'This page'
  return <div className="mt-24 text-center text-[22px] text-secondary-400">{label} is coming soon.</div>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/inbox" element={<InboxPage />} />
          <Route path="/meetings" element={<MeetingsPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/ai-assistant" element={<AiAssistantPage />} />
          <Route path="/settings/:section?" element={<SettingsPage />} />
          {NAV_ITEMS.filter((item) => !['/', '/projects', '/inbox', '/meetings', '/calendar', '/ai-assistant'].includes(item.path)).map((item) => (
            <Route key={item.path} path={item.path} element={<ComingSoon />} />
          ))}
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/check-email" element={<CheckEmail />} />
        <Route path="/verify" element={<VerifyCode />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
