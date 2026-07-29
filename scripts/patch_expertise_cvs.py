"""Patch cv2 PDFs: fix header links, add Expertise link, copy into public/expertise/documents/cv/."""
from __future__ import annotations

import io
import shutil
from pathlib import Path

from pypdf import PdfReader, PdfWriter
from pypdf.generic import (
    ArrayObject,
    DictionaryObject,
    FloatObject,
    NameObject,
    NumberObject,
    TextStringObject,
)
from reportlab.lib.colors import HexColor
from reportlab.pdfgen import canvas

SRC = Path(r"C:\Users\User\Desktop\cv2")
OUT = Path(r"C:\Users\User\Desktop\NA-Portfolio\public\expertise\documents\cv")

LINKEDIN = "https://linkedin.com/in/nathanazoulay"
GITHUB = "https://github.com/nathanazoulay"
PORTFOLIO = "https://na-studio.pages.dev"

FIELD_MAP = {
    "AI_Automation_Internal_Tools": "ai-automation",
    "Business_Analyst_Strategy": "business-strategy",
    "Data_Analyst_BI": "data-analytics",
    "Data_Scientist": "data-science",
    "Finance_Actuarial_Risk": "finance-risk",
    "Marketing_Analytics_Growth_CRM": "marketing-growth",
    "Operations_PMO_Coordination": "operations-pmo",
    "Hybrid_Data_Automation_Product": "hybrid",
    "Product_Product_Ops": "product",
    "Teaching_Tutoring": "teaching",
}

URI_REPLACEMENTS = {
    "https://www.linkedin.com/in/nathan-azoulay-0719b4207": LINKEDIN,
    "https://linkedin.com/in/nathan-azoulay-0719b4207": LINKEDIN,
    "https://github.com/AzoulayNathan": GITHUB,
}


def expertise_url(field_id: str) -> str:
    if field_id in {"hybrid", "product", "teaching"}:
        return f"{PORTFOLIO}/expertise"
    return f"{PORTFOLIO}/expertise/{field_id}"


def rewrite_uris(page) -> None:
    annots = page.get("/Annots")
    if not annots:
        return
    for annot_ref in annots:
        annot = annot_ref.get_object()
        action = annot.get("/A")
        if not action:
            continue
        uri = action.get("/URI")
        if uri is None:
            continue
        uri_s = str(uri)
        if uri_s in URI_REPLACEMENTS:
            action[NameObject("/URI")] = TextStringObject(URI_REPLACEMENTS[uri_s])


def add_expertise_overlay(page, field_id: str, lang: str) -> None:
    """Draw EXPERTISE label + link under the PORTFOLIO link row."""
    box = page.mediabox
    width = float(box.width)
    height = float(box.height)

    label = "PROFIL MÉTIER" if lang == "fr" else "EXPERTISE"
    value = f"na-studio.pages.dev/expertise/{field_id}" if field_id not in {"hybrid", "product", "teaching"} else "na-studio.pages.dev/expertise"
    url = expertise_url(field_id)

    packet = io.BytesIO()
    c = canvas.Canvas(packet, pagesize=(width, height))
    c.setFillColor(HexColor("#1f3d33"))
    c.setFont("Helvetica-Bold", 7.2)
    # Place under the existing LinkedIn/GitHub/Portfolio row (~718 y)
    y = 706.5
    x_label = 83.4
    c.drawString(x_label, y, label)
    label_w = c.stringWidth(label, "Helvetica-Bold", 7.2)
    c.setFont("Helvetica", 7.2)
    c.setFillColor(HexColor("#2a5a4a"))
    x_value = x_label + label_w + 6
    c.drawString(x_value, y, value)
    value_w = c.stringWidth(value, "Helvetica", 7.2)
    c.save()
    packet.seek(0)

    overlay = PdfReader(packet)
    page.merge_page(overlay.pages[0])

    # Clickable rect around the value text
    link = DictionaryObject()
    link[NameObject("/Type")] = NameObject("/Annot")
    link[NameObject("/Subtype")] = NameObject("/Link")
    link[NameObject("/Rect")] = ArrayObject(
        [
            FloatObject(x_value - 1),
            FloatObject(y - 2),
            FloatObject(x_value + value_w + 1),
            FloatObject(y + 9),
        ]
    )
    link[NameObject("/Border")] = ArrayObject([NumberObject(0), NumberObject(0), NumberObject(0)])
    action = DictionaryObject()
    action[NameObject("/S")] = NameObject("/URI")
    action[NameObject("/URI")] = TextStringObject(url)
    link[NameObject("/A")] = action

    if "/Annots" in page:
        page["/Annots"].append(link)
    else:
        page[NameObject("/Annots")] = ArrayObject([link])


def process_one(src: Path, field_id: str, lang: str, dest: Path) -> None:
    reader = PdfReader(str(src))
    writer = PdfWriter()
    for i, page in enumerate(reader.pages):
        rewrite_uris(page)
        if i == 0:
            add_expertise_overlay(page, field_id, lang)
        writer.add_page(page)
    dest.parent.mkdir(parents=True, exist_ok=True)
    with dest.open("wb") as f:
        writer.write(f)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    count = 0
    for stem, field_id in FIELD_MAP.items():
        for lang in ("EN", "FR"):
            src = SRC / f"CV_Nathan_Azoulay_{stem}_{lang}.pdf"
            if not src.exists():
                raise SystemExit(f"Missing source PDF: {src}")
            dest = OUT / f"{field_id}_{lang.lower()}.pdf"
            process_one(src, field_id, lang.lower(), dest)
            count += 1
            print(f"OK {dest.name}")
    # Keep a generic fallback pointing to data-analytics EN for old config.cvUrl
    shutil.copy2(OUT / "data-analytics_en.pdf", OUT.parent / "Nathan-Azoulay-CV.pdf")
    print(f"Patched {count} PDFs into {OUT}")


if __name__ == "__main__":
    main()
