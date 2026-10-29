from datetime import date
import requests
import os


def get_info(barcode):
    url = f"https://world.openfoodfacts.org/api/v2/product/{barcode}"
    headers = {"User-Agent": "MyBarcodeApp - 1.0 - colebk@pedarecc.sa.edu.au"}
    response = requests.get(url, headers=headers)
    data = response.json()
    product_name = data.get("product", {}).get("product_name", "Product name not found")
    ingredients = data.get("product", {}).get("ingredients_text_en", "Product name not found")
    nutriscore = data.get("product", {}).get("nutriscore_grade")
    status_check = data.get('status')
    repeatlist = ["sugars_100g", "sugars_serving", "proteins_100g",
                "proteins_serving", "carbohydrates_100g",
                "carbohydrates_serving", "energy-kj_100g", "energy_serving",
                "fat_100g", "fat_serving", "sodium_100g", "sodium_serving" ]
    nutri_info = {}
    for x in repeatlist:
        stat = data.get("product", {}).get("nutriments", {}).get(x, "N/A ")
        nutri_info[x] = stat
    
    product_info = {
        "name": product_name,
        "ingredients": ingredients,
        "nutrition_score": nutriscore,
        "status": status_check,
        "nutrition_info": nutri_info,
        "barcode": barcode
        }
    return product_info


#print(f"Product Name: {product_name}")
#print(f"Ingredients: {ingredients}")

#A menu system
def print_menu(name):
   print(f"""
--------------------------------
   Current product: {name}
--------------------------------
   1. View Product Information
   2. Enter your own barcode
   3. Exit
--------------------------------
   """)
   


def main():
    default_barcode = 3017624010701
    product_info = get_info(default_barcode)
    while True:
        name = product_info["name"]
        print_menu(name)
        choice = input("Enter your choice: ")
        if choice == "1":

            print(f"""
-----------------------------------------------------------------------------------------------------------
Product Name: {product_info["name"]}
Ingredients: {product_info["ingredients"]}

Sugar per 100g: {product_info['nutrition_info']["sugars_100g"]}g
Sugar per serving: {product_info['nutrition_info']["sugars_serving"]}g

Carbohydrates per 100g: {product_info['nutrition_info']["carbohydrates_100g"]}g
Carbohydrates per serving: {product_info['nutrition_info']["carbohydrates_serving"]}g

Energy in kj per 100g: {product_info['nutrition_info']["energy-kj_100g"]}kj
Energy in kj per serving: {product_info['nutrition_info']["energy_serving"]}kj

Fat per 100g: {product_info['nutrition_info']["fat_100g"]}g
Fat per serving: {product_info['nutrition_info']["fat_serving"]}g

Sodium per 100g: {product_info['nutrition_info']["sodium_100g"]}g
sodium per serving: {product_info['nutrition_info']["sodium_serving"]}g""")
            
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
            print("-----------------------------------------------------------------------------------------------------------")
        elif choice == "2":
            original_barcode = product_info["barcode"]
            barcode = input("Enter your own barcode ")
            product_info = get_info(barcode)
            if product_info["status"] != 1:
                barcode = original_barcode
                product_info = get_info(barcode)
                print("Invalid Barcode. Please try again.")


        elif choice == "3":
            break
        else:
            print("Invalid choice. Please try again.")


if __name__ == "__main__":
    print("\033[H\033[2J", end="")
    main()
