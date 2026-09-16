import os
import math
from PIL import Image, ImageDraw, ImageFont

os.makedirs("assets/presentation_assets", exist_ok=True)

def create_mits_logo():
    size = (600, 600)
    img = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Outer glow
    draw.ellipse([20, 20, 580, 580], fill=(30, 58, 138, 255), outline=(56, 189, 248, 255), width=8)
    draw.ellipse([45, 45, 555, 555], fill=(15, 23, 42, 255), outline=(245, 158, 11, 255), width=6)

    # Inner circular decorative ring
    draw.ellipse([80, 80, 520, 520], outline=(56, 189, 248, 180), width=3)

    # Center Shield
    shield_pts = [
        (300, 160),
        (430, 210),
        (430, 350),
        (300, 450),
        (170, 350),
        (170, 210)
    ]
    draw.polygon(shield_pts, fill=(30, 64, 175, 255), outline=(245, 158, 11, 255))

    # Center Letters "MITS"
    draw.rectangle([210, 260, 390, 340], fill=(15, 23, 42, 230), outline=(56, 189, 248, 255), width=3)

    # Text rendering (simple fallback fonts)
    try:
        font_lg = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 46)
        font_sm = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 22)
        font_xs = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 18)
    except:
        font_lg = font_sm = font_xs = ImageFont.load_default()

    draw.text((300, 300), "MITS", fill=(255, 255, 255, 255), font=font_lg, anchor="mm")
    draw.text((300, 125), "MADHAV INSTITUTE OF TECHNOLOGY & SCIENCE", fill=(245, 158, 11, 255), font=font_sm, anchor="mm")
    draw.text((300, 485), "GWALIOR (M.P.) • ESTD. 1957", fill=(56, 189, 248, 255), font=font_xs, anchor="mm")
    draw.text((300, 390), "DEEMED TO BE UNIVERSITY", fill=(203, 213, 225, 255), font=font_xs, anchor="mm")

    img.save("assets/presentation_assets/mits_crest_logo.png")
    print("Created mits_crest_logo.png")

def create_step_badge(num, color_rgb, filename):
    size = (160, 160)
    img = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    draw.ellipse([8, 8, 152, 152], fill=(15, 23, 42, 255), outline=color_rgb, width=6)
    draw.ellipse([22, 22, 138, 138], fill=color_rgb)

    try:
        font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 72)
    except:
        font = ImageFont.load_default()

    draw.text((80, 80), str(num), fill=(255, 255, 255, 255), font=font, anchor="mm")
    img.save(f"assets/presentation_assets/{filename}")
    print(f"Created {filename}")

def create_arrow():
    size = (200, 80)
    img = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Line & Arrowhead
    draw.rectangle([20, 32, 140, 48], fill=(56, 189, 248, 255))
    head_pts = [(130, 15), (185, 40), (130, 65)]
    draw.polygon(head_pts, fill=(56, 189, 248, 255))

    img.save("assets/presentation_assets/flow_arrow.png")
    print("Created flow_arrow.png")

def create_shield_verified():
    size = (180, 180)
    img = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    shield_pts = [
        (90, 15),
        (160, 45),
        (160, 110),
        (90, 165),
        (20, 110),
        (20, 45)
    ]
    draw.polygon(shield_pts, fill=(16, 185, 129, 255), outline=(255, 255, 255, 255))
    # Checkmark
    check_pts = [(55, 95), (80, 125), (130, 65)]
    draw.line(check_pts, fill=(255, 255, 255, 255), width=12)

    img.save("assets/presentation_assets/shield_verified.png")
    print("Created shield_verified.png")

if __name__ == "__main__":
    create_mits_logo()
    create_arrow()
    create_shield_verified()
    create_step_badge(1, (56, 189, 248, 255), "badge_step1.png")
    create_step_badge(2, (245, 158, 11, 255), "badge_step2.png")
    create_step_badge(3, (16, 185, 129, 255), "badge_step3.png")
    create_step_badge(4, (168, 85, 247, 255), "badge_step4.png")
    create_step_badge(5, (244, 63, 94, 255), "badge_step5.png")
    create_step_badge(6, (59, 130, 246, 255), "badge_step6.png")
