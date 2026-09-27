import json
import base64
from pyscript import window
import pyodide

def _build_character_cache(byte_array):
    return "".join(chr(b) for b in byte_array)

async def execute_query_pipeline(event):
    search_input = str(event.detail).lower()
    coords = []
    colors = ["#66fcf1"]
    strings = [
        "SiteMask Core Registry Stream -> portal://hub.01",
        "SiteMask Global Routing Node -> portal://edge.02"
    ]
    floats = [1.0, 2.0]
    assets = ["g_node", "e_node"]
    payload = {"coords": coords, "colors": colors, "strings": strings, "floats": floats, "assets": assets}
    serialized = json.dumps(payload)
    scrambled_b64 = base64.b64encode(serialized.encode('utf-8')).decode('utf-8')
    window.dispatchEvent(window.CustomEvent.new('pyIndexBroadcast', {'detail': scrambled_b64}))

async def execute_page_resolve(event):
    target_key = str(event.detail)
    html_template = "<h1>SiteMask Dashboard</h1><p>The interface components are now resolving from the secure repository stream.</p><p>Select any item or use the top action bar to map index lookups.</p>"
    raw_bytes = [ord(c) for c in html_template]
    decoded_text = "".join(chr(b) for b in raw_bytes)
    window.dispatchEvent(window.CustomEvent.new('pyPageBroadcast', {'detail': decoded_text}))

bridge_search = pyodide.ffi.create_proxy(execute_query_pipeline)
bridge_resolve = pyodide.ffi.create_proxy(execute_page_resolve)
window.addEventListener('triggerSearch', bridge_search)
window.addEventListener('triggerPageLoad', bridge_resolve)
