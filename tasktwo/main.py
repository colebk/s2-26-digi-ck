from datetime import date
import requests

def get_info(barcode):
    url = f"https://world.openfoodfacts.net/api/v2/product/{barcode}"
    response = requests.get(url)
    data = response.json()
    product_name = data.get("product", {}).get("product_name", "Product name not found")
    ingredients = data.get("product", {}).get("ingredients_text_en", "Product name not found")
    nutriscore = data.get("product", {}).get("nutriscore_grade")
    repeatlist = ["sugars_100g", "sugars_serving", "proteins_100g",
                "proteins_serving", "carbohydrates_100g",
                "carbohydrates_serving", "energy-kj_100g", "energy_serving",
                "fat_100g", "fat_serving", "sodium_100g", "sodium_serving" ]
    product_info = {}
    for x in repeatlist:
        nutri_info = data.get("product", {}).get("nutriments", {}).get(x, "N/A")
        product_info[x] = nutri_info
    status_check = data.get('status')
    
    product_info = {
        "name": product_name,
        "ingredients": ingredients,
        "nutrition_score": nutriscore,
        "status": status_check
        }
    return product_info


#print(f"Product Name: {product_name}")
#print(f"Ingredients: {ingredients}")

#A menu system
def print_menu():
   print("""
   1. View Product Information
   2. Enter your own barcode
   3. Exit""")
   


def main():
    default_barcode = 3017624010701
    product_info = get_info(default_barcode)
    while True:
        print_menu()
        choice = input("Enter your choice: ")
        if choice == "1":
            print(f"Product Name: {product_info["name"]}")
            print(f"Ingredients: {product_info["ingredients"]}")
            print(f"Sugar content per 100g: {product_info["sugar_100g"]}")
            print(f"Sugar content per serving: {product_info["sugar_serving"]}")
            if product_info["nutrition_score"] == "a":
                print("Nutri-Score A: Healthy choice!")
            elif product_info["nutrition_score"] == "b":
                print("Nutri-Score B: Good choice")
            elif product_info["nutrition_score"] == "c":
                print("Nutri-Score C: A choice")
            elif product_info["nutrition_score"] == "d":
                print("Nutri-Score D: Consume with care")
            elif product_info["nutrition_score"] == "e":
                print("Nutri-Score E: Consume in moderation")
            else:
                print("something went wrong")
        elif choice == "2":
            original_barcode = barcode
            barcode = input("Enter your own barcode ")
            product_info = get_info(barcode)
            if product_info["status"] != 1:
                barcode = original_barcode
                print("Invalid Barcode. Please try again.")


        elif choice == "3":
            break
        else:
            print("Invalid choice. Please try again.")


if __name__ == "__main__":
   main()
