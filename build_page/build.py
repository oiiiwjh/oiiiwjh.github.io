#!/usr/bin/env python3
"""Build the static homepage from selfOS.md using only Python's standard library."""

from __future__ import annotations

import argparse
import html
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import Iterable
from urllib.parse import urlparse


SCRIPT_DIR = Path(__file__).resolve().parent
SITE_DIR = SCRIPT_DIR.parent
DEFAULT_CONTENT = SCRIPT_DIR / "selfOS.md"
DEFAULT_TEMPLATE = SCRIPT_DIR / "template.html"
DEFAULT_OUTPUT = SITE_DIR / "index.html"


class BuildError(RuntimeError):
    """Raised when the Markdown content does not match the documented schema."""


@dataclass
class Entry:
    title: str
    line: int
    fields: dict[str, str] = field(default_factory=dict)
    body: list[str] = field(default_factory=list)


@dataclass
class Section:
    title: str
    line: int
    lines: list[str] = field(default_factory=list)
    entries: list[Entry] = field(default_factory=list)


@dataclass
class Document:
    meta: dict[str, str]
    sections: list[Section]


def error(message: str, line: int | None = None) -> BuildError:
    prefix = f"line {line}: " if line is not None else ""
    return BuildError(prefix + message)


def remove_comments(text: str) -> str:
    return re.sub(r"<!--.*?-->", "", text, flags=re.DOTALL)


def parse_frontmatter(lines: list[str]) -> tuple[dict[str, str], int]:
    if not lines or lines[0].strip() != "---":
        raise error("selfOS.md must start with a '---' metadata block", 1)

    meta: dict[str, str] = {}
    for index in range(1, len(lines)):
        raw = lines[index]
        if raw.strip() == "---":
            return meta, index + 1
        if not raw.strip() or raw.lstrip().startswith("#"):
            continue
        if ":" not in raw:
            raise error("metadata must use 'key: value'", index + 1)
        key, value = raw.split(":", 1)
        normalized = key.strip().lower().replace(" ", "_")
        if not normalized:
            raise error("metadata key cannot be empty", index + 1)
        meta[normalized] = value.strip()

    raise error("metadata block is missing its closing '---'")


FIELD_RE = re.compile(r"^-\s+\*\*([^*]+?):\*\*\s*(.*)$")


def parse_document(text: str) -> Document:
    clean_text = remove_comments(text).replace("\r\n", "\n")
    lines = clean_text.splitlines()
    meta, start = parse_frontmatter(lines)
    sections: list[Section] = []
    current_section: Section | None = None
    current_entry: Entry | None = None

    for index in range(start, len(lines)):
        line_number = index + 1
        raw = lines[index].rstrip()

        if raw.startswith("## "):
            title = raw[3:].strip()
            if not title:
                raise error("section heading cannot be empty", line_number)
            current_section = Section(title=title, line=line_number)
            sections.append(current_section)
            current_entry = None
            continue

        if raw.startswith("### "):
            if current_section is None:
                raise error("'###' entry must appear inside a '##' section", line_number)
            title = raw[4:].strip()
            if not title:
                raise error("entry heading cannot be empty", line_number)
            current_entry = Entry(title=title, line=line_number)
            current_section.entries.append(current_entry)
            continue

        if raw.startswith("# "):
            raise error(
                "use the 'name:' metadata field instead of a top-level '# ' heading",
                line_number,
            )

        if current_section is None:
            if raw.strip():
                raise error("content must appear inside a '##' section", line_number)
            continue

        if current_entry is not None:
            field_match = FIELD_RE.match(raw.strip())
            if field_match:
                key = normalize_field(field_match.group(1))
                current_entry.fields[key] = field_match.group(2).strip()
            else:
                current_entry.body.append(raw)
        else:
            current_section.lines.append(raw)

    if not sections:
        raise error("at least one '##' section is required")

    return Document(meta=meta, sections=sections)


def normalize_field(value: str) -> str:
    return re.sub(r"\s+", "_", value.strip().lower())


def section_kind(title: str) -> str | None:
    normalized = re.sub(r"[^a-z]+", " ", title.lower()).strip()
    if normalized.startswith("about"):
        return "about"
    if normalized.startswith("news"):
        return "news"
    if "experience" in normalized:
        return "experience"
    if "research" in normalized or normalized.startswith("project"):
        return "research"
    if normalized.startswith("education"):
        return "education"
    if normalized.startswith("award") or "honor" in normalized:
        return "awards"
    return None


def require_meta(meta: dict[str, str], key: str) -> str:
    value = meta.get(key, "").strip()
    if not value:
        raise error(f"metadata field '{key}' is required")
    return value


def require_field(entry: Entry, key: str) -> str:
    value = entry.fields.get(key, "").strip()
    if not value:
        raise error(f"'{entry.title}' requires '- **{key.replace('_', ' ').title()}:** ...'", entry.line)
    return value


def safe_url(raw_url: str) -> str:
    url = raw_url.strip()
    parsed = urlparse(url)
    if parsed.scheme and parsed.scheme not in {"http", "https", "mailto"}:
        raise error(f"unsupported URL scheme in '{url}'")
    if url.lower().startswith(("javascript:", "data:")):
        raise error(f"unsafe URL '{url}'")
    return html.escape(url, quote=True)


def external_attrs(url: str) -> str:
    return ' target="_blank" rel="noopener noreferrer"' if url.startswith(("http://", "https://")) else ""


LINK_RE = re.compile(r"\[([^\]]+)\]\(([^)\s]+)\)")


def render_emphasis(text: str) -> str:
    marker = "\u0000ESCAPED_STAR\u0000"
    escaped = html.escape(text.replace(r"\*", marker), quote=False)
    escaped = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", escaped)
    escaped = re.sub(r"(?<!\w)_(.+?)_(?!\w)", r"<em>\1</em>", escaped)
    return escaped.replace(marker, "*")


def render_inline(text: str) -> str:
    output: list[str] = []
    cursor = 0
    for match in LINK_RE.finditer(text):
        output.append(render_emphasis(text[cursor : match.start()]))
        label = render_emphasis(match.group(1))
        url = match.group(2)
        output.append(
            f'<a href="{safe_url(url)}"{external_attrs(url)}>{label}</a>'
        )
        cursor = match.end()
    output.append(render_emphasis(text[cursor:]))
    return "".join(output)


def plain_text(text: str) -> str:
    without_links = LINK_RE.sub(r"\1", text)
    without_marks = re.sub(r"[*_`\\]", "", without_links)
    return html.unescape(without_marks).strip()


def paragraph_blocks(lines: Iterable[str]) -> list[str]:
    paragraphs: list[str] = []
    current: list[str] = []
    for raw in lines:
        if raw.strip():
            current.append(raw.strip())
        elif current:
            paragraphs.append(" ".join(current))
            current = []
    if current:
        paragraphs.append(" ".join(current))
    return paragraphs


def list_items(lines: Iterable[str]) -> list[tuple[str, int]]:
    items: list[tuple[str, int]] = []
    for offset, raw in enumerate(lines):
        stripped = raw.strip()
        if not stripped:
            continue
        if not stripped.startswith("- "):
            raise error("this section only accepts '- ...' list items")
        items.append((stripped[2:].strip(), offset))
    return items


def split_dated_item(raw: str) -> tuple[str, str]:
    if "|" not in raw:
        raise error("dated list items must use '- **DATE** | text'")
    date_raw, body = raw.split("|", 1)
    date = plain_text(date_raw)
    if not date or not body.strip():
        raise error("dated list items need both a date and text")
    return date, body.strip()


def datetime_value(display_date: str) -> str:
    match = re.search(r"\b(\d{4})(?:[.-](\d{1,2}))?", display_date)
    if not match:
        return ""
    return match.group(1) + (f"-{int(match.group(2)):02d}" if match.group(2) else "")


def asset_path(raw_path: str, label: str) -> str:
    path = raw_path.strip()
    parsed = urlparse(path)
    if parsed.scheme in {"http", "https"}:
        return safe_url(path)
    if parsed.scheme:
        raise error(f"{label} must be a relative path or an http(s) URL")
    if path.startswith("/"):
        raise error(f"{label} must be relative to new_page/ (remove the leading '/')")
    resolved = (SITE_DIR / path).resolve()
    try:
        resolved.relative_to(SITE_DIR.resolve())
    except ValueError as exc:
        raise error(f"{label} points outside new_page/: '{path}'") from exc
    if not resolved.is_file():
        raise error(f"{label} does not exist: '{path}'")
    return html.escape(path, quote=True)


def first_link_url(markdown: str) -> str:
    match = LINK_RE.search(markdown)
    return match.group(2) if match else ""


def render_profile_link(kind: str, label: str, url: str, icon_class: str) -> str:
    accessible_label = f"{kind}: {label}"
    return (
        f'            <a class="profile-link" href="{safe_url(url)}"{external_attrs(url)} '
        f'aria-label="{html.escape(accessible_label, quote=True)}" '
        f'title="{html.escape(kind, quote=True)}">\n'
        f'              <i class="{html.escape(icon_class, quote=True)}" aria-hidden="true"></i>\n'
        f'              <span class="sr-only">{html.escape(accessible_label)}</span>\n'
        "            </a>"
    )


def render_hero(meta: dict[str, str], about: Section | None) -> str:
    name = require_meta(meta, "name")
    eyebrow = require_meta(meta, "eyebrow")
    profile = asset_path(require_meta(meta, "profile"), "profile")
    profile_alt = meta.get("profile_alt", f"{name} profile image")
    caption = meta.get("profile_caption", "")
    paragraphs = paragraph_blocks(about.lines if about else [])
    if not paragraphs:
        raise error("the '## About Me' section needs at least one paragraph")

    links: list[str] = []
    email = meta.get("email", "").strip()
    if email:
        links.append(
            render_profile_link(
                "Email",
                meta.get("email_label", email),
                f"mailto:{email}",
                "fa-regular fa-envelope",
            )
        )
    cv = meta.get("cv", "").strip()
    if cv:
        if not urlparse(cv).scheme:
            asset_path(cv, "cv")
        links.append(
            render_profile_link(
                "CV",
                meta.get("cv_label", "CV"),
                cv,
                "fa-regular fa-file-lines",
            )
        )
    github = meta.get("github", "").strip()
    if github:
        links.append(
            render_profile_link(
                "GitHub",
                meta.get("github_label", "GitHub"),
                github,
                "fa-brands fa-github",
            )
        )
    scholar = meta.get("scholar", "").strip()
    if scholar:
        links.append(
            render_profile_link(
                "Google Scholar",
                meta.get("scholar_label", "Google Scholar"),
                scholar,
                "fa-brands fa-google-scholar",
            )
        )

    bio_html = "\n".join(
        f'          <p class="bio">{render_inline(paragraph)}</p>'
        for paragraph in paragraphs
    )
    links_html = ""
    if links:
        links_html = (
            '\n          <div class="profile-links" role="group" aria-label="Profile links">\n'
            + "\n".join(links)
            + "\n          </div>"
        )
    caption_html = (
        f"\n          <figcaption>{render_inline(caption)}</figcaption>"
        if caption
        else ""
    )

    return f"""      <section class="hero" aria-labelledby="page-title">
        <div class="hero-text">
          <p class="eyebrow">{html.escape(eyebrow)}</p>
          <h1 class="name" id="page-title">{html.escape(name)}</h1>
{bio_html}{links_html}
        </div>

        <figure class="hero-photo">
          <img src="{profile}" alt="{html.escape(profile_alt, quote=True)}">{caption_html}
        </figure>
      </section>"""


def section_heading(section: Section, index: int, element_id: str) -> str:
    return f"""        <div class="section-heading">
          <p class="section-index">{index:02d}</p>
          <h2 id="{element_id}-title">{html.escape(section.title)}</h2>
        </div>"""


def render_news(section: Section, index: int) -> str:
    rows: list[str] = []
    for raw, _ in list_items(section.lines):
        date, body = split_dated_item(raw)
        date_attr = datetime_value(date)
        attr = f' datetime="{date_attr}"' if date_attr else ""
        rows.append(
            "          <li>\n"
            f"            <time{attr}>{html.escape(date)}</time>\n"
            f"            <p>{render_inline(body)}</p>\n"
            "          </li>"
        )
    if not rows:
        raise error("'## News' needs at least one '- **DATE** | text' item", section.line)
    return f"""      <section class="section reveal" id="news" aria-labelledby="news-title">
{section_heading(section, index, "news")}
        <ul class="news-list">
{chr(10).join(rows)}
        </ul>
      </section>"""


def render_link_pills(markdown: str) -> str:
    links = list(LINK_RE.finditer(markdown))
    if not links:
        raise error("research 'Links' must contain at least one '[Label](URL)' link")
    return "\n".join(
        "              <li>"
        f'<a href="{safe_url(match.group(2))}"{external_attrs(match.group(2))}>'
        f"{render_emphasis(match.group(1))}</a></li>"
        for match in links
    )


def render_research(section: Section, index: int) -> str:
    cards: list[str] = []
    for entry in section.entries:
        venue = require_field(entry, "venue")
        image = asset_path(require_field(entry, "image"), f"image for '{entry.title}'")
        image_alt = entry.fields.get("image_alt", f"{entry.title} preview")
        authors = require_field(entry, "authors")
        summary = require_field(entry, "summary")
        links = require_field(entry, "links")
        project = entry.fields.get("project", "").strip() or first_link_url(links)
        if not project:
            raise error(f"'{entry.title}' needs a Project URL or at least one link", entry.line)

        cards.append(f"""        <article class="paper-card">
          <a
            class="paper-visual"
            href="{safe_url(project)}"
            {external_attrs(project).strip()}
            aria-label="Open the {html.escape(plain_text(entry.title), quote=True)} project page"
          >
            <img
              src="{image}"
              alt="{html.escape(image_alt, quote=True)}"
              loading="lazy"
            >
            <span class="visual-note">View project ↗</span>
          </a>

          <div class="paper-content">
            <h3>
              <a href="{safe_url(project)}"{external_attrs(project)}>{render_inline(entry.title)}</a>
            </h3>
            <p class="authors">{render_inline(authors)}</p>
            <p class="paper-venue">{render_inline(venue)}</p>
            <p class="paper-summary">{render_inline(summary)}</p>
            <ul class="paper-links">
{render_link_pills(links)}
            </ul>
          </div>
        </article>""")

    if not cards:
        raise error(f"'## {section.title}' needs at least one '###' research item", section.line)
    return f"""      <section class="section reveal" id="research" aria-labelledby="research-title">
{section_heading(section, index, "research")}
{chr(10).join(cards)}
      </section>"""


def render_education(section: Section, index: int) -> str:
    entries: list[str] = []
    for entry in section.entries:
        period = require_field(entry, "period")
        degree = require_field(entry, "degree")
        school = require_field(entry, "school")
        advisor = entry.fields.get("advisor", "")
        advisor_html = (
            f'\n              <p class="entry-advisor">{render_inline(advisor)}</p>'
            if advisor
            else ""
        )
        date_attr = datetime_value(period)
        attr = f' datetime="{date_attr}"' if date_attr else ""
        entries.append(f"""          <li class="timeline-item">
            <div class="timeline-dot" aria-hidden="true"></div>
            <div class="entry-main">
              <h3>{render_inline(entry.title)}</h3>
              <p class="entry-role">{render_inline(degree)}</p>
              <p class="entry-detail">{render_inline(school)}</p>{advisor_html}
            </div>
            <time class="entry-period"{attr}>{render_inline(period)}</time>
          </li>""")

    if not entries:
        raise error("'## Education' needs at least one '###' item", section.line)
    return f"""      <section class="section reveal" id="education" aria-labelledby="education-title">
{section_heading(section, index, "education")}
        <ol class="timeline">
{chr(10).join(entries)}
        </ol>
      </section>"""


def render_experience(section: Section, index: int) -> str:
    cards: list[str] = []
    for entry in section.entries:
        period = require_field(entry, "period")
        role = require_field(entry, "role")
        logo = asset_path(require_field(entry, "logo"), f"logo for '{entry.title}'")
        summary = require_field(entry, "summary")
        advisor = entry.fields.get("advisor", "")
        advisor_html = (
            f'\n              <p class="entry-advisor">{render_inline(advisor)}</p>'
            if advisor
            else ""
        )
        date_attr = datetime_value(period)
        attr = f' datetime="{date_attr}"' if date_attr else ""
        cards.append(f"""          <article class="experience-card">
            <div class="experience-mark">
              <img src="{logo}" alt="" loading="lazy">
            </div>
            <div class="experience-copy">
              <div class="experience-head">
                <div>
                  <h3>{render_inline(entry.title)}</h3>
                  <p class="entry-role">{render_inline(role)}</p>
                </div>
                <time class="entry-period"{attr}>{render_inline(period)}</time>
              </div>
              <p class="entry-detail">{render_inline(summary)}</p>{advisor_html}
            </div>
          </article>""")

    if not cards:
        raise error(f"'## {section.title}' needs at least one '###' experience item", section.line)
    return f"""      <section class="section reveal" id="experience" aria-labelledby="experience-title">
{section_heading(section, index, "experience")}
        <div class="experience-list">
{chr(10).join(cards)}
        </div>
      </section>"""


def render_award_rows(lines: Iterable[str]) -> tuple[str, int]:
    rows: list[str] = []
    for raw, _ in list_items(lines):
        date, body = split_dated_item(raw)
        date_attr = datetime_value(date)
        attr = f' datetime="{date_attr}"' if date_attr else ""
        rows.append(
            "          <li>\n"
            f"            <span>{render_inline(body)}</span>\n"
            f"            <time{attr}>{html.escape(date)}</time>\n"
            "          </li>"
        )
    return "\n".join(rows), len(rows)


def award_count(section: Section) -> int:
    if section.entries:
        return sum(len(list_items(entry.body)) for entry in section.entries)
    return len(list_items(section.lines))


def render_awards(section: Section, index: int) -> str:
    groups: list[str] = []

    if section.entries:
        if any(line.strip() for line in section.lines):
            raise error(
                "when Awards uses '###' groups, put every award inside a group",
                section.line,
            )
        for entry in section.entries:
            rows, count = render_award_rows(entry.body)
            if not count:
                raise error(f"award group '{entry.title}' needs at least one dated item", entry.line)
            groups.append(
                f'        <h3 class="award-group-title">{render_inline(entry.title)}</h3>\n'
                '        <ul class="award-list">\n'
                f"{rows}\n"
                "        </ul>"
            )
    else:
        rows, count = render_award_rows(section.lines)
        if count:
            groups.append(
                '        <ul class="award-list">\n'
                f"{rows}\n"
                "        </ul>"
            )

    if not groups:
        raise error("'## Awards & Honors' needs at least one '- **DATE** | text' item", section.line)
    return f"""      <section class="section reveal" id="awards" aria-labelledby="awards-title">
{section_heading(section, index, "awards")}
{chr(10).join(groups)}
      </section>"""


RENDERERS = {
    "news": render_news,
    "research": render_research,
    "education": render_education,
    "experience": render_experience,
    "awards": render_awards,
}


def build(document: Document, template: str) -> tuple[str, dict[str, int]]:
    known: dict[str, Section] = {}
    visible_sections: list[tuple[str, Section]] = []

    for section in document.sections:
        kind = section_kind(section.title)
        if kind is None:
            raise error(
                "unknown section. Supported sections are About Me, News, "
                "Research/Projects, Education, Experience, and Awards",
                section.line,
            )
        if kind in known:
            raise error(f"duplicate '{kind}' section", section.line)
        known[kind] = section
        if kind != "about":
            visible_sections.append((kind, section))

    about = known.get("about")
    if about is None:
        raise error("a '## About Me' section is required")

    hero = render_hero(document.meta, about)
    rendered_sections: list[str] = []
    nav_items: list[str] = []
    counts = {"sections": 0, "research": 0, "education": 0, "experience": 0, "awards": 0}

    nav_labels = {
        "news": "News",
        "research": "Research",
        "education": "Education",
        "experience": "Experience",
        "awards": "Awards",
    }

    for number, (kind, section) in enumerate(visible_sections, start=1):
        renderer = RENDERERS[kind]
        rendered_sections.append(renderer(section, number))
        nav_items.append(f'          <li><a href="#{kind}">{nav_labels[kind]}</a></li>')
        counts["sections"] += 1
        if kind in {"research", "education", "experience"}:
            counts[kind] = len(section.entries)
        elif kind == "awards":
            counts[kind] = award_count(section)

    name = require_meta(document.meta, "name")
    description = document.meta.get("description", f"{name} personal homepage")
    theme = document.meta.get("theme", "terracotta").strip().lower()
    supported_themes = {"terracotta", "ink", "sage", "plum"}
    if theme not in supported_themes:
        raise error(
            f"unsupported theme '{theme}'. Choose one of: "
            + ", ".join(sorted(supported_themes))
        )
    theme_colors = {
        "terracotta": "#faf8f3",
        "ink": "#f5f7f8",
        "sage": "#f5f7f2",
        "plum": "#faf6f7",
    }
    footer = document.meta.get("footer", name)
    email = document.meta.get("email", "").strip()
    footer_link = (
        f'        <a href="mailto:{html.escape(email, quote=True)}">Get in touch</a>'
        if email
        else ""
    )

    values = {
        "NAME": html.escape(name),
        "DESCRIPTION": html.escape(description, quote=True),
        "THEME": html.escape(theme, quote=True),
        "THEME_COLOR": theme_colors[theme],
        "NAV_ITEMS": "\n".join(nav_items),
        "HERO": hero,
        "SECTIONS": "\n".join(rendered_sections),
        "FOOTER": render_inline(footer),
        "FOOTER_LINK": footer_link,
    }

    output = template
    for key, value in values.items():
        output = output.replace("{{" + key + "}}", value)

    leftovers = re.findall(r"\{\{[A-Z_]+\}\}", output)
    if leftovers:
        raise error(f"template contains unresolved placeholders: {', '.join(leftovers)}")

    generated_notice = (
        "<!-- Generated from build_page/selfOS.md by build_page/build.py. "
        "Edit the Markdown source, not this file. -->\n"
    )
    return generated_notice + output.rstrip() + "\n", counts


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate new_page/index.html from build_page/selfOS.md."
    )
    parser.add_argument(
        "--content",
        type=Path,
        default=DEFAULT_CONTENT,
        help="Markdown content file (default: build_page/selfOS.md)",
    )
    parser.add_argument(
        "--template",
        type=Path,
        default=DEFAULT_TEMPLATE,
        help="HTML template file (default: build_page/template.html)",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=DEFAULT_OUTPUT,
        help="generated HTML path (default: new_page/index.html)",
    )
    parser.add_argument(
        "--theme",
        choices=("terracotta", "ink", "sage", "plum"),
        help="temporarily override the theme from selfOS.md",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    try:
        required_runtime_files = (
            SITE_DIR / "styles.css",
            SITE_DIR / "script.js",
            SITE_DIR / "typography.js",
            SITE_DIR / "vendor" / "pretext" / "rich-inline.js",
            SITE_DIR / "vendor" / "pretext" / "LICENSE",
        )
        missing_runtime_files = [
            path.relative_to(SITE_DIR).as_posix()
            for path in required_runtime_files
            if not path.is_file()
        ]
        if missing_runtime_files:
            raise error(
                "missing runtime file(s): " + ", ".join(missing_runtime_files)
            )
        content = args.content.resolve().read_text(encoding="utf-8")
        template = args.template.resolve().read_text(encoding="utf-8")
        document = parse_document(content)
        if args.theme:
            document.meta["theme"] = args.theme
        output, counts = build(document, template)
        args.output.resolve().write_text(output, encoding="utf-8")
    except (BuildError, OSError) as exc:
        print(f"Build failed: {exc}", file=sys.stderr)
        return 1

    print(f"Built {args.output.resolve()}")
    print(
        "Content: "
        f"{counts['sections']} sections, "
        f"{counts['research']} research item(s), "
        f"{counts['education']} education item(s), "
        f"{counts['experience']} experience item(s), "
        f"{counts['awards']} award(s)"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
