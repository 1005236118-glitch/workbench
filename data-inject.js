// 数据注入：由 Trae 助手自动生成
// 自动识别对话中的工作内容，分类后注入工作台
window.__INJECT_VERSION__ = 6;
window.__INJECT_RECORDS__ = [
  {
    id: 1754391000001,
    title: "修复跨设备同步：从Gist API迁移到GitHub Contents API",
    content: "诊断发现Token无gist权限导致手机端和电脑端无法同步。将同步机制从GitHub Gist API迁移到GitHub Contents API，通过仓库中sync-data.json文件进行数据读写，Token只需repo权限即可。添加页面可见性变化时自动同步，支持Unicode Base64编解码",
    category: "biaozhun",
    date: "2026-08-05",
    time: "2026-08-05T12:00:00.000Z",
    data: "修复跨设备同步，支持非同一局域网",
    link: "https://1005236118-glitch.github.io/workbench/"
  },
  {
    id: 1754183100001,
    title: "实现工作台跨设备数据同步与离线同步功能",
    content: "基于GitHub Gist API实现电脑端和手机端数据实时合并同步，增强Service Worker支持Background Sync和Periodic Sync，离线自动队列恢复在线后自动同步，每2分钟自动同步，Token安全存储在浏览器本地",
    category: "biaozhun",
    date: "2026-08-05",
    time: "2026-08-05T02:30:00.000Z",
    data: "同步延迟<2min，支持多设备合并",
    link: "https://1005236118-glitch.github.io/workbench/"
  },
  {
    id: 1754183100002,
    title: "建立对话数据自动注入工作台机制",
    content: "创建data-inject.js注入通道，Trae助手在对话中自动识别工作内容并分类（APN工作/专病管理/标准化SOP/科研学术/比赛活动/公众号/其他），自动更新版本号避免重复导入，工作台启动时自动合并注入记录",
    category: "biaozhun",
    date: "2026-08-05",
    time: "2026-08-05T02:45:00.000Z",
    data: "支持8个分类自动识别",
    link: "https://1005236118-glitch.github.io/workbench/"
  },
  {
    id: 1754183100003,
    title: "添加PPT参考素材库功能",
    content: "在工作台侧边栏、右侧面板和移动端添加PPT参考素材库入口，支持File System Access API浏览桌面「参考PPT」文件夹，文件夹权限通过IndexedDB持久化下次自动加载，支持搜索过滤PPT/PDF/文档文件，点击可预览打开",
    category: "qita",
    date: "2026-08-05",
    time: "2026-08-05T03:00:00.000Z",
    data: "参考PPT文件夹约90个文件",
    link: "https://1005236118-glitch.github.io/workbench/"
  },
  {
    id: 1754392000001,
    title: "删除语音输入功能，清理所有相关代码",
    content: "彻底移除工作台中的语音输入功能，包括语音识别JS代码、语音模态框、麦克风图标、键盘快捷键等，删除parseVoiceText和extractData等辅助函数，清理未使用的parsedItems变量",
    category: "biaozhun",
    date: "2026-08-05",
    time: "2026-08-05T19:00:00.000Z",
    data: "删除约400行语音相关代码",
    link: "https://1005236118-glitch.github.io/workbench/"
  },
  {
    id: 1754392000002,
    title: "修复工作记录自动同步、待办事项持久化及手机端加载优化",
    content: "修复注入机制版本号问题导致新记录无法导入，改为逐条检查记录ID；优化GitHub Pages同步按钮触发注入；修复待办事项日期过滤逻辑，添加日期筛选；优化手机端加载速度，添加资源预连接、DNS预解析、加载骨架屏，SW改为缓存优先策略",
    category: "biaozhun",
    date: "2026-08-05",
    time: "2026-08-05T19:30:00.000Z",
    data: "修复三大核心问题",
    link: "https://1005236118-glitch.github.io/workbench/"
  },
  {
    id: 1754392000003,
    title: "实现待办事项与Trae助手任务同步到工作记录",
    content: "添加「同步到工作记录」按钮，一键将未完成待办转为工作记录，支持去重检查避免重复；将Trae助手任务列表自动注入工作记录，实现电脑端同步到工作记录后手机端自动同步的完整链路",
    category: "biaozhun",
    date: "2026-08-05",
    time: "2026-08-05T20:00:00.000Z",
    data: "同步逻辑：电脑端→工作记录→GitHub→手机端",
    link: "https://1005236118-glitch.github.io/workbench/"
  },
  {
    id: 1754392000004,
    title: "Trae任务：添加待办事项同步到工作记录按钮",
    content: "在待办事项区域添加金色「同步到工作记录」按钮，实现syncTodosToRecords函数，支持去重检查、批量转换未完成待办为工作记录",
    category: "biaozhun",
    date: "2026-08-05",
    time: "2026-08-05T20:00:00.000Z",
    fromTask: true
  },
  {
    id: 1754392000005,
    title: "Trae任务：将Trae助手任务列表注入工作记录",
    content: "更新data-inject.js注入文件，将本次对话中Trae助手的任务列表以工作记录形式注入，标记fromTask字段便于追溯",
    category: "biaozhun",
    date: "2026-08-05",
    time: "2026-08-05T20:00:00.000Z",
    fromTask: true
  },
  {
    id: 1754392000006,
    title: "Trae任务：提交并推送所有修改到GitHub",
    content: "完成index.html功能开发和data-inject.js数据注入后，提交代码并推送到GitHub仓库，确保手机端可通过同步获取最新数据",
    category: "biaozhun",
    date: "2026-08-05",
    time: "2026-08-05T20:00:00.000Z",
    fromTask: true
  }
];