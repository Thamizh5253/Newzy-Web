import { useRoutes, Navigate } from 'react-router-dom';
import { lazy, useContext } from 'react';
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import MainLayout from 'layout/MainLayout';
import UsernameContext from '../views/context/context';

// Authentication routes
const LandingPage = Loadable(lazy(() => import('views/pages/authentication/authentication3/LadingPage')));
const AuthLogin3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Login3')));
const AuthRegister3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Register3')));

// Main routes
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const Search = Loadable(lazy(() => import('views/utilities/Search')));
const TopHeadlines = Loadable(lazy(() => import('views/utilities/TopHeadlines')));
const NewsHistory = Loadable(lazy(() => import('views/utilities/NewsHistory')));

export default function ThemeRoutes() {
  const { auth } = useContext(UsernameContext);

  const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: 'dashboard',
        children: [
          {
            path: 'default',
            element: <TopHeadlines />
          }
        ]
      },
      {
        path: '/',
        element: <DashboardDefault />
      },
      {
        path: 'utils',
        children: [
          {
            path: 'search-news',
            element: <Search />
          },
          {
            path: 'top-headlines',
            element: <TopHeadlines />
          },
          {
            path: 'news-history',
            element: <NewsHistory />
          }
        ]
      }
    ]
  };

  const AuthenticationRoutes = {
    path: '/',
    element: <MinimalLayout />,
    children: [
      {
        path: '/',
        element: <LandingPage />
      },
      {
        path: '/pages/login/login3',
        element: <AuthLogin3 />
      },
      {
        path: '/pages/register/register3',
        element: <AuthRegister3 />
      }
    ]
  };

  const routes = auth ? [MainRoutes] : [AuthenticationRoutes];

  const NotFoundRoute = {
    path: '*',
    element: <Navigate to="/" replace />
  };

  routes[0].children.push(NotFoundRoute);

  return useRoutes(routes);
}