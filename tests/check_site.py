"""Checks every page of the site in a real browser.

For each page, in both Now and Y2K modes, on a phone, tablet and desktop width:
  - layout: nothing runs off the screen and tap targets are big enough (tests/layout.js)
  - accessibility: colour contrast, image descriptions, form labels, headings, ids, language (tests/accessibility.js)
  - no script errors
  - every link, image and video on the site that points to a file in this repo actually exists

Run it from the repo root:  python tests/check_site.py
Needs: pip install playwright && playwright install chromium
"""
import functools, http.server, os, pathlib, socketserver, sys, threading, urllib.parse
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = sorted(p.relative_to(ROOT).as_posix() for p in ROOT.rglob("*.html") if not any(x in p.parts for x in (".git", "node_modules")))
WIDTHS = (320, 768, 1280)
LAYOUT = (ROOT / "tests/layout.js").read_text()
A11Y = (ROOT / "tests/accessibility.js").read_text()


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


def serve():
    handler = functools.partial(QuietHandler, directory=str(ROOT))
    server = socketserver.TCPServer(("127.0.0.1", 0), handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    return server, f"http://127.0.0.1:{server.server_address[1]}"


def main():
    server, base = serve()
    problems, local_refs = [], set()
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=os.environ.get("CHROME_PATH") or None)
        for page_path in PAGES:
            for era in ("now", "y2k"):
                for width in WIDTHS:
                    page = browser.new_page(viewport={"width": width, "height": 900})
                    errors = []
                    page.on("pageerror", lambda e: errors.append(f"script error: {e}"))
                    page.add_init_script(f"try {{ localStorage.setItem('era', '{era}') }} catch (e) {{}}")
                    page.goto(f"{base}/{page_path}")
                    page.wait_for_timeout(250)
                    found = page.evaluate(LAYOUT) + page.evaluate(A11Y) + errors
                    problems += [f"{page_path} [{era}, {width}px] {f}" for f in found]
                    if era == "now" and width == WIDTHS[-1]:
                        refs = page.evaluate("""[...document.querySelectorAll('a[href], img[src], video[src], source[src], link[href], script[src], [data-poster], img[srcset]')]
                          .flatMap(e => [e.getAttribute('href'), e.getAttribute('src'), e.dataset.poster, ...(e.getAttribute('srcset') || '').split(',').map(s => s.trim().split(' ')[0]), e.getAttribute('poster')])
                          .filter(Boolean)""")
                        for ref in refs:
                            url = urllib.parse.urljoin(f"{base}/{page_path}", ref)
                            if url.startswith(base):
                                local_refs.add((page_path, url.split("#")[0].split("?")[0]))
                    page.close()
        browser.close()
    for page_path, url in sorted(local_refs):
        target = ROOT / urllib.parse.unquote(url[len(base) + 1:])
        if target.is_dir():
            target = target / "index.html"
        if not target.exists():
            problems.append(f"{page_path} links to a missing file: {url[len(base):]}")
    server.shutdown()

    print(f"Checked {len(PAGES)} pages in 2 modes at {len(WIDTHS)} widths, and {len(local_refs)} links and files.")
    if problems:
        print(f"\n{len(problems)} problem(s):")
        print("\n".join(f"  - {x}" for x in problems))
        sys.exit(1)
    print("No problems found.")


if __name__ == "__main__":
    main()
