import json
import base64
from pyscript import window
import pyodide

def _build_character_cache(byte_array):
    return "".join(chr(b) for b in byte_array)

async def execute_query_pipeline(event):
    search_input = str(event.detail).lower()
    coords = [10, 20, 30, 40]
    colors = ["#66fcf1"]
    strings = [
        "Google Core Matrix Index Node -> ei://google.com",
        "DuckDuckGo Proxy Stream Endpoint -> ei://duckduckgo.com"
    ]
    floats = [1.0, 2.0]
    assets = ["g_node", "e_node"]

    payload = {"coords": coords, "colors": colors, "strings": strings, "floats": floats, "assets": assets}
    serialized = json.dumps(payload)
    scrambled_b64 = base64.b64encode(serialized.encode('utf-8')).decode('utf-8')
    window.dispatchEvent(window.CustomEvent.new('pyIndexBroadcast', {'detail': scrambled_b64}))

async def execute_page_resolve(event):
    target_key = str(event.detail)
    
    html_template = "<h1>Network Stream Nodes</h1><p>This information is now being parsed dynamically straight into raw layout structures.</p><p>Return back to the index registry mapping at any time by selecting the <a href='#' onclick='window.dispatchEvent(new CustomEvent(\"triggerSearch\", {detail: \"\"})); return false;'>Index Page Link</a> structural node directly.</p>"
    
    raw_bytes = [ord(c) for c in html_template]
    decoded_text = "".join(chr(b) for b in raw_bytes)
    window.dispatchEvent(window.CustomEvent.new('pyPageBroadcast', {'detail': decoded_text}))

bridge_search = pyodide.ffi.create_proxy(execute_query_pipeline)
bridge_resolve = pyodide.ffi.create_proxy(execute_page_resolve)

window.addEventListener('triggerSearch', bridge_search)
window.addEventListener('triggerPageLoad', bridge_resolve)
