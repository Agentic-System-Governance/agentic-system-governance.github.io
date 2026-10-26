#!/usr/bin/env python3
"""Copy the maintained Wiki sources and build the browser content payload.

Run from any directory:
    python3 -m pip install Markdown==3.7
    python3 scripts/sync-content.py

The default input is ../../wiki, beside this repository. Pass --source-dir
to use another source checkout. Markdown is needed only when rebuilding;
the published website has no package or network dependency.
"""

from __future__ import annotations

import argparse
import json
import math
from pathlib import Path
import re
import shutil
import sys
from urllib.parse import unquote, urlparse
import xml.etree.ElementTree as ET

try:
    import markdown
    from markdown.extensions import Extension
    from markdown.treeprocessors import Treeprocessor
except ImportError:
    sys.exit("Install the build dependency first: python3 -m pip install Markdown==3.7")


REPO = Path(__file__).resolve().parents[1]

ARTICLES = [
    {
        "id": "foundations",
        "updatedAt": "2026.10.26",
        "file": "foundations.md",
        "title": "治理对象与职责边界",
        "eyebrow": "从这里开始",
        "description": "明确治理对象、五项职责的分工与交叉，以及 auto 和有人类介入时的决定方式。",
        "group": "start",
    },
    {
        "id": "mandate",
        "updatedAt": "2026.10.26",
        "file": "goals/01-mandate.md",
        "title": "任务约定对齐",
        "englishTitle": "Mandate Alignment",
        "eyebrow": "治理职责 01",
        "description": "通过交互协商、承诺落实与持续维护，将用户意图形成有授权依据的交付条件与执行边界。",
        "group": "duties",
    },
    {
        "id": "oversight",
        "updatedAt": "2026.10.26",
        "file": "goals/02-oversight.md",
        "title": "执行监督",
        "englishTitle": "Execution Oversight",
        "eyebrow": "治理职责 02",
        "description": "监测执行风险，实施放行、限制或暂停等监督干预，并核验行动、干预与修复后的实际结果。",
        "group": "duties",
    },
    {
        "id": "troubleshooting",
        "updatedAt": "2026.10.26",
        "file": "goals/03-troubleshooting.md",
        "title": "故障处置",
        "englishTitle": "Fault Resolution",
        "eyebrow": "治理职责 03",
        "description": "依据证据分析失败原因，修正执行方法与运行条件，并修复已经受影响的产物、记忆或外部状态。",
        "group": "duties",
    },
    {
        "id": "coordination",
        "updatedAt": "2026.10.26",
        "file": "goals/04-coordination.md",
        "title": "多智能体协调",
        "englishTitle": "Multi-Agent Coordination",
        "eyebrow": "治理职责 04",
        "description": "分配子任务及跟进责任，管理执行依赖，维护各参与者所用依据、状态与共同产物的一致性。",
        "group": "duties",
    },
    {
        "id": "accountability",
        "updatedAt": "2026.10.26",
        "file": "goals/05-accountability.md",
        "title": "可审计性保障",
        "englishTitle": "Auditability Assurance",
        "eyebrow": "治理职责 05",
        "description": "用关联证据重建执行过程、追溯授权与职责归属，并依据适用规则评估已发生的行为。",
        "group": "duties",
    },
    {
        "id": "challenges",
        "file": "challenges.md",
        "title": "跨职责的共同难点",
        "eyebrow": "进一步理解",
        "description": "观察、时序、权限与状态变化，如何影响多项治理职责的持续配合。",
        "group": "practice",
    },
    {
        "id": "evaluation",
        "updatedAt": "2026.10.26",
        "file": "evaluation.md",
        "title": "治理目标的评估",
        "eyebrow": "应用与检查",
        "description": "同时检查不当效果、合法任务完成、恢复、人工负担与运行成本。",
        "group": "practice",
    },
    {
        "id": "survey-map",
        "updatedAt": "2026.10.26",
        "file": "survey-map.md",
        "title": "与综述框架的对应",
        "eyebrow": "回到研究",
        "description": "将五项职责及十五项要点对应到综述当前章节，说明职责之间的联系及其实现机制。",
        "group": "reference",
    },
    {
        "id": "worksheet",
        "file": "worksheet.md",
        "title": "治理分析工作表",
        "eyebrow": "动手分析",
        "description": "选定一个真实任务，写清要求、决定权、控制位置、证据和遗留责任。",
        "group": "practice",
    },
    {
        "id": "glossary",
        "updatedAt": "2026.10.26",
        "file": "glossary.md",
        "title": "术语表",
        "eyebrow": "随时查阅",
        "description": "用一致的含义讨论授权、恢复、外部效果、结果未知与治理决定权限。",
        "group": "reference",
    },
]


class ArticleTreeprocessor(Treeprocessor):
    """Keep content intact while giving browser links and headings stable targets."""

    def __init__(self, md, article, source_path, routes):
        super().__init__(md)
        self.article = article
        self.source_path = source_path
        self.routes = routes
        self.sections = []

    def run(self, root):
        heading_count = 0
        detail_count = 0
        for element in root.iter():
            if element.tag == "h2":
                heading_count += 1
                anchor = f"{self.article['id']}-s{heading_count}"
                element.set("id", anchor)
                self.sections.append(
                    {"id": anchor, "title": "".join(element.itertext())}
                )
            elif element.tag == "h3":
                # Subheadings need stable identifiers too, but are not added
                # to the primary article outline.
                detail_count += 1
                anchor = f"{self.article['id']}-detail-{detail_count}"
                element.set("id", anchor)
                element.set("data-subheading", "true")
            elif element.tag == "a":
                self.rewrite_link(element)
        return root

    def rewrite_link(self, element):
        target = element.get("href", "")
        parsed = urlparse(target)
        if parsed.scheme or target.startswith("//"):
            if parsed.scheme in ("http", "https"):
                element.set("rel", "noopener noreferrer")
                element.set("target", "_blank")
            return

        path = unquote(parsed.path)
        if not path:
            element.set("href", f"#/article/{self.article['id']}")
            return

        resolved = (self.source_path.parent / path).resolve()
        route = self.routes.get(resolved)
        if route:
            element.set("href", f"#/article/{route}")
            return

        # The maintained README is represented by the website landing page.
        if resolved.name == "README.md":
            element.set("href", "#/")
            return

        # Survey .tex, .bib, editorial templates and the roadmap remain
        # local research references, not links to nonexistent website files.
        label = "".join(element.itertext())
        for child in list(element):
            element.remove(child)
        element.tag = "span"
        element.attrib.clear()
        element.set("class", "source-reference")
        element.set("title", ("Local draft source: " if self.article["locale"] == "en" else "本地草稿来源：") + path)
        element.text = label + " "
        code = ET.SubElement(element, "code")
        code.text = Path(path).name


class ArticleExtension(Extension):
    def __init__(self, article, source_path, routes):
        self.article = article
        self.source_path = source_path
        self.routes = routes
        self.processor = None
        super().__init__()

    def extendMarkdown(self, md):
        self.processor = ArticleTreeprocessor(
            md, self.article, self.source_path, self.routes
        )
        # Run after inline Markdown has become real link elements.
        md.treeprocessors.register(self.processor, "wiki_article", 5)


def build(source_dir):
    source_dir = source_dir.resolve()
    english_metadata = json.loads((source_dir / "en" / "metadata.json").read_text(encoding="utf-8"))
    expected_ids = {entry["id"] for entry in ARTICLES}
    if set(english_metadata) != expected_ids:
        raise ValueError("English metadata must cover exactly the same article IDs as Chinese.")
    for ident, metadata in english_metadata.items():
        if not all(isinstance(metadata.get(key), str) and metadata[key].strip()
                   for key in ("title", "eyebrow", "description")):
            raise ValueError(f"Incomplete English metadata: {ident}")

    locales = {}
    # Validate both source sets before writing any generated files.
    missing = [str(source_dir / prefix / entry["file"])
               for prefix in ("", "en") for entry in ARTICLES
               if not (source_dir / prefix / entry["file"]).is_file()]
    if missing:
        raise FileNotFoundError("Missing Wiki source files:\n" + "\n".join(missing))

    for locale in ("en", "zh"):
        locale_dir = source_dir / "en" if locale == "en" else source_dir
        content_dir = REPO / "content" / "en" if locale == "en" else REPO / "content"
        routes = {(locale_dir / entry["file"]).resolve(): entry["id"] for entry in ARTICLES}
        result = []
        for base_entry in ARTICLES:
            entry = dict(base_entry)
            entry["locale"] = locale
            if locale == "en":
                entry.update({key: english_metadata[entry["id"]][key]
                              for key in ("title", "eyebrow", "description")})
            source_path = locale_dir / entry["file"]
            raw = source_path.read_text(encoding="utf-8")
            if raw.splitlines()[0] != "# " + entry["title"]:
                raise ValueError(f"Article heading differs from metadata: {locale}/{entry['id']}")
            copied_path = content_dir / entry["file"]
            copied_path.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(source_path, copied_path)
            extension = ArticleExtension(entry, source_path, routes)
            renderer = markdown.Markdown(
                extensions=["tables", "fenced_code", "sane_lists", extension],
                output_format="html",
            )
            rendered = renderer.convert(raw)
            if entry["id"] == "survey-map":
                if locale == "en":
                    note = (
                        "<strong>Source status: local survey draft</strong>"
                        "<p>This page reflects the local manuscript and the Wiki's editorial structure. "
                        "Method names and citation pointers are not an independently verified list of guarantees. "
                        "Check the original papers, assumptions, and scope of results before citing them.</p>"
                    )
                else:
                    note = (
                        "<strong>来源状态：本地综述草稿</strong>"
                        "<p>本页反映本地稿件的内容覆盖和 Wiki 编辑设计。"
                        "方法名称与引用入口尚不构成经独立核验的保证清单；"
                        "对外引用前仍需检查原始论文、成立条件与结果范围。</p>"
                    )
                rendered = '<aside class="source-note" role="note">' + note + "</aside>\n" + rendered
            hanzi = len(re.findall(r"[\u3400-\u9fff]", raw))
            words = len(re.findall(r"\b[a-zA-Z][a-zA-Z-]*\b", raw))
            article = {key: value for key, value in entry.items() if key != "file"}
            article.update(
                minutes=max(2, math.ceil(hanzi / 350 + words / 220)),
                source=copied_path.relative_to(REPO).as_posix(),
                html=rendered,
                sections=extension.processor.sections,
            )
            result.append(article)
        locales[locale] = {"articles": result}

    for english, chinese in zip(locales["en"]["articles"], locales["zh"]["articles"]):
        if [s["id"] for s in english["sections"]] != [s["id"] for s in chinese["sections"]]:
            raise ValueError(f"Section anchors differ between languages: {english['id']}")

    payload = {"defaultLocale": "en", "locales": locales}
    output = REPO / "assets" / "content.js"
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(
        "// Generated by scripts/sync-content.py from wiki/ and wiki/en/.\n"
        "// Full sources are copied under content/ and content/en/.\n"
        "window.WIKI_DATA = " + json.dumps(payload, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8",
    )
    print(f"Built {len(ARTICLES)} articles in each of 2 languages in {output.relative_to(REPO)}.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--source-dir", type=Path, default=REPO.parent / "wiki"
    )
    args = parser.parse_args()
    build(args.source_dir)
