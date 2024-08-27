import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'



/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/case/project',
    children: [
      {
        path: 'case/project',
        component: () => import('@/views/case-table/case-project'),
        // component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', affix: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/case',
    component: Layout,
    redirect: '/case/page',
    alwaysShow: true, // will always show the root menu
    name: 'Case',
    meta: {
      title: 'Case',
      icon: 'table',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'study',
        component: () => import('@/views/case-table/study'),
        name: 'Study',
        meta: {
          title: 'Study',
          roles: ['admin', 'editor']
        }
      },
      {
        path: 'project',
        component: () => import('@/views/case-table/case-project'),
        name: 'CaseProject',
        meta: {
          title: 'Project',
          roles: ['admin', 'editor']
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'project-study',
        component: () => import('@/views/case-table/project-study'),
        name: 'ProjectStudy',
        meta: {
          title: 'project study',
          roles: ['admin', 'editor']
        }
      },
      {
        path: 'study-text-report',
        component: () => import('@/views/case-table/list-study-text'),
        name: 'StudyText',
        meta: {
          title: 'study text report',
          roles: ['admin', 'editor']
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'text-report',
        component: () => import('@/views/case-table/text-report'),
        name: 'TextReport',
        meta: {
          title: 'text report',
          roles: ['admin', 'editor']
          // if do not set roles, means: this page does not require permission
        }
      }
    ]
  },
  // {
  //   path: '/fastapi',
  //   component: Layout,
  //   redirect: '/patient/page',
  //   alwaysShow: true, // will always show the root menu
  //   name: 'fastapi',
  //   meta: {
  //     title: 'fastapi',
  //     icon: 'table',
  //     roles: ['admin', 'editor'] // you can set roles in root nav
  //   },
  //   children: [
  //     {
  //       path: 'patient-page',
  //       component: () => import('@/views/fastapi/patient/index_bak'),
  //       name: 'PatientPage',
  //       meta: {
  //         title: 'Patient Page',
  //         roles: ['admin', 'editor'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path: 'study-page',
  //       component: () => import('@/views/fastapi/study/index_bak'),
  //       name: 'StudyPage',
  //       meta: {
  //         title: 'Study Page',
  //         roles: ['admin', 'editor'] // or you can only set roles in sub nav
  //       }
  //     }
  //   ]
  // },
  // tableRouter,

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
