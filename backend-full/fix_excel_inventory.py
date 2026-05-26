import openpyxl, csv, os, glob, re

files = glob.glob(os.path.expanduser("~/Downloads/*KFCL*Stock*.xlsx")) + glob.glob(os.path.expanduser("~/Downloads/*.xlsx"))

if not files:
    raise SystemExit("No Excel file found in Downloads. Put the KFCL Excel file in Downloads first.")

xlsx = files[0]
print("Using Excel file:", xlsx)

wb = openpyxl.load_workbook(xlsx, data_only=True)
ws = wb.active

rows = list(ws.iter_rows(values_only=True))

header_row_index = None
headers = []

for i, row in enumerate(rows[:30]):
    clean = [str(c).strip() if c is not None else "" for c in row]
    joined = " ".join(clean).lower()
    if "stock" in joined or "selling" in joined or "unit price" in joined or "qty" in joined:
        header_row_index = i
        headers = clean
        break

if header_row_index is None:
    raise SystemExit("Could not detect Excel headers.")

def norm(x):
    return re.sub(r'[^a-z0-9]', '', str(x).lower())

normalized = [norm(h) for h in headers]

def find_col(names):
    for n in names:
        n = norm(n)
        if n in normalized:
            return normalized.index(n)
    return None

name_i = find_col(["Product", "Product Name", "Name", "Item", "Description"])
category_i = find_col(["Category", "Type", "Product Category"])
stock_qty_i = find_col(["Stock Qty", "Stock Quantity", "Stock", "Available Stock"])
selling_price_i = find_col(["Selling Price", "SellingPrice", "Price", "Retail Price"])
qty_i = find_col(["Qty", "Quantity"])
unit_price_i = find_col(["Unit Price", "UnitPrice", "Cost", "Buying Price"])

if name_i is None:
    raise SystemExit("Product name column not found.")

def clean_num(v):
    if v is None:
        return 0
    s = re.sub(r'[^0-9.]', '', str(v))
    try:
        return float(s) if s else 0
    except:
        return 0

def category_from_name(name):
    n = name.lower()
    if any(x in n for x in ["seed", "maize", "bean", "sukuma", "spinach", "tomato", "onion"]):
        return "Seeds"
    if any(x in n for x in ["dap", "npk", "can", "urea", "fert", "foliar", "booster"]):
        return "Fertilizers"
    if any(x in n for x in ["herbicide", "pesticide", "insecticide", "fungicide", "acaricide", "max", "absolute", "actara"]):
        return "Pesticides"
    if any(x in n for x in ["sprayer", "tool", "pump", "pipe"]):
        return "Farm Tools"
    return "Agro-inputs"

out = "storage/app/kfcl_inventory_import.csv"

with open(out, "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["sku","name","category","stock_qty","selling_price","qty","unit_price","status"])

    count = 0
    total_stock = 0
    total_value = 0

    for row in rows[header_row_index+1:]:
        if not row or name_i >= len(row):
            continue

        name = str(row[name_i]).strip() if row[name_i] else ""
        if not name:
            continue

        category = str(row[category_i]).strip() if category_i is not None and category_i < len(row) and row[category_i] else category_from_name(name)

        stock_qty = int(clean_num(row[stock_qty_i])) if stock_qty_i is not None and stock_qty_i < len(row) else 0
        selling_price = clean_num(row[selling_price_i]) if selling_price_i is not None and selling_price_i < len(row) else 0
        qty = int(clean_num(row[qty_i])) if qty_i is not None and qty_i < len(row) else stock_qty
        unit_price = clean_num(row[unit_price_i]) if unit_price_i is not None and unit_price_i < len(row) else selling_price

        sku = "KFCL-" + str(count + 1).zfill(4) + "-" + re.sub(r'[^A-Z0-9]', '-', name.upper())[:30]
        status = "Low Stock" if stock_qty <= 10 else "In Stock"

        writer.writerow([sku, name, category, stock_qty, selling_price, qty, unit_price, status])

        count += 1
        total_stock += stock_qty
        total_value += selling_price * stock_qty

print("CSV created:", out)
print("Products:", count)
print("Total Stock Qty:", total_stock)
print("Stock Value:", total_value)
