# Markdown-driven homepage

主页内容现在由 [`selfOS.md`](selfOS.md) 统一管理。`index.html` 是生成结果，
不要手工修改。

## 构建

在这个目录执行：

```bash
./build.sh
```

脚本不依赖 Vue、Node.js 或第三方 Python 包，只需要系统中的 Python 3。
默认生成到上一级目录的 `index.html`。

如需重新生成四套配色预览：

```bash
./preview-themes.sh
```

然后打开上一级目录的 `theme-preview.html`。

## 修改个人信息

编辑 `selfOS.md` 顶部的 `---` 区域：

```yaml
---
name: Jiahao Wang
eyebrow: Spatial intelligence researcher
profile: assets/profile.jpg
email: jiah.wang@smail.nju.edu.cn
github: https://github.com/oiiiwjh
theme: terracotta
---
```

图片路径相对于 `new_page/`。例如 `assets/profile.jpg` 实际对应
`new_page/assets/profile.jpg`。

头像说明是可选项。保留空值时只显示头像：

```yaml
profile_caption:
```

需要说明文字时再填写：

```yaml
profile_caption: Researching machines that understand and imagine dynamic worlds.
```

个人链接以图标显示；未填写的项目不会生成图标。Google Scholar 与 CV 可加入：

```yaml
cv: assets/Jiahao-Wang-CV.pdf
cv_label: CV
scholar: https://scholar.google.com/citations?user=YOUR_ID
scholar_label: Jiahao Wang
```

生成器会在 CV 文件不存在时停止构建，避免发布失效链接。

页面顶栏提供 White、Black、Auto 三种颜色模式。选择会保存在浏览器中；
Auto 会跟随系统深色或浅色设置，不需要在 Markdown 中配置。

`theme` 可以使用 `terracotta`、`ink`、`sage` 或 `plum`。完整色值和选择建议见
[`COLOR_PALETTES.md`](COLOR_PALETTES.md)。

## 增加内容

### 新闻或奖项

每行使用 `日期 | 内容`：

```markdown
- **2026.08** | One new paper has been accepted.
```

奖项也可以像旧主页一样使用三级标题分组：

```markdown
## Awards & Honors

### Contests

- **2026.08** | **First Prize**, Example Competition

### Scholarships

- **2026.06** | **First Prize**, Example Scholarship
```

### 研究成果

复制一个完整的三级标题块：

```markdown
### Project Title

- **Venue:** Conference, 2026
- **Image:** assets/project.png
- **Image alt:** Short description of the image
- **Project:** https://example.com
- **Authors:** **Jiahao Wang**, Collaborator
- **Summary:** One-sentence project summary.
- **Links:** [Project](https://example.com) · [Paper](https://arxiv.org/)
```

### 教育或经历

继续增加 `###` 条目，并保留字段名。生成器支持的章节为：

- `## About Me`
- `## News`
- `## Research`、`## Selected Research` 或 `## Projects`
- `## Education`
- `## Experience` 或 `## Research Experience`
- `## Awards & Honors`

章节可以省略，但 `About Me` 必须保留。章节在 Markdown 中的顺序就是网页导航
和页面展示顺序。

## 文件职责

- `selfOS.md`：唯一需要日常修改的内容文件
- `template.html`：网页 HTML 骨架
- `build.py`：Markdown 解析、内容检查和页面生成
- `build.sh`：一键构建入口
- `../typography.js`：使用 Pretext 进行正文分行和 DOM 排版
- `../vendor/pretext/`：固定版本的 Pretext 浏览器模块
