from PIL import Image
import sys

def color_to_alpha_white(img):
    img = img.convert("RGBA")
    datas = img.getdata()
    
    new_data = []
    # Find background color dynamically (top-left pixel)
    bg_color = datas[0]
    is_white_bg = (bg_color[0] > 240 and bg_color[1] > 240 and bg_color[2] > 240)
    
    if not is_white_bg:
        return img # No white background detected
        
    for r, g, b, a in datas:
        if a == 0:
            new_data.append((r, g, b, 0))
            continue
            
        # The farther from white, the more opaque it is
        a_new = 255 - min(r, g, b)
        
        if a_new < 5:
            new_data.append((255, 255, 255, 0))
        else:
            alpha_f = a_new / 255.0
            r_new = int((r - 255 * (1 - alpha_f)) / alpha_f)
            g_new = int((g - 255 * (1 - alpha_f)) / alpha_f)
            b_new = int((b - 255 * (1 - alpha_f)) / alpha_f)
            
            r_new = max(0, min(255, r_new))
            g_new = max(0, min(255, g_new))
            b_new = max(0, min(255, b_new))
            
            new_data.append((r_new, g_new, b_new, int(a_new * (a / 255.0))))
            
    img.putdata(new_data)
    return img

try:
    img1 = Image.open(r"d:\INMOBILIARIA\docs\Barrio.png")
    out1 = color_to_alpha_white(img1)
    out1.save(r"d:\INMOBILIARIA\turborepo\atlantida-platform\apps\portal\public\logo-barrio.png", "PNG")
    
    img2 = Image.open(r"d:\INMOBILIARIA\docs\Mibarrio.png")
    out2 = color_to_alpha_white(img2)
    out2.save(r"d:\INMOBILIARIA\turborepo\atlantida-platform\apps\inmobiliaria\public\logo-mibarrio.png", "PNG")
    
    img3 = Image.open(r"d:\INMOBILIARIA\docs\solo redondel.png")
    out3 = color_to_alpha_white(img3)
    out3.save(r"d:\INMOBILIARIA\turborepo\atlantida-platform\apps\inmobiliaria\public\icon-redondel.png", "PNG")
    out3.save(r"d:\INMOBILIARIA\turborepo\atlantida-platform\apps\portal\public\icon-redondel.png", "PNG")
    print("SUCCESS")
except Exception as e:
    print("ERROR:", e)
