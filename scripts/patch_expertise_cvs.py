"""Copy original métier CVs from Desktop/cv2 into public/expertise/documents/cv (no patching)."""
from __future__ import annotations

import shutil
from pathlib import Path

SRC = Path(r"C:\Users\User\Desktop\cv2")
OUT = Path(r"C:\Users\User\Desktop\NA-Portfolio\public\expertise\documents\cv")

FIELD_MAP = {
    "AI_Automation_Internal_Tools": "ai-automation",
    "Business_Analyst_Strategy": "business-strategy",
    "Data_Analyst_BI": "data-analytics",
    "Data_Scientist": "data-science",
    "Finance_Actuarial_Risk": "finance-risk",
    "Marketing_Analytics_Growth_CRM": "marketing-growth",
    "Operations_PMO_Coordination": "operations-pmo",
}


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for old in OUT.glob("*.pdf"):
        old.unlink()
    count = 0
    for stem, field_id in FIELD_MAP.items():
        for lang in ("EN", "FR"):
            src = SRC / f"CV_Nathan_Azoulay_{stem}_{lang}.pdf"
            if not src.exists():
                raise SystemExit(f"Missing source PDF: {src}")
            dest = OUT / f"{field_id}_{lang.lower()}.pdf"
            shutil.copy2(src, dest)
            count += 1
            print(f"OK {dest.name}")
    shutil.copy2(OUT / "data-analytics_en.pdf", OUT.parent / "Nathan-Azoulay-CV.pdf")
    print(f"Copied {count} original PDFs into {OUT}")


if __name__ == "__main__":
    main()
