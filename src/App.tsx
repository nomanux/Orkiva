import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router'
import { TopBar } from './components/layout/TopBar'
import { useSession } from './data/session'
import { Dashboard } from './pages/Dashboard'
import { CheckEmail } from './pages/auth/CheckEmail'
import { ForgotPassword } from './pages/auth/ForgotPassword'
import { Login } from './pages/auth/Login'
import { ResetPassword } from './pages/auth/ResetPassword'
import { SignUp } from './pages/auth/SignUp'
import { VerifyCode } from './pages/auth/VerifyCode'

// Heavier pages load on first visit so the dashboard and login stay fast.
const SettingsPage = lazy(() => import('./pages/settings/SettingsPage').then((m) => ({ default: m.SettingsPage })))
const ProjectsPage = lazy(() => import('./pages/projects/ProjectsPage').then((m) => ({ default: m.ProjectsPage })))
const InboxPage = lazy(() => import('./pages/inbox/InboxPage').then((m) => ({ default: m.InboxPage })))
const CalendarPage = lazy(() => import('./pages/calendar/CalendarPage').then((m) => ({ default: m.CalendarPage })))
const MeetingsPage = lazy(() => import('./pages/meetings/MeetingsPage').then((m) => ({ default: m.MeetingsPage })))
const AiAssistantPage = lazy(() => import('./pages/ai/AiAssistantPage').then((m) => ({ default: m.AiAssistantPage })))

function AppLayout() {
  const { signedIn } = useSession()
  const { pathname, search } = useLocation()
  if (!signedIn) return <Navigate to="/login" replace state={{ from: pathname + search }} />
  return (
    <div className="overflow-x-auto">
      <div className="w-full min-w-[1280px] px-6 pt-6 pb-[42px]">
        <TopBar />
        <main>
          <Suspense fallback={<p className="mt-24 text-center text-[14px] text-grey-text">Loading…</p>}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
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
