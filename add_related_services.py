#!/usr/bin/env python3
"""Add Related Services sections to all service pages."""

import os
import re
from pathlib import Path

# City name mappings
CITY_NAMES = {
    'welland': 'Welland',
    'st-catharines': 'St. Catharines',
    'niagara-falls': 'Niagara Falls',
    'thorold': 'Thorold',
    'port-colborne': 'Port Colborne',
    'fort-erie': 'Fort Erie',
    'grimsby': 'Grimsby',
    'lincoln': 'Lincoln',
    'pelham': 'Pelham',
    'niagara-on-the-lake': 'Niagara-on-the-Lake',
    'beamsville': 'Beamsville',
    'fonthill': 'Fonthill',
    'wainfleet': 'Wainfleet',
    'west-lincoln': 'West Lincoln',
}

# Service definitions
SERVICES = {
    'car-lockout': ('🚗', 'Car Lockout', 'Locked out of your car?'),
    'house-lockout': ('🏠', 'House Lockout', 'Locked out of your home?'),
    'lock-change': ('🔒', 'Lock Change & Rekey', 'Upgrade your security'),
    'car-key-replacement': ('🔑', 'Car Key Replacement', 'Lost your car keys?'),
    'emergency-locksmith': ('🚨', '24/7 Emergency', 'Urgent locksmith help'),
}

def get_related_services_html(city, current_service):
    """Generate the Related Services section HTML."""
    city_name = CITY_NAMES.get(city, city.replace('-', ' ').title())
    
    links = []
    for service_key, (icon, title, desc) in SERVICES.items():
        if service_key == current_service:
            continue
        
        filename = f"{service_key}-{city}.html"
        if os.path.exists(filename):
            links.append(f'''
                <a href="{filename}" style="display:flex;align-items:center;gap:12px;padding:20px;background:#fff;border-radius:12px;text-decoration:none;color:#0f1419;box-shadow:0 2px 8px rgba(0,0,0,0.08);transition:transform 0.2s,box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 4px 12px rgba(0,0,0,0.12)'" onmouseout="this.style.transform='';this.style.boxShadow='0 2px 8px rgba(0,0,0,0.08)'">
                    <span style="font-size:28px;">{icon}</span>
                    <div><strong style="font-size:16px;">{title}</strong><br><small style="color:#6c757d;">{desc}</small></div>
                </a>''')
    
    if not links:
        return ''
    
    location_page = f"locksmith-{city}.html"
    location_link = f'<a href="{location_page}" style="color:#e63946;font-weight:600;text-decoration:none;">← View All {city_name} Locksmith Services</a>' if os.path.exists(location_page) else ''
    
    return f'''
    <!-- Related Services -->
    <section style="padding:60px 0;background:#f8f9fa;">
        <div style="max-width:1200px;margin:0 auto;padding:0 20px;">
            <h2 style="text-align:center;margin-bottom:32px;font-size:28px;color:#0f1419;">Other Locksmith Services in {city_name}</h2>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;">{"".join(links)}
            </div>
            <p style="text-align:center;margin-top:28px;">{location_link}</p>
        </div>
    </section>
'''

def process_file(filepath):
    """Add Related Services section to a file."""
    filename = os.path.basename(filepath)
    
    # Extract service and city from filename
    match = re.match(r'(car-lockout|house-lockout|lock-change|car-key-replacement|emergency-locksmith)-(.+)\.html', filename)
    if not match:
        return False
    
    service, city = match.groups()
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Skip if already has Related Services
    if 'Other Locksmith Services in' in content:
        print(f"  Skipping {filename} (already has Related Services)")
        return False
    
    # Generate the related services section
    related_html = get_related_services_html(city, service)
    if not related_html:
        print(f"  Skipping {filename} (no related services found)")
        return False
    
    # Insert before </main>
    if '</main>' in content:
        content = content.replace('</main>', related_html + '</main>')
    else:
        # Try inserting before <footer
        content = re.sub(r'(\s*<footer)', related_html + r'\1', content, count=1)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"  ✓ Added Related Services to {filename}")
    return True

def main():
    print("Adding Related Services sections...\n")
    
    count = 0
    patterns = [
        'car-lockout-*.html',
        'house-lockout-*.html',
        'lock-change-*.html',
        'car-key-replacement-*.html',
        'emergency-locksmith-*.html',
    ]
    
    for pattern in patterns:
        for filepath in Path('.').glob(pattern):
            if process_file(str(filepath)):
                count += 1
    
    print(f"\n✓ Added Related Services to {count} pages")

if __name__ == '__main__':
    main()

