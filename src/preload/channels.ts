/**
 * 有效的 IPC 通道列表
 * 遵循單一職責原則，此模塊僅負責定義有效的通道名稱
 */

// 基本通信通道
export const baseChannels = [
  'app:hello',
  'app:message'
];

// 窗口控制通道
export const windowChannels = [
  'window:minimize',
  'window:maximize',
  'window:close'
];

// 環境變數通道
export const environmentChannels = [
  'env:get'
];

// 更新相關通道
export const updateChannels = [
  'app:update-available',
  'app:update-downloaded',
  'app:update-error',
  'app:check-updates',
  'app:download-update'
];

// 用戶偏好設置通道
export const preferencesChannels = [
  'preferences:get',
  'preferences:set',
  'preferences:reset'
];

// 選單通道
export const menuChannels = [
  'menu:open-settings',
  'menu:check-updates'
];

// 所有有效通道的集合
export const validChannels = [
  ...baseChannels,
  ...windowChannels,
  ...environmentChannels,
  ...updateChannels,
  ...preferencesChannels,
  ...menuChannels
]; 