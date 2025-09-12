import { BrowserRouter, Route, Routes } from 'react-router';
import {
  Dashboard,
  ForgotPassword,
  Home,
  ResetPassword,
  SignIn,
  SignUp,
  SignUpSuccess,
  VerifyAccount,
} from './pages';
import { AuthLayout, MainLayout, SignInOutLayout } from './layouts';
import { useThemeEffect } from './features/theme';
import {
  VenueDetailPage,
  SpaceDetailPage,
  BookingHistoryPage,
  BookingHistoryDetailPage,
} from './pages';
import './i18n';
import { useGetProfile, useSilentRefresh } from './features/auth';
import AdminLayout from './layouts/AdminLayout';

function App() {
  useThemeEffect();

  const { isLoading } = useSilentRefresh();
  const { isEnabled, isPending: isProfileLoading } = useGetProfile();

  if (isLoading || (isEnabled && isProfileLoading)) {
    return null;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path='/' element={<Home />} />
          <Route path='/venues/:venueId' element={<VenueDetailPage />} />
          <Route path='/spaces/:spaceId' element={<SpaceDetailPage />} />
          <Route path='/bookings' element={<BookingHistoryPage />} />
          <Route
            path='/bookings/:bookingId'
            element={<BookingHistoryDetailPage />}
          />
        </Route>
        <Route element={<AuthLayout />}>
          <Route element={<SignInOutLayout />}>
            <Route path='/sign-in' element={<SignIn />} />
            <Route path='/sign-up' element={<SignUp />} />
          </Route>
          <Route path='/sign-up-success' element={<SignUpSuccess />} />
          <Route path='/verify-email' element={<VerifyAccount />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />
        </Route>
        <Route path='/dashboard'>
          <Route path='admin' element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
