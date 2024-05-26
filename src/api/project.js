import request from '@/utils/myrequest'

export function addProject(data) {
  return request({
    url: '/project',
    method: 'post',
    data
  })
}
export function getProject() {
  return request({
    url: '/project',
    method: 'get',
  })
}
