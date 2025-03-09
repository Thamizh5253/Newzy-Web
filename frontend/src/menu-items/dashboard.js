import { IconTargetArrow, IconHistory, IconSearch } from '@tabler/icons-react';

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'dashboard',
  title: 'Dashboard',
  type: 'group',
  children: [
    {
      id: 'top-headlines',
      title: 'Top Headlines',
      type: 'item',
      url: '/utils/top-headlines',
      icon: IconTargetArrow,
      breadcrumbs: false
    },
    
    {
      id: 'search',
      title: 'Search',
      type: 'item',
      url: '/utils/search-news',
      icon: IconSearch,
      breadcrumbs: false
    },
    {
      id: 'news-history',
      title: 'News History',
      type: 'item',
      url: 'utils/news-history',
      icon: IconHistory,
      breadcrumbs: false
    },
  ]
  
};

export default dashboard;

