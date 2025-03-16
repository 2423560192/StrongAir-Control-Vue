import request from '@/utils/request'

// 获取飞机列表
export function getAircraftList() {
  return request({
    url: '/unified-aircraft',
    method: 'get'
  })
}

// 获取单个飞机详情
export function getAircraft(id) {
  return request({
    url: `/unified-aircraft/${id}`,
    method: 'get'
  })
}

// 创建飞机
export function createAircraft(data) {
  return request({
    url: '/unified-aircraft',
    method: 'post',
    data
  })
}

// 更新飞机信息
export function updateAircraft(id, data) {
  return request({
    url: `/unified-aircraft/${id}`,
    method: 'put',
    data
  })
}

// 删除飞机
export function deleteAircraft(id) {
  return request({
    url: `/unified-aircraft/${id}`,
    method: 'delete'
  })
}

// 分配任务
export function assignMission(data) {
  return request({
    url: '/unified-aircraft/mission',
    method: 'post',
    data
  })
}

// 获取任务列表
export function getMissions(aircraftId) {
  return request({
    url: `/unified-aircraft/${aircraftId}/missions`,
    method: 'get'
  })
}

// 召回飞机
export function recallMission(missionId) {
  return request({
    url: `/unified-aircraft/mission/${missionId}/recall`,
    method: 'post'
  })
}

// 获取飞机任务状态
export function getAircraftStatus(id) {
  return request({
    url: `/unified-aircraft/${id}/status`,
    method: 'get'
  })
} 