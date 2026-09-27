from pyscript import window
import pyodide
import json
import base64

def _build_character_cache(byte_array):
    return "".join(chr(b) for b in byte_array)

async def execute_query_pipeline(event):
    search_input = str(event.detail).lower()
    coords = [[50, 120, 700, 25], [50, 215, 700, 25]]
    colors = ["#66fcf1"]
    strings = [
        "Google Core Matrix Index Node -> ei://google.com",
        "DuckDuckGo Proxy Stream Endpoint -> ei://duckduckgo.com"
    ]
    floats = [120.0, 215.0]
    assets = ["g_node", "e_node"]

    payload = {"coords": coords, "colors": colors, "strings": strings, "floats": floats, "assets": assets}
    serialized = json.dumps(payload)
    scrambled_b64 = base64.b64encode(serialized.encode('utf-8')).decode('utf-8')
    window.dispatchEvent(window.CustomEvent.new('pyIndexBroadcast', {'detail': scrambled_b64}))

async def execute_page_resolve(event):
    target_key = str(event.detail)
    raw_bytes = [77, 97, 116, 114, 105, 120, 32, 68, 97, 116, 97, 32, 76, 111, 97, 100, 101, 100]
    
    for x in range(50):
        raw_bytes.extend([10, 76, 105, 110, 101, 32, 45, 45, 45, 32, 49, 48, 50, 52])
        
    decoded_text = "".join(chr(b) for b in raw_bytes)
    lines_array = pyodide.ffi.to_js(decoded_text.split('\n'))
    window.dispatchEvent(window.CustomEvent.new('pyPageBroadcast', {'detail': lines_array}))

bridge_search = pyodide.ffi.create_proxy(execute_query_pipeline)
bridge_resolve = pyodide.ffi.create_proxy(execute_page_resolve)
window.addEventListener('triggerSearch', bridge_search)
window.addEventListener('triggerPageLoad', bridge_resolve)
