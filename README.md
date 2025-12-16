<img width="2258" height="1303" alt="7c58313dbda40d1a3691d23ccb01667e" src="https://github.com/user-attachments/assets/f95e32c4-1ced-4ec7-8bf2-a8a5a6019a64" /><img width="2255" height="1253" alt="3b8cd2ad3134df23058ef0bb75f5075b" src="https://github.com/user-attachments/assets/aaf5747c-78a7-48e5-8877-b7e6a0eb4e42" /><img width="2259" height="1260" alt="16e6b4793b97f286e195d78e0c5cddc1" src="https://github.com/user-attachments/assets/3538e182-3aab-47ba-bb1b-93f2e51cd7a2" /># scholar-sorter

Sort Google Scholar documents by citation count（cited by xxx）
# Google Scholar Sort by Citations - Edge Extension

这是一个用于Edge/Chrome 浏览器的插件，旨在为 Google Scholar（谷歌学术）搜索结果添加“按引用次数排序”的功能。

教程使用edge做演示，chrome同理。

---

##  1. 安装教程 (Installation)

由于本插件尚未发布到extensions商店，您需要通过“开发者模式”手动加载。

1.  **下载代码**：
    * 确保您已下载包含 `manifest.json`, `content.js` 等文件的文件夹。
2.  **打开扩展管理页面**：
    * 在 Edge 浏览器地址栏输入：`edge://extensions` 并回车。
    * （在 Chrome 浏览器地址栏输入：`chrome://extensions` 并回车。）
3.  **开启开发者模式**：
    * 在页面左侧菜单（或页面上方），找到 **"开发人员模式" (Developer mode)** 开关并将其打开。
    
4.  **加载插件**：
    * 点击出现的 **"加载解压缩的扩展" (Load unpacked)** 按钮。
    
    * 在弹出的文件选择窗口中，选择包含插件代码的**根文件夹**。
5.  **确认安装**：
    * 如果安装成功，您将在扩展列表中看到该插件，且图标会出现在浏览器工具栏上。

---

##  2. 使用方法 (Usage)

1.  **正常搜索**：
    * 打开 [Google Scholar](https://scholar.google.com/)。
    * 输入关键词进行搜索（例如："Deep Learning"）。
2.  **触发排序**：
    * **手动模式**：点击浏览器上方的蓝色插件图标，点击 "抓取20页并排序" 按钮。
    * 重要：请保持当前标签页开启，不要刷新页面。你可以切换到其他窗口工作。
    * 观察进度条：插件会模拟人类行为，每页之间会有随机延时。
    * 每抓取 5 页，会显示 "(长休息...)"，暂停约 10 秒。
    * 整个过程大约需要 2-3 分钟。
    * 抓取完成后，页面会自动刷新，所有结果将按照引用次数从高到低排列。

---

##  3. 风险提示 (Risk Warnings)

1.  **验证码风险**：

     * Google Scholar 拥有极其严格的反爬虫机制。尽管本插件在代码中加入了随机延时和长休息机制来模拟人类行为，但不能保证 100% 避免被检测。
     * 如果在短时间内连续高频使用（例如 10 分钟内连续抓取 3 次以上），极大概率会触发 Google 的 "I'm not a robot" 验证码，甚至导致 IP 地址被暂时封锁（通常几小时后自动解封）。
2.  **使用建议**：
     * 不要滥用。建议仅在进行深度文献综述（Literature Review）需要筛选大量文献时使用。
     * 如果遇到验证码，请立即停止使用插件，手动完成验证，并等待 15-30 分钟后再试。

---

##  4. 免责声明 (Disclaimer)

**请仔细阅读以下条款，下载、安装或使用本插件即视为您已同意以下内容：**

1.  **仅供学习与研究**：本工具仅供技术研究、学习浏览器扩展开发及个人学术辅助使用。**严禁用于任何商业用途**或大规模数据爬取。
2.  **无担保声明**：本软件按“原样”提供，不提供任何形式的明示或暗示的保证。作者不对因使用本软件而导致的任何数据丢失、浏览器崩溃或系统故障承担责任。
3.  **账号责任**：由于使用本插件触发 Google 反爬虫机制而导致的 IP 封禁、Google 账号访问受限或服务中断，**后果由用户自行承担**。作者无法控制 Google 的服务条款或反爬策略。
4.  **合规性**：用户应自行确保使用本插件的行为符合当地法律法规以及 Google 的 [服务条款](https://policies.google.com/terms)。如果 Google 正式要求停止使用此类脚本，请立即卸载本插件。

---
