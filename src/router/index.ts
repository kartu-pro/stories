import { createRouter, createWebHistory } from 'vue-router';
import LibraryView from '@/views/LibraryView.vue';
import SetupView from '@/views/SetupView.vue';
import QuizEngine from '@/views/QuizEngine.vue';
import SummaryView from '@/views/SummaryView.vue';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL), // Use Hash instead of Web
  routes: [
    {
      path: '/',
      name: 'library',
      component: LibraryView
    },
    {
      path: '/setup/:id',
      name: 'setup',
      component: SetupView,
      props: true
    },
    {
      path: '/story',
      name: 'story',
      component: QuizEngine,
      // Guard: Don't let users go if no story is selected
      beforeEnter: (to, from, next) => {
        const session = useSessionStore();
        session.sessionActive ? next() : next({ name: 'library' });
      }
    },
    {
      path: '/summary',
      name: 'summary',
      component: SummaryView
    }
  ]
});

export default router;
