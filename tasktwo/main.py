from datetime import date
import requests
barcode = 3017624010701

#3017624010701
# barcode = int(input("Barcode? "))
url = f"https://world.openfoodfacts.net/api/v2/product/{barcode}"
response = requests.get(url)
print(response.json())

data = response.json()

product_name = data.get("product", {}).get("product_name", "Product name not found")
product_name = data.get("product", {}).get("product_name", "Product name not found")

print(f"Product Name: {product_name}")


def main():
    print ("sdf")