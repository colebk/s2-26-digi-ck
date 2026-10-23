from datetime import date
import requests

def get_info(barcode):
    url = f"https://world.openfoodfacts.net/api/v2/product/{barcode}"
    response = requests.get(url)
    data = response.json()
    product_name = data.get("product", {}).get("product_name", "Product name not found")
    ingredients = data.get("product", {}).get("ingredients_text_en", "Product name not found")
    nutriscore = data.get("product", {}).get("nutriscore_grade")
    sugar = data.get("product", {}).get("nutrient", "Product name not found")
    product_info = {
        "name": product_name,
        "ingredients": ingredients,
        "nutrition_score": nutriscore,
        "sugar_content": sugar
        }
    return product_info


#print(f"Product Name: {product_name}")
#print(f"Ingredients: {ingredients}")

#A menu system
def print_menu():
   print("""
   1. View Product Information
   2. Enter your own barcode
   3. 
   final. Exit""")
   


def main():
    default_barcode = 3017624010701
    product_info = get_info(default_barcode)
    while True:
        print_menu()
        choice = input("Enter your choice: ")
        if choice == "1":
            print(f"Product Name: {product_info["name"]}")
            print(f"Ingredients: {product_info["ingredients"]}")
        elif choice == "2":
            barcode = input("Enter your own barcode ")
            product_info = get_info(barcode)
        elif choice == "final":
            break
        else:
            print("Invalid choice. Please try again.")


if __name__ == "__main__":
   main()
