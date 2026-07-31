# Jiahao Wang — Personal Homepage

这是一个由 Markdown 驱动的静态个人主页。个人介绍、新闻、论文、教育经历、
研究实习和奖项统一维护在 [`build_page/selfOS.md`](build_page/selfOS.md)；
[`index.html`](index.html) 由构建脚本生成，不应手工修改。

当前主页包括：

- 空间理解、世界模型和视频生成方向的个人介绍
- LingBot-World 2.0 与 SpatialVID 论文
- 南京大学硕博连读及西安交通大学教育经历
- Ant Research、NIO 和 OpenDriveLab 研究实习
- Email、GitHub 和 Google Scholar 图标链接
- White、Black、Auto 三种显示模式
- `terracotta`、`ink`、`sage`、`plum` 四套主题配色

## 快速开始

在本目录执行：

```bash
./build_page/build.sh
```

构建结果写入 `index.html`。脚本只依赖 Python 3，不需要安装 Node.js 或
第三方 Python 包。

本地预览可以使用任意静态文件服务器，例如：

```bash
python3 -m http.server 8000
```

然后访问 `http://localhost:8000/`。

## 修改主页内容

日常内容只修改 [`build_page/selfOS.md`](build_page/selfOS.md)。顶部
frontmatter 管理个人信息与主页配置：

```yaml
---
name: Jiahao Wang
eyebrow: Spatial intelligence researcher
description: Jiahao Wang — research in spatial understanding, world models, and video generation.
theme: plum
profile: assets/profile.jpg
profile_alt: Cartoon profile image of Pluto
profile_caption:
email: jiah.wang@smail.nju.edu.cn
email_label: jiah.wang
github: https://github.com/oiiiwjh
github_label: @oiiiwjh
scholar: https://scholar.google.com/scholar?q=author%3A%22Jiahao%20Wang%22%20SpatialVID
scholar_label: Jiahao Wang
footer: Jiahao Wang · Spatial understanding, world models & video generation
---
```

说明：

- 图片和本地文件路径相对于 `new_page/`，例如 `assets/profile.jpg`。
- `profile_caption:` 留空或删除时，头像下不显示说明文字。
- Email、GitHub、CV、Google Scholar 仅在对应字段有值时显示图标。
- 当前 Scholar 链接是限定 `Jiahao Wang + SpatialVID` 的检索链接；获得个人
  Scholar profile URL 后直接替换 `scholar:` 即可。
- 如需增加 CV，先将 PDF 放入 `assets/`，再填写：

```yaml
cv: assets/Jiahao-Wang-CV.pdf
cv_label: CV
```

构建器会检查本地文件是否存在，避免生成失效链接。

## 内容章节与格式

支持以下二级章节：

- `## About Me`
- `## News`
- `## Research`、`## Selected Research` 或 `## Projects`
- `## Education`
- `## Experience` 或 `## Research Experience`
- `## Awards & Honors`

`About Me` 必须保留；其他章节可省略。Markdown 中的章节顺序就是导航和页面
展示顺序。

### News

```markdown
- **2026.07** | [LingBot-World 2.0](https://arxiv.org/abs/2607.07534) is released.
```

### Publications

每篇论文使用一个 `###` 条目。`Venue` 会显示在作者列表之后，例如
`CVPR, 2026` 或 `Technical Report, 2026`；不要再使用旧的 `Label` 字段。

```markdown
### Paper Title

- **Venue:** CVPR, 2026
- **Image:** assets/project.png
- **Image alt:** Short description of the preview
- **Project:** https://example.com
- **Authors:** **Jiahao Wang**, Collaborator
- **Summary:** One-sentence summary.
- **Links:** [Project](https://example.com) · [arXiv](https://arxiv.org/) · [Code](https://github.com/)
```

### Education

```markdown
### University Name

- **Period:** 2024.09 — Present
- **Degree:** Degree or program
- **School:** School or department
- **Advisor:** Supervisor: [Name](https://example.com)
```

### Research Experience

```markdown
### Organization

- **Period:** 2025.12 — Present
- **Role:** Research Intern
- **Logo:** assets/organization.png
- **Summary:** Research topic.
- **Advisor:** Research advisor: [Name](https://example.com)
```

### Awards

```markdown
## Awards & Honors

### Contests

- **2026** | **Award Name**, Competition

### Scholarships

- **2025.06** | **First Prize**, Scholarship
```

## 主题与黑白切换

`selfOS.md` 中的 `theme` 控制强调色，可以选择：

- `terracotta`
- `ink`
- `sage`
- `plum`

配色说明见 [`build_page/COLOR_PALETTES.md`](build_page/COLOR_PALETTES.md)。

页面顶栏提供 White、Black、Auto 三种颜色模式：

- White：固定使用浅色模式
- Black：固定使用深色模式
- Auto：跟随系统设置，并在系统主题变化时实时更新

用户选择保存在浏览器的 `homepage-color-mode` 本地存储项中。

重新生成四套主题预览：

```bash
./build_page/preview-themes.sh
```

随后打开 [`theme-preview.html`](theme-preview.html) 对比主题。

## 文件结构

```text
new_page/
├── README.md                       # 项目总览与维护说明
├── index.html                      # 生成后的主页，不要手工修改
├── 404.html                        # GitHub Pages 404 页面
├── styles.css                      # 页面布局、主题及深色模式
├── script.js                       # 导航、滚动和三态颜色切换
├── typography.js                   # Pretext 多行文本排版
├── assets/
│   ├── profile.jpg                 # 头像
│   ├── favicon.png                 # 网站图标
│   ├── lingbot-world-v2.png        # LingBot-World 2.0 论文图
│   ├── spatialvid.png              # SpatialVID 论文图
│   ├── ant-research.png            # Ant Research 图标
│   ├── nio.png                     # NIO 图标
│   └── opendrivelab.png            # OpenDriveLab 图标
├── build_page/
│   ├── selfOS.md                   # 唯一日常内容源
│   ├── template.html               # HTML 页面骨架
│   ├── build.py                    # Markdown 解析、校验与 HTML 生成
│   ├── build.sh                    # 主页面构建入口
│   ├── preview-themes.sh           # 生成四套主题预览
│   ├── COLOR_PALETTES.md           # 配色说明
│   └── README.md                   # 内容 schema 详细说明
├── vendor/pretext/                 # 固定版本的 Pretext 浏览器模块
├── preview-terracotta.html          # 生成的主题预览
├── preview-ink.html
├── preview-sage.html
├── preview-plum.html
└── theme-preview.html              # 四套预览的入口页面
```

## 构建与校验规则

构建过程中会检查：

- 必需的 frontmatter、章节及条目字段
- Publication 的 `Venue`、图片、作者、摘要和链接
- Education 与 Experience 的必需字段
- 本地图片、Logo 和 CV 文件是否存在
- URL scheme 是否为安全的 `http`、`https` 或 `mailto`
- 主题名称是否属于支持列表
- 模板是否残留未解析占位符

构建成功后会输出章节、论文、教育、经历和奖项的数量。

## 发布到 GitHub Pages

发布目标仓库为 `oiiiwjh.github.io`。至少需要同步以下运行文件：

- `index.html`
- `404.html`
- `styles.css`
- `script.js`
- `typography.js`
- `assets/`
- `vendor/`

`build_page/`、`preview-*.html` 和 `theme-preview.html` 属于内容源与开发预览，
可以保留在源码工作区而不发布。同步后在 `oiiiwjh.github.io` 仓库中提交并推送。

## 第三方依赖

- [`@chenglou/pretext`](https://github.com/chenglou/pretext)：浏览器端多行文本排版
- [Font Awesome Free](https://fontawesome.com/)：Email、GitHub、Scholar 和主题图标
- Google Fonts：EB Garamond 与 Lato
